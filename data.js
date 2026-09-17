const directoryImages = [
  { photo:"https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=82", photoSource:"https://unsplash.com/photos/1562774053-701939374585" },
  { photo:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=82", photoSource:"https://unsplash.com/photos/1523050854058-8df90110c9f1" },
  { photo:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=82", photoSource:"https://unsplash.com/photos/1541339907198-e08756dedf3f" },
  { photo:"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1600&q=82", photoSource:"https://unsplash.com/photos/1607237138185-eedd9c632b0b" },
  { photo:"https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=82", photoSource:"https://unsplash.com/photos/1498243691581-b145c3f54a5a" }
];

let directoryImageIndex = 0;

const directoryCollege = ({
  name, short, location, description, source,
  catalogId = null, catalogOnly = false, basicOnly = false, descriptionPending = false, facts = null,
  predominantDegree = null, highestDegree = null,
  verified = false, checkedAt = null,
  aid, aidShort = "Needs review", aidSource,
  testing, testingSource, testFlexible = false,
  english, englishSource, englishStatus = "unverified",
  fee, feeSource, feeWaiver = false,
  deadline, deadlineSource,
  needBlind = false, photo, photoSource, photoCredit
}) => {
  const fallback = directoryImages[directoryImageIndex++ % directoryImages.length];
  const pending = catalogOnly ? "Пока нет информации." : "Not yet audited for the 2026–27 cycle. Verify this item on the official admissions page.";
  return ({
  name, short, location, description, catalogId, catalogOnly, basicOnly, descriptionPending, facts, predominantDegree, highestDegree,
  aid: verified ? aid : pending,
  aidShort: verified ? aidShort : catalogOnly ? "Пока нет информации." : "Needs review",
  testing: verified ? testing : pending,
  english: verified ? english : pending,
  fee: verified ? fee : pending,
  deadline: verified ? deadline : pending,
  source,
  aidSource: aidSource || source,
  testingSource: testingSource || source,
  englishSource: englishSource || source,
  feeSource: feeSource || source,
  deadlineSource: deadlineSource || source,
  verified, checkedAt,
  needBlind: verified && needBlind,
  testFlexible: verified && testFlexible,
  englishStatus: verified ? englishStatus : "unverified",
  feeWaiver: verified && feeWaiver,
  photo: photo || fallback.photo,
  photoSource: photoSource || fallback.photoSource,
  photoCredit: photo ? (photoCredit || "Campus image") : "Illustrative campus image · Unsplash",
  photoIsIllustrative: !photo
  });
};

const colleges = [
  {
    name: "Massachusetts Institute of Technology", short: "MIT", location: "Cambridge, Massachusetts",
    description: "A science- and technology-centered research university with a highly collaborative undergraduate culture.",
    aid: "Need-blind · meets full demonstrated need for admitted international students", aidShort: "Need-blind + full need", testing: "SAT or ACT required",
    english: "English test strongly recommended in some cases; minimums are published", fee: "$75 application fee or an eligible fee waiver", deadline: "Early Action: November 1 · Regular Action: January 4",
    source: "https://mitadmissions.org/apply/firstyear/international/", aidSource: "https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/making-mit-affordable/",
    testingSource: "https://mitadmissions.org/apply/firstyear/tests-scores/", englishSource: "https://mitadmissions.org/apply/firstyear/tests-scores/", feeSource: "https://mitadmissions.org/apply/firstyear/deadlines-requirements/", deadlineSource: "https://mitadmissions.org/apply/firstyear/deadlines-requirements/",
    verified: true, checkedAt: "2026-09-16",
    needBlind: true, testFlexible: false, englishStatus: "required", feeWaiver: true,
    photo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/MIT_Main_Campus_aerial.jpg?width=2000", photoCredit: "Dllu · CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:MIT_Main_Campus_aerial.jpg"
  },
  {
    name: "Harvard University", short: "Harvard", location: "Cambridge, Massachusetts",
    description: "A broad research university whose historic undergraduate campus is centered on Harvard Yard.",
    aid: "Need-blind · meets demonstrated need regardless of citizenship", aidShort: "Need-blind + full need", testing: "SAT/ACT expected; alternative academic results may be considered in exceptional access cases",
    english: "English proficiency exam is not required, but may be submitted", fee: "Fee waiver available when the application fee presents hardship", deadline: "Restrictive Early Action: November 1 · Regular Decision: January 1",
    source: "https://college.harvard.edu/admissions/apply/international-applicants", aidSource: "https://college.harvard.edu/financial-aid/how-aid-works",
    testingSource: "https://college.harvard.edu/admissions/apply/international-applicants", englishSource: "https://college.harvard.edu/admissions/apply/international-applicants", feeSource: "https://college.harvard.edu/admissions/apply/international-applicants", deadlineSource: "https://college.harvard.edu/admissions/apply/application-requirements",
    verified: true, checkedAt: "2026-09-16",
    needBlind: true, testFlexible: true, englishStatus: "notRequired", feeWaiver: true,
    photo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Harvard_University_main_campus_aerial.JPG?width=2000", photoCredit: "Dllu · CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Harvard_University_main_campus_aerial.JPG"
  },
  {
    name: "Yale University", short: "Yale", location: "New Haven, Connecticut",
    description: "A residential research university known for its collegiate Gothic campus and liberal-arts foundation.",
    aid: "Need-blind · meets 100% of demonstrated need for international students", aidShort: "Need-blind + full need", testing: "SAT or ACT required for first-year applicants",
    english: "Required for non-native speakers without at least two years in an English-medium school", fee: "Fee waivers accepted through the application platforms for eligible applicants", deadline: "Single-Choice Early Action: November 1 · Regular Decision: January 2",
    source: "https://admissions.yale.edu/international", aidSource: "https://finaid.yale.edu/faq",
    testingSource: "https://admissions.yale.edu/standardized-testing", englishSource: "https://admissions.yale.edu/standardized-testing", feeSource: "https://admissions.yale.edu/apply", deadlineSource: "https://admissions.yale.edu/timelines",
    verified: true, checkedAt: "2026-09-16",
    needBlind: true, testFlexible: false, englishStatus: "required", feeWaiver: true,
    photo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Yale_University_Aerial_view.jpg?width=2000", photoCredit: "Emilie Foyer · CC BY-SA 3.0", photoSource: "https://commons.wikimedia.org/wiki/File:Yale_University_Aerial_view.jpg"
  },
  {
    name: "Princeton University", short: "Princeton", location: "Princeton, New Jersey",
    description: "A research university with a strong undergraduate focus, residential colleges and a compact historic campus.",
    aid: "Need-blind · meets full demonstrated need with grant aid", aidShort: "Need-blind + full need", testing: "Test-optional through the 2026–27 cycle; SAT/ACT returns for fall 2028 entry",
    english: "Required when English is not your native language and your school is not English-medium", fee: "Application fee or fee waiver accepted through the application", deadline: "Single-Choice Early Action: November 1 · Regular Decision: January 1",
    source: "https://admission.princeton.edu/apply/international-students", aidSource: "https://admission.princeton.edu/cost-aid",
    testingSource: "https://admission.princeton.edu/apply/standardized-testing", englishSource: "https://admission.princeton.edu/apply/standardized-testing", feeSource: "https://admission.princeton.edu/apply/application-checklist", deadlineSource: "https://admission.princeton.edu/apply/first-year-application-dates-deadlines",
    verified: true, checkedAt: "2026-09-16",
    needBlind: true, testFlexible: true, englishStatus: "required", feeWaiver: true,
    photo: "https://tigerlife.princeton.edu/sites/default/files/styles/7x5__focal_point_scale_and_crop__md-lg/public/2024-07/20210425_CL_QH_0116-2.jpg?h=4521fff0&itok=YAfY8c3X", photoCredit: "Princeton University", photoSource: "https://tigerlife.princeton.edu/transportation-campus"
  },
  {
    name: "Dartmouth College", short: "Dartmouth", location: "Hanover, New Hampshire",
    description: "A small research university built around an undergraduate liberal-arts college in a rural New England setting.",
    aid: "Need-blind · meets 100% of demonstrated need regardless of citizenship", aidShort: "Need-blind + full need", testing: "SAT/ACT, AP, IB, A-Levels or equivalent national exams may meet the requirement",
    english: "Required when English is not your first language or language of instruction for two years", fee: "Fee waiver may be requested for financial hardship", deadline: "Early Decision: November 1 · Regular Decision: January 1",
    source: "https://admissions.dartmouth.edu/glossary-term/international-students", aidSource: "https://admissions.dartmouth.edu/affordability-dartmouth",
    testingSource: "https://admissions.dartmouth.edu/apply/testing-policy", englishSource: "https://admissions.dartmouth.edu/apply/testing-policy", feeSource: "https://admissions.dartmouth.edu/apply-dartmouth", deadlineSource: "https://admissions.dartmouth.edu/apply-dartmouth",
    verified: true, checkedAt: "2026-09-16",
    needBlind: true, testFlexible: true, englishStatus: "required", feeWaiver: true,
    photo: "https://www.dartmouth.edu/gps/slides/home_3new.jpg", photoCredit: "Dartmouth College", photoSource: "https://www.dartmouth.edu/gps/"
  },
  directoryCollege({ name:"Stanford University", short:"Stanford", location:"Stanford, California", description:"A private research university in Silicon Valley with strengths across engineering, sciences, humanities and entrepreneurship.", source:"https://admission.stanford.edu/apply/international/", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international citizens requesting aid · meets full demonstrated need for admitted students", aidSource:"https://admission.stanford.edu/apply/international/", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT or ACT required", testingSource:"https://admission.stanford.edu/apply/first-year/testing.html", testFlexible:false, english:"English proficiency exam is not required; optional scores may be self-reported", englishSource:"https://admission.stanford.edu/apply/international/", englishStatus:"notRequired", fee:"$100 application fee or an eligible fee waiver", feeSource:"https://admission.stanford.edu/apply/first-year/index.html", feeWaiver:true, deadline:"Restrictive Early Action: November 1, 2026 · Regular Decision: January 5, 2027", deadlineSource:"https://admission.stanford.edu/apply/first-year/index.html" }),
  directoryCollege({ name:"California Institute of Technology", short:"Caltech", location:"Pasadena, California", description:"A very small research university centered on science, engineering and intensive undergraduate research.", source:"https://www.admissions.caltech.edu/apply/first-year-applicants/international-applicants", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · meets 100% of demonstrated financial need for admitted students", aidSource:"https://www.admissions.caltech.edu/apply/first-year-applicants/international-applicants", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT or ACT required", testingSource:"https://www.admissions.caltech.edu/apply/first-year-applicants/standardized-tests", testFlexible:false, english:"TOEFL, IELTS or Duolingo required unless English is native or the primary language of secondary-school instruction", englishSource:"https://www.admissions.caltech.edu/apply/first-year-applicants/international-applicants", englishStatus:"required", fee:"$85 application fee or an eligible hardship-based waiver", feeSource:"https://www.admissions.caltech.edu/apply/first-year-applicants/first-year-application-fee-and-waiver", feeWaiver:true, deadline:"Restrictive Early Action: November 1, 2026 · Regular Decision: January 4, 2027", deadlineSource:"https://www.admissions.caltech.edu/apply/first-year-applicants/deadlines", photo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Beckman_Auditorium_%2817521897582%29.jpg/1920px-Beckman_Auditorium_%2817521897582%29.jpg", photoSource:"https://commons.wikimedia.org/wiki/File:Beckman_Auditorium_(17521897582).jpg", photoCredit:"Yisong Yue · CC BY-SA 2.0" }),
  directoryCollege({ name:"University of Pennsylvania", short:"Penn", location:"Philadelphia, Pennsylvania", description:"An urban Ivy League research university combining liberal arts with professional schools such as Wharton and Engineering.", source:"https://admissions.upenn.edu/how-to-apply/international-applicants/guidelines", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · grant-based aid meets 100% of demonstrated need without loans", aidSource:"https://admissions.upenn.edu/affording-penn/international-aid", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT or ACT required", testingSource:"https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements", testFlexible:false, english:"TOEFL, IELTS or Duolingo required unless English is native or has been the primary language of instruction for at least three years", englishSource:"https://admissions.upenn.edu/how-to-apply/international-applicants/guidelines", englishStatus:"required", fee:"$75 application fee or an eligible fee waiver", feeSource:"https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements", feeWaiver:true, deadline:"Early Decision: November 1, 2026 · Regular Decision: January 5, 2027", deadlineSource:"https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements" }),
  directoryCollege({ name:"Columbia University", short:"Columbia", location:"New York, New York", description:"An urban Ivy League university known for the Core Curriculum and access to New York City's academic and cultural resources.", source:"https://undergrad.admissions.columbia.edu/apply/international", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for foreign citizens requesting aid · meets 100% of demonstrated need for admitted students", aidSource:"https://undergrad.admissions.columbia.edu/affordability", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT/ACT optional for the 2026–27 admission cycle", testingSource:"https://communications.news.columbia.edu/news/update-columbia-college-and-columbia-engineering-testing-policy", testFlexible:true, english:"English proficiency must be demonstrated when English is neither a home language nor the primary language of secondary-school instruction", englishSource:"https://undergrad.admissions.columbia.edu/apply/international", englishStatus:"required", fee:"$85 application fee or an eligible Columbia, Common App or Coalition fee waiver", feeSource:"https://apply.college.columbia.edu/register/feewaiver", feeWaiver:true, deadline:"Early Decision: November 1 · Regular Decision: January 1", deadlineSource:"https://undergrad.admissions.columbia.edu/apply/firstyear" }),
  directoryCollege({ name:"Cornell University", short:"Cornell", location:"Ithaca, New York", description:"A large Ivy League university offering programs from liberal arts and engineering to agriculture, architecture and hotel administration.", source:"https://admissions.cornell.edu/how-to-apply/first-year-applicants", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · meets 100% of demonstrated need for admitted students", aidSource:"https://admissions.cornell.edu/how-to-apply/first-year-applicants", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT or ACT required", testingSource:"https://admissions.cornell.edu/how-to-apply/first-year-applicants", testFlexible:false, english:"English proficiency required unless English is a first language or the applicant has studied at least four years in an English-medium school", englishSource:"https://admissions.cornell.edu/resources/submit-english-language-proficiency", englishStatus:"required", fee:"$85 application fee; waiver available when the fee presents financial hardship", feeSource:"https://admissions.cornell.edu/how-to-apply/first-year-applicants", feeWaiver:true, deadline:"Early Decision: November 1 · Regular Decision: January 2", deadlineSource:"https://admissions.cornell.edu/how-to-apply/first-year-applicants" }),
  directoryCollege({ name:"Brown University", short:"Brown", location:"Providence, Rhode Island", description:"An Ivy League research university distinguished by its flexible Open Curriculum and student-directed academic paths.", source:"https://admission.brown.edu/first-year", verified:true, checkedAt:"2026-09-16", aid:"Need-blind for first-year applicants, including international students · meets 100% of demonstrated need", aidSource:"https://admission.brown.edu/international/financial-aid", needBlind:true, aidShort:"Need-blind + full need", testing:"SAT or ACT required for first-year applicants", testingSource:"https://admission.brown.edu/first-year/standardized-tests", testFlexible:false, english:"English proficiency testing is highly recommended when English is not the first, home or school language", englishSource:"https://admission.brown.edu/international/english-proficiency", englishStatus:"required", fee:"$80 application fee or an eligible fee waiver", feeSource:"https://admission.brown.edu/apply/how-apply", feeWaiver:true, deadline:"Early Decision: November 1 · Regular Decision: January 5", deadlineSource:"https://admission.brown.edu/first-year" }),
  directoryCollege({ name:"Duke University", short:"Duke", location:"Durham, North Carolina", description:"A research university with a residential undergraduate experience and notable strengths in public policy, engineering and health sciences.", source:"https://admissions.duke.edu/apply/", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for foreign citizens requesting aid · meets 100% of demonstrated need for admitted aid recipients", aidSource:"https://financialaid.duke.edu/forms-resources/awarding-policy/", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT/ACT optional for 2026–27 applicants", testingSource:"https://admissions.duke.edu/apply/", testFlexible:true, english:"English proficiency scores are not required; they may be submitted as optional evidence", englishSource:"https://admissions.duke.edu/apply/", englishStatus:"notRequired", fee:"$85 application fee or an eligible fee waiver", feeSource:"https://admissions.duke.edu/apply/", feeWaiver:true, deadline:"Early Decision: November 2, 2026 · Regular Decision: January 4, 2027", deadlineSource:"https://admissions.duke.edu/apply/" }),
  directoryCollege({ name:"Northwestern University", short:"Northwestern", location:"Evanston, Illinois", description:"A research university near Chicago with prominent programs in journalism, engineering, communication and the performing arts.", source:"https://admissions.northwestern.edu/apply/identities/international.html", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · guarantees 100% of demonstrated need for admitted first-year international students", aidSource:"https://admissions.northwestern.edu/apply/identities/international.html", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT/ACT optional", testingSource:"https://admissions.northwestern.edu/apply/requirements.html", testFlexible:true, english:"English proficiency required when English is neither a first/primary language nor the language of secondary-school instruction", englishSource:"https://admissions.northwestern.edu/apply/", englishStatus:"required", fee:"$75 application fee or an eligible fee waiver", feeSource:"https://admissions.northwestern.edu/apply/", feeWaiver:true, deadline:"Early Decision: November 1, 2026 · Regular Decision: January 4, 2027", deadlineSource:"https://admissions.northwestern.edu/apply/" }),
  directoryCollege({ name:"University of Chicago", short:"UChicago", location:"Chicago, Illinois", description:"A research-intensive university known for its Core Curriculum, theoretical inquiry and strong economics and social-science traditions.", source:"https://collegeadmissions.uchicago.edu/apply/international-applicants/", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · meets 100% of demonstrated need for admitted first-year students", aidSource:"https://collegeadmissions.uchicago.edu/financial-support/international-financial-aid/", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT/ACT optional under the No Harm testing policy", testingSource:"https://collegeadmissions.uchicago.edu/apply/application/required-materials/", testFlexible:true, english:"Formal English proficiency scores are optional when English mastery is already demonstrated in the application", englishSource:"https://collegeadmissions.uchicago.edu/apply/international-applicants/", englishStatus:"notRequired", fee:"$90; automatically waived for applicants seeking need-based aid", feeSource:"https://collegeadmissions.uchicago.edu/apply/application/required-materials/", feeWaiver:true, deadline:"Early Action / Early Decision I: November 2, 2026 · Early Decision II / Regular Decision: January 4, 2027", deadlineSource:"https://collegeadmissions.uchicago.edu/apply/application/" }),
  directoryCollege({ name:"Johns Hopkins University", short:"Johns Hopkins", location:"Baltimore, Maryland", description:"A research university particularly well known for medicine, public health, international studies, science and engineering.", source:"https://apply.jhu.edu/international-applicants/", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · meets 100% of demonstrated need for admitted students", aidSource:"https://apply.jhu.edu/international-applicants/", needBlind:false, aidShort:"Need-aware + full need", testing:"SAT or ACT required", testingSource:"https://apply.jhu.edu/how-to-apply/application-deadlines-requirements/standardized-testing/", testFlexible:false, english:"TOEFL, IELTS, Duolingo or Cambridge scores are recommended, not required, when English is not primary", englishSource:"https://apply.jhu.edu/how-to-apply/application-deadlines-requirements/", englishStatus:"notRequired", fee:"$70 application fee or an eligible fee waiver", feeSource:"https://apply.jhu.edu/how-to-apply/application-deadlines-requirements/", feeWaiver:true, deadline:"Early Decision I: November 1, 2026 · Early Decision II / Regular Decision: January 2, 2027", deadlineSource:"https://apply.jhu.edu/how-to-apply/application-deadlines-requirements/" }),
  directoryCollege({ name:"Rice University", short:"Rice", location:"Houston, Texas", description:"A mid-sized research university with residential colleges, small classes and strengths in engineering, science and architecture.", source:"https://admission.rice.edu/apply/first-year-international-applicants", verified:true, checkedAt:"2026-09-16", aid:"Need-aware for international applicants · need-based aid is available to a limited number of first-year applicants", aidSource:"https://admission.rice.edu/apply/first-year-international-applicants", needBlind:false, aidShort:"Limited need-based aid", testing:"SAT/ACT recommended but not required", testingSource:"https://admission.rice.edu/apply/first-year-international-applicants", testFlexible:true, english:"English proficiency required unless English is native or the applicant has completed at least two years in an English-medium curriculum", englishSource:"https://admission.rice.edu/apply/first-year-international-applicants", englishStatus:"required", fee:"$75 application fee; international applicants are not eligible for a fee waiver", feeSource:"https://admission.rice.edu/apply/first-year-international-applicants", feeWaiver:false, deadline:"Early Decision I: November 1, 2026 · Early Decision II / Regular Decision: January 4, 2027", deadlineSource:"https://admission.rice.edu/apply/first-year-international-applicants" }),
  directoryCollege({ name:"Vanderbilt University", short:"Vanderbilt", location:"Nashville, Tennessee", description:"A residential research university with broad liberal-arts offerings and strong programs in education, engineering and human development.", source:"https://admissions.vanderbilt.edu/apply/international.php", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"University of Notre Dame", short:"Notre Dame", location:"Notre Dame, Indiana", description:"A Catholic research university with a strong residential community and programs spanning liberal arts, business, science and engineering.", source:"https://admissions.nd.edu/apply/resources-for/international-applicants/international-faqs/", verified:true, checkedAt:"2026-09-16", aid:"Need-blind for international undergraduate applicants · meets full demonstrated need", aidSource:"https://admissions.nd.edu/aid-affordability/", needBlind:true, aidShort:"Need-blind + full need", testing:"Test-optional through 2026–27; SAT/ACT required beginning with fall 2028 entry", testingSource:"https://admissions.nd.edu/apply/application-overview/", testFlexible:true, english:"Required when English is not your first language or secondary schooling is not primarily in English", englishSource:"https://admissions.nd.edu/apply/resources-for/international-applicants/international-faqs/", englishStatus:"required", fee:"$85 application fee; eligible applicants may use an application-platform waiver", feeSource:"https://admissions.nd.edu/apply/application-overview/", feeWaiver:true, deadline:"Restrictive Early Action: November 1 · Regular Decision: January 4", deadlineSource:"https://admissions.nd.edu/apply/application-overview/" }),
  directoryCollege({ name:"Georgetown University", short:"Georgetown", location:"Washington, District of Columbia", description:"A Jesuit university with a global outlook and notable programs in international affairs, government, business and the humanities.", source:"https://uadmissions.georgetown.edu/applying/international/", aidShort:"Limited aid", feeWaiver:true }),
  directoryCollege({ name:"Carnegie Mellon University", short:"CMU", location:"Pittsburgh, Pennsylvania", description:"A technology- and arts-focused research university recognized for computer science, engineering, design, drama and interdisciplinary work.", source:"https://www.cmu.edu/admission/admission/international", aidShort:"Limited aid" }),
  directoryCollege({ name:"Emory University", short:"Emory", location:"Atlanta, Georgia", description:"A research university with a liberal-arts core and major strengths in health sciences, business and public service.", source:"https://apply.emory.edu/apply/international-applicants.html", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Washington University in St. Louis", short:"WashU", location:"St. Louis, Missouri", description:"A private research university known for flexible academics, interdisciplinary study and strengths in design, medicine and engineering.", source:"https://admissions.washu.edu/how-to-apply/international-applicants/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Tufts University", short:"Tufts", location:"Medford, Massachusetts", description:"A globally oriented research university near Boston with notable programs in international relations, civic engagement and life sciences.", source:"https://admissions.tufts.edu/apply/applying-as-an-international-student/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"New York University", short:"NYU", location:"New York, New York", description:"A large global research university whose main campus is integrated into Manhattan's Greenwich Village.", source:"https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/international-applicants.html", aidShort:"Varied aid", feeWaiver:true }),
  directoryCollege({ name:"University of Southern California", short:"USC", location:"Los Angeles, California", description:"A large private research university with strong programs in film, communication, business, engineering and the arts.", source:"https://admission.usc.edu/prospective-students/international-students/", aidShort:"Merit focus", feeWaiver:true }),
  directoryCollege({ name:"Boston University", short:"BU", location:"Boston, Massachusetts", description:"A large urban research university with extensive professional programs and a campus stretching along the Charles River.", source:"https://www.bu.edu/admissions/apply/international/", aidShort:"Merit focus" }),
  directoryCollege({ name:"Northeastern University", short:"Northeastern", location:"Boston, Massachusetts", description:"An urban research university best known for cooperative education that integrates academic study with paid professional experience.", source:"https://admissions.northeastern.edu/application-information/international-applicants/", aidShort:"Merit focus", feeWaiver:true }),
  directoryCollege({ name:"University of Rochester", short:"Rochester", location:"Rochester, New York", description:"A flexible research university with strengths in optics, music, engineering, economics and health sciences.", source:"https://admissions.rochester.edu/applying/international-students/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Case Western Reserve University", short:"CWRU", location:"Cleveland, Ohio", description:"A research university located beside major museums and hospitals, with strengths in engineering, medicine and applied sciences.", source:"https://case.edu/admission/apply/international-students", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"Tulane University", short:"Tulane", location:"New Orleans, Louisiana", description:"A research university with a strong civic-engagement tradition and programs connected to the culture and public life of New Orleans.", source:"https://admission.tulane.edu/international", aidShort:"Merit focus", feeWaiver:true }),
  directoryCollege({ name:"Brandeis University", short:"Brandeis", location:"Waltham, Massachusetts", description:"A small research university near Boston with a liberal-arts atmosphere and strengths in social policy, science and the humanities.", source:"https://www.brandeis.edu/admissions/apply/international.html", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Lehigh University", short:"Lehigh", location:"Bethlehem, Pennsylvania", description:"A mid-sized research university with strong engineering, business and interdisciplinary programs on a hillside residential campus.", source:"https://www2.lehigh.edu/admissions/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Villanova University", short:"Villanova", location:"Villanova, Pennsylvania", description:"An Augustinian Catholic university near Philadelphia with established programs in business, engineering, nursing and liberal arts.", source:"https://www.villanova.edu/university/undergraduate-admission/applying-to-villanova/international-applicants.html", aidShort:"Limited aid", feeWaiver:true }),
  directoryCollege({ name:"Wake Forest University", short:"Wake Forest", location:"Winston-Salem, North Carolina", description:"A private university combining a liberal-arts college atmosphere with research and professional programs.", source:"https://admissions.wfu.edu/apply/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Amherst College", short:"Amherst", location:"Amherst, Massachusetts", description:"A highly selective liberal-arts college with an open curriculum and access to courses across the Five College Consortium.", source:"https://www.amherst.edu/admission/apply/international", verified:true, checkedAt:"2026-09-16", aid:"Need-blind for domestic and international applicants · meets 100% of calculated financial need", aidSource:"https://www.amherst.edu/admission/apply/international", needBlind:true, aidShort:"Need-blind + full need", testing:"SAT/ACT optional for 2026–27 applicants", testingSource:"https://www.amherst.edu/admission/apply/firstyear", testFlexible:true, english:"Required for non-native speakers without two recent years in an English-medium curriculum", englishSource:"https://www.amherst.edu/admission/apply/international", englishStatus:"required", fee:"$75 application fee or an eligible fee waiver", feeSource:"https://www.amherst.edu/admission/apply/firstyear", feeWaiver:true, deadline:"Early Decision: November 9, 2026 · Regular Decision: January 5, 2027", deadlineSource:"https://www.amherst.edu/admission/apply/firstyear" }),
  directoryCollege({ name:"Williams College", short:"Williams", location:"Williamstown, Massachusetts", description:"A residential liberal-arts college known for small classes, tutorials and close faculty mentorship in a rural setting.", source:"https://www.williams.edu/admission-aid/apply/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Swarthmore College", short:"Swarthmore", location:"Swarthmore, Pennsylvania", description:"A rigorous liberal-arts college near Philadelphia with an engineering program and access to a wider academic consortium.", source:"https://www.swarthmore.edu/admissions-aid/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Pomona College", short:"Pomona", location:"Claremont, California", description:"A small liberal-arts college offering broad access to courses and facilities across the Claremont Colleges consortium.", source:"https://www.pomona.edu/admissions/apply/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Bowdoin College", short:"Bowdoin", location:"Brunswick, Maine", description:"A residential liberal-arts college on the Maine coast with strong interdisciplinary study and an emphasis on the common good.", source:"https://www.bowdoin.edu/admissions/apply/international-students/", verified:true, checkedAt:"2026-09-16", aid:"Need-blind for international first-year applicants · meets full calculated need without loans", aidSource:"https://www.bowdoin.edu/admissions/apply/international-students/", needBlind:true, aidShort:"Need-blind + full need", testing:"SAT/ACT optional", testingSource:"https://www.bowdoin.edu/admissions/apply/", testFlexible:true, english:"English proficiency test scores are optional for international applicants", englishSource:"https://www.bowdoin.edu/admissions/apply/international-students/", englishStatus:"notRequired", fee:"$70; automatically waived for applicants seeking aid, first-generation applicants or financial hardship", feeSource:"https://www.bowdoin.edu/admissions/apply/", feeWaiver:true, deadline:"Early Decision I: November 15 · Early Decision II / Regular Decision: January 5", deadlineSource:"https://www.bowdoin.edu/admissions/apply/international-students/" }),
  directoryCollege({ name:"Middlebury College", short:"Middlebury", location:"Middlebury, Vermont", description:"A liberal-arts college known internationally for languages, environmental studies and immersive study-abroad programs.", source:"https://www.middlebury.edu/college/admissions/apply/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Wellesley College", short:"Wellesley", location:"Wellesley, Massachusetts", description:"A women's liberal-arts college near Boston with a global alumnae network and cross-registration opportunities.", source:"https://www.wellesley.edu/admission-aid/apply/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Wesleyan University", short:"Wesleyan", location:"Middletown, Connecticut", description:"A liberal-arts university known for curricular flexibility, creative work and a strong culture of independent study.", source:"https://www.wesleyan.edu/admission/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Colby College", short:"Colby", location:"Waterville, Maine", description:"A residential liberal-arts college with strengths in global study, environmental fields and interdisciplinary research.", source:"https://afa.colby.edu/apply/international-applicants/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Hamilton College", short:"Hamilton", location:"Clinton, New York", description:"A liberal-arts college with an open curriculum and a strong emphasis on writing, speaking and individualized academic planning.", source:"https://www.hamilton.edu/admission/apply/international", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Grinnell College", short:"Grinnell", location:"Grinnell, Iowa", description:"A liberal-arts college with an individually advised curriculum, strong social-justice traditions and substantial undergraduate research.", source:"https://www.grinnell.edu/admission/apply/international", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Macalester College", short:"Macalester", location:"Saint Paul, Minnesota", description:"An urban liberal-arts college recognized for internationalism, civic engagement and a globally diverse student body.", source:"https://www.macalester.edu/admissions/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Colgate University", short:"Colgate", location:"Hamilton, New York", description:"A residential liberal-arts university with a scenic rural campus and broad programs across humanities, sciences and social sciences.", source:"https://www.colgate.edu/admission-aid/apply/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"University of Richmond", short:"Richmond", location:"Richmond, Virginia", description:"A residential liberal-arts university combining undergraduate colleges in arts and sciences, business and leadership studies.", source:"https://admissions.richmond.edu/process/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Davidson College", short:"Davidson", location:"Davidson, North Carolina", description:"A close-knit liberal-arts college with a strong honor code, Division I athletics and emphasis on undergraduate teaching.", source:"https://www.davidson.edu/admission-and-financial-aid/apply/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Washington and Lee University", short:"W&L", location:"Lexington, Virginia", description:"A small liberal-arts university with undergraduate programs in arts and sciences, commerce, journalism and politics.", source:"https://www.wlu.edu/admissions/apply/for-international-applicants", verified:true, checkedAt:"2026-09-16", aid:"Need-blind for international applicants · meets 100% of demonstrated need without loans for admitted students", aidSource:"https://www.wlu.edu/admissions/financial-aid/types-of-aid/international-student-aid", needBlind:true, aidShort:"Need-blind + full need", testing:"SAT/ACT optional for fall 2027 entry", testingSource:"https://www.wlu.edu/admissions/apply/test-optional-policy", testFlexible:true, english:"English proficiency must be demonstrated under the international applicant policy", englishSource:"https://www.wlu.edu/admissions/apply/for-international-applicants", englishStatus:"required", fee:"Common App fee waiver or W&L-specific waiver available to eligible applicants", feeSource:"https://www.wlu.edu/admissions/apply", feeWaiver:true, deadline:"Early Decision I: November 1, 2026 · Early Decision II / Regular Decision: January 5, 2027", deadlineSource:"https://www.wlu.edu/admissions/apply" }),
  directoryCollege({ name:"Berea College", short:"Berea", location:"Berea, Kentucky", description:"A work college with no-tuition commitments for enrolled students and a distinctive campus labor program.", source:"https://www.berea.edu/admissions/international", aidShort:"High aid", feeWaiver:true }),
  directoryCollege({ name:"Babson College", short:"Babson", location:"Wellesley, Massachusetts", description:"A business-focused college known for entrepreneurship education, venture building and an applied global curriculum.", source:"https://www.babson.edu/undergraduate/admission/how-to-apply/international-students/", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"Denison University", short:"Denison", location:"Granville, Ohio", description:"A residential liberal-arts university emphasizing close faculty mentorship, career preparation and interdisciplinary study.", source:"https://denison.edu/campus/admission/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Kenyon College", short:"Kenyon", location:"Gambier, Ohio", description:"A small residential liberal-arts college recognized for writing, literature, sciences and a rural hilltop campus.", source:"https://www.kenyon.edu/admissions-aid/apply-to-kenyon/international-applicants/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Oberlin College", short:"Oberlin", location:"Oberlin, Ohio", description:"A liberal-arts college and conservatory of music with long traditions in social engagement and creative practice.", source:"https://www.oberlin.edu/admissions-and-aid/international", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Smith College", short:"Smith", location:"Northampton, Massachusetts", description:"A women's liberal-arts college with an open curriculum, engineering program and access to the Five College Consortium.", source:"https://www.smith.edu/admission-aid/how-apply/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Mount Holyoke College", short:"Mount Holyoke", location:"South Hadley, Massachusetts", description:"A women's liberal-arts college combining a historic residential campus with broad Five College course access.", source:"https://admission.mtholyoke.edu/register/international", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Vassar College", short:"Vassar", location:"Poughkeepsie, New York", description:"A coeducational liberal-arts college known for a broad curriculum, arts resources and a large arboretum campus.", source:"https://www.vassar.edu/admission/apply/international", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Bates College", short:"Bates", location:"Lewiston, Maine", description:"A residential liberal-arts college with flexible academics, undergraduate research and a strong community focus.", source:"https://www.bates.edu/admission/apply/international-students/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Carleton College", short:"Carleton", location:"Northfield, Minnesota", description:"A small liberal-arts college with a trimester calendar, close teaching and notable strengths across sciences and humanities.", source:"https://www.carleton.edu/admissions/apply/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Reed College", short:"Reed", location:"Portland, Oregon", description:"A liberal-arts college centered on intensive seminar discussion, independent research and a required senior thesis.", source:"https://www.reed.edu/apply/guide-to-applying/international.html", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Haverford College", short:"Haverford", location:"Haverford, Pennsylvania", description:"A close-knit liberal-arts college shaped by an honor code and cross-registration with nearby partner institutions.", source:"https://www.haverford.edu/admission/applying/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Lafayette College", short:"Lafayette", location:"Easton, Pennsylvania", description:"A residential liberal-arts college with established engineering programs and strong interdisciplinary connections.", source:"https://admissions.lafayette.edu/apply/international-students/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Bucknell University", short:"Bucknell", location:"Lewisburg, Pennsylvania", description:"A residential university combining liberal arts with engineering and management on a compact central Pennsylvania campus.", source:"https://www.bucknell.edu/admissions-aid/apply-bucknell/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Trinity College", short:"Trinity", location:"Hartford, Connecticut", description:"An urban liberal-arts college offering close undergraduate teaching and access to internships in Connecticut's capital.", source:"https://www.trincoll.edu/admissions/apply/international/", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Skidmore College", short:"Skidmore", location:"Saratoga Springs, New York", description:"A liberal-arts college known for creative thought, studio arts, business and a wooded campus near downtown Saratoga Springs.", source:"https://www.skidmore.edu/admissions/apply/international.php", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Occidental College", short:"Occidental", location:"Los Angeles, California", description:"A small liberal-arts college in Los Angeles connecting a residential campus with research, arts and civic opportunities.", source:"https://www.oxy.edu/admission-aid/apply/international-students", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"Scripps College", short:"Scripps", location:"Claremont, California", description:"A women's liberal-arts college with a humanities core and full access to the Claremont Colleges consortium.", source:"https://www.scrippscollege.edu/admission/apply/international-applicants", aidShort:"Need-aware", feeWaiver:true }),
  directoryCollege({ name:"College of Wooster", short:"Wooster", location:"Wooster, Ohio", description:"A liberal-arts college distinguished by its mentored Independent Study program culminating in a major senior project.", source:"https://wooster.edu/admissions/apply/international/", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"Sewanee: The University of the South", short:"Sewanee", location:"Sewanee, Tennessee", description:"A small liberal-arts university set on a large mountain campus with strong writing, environmental and humanities programs.", source:"https://new.sewanee.edu/admission-aid/apply/international/", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"Furman University", short:"Furman", location:"Greenville, South Carolina", description:"A residential liberal-arts university emphasizing engaged learning, internships, research and a lakeside campus.", source:"https://www.furman.edu/admissions-aid/international-students/", aidShort:"Merit focus", feeWaiver:true }),
  directoryCollege({ name:"Rhodes College", short:"Rhodes", location:"Memphis, Tennessee", description:"A residential liberal-arts college with a Gothic campus and strong connections to health, culture and service in Memphis.", source:"https://www.rhodes.edu/admission-aid/apply-rhodes/international-students", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"University of Miami", short:"Miami", location:"Coral Gables, Florida", description:"A private research university with strengths in marine science, business, health, communication and the arts.", source:"https://admissions.miami.edu/undergraduate/application-process/international/index.html", aidShort:"Aid available", feeWaiver:true }),
  directoryCollege({ name:"Syracuse University", short:"Syracuse", location:"Syracuse, New York", description:"A large private university known for communication, public affairs, architecture, design and a broad professional curriculum.", source:"https://www.syracuse.edu/admissions-aid/application-process/international/", aidShort:"Merit focus", feeWaiver:true }),
  directoryCollege({ name:"George Washington University", short:"GW", location:"Washington, District of Columbia", description:"An urban research university whose location supports study and internships in policy, international affairs and public service.", source:"https://undergraduate.admissions.gwu.edu/international-applicants", aidShort:"Merit focus", feeWaiver:true })
];

const stateNames = {
  AL:"Alabama", AK:"Alaska", AZ:"Arizona", AR:"Arkansas", CA:"California", CO:"Colorado", CT:"Connecticut", DE:"Delaware", DC:"District of Columbia", FL:"Florida", GA:"Georgia", HI:"Hawaii", ID:"Idaho", IL:"Illinois", IN:"Indiana", IA:"Iowa", KS:"Kansas", KY:"Kentucky", LA:"Louisiana", ME:"Maine", MD:"Maryland", MA:"Massachusetts", MI:"Michigan", MN:"Minnesota", MS:"Mississippi", MO:"Missouri", MT:"Montana", NE:"Nebraska", NV:"Nevada", NH:"New Hampshire", NJ:"New Jersey", NM:"New Mexico", NY:"New York", NC:"North Carolina", ND:"North Dakota", OH:"Ohio", OK:"Oklahoma", OR:"Oregon", PA:"Pennsylvania", RI:"Rhode Island", SC:"South Carolina", SD:"South Dakota", TN:"Tennessee", TX:"Texas", UT:"Utah", VT:"Vermont", VA:"Virginia", WA:"Washington", WV:"West Virginia", WI:"Wisconsin", WY:"Wyoming",
  AS:"American Samoa", FM:"Federated States of Micronesia", GU:"Guam", MH:"Marshall Islands", MP:"Northern Mariana Islands", PR:"Puerto Rico", PW:"Palau", VI:"U.S. Virgin Islands"
};

const catalogNameKey = name => name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
const catalogShortName = name => {
  if (name.length <= 28) return name;
  const acronym = name.split(/\s+/).filter(word => !["of", "the", "at", "in", "and", "&"].includes(word.toLowerCase())).map(word => word[0]).join("").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return acronym.length >= 2 && acronym.length <= 10 ? acronym : `${name.slice(0, 27)}…`;
};
const existingCollegeNames = new Set(colleges.map(college => catalogNameKey(college.name)));
const catalogRows = globalThis.FullRideBasicColleges || [];
const catalogByName = new Map(catalogRows.map(row => [catalogNameKey(row[1]), row]));
const collegeMedia = globalThis.FullRideCollegeMedia || {};
const catalogNameAliases = new Map([
  [catalogNameKey("Columbia University"), catalogNameKey("Columbia University in the City of New York")],
  [catalogNameKey("Tulane University"), catalogNameKey("Tulane University of Louisiana")],
  [catalogNameKey("College of Wooster"), catalogNameKey("The College of Wooster")],
  [catalogNameKey("Sewanee: The University of the South"), catalogNameKey("The University of the South")]
]);
const claimedCatalogNames = new Set([...existingCollegeNames, ...catalogNameAliases.values()]);

// Hand-written records keep their reviewed admissions copy, while receiving the
// same exact-ID federal facts and licensed imagery as the generated directory.
colleges.forEach(college => {
  const nameKey = catalogNameKey(college.name);
  const catalogRow = catalogByName.get(catalogNameAliases.get(nameKey) || nameKey);
  if (catalogRow) {
    college.catalogId = college.catalogId || catalogRow[0];
    college.facts = college.facts || catalogRow[6] || null;
  }
});

catalogRows.forEach(([catalogId, name, city, stateCode, source, description, facts]) => {
  const nameKey = catalogNameKey(name);
  if (claimedCatalogNames.has(nameKey)) return;
  colleges.push(directoryCollege({
    catalogId,
    catalogOnly:true,
    descriptionPending:false,
    facts,
    name,
    short:catalogShortName(name),
    location:`${city}, ${stateNames[stateCode] || stateCode}`,
    description,
    source
  }));
});

const existingCatalogIds = new Set(colleges.map(college => String(college.catalogId || "")));
(globalThis.FullRideExtraColleges || []).forEach(([catalogId, name, city, stateCode, source, description, facts]) => {
  if (existingCatalogIds.has(String(catalogId))) return;
  colleges.push(directoryCollege({
    catalogId,
    catalogOnly:true,
    basicOnly:false,
    descriptionPending:false,
    predominantDegree:facts?.predominantDegree ?? null,
    highestDegree:facts?.highestDegree ?? null,
    facts,
    name,
    short:catalogShortName(name),
    location:`${city}, ${stateNames[stateCode] || stateCode}`,
    description,
    source
  }));
  existingCatalogIds.add(String(catalogId));
});

colleges.forEach(college => {
  const media = college.catalogId ? collegeMedia[String(college.catalogId)] : null;
  if (!media || college.photoIsIllustrative !== true) return;
  college.photo = media.photo;
  college.photoSource = media.photoSource;
  college.photoCredit = media.photoCredit;
  college.photoIsIllustrative = false;
});

const policyAudits = globalThis.FullRidePolicyAudits || {};
colleges.forEach(college => {
  const audit = college.catalogId ? policyAudits[String(college.catalogId)] : null;
  if (audit) Object.assign(college, audit);
});

const northeastStates = new Set(["Connecticut", "Maine", "Massachusetts", "New Hampshire", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont"]);
const midwestStates = new Set(["Illinois", "Indiana", "Iowa", "Kansas", "Michigan", "Minnesota", "Missouri", "Nebraska", "North Dakota", "Ohio", "South Dakota", "Wisconsin"]);
const westStates = new Set(["Alaska", "Arizona", "California", "Colorado", "Hawaii", "Idaho", "Montana", "Nevada", "New Mexico", "Oregon", "Utah", "Washington", "Wyoming"]);
const southStates = new Set(["Alabama", "Arkansas", "Delaware", "District of Columbia", "Florida", "Georgia", "Kentucky", "Louisiana", "Maryland", "Mississippi", "North Carolina", "Oklahoma", "South Carolina", "Tennessee", "Texas", "Virginia", "West Virginia"]);
const urbanCities = new Set(["Atlanta", "Baltimore", "Boston", "Cambridge", "Chicago", "Cleveland", "Houston", "Los Angeles", "Memphis", "Nashville", "New Orleans", "New York", "Philadelphia", "Pittsburgh", "Portland", "Providence", "Rochester", "Saint Paul", "St. Louis", "Syracuse", "Washington"]);
const suburbanCities = new Set(["Claremont", "Coral Gables", "Evanston", "Haverford", "Medford", "Pasadena", "Stanford", "Swarthmore", "Villanova", "Waltham", "Wellesley"]);
const specializedSchools = new Set(["Babson College", "California Institute of Technology", "Carnegie Mellon University", "Massachusetts Institute of Technology"]);

colleges.forEach(college => {
  const [city, state] = college.location.split(", ");
  const facts = college.facts || {};
  const text = `${college.name} ${college.description} ${(facts.topFields || []).join(" ")}`.toLowerCase();
  const slugBase = college.name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  college.slug = college.catalogOnly && college.catalogId ? `${slugBase}-${college.catalogId}` : college.short.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  college.state = state;
  college.region = northeastStates.has(state) ? "northeast" : midwestStates.has(state) ? "midwest" : westStates.has(state) ? "west" : southStates.has(state) ? "south" : "other";
  college.institutionType = specializedSchools.has(college.name) || (college.catalogOnly && Number.isFinite(facts.predominantDegree) && facts.predominantDegree <= 2) ? "specialized" : text.includes("liberal arts") ? "liberal-arts" : "research";
  college.setting = [11,12,13].includes(facts.locale) ? "urban" : [21,22,23].includes(facts.locale) ? "suburban" : [31,32,33].includes(facts.locale) ? "town" : [41,42,43].includes(facts.locale) ? "rural" : text.includes("rural") || text.includes("mountain") ? "rural" : urbanCities.has(city) || text.includes("urban") ? "urban" : suburbanCities.has(city) ? "suburban" : "town";
  college.aidCategory = !college.verified ? "unverified" : college.needBlind ? "need-blind" : college.aidShort.toLowerCase().includes("merit") ? "merit" : college.aidShort.toLowerCase().includes("limited") ? "limited" : "need-aware";
  college.focus = [];
  if (/engineering|science|technology|computer|mathematics|research/.test(text)) college.focus.push("stem");
  if (/business|management|entrepreneur|economics|commerce|finance/.test(text)) college.focus.push("business");
  if (/arts|design|film|music|drama|creative|architecture/.test(text)) college.focus.push("arts");
  if (/policy|government|international|social|humanities|journalism|communication/.test(text)) college.focus.push("social-sciences");
  if (/health|medicine|nursing|public health|life sciences/.test(text)) college.focus.push("health");
  if (!college.focus.length) college.focus.push("general");
});
