import fs from "node:fs";
import path from "node:path";

const baseUrl = "https://www.admitvector.com/";
const labels = {
  aid:"Фінансова допомога",
  testing:"SAT / ACT",
  english:"Англійська мова",
  fee:"Application fee",
  deadline:"Дедлайни"
};

function externalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function documentHtml({ title, description, canonical, body, assetPrefix, escape }) {
  const safeTitle = escape(title);
  const safeDescription = escape(description);
  const safeCanonical = escape(canonical);
  return [
    "<!doctype html>",
    '<html lang="uk">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + safeTitle + "</title>",
    '<meta name="description" content="' + safeDescription + '">',
    '<meta name="theme-color" content="#7d1e33">',
    '<link rel="canonical" href="' + safeCanonical + '">',
    '<link rel="icon" type="image/png" sizes="60x60" href="/favicon.png">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + safeTitle + '">',
    '<meta property="og:description" content="' + safeDescription + '">',
    '<meta property="og:url" content="' + safeCanonical + '">',
    '<script src="' + assetPrefix + 'preferences.js?v=1"></script>',
    '<link rel="stylesheet" href="' + assetPrefix + 'seo-pages.css?v=3">',
    "</head>",
    '<body class="seo-page">',
    '<header class="seo-header"><a class="seo-brand" href="' + assetPrefix + 'index.html"><span>AV</span>Admit<i>Vector</i></a><nav aria-label="Навігація"><a href="' + assetPrefix + 'index.html#finder">Пошук</a><a href="' + assetPrefix + 'guide.html">Як обрати</a><a href="' + assetPrefix + 'ielts-resources.html">IELTS</a></nav></header>',
    body,
    '<footer class="seo-footer"><span>AdmitVector · Перевіряйте умови перед подачею</span><a href="mailto:admitvector@gmail.com">Повідомити про неточність</a></footer>',
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

export function buildSeoPages({ root, colleges, policy }) {
  const escape = policy.escape;
  const directory = path.join(root, "universities");
  fs.mkdirSync(directory, { recursive:true });

  // Only profiles with all five policies and their primary-source links belong in Search.
  const verified = colleges.filter(college => {
    if (!college.verified) return false;
    if (!/^[a-z0-9-]+$/.test(college.slug)) throw new Error("Unsafe verified college slug: " + college.slug);
    return policy.fields.every(key => {
      const field = policy.field(college, key);
      return field.status === "verified" && String(field.value || "").trim() && externalUrl(field.source);
    });
  }).sort((a,b) => a.name.localeCompare(b.name, "en"));

  for (const college of verified) {
    const url = baseUrl + "universities/" + college.slug;
    const title = college.name + " — вступ і фінансова допомога 2026–27 | AdmitVector";
    const description = college.name + " (" + college.location + "): перевірені умови фінансової допомоги, тестів, англійської, application fee та дедлайнів з посиланнями на офіційні джерела.";
    const policyCards = policy.fields.map((key,index) => {
      const field = policy.field(college,key);
      const source = externalUrl(field.source);
      const checked = field.checkedAt || college.checkedAt;
      return [
        '<article class="seo-policy">',
        '<span class="seo-policy-number">0' + (index + 1) + '</span>',
        '<div><h2>' + labels[key] + '</h2><p lang="en">' + escape(field.value) + '</p>',
        '<div class="seo-policy-meta"><a href="' + escape(source) + '" target="_blank" rel="noopener noreferrer">Офіційне джерело ↗</a>' + (checked ? '<span>Перевірено ' + escape(checked) + '</span>' : '') + '</div></div>',
        "</article>"
      ].join("");
    }).join("\n");
    const intro = college.description && !college.descriptionPending
      ? '<section class="seo-about"><h2>Про заклад</h2><p lang="en">' + escape(college.description) + '</p><p>Статистичний опис не замінює актуальні правила вступу. Для рішення про подачу користуйтеся офіційними джерелами вище.</p></section>'
      : "";
    const body = [
      '<main class="seo-main">',
      '<p class="seo-breadcrumb"><a href="index.html">Перевірені університети</a><span aria-hidden="true">/</span>' + escape(college.name) + '</p>',
      '<section class="seo-hero"><div><p class="seo-eyebrow">ПЕРЕВІРЕНІ УМОВИ · 2026–27</p><h1>' + escape(college.name) + '</h1><p class="seo-location">' + escape(college.location) + '</p><p class="seo-lede">П’ять ключових умов вступу звірені з офіційними сторінками університету. Перед подачею відкрийте джерела: правила можуть змінитися.</p><div class="seo-actions"><a class="seo-button" href="../university.html?id=' + encodeURIComponent(college.slug) + '">Відкрити повний профіль ↗</a><a class="seo-text-link" href="../index.html#finder">До каталогу</a></div></div><aside class="seo-stamp"><span>АУДИТ ДАНИХ</span><strong>5 / 5</strong><small>умов перевірено</small><small>Остання повна перевірка: ' + escape(college.checkedAt || "—") + '</small></aside></section>',
      '<section class="seo-section"><div class="seo-section-heading"><p class="seo-eyebrow">УМОВИ ПОДАЧІ</p><h2>Що потрібно знати</h2></div><div class="seo-policy-list">' + policyCards + '</div></section>',
      intro,
      '<p class="seo-disclaimer">AdmitVector — довідник, а не приймальна комісія. Умови 2026–27 можуть змінюватися; остаточну інформацію перевіряйте на сайті університету.</p>',
      "</main>"
    ].join("\n");
    fs.writeFileSync(path.join(directory, college.slug + ".html"), documentHtml({title,description,canonical:url,body,assetPrefix:"../",escape}));
  }

  const cards = verified.map(college => {
    return '<li><a href="' + escape(college.slug) + '"><strong>' + escape(college.name) + '</strong><span>' + escape(college.location) + '</span><small>Перевірено ' + escape(college.checkedAt || "—") + ' ↗</small></a></li>';
  }).join("\n");
  const directoryBody = [
    '<main class="seo-main">',
    '<section class="seo-directory-hero"><p class="seo-eyebrow">ADMITVECTOR / 2026–27</p><h1>Університети з перевіреними умовами вступу</h1><p>Кожен профіль нижче має п’ять перевірених пунктів: фінансову допомогу, тести, англійську мову, application fee та дедлайни. Біля кожного пункту є посилання на офіційне джерело.</p><div class="seo-directory-count"><strong>' + verified.length + '</strong><span>повних профілів</span></div></section>',
    '<section class="seo-section"><div class="seo-section-heading"><p class="seo-eyebrow">ЗНАЙДІТЬ ЗАКЛАД</p><h2>Перегляньте профілі</h2></div><label class="seo-search"><span>Пошук за назвою або містом</span><input type="search" id="seo-search" placeholder="Наприклад, Amherst або Boston"></label><ul class="seo-directory-list" id="seo-directory-list">' + cards + '</ul></section>',
    '<p class="seo-disclaimer">Повний каталог містить іще заклади, що очікують перевірки. <a href="../index.html#finder">Відкрити весь каталог ↗</a> · <a href="../guide.html">Як скласти свій короткий список ↗</a></p>',
    "</main>",
    '<script>const search=document.getElementById("seo-search");search.addEventListener("input",()=>{const value=search.value.trim().toLocaleLowerCase();document.querySelectorAll("#seo-directory-list li").forEach(item=>{item.hidden=!item.textContent.toLocaleLowerCase().includes(value);});});</script>'
  ].join("\n");
  fs.writeFileSync(path.join(directory,"index.html"), documentHtml({
    title:"Перевірені університети США — вступ і фінансова допомога | AdmitVector",
    description:"Перевірені умови вступу 2026–27 до університетів США: фінансова допомога, SAT/ACT, англійська мова, внески та дедлайни з офіційними джерелами.",
    canonical:baseUrl + "universities/",
    body:directoryBody,
    assetPrefix:"../",
    escape
  }));
  return verified.map(college => ({slug:college.slug,checkedAt:college.checkedAt}));
}
