/* Local reminders only while a page is open. No claim of background email/push delivery. */
(() => {
  const labels={uk:{practice:'Час потренувати слова',deadline:'Наближається ваш дедлайн',open:'Налаштувати',close:'Закрити'},ru:{practice:'Время потренировать слова',deadline:'Приближается ваш дедлайн',open:'Настроить',close:'Закрыть'},en:{practice:'Time to practise vocabulary',deadline:'Your deadline is approaching',open:'Settings',close:'Dismiss'}};
  const localDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function due(now=new Date()) {
    const r=FullRidePreferences.value.reminders, day=localDay(now), time=now.getHours()*60+now.getMinutes(), [h,m]=r.time.split(':').map(Number);
    if(time<h*60+m)return [];
    const result=[];
    if(r.practice && (r.frequency==='daily'||now.getDay()===r.weekday))result.push({id:'practice:'+day,type:'practice',title:''});
    if(r.deadlines)for(const item of r.items) {
      const delta=(Date.parse(item.date+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000;
      if(delta>=0&&delta<=r.daysAhead)result.push({id:item.id+':'+day,type:'deadline',title:item.title+' · '+item.date});
    }
    return result;
  }
  function check() {
    if(document.visibilityState==='hidden')return;
    const account=FullRidePreferences.account||'guest';
    const key='fullride-reminder-delivered-v1:'+account;
    let sent=[];try{sent=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(sent))sent=[];}catch{}
    const item=due().find(item=>!sent.includes(item.id));if(!item||document.getElementById('fr-reminder'))return;
    const t=labels[document.documentElement.lang]||labels.uk;
    const toast=document.createElement('aside');toast.id='fr-reminder';toast.className='fr-reminder';toast.setAttribute('role','status');
    const strong=document.createElement('strong');strong.textContent=t[item.type];
    const p=document.createElement('p');p.textContent=item.title;
    const link=document.createElement('a');link.href=item.type==='practice'?'practice.html?lang='+FullRidePreferences.language():'settings.html?lang='+FullRidePreferences.language()+'#reminders';link.textContent=t.open+' →';
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t.close);close.addEventListener('click',()=>toast.remove());
    toast.append(strong,p,link,close);document.body.append(toast);
    try{localStorage.setItem(key,JSON.stringify([...sent,item.id].slice(-100)));}catch{}
    if(FullRidePreferences.value.reminders.browser&&'Notification' in window&&Notification.permission==='granted') {
      navigator.serviceWorker?.ready.then(registration=>registration.showNotification(t[item.type],{body:item.title,tag:item.id})).catch(()=>{});
    }
  }
  window.FullRideReminders={due};
  document.addEventListener('DOMContentLoaded',check);
  document.addEventListener('visibilitychange',check);
  window.addEventListener('fullride:preferences',()=>{document.getElementById('fr-reminder')?.remove();check();});
  setInterval(check,60000);
})();
