/* Build local, instant-lookup translations from openly licensed dictionary sources.
 * Usage: node scripts/build-practice-translations.mjs <FreeDict eng-rus TEI> <dmklinger ukrainian words.json> <WikDict uk-en TSV> <Openjam words_en.json>
 * Sources and licenses are recorded in VOCABULARY_SOURCES.md.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const [teiPath, ukrainianPath, wikidictPath, openjamPath] = process.argv.slice(2);
if (!teiPath || !ukrainianPath || !wikidictPath || !openjamPath) throw new Error("Provide all four dictionary input paths.");
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packsSource = readFileSync(join(root, "practice-packs.js"), "utf8");
const packs = JSON.parse(packsSource.match(/FullRidePracticePacks = (\{.*\});/s)?.[1] || "{}");
const words = new Set(Object.values(packs).flat());
const russian = {};
const tei = readFileSync(teiPath, "utf8");
for (const match of tei.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const entry = match[1];
  const headword = entry.match(/<orth>([^<]+)<\/orth>/)?.[1]?.toLowerCase();
  if (!words.has(headword) || russian[headword]) continue;
  const raw = entry.match(/<cit type="trans" xml:lang="ru">[\s\S]*?<quote>([^<]+)<\/quote>/)?.[1];
  if (!raw) continue;
  const value = raw.normalize("NFC").replace(/[\u0300-\u036f]/g, "").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/&amp;/g, "&").trim();
  if (/[а-яё]/i.test(value) && value.length < 100) russian[headword] = value;
}

const ukrainianCandidates = new Map();
const ukrainianEntries = JSON.parse(readFileSync(ukrainianPath, "utf8"));
for (const entry of ukrainianEntries) {
  const value = String(entry.word || "").normalize("NFC").replace(/[\u0300-\u036f]/g, "").trim();
  if (!/^[а-яіїєґ'’ -]+$/i.test(value) || value.length > 55) continue;
  for (const definition of entry.defs || []) {
    const gloss = String(definition).toLowerCase().trim();
    const first = gloss.match(/^[a-z]+/)?.[0];
    if (!words.has(first) || !new RegExp(`^${first}(?:$|[ ,;(:])`).test(gloss)) continue;
    const exact = gloss === first;
    const near = gloss.startsWith(first + " (") || gloss.startsWith(first + ",");
    const frequency = Number(entry.freq) || 100000;
    const score = (exact ? 0 : near ? 1 : 2) * 1000000 + frequency + value.length * 2;
    const old = ukrainianCandidates.get(first);
    if (!old || score < old.score) ukrainianCandidates.set(first, { value, score });
  }
}
const ukrainian = Object.fromEntries([...ukrainianCandidates].map(([word, item]) => [word, item.value]));
for (const line of readFileSync(wikidictPath, "utf8").split(/\r?\n/)) {
  const [ukrainianWord, englishWord] = line.split("\t");
  const word = englishWord?.toLowerCase();
  if (!words.has(word) || !/^[а-яіїєґ'’ -]+$/i.test(ukrainianWord || "") || ukrainianWord.length > 55) continue;
  // Wikidata concept titles are often more precise than a reversed English gloss.
  if (!ukrainian[word] || ukrainianWord.split(" ").length === 1) ukrainian[word] = ukrainianWord.toLowerCase();
}
Object.assign(ukrainian, { have:"мати", just:"просто", right:"правильний", school:"школа", college:"коледж", scholarship:"стипендія", mean:"означати", saw:"пила", lead:"вести", short:"короткий", blue:"синій", use:"використовувати", location:"місце розташування", joint:"спільний", practical:"практичний", wing:"крило", welcome:"ласкаво просимо" });
Object.assign(russian, { college:"колледж", scholarship:"стипендия", lead:"вести", just:"просто", blue:"синий", mean:"означать", chase:"преследовать" });
const order = values => Object.fromEntries([...words].filter(word => values[word]).map(word => [word, values[word]]));
const definitions = {};
for (const entry of JSON.parse(readFileSync(openjamPath, "utf8"))) {
  if (!words.has(entry.english) || definitions[entry.english]) continue;
  const definition = String(entry.senses?.[0]?.definition_en || "").trim().slice(0,240);
  if (definition) definitions[entry.english] = definition;
}
const result = { ru:order(russian), uk:order(ukrainian), en:order(definitions) };
writeFileSync(join(root, "practice-translations.js"), "/* Offline word glosses; see VOCABULARY_SOURCES.md. */\nglobalThis.FullRidePracticeTranslations = " + JSON.stringify(result) + ";\n");
for (const [language, translations] of Object.entries(result)) console.log(`${language}: ${Object.keys(translations).length}/${words.size} local glosses`);
