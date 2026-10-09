import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const headers = read('_headers');
const globalRule = headers.split(/\r?\n\r?\n/)[0];
const csp = globalRule.match(/^  Content-Security-Policy: (.+)$/m)?.[1];
assert.ok(csp, 'Cloudflare Pages must publish a CSP');
for (const directive of ["script-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "upgrade-insecure-requests"]) {
  assert.ok(csp.includes(directive), `Missing CSP protection: ${directive}`);
}
assert.ok(csp.includes('https://static.cloudflareinsights.com'), 'Cloudflare-injected analytics must be compatible with the CSP');
assert.ok(!csp.includes("script-src 'unsafe-inline'"), 'Inline executable JavaScript must stay blocked');
assert.match(globalRule, /Strict-Transport-Security: max-age=\d+/);
assert.match(globalRule, /X-Frame-Options: DENY/);
assert.match(headers, /\/admin\.html\s+Cache-Control: no-store\s+X-Robots-Tag: noindex, nofollow/);

const rules = read('firestore.rules');
assert.match(rules, /request\.auth\.token\.email_verified == true/);
assert.match(rules, /allow list: if isSiteAdmin\(\)/);
assert.match(rules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/);
console.log('Security headers and Firestore rule invariants passed');
