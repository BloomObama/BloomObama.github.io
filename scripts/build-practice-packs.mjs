import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sources = {
  cefrj:"https://raw.githubusercontent.com/vitwits/english-wordlist-cefr-a1-c2/main/cefrj-vocabulary-profile-1.5.csv",
  octanove:"https://raw.githubusercontent.com/vitwits/english-wordlist-cefr-a1-c2/main/octanove-vocabulary-profile-c1c2-1.0.csv",
  frequency:"https://raw.githubusercontent.com/amirj4m/openjam/main/data/json/words_en.json"
};

async function sourceText(name, localPath) {
  if (localPath) return readFile(localPath, "utf8");
  const response = await fetch(sources[name]);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  return response.text();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell); cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); cell = "";
      if (row.some(value => value)) rows.push(row);
      row = [];
    } else cell += character;
  }
  row.push(cell);
  if (row.some(value => value)) rows.push(row);
  const headers = rows.shift();
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

const [cefrjText, octanoveText, frequencyText] = await Promise.all([
  sourceText("cefrj", process.argv[2]),
  sourceText("octanove", process.argv[3]),
  sourceText("frequency", process.argv[4])
]);
const cefrj = parseCsv(cefrjText);
const octanove = parseCsv(octanoveText);
const frequency = new Map(JSON.parse(frequencyText).map(row => [row.english.toLowerCase(), row.frequency_rank]));
const used = new Set();
const packs = {};
const minimumFrequencyRank = { A1:0, A2:600, B1:1200, B2:3000, C1:10_000, C2:15_000 };

for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  const list = level === "C1" || level === "C2" ? octanove : cefrj;
  const candidates = [...new Set(list.filter(row => row.CEFR === level)
    .map(row => row.headword.toLowerCase().trim())
    .filter(word => /^[a-z]{3,}$/.test(word) && !used.has(word)))];
  candidates.sort((a, b) => {
    // Some everyday headwords appear at higher CEFR levels because of advanced
    // senses. Prefer vocabulary beyond a modest frequency cutoff at each level.
    const aSuitable = (frequency.get(a) ?? 0) >= minimumFrequencyRank[level];
    const bSuitable = (frequency.get(b) ?? 0) >= minimumFrequencyRank[level];
    if (aSuitable !== bSuitable) return aSuitable ? -1 : 1;
    return (frequency.get(a) ?? 1_000_000) - (frequency.get(b) ?? 1_000_000) || a.localeCompare(b);
  });
  if (candidates.length < 500) throw new Error(`${level}: only ${candidates.length} distinct words`);
  packs[level] = candidates.slice(0, 500);
  packs[level].forEach(word => used.add(word));
}

const output = `/* CEFR-J Vocabulary Profile 1.5 (Tono Laboratory, TUFS): A1-B2.\n * Octanove Vocabulary Profile 1.0 (CC BY-SA 4.0): C1-C2.\n * Frequency sorting uses Openjam (MIT). See VOCABULARY_SOURCES.md.\n */\nglobalThis.FullRidePracticePacks = ${JSON.stringify(packs)};\n`;
await writeFile(join(root, "practice-packs.js"), output, "utf8");
console.log(Object.fromEntries(Object.entries(packs).map(([level, words]) => [level, words.length])));
