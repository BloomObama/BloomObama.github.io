# Deployment and rollback

## Current production path

- Repository: `BloomObama/BloomObama.github.io`.
- Production branch: `main`.
- Hosting: Cloudflare Pages.
- Canonical URL: `https://www.admitvector.com/`.
- The apex domain redirects to `www`; HTTP redirects to HTTPS.
- Cloudflare publishes the repository root. There is no `dist` folder and no server-side runtime.

Pushing to `main` starts a Cloudflare Pages production deployment. GitHub Actions separately runs the validation and browser-smoke workflows in `.github/workflows/quality.yml`. A green Cloudflare build does not replace the GitHub tests; check both.

## Before deploying

Use Node.js 22 or newer and a clean working tree.

```text
npm install
npm run build:data
npm test
git diff --check
git status --short
```

For a release candidate, also run the browser suite with `node scripts/serve-test.mjs` running in another terminal, then run the scripts listed in `.github/workflows/quality.yml`. Run `npm run test:security:rules` with Java 21 before any change to `firestore.rules`.

Generated files must be committed together with their source changes:

- `college-index.js`
- `data/college-details/*.json`
- `universities/*.html`
- `sitemap.xml`

## Environment and secrets

The current frontend does not require Cloudflare environment variables. `firebase-config.js` contains Firebase's public web identifiers; those are not service-account secrets. Never add `.env`, service-account JSON, private keys, Cloudflare API tokens, mailbox passwords or Firebase CLI credentials to the repository.

Cloudflare behavior is defined by:

- `_headers` — CSP, HSTS, frame denial, cache policy and admin no-index/no-store.
- `_redirects` — Pages-relative redirects only. The apex-to-`www` redirect is managed outside the repository.
- `sw.js` — small offline core and network-first executable assets.

## Publish

1. Commit the reviewed release candidate.
2. Push the current commit to `main`.
3. Open Cloudflare Dashboard → Workers & Pages → the AdmitVector Pages project → Deployments.
4. Wait for the `main` production deployment to report success.
5. Check `https://www.admitvector.com/`, `/planner`, `/practice`, `/settings`, `/university?id=harvard`, `/robots.txt` and `/sitemap.xml` in a private browser window.
6. Hard-refresh once and check the browser console for errors.

Verify that the deployed source contains the expected cache versions. A successful Git push alone is not proof that Cloudflare finished publishing.

## Rollback

Cloudflare Pages keeps successful production deployments. To restore one:

1. Open Cloudflare Dashboard → Workers & Pages → AdmitVector → Deployments.
2. In **All deployments**, find the last known-good successful production deployment.
3. Open its three-dot menu.
4. Choose **Rollback to this deployment** and confirm.
5. Recheck the canonical domain and the core routes above.

Only successful production deployments can be rollback targets; preview deployments cannot. Cloudflare changes the served frontend immediately. This does **not** delete, migrate or roll back Firebase Authentication users or Firestore documents.

For a durable source rollback, create a new Git commit that reverts the faulty commit and push that new commit to `main`. Do not rewrite `main` history and do not use a destructive reset.

## Backward compatibility

Firestore records use optional, versioned envelopes. The current rules accept the existing `users`, `memberSummaries` and `memberActivity` shapes. A frontend rollback must be tested against the current rules before publishing; never roll back `firestore.rules` merely because the frontend was rolled back. Frontend deployments and Firebase data are independent.

## Production checks

- Canonical homepage returns `200`.
- `http://admitvector.com/` and `https://admitvector.com/` end at `https://www.admitvector.com/`.
- Clean routes such as `/guide`, `/settings`, `/planner` and `/university?id=harvard` return `200`.
- Unknown paths return the custom `404` page.
- Responses contain CSP, HSTS, `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.
- `/admin` has `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.

Official Cloudflare rollback reference: <https://developers.cloudflare.com/pages/configuration/rollbacks/>.
