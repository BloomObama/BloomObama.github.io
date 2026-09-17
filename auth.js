const FIREBASE_VERSION = "12.19.0";
const config = globalThis.FullRideFirebaseConfig || {};
const requiredConfigFields = ["apiKey", "authDomain", "projectId", "appId"];
const configured = requiredConfigFields.every(field => {
  const value = String(config[field] || "");
  return value && !value.includes("YOUR_");
});

const authTranslations = {
  uk: {
    account:"Акаунт", close:"Закрити", welcome:"Ваш простір FullRide UA", intro:"Зберігайте список університетів і повертайтеся до нього з будь-якого пристрою.", signIn:"Увійти", signUp:"Створити акаунт", google:"Продовжити з Google", or:"або через email", email:"Email", password:"Пароль", name:"Ім'я", namePlaceholder:"Як до вас звертатися", passwordHint:"Щонайменше 8 символів", forgot:"Забули пароль?", submitSignIn:"Увійти", submitSignUp:"Створити акаунт", resetTitle:"Відновлення пароля", resetText:"Ми надішлемо безпечне посилання для створення нового пароля.", resetSubmit:"Надіслати посилання", back:"Назад до входу", resetSent:"Якщо акаунт існує, інструкція вже надіслана на цю адресу.", verificationSent:"Лист для підтвердження надіслано.", verifyEmail:"Підтвердити email", verified:"Email підтверджено", unverified:"Email ще не підтверджено", refresh:"Я вже підтвердив", profile:"Профіль", savedSync:"Обране та порівняння синхронізуються автоматично.", saveName:"Зберегти ім'я", passwordResetAccount:"Надіслати скидання пароля", signOut:"Вийти", memberSince:"Особистий акаунт", setupTitle:"Потрібне підключення Firebase", setupText:"Інтерфейс готовий. Додайте конфігурацію проєкту у firebase-config.js, увімкніть Email/Password і Google та опублікуйте Firestore rules.", loading:"Підключення…", genericError:"Не вдалося виконати дію. Спробуйте ще раз.", invalidCredential:"Неправильний email або пароль.", emailInUse:"Ця адреса вже використовується.", weakPassword:"Пароль має містити щонайменше 8 символів.", invalidEmail:"Перевірте формат email.", tooMany:"Забагато спроб. Спробуйте пізніше.", popupClosed:"Вікно Google було закрито до завершення входу.", popupBlocked:"Браузер заблокував вікно Google. Дозвольте спливаючі вікна та повторіть.", network:"Немає з'єднання з сервісом авторизації.", unauthorized:"Домен сайту не додано до Authorized domains у Firebase.", providerDisabled:"Цей спосіб входу ще не увімкнено у Firebase.", nameUpdated:"Ім'я оновлено.", syncError:"Вхід виконано, але хмарна синхронізація тимчасово недоступна.", privacy:"Пароль обробляє Firebase Authentication — сайт його не зберігає."
  },
  ru: {
    account:"Аккаунт", close:"Закрыть", welcome:"Ваше пространство FullRide UA", intro:"Сохраняйте список университетов и возвращайтесь к нему с любого устройства.", signIn:"Войти", signUp:"Создать аккаунт", google:"Продолжить с Google", or:"или через email", email:"Email", password:"Пароль", name:"Имя", namePlaceholder:"Как к вам обращаться", passwordHint:"Не менее 8 символов", forgot:"Забыли пароль?", submitSignIn:"Войти", submitSignUp:"Создать аккаунт", resetTitle:"Восстановление пароля", resetText:"Мы отправим безопасную ссылку для создания нового пароля.", resetSubmit:"Отправить ссылку", back:"Назад ко входу", resetSent:"Если аккаунт существует, инструкция уже отправлена на этот адрес.", verificationSent:"Письмо для подтверждения отправлено.", verifyEmail:"Подтвердить email", verified:"Email подтверждён", unverified:"Email ещё не подтверждён", refresh:"Я уже подтвердил", profile:"Профиль", savedSync:"Избранное и сравнение синхронизируются автоматически.", saveName:"Сохранить имя", passwordResetAccount:"Отправить сброс пароля", signOut:"Выйти", memberSince:"Личный аккаунт", setupTitle:"Требуется подключение Firebase", setupText:"Интерфейс готов. Добавьте конфигурацию проекта в firebase-config.js, включите Email/Password и Google и опубликуйте Firestore rules.", loading:"Подключение…", genericError:"Не удалось выполнить действие. Попробуйте ещё раз.", invalidCredential:"Неверный email или пароль.", emailInUse:"Этот адрес уже используется.", weakPassword:"Пароль должен содержать не менее 8 символов.", invalidEmail:"Проверьте формат email.", tooMany:"Слишком много попыток. Попробуйте позже.", popupClosed:"Окно Google было закрыто до завершения входа.", popupBlocked:"Браузер заблокировал окно Google. Разрешите всплывающие окна и повторите.", network:"Нет соединения с сервисом авторизации.", unauthorized:"Домен сайта не добавлен в Authorized domains в Firebase.", providerDisabled:"Этот способ входа ещё не включён в Firebase.", nameUpdated:"Имя обновлено.", syncError:"Вход выполнен, но облачная синхронизация временно недоступна.", privacy:"Пароль обрабатывает Firebase Authentication — сайт его не хранит."
  },
  en: {
    account:"Account", close:"Close", welcome:"Your FullRide UA space", intro:"Save universities and return to your list from any device.", signIn:"Sign in", signUp:"Create account", google:"Continue with Google", or:"or use email", email:"Email", password:"Password", name:"Name", namePlaceholder:"How should we address you?", passwordHint:"At least 8 characters", forgot:"Forgot password?", submitSignIn:"Sign in", submitSignUp:"Create account", resetTitle:"Reset password", resetText:"We will send a secure link for creating a new password.", resetSubmit:"Send reset link", back:"Back to sign in", resetSent:"If an account exists, instructions have been sent to that address.", verificationSent:"A verification email has been sent.", verifyEmail:"Verify email", verified:"Email verified", unverified:"Email is not verified yet", refresh:"I have verified", profile:"Profile", savedSync:"Saved universities and comparisons sync automatically.", saveName:"Save name", passwordResetAccount:"Send password reset", signOut:"Sign out", memberSince:"Personal account", setupTitle:"Firebase connection required", setupText:"The interface is ready. Add the project configuration to firebase-config.js, enable Email/Password and Google, and publish the Firestore rules.", loading:"Connecting…", genericError:"The action could not be completed. Try again.", invalidCredential:"Incorrect email or password.", emailInUse:"This address is already in use.", weakPassword:"Use a password with at least 8 characters.", invalidEmail:"Check the email format.", tooMany:"Too many attempts. Try again later.", popupClosed:"The Google window was closed before sign-in completed.", popupBlocked:"The browser blocked the Google window. Allow popups and try again.", network:"The authentication service could not be reached.", unauthorized:"This site domain is not in Firebase Authorized domains.", providerDisabled:"This sign-in method is not enabled in Firebase yet.", nameUpdated:"Name updated.", syncError:"You are signed in, but cloud sync is temporarily unavailable.", privacy:"Firebase Authentication processes your password; this website never stores it."
  }
};

let language = getLanguage();
let auth = null;
let db = null;
let authApi = null;
let firestoreApi = null;
let currentUser = null;
let syncing = false;
let syncTimer = null;
let lastFocusedElement = null;

function getLanguage() {
  const params = new URLSearchParams(location.search);
  const value = document.documentElement.lang || params.get("lang");
  return ["uk", "ru", "en"].includes(value) ? value : "uk";
}

const at = key => authTranslations[language]?.[key] || authTranslations.en[key] || key;
const aq = id => document.getElementById(id);

function injectAuthInterface() {
  const trigger = document.createElement("button");
  trigger.id = "account-trigger";
  trigger.className = "account-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-controls", "auth-dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = `<span class="account-trigger__avatar" aria-hidden="true">◎</span><span data-auth-key="account">${at("account")}</span>`;

  const actions = document.querySelector(".topbar-actions");
  const languageSwitch = document.querySelector(".topbar .language-switch");
  if (actions && languageSwitch) actions.insertBefore(trigger, languageSwitch);
  else if (languageSwitch) languageSwitch.parentElement.insertBefore(trigger, languageSwitch);
  else document.querySelector(".topbar")?.append(trigger);

  document.body.insertAdjacentHTML("beforeend", `
    <div id="auth-backdrop" class="auth-backdrop" aria-hidden="true"></div>
    <aside id="auth-dialog" class="auth-dialog" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="auth-title">
      <header class="auth-dialog__header">
        <div><span>FULLRIDE / ID</span><h2 id="auth-title" data-auth-key="welcome">${at("welcome")}</h2></div>
        <button id="auth-close" type="button" data-auth-aria="close" aria-label="${at("close")}">×</button>
      </header>
      <div class="auth-dialog__body">
        <section id="auth-setup" class="auth-setup" hidden>
          <span aria-hidden="true">01</span><h3 data-auth-key="setupTitle">${at("setupTitle")}</h3><p data-auth-key="setupText">${at("setupText")}</p>
        </section>
        <section id="auth-loading" class="auth-loading"><span></span><p data-auth-key="loading">${at("loading")}</p></section>
        <section id="auth-guest" hidden>
          <p class="auth-intro" data-auth-key="intro">${at("intro")}</p>
          <div class="auth-tabs" role="tablist">
            <button type="button" class="is-active" data-auth-view="signin" data-auth-key="signIn">${at("signIn")}</button>
            <button type="button" data-auth-view="signup" data-auth-key="signUp">${at("signUp")}</button>
          </div>
          <button id="auth-google" class="auth-google" type="button"><span aria-hidden="true">G</span><span data-auth-key="google">${at("google")}</span></button>
          <div class="auth-divider"><span data-auth-key="or">${at("or")}</span></div>
          <form id="auth-signin-form" class="auth-form">
            <label><span data-auth-key="email">${at("email")}</span><input name="email" type="email" autocomplete="email" required /></label>
            <label><span data-auth-key="password">${at("password")}</span><input name="password" type="password" autocomplete="current-password" minlength="8" required /></label>
            <button class="auth-primary" type="submit" data-auth-key="submitSignIn">${at("submitSignIn")}</button>
            <button class="auth-link" type="button" data-auth-view="reset" data-auth-key="forgot">${at("forgot")}</button>
          </form>
          <form id="auth-signup-form" class="auth-form" hidden>
            <label><span data-auth-key="name">${at("name")}</span><input name="name" type="text" autocomplete="name" maxlength="80" required data-auth-placeholder="namePlaceholder" placeholder="${at("namePlaceholder")}" /></label>
            <label><span data-auth-key="email">${at("email")}</span><input name="email" type="email" autocomplete="email" required /></label>
            <label><span data-auth-key="password">${at("password")}</span><input name="password" type="password" autocomplete="new-password" minlength="8" required /><small data-auth-key="passwordHint">${at("passwordHint")}</small></label>
            <button class="auth-primary" type="submit" data-auth-key="submitSignUp">${at("submitSignUp")}</button>
          </form>
          <form id="auth-reset-form" class="auth-form" hidden>
            <h3 data-auth-key="resetTitle">${at("resetTitle")}</h3><p data-auth-key="resetText">${at("resetText")}</p>
            <label><span data-auth-key="email">${at("email")}</span><input name="email" type="email" autocomplete="email" required /></label>
            <button class="auth-primary" type="submit" data-auth-key="resetSubmit">${at("resetSubmit")}</button>
            <button class="auth-link" type="button" data-auth-view="signin" data-auth-key="back">${at("back")}</button>
          </form>
          <p class="auth-privacy" data-auth-key="privacy">${at("privacy")}</p>
        </section>
        <section id="auth-user" class="auth-user" hidden>
          <div class="auth-user__identity"><div id="auth-user-avatar" class="auth-user__avatar">FR</div><div><span data-auth-key="memberSince">${at("memberSince")}</span><h3 id="auth-user-name"></h3><p id="auth-user-email"></p></div></div>
          <div id="auth-verification" class="auth-verification"><span id="auth-verification-label"></span><div><button id="auth-send-verification" type="button" data-auth-key="verifyEmail">${at("verifyEmail")}</button><button id="auth-refresh-user" type="button" data-auth-key="refresh">${at("refresh")}</button></div></div>
          <form id="auth-profile-form" class="auth-form auth-profile-form"><label><span data-auth-key="profile">${at("profile")}</span><input name="name" type="text" autocomplete="name" maxlength="80" /></label><button class="auth-primary" type="submit" data-auth-key="saveName">${at("saveName")}</button></form>
          <p class="auth-sync-note"><span aria-hidden="true">↻</span><span data-auth-key="savedSync">${at("savedSync")}</span></p>
          <div class="auth-account-actions"><button id="auth-password-email" type="button" data-auth-key="passwordResetAccount">${at("passwordResetAccount")}</button><button id="auth-signout" type="button" data-auth-key="signOut">${at("signOut")}</button></div>
        </section>
        <p id="auth-status" class="auth-status" role="status" aria-live="polite"></p>
      </div>
    </aside>`);

  const previewSetup = ["localhost", "127.0.0.1"].includes(location.hostname) || new URLSearchParams(location.search).has("authDebug");
  trigger.hidden = !configured && !previewSetup;
}

function applyLanguage() {
  language = getLanguage();
  document.querySelectorAll("[data-auth-key]").forEach(element => { element.textContent = at(element.dataset.authKey); });
  document.querySelectorAll("[data-auth-placeholder]").forEach(element => { element.placeholder = at(element.dataset.authPlaceholder); });
  document.querySelectorAll("[data-auth-aria]").forEach(element => { element.setAttribute("aria-label", at(element.dataset.authAria)); });
  if (auth) auth.languageCode = language;
  renderUser(currentUser);
}

function openDialog() {
  lastFocusedElement = document.activeElement;
  document.body.classList.add("auth-open");
  aq("auth-dialog").setAttribute("aria-hidden", "false");
  aq("auth-backdrop").setAttribute("aria-hidden", "false");
  aq("account-trigger").setAttribute("aria-expanded", "true");
  window.setTimeout(() => aq("auth-close")?.focus(), 30);
}

function closeDialog() {
  document.body.classList.remove("auth-open");
  aq("auth-dialog").setAttribute("aria-hidden", "true");
  aq("auth-backdrop").setAttribute("aria-hidden", "true");
  aq("account-trigger").setAttribute("aria-expanded", "false");
  lastFocusedElement?.focus?.();
}

function showStatus(message, isError = false) {
  const status = aq("auth-status");
  status.textContent = message || "";
  status.classList.toggle("is-error", Boolean(isError));
}

function setBusy(form, busy) {
  form?.querySelectorAll("button,input").forEach(element => { element.disabled = busy; });
}

function showAuthView(view) {
  const reset = view === "reset";
  document.querySelectorAll(".auth-tabs [data-auth-view]").forEach(button => button.classList.toggle("is-active", button.dataset.authView === view));
  aq("auth-signin-form").hidden = view !== "signin";
  aq("auth-signup-form").hidden = view !== "signup";
  aq("auth-reset-form").hidden = !reset;
  aq("auth-google").hidden = reset;
  document.querySelector(".auth-divider").hidden = reset;
  document.querySelector(".auth-tabs").hidden = reset;
  showStatus("");
}

function errorMessage(error) {
  const messages = {
    "auth/invalid-credential":"invalidCredential", "auth/wrong-password":"invalidCredential", "auth/user-not-found":"invalidCredential",
    "auth/email-already-in-use":"emailInUse", "auth/weak-password":"weakPassword", "auth/invalid-email":"invalidEmail",
    "auth/too-many-requests":"tooMany", "auth/popup-closed-by-user":"popupClosed", "auth/popup-blocked":"popupBlocked",
    "auth/network-request-failed":"network", "auth/unauthorized-domain":"unauthorized", "auth/operation-not-allowed":"providerDisabled"
  };
  return at(messages[error?.code] || "genericError");
}

function localArray(key, max = 5002) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === "string"))].slice(0, max) : [];
  } catch {
    return [];
  }
}

async function syncUserData(user, mergeRemote = false) {
  if (!user || !user.emailVerified || !db || syncing) return;
  syncing = true;
  try {
    const { doc, getDoc, setDoc, serverTimestamp } = firestoreApi;
    const reference = doc(db, "users", user.uid);
    const snapshot = await getDoc(reference);
    const remote = snapshot.exists() ? snapshot.data() : {};
    const localShortlist = localArray("fullride-shortlist-v1");
    const localComparison = localArray("fullride-compare-v1", 4);
    const shortlist = mergeRemote ? [...new Set([...(remote.shortlist || []), ...localShortlist])] : localShortlist;
    const comparison = mergeRemote ? [...new Set([...(remote.comparison || []), ...localComparison])].slice(0, 4) : localComparison;

    if (mergeRemote) {
      localStorage.setItem("fullride-shortlist-v1", JSON.stringify(shortlist));
      localStorage.setItem("fullride-compare-v1", JSON.stringify(comparison));
    }

    await setDoc(reference, {
      displayName: String(user.displayName || remote.displayName || "").slice(0, 80),
      shortlist,
      comparison,
      createdAt: remote.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge:true });

    if (mergeRemote) window.dispatchEvent(new CustomEvent("fullride:cloud-data"));
  } catch (error) {
    console.error("FullRide cloud sync failed", error);
    showStatus(at("syncError"), true);
  } finally {
    syncing = false;
  }
}

function scheduleSync() {
  if (!currentUser) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => syncUserData(currentUser), 700);
}

function renderUser(user) {
  if (!aq("auth-user")) return;
  currentUser = user || null;
  aq("auth-loading").hidden = true;
  aq("auth-setup").hidden = configured;
  aq("auth-guest").hidden = !configured || Boolean(user);
  aq("auth-user").hidden = !user;
  const trigger = aq("account-trigger");
  if (!configured) return;
  trigger.hidden = false;
  trigger.classList.toggle("is-signed-in", Boolean(user));
  trigger.querySelector("[data-auth-key='account']").textContent = user?.displayName || user?.email?.split("@")[0] || at("account");
  trigger.querySelector(".account-trigger__avatar").textContent = user ? (user.displayName || user.email || "U").trim().charAt(0).toUpperCase() : "◎";
  if (!user) return;

  const displayName = user.displayName || user.email?.split("@")[0] || at("account");
  aq("auth-user-name").textContent = displayName;
  aq("auth-user-email").textContent = user.email || "";
  aq("auth-user-avatar").textContent = displayName.trim().charAt(0).toUpperCase();
  aq("auth-profile-form").elements.name.value = user.displayName || "";
  aq("auth-verification-label").textContent = at(user.emailVerified ? "verified" : "unverified");
  aq("auth-verification").classList.toggle("is-verified", user.emailVerified);
  aq("auth-send-verification").hidden = user.emailVerified;
  aq("auth-refresh-user").hidden = user.emailVerified;
  aq("auth-password-email").hidden = !user.providerData.some(provider => provider.providerId === "password");
}

function emailActionUrl() {
  const url = new URL(location.href);
  ["mode", "oobCode", "apiKey", "continueUrl", "lang"].forEach(key => url.searchParams.delete(key));
  url.searchParams.set("lang", language);
  url.hash = "";
  return url.toString();
}

async function initializeFirebase() {
  if (!configured) {
    aq("auth-loading").hidden = true;
    aq("auth-setup").hidden = false;
    return;
  }
  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
    ]);
    authApi = authModule;
    firestoreApi = firestoreModule;
    const app = appModule.initializeApp(config);
    auth = authModule.getAuth(app);
    db = firestoreModule.getFirestore(app);
    auth.languageCode = language;
    await authModule.setPersistence(auth, authModule.browserLocalPersistence);
    authModule.onAuthStateChanged(auth, async user => {
      if (user) {
        try { await user.reload(); user = auth.currentUser; } catch {}
      }
      renderUser(user);
      showStatus("");
      if (user) await syncUserData(user, true);
    });
  } catch (error) {
    console.error("FullRide authentication failed to initialize", error);
    aq("auth-loading").hidden = true;
    aq("auth-guest").hidden = false;
    showStatus(errorMessage(error), true);
  }
}

injectAuthInterface();
applyLanguage();
aq("account-trigger")?.addEventListener("click", openDialog);
aq("auth-close")?.addEventListener("click", closeDialog);
aq("auth-backdrop")?.addEventListener("click", closeDialog);
document.addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("auth-open")) closeDialog(); });
document.addEventListener("click", event => {
  const languageButton = event.target.closest("[data-lang],[data-profile-lang],[data-compare-lang]");
  if (languageButton) window.setTimeout(applyLanguage, 0);
  const viewButton = event.target.closest("[data-auth-view]");
  if (viewButton && viewButton.closest("#auth-dialog")) showAuthView(viewButton.dataset.authView);
});

aq("auth-signin-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  setBusy(form, true); showStatus("");
  try {
    const values = new FormData(form);
    await authApi.signInWithEmailAndPassword(auth, String(values.get("email")).trim(), String(values.get("password")));
    form.reset();
  } catch (error) { showStatus(errorMessage(error), true); }
  finally { setBusy(form, false); }
});

aq("auth-signup-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  setBusy(form, true); showStatus("");
  try {
    const values = new FormData(form);
    const password = String(values.get("password"));
    if (password.length < 8) throw { code:"auth/weak-password" };
    const credential = await authApi.createUserWithEmailAndPassword(auth, String(values.get("email")).trim(), password);
    await authApi.updateProfile(credential.user, { displayName:String(values.get("name")).trim().slice(0, 80) });
    await authApi.sendEmailVerification(credential.user, { url:emailActionUrl() });
    await credential.user.reload();
    renderUser(auth.currentUser);
    await syncUserData(auth.currentUser, true);
    showStatus(at("verificationSent"));
    form.reset();
  } catch (error) { showStatus(errorMessage(error), true); }
  finally { setBusy(form, false); }
});

aq("auth-reset-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  setBusy(form, true); showStatus("");
  try {
    const email = String(new FormData(form).get("email")).trim();
    await authApi.sendPasswordResetEmail(auth, email, { url:emailActionUrl() });
    showStatus(at("resetSent"));
  } catch (error) {
    if (error?.code === "auth/user-not-found") showStatus(at("resetSent"));
    else showStatus(errorMessage(error), true);
  } finally { setBusy(form, false); }
});

aq("auth-google")?.addEventListener("click", async () => {
  const button = aq("auth-google");
  button.disabled = true; showStatus("");
  try {
    const provider = new authApi.GoogleAuthProvider();
    provider.setCustomParameters({ prompt:"select_account" });
    await authApi.signInWithPopup(auth, provider);
  } catch (error) { showStatus(errorMessage(error), true); }
  finally { button.disabled = false; }
});

aq("auth-send-verification")?.addEventListener("click", async () => {
  try {
    await authApi.sendEmailVerification(auth.currentUser, { url:emailActionUrl() });
    showStatus(at("verificationSent"));
  } catch (error) { showStatus(errorMessage(error), true); }
});

aq("auth-refresh-user")?.addEventListener("click", async () => {
  try { await auth.currentUser.reload(); renderUser(auth.currentUser); await syncUserData(auth.currentUser, true); }
  catch (error) { showStatus(errorMessage(error), true); }
});

aq("auth-profile-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  setBusy(form, true); showStatus("");
  try {
    const displayName = String(new FormData(form).get("name") || "").trim().slice(0, 80);
    await authApi.updateProfile(auth.currentUser, { displayName });
    renderUser(auth.currentUser);
    await syncUserData(auth.currentUser);
    showStatus(at("nameUpdated"));
  } catch (error) { showStatus(errorMessage(error), true); }
  finally { setBusy(form, false); }
});

aq("auth-password-email")?.addEventListener("click", async () => {
  try {
    await authApi.sendPasswordResetEmail(auth, auth.currentUser.email, { url:emailActionUrl() });
    showStatus(at("resetSent"));
  } catch (error) { showStatus(errorMessage(error), true); }
});

aq("auth-signout")?.addEventListener("click", async () => {
  try {
    if (auth.currentUser) await syncUserData(auth.currentUser);
    localStorage.removeItem("fullride-shortlist-v1");
    localStorage.removeItem("fullride-compare-v1");
    window.dispatchEvent(new CustomEvent("fullride:cloud-data"));
    await authApi.signOut(auth);
    closeDialog();
  }
  catch (error) { showStatus(errorMessage(error), true); }
});

window.addEventListener("fullride:local-data-changed", scheduleSync);
window.addEventListener("storage", event => {
  if (["fullride-shortlist-v1", "fullride-compare-v1"].includes(event.key)) scheduleSync();
});

globalThis.FullRideAuth = { configured, open:openDialog };
initializeFirebase();
