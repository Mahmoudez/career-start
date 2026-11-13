const KEYWORDS = {
  Programming: ['javascript', 'typescript', 'python', 'java', 'sql', 'html', 'css', 'react', 'api', 'github', 'برمجة', 'تطوير'],
  'UI-UX': ['figma', 'wireframe', 'prototype', 'usability', 'user research', 'ux', 'ui', 'تصميم', 'واجهة', 'مستخدم'],
  'Graphic Design': ['photoshop', 'illustrator', 'branding', 'typography', 'indesign', 'تصميم', 'هوية', 'ألوان', 'خطوط']
};
const actionWords = /\b(led|built|created|designed|developed|improved|managed|increased|reduced|launched|implemented|analyzed|قمت|طورت|أنشأت|صممت|أدرت|حسنت|زادت|خفضت|نفذت|حللت)\b/i;
function clamp(n) { return Math.max(0, Math.min(10, Math.round(n * 10) / 10)); }
function analyze(text, field = 'Programming') {
  const source = String(text || '').slice(0, 12000);
  const lower = source.toLowerCase();
  const checks = [
    ['معلومات التواصل واضحة (بريد أو هاتف).', /@|\+?\d[\d\s()-]{7,}/.test(source)],
    ['ملخص مهني يعرّف بهدفك وخبرتك.', /summary|profile|about me|ملخص|نبذة/i.test(source)],
    ['قسم مهارات يسهل على مسؤول التوظيف العثور عليه.', /skills|مهارات/i.test(source)],
    ['خبرة أو تدريب موضحان بأفعال مباشرة.', /experience|employment|خبرة|تدريب/i.test(source) && actionWords.test(source)],
    ['تعليم أو مؤهل أكاديمي مذكور.', /education|university|bachelor|تعليم|جامعة|بكالوريوس/i.test(source)],
    ['مشروع واحد على الأقل موضح.', /projects|project|مشروع/i.test(source)],
    ['إنجازات مدعومة بنتائج قابلة للقياس.', /\d+\s*%|\d+\s*(users|clients|مشروع|مستخدم|٪)|increased|reduced|زادت|خفضت/i.test(source)],
    ['تنسيق بسيط قابل للقراءة آلياً.', !/\|{2,}|[�□]|<table|\[image\]|\b(?:img|photo)\b/i.test(source)],
    ['استخدم كلمات مرتبطة بالمجال المستهدف.', (KEYWORDS[field] || KEYWORDS.Programming).some(word => lower.includes(word))],
    ['تجنب الكلمات المكررة أو العناوين المكتوبة كلها بأحرف كبيرة.', !/(\b[\p{L}]{3,}\b)(?:\s+\1){2,}/iu.test(source) && !/\b[A-Z]{8,}\b/.test(source)]
  ];
  const points = checks.filter(([, ok]) => ok).length;
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const score = clamp(points + (words >= 80 && words <= 900 ? 0.5 : 0));
  const strengths = checks.filter(([, ok]) => ok).map(([label]) => label);
  const weaknesses = checks.filter(([, ok]) => !ok).map(([label]) => label);
  const tips = weaknesses.map(item => `راجع هذه النقطة: ${item}`);
  if (words < 80) tips.unshift('أضف تفاصيل كافية عن التعليم والمشاريع والخبرات؛ النص الحالي قصير للتقييم الكامل.');
  if (words > 900) tips.unshift('اختصر السيرة إلى المعلومات الأكثر ارتباطاً بالوظيفة، مع الحفاظ على النتائج المهمة.');
  const fieldName = field === 'UI-UX' ? 'تصميم UI/UX' : field === 'Graphic Design' ? 'التصميم الجرافيكي' : 'البرمجة';
  return {
    score, ats_score: clamp(points), field_fit: clamp((KEYWORDS[field] || []).filter(word => lower.includes(word)).length * 2),
    summary: `تقييم مبدئي للسيرة المستهدفة في ${fieldName}: تحققت ${points} من ${checks.length} مؤشرات أساسية. استخدم الملاحظات لتحسين الوضوح وإبراز الأدلة.`,
    strengths: strengths.length ? strengths : ['يمكن تطوير السيرة بإضافة معلومات التواصل والتعليم والمشاريع.'],
    weaknesses: weaknesses.length ? weaknesses : ['لم تظهر فجوات أساسية في الفحوصات النصية الأولية.'],
    missing_skills: (KEYWORDS[field] || []).filter(word => !lower.includes(word)).slice(0, 5),
    improvements: tips.slice(0, 6)
  };
}
function normalize(value) {
  const fallback = analyze('');
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  const list = (key) => Array.isArray(value[key]) ? value[key].filter(x => typeof x === 'string').slice(0, 8).map(x => x.slice(0, 300)) : fallback[key];
  const number = key => Number.isFinite(value[key]) ? clamp(value[key]) : fallback[key];
  return { score: number('score'), ats_score: number('ats_score'), field_fit: number('field_fit'), summary: typeof value.summary === 'string' ? value.summary.slice(0, 1000) : fallback.summary, strengths: list('strengths'), weaknesses: list('weaknesses'), missing_skills: list('missing_skills'), improvements: list('improvements') };
}
function extractJson(raw) {
  const value = String(raw || '').replace(/```(?:json)?/gi, '').trim();
  const start = value.indexOf('{');
  if (start < 0) throw new Error('invalid model JSON');
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < value.length; i++) {
    const c = value[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; }
    else if (c === '"') quoted = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return JSON.parse(value.slice(start, i + 1));
  }
  throw new Error('incomplete model JSON');
}
module.exports = { analyze, normalize, extractJson };
