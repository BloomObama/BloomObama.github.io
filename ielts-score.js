(() => {
  const key = () => `admitvector-ielts-scores-v1:${globalThis.FullRidePreferences?.account || 'guest'}`;
  const copy = {
    uk:{eyebrow:'ВАШІ РЕЗУЛЬТАТИ',title:'Відстежуйте свій прогрес',intro:'Записуйте бал повного пробного тесту. Графік покаже реальну динаміку, навіть якщо результат тимчасово знизився.',latest:'Останній бал',chartTitle:'Динаміка балів IELTS',date:'Дата тесту',band:'Загальний бал',save:'Зберегти результат →',note:'Ви вводите результати самі. Вони зберігаються в цьому браузері окремо для кожного акаунта, без синхронізації між пристроями.',count:'записаних тестів',empty:'Додайте два результати, щоб побачити динаміку.',noScores:'Після пробного тесту додайте тут свій перший бал.',remove:'Видалити результат',invalid:'Вкажіть бал від 0 до 9 із кроком 0,5 та дату, яка вже настала.'},
    ru:{eyebrow:'ВАШИ РЕЗУЛЬТАТЫ',title:'Следите за прогрессом',intro:'Записывайте балл полного пробного теста. График покажет реальную динамику, даже если результат временно снизился.',latest:'Последний балл',chartTitle:'Динамика баллов IELTS',date:'Дата теста',band:'Общий балл',save:'Сохранить результат →',note:'Вы вводите результаты сами. Они хранятся в этом браузере отдельно для каждого аккаунта, без синхронизации между устройствами.',count:'записанных тестов',empty:'Добавьте два результата, чтобы увидеть динамику.',noScores:'После пробного теста добавьте здесь первый балл.',remove:'Удалить результат',invalid:'Укажите балл от 0 до 9 с шагом 0,5 и уже наступившую дату.'},
    en:{eyebrow:'YOUR RESULTS',title:'Track your progress',intro:'Log each full practice test score. The chart shows your actual trend, including any temporary dip.',latest:'Latest band',chartTitle:'IELTS band trend',date:'Test date',band:'Overall band',save:'Save score →',note:'You enter scores yourself. They are stored in this browser separately for each account, without cross-device sync.',count:'tests recorded',empty:'Add two scores to see your trend.',noScores:'Add your first band score after a practice test.',remove:'Remove score',invalid:'Enter a past or present date and a band from 0 to 9 in 0.5 steps.'}
  };
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const dateValid=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;const d=new Date(value+'T12:00:00');return d.getFullYear()===Number(value.slice(0,4))&&d.getMonth()+1===Number(value.slice(5,7))&&d.getDate()===Number(value.slice(8,10))&&value<=today();};
  const valid=item=>item&&typeof item.id==='string'&&/^[\w-]{1,80}$/.test(item.id)&&dateValid(item.date)&&Number.isFinite(item.score)&&item.score>=0&&item.score<=9&&Number.isInteger(item.score*2);
  function load(){try{const list=JSON.parse(localStorage.getItem(currentKey)||'[]');return Array.isArray(list)?list.filter(valid).slice(-30):[];}catch{return [];}}
  let currentKey=key(), scores=load();
  const language=()=>copy[document.documentElement.lang.slice(0,2)]||copy.uk;
  const form=document.getElementById('ielts-score-form'),list=document.getElementById('ielts-score-list');
  const format=score=>Number(score).toFixed(1);
  function render(){
    const t=language(),sorted=scores.map((item,index)=>({...item,index})).sort((a,b)=>b.date.localeCompare(a.date)||b.index-a.index);
    document.querySelectorAll('[data-ielts-score-key]').forEach(el=>{el.textContent=t[el.dataset.ieltsScoreKey]||'';});
    document.getElementById('ielts-latest').textContent=sorted[0]?format(sorted[0].score):'—';
    document.getElementById('ielts-score-count').textContent=`${scores.length} ${t.count}`;
    form.elements.date.max=today();
    globalThis.AdmitVectorScoreChart?.render(document.getElementById('ielts-score-chart'),scores.length>1?scores:[],{min:0,max:9,ticks:[0,3,6,9],empty:t.empty,label:t.chartTitle});
    list.innerHTML=sorted.length?sorted.map(item=>`<div><time datetime="${item.date}">${item.date}</time><strong>${format(item.score)}</strong><button type="button" data-ielts-remove="${item.id}" aria-label="${t.remove}">×</button></div>`).join(''):`<p>${t.noScores}</p>`;
  }
  form.elements.date.value=today();
  form.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(form),date=String(data.get('date')),score=Number(data.get('band')),t=language();
    if(!dateValid(date)||!Number.isFinite(score)||score<0||score>9||!Number.isInteger(score*2)){document.getElementById('ielts-score-error').textContent=t.invalid;return;}
    scores.push({id:crypto.randomUUID(),date,score});scores=scores.slice(-30);
    try{localStorage.setItem(currentKey,JSON.stringify(scores));}catch{document.getElementById('ielts-score-error').textContent=t.note;}
    form.elements.band.value='';render();
  });
  list.addEventListener('click',event=>{const button=event.target.closest('[data-ielts-remove]');if(!button)return;scores=scores.filter(item=>item.id!==button.dataset.ieltsRemove);try{localStorage.setItem(currentKey,JSON.stringify(scores));}catch{}render();});
  document.querySelectorAll('[data-resource-lang]').forEach(button=>button.addEventListener('click',render));
  window.addEventListener('fullride:preferences',()=>{const next=key();if(next!==currentKey){currentKey=next;scores=load();}render();});
  render();
})();
