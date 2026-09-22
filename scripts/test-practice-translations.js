const assert = require("node:assert/strict");
const { performance } = require("node:perf_hooks");
require("../practice-packs.js");
require("../practice-translations.js");

const packs = globalThis.FullRidePracticePacks;
const translations = globalThis.FullRidePracticeTranslations;
const words = Object.values(packs).flat();
assert.equal(words.length, 3000);
assert.equal(translations.uk.school, "школа");
assert.equal(translations.uk.have, "мати");
assert.equal(translations.ru.sell, "продавать");
assert.ok(translations.en.sell.includes("exchange") || translations.en.sell.includes("money"));
for (const language of ["uk", "ru"]) {
  const count = words.filter(word => translations[language][word]).length;
  assert.ok(count >= (language === "uk" ? 2300 : 2800));
  const start = performance.now();
  for (let repeat = 0; repeat < 100; repeat += 1) {
    for (const word of words) void translations[language][word];
  }
  const elapsed = performance.now() - start;
  console.log(`${language}: ${count}/3000 local glosses; 300,000 in-memory lookups: ${elapsed.toFixed(1)} ms`);
}
assert.equal(words.filter(word => translations.en[word]).length, 3000);
