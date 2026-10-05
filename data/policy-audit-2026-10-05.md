# Admissions-policy audit — October 5, 2026

This continues [`policy-audit-2026-10-04.md`](policy-audit-2026-10-04.md). The five fields concern international undergraduate applicants; official source access and a saved quotation do not by themselves imply universal funding or current-cycle eligibility.

## Batch 1

- Manhattan School of Music (192712): four fields verified from its official international-admissions and FAQ pages. Undergraduate SAT/ACT scores are not required, but prescreening and auditions remain. Non-native English speakers must submit a Duolingo English Test score by December 1, 2026; TOEFL/IELTS do not substitute, and no minimum is required merely to apply. The standard college application fee is $130; special $80/exchange exceptions and possible late charges are noted. International auditioning applicants can be considered for merit/need institutional scholarships after CSS Profile and MSM questionnaire, with no universal full-cost promise. The Fall 2027 college application portal says December 1, 2026. The aid-document deadline is **conflicting**: the international page says February 1, while the aid page's international section and college dates table say January 15. Applicants should submit by January 15 or get written confirmation. The deadline field remains a conflict, not a verified date. Current financial-aid page also contains old May 2026 acceptance instructions; these were not copied into the Fall 2027 policy.

Coverage after batch 1: **79 complete profiles, 22 partial profiles, 474 verified fields**, across 101 institutions. Proposal: `data/policy-review-batches/2026-10-05-01.json`.

Source health carried forward: four Skidmore official admissions URLs failed TLS validation (`CERT_HAS_EXPIRED`) in the prior check. Berea's former 404 landing link was replaced and published with the official international-applicant FAQ. Certificate checks were not disabled.

## Batch 2

- Lincoln University, Oakland (117557): four fields verified from the current official admissions, scholarship and fee pages. Its scholarship page lists a competitive new-student merit award without expressly confirming incoming international eligibility, while the international FAQ describes the Board of Trustees award for continuing students. Term-specific scholarships apply to tuition/fees, not a guaranteed full living budget. English proof is required for applicants from non-English-medium schools; the page lists TOEFL/IELTS/DET and an institutional assessment alternative, but does not clarify which TOEFL scale its 59 example uses after the 2026 score-scale change. The standard application charge is $95 on campus or $50 at distance, with a separately listed $250 international transcript-evaluation fee. The FAQ gives three international deadlines for Spring, Summer and Fall 2027; the current application portal only reiterates Spring and asks applicants for other terms to contact admissions. The FAQ's one-year support amount is $20,065 while its separate international page says $29,065; neither was silently selected as the current visa-proof amount. Published BA/BS requirements do not state a blanket SAT/ACT policy, and BS Diagnostic Imaging separately requires an SLE score and interview, so the testing field stays pending rather than declaring all programs test-optional.

Coverage after batch 2: **79 complete profiles, 23 partial profiles, 478 verified fields**, across 102 institutions. Proposal: `data/policy-review-batches/2026-10-05-02.json`.

## Batches 3–4

The complete count is 80 of 5,002 institutions. A college enters this count only when all five fields—international aid, SAT/ACT, English proficiency, application fee, and admission/aid deadlines—are verified from official sources. There are 24 additional partial profiles; these do not count toward the complete total. Confirmed fields total 487. Federal Scorecard statistics are a separate historical dataset and do not certify current admission policies.

## Completed today

| IPEDS ID | Institution | Scope and important qualification |
| --- | --- | --- |
| 202073 | [Cleveland Institute of Music](https://www.cim.edu/admissions/apply) | Fall 2027 application and prescreen due December 1, 2026. SAT/ACT optional; English testing rules for applicants from non-English-official-language countries. [Aid](https://www.cim.edu/admissions/financialaid/basics) considers merit and need but does not guarantee full need. The fee and late fee, waiver conditions and separate aid deadline are retained in the field-level record. |

## Partial review, not counted

| IPEDS ID | Institution | Reason |
| --- | --- | --- |
| 144883 | [East-West University](https://www.eastwest.edu/admissions/international-admissions/) | Four fields are verified, including its 2026–27 international tuition scholarship cap and rolling admissions. Its [general admissions page](https://www.eastwest.edu/admissions/) calls SAT/ACT “recommended” but also lists scores among required documents. The testing field is marked `conflict`; this institution is excluded from the complete count until Admissions clarifies it. |

The exact-ID editorial decisions, dates, URLs, short quotations and matching local snapshot hashes are in `policy-review-batches/2026-10-05-03.json`, `policy-review-batches/2026-10-05-04.json` and the merged `policy-field-reviews.json`. Crawl candidates never become “verified” solely because a URL resolves or contains a keyword. The unreviewed crawl snapshots are local and not published.

## Batches 5–7 — release update

Coverage: **95 complete profiles, 25 partial profiles, 566 verified fields**, across 120 institutions. Only all-five-verified profiles count toward the complete total; this release adds 15 complete profiles to the previous published total of 80.

- Batch 5: Washington University in St. Louis (179867), Wake Forest (199847), and Richmond (233374), all five fields.
- Batch 6: Drew (184348), Pitzer (121257), and Bennington (230816), all five fields. Claremont McKenna (112260) has four verified fields; inconsistent international-aid documentation deadlines remain a conflict, excluded from the complete count.
- Batch 7: the nine undergraduate University of California campuses: Berkeley (110635), Davis (110644), Irvine (110653), Los Angeles (110662), Merced (445188), Riverside (110671), San Diego (110680), Santa Barbara (110705), and Santa Cruz (110714). Shared system-wide application fee, testing and application-period rules are paired with campus-specific international English and aid requirements. Graduate-only campuses are not included.

UC qualifications are retained in each record: recommended English scores are not silently converted into required minimums, legacy TOEFL scores are identified where applicable, and competitive scholarships are not full-need guarantees. Santa Cruz's international award range is a four-year total, not an annual award; Riverside's maximum likewise covers four years. English requirements and exemptions must be read for the applicant's circumstances.

Proposals: `policy-review-batches/2026-10-05-05.json`, `policy-review-batches/2026-10-05-06.json`, and `policy-review-batches/2026-10-05-07.json`. Five official pages unavailable to the bounded collector were retrieved and inspected through the web reader; their captured excerpts are explicitly labelled `retrieved-excerpt`, not full HTML snapshots. Original collector failures remain recorded. No failed fetch, keyword match, or imported excerpt automatically approves a policy.
