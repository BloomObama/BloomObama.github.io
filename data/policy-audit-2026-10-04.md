# Admissions policy audit — October 4, 2026 (Kyiv)

Scope: international first-year undergraduate admission. Each policy is attached to the exact IPEDS institution ID, an official page, a short quotation and a captured-text SHA-256 hash. Snapshot timestamps are UTC, so sources collected on the evening of October 3 UTC have `checkedAt: 2026-10-03`. The editorial cycle label does not assign an entry year to an undated source.

## Batch 01

- Knox (146427): completed English and deadline reviews. Includes the new TOEFL scale, explicit waiver conditions, distinct ED/EA rounds and space-available admission.
- Lawrence (239017): completed aid, English, fee and deadline reviews. Partial aid is not a full scholarship; the institution's financial form is due within five days. Conservatory rounds/auditions require their own instructions.
- Earlham (150455): added English review, distinguishing admission test-optional status from I-20 proficiency evidence. TOEFL thresholds are still stated on the old scale, with a warning to confirm newer tests. Deadline review remains a conflict: the international page differs from the general page labelled 2027–28. No entry-year schedule was invented. A news ranking mentioning no application fee is not an admissions-policy source and was not approved.

Coverage after batch 01: **60 complete profiles, 10 partial profiles, 321 verified fields out of 25,010**, across 5,002 institutions. This is admissions-policy coverage, not certification of all historical federal statistics. Source quotations and hashes are in `data/policy-review-batches/2026-10-04-01.json`; raw snapshots remain unpublished.

## Batch 02

- Soka (399911): five sourced undergraduate fields. IELTS is not accepted, SAT/ACT are optional, the application fee is $30 with recognised waivers, and financial-aid deadlines are separate from admission. Graduate instructions were excluded.
- Curtis (211893): five sourced fields for undergraduate study. Full tuition is not full living-cost coverage; admission requires musical audition, and English scores are used after acceptance for degree placement. Application/audition fees and fee-waiver timing are separate. The application page and official FAQ were reviewed together.
- Bard (189088): added aid with round-dependent guarantees, living-cost limits and the separate Davis UWC exception. Its admissions and aid schedules are internally inconsistent, so deadlines remain a conflict.
- DePauw (150400): English and admission deadlines approved with document deadlines distinguished. International full-need eligibility/forms remain a conflict between the Promise page and international instructions; no universal guarantee or CSS eligibility was assumed.
- Gettysburg (212674): English guidance and limited aid approved. Competitive English scores are not application cutoffs. The existing ED II conflict now also includes the different dates stated for financial forms.

Coverage after batch 02: **62 complete profiles, 10 partial profiles, 336 verified fields**, across 72 institutions. Added 15 verified fields and retained three unresolved policy conflicts. Proposal: `data/policy-review-batches/2026-10-04-02.json`.

## Batch 03

- Principia (148016): four fields approved. International fee instructions override generic free-application advertising; the Fall 2027 first-year deadline is not the spring transfer deadline. International merit aid is not institutional need-based support. SAT/ACT remain a conflict between the international website and current catalog.
- Illinois Wesleyan (145646): four fields approved. Its $30,000 required contribution means admission is not universally need-blind; no full-ride claim is allowed. CSS preferred filing date and admission deadline are distinct. English waiver duration differs (at least three years vs more than three years), so that field remains a conflict despite published exam thresholds.
- St. Lawrence (195216): four fields approved; fee remains pending. General competitive aid is separate from UWC and Kenya scholarships. Kenya instructions mention discontinued tests and need direct confirmation. The consumer admissions policy was readable in official-page web results but direct collection returned 403; no fresh capture was invented. It restricts ED for aid-seeking non-Canadian international applicants, so the deadline field warns about round eligibility.
- Wooster (206589): four fields approved; application fee remains pending, not confused with the free financial form. Test flexibility requires evidence/waiver and has a Pre-Dental SAT/ACT exception. No full-ride international awards; family contribution guidance and living costs are explicit. Admission dates are labelled Fall/Spring 2027.

Coverage after batch 03: **62 complete profiles, 14 partial profiles, 352 verified fields**, across 76 institutions. Added 16 verified fields and two unresolved conflicts. Proposal: `data/policy-review-batches/2026-10-04-03.json`.

## Batch 04

- Mount Holyoke (166939): aid and English approved. Full assessed need may include loans/work; average English scores are not cutoffs except the explicit Cambridge minimum. ED I English results are due November 26 in the FAQ versus November 15 on the English page, so deadlines remain a conflict.
- Connecticut (128902): aid and English approved with reviewed waiver requirements and no invented test minimums. The freshly captured financial-aid page now refers to 2027–28 and November 16, 2026 for early rounds, while the international checklist says November 1 for both admission and aid. The inconsistent financial deadline is flagged.
- Sarah Lawrence (195304): completed aid, fee and deadline fields. Competitive partial scholarships, the free institutional international aid form and its ten-day document window are explicit; domestic FAFSA instructions are not applied to international students.
- Dickinson (212009): completed fee/deadline fields and strengthened aid wording with the specific international tuition cap. The explicit absence of Spring 2027 first-year admission overrides older general narratives. Older $65 CDS fee data are not substituted for current Common App application instructions.
- Wooster (206589) and St. Lawrence (195216): completed fee fields using each institution's own exact Common App profile, not graduate or namesake-college pages. Common App is approved individually in the source manifest for these institutions. Wooster's stale Common App date narrative does not override its dated Fall 2027 international schedule.

Coverage after batch 04: **66 complete profiles, 10 partial profiles, 363 verified fields**, across 76 institutions. Added 11 verified fields, improved one existing aid field, and recorded two deadline conflicts. Proposal: `data/policy-review-batches/2026-10-04-04.json`.

Quality repair: the link checker now includes approved field-level overlays rather than counting only the original 58 profiles. This exposed Wooster's legacy general source URL returning 404; it was replaced with the current international admissions page. Browser comparison checks now use the approved aid value instead of a stale hard-coded sentence.

## Batch 05

- Reed (209922): completed aid, English and deadlines. Exam submissions are encouraged, not universally compulsory; English-medium documentation is accepted and averages are not minima. International aid is fixed for four years, cannot first be requested after admission, and uses hardship ISFAA rather than CSS payment codes. International noncustodial CSS/IDOC exemptions override generic domestic checklists. The old labelled form year needs confirmation for later entrants. Full assessed need may include loans/work; UWC and Continental awards are distinct.
- Beloit (238333): completed four fields and refreshed the existing SAT/ACT review against a new capture. The newly announced 2027–28 All-In guarantee applies to international entrants and caps first-year direct costs through gift aid; insurance/indirect costs and subsequent tuition increases are outside the cap. Waivers are requested, not automatic. New TOEFL scale and SAT/ACT English alternatives are explicit. All admission rounds are non-binding.

Coverage after batch 05: **68 complete profiles, 8 partial profiles, 370 verified fields**, across 76 institutions. Added seven verified fields and refreshed one existing testing field. Proposal: `data/policy-review-batches/2026-10-04-05.json`.

## Batch 06

- Sewanee (221519): all five fields approved. Seven Global Scholarships cover direct costs, not everyone's indirect expenses. CSS has no substitute/waiver; ordinary application is free. Application, supporting-document and international deposit dates are separate. An anomalous ACT raw-score waiver table is not copied as a reliable threshold.
- Hult (164368): four fields approved. Current undergraduate interview, English evidence and explicit 2027 entry deadlines are captured; Boston is distinguished from other campuses. Merit/CSS support and nominated tuition grants are not a universal full-cost promise. No current undergraduate application-fee evidence was found; master's fees and old brochures are not substituted.
- University of the West (449870): three fields approved with explicit scope limitations. Its current bachelor's pages focus on transfers; the Lotus transfer award and continuing-student full-tuition award are not incoming first-year guarantees. EPT and application fees are separate. First-year testing/deadline eligibility remains pending rather than copying transfer dates.
- Rhodes (221351): testing, English and fee approved. Aid guarantees/merit ceilings and ED decision/deposit schedules conflict between the admissions website and the current catalog; neither is silently chosen. English competitive recommendations are not minima, and the catalog's special pre-high-school-completion plan is distinct from ordinary ED.

Coverage after batch 06: **69 complete profiles, 11 partial profiles, 385 verified fields**, across 80 institutions. Added 15 verified fields and recorded two conflicts. Proposal: `data/policy-review-batches/2026-10-04-06.json`.

## Batch 07

- Hendrix (107080): all five fields approved. Need-sensitive admission and the $35,000 annual contribution guidance are explicit. The legacy international URL redirects to the new official site; current international application and I-20 dates override old search snippets and are distinguished from early-round/domestic dates. No new TOEFL conversion is invented. SAT/ACT flexibility and no application fee are captured from its exact institution-owned Common App profile.
- Agnes Scott (138600): testing, English and non-waivable international fee approved. The Fall 2027 $100K+ Promise includes international students but conflicts with RD merit-not-guaranteed text; EA II is January 16 on the international table versus January 15 on the Promise page. Both conflicts remain flagged. Undergraduate women's-college eligibility is noted without inventing exclusions.
- Centre (156408): substantive official pages were found, but two bounded collection attempts could not capture them under the collector's robots policy. No snapshot or approval was fabricated; all fields remain pending. Findings are routed in the source manifest for a future permitted capture.

Coverage after batch 07: **70 complete profiles, 12 partial profiles, 393 verified fields**, across 82 institutions. Added eight verified fields and two conflicts. Proposal: `data/policy-review-batches/2026-10-04-07.json`.
