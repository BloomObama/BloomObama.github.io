/* Tiny dependency-free chart shared by SAT and IELTS. Scores are logged by the learner, not imported from exam providers. */
(() => {
  const esc = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function render(host, entries, {min,max,ticks=[min,(min+max)/2,max],unit='',empty='No scores yet',label='Score history'}={}) {
    if (!host) return;
    const points = entries.filter(item=>Number.isFinite(item.score)&&item.score>=min&&item.score<=max&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)).sort((a,b)=>a.date.localeCompare(b.date)).slice(-18);
    if (!points.length) {host.innerHTML=`<p class="score-chart__empty">${esc(empty)}</p>`;return;}
    const left=48,right=584,top=24,bottom=187,height=bottom-top;
    const xy=points.map((item,index)=>({x:points.length===1?(left+right)/2:left+(right-left)*index/(points.length-1),y:bottom-(item.score-min)/(max-min)*height,score:item.score,date:item.date}));
    const path=xy.map((item,index)=>`${index?'L':'M'} ${item.x.toFixed(2)} ${item.y.toFixed(2)}`).join(' ');
    const area=`${path} L ${xy.at(-1).x.toFixed(2)} ${bottom} L ${xy[0].x.toFixed(2)} ${bottom} Z`;
    const tickMarkup=ticks.map(value=>{const y=bottom-height*(value-min)/(max-min);return `<g><path class="score-chart__grid" d="M ${left} ${y} H ${right}"/><text x="39" y="${y+4}" text-anchor="end">${esc(value)}</text></g>`;}).join('');
    const circles=xy.map(item=>`<circle cx="${item.x.toFixed(2)}" cy="${item.y.toFixed(2)}" r="5.5"><title>${esc(item.date)}: ${esc(item.score)}${esc(unit)}</title></circle>`).join('');
    const dates=`<text x="${left}" y="218" text-anchor="start">${esc(xy[0].date)}</text>${xy.length>1?`<text x="${right}" y="218" text-anchor="end">${esc(xy.at(-1).date)}</text>`:''}`;
    host.innerHTML=`<svg viewBox="0 0 620 230" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet"><g class="score-chart__ticks">${tickMarkup}${dates}</g><path class="score-chart__area" d="${area}"/><path class="score-chart__line" d="${path}" pathLength="100"/>${circles}</svg>`;
  }
  globalThis.AdmitVectorScoreChart={render};
})();
