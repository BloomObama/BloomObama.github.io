const assert = require("node:assert/strict");
const core = require("../practice-core");

assert.equal(core.sentenceUsesWord("The item was sold yesterday.", "sell"), true);
assert.equal(core.sentenceUsesWord("She reclined in the chair.", "recline"), true);
assert.equal(core.sentenceUsesWord("He sells books.", "sell"), true);
assert.equal(core.sentenceUsesWord("We sold it.", "sellout"), false);
assert.equal(core.sentenceUsesWord("They went home.", "go"), true);
assert.equal(core.sentenceUsesWord("This policy led to change.", "lead to"), true);
assert.equal(core.sentenceUsesWord("The child was singing yesterday.", "sing"), true);
assert.equal(core.sentenceUsesWord("The children were smiling.", "child"), true);
assert.equal(core.sentenceUsesWord("She wrote a letter.", "write"), true);
assert.equal(core.sentenceUsesWord("I am lying on the sofa.", "lie"), true);
assert.equal(core.sentenceUsesWord("The sales increased.", "sell"), false);
assert.deepEqual(core.parseWords("sell, recline; sell\nfoster"), ["sell", "recline", "foster"]);

const now = 1_700_000_000_000;
const first = core.scheduleReview(core.initialSrs(false, now), "good", now);
assert.equal(first.dueAt, now + core.DAY);
assert.equal(first.history.length, 1);
const forgotten = core.scheduleReview(first, "again", now + core.DAY);
assert.equal(forgotten.dueAt, now + core.DAY + 600_000);
assert.equal(forgotten.history.length, 2);
const easy = core.scheduleReview(first, "easy", now + core.DAY);
assert.ok(easy.dueAt > first.dueAt + core.DAY);

const cards = [
  { id:"new", createdAt:now, srs:core.initialSrs(false, now) },
  { id:"due", createdAt:now, srs:{...first, dueAt:now} },
  { id:"later", createdAt:now, srs:{...first, dueAt:now + core.DAY} }
];
assert.deepEqual(core.selectSession(cards, now).map(card => card.id), ["new", "due"]);
console.log("Practice core checks passed.");
