const compareTranslations = {
  uk: {
    back:"До каталогу", label:"Розумне порівняння", title:"Дивіться на умови,<br />а не на гучність імені.", intro:"Зіставте вступні вимоги, фінансову політику та середовище навчання в одному полі.", differencesOnly:"Показувати лише відмінності", addMore:"+ Додати університет", clear:"Очистити", note:"Порівняння використовує лише наявні поля бази. Неперевірені значення позначені й не підміняються припущеннями.", footerTagline:"Порівнюйте контекст, а не лише назви.", footer:"Перевіряйте умови на офіційних сторінках",
    emptyLabel:"Порожнє полотно", emptyTitle:"Додайте від 2 до 4 університетів.", emptyText:"На картках каталогу натисніть «Порівняти». Обрані варіанти збережуться у цьому браузері.", emptyAction:"Обрати університети", oneCollege:"Додайте ще один університет, щоб побачити відмінності.", summary:"Відмінних характеристик: {different} із {total}", sectionProfile:"Профіль", sectionAdmissions:"Вступ", sectionAid:"Фінансова допомога", characteristic:"Характеристика", remove:"Прибрати", openProfile:"Відкрити профіль", dataStatus:"Статус даних", location:"Місто і штат", institutionType:"Тип закладу", setting:"Середовище", region:"Регіон", focus:"Академічні напрями", testing:"SAT / ACT", english:"Англійська", fee:"Application fee", feeWaiver:"Fee waiver", deadline:"Дедлайн", aidPolicy:"Політика допомоги", needBlind:"Need-blind для international", aidDetails:"Деталі фінансування", verified:"Перевірено 2026–27", pending:"Очікує повного аудиту", yes:"Так", no:"Ні", unknown:"Не перевірено", research:"Дослідницький університет", liberalArts:"Liberal arts college", specialized:"Спеціалізований заклад", urban:"Велике місто", suburban:"Передмістя", town:"Невелике місто", rural:"Кампус поза містом", northeast:"Північний схід", south:"Південь", midwest:"Середній захід", west:"Захід", stem:"STEM", business:"Бізнес та економіка", arts:"Мистецтво та дизайн", socialSciences:"Соціальні науки", health:"Медицина та здоров’я", general:"Широкий профіль", cleared:"Список порівняння очищено."
  },
  ru: {
    back:"В каталог", label:"Умное сравнение", title:"Смотрите на условия,<br />а не на громкость имени.", intro:"Сопоставьте требования к поступлению, финансовую политику и среду обучения в одном поле.", differencesOnly:"Показывать только отличия", addMore:"+ Добавить университет", clear:"Очистить", note:"Сравнение использует только имеющиеся поля базы. Непроверенные значения отмечены и не заменяются предположениями.", footerTagline:"Сравнивайте контекст, а не только названия.", footer:"Проверяйте условия на официальных страницах",
    emptyLabel:"Пустое полотно", emptyTitle:"Добавьте от 2 до 4 университетов.", emptyText:"На карточках каталога нажмите «Сравнить». Выбранные варианты сохранятся в этом браузере.", emptyAction:"Выбрать университеты", oneCollege:"Добавьте ещё один университет, чтобы увидеть различия.", summary:"Различающихся характеристик: {different} из {total}", sectionProfile:"Профиль", sectionAdmissions:"Поступление", sectionAid:"Финансовая помощь", characteristic:"Характеристика", remove:"Убрать", openProfile:"Открыть профиль", dataStatus:"Статус данных", location:"Город и штат", institutionType:"Тип учреждения", setting:"Окружение", region:"Регион", focus:"Академические направления", testing:"SAT / ACT", english:"Английский", fee:"Application fee", feeWaiver:"Fee waiver", deadline:"Дедлайн", aidPolicy:"Политика помощи", needBlind:"Need-blind для international", aidDetails:"Детали финансирования", verified:"Проверено 2026–27", pending:"Ожидает полного аудита", yes:"Да", no:"Нет", unknown:"Не проверено", research:"Исследовательский университет", liberalArts:"Liberal arts college", specialized:"Специализированное учреждение", urban:"Большой город", suburban:"Пригород", town:"Небольшой город", rural:"Кампус вне города", northeast:"Северо-восток", south:"Юг", midwest:"Средний Запад", west:"Запад", stem:"STEM", business:"Бизнес и экономика", arts:"Искусство и дизайн", socialSciences:"Социальные науки", health:"Медицина и здоровье", general:"Широкий профиль", cleared:"Список сравнения очищен."
  },
  en: {
    back:"Back to directory", label:"Smart comparison", title:"Compare the conditions,<br />not the fame of the name.", intro:"Review admission requirements, aid policy and campus setting in one structured view.", differencesOnly:"Show differences only", addMore:"+ Add a university", clear:"Clear", note:"The comparison uses only fields available in the directory. Unverified values are labeled and never replaced with assumptions.", footerTagline:"Compare context, not just names.", footer:"Confirm requirements on official pages",
    emptyLabel:"Empty canvas", emptyTitle:"Add 2 to 4 universities.", emptyText:"Select “Compare” on a directory card. Your choices stay saved in this browser.", emptyAction:"Choose universities", oneCollege:"Add one more university to reveal differences.", summary:"Different characteristics: {different} of {total}", sectionProfile:"Profile", sectionAdmissions:"Admissions", sectionAid:"Financial aid", characteristic:"Characteristic", remove:"Remove", openProfile:"Open profile", dataStatus:"Data status", location:"City and state", institutionType:"Institution type", setting:"Setting", region:"Region", focus:"Academic focus", testing:"SAT / ACT", english:"English", fee:"Application fee", feeWaiver:"Fee waiver", deadline:"Deadline", aidPolicy:"Aid policy", needBlind:"Need-blind for international", aidDetails:"Funding details", verified:"Verified for 2026–27", pending:"Full audit pending", yes:"Yes", no:"No", unknown:"Not verified", research:"Research university", liberalArts:"Liberal arts college", specialized:"Specialized institution", urban:"Major city", suburban:"Suburban", town:"College town", rural:"Rural campus", northeast:"Northeast", south:"South", midwest:"Midwest", west:"West", stem:"STEM", business:"Business & economics", arts:"Arts & design", socialSciences:"Social sciences", health:"Health & medicine", general:"Broad curriculum", cleared:"Comparison list cleared."
  }
};

Object.assign(compareTranslations.uk, { otherRegion:"Інші території" });
Object.assign(compareTranslations.ru, { otherRegion:"Другие территории" });
Object.assign(compareTranslations.en, { otherRegion:"Other territories" });

const compareParams = new URLSearchParams(window.location.search);
let compareLanguage = ["uk", "ru", "en"].includes(compareParams.get("lang")) ? compareParams.get("lang") : "uk";
const cq = id => document.getElementById(id);
const ct = key => compareTranslations[compareLanguage][key] || key;
let compareToastTimer;
let comparisonHydrating = false;

const typeLabels = { research:"research", "liberal-arts":"liberalArts", specialized:"specialized", unverified:"unknown" };
const settingLabels = { urban:"urban", suburban:"suburban", town:"town", rural:"rural", unverified:"unknown" };
const regionLabels = { northeast:"northeast", south:"south", midwest:"midwest", west:"west", other:"otherRegion" };
const focusLabels = { stem:"stem", business:"business", arts:"arts", "social-sciences":"socialSciences", health:"health", general:"general" };

function verifiedValue(college, value, formatter = item => item) {
  return college.verified ? formatter(value) : ct("unknown");
}

function flagValue(value) {
  if (value === "unverified") return `<span class="compare-value compare-value--unknown">${ct("unknown")}</span>`;
  return `<span class="compare-value ${value ? "compare-value--yes" : "compare-value--no"}">${ct(value ? "yes" : "no")}</span>`;
}

function getSections() {
  return [
    { title:"sectionProfile", rows:[
      { key:"status", label:"dataStatus", raw:college => college.verified, display:college => `<span class="compare-value ${college.verified ? "compare-value--yes" : "compare-value--unknown"}">${ct(college.verified ? "verified" : "pending")}</span>` },
      { key:"location", label:"location", raw:college => college.location, display:college => college.location },
      { key:"type", label:"institutionType", raw:college => college.institutionType, display:college => ct(typeLabels[college.institutionType]) },
      { key:"setting", label:"setting", raw:college => college.setting, display:college => ct(settingLabels[college.setting]) },
      { key:"region", label:"region", raw:college => college.region, display:college => ct(regionLabels[college.region]) },
      { key:"focus", label:"focus", raw:college => [...college.focus].sort(), display:college => college.focus.map(item => ct(focusLabels[item])).join(" · ") }
    ]},
    { title:"sectionAdmissions", rows:[
      { key:"testing", label:"testing", raw:college => college.verified ? college.testing : "unverified", display:college => verifiedValue(college, college.testing) },
      { key:"english", label:"english", raw:college => college.verified ? `${college.englishStatus}|${college.english}` : "unverified", display:college => verifiedValue(college, college.english) },
      { key:"fee", label:"fee", raw:college => college.verified ? college.fee : "unverified", display:college => verifiedValue(college, college.fee) },
      { key:"fee-waiver", label:"feeWaiver", raw:college => college.verified ? college.feeWaiver : "unverified", display:college => flagValue(college.verified ? college.feeWaiver : "unverified") },
      { key:"deadline", label:"deadline", raw:college => college.verified ? college.deadline : "unverified", display:college => verifiedValue(college, college.deadline) }
    ]},
    { title:"sectionAid", rows:[
      { key:"aid-policy", label:"aidPolicy", raw:college => college.verified ? college.aidCategory : "unverified", display:college => verifiedValue(college, college.aidShort) },
      { key:"need-blind", label:"needBlind", raw:college => college.verified ? college.needBlind : "unverified", display:college => flagValue(college.verified ? college.needBlind : "unverified") },
      { key:"aid-details", label:"aidDetails", raw:college => college.verified ? college.aid : "unverified", display:college => verifiedValue(college, college.aid) }
    ]}
  ];
}

function normalized(value) {
  if (Array.isArray(value)) return JSON.stringify([...value].sort());
  return JSON.stringify(value ?? null);
}

function selectedColleges() {
  const stored = window.FullRideCompare.load();
  const selected = stored.map(slug => colleges.find(college => college.slug === slug)).filter(Boolean);
  if (selected.length !== stored.length) window.FullRideCompare.save(selected.map(college => college.slug));
  return selected;
}

function renderEmpty() {
  cq("comparison-root").innerHTML = `
    <div class="compare-empty">
      <div class="compare-empty__visual" aria-hidden="true"><span>01</span><span>02</span><span>03</span><i>⇄</i></div>
      <p>${ct("emptyLabel")}</p><h2>${ct("emptyTitle")}</h2><span>${ct("emptyText")}</span>
      <a href="index.html?lang=${compareLanguage}#finder">${ct("emptyAction")} →</a>
    </div>`;
}

function renderComparison() {
  const selected = selectedColleges();
  const pendingDetails = selected.filter(college => !college._detailsLoaded);
  if (pendingDetails.length && window.FullRideCollegeData && !comparisonHydrating) {
    comparisonHydrating = true;
    window.FullRideCollegeData.load(pendingDetails).then(() => {
      comparisonHydrating = false;
      renderComparison();
    }).catch(() => { comparisonHydrating = false; });
  }
  const onlyDifferences = cq("differences-only").checked && selected.length >= 2;
  cq("compare-total").textContent = selected.length;
  cq("compare-clear").disabled = !selected.length;
  cq("differences-only").disabled = selected.length < 2;
  if (selected.length < 2) cq("differences-only").checked = false;

  if (!selected.length) {
    cq("difference-summary").textContent = "";
    renderEmpty();
    return;
  }

  const sections = getSections();
  const allRows = sections.flatMap(section => section.rows);
  const rowState = new Map(allRows.map(row => {
    const values = selected.map(college => normalized(row.raw(college)));
    return [row.key, { equal:values.every(value => value === values[0]) }];
  }));
  const differentCount = [...rowState.values()].filter(state => !state.equal).length;
  cq("difference-summary").textContent = selected.length < 2 ? ct("oneCollege") : ct("summary").replace("{different}", differentCount).replace("{total}", allRows.length);
  const gridStyle = `--columns:${selected.length};--table-min:${190 + selected.length * 245}px`;

  const heading = `
    <div class="comparison-row comparison-row--head" style="${gridStyle}">
      <div class="comparison-label-cell"><span>${ct("characteristic")}</span></div>
      ${selected.map(college => `
        <article class="comparison-college-head">
          <button type="button" data-remove-compare="${college.slug}" aria-label="${ct("remove")}: ${college.name}">×</button>
          <div class="comparison-college-head__photo"><img src="${college.photoThumb || college.photo}" alt="" loading="lazy" decoding="async" /></div>
          <span>${college.short}</span><h2>${college.name}</h2><p>${college.location}</p>
          <a href="university.html?id=${encodeURIComponent(college.slug)}&lang=${compareLanguage}">${ct("openProfile")} →</a>
        </article>`).join("")}
    </div>`;

  const body = sections.map(section => {
    const visibleRows = section.rows.filter(row => !(onlyDifferences && rowState.get(row.key).equal));
    if (!visibleRows.length) return "";
    return `
      <div class="comparison-section-row" style="${gridStyle}"><strong>${ct(section.title)}</strong></div>
      ${visibleRows.map(row => `
        <div class="comparison-row ${rowState.get(row.key).equal ? "is-equal" : "is-different"}" data-compare-row="${row.key}" style="${gridStyle}">
          <div class="comparison-label-cell"><span>${ct(row.label)}</span>${rowState.get(row.key).equal ? "" : "<i>≠</i>"}</div>
          ${selected.map(college => `<div class="comparison-data-cell">${row.display(college)}</div>`).join("")}
        </div>`).join("")}`;
  }).join("");

  cq("comparison-root").innerHTML = `<div class="comparison-scroll"><div class="comparison-table" style="${gridStyle}">${heading}${body}</div></div>`;
}

function updateCompareLanguage() {
  document.documentElement.lang = compareLanguage;
  document.querySelectorAll("[data-compare-i18n]").forEach(element => {
    const value = ct(element.dataset.compareI18n);
    if (value.includes("<br")) element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll("[data-compare-lang]").forEach(button => button.classList.toggle("active", button.dataset.compareLang === compareLanguage));
  cq("compare-back").href = `index.html?lang=${compareLanguage}#finder`;
  cq("compare-add-more").href = `index.html?lang=${compareLanguage}#finder`;
  renderComparison();
}

function showPageToast(message) {
  const toast = cq("compare-page-toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(compareToastTimer);
  compareToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

cq("differences-only").addEventListener("change", renderComparison);
cq("compare-clear").addEventListener("click", () => {
  window.FullRideCompare.clear();
  renderComparison();
  showPageToast(ct("cleared"));
});
cq("comparison-root").addEventListener("click", event => {
  const button = event.target.closest("[data-remove-compare]");
  if (!button) return;
  window.FullRideCompare.remove(button.dataset.removeCompare);
  renderComparison();
});
document.querySelectorAll("[data-compare-lang]").forEach(button => button.addEventListener("click", () => {
  compareLanguage = button.dataset.compareLang;
  window.history.replaceState({}, "", `compare.html?lang=${compareLanguage}`);
  updateCompareLanguage();
}));
window.addEventListener("fullride:cloud-data", renderComparison);

updateCompareLanguage();
