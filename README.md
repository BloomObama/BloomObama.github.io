# FullRide UA

## College directory data

The directory is generated from the [U.S. Department of Education College Scorecard](https://catalog.data.gov/dataset/college-scorecard) institution-level release dated May 19, 2025. It contains all 5,002 operating main campuses in that release. The 1,793 institutions whose predominant award is a bachelor's degree include generated descriptions and structured facts. Descriptions summarize ownership, undergraduate enrollment, award level, campus setting, leading broad fields by degree share and applicable federal designations. Profile facts include the latest available federal enrollment, admission-rate, nonresident-share, tuition, cost, retention, completion and SAT fields when reported. These fields can represent different reporting years and are never presented as current admissions-cycle rules.

The remaining 3,209 institutions are stored as basic-only records in `college-directory.js`: official name, location, IPEDS ID, institutional website and award-level codes. Their profiles deliberately display “Information is not available yet” instead of generated admissions claims.

Campus images in `college-media.js` are matched by exact IPEDS ID through [Wikidata property P1771](https://www.wikidata.org/wiki/Property:P1771), then checked through Wikimedia Commons metadata. Logos, seals, small files and unsuitable aspect ratios are excluded. Institutions without a reliable exact-ID image retain a clearly labelled illustrative photo.

Regenerate `college-catalog.js` from the downloaded CSV with `scripts/build-college-catalog.ps1`, generate the remaining basic records with `scripts/build-college-directory.ps1`, then regenerate exact-ID media with `node scripts/build-college-media.mjs`. Run `node scripts/validate-college-data.mjs` before publishing. `node scripts/check-reviewed-sources.mjs` performs a network reachability check for every source used by the editorially reviewed profiles.

Admissions policies, deadlines, test rules and international financial-aid claims are a separate editorial layer. Only records marked as verified have completed that official-site review; all others explicitly say that the information is not yet available.

An independent pilot resource for Ukrainian students researching need-based financial aid at U.S. universities.

The first release includes a multilingual College Finder with verified links to official university admissions and financial-aid pages. Requirements and deadlines change regularly, so applicants should always confirm details with the university before applying.

Live site: https://bloomobama.github.io/
