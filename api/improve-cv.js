const { extractJson } = require('./_cv-engine');
const { improve: fallback } = require('../js/cv-local-improve');
const hits = new Map();
const sections = new Set(['summary', 'experience', 'project']);
function limited(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (recent.length >= 8) return true; recent.push(now); hits.set(ip, recent); return false;
}
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const answer = (ok, source, result, warning) => ({ ok, source, result, ...(warning ? { warning } : {}) });
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json(answer(false, 'local', null, 'استخدم طلب POST.')); }
  if (limited(req)) return res.status(429).json(answer(false, 'local', null, 'طلبات كثيرة حالياً. أعد المحاولة لاحقاً.'));
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json(answer(false, 'local', null, 'نوع الطلب غير مدعوم.'));
  const body = req.body || {};
  if (Buffer.byteLength(JSON.stringify(body)) > 1024 * 1024) return res.status(413).json(answer(false, 'local', null, 'حجم الطلب أكبر من الحد المسموح.'));
  const { section, text, jobTitle = '', language = 'ar' } = body;
  if (!sections.has(section) || typeof text !== 'string' || !text.trim() || text.length > 3000 || typeof jobTitle !== 'string' || jobTitle.length > 160 || !['ar', 'en'].includes(language)) return res.status(400).json(answer(false, 'local', null, 'تحقق من بيانات النص ثم أعد المحاولة.'));
  const local = fallback(section, text, language); const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) return res.status(200).json(answer(true, 'local', local, 'اقتراحات محلية دون اتصال بخدمة AI.'));
  const models = [process.env.GEMINI_MODEL, process.env.GEMINI_FALLBACK_MODEL, 'gemini-2.5-flash'].filter((x, i, a) => x && a.indexOf(x) === i);
  const deadline = Date.now() + 20000;
  for (const model of models) {
    for (let attempt = 0; attempt < 3 && Date.now() < deadline; attempt++) {
      const controller = new AbortController(), timer = setTimeout(() => controller.abort(), Math.max(1, deadline - Date.now()));
      try {
        const prompt = `Improve this CV ${section} for ${jobTitle}. Language: ${language}. Preserve facts and numbers; never invent. Return the improved same field as plain text in JSON only: {"improved":"text"}. For experience and project, keep one bullet per line and use strong action verbs. Input: ${text}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } }), signal: controller.signal });
        if (!response.ok && response.status !== 429 && response.status < 500) break;
        if (!response.ok) { const seconds = Number(response.headers.get('retry-after')); const delay = Math.min(5000, seconds > 0 ? seconds * 1000 : 300 * (2 ** attempt) + Math.random() * 250); if (attempt < 2 && Date.now() + delay < deadline) { await new Promise(resolve => setTimeout(resolve, delay)); continue; } break; }
        const payload = await response.json(), parsed = extractJson(payload.candidates?.[0]?.content?.parts?.map(p => p.text || '').join(''));
        const improved = Array.isArray(parsed.improved) ? parsed.improved.filter(x => typeof x === 'string').join('\n') : parsed.improved;
        if (typeof improved === 'string' && improved.trim()) return res.status(200).json(answer(true, 'ai', improved.trim().slice(0, 3000)));
        break;
      } catch (_) { const delay = 300 * (2 ** attempt) + Math.random() * 250; if (attempt < 2 && Date.now() + delay < deadline) { await new Promise(resolve => setTimeout(resolve, delay)); continue; } }
      finally { clearTimeout(timer); }
    }
  }
  return res.status(200).json(answer(true, 'local', local, 'تعذر الاتصال بخدمة AI؛ عُرض تحسين محلي للنص.'));
};
