import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];
const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith(".html"));
const required = ["manifest.webmanifest", "sw.js", "robots.txt", "sitemap.xml", "college-index.js", "college-data.js", "offline.html", "404.html"];

required.forEach(file => {
  if (!fs.existsSync(path.join(root,file))) failures.push(`Missing required file: ${file}`);
});

const legacyPattern = /(?:^|["/])(?:college-catalog|college-directory|college-media|college-policies|data)\.js/;
for (const file of ["index.html", "compare.html", "university.html"]) {
  const html = fs.readFileSync(path.join(root,file), "utf8");
  if (legacyPattern.test(html)) failures.push(`${file} still loads a legacy full-data bundle`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root,file), "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(match => match[1]);
  references.filter(reference => !/^(?:https?:|mailto:|data:|#)/.test(reference)).forEach(reference => {
    const target = path.resolve(root, reference.replace(/^\//,""));
    if (!target.startsWith(root) || !fs.existsSync(target)) failures.push(`${file} references missing asset: ${reference}`);
  });
  const unsafeBlank = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].filter(match => !/rel="[^"]*noopener/.test(match[0]));
  if (unsafeBlank.length) failures.push(`${file} has ${unsafeBlank.length} target=_blank link(s) without noopener`);
}

const indexBytes = fs.statSync(path.join(root,"college-index.js")).size;
if (indexBytes > 1_500_000) failures.push(`college-index.js exceeds the 1.5 MB performance budget (${indexBytes} bytes)`);

const shards = fs.readdirSync(path.join(root,"data","college-details")).filter(name => name.endsWith(".json"));
if (shards.length !== 128) failures.push(`Expected 128 college detail shards, found ${shards.length}`);

const sitemap = fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (!sitemapUrls.length || sitemapUrls.some(url => !url.startsWith("https://www.admitvector.com/"))) {
  failures.push("Sitemap must contain only canonical www.admitvector.com URLs");
}
const seoDirectory = path.join(root,"universities");
const seoFiles = fs.readdirSync(seoDirectory).filter(name => name.endsWith(".html"));
if (seoFiles.length < 2) failures.push("Verified university pages were not generated");
for (const file of seoFiles) {
  const url = file === "index.html" ? "https://www.admitvector.com/universities/" : "https://www.admitvector.com/universities/" + file.replace(/\.html$/, "");
  if (!sitemapUrls.includes(url)) failures.push("Sitemap omits " + url);
  const html = fs.readFileSync(path.join(seoDirectory,file),"utf8");
  if (!html.includes('<link rel="canonical" href="' + url + '">')) failures.push(file + " has an incorrect canonical URL");
  if (!html.includes('rel="icon" type="image/png" sizes="96x96" href="/favicon-av.png"')) failures.push(file + " is missing the site favicon");
  if (file !== "index.html" && (html.match(/class="seo-policy"/g) || []).length !== 5) failures.push(file + " must show five verified policy fields");
  for (const asset of ["seo-pages.css","preferences.js"]) {
    if (!html.includes("../" + asset)) failures.push(file + " is missing " + asset);
  }
}
if (sitemapUrls.length !== seoFiles.length + 5) failures.push("Sitemap contains unexpected or duplicate URLs");
if (!sitemapUrls.includes("https://www.admitvector.com/guide")) failures.push("Sitemap omits the admissions guide");
if (!sitemapUrls.includes("https://www.admitvector.com/sat-resources")) failures.push("Sitemap omits SAT resources");
const satPage = fs.readFileSync(path.join(root,"sat-resources.html"),"utf8");
if ((satPage.match(/data-sat-kind=/g) || []).length !== 12) failures.push("SAT library must contain 12 curated resources");
if (!satPage.includes("data-sat-key=\"rightsText\"")) failures.push("SAT library is missing the ownership note");
if ((satPage.match(/data-sat-step=/g)||[]).length!==4 || !satPage.includes('id="sat-progress-percent"')) failures.push("SAT route must expose four interactive panels and progress tracking");
for(const file of ['practice.html','ielts-resources.html','sat-resources.html'])if(fs.readFileSync(path.join(root,file),'utf8').includes('class="exam-switch"'))failures.push(`${file} still shows the redundant exam selector`);
if(!satPage.includes('score-chart.js'))failures.push('SAT score trend is missing');
if(!fs.readFileSync(path.join(root,'ielts-resources.html'),'utf8').includes('id="ielts-score-chart"'))failures.push('IELTS score trend is missing');
const favicon=fs.readFileSync(path.join(root,'favicon-av.png'));
if(favicon.toString('hex',0,8)!=='89504e470d0a1a0a'||favicon.readUInt32BE(16)!==96||favicon.readUInt32BE(20)!==96)failures.push('AdmitVector favicon must be a 96×96 PNG');
if(!fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="/favicon-av.png"'))failures.push('Home page must advertise the site favicon');

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`PASS: ${htmlFiles.length} pages, ${shards.length} detail shards, ${(indexBytes / 1024).toFixed(1)} KB search index`);
