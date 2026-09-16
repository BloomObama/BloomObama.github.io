const collegeProfiles = {
  mit: {
    cycle: "Class of 2029 · fall 2025",
    applications: "29,281", admitted: "1,334", enrolled: "1,155", international: "136 international admits",
    aidSnapshot: "57% of full-time undergraduates received an MIT Scholarship in 2024–25; 39.47% received grants at least equal to tuition. MIT meets 100% of demonstrated need.",
    statsSource: "https://mitadmissions.org/apply/process/stats/",
    gallery: [
      { url:"https://news.mit.edu/sites/default/files/images/201510/MIT-Climate-Strategy.jpg", source:"https://news.mit.edu/2015/new-climate-change-strategy-1021", credit:"MIT News" },
      { url:"https://alum.mit.edu/sites/default/files/images/Slice_19.03.20_campus_2.jpg", source:"https://alum.mit.edu/slice/us-news-grad-rankings-mit-1-engineering-23-more", credit:"MIT Alumni Association" }
    ]
  },
  harvard: {
    cycle: "Class of 2029 · fall 2025",
    applications: "47,893", admitted: "2,003", enrolled: "1,675", international: "16% of the enrolled class",
    aidSnapshot: "55% of the class receives need-based scholarships; a separate ‘full scholarship’ count is not published.",
    statsSource: "https://college.harvard.edu/admissions/admissions-statistics",
    gallery: [
      { url:"https://upload.wikimedia.org/wikipedia/commons/0/0b/Harvard_University_main_campus_aerial.JPG", source:"https://commons.wikimedia.org/wiki/File:Harvard_University_main_campus_aerial.JPG", credit:"Dllu · CC BY-SA 4.0" },
      { url:"https://upload.wikimedia.org/wikipedia/commons/e/e7/Harvard_Yard_aerial.JPG", source:"https://commons.wikimedia.org/wiki/File:Harvard_Yard_aerial.JPG", credit:"Dllu · CC BY-SA 4.0" }
    ]
  },
  yale: {
    cycle: "Class of 2029 · 2025 admission round",
    applications: "50,228", admitted: "2,308", enrolled: "1,640 planned", international: "Admits represented 65 countries",
    aidSnapshot: "55% of Yale College students receive need-based Yale Scholarships; Yale does not publish a ‘full ride’ recipient count.",
    statsSource: "https://news.yale.edu/2025/03/27/yale-admits-2308-applicants-class-2029",
    gallery: [
      { url:"https://gsas.yale.edu/sites/default/files/2023-10/Yale%20campus.jpg", source:"https://gsas.yale.edu/faculty-and-staff", credit:"Yale University" }
    ]
  },
  princeton: {
    cycle: "Class of 2029 · fall 2025",
    applications: "42,303", admitted: "1,868", enrolled: "1,408", international: "199 enrolled · 14.1%",
    aidSnapshot: "Princeton meets 100% of demonstrated need with grant aid; it does not publish a separate count of ‘full rides’.",
    statsSource: "https://profile.princeton.edu/admission-and-costs",
    gallery: []
  },
  dartmouth: {
    cycle: "Class of 2029 · fall 2025",
    applications: "28,230", admitted: "1,699", enrolled: "1,205", international: "A separate enrolled count was not published in the class profile",
    aidSnapshot: "27% of admitted students qualified for free tuition; the average offered need-based award was $70,607.",
    statsSource: "https://admissions.dartmouth.edu/sites/admissions.prod/files/admissions/wysiwyg/class29profile_fin.pdf",
    gallery: []
  },
  brown: {
    cycle: "Class of 2029 · 2025 admission round",
    applications: "42,765", admitted: "2,418", enrolled: "Not published in the March release", international: "Admits represented 89 nations",
    aidSnapshot: "73% of admitted students intended to apply for aid; Brown meets 100% of demonstrated need for students who enroll.",
    statsSource: "https://www.brown.edu/news/2025-03-27/admitted",
    gallery: [
      { url:"https://www.brown.edu/sites/default/files/styles/wide_xlrg/public/2019-04/20131022-PAUR-Aerials-0049_1.jpg?h=dde9a48b&itok=N7dkaSqX", source:"https://www.brown.edu/news/2017-03-09/report", credit:"Brown University" },
      { url:"https://www.brown.edu/sites/default/files/styles/wide_lrg/public/2022-05/20211013_BrownAerials_180_0.jpg?h=f8cf787c&itok=XUJlWXlE", source:"https://www.brown.edu/news/2022-05-24/acknowledgment", credit:"Brown University" }
    ]
  },
  "notre-dame": {
    cycle: "Class of 2029 · fall 2025",
    applications: "35,401", admitted: "9% admit rate", enrolled: "Official total not shown on the profile page", international: "8% of the enrolled class",
    aidSnapshot: "52% receive need-based aid and 70% receive some form of financial aid; a ‘full scholarship’ count is not published.",
    statsSource: "https://www.nd.edu/admissions/",
    gallery: [
      { url:"https://procurement.nd.edu/assets/566625/1600x800/university_of_notre_dame_campus_aerial_looking_southwest.jpg", source:"https://procurement.nd.edu/", credit:"University of Notre Dame" },
      { url:"https://news.nd.edu/assets/631854/1200x800/bj_102823_main_quad_aerialjpg.jpg", source:"https://news.nd.edu/", credit:"University of Notre Dame" }
    ]
  },
  amherst: {
    cycle: "Class of 2029 · fall 2025",
    applications: "Not published on the current admissions pages", admitted: "Not published", enrolled: "Not published", international: "Not published",
    aidSnapshot: "Amherst confirms need-blind admission and 100% of calculated need, but a 2025 ‘full scholarship’ count is not publicly reported.",
    statsSource: "https://www.amherst.edu/admission/apply/international",
    gallery: []
  },
  bowdoin: {
    cycle: "Class of 2029 · fall 2025",
    applications: "14,045", admitted: "957", enrolled: "515", international: "26 enrolled international students · 5.0%",
    aidSnapshot: "268 matriculants (52%) received need-based aid; 24% of aided students had a $0 family contribution.",
    statsSource: "https://www.bowdoin.edu/ir/data/",
    gallery: []
  },
  wandl: {
    cycle: "Class of 2029 · fall 2025",
    applications: "8,969", admitted: "1,216", enrolled: "499", international: "9% of the enrolled class",
    aidSnapshot: "63% received W&L grant assistance; 10% were Johnson Scholars. The profile does not equate every award with a full ride.",
    statsSource: "https://www.wlu.edu/admissions/apply/new-class-profile",
    gallery: [
      { url:"https://live.staticflickr.com/5350/9143905180_c723b6e7cb.jpg", source:"https://www.flickr.com/photos/wlunews/9143905180", credit:"Washington and Lee University" }
    ]
  }
};
