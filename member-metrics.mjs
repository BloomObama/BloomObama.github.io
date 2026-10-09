// Account metrics contain no passwords, notes, or browsing history.
// The database rules, not this client, decide who may read the summaries.
export function createMemberMetrics({ db, firestore }) {
  const { doc, setDoc, increment, serverTimestamp } = firestore;
  let member = null;
  let pendingSeconds = 0;
  let lastTick = performance.now();
  let timer = null;
  let writeQueue = Promise.resolve();
  let warned = false;

  function report(error) {
    if (!warned) console.warn('AdmitVector activity metrics are unavailable', error);
    warned = true;
  }

  function focused() {
    return document.visibilityState === 'visible' && document.hasFocus();
  }

  function tick() {
    const now = performance.now();
    const elapsed = Math.min(2, Math.max(0, (now - lastTick) / 1000));
    lastTick = now;
    if (member && focused()) pendingSeconds += elapsed;
    if (pendingSeconds >= 30) void flush();
  }

  function flush() {
    if (!member) return writeQueue;
    const seconds = Math.min(60, Math.floor(pendingSeconds));
    if (!seconds) return writeQueue;
    pendingSeconds -= seconds;
    const uid = member.uid;
    writeQueue = writeQueue.catch(() => {}).then(() =>
      setDoc(doc(db, 'memberActivity', uid), {
        activeSeconds: increment(seconds),
        updatedAt: serverTimestamp()
      }, { merge: true })
    ).catch(error => {
      if (member?.uid === uid) pendingSeconds += seconds;
      report(error);
    });
    return writeQueue;
  }

  function refreshIdentity(user) {
    if (!user?.emailVerified || !user.email) return Promise.resolve();
    const displayName = String(user.displayName || '').slice(0, 80);
    const cacheKey = `admitvector-member-summary:${user.uid}`;
    const identity = JSON.stringify([user.email, displayName]);
    try { if (sessionStorage.getItem(cacheKey) === identity) return Promise.resolve(); }
    catch {}
    return setDoc(doc(db, 'memberSummaries', user.uid), {
      email: user.email,
      displayName,
      updatedAt: serverTimestamp()
    }, { merge: true }).then(() => {
      try { sessionStorage.setItem(cacheKey, identity); } catch {}
    }).catch(report);
  }

  function start(user) {
    if (!user?.emailVerified || !user.email) return;
    if (member?.uid === user.uid) return;
    if (member) void flush();
    member = { uid: user.uid };
    pendingSeconds = 0;
    lastTick = performance.now();
    if (!timer) timer = window.setInterval(tick, 1000);
  }

  function stop() {
    tick();
    const completed = flush();
    member = null;
    pendingSeconds = 0;
    if (timer) window.clearInterval(timer);
    timer = null;
    return completed;
  }

  document.addEventListener('visibilitychange', () => {
    tick();
    if (document.visibilityState === 'hidden') void flush();
  });
  window.addEventListener('blur', () => { tick(); void flush(); });
  window.addEventListener('focus', () => { lastTick = performance.now(); });
  window.addEventListener('pagehide', () => { tick(); void flush(); });

  return { start, stop, flush, refreshIdentity };
}
