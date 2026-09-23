/* Shared, progressively enhanced navigation for the site pages. */
(() => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const copy = {
    uk: {
      menu:"Відкрити меню", close:"Закрити меню", navigation:"Навігація", tools:"Інструменти",
      home:"Головна", finder:"Університети", practice:"Практика", resources:"Ресурси IELTS", compare:"Порівняння",
      saved:"Обране", roi:"Калькулятор ROI", method:"Як користуватися", about:"Про проєкт",
      contact:"Контакти", account:"Мій акаунт", tagline:"Ваш шлях до вступу"
    },
    ru: {
      menu:"Открыть меню", close:"Закрыть меню", navigation:"Навигация", tools:"Инструменты",
      home:"Главная", finder:"Университеты", practice:"Практика", resources:"Ресурсы IELTS", compare:"Сравнение",
      saved:"Избранное", roi:"Калькулятор ROI", method:"Как пользоваться", about:"О проекте",
      contact:"Контакты", account:"Мой аккаунт", tagline:"Ваш путь к поступлению"
    },
    en: {
      menu:"Open menu", close:"Close menu", navigation:"Explore", tools:"Tools",
      home:"Home", finder:"Universities", practice:"Practice", resources:"IELTS resources", compare:"Compare",
      saved:"Saved", roi:"ROI calculator", method:"How it works", about:"About",
      contact:"Contact", account:"My account", tagline:"Your path to admission"
    }
  };
  const icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    finder:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    practice:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 4.5V22m5-14h7m-7 4h5"/>',
    resources:'<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z"/><path d="M5 18a3 3 0 0 1 3-3h11M9 7h6m-6 4h5"/>',
    compare:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
    saved:'<path d="m12 2 3 6.3 7 .9-5.1 4.9 1.3 7L12 17.8 5.8 21l1.3-7L2 9.2l7-.9z"/>',
    roi:'<path d="M4 20h16M6 16v-5m4 5V7m4 9V9m4 7V4"/>',
    method:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7z"/>',
    about:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
    contact:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
    account:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>'
  };
  const route = [
    ["home","home"], ["finder","finder"], ["practice","practice"], ["resources","resources"], ["compare","compare"],
    ["saved","saved"], ["roi","roi"], ["method","method"], ["about","about"], ["contact","contact"]
  ];
  const icon = key => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[key] + '</svg>';
  const language = () => {
    const value = document.documentElement.lang.slice(0,2).toLowerCase();
    return copy[value] ? value : "uk";
  };
  const file = location.pathname.split("/").pop() || "index.html";
  const onHome = file === "index.html";
  const href = (key, lang) => {
    if (key === "practice" || key === "compare") return key + ".html?lang=" + lang;
    if (key === "resources") return "ielts-resources.html?lang=" + lang;
    const section = key === "home" ? "top" : key;
    return (onHome ? "" : "index.html?lang=" + lang) + "#" + section;
  };
  const rail = document.createElement("aside");
  rail.id = "site-navigation";
  rail.className = "fr-rail";
  rail.setAttribute("aria-label", "Site navigation");
  const backdrop = document.createElement("div");
  backdrop.className = "fr-rail-backdrop";
  backdrop.hidden = true;
  const toggle = document.createElement("button");
  toggle.className = "fr-menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", rail.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<span></span><span></span><span></span>';
  topbar.insertBefore(toggle, topbar.firstChild);
  document.body.prepend(backdrop);
  document.body.prepend(rail);
  document.body.classList.add("has-side-rail");

  function activeRoute() {
    if (file === "practice.html") return "practice";
    if (file === "ielts-resources.html") return "resources";
    if (file === "compare.html") return "compare";
    if (file === "university.html") return "finder";
    const section = location.hash.slice(1);
    return ["finder","roi","method","about","contact"].includes(section) ? section : "home";
  }
  function setActive(key) {
    rail.querySelectorAll("[data-rail-route]").forEach(link => {
      const active = link.dataset.railRoute === key;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  function render() {
    const lang = language();
    const t = copy[lang];
    const link = ([key]) => {
      const isButton = key === "saved";
      return '<' + (isButton ? 'button type="button" data-rail-saved' : 'a href="' + href(key,lang) + '" data-rail-route="' + key + '"') +
        ' class="fr-rail__link">' + icon(key) + '<span>' + t[key] + '</span><span class="fr-rail__arrow" aria-hidden="true">↗</span></' + (isButton ? "button" : "a") + '>';
    };
    rail.innerHTML =
      '<div class="fr-rail__brand"><a href="' + href("home",lang) + '" aria-label="FullRide UA"><span class="fr-rail__mark">FR</span><strong>FullRide <i>UA</i></strong></a><button class="fr-rail__close" type="button" aria-label="' + t.close + '">×</button></div>' +
      '<p class="fr-rail__caption">' + t.navigation + '</p><nav aria-label="' + t.navigation + '">' + route.slice(0,6).map(link).join("") + '</nav>' +
      '<p class="fr-rail__caption fr-rail__caption--tools">' + t.tools + '</p><nav aria-label="' + t.tools + '">' + route.slice(6).map(link).join("") + '</nav>' +
      '<div class="fr-rail__footer"><button class="fr-rail__account" type="button" data-rail-account>' + icon("account") + '<span>' + t.account + '</span></button><small>' + t.tagline + '</small></div>';
    rail.setAttribute("aria-label", t.navigation);
    toggle.setAttribute("aria-label", document.body.classList.contains("fr-rail-open") ? t.close : t.menu);
    if (!onHome) {
      const brand = topbar.querySelector(".brand");
      if (brand) brand.href = href("home", lang);
      topbar.querySelectorAll(".practice-back,.compare-back,.profile-back").forEach(back => {
        back.href = href("finder", lang);
      });
    }
    setActive(activeRoute());
  }
  function setOpen(open) {
    document.body.classList.toggle("fr-rail-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", copy[language()][open ? "close" : "menu"]);
    backdrop.hidden = !open;
    syncAccessibility();
    if (open) rail.querySelector(".fr-rail__close")?.focus();
  }
  function syncAccessibility() {
    const hidden = window.innerWidth < 1120 && !document.body.classList.contains("fr-rail-open");
    rail.inert = hidden;
    rail.setAttribute("aria-hidden", String(hidden));
  }
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("fr-rail-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  rail.addEventListener("click", event => {
    if (event.target.closest(".fr-rail__close")) { setOpen(false); toggle.focus(); return; }
    if (event.target.closest("[data-rail-account]")) {
      setOpen(false);
      document.getElementById("account-trigger")?.click();
      return;
    }
    if (event.target.closest("[data-rail-saved]")) {
      setOpen(false);
      if (onHome) document.querySelector("#shortlist-toggle")?.click();
      else {
        sessionStorage.setItem("fullride-open-saved", "1");
        location.href = href("finder", language());
      }
      return;
    }
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("fr-rail-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("hashchange", () => setActive(activeRoute()));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1120 && document.body.classList.contains("fr-rail-open")) setOpen(false);
    syncAccessibility();
  });
  new MutationObserver(() => render()).observe(document.documentElement, { attributes:true, attributeFilter:["lang"] });
  render();
  syncAccessibility();
  if (onHome && sessionStorage.getItem("fullride-open-saved") === "1") {
    sessionStorage.removeItem("fullride-open-saved");
    requestAnimationFrame(() => document.querySelector("#shortlist-toggle")?.click());
  }
  if (onHome) {
    const sections = ["finder","roi","method","about","contact"].map(id => document.getElementById(id)).filter(Boolean);
    let scheduled = false;
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const current = [...sections].reverse().find(section => section.getBoundingClientRect().top < window.innerHeight * .35);
        setActive(current?.id || "home");
        scheduled = false;
      });
    }, { passive:true });
  }
})();
