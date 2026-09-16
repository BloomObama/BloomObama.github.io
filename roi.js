const roiTranslations = {
  uk: {
    nav: "Калькулятор ROI", label: "Фінансовий сценарій", title: "Оцініть окупність освіти у США", intro: "Змініть вартість, допомогу та витрати — результат оновиться одразу.",
    major: "Спеціальність / Major", tuition: "Вартість навчання на рік", aid: "Фінансова допомога", living: "Витрати на проживання на рік",
    results: "Результат сценарію", total: "Загальна вартість за 4 роки", salary: "Очікувана стартова зарплата", breakEven: "Орієнтовна окупність",
    years: "років", method: "Розрахунок передбачає, що 30% стартової зарплати спрямовується на повернення вартості освіти.", disclaimer: "Орієнтовна модель · Зарплати є демонстраційними даними, а не фінансовою порадою."
  },
  ru: {
    nav: "Калькулятор ROI", label: "Финансовый сценарий", title: "Оцените окупаемость образования в США", intro: "Меняйте стоимость, помощь и расходы — результат обновляется мгновенно.",
    major: "Специальность / Major", tuition: "Стоимость обучения в год", aid: "Финансовая помощь", living: "Расходы на проживание в год",
    results: "Результат сценария", total: "Общая стоимость за 4 года", salary: "Ожидаемая стартовая зарплата", breakEven: "Ориентировочная окупаемость",
    years: "лет", method: "Расчёт предполагает, что 30% стартовой зарплаты направляется на погашение стоимости образования.", disclaimer: "Ориентировочная модель · Зарплаты являются демонстрационными данными, а не финансовой рекомендацией."
  },
  en: {
    nav: "ROI Calculator", label: "Financial scenario", title: "Estimate the ROI of a U.S. education", intro: "Adjust cost, aid and living expenses—the result updates instantly.",
    major: "Specialty / Major", tuition: "Tuition fee per year", aid: "Financial aid", living: "Living expenses per year",
    results: "Scenario result", total: "Total four-year cost", salary: "Projected starting salary", breakEven: "Estimated break-even point",
    years: "years", method: "The model assumes that 30% of starting salary is used to repay the cost of education.", disclaimer: "Illustrative model · Salary figures are mock data, not financial advice."
  }
};

const roiElement = (id) => document.getElementById(id);
const roiLocale = (lang) => ({ uk: "uk-UA", ru: "ru-RU", en: "en-US" }[lang] || "en-US");
const roiCurrency = (value, lang) => new Intl.NumberFormat(roiLocale(lang), { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function getRoiLanguage() {
  return typeof language === "string" && roiTranslations[language] ? language : "uk";
}

function populateRoiMajors(lang) {
  const select = roiElement("roi-major");
  if (!select) return;
  const selected = select.value || roiMajors[0].id;
  select.innerHTML = roiMajors.map(major => `<option value="${major.id}">${major[lang]}</option>`).join("");
  select.value = selected;
}

function calculateRoi() {
  const lang = getRoiLanguage();
  const major = roiMajors.find(item => item.id === roiElement("roi-major")?.value) || roiMajors[0];
  const tuition = Math.max(0, Number(roiElement("roi-tuition")?.value) || 0);
  const aid = Math.min(100, Math.max(0, Number(roiElement("roi-aid")?.value) || 0));
  const living = Math.max(0, Number(roiElement("roi-living")?.value) || 0);
  const total = (tuition * (1 - aid / 100) + living) * 4;
  const breakEven = total / (major.salary * 0.3);

  roiElement("roi-aid-value").textContent = `${aid}%`;
  roiElement("roi-aid").style.setProperty("--range-value", `${aid}%`);
  roiElement("roi-total").textContent = roiCurrency(total, lang);
  roiElement("roi-salary").textContent = roiCurrency(major.salary, lang);
  roiElement("roi-break-even").textContent = `${breakEven.toFixed(1)} ${roiTranslations[lang].years}`;
}

window.updateRoiLanguage = function updateRoiLanguage(nextLanguage = getRoiLanguage()) {
  const lang = roiTranslations[nextLanguage] ? nextLanguage : "uk";
  document.querySelectorAll("[data-roi-i18n]").forEach(element => {
    element.textContent = roiTranslations[lang][element.dataset.roiI18n];
  });
  populateRoiMajors(lang);
  calculateRoi();
};

["roi-major", "roi-tuition", "roi-aid", "roi-living"].forEach(id => {
  roiElement(id)?.addEventListener("input", calculateRoi);
});

window.updateRoiLanguage(getRoiLanguage());
