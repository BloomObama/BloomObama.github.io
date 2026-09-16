const profileTranslations = {
  uk: {
    back:"До пошуку", verified:"Перевірено 16.09.2026", pending:"Очікує повної перевірки", cycle:"Дані набору", applications:"Заявок", admitted:"Зараховано", enrolled:"Вступили", international:"International", aidStat:"Фінансова допомога", statsSource:"Джерело статистики ↗", policies:"Умови подачі", aid:"Фінансова допомога", testing:"Тести", english:"Англійська", fee:"Application fee", deadline:"Дедлайни", source:"Джерело ↗", checklist:"Що перевірити перед подачею", checklistIntro:"Короткий робочий список. Точний перелік документів завжди звіряйте з офіційним checklist.", checkApplication:"Application та university supplement", checkTranscript:"Transcript, school report і завірений переклад", checkRecommendations:"Рекомендації вчителів і counselor", checkTests:"SAT/ACT або дозволена альтернатива", checkEnglish:"Підтвердження англійської, якщо потрібне", checkAid:"CSS Profile / ISFAA та фінансові документи", checkFee:"Application fee або підтверджений waiver", checkDeadlines:"Окремі дедлайни admission і financial aid", gallery:"Кампус", illustrativeGallery:"Візуальна довідка", illustrative:"Ілюстративне фото університетського середовища", galleryNote:"Фотографії ведуть на сторінки правовласників або ліцензійні джерела.", sources:"Офіційні джерела", officialApply:"Відкрити admissions", unavailable:"Університет не знайдено", unavailableText:"Поверніться до пошуку та відкрийте картку ще раз.", fullRideNote:"Важливо: «повна стипендія» не є єдиним стандартним показником. Need-based пакет розраховується індивідуально, тому ми показуємо тільки ту статистику допомоги, яку університет опублікував сам.", pendingNotice:"Політики цього профілю ще не пройшли повний аудит на цикл 2026–27. Посилання офіційне, але цифри та умови не видаються за перевірені.", footerTagline:"Дані з першоджерел, а не з рейтингів.", footer:"Перевіряйте умови перед подачею"
  },
  ru: {
    back:"К поиску", verified:"Проверено 16.09.2026", pending:"Ожидает полной проверки", cycle:"Данные набора", applications:"Заявок", admitted:"Зачислено", enrolled:"Поступили", international:"International", aidStat:"Финансовая помощь", statsSource:"Источник статистики ↗", policies:"Условия подачи", aid:"Финансовая помощь", testing:"Тесты", english:"Английский", fee:"Application fee", deadline:"Дедлайны", source:"Источник ↗", checklist:"Что проверить перед подачей", checklistIntro:"Короткий рабочий список. Точный перечень документов всегда сверяйте с официальным checklist.", checkApplication:"Application и university supplement", checkTranscript:"Transcript, school report и заверенный перевод", checkRecommendations:"Рекомендации учителей и counselor", checkTests:"SAT/ACT или разрешённая альтернатива", checkEnglish:"Подтверждение английского, если требуется", checkAid:"CSS Profile / ISFAA и финансовые документы", checkFee:"Application fee или подтверждённый waiver", checkDeadlines:"Отдельные дедлайны admission и financial aid", gallery:"Кампус", illustrativeGallery:"Визуальная справка", illustrative:"Иллюстративное фото университетской среды", galleryNote:"Фотографии ведут на страницы правообладателей или лицензионные источники.", sources:"Официальные источники", officialApply:"Открыть admissions", unavailable:"Университет не найден", unavailableText:"Вернитесь к поиску и откройте карточку ещё раз.", fullRideNote:"Важно: «полная стипендия» — не единый стандартный показатель. Need-based пакет рассчитывается индивидуально, поэтому мы показываем только ту статистику помощи, которую опубликовал сам университет.", pendingNotice:"Политики этого профиля ещё не прошли полный аудит на цикл 2026–27. Ссылка официальная, но цифры и условия не выдаются за проверенные.", footerTagline:"Данные из первоисточников, а не из рейтингов.", footer:"Проверяйте условия перед подачей"
  },
  en: {
    back:"Back to finder", verified:"Verified Sep 16, 2026", pending:"Full audit pending", cycle:"Admission data", applications:"Applications", admitted:"Admitted", enrolled:"Enrolled", international:"International", aidStat:"Financial aid", statsSource:"Statistics source ↗", policies:"Application policies", aid:"Financial aid", testing:"Testing", english:"English", fee:"Application fee", deadline:"Deadlines", source:"Source ↗", checklist:"What to verify before applying", checklistIntro:"A practical starting list. Always compare it with the university's official checklist.", checkApplication:"Application and university supplement", checkTranscript:"Transcript, school report and certified translation", checkRecommendations:"Teacher and counselor recommendations", checkTests:"SAT/ACT or an allowed alternative", checkEnglish:"English proficiency evidence, if required", checkAid:"CSS Profile / ISFAA and financial documents", checkFee:"Application fee or confirmed waiver", checkDeadlines:"Separate admission and financial-aid deadlines", gallery:"Campus", illustrativeGallery:"Visual reference", illustrative:"Illustrative university environment", galleryNote:"Each image links to its owner or licensing source.", sources:"Official sources", officialApply:"Open admissions", unavailable:"University not found", unavailableText:"Return to the finder and open the card again.", fullRideNote:"Important: a ‘full scholarship’ is not a single standardized metric. Need-based awards are calculated individually, so we show only aid figures the institution publishes itself.", pendingNotice:"This profile has not completed the 2026–27 policy audit. The link is official, but figures and requirements are not presented as verified.", footerTagline:"Primary sources, not rankings.", footer:"Verify requirements before applying"
  }
};

Object.assign(profileTranslations.uk, { notAvailableYet:"Поки немає інформації." });
Object.assign(profileTranslations.ru, { notAvailableYet:"Пока нет информации." });
Object.assign(profileTranslations.en, { notAvailableYet:"Information is not available yet." });
Object.assign(profileTranslations.uk, { federalCycle:"Останні доступні федеральні дані", undergraduateEnrollment:"Студентів бакалаврату", admissionRate:"Частка зарахованих", nonresidentShare:"Студенти-нерезиденти", averageSat:"Середній SAT", federalContext:"Вартість та результати", tuitionOut:"Навчання для студентів не зі штату", tuitionIn:"Навчання для резидентів штату", annualCost:"Орієнтовна річна вартість", retentionRate:"Утримання після першого року", completionRate:"Завершення програми", federalNoData:"У вибраних федеральних полях дані не опубліковані.", scorecardCaveat:"College Scorecard об’єднує показники з різних звітних років. Це довідкові дані закладу, а не умови вступної кампанії 2026–27. Нерезиденти США — найближчий доступний федеральний показник для international-контексту, але не статистика іноземних абітурієнтів.", scorecardSource:"College Scorecard ↗" });
Object.assign(profileTranslations.ru, { federalCycle:"Последние доступные федеральные данные", undergraduateEnrollment:"Студентов бакалавриата", admissionRate:"Доля зачисленных", nonresidentShare:"Студенты-нерезиденты", averageSat:"Средний SAT", federalContext:"Стоимость и результаты", tuitionOut:"Обучение для студентов не из штата", tuitionIn:"Обучение для резидентов штата", annualCost:"Ориентировочная годовая стоимость", retentionRate:"Удержание после первого года", completionRate:"Завершение программы", federalNoData:"В выбранных федеральных полях данные не опубликованы.", scorecardCaveat:"College Scorecard объединяет показатели из разных отчётных лет. Это справочные данные учебного заведения, а не условия приёмной кампании 2026–27. Нерезиденты США — ближайший доступный федеральный показатель для international-контекста, но не статистика иностранных абитуриентов.", scorecardSource:"College Scorecard ↗" });
Object.assign(profileTranslations.en, { federalCycle:"Latest available federal data", undergraduateEnrollment:"Undergraduate enrollment", admissionRate:"Admission rate", nonresidentShare:"Nonresident students", averageSat:"Average SAT", federalContext:"Cost and outcomes", tuitionOut:"Out-of-state tuition", tuitionIn:"In-state tuition", annualCost:"Estimated annual cost", retentionRate:"First-year retention", completionRate:"Completion rate", federalNoData:"The selected federal fields were not reported.", scorecardCaveat:"College Scorecard combines measures from different reporting years. These are institutional reference data, not 2026–27 admissions-cycle rules. Nonresident students are the closest available federal measure for international context, but they are not international-applicant statistics.", scorecardSource:"College Scorecard ↗" });
Object.assign(profileTranslations.uk, { basicRecordNote:"У базі підтверджені лише офіційна назва, місце розташування, IPEDS ID та сайт закладу. Решту інформації буде додано пізніше.", officialSite:"Офіційний сайт" });
Object.assign(profileTranslations.ru, { basicRecordNote:"В базе подтверждены только официальное название, местоположение, IPEDS ID и сайт учебного заведения. Остальная информация будет добавлена позже.", officialSite:"Официальный сайт" });
Object.assign(profileTranslations.en, { basicRecordNote:"Only the official name, location, IPEDS ID and institution website are confirmed in this basic record. More information will be added later.", officialSite:"Official website" });
Object.assign(profileTranslations.uk, { federalPassport:"Федеральний паспорт закладу", ownership:"Тип власності", publicInstitution:"Державний", nonprofitInstitution:"Приватний неприбутковий", forProfitInstitution:"Приватний комерційний", awardLevel:"Основний рівень програм", certificateLevel:"Сертифікатні програми", associateLevel:"Associate degree", bachelorLevel:"Bachelor's degree", graduateLevel:"Graduate degree", campusSetting:"Середовище", distanceOnly:"Тільки дистанційне навчання", openAdmission:"Відкритий прийом", actMidpoint:"ACT · середній діапазон", pellShare:"Отримують Pell Grant", federalLoanShare:"Беруть федеральні позики", studentFacultyRatio:"Студентів на викладача", medianEarnings10:"Медіанний дохід через 10 років", medianDebt:"Медіанний федеральний борг", netPrice:"Середня net price", topPrograms:"Найбільші напрями", priceCalculator:"Калькулятор net price", notReported:"Не опубліковано" });
Object.assign(profileTranslations.ru, { federalPassport:"Федеральный паспорт учреждения", ownership:"Форма собственности", publicInstitution:"Государственное", nonprofitInstitution:"Частное некоммерческое", forProfitInstitution:"Частное коммерческое", awardLevel:"Основной уровень программ", certificateLevel:"Сертификатные программы", associateLevel:"Associate degree", bachelorLevel:"Bachelor's degree", graduateLevel:"Graduate degree", campusSetting:"Среда", distanceOnly:"Только дистанционное обучение", openAdmission:"Открытый приём", actMidpoint:"ACT · середина диапазона", pellShare:"Получают Pell Grant", federalLoanShare:"Берут федеральные займы", studentFacultyRatio:"Студентов на преподавателя", medianEarnings10:"Медианный доход через 10 лет", medianDebt:"Медианный федеральный долг", netPrice:"Средняя net price", topPrograms:"Крупнейшие направления", priceCalculator:"Калькулятор net price", notReported:"Не опубликовано" });
Object.assign(profileTranslations.en, { federalPassport:"Federal institution snapshot", ownership:"Ownership", publicInstitution:"Public", nonprofitInstitution:"Private nonprofit", forProfitInstitution:"Private for-profit", awardLevel:"Predominant award level", certificateLevel:"Certificate programs", associateLevel:"Associate degree", bachelorLevel:"Bachelor's degree", graduateLevel:"Graduate degree", campusSetting:"Setting", distanceOnly:"Distance education only", openAdmission:"Open admission", actMidpoint:"ACT midpoint", pellShare:"Receive Pell Grants", federalLoanShare:"Take federal loans", studentFacultyRatio:"Students per faculty member", medianEarnings10:"Median earnings after 10 years", medianDebt:"Median federal debt", netPrice:"Average net price", topPrograms:"Largest program areas", priceCalculator:"Net price calculator", notReported:"Not reported" });

const params = new URLSearchParams(location.search);
let profileLanguage = ["uk","ru","en"].includes(params.get("lang")) ? params.get("lang") : "uk";
const profileT = key => profileTranslations[profileLanguage][key] || key;
const college = colleges.find(item => item.slug === params.get("id"));
const profile = college ? collegeProfiles[college.slug] : null;

const hasValue = value => value !== null && value !== undefined && value !== "";
const scorecardUrl = item => item?.catalogId ? `https://collegescorecard.ed.gov/school/?${item.catalogId}` : item?.source;
const formatNumber = value => hasValue(value) ? new Intl.NumberFormat(profileLanguage === "en" ? "en-US" : profileLanguage === "uk" ? "uk-UA" : "ru-RU").format(value) : "—";
const formatPercent = value => hasValue(value) ? new Intl.NumberFormat(profileLanguage === "en" ? "en-US" : profileLanguage === "uk" ? "uk-UA" : "ru-RU", { style:"percent", maximumFractionDigits:1 }).format(value) : "—";
const formatCurrency = value => hasValue(value) ? new Intl.NumberFormat(profileLanguage === "en" ? "en-US" : profileLanguage === "uk" ? "uk-UA" : "ru-RU", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(value) : "—";
const safeExternalUrl = value => !value ? "" : /^https?:\/\//i.test(value) ? value : `https://${value}`;
const ownershipLabel = value => profileT(value === 1 ? "publicInstitution" : value === 2 ? "nonprofitInstitution" : value === 3 ? "forProfitInstitution" : "notReported");
const degreeLabel = value => profileT(value === 1 ? "certificateLevel" : value === 2 ? "associateLevel" : value === 3 ? "bachelorLevel" : value === 4 ? "graduateLevel" : "notReported");
const localeLabels = {
  uk:{11:"Велике місто",12:"Середнє місто",13:"Мале місто",21:"Велике передмістя",22:"Середнє передмістя",23:"Мале передмістя",31:"Містечко біля міста",32:"Віддалене містечко",33:"Віддалене мале місто",41:"Сільська місцевість біля міста",42:"Віддалена сільська місцевість",43:"Дуже віддалена сільська місцевість"},
  ru:{11:"Большой город",12:"Средний город",13:"Малый город",21:"Большой пригород",22:"Средний пригород",23:"Малый пригород",31:"Городок рядом с городом",32:"Удалённый городок",33:"Удалённый малый город",41:"Сельская местность рядом с городом",42:"Удалённая сельская местность",43:"Очень удалённая сельская местность"},
  en:{11:"Large city",12:"Midsize city",13:"Small city",21:"Large suburb",22:"Midsize suburb",23:"Small suburb",31:"Town near an urban area",32:"Distant town",33:"Remote town",41:"Rural area near a town",42:"Distant rural area",43:"Remote rural area"}
};
const settingLabel = facts => facts.distanceOnly === 1 ? profileT("distanceOnly") : localeLabels[profileLanguage][facts.locale] || profileT("notReported");

function federalSummary(facts = {}) {
  const parts = [];
  if (hasValue(facts.tuitionOut)) parts.push(`${profileT("tuitionOut")}: ${formatCurrency(facts.tuitionOut)}`);
  else if (hasValue(facts.tuitionIn)) parts.push(`${profileT("tuitionIn")}: ${formatCurrency(facts.tuitionIn)}`);
  else if (hasValue(facts.programTuition)) parts.push(`${profileT("tuitionIn")}: ${formatCurrency(facts.programTuition)}`);
  if (hasValue(facts.annualCost)) parts.push(`${profileT("annualCost")}: ${formatCurrency(facts.annualCost)}`);
  const netPrice = facts.control === 1 ? facts.netPricePublic : facts.netPricePrivate;
  if (hasValue(netPrice)) parts.push(`${profileT("netPrice")}: ${formatCurrency(netPrice)}`);
  if (hasValue(facts.retentionRate)) parts.push(`${profileT("retentionRate")}: ${formatPercent(facts.retentionRate)}`);
  if (hasValue(facts.completionRate)) parts.push(`${profileT("completionRate")}: ${formatPercent(facts.completionRate)}`);
  return parts.length ? `${parts.join(" · ")}.` : profileT("federalNoData");
}

function federalDetailCells(facts = {}) {
  const netPrice = facts.control === 1 ? facts.netPricePublic : facts.netPricePrivate;
  const cells = [
    [profileT("ownership"), ownershipLabel(facts.control), hasValue(facts.control)],
    [profileT("awardLevel"), degreeLabel(facts.predominantDegree), hasValue(facts.predominantDegree)],
    [profileT("campusSetting"), settingLabel(facts), hasValue(facts.locale) || facts.distanceOnly === 1],
    [profileT("actMidpoint"), formatNumber(facts.actMidpoint), hasValue(facts.actMidpoint)],
    [profileT("pellShare"), formatPercent(facts.pellShare), hasValue(facts.pellShare)],
    [profileT("federalLoanShare"), formatPercent(facts.federalLoanShare), hasValue(facts.federalLoanShare)],
    [profileT("studentFacultyRatio"), hasValue(facts.studentFacultyRatio) ? `${formatNumber(facts.studentFacultyRatio)}:1` : "—", hasValue(facts.studentFacultyRatio)],
    [profileT("medianEarnings10"), formatCurrency(facts.medianEarnings10), hasValue(facts.medianEarnings10)],
    [profileT("medianDebt"), formatCurrency(facts.medianDebt), hasValue(facts.medianDebt)],
    [profileT("netPrice"), formatCurrency(netPrice), hasValue(netPrice)],
    [profileT("topPrograms"), Array.isArray(facts.topFields) ? facts.topFields.join(" · ") : "—", Array.isArray(facts.topFields) && facts.topFields.length]
  ];
  return cells.filter(([, , available]) => available);
}

function sourceLinks(item) {
  if (item.basicOnly) return `<a href="${item.source}" target="_blank" rel="noopener noreferrer"><span>${profileT("officialSite")}</span><b>↗</b></a>`;
  const candidates = [
    [profileT("aid"), item.aidSource], [profileT("testing"), item.testingSource], [profileT("english"), item.englishSource],
    [profileT("fee"), item.feeSource], [profileT("deadline"), item.deadlineSource], ["Admissions", item.source],
    [profileT("priceCalculator"), safeExternalUrl(item.facts?.priceCalculator)]
  ];
  const seen = new Set();
  return candidates.filter(([,url]) => url && !seen.has(url) && seen.add(url)).map(([label,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><span>${label}</span><b>↗</b></a>`).join("");
}

function policyRow(label, value, url) {
  return `<article><span>${label}</span><p>${value}</p><a href="${url}" target="_blank" rel="noopener noreferrer">${profileT("source")}</a></article>`;
}

function renderProfile() {
  document.documentElement.lang = profileLanguage;
  document.querySelectorAll("[data-profile-i18n]").forEach(element => { element.textContent = profileT(element.dataset.profileI18n); });
  document.querySelectorAll("[data-profile-lang]").forEach(button => button.classList.toggle("active", button.dataset.profileLang === profileLanguage));
  if (!college) {
    document.title = `${profileT("unavailable")} — FullRide UA`;
    document.getElementById("profile-root").innerHTML = `<section class="profile-missing"><span>404</span><h1>${profileT("unavailable")}</h1><p>${profileT("unavailableText")}</p><a href="index.html#finder">${profileT("back")}</a></section>`;
    return;
  }

  document.title = `${college.name} — FullRide UA`;
  const facts = college.facts || {};
  const hasFederalFacts = Object.values(facts).some(hasValue);
  const stats = profile || { cycle:hasFederalFacts ? profileT("federalCycle") : profileT("notAvailableYet"), aidSnapshot:hasFederalFacts ? federalSummary(facts) : profileT("notAvailableYet"), statsSource:hasFederalFacts ? scorecardUrl(college) : college.source, gallery:[] };
  const statCells = profile ? [
    [stats.applications, profileT("applications")], [stats.admitted, profileT("admitted")], [stats.enrolled, profileT("enrolled")], [stats.international, profileT("international")]
  ] : [
    [formatNumber(facts.enrollment), profileT("undergraduateEnrollment")],
    [hasValue(facts.admissionRate) ? formatPercent(facts.admissionRate) : facts.openAdmissions === 1 ? profileT("openAdmission") : "—", profileT("admissionRate")],
    [formatPercent(facts.nonresidentShare), profileT("nonresidentShare")],
    [formatNumber(facts.satAverage), profileT("averageSat")]
  ];
  const detailCells = federalDetailCells(facts);
  const gallery = [{ url:college.photo, source:college.photoSource, credit:college.photoIsIllustrative ? profileT("illustrative") : college.photoCredit }, ...(stats.gallery || [])]
    .filter((image, index, array) => image.url && array.findIndex(candidate => candidate.url === image.url) === index);
  const checklist = ["checkApplication","checkTranscript","checkRecommendations","checkTests","checkEnglish","checkAid","checkFee","checkDeadlines"];

  document.getElementById("profile-root").innerHTML = `
    <section class="profile-hero" style="--profile-photo:url('${college.photo}')">
      <div class="profile-hero-shade"></div>
      <div class="profile-hero-content">
        <span class="profile-status ${college.verified ? "is-verified" : "is-pending"}">${profileT(college.verified ? "verified" : "pending")}</span>
        <p>${college.location}</p><h1>${college.name}</h1><p class="profile-lede">${college.descriptionPending ? profileT("notAvailableYet") : college.description}</p>
        <a class="profile-primary" href="${college.source}" target="_blank" rel="noopener noreferrer">${profileT(college.basicOnly ? "officialSite" : "officialApply")} <span>↗</span></a>
      </div>
    </section>

    ${college.verified ? "" : `<div class="profile-notice">${profileT("pendingNotice")}</div>`}

    <section class="profile-section profile-stats" aria-labelledby="stats-title">
      <div class="profile-section-heading"><div><p>01 / ${profileT("cycle")}</p><h2 id="stats-title">${stats.cycle}</h2></div>${college.basicOnly ? "" : `<a href="${stats.statsSource}" target="_blank" rel="noopener noreferrer">${profileT("statsSource")}</a>`}</div>
      <div class="profile-stat-grid">
        ${statCells.map(([value,label]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join("")}
      </div>
      <div class="profile-aid-note"><span>${profileT(profile ? "aidStat" : college.basicOnly ? "cycle" : "federalContext")}</span><p>${stats.aidSnapshot}</p></div>
      ${detailCells.length ? `<div class="profile-fact-wrap"><h3>${profileT("federalPassport")}</h3><div class="profile-fact-grid">${detailCells.map(([label,value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("")}</div></div>` : ""}
      ${profile && detailCells.length ? `<p class="profile-fineprint">${profileT("scorecardCaveat")}</p>` : ""}
      <p class="profile-fineprint">${profileT(profile ? "fullRideNote" : college.basicOnly ? "basicRecordNote" : "scorecardCaveat")}</p>
    </section>

    <section class="profile-section" aria-labelledby="policies-title">
      <div class="profile-section-heading"><div><p>02 / ${profileT("policies")}</p><h2 id="policies-title">${profileT("policies")}</h2></div></div>
      <div class="profile-policy-grid">
        ${policyRow(profileT("aid"), college.verified ? college.aid : profileT("notAvailableYet"), college.aidSource)}
        ${policyRow(profileT("testing"), college.verified ? college.testing : profileT("notAvailableYet"), college.testingSource)}
        ${policyRow(profileT("english"), college.verified ? college.english : profileT("notAvailableYet"), college.englishSource)}
        ${policyRow(profileT("fee"), college.verified ? college.fee : profileT("notAvailableYet"), college.feeSource)}
        ${policyRow(profileT("deadline"), college.verified ? college.deadline : profileT("notAvailableYet"), college.deadlineSource)}
      </div>
    </section>

    <section class="profile-section profile-checklist" aria-labelledby="checklist-title">
      <div class="profile-section-heading"><div><p>03 / Checklist</p><h2 id="checklist-title">${profileT("checklist")}</h2></div><p>${profileT("checklistIntro")}</p></div>
      <ol>${checklist.map((key,index) => `<li><span>${String(index + 1).padStart(2,"0")}</span><p>${profileT(key)}</p></li>`).join("")}</ol>
    </section>

    <section class="profile-section" aria-labelledby="gallery-title">
      <div class="profile-section-heading"><div><p>04 / Visual</p><h2 id="gallery-title">${profileT(college.photoIsIllustrative ? "illustrativeGallery" : "gallery")}</h2></div><p>${profileT("galleryNote")}</p></div>
      <div class="profile-gallery ${gallery.length === 1 ? "is-single" : ""}">${gallery.map((image,index) => `<a href="${image.source}" target="_blank" rel="noopener noreferrer" class="gallery-image gallery-image--${index + 1}" style="--gallery:url('${image.url}')"><span>${image.credit} ↗</span></a>`).join("")}</div>
    </section>

    <section class="profile-section profile-sources" aria-labelledby="sources-title">
      <div class="profile-section-heading"><div><p>05 / Sources</p><h2 id="sources-title">${profileT("sources")}</h2></div></div>
      <div class="profile-source-list">${sourceLinks(college)}${profile ? `<a href="${profile.statsSource}" target="_blank" rel="noopener noreferrer"><span>${profileT("statsSource").replace(" ↗","")}</span><b>↗</b></a>` : ""}${hasFederalFacts ? `<a href="${scorecardUrl(college)}" target="_blank" rel="noopener noreferrer"><span>${profileT("scorecardSource").replace(" ↗","")}</span><b>↗</b></a>` : ""}</div>
    </section>`;
}

document.querySelectorAll("[data-profile-lang]").forEach(button => button.addEventListener("click", () => { profileLanguage = button.dataset.profileLang; renderProfile(); }));
renderProfile();
