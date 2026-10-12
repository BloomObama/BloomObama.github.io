# Troubleshooting

## Login stopped working

1. Open a private window and reproduce the problem on `https://www.admitvector.com/`.
2. Confirm the page is HTTPS and the computer clock is correct.
3. Check Firebase Console → Authentication → Sign-in method. Google and email/password should be enabled only if intentionally supported.
4. Check Authentication → Settings → Authorized domains for `admitvector.com` and `www.admitvector.com`.
5. Check the browser console for a Firebase error code. Do not post tokens or passwords in an issue.
6. Confirm `firebase-config.js` still points to project `fullrideua`.

If Google popup is blocked, allow popups for AdmitVector and retry. Do not weaken CSP or add arbitrary domains as a workaround.

## Firestore says permission denied

- Confirm the user is signed in and email-verified.
- Confirm the requested document ID equals the Firebase UID.
- Run `npm run test:security:rules` with Java 21.
- Compare the deployed rules in Firebase Console with `firestore.rules`.
- Do not solve a legitimate bug by adding broad `allow read, write: if true` rules.

Admin list access additionally requires the verified token email `admitvector@gmail.com`. The admin page itself does not grant permissions.

## Cloudflare deployment failed

1. Open Cloudflare Pages → AdmitVector → Deployments → failed deployment → Build log.
2. Check the matching GitHub Actions run.
3. Reproduce with `npm run build:data` and `npm test` locally.
4. Confirm generated files are committed and `git diff --check` is clean.
5. If production is broken, roll back through the procedure in `DEPLOYMENT.md` before debugging further.

## Production is broken but deployment is green

1. Test the `pages.dev` deployment URL and the custom domain separately.
2. Hard-refresh or use a private window to avoid an old service-worker response.
3. Check Network for `404`, CSP blocks and stale versioned scripts.
4. Verify `_headers`, `_redirects`, DNS and the canonical `www` route.
5. Roll back to the last successful production deployment if the failure is user-visible.

Frontend rollback does not restore or delete Firestore data.

## Universities do not load

- Confirm `college-index.js` returns `200`.
- Search for a university; then confirm the required `data/college-details/<shard>.json` returns `200`.
- Run `npm run build:data`, `npm run validate:data` and `node scripts/test-catalog-runtime.mjs`.
- If only photos fail, the catalogue should still display its placeholder. Do not block university text on a third-party image.
- Never edit a generated shard by hand.

## User data appears missing

Wait for Firebase authentication initialization and the account sync indicator. Confirm the correct account is active. Reload once on a stable network. Account data is separated by UID; switching accounts intentionally clears the previous account's local view before loading the next account.

If cloud sync fails, do not clear browser storage. Export a settings backup if the UI still allows it. Check Firestore rules and the user's `users/{uid}` document before attempting repair.

## Costs or usage rise suddenly

1. Firebase Console → Firestore → Usage: compare reads and writes by day.
2. Google Cloud Console → Billing → Reports and Budgets & alerts.
3. Check whether active-time measurement adoption increased; it writes once per accumulated 30 focused seconds.
4. Check for repeated page reloads or a new code path repeatedly dispatching `fullride:local-data-changed`.
5. Verify there are still no realtime listeners.
6. On Spark, expect quota-related failures rather than an invoice. On Blaze, budget alerts are warnings and normally do not stop Firestore.

Do not delete user data or disable authentication as a first response. If necessary, disable the optional activity measurement in a tested frontend release.

## Analytics shows no data

Google Analytics loads only after the visitor chooses **Allow** in the consent panel. Test with consent granted, then check GA4 Realtime. Ad blockers can prevent requests. The site deliberately sends no email, UID, notes or error text.

Cloudflare Web Analytics is separate from GA4 and may show visits even when GA consent was declined.
