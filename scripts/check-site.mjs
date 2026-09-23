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
    const target = path.resolve(root, reference);
    if (!target.startsWith(root) || !fs.existsSync(target)) failures.push(`${file} references missing asset: ${reference}`);
  });
  const unsafeBlank = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].filter(match => !/rel="[^"]*noopener/.test(match[0]));
  if (unsafeBlank.length) failures.push(`${file} has ${unsafeBlank.length} target=_blank link(s) without noopener`);
}

const indexBytes = fs.statSync(path.join(root,"college-index.js")).size;
if (indexBytes > 1_500_000) failures.push(`college-index.js exceeds the 1.5 MB performance budget (${indexBytes} bytes)`);

const shards = fs.readdirSync(path.join(root,"data","college-details")).filter(name => name.endsWith(".json"));
if (shards.length !== 128) failures.push(`Expected 128 college detail shards, found ${shards.length}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`PASS: ${htmlFiles.length} pages, ${shards.length} detail shards, ${(indexBytes / 1024).toFixed(1)} KB search index`);
