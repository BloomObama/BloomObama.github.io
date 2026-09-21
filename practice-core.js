/* Shared, dependency-free practice rules. Keep this file testable outside the browser. */
(function (root) {
  const DAY = 86400000;
  const irregular = {
    be:["am","is","are","was","were","been","being"], become:["became","become"], begin:["began","begun"],
    bring:["brought"], buy:["bought"], catch:["caught"], choose:["chose","chosen"], come:["came"],
    do:["did","done"], drink:["drank","drunk"], drive:["drove","driven"], eat:["ate","eaten"],
    fall:["fell","fallen"], feel:["felt"], find:["found"], get:["got","gotten"], give:["gave","given"],
    go:["went","gone"], grow:["grew","grown"], have:["has","had"], hear:["heard"], hold:["held"],
    keep:["kept"], know:["knew","known"], lead:["led"], leave:["left"], make:["made"],
    mean:["meant"], pay:["paid"], read:["read"], run:["ran"], say:["said"], see:["saw","seen"],
    sell:["sold"], send:["sent"], sit:["sat"], speak:["spoke","spoken"], spend:["spent"],
    stand:["stood"], take:["took","taken"], teach:["taught"], tell:["told"], think:["thought"],
    understand:["understood"], wear:["wore","worn"], win:["won"], write:["wrote","written"]
  };
  function normalize(value) { return String(value || "").trim().toLocaleLowerCase("en"); }
  function inflections(word) {
    const base = normalize(word);
    const forms = new Set([base, ...(irregular[base] || [])]);
    if (!/^[a-z]+$/.test(base) || base.length < 2) return forms;
    forms.add(base + "s");
    forms.add(base + "ed");
    forms.add(base + "ing");
    if (base.endsWith("e")) { forms.add(base + "d"); forms.add(base.slice(0, -1) + "ing"); }
    if (/[^aeiou]y$/.test(base)) { forms.add(base.slice(0, -1) + "ies"); forms.add(base.slice(0, -1) + "ied"); }
    if (/(s|x|z|ch|sh)$/.test(base)) forms.add(base + "es");
    if (/^[a-z]*[aeiou][^aeiouwxy]$/.test(base)) {
      forms.add(base + base.at(-1) + "ed");
      forms.add(base + base.at(-1) + "ing");
    }
    return forms;
  }
  function sentenceUsesWord(sentence, word) {
    const target = normalize(word).match(/[a-z]+/g) || [];
    const tokens = normalize(sentence).match(/[a-z]+/g) || [];
    if (!target.length) return false;
    for (let index = 0; index <= tokens.length - target.length; index += 1) {
      if (target.every((part, offset) => inflections(part).has(tokens[index + offset]))) return true;
    }
    return false;
  }
  function parseWords(text) {
    return [...new Set(String(text || "").split(/[,;\n\r]+/).map(item =>
      item.trim().replace(/^[-•*\d.)\s]+/, "").replace(/[.!?]+$/, "").trim()
    ).filter(item => item.length <= 120 && /^[a-z][a-z'’\s-]*$/i.test(item)).map(item => item.replace(/\s+/g, " ")))];
  }
  function initialSrs(learned, createdAt) {
    return { status:learned ? "mastered" : "new", step:learned ? 4 : 0,
      intervalDays:learned ? 30 : 0, dueAt:learned ? Date.now() : Number(createdAt) || Date.now(),
      firstReviewedAt:null, lastReviewedAt:null, history:[] };
  }
  function hydrateSrs(value, learned, createdAt) {
    const fallback = initialSrs(learned, createdAt);
    if (!value || typeof value !== "object") return fallback;
    return {
      status:["new","learning","review","mastered"].includes(value.status) ? value.status : fallback.status,
      step:Number.isInteger(value.step) ? Math.max(0, Math.min(value.step, 12)) : fallback.step,
      intervalDays:Number.isFinite(value.intervalDays) ? Math.max(0, Math.min(value.intervalDays, 3650)) : fallback.intervalDays,
      dueAt:Number.isFinite(value.dueAt) ? value.dueAt : fallback.dueAt,
      firstReviewedAt:Number.isFinite(value.firstReviewedAt) ? value.firstReviewedAt : null,
      lastReviewedAt:Number.isFinite(value.lastReviewedAt) ? value.lastReviewedAt : null,
      history:Array.isArray(value.history) ? value.history.filter(entry =>
        entry && Number.isFinite(entry.at) && ["again","hard","good","easy"].includes(entry.rating)
      ).slice(-12).map(entry => ({ at:entry.at, rating:entry.rating, intervalDays:Number(entry.intervalDays) || 0 })) : []
    };
  }
  function scheduleReview(current, rating, now = Date.now()) {
    const srs = hydrateSrs(current, false, now);
    let step = srs.step;
    let intervalDays;
    if (rating === "again") { step = Math.max(0, step - 2); intervalDays = 10 / 1440; }
    else if (rating === "hard") intervalDays = Math.max(1, Math.round((srs.intervalDays || 1) * .65));
    else {
      step = Math.min(12, step + (rating === "easy" ? 2 : 1));
      const base = [0,1,3,7,14,30,60,120,240,365,730,1095,1460][step];
      intervalDays = rating === "easy" ? Math.max(3, Math.round(base * 1.5)) : base;
    }
    return { status:intervalDays >= 30 ? "mastered" : "learning", step, intervalDays,
      dueAt:now + intervalDays * DAY, firstReviewedAt:srs.firstReviewedAt || now,
      lastReviewedAt:now, history:[...srs.history, {at:now,rating,intervalDays}].slice(-12) };
  }
  function selectSession(cards, now = Date.now(), limit = 20) {
    const due = cards.filter(card => card.srs.status !== "new" && card.srs.dueAt <= now)
      .sort((a,b) => a.srs.dueAt - b.srs.dueAt);
    const fresh = cards.filter(card => card.srs.status === "new")
      .sort((a,b) => a.createdAt - b.createdAt);
    const selected = [];
    while (selected.length < limit && (due.length || fresh.length)) {
      if (fresh.length) selected.push(fresh.shift());
      if (selected.length % 4 === 3 && due.length && selected.length < limit) selected.push(due.shift());
      if (!fresh.length && due.length && selected.length < limit) selected.push(due.shift());
    }
    return selected.slice(0, limit);
  }
  const core = { DAY, normalize, inflections, sentenceUsesWord, parseWords, initialSrs, hydrateSrs, scheduleReview, selectSession };
  root.FullRidePracticeCore = core;
  if (typeof module !== "undefined" && module.exports) module.exports = core;
})(globalThis);
