(() => {
  const KEY = 'admitvector-sat-progress-v1';
  const skillIds = ['algebra','advanced','data','geometry','ideas','craft','expression','conventions'];
  const copy = {
    uk: {
      trackerLabel:'ВАШ ПРОГРЕС',trackerTitle:'Крок за кроком',trackerHint:'План, пробні результати, теми й заняття зберігаються в цьому браузері.',workspaceLabel:'НАВЧАЛЬНА ПАНЕЛЬ',close:'Закрити',steps:['План','Тест','Теми','Ритм'],done:'кроків із 4 розпочато',
      titles:{plan:'Ваш план підготовки',test:'Пробні тести',skills:'Слабкі теми',habit:'Ритм занять'},leads:{plan:'Задайте ціль і дату. Після збереження отримаєте чіткий маршрут, який можна виконувати поетапно.',test:'Пройдіть офіційний тест у Bluebook і запишіть бал тут — так буде видно динаміку.',skills:'Відзначайте теми, які вже опрацювали. Почніть із тих, де було найбільше помилок.',habit:'Фіксуйте короткі заняття й підтримуйте звичку без зайвого тиску.'},
      date:'Дата SAT',target:'Цільовий бал',days:'Днів на тиждень',savePlan:'Зберегти план',planSaved:'План збережено',noPlan:'Плану поки немає. Вкажіть ціль і дату, щоб почати.',weeksLeft:'Тижнів до тесту',daysPerWeek:'днів на тиждень',planTasks:['Пройти діагностичний тест','Розібрати помилки й обрати 2 слабкі теми','Практикувати Math та Reading & Writing','Пройти ще один пробний тест і звірити прогрес'],taskDone:'Виконано',taskTodo:'Позначити виконаним',invalidDate:'Оберіть майбутню дату тесту.',invalidScore:'Вкажіть бал від 400 до 1600, кратний 10.',officialPlan:'Офіційні поради College Board ↗',
      bluebook:'Відкрити Bluebook ↗',testDate:'Дата тесту',score:'Загальний бал',addTest:'Зберегти результат',noTests:'Додайте перший результат після пробного тесту.',latest:'Останній результат',testsCount:'записаних тестів',remove:'Видалити',
      skillNames:['Алгебра','Поглиблена математика','Аналіз даних','Геометрія й тригонометрія','Інформація та ідеї','Структура й зміст','Висловлення думок','Норми англійської мови'],math:'MATH',reading:'READING & WRITING',learned:'Опрацьовано',markLearned:'Відзначити',skillsCount:'тем із 8 опрацьовано',khan:'Уроки Khan Academy ↗',bank:'Банк завдань College Board ↗',
      sessionDate:'Дата заняття',minutes:'Хвилини',area:'Напрям',both:'Змішане',addSession:'Записати заняття',noSessions:'Запишіть перше заняття — навіть 15 хвилин мають значення.',thisWeek:'Цього тижня',minutesTotal:'хвилин',sessionsCount:'занять записано',invalidMinutes:'Вкажіть від 1 до 300 хвилин.',futureSession:'Дата заняття не може бути в майбутньому.',savedHere:'Прогрес зберігається лише в цьому браузері й поки не синхронізується між пристроями.',
    },
    ru: {
      trackerLabel:'ВАШ ПРОГРЕСС',trackerTitle:'Шаг за шагом',trackerHint:'План, пробные результаты, темы и занятия сохраняются в этом браузере.',workspaceLabel:'УЧЕБНАЯ ПАНЕЛЬ',close:'Закрыть',steps:['План','Тест','Темы','Ритм'],done:'этапов из 4 начато',
      titles:{plan:'Ваш план подготовки',test:'Пробные тесты',skills:'Слабые темы',habit:'Ритм занятий'},leads:{plan:'Задайте цель и дату. После сохранения появится маршрут, по которому можно идти шаг за шагом.',test:'Пройдите официальный тест в Bluebook и запишите балл здесь, чтобы видеть динамику.',skills:'Отмечайте темы, которые уже проработали. Начните с тех, где было больше ошибок.',habit:'Записывайте короткие занятия и поддерживайте привычку без лишнего давления.'},
      date:'Дата SAT',target:'Целевой балл',days:'Дней в неделю',savePlan:'Сохранить план',planSaved:'План сохранён',noPlan:'Плана пока нет. Укажите цель и дату, чтобы начать.',weeksLeft:'Недель до теста',daysPerWeek:'дней в неделю',planTasks:['Пройти диагностический тест','Разобрать ошибки и выбрать 2 слабые темы','Практиковать Math и Reading & Writing','Пройти ещё один пробный тест и оценить прогресс'],taskDone:'Выполнено',taskTodo:'Отметить выполненным',invalidDate:'Выберите будущую дату теста.',invalidScore:'Укажите балл от 400 до 1600, кратный 10.',officialPlan:'Советы College Board ↗',
      bluebook:'Открыть Bluebook ↗',testDate:'Дата теста',score:'Общий балл',addTest:'Сохранить результат',noTests:'Добавьте первый результат после пробного теста.',latest:'Последний результат',testsCount:'записанных тестов',remove:'Удалить',
      skillNames:['Алгебра','Продвинутая математика','Анализ данных','Геометрия и тригонометрия','Информация и идеи','Структура и смысл','Выражение мыслей','Нормы английского языка'],math:'MATH',reading:'READING & WRITING',learned:'Проработано',markLearned:'Отметить',skillsCount:'тем из 8 проработано',khan:'Уроки Khan Academy ↗',bank:'Банк заданий College Board ↗',
      sessionDate:'Дата занятия',minutes:'Минуты',area:'Направление',both:'Смешанное',addSession:'Записать занятие',noSessions:'Запишите первое занятие — даже 15 минут имеют значение.',thisWeek:'На этой неделе',minutesTotal:'минут',sessionsCount:'занятий записано',invalidMinutes:'Укажите от 1 до 300 минут.',futureSession:'Дата занятия не может быть в будущем.',savedHere:'Прогресс хранится только в этом браузере и пока не синхронизируется между устройствами.',
    },
    en: {
      trackerLabel:'YOUR PROGRESS',trackerTitle:'One step at a time',trackerHint:'Your plan, practice scores, topics and sessions are saved in this browser.',workspaceLabel:'STUDY WORKSPACE',close:'Close',steps:['Plan','Test','Skills','Routine'],done:'of 4 stages started',
      titles:{plan:'Your study plan',test:'Practice tests',skills:'Weaker skills',habit:'Study routine'},leads:{plan:'Set a goal and test date. Save them to get a practical route you can follow step by step.',test:'Take an official Bluebook test and record the score here to see your trend.',skills:'Mark the topics you have worked through. Start where you made the most mistakes.',habit:'Log short sessions and build a routine without unnecessary pressure.'},
      date:'SAT date',target:'Target score',days:'Days per week',savePlan:'Save plan',planSaved:'Plan saved',noPlan:'No plan yet. Add your goal and test date to begin.',weeksLeft:'Weeks until test',daysPerWeek:'days per week',planTasks:['Take a diagnostic practice test','Review mistakes and pick 2 weaker topics','Practise Math and Reading & Writing','Take another practice test and compare scores'],taskDone:'Completed',taskTodo:'Mark complete',invalidDate:'Choose a future test date.',invalidScore:'Enter a score from 400 to 1600 in increments of 10.',officialPlan:'College Board study advice ↗',
      bluebook:'Open Bluebook ↗',testDate:'Test date',score:'Total score',addTest:'Save score',noTests:'Add your first score after a practice test.',latest:'Latest score',testsCount:'tests recorded',remove:'Remove',
      skillNames:['Algebra','Advanced Math','Problem-Solving & Data Analysis','Geometry & Trigonometry','Information & Ideas','Craft & Structure','Expression of Ideas','Standard English Conventions'],math:'MATH',reading:'READING & WRITING',learned:'Practised',markLearned:'Mark practised',skillsCount:'of 8 skills practised',khan:'Khan Academy lessons ↗',bank:'College Board question bank ↗',
      sessionDate:'Session date',minutes:'Minutes',area:'Focus',both:'Mixed',addSession:'Log session',noSessions:'Log your first session — even 15 minutes count.',thisWeek:'This week',minutesTotal:'minutes',sessionsCount:'sessions logged',invalidMinutes:'Enter 1–300 minutes.',futureSession:'Session date cannot be in the future.',savedHere:'Progress is stored only in this browser and does not yet sync across devices.',
    }
  };
  const empty = () => ({plan:null,tasks:[false,false,false,false],tests:[],skills:{},sessions:[]});
  const safeDate = value => { if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))return '';const d=new Date(value+'T12:00:00');return !Number.isNaN(d.getTime())&&d.getFullYear()===Number(value.slice(0,4))&&d.getMonth()+1===Number(value.slice(5,7))&&d.getDate()===Number(value.slice(8,10))?value:'';};
  const today = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const storageKey = () => `${KEY}:${globalThis.FullRidePreferences?.account || 'guest'}`;
  function load(key=storageKey()) {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      if (!raw || typeof raw !== 'object') return empty();
      const plan = raw.plan && safeDate(raw.plan.date) && Number.isInteger(raw.plan.target) && raw.plan.target >= 400 && raw.plan.target <= 1600 ? {date:raw.plan.date,target:raw.plan.target,days:[2,3,4,5,6,7].includes(raw.plan.days)?raw.plan.days:4} : null;
      return {plan,tasks:Array.from({length:4},(_,i)=>raw.tasks?.[i]===true),tests:Array.isArray(raw.tests)?raw.tests.filter(x=>safeDate(x.date)&&Number.isInteger(x.score)&&x.score>=400&&x.score<=1600).slice(0,30):[],skills:Object.fromEntries(skillIds.map(id=>[id,raw.skills?.[id]===true])),sessions:Array.isArray(raw.sessions)?raw.sessions.filter(x=>safeDate(x.date)&&Number.isInteger(x.minutes)&&x.minutes>=1&&x.minutes<=300).slice(0,120):[]};
    } catch { return empty(); }
  }
  let activeStorageKey = storageKey(), state = load(activeStorageKey), active = null;
  const body = document.getElementById('sat-workspace-body');
  const section = document.getElementById('sat-workspace');
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lang = () => globalThis.FullRidePreferences?.language() || document.documentElement.lang || 'uk';
  const t = () => copy[lang()] || copy.uk;
  const save = () => { try {localStorage.setItem(activeStorageKey,JSON.stringify(state));return true;} catch {return false;} };
  const link = (url,label) => `<a class="sat-workspace__link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  function progress() {
    const skills = skillIds.filter(id=>state.skills[id]).length;
    const planPart = state.plan ? (1 + state.tasks.filter(Boolean).length)/5 : 0;
    const score = Math.round(25*planPart + 25*Math.min(1,state.tests.length) + 25*skills/8 + 25*Math.min(1,state.sessions.length/5));
    const started = [!!state.plan,state.tests.length>0,skills>0,state.sessions.length>0];
    return {score,started,skills};
  }
  function renderTracker() {
    const c=t(), p=progress();
    document.querySelectorAll('[data-work-key]').forEach(el=>{el.textContent=c[el.dataset.workKey]||'';});
    document.getElementById('sat-progress-percent').textContent=p.score+'%';
    document.getElementById('sat-progress-detail').textContent=`${p.started.filter(Boolean).length} ${c.done}`;
    document.getElementById('sat-progress-fill').style.width=p.score+'%';
    document.getElementById('sat-progress-markers').innerHTML=c.steps.map((name,i)=>`<span class="${p.started[i]?'is-done':''}"><i>${p.started[i]?'✓':i+1}</i>${escape(name)}</span>`).join('');
    document.querySelectorAll('[data-sat-step]').forEach(button=>{button.classList.toggle('is-selected',button.dataset.satStep===active);button.setAttribute('aria-expanded',String(button.dataset.satStep===active));});
  }
  const field = (label,name,type,value,extra='')=>`<label class="sat-field"><span>${label}</span><input name="${name}" type="${type}" value="${escape(value)}" ${extra} required></label>`;
  function planPanel(c) {
    const p=state.plan, remaining=p?Math.max(0,Math.ceil((Date.parse(p.date+'T12:00:00')-Date.now())/604800000)):0;
    return `<form id="sat-plan-form" class="sat-workspace__form">${field(c.date,'date','date',p?.date||'',`min="${today()}"`)}${field(c.target,'target','number',p?.target||1200,'min="400" max="1600" step="10"')}<label class="sat-field"><span>${c.days}</span><select name="days">${[2,3,4,5,6,7].map(n=>`<option value="${n}" ${p?.days===n?'selected':''}>${n}</option>`).join('')}</select></label><button class="sat-workspace__primary" type="submit">${c.savePlan} →</button></form><p class="sat-workspace__error" id="sat-workspace-error" role="alert"></p>${p?`<div class="sat-plan-summary"><strong>${c.planSaved} · ${p.target}</strong><span>${remaining} ${c.weeksLeft.toLowerCase()} · ${p.days} ${c.daysPerWeek}</span></div><div class="sat-task-list">${c.planTasks.map((name,i)=>`<button type="button" data-sat-task="${i}" aria-pressed="${state.tasks[i]}"><i>${state.tasks[i]?'✓':String(i+1).padStart(2,'0')}</i><span>${name}</span><small>${state.tasks[i]?c.taskDone:c.taskTodo}</small></button>`).join('')}</div>`:`<p class="sat-workspace__empty">${c.noPlan}</p>`}<div class="sat-workspace__links">${link('https://satsuite.collegeboard.org/practice/build-your-study-plan',c.officialPlan)}</div>`;
  }
  function testPanel(c) {
    const tests=[...state.tests].sort((a,b)=>b.date.localeCompare(a.date));
    return `<div class="sat-workspace__introline"><strong>${tests[0]?.score||'—'}</strong><span>${c.latest}<br>${tests.length} ${c.testsCount}</span></div><form id="sat-test-form" class="sat-workspace__form">${field(c.testDate,'date','date',today(),`max="${today()}"`)}${field(c.score,'score','number','', 'min="400" max="1600" step="10"')}<button class="sat-workspace__primary" type="submit">${c.addTest} →</button></form><p class="sat-workspace__error" id="sat-workspace-error" role="alert"></p>${tests.length?`<div class="sat-score-list">${tests.map(x=>`<div><time>${escape(x.date)}</time><strong>${x.score}</strong><button type="button" data-sat-remove-test="${escape(x.id)}" aria-label="${c.remove}">×</button></div>`).join('')}</div>`:`<p class="sat-workspace__empty">${c.noTests}</p>`}<div class="sat-workspace__links">${link('https://satsuite.collegeboard.org/practice/practice-tests/bluebook',c.bluebook)}</div>`;
  }
  function skillsPanel(c) {
    return `<p class="sat-workspace__stat">${progress().skills} ${c.skillsCount}</p><div class="sat-skills">${skillIds.map((id,i)=>`<button type="button" data-sat-skill="${id}" aria-pressed="${!!state.skills[id]}"><small>${i<4?c.math:c.reading}</small><span>${c.skillNames[i]}</span><i>${state.skills[id]?c.learned:c.markLearned}</i></button>`).join('')}</div><div class="sat-workspace__links">${link('https://www.khanacademy.org/test-prep/digital-sat',c.khan)}${link('https://satsuite.collegeboard.org/practice/student-question-bank',c.bank)}</div>`;
  }
  function habitPanel(c) {
    const start=new Date();start.setDate(start.getDate()-((start.getDay()+6)%7));start.setHours(0,0,0,0);
    const sessions=[...state.sessions].sort((a,b)=>b.date.localeCompare(a.date));
    const weekly=sessions.filter(x=>Date.parse(x.date+'T12:00:00')>=start.getTime());
    return `<div class="sat-workspace__introline"><strong>${weekly.reduce((sum,x)=>sum+x.minutes,0)}</strong><span>${c.minutesTotal}<br>${c.thisWeek} · ${weekly.length} ${c.sessionsCount}</span></div><form id="sat-session-form" class="sat-workspace__form">${field(c.sessionDate,'date','date',today(),`max="${today()}"`)}${field(c.minutes,'minutes','number','25','min="1" max="300"')}<label class="sat-field"><span>${c.area}</span><select name="area"><option value="math">Math</option><option value="reading">Reading & Writing</option><option value="mixed">${c.both}</option></select></label><button class="sat-workspace__primary" type="submit">${c.addSession} →</button></form><p class="sat-workspace__error" id="sat-workspace-error" role="alert"></p>${sessions.length?`<div class="sat-score-list">${sessions.slice(0,15).map(x=>`<div><time>${escape(x.date)}</time><span>${x.area==='math'?'Math':x.area==='reading'?'Reading & Writing':c.both}</span><strong>${x.minutes} min</strong><button type="button" data-sat-remove-session="${escape(x.id)}" aria-label="${c.remove}">×</button></div>`).join('')}</div>`:`<p class="sat-workspace__empty">${c.noSessions}</p>`}<div class="sat-workspace__links">${link('https://satsuite.collegeboard.org/practice/student-question-bank',c.bank)}</div>`;
  }
  function renderPanel() {
    if (!active) return;
    const c=t();
    document.getElementById('sat-workspace-title').textContent=c.titles[active];
    document.getElementById('sat-workspace-lead').textContent=c.leads[active];
    document.getElementById('sat-workspace-close').setAttribute('aria-label',c.close);
    body.innerHTML=({plan:planPanel,test:testPanel,skills:skillsPanel,habit:habitPanel}[active])(c)+`<p class="sat-workspace__storage">${c.savedHere}</p>`;
  }
  function refresh() {renderTracker();renderPanel();}
  document.querySelectorAll('[data-sat-step]').forEach(button=>button.addEventListener('click',()=>{
    active=button.dataset.satStep;section.hidden=false;refresh();section.classList.remove('sat-workspace--enter');void section.offsetWidth;section.classList.add('sat-workspace--enter');
    section.scrollIntoView({behavior:globalThis.FullRidePreferences?.motionBehavior()||'auto',block:'start'});
  }));
  document.getElementById('sat-workspace-close').addEventListener('click',()=>{active=null;section.hidden=true;renderTracker();document.getElementById('sat-route-title').focus?.();});
  body.addEventListener('submit',event=>{
    if (!['sat-plan-form','sat-test-form','sat-session-form'].includes(event.target.id)) return;
    event.preventDefault();const form=event.target, data=new FormData(form), c=t();const error=message=>{document.getElementById('sat-workspace-error').textContent=message;};
    if (form.id==='sat-plan-form') {
      const date=String(data.get('date')),target=Number(data.get('target')),days=Number(data.get('days'));
      if(!safeDate(date)||date<today())return error(c.invalidDate);
      if(!Number.isInteger(target)||target<400||target>1600||target%10)return error(c.invalidScore);
      const oldDate=state.plan?.date;state.plan={date,target,days};if(oldDate&&oldDate!==date)state.tasks=[false,false,false,false];
      globalThis.FullRidePreferences?.update({preparation:{sat:target,examDate:date}});
    } else if(form.id==='sat-test-form') {
      const date=String(data.get('date')),score=Number(data.get('score'));
      if(!safeDate(date)||date>today())return error(c.futureSession);
      if(!Number.isInteger(score)||score<400||score>1600||score%10)return error(c.invalidScore);
      state.tests.push({id:crypto.randomUUID(),date,score});state.tests=state.tests.slice(-30);
    } else {
      const date=String(data.get('date')),minutes=Number(data.get('minutes')),area=String(data.get('area'));
      if(!safeDate(date)||date>today())return error(c.futureSession);
      if(!Number.isInteger(minutes)||minutes<1||minutes>300)return error(c.invalidMinutes);
      state.sessions.push({id:crypto.randomUUID(),date,minutes,area:['math','reading','mixed'].includes(area)?area:'mixed'});state.sessions=state.sessions.slice(-120);
    }
    save();refresh();
  });
  body.addEventListener('click',event=>{
    const task=event.target.closest('[data-sat-task]'),skill=event.target.closest('[data-sat-skill]'),test=event.target.closest('[data-sat-remove-test]'),session=event.target.closest('[data-sat-remove-session]');
    if(task)state.tasks[Number(task.dataset.satTask)]=!state.tasks[Number(task.dataset.satTask)];
    else if(skill)state.skills[skill.dataset.satSkill]=!state.skills[skill.dataset.satSkill];
    else if(test)state.tests=state.tests.filter(x=>x.id!==test.dataset.satRemoveTest);
    else if(session)state.sessions=state.sessions.filter(x=>x.id!==session.dataset.satRemoveSession);
    else return;
    save();refresh();
  });
  document.querySelectorAll('[data-sat-lang]').forEach(button=>button.addEventListener('click',refresh));
  window.addEventListener('fullride:preferences',()=>{const nextKey=storageKey();if(nextKey!==activeStorageKey){activeStorageKey=nextKey;state=load(nextKey);}renderTracker();if(active)renderPanel();});
  renderTracker();
})();
