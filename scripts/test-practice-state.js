const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function createState(initial = {}) {
  const store = new Map(Object.entries(initial).map(([key,value]) => [key,JSON.stringify(value)]));
  const sandbox = { localStorage:{
    getItem:key => store.get(key) ?? null,
    setItem:(key,value) => store.set(key,String(value)),
    removeItem:key => store.delete(key)
  } };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(require.resolve("../practice-state.js"), "utf8"), sandbox);
  return { api:sandbox.FullRidePracticeState, store };
}

const oldCard = { id:"stable-word-id", word:"adapt", translation:"пристосуватися", createdAt:10 };
const { api,store } = createState({ "fullride-flashcards-v1":[oldCard], "fullride-pack-learned-v1":["A2:adapt"] });
assert.equal(api.state.cards[0].id, oldCard.id, "legacy migration preserves stable card IDs");
assert.equal(api.state.learnedWords["A2:adapt"].learned, true, "legacy deck progress migrates");
api.removeCard(oldCard.id);
assert.equal(api.state.cards.length, 0, "delete removes the card immediately");
const staleRemote = [{ id:"stable-word-id", word:"adapt", translation:"adapt", createdAt:10 }];
api.mergeCloud(staleRemote, []);
assert.equal(api.state.cards.length, 0, "stale cloud copy cannot resurrect a deleted card");
assert.ok(api.cloudRecord().state.deletedCards[oldCard.id], "deletion tombstone is included in cloud record");
const persisted = JSON.parse(store.get("fullride-practice-state-v1"));
assert.equal(persisted.schemaVersion, 1, "canonical versioned state is persisted");
const restarted = createState({ "fullride-practice-state-v1":persisted });
assert.equal(restarted.api.state.cards.length, 0, "deleted state survives a fresh application start");
restarted.api.mergeCloud(staleRemote, []);
assert.equal(restarted.api.state.cards.length, 0, "reload plus cloud merge still cannot resurrect a deleted card");
restarted.api.clear();
assert.equal(restarted.api.state.cards.length, 0, "sign-out clears in-memory state");
assert.equal(restarted.store.has("fullride-practice-state-v1"), false, "sign-out removes the local account state");

const second = createState({ "fullride-flashcards-v1":[{ ...oldCard, id:"other-id", word:"adaptation" }] });
second.api.mergeCloud([api.cloudRecord()], []);
assert.deepEqual(Array.from(second.api.state.cards, card => card.id), ["other-id"], "remote tombstones merge without removing independent cards");
console.log("Practice state migration, deletion, cloud merge, and stable IDs passed.");
const resumed=createState();
resumed.api.state.sessions['B2:4']={index:7,updatedAt:20};
resumed.api.state.learnedWords['B2:adapt']={learned:false,updatedAt:20};
resumed.api.save();
resumed.api.mergeBackup({sessions:{'B2:4':{index:2,updatedAt:10}},learnedWords:{'B2:adapt':{learned:true,updatedAt:10}}});
assert.equal(resumed.api.state.sessions['B2:4'].index,7,'stale session position cannot overwrite a newer position');
assert.equal(resumed.api.state.learnedWords['B2:adapt'].learned,false,'stale learned state cannot overwrite a newer negative answer');
console.log('Session resume and newer negative answers survive stale backups.');
