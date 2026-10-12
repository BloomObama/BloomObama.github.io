# University data

## Sources

The base directory comes from the U.S. Department of Education College Scorecard institution-level release dated May 19, 2025. It contains 5,002 operating main campuses:

- `college-catalog.js` — 1,793 bachelor's-predominant institutions.
- `college-directory.js` — 3,209 additional institutions.

Campus images in `college-media.js` are matched by exact IPEDS ID through Wikidata property P1771 and Wikimedia Commons metadata. Admissions policies are a separate editorial layer in `data/policy-field-reviews.json`, backed by `data/policy-source-manifest.json` and official-source snapshots/audit metadata.

College Scorecard values are historical statistics, not current admissions promises. Missing or privacy-suppressed fields stay unknown; never replace unknown with zero, false or a guess.

## Record model

Every institution has a stable IPEDS `catalogId` and a unique public `slug`. Core fields include name, location, state/region, control, predominant award level, campus setting, enrollment and available Scorecard measures. Detailed facts, descriptions, photo metadata and reviewed admissions fields are stored outside the compact first-load index.

The five reviewed admissions-policy fields are:

1. international financial aid;
2. SAT/ACT policy;
3. English-language requirement;
4. application fee or waiver;
5. deadlines.

A profile is fully verified only when all five values have current official evidence. A working URL alone is not verification. Conflicts remain flagged and unknown fields remain unknown.

## Generated runtime files

Do not manually edit:

- `college-index.js` — compact 5,002-record finder index;
- `data/college-details/*.json` — 128 lazy-loaded detail shards;
- `universities/*.html` — search-engine pages for fully reviewed profiles;
- `sitemap.xml`.

Regenerate them with:

```text
npm run build:data
```

Then run:

```text
npm run validate:data
npm test
git diff -- college-index.js data/college-details universities sitemap.xml
```

The current validator rejects duplicate IPEDS IDs/slugs, unsafe or missing source URLs, invalid numeric ranges, invalid photo mappings and malformed policy evidence.

## Updating facts

1. Preserve the original source release and its date.
2. Update the source generator or source dataset, not a generated shard.
3. Rebuild runtime data.
4. Review record-count and coverage changes.
5. Run all validation and browser tests.
6. Never automatically rewrite real university facts from a search snippet or an unreviewed third-party directory.

For admissions policies, follow `POLICY_PIPELINE.md`. Only official institution-owned or other explicitly approved primary sources can move a field to verified. Save review date, evidence and source independently for each field.

## Current audited state

As of the launch baseline on October 13, 2026:

- 5,002 institutions;
- 0 duplicate slugs;
- 95 complete five-field profiles;
- 25 partial profiles;
- 566 individually verified admission fields;
- 1,457 exact-ID media records;
- 128 detail shards totaling about 7.57 MiB;
- compact search index about 1.35 MiB before HTTP compression.

The finder loads the compact index once. It renders at most ten cards initially and downloads only the detail shards needed for visible results. Shard promises are cached for the life of the page, preventing duplicate downloads.
