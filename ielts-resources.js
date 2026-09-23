const resourceCopy = {
  uk: {
    back:"До каталогу", eyebrow:"IELTS / ПЕРЕВІРЕНІ ДЖЕРЕЛА", title:"Готуйтеся за матеріалами,<br /><em>яким можна довіряти.</em>", intro:"Офіційні книги Cambridge та безкоштовні ресурси партнерів IELTS — без піратських PDF, застарілих тестів і випадкових порад.", materials:"матеріалів", checked:"Перевірено 23 вересня 2026", path1Title:"Розберіться у форматі", path1Text:"Почніть з офіційного гайда або безкоштовних sample tests.", path2Title:"Відпрацюйте навички", path2Text:"Окремо тренуйте Writing, Reading, Listening і Speaking.", path3Title:"Зробіть повний пробник", path3Text:"Переходьте до Cambridge IELTS 21 в умовах реального часу.", libraryLabel:"БІБЛІОТЕКА", libraryTitle:"Оберіть, що потрібно зараз", libraryIntro:"Натисніть на картку: відкриється короткий розбір, кому підходить матеріал і офіційне посилання.", search:"Книга, навичка або видавець", reset:"Скинути фільтри", empty:"Нічого не знайдено. Спробуйте інший запит або фільтр.", noteTitle:"Тільки першоджерела", noteText:"Посилання ведуть на Cambridge, IELTS.org, British Council або IDP. FullRide UA не продає книги й не отримує комісію.", footer:"Офіційні матеріали для впевненої підготовки.", all:"Усе", books:"Книги", free:"Безкоштовно", academic:"Academic", general:"General", writing:"Writing", found:"Знайдено: {count}", details:"Переглянути", inside:"Що всередині", best:"Найкраще підходить", official:"Відкрити офіційне джерело", lookup:"Знайти книгу за ISBN", cambridgePage:"Сторінка Cambridge", cambridgeOutage:"Сервіси Cambridge тимчасово недоступні. Резервне посилання шукає саме це видання за ISBN у бібліотечному каталозі WorldCat.", newTab:"Відкриється у новій вкладці", close:"Закрити", officialBadge:"Офіційно"
  },
  ru: {
    back:"К каталогу", eyebrow:"IELTS / ПРОВЕРЕННЫЕ ИСТОЧНИКИ", title:"Готовьтесь по материалам,<br /><em>которым можно доверять.</em>", intro:"Официальные книги Cambridge и бесплатные ресурсы партнёров IELTS — без пиратских PDF, устаревших тестов и случайных советов.", materials:"материалов", checked:"Проверено 23 сентября 2026", path1Title:"Разберитесь в формате", path1Text:"Начните с официального руководства или бесплатных sample tests.", path2Title:"Отработайте навыки", path2Text:"Отдельно тренируйте Writing, Reading, Listening и Speaking.", path3Title:"Пройдите полный пробник", path3Text:"Переходите к Cambridge IELTS 21 в условиях реального времени.", libraryLabel:"БИБЛИОТЕКА", libraryTitle:"Выберите, что нужно сейчас", libraryIntro:"Нажмите на карточку: откроется краткий разбор, кому подходит материал, и официальная ссылка.", search:"Книга, навык или издатель", reset:"Сбросить фильтры", empty:"Ничего не найдено. Попробуйте другой запрос или фильтр.", noteTitle:"Только первоисточники", noteText:"Ссылки ведут на Cambridge, IELTS.org, British Council или IDP. FullRide UA не продаёт книги и не получает комиссию.", footer:"Официальные материалы для уверенной подготовки.", all:"Все", books:"Книги", free:"Бесплатно", academic:"Academic", general:"General", writing:"Writing", found:"Найдено: {count}", details:"Подробнее", inside:"Что внутри", best:"Лучше всего подходит", official:"Открыть официальный источник", lookup:"Найти книгу по ISBN", cambridgePage:"Страница Cambridge", cambridgeOutage:"Сервисы Cambridge временно недоступны. Резервная ссылка ищет именно это издание по ISBN в библиотечном каталоге WorldCat.", newTab:"Откроется в новой вкладке", close:"Закрыть", officialBadge:"Официально"
  },
  en: {
    back:"Back to directory", eyebrow:"IELTS / VERIFIED SOURCES", title:"Prepare with materials<br /><em>you can trust.</em>", intro:"Official Cambridge books and free resources from IELTS partners—without pirated PDFs, outdated tests or random advice.", materials:"resources", checked:"Checked 23 September 2026", path1Title:"Learn the format", path1Text:"Start with the official guide or free sample tests.", path2Title:"Build each skill", path2Text:"Practise Writing, Reading, Listening and Speaking separately.", path3Title:"Take a full mock", path3Text:"Move on to Cambridge IELTS 21 under timed conditions.", libraryLabel:"LIBRARY", libraryTitle:"Choose what you need now", libraryIntro:"Select a card for a concise review, who it suits and a direct official link.", search:"Book, skill or publisher", reset:"Reset filters", empty:"No resources found. Try another query or filter.", noteTitle:"Primary sources only", noteText:"Links lead to Cambridge, IELTS.org, the British Council or IDP. FullRide UA does not sell books or receive commission.", footer:"Official materials for focused preparation.", all:"All", books:"Books", free:"Free", academic:"Academic", general:"General", writing:"Writing", found:"Found: {count}", details:"View details", inside:"What is included", best:"Best for", official:"Open official source", lookup:"Find the book by ISBN", cambridgePage:"Cambridge page", cambridgeOutage:"Cambridge services are temporarily unavailable. The backup link searches for this exact edition by ISBN in the WorldCat library catalogue.", newTab:"Opens in a new tab", close:"Close", officialBadge:"Official"
  }
};

const l = (uk,ru,en) => ({ uk,ru,en });
const resources = [
  {
    id:"official-guide", type:"book", formats:["academic","general"], skills:["writing"], image:"assets/ielts/official-cambridge-guide.jpg", source:"Cambridge University Press & Assessment",
    title:"The Official Cambridge Guide to IELTS",
    summary:l("Повний путівник зі стратегіями, розвитком навичок і вісьмома практичними тестами.","Полное руководство со стратегиями, развитием навыков и восемью практическими тестами.","A complete guide to skills, test strategy and eight practice tests."),
    description:l("Комплексний старт для IELTS Academic і General Training. Матеріал пояснює кожну частину іспиту, спирається на типові відповіді кандидатів і допомагає побудувати системну підготовку.","Комплексный старт для IELTS Academic и General Training. Материал объясняет каждую часть экзамена, опирается на типичные ответы кандидатов и помогает выстроить системную подготовку.","A comprehensive starting point for both IELTS Academic and General Training, built around test skills, strategy and common candidate performance."),
    facts:["Academic + General","B2–C1","8 practice tests","Cambridge"],
    bullets:l(["Стратегії для всіх чотирьох навичок","Вісім повних практичних тестів","Приклади Speaking і типові помилки"],["Стратегии для всех четырёх навыков","Восемь полных практических тестов","Примеры Speaking и типичные ошибки"],["Strategies for all four skills","Eight complete practice tests","Speaking examples and common mistakes"]),
    best:l("Тим, хто лише будує план підготовки або хоче один основний підручник.","Тем, кто только выстраивает план подготовки или хочет один основной учебник.","Learners building a study plan or choosing one core coursebook."),
    url:"https://shop.cambridge.org/english/family/2100019847", backupUrl:"https://search.worldcat.org/search?q=bn%3A9781009672368"
  },
  {
    id:"ielts-21-academic", type:"book", formats:["academic"], skills:[], image:"assets/ielts/ielts-21-academic.jpg", source:"Cambridge University Press & Assessment",
    title:"IELTS 21 Academic",
    summary:l("Найсвіжіші автентичні тести Academic із відповідями, аудіо та Digital Pack.","Самые свежие аутентичные тесты Academic с ответами, аудио и Digital Pack.","The latest authentic Academic tests with answers, audio and a Digital Pack."),
    description:l("Видання 2026 року містить чотири повні автентичні екзаменаційні роботи. Завдання проходять той самий процес розробки, що й реальний IELTS.","Издание 2026 года содержит четыре полные аутентичные экзаменационные работы. Задания проходят тот же процесс разработки, что и реальный IELTS.","The 2026 edition contains four complete authentic papers developed through the same process as the real IELTS test."),
    facts:["Academic","B1–C2","ISBN 9781009826723","16 July 2026"],
    bullets:l(["4 повні екзаменаційні тести","Аудіо, відео Speaking і пояснення відповідей","Зразки відповідей Writing"],["4 полных экзаменационных теста","Аудио, видео Speaking и объяснения ответов","Образцы ответов Writing"],["4 complete test papers","Audio, Speaking videos and answer explanations","Sample Writing answers"]),
    best:l("Фінальному етапу підготовки та пробникам із таймером.","Финальному этапу подготовки и пробникам с таймером.","Final-stage preparation and timed mock tests."),
    url:"https://shop.cambridge.org/english/family/2100169902", backupUrl:"https://search.worldcat.org/search?q=bn%3A9781009826723"
  },
  {
    id:"ielts-21-general", type:"book", formats:["general"], skills:[], image:"assets/ielts/ielts-21-general.jpg", source:"Cambridge University Press & Assessment",
    title:"IELTS 21 General Training",
    summary:l("Найсвіжіші автентичні тести General Training із відповідями та цифровими матеріалами.","Самые свежие аутентичные тесты General Training с ответами и цифровыми материалами.","The latest authentic General Training tests with answers and digital materials."),
    description:l("Офіційне видання 2026 року для формату General Training: чотири повні роботи, система оцінювання, аудіо, відео та моделі Writing.","Официальное издание 2026 года для формата General Training: четыре полные работы, система оценивания, аудио, видео и модели Writing.","The official 2026 General Training edition with four complete papers, scoring guidance, audio, video and Writing samples."),
    facts:["General Training","B1–C2","ISBN 9781009826730","16 July 2026"],
    bullets:l(["4 повні екзаменаційні тести","Аудіо Listening і відео Speaking","Ключі та зразки відповідей"],["4 полных экзаменационных теста","Аудио Listening и видео Speaking","Ключи и образцы ответов"],["4 complete test papers","Listening audio and Speaking videos","Answer keys and sample responses"]),
    best:l("Тим, хто складає General Training для роботи або міграції.","Тем, кто сдаёт General Training для работы или миграции.","Candidates taking General Training for work or migration."),
    url:"https://shop.cambridge.org/english/family/2100169902", backupUrl:"https://search.worldcat.org/search?q=bn%3A9781009826730"
  },
  {
    id:"mindset", type:"book", formats:["academic","general"], skills:["writing"], image:"assets/ielts/mindset-ielts.jpg", source:"Cambridge University Press & Assessment",
    title:"Mindset for IELTS with Updated Digital Pack",
    summary:l("Чотирирівневий курс із друкованими та онлайн-матеріалами для послідовного прогресу.","Четырёхуровневый курс с печатными и онлайн-материалами для последовательного прогресса.","A four-level course combining print and online study for structured progress."),
    description:l("Серія допомагає підібрати матеріал під поточний рівень і цільовий бал. Це курс, а не лише збірник тестів: навички розвиваються поступово.","Серия помогает подобрать материал под текущий уровень и целевой балл. Это курс, а не только сборник тестов: навыки развиваются постепенно.","A levelled course rather than a test-only book, designed to build language and exam skills progressively toward a target band."),
    facts:["4 levels","Print + digital","Skills + strategy","Cambridge"],
    bullets:l(["Рівні від Foundation до Level 3","Онлайн-вправи та відеоматеріали","Послідовна робота з усіма навичками"],["Уровни от Foundation до Level 3","Онлайн-упражнения и видеоматериалы","Последовательная работа со всеми навыками"],["Foundation through Level 3","Online activities and video","Structured work across all skills"]),
    best:l("Тривалій підготовці з викладачем або за чітким навчальним планом.","Длительной подготовке с преподавателем или по чёткому учебному плану.","Longer-term study with a teacher or a structured plan."),
    url:"https://shop.cambridge.org/english/family/2100096324", backupUrl:"https://search.worldcat.org/search?q=ti%3A%22Mindset%20for%20IELTS%20with%20Updated%20Digital%20Pack%22"
  },
  {
    id:"sample-tests", type:"free", formats:["academic","general"], skills:["writing"], mark:"IELTS", source:"IELTS.org",
    title:"Official IELTS Sample Test Questions",
    summary:l("Офіційні зразки запитань і відповідей для Academic, General Training та UKVI Life Skills.","Официальные образцы вопросов и ответов для Academic, General Training и UKVI Life Skills.","Official sample questions and answers for Academic, General Training and UKVI Life Skills."),
    description:l("Найбезпечніша безкоштовна точка старту: актуальні типи завдань, приклади відповідей і матеріали без сторонньої інтерпретації.","Самая надёжная бесплатная точка старта: актуальные типы заданий, примеры ответов и материалы без сторонней интерпретации.","The safest free starting point for current task types, answer examples and materials without third-party interpretation."),
    facts:["Free","Academic + General","Official samples","All skills"],
    bullets:l(["Зразки завдань за форматами","Ключі та модельні відповіді","Матеріали для роботи з таймером"],["Образцы заданий по форматам","Ключи и модельные ответы","Материалы для работы с таймером"],["Samples by test format","Answer keys and model responses","Materials suitable for timed practice"]),
    best:l("Першому знайомству з тестом і перевірці актуального формату.","Первому знакомству с тестом и проверке актуального формата.","First contact with the test and checking the current format."),
    url:"https://ielts.org/take-a-test/preparation-resources/sample-test-questions"
  },
  {
    id:"ielts-ready", type:"free", formats:["academic","general"], skills:["writing"], mark:"READY", source:"British Council",
    title:"IELTS Ready",
    summary:l("Безкоштовна платформа з mock-тестами, курсами, вебінарами й персональним фідбеком.","Бесплатная платформа с mock-тестами, курсами, вебинарами и персональным фидбеком.","A free platform with mock tests, courses, webinars and personalised feedback."),
    description:l("Безкоштовна версія доступна після реєстрації. Premium відкривається без додаткової плати після бронювання тесту через British Council і містить більше повних пробників.","Бесплатная версия доступна после регистрации. Premium открывается без дополнительной платы после бронирования теста через British Council и содержит больше полных пробников.","The free tier is available after registration. Premium is included after booking through the British Council and adds many more full practice tests."),
    facts:["Free account","Mock tests","AI feedback","British Council"],
    bullets:l(["Express і Mini mock","Курси та експертні вебінари","Відстеження прогресу"],["Express и Mini mock","Курсы и экспертные вебинары","Отслеживание прогресса"],["Express and Mini mocks","Courses and expert webinars","Progress tracking"]),
    best:l("Регулярній онлайн-підготовці та відстеженню прогресу в одному місці.","Регулярной онлайн-подготовке и отслеживанию прогресса в одном месте.","Regular online preparation with progress tracking in one place."),
    url:"https://takeielts.britishcouncil.org/prepare/ielts-ready"
  },
  {
    id:"bc-mocks", type:"free", formats:["academic","general"], skills:["writing"], mark:"BC", source:"British Council",
    title:"Free IELTS Practice & Mock Tests",
    summary:l("Безкоштовні тренування Listening, Reading, Writing і Speaking для обох форматів тесту.","Бесплатные тренировки Listening, Reading, Writing и Speaking для обоих форматов теста.","Free Listening, Reading, Writing and Speaking practice for both test formats."),
    description:l("Добре структурована бібліотека окремих вправ і пробних тестів. Можна працювати точково з найслабшою навичкою, не купуючи курс.","Хорошо структурированная библиотека отдельных упражнений и пробных тестов. Можно точечно работать с самым слабым навыком, не покупая курс.","A well-structured library of individual exercises and mock tests for targeted work on a weaker skill without buying a course."),
    facts:["Free","Academic + General","4 skills","Answer keys"],
    bullets:l(["Практика для всіх чотирьох навичок","Окремі сторінки Academic і General","Знайомство з computer-based форматом"],["Практика для всех четырёх навыков","Отдельные страницы Academic и General","Знакомство с computer-based форматом"],["Practice across all four skills","Separate Academic and General sections","Computer-format familiarisation"]),
    best:l("Точковій практиці конкретної навички та коротким щоденним сесіям.","Точечной практике конкретного навыка и коротким ежедневным сессиям.","Targeted skill practice and short daily sessions."),
    url:"https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests"
  },
  {
    id:"idp-hub", type:"free", formats:["academic","general"], skills:["writing"], mark:"IDP", source:"IDP IELTS",
    title:"IELTS Prepare Hub by IDP",
    summary:l("Пробні тести, відео, статті, подкасти та інструмент самооцінювання від офіційного партнера IELTS.","Пробные тесты, видео, статьи, подкасты и инструмент самооценки от официального партнёра IELTS.","Practice tests, videos, articles, podcasts and a self-assessment tool from an official IELTS partner."),
    description:l("Великий безкоштовний хаб із фільтрами за форматом тесту, навичкою і типом матеріалу. Є коротка діагностика Reading і Listening.","Большой бесплатный хаб с фильтрами по формату теста, навыку и типу материала. Есть короткая диагностика Reading и Listening.","A broad free hub filterable by test type, skill and content format, including a short Reading and Listening diagnostic."),
    facts:["Free","Practice hub","Self-assessment","IDP"],
    bullets:l(["Тести та familiarisation tasks","Відео, подкасти й експертні статті","Самооцінювання Reading і Listening"],["Тесты и familiarisation tasks","Видео, подкасты и экспертные статьи","Самооценивание Reading и Listening"],["Tests and familiarisation tasks","Videos, podcasts and expert articles","Reading and Listening self-assessment"]),
    best:l("Тим, хто хоче багато форматів матеріалів і коротку діагностику стартового рівня.","Тем, кто хочет много форматов материалов и короткую диагностику стартового уровня.","Learners who want varied media and a quick starting-level diagnostic."),
    url:"https://ielts.idp.com/prepare"
  },
  {
    id:"scoring", type:"free", formats:["academic","general"], skills:["writing"], mark:"BAND", source:"IELTS.org",
    title:"IELTS Scoring in Detail",
    summary:l("Офіційне пояснення band scores, округлення балів і критеріїв Writing та Speaking.","Официальное объяснение band scores, округления баллов и критериев Writing и Speaking.","The official explanation of band scores, rounding and Writing and Speaking criteria."),
    description:l("Це не збірник вправ, а обов’язкова система координат. Допомагає зрозуміти, що саме відрізняє band 6 від 7 або 8 і як рахують загальний бал.","Это не сборник упражнений, а обязательная система координат. Помогает понять, что отличает band 6 от 7 или 8 и как считают общий балл.","Not a practice set, but essential scoring guidance explaining what separates bands 6, 7 and 8 and how the overall score is calculated."),
    facts:["Free","Band 0–9","Official criteria","Score calculation"],
    bullets:l(["Опис кожного band score","Правила округлення overall score","Критерії Writing і Speaking"],["Описание каждого band score","Правила округления overall score","Критерии Writing и Speaking"],["Every band score explained","Overall-score rounding rules","Writing and Speaking criteria"]),
    best:l("Постановці реальної цілі й перевірці власних відповідей за критеріями екзаменатора.","Постановке реальной цели и проверке своих ответов по критериям экзаменатора.","Setting a realistic target and reviewing work against examiner criteria."),
    url:"https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail"
  },
  {
    id:"writing", type:"free", formats:["academic","general"], skills:["writing"], mark:"WRITE", source:"IELTS.org",
    title:"Official IELTS Writing Resources",
    summary:l("Відео, критерії оцінювання та приклади, що пояснюють, як екзаменатори перевіряють Writing.","Видео, критерии оценивания и примеры, объясняющие, как экзаменаторы проверяют Writing.","Videos, criteria and examples explaining exactly how IELTS Writing is assessed."),
    description:l("Офіційна серія розбирає Task Achievement/Response, Coherence and Cohesion, Lexical Resource та Grammatical Range and Accuracy.","Официальная серия разбирает Task Achievement/Response, Coherence and Cohesion, Lexical Resource и Grammatical Range and Accuracy.","The official series explains Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy."),
    facts:["Free","Writing","Academic + General","Examiner criteria"],
    bullets:l(["Офіційні відеопояснення","Band descriptors і критерії","Приклади оцінених відповідей"],["Официальные видеообъяснения","Band descriptors и критерии","Примеры оценённых ответов"],["Official explainer videos","Band descriptors and criteria","Examples of assessed responses"]),
    best:l("Тим, хто застряг на Writing 5.5–6.5 і не розуміє, що саме знижує бал.","Тем, кто застрял на Writing 5.5–6.5 и не понимает, что именно снижает балл.","Learners stuck around Writing 5.5–6.5 who need to understand what limits their score."),
    url:"https://ielts.org/take-a-test/preparation-resources/writing-test-resources"
  }
];

let resourceLanguage = ["uk","ru","en"].includes(new URLSearchParams(location.search).get("lang")) ? new URLSearchParams(location.search).get("lang") : "uk";
let activeFilter = "all";
let searchTerm = "";
let lastTrigger = null;
const byId = id => document.getElementById(id);
const tr = key => resourceCopy[resourceLanguage][key] || resourceCopy.en[key] || key;
const local = value => value?.[resourceLanguage] || value?.en || value || "";
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character]));

function visual(resource, detail = false) {
  if (resource.image) return `<img src="${resource.image}" alt="${escapeHtml(resource.title)}" ${detail ? "" : 'loading="lazy"'} width="240" height="320" />`;
  return `<span class="resource-card__monogram"><b>${escapeHtml(resource.mark)}</b><small>${escapeHtml(resource.source)}<br />OFFICIAL RESOURCE</small></span>`;
}

function matches(resource) {
  const filterMatches = activeFilter === "all" || activeFilter === "book" && resource.type === "book" || activeFilter === "free" && resource.type === "free" || resource.formats.includes(activeFilter) || resource.skills.includes(activeFilter);
  const haystack = [resource.title,resource.source,local(resource.summary),resource.type === "book" ? tr("books") : tr("free"),...resource.formats,...resource.skills].join(" ").toLocaleLowerCase();
  return filterMatches && (!searchTerm || haystack.includes(searchTerm));
}

function renderFilters() {
  const filters = [["all","all"],["book","books"],["free","free"],["academic","academic"],["general","general"],["writing","writing"]];
  byId("resource-filters").innerHTML = filters.map(([value,key]) => `<button type="button" data-resource-filter="${value}" class="${activeFilter === value ? "is-active" : ""}" aria-pressed="${activeFilter === value}">${tr(key)}</button>`).join("");
}

function renderResources() {
  const visible = resources.filter(matches);
  byId("resource-grid").innerHTML = visible.map((resource,index) => {
    const tags = [resource.type === "book" ? tr("books") : tr("free"),...resource.formats].slice(0,2);
    return `<article class="resource-card reveal" style="--order:${index}"><button class="resource-card__button" type="button" data-resource-id="${resource.id}" aria-label="${escapeHtml(tr("details") + ": " + resource.title)}"><span class="resource-card__visual ${resource.image ? "" : "resource-card__visual--digital"}"><span class="resource-card__badges">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</span>${visual(resource)}</span><span class="resource-card__body"><small class="resource-card__source">${escapeHtml(resource.source)}</small><h3>${escapeHtml(resource.title)}</h3><span class="resource-card__summary">${escapeHtml(local(resource.summary))}</span><span class="resource-card__open"><span>${tr("details")}</span><i aria-hidden="true">→</i></span></span></button></article>`;
  }).join("");
  byId("resource-count").textContent = tr("found").replace("{count}",visible.length);
  byId("resource-empty").hidden = visible.length > 0;
  byId("resource-total").textContent = resources.length;
}

function openResource(resource, trigger) {
  lastTrigger = trigger;
  const facts = resource.facts.map(fact => `<span>${escapeHtml(fact)}</span>`).join("");
  const bullets = local(resource.bullets).map(item => `<li>${escapeHtml(item)}</li>`).join("");
  const actions = resource.backupUrl
    ? `<p class="resource-detail__outage">${tr("cambridgeOutage")}</p><div class="resource-detail__actions"><a class="resource-detail__fallback" href="${resource.backupUrl}" target="_blank" rel="noopener noreferrer"><span>${tr("lookup")}</span><span aria-hidden="true">↗</span></a><a class="resource-detail__official" href="${resource.url}" target="_blank" rel="noopener noreferrer"><span>${tr("cambridgePage")}</span><span aria-hidden="true">↗</span></a></div>`
    : `<div class="resource-detail__actions"><a href="${resource.url}" target="_blank" rel="noopener noreferrer"><span>${tr("official")}</span><span aria-hidden="true">↗</span></a><small>${tr("newTab")}</small></div>`;
  byId("resource-dialog-body").innerHTML = `<article class="resource-detail"><div class="resource-detail__visual">${visual(resource,true)}</div><div class="resource-detail__content"><span class="resource-detail__kicker">${escapeHtml(resource.source)} · ${tr("officialBadge")}</span><h2 id="resource-dialog-title">${escapeHtml(resource.title)}</h2><p class="resource-detail__description">${escapeHtml(local(resource.description))}</p><div class="resource-detail__facts">${facts}</div><h3>${tr("inside")}</h3><ul>${bullets}</ul><p class="resource-detail__best"><b>${tr("best")}:</b> ${escapeHtml(local(resource.best))}</p>${actions}</div></article>`;
  byId("resource-dialog").showModal();
  byId("resource-dialog").querySelector("[data-resource-close]").focus();
}

function closeDialog() {
  const dialog = byId("resource-dialog");
  if (dialog.open) dialog.close();
  lastTrigger?.focus();
}

function renderLanguage() {
  document.documentElement.lang = resourceLanguage;
  document.querySelectorAll("[data-resource-key]").forEach(element => { element.innerHTML = tr(element.dataset.resourceKey); });
  document.querySelectorAll("[data-resource-placeholder]").forEach(element => { element.placeholder = tr(element.dataset.resourcePlaceholder); });
  document.querySelectorAll("[data-resource-lang]").forEach(button => button.classList.toggle("active",button.dataset.resourceLang === resourceLanguage));
  document.querySelector("[data-resource-close]").setAttribute("aria-label",tr("close"));
  renderFilters();
  renderResources();
}

byId("resource-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-resource-filter]");
  if (!button) return;
  activeFilter = button.dataset.resourceFilter;
  renderFilters();
  renderResources();
});
byId("resource-search").addEventListener("input", event => { searchTerm = event.target.value.trim().toLocaleLowerCase(); renderResources(); });
byId("resource-reset").addEventListener("click", () => { activeFilter = "all"; searchTerm = ""; byId("resource-search").value = ""; renderFilters(); renderResources(); });
byId("resource-grid").addEventListener("click", event => { const button = event.target.closest("[data-resource-id]"); const resource = resources.find(item => item.id === button?.dataset.resourceId); if (resource) openResource(resource,button); });
document.querySelector(".resource-path").addEventListener("click", event => { const button = event.target.closest("[data-path-resource]"); const resource = resources.find(item => item.id === button?.dataset.pathResource); if (resource) openResource(resource,button); });
document.querySelectorAll("[data-resource-lang]").forEach(button => button.addEventListener("click", () => { resourceLanguage = button.dataset.resourceLang; history.replaceState({},"",`ielts-resources.html?lang=${resourceLanguage}`); renderLanguage(); }));
document.querySelector("[data-resource-close]").addEventListener("click",closeDialog);
byId("resource-dialog").addEventListener("click",event => { if (event.target === byId("resource-dialog")) closeDialog(); });
byId("resource-dialog").addEventListener("cancel",event => { event.preventDefault(); closeDialog(); });
renderLanguage();
