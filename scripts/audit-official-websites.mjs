import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const sandbox = { globalThis:{} };
vm.createContext(sandbox);
for (const file of ["college-catalog.js", "college-directory.js", "college-media.js", "college-policies.js"]) {
  vm.runInContext(fs.readFileSync(new URL(file, root), "utf8"), sandbox, { filename:file });
}
vm.runInContext(`${fs.readFileSync(new URL("data.js", root), "utf8")}\nglobalThis.__colleges=colleges;`, sandbox, { filename:"data.js" });

const colleges = sandbox.globalThis.__colleges || [];
const jobsByUrl = new Map();
for (const college of colleges) {
  if (!/^https:\/\//i.test(college.source || "")) continue;
  const url = college.source.trim();
  const job = jobsByUrl.get(url) || { url, institutions:[] };
  job.institutions.push({ catalogId:String(college.catalogId), slug:college.slug, name:college.name });
  jobsByUrl.set(url, job);
}

const queue = [...jobsByUrl.values()];
const results = [];
const accessRestricted = new Set([401,403,406,409,418,429,451]);
const userAgent = "FullRideUA official website link check/1.0 (directory-maintenance)";

async function check(job) {
  let method = "HEAD";
  try {
    let response = await fetch(job.url, { method, redirect:"follow", signal:AbortSignal.timeout(8000), headers:{ "User-Agent":userAgent } });
    if ([405,501].includes(response.status)) {
      await response.body?.cancel();
      method = "GET";
      response = await fetch(job.url, { method, redirect:"follow", signal:AbortSignal.timeout(8000), headers:{ "User-Agent":userAgent, Range:"bytes=0-0" } });
    }
    await response.body?.cancel();
    const status = response.status;
    let category = "http_error";
    if (response.ok) category = response.redirected ? "redirected_ok" : "reachable";
    else if (accessRestricted.has(status) || status === 405 || status === 501) category = "responding_but_restricted";
    else if (status === 404 || status === 410) category = "not_found";
    else if (status >= 500) category = "server_error";
    return { ...job, method, status, category, finalUrl:response.url, redirected:response.redirected };
  } catch (error) {
    return { ...job, method, status:null, category:"unreachable", detail:String(error?.cause?.code || error?.name || "request_failed") };
  }
}

async function worker() {
  while (queue.length) results.push(await check(queue.shift()));
}
const workers = Math.min(32, queue.length);
await Promise.all(Array.from({ length:workers }, worker));
results.sort((a,b) => a.url.localeCompare(b.url));

const counts = Object.fromEntries([...new Set(results.map(item => item.category))].sort().map(category => [category,results.filter(item => item.category === category).length]));
const report = {
  schemaVersion:1,
  auditedAt:new Date().toISOString(),
  checkType:"Official homepage HTTP availability only; not admissions-policy verification",
  institutionCount:colleges.length,
  institutionsWithOfficialHttpsSource:colleges.filter(college => /^https:\/\//i.test(college.source || "")).length,
  uniqueOfficialUrls:results.length,
  concurrency:workers,
  counts,
  results
};
fs.writeFileSync(new URL("data/official-website-check.json", root), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({
  auditedAt:report.auditedAt,
  institutionCount:report.institutionCount,
  institutionsWithOfficialHttpsSource:report.institutionsWithOfficialHttpsSource,
  uniqueOfficialUrls:report.uniqueOfficialUrls,
  counts,
  report:"data/official-website-check.json"
}, null, 2));
