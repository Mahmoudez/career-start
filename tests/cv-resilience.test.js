const assert = require('node:assert/strict');
const { analyze, normalize, extractJson } = require('../api/_cv-engine');
const { improve } = require('../js/cv-local-improve');
const good = 'Email: graduate@example.com\nSummary: junior developer\nSkills: JavaScript, SQL, Git\nExperience: Developed a dashboard and increased usage by 25%\nEducation: Bachelor\nProjects: portfolio';
const arabic = 'البريد: sara@example.com\nملخص: خريجة تصميم\nمهارات: Figma، أبحاث المستخدم\nخبرة: صممت واجهة وحسنت الاستخدام بنسبة 20٪\nتعليم: بكالوريوس\nمشاريع: تطبيق حجز';
for (const sample of [good, 'bad', '', arabic]) {
  const result = analyze(sample, sample === arabic ? 'UI-UX' : 'Programming');
  assert.equal(typeof result.score, 'number'); assert.ok(result.score >= 0 && result.score <= 10);
  for (const key of ['ats_score','field_fit','summary','strengths','weaknesses','missing_skills','improvements']) assert.ok(key in result);
}
assert.equal(extractJson('```json\n{"score":8}\n```').score, 8);
assert.throws(() => extractJson('not json'));
assert.equal(normalize({ score: 100 }).score, 10);
assert.equal(improve('', 'summary', 'ar'), '');
assert.match(improve('  صممت   واجهة واجهة  للمستخدمين  ', 'experience', 'ar'), /^صممت واجهة للمستخدمين$/);
assert.match(improve('  built   built dashboard   for users ', 'experience', 'en'), /^Built dashboard for users$/);
assert.equal(improve('   Led   team  \n\n  created created  app ', 'project', 'en'), 'Led team\nCreated app');
async function invoke(handler, ip) {
  const req = { method: 'POST', headers: {'content-type':'application/json'}, body: {field:'Programming',text:good}, socket: {remoteAddress:ip} };
  const res = { setHeader(){}, status(n){this.statusCode=n;return this}, json(data){this.data=data;return data} };
  await handler(req,res); assert.equal(res.statusCode,200); assert.equal(res.data.ok,true); assert.equal(res.data.source,'local'); assert.equal(typeof res.data.result.score,'number');
}
async function fallbackWhenProviderFails() {
  const handler = require('../api/analyze-cv'); const originalFetch = global.fetch, originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY; await invoke(handler,'no-key');
    process.env.GEMINI_API_KEY = 'invalid-test-key'; global.fetch = async () => ({ ok:false, status:403, headers:{get(){return null}} }); await invoke(handler,'wrong-key');
    global.fetch = async () => { const error = new Error('simulated timeout'); error.name = 'AbortError'; throw error; }; await invoke(handler,'timeout');
  } finally {
    global.fetch = originalFetch; if(originalKey===undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY=originalKey;
  }
}
fallbackWhenProviderFails().then(()=>console.log('CV resilience tests passed')).catch(error=>{console.error(error);process.exitCode=1;});
