/* GA4 is deliberately loaded only after an explicit, browser-local choice. */
(() => {
  const measurementId = 'G-XR6QWB4BDZ';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;

  const storageKey = 'admitvector-analytics-consent-v1';
  const labels = {
    uk: { text: 'Допоможіть нам зрозуміти, які сторінки корисні. Аналітика Google вмикається лише за вашою згодою.', accept: 'Дозволити', decline: 'Без аналітики', settings: 'Налаштувати аналітику', on: 'Аналітика дозволена', off: 'Аналітика вимкнена' },
    ru: { text: 'Помогите нам понять, какие страницы полезны. Google Analytics включается только с вашего согласия.', accept: 'Разрешить', decline: 'Без аналитики', settings: 'Настроить аналитику', on: 'Аналитика разрешена', off: 'Аналитика выключена' },
    en: { text: 'Help us understand which pages are useful. Google Analytics runs only with your consent.', accept: 'Allow', decline: 'No analytics', settings: 'Analytics settings', on: 'Analytics enabled', off: 'Analytics disabled' }
  };
  const language = () => labels[globalThis.FullRidePreferences?.language?.()] || labels.uk;
  const read = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
  let loaded = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    globalThis.dataLayer = globalThis.dataLayer || [];
    globalThis.gtag = function () { globalThis.dataLayer.push(arguments); };
    globalThis.gtag('js', new Date());
    globalThis.gtag('config', measurementId, {
      page_location: `${location.origin}${location.pathname}`,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  }

  function clearAnalyticsCookies() {
    const cookieDomain = location.hostname.replace(/^www\./, '');
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (/^_ga(?:_|$)/.test(name)) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${cookieDomain}; SameSite=Lax`;
      }
    }
  }

  function refreshStatus() {
    const label = language();
    document.querySelectorAll('[data-analytics-settings]').forEach(button => {
      button.hidden = false;
      button.textContent = label.settings;
    });
    document.querySelectorAll('[data-analytics-status]').forEach(node => {
      node.textContent = read() === 'granted' ? label.on : label.off;
    });
  }

  function choose(value) {
    try { localStorage.setItem(storageKey, value); } catch { return; }
    document.getElementById('av-analytics-consent')?.remove();
    refreshStatus();
    if (value === 'granted') loadAnalytics();
    else if (loaded) { clearAnalyticsCookies(); location.reload(); }
  }

  function showChoices() {
    if (document.getElementById('av-analytics-consent')) return;
    const label = language();
    const panel = document.createElement('aside');
    panel.id = 'av-analytics-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', label.settings);
    panel.style.cssText = 'position:fixed;z-index:10000;inset:auto 18px 18px auto;max-width:min(440px,calc(100vw - 36px));padding:20px;background:#fffaf5;color:#341b26;border:1px solid #d7b899;border-radius:16px;box-shadow:0 18px 55px #28101a33;font:500 14px/1.55 Manrope,system-ui,sans-serif';
    const message = document.createElement('p');
    message.textContent = label.text;
    message.style.cssText = 'margin:0 0 14px';
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
    const decline = document.createElement('button');
    decline.type = 'button'; decline.textContent = label.decline;
    decline.style.cssText = 'border:1px solid #b9a3a9;border-radius:9px;background:transparent;color:inherit;padding:9px 14px;font:inherit;cursor:pointer';
    decline.addEventListener('click', () => choose('denied'));
    const accept = document.createElement('button');
    accept.type = 'button'; accept.textContent = label.accept;
    accept.style.cssText = 'border:1px solid #842138;border-radius:9px;background:#842138;color:#fff;padding:9px 14px;font:700 14px Manrope,system-ui,sans-serif;cursor:pointer';
    accept.addEventListener('click', () => choose('granted'));
    actions.append(decline, accept);
    panel.append(message, actions);
    document.body.append(panel);
  }

  function start() {
    refreshStatus();
    window.addEventListener('storage', event => {
      if (event.key !== storageKey) return;
      if (event.newValue === 'granted') {
        document.getElementById('av-analytics-consent')?.remove();
        loadAnalytics();
      } else if (loaded) {
        clearAnalyticsCookies();
        location.reload();
      } else {
        document.getElementById('av-analytics-consent')?.remove();
      }
      refreshStatus();
    });
    document.addEventListener('click', event => {
      if (event.target.closest('[data-analytics-settings]')) showChoices();
    });
    const consent = read();
    if (consent === 'granted') loadAnalytics();
    else if (consent !== 'denied') showChoices();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
