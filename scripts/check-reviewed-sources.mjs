import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const sandbox = { globalThis: {} };
vm.createContext(sandbox);
for (const file of ["college-catalog.js", "college-directory.js", "college-media.js"]) vm.runInContext(fs.readFileSync(new URL(file, root), "utf8"), sandbox);
vm.runInContext(`${fs.readFileSync(new URL("data.js", root), "utf8")}\nglobalThis.__colleges = colleges;`, sandbox);
vm.runInContext(`${fs.readFileSync(new URL("profiles.js", root), "utf8")}\nglobalThis.__profiles = collegeProfiles;`, sandbox);

const reviewed = sandbox.globalThis.__colleges.filter(college => college.verified);
const profiles = sandbox.globalThis.__profiles;
const urls = new Set();
for (const college of reviewed) {
  for (const key of ["source", "aidSource", "testingSource", "englishSource", "feeSource", "deadlineSource", "photoSource"]) {
    if (/^https?:\/\//.test(college[key] || "")) urls.add(college[key]);
  }
  const profile = profiles[college.slug];
  if (/^https?:\/\//.test(profile?.statsSource || "")) urls.add(profile.statsSource);
}

const queue = [...urls];
const results = [];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(url, { redirect:"follow", signal:AbortSignal.timeout(20000), headers:{ "User-Agent":"Mozilla/5.0 FullRideUA source audit" } });
      const accessControlled = [401, 403, 405, 406, 409, 418, 429, 451].includes(response.status);
      results.push({ url, status:response.status, ok:response.status < 400 || accessControlled });
      await response.body?.cancel();
    } catch (error) {
      results.push({ url, status:"network-error", ok:false, detail:error.message });
    }
  }
}
await Promise.all(Array.from({ length:6 }, worker));

const failures = results.filter(result => !result.ok);
const statusCounts = Object.fromEntries(Object.entries(results.reduce((counts, result) => ({ ...counts, [result.status]:(counts[result.status] || 0) + 1 }), {})).sort(([left],[right]) => String(left).localeCompare(String(right))));
console.log(JSON.stringify({ reviewedProfiles:reviewed.length, uniqueOfficialSources:results.length, reachableOrAccessControlled:results.length - failures.length, statusCounts, failures }, null, 2));
if (failures.length) process.exitCode = 1;
