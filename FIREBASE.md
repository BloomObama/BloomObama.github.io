# Firebase operations

## Services in use

- Project ID: `fullrideua`.
- Firebase Authentication: Google and email/password accounts, email verification, password reset and reauthentication before account deletion.
- Cloud Firestore: private account state and the owner's read-only aggregate dashboard.
- Google Analytics: measurement ID is loaded only after explicit browser-local consent.

The university catalogue is **not** stored in Firestore. It is static data published through Cloudflare Pages.

## Firestore collections

| Collection | Contents | Read access | Write access |
|---|---|---|---|
| `users/{uid}` | name, shortlist, comparison, practice state and applicant planner data | verified owner only | verified owner only |
| `memberSummaries/{uid}` | email, display name and update time for the owner dashboard | verified owner or site admin | verified owner; admin is read-only |
| `memberActivity/{uid}` | opt-in focused seconds and update time | verified owner or site admin | verified owner; increments are bounded; admin is read-only |

Every other Firestore path is denied. The admin identity is the verified Firebase token email `admitvector@gmail.com`; hiding the admin page in the UI is not the security boundary.

Rules live in `firestore.rules`. Deploy them separately from the static site:

```text
npx firebase-tools@15.33.0 login
npx firebase-tools@15.33.0 deploy --only firestore:rules --project fullrideua
```

Before deployment, use Java 21 and run:

```text
npm run test:security:rules
```

The emulator test covers anonymous access, unverified users, owner CRUD, cross-user denial, list/query denial, admin reads, admin-write denial, field limits, nested paths and protected university paths.

## Expected usage

Guest browsing, search, comparison and university details make zero Firestore reads because the catalogue is static. For a verified account:

- first load of a page: normally one `users/{uid}` read;
- unchanged sync: zero `users/{uid}` writes;
- a saved change: one debounced profile write after 700 ms;
- member summary: at most one write per browser session unless the identity changes;
- optional active-time measurement: one write for each accumulated 30 seconds of focused time, with increments limited to 60 seconds by rules;
- admin refresh: one collection query for summaries and one for activity, billed by documents returned.

There are no realtime listeners. Profile forms save on submission or discrete changes, not every render.

## Capacity model

Conservative model: every DAU is signed in, opens 10 pages, makes two saved changes, and 20% opt into 10 minutes of active-time measurement.

| DAU/day | Reads/day | Writes/day | Notes |
|---:|---:|---:|---|
| 100 | about 1,000 | about 700 | comfortably below the free daily quota |
| 1,000 | about 10,000 | about 7,000 | below the current standard free daily quota |
| 10,000 | about 100,000 | about 70,000 | exceeds free reads and writes; Blaze would be required for uninterrupted operation |

If every signed-in user enables 10 minutes of active-time measurement, add about 20 writes per DAU. At 10,000 DAU that alone is about 200,000 writes/day. This metric is optional and should be disabled before removing product features if usage becomes unexpectedly expensive.

The standard Firestore free quota documented by Firebase is 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 1 GiB stored and 10 GiB/month outbound transfer. Actual paid prices depend on database location and can change; use the Google Cloud calculator before upgrading. Static university assets and images are Cloudflare/third-party traffic, not Firestore bandwidth.

## Billing protection

The repository cannot prove the live Firebase plan or budget configuration. The last manually observed console state was Spark, but this must be rechecked in Firebase Console before launch. Spark avoids a surprise pay-as-you-go bill but can reject operations when quota is exhausted.

If the project is upgraded to Blaze:

1. Open Google Cloud Console → Billing → Budgets & alerts.
2. Scope an alerts-only monthly budget to project `fullrideua`.
3. Use conservative thresholds such as 50%, 80%, 100% and forecast alerts.
4. Ensure both the owner and an actively monitored email receive alerts.

Ordinary budget alerts warn; they do not automatically stop Firestore. Google's spend-cap budgets currently apply only to selected services and must not be assumed to cap Firestore. Never disable billing automatically as a response without understanding the resulting outage.

## App Check

The frontend currently has no App Check client initialization. Console enforcement and metrics were not verifiable from the repository. Do not enable Firestore or Authentication enforcement until the web app is registered, the provider is integrated, production metrics show legitimate traffic receiving valid tokens, and rollback has been prepared.

## Backup and recovery

Repository data and generated university files are recoverable from Git. User-created Firestore data is not in Git.

Managed Firestore scheduled backups require the Blaze plan and have storage/restore costs. No managed backup schedule is represented in this repository, so its live status must be checked in Google Cloud Console. Until a verified schedule exists, users can export their own JSON backup from Settings, but that is not a complete owner-controlled disaster recovery system.

Before meaningful user volume, decide on retention, enable an appropriate daily or weekly Firestore backup schedule if billing permits, and perform a documented restore rehearsal into a separate database/project. Never test restore by overwriting production.

Official references: <https://firebase.google.com/docs/firestore/pricing>, <https://firebase.google.com/docs/firestore/backups>, and <https://firebase.google.com/docs/app-check/web/recaptcha-provider>.
