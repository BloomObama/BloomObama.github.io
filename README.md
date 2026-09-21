# FullRide UA

## College directory data

The directory is generated from the [U.S. Department of Education College Scorecard](https://catalog.data.gov/dataset/college-scorecard) institution-level release dated May 19, 2025. It contains all 5,002 operating main campuses in that release: 1,793 bachelor's-predominant institutions in `college-catalog.js` and 3,209 additional institutions in `college-directory.js`.

Every record includes a generated institutional description plus the structured federal fields available for that institution. Profiles can show ownership, award level, campus setting, enrollment, admission rate or open-admission status, nonresident share, SAT/ACT, tuition, annual cost, net price, first-year retention, completion, Pell Grant and federal-loan shares, student/faculty ratio, median federal debt, median earnings after ten years, largest broad program areas and an official net-price calculator link. Missing or privacy-suppressed values remain empty rather than being guessed. College Scorecard combines measures from different reporting years, so these fields are never presented as current admissions-cycle rules.

Campus images in `college-media.js` are matched by exact IPEDS ID through [Wikidata property P1771](https://www.wikidata.org/wiki/Property:P1771), then checked through Wikimedia Commons metadata. Logos, seals, small files and unsuitable aspect ratios are excluded. Institutions without a reliable exact-ID image retain a clearly labelled illustrative photo.

Regenerate `college-catalog.js` from the downloaded CSV with `scripts/build-college-catalog.ps1`, generate the remaining records with `scripts/build-college-directory.ps1`, then regenerate exact-ID media with `node scripts/build-college-media.mjs college-catalog.js college-directory.js college-media.js`. Run `node scripts/validate-college-data.mjs` before publishing. `node scripts/check-reviewed-sources.mjs` performs a network reachability check for every source used by the editorially reviewed profiles.

Admissions policies, deadlines, test rules and international financial-aid claims are a separate editorial layer. Only records marked as verified have completed that official-site review; all others explicitly say that the information is not yet available.

An independent pilot resource for Ukrainian students researching need-based financial aid at U.S. universities.

The first release includes a multilingual College Finder with verified links to official university admissions and financial-aid pages. Requirements and deadlines change regularly, so applicants should always confirm details with the university before applying.

Live site: https://bloomobama.github.io/

## Account system

The account interface is integrated on the finder, comparison, university-profile, and practice pages. It supports Google sign-in, email/password accounts, email verification, password reset, profile names, and cloud sync for saved universities, comparisons, personal English flashcards, and deck progress. The public Firebase web configuration is present; the site owner must also enable the providers, authorize the site domain, and publish the current Firestore rules as described in [`AUTH_SETUP.md`](AUTH_SETUP.md). Never commit service-account credentials or mailbox passwords.

## English practice decks

The practice page offers six 500-word base decks (A1, A2, B1, B2, C1 and Native/C2) and three 500-word bridge decks. Sessions draw 20 random words from the chosen deck, favoring words not yet marked as learned. Learned progress is stored locally and synchronized with the user's Firebase profile when signed in. See [`VOCABULARY_SOURCES.md`](VOCABULARY_SOURCES.md) for source attribution, licensing, and regeneration instructions.
