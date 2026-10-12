# Security model

## Authentication

Firebase Authentication owns passwords and provider sessions. AdmitVector never receives a readable user password and never stores one in Firestore, analytics or local storage. Email/password signup requires at least eight characters in the UI; email verification is required before private Firestore access. Google sign-in uses Firebase popup authentication.

Account deletion requires recent reauthentication. It deletes the current user's three Firestore documents and then the Firebase Authentication user. It never enumerates or deletes another account.

## Authorization

`firestore.rules` is the security boundary. Client-side route hiding is only presentation.

- A verified user can read and change only documents whose ID equals the authenticated UID.
- Unverified and anonymous users cannot read private documents.
- Normal users cannot list user collections.
- The verified `admitvector@gmail.com` identity may list `memberSummaries` and `memberActivity` for the read-only dashboard.
- The admin cannot edit those documents through admin privileges.
- Unknown collections, nested documents and Firestore university records are denied.

The rules validate allowed keys, list limits, student-data shape, server timestamps and bounded activity increments.

## Browser security

Cloudflare `_headers` sets CSP, HSTS, frame denial, `nosniff`, a restrictive permissions policy and a referrer policy. Dynamic user text is written through text properties or escaped templates. External links use `noopener noreferrer`; untrusted return URLs are not followed.

Private browser state is isolated by Firebase UID during account switches. Guest data is separate. Exported settings JSON can contain private notes and should be treated as sensitive.

Google Analytics loads only after explicit consent. Client-error events contain only a generic error type and pathname; they never include error messages, stacks, email, UID, notes or query strings. The opt-in activity counter stores only cumulative focused seconds.

## Tests

```text
npm test
npm run test:security:rules
node scripts/serve-test.mjs
node scripts/test-security-browser.mjs
node scripts/test-settings.mjs
node scripts/test-auth-drawer.mjs
```

The browser commands expect the local server in another terminal. The GitHub Actions browser job lists the complete release regression set.

`test-firestore-emulator.mjs` must pass before publishing rule changes. `test-security-browser.mjs` checks CSP, malicious query values, stored profile/avatar payloads, malformed university IDs and external redirect attempts.

## Secrets

Firebase web configuration is public client configuration, not a private credential. Never commit:

- service-account JSON;
- `.env` files;
- Firebase refresh tokens;
- Cloudflare API tokens;
- private keys or certificates;
- real test passwords;
- production database exports.

If a secret is committed, removing the file in a later commit is insufficient: revoke/rotate the credential first, then clean history if required.

## Known limitations

- App Check client integration is not present. Do not enable enforcement blindly.
- Browser local storage is available to anyone with full access to that browser and to any successful same-origin script execution. CSP and account isolation reduce the risk, but exported or local private data is not encrypted by the app.
- Production cross-user destructive tests are intentionally not run. The complete authorization matrix is tested in Firebase Emulator; anonymous deny behavior is additionally probed against production.
- Managed Firestore backup and billing-alert state are console settings and cannot be established from this repository.

Report security problems privately to `admitvector@gmail.com`; do not include passwords or unnecessary personal data.
