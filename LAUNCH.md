# Launch readiness

Audit date: October 13, 2026. Baseline commit: `e2f2753`.

## Release status

The release candidate is ready for public use with no known code-level launch blocker. The catalogue, account flows, planner, IELTS and SAT practice, profile pages, offline shell, analytics consent and owner dashboard passed the automated regression suite. Firestore authorization passed the full emulator matrix.

Two console-owned items remain operational checks rather than repository changes:

- confirm the current Firebase billing plan and budget-alert recipients before any upgrade to Blaze;
- decide on a managed Firestore backup schedule before storing irreplaceable user data at meaningful volume.

App Check is not integrated. Enforcement must remain off until the client provider is implemented and production token metrics have been observed. Safari/WebKit was not available in the Windows test environment; Chromium, Microsoft Edge and installed Firefox were exercised.

## What changed in the final pass

- Reduced the three decorative homepage Unsplash variants from about 1,187.5 KiB to about 340.9 KiB while keeping the same photos and composition: about 846.6 KiB, or 71%, less image transfer.
- Stopped unchanged account state from being written back to Firestore on every page navigation. Cross-device reads and debounced writes after real changes are preserved.
- Added consent-gated, privacy-minimal GA4 `client_error` events. Events include only a generic error kind and pathname; no message, stack, query, email or UID is sent.
- Updated generated SEO pages and cache versions together.
- Reconciled stale test expectations with the current versioned account key, 35-resource IELTS library and theme-aware navigation colours.
- Added the deployment, Firebase, security, data and troubleshooting runbooks linked from the README.

## Verified matrix

| Area | Result |
|---|---|
| Core/data unit and integrity suite | Pass |
| 5,002-record catalogue validation | Pass; 0 duplicate slugs |
| Full Chromium browser regression | Pass |
| Firestore Authentication + rules emulator | Pass |
| CSP and malicious-input browser checks | Pass |
| Responsive widths | Pass at 320, 375, 430, 768 and 1,440 px |
| Production routes and redirects | Pass |
| Microsoft Edge | Pass |
| Installed Firefox mobile smoke | Pass |
| Safari/WebKit | Not verified in this Windows environment |
| Live Firebase plan/budgets/backups/App Check console state | Not verified from repository |

The production route sweep covers the homepage, catalogue, university profile, comparison, planner, practice, IELTS, SAT, settings, guide, privacy and admin routes. It checks hard reloads, horizontal overflow, console exceptions and failed same-origin requests.

## Performance baseline

The repeatable mobile Lighthouse baseline on the public homepage before this release was:

- Performance score: 63
- First Contentful Paint: 4.2 s
- Largest Contentful Paint: 11.1 s
- Total Blocking Time: 97 ms
- Cumulative Layout Shift: 0.003
- Transfer: about 1,753 KiB across 48 requests

The dominant confirmed issue was the decorative hero imagery, addressed above. The catalogue itself keeps a compact 1.35 MiB raw index and lazy-loads 128 detail shards only as visible cards need them. Ten results render initially and each shard promise is cached for the page lifetime.

Lighthouse is environment-sensitive; compare multiple runs rather than treating a single score as a release gate. Functional regressions, missing data, console exceptions and layout overflow remain hard gates.

## Firebase capacity summary

Guest catalogue use makes no Firestore calls. A verified account normally reads its profile once per page and writes only after an actual saved change. Optional active-time measurement writes once per accumulated 30 focused seconds.

The detailed conservative model is in `FIREBASE.md`. At 1,000 signed-in daily users opening ten pages and making two saved changes, the model estimates about 10,000 reads and 7,000 writes per day. At 10,000 daily users, the model exceeds the standard free quota and requires a deliberate scaling/billing decision.

## Rollback and recovery

Cloudflare Pages production rollback is documented in `DEPLOYMENT.md`. A frontend rollback does not modify Firebase users or Firestore records. Durable source rollback must be a new revert commit on `main`, not a history rewrite.

Firestore user data is not recoverable from Git. Managed backup status is a launch-owner responsibility documented in `FIREBASE.md`; do not claim disaster recovery until a scheduled backup and a separate restore rehearsal have both been verified.

## Release freeze

After publication, treat the deployed commit as the release baseline. Until the first post-launch monitoring review, accept only confirmed security, availability, data-integrity or severe usability fixes. Run the same regression and rules checks before every hotfix, and use Cloudflare rollback first if a deployment creates a user-visible outage.
