(() => {
  const copy = {
    uk:{intro:"Оберіть напрям підготовки",ielts:"IELTS",ieltsHint:"Англійська та практика слів",sat:"SAT",satHint:"Математика, читання й письмо"},
    ru:{intro:"Выберите направление подготовки",ielts:"IELTS",ieltsHint:"Английский и практика слов",sat:"SAT",satHint:"Математика, чтение и письмо"},
    en:{intro:"Choose your preparation path",ielts:"IELTS",ieltsHint:"English and vocabulary practice",sat:"SAT",satHint:"Math, reading and writing"}
  };
  const update = () => {
    const lang = document.documentElement.lang.slice(0,2);
    const chosen = copy[lang] || copy.uk;
    document.querySelectorAll("[data-exam-copy]").forEach(node => { node.textContent = chosen[node.dataset.examCopy] || ""; });
    document.querySelectorAll("[data-exam-target]").forEach(link => { link.search = `?lang=${copy[lang] ? lang : "uk"}`; });
  };
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  update();
})();
