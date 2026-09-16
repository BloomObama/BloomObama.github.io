import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const sandbox = { globalThis: {} };
vm.createContext(sandbox);
for (const file of ["college-catalog.js", "college-media.js"]) {
  vm.runInContext(fs.readFileSync(new URL(file, root), "utf8"), sandbox, { filename: file });
}
vm.runInContext(`${fs.readFileSync(new URL("data.js", root), "utf8")}\nglobalThis.__colleges = colleges;`, sandbox, { filename: "data.js" });

const catalog = sandbox.globalThis.FullRideBasicColleges || [];
const media = sandbox.globalThis.FullRideCollegeMedia || {};
const colleges = sandbox.globalThis.__colleges || [];
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const inRange = (value, min, max) => value == null || (Number.isFinite(value) && value >= min && value <= max);

assert(catalog.length === 1793, `Expected 1,793 current main bachelor's institutions, found ${catalog.length}`);
assert(colleges.length === catalog.length, `Merged directory has ${colleges.length} records for ${catalog.length} official records`);
assert(new Set(catalog.map(row => row[0])).size === catalog.length, "Duplicate IPEDS IDs in the generated catalog");
assert(new Set(colleges.map(college => college.slug)).size === colleges.length, "Duplicate public profile slugs");

const catalogIds = new Set(catalog.map(row => String(row[0])));
for (const college of colleges) {
  assert(catalogIds.has(String(college.catalogId)), `${college.name}: missing or unknown IPEDS ID`);
  assert(typeof college.description === "string" && college.description.trim().length >= 40, `${college.name}: incomplete description`);
  assert(/^https?:\/\//.test(college.source || ""), `${college.name}: invalid official/source URL`);
  assert(college.facts && typeof college.facts === "object", `${college.name}: missing College Scorecard facts object`);
  const facts = college.facts || {};
  assert(inRange(facts.admissionRate, 0, 1), `${college.name}: invalid admission rate`);
  assert(inRange(facts.nonresidentShare, 0, 1), `${college.name}: invalid nonresident share`);
  assert(inRange(facts.retentionRate, 0, 1), `${college.name}: invalid retention rate`);
  assert(inRange(facts.completionRate, 0, 1), `${college.name}: invalid completion rate`);
  assert(inRange(facts.satAverage, 400, 1600), `${college.name}: invalid SAT average`);
  assert(inRange(facts.enrollment, 0, 1_000_000), `${college.name}: invalid enrollment`);
}

for (const [id, image] of Object.entries(media)) {
  assert(catalogIds.has(id), `Image references unknown IPEDS ID ${id}`);
  assert(/^https:\/\//.test(image.photo || ""), `Image ${id}: invalid HTTPS URL`);
  assert(/^https:\/\/commons\.wikimedia\.org\//.test(image.photoSource || ""), `Image ${id}: missing Commons source page`);
  assert(typeof image.photoCredit === "string" && image.photoCredit.length > 4, `Image ${id}: missing credit`);
}

if (errors.length) {
  console.error(errors.slice(0, 50).join("\n"));
  if (errors.length > 50) console.error(`...and ${errors.length - 50} more`);
  process.exit(1);
}

console.log(JSON.stringify({
  institutions: colleges.length,
  exactIdPhotos: Object.keys(media).length,
  profilesWithRealPhotos: colleges.filter(college => !college.photoIsIllustrative).length,
  fullyReviewedAdmissionsPolicies: colleges.filter(college => college.verified).length,
  descriptionsMissing: colleges.filter(college => !college.description?.trim()).length,
  duplicateSlugs: colleges.length - new Set(colleges.map(college => college.slug)).size
}, null, 2));
