import fs from "node:fs/promises";
import vm from "node:vm";

const catalogPath = process.argv[2] || new URL("../college-catalog.js", import.meta.url);
const directoryPath = process.argv[3] || new URL("../college-directory.js", import.meta.url);
const outputPath = process.argv[4] || new URL("../college-media.js", import.meta.url);
const sandbox = { globalThis: {} };
for (const inputPath of [catalogPath, directoryPath]) {
  vm.runInNewContext(await fs.readFile(inputPath, "utf8"), sandbox, { filename: String(inputPath) });
}
const records = [...(sandbox.globalThis.FullRideBasicColleges || []), ...(sandbox.globalThis.FullRideExtraColleges || [])];
const ids = [...new Set(records.map(record => String(record[0])))];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const batches = (values, size) => Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));
const unsuitableFile = filename => /(?:logo|seal|crest|emblem|wordmark|coat[ _-]?of[ _-]?arms|shield|icon|flag)/i.test(filename);

async function fetchJson(url, attempts = 8) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "FullRideUA/1.0 (college data audit; educational project)" } });
    if (response.ok) return response.json();
    if (attempt === attempts) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    const retryAfter = Number(response.headers.get("retry-after")) * 1000;
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : Math.min(attempt * 2500, 20000));
  }
}

const imageById = new Map();
for (const [index, batch] of batches(ids, 100).entries()) {
  const values = batch.map(id => `"${id}"`).join(" ");
  const query = `SELECT ?unitid ?item ?image WHERE { VALUES ?unitid { ${values} } ?item wdt:P1771 ?unitid; wdt:P18 ?image. }`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const json = await fetchJson(url);
  for (const binding of json.results.bindings) {
    const id = binding.unitid.value;
    const filename = decodeURIComponent(new URL(binding.image.value).pathname.split("/").pop()).replaceAll("_", " ");
    if (!imageById.has(id) && !unsuitableFile(filename)) imageById.set(id, { filename, item: binding.item.value });
  }
  process.stderr.write(`Wikidata ${index + 1}/${Math.ceil(ids.length / 100)}\r`);
  await sleep(250);
}

const titleEntries = [...imageById.entries()];
const metadataByTitle = new Map();
for (const [index, batch] of batches(titleEntries, 15).entries()) {
  const titles = batch.map(([, value]) => `File:${value.filename}`).join("|");
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1800&titles=${encodeURIComponent(titles)}`;
  const json = await fetchJson(url);
  for (const page of Object.values(json.query?.pages || {})) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    metadataByTitle.set(page.title.replace(/^File:/, ""), info);
  }
  process.stderr.write(`Commons ${index + 1}/${Math.ceil(titleEntries.length / 15)}\r`);
  await sleep(750);
}

const stripHtml = value => String(value || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const media = {};
for (const [id, value] of titleEntries) {
  const info = metadataByTitle.get(value.filename);
  if (!info || info.width < 800 || !/^image\/(?:jpeg|png|webp)$/i.test(info.mime || "")) continue;
  const aspect = info.width / Math.max(info.height, 1);
  if (aspect < 0.72 || aspect > 3.2) continue;
  const artist = stripHtml(info.extmetadata?.Artist?.value || info.extmetadata?.Credit?.value || "Wikimedia Commons contributor").slice(0, 100);
  const license = stripHtml(info.extmetadata?.LicenseShortName?.value || "license on source page").slice(0, 50);
  media[id] = {
    photo: info.thumburl || `${info.descriptionurl}?width=1800`,
    photoSource: info.descriptionurl,
    photoCredit: `${artist} · ${license}`,
    wikidata: value.item
  };
}

const header = `/*\n * Campus/institution images matched by exact IPEDS ID (Wikidata P1771).\n * Wikimedia Commons metadata is preserved through source links and credits.\n * Generated ${new Date().toISOString().slice(0, 10)}; images remain subject to their source licenses.\n */\n`;
await fs.writeFile(outputPath, `${header}globalThis.FullRideCollegeMedia = ${JSON.stringify(media)};\n`, "utf8");
console.log(`Generated ${Object.keys(media).length} exact-ID image records in ${outputPath}`);
