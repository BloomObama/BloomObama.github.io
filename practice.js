const practiceCopy = {
  uk:{ navFinder:"Пошук університетів", navPractice:"Практика", navRoi:"Калькулятор ROI", back:"До каталогу", eyebrow:"FULLRIDE / PRACTICE", title:"Вчіть слова<br /><em>у своєму темпі.</em>", intro:"Додавайте незнайомі англійські слова, зберігайте їх і повертайтеся до них у коротких випадкових сесіях.", saved:"карток збережено", learned:"вивчено", addLabel:"НОВА КАРТКА", addTitle:"Додайте слово для практики", wordLabel:"Англійське слово", translationLabel:"Переклад", optional:"(можна змінити)", addButton:"Додати картку", translationNote:"Переклад запитується автоматично. Перед збереженням його можна відредагувати.", libraryLabel:"МОЇ КАРТКИ", libraryTitle:"Повторюйте те, що важливо", startButton:"Почати практику", searchPlaceholder:"Пошук за словами і перекладами", filterAll:"Усі картки", filterLearning:"У процесі", filterLearned:"Вивчені", sessionLabel:"СЕСІЯ", sessionTitle:"Згадайте переклад", revealButton:"Показати переклад", repeatButton:"Повторити", knowButton:"Знаю", empty:"Поки немає карток. Додайте перше англійське слово.", noMatch:"За цим запитом карток не знайдено.", added:"Картку додано.", deleted:"Картку видалено.", autoError:"Не вдалося отримати переклад автоматично. Вкажіть переклад вручну.", translating:"Шукаємо переклад…", duplicate:"Це слово вже є у ваших картках.", footerTagline:"Практика маленькими кроками.", deleteAria:"Видалити картку", learnedAria:"Позначити як вивчену", learningAria:"Повернути до вивчення", count:"карток"},
  ru:{ navFinder:"Поиск университетов", navPractice:"Практика", navRoi:"Калькулятор ROI", back:"К каталогу", eyebrow:"FULLRIDE / PRACTICE", title:"Учите слова<br /><em>в своём темпе.</em>", intro:"Добавляйте незнакомые английские слова, сохраняйте их и возвращайтесь к ним в коротких случайных сессиях.", saved:"карточек сохранено", learned:"выучено", addLabel:"НОВАЯ КАРТОЧКА", addTitle:"Добавьте слово для практики", wordLabel:"Английское слово", translationLabel:"Перевод", optional:"(можно изменить)", addButton:"Добавить карточку", translationNote:"Перевод запрашивается автоматически. Перед сохранением его можно отредактировать.", libraryLabel:"МОИ КАРТОЧКИ", libraryTitle:"Повторяйте то, что важно", startButton:"Начать практику", searchPlaceholder:"Поиск по словам и переводам", filterAll:"Все карточки", filterLearning:"В процессе", filterLearned:"Выученные", sessionLabel:"СЕССИЯ", sessionTitle:"Вспомните перевод", revealButton:"Показать перевод", repeatButton:"Повторить", knowButton:"Знаю", empty:"Пока нет карточек. Добавьте первое английское слово.", noMatch:"По этому запросу карточек не найдено.", added:"Карточка добавлена.", deleted:"Карточка удалена.", autoError:"Не удалось получить перевод автоматически. Укажите перевод вручную.", translating:"Ищем перевод…", duplicate:"Это слово уже есть в ваших карточках.", footerTagline:"Практика маленькими шагами.", deleteAria:"Удалить карточку", learnedAria:"Отметить как выученную", learningAria:"Вернуть в изучение", count:"карточек"},
  en:{ navFinder:"College Finder", navPractice:"Practice", navRoi:"ROI calculator", back:"Back to directory", eyebrow:"FULLRIDE / PRACTICE", title:"Learn words<br /><em>at your pace.</em>", intro:"Add unfamiliar English words, save them, and return to them in short random practice sessions.", saved:"cards saved", learned:"learned", addLabel:"NEW CARD", addTitle:"Add a word to practice", wordLabel:"English word", translationLabel:"Translation", optional:"(editable)", addButton:"Add card", translationNote:"A translation is requested automatically. You can edit it before saving.", libraryLabel:"MY CARDS", libraryTitle:"Review what matters", startButton:"Start practice", searchPlaceholder:"Search words and translations", filterAll:"All cards", filterLearning:"In progress", filterLearned:"Learned", sessionLabel:"SESSION", sessionTitle:"Recall the translation", revealButton:"Show translation", repeatButton:"Repeat", knowButton:"I know it", empty:"No cards yet. Add your first English word.", noMatch:"No cards match this search.", added:"Card added.", deleted:"Card deleted.", autoError:"Automatic translation failed. Enter a translation manually.", translating:"Finding a translation…", duplicate:"This word is already in your cards.", footerTagline:"Small steps, steady practice.", deleteAria:"Delete card", learnedAria:"Mark as learned", learningAria:"Return to learning", count:"cards"}
};

const flashcardKey = "fullride-flashcards-v1";
let practiceLanguage = ["uk","ru","en"].includes(new URLSearchParams(location.search).get("lang")) ? new URLSearchParams(location.search).get("lang") : "uk";
let flashcards = loadCards();
let searchTerm = "";
let filterMode = "all";
let practiceQueue = [];
let practiceIndex = 0;
let practiceRevealed = false;
const pq = id => document.getElementById(id);
const pc = key => practiceCopy[practiceLanguage][key] || practiceCopy.en[key] || key;

function loadCards() { try { const value = JSON.parse(localStorage.getItem(flashcardKey) || "[]"); return Array.isArray(value) ? value.filter(card => card && typeof card.id === "string" && card.word && card.translation).slice(0,500) : []; } catch { return []; } }
function saveCards() { localStorage.setItem(flashcardKey, JSON.stringify(flashcards)); window.dispatchEvent(new CustomEvent("fullride:local-data-changed", { detail:{ kind:"flashcards" } })); }
function normalize(value) { return String(value || "").trim().toLocaleLowerCase(); }
function visibleCards() { return flashcards.filter(card => { const matchesSearch = !searchTerm || normalize(`${card.word} ${card.translation}`).includes(normalize(searchTerm)); const matchesFilter = filterMode === "all" || (filterMode === "learned" ? card.learned : !card.learned); return matchesSearch && matchesFilter; }); }
function decodeHtml(value) { const area = document.createElement("textarea"); area.innerHTML = value; return area.value; }
async function autoTranslate(word) {
  const target = practiceLanguage === "uk" ? "uk" : "ru";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${target}`, { signal:controller.signal });
    const data = await response.json();
    const translated = decodeHtml(data?.responseData?.translatedText || "").trim();
    return translated && normalize(translated) !== normalize(word) ? translated : "";
  } catch { return ""; } finally { window.clearTimeout(timeout); }
}
function renderLanguage() {
  document.documentElement.lang = practiceLanguage;
  document.querySelectorAll("[data-practice-key]").forEach(element => { element.innerHTML = pc(element.dataset.practiceKey); });
  document.querySelectorAll("[data-practice-placeholder]").forEach(element => { element.placeholder = pc(element.dataset.practicePlaceholder); });
  document.querySelectorAll("[data-practice-lang]").forEach(button => button.classList.toggle("active", button.dataset.practiceLang === practiceLanguage));
  pq("word-input").placeholder = practiceLanguage === "en" ? "for example, scholarship" : "например, scholarship";
  render();
}
function render() {
  const learnedCount = flashcards.filter(card => card.learned).length;
  pq("practice-total").textContent = flashcards.length;
  pq("practice-learned").textContent = learnedCount;
  const cards = visibleCards();
  pq("card-result-count").textContent = `${cards.length} ${pc("count")}`;
  pq("card-list").innerHTML = cards.length ? cards.map(card => `<article class="flashcard-row ${card.learned ? "is-learned" : ""}"><div class="flashcard-row__word"><small>EN</small><strong>${escapeHtml(card.word)}</strong></div><div class="flashcard-row__translation"><small>${practiceLanguage === "uk" ? "Переклад" : practiceLanguage === "ru" ? "Перевод" : "Translation"}</small><div>${escapeHtml(card.translation)}</div></div><div class="flashcard-row__actions"><button type="button" data-card-learn="${escapeHtml(card.id)}" aria-label="${card.learned ? pc("learningAria") : pc("learnedAria")}">${card.learned ? "↶" : "✓"}</button><button type="button" data-card-delete="${escapeHtml(card.id)}" aria-label="${pc("deleteAria")}">×</button></div></article>`).join("") : `<p class="card-empty">${pc(searchTerm || filterMode !== "all" ? "noMatch" : "empty")}</p>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character])); }
function setStatus(message, error = false) { pq("card-status").textContent = message; pq("card-status").classList.toggle("is-error", error); }
function closePractice() { pq("practice-modal").classList.remove("is-open"); pq("practice-modal").setAttribute("aria-hidden", "true"); }
function updateSession() {
  const card = practiceQueue[practiceIndex];
  if (!card) return closePractice();
  practiceRevealed = false;
  pq("session-word").textContent = card.word;
  pq("session-translation").textContent = card.translation;
  pq("session-translation").hidden = true;
  pq("session-reveal").hidden = false;
  pq("session-counter").textContent = `${practiceIndex + 1} / ${practiceQueue.length}`;
  pq("session-progress").style.setProperty("--session-progress", `${((practiceIndex + 1) / practiceQueue.length) * 100}%`);
}
function startPractice() { practiceQueue = [...visibleCards()].sort(() => Math.random() - .5); if (!practiceQueue.length) { setStatus(pc("empty"), true); return; } practiceIndex = 0; pq("practice-modal").classList.add("is-open"); pq("practice-modal").setAttribute("aria-hidden", "false"); updateSession(); }
function nextSession(markLearned) { const card = practiceQueue[practiceIndex]; if (card && markLearned) { const saved = flashcards.find(item => item.id === card.id); if (saved) saved.learned = true; saveCards(); render(); } practiceIndex += 1; updateSession(); }

pq("card-form").addEventListener("submit", async event => {
  event.preventDefault();
  const word = pq("word-input").value.trim();
  let translation = pq("translation-input").value.trim();
  if (!word) return;
  if (flashcards.some(card => normalize(card.word) === normalize(word))) return setStatus(pc("duplicate"), true);
  const button = event.currentTarget.querySelector("button[type=submit]"); button.disabled = true;
  if (!translation) { setStatus(pc("translating")); translation = await autoTranslate(word); }
  button.disabled = false;
  if (!translation) return setStatus(pc("autoError"), true);
  flashcards.unshift({ id:`card-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, word, translation, learned:false, createdAt:Date.now() });
  saveCards(); event.currentTarget.reset(); setStatus(pc("added")); render();
});
pq("card-search").addEventListener("input", event => { searchTerm = event.target.value; render(); });
pq("card-filter").addEventListener("change", event => { filterMode = event.target.value; render(); });
pq("start-practice").addEventListener("click", startPractice);
pq("card-list").addEventListener("click", event => { const learn = event.target.closest("[data-card-learn]"); const remove = event.target.closest("[data-card-delete]"); if (learn) { const card = flashcards.find(item => item.id === learn.dataset.cardLearn); if (card) { card.learned = !card.learned; saveCards(); render(); } } if (remove) { flashcards = flashcards.filter(card => card.id !== remove.dataset.cardDelete); saveCards(); setStatus(pc("deleted")); render(); } });
pq("session-reveal").addEventListener("click", () => { practiceRevealed = true; pq("session-translation").hidden = false; pq("session-reveal").hidden = true; });
pq("session-know").addEventListener("click", () => nextSession(true));
pq("session-repeat").addEventListener("click", () => nextSession(false));
document.querySelectorAll("[data-practice-close]").forEach(element => element.addEventListener("click", closePractice));
document.addEventListener("keydown", event => { if (event.key === "Escape") closePractice(); });
document.querySelectorAll("[data-practice-lang]").forEach(button => button.addEventListener("click", () => { practiceLanguage = button.dataset.practiceLang; history.replaceState({}, "", `practice.html?lang=${practiceLanguage}`); renderLanguage(); }));
window.addEventListener("fullride:cloud-data", () => { flashcards = loadCards(); render(); });
renderLanguage();
