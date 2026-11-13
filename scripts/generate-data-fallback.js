const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const data = {};
for (const name of ['quiz', 'roadmaps', 'softskills']) data[name] = JSON.parse(fs.readFileSync(path.join(root, 'data', `${name}.json`), 'utf8'));
fs.writeFileSync(path.join(root, 'js', 'data-fallback.js'), `/* Generated from data/*.json by npm run sync-data-fallback. */\nwindow.CS_DATA = ${JSON.stringify(data)};\n`);
