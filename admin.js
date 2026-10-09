const OWNER_EMAIL = 'admitvector@gmail.com';
const FIREBASE_VERSION = '12.19.0';
const config = globalThis.FullRideFirebaseConfig;
const $ = id => document.getElementById(id);
const members = [];
let pageNumber = 0;
let auth, database, authApi, firestoreApi;

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} хв`;
  const hours = Math.floor(minutes / 60);
  return `${hours} год ${minutes % 60} хв`;
}

function formatDate(timestamp) {
  const date = timestamp?.toDate?.();
  return date && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('uk-UA', { dateStyle:'medium', timeStyle:'short' }).format(date)
    : '—';
}

function showGate(message = '') {
  $('admin-gate').hidden = false;
  $('admin-dashboard').hidden = true;
  $('admin-gate-status').textContent = message;
}

function renderRows() {
  const search = $('admin-search').value.trim().toLocaleLowerCase();
  const filtered = members.filter(member => `${member.email} ${member.name}`.toLocaleLowerCase().includes(search));
  const pages = Math.max(1, Math.ceil(filtered.length / 50));
  pageNumber = Math.min(pageNumber, pages - 1);
  const rows = filtered.slice(pageNumber * 50, pageNumber * 50 + 50);
  const body = $('admin-rows');
  body.replaceChildren();
  for (const member of rows) {
    const row = document.createElement('tr');
    for (const value of [member.name || 'Без імені', member.email, formatDuration(member.seconds), formatDate(member.updatedAt)]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    body.append(row);
  }
  $('admin-list-note').textContent = filtered.length
    ? `Показано ${rows.length} із ${filtered.length} профілів. Тут немає паролів і приватного прогресу.`
    : 'Профілів за цим запитом немає.';
  $('admin-page').textContent = `${pageNumber + 1} / ${pages}`;
  $('admin-prev').disabled = pageNumber === 0;
  $('admin-next').disabled = pageNumber >= pages - 1;
}

async function loadDashboard() {
  $('admin-refresh').disabled = true;
  $('admin-list-note').textContent = 'Завантаження…';
  try {
    const { collection, getDocs } = firestoreApi;
    const [summaries, activity] = await Promise.all([
      getDocs(collection(database, 'memberSummaries')),
      getDocs(collection(database, 'memberActivity'))
    ]);
    const activityById = new Map(activity.docs.map(doc => [doc.id, doc.data()]));
    members.splice(0, members.length, ...summaries.docs.map(doc => {
      const summary = doc.data();
      const usage = activityById.get(doc.id) || {};
      return {
        name: typeof summary.displayName === 'string' ? summary.displayName : '',
        email: typeof summary.email === 'string' ? summary.email : '',
        seconds: Number.isFinite(usage.activeSeconds) ? usage.activeSeconds : 0,
        updatedAt: usage.updatedAt
      };
    }).sort((a,b) => b.seconds - a.seconds || a.email.localeCompare(b.email)));
    $('admin-members').textContent = new Intl.NumberFormat('uk-UA').format(members.length);
    $('admin-tracked').textContent = new Intl.NumberFormat('uk-UA').format(members.filter(member => member.seconds > 0).length);
    $('admin-time').textContent = formatDuration(members.reduce((total, member) => total + member.seconds, 0));
    pageNumber = 0;
    renderRows();
  } catch (error) {
    $('admin-list-note').textContent = error?.code === 'permission-denied'
      ? 'Доступ заборонено правилами Firebase. Потрібно опублікувати оновлені правила Firestore для проєкту fullrideua.'
      : 'Не вдалося отримати дані. Перевірте підключення та спробуйте ще раз.';
    console.warn('AdmitVector owner dashboard unavailable', error);
  } finally {
    $('admin-refresh').disabled = false;
  }
}

async function init() {
  if (!config?.apiKey || !config?.projectId) { showGate('Налаштування Firebase відсутні.'); return; }
  try {
    const [appApi, authModule, firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
    ]);
    authApi = authModule;
    firestoreApi = firestoreModule;
    const app = appApi.initializeApp(config);
    auth = authApi.getAuth(app);
    database = firestoreApi.getFirestore(app);
    authApi.onAuthStateChanged(auth, async user => {
      if (!user) { showGate(); return; }
      try { await user.reload(); user = auth.currentUser; } catch {}
      if (!user || !user.emailVerified || user.email?.toLowerCase() !== OWNER_EMAIL) {
        showGate('Цей акаунт не має доступу. Увійдіть через admitvector@gmail.com.');
        return;
      }
      $('admin-gate').hidden = true;
      $('admin-dashboard').hidden = false;
      $('admin-identity').textContent = user.email;
      await loadDashboard();
    });
  } catch (error) {
    showGate('Не вдалося підключитися до Firebase. Оновіть сторінку пізніше.');
    console.warn('AdmitVector admin sign-in unavailable', error);
  }
}

$('admin-signin').addEventListener('click', async () => {
  if (!authApi || !auth) return;
  $('admin-signin').disabled = true;
  $('admin-gate-status').textContent = '';
  try {
    const provider = new authApi.GoogleAuthProvider();
    provider.setCustomParameters({ prompt:'select_account' });
    await authApi.signInWithPopup(auth, provider);
  } catch (error) {
    $('admin-gate-status').textContent = 'Вхід не відбувся. Перевірте Google-акаунт і дозволені домени Firebase.';
    console.warn('AdmitVector admin sign-in failed', error);
  } finally { $('admin-signin').disabled = false; }
});
$('admin-signout').addEventListener('click', () => authApi.signOut(auth));
$('admin-refresh').addEventListener('click', loadDashboard);
$('admin-search').addEventListener('input', () => { pageNumber = 0; renderRows(); });
$('admin-prev').addEventListener('click', () => { pageNumber--; renderRows(); });
$('admin-next').addEventListener('click', () => { pageNumber++; renderRows(); });
init();
