const roiTranslations = {
  uk: {
    nav:"Калькулятор витрат", label:"Фінансовий план", title:"Оцініть повну вартість навчання у США", intro:"Порахуйте окупність освіти або окремо складіть бюджет на документи, візу, переліт і перші витрати.",
    openButton:"Відкрити калькулятор", closeButton:"Закрити калькулятор", bannerMeta:"30 спеціальностей · 2 фінансові сценарії · миттєвий розрахунок", educationTab:"Освіта та окупність", arrivalTab:"Вступ і переїзд",
    major:"Спеціальність / Major", tuition:"Вартість навчання на рік", aid:"Фінансова допомога", living:"Проживання на рік", duration:"Тривалість програми", repayment:"Частка зарплати на повернення витрат",
    results:"Результат сценарію", total:"Повна вартість програми", annual:"Вартість одного року після допомоги", salary:"Очікувана стартова зарплата", breakEven:"Орієнтовна окупність", years:"років",
    method:"Окупність = повна вартість ÷ обрана частка стартової зарплати. Податки, зростання зарплати, інфляція та відсотки за кредитом не враховані.",
    residence:"Країна вильоту", citizenship:"Країна громадянства", visaStatus:"Візова ситуація", applications:"Кількість заявок", applicationFee:"Середній application fee", documents:"Переклади та документи", flight:"Переліт і багаж", insurance:"Страхування на дорогу", setup:"Перші витрати після приїзду",
    moveResult:"Бюджет до початку навчання", moveTotal:"Разом до прибуття", applicationsTotal:"Подача заявок", documentsTotal:"Документи", visaTotal:"Віза та SEVIS", travelTotal:"Дорога й облаштування",
    moveMethod:"Оцінки документів і перельоту залежать від країни та доступних маршрутів. Поля можна змінити вручну під власні ціни.",
    disclaimer:"Орієнтовна модель · Зарплати, переліт і супутні витрати є демонстраційними оцінками, а не фінансовою чи імміграційною порадою.", officialFees:"Офіційні збори F-1: visa application — $185, I-901 SEVIS — $350. Перевірити джерела"
  },
  ru: {
    nav:"Калькулятор расходов", label:"Финансовый план", title:"Оцените полную стоимость обучения в США", intro:"Рассчитайте окупаемость образования или отдельно соберите бюджет на документы, визу, перелёт и первые расходы.",
    openButton:"Открыть калькулятор", closeButton:"Закрыть калькулятор", bannerMeta:"30 специальностей · 2 финансовых сценария · мгновенный расчёт", educationTab:"Образование и окупаемость", arrivalTab:"Поступление и переезд",
    major:"Специальность / Major", tuition:"Стоимость обучения в год", aid:"Финансовая помощь", living:"Проживание в год", duration:"Продолжительность программы", repayment:"Доля зарплаты на возврат расходов",
    results:"Результат сценария", total:"Полная стоимость программы", annual:"Стоимость одного года после помощи", salary:"Ожидаемая стартовая зарплата", breakEven:"Ориентировочная окупаемость", years:"лет",
    method:"Окупаемость = полная стоимость ÷ выбранная доля стартовой зарплаты. Налоги, рост зарплаты, инфляция и проценты по кредиту не учтены.",
    residence:"Страна вылета", citizenship:"Страна гражданства", visaStatus:"Визовая ситуация", applications:"Количество заявок", applicationFee:"Средний application fee", documents:"Переводы и документы", flight:"Перелёт и багаж", insurance:"Страхование на дорогу", setup:"Первые расходы после приезда",
    moveResult:"Бюджет до начала учёбы", moveTotal:"Всего до прибытия", applicationsTotal:"Подача заявок", documentsTotal:"Документы", visaTotal:"Виза и SEVIS", travelTotal:"Дорога и обустройство",
    moveMethod:"Оценки документов и перелёта зависят от страны и доступных маршрутов. Поля можно изменить вручную под свои цены.",
    disclaimer:"Ориентировочная модель · Зарплаты, перелёт и сопутствующие расходы — демонстрационные оценки, а не финансовая или иммиграционная рекомендация.", officialFees:"Официальные сборы F-1: visa application — $185, I-901 SEVIS — $350. Проверить источники"
  },
  en: {
    nav:"Cost calculator", label:"Financial plan", title:"Estimate the full cost of a U.S. education", intro:"Model education ROI or build a separate budget for applications, documents, visa, travel and arrival costs.",
    openButton:"Open calculator", closeButton:"Close calculator", bannerMeta:"30 majors · 2 financial scenarios · instant calculations", educationTab:"Education & ROI", arrivalTab:"Applications & relocation",
    major:"Specialty / Major", tuition:"Tuition fee per year", aid:"Financial aid", living:"Living expenses per year", duration:"Program duration", repayment:"Salary share used for repayment",
    results:"Scenario result", total:"Total program cost", annual:"Annual cost after aid", salary:"Projected starting salary", breakEven:"Estimated break-even point", years:"years",
    method:"Break-even = total program cost ÷ the selected share of starting salary. Taxes, salary growth, inflation and loan interest are not included.",
    residence:"Departure country", citizenship:"Country of citizenship", visaStatus:"Visa situation", applications:"Number of applications", applicationFee:"Average application fee", documents:"Translations and documents", flight:"Flight and baggage", insurance:"Travel insurance", setup:"Initial arrival expenses",
    moveResult:"Pre-enrollment budget", moveTotal:"Total before arrival", applicationsTotal:"Applications", documentsTotal:"Documents", visaTotal:"Visa and SEVIS", travelTotal:"Travel and setup",
    moveMethod:"Document and flight estimates depend on country and route availability. You can replace every estimate with your own price.",
    disclaimer:"Illustrative model · Salaries, flights and related costs are sample estimates, not financial or immigration advice.", officialFees:"Official F-1 fees: visa application — $185, I-901 SEVIS — $350. Check sources"
  }
};

const roiElement = id => document.getElementById(id);
const roiLocale = lang => ({ uk:"uk-UA", ru:"ru-RU", en:"en-US" }[lang] || "en-US");
const roiCurrency = (value, lang) => new Intl.NumberFormat(roiLocale(lang), { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(value);
const roiNumber = id => Math.max(0, Number(roiElement(id)?.value) || 0);

function getRoiLanguage() {
  return typeof language === "string" && roiTranslations[language] ? language : "uk";
}

function populateRoiSelect(id, items, lang) {
  const select = roiElement(id);
  if (!select) return;
  const selected = select.value || items[0].id;
  select.innerHTML = items.map(item => `<option value="${item.id}">${item[lang]}</option>`).join("");
  select.value = items.some(item => item.id === selected) ? selected : items[0].id;
}

function populateDuration(lang) {
  const select = roiElement("roi-duration");
  if (!select) return;
  const selected = select.value || "4";
  const labels = {
    uk: { 2:"2 роки", 3:"3 роки", 4:"4 роки", 5:"5 років", 6:"6 років" },
    ru: { 2:"2 года", 3:"3 года", 4:"4 года", 5:"5 лет", 6:"6 лет" },
    en: { 2:"2 years", 3:"3 years", 4:"4 years", 5:"5 years", 6:"6 years" }
  }[lang];
  select.innerHTML = Object.entries(labels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  select.value = selected;
}

function calculateEducationRoi() {
  const lang = getRoiLanguage();
  const major = roiMajors.find(item => item.id === roiElement("roi-major")?.value) || roiMajors[0];
  const tuition = roiNumber("roi-tuition");
  const aid = Math.min(100, roiNumber("roi-aid"));
  const living = roiNumber("roi-living");
  const duration = Math.max(1, roiNumber("roi-duration") || 4);
  const repayment = Math.min(100, roiNumber("roi-repayment") || 30);
  const annual = tuition * (1 - aid / 100) + living;
  const total = annual * duration;
  const breakEven = total / (major.salary * (repayment / 100));

  roiElement("roi-aid-value").textContent = `${aid}%`;
  roiElement("roi-aid").style.setProperty("--range-value", `${aid}%`);
  roiElement("roi-repayment-value").textContent = `${repayment}%`;
  roiElement("roi-repayment").style.setProperty("--range-value", `${((repayment - 10) / 40) * 100}%`);
  roiElement("roi-total").textContent = roiCurrency(total, lang);
  roiElement("roi-annual").textContent = roiCurrency(annual, lang);
  roiElement("roi-salary").textContent = roiCurrency(major.salary, lang);
  roiElement("roi-break-even").textContent = `${breakEven.toFixed(1)} ${roiTranslations[lang].years}`;
}

function syncCountryEstimate(type) {
  if (type === "residence") {
    const item = roiCountryCosts.find(country => country.id === roiElement("roi-residence")?.value);
    if (item) roiElement("roi-flight").value = item.flight;
  } else {
    const item = roiCountryCosts.find(country => country.id === roiElement("roi-citizenship")?.value);
    if (item) roiElement("roi-documents").value = item.documents;
  }
  calculateMoveBudget();
}

function calculateMoveBudget() {
  const lang = getRoiLanguage();
  const visa = roiVisaProfiles.find(item => item.id === roiElement("roi-visa")?.value) || roiVisaProfiles[0];
  const applications = roiNumber("roi-applications") * roiNumber("roi-application-fee");
  const documents = roiNumber("roi-documents");
  const visaTotal = visa.visa + visa.sevis;
  const travel = roiNumber("roi-flight") + roiNumber("roi-insurance") + roiNumber("roi-setup");
  const total = applications + documents + visaTotal + travel;

  roiElement("roi-move-total").textContent = roiCurrency(total, lang);
  roiElement("roi-applications-total").textContent = roiCurrency(applications, lang);
  roiElement("roi-documents-total").textContent = roiCurrency(documents, lang);
  roiElement("roi-visa-total").textContent = roiCurrency(visaTotal, lang);
  roiElement("roi-travel-total").textContent = roiCurrency(travel, lang);
}

function setRoiMode(mode) {
  document.querySelectorAll("[data-roi-mode]").forEach(button => {
    const active = button.dataset.roiMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-roi-view]").forEach(view => { view.hidden = view.dataset.roiView !== mode; });
}

function setRoiOpen(open) {
  const panel = roiElement("roi-panel");
  const button = roiElement("roi-toggle");
  if (!panel || !button) return;
  panel.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
  button.querySelector("span").textContent = roiTranslations[getRoiLanguage()][open ? "closeButton" : "openButton"];
  button.classList.toggle("open", open);
  if (open) window.setTimeout(() => panel.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
}

window.updateRoiLanguage = function updateRoiLanguage(nextLanguage = getRoiLanguage()) {
  const lang = roiTranslations[nextLanguage] ? nextLanguage : "uk";
  document.querySelectorAll("[data-roi-i18n]").forEach(element => {
    element.textContent = roiTranslations[lang][element.dataset.roiI18n];
  });
  populateRoiSelect("roi-major", roiMajors, lang);
  populateRoiSelect("roi-residence", roiCountryCosts, lang);
  populateRoiSelect("roi-citizenship", roiCountryCosts, lang);
  populateRoiSelect("roi-visa", roiVisaProfiles, lang);
  populateDuration(lang);
  const toggle = roiElement("roi-toggle");
  if (toggle) toggle.querySelector("span").textContent = roiTranslations[lang][toggle.getAttribute("aria-expanded") === "true" ? "closeButton" : "openButton"];
  calculateEducationRoi();
  calculateMoveBudget();
};

["roi-major", "roi-tuition", "roi-aid", "roi-living", "roi-duration", "roi-repayment"].forEach(id => roiElement(id)?.addEventListener("input", calculateEducationRoi));
["roi-visa", "roi-applications", "roi-application-fee", "roi-documents", "roi-flight", "roi-insurance", "roi-setup"].forEach(id => roiElement(id)?.addEventListener("input", calculateMoveBudget));
roiElement("roi-residence")?.addEventListener("change", () => syncCountryEstimate("residence"));
roiElement("roi-citizenship")?.addEventListener("change", () => syncCountryEstimate("citizenship"));
document.querySelectorAll("[data-roi-mode]").forEach(button => button.addEventListener("click", () => setRoiMode(button.dataset.roiMode)));
roiElement("roi-toggle")?.addEventListener("click", () => setRoiOpen(roiElement("roi-panel").hidden));
document.querySelector("a[href='#roi']")?.addEventListener("click", () => setRoiOpen(true));

window.updateRoiLanguage(getRoiLanguage());
setRoiMode("education");
