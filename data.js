const colleges = [
  {
    name: "Massachusetts Institute of Technology",
    short: "MIT",
    location: "Cambridge, Massachusetts",
    aid: "Need-blind · meets full demonstrated need for admitted international students",
    aidShort: "Need-blind + full need",
    testing: "SAT or ACT required",
    english: "English test strongly recommended in some cases; minimums are published",
    fee: "Fee waiver available for eligible applicants",
    deadline: "Check the current Early Action / Regular Action calendar",
    source: "https://mitadmissions.org/apply/firstyear/tests-scores/",
    aidSource: "https://sfs.mit.edu/undergraduate-students/apply-for-aid/international-students/",
    needBlind: true,
    testFlexible: false,
    englishStatus: "required",
    feeWaiver: true
    ,photo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/MIT_Campus_%288222169333%29.jpg"
    ,photoCredit: "Aleksandr Zykov · CC BY-SA 2.0"
    ,photoSource: "https://commons.wikimedia.org/wiki/File:MIT_Campus_(8222169333).jpg"
  },
  {
    name: "Harvard University",
    short: "Harvard",
    location: "Cambridge, Massachusetts",
    aid: "Need-blind · meets demonstrated need regardless of citizenship",
    aidShort: "Need-blind + full need",
    testing: "SAT/ACT expected; alternative academic results may be considered in exceptional access cases",
    english: "English proficiency exam is not required, but may be submitted",
    fee: "Application fee is waived when it presents hardship",
    deadline: "Check the current Restrictive Early Action / Regular Decision calendar",
    source: "https://college.harvard.edu/admissions/apply/international-applicants",
    aidSource: "https://college.harvard.edu/financial-aid/how-aid-works",
    needBlind: true,
    testFlexible: true,
    englishStatus: "notRequired",
    feeWaiver: true
    ,photo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Harvard_Yard.jpg"
    ,photoCredit: "Andrew Haggard · CC BY-SA 1.0"
    ,photoSource: "https://commons.wikimedia.org/wiki/File:Harvard_Yard.jpg"
  },
  {
    name: "Yale University",
    short: "Yale",
    location: "New Haven, Connecticut",
    aid: "Need-blind · meets 100% of demonstrated need for international students",
    aidShort: "Need-blind + full need",
    testing: "SAT or ACT required for first-year applicants",
    english: "Required if you have not completed at least two years of English-medium secondary education",
    fee: "Fee waivers accepted through application platforms for eligible applicants",
    deadline: "Check the current Single-Choice Early Action / Regular Decision calendar",
    source: "https://admissions.yale.edu/international",
    aidSource: "https://finaid.yale.edu/faq",
    needBlind: true,
    testFlexible: false,
    englishStatus: "required",
    feeWaiver: true
    ,photo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Yale_University_Campus_Scene_-_New_Haven_-_CT_-_USA_-_05_%287088652497%29.jpg"
    ,photoCredit: "Adam Jones · CC BY-SA 2.0"
    ,photoSource: "https://commons.wikimedia.org/wiki/File:Yale_University_Campus_Scene_-_New_Haven_-_CT_-_USA_-_05_(7088652497).jpg"
  },
  {
    name: "Princeton University",
    short: "Princeton",
    location: "Princeton, New Jersey",
    aid: "Need-blind · meets full demonstrated need with grant aid",
    aidShort: "Need-blind + full need",
    testing: "Test-optional through the 2026–27 cycle; SAT/ACT returns for fall 2028 entry",
    english: "Required when English is not your native language and is not the language of instruction",
    fee: "Princeton-specific fee waiver is available to low-income applicants",
    deadline: "Check the current Single-Choice Early Action / Regular Decision calendar",
    source: "https://admission.princeton.edu/apply/international-students",
    aidSource: "https://admission.princeton.edu/cost-aid",
    needBlind: true,
    testFlexible: true,
    englishStatus: "required",
    feeWaiver: true
    ,photo: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Princeton_University_campus.jpg"
    ,photoCredit: "Mankhach · CC BY-SA 4.0"
    ,photoSource: "https://commons.wikimedia.org/wiki/File:Princeton_University_campus.jpg"
  },
  {
    name: "Dartmouth College",
    short: "Dartmouth",
    location: "Hanover, New Hampshire",
    aid: "Need-blind · meets 100% of demonstrated need regardless of citizenship",
    aidShort: "Need-blind + full need",
    testing: "SAT/ACT, AP, IB, A-Levels or equivalent national exams may meet the requirement",
    english: "Required when English is not your first language or language of instruction for two years",
    fee: "Fee waiver may be requested for financial hardship",
    deadline: "Check the current Early Decision / Regular Decision calendar",
    source: "https://admissions.dartmouth.edu/glossary-question/i-attend-school-outside-us-do-i-have-submit-act-or-sat",
    aidSource: "https://admissions.dartmouth.edu/affordability-dartmouth",
    needBlind: true,
    testFlexible: true,
    englishStatus: "required",
    feeWaiver: true
    ,photo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dartmouth_Hall_at_Dartmouth_College.jpg"
    ,photoCredit: "Kenneth C. Zirkel · CC BY 4.0"
    ,photoSource: "https://commons.wikimedia.org/wiki/File:Dartmouth_Hall_at_Dartmouth_College.jpg"
  }
];
