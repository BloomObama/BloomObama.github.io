import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const sandbox = { globalThis: {} };
vm.createContext(sandbox);
for (const file of ["college-catalog.js", "college-directory.js", "college-media.js", "college-policies.js"]) {
  vm.runInContext(fs.readFileSync(new URL(file, root), "utf8"), sandbox, { filename: file });
}
vm.runInContext(`${fs.readFileSync(new URL("data.js", root), "utf8")}\nglobalThis.__colleges = colleges;`, sandbox, { filename: "data.js" });

const catalog = sandbox.globalThis.FullRideBasicColleges || [];
const extraDirectory = sandbox.globalThis.FullRideExtraColleges || [];
const media = sandbox.globalThis.FullRideCollegeMedia || {};
const policyAudits = sandbox.globalThis.FullRidePolicyAudits || {};
const colleges = sandbox.globalThis.__colleges || [];
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const inRange = (value, min, max) => value == null || (Number.isFinite(value) && value >= min && value <= max);

assert(catalog.length === 1793, `Expected 1,793 current main bachelor's institutions, found ${catalog.length}`);
assert(extraDirectory.length === 3209, `Expected 3,209 additional institutions, found ${extraDirectory.length}`);
assert(colleges.length === catalog.length + extraDirectory.length, `Merged directory has ${colleges.length} records for ${catalog.length + extraDirectory.length} official records`);
assert(new Set(catalog.map(row => row[0])).size === catalog.length, "Duplicate IPEDS IDs in the generated catalog");
assert(new Set(colleges.map(college => college.slug)).size === colleges.length, "Duplicate public profile slugs");

const catalogIds = new Set([...catalog, ...extraDirectory].map(row => String(row[0])));
for (const [id, audit] of Object.entries(policyAudits)) {
  assert(catalogIds.has(id), `Policy audit references unknown IPEDS ID ${id}`);
  assert(/^2026-\d{2}-\d{2}$/.test(audit.checkedAt || ""), `Policy audit ${id}: invalid checkedAt`);
  assert(audit.auditCycle === "2026–27", `Policy audit ${id}: wrong audit cycle`);
  for (const field of ["source", "aidSource", "testingSource", "englishSource", "feeSource", "deadlineSource"]) {
    assert(/^https:\/\//.test(audit[field] || ""), `Policy audit ${id}: invalid ${field}`);
  }
  for (const field of ["aid", "testing", "english", "fee", "deadline"]) {
    assert(typeof audit[field] === "string" && audit[field].trim().length >= 12, `Policy audit ${id}: incomplete ${field}`);
  }
  assert(typeof audit.aidShort === "string" && audit.aidShort.trim().length >= 6, `Policy audit ${id}: incomplete aidShort`);
}
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
  assert(inRange(facts.pellShare, 0, 1), `${college.name}: invalid Pell Grant share`);
  assert(inRange(facts.federalLoanShare, 0, 1), `${college.name}: invalid federal-loan share`);
  assert(inRange(facts.satAverage, 400, 1600), `${college.name}: invalid SAT average`);
  assert(inRange(facts.actMidpoint, 1, 36), `${college.name}: invalid ACT midpoint`);
  assert(inRange(facts.enrollment, 0, 1_000_000), `${college.name}: invalid enrollment`);
  assert(inRange(facts.studentFacultyRatio, 0, 1_000), `${college.name}: invalid student/faculty ratio`);
  assert(inRange(facts.latitude, -90, 90), `${college.name}: invalid latitude`);
  assert(inRange(facts.longitude, -180, 180), `${college.name}: invalid longitude`);
  for (const field of ["tuitionIn", "tuitionOut", "programTuition", "annualCost", "medianDebt", "medianEarnings10"]) {
    assert(inRange(facts[field], 0, 10_000_000), `${college.name}: invalid ${field}`);
  }
  for (const field of ["netPricePublic", "netPricePrivate"]) {
    assert(inRange(facts[field], -100_000, 10_000_000), `${college.name}: invalid ${field}`);
  }
  assert(facts.priceCalculator == null || typeof facts.priceCalculator === "string", `${college.name}: invalid net-price calculator URL`);
  assert(Array.isArray(facts.topFields), `${college.name}: missing top-fields list`);
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
  basicOnlyInstitutions: colleges.filter(college => college.basicOnly).length,
  exactIdPhotos: Object.keys(media).length,
  profilesWithRealPhotos: colleges.filter(college => !college.photoIsIllustrative).length,
  fullyReviewedAdmissionsPolicies: colleges.filter(college => college.verified).length,
  descriptionsPending: colleges.filter(college => college.descriptionPending).length,
  duplicateSlugs: colleges.length - new Set(colleges.map(college => college.slug)).size,
  fieldCoverage: Object.fromEntries(["enrollment", "admissionRate", "openAdmissions", "satAverage", "actMidpoint", "tuitionIn", "tuitionOut", "programTuition", "annualCost", "retentionRate", "completionRate", "pellShare", "federalLoanShare", "studentFacultyRatio", "medianDebt", "medianEarnings10", "priceCalculator", "topFields"].map(field => [field, colleges.filter(college => field === "topFields" ? college.facts?.topFields?.length : college.facts?.[field] != null).length]))
}, null, 2));
