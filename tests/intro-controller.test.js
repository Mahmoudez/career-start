const assert = require('node:assert/strict');
const { shouldShowIntro, createExit } = require('../js/intro');
const values = new Map();
const storage = { getItem(key) { return values.get(key) ?? null; }, setItem(key, value) { values.set(key, value); } };

assert.equal(shouldShowIntro('', storage), true);
values.set('career-start-intro-seen', '1');
assert.equal(shouldShowIntro('', storage), false);
assert.equal(shouldShowIntro('?intro=1', storage), true);
assert.equal(shouldShowIntro('?x=1&intro=1&y=2', storage), true);
assert.equal(shouldShowIntro('', { getItem() { throw new Error('storage unavailable'); } }), true);
let exits = 0;
const skip = createExit(() => { exits += 1; });
assert.equal(skip(), true);
assert.equal(skip(), false);
assert.equal(exits, 1);
console.log('Intro controller tests passed');
