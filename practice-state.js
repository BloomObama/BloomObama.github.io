/* One local source of truth for personal cards and ready-made deck progress. */
(() => {
  if (globalThis.FullRidePracticeState) return;
  const STORAGE_KEY = "fullride-practice-state-v1";
  const CLOUD_RECORD_ID = "__fullride_practice_state_v1__";
  const OLD_CARDS_KEY = "fullride-flashcards-v1";
  const OLD_LEARNED_KEY = "fullride-pack-learned-v1";
  const OLD_SRS_KEY = "fullride-pack-srs-v1";
  const OLD_TRANSLATIONS_KEY = "fullride-pack-translations-v1";

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  };
  const validCard = card => card && typeof card === "object" && typeof card.id === "string" && typeof card.word === "string";
  const timestamp = value => Number.isFinite(value) && value > 0 ? value : 0;

  function emptyState() { return { schemaVersion:1, cards:[], deletedCards:{}, learnedWords:{}, deckSrs:{}, translations:{}, sessions:{} }; }
  function normalize(value) {
    const state = emptyState();
    if (!value || typeof value !== "object") return state;
    const deleted = value.deletedCards && typeof value.deletedCards === "object" ? value.deletedCards : {};
    for (const [id, at] of Object.entries(deleted)) if (typeof id === "string" && timestamp(at)) state.deletedCards[id] = timestamp(at);
    const learned = value.learnedWords && typeof value.learnedWords === "object" ? value.learnedWords : {};
    for (const [id, entry] of Object.entries(learned)) {
      if (typeof entry === "boolean") state.learnedWords[id] = { learned:entry, updatedAt:0 };
      else if (entry && typeof entry.learned === "boolean") state.learnedWords[id] = { learned:entry.learned, updatedAt:timestamp(entry.updatedAt) };
    }
    state.cards = Array.isArray(value.cards) ? value.cards.filter(validCard).filter(card => !state.deletedCards[card.id] || state.deletedCards[card.id] < timestamp(card.updatedAt || card.createdAt)).slice(0,500) : [];
    state.deckSrs = value.deckSrs && typeof value.deckSrs === "object" ? value.deckSrs : {};
    state.translations = value.translations && typeof value.translations === "object" ? value.translations : {};
    for (const [id,session] of Object.entries(value.sessions || {})) {
      if (session && Number.isInteger(session.index) && session.index >= 0 && session.index <= 20) state.sessions[id] = {index:session.index,updatedAt:timestamp(session.updatedAt)};
    }
    return state;
  }
  function legacyState() {
    const state = emptyState();
    state.cards = read(OLD_CARDS_KEY, []).filter(validCard).slice(0,500);
    for (const id of read(OLD_LEARNED_KEY, [])) if (typeof id === "string") state.learnedWords[id] = { learned:true, updatedAt:0 };
    state.deckSrs = read(OLD_SRS_KEY, {});
    state.translations = read(OLD_TRANSLATIONS_KEY, {});
    return state;
  }
  let state = normalize(read(STORAGE_KEY, null) || legacyState());

  function mergeState(incoming) {
    const other = normalize(incoming);
    const deleted = { ...state.deletedCards };
    for (const [id, at] of Object.entries(other.deletedCards)) deleted[id] = Math.max(deleted[id] || 0, at);
    const cards = new Map();
    for (const card of [...state.cards, ...other.cards]) {
      const current = cards.get(card.id);
      if (!current || timestamp(card.updatedAt || card.createdAt) > timestamp(current.updatedAt || current.createdAt)) cards.set(card.id, card);
    }
    state.deletedCards = deleted;
    state.cards = [...cards.values()].filter(card => (deleted[card.id] || 0) < timestamp(card.updatedAt || card.createdAt)).slice(0,500);
    const wordIds = new Set([...Object.keys(state.learnedWords), ...Object.keys(other.learnedWords)]);
    for (const id of wordIds) {
      const left = state.learnedWords[id], right = other.learnedWords[id];
      if (right && (!left || right.updatedAt > left.updatedAt)) state.learnedWords[id] = right;
    }
    for (const [id,entry] of Object.entries(other.deckSrs)) {
      const current = state.deckSrs[id];
      if (!current || timestamp(entry?.lastReviewedAt) > timestamp(current?.lastReviewedAt)) state.deckSrs[id] = entry;
    }
    state.translations = { ...state.translations, ...other.translations };
    for (const [id,session] of Object.entries(other.sessions)) {
      if (!state.sessions[id] || session.updatedAt > state.sessions[id].updatedAt) state.sessions[id] = session;
    }
  }
  function fromCloud(record, legacyLearned = []) {
    const wrapper = Array.isArray(record) ? record.find(item => item?.id === CLOUD_RECORD_ID)?.state : record?.id === CLOUD_RECORD_ID ? record.state : null;
    if (wrapper) return normalize(wrapper);
    const old = emptyState();
    old.cards = Array.isArray(record) ? record.filter(validCard) : [];
    for (const id of Array.isArray(legacyLearned) ? legacyLearned : []) if (typeof id === "string") old.learnedWords[id] = { learned:true, updatedAt:0 };
    return old;
  }
  function save() {
    const persisted = read(STORAGE_KEY,null);
    if (persisted) mergeState(persisted);
    state.schemaVersion = 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    for (const key of [OLD_CARDS_KEY, OLD_LEARNED_KEY, OLD_SRS_KEY, OLD_TRANSLATIONS_KEY]) localStorage.removeItem(key);
  }
  function removeCard(id) {
    state.deletedCards[id] = Date.now();
    state.cards = state.cards.filter(card => card.id !== id);
    save();
  }
  function clear() {
    state = emptyState();
    for (const key of [STORAGE_KEY, OLD_CARDS_KEY, OLD_LEARNED_KEY, OLD_SRS_KEY, OLD_TRANSLATIONS_KEY]) localStorage.removeItem(key);
  }
  function cloudRecord() { return { id:CLOUD_RECORD_ID, state }; }
  function exportLearned() { return Object.entries(state.learnedWords).filter(([,entry]) => entry.learned).map(([id]) => id).slice(0,3000); }

  const api = {
    get state() { return state; },
    save,
    removeCard,
    clear,
    mergeCloud(cards, learned) { mergeState(fromCloud(cards, learned)); save(); return state; },
    mergeBackup(value) { mergeState(value); save(); return state; },
    cloudRecord,
    exportLearned,
    cloudRecordId:CLOUD_RECORD_ID
  };
  save();
  globalThis.FullRidePracticeState = api;
  if (typeof window !== 'undefined') window.addEventListener('storage',event => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try { mergeState(JSON.parse(event.newValue)); window.dispatchEvent(new CustomEvent('fullride:cloud-data')); } catch {}
  });
})();
