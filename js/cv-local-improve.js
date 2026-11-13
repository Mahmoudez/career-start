(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CvLocalTools = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const verbs = /^(?:led|built|created|designed|developed|improved|managed|increased|reduced|launched|implemented|analyzed|delivered)(?:\s|$)|^(?:ساهمت|قدت|بنيت|أنشأت|صممت|طورت|حسنت|أدرت|نفذت|حللت|قدمت)/i;
  function improve(text, section, language) {
    const lines = String(text || '').split(/\r?\n/).map(line => line.trim().replace(/^[-•*▪]+\s*/, '').replace(/\s+/g, ' ').replace(/\s+([,.،؛!?؟])/g, '$1').trim()).filter(Boolean);
    const cleanLine = line => {
      const seen = new Set();
      let out = line.split(/(\s+)/).filter((part, index, all) => {
        if (/^\s+$/.test(part)) return true;
        const key = part.toLocaleLowerCase();
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).join('').replace(/\s+/g, ' ').trim();
      if (language === 'en' && out) out = out[0].toLocaleUpperCase() + out.slice(1);
      if ((section === 'experience' || section === 'project') && out && !verbs.test(out)) out = language === 'en' ? `Delivered ${out[0].toLocaleLowerCase()}${out.slice(1)}` : `نفذت ${out}`;
      return out;
    };
    return (section === 'summary' ? [String(text || '').replace(/\s+/g, ' ').trim()] : lines).map(cleanLine).filter(Boolean).join('\n').slice(0, 3000);
  }
  const keywordMap = { Programming:['javascript','typescript','python','java','sql','html','css','react','api','github','برمجة','تطوير'], 'UI-UX':['figma','wireframe','prototype','usability','user research','ux','ui','تصميم','واجهة','مستخدم'], 'Graphic Design':['photoshop','illustrator','branding','typography','indesign','تصميم','هوية','ألوان','خطوط'] };
  function analyze(text, field) {
    const source=String(text||'').slice(0,12000), lower=source.toLowerCase(), checks=[
      ['معلومات التواصل واضحة (بريد أو هاتف).',/@|\+?\d[\d\s()-]{7,}/.test(source)],['ملخص مهني يعرّف بهدفك وخبرتك.',/summary|profile|about me|ملخص|نبذة/i.test(source)],['قسم مهارات يسهل على مسؤول التوظيف العثور عليه.',/skills|مهارات/i.test(source)],['خبرة أو تدريب موضحان بأفعال مباشرة.',/experience|employment|خبرة|تدريب/i.test(source)&&/\b(led|built|created|designed|developed|improved|managed|قمت|طورت|أنشأت|صممت|أدرت|حسنت|نفذت)\b/i.test(source)],['تعليم أو مؤهل أكاديمي مذكور.',/education|university|bachelor|تعليم|جامعة|بكالوريوس/i.test(source)],['مشروع واحد على الأقل موضح.',/projects|project|مشروع/i.test(source)],['إنجازات مدعومة بنتائج قابلة للقياس.',/\d+\s*%|\d+\s*(users|clients|مشروع|مستخدم|٪)|increased|reduced|زادت|خفضت/i.test(source)],['تنسيق بسيط قابل للقراءة آلياً.',!/<table|\[image\]/i.test(source)],['استخدم كلمات مرتبطة بالمجال المستهدف.',(keywordMap[field]||keywordMap.Programming).some(word=>lower.includes(word))],['تجنب الكلمات المكررة.',!/(\b[\p{L}]{3,}\b)(?:\s+\1){2,}/iu.test(source)]];
    const points=checks.filter(([,ok])=>ok).length, score=Math.min(10,points+(source.trim().split(/\s+/).length>=80?0.5:0));
    return {score,ats_score:points,field_fit:Math.min(10,(keywordMap[field]||[]).filter(w=>lower.includes(w)).length*2),summary:`تقييم مبدئي: تحققت ${points} من ${checks.length} مؤشرات أساسية.`,strengths:checks.filter(([,ok])=>ok).map(([label])=>label),weaknesses:checks.filter(([,ok])=>!ok).map(([label])=>label),missing_skills:(keywordMap[field]||[]).filter(w=>!lower.includes(w)).slice(0,5),improvements:checks.filter(([,ok])=>!ok).slice(0,6).map(([label])=>`راجع هذه النقطة: ${label}`)};
  }
  return { improve, analyze };
});
