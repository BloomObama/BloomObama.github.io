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

## Batch 08

- Luther (153834): all five fields approved. Limited aid and campus employment are not a universal full-need promise; the family's residual contribution and ISAFA documentation are explicit. SAT/ACT are optional, English has separate evidence/waiver conditions and a new TOEFL scale. Undated priority dates are not assigned an invented entry year; talent-scholarship deadlines remain separate.
- Augustana College, Illinois (143084): all five fields approved, with the exact institution distinguished from Augustana University in South Dakota. International aid uses the applicant portal rather than domestic FAFSA. ED scholarship housing/meal conditions are explicit, not a full-ride guarantee. Current spring/fall 2027 application and deposit dates, new TOEFL scale, study-based proficiency alternatives and its institution-owned Common App fee/testing policies are captured.

Coverage after batch 08: **72 complete profiles, 12 partial profiles, 403 verified fields**, across 84 institutions. Added ten verified fields. Proposal: `data/policy-review-batches/2026-10-04-08.json`.

## Batch 09

- Gustavus Adolphus (173647): all five fields approved. The international catalog's non-waivable processing fee overrides generic free-application advertising; specific international schedules override domestic dates. Required financial capacity, English alternatives and newer TOEFL requirements are captured without converting legacy scores.
- St. Olaf (174844): all five fields approved. Non-UWC tuition support is distinguished from UWC/Davis comprehensive-fee coverage; residual living expenses, loans and earned wages are explicit. Free aid-form alternatives, Fall 2027 filing dates and automatic English waiver conditions are captured. Approximate notification schedules differ and need confirmation; application deadlines agree.

Coverage after batch 09: **74 complete profiles, 12 partial profiles, 413 verified fields**, across 86 institutions. Added ten verified fields. Proposal: `data/policy-review-batches/2026-10-04-09.json`.

## Batch 10

- Rollins (136950): four fields approved. Need-aware aid and the competitive Alfond exception have separate cost/eligibility limits. New TOEFL requirements, official result delivery and free application routes are captured. ED II dates disagree between the international table and ED FAQ; that field is a conflict, with earlier scholarship-document requirements retained.
- Simmons (167783): four fields approved. SAT/ACT optional admission, English study/exam alternatives, first-year classification and deadlines are separate from transfer/adult/graduate rules. No application fee does not waive other costs. The international merit page contradicts itself on award ceilings, so aid remains a conflict rather than a guaranteed net-cost claim.

Coverage after batch 10: **74 complete profiles, 14 partial profiles, 421 verified fields**, across 88 institutions. Added eight verified fields and two conflicts. Proposal: `data/policy-review-batches/2026-10-04-10.json`.

## Batch 11

- Hollins (232308): four fields approved. Its international first-year SAT/ACT rule permits an alternative-test waiver, narrower than generic test-optional advertising. English exemptions and first-year deadlines are distinct from domestic FAFSA, adult and graduate instructions. International scholarship pages advertise different starting amounts ($23,000 and $25,000), so aid is flagged for confirmation. The quoted cost table is for 2025–26.
- Stetson (137546): first-year fee and testing rules approved from its exact institution-owned Common App profile. Official international admission and aid pages returned 403 during bounded collection; their policy fields remain pending rather than guessed.

Coverage after batch 11: **74 complete profiles, 16 partial profiles, 427 verified fields**, across 90 institutions. Added six verified fields, one conflict. Proposal: `data/policy-review-batches/2026-10-04-11.json`.

## Batch 12

- Berea (156295): aid, testing, English and deadline approved. Admitted international students' direct costs are covered, but applicants compete for fewer than 40 places and must budget for personal expenses and a deposit, with deposit assistance potentially available. One of five recent exams is compulsory even for native English speakers; the domestic test-optional rule does not apply. The captured page's dynamically rendered application-fee statement was absent, so that field remains pending under the snapshot rule.
- Drake (153269): aid, SAT/ACT, English and first-year deadlines approved. Its international grant plus other aid has an official 40% of total-cost ceiling. The account-services page lists a $50 international undergraduate application fee with the unexpected unit “per semester”; fee timing and scope remain a conflict until clarified. Domestic free-application wording and graduate charges are not applied to the international bachelor's pathway.

Coverage after batch 12: **74 complete profiles, 18 partial profiles, 435 verified fields**, across 92 institutions. Added eight verified fields and one conflict. Proposal: `data/policy-review-batches/2026-10-04-12.json`.

## Batch 13

- Berea (156295): the international application-fee statement was verified from the same official page after its client-side content finished rendering. The rendered snapshot preserves the exact page text and hash; no 403 or robots restriction was bypassed. The application is free, but this does not remove the separately documented enrollment deposit or other applicant expenses.

Coverage after batch 13: **75 complete profiles, 17 partial profiles, 436 verified fields**, across 92 institutions. Added one verified field. Proposal: `data/policy-review-batches/2026-10-04-13.json`.

## Batch 14

- Lake Forest (146481): all five first-year international fields approved. Need-aware admission and a $48,000 combined grant/scholarship ceiling for **2026–27 entrants** are not a full-cost guarantee for Fall 2027. Work-study has two inconsistent quoted possible amounts and neither is guaranteed. SAT/ACT are optional only with a required interview on the test-optional route; English evidence is separate, with individual proof/waiver possibilities. The 2027 Apply page distinguishes overseas new-F-1 first-years from those already studying in the U.S.; transfer dates are not copied. The first-year application itself is free, unlike possible CSS and post-admission expenses.

Coverage after batch 14: **76 complete profiles, 17 partial profiles, 441 verified fields**, across 93 institutions. Added five verified fields. Proposal: `data/policy-review-batches/2026-10-04-14.json`.

## Batch 15

- Southern California Institute of Architecture / SCI-Arc (123952): all five first-year B.Arch fields approved. International applicants may compete for merit scholarships, but admissions need-based awards are domestic-only; no full-cost guarantee is implied. SAT/ACT and portfolio are optional, while English evidence is required for applicants educated outside English-medium institutions. The $85 application fee and Fall 2027 January 15 priority deadline are explicit; later files are considered only if space remains.
- Wheaton College (Illinois, 149781): the specific international admissions pages show conflicting test instructions in indexed results, but direct collection was disallowed by the site's robots policy. Its Common App profile was captured, yet the fee badge conflicts with stale fee text on the same profile. No Wheaton policy was approved or copied from Wheaton College in Massachusetts. These fields remain pending until an acceptable source can be captured or the institution clarifies them.

Coverage after batch 15: **77 complete profiles, 17 partial profiles, 446 verified fields**, across 94 institutions. Added five verified fields; Wheaton Illinois remains unreviewed. Proposal: `data/policy-review-batches/2026-10-04-15.json`.

Link-health note (October 4): the independent source reachability check reports TLS certificate errors for four previously reviewed `skidmore.edu` admissions URLs. The site's externally hosted certificate cannot be repaired in this repository. GitHub Pages deployment succeeds, but the separate Site quality workflow remains red while those source links fail transport validation. Do not bypass TLS verification or treat this as evidence that the underlying Skidmore policies changed; recheck their official site when its certificate is repaired.

## Batch 16

- Rhode Island School of Design / RISD (217493): all five first-year fields approved for 2027 entry. International students can apply for institutional need-based aid, but RISD explicitly warns that full need may not be met; the post-application institutional aid form is separate from domestic FAFSA. SAT/ACT are optional for international applicants, while English-as-second-language applicants need test evidence or an approved qualifying-school waiver. The $60 Common App fee and $10 SlideRoom portfolio fee are distinct, and the published waiver does not explicitly cover the latter. Admission deadlines (November 1/January 20) and aid deadlines (November 15/January 25) are kept separate.

Coverage after batch 16: **78 complete profiles, 17 partial profiles, 451 verified fields**, across 95 institutions. Added five verified fields. Proposal: `data/policy-review-batches/2026-10-04-16.json`.

## Batch 17

- ArtCenter College of Design (109651): four fields approved from current undergraduate and scholarship pages. International applicants can compete for limited scholarships without FAFSA, while SAT/ACT remain optional, English-medium education affects proficiency testing, and the current online application lists a $50 fee with a possible requested waiver. Stale handbook and paper-application amounts were not substituted. The official Fall 2027 Apply page says November 1 for Early Action, but the separate undergraduate Important Dates page still says November 15 without a year; the deadline field remains a conflict. Both give February 1 as the fall priority date, and admission is generally rolling subject to major capacity.

Coverage after batch 17: **78 complete profiles, 18 partial profiles, 455 verified fields**, across 96 institutions. Added four verified fields and one deadline conflict. Proposal: `data/policy-review-batches/2026-10-04-17.json`.

## Batch 18

- Divine Word College (153241): five fields approved from current college pages. International students can discuss individual funding plans and scholarships, but the college's separate seminary scholarship and inability-to-pay language applies specifically to Divine Word Missionary priest/brother candidates; neither is a full-cost promise to all international applicants. SAT/ACT are not required, while non-native English speakers entering the undergraduate program must show proficiency through TOEFL/equivalent or the college test. The degree application fee is $25. The FAQ lists June 15 (fall) and November 1 (spring) processing cutoffs for international files without labelling an intake year, so applicants must confirm the 2026–27 dates with admissions. Its old 2022–24 price table was ignored; the current 2026–27 tuition page separately lists $8,400 per semester before other costs.

Coverage after batch 18: **79 complete profiles, 18 partial profiles, 460 verified fields**, across 97 institutions. Added five verified fields. Proposal: `data/policy-review-batches/2026-10-04-18.json`.

## Batch 19

- Florida Atlantic University (133669): four first-year international fields approved. FAU lists a limited, competitive $6,000/year international merit scholarship rather than guaranteed full funding; official SAT/ACT/CLT scores are required, English proficiency has several qualifying routes, and the international application fee is $30. The international deadlines page sends first-years to a general freshman page with March 12 (fall rolling) and September 15 (spring), but the international scholarship page still describes complete applications through March 15 and October 15 respectively. This timing mismatch remains a conflict rather than a verified admission deadline; applicants should confirm the intake-year cutoff directly with FAU.

Coverage after batch 19: **79 complete profiles, 19 partial profiles, 464 verified fields**, across 98 institutions. Added four verified fields and one deadline conflict. Proposal: `data/policy-review-batches/2026-10-04-19.json`.

## Batch 20

- Grace Mission University (481058): two fields approved with explicit limits. The bachelor-level Grace Scholarship is published as 40% of per-unit tuition for non-federal-aid recipients, but the school does not expressly guarantee incoming F-1 eligibility or full cost; U.S. federal aid is unavailable to F-1/F-2 and J-1/J-2 students. The university describes an ELSP entry route without TOEFL and an exit assessment before regular classes; this is conditional placement, not unrestricted English-language waiver. Its international admissions page quotes a $50 application fee, while the financial-policy table quotes $100 for all degree programs and a separate $60 admission fee, so the fee field remains a conflict. The admissions page also still refers to discontinued SAT Subject Tests and ACT Writing; testing is left pending. Its international page promises an application schedule but does not display actual dates, so deadlines remain pending. These pages need direct confirmation before an applicant pays or relies on an exam/date.

Coverage after batch 20: **79 complete profiles, 20 partial profiles, 466 verified fields**, across 99 institutions. Added two verified fields and one fee conflict; testing and deadlines remain pending. Proposal: `data/policy-review-batches/2026-10-04-20.json`.

## Batch 21

- New England Conservatory of Music (167057): four fields approved from the official 2026–27 NEC academic catalog and 2027 college-application portal. NEC does not require SAT/ACT; applicants whose native language is not English need proficiency evidence unless the dean waives it, and some may need ESL coursework. Financial need is not considered in admission, but institutional scholarships require application questions and an individualized award; no full-cost promise is inferred. The portal explicitly gives December 1, 2026 for Fall 2027 college-degree applications. The main admissions pages could not be captured under the collector's robots policy, so their $125 application fee, possible waiver, current English-score alternatives and supplemental deadlines were not marked verified. NEC Preparatory School dates were not copied to the college profile.

Coverage after batch 21: **79 complete profiles, 21 partial profiles, 470 verified fields**, across 100 institutions. Added four verified fields; fee remains pending. Proposal: `data/policy-review-batches/2026-10-04-21.json`.

Source-health recheck (October 4): 401 of 406 unique reviewed official URLs were reachable or access-controlled. Four `skidmore.edu` URLs still fail TLS verification with `CERT_HAS_EXPIRED`; the previously reviewed `https://www.berea.edu/admissions/international` now returns HTTP 404. These are link failures, not evidence that the saved admissions facts changed. Both institutions need fresh official-source checks; certificate validation was not disabled and the failing URLs were not silently replaced.

Source-link repair: the obsolete Berea profile landing link was replaced with the college's accessible official international-applicant FAQ, which directly supports the profile's work-college and aid description as well as the existing field reviews. No admissions claim or verification status was changed. Skidmore's four external certificate failures remain unresolved.
