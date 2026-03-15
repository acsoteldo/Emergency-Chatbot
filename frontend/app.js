const COUNTRIES=[{iso3:'BHS',name:'Bahamas'},{iso3:'BLZ',name:'Belize'},{iso3:'BRB',name:'Barbados'},{iso3:'CRI',name:'Costa Rica'},{iso3:'CUB',name:'Cuba'},{iso3:'DOM',name:'Dominican Republic'},{iso3:'GTM',name:'Guatemala'},{iso3:'GUY',name:'Guyana'},{iso3:'HND',name:'Honduras'},{iso3:'HTI',name:'Haiti'},{iso3:'JAM',name:'Jamaica'},{iso3:'NIC',name:'Nicaragua'},{iso3:'PAN',name:'Panama'},{iso3:'PRI',name:'Puerto Rico'},{iso3:'SLV',name:'El Salvador'},{iso3:'SUR',name:'Suriname'},{iso3:'TTO',name:'Trinidad and Tobago'}];
const ALLOCATION=[{iso3:'HTI',actual:1020.0,optimal:1601.1},{iso3:'DOM',actual:151.9,optimal:511.3},{iso3:'PRI',actual:0.0,optimal:32.6},{iso3:'BRB',actual:31.0,optimal:32.6},{iso3:'JAM',actual:19.7,optimal:32.6},{iso3:'BHS',actual:8.6,optimal:33.0},{iso3:'SUR',actual:5.4,optimal:32.6},{iso3:'NIC',actual:49.3,optimal:33.4},{iso3:'CUB',actual:46.4,optimal:35.0},{iso3:'BLZ',actual:36.3,optimal:32.6},{iso3:'SLV',actual:110.8,optimal:33.4},{iso3:'GUY',actual:131.1,optimal:32.6},{iso3:'TTO',actual:142.1,optimal:32.6},{iso3:'GTM',actual:185.8,optimal:38.5},{iso3:'CRI',actual:200.0,optimal:33.6},{iso3:'PAN',actual:220.1,optimal:33.4},{iso3:'HND',actual:357.4,optimal:135.1}];
const SECTORS=[{sector:'Multi-sector',usd:1241},{sector:'Unearmarked',usd:752},{sector:'Food Security',usd:385},{sector:'Protection',usd:118},{sector:'Coord. & Support',usd:89},{sector:'Emergency Shelter',usd:61},{sector:'Health',usd:34},{sector:'Water & Sanitation',usd:22}];
// Per-country sector weights — derived from FTS/OCHA patterns
// HTI = food/multisector heavy; migration corridors (PAN/CRI/HND) = protection heavy
const SECTOR_WEIGHTS={
  HTI:{multi:0.38,unear:0.22,food:0.20,prot:0.07,coord:0.05,shelter:0.04,health:0.02,wash:0.02},
  HND:{multi:0.25,unear:0.18,food:0.10,prot:0.22,coord:0.10,shelter:0.08,health:0.04,wash:0.03},
  PAN:{multi:0.20,unear:0.15,food:0.08,prot:0.30,coord:0.12,shelter:0.09,health:0.04,wash:0.02},
  CRI:{multi:0.22,unear:0.16,food:0.09,prot:0.28,coord:0.11,shelter:0.08,health:0.04,wash:0.02},
  DOM:{multi:0.30,unear:0.20,food:0.18,prot:0.12,coord:0.08,shelter:0.06,health:0.04,wash:0.02},
  GTM:{multi:0.28,unear:0.19,food:0.16,prot:0.14,coord:0.09,shelter:0.07,health:0.04,wash:0.03},
  SLV:{multi:0.26,unear:0.18,food:0.14,prot:0.18,coord:0.10,shelter:0.07,health:0.04,wash:0.03},
  NIC:{multi:0.30,unear:0.20,food:0.18,prot:0.10,coord:0.09,shelter:0.06,health:0.04,wash:0.03},
  GUY:{multi:0.32,unear:0.22,food:0.12,prot:0.15,coord:0.08,shelter:0.05,health:0.04,wash:0.02},
  TTO:{multi:0.28,unear:0.20,food:0.10,prot:0.20,coord:0.10,shelter:0.06,health:0.04,wash:0.02},
  CUB:{multi:0.35,unear:0.25,food:0.15,prot:0.08,coord:0.07,shelter:0.05,health:0.03,wash:0.02},
  BLZ:{multi:0.30,unear:0.22,food:0.14,prot:0.12,coord:0.09,shelter:0.06,health:0.04,wash:0.03},
  JAM:{multi:0.32,unear:0.24,food:0.12,prot:0.12,coord:0.08,shelter:0.06,health:0.04,wash:0.02},
  BHS:{multi:0.30,unear:0.20,food:0.14,prot:0.12,coord:0.10,shelter:0.07,health:0.04,wash:0.03},
  SUR:{multi:0.30,unear:0.22,food:0.14,prot:0.13,coord:0.09,shelter:0.06,health:0.04,wash:0.02},
  BRB:{multi:0.28,unear:0.22,food:0.12,prot:0.16,coord:0.10,shelter:0.06,health:0.04,wash:0.02},
  PRI:{multi:0.40,unear:0.20,food:0.12,prot:0.10,coord:0.08,shelter:0.05,health:0.03,wash:0.02},
};
const SECTOR_KEYS=['multi','unear','food','prot','coord','shelter','health','wash'];
function getSectorTotals(countries,yearFrac){
  const totals=SECTOR_KEYS.map(()=>0);
  countries.forEach(iso3=>{
    const base=ALLOCATION.find(a=>a.iso3===iso3);
    if(!base)return;
    const w=SECTOR_WEIGHTS[iso3]||SECTOR_WEIGHTS.DOM;
    SECTOR_KEYS.forEach((k,i)=>{ totals[i]+=base.actual*w[k]*yearFrac; });
  });
  return totals.map(v=>+v.toFixed(1));
}
const RISK=[{iso3:'HTI',risk:0.82},{iso3:'DOM',risk:0.61},{iso3:'HND',risk:0.58},{iso3:'GTM',risk:0.55},{iso3:'NIC',risk:0.48},{iso3:'SLV',risk:0.44},{iso3:'CUB',risk:0.41},{iso3:'PRI',risk:0.38},{iso3:'BLZ',risk:0.32},{iso3:'JAM',risk:0.30},{iso3:'PAN',risk:0.28},{iso3:'CRI',risk:0.25},{iso3:'GUY',risk:0.22},{iso3:'TTO',risk:0.20},{iso3:'BHS',risk:0.18},{iso3:'SUR',risk:0.16},{iso3:'BRB',risk:0.12}];
// Dataset carousel — SVG symbol/use pattern
document.getElementById('datasetTrack').innerHTML = '<div class="dataset-logo-item"><svg width="60.6" height="28" viewBox="0 0 60.6 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fts" width="60.6" height="28"/></svg></div><div class="dataset-logo-item"><svg width="134.9" height="28" viewBox="0 0 134.9 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-unhcr" width="134.9" height="28"/></svg></div><div class="dataset-logo-item"><svg width="119.8" height="28" viewBox="0 0 119.8 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-emdat" width="119.8" height="28"/></svg></div><div class="dataset-logo-item"><svg width="78.1" height="28" viewBox="0 0 78.1 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-noaa" width="78.1" height="28"/></svg></div><div class="dataset-logo-item"><svg width="106.7" height="28" viewBox="0 0 106.7 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-inform" width="106.7" height="28"/></svg></div><div class="dataset-logo-item"><svg width="120.0" height="28" viewBox="0 0 120.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-r4v" width="120.0" height="28"/></svg></div><div class="dataset-logo-item"><svg width="79.0" height="28" viewBox="0 0 79.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fema" width="79.0" height="28"/></svg></div><div class="dataset-logo-item"><svg width="60.6" height="28" viewBox="0 0 60.6 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fts" width="60.6" height="28"/></svg></div><div class="dataset-logo-item"><svg width="134.9" height="28" viewBox="0 0 134.9 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-unhcr" width="134.9" height="28"/></svg></div><div class="dataset-logo-item"><svg width="119.8" height="28" viewBox="0 0 119.8 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-emdat" width="119.8" height="28"/></svg></div><div class="dataset-logo-item"><svg width="78.1" height="28" viewBox="0 0 78.1 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-noaa" width="78.1" height="28"/></svg></div><div class="dataset-logo-item"><svg width="106.7" height="28" viewBox="0 0 106.7 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-inform" width="106.7" height="28"/></svg></div><div class="dataset-logo-item"><svg width="120.0" height="28" viewBox="0 0 120.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-r4v" width="120.0" height="28"/></svg></div><div class="dataset-logo-item"><svg width="79.0" height="28" viewBox="0 0 79.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fema" width="79.0" height="28"/></svg></div><div class="dataset-logo-item"><svg width="60.6" height="28" viewBox="0 0 60.6 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fts" width="60.6" height="28"/></svg></div><div class="dataset-logo-item"><svg width="134.9" height="28" viewBox="0 0 134.9 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-unhcr" width="134.9" height="28"/></svg></div><div class="dataset-logo-item"><svg width="119.8" height="28" viewBox="0 0 119.8 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-emdat" width="119.8" height="28"/></svg></div><div class="dataset-logo-item"><svg width="78.1" height="28" viewBox="0 0 78.1 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-noaa" width="78.1" height="28"/></svg></div><div class="dataset-logo-item"><svg width="106.7" height="28" viewBox="0 0 106.7 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-inform" width="106.7" height="28"/></svg></div><div class="dataset-logo-item"><svg width="120.0" height="28" viewBox="0 0 120.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-r4v" width="120.0" height="28"/></svg></div><div class="dataset-logo-item"><svg width="79.0" height="28" viewBox="0 0 79.0 28" xmlns="http://www.w3.org/2000/svg"><use href="#logo-fema" width="79.0" height="28"/></svg></div>';

// Countries - center-outward stagger like reference credits
// Split into two columns: left gets even indices, right gets odd
// But reveal order goes from the middle row outward (row 0 of both cols first, then row 1, etc.)
const colLeft=document.getElementById('colLeft');
const colRight=document.getElementById('colRight');

// Build two columns: left half right-aligned, right half left-aligned
// Each name gets progressively lower base-opacity to fade toward bottom like reference
const half=Math.ceil(COUNTRIES.length/2);
const leftCountries=COUNTRIES.slice(0,half);
const rightCountries=COUNTRIES.slice(half);
const nRows=Math.max(leftCountries.length,rightCountries.length);

function makeEntry(c,col,rowIndex,totalRows,side){
  const span=document.createElement('span');
  span.className='country-entry';
  const baseOpacity=1;
  span.setAttribute('data-base-opacity',baseOpacity);
  // Left side: ISO on left (flex-reversed), name on right. Right side: name+ISO inline.
  if(side==='left'){
    span.innerHTML=`<span class="country-iso">${c.iso3}</span><span class="country-name-wrap">${c.name}</span>`;
  } else {
    span.innerHTML=`<span class="country-name-wrap">${c.name}<span class="country-iso">${c.iso3}</span></span>`;
  }
  col.appendChild(span);
  return span;
}

const leftEls=leftCountries.map((c,i)=>makeEntry(c,colLeft,i,nRows,'left'));
const rightEls=rightCountries.map((c,i)=>makeEntry(c,colRight,i,nRows,'right'));

// Pair rows: leftEls[i] and rightEls[i] animate together
// scroll-driven: each row gets its own IntersectionObserver
// when row enters viewport → slide in; when it leaves → slide out
// faintness: distance from vertical center of the section = opacity decay

const section=document.getElementById('countries');

function getRowOpacity(el){
  return parseFloat(el.getAttribute('data-base-opacity'));
}

function showRow(i){
  if(leftEls[i]){
    leftEls[i].classList.add('visible');
    leftEls[i].style.opacity=getRowOpacity(leftEls[i]);
  }
  if(rightEls[i]){
    rightEls[i].classList.add('visible');
    rightEls[i].style.opacity=getRowOpacity(rightEls[i]);
  }
}

function hideRow(i){
  if(leftEls[i]){
    leftEls[i].classList.remove('visible');
    leftEls[i].style.opacity=0;
  }
  if(rightEls[i]){
    rightEls[i].classList.remove('visible');
    rightEls[i].style.opacity=0;
  }
}

// Use scroll position to determine which rows are visible
// Each row slides in from its side as the section scrolls into view
// Rows enter one-by-one from top as user scrolls down
// and leave one-by-one from top as user scrolls up (reverse)

let visibleCount=0;

function updateCountries(){
  const rect=section.getBoundingClientRect();
  const windowH=window.innerHeight;

  // How far the section has scrolled into view: 0 = just entering, 1 = fully past
  // We want row i to appear when section has scrolled enough to reveal it
  const sectionH=section.offsetHeight;
  // progress: 0 when top of section hits bottom of viewport, 1 when bottom of section hits top
  const progress=Math.max(0,Math.min(1,(windowH-rect.top)/(windowH+sectionH)));

  // Map progress to number of rows to show (stagger across the scroll range)
  const target=Math.round(progress * (nRows+2));

  for(let i=0;i<nRows;i++){
    if(i<target){
      showRow(i);
    } else {
      hideRow(i);
    }
  }
}

// Initial call + scroll listener
updateCountries();
// Re-run after paint and after full load in case section is already in viewport
requestAnimationFrame(()=>{ requestAnimationFrame(updateCountries); });
window.addEventListener('load', updateCountries);
window.addEventListener('scroll',updateCountries,{passive:true});
// Force chart redraws on resize to prevent label/axis overlap
let resizeTimer;
window.addEventListener('resize',function(){
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(function(){
    [chart1,chart2,chart3,chart4].forEach(function(c){if(c){c.resize();}});
  },100);
},{passive:true});

// General scroll reveal
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Lang
let lang='en';
function toggleBurger(){
  const burger=document.getElementById('navBurger');
  const links=document.getElementById('navLinks');
  const lang=document.getElementById('langBtn');
  const open=burger.classList.toggle('open');
  links.classList.toggle('open',open);
  lang.classList.toggle('open',open);
}
function closeBurger(){
  document.getElementById('navBurger').classList.remove('open');
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('langBtn').classList.remove('open');
}
document.addEventListener('click',function(e){
  const nav=document.querySelector('nav');
  if(!nav.contains(e.target)) closeBurger();
});
function toggleLang(){
  lang=lang==='en'?'es':'en';
  document.getElementById('langBtn').textContent=lang==='en'?'ES':'EN';
  document.querySelectorAll('[data-en]').forEach(el=>{const t=el.getAttribute(`data-${lang}`);if(t)el.innerHTML=t;});
  document.getElementById('heroChatInput').placeholder=lang==='en'?'Ask Ávila something... (e.g. I need food in Haiti)':'Preguntale a Ávila... (ej. Necesito comida en Haiti)';
  document.getElementById('chatInput').placeholder=lang==='en'?'Type a message...':'Escribe un mensaje...';
  document.getElementById('chatStatus').textContent=lang==='en'?'Ready to help':'Lista para ayudar';
}

// Charts
const INK='#1c1a17',RUST='#8b3a2a',TEAL='#2d6e6e',GOLD='#c8932a',PAPER='#f4f0e8',MUTED='#7a6f62';
// Responsive tick/label font sizes
function chartFontSize(){return window.innerWidth<=480?9:window.innerWidth<=768?10:11;}
Chart.defaults.font.size=chartFontSize();
window.addEventListener('resize',function(){Chart.defaults.font.size=chartFontSize();},{passive:true});
// ── CHART STATE ──────────────────────────────────────────────────────────────
const ALL_COUNTRIES_LIST=ALLOCATION.map(d=>d.iso3);
const ALL_YEARS=[2019,2020,2021,2022,2023,2024];
let activeCountries=new Set(ALL_COUNTRIES_LIST);
let activeYears=new Set(ALL_YEARS);

// Per-year allocation breakdown (synthesized from totals, proportional split)
const ALLOCATION_BY_YEAR={};
ALL_COUNTRIES_LIST.forEach(iso3=>{
  const base=ALLOCATION.find(d=>d.iso3===iso3);
  ALLOCATION_BY_YEAR[iso3]={};
  // Spread actual across years with slight year variation for realism
  const yearWeights={2019:0.14,2020:0.16,2021:0.17,2022:0.18,2023:0.17,2024:0.18};
  ALL_YEARS.forEach(y=>{
    ALLOCATION_BY_YEAR[iso3][y]={
      actual: +(base.actual*yearWeights[y]).toFixed(1),
      optimal: +(base.optimal*(1/6)).toFixed(1)
    };
  });
});

function getFilteredAlloc(){
  const years=[...activeYears];
  const countries=[...activeCountries];
  return countries.map(iso3=>{
    const base=ALLOCATION.find(d=>d.iso3===iso3);
    const actual=years.reduce((s,y)=>s+(ALLOCATION_BY_YEAR[iso3][y]?.actual||0),0);
    const optimal=years.reduce((s,y)=>s+(ALLOCATION_BY_YEAR[iso3][y]?.optimal||0),0);
    return {iso3,actual:+actual.toFixed(1),optimal:+optimal.toFixed(1)};
  }).sort((a,b)=>b.actual-a.actual);
}

// ── FILTER PILLS ─────────────────────────────────────────────────────────────
const cPills=document.getElementById('filterCountries');
const yPills=document.getElementById('filterYears');

ALL_COUNTRIES_LIST.forEach(iso3=>{
  const btn=document.createElement('button');
  btn.className='pill active'; btn.textContent=iso3; btn.dataset.val=iso3;
  btn.onclick=()=>toggleFilter(btn,activeCountries,iso3);
  cPills.appendChild(btn);
});
ALL_YEARS.forEach(y=>{
  const btn=document.createElement('button');
  btn.className='pill active'; btn.textContent=y; btn.dataset.val=y;
  btn.onclick=()=>toggleFilter(btn,activeYears,y);
  yPills.appendChild(btn);
});

document.getElementById('filterReset').onclick=()=>{
  activeCountries=new Set(ALL_COUNTRIES_LIST);
  activeYears=new Set(ALL_YEARS);
  document.querySelectorAll('.pill').forEach(p=>p.classList.add('active'));
  updateAllCharts();
};

function toggleFilter(btn,set,val){
  if(set.has(val)){if(set.size>1){set.delete(val);btn.classList.remove('active');}}
  else{set.add(val);btn.classList.add('active');}
  updateAllCharts();
}

// ── COLOUR HELPERS ───────────────────────────────────────────────────────────
// Single-hue ramp: rust (#8b3a2a) light to dark for ranked bars
function rustRamp(n,i){
  // i=0 darkest, i=n-1 lightest
  const t=i/(Math.max(n-1,1));
  // interpolate from rust (#8b3a2a) toward a light warm tone (#d4a090)
  const r=Math.round(139+(212-139)*t);
  const g=Math.round(58+(160-58)*t);
  const a=Math.round(42+(144-42)*t);
  return `rgb(${r},${g},${a})`;
}
// Teal ramp for risk chart
function tealRamp(n,i){
  const t=i/(Math.max(n-1,1));
  const r=Math.round(45+(180-45)*t);
  const g=Math.round(110+(210-110)*t);
  const b=Math.round(110+(210-110)*t);
  return `rgb(${r},${g},${b})`;
}

const MONO={family:'Space Mono',size:9};
const fmtM=v=>`$${v.toFixed(1)}M`;

// ── CHART 1: Actual vs Optimal (sorted by actual, no HTI domination via log or separate scale) ──
let chart1=new Chart(document.getElementById('allocationChart'),{
  type:'bar',
  data:{labels:[],datasets:[
    {label:'Actual',data:[],backgroundColor:[],borderWidth:0},
    {label:'Optimal',data:[],backgroundColor:RUST+'55',borderWidth:1,borderColor:RUST,borderDash:[]}
  ]},
  options:{
    responsive:true,maintainAspectRatio:false,
    plugins:{
      legend:{labels:{color:INK,font:MONO,boxWidth:10,padding:12}},
      tooltip:{callbacks:{
        label:ctx=>{
          const ds=ctx.dataset.label;
          return ` ${ds}: $${ctx.parsed.y.toFixed(1)}M`;
        }
      }}
    },
    scales:{
      x:{ticks:{color:INK,font:MONO},grid:{display:false}},
      y:{
        ticks:{color:MUTED,font:MONO,callback:v=>`$${v}M`},
        grid:{color:'rgba(28,26,23,0.06)'},
        title:{display:true,text:'USD Millions',color:MUTED,font:MONO}
      }
    }
  }
});

// ── CHART 2: Sector doughnut ─────────────────────────────────────────────────
const sectorColors=['#c0392b','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e8c'];
// Seed with synthesized data; replaced by API data on load
let chart2=new Chart(document.getElementById('sectorChart'),{
  type:'doughnut',
  data:{
    labels:SECTORS.map(d=>d.sector),
    datasets:[{data:SECTORS.map(d=>d.usd),backgroundColor:sectorColors,borderWidth:2,borderColor:PAPER}]
  },
  options:{
    responsive:true,maintainAspectRatio:false,
    animation:{animateRotate:true,animateScale:true,duration:800,easing:'easeInOutQuart'},
    layout:{padding:{right:0}},
    plugins:{
      legend:{
        position:'left',
        align:'center',
        labels:{color:INK,font:MONO,boxWidth:10,padding:10,
          generateLabels:chart=>{
            return chart.data.labels.map((label,i)=>({
              text:label,
              fillStyle:chart.data.datasets[0].backgroundColor[i],
              strokeStyle:'transparent',
              index:i
            }));
          }
        }
      },
      tooltip:{callbacks:{label:ctx=>{
        const v=ctx.parsed;
        return ` ${ctx.label}: $${v}M`;
      }}}
    }
  }
});

// ── SECTOR CHART API LOADER ──────────────────────────────────────────────────
async function fetchSectorData(iso3){
  try{
    const url=iso3?`${API}/sectors?iso3=${iso3}`:`${API}/sectors`;
    const res=await fetchWithTimeout(url,5000);
    const json=await res.json();
    // Returns [{sector, total_usd}, ...] sorted by total_usd desc
    return json.data||[];
  }catch{ return null; }
}

async function updateSectorChart(countries,yearFrac){
  // Fetch per-country sector data from API and aggregate
  const sectorMap={};
  // initialise with known sector labels
  SECTORS.forEach(s=>{ sectorMap[s.sector]=0; });
  let apiOk=false;
  for(const iso3 of countries){
    const rows=await fetchSectorData(iso3);
    if(rows&&rows.length){
      apiOk=true;
      rows.forEach(r=>{
        const key=r.sector;
        if(key in sectorMap) sectorMap[key]+=(r.total_usd/1e6)*yearFrac;
        else sectorMap[key]=((r.total_usd/1e6)*yearFrac);
      });
    }
  }
  if(apiOk){
    // Rebuild labels+data sorted by value desc, keep top 8
    const sorted=Object.entries(sectorMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
    chart2.data.labels=sorted.map(([k])=>k);
    chart2.data.datasets[0].data=sorted.map(([,v])=>+v.toFixed(1));
    chart2.data.datasets[0].backgroundColor=sectorColors.slice(0,sorted.length);
  } else {
    // Fallback to synthesized weights
    chart2.data.labels=SECTORS.map(d=>d.sector);
    chart2.data.datasets[0].data=getSectorTotals(countries,yearFrac);
    chart2.data.datasets[0].backgroundColor=sectorColors;
  }
  chart2.update('active');
}

// Seed chart with real regional data on load
fetchSectorData(null).then(rows=>{
  if(!rows||!rows.length)return;
  const sorted=rows.sort((a,b)=>b.total_usd-a.total_usd).slice(0,8);
  chart2.data.labels=sorted.map(r=>r.sector);
  chart2.data.datasets[0].data=sorted.map(r=>+(r.total_usd/1e6).toFixed(1));
  chart2.data.datasets[0].backgroundColor=sectorColors.slice(0,sorted.length);
  chart2.update('active');
});

// ── CHART 3: Bubble ──────────────────────────────────────────────────────────
const bubbleData=[
  {iso3:'HTI',need:0.61,actual:1020,optimal:1601},
  {iso3:'DOM',need:0.38,actual:152,optimal:511},
  {iso3:'HND',need:0.29,actual:357,optimal:135},
  {iso3:'PAN',need:0.12,actual:220,optimal:33},
  {iso3:'CRI',need:0.11,actual:200,optimal:34},
  {iso3:'GTM',need:0.18,actual:186,optimal:39},
  {iso3:'SLV',need:0.15,actual:111,optimal:33},
  {iso3:'NIC',need:0.14,actual:49,optimal:33},
  {iso3:'PRI',need:0.10,actual:0,optimal:33}
];
let chart3=new Chart(document.getElementById('bubbleChart'),{
  type:'bubble',
  data:{datasets:bubbleData.map((d,i)=>({
    label:d.iso3,
    data:[{x:d.need,y:d.actual,r:Math.sqrt(d.optimal)*0.8}],
    backgroundColor:(()=>{const needMin=0.10,needMax=0.61;const t=1-(d.need-needMin)/(needMax-needMin);const r=Math.round(27+(190-27)*t);const g=Math.round(188+(230-188)*t);const bv=Math.round(156+(215-156)*t);return `rgba(${r},${g},${bv},0.8)`;})(),
    borderColor:(()=>{const needMin=0.10,needMax=0.61;const t=1-(d.need-needMin)/(needMax-needMin);const r=Math.round(27+(190-27)*t);const g=Math.round(188+(230-188)*t);const bv=Math.round(156+(215-156)*t);return `rgb(${r},${g},${bv})`;})(),
    borderWidth:1.5
  }))},
  options:{
    responsive:true,maintainAspectRatio:false,
    plugins:{
      legend:{display:false},
      tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label}  Need=${ctx.parsed.x.toFixed(2)}  Actual=$${ctx.parsed.y}M`}}
    },
    scales:{
      x:{title:{display:true,text:'Need Score',color:MUTED,font:MONO},ticks:{color:MUTED,font:MONO},grid:{color:'rgba(28,26,23,0.06)'}},
      y:{title:{display:true,text:'Actual Funding ($M)',color:MUTED,font:MONO},ticks:{color:MUTED,font:MONO,callback:v=>`$${v}M`},grid:{color:'rgba(28,26,23,0.06)'}}
    }
  }
});

// ── CHART 4: Risk bar — single teal ramp, darkest = highest risk ─────────────
let riskSorted=[...RISK]; // already sorted high to low
let chart4=new Chart(document.getElementById('riskChart'),{
  type:'bar',
  data:{
    labels:riskSorted.map(d=>d.iso3),
    datasets:[{
      label:'Risk Score',
      data:riskSorted.map(d=>d.risk),
      backgroundColor:riskSorted.map((_,i)=>{const t=i/(Math.max(riskSorted.length-1,1));const r=Math.round(52+(190-52)*t);const g=Math.round(152+(215-152)*t);const bv=Math.round(219+(240-219)*t);return `rgba(${r},${g},${bv},0.9)`;}),
      borderWidth:0
    }]
  },
  options:{
    indexAxis:'y',
    responsive:true,maintainAspectRatio:false,
    plugins:{
      legend:{display:false},
      tooltip:{callbacks:{label:ctx=>` Risk score: ${ctx.parsed.x.toFixed(2)}`}}
    },
    scales:{
      x:{ticks:{color:MUTED,font:MONO},grid:{color:'rgba(28,26,23,0.06)'},max:1.0,title:{display:true,text:'Composite Risk Score (0-1)',color:MUTED,font:MONO}},
      y:{ticks:{color:INK,font:MONO},grid:{display:false}}
    }
  }
});

// ── TEAL COLOR HELPER (for bubbles + risk) ───────────────────────────────────
function tealColor(t){
  // t: 0=darkest (#1abc9c), 1=lightest
  const r=Math.round(27+(190-27)*t);
  const g=Math.round(188+(230-188)*t);
  const bv=Math.round(156+(215-156)*t);
  return {fill:`rgba(${r},${g},${bv},0.8)`,border:`rgb(${r},${g},${bv})`};
}

// ── UPDATE ALL CHARTS ON FILTER CHANGE ───────────────────────────────────────
function updateAllCharts(){
  const data=getFilteredAlloc();
  const countries=new Set(data.map(d=>d.iso3));

  // ── Chart 1: actual vs optimal, sorted by actual ──
  chart1.data.labels=data.map(d=>d.iso3);
  chart1.data.datasets[0].data=data.map(d=>d.actual);
  chart1.data.datasets[0].backgroundColor=data.map(()=>'#c0392b');
  chart1.data.datasets[1].data=data.map(d=>d.optimal);
  chart1.update();
  const yLabel=[...activeYears].sort().join(', ');
  document.getElementById('c1sub').textContent=`USD millions — sorted by actual  |  ${yLabel}`;

  // ── Chart 2: sectors — fetch from API, aggregate across selected countries ──
  const yrs=[...activeYears];
  const yearFrac=yrs.length/ALL_YEARS.length;
  const selCount=[...activeCountries].length;
  const totCount=ALL_COUNTRIES_LIST.length;
  const c2sub=selCount===totCount&&yrs.length===ALL_YEARS.length
    ?`By total USD paid, 2019–2024`
    :`${selCount} of ${totCount} countries · ${yrs.length} of ${ALL_YEARS.length} years`;
  document.getElementById('c2sub').textContent=c2sub;
  updateSectorChart([...activeCountries],yearFrac);

  // ── Chart 3: bubble — filter countries, scale actual by year fraction ──
  const needMin=0.10, needMax=0.61;
  const filteredBubble=bubbleData.filter(d=>countries.has(d.iso3));
  chart3.data.datasets=filteredBubble.map(d=>{
    const scaledActual=+(d.actual*yearFrac).toFixed(1);
    const scaledOptimal=+(d.optimal*yearFrac).toFixed(1);
    const t=1-(d.need-needMin)/(needMax-needMin);
    const c=tealColor(Math.max(0,Math.min(1,t)));
    return {
      label:d.iso3,
      data:[{x:d.need,y:scaledActual,r:Math.max(4,Math.sqrt(scaledOptimal)*0.8)}],
      backgroundColor:c.fill,
      borderColor:c.border,
      borderWidth:1.5
    };
  });
  chart3.update();

  // ── Chart 4: risk — filter countries, keep sorted high to low ──
  const filteredRisk=RISK.filter(d=>countries.has(d.iso3));
  const n4=filteredRisk.length;
  chart4.data.labels=filteredRisk.map(d=>d.iso3);
  chart4.data.datasets[0].data=filteredRisk.map(d=>d.risk);
  chart4.data.datasets[0].backgroundColor=filteredRisk.map((_,i)=>{const t=i/(Math.max(n4-1,1));const r=Math.round(52+(190-52)*t);const g=Math.round(152+(215-152)*t);const bv=Math.round(219+(240-219)*t);return `rgba(${r},${g},${bv},0.9)`;});
  chart4.update();
}

// Initial render
updateAllCharts();

// Chat
let chatOpen=false;
let chatState={step:'greeting',country:null,countryName:null,lang:null};
const API='http://localhost:8000';

// ── Rate limiting ─────────────────────────────────────────────────────────
const _callLog=[];
function _rateOk(){
  const now=Date.now();
  // Keep only calls in last 60s
  while(_callLog.length&&_callLog[0]<now-60000)_callLog.shift();
  if(_callLog.length>=10)return false;
  _callLog.push(now);
  return true;
}

// ── Fetch with timeout ────────────────────────────────────────────────────
function fetchWithTimeout(url,ms=8000){
  return Promise.race([
    fetch(url),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))
  ]);
}

// ── API health check ──────────────────────────────────────────────────────
async function healthCheck(){
  try{
    await fetchWithTimeout(`${API}/`,3000);
    chatState.apiDown=false;
  }catch{
    chatState.apiDown=true;
  }
}

// ── Emergency numbers by ISO3 ─────────────────────────────────────────────
const DATA_LAST_UPDATED='December 2024';

// ── Disclaimer + source attribution ──────────────────────────────────────────
const DISCLAIMER='<span style="font-size:10px;opacity:0.45;display:block;margin-top:6px;">Data: 2019–2024. Field conditions may differ. Last updated: '+DATA_LAST_UPDATED+'.</span>';
const SRC_STYLE='font-size:10px;opacity:0.45;display:block;margin-top:4px;';
const SOURCES={
  disasters:    '<span style="'+SRC_STYLE+'">Source: EM-DAT</span>',
  funding:      '<span style="'+SRC_STYLE+'">Source: OCHA FTS</span>',
  displacement: '<span style="'+SRC_STYLE+'">Source: UNHCR</span>',
  risk:         '<span style="'+SRC_STYLE+'">Source: INFORM</span>',
  allocation:   '<span style="'+SRC_STYLE+'">Source: OCHA FTS and allocation model</span>',
};

const EMERGENCY_NUMBERS={
  BHS:'919',          // Bahamas
  BLZ:'911',          // Belize
  BRB:'511',          // Barbados
  CRI:'911',          // Costa Rica
  CUB:'106',          // Cuba
  DOM:'911',          // Dominican Republic
  GTM:'110',          // Guatemala
  GUY:'911',          // Guyana
  HND:'911',          // Honduras
  HTI:'114',          // Haiti
  JAM:'119',          // Jamaica
  NIC:'118',          // Nicaragua
  PAN:'911',          // Panama
  PRI:'911',          // Puerto Rico
  SLV:'911',          // El Salvador
  SUR:'115',          // Suriname
  TTO:'999',          // Trinidad & Tobago
};

// ── Language detection ────────────────────────────────────────────────────────
function detectLang(text){
  const t=text.toLowerCase();
  // FR checked before HT to avoid 'mourir' matching HT 'mouri'
  const frKw=['je ','j ai','aide ','eau','nourriture','abri','pays','quel','besoin','comment','suis','avez','veux','mourir','meurs','faim','secours'];
  const esKw=['comida','agua','refugio','ayuda','hambre','necesito','donde','estoy','tengo','morir','quiero','vivir','muerto','muertos'];
  // HT: use longer/distinctive phrases to avoid false matches
  const htKw=['manje','ayiti','kote','kijan','ede mwen','mouri tèt','mouri tet','pran yon','kisa ou','ki peyi','ou bezwen'];
  if(frKw.some(k=>t.includes(k)))return 'fr';
  if(esKw.some(k=>t.includes(k)))return 'es';
  if(htKw.some(k=>t.includes(k)))return 'ht';
  return lang||'en'; // fall back to dashboard toggle
}

// ── Multi-language string helper ──────────────────────────────────────────────
function ml(l,en,es,fr,ht){
  if(l==='ht')return ht||en;
  if(l==='fr')return fr||en;
  if(l==='es')return es||en;
  return en;
}

function openChat(){
  chatOpen=true;
  document.getElementById('chatPanel').classList.add('open');
  healthCheck();
  if(!document.getElementById('chatMessages').children.length){
    setTimeout(()=>{
      const l=chatState.lang||lang||'en';
      addMsg('bot',ml(l,
        "Hi, I'm Ávila. I'm here to help you find humanitarian resources in the Caribbean and Central America.<br><br>Which country are you in right now?",
        "Hola, soy Ávila. Estoy aquí para ayudarte a encontrar recursos humanitarios en el Caribe y Centroamérica.<br><br>¿En qué país estás ahora mismo?",
        "Bonjour, je suis Ávila. Je suis ici pour vous aider à trouver des ressources humanitaires dans les Caraïbes et en Amérique centrale.<br><br>Dans quel pays êtes-vous?",
        "Bonjou, mwen se Ávila. Mwen la pou ede ou jwenn resous imanitè nan Karayib ak Amerik Santral.<br><br>Ki peyi ou ye kounye a?"
      ));
      chatState.step='awaiting_country';
      chatState.greeted=true;
    },300);
  }
}

function closeChat(){chatOpen=false;document.getElementById('chatPanel').classList.remove('open');}
function heroKey(e){if(e.key==='Enter')heroSend();}

function heroSend(){
  const input=document.getElementById('heroChatInput');
  const text=input.value.trim();
  if(!text)return;
  input.value='';
  openChat();
  setTimeout(()=>{
    addMsg('user',text);
    const detectedLang=detectLang(text);
    chatState.lang=detectedLang;
    chatState.step='awaiting_country';
    showTyping();
    setTimeout(async()=>{
      removeTyping();
      const country=detectCountry(text);
      const intent=detectIntent(text);
      if(country){
        chatState.country=country.iso3;
        chatState.countryName=country.name;
        showCountryBanner(country.name);
        if(intent!=='unknown'){chatState.step='awaiting_intent';await handleIntent(intent,text);}
        else{
          chatState.step='awaiting_intent';
          const l=chatState.lang;
          addMsg('bot',ml(l,
            `Got it, <strong>${country.name}</strong>. How can I help you? Ask about food, water, shelter, emergencies, disasters, displacement, or funding.`,
            `Entendido, <strong>${country.name}</strong>. ¿Cómo puedo ayudarte? Pregunta sobre comida, agua, refugio, emergencias, desastres, desplazamiento o financiamiento.`,
            `Compris, <strong>${country.name}</strong>. Comment puis-je vous aider? Posez des questions sur la nourriture, l'eau, l'abri, les urgences ou les catastrophes.`,
            `Konprann, <strong>${country.name}</strong>. Kijan mwen ka ede ou? Mande sou manje, dlo, abri, ijans, oswa katastwòf.`
          ));
        }
      } else {
        const l=chatState.lang;
        addMsg('bot',ml(l,
          'Which country are you in? (e.g. Haiti, Honduras, Jamaica)',
          '¿En qué país estás? (ej. Haití, Honduras, Jamaica)',
          'Dans quel pays êtes-vous? (ex. Haïti, Honduras, Jamaïque)',
          'Ki peyi ou ye? (egz. Ayiti, Ondiras, Jamayik)'
        ));
        chatState.step='awaiting_country';
      }
    },900);
  },500);
}

function addMsg(role,html){
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');
  div.className=`msg ${role==='user'?'user':''}`;
  div.innerHTML=`<div class="msg-avatar">${role==='bot'?`<svg style="display:block;width:100%;height:85%;"
   viewBox="14 60 196 200"
   version="1.1"
   id="svg5"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs2" />
  <g
     id="layer1">
    <path
       style="fill:#77b6b7;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 30.570909,179.80387 c -6.19103,-4.01141 -8.91219,-5.14424 -12.36293,-5.14679 -2.86627,-0.002 -3.17816,-0.0993 -3.43871,-1.07152 -0.50143,-1.87106 -0.30522,-8.03452 0.41767,-13.12037 0.38487,-2.70775 0.57638,-5.12281 0.42558,-5.36682 -0.1508,-0.244 -0.0405,-0.7252 0.24509,-1.06932 0.2856,-0.34413 0.59178,-1.45742 0.68039,-2.47399 0.0886,-1.01656 0.26806,-2.16906 0.39878,-2.5611 0.13071,-0.39203 0.66932,-2.42352 1.19691,-4.5144 0.52758,-2.09087 1.04168,-4.12236 1.14245,-4.51439 0.10077,-0.39204 0.35431,-0.83897 0.56342,-0.99316 0.20912,-0.1542 0.415,-0.74226 0.45753,-1.3068 0.0425,-0.56454 0.21892,-1.02644 0.39199,-1.02644 0.17307,0 0.43423,-0.58806 0.58034,-1.3068 0.14612,-0.71875 0.83531,-2.58984 1.53155,-4.15801 0.69623,-1.56815 1.22667,-2.93421 1.17875,-3.03567 -0.0479,-0.10146 0.0966,-0.31529 0.32117,-0.4752 0.22456,-0.1599 1.13455,-1.68068 2.02219,-3.37952 0.88764,-1.69885 1.79137,-3.16008 2.00829,-3.24721 0.21691,-0.0871 0.39439,-0.46133 0.39439,-0.83159 0,-0.37027 0.21384,-0.67321 0.4752,-0.67321 0.26136,0 0.4752,-0.2281 0.4752,-0.5069 0,-0.54199 2.29041,-3.77534 3.08609,-4.35662 0.26285,-0.19202 0.30406,-0.3524 0.0916,-0.3564 -0.21248,-0.004 0.37373,-0.80918 1.30268,-1.78927 0.92895,-0.98011 1.69086,-1.94381 1.69312,-2.14158 0.006,-0.53476 9.90671,-10.31294 12.36853,-12.215628 1.17106,-0.90508 2.20048,-1.8139 2.2876,-2.0196 0.0871,-0.2057 0.36336,-0.37399 0.61387,-0.37399 0.2505,0 0.91437,-0.42754 1.47526,-0.95009 0.56089,-0.52254 1.62114,-1.21626 2.35613,-1.5416 0.73498,-0.32533 1.33634,-0.75316 1.33634,-0.95072 0,-0.19756 0.31013,-0.3592 0.68918,-0.3592 0.37906,0 0.8602,-0.26729 1.0692,-0.59399 0.3744,-0.58522 4.31913,-2.73629 5.01322,-2.73372 0.4489,0.002 0.4692,1.63091 0.0258,2.07427 -0.18181,0.18181 -0.39861,0.69858 -0.48179,1.1484 -0.0832,0.44981 -0.27948,1.45936 -0.43623,2.24345 -0.49551,2.47852 -0.52378,12.760098 -0.0399,14.493598 0.25536,0.91476 0.50447,1.98396 0.55356,2.37599 0.0491,0.39205 0.21794,1.03356 0.37519,1.42561 0.15726,0.39203 0.65102,1.88891 1.09726,3.3264 2.20168,7.09242 8.00019,15.00007 14.70642,20.05571 2.35224,1.77329 5.18562,3.57508 6.2964,4.00399 1.11078,0.4289 2.0196,0.92896 2.0196,1.11125 0,0.1823 0.2673,0.34958 0.594,0.37176 0.3267,0.0222 2.1978,0.63543 4.158,1.3628 3.25385,1.20739 4.25216,1.33892 11.471881,1.51138 6.81673,0.16284 8.43957,0.0545 11.76111,-0.78549 4.76063,-1.20387 10.92194,-4.04964 14.61032,-6.7482 3.4412,-2.51771 8.71173,-7.90495 10.6081,-10.84301 0.78078,-1.20967 1.58858,-2.41324 1.79511,-2.67459 0.69913,-0.88474 3.45109,-7.19894 3.45109,-7.91831 0,-0.39297 0.14874,-0.86324 0.33055,-1.04505 0.18181,-0.1818 0.40349,-0.69858 0.49263,-1.1484 0.20588,-1.03881 0.49808,-2.17436 0.63844,-2.48105 0.14828,-0.32399 0.20185,-0.69123 0.65853,-4.5144 0.52503,-4.3954 0.52662,-5.11731 0.0198,-9.028788 -0.23706,-1.82953 -0.45363,-3.64717 -0.48129,-4.0392 -0.0813,-1.15353 -0.73016,-3.49848 -1.21618,-4.3956 -0.24779,-0.45738 -0.30223,-0.8316 -0.12098,-0.8316 0.61013,0 7.04249,3.4539 7.20251,3.86744 0.0871,0.22515 0.36698,0.40935 0.62189,0.40935 0.2549,0 1.25282,0.60563 2.2176,1.34583 0.96477,0.7402 3.36495,2.55191 5.33372,4.02602 5.03678,3.771258 13.20755,12.219818 17.32395,17.912958 1.03937,1.43747 2.05381,2.68488 2.25431,2.772 0.2005,0.0871 0.36455,0.41275 0.36455,0.72363 0,0.31088 0.72178,1.66121 1.60396,3.00073 1.65262,2.50937 5.95663,10.7711 6.27047,12.03644 0.0972,0.39203 0.82442,2.49248 1.61598,4.66764 0.79155,2.17516 1.43919,4.24618 1.43919,4.60226 0,0.35608 0.24719,1.24941 0.5493,1.98516 0.30212,0.73576 0.5903,1.55157 0.64042,1.81293 0.0501,0.26136 0.14005,0.58212 0.19986,0.7128 0.63094,1.37866 1.92848,10.67418 2.24644,16.09345 l 0.31691,5.40143 -3.04566,-0.33652 c -2.26301,-0.25004 -3.47307,-0.67118 -4.70887,-1.63881 -7.44642,-5.83053 -6.69619,-5.47561 -15.444,-7.30614 -7.70802,-1.61293 -10.45941,-1.87139 -20.6712,-1.94176 -2.55327,-0.0176 -3.22013,0.13635 -8.90353,2.05542 -3.09288,1.04434 -5.30433,2.17475 -7.48802,3.82758 -1.70439,1.29005 -3.38288,2.23657 -3.72998,2.10337 -0.3471,-0.13319 -1.57505,0.078 -2.72878,0.46937 -5.24851,1.78028 -14.06412,2.15126 -15.19231,0.63932 -0.14532,-0.19475 -0.8403,-0.40177 -1.5444,-0.46004 -0.7041,-0.0583 -1.28018,-0.25986 -1.28018,-0.44798 0,-0.18811 -0.37422,-0.32298 -0.8316,-0.29971 -0.45738,0.0233 -2.33918,-0.42554 -4.18178,-0.99736 l -3.35018,-1.03966 -3.893551,0.90661 c -2.25286,0.52458 -5.94733,0.94158 -8.76741,0.9896 -6.2168,0.10585 -7.0204,0.3367 -14.67415,4.21536 -9.6854,4.90824 -9.08802,4.71074 -18.11072,5.98747 -3.06503,0.4337 -4.44055,0.8594 -5.25782,1.62718 -0.94884,0.89139 -1.65149,1.03983 -4.92222,1.03983 -2.64867,0 -4.67368,0.30236 -6.62217,0.98878 -1.54374,0.54382 -3.02064,1.03098 -3.282,1.08256 -0.26136,0.0516 -0.68904,0.21858 -0.9504,0.37112 -1.79436,1.04723 -3.0408,0.81959 -5.99564,-1.09496 z"
       id="path3328" />
    <path
       style="fill:#f5db72;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:1.79603"
       d="m 376.95161,542.48584 c -0.49086,-0.49086 -4.0782,-1.3716 -7.97187,-1.95719 -47.33149,-7.11856 -94.9364,-43.14589 -115.42312,-87.35204 -4.40661,-9.50859 -7.15865,-16.41083 -8.46515,-21.23104 -0.13387,-0.4939 -0.77036,-2.11033 -1.41441,-3.59206 -0.64405,-1.48172 -1.52446,-4.71458 -1.95646,-7.18412 -0.432,-2.46955 -0.97177,-4.89419 -1.1995,-5.3881 -2.16104,-4.68703 -2.92707,-47.3294 -1.06471,-59.26904 1.04327,-6.68839 2.55564,-13.47023 3.00391,-13.47023 0.14898,0 0.61138,-1.82848 1.02755,-4.06328 3.27461,-17.58441 23.78578,-52.45959 41.028,-69.75997 20.6681,-20.73783 56.19693,-39.52403 83.0172,-43.89613 23.5956,-3.84643 56.28085,-2.47771 73.39268,3.07336 14.01999,4.54809 38.41392,16.22498 47.26539,22.62501 22.47089,16.24751 42.72964,40.57571 53.82042,64.63153 3.07414,6.66776 5.12873,12.12321 4.56578,12.12321 -0.56297,0 -0.13255,1.0737 0.95662,2.386 1.08911,1.3123 2.34034,4.3431 2.78051,6.73512 0.44015,2.39201 0.9635,4.34911 1.16297,4.34911 0.19948,0 0.65124,1.61643 1.00392,3.59207 0.35269,1.97563 1.41368,7.63313 2.35778,12.57222 3.25613,17.03478 1.56282,56.65146 -2.87877,67.35118 -0.61507,1.48172 -1.4055,4.17112 -1.75652,5.97646 -0.351,1.80531 -3.59163,9.48335 -7.20138,17.06229 -3.60976,7.57893 -6.63607,14.20232 -6.72512,14.71863 -0.53816,3.11981 -18.555,26.04881 -27.39363,34.86226 -10.15345,10.12455 -32.46255,26.16209 -36.39291,26.16209 -1.0618,0 -1.93054,0.85592 -1.93054,1.90203 0,1.04612 -0.66325,1.49211 -1.47391,0.99109 -0.81066,-0.501 -3.97151,0.60794 -7.02412,2.46435 -5.5249,3.35989 -24.42752,9.47396 -36.40276,11.7745 -7.97107,1.53131 -47.51713,3.00142 -48.70785,1.81069 z"
       id="path6251"
       transform="scale(0.26458333)" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 66.11153,249.65078 c -0.51553,-0.3499 -2.11345,-1.25694 -3.55093,-2.01565 -3.25789,-1.71953 -7.61357,-4.47986 -9.83369,-6.23191 -1.40115,-1.10575 -12.77739,-14.50789 -17.31332,-20.39651 -0.68674,-0.89153 -1.83683,-2.20606 -2.55575,-2.92116 -0.71892,-0.7151 -1.86776,-2.04845 -2.55298,-2.963 -0.68522,-0.91455 -1.64188,-2.09067 -2.1259,-2.6136 -0.48403,-0.52293 -1.44509,-1.69923 -2.1357,-2.61399 -0.69061,-0.91476 -1.36379,-1.77012 -1.49596,-1.9008 -0.39207,-0.38765 -2.47019,-5.41393 -2.50502,-6.0588 -0.0177,-0.3267 -0.24592,-0.594 -0.50728,-0.594 -0.26136,0 -0.33189,-0.14331 -0.15674,-0.31846 0.17516,-0.17516 -0.008,-0.81668 -0.40695,-1.4256 -0.39898,-0.60893 -0.63552,-1.10714 -0.52564,-1.10714 0.10987,0 -0.28908,-1.44341 -0.88657,-3.2076 -1.21675,-3.59263 -1.05725,-4.66696 0.42854,-2.88651 0.54613,0.65443 4.34072,5.23362 8.43242,10.17599 4.09171,4.94237 7.83391,9.44056 8.31601,9.99597 0.48209,0.55542 4.19105,5.02077 8.24213,9.92301 4.05108,4.90224 9.18324,11.08632 11.4048,13.74241 2.22156,2.65608 4.89456,5.87199 5.94,7.14647 1.04544,1.27447 2.7027,3.25603 3.6828,4.40345 0.9801,1.14742 1.782,2.18013 1.782,2.29491 0,0.39597 -0.74172,0.20681 -1.67627,-0.42748 z"
       id="path8238" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 103.57473,257.65256 c -0.45525,-0.52272 -2.21674,-2.66112 -3.91441,-4.752 -1.69768,-2.09088 -3.30868,-4.03258 -3.58,-4.31489 -0.27133,-0.28232 -2.20404,-2.61534 -4.29492,-5.1845 -2.09088,-2.56916 -4.65696,-5.67505 -5.7024,-6.90196 -1.04544,-1.22692 -3.18384,-3.7915 -4.752,-5.69907 -1.56816,-1.90757 -3.17196,-3.81232 -3.564,-4.23277 -0.39204,-0.42046 -1.56816,-1.83114 -2.6136,-3.13484 -1.04544,-1.3037 -2.01066,-2.47729 -2.14494,-2.60797 -0.13427,-0.13068 -1.18916,-1.41372 -2.34419,-2.8512 -1.15503,-1.43748 -2.33307,-2.82744 -2.61787,-3.0888 -0.2848,-0.26136 -1.36831,-1.5444 -2.40781,-2.8512 -1.0395,-1.3068 -1.99691,-2.48291 -2.12759,-2.6136 -0.25522,-0.25522 -4.04709,-4.87646 -5.22589,-6.36892 -0.39276,-0.49727 -1.67639,-2.01022 -2.85251,-3.36211 -1.17612,-1.3519 -3.31452,-3.92057 -4.752,-5.70818 -2.68902,-3.34398 -4.71671,-5.76937 -8.71684,-10.42649 -1.2659,-1.47382 -2.19293,-2.96295 -2.06007,-3.30918 0.23994,-0.62527 3.7075,-1.71312 5.46066,-1.71312 0.55855,0 2.00553,1.3265 3.70997,3.40107 1.53685,1.87058 3.64964,4.40614 4.69508,5.63456 1.04544,1.22842 3.65506,4.34897 5.79916,6.93454 2.1441,2.58557 7.81086,9.38631 12.5928,15.11276 4.78194,5.72644 9.33596,11.21456 10.12004,12.19581 1.86641,2.33575 3.42641,4.21346 14.73658,17.73787 5.22424,6.24702 10.02066,12.0207 10.6587,12.8304 0.63805,0.80971 1.97455,2.37624 2.97,3.48118 0.99546,1.10494 1.80992,2.22962 1.80992,2.49928 0,0.30807 -1.4968,0.44448 -4.02707,0.36702 -3.33912,-0.10222 -4.16846,-0.28564 -4.8548,-1.07369 z"
       id="path8277" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 135.44098,251.39431 c -0.74656,-1.00108 -1.47679,-1.92707 -1.62275,-2.05775 -0.45584,-0.40812 -12.02013,-14.21044 -13.52083,-16.1375 -2.68629,-3.44947 -7.11212,-8.81039 -8.07052,-9.77564 -0.52705,-0.53083 -1.49288,-1.68736 -2.14628,-2.57005 -0.6534,-0.8827 -1.41458,-1.83835 -1.6915,-2.12366 -0.65182,-0.67156 -5.16026,-6.06426 -7.47826,-8.94501 -0.99228,-1.23319 -2.06148,-2.51505 -2.376,-2.84859 -0.31451,-0.33353 -1.42255,-1.67533 -2.4623,-2.98178 -1.03975,-1.30645 -2.75047,-3.3006 -3.8016,-4.43144 -1.05113,-1.13084 -1.99406,-2.28841 -2.0954,-2.57238 -0.17616,-0.49361 -1.83493,-2.49766 -3.4059,-4.11485 -0.40643,-0.41838 -1.47563,-1.71921 -2.376,-2.89073 -0.90038,-1.17152 -1.96539,-2.46215 -2.36671,-2.86807 -0.40132,-0.40592 -1.36361,-1.58581 -2.13841,-2.62197 -0.77479,-1.03616 -1.65718,-2.09777 -1.96084,-2.35912 -1.57362,-1.35439 -7.28167,-8.89331 -7.03531,-9.29192 0.37595,-0.6083 3.80524,-2.35049 4.62666,-2.35049 0.59393,0 4.07388,3.70237 6.28717,6.68902 0.91548,1.23536 6.37857,7.79839 18.50368,22.2292 3.15234,3.75178 6.37304,7.62935 7.15712,8.61682 2.18711,2.75446 4.85505,5.98577 9.0288,10.93536 4.05136,4.80447 6.57601,7.83682 9.2664,11.12987 4.90043,5.99816 7.50904,9.14477 12.02448,14.50445 2.74012,3.25243 4.87749,6.18597 4.7497,6.51898 -0.12778,0.33299 -0.37243,0.57768 -0.54366,0.54374 -0.17123,-0.0339 -0.90882,0.18496 -1.63908,0.48644 -3.07903,1.27112 -3.47602,1.21351 -4.91266,-0.71293 z"
       id="path8316" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 161.27524,237.79099 c -0.46187,-0.57598 -1.31722,-1.66085 -1.9008,-2.41083 -0.58357,-0.74998 -1.97838,-2.35378 -3.09956,-3.564 -1.12119,-1.21022 -2.39687,-2.78846 -2.83486,-3.5072 -0.43799,-0.71874 -0.93838,-1.3068 -1.11199,-1.3068 -0.17361,0 -1.17294,-1.12266 -2.22075,-2.4948 -1.04781,-1.37214 -2.30308,-2.92265 -2.78949,-3.44558 -0.48642,-0.52294 -1.4774,-1.74474 -2.20219,-2.71511 -0.72479,-0.97038 -1.97457,-2.46709 -2.77728,-3.32602 -0.80271,-0.85893 -2.28161,-2.63089 -3.28643,-3.93769 -1.00482,-1.3068 -2.42805,-3.07141 -3.16272,-3.92136 -0.73468,-0.84995 -1.97729,-2.32516 -2.76137,-3.27826 -0.78408,-0.95309 -1.75704,-2.07531 -2.16214,-2.49383 -0.4051,-0.41852 -2.21223,-2.57859 -4.01585,-4.80014 -1.80363,-2.22157 -4.14519,-5.02216 -5.20347,-6.22356 -1.05828,-1.20139 -3.3141,-3.97217 -5.01294,-6.15728 -2.65186,-3.41093 -4.55092,-5.68331 -8.91178,-10.66368 -2.08427,-2.38036 -7.24502,-8.74684 -7.24502,-8.9377 0,-0.68354 3.29867,-0.68617 5.75021,-0.005 l 2.84097,0.78986 8.65361,10.42939 c 4.75948,5.73617 12.60965,15.17385 17.44481,20.97262 4.83516,5.79877 9.64656,11.58518 10.692,12.85869 1.04544,1.27351 2.75616,3.31055 3.8016,4.52675 1.04543,1.21619 3.07692,3.67224 4.51439,5.45787 1.43749,1.78563 3.89817,4.76117 5.46819,6.61231 1.57002,1.85113 3.86938,4.5766 5.10968,6.05659 l 2.25509,2.69089 -2.20658,1.9423 c -1.21362,1.06828 -2.33685,1.93243 -2.49608,1.92034 -0.15922,-0.0121 -0.66738,-0.49322 -1.12925,-1.06919 z"
       id="path8355" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 178.50519,213.96791 c -1.42487,-1.74011 -3.83301,-4.68385 -5.35141,-6.54163 -1.5184,-1.85779 -3.48788,-4.23316 -4.37663,-5.2786 -0.88875,-1.04544 -2.14965,-2.62459 -2.80201,-3.50924 -0.65236,-0.88464 -1.56971,-1.96774 -2.03857,-2.40689 -0.46885,-0.43914 -1.38706,-1.49134 -2.04046,-2.33822 -0.6534,-0.84688 -1.67833,-2.11602 -2.27762,-2.82031 -0.59928,-0.70429 -1.56156,-1.88433 -2.1384,-2.6223 -0.57683,-0.73797 -1.58338,-1.94486 -2.23678,-2.68196 -0.6534,-0.73711 -1.86179,-2.16479 -2.68531,-3.17263 -0.82352,-1.00785 -1.97178,-2.36704 -2.55168,-3.02045 -1.40875,-1.58729 -8.44728,-10.14217 -10.08535,-12.2581 -0.71717,-0.92637 -1.73363,-2.08463 -2.2588,-2.57391 l -0.95486,-0.88959 1.08507,-1.08507 c 0.93241,-0.93241 3.59022,-2.20133 4.61077,-2.20133 0.17799,0 2.55178,2.70441 5.27509,6.0098 2.72331,3.30538 7.19788,8.70484 9.9435,11.9988 2.74562,3.29395 5.52554,6.65308 6.1776,7.46473 0.65206,0.81165 3.85857,4.65816 7.12557,8.54779 5.86824,6.98663 7.62073,9.10288 11.96076,14.44338 l 2.21916,2.73073 -1.51371,2.52084 c -0.83254,1.38646 -1.73455,2.59444 -2.00447,2.68442 -0.26992,0.09 -1.65657,-1.26014 -3.08146,-3.00026 z"
       id="path8394" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 193.17346,186.63723 c -0.40641,-0.61685 -1.73996,-2.19074 -2.96345,-3.49755 -1.22347,-1.3068 -2.54027,-2.96406 -2.92621,-3.6828 -0.38593,-0.71873 -0.8738,-1.3068 -1.08414,-1.3068 -0.21034,0 -1.05201,-0.90882 -1.87036,-2.0196 -0.81836,-1.11078 -2.26547,-2.87496 -3.21581,-3.9204 -0.95034,-1.04543 -2.35696,-2.74645 -3.12583,-3.78004 -0.76887,-1.03358 -2.35743,-2.92085 -3.53014,-4.19393 -1.17271,-1.27309 -2.47189,-2.83313 -2.88706,-3.46676 -0.93608,-1.42865 -0.65704,-1.45903 3.95816,-0.43102 1.7804,0.39658 3.66895,0.81596 4.19679,0.93197 0.52783,0.11601 3.20083,2.92179 5.94,6.23507 2.73916,3.31327 6.00969,7.22415 7.26785,8.69083 l 2.28755,2.66669 -0.28923,3.46132 c -0.15907,1.90372 -0.45347,3.9053 -0.6542,4.44794 -0.36081,0.97535 -0.37342,0.97381 -1.10392,-0.13492 z"
       id="path8433" />
    <path
       style="fill:#08080b;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 98.51407,258.30495 c -0.48099,-0.28053 -1.49673,-0.41874 -2.2572,-0.30712 -0.76047,0.11161 -1.38267,0.0511 -1.38267,-0.13454 0,-0.18562 -0.42511,-0.44865 -0.94468,-0.58452 -0.51958,-0.13587 -1.1558,-0.80233 -1.41384,-1.48102 -0.25804,-0.67869 -0.66332,-1.23399 -0.90062,-1.23399 -0.2373,0 -1.15142,-0.98012 -2.03136,-2.17806 -0.87995,-1.19794 -2.19777,-2.7389 -2.92849,-3.42436 -0.73072,-0.68547 -1.7918,-2.00412 -2.35794,-2.93034 -0.56614,-0.92622 -1.82397,-2.5394 -2.79517,-3.58484 -0.9712,-1.04544 -2.39619,-2.75616 -3.16666,-3.8016 -0.77046,-1.04544 -2.17584,-2.63773 -3.12305,-3.53842 -0.9472,-0.90069 -1.72219,-1.81135 -1.72219,-2.02371 0,-0.36382 -1.58903,-2.33036 -3.4452,-4.2637 -0.45738,-0.47639 -0.8316,-0.9803 -0.8316,-1.11978 0,-0.13949 -0.58806,-0.87811 -1.3068,-1.64138 -0.71874,-0.76327 -1.80503,-1.98564 -2.41397,-2.71638 -0.60894,-0.73074 -1.96791,-2.29091 -3.01993,-3.46703 -1.05202,-1.17612 -3.09233,-3.68873 -4.53401,-5.5836 -1.44169,-1.89486 -2.76307,-3.4452 -2.93641,-3.4452 -0.17334,0 -0.67137,-0.60299 -1.10672,-1.33999 -0.43536,-0.737 -1.50674,-2.12079 -2.38085,-3.0751 -2.78351,-3.03888 -3.68506,-4.13653 -3.69486,-4.49852 -0.005,-0.19403 -0.96753,-1.30418 -2.1384,-2.467 -1.17087,-1.16281 -2.12885,-2.34477 -2.12885,-2.62658 0,-0.2818 -0.58806,-1.07808 -1.3068,-1.7695 -2.02061,-1.94381 -2.97,-3.04011 -2.97,-3.42959 0,-0.19588 -0.697,-1.0333 -1.54889,-1.86093 -0.85188,-0.82763 -2.18838,-2.35298 -2.97,-3.38965 -0.78161,-1.03668 -2.43267,-2.96124 -3.66902,-4.2768 -2.57011,-2.73478 -3.06159,-4.21081 -0.88634,-2.66189 0.75909,0.54051 1.61445,0.98276 1.90081,0.98276 0.28635,0 0.52064,0.21383 0.52064,0.4752 0,0.26135 0.30294,0.47519 0.6732,0.47519 0.37026,0 0.78166,0.26731 0.91422,0.594 0.15615,0.38483 0.37927,0.42666 0.6336,0.11881 0.21592,-0.26137 0.82026,-0.55004 1.34298,-0.6415 0.52272,-0.0915 1.08794,-0.38789 1.25604,-0.65872 0.18319,-0.29513 0.65915,-0.0654 1.188,0.57335 0.4853,0.58617 1.73762,2.03642 2.78294,3.22278 1.04532,1.18637 2.24992,2.71391 2.67688,3.39455 0.42697,0.68065 1.76356,2.19088 2.97022,3.35607 1.20666,1.1652 2.19392,2.35622 2.19392,2.64671 0,0.29049 0.48114,0.97296 1.0692,1.5166 1.46757,1.35671 3.2076,3.46672 3.2076,3.88963 0,0.19202 0.48114,0.79393 1.0692,1.33757 1.42037,1.31308 3.40576,3.62402 3.42768,3.98972 0.01,0.16081 0.65904,0.94458 1.44312,1.74173 0.78408,0.79715 1.97644,2.05554 2.64969,2.79643 1.56805,1.72559 10.31249,12.55823 11.75075,14.55686 0.60216,0.83678 2.04558,2.49104 3.2076,3.67614 1.16201,1.18509 2.11276,2.39915 2.11276,2.69791 0,0.29875 0.48222,0.93292 1.0716,1.40927 0.58938,0.47635 1.48349,1.50761 1.98692,2.29169 0.50343,0.78408 1.73765,2.28096 2.7427,3.3264 2.95932,3.07825 3.22758,3.38937 3.22758,3.7433 0,0.18545 1.17491,1.55747 2.61093,3.04894 1.436,1.49147 2.61212,2.96694 2.6136,3.27882 10e-4,0.31188 0.38653,0.84648 0.8557,1.188 0.46917,0.34152 1.47627,1.4763 2.23798,2.52174 1.43368,1.96769 2.65271,3.41388 4.98129,5.90954 l 1.35859,1.45606 h -1.11258 c -0.61192,0 -1.39737,0.10117 -1.74545,0.22482 -0.34808,0.12365 -1.0264,-0.005 -1.50739,-0.28523 z"
       id="path10966" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.36014"
       d="m 80.06869,255.004 c -0.13276,-0.21481 -0.45761,-0.30759 -0.7219,-0.20618 -0.26428,0.10142 -0.5315,0.071 -0.59381,-0.0677 -0.0623,-0.13863 -0.92362,-0.52594 -1.914,-0.86069 -6.69421,-2.26265 -6.7925,-2.31989 -9.24748,-5.38561 -0.86911,-1.08534 -3.70226,-4.50978 -6.95534,-8.40695 -0.66135,-0.79231 -5.44346,-6.54553 -10.62689,-12.78494 -5.18343,-6.23942 -10.18069,-12.2207 -11.10501,-13.29173 -0.92433,-1.07104 -1.92369,-2.29176 -2.2208,-2.71271 -0.29712,-0.42095 -0.88719,-1.16527 -1.31126,-1.65405 -1.20367,-1.3873 -7.127,-8.4806 -11.29361,-13.52432 -2.07981,-2.51762 -3.9543,-4.7561 -4.16553,-4.97441 -1.51413,-1.5648 -2.67712,-3.69026 -2.67712,-4.89267 0,-0.72957 -0.10921,-1.43571 -0.2427,-1.56919 -0.29005,-0.29005 -0.50845,-1.75363 -0.51512,-3.45198 -0.003,-0.67855 -0.15661,-1.51731 -0.34211,-1.86391 -0.18549,-0.3466 -0.2098,-0.97474 -0.054,-1.39587 0.26456,-0.71517 0.36454,-0.66348 1.51557,0.78349 0.67778,0.85205 1.35988,1.6032 1.51577,1.66923 0.15589,0.066 0.28344,0.26385 0.28344,0.43961 0,0.17577 0.72653,1.09412 1.61452,2.04079 0.88799,0.94667 1.61727,1.85323 1.62063,2.01457 0.003,0.16135 0.49913,0.70822 1.10173,1.21527 0.60259,0.50705 1.02447,0.99307 0.9375,1.08004 -0.087,0.087 0.47784,0.83659 1.25513,1.66584 0.77729,0.82925 1.73295,1.84891 2.12368,2.26591 0.39073,0.417 0.71043,0.93019 0.71043,1.14044 0,0.21024 0.12154,0.43628 0.2701,0.5023 0.48994,0.21776 4.41171,4.87414 4.41171,5.23811 0,0.196 0.48618,0.72897 1.08041,1.18438 0.59423,0.4554 1.08042,0.97129 1.08042,1.14642 0,0.17513 0.49177,0.79914 1.09283,1.38669 0.60106,0.58755 1.01536,1.06828 0.92065,1.06828 -0.0947,0 0.31945,0.5267 0.92034,1.17045 0.60088,0.64375 1.36072,1.57561 1.68854,2.0708 0.32781,0.49519 0.96148,1.19572 1.40815,1.55673 0.44668,0.36101 0.81214,0.80668 0.81214,0.99038 0,0.1837 0.2836,0.63271 0.63024,0.99779 0.34663,0.36508 1.19746,1.37065 1.89073,2.23459 0.69327,0.86394 1.58461,1.92613 1.98076,2.36041 1.07919,1.18307 1.96257,2.22556 4.24129,5.00518 1.13667,1.38654 2.43007,2.94128 2.87422,3.45499 0.44416,0.5137 1.37478,1.63271 2.06804,2.48669 0.69327,0.85398 1.79999,2.13533 2.45938,2.84745 0.65938,0.71213 1.61277,1.90251 2.11865,2.64529 0.50588,0.74279 1.0603,1.35053 1.23206,1.35053 0.17175,0 0.31228,0.22575 0.31228,0.50167 0,0.27593 0.2431,0.59496 0.54021,0.70898 0.29711,0.11401 0.54021,0.45547 0.54021,0.75881 0,0.30333 0.14804,0.55151 0.32897,0.55151 0.18093,0 1.16018,1.01289 2.17609,2.25087 2.36085,2.87688 3.90809,4.73638 5.12592,6.16043 0.53263,0.62281 1.55088,1.86167 2.26279,2.75302 1.61088,2.01689 2.60937,3.21468 6.65585,7.98437 0.61675,0.72698 0.96507,1.4184 0.77403,1.53646 -0.19103,0.11807 -0.45596,0.0389 -0.58872,-0.17589 z"
       id="path15556" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="M 93.17239,233.73657 C 67.07097,202.37761 53.81198,186.41943 50.06736,181.85643 l -2.96117,-3.60833 h 2.57176 c 1.75243,0 2.74522,-0.20901 3.11623,-0.65606 0.82289,-0.99151 1.47909,-0.80039 2.62803,0.7654 1.75314,2.38922 15.07163,18.49752 17.80999,21.54063 0.64939,0.72167 1.38456,1.64038 1.63371,2.04158 0.51231,0.82498 17.2368,20.80298 18.33173,21.8979 0.39029,0.3903 0.70963,0.90622 0.70963,1.1465 0,0.24028 0.49204,0.82391 1.09343,1.29696 0.60139,0.47306 1.09343,0.98796 1.09343,1.14423 0,0.15628 0.6643,1.01363 1.47621,1.90524 0.81192,0.8916 3.40382,3.98291 5.7598,6.86957 2.35597,2.88667 6.02167,7.2595 8.146,9.71742 2.12433,2.45791 3.86242,4.65782 3.86242,4.8887 0,0.23087 0.49204,0.80681 1.09343,1.27986 0.60139,0.47306 1.09343,0.98699 1.09343,1.14208 0,0.15509 0.78836,1.10242 1.7519,2.10519 2.06827,2.15245 1.92008,2.31742 -2.47026,2.75004 l -3.11436,0.30687 z"
       id="path15595" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 139.39408,245.29673 c -2.28527,-2.81206 -7.7982,-9.45352 -12.25095,-14.75879 -4.45275,-5.30528 -9.85256,-11.81095 -11.99958,-14.45705 -2.14702,-2.64611 -5.98863,-7.27134 -8.53692,-10.27828 -2.54828,-3.00694 -7.87505,-9.40187 -11.83726,-14.21096 -3.96221,-4.80908 -9.61504,-11.59639 -12.56184,-15.0829 -2.9468,-3.4865 -5.35782,-6.44739 -5.35782,-6.57973 0,-0.13235 1.25584,-0.85992 2.79075,-1.61682 l 2.79075,-1.37618 2.20324,2.70377 c 1.21179,1.48708 2.56379,3.09922 3.00445,3.58255 1.49298,1.63752 3.42086,3.97389 4.51887,5.47635 0.60139,0.8229 1.53628,1.95279 2.07753,2.51086 0.54125,0.55807 0.98409,1.13025 0.98409,1.27152 0,0.14126 0.36198,0.57516 0.8044,0.96421 0.44243,0.38905 2.15213,2.38031 3.79936,4.42503 1.64722,2.04472 4.7377,5.78426 6.86774,8.31009 2.13003,2.52583 4.40588,5.2407 5.05745,6.03305 2.05652,2.50086 3.5335,4.21503 4.45117,5.166 0.4887,0.50642 0.88854,1.14608 0.88854,1.42146 0,0.27538 0.16498,0.50069 0.36661,0.50069 0.20164,0 1.55345,1.52534 3.00401,3.38964 2.8483,3.66071 11.30116,13.74398 12.77976,15.24475 0.49895,0.50643 0.90717,1.05431 0.90717,1.21752 0,0.26662 0.74765,1.12753 3.50067,4.03096 0.48018,0.50643 0.87307,1.12968 0.87307,1.38502 0,0.25533 0.18724,0.52984 0.4161,0.61003 0.22885,0.0802 2.67242,2.90124 5.43014,6.26901 l 5.01405,6.12323 -2.69657,1.40024 c -1.4831,0.77013 -2.79497,1.40864 -2.91524,1.41891 -0.12028,0.0103 -2.08846,-2.28211 -4.37374,-5.09418 z"
       id="path15634" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 163.76756,229.96748 c -2.01661,-2.34541 -5.41223,-6.42938 -7.54583,-9.07549 -2.1336,-2.64611 -6.95015,-8.45224 -10.70345,-12.90251 -3.7533,-4.45027 -8.81292,-10.55163 -11.24361,-13.55857 -3.46404,-4.28528 -11.50124,-13.90772 -16.42327,-19.66255 -1.86584,-2.18153 -6.83093,-8.53077 -6.74122,-8.62049 0.0594,-0.0594 1.67476,0.37541 3.58966,0.96626 1.9149,0.59084 4.10364,1.07429 4.86386,1.07433 1.19298,5e-5 1.79177,0.48727 4.37373,3.55874 1.64533,1.95728 3.37797,4.07307 3.8503,4.70176 0.47234,0.6287 1.11199,1.30047 1.42146,1.49284 0.30948,0.19238 0.56268,0.5885 0.56268,0.88028 0,0.29179 0.49205,0.90003 1.09343,1.35165 0.60139,0.45163 1.09344,1.08426 1.09344,1.40585 0,0.32159 0.49204,0.90712 1.09343,1.30116 0.60139,0.39404 1.09343,0.94232 1.09343,1.21839 0,0.27607 0.49205,0.87146 1.09344,1.32308 0.60139,0.45163 1.09343,1.00654 1.09343,1.23315 0,0.22661 0.76956,1.23233 1.71013,2.23495 2.14714,2.28876 13.16056,15.51674 13.16056,15.80686 0,0.11813 0.70224,0.9379 1.56054,1.82171 0.8583,0.88382 2.08841,2.31433 2.73358,3.17892 0.64517,0.86459 1.39369,1.7688 1.66336,2.00935 0.26968,0.24056 2.89253,3.38964 5.82856,6.99797 2.93603,3.60833 5.76474,7.05265 6.28603,7.65403 0.52128,0.60139 1.42065,1.648 1.99858,2.32579 l 1.0508,1.23235 -2.12485,2.1573 c -1.16867,1.1865 -2.26903,2.15728 -2.44524,2.15728 -0.17622,0 -1.97035,-1.91897 -3.98696,-4.26439 z"
       id="path15673" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 183.08112,207.99194 c -1.32312,-1.51353 -3.67284,-4.32641 -5.22161,-6.25085 -1.54877,-1.92444 -6.26536,-7.61948 -10.48131,-12.65563 -4.21596,-5.03616 -10.25326,-12.31842 -13.41623,-16.18281 -3.16296,-3.86439 -6.8682,-8.35469 -8.23387,-9.97844 -2.25076,-2.67611 -2.38771,-3.13905 -0.86291,-2.91707 0.13296,0.0194 0.72897,-0.28405 1.32447,-0.67424 0.5955,-0.39019 1.26039,-0.59963 1.47753,-0.46543 0.21714,0.1342 0.51842,0.044 0.66952,-0.20051 0.56611,-0.91599 1.51339,-0.37723 3.25573,1.8517 1.99927,2.55763 3.27568,4.08426 5.57671,6.66994 0.85629,0.96222 2.27096,2.63403 3.14371,3.71514 2.84677,3.52637 14.93072,18.10001 16.81069,20.27424 1.00853,1.16639 2.01726,2.44328 2.24162,2.83752 0.22436,0.39423 0.75095,1.01446 1.17021,1.37826 1.0438,0.90576 7.83053,9.22902 7.80417,9.57104 -0.0117,0.1514 -0.65832,1.51361 -1.43699,3.02714 l -1.41577,2.75186 z"
       id="path15712" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 190.19075,171.03389 c -2.94687,-3.54313 -5.29443,-6.50558 -5.21678,-6.58322 0.0777,-0.0777 1.39095,0.83001 2.91846,2.01702 1.5275,1.18701 3.09854,2.1809 3.4912,2.20865 0.39266,0.0277 0.91074,0.0962 1.1513,0.15207 0.24056,0.0559 1.15178,0.13159 2.02495,0.16823 l 1.58758,0.0666 0.20378,2.73359 c 0.11207,1.50347 -0.0226,3.39632 -0.29938,4.20633 l -0.50315,1.47275 z"
       id="path15751" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 190.15463,194.63794 c -0.49523,-0.66382 -1.26654,-1.60058 -1.71402,-2.08169 -0.69056,-0.74245 -3.1817,-3.69994 -6.85276,-8.1356 -0.4776,-0.57708 -3.28012,-4.00151 -6.22782,-7.60984 -2.9477,-3.60832 -5.71923,-6.95423 -6.15896,-7.43534 -2.80471,-3.06864 -7.95744,-9.38898 -7.95744,-9.76061 0,-0.24462 -0.24603,-0.54404 -0.54672,-0.66537 -0.5966,-0.24073 3.11443,-0.4833 3.82702,-0.25015 0.24055,0.0787 1.24118,0.17438 2.22361,0.21261 1.80817,0.0703 3.68092,1.21028 3.68092,2.24055 0,0.30182 0.49205,0.87117 1.09344,1.26522 0.60139,0.39404 1.09343,0.94232 1.09343,1.21839 0,0.27607 0.49204,0.87146 1.09343,1.32308 0.60139,0.45163 1.09344,0.99702 1.09344,1.21199 0,0.21496 0.54125,0.94507 1.20277,1.62245 0.66153,0.67739 1.79323,1.92589 2.5149,2.77444 0.72167,0.84856 2.17218,2.54441 3.22337,3.76856 1.05119,1.22414 2.52732,3.064 3.2803,4.08857 0.75298,1.02457 2.10466,2.65502 3.00374,3.62322 0.89909,0.9682 1.63716,1.89802 1.64015,2.06625 0.003,0.16824 0.86677,1.21769 1.91948,2.33211 1.71296,1.81337 1.87927,2.17176 1.58319,3.41178 -0.90931,3.8083 -1.45024,5.57545 -1.76649,5.77091 -0.19171,0.11848 -0.75375,-0.32771 -1.24898,-0.99153 z"
       id="path19142" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 174.54527,219.68921 c -1.40879,-1.74402 -4.87723,-5.9264 -7.70764,-9.29418 -2.8304,-3.36777 -5.68549,-6.78496 -6.34463,-7.59376 -0.65914,-0.8088 -1.50624,-1.79289 -1.88244,-2.18687 -0.3762,-0.39398 -1.94221,-2.29087 -3.48003,-4.21531 -2.78847,-3.48952 -7.99126,-9.76485 -10.91454,-13.16454 -1.68277,-1.95701 -3.80287,-4.50571 -5.35879,-6.44212 -0.54666,-0.68034 -1.30172,-1.56602 -1.67792,-1.96818 -0.3762,-0.40216 -1.91987,-2.26349 -3.43037,-4.13629 -2.19904,-2.72649 -2.64471,-3.52759 -2.23629,-4.01971 0.28054,-0.33803 0.75354,-0.52118 1.05112,-0.40698 0.29758,0.11419 1.23255,-0.26165 2.07772,-0.8352 l 1.53668,-1.04282 1.1706,1.00691 c 0.64383,0.5538 1.1706,1.19676 1.1706,1.42881 0,0.23205 0.15791,0.48751 0.35092,0.5677 0.19301,0.0802 2.05783,2.21238 4.14404,4.73821 3.67463,4.44898 5.23088,6.30043 6.93562,8.25121 0.44872,0.51349 0.81749,1.08124 0.81947,1.26165 0.002,0.18042 0.98607,1.3767 2.18686,2.65841 1.2008,1.2817 2.18327,2.50592 2.18327,2.72048 0,0.21457 0.58272,0.82095 1.29494,1.34752 0.71222,0.52656 1.19879,1.11297 1.08127,1.30312 -0.11752,0.19016 0.38226,0.78632 1.11061,1.32482 0.72836,0.5385 1.32428,1.2209 1.32428,1.51645 0,0.29554 0.1672,0.60296 0.37156,0.68315 0.52695,0.20676 7.93854,9.02578 7.93854,9.44603 0,0.19115 0.39363,0.63126 0.87474,0.97803 0.48111,0.34676 0.87475,0.81174 0.87475,1.03329 0,0.22155 0.54125,0.96072 1.20277,1.64261 0.66153,0.6819 1.69483,1.83604 2.29621,2.56476 0.60139,0.72873 1.58548,1.85763 2.18687,2.50866 0.60139,0.65103 1.0458,1.33404 0.98759,1.51779 -0.0582,0.18375 0.48304,0.76947 1.20278,1.30159 0.71974,0.53213 1.30861,1.179 1.30861,1.4375 0,0.2585 0.48647,0.83532 1.08103,1.28181 0.86621,0.6505 0.99351,0.97532 0.64067,1.63462 -0.24219,0.45254 -0.35446,0.8228 -0.24948,0.8228 0.10497,0 -0.38014,0.61127 -1.07805,1.35838 -0.6979,0.7471 -1.26891,1.53437 -1.26891,1.74949 0,1.14213 -1.49798,0.0391 -3.77503,-2.77984 z"
       id="path19181" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 150.96678,236.59035 c -2.87693,-3.51189 -5.77203,-6.92747 -6.43356,-7.59017 -0.66153,-0.66271 -1.20278,-1.41535 -1.20278,-1.67254 0,-0.25719 -0.48537,-0.84942 -1.0786,-1.31605 -0.59323,-0.46664 -0.97855,-0.94848 -0.85627,-1.07075 0.12227,-0.12228 -0.42565,-0.76756 -1.21761,-1.43396 -0.79196,-0.66639 -1.43994,-1.34453 -1.43994,-1.50698 0,-0.16244 -0.61768,-0.97022 -1.37262,-1.79506 -0.75494,-0.82485 -4.03394,-4.74721 -7.28667,-8.71637 -3.25273,-3.96917 -6.473,-7.79941 -7.15616,-8.51166 -0.68316,-0.71225 -1.19667,-1.439 -1.14114,-1.615 0.0555,-0.176 -0.38732,-0.70408 -0.98409,-1.1735 -0.59678,-0.46943 -1.08505,-1.05691 -1.08505,-1.30553 0,-0.24861 -0.54125,-0.87777 -1.20278,-1.39813 -0.66153,-0.52035 -1.20278,-1.08988 -1.20278,-1.26561 0,-0.17573 -0.62173,-0.99438 -1.38162,-1.81922 -2.78666,-3.02485 -12.6314,-14.95561 -13.18878,-15.98338 -0.31596,-0.58261 -1.05233,-1.37239 -1.6364,-1.75508 -0.58406,-0.3827 -0.96333,-0.85534 -0.84283,-1.05032 0.1205,-0.19498 -0.26814,-0.73778 -0.86367,-1.20621 -0.59552,-0.46844 -0.98272,-0.95176 -0.86044,-1.07404 0.12228,-0.12228 -0.37644,-0.72615 -1.10826,-1.34194 -0.73183,-0.61579 -1.33455,-1.27994 -1.33938,-1.47589 -0.005,-0.19594 -0.89052,-1.23193 -1.96818,-2.30218 -1.07767,-1.07025 -1.9594,-2.13108 -1.9594,-2.3574 0,-0.23728 1.01841,-0.30637 2.40556,-0.16321 1.45834,0.15052 2.40555,0.0783 2.40555,-0.18331 0,-0.23737 0.20544,-0.30461 0.45653,-0.14943 0.2511,0.15519 0.7479,0.0404 1.10401,-0.2552 0.3561,-0.29554 0.70375,-0.4601 0.77255,-0.36568 0.0688,0.0944 2.22903,2.6786 4.80053,5.74263 2.5715,3.06403 4.67546,5.75278 4.67546,5.975 0,0.22222 0.57954,0.89169 1.28786,1.48771 0.70833,0.59602 1.20836,1.16318 1.11118,1.26036 -0.0972,0.0972 0.84862,1.28721 2.10178,2.64451 1.25315,1.35729 2.30702,2.5978 2.34193,2.75667 0.0349,0.15888 1.15062,1.50017 2.47937,2.98065 1.32875,1.48048 4.18348,4.85678 6.34385,7.50289 2.16036,2.64611 4.43976,5.36472 5.06531,6.04137 0.62556,0.67665 1.13738,1.41018 1.13738,1.63007 0,0.21989 0.49035,0.72109 1.08968,1.11378 0.59932,0.3927 1.00558,0.85006 0.90279,1.01637 -0.10278,0.1663 0.82161,1.37489 2.05421,2.68574 1.2326,1.31085 2.25327,2.51034 2.26816,2.66554 0.0149,0.15521 1.13965,1.53293 2.49948,3.06162 1.35982,1.52868 4.24311,4.94442 6.40731,7.59053 2.16419,2.64611 4.44672,5.36472 5.07228,6.04137 0.62556,0.67665 1.13737,1.40043 1.13737,1.60841 0,0.20797 0.48538,0.75993 1.07861,1.22656 0.59323,0.46664 0.97855,0.94848 0.85627,1.07076 -0.12228,0.12228 0.37644,0.72615 1.10827,1.34195 0.73182,0.61579 1.33059,1.31485 1.33059,1.55348 0,0.23863 0.49204,0.8209 1.09343,1.29396 0.60139,0.47305 1.09343,1.0026 1.09343,1.17678 0,0.17418 0.59046,0.98918 1.31212,1.81111 1.433,1.63209 1.6452,2.33873 0.70232,2.33873 -0.33539,0 -1.19652,0.54125 -1.91361,1.20277 -0.7171,0.66153 -1.58235,1.25114 -1.92279,1.31025 -0.34047,0.0591 -2.97262,-2.76563 -5.84976,-6.27777 z"
       id="path19220" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 128.78503,254.35315 c -0.53974,-0.66607 -1.47338,-1.84811 -2.07477,-2.62675 -0.60139,-0.77864 -1.58548,-1.92462 -2.18687,-2.54661 -0.60139,-0.622 -1.09343,-1.28358 -1.09343,-1.47018 0,-0.1866 -0.43423,-0.786 -0.96496,-1.332 -0.53072,-0.546 -1.56402,-1.60448 -2.29621,-2.35219 -0.73219,-0.74771 -1.33125,-1.57302 -1.33125,-1.83404 0,-0.26101 -0.34793,-0.73174 -0.77318,-1.04608 -0.42526,-0.31433 -2.87844,-3.14247 -5.45152,-6.28476 -2.57308,-3.14228 -5.07436,-6.07165 -5.55841,-6.50971 -0.48405,-0.43806 -0.78084,-0.95704 -0.65955,-1.1533 0.12129,-0.19625 -0.37539,-0.79742 -1.10375,-1.33591 -0.72835,-0.5385 -1.32428,-1.23277 -1.32428,-1.54282 0,-0.31004 -0.49204,-0.88612 -1.09343,-1.28016 -0.60139,-0.39405 -1.09343,-0.9845 -1.09343,-1.31213 0,-0.32761 -0.49205,-0.91807 -1.09344,-1.31211 -0.60139,-0.39405 -1.09343,-0.9845 -1.09343,-1.31212 0,-0.32762 -0.49205,-0.91808 -1.09344,-1.31212 -0.60138,-0.39405 -1.09343,-0.91092 -1.09343,-1.14861 0,-0.23769 -0.68255,-1.14994 -1.51679,-2.02722 -1.83329,-1.92787 -10.33415,-12.11049 -10.94834,-13.11428 -0.24056,-0.39315 -0.88022,-1.11751 -1.42147,-1.60969 -0.54125,-0.49218 -0.98409,-1.1301 -0.98409,-1.41759 0,-0.28749 -0.49204,-0.84511 -1.09343,-1.23915 -0.60139,-0.39405 -1.09343,-0.94232 -1.09343,-1.2184 0,-0.27607 -0.49205,-0.87145 -1.09344,-1.32308 -0.60138,-0.45162 -1.09343,-1.08425 -1.09343,-1.40584 0,-0.3216 -0.49204,-0.90712 -1.09343,-1.30116 -0.60139,-0.39405 -1.09343,-0.87577 -1.09343,-1.07051 0,-0.19473 -0.76968,-1.20539 -1.7104,-2.2459 -0.94071,-1.04052 -3.39625,-3.95844 -5.45673,-6.48427 -2.06049,-2.52583 -4.14467,-4.99298 -4.63152,-5.48255 -1.2169,-1.22371 -1.14217,-1.36253 0.91023,-1.69072 0.98747,-0.1579 2.40712,-0.60343 3.15478,-0.99006 1.27755,-0.66064 1.38668,-0.65394 1.81292,0.11135 0.24945,0.44787 1.12273,1.5079 1.94062,2.35562 0.81789,0.84772 1.47119,1.63972 1.45177,1.76 -0.0194,0.12028 1.01049,1.39959 2.28867,2.84293 1.27818,1.44333 4.99235,5.87173 8.2537,9.8409 3.26135,3.96916 6.43351,7.73029 7.04925,8.35806 0.61573,0.62777 1.11951,1.34834 1.11951,1.60127 0,0.25292 0.59672,0.96196 1.32603,1.57564 0.72932,0.61368 1.34412,1.27084 1.36623,1.46035 0.0221,0.18951 1.07734,1.52547 2.34498,2.9688 1.26763,1.44333 4.95893,5.87173 8.20288,9.84089 3.24395,3.96917 6.46324,7.78449 7.15398,8.4785 0.69073,0.69401 1.21123,1.41841 1.15666,1.60978 -0.0546,0.19138 0.47576,0.83177 1.17852,1.42311 0.70276,0.59133 1.17989,1.17301 1.06028,1.29262 -0.11961,0.11961 0.28494,0.61266 0.899,1.09568 0.61406,0.48301 1.11646,0.96593 1.11646,1.07314 0,0.10722 0.66811,0.96457 1.48468,1.90524 1.63544,1.88396 10.56994,12.65854 12.43072,14.99084 0.64569,0.8093 1.73604,2.03941 2.42301,2.73358 0.68697,0.69416 1.10571,1.26212 0.93054,1.26212 -0.17517,0 -0.0988,0.26469 0.16968,0.58821 0.39287,0.47338 -0.10951,0.76256 -2.57345,1.48132 l -3.06161,0.89312 z"
       id="path19259" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 91.18423,257.60544 c -0.13452,-0.13452 -0.86408,-0.32299 -1.62124,-0.41882 -0.75716,-0.0958 -2.5522,-0.4055 -3.98898,-0.68816 -2.88846,-0.56827 -2.33982,-0.0708 -8.7243,-7.91149 -0.60139,-0.73856 -1.51516,-1.7982 -2.0306,-2.35476 -0.51544,-0.55655 -2.48362,-2.93705 -4.37373,-5.28999 -1.89011,-2.35294 -5.34903,-6.54749 -7.68648,-9.32123 -2.33746,-2.77373 -4.69927,-5.59465 -5.24848,-6.26871 -0.54921,-0.67406 -1.4414,-1.7163 -1.98265,-2.31609 -0.54125,-0.59979 -0.98409,-1.26724 -0.98409,-1.48322 0,-0.21598 -0.3664,-0.64988 -0.81422,-0.96421 -0.44782,-0.31433 -2.64153,-2.83492 -4.87491,-5.60131 -2.23338,-2.76639 -5.26209,-6.4319 -6.73047,-8.14559 -1.46838,-1.71369 -3.16182,-3.75606 -3.76321,-4.5386 -0.60139,-0.78253 -1.58548,-1.98593 -2.18687,-2.67421 -0.60139,-0.68828 -1.58548,-1.8499 -2.18686,-2.58137 -0.60139,-0.73147 -1.46369,-1.74371 -1.91621,-2.24942 -0.45253,-0.50571 -2.11304,-2.5174 -3.69002,-4.47043 -2.93982,-3.64085 -9.95406,-11.99795 -11.47527,-13.67218 -0.46794,-0.51502 -0.85081,-1.13828 -0.85081,-1.38502 0,-0.24674 -0.24602,-0.55532 -0.54671,-0.68573 -0.3007,-0.13041 1.22464,-0.12048 3.38964,0.0221 4.34786,0.28629 5.75059,0.80163 7.02094,2.57939 0.92829,1.29906 1.38496,1.85607 5.53202,6.74759 7.85079,9.26013 13.79454,16.45585 14.67989,17.77201 0.54475,0.80983 1.17115,1.47241 1.39199,1.47241 0.22084,0 0.51496,0.34444 0.6536,0.76541 0.13864,0.42097 1.18519,1.78841 2.32568,3.03877 1.14049,1.25035 2.698,3.02171 3.46114,3.93636 1.87244,2.24417 12.96875,15.7244 14.46994,17.57864 0.66005,0.81528 1.49532,1.80743 1.85615,2.20477 0.36084,0.39735 1.42661,1.69848 2.36839,2.8914 0.94178,1.19293 1.93487,2.36578 2.20687,2.60633 0.272,0.24056 1.86002,2.11033 3.52894,4.15505 2.60945,3.19703 4.53934,5.53117 9.00608,10.89252 0.48188,0.57839 1.69785,2.10373 2.70216,3.38964 1.00431,1.28591 1.97622,2.33802 2.15981,2.33802 0.18358,0 0.33379,0.19682 0.33379,0.43737 0,0.46558 -1.00131,0.6024 -1.41092,0.19279 z"
       id="path22728" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 120.52572,255.57575 c -0.80822,-1.02595 -1.81392,-2.26247 -2.2349,-2.74781 -0.42097,-0.48535 -1.08644,-1.2527 -1.47883,-1.70523 -0.39239,-0.45253 -2.00302,-2.42071 -3.57918,-4.37373 -1.57616,-1.95303 -5.24068,-6.36151 -8.14338,-9.79663 -2.90269,-3.43513 -5.84199,-7.0421 -6.53176,-8.0155 -0.68979,-0.97341 -1.52626,-1.87425 -1.85884,-2.00187 -0.33258,-0.12762 -0.6047,-0.49643 -0.6047,-0.81957 0,-0.32315 -0.27144,-0.74493 -0.60319,-0.9373 -0.33176,-0.19237 -2.43182,-2.61317 -4.66681,-5.37955 -2.23498,-2.76639 -6.29323,-7.68684 -9.01833,-10.93433 -2.7251,-3.2475 -5.49628,-6.55885 -6.15818,-7.35856 -0.66191,-0.79971 -1.51308,-1.78379 -1.8915,-2.18686 -0.37842,-0.40307 -2.34646,-2.79944 -4.37342,-5.32527 -3.2485,-4.04801 -9.82142,-11.95075 -12.82867,-15.42413 -2.15672,-2.49103 -2.02502,-2.63784 2.83803,-3.1637 l 2.44283,-0.26416 2.07222,2.53737 c 1.13972,1.39555 2.59908,3.1921 3.24302,3.99235 0.64394,0.80024 2.10042,2.47319 3.23661,3.71767 1.13619,1.24447 2.07107,2.40233 2.07752,2.57302 0.006,0.17068 0.47317,0.76113 1.03717,1.31212 0.56399,0.55098 2.61302,2.96996 4.55339,5.37552 3.43092,4.25344 11.30836,13.76874 12.49206,15.08937 0.6524,0.72788 2.27812,2.68169 18.01448,21.64998 5.98704,7.21666 12.91342,15.54745 15.39196,18.51288 2.47854,2.96543 4.50643,5.55931 4.50643,5.76419 0,0.20487 -1.1317,0.59682 -2.51489,0.871 -1.3832,0.27418 -2.83772,0.58976 -3.23228,0.7013 -0.46438,0.13127 -1.23562,-0.45506 -2.18686,-1.66257 z"
       id="path22767" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="M 132.14105,225.38048 C 98.68993,185.11777 92.80599,178.03416 88.32487,172.63072 c -2.46245,-2.96928 -4.47719,-5.65447 -4.47719,-5.96709 0,-0.82592 1.03034,-1.09935 4.14252,-1.09935 h 2.75886 l 4.96875,6.00855 c 7.5503,9.13036 23.21949,27.97201 32.97665,39.65326 4.80229,5.74929 11.07996,13.32678 13.95037,16.83886 2.87041,3.51208 6.93526,8.43671 9.03301,10.9436 2.09776,2.50689 3.71418,4.81837 3.59206,5.13662 -0.12213,0.31825 -0.39963,0.46888 -0.61668,0.33474 -0.21704,-0.13414 -0.51227,0.0627 -0.65605,0.43737 -0.14379,0.3747 -0.40782,0.5908 -0.58674,0.48022 -0.17892,-0.11057 -0.69954,0.13658 -1.15695,0.54923 -0.4574,0.41265 -1.14323,0.80057 -1.52407,0.86204 -0.44559,0.0719 -7.07186,-7.56671 -18.58836,-21.42829 z"
       id="path22806" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 171.47698,227.52825 c -0.68645,-0.80033 -1.83854,-2.20436 -2.5602,-3.12006 -0.72167,-0.91571 -1.65656,-1.97759 -2.07753,-2.35973 -0.42097,-0.38215 -0.7654,-0.85453 -0.7654,-1.04972 0,-0.19521 -0.54125,-0.90037 -1.20278,-1.56703 -0.66152,-0.66666 -1.79323,-1.95924 -2.51489,-2.87241 -0.72167,-0.91317 -1.53397,-1.89741 -1.80512,-2.18718 -0.27115,-0.28978 -2.59479,-3.07453 -5.16365,-6.18834 -2.56886,-3.1138 -5.4961,-6.62042 -6.50498,-7.79248 -1.00887,-1.17206 -1.91435,-2.35297 -2.01217,-2.62424 -0.0978,-0.27127 -0.63907,-0.89312 -1.20278,-1.3819 -0.5637,-0.48877 -1.02492,-1.03665 -1.02492,-1.21751 0,-0.18087 -0.54125,-0.87983 -1.20277,-1.55324 -0.66153,-0.67342 -1.593,-1.70008 -2.06993,-2.28147 -0.47693,-0.58139 -3.47865,-4.20616 -6.67048,-8.05505 -3.19184,-3.84888 -6.14753,-7.43746 -6.5682,-7.97461 -0.42067,-0.53716 -1.35532,-1.63994 -2.07698,-2.45063 -0.72167,-0.81069 -1.70576,-1.99988 -2.18687,-2.64264 -0.48111,-0.64276 -1.10376,-1.42789 -1.38367,-1.74473 -0.41228,-0.46668 0.17495,-0.69534 3.09218,-1.20406 l 3.60111,-0.62798 4.56185,5.40877 c 2.50902,2.97482 4.87228,5.73578 5.25169,6.13546 0.37941,0.39968 2.16795,2.60083 3.97454,4.89144 3.41942,4.33554 13.03635,15.80969 15.26498,18.21295 0.70578,0.76109 1.28324,1.58779 1.28324,1.83711 0,0.24932 0.27054,0.61071 0.6012,0.80307 0.33066,0.19237 1.8429,1.92431 3.36054,3.84875 1.51764,1.92445 5.19755,6.39805 8.17758,9.94134 5.48101,6.517 5.66546,6.89536 3.96092,8.12511 -0.4357,0.31433 -0.79218,0.82508 -0.79218,1.13499 0,0.54629 -1.346,2.01116 -1.84796,2.01116 -0.13656,0 -0.80992,-0.65481 -1.49637,-1.45514 z"
       id="path22845" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:1.65306"
       d=""
       id="path22884"
       transform="scale(0.26458333)" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 187.57349,202.74705 c -0.28866,-0.28867 -0.52484,-0.73689 -0.52484,-0.99604 0,-0.25915 -0.54125,-0.99152 -1.20278,-1.62749 -1.96029,-1.88454 -3.12853,-3.30885 -2.90079,-3.5366 0.1173,-0.1173 -0.27632,-0.59838 -0.8747,-1.06908 -0.59839,-0.47069 -2.8092,-3.00256 -4.91291,-5.62637 -2.1037,-2.62381 -5.01959,-6.17037 -6.47974,-7.88125 -1.46015,-1.71087 -3.14686,-3.76482 -3.74825,-4.56433 -0.60139,-0.7995 -1.63468,-1.95295 -2.29621,-2.56322 -0.66153,-0.61027 -1.20278,-1.35644 -1.20278,-1.65816 0,-0.30171 -0.49204,-0.87097 -1.09343,-1.26502 -0.60139,-0.39405 -1.09343,-0.97788 -1.09343,-1.2974 0,-0.31953 -0.38667,-0.85179 -0.85927,-1.18281 -0.47259,-0.33102 -2.08223,-2.16275 -3.57697,-4.0705 -1.49475,-1.90776 -3.46989,-4.33284 -4.38922,-5.38907 -2.03089,-2.33332 -2.09533,-2.8346 -0.31412,-2.44338 0.74657,0.16398 2.46056,0.28496 3.80887,0.26885 2.78747,-0.0333 2.31668,-0.40437 7.16496,5.64743 1.84036,2.2972 5.32961,6.48187 7.7539,9.29928 2.42428,2.8174 4.40779,5.2257 4.40779,5.35177 0,0.25498 1.34052,1.81509 3.17096,3.69039 0.66152,0.67774 1.20277,1.34346 1.20277,1.47937 0,0.13591 0.66898,0.99183 1.48662,1.90205 0.81764,0.91021 3.37865,3.97299 5.69114,6.80617 3.71645,4.55327 4.16778,5.28947 3.88793,6.34192 -0.17414,0.65486 -0.34874,1.33828 -0.388,1.51869 -0.0393,0.18042 -0.12059,0.42644 -0.18073,0.54672 -0.0601,0.12028 -0.14362,0.3663 -0.18552,0.54672 -0.52056,2.24179 -1.29635,2.82625 -2.35125,1.77136 z"
       id="path22923" />
    <path
       style="fill:#08080b;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.107786"
       d="m 45.39687,235.60474 c 0.30247,-0.0784 0.15166,-0.29457 -0.25706,-0.36846 -0.20277,-0.0367 -0.2838,-0.073 -0.18005,-0.0808 0.43463,-0.0327 0.10287,-0.32927 -0.38607,-0.34512 -0.22573,-0.007 -0.22635,-0.0106 -0.0181,-0.0966 0.19454,-0.0803 0.17877,-0.10545 -0.16168,-0.25768 -0.20749,-0.0928 -0.33494,-0.17058 -0.28322,-0.1729 0.19755,-0.009 -0.18574,-0.32799 -0.40364,-0.33608 -0.12613,-0.005 -0.16913,-0.0328 -0.0956,-0.0626 0.17591,-0.0711 -0.0983,-0.36007 -0.34164,-0.36007 -0.0975,0 -0.16938,-0.0915 -0.16938,-0.21558 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.14371,0 -0.21557,-0.0719 -0.21557,-0.21557 0,-0.14372 -0.0719,-0.21558 -0.21557,-0.21558 -0.14372,0 -0.21558,-0.0719 -0.21558,-0.21557 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.14371,0 -0.21557,-0.0719 -0.21557,-0.21557 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.12412,0 -0.21557,-0.0719 -0.21557,-0.16938 0,-0.24333 -0.28902,-0.51754 -0.36009,-0.34164 -0.0297,0.0736 -0.0579,0.0246 -0.0625,-0.10875 -0.006,-0.16783 -0.0749,-0.24252 -0.22408,-0.24252 -0.12412,0 -0.21557,-0.0719 -0.21557,-0.16938 0,-0.24333 -0.28902,-0.51754 -0.36008,-0.34164 -0.0308,0.0762 -0.0577,0.0496 -0.0626,-0.0619 -0.005,-0.10764 -0.0646,-0.30058 -0.13322,-0.42874 -0.12188,-0.22775 -0.1266,-0.2282 -0.208,-0.0199 -0.0778,0.19919 -0.0838,0.19716 -0.0909,-0.031 -0.004,-0.13641 -0.22163,-0.46438 -0.49262,-0.7432 -0.26677,-0.27448 -0.48503,-0.54052 -0.48503,-0.5912 0,-0.0507 -0.0613,-0.0922 -0.13612,-0.0922 -0.0749,0 -0.18578,-0.10913 -0.24647,-0.24252 -0.0607,-0.13338 -0.1692,-0.23039 -0.24113,-0.21557 -0.0719,0.0148 -0.13079,-0.0254 -0.13079,-0.0893 0,-0.0639 -0.19401,-0.30264 -0.43114,-0.53048 -0.23713,-0.22783 -0.43114,-0.46243 -0.43114,-0.52132 0,-0.12002 -0.35998,-0.57033 -0.72756,-0.91014 -0.13339,-0.12331 -0.24252,-0.25825 -0.24252,-0.29987 0,-0.0416 -0.19611,-0.28752 -0.43581,-0.54644 -0.89032,-0.96173 -0.97137,-1.06359 -0.84627,-1.06359 0.0703,0 0.0117,-0.1171 -0.13034,-0.26021 -0.14205,-0.14312 -0.39985,-0.43414 -0.57291,-0.64672 -0.17305,-0.21258 -0.36706,-0.38725 -0.43114,-0.38816 -0.0641,-7.9e-4 -0.18614,-0.0457 -0.27125,-0.0996 -0.12514,-0.0792 -0.12892,-0.12904 -0.0197,-0.2606 0.11077,-0.13347 0.0941,-0.20753 -0.0928,-0.41241 -0.4395,-0.48185 -0.51234,-0.5751 -0.63941,-0.81863 -0.0705,-0.13505 -0.16448,-0.22306 -0.20892,-0.1956 -0.0444,0.0275 -0.13943,-0.0439 -0.21108,-0.15866 -0.09,-0.14412 -0.0937,-0.2086 -0.012,-0.2086 0.065,0 -0.007,-0.14923 -0.16077,-0.33162 -0.15347,-0.1824 -0.27905,-0.37641 -0.27905,-0.43115 0,-0.0547 -0.14551,-0.0995 -0.32335,-0.0995 -0.34216,0 -0.40371,-0.0921 -0.19859,-0.29724 0.0945,-0.0945 0.089,-0.16788 -0.0227,-0.30252 -0.0811,-0.0978 -0.19904,-0.2817 -0.26201,-0.40876 -0.0661,-0.13331 -0.2388,-0.24545 -0.40841,-0.26513 -0.31846,-0.037 -0.36395,-0.12221 -0.16913,-0.31702 0.0945,-0.0945 0.089,-0.16789 -0.0227,-0.30252 -0.0811,-0.0978 -0.19904,-0.2817 -0.26201,-0.40876 -0.0661,-0.13332 -0.2388,-0.24545 -0.4084,-0.26513 -0.33947,-0.0394 -0.35831,-0.0933 -0.1233,-0.35303 0.15654,-0.17297 0.15312,-0.1979 -0.0415,-0.30205 -0.11666,-0.0624 -0.24005,-0.22394 -0.27418,-0.35889 -0.0354,-0.13994 -0.21273,-0.31152 -0.41274,-0.39934 -0.23146,-0.10164 -0.29701,-0.17171 -0.19285,-0.20612 0.0868,-0.0287 0.2076,-0.11965 0.26845,-0.20218 0.14994,-0.20338 0.47434,-0.0652 0.59557,0.25362 0.0533,0.14013 0.17082,0.25477 0.26121,0.25477 0.0904,0 0.16434,0.0743 0.16434,0.16506 0,0.0908 0.0728,0.19298 0.16168,0.22711 0.0889,0.0341 0.16168,0.12115 0.16168,0.19339 0,0.0722 0.12126,0.24528 0.26947,0.38451 0.1482,0.13923 0.26946,0.29693 0.26946,0.35044 0,0.0535 0.14458,0.24187 0.32129,0.41857 0.1767,0.17671 0.31647,0.35487 0.31059,0.39591 -0.03,0.20934 0.0299,0.27206 0.12262,0.12851 0.0928,-0.14353 0.10467,-0.14345 0.10614,8e-4 7.9e-4,0.0893 0.17141,0.31823 0.3789,0.50865 0.20749,0.19043 0.37725,0.39114 0.37725,0.44603 0,0.0549 0.12042,0.21403 0.2676,0.35364 0.14719,0.13961 0.26844,0.31275 0.26947,0.38477 10e-4,0.072 0.0989,0.18286 0.21743,0.24631 0.11857,0.0635 0.21557,0.18642 0.21557,0.27326 0,0.0868 0.0773,0.15789 0.17177,0.15789 0.0945,0 0.19714,0.097 0.22815,0.21557 0.031,0.11857 0.12195,0.21557 0.2021,0.21557 0.0801,0 0.1213,0.0636 0.0914,0.14145 -0.03,0.0781 0.0682,0.20698 0.21896,0.28768 0.15028,0.0804 0.27323,0.20327 0.27323,0.27299 0,0.0697 0.0993,0.2166 0.2206,0.3264 0.12133,0.1098 0.29642,0.35941 0.38908,0.55469 0.0927,0.19527 0.20694,0.33127 0.25394,0.30222 0.047,-0.029 0.13743,0.0963 0.20095,0.2785 0.0635,0.18223 0.16526,0.30057 0.22608,0.26298 0.0608,-0.0376 0.11057,-0.017 0.11057,0.0458 0,0.0628 0.0728,0.11415 0.16168,0.11415 0.0889,0 0.15593,0.0364 0.14891,0.0808 -0.0352,0.22328 0.029,0.3503 0.17711,0.3503 0.0904,0 0.20609,0.10913 0.2571,0.24252 0.051,0.13338 0.19532,0.33492 0.32069,0.44785 0.12537,0.11293 0.22794,0.27057 0.22794,0.3503 0,0.0797 0.0485,0.14498 0.10779,0.14498 0.0593,0 0.0957,0.0606 0.0808,0.13473 -0.0148,0.0741 0.0337,0.12261 0.10778,0.10778 0.0741,-0.0148 0.13474,0.0299 0.13474,0.0993 0,0.0695 0.26677,0.38261 0.59282,0.6959 0.32605,0.31329 0.59282,0.61178 0.59282,0.66332 0,0.0515 0.12126,0.20763 0.26947,0.34686 0.1482,0.13923 0.26946,0.31745 0.26946,0.39604 0,0.0786 0.0485,0.14289 0.10779,0.14289 0.0593,0 0.0957,0.0606 0.0808,0.13473 -0.0148,0.0741 0.0328,0.1229 0.10589,0.10842 0.0731,-0.0145 0.16363,0.0964 0.20125,0.24628 0.0376,0.14993 0.20825,0.34491 0.37915,0.43328 0.1709,0.0884 0.31073,0.2322 0.31073,0.3196 0,0.0874 0.097,0.15891 0.21557,0.15891 0.13685,0 0.21557,0.0719 0.21557,0.19678 0,0.10823 0.12126,0.3107 0.26947,0.44994 0.1482,0.13923 0.26946,0.31745 0.26946,0.39604 0,0.0786 0.0849,0.14671 0.18863,0.1514 0.11268,0.005 0.13438,0.0304 0.0539,0.0629 -0.177,0.0714 -0.17356,0.25197 0.005,0.25197 0.0767,0 0.32448,0.24252 0.55053,0.53893 0.23799,0.31208 0.49685,0.53893 0.61497,0.53893 0.13013,0 0.20397,0.0758 0.20397,0.20946 0,0.11521 0.10227,0.28109 0.22726,0.36864 0.12499,0.0875 0.19693,0.20824 0.15988,0.2682 -0.0371,0.06 0.0301,0.17733 0.1493,0.2608 0.11918,0.0835 0.18648,0.18199 0.14956,0.21891 -0.0369,0.0369 0.0618,0.12587 0.21932,0.19766 0.18642,0.0849 0.24237,0.15776 0.16022,0.20853 -0.0818,0.0505 0.0116,0.16734 0.26507,0.33161 0.21521,0.13948 0.3919,0.31422 0.39264,0.38833 7.9e-4,0.0741 0.0753,0.13473 0.16568,0.13473 0.0904,0 0.20659,0.11112 0.25823,0.24695 0.0516,0.13582 0.174,0.31343 0.2719,0.39468 0.1257,0.10432 0.14164,0.17021 0.0542,0.22423 -0.0769,0.0475 0.002,0.13236 0.2095,0.22402 0.27659,0.12243 0.30135,0.16016 0.14562,0.22185 -0.10321,0.0409 -0.33316,0.0721 -0.51101,0.0694 -0.18339,-0.003 -0.23913,-0.0268 -0.12877,-0.0554 z M 29.41162,215.5242 c 0,-0.0593 -0.0514,-0.10779 -0.11414,-0.10779 -0.0628,0 -0.0842,0.0485 -0.0475,0.10779 0.0366,0.0593 0.088,0.10779 0.11415,0.10779 0.0261,0 0.0475,-0.0485 0.0475,-0.10779 z"
       id="path29746" />
  </g>
</svg>`:''}</div><div class="msg-bubble">${html}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');
  div.className='msg';div.id='typing';
  div.innerHTML=`<div class="msg-avatar"><svg style="display:block;width:100%;height:85%;"
   viewBox="14 60 196 200"
   version="1.1"
   id="svg5"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs2" />
  <g
     id="layer1">
    <path
       style="fill:#77b6b7;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 30.570909,179.80387 c -6.19103,-4.01141 -8.91219,-5.14424 -12.36293,-5.14679 -2.86627,-0.002 -3.17816,-0.0993 -3.43871,-1.07152 -0.50143,-1.87106 -0.30522,-8.03452 0.41767,-13.12037 0.38487,-2.70775 0.57638,-5.12281 0.42558,-5.36682 -0.1508,-0.244 -0.0405,-0.7252 0.24509,-1.06932 0.2856,-0.34413 0.59178,-1.45742 0.68039,-2.47399 0.0886,-1.01656 0.26806,-2.16906 0.39878,-2.5611 0.13071,-0.39203 0.66932,-2.42352 1.19691,-4.5144 0.52758,-2.09087 1.04168,-4.12236 1.14245,-4.51439 0.10077,-0.39204 0.35431,-0.83897 0.56342,-0.99316 0.20912,-0.1542 0.415,-0.74226 0.45753,-1.3068 0.0425,-0.56454 0.21892,-1.02644 0.39199,-1.02644 0.17307,0 0.43423,-0.58806 0.58034,-1.3068 0.14612,-0.71875 0.83531,-2.58984 1.53155,-4.15801 0.69623,-1.56815 1.22667,-2.93421 1.17875,-3.03567 -0.0479,-0.10146 0.0966,-0.31529 0.32117,-0.4752 0.22456,-0.1599 1.13455,-1.68068 2.02219,-3.37952 0.88764,-1.69885 1.79137,-3.16008 2.00829,-3.24721 0.21691,-0.0871 0.39439,-0.46133 0.39439,-0.83159 0,-0.37027 0.21384,-0.67321 0.4752,-0.67321 0.26136,0 0.4752,-0.2281 0.4752,-0.5069 0,-0.54199 2.29041,-3.77534 3.08609,-4.35662 0.26285,-0.19202 0.30406,-0.3524 0.0916,-0.3564 -0.21248,-0.004 0.37373,-0.80918 1.30268,-1.78927 0.92895,-0.98011 1.69086,-1.94381 1.69312,-2.14158 0.006,-0.53476 9.90671,-10.31294 12.36853,-12.215628 1.17106,-0.90508 2.20048,-1.8139 2.2876,-2.0196 0.0871,-0.2057 0.36336,-0.37399 0.61387,-0.37399 0.2505,0 0.91437,-0.42754 1.47526,-0.95009 0.56089,-0.52254 1.62114,-1.21626 2.35613,-1.5416 0.73498,-0.32533 1.33634,-0.75316 1.33634,-0.95072 0,-0.19756 0.31013,-0.3592 0.68918,-0.3592 0.37906,0 0.8602,-0.26729 1.0692,-0.59399 0.3744,-0.58522 4.31913,-2.73629 5.01322,-2.73372 0.4489,0.002 0.4692,1.63091 0.0258,2.07427 -0.18181,0.18181 -0.39861,0.69858 -0.48179,1.1484 -0.0832,0.44981 -0.27948,1.45936 -0.43623,2.24345 -0.49551,2.47852 -0.52378,12.760098 -0.0399,14.493598 0.25536,0.91476 0.50447,1.98396 0.55356,2.37599 0.0491,0.39205 0.21794,1.03356 0.37519,1.42561 0.15726,0.39203 0.65102,1.88891 1.09726,3.3264 2.20168,7.09242 8.00019,15.00007 14.70642,20.05571 2.35224,1.77329 5.18562,3.57508 6.2964,4.00399 1.11078,0.4289 2.0196,0.92896 2.0196,1.11125 0,0.1823 0.2673,0.34958 0.594,0.37176 0.3267,0.0222 2.1978,0.63543 4.158,1.3628 3.25385,1.20739 4.25216,1.33892 11.471881,1.51138 6.81673,0.16284 8.43957,0.0545 11.76111,-0.78549 4.76063,-1.20387 10.92194,-4.04964 14.61032,-6.7482 3.4412,-2.51771 8.71173,-7.90495 10.6081,-10.84301 0.78078,-1.20967 1.58858,-2.41324 1.79511,-2.67459 0.69913,-0.88474 3.45109,-7.19894 3.45109,-7.91831 0,-0.39297 0.14874,-0.86324 0.33055,-1.04505 0.18181,-0.1818 0.40349,-0.69858 0.49263,-1.1484 0.20588,-1.03881 0.49808,-2.17436 0.63844,-2.48105 0.14828,-0.32399 0.20185,-0.69123 0.65853,-4.5144 0.52503,-4.3954 0.52662,-5.11731 0.0198,-9.028788 -0.23706,-1.82953 -0.45363,-3.64717 -0.48129,-4.0392 -0.0813,-1.15353 -0.73016,-3.49848 -1.21618,-4.3956 -0.24779,-0.45738 -0.30223,-0.8316 -0.12098,-0.8316 0.61013,0 7.04249,3.4539 7.20251,3.86744 0.0871,0.22515 0.36698,0.40935 0.62189,0.40935 0.2549,0 1.25282,0.60563 2.2176,1.34583 0.96477,0.7402 3.36495,2.55191 5.33372,4.02602 5.03678,3.771258 13.20755,12.219818 17.32395,17.912958 1.03937,1.43747 2.05381,2.68488 2.25431,2.772 0.2005,0.0871 0.36455,0.41275 0.36455,0.72363 0,0.31088 0.72178,1.66121 1.60396,3.00073 1.65262,2.50937 5.95663,10.7711 6.27047,12.03644 0.0972,0.39203 0.82442,2.49248 1.61598,4.66764 0.79155,2.17516 1.43919,4.24618 1.43919,4.60226 0,0.35608 0.24719,1.24941 0.5493,1.98516 0.30212,0.73576 0.5903,1.55157 0.64042,1.81293 0.0501,0.26136 0.14005,0.58212 0.19986,0.7128 0.63094,1.37866 1.92848,10.67418 2.24644,16.09345 l 0.31691,5.40143 -3.04566,-0.33652 c -2.26301,-0.25004 -3.47307,-0.67118 -4.70887,-1.63881 -7.44642,-5.83053 -6.69619,-5.47561 -15.444,-7.30614 -7.70802,-1.61293 -10.45941,-1.87139 -20.6712,-1.94176 -2.55327,-0.0176 -3.22013,0.13635 -8.90353,2.05542 -3.09288,1.04434 -5.30433,2.17475 -7.48802,3.82758 -1.70439,1.29005 -3.38288,2.23657 -3.72998,2.10337 -0.3471,-0.13319 -1.57505,0.078 -2.72878,0.46937 -5.24851,1.78028 -14.06412,2.15126 -15.19231,0.63932 -0.14532,-0.19475 -0.8403,-0.40177 -1.5444,-0.46004 -0.7041,-0.0583 -1.28018,-0.25986 -1.28018,-0.44798 0,-0.18811 -0.37422,-0.32298 -0.8316,-0.29971 -0.45738,0.0233 -2.33918,-0.42554 -4.18178,-0.99736 l -3.35018,-1.03966 -3.893551,0.90661 c -2.25286,0.52458 -5.94733,0.94158 -8.76741,0.9896 -6.2168,0.10585 -7.0204,0.3367 -14.67415,4.21536 -9.6854,4.90824 -9.08802,4.71074 -18.11072,5.98747 -3.06503,0.4337 -4.44055,0.8594 -5.25782,1.62718 -0.94884,0.89139 -1.65149,1.03983 -4.92222,1.03983 -2.64867,0 -4.67368,0.30236 -6.62217,0.98878 -1.54374,0.54382 -3.02064,1.03098 -3.282,1.08256 -0.26136,0.0516 -0.68904,0.21858 -0.9504,0.37112 -1.79436,1.04723 -3.0408,0.81959 -5.99564,-1.09496 z"
       id="path3328" />
    <path
       style="fill:#f5db72;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:1.79603"
       d="m 376.95161,542.48584 c -0.49086,-0.49086 -4.0782,-1.3716 -7.97187,-1.95719 -47.33149,-7.11856 -94.9364,-43.14589 -115.42312,-87.35204 -4.40661,-9.50859 -7.15865,-16.41083 -8.46515,-21.23104 -0.13387,-0.4939 -0.77036,-2.11033 -1.41441,-3.59206 -0.64405,-1.48172 -1.52446,-4.71458 -1.95646,-7.18412 -0.432,-2.46955 -0.97177,-4.89419 -1.1995,-5.3881 -2.16104,-4.68703 -2.92707,-47.3294 -1.06471,-59.26904 1.04327,-6.68839 2.55564,-13.47023 3.00391,-13.47023 0.14898,0 0.61138,-1.82848 1.02755,-4.06328 3.27461,-17.58441 23.78578,-52.45959 41.028,-69.75997 20.6681,-20.73783 56.19693,-39.52403 83.0172,-43.89613 23.5956,-3.84643 56.28085,-2.47771 73.39268,3.07336 14.01999,4.54809 38.41392,16.22498 47.26539,22.62501 22.47089,16.24751 42.72964,40.57571 53.82042,64.63153 3.07414,6.66776 5.12873,12.12321 4.56578,12.12321 -0.56297,0 -0.13255,1.0737 0.95662,2.386 1.08911,1.3123 2.34034,4.3431 2.78051,6.73512 0.44015,2.39201 0.9635,4.34911 1.16297,4.34911 0.19948,0 0.65124,1.61643 1.00392,3.59207 0.35269,1.97563 1.41368,7.63313 2.35778,12.57222 3.25613,17.03478 1.56282,56.65146 -2.87877,67.35118 -0.61507,1.48172 -1.4055,4.17112 -1.75652,5.97646 -0.351,1.80531 -3.59163,9.48335 -7.20138,17.06229 -3.60976,7.57893 -6.63607,14.20232 -6.72512,14.71863 -0.53816,3.11981 -18.555,26.04881 -27.39363,34.86226 -10.15345,10.12455 -32.46255,26.16209 -36.39291,26.16209 -1.0618,0 -1.93054,0.85592 -1.93054,1.90203 0,1.04612 -0.66325,1.49211 -1.47391,0.99109 -0.81066,-0.501 -3.97151,0.60794 -7.02412,2.46435 -5.5249,3.35989 -24.42752,9.47396 -36.40276,11.7745 -7.97107,1.53131 -47.51713,3.00142 -48.70785,1.81069 z"
       id="path6251"
       transform="scale(0.26458333)" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 66.11153,249.65078 c -0.51553,-0.3499 -2.11345,-1.25694 -3.55093,-2.01565 -3.25789,-1.71953 -7.61357,-4.47986 -9.83369,-6.23191 -1.40115,-1.10575 -12.77739,-14.50789 -17.31332,-20.39651 -0.68674,-0.89153 -1.83683,-2.20606 -2.55575,-2.92116 -0.71892,-0.7151 -1.86776,-2.04845 -2.55298,-2.963 -0.68522,-0.91455 -1.64188,-2.09067 -2.1259,-2.6136 -0.48403,-0.52293 -1.44509,-1.69923 -2.1357,-2.61399 -0.69061,-0.91476 -1.36379,-1.77012 -1.49596,-1.9008 -0.39207,-0.38765 -2.47019,-5.41393 -2.50502,-6.0588 -0.0177,-0.3267 -0.24592,-0.594 -0.50728,-0.594 -0.26136,0 -0.33189,-0.14331 -0.15674,-0.31846 0.17516,-0.17516 -0.008,-0.81668 -0.40695,-1.4256 -0.39898,-0.60893 -0.63552,-1.10714 -0.52564,-1.10714 0.10987,0 -0.28908,-1.44341 -0.88657,-3.2076 -1.21675,-3.59263 -1.05725,-4.66696 0.42854,-2.88651 0.54613,0.65443 4.34072,5.23362 8.43242,10.17599 4.09171,4.94237 7.83391,9.44056 8.31601,9.99597 0.48209,0.55542 4.19105,5.02077 8.24213,9.92301 4.05108,4.90224 9.18324,11.08632 11.4048,13.74241 2.22156,2.65608 4.89456,5.87199 5.94,7.14647 1.04544,1.27447 2.7027,3.25603 3.6828,4.40345 0.9801,1.14742 1.782,2.18013 1.782,2.29491 0,0.39597 -0.74172,0.20681 -1.67627,-0.42748 z"
       id="path8238" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 103.57473,257.65256 c -0.45525,-0.52272 -2.21674,-2.66112 -3.91441,-4.752 -1.69768,-2.09088 -3.30868,-4.03258 -3.58,-4.31489 -0.27133,-0.28232 -2.20404,-2.61534 -4.29492,-5.1845 -2.09088,-2.56916 -4.65696,-5.67505 -5.7024,-6.90196 -1.04544,-1.22692 -3.18384,-3.7915 -4.752,-5.69907 -1.56816,-1.90757 -3.17196,-3.81232 -3.564,-4.23277 -0.39204,-0.42046 -1.56816,-1.83114 -2.6136,-3.13484 -1.04544,-1.3037 -2.01066,-2.47729 -2.14494,-2.60797 -0.13427,-0.13068 -1.18916,-1.41372 -2.34419,-2.8512 -1.15503,-1.43748 -2.33307,-2.82744 -2.61787,-3.0888 -0.2848,-0.26136 -1.36831,-1.5444 -2.40781,-2.8512 -1.0395,-1.3068 -1.99691,-2.48291 -2.12759,-2.6136 -0.25522,-0.25522 -4.04709,-4.87646 -5.22589,-6.36892 -0.39276,-0.49727 -1.67639,-2.01022 -2.85251,-3.36211 -1.17612,-1.3519 -3.31452,-3.92057 -4.752,-5.70818 -2.68902,-3.34398 -4.71671,-5.76937 -8.71684,-10.42649 -1.2659,-1.47382 -2.19293,-2.96295 -2.06007,-3.30918 0.23994,-0.62527 3.7075,-1.71312 5.46066,-1.71312 0.55855,0 2.00553,1.3265 3.70997,3.40107 1.53685,1.87058 3.64964,4.40614 4.69508,5.63456 1.04544,1.22842 3.65506,4.34897 5.79916,6.93454 2.1441,2.58557 7.81086,9.38631 12.5928,15.11276 4.78194,5.72644 9.33596,11.21456 10.12004,12.19581 1.86641,2.33575 3.42641,4.21346 14.73658,17.73787 5.22424,6.24702 10.02066,12.0207 10.6587,12.8304 0.63805,0.80971 1.97455,2.37624 2.97,3.48118 0.99546,1.10494 1.80992,2.22962 1.80992,2.49928 0,0.30807 -1.4968,0.44448 -4.02707,0.36702 -3.33912,-0.10222 -4.16846,-0.28564 -4.8548,-1.07369 z"
       id="path8277" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 135.44098,251.39431 c -0.74656,-1.00108 -1.47679,-1.92707 -1.62275,-2.05775 -0.45584,-0.40812 -12.02013,-14.21044 -13.52083,-16.1375 -2.68629,-3.44947 -7.11212,-8.81039 -8.07052,-9.77564 -0.52705,-0.53083 -1.49288,-1.68736 -2.14628,-2.57005 -0.6534,-0.8827 -1.41458,-1.83835 -1.6915,-2.12366 -0.65182,-0.67156 -5.16026,-6.06426 -7.47826,-8.94501 -0.99228,-1.23319 -2.06148,-2.51505 -2.376,-2.84859 -0.31451,-0.33353 -1.42255,-1.67533 -2.4623,-2.98178 -1.03975,-1.30645 -2.75047,-3.3006 -3.8016,-4.43144 -1.05113,-1.13084 -1.99406,-2.28841 -2.0954,-2.57238 -0.17616,-0.49361 -1.83493,-2.49766 -3.4059,-4.11485 -0.40643,-0.41838 -1.47563,-1.71921 -2.376,-2.89073 -0.90038,-1.17152 -1.96539,-2.46215 -2.36671,-2.86807 -0.40132,-0.40592 -1.36361,-1.58581 -2.13841,-2.62197 -0.77479,-1.03616 -1.65718,-2.09777 -1.96084,-2.35912 -1.57362,-1.35439 -7.28167,-8.89331 -7.03531,-9.29192 0.37595,-0.6083 3.80524,-2.35049 4.62666,-2.35049 0.59393,0 4.07388,3.70237 6.28717,6.68902 0.91548,1.23536 6.37857,7.79839 18.50368,22.2292 3.15234,3.75178 6.37304,7.62935 7.15712,8.61682 2.18711,2.75446 4.85505,5.98577 9.0288,10.93536 4.05136,4.80447 6.57601,7.83682 9.2664,11.12987 4.90043,5.99816 7.50904,9.14477 12.02448,14.50445 2.74012,3.25243 4.87749,6.18597 4.7497,6.51898 -0.12778,0.33299 -0.37243,0.57768 -0.54366,0.54374 -0.17123,-0.0339 -0.90882,0.18496 -1.63908,0.48644 -3.07903,1.27112 -3.47602,1.21351 -4.91266,-0.71293 z"
       id="path8316" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 161.27524,237.79099 c -0.46187,-0.57598 -1.31722,-1.66085 -1.9008,-2.41083 -0.58357,-0.74998 -1.97838,-2.35378 -3.09956,-3.564 -1.12119,-1.21022 -2.39687,-2.78846 -2.83486,-3.5072 -0.43799,-0.71874 -0.93838,-1.3068 -1.11199,-1.3068 -0.17361,0 -1.17294,-1.12266 -2.22075,-2.4948 -1.04781,-1.37214 -2.30308,-2.92265 -2.78949,-3.44558 -0.48642,-0.52294 -1.4774,-1.74474 -2.20219,-2.71511 -0.72479,-0.97038 -1.97457,-2.46709 -2.77728,-3.32602 -0.80271,-0.85893 -2.28161,-2.63089 -3.28643,-3.93769 -1.00482,-1.3068 -2.42805,-3.07141 -3.16272,-3.92136 -0.73468,-0.84995 -1.97729,-2.32516 -2.76137,-3.27826 -0.78408,-0.95309 -1.75704,-2.07531 -2.16214,-2.49383 -0.4051,-0.41852 -2.21223,-2.57859 -4.01585,-4.80014 -1.80363,-2.22157 -4.14519,-5.02216 -5.20347,-6.22356 -1.05828,-1.20139 -3.3141,-3.97217 -5.01294,-6.15728 -2.65186,-3.41093 -4.55092,-5.68331 -8.91178,-10.66368 -2.08427,-2.38036 -7.24502,-8.74684 -7.24502,-8.9377 0,-0.68354 3.29867,-0.68617 5.75021,-0.005 l 2.84097,0.78986 8.65361,10.42939 c 4.75948,5.73617 12.60965,15.17385 17.44481,20.97262 4.83516,5.79877 9.64656,11.58518 10.692,12.85869 1.04544,1.27351 2.75616,3.31055 3.8016,4.52675 1.04543,1.21619 3.07692,3.67224 4.51439,5.45787 1.43749,1.78563 3.89817,4.76117 5.46819,6.61231 1.57002,1.85113 3.86938,4.5766 5.10968,6.05659 l 2.25509,2.69089 -2.20658,1.9423 c -1.21362,1.06828 -2.33685,1.93243 -2.49608,1.92034 -0.15922,-0.0121 -0.66738,-0.49322 -1.12925,-1.06919 z"
       id="path8355" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 178.50519,213.96791 c -1.42487,-1.74011 -3.83301,-4.68385 -5.35141,-6.54163 -1.5184,-1.85779 -3.48788,-4.23316 -4.37663,-5.2786 -0.88875,-1.04544 -2.14965,-2.62459 -2.80201,-3.50924 -0.65236,-0.88464 -1.56971,-1.96774 -2.03857,-2.40689 -0.46885,-0.43914 -1.38706,-1.49134 -2.04046,-2.33822 -0.6534,-0.84688 -1.67833,-2.11602 -2.27762,-2.82031 -0.59928,-0.70429 -1.56156,-1.88433 -2.1384,-2.6223 -0.57683,-0.73797 -1.58338,-1.94486 -2.23678,-2.68196 -0.6534,-0.73711 -1.86179,-2.16479 -2.68531,-3.17263 -0.82352,-1.00785 -1.97178,-2.36704 -2.55168,-3.02045 -1.40875,-1.58729 -8.44728,-10.14217 -10.08535,-12.2581 -0.71717,-0.92637 -1.73363,-2.08463 -2.2588,-2.57391 l -0.95486,-0.88959 1.08507,-1.08507 c 0.93241,-0.93241 3.59022,-2.20133 4.61077,-2.20133 0.17799,0 2.55178,2.70441 5.27509,6.0098 2.72331,3.30538 7.19788,8.70484 9.9435,11.9988 2.74562,3.29395 5.52554,6.65308 6.1776,7.46473 0.65206,0.81165 3.85857,4.65816 7.12557,8.54779 5.86824,6.98663 7.62073,9.10288 11.96076,14.44338 l 2.21916,2.73073 -1.51371,2.52084 c -0.83254,1.38646 -1.73455,2.59444 -2.00447,2.68442 -0.26992,0.09 -1.65657,-1.26014 -3.08146,-3.00026 z"
       id="path8394" />
    <path
       style="fill:#bad344;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 193.17346,186.63723 c -0.40641,-0.61685 -1.73996,-2.19074 -2.96345,-3.49755 -1.22347,-1.3068 -2.54027,-2.96406 -2.92621,-3.6828 -0.38593,-0.71873 -0.8738,-1.3068 -1.08414,-1.3068 -0.21034,0 -1.05201,-0.90882 -1.87036,-2.0196 -0.81836,-1.11078 -2.26547,-2.87496 -3.21581,-3.9204 -0.95034,-1.04543 -2.35696,-2.74645 -3.12583,-3.78004 -0.76887,-1.03358 -2.35743,-2.92085 -3.53014,-4.19393 -1.17271,-1.27309 -2.47189,-2.83313 -2.88706,-3.46676 -0.93608,-1.42865 -0.65704,-1.45903 3.95816,-0.43102 1.7804,0.39658 3.66895,0.81596 4.19679,0.93197 0.52783,0.11601 3.20083,2.92179 5.94,6.23507 2.73916,3.31327 6.00969,7.22415 7.26785,8.69083 l 2.28755,2.66669 -0.28923,3.46132 c -0.15907,1.90372 -0.45347,3.9053 -0.6542,4.44794 -0.36081,0.97535 -0.37342,0.97381 -1.10392,-0.13492 z"
       id="path8433" />
    <path
       style="fill:#08080b;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.4752"
       d="m 98.51407,258.30495 c -0.48099,-0.28053 -1.49673,-0.41874 -2.2572,-0.30712 -0.76047,0.11161 -1.38267,0.0511 -1.38267,-0.13454 0,-0.18562 -0.42511,-0.44865 -0.94468,-0.58452 -0.51958,-0.13587 -1.1558,-0.80233 -1.41384,-1.48102 -0.25804,-0.67869 -0.66332,-1.23399 -0.90062,-1.23399 -0.2373,0 -1.15142,-0.98012 -2.03136,-2.17806 -0.87995,-1.19794 -2.19777,-2.7389 -2.92849,-3.42436 -0.73072,-0.68547 -1.7918,-2.00412 -2.35794,-2.93034 -0.56614,-0.92622 -1.82397,-2.5394 -2.79517,-3.58484 -0.9712,-1.04544 -2.39619,-2.75616 -3.16666,-3.8016 -0.77046,-1.04544 -2.17584,-2.63773 -3.12305,-3.53842 -0.9472,-0.90069 -1.72219,-1.81135 -1.72219,-2.02371 0,-0.36382 -1.58903,-2.33036 -3.4452,-4.2637 -0.45738,-0.47639 -0.8316,-0.9803 -0.8316,-1.11978 0,-0.13949 -0.58806,-0.87811 -1.3068,-1.64138 -0.71874,-0.76327 -1.80503,-1.98564 -2.41397,-2.71638 -0.60894,-0.73074 -1.96791,-2.29091 -3.01993,-3.46703 -1.05202,-1.17612 -3.09233,-3.68873 -4.53401,-5.5836 -1.44169,-1.89486 -2.76307,-3.4452 -2.93641,-3.4452 -0.17334,0 -0.67137,-0.60299 -1.10672,-1.33999 -0.43536,-0.737 -1.50674,-2.12079 -2.38085,-3.0751 -2.78351,-3.03888 -3.68506,-4.13653 -3.69486,-4.49852 -0.005,-0.19403 -0.96753,-1.30418 -2.1384,-2.467 -1.17087,-1.16281 -2.12885,-2.34477 -2.12885,-2.62658 0,-0.2818 -0.58806,-1.07808 -1.3068,-1.7695 -2.02061,-1.94381 -2.97,-3.04011 -2.97,-3.42959 0,-0.19588 -0.697,-1.0333 -1.54889,-1.86093 -0.85188,-0.82763 -2.18838,-2.35298 -2.97,-3.38965 -0.78161,-1.03668 -2.43267,-2.96124 -3.66902,-4.2768 -2.57011,-2.73478 -3.06159,-4.21081 -0.88634,-2.66189 0.75909,0.54051 1.61445,0.98276 1.90081,0.98276 0.28635,0 0.52064,0.21383 0.52064,0.4752 0,0.26135 0.30294,0.47519 0.6732,0.47519 0.37026,0 0.78166,0.26731 0.91422,0.594 0.15615,0.38483 0.37927,0.42666 0.6336,0.11881 0.21592,-0.26137 0.82026,-0.55004 1.34298,-0.6415 0.52272,-0.0915 1.08794,-0.38789 1.25604,-0.65872 0.18319,-0.29513 0.65915,-0.0654 1.188,0.57335 0.4853,0.58617 1.73762,2.03642 2.78294,3.22278 1.04532,1.18637 2.24992,2.71391 2.67688,3.39455 0.42697,0.68065 1.76356,2.19088 2.97022,3.35607 1.20666,1.1652 2.19392,2.35622 2.19392,2.64671 0,0.29049 0.48114,0.97296 1.0692,1.5166 1.46757,1.35671 3.2076,3.46672 3.2076,3.88963 0,0.19202 0.48114,0.79393 1.0692,1.33757 1.42037,1.31308 3.40576,3.62402 3.42768,3.98972 0.01,0.16081 0.65904,0.94458 1.44312,1.74173 0.78408,0.79715 1.97644,2.05554 2.64969,2.79643 1.56805,1.72559 10.31249,12.55823 11.75075,14.55686 0.60216,0.83678 2.04558,2.49104 3.2076,3.67614 1.16201,1.18509 2.11276,2.39915 2.11276,2.69791 0,0.29875 0.48222,0.93292 1.0716,1.40927 0.58938,0.47635 1.48349,1.50761 1.98692,2.29169 0.50343,0.78408 1.73765,2.28096 2.7427,3.3264 2.95932,3.07825 3.22758,3.38937 3.22758,3.7433 0,0.18545 1.17491,1.55747 2.61093,3.04894 1.436,1.49147 2.61212,2.96694 2.6136,3.27882 10e-4,0.31188 0.38653,0.84648 0.8557,1.188 0.46917,0.34152 1.47627,1.4763 2.23798,2.52174 1.43368,1.96769 2.65271,3.41388 4.98129,5.90954 l 1.35859,1.45606 h -1.11258 c -0.61192,0 -1.39737,0.10117 -1.74545,0.22482 -0.34808,0.12365 -1.0264,-0.005 -1.50739,-0.28523 z"
       id="path10966" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.36014"
       d="m 80.06869,255.004 c -0.13276,-0.21481 -0.45761,-0.30759 -0.7219,-0.20618 -0.26428,0.10142 -0.5315,0.071 -0.59381,-0.0677 -0.0623,-0.13863 -0.92362,-0.52594 -1.914,-0.86069 -6.69421,-2.26265 -6.7925,-2.31989 -9.24748,-5.38561 -0.86911,-1.08534 -3.70226,-4.50978 -6.95534,-8.40695 -0.66135,-0.79231 -5.44346,-6.54553 -10.62689,-12.78494 -5.18343,-6.23942 -10.18069,-12.2207 -11.10501,-13.29173 -0.92433,-1.07104 -1.92369,-2.29176 -2.2208,-2.71271 -0.29712,-0.42095 -0.88719,-1.16527 -1.31126,-1.65405 -1.20367,-1.3873 -7.127,-8.4806 -11.29361,-13.52432 -2.07981,-2.51762 -3.9543,-4.7561 -4.16553,-4.97441 -1.51413,-1.5648 -2.67712,-3.69026 -2.67712,-4.89267 0,-0.72957 -0.10921,-1.43571 -0.2427,-1.56919 -0.29005,-0.29005 -0.50845,-1.75363 -0.51512,-3.45198 -0.003,-0.67855 -0.15661,-1.51731 -0.34211,-1.86391 -0.18549,-0.3466 -0.2098,-0.97474 -0.054,-1.39587 0.26456,-0.71517 0.36454,-0.66348 1.51557,0.78349 0.67778,0.85205 1.35988,1.6032 1.51577,1.66923 0.15589,0.066 0.28344,0.26385 0.28344,0.43961 0,0.17577 0.72653,1.09412 1.61452,2.04079 0.88799,0.94667 1.61727,1.85323 1.62063,2.01457 0.003,0.16135 0.49913,0.70822 1.10173,1.21527 0.60259,0.50705 1.02447,0.99307 0.9375,1.08004 -0.087,0.087 0.47784,0.83659 1.25513,1.66584 0.77729,0.82925 1.73295,1.84891 2.12368,2.26591 0.39073,0.417 0.71043,0.93019 0.71043,1.14044 0,0.21024 0.12154,0.43628 0.2701,0.5023 0.48994,0.21776 4.41171,4.87414 4.41171,5.23811 0,0.196 0.48618,0.72897 1.08041,1.18438 0.59423,0.4554 1.08042,0.97129 1.08042,1.14642 0,0.17513 0.49177,0.79914 1.09283,1.38669 0.60106,0.58755 1.01536,1.06828 0.92065,1.06828 -0.0947,0 0.31945,0.5267 0.92034,1.17045 0.60088,0.64375 1.36072,1.57561 1.68854,2.0708 0.32781,0.49519 0.96148,1.19572 1.40815,1.55673 0.44668,0.36101 0.81214,0.80668 0.81214,0.99038 0,0.1837 0.2836,0.63271 0.63024,0.99779 0.34663,0.36508 1.19746,1.37065 1.89073,2.23459 0.69327,0.86394 1.58461,1.92613 1.98076,2.36041 1.07919,1.18307 1.96257,2.22556 4.24129,5.00518 1.13667,1.38654 2.43007,2.94128 2.87422,3.45499 0.44416,0.5137 1.37478,1.63271 2.06804,2.48669 0.69327,0.85398 1.79999,2.13533 2.45938,2.84745 0.65938,0.71213 1.61277,1.90251 2.11865,2.64529 0.50588,0.74279 1.0603,1.35053 1.23206,1.35053 0.17175,0 0.31228,0.22575 0.31228,0.50167 0,0.27593 0.2431,0.59496 0.54021,0.70898 0.29711,0.11401 0.54021,0.45547 0.54021,0.75881 0,0.30333 0.14804,0.55151 0.32897,0.55151 0.18093,0 1.16018,1.01289 2.17609,2.25087 2.36085,2.87688 3.90809,4.73638 5.12592,6.16043 0.53263,0.62281 1.55088,1.86167 2.26279,2.75302 1.61088,2.01689 2.60937,3.21468 6.65585,7.98437 0.61675,0.72698 0.96507,1.4184 0.77403,1.53646 -0.19103,0.11807 -0.45596,0.0389 -0.58872,-0.17589 z"
       id="path15556" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="M 93.17239,233.73657 C 67.07097,202.37761 53.81198,186.41943 50.06736,181.85643 l -2.96117,-3.60833 h 2.57176 c 1.75243,0 2.74522,-0.20901 3.11623,-0.65606 0.82289,-0.99151 1.47909,-0.80039 2.62803,0.7654 1.75314,2.38922 15.07163,18.49752 17.80999,21.54063 0.64939,0.72167 1.38456,1.64038 1.63371,2.04158 0.51231,0.82498 17.2368,20.80298 18.33173,21.8979 0.39029,0.3903 0.70963,0.90622 0.70963,1.1465 0,0.24028 0.49204,0.82391 1.09343,1.29696 0.60139,0.47306 1.09343,0.98796 1.09343,1.14423 0,0.15628 0.6643,1.01363 1.47621,1.90524 0.81192,0.8916 3.40382,3.98291 5.7598,6.86957 2.35597,2.88667 6.02167,7.2595 8.146,9.71742 2.12433,2.45791 3.86242,4.65782 3.86242,4.8887 0,0.23087 0.49204,0.80681 1.09343,1.27986 0.60139,0.47306 1.09343,0.98699 1.09343,1.14208 0,0.15509 0.78836,1.10242 1.7519,2.10519 2.06827,2.15245 1.92008,2.31742 -2.47026,2.75004 l -3.11436,0.30687 z"
       id="path15595" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 139.39408,245.29673 c -2.28527,-2.81206 -7.7982,-9.45352 -12.25095,-14.75879 -4.45275,-5.30528 -9.85256,-11.81095 -11.99958,-14.45705 -2.14702,-2.64611 -5.98863,-7.27134 -8.53692,-10.27828 -2.54828,-3.00694 -7.87505,-9.40187 -11.83726,-14.21096 -3.96221,-4.80908 -9.61504,-11.59639 -12.56184,-15.0829 -2.9468,-3.4865 -5.35782,-6.44739 -5.35782,-6.57973 0,-0.13235 1.25584,-0.85992 2.79075,-1.61682 l 2.79075,-1.37618 2.20324,2.70377 c 1.21179,1.48708 2.56379,3.09922 3.00445,3.58255 1.49298,1.63752 3.42086,3.97389 4.51887,5.47635 0.60139,0.8229 1.53628,1.95279 2.07753,2.51086 0.54125,0.55807 0.98409,1.13025 0.98409,1.27152 0,0.14126 0.36198,0.57516 0.8044,0.96421 0.44243,0.38905 2.15213,2.38031 3.79936,4.42503 1.64722,2.04472 4.7377,5.78426 6.86774,8.31009 2.13003,2.52583 4.40588,5.2407 5.05745,6.03305 2.05652,2.50086 3.5335,4.21503 4.45117,5.166 0.4887,0.50642 0.88854,1.14608 0.88854,1.42146 0,0.27538 0.16498,0.50069 0.36661,0.50069 0.20164,0 1.55345,1.52534 3.00401,3.38964 2.8483,3.66071 11.30116,13.74398 12.77976,15.24475 0.49895,0.50643 0.90717,1.05431 0.90717,1.21752 0,0.26662 0.74765,1.12753 3.50067,4.03096 0.48018,0.50643 0.87307,1.12968 0.87307,1.38502 0,0.25533 0.18724,0.52984 0.4161,0.61003 0.22885,0.0802 2.67242,2.90124 5.43014,6.26901 l 5.01405,6.12323 -2.69657,1.40024 c -1.4831,0.77013 -2.79497,1.40864 -2.91524,1.41891 -0.12028,0.0103 -2.08846,-2.28211 -4.37374,-5.09418 z"
       id="path15634" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 163.76756,229.96748 c -2.01661,-2.34541 -5.41223,-6.42938 -7.54583,-9.07549 -2.1336,-2.64611 -6.95015,-8.45224 -10.70345,-12.90251 -3.7533,-4.45027 -8.81292,-10.55163 -11.24361,-13.55857 -3.46404,-4.28528 -11.50124,-13.90772 -16.42327,-19.66255 -1.86584,-2.18153 -6.83093,-8.53077 -6.74122,-8.62049 0.0594,-0.0594 1.67476,0.37541 3.58966,0.96626 1.9149,0.59084 4.10364,1.07429 4.86386,1.07433 1.19298,5e-5 1.79177,0.48727 4.37373,3.55874 1.64533,1.95728 3.37797,4.07307 3.8503,4.70176 0.47234,0.6287 1.11199,1.30047 1.42146,1.49284 0.30948,0.19238 0.56268,0.5885 0.56268,0.88028 0,0.29179 0.49205,0.90003 1.09343,1.35165 0.60139,0.45163 1.09344,1.08426 1.09344,1.40585 0,0.32159 0.49204,0.90712 1.09343,1.30116 0.60139,0.39404 1.09343,0.94232 1.09343,1.21839 0,0.27607 0.49205,0.87146 1.09344,1.32308 0.60139,0.45163 1.09343,1.00654 1.09343,1.23315 0,0.22661 0.76956,1.23233 1.71013,2.23495 2.14714,2.28876 13.16056,15.51674 13.16056,15.80686 0,0.11813 0.70224,0.9379 1.56054,1.82171 0.8583,0.88382 2.08841,2.31433 2.73358,3.17892 0.64517,0.86459 1.39369,1.7688 1.66336,2.00935 0.26968,0.24056 2.89253,3.38964 5.82856,6.99797 2.93603,3.60833 5.76474,7.05265 6.28603,7.65403 0.52128,0.60139 1.42065,1.648 1.99858,2.32579 l 1.0508,1.23235 -2.12485,2.1573 c -1.16867,1.1865 -2.26903,2.15728 -2.44524,2.15728 -0.17622,0 -1.97035,-1.91897 -3.98696,-4.26439 z"
       id="path15673" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 183.08112,207.99194 c -1.32312,-1.51353 -3.67284,-4.32641 -5.22161,-6.25085 -1.54877,-1.92444 -6.26536,-7.61948 -10.48131,-12.65563 -4.21596,-5.03616 -10.25326,-12.31842 -13.41623,-16.18281 -3.16296,-3.86439 -6.8682,-8.35469 -8.23387,-9.97844 -2.25076,-2.67611 -2.38771,-3.13905 -0.86291,-2.91707 0.13296,0.0194 0.72897,-0.28405 1.32447,-0.67424 0.5955,-0.39019 1.26039,-0.59963 1.47753,-0.46543 0.21714,0.1342 0.51842,0.044 0.66952,-0.20051 0.56611,-0.91599 1.51339,-0.37723 3.25573,1.8517 1.99927,2.55763 3.27568,4.08426 5.57671,6.66994 0.85629,0.96222 2.27096,2.63403 3.14371,3.71514 2.84677,3.52637 14.93072,18.10001 16.81069,20.27424 1.00853,1.16639 2.01726,2.44328 2.24162,2.83752 0.22436,0.39423 0.75095,1.01446 1.17021,1.37826 1.0438,0.90576 7.83053,9.22902 7.80417,9.57104 -0.0117,0.1514 -0.65832,1.51361 -1.43699,3.02714 l -1.41577,2.75186 z"
       id="path15712" />
    <path
       style="fill:#d6623a;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 190.19075,171.03389 c -2.94687,-3.54313 -5.29443,-6.50558 -5.21678,-6.58322 0.0777,-0.0777 1.39095,0.83001 2.91846,2.01702 1.5275,1.18701 3.09854,2.1809 3.4912,2.20865 0.39266,0.0277 0.91074,0.0962 1.1513,0.15207 0.24056,0.0559 1.15178,0.13159 2.02495,0.16823 l 1.58758,0.0666 0.20378,2.73359 c 0.11207,1.50347 -0.0226,3.39632 -0.29938,4.20633 l -0.50315,1.47275 z"
       id="path15751" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 190.15463,194.63794 c -0.49523,-0.66382 -1.26654,-1.60058 -1.71402,-2.08169 -0.69056,-0.74245 -3.1817,-3.69994 -6.85276,-8.1356 -0.4776,-0.57708 -3.28012,-4.00151 -6.22782,-7.60984 -2.9477,-3.60832 -5.71923,-6.95423 -6.15896,-7.43534 -2.80471,-3.06864 -7.95744,-9.38898 -7.95744,-9.76061 0,-0.24462 -0.24603,-0.54404 -0.54672,-0.66537 -0.5966,-0.24073 3.11443,-0.4833 3.82702,-0.25015 0.24055,0.0787 1.24118,0.17438 2.22361,0.21261 1.80817,0.0703 3.68092,1.21028 3.68092,2.24055 0,0.30182 0.49205,0.87117 1.09344,1.26522 0.60139,0.39404 1.09343,0.94232 1.09343,1.21839 0,0.27607 0.49204,0.87146 1.09343,1.32308 0.60139,0.45163 1.09344,0.99702 1.09344,1.21199 0,0.21496 0.54125,0.94507 1.20277,1.62245 0.66153,0.67739 1.79323,1.92589 2.5149,2.77444 0.72167,0.84856 2.17218,2.54441 3.22337,3.76856 1.05119,1.22414 2.52732,3.064 3.2803,4.08857 0.75298,1.02457 2.10466,2.65502 3.00374,3.62322 0.89909,0.9682 1.63716,1.89802 1.64015,2.06625 0.003,0.16824 0.86677,1.21769 1.91948,2.33211 1.71296,1.81337 1.87927,2.17176 1.58319,3.41178 -0.90931,3.8083 -1.45024,5.57545 -1.76649,5.77091 -0.19171,0.11848 -0.75375,-0.32771 -1.24898,-0.99153 z"
       id="path19142" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 174.54527,219.68921 c -1.40879,-1.74402 -4.87723,-5.9264 -7.70764,-9.29418 -2.8304,-3.36777 -5.68549,-6.78496 -6.34463,-7.59376 -0.65914,-0.8088 -1.50624,-1.79289 -1.88244,-2.18687 -0.3762,-0.39398 -1.94221,-2.29087 -3.48003,-4.21531 -2.78847,-3.48952 -7.99126,-9.76485 -10.91454,-13.16454 -1.68277,-1.95701 -3.80287,-4.50571 -5.35879,-6.44212 -0.54666,-0.68034 -1.30172,-1.56602 -1.67792,-1.96818 -0.3762,-0.40216 -1.91987,-2.26349 -3.43037,-4.13629 -2.19904,-2.72649 -2.64471,-3.52759 -2.23629,-4.01971 0.28054,-0.33803 0.75354,-0.52118 1.05112,-0.40698 0.29758,0.11419 1.23255,-0.26165 2.07772,-0.8352 l 1.53668,-1.04282 1.1706,1.00691 c 0.64383,0.5538 1.1706,1.19676 1.1706,1.42881 0,0.23205 0.15791,0.48751 0.35092,0.5677 0.19301,0.0802 2.05783,2.21238 4.14404,4.73821 3.67463,4.44898 5.23088,6.30043 6.93562,8.25121 0.44872,0.51349 0.81749,1.08124 0.81947,1.26165 0.002,0.18042 0.98607,1.3767 2.18686,2.65841 1.2008,1.2817 2.18327,2.50592 2.18327,2.72048 0,0.21457 0.58272,0.82095 1.29494,1.34752 0.71222,0.52656 1.19879,1.11297 1.08127,1.30312 -0.11752,0.19016 0.38226,0.78632 1.11061,1.32482 0.72836,0.5385 1.32428,1.2209 1.32428,1.51645 0,0.29554 0.1672,0.60296 0.37156,0.68315 0.52695,0.20676 7.93854,9.02578 7.93854,9.44603 0,0.19115 0.39363,0.63126 0.87474,0.97803 0.48111,0.34676 0.87475,0.81174 0.87475,1.03329 0,0.22155 0.54125,0.96072 1.20277,1.64261 0.66153,0.6819 1.69483,1.83604 2.29621,2.56476 0.60139,0.72873 1.58548,1.85763 2.18687,2.50866 0.60139,0.65103 1.0458,1.33404 0.98759,1.51779 -0.0582,0.18375 0.48304,0.76947 1.20278,1.30159 0.71974,0.53213 1.30861,1.179 1.30861,1.4375 0,0.2585 0.48647,0.83532 1.08103,1.28181 0.86621,0.6505 0.99351,0.97532 0.64067,1.63462 -0.24219,0.45254 -0.35446,0.8228 -0.24948,0.8228 0.10497,0 -0.38014,0.61127 -1.07805,1.35838 -0.6979,0.7471 -1.26891,1.53437 -1.26891,1.74949 0,1.14213 -1.49798,0.0391 -3.77503,-2.77984 z"
       id="path19181" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 150.96678,236.59035 c -2.87693,-3.51189 -5.77203,-6.92747 -6.43356,-7.59017 -0.66153,-0.66271 -1.20278,-1.41535 -1.20278,-1.67254 0,-0.25719 -0.48537,-0.84942 -1.0786,-1.31605 -0.59323,-0.46664 -0.97855,-0.94848 -0.85627,-1.07075 0.12227,-0.12228 -0.42565,-0.76756 -1.21761,-1.43396 -0.79196,-0.66639 -1.43994,-1.34453 -1.43994,-1.50698 0,-0.16244 -0.61768,-0.97022 -1.37262,-1.79506 -0.75494,-0.82485 -4.03394,-4.74721 -7.28667,-8.71637 -3.25273,-3.96917 -6.473,-7.79941 -7.15616,-8.51166 -0.68316,-0.71225 -1.19667,-1.439 -1.14114,-1.615 0.0555,-0.176 -0.38732,-0.70408 -0.98409,-1.1735 -0.59678,-0.46943 -1.08505,-1.05691 -1.08505,-1.30553 0,-0.24861 -0.54125,-0.87777 -1.20278,-1.39813 -0.66153,-0.52035 -1.20278,-1.08988 -1.20278,-1.26561 0,-0.17573 -0.62173,-0.99438 -1.38162,-1.81922 -2.78666,-3.02485 -12.6314,-14.95561 -13.18878,-15.98338 -0.31596,-0.58261 -1.05233,-1.37239 -1.6364,-1.75508 -0.58406,-0.3827 -0.96333,-0.85534 -0.84283,-1.05032 0.1205,-0.19498 -0.26814,-0.73778 -0.86367,-1.20621 -0.59552,-0.46844 -0.98272,-0.95176 -0.86044,-1.07404 0.12228,-0.12228 -0.37644,-0.72615 -1.10826,-1.34194 -0.73183,-0.61579 -1.33455,-1.27994 -1.33938,-1.47589 -0.005,-0.19594 -0.89052,-1.23193 -1.96818,-2.30218 -1.07767,-1.07025 -1.9594,-2.13108 -1.9594,-2.3574 0,-0.23728 1.01841,-0.30637 2.40556,-0.16321 1.45834,0.15052 2.40555,0.0783 2.40555,-0.18331 0,-0.23737 0.20544,-0.30461 0.45653,-0.14943 0.2511,0.15519 0.7479,0.0404 1.10401,-0.2552 0.3561,-0.29554 0.70375,-0.4601 0.77255,-0.36568 0.0688,0.0944 2.22903,2.6786 4.80053,5.74263 2.5715,3.06403 4.67546,5.75278 4.67546,5.975 0,0.22222 0.57954,0.89169 1.28786,1.48771 0.70833,0.59602 1.20836,1.16318 1.11118,1.26036 -0.0972,0.0972 0.84862,1.28721 2.10178,2.64451 1.25315,1.35729 2.30702,2.5978 2.34193,2.75667 0.0349,0.15888 1.15062,1.50017 2.47937,2.98065 1.32875,1.48048 4.18348,4.85678 6.34385,7.50289 2.16036,2.64611 4.43976,5.36472 5.06531,6.04137 0.62556,0.67665 1.13738,1.41018 1.13738,1.63007 0,0.21989 0.49035,0.72109 1.08968,1.11378 0.59932,0.3927 1.00558,0.85006 0.90279,1.01637 -0.10278,0.1663 0.82161,1.37489 2.05421,2.68574 1.2326,1.31085 2.25327,2.51034 2.26816,2.66554 0.0149,0.15521 1.13965,1.53293 2.49948,3.06162 1.35982,1.52868 4.24311,4.94442 6.40731,7.59053 2.16419,2.64611 4.44672,5.36472 5.07228,6.04137 0.62556,0.67665 1.13737,1.40043 1.13737,1.60841 0,0.20797 0.48538,0.75993 1.07861,1.22656 0.59323,0.46664 0.97855,0.94848 0.85627,1.07076 -0.12228,0.12228 0.37644,0.72615 1.10827,1.34195 0.73182,0.61579 1.33059,1.31485 1.33059,1.55348 0,0.23863 0.49204,0.8209 1.09343,1.29396 0.60139,0.47305 1.09343,1.0026 1.09343,1.17678 0,0.17418 0.59046,0.98918 1.31212,1.81111 1.433,1.63209 1.6452,2.33873 0.70232,2.33873 -0.33539,0 -1.19652,0.54125 -1.91361,1.20277 -0.7171,0.66153 -1.58235,1.25114 -1.92279,1.31025 -0.34047,0.0591 -2.97262,-2.76563 -5.84976,-6.27777 z"
       id="path19220" />
    <path
       style="fill:#08080c;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 128.78503,254.35315 c -0.53974,-0.66607 -1.47338,-1.84811 -2.07477,-2.62675 -0.60139,-0.77864 -1.58548,-1.92462 -2.18687,-2.54661 -0.60139,-0.622 -1.09343,-1.28358 -1.09343,-1.47018 0,-0.1866 -0.43423,-0.786 -0.96496,-1.332 -0.53072,-0.546 -1.56402,-1.60448 -2.29621,-2.35219 -0.73219,-0.74771 -1.33125,-1.57302 -1.33125,-1.83404 0,-0.26101 -0.34793,-0.73174 -0.77318,-1.04608 -0.42526,-0.31433 -2.87844,-3.14247 -5.45152,-6.28476 -2.57308,-3.14228 -5.07436,-6.07165 -5.55841,-6.50971 -0.48405,-0.43806 -0.78084,-0.95704 -0.65955,-1.1533 0.12129,-0.19625 -0.37539,-0.79742 -1.10375,-1.33591 -0.72835,-0.5385 -1.32428,-1.23277 -1.32428,-1.54282 0,-0.31004 -0.49204,-0.88612 -1.09343,-1.28016 -0.60139,-0.39405 -1.09343,-0.9845 -1.09343,-1.31213 0,-0.32761 -0.49205,-0.91807 -1.09344,-1.31211 -0.60139,-0.39405 -1.09343,-0.9845 -1.09343,-1.31212 0,-0.32762 -0.49205,-0.91808 -1.09344,-1.31212 -0.60138,-0.39405 -1.09343,-0.91092 -1.09343,-1.14861 0,-0.23769 -0.68255,-1.14994 -1.51679,-2.02722 -1.83329,-1.92787 -10.33415,-12.11049 -10.94834,-13.11428 -0.24056,-0.39315 -0.88022,-1.11751 -1.42147,-1.60969 -0.54125,-0.49218 -0.98409,-1.1301 -0.98409,-1.41759 0,-0.28749 -0.49204,-0.84511 -1.09343,-1.23915 -0.60139,-0.39405 -1.09343,-0.94232 -1.09343,-1.2184 0,-0.27607 -0.49205,-0.87145 -1.09344,-1.32308 -0.60138,-0.45162 -1.09343,-1.08425 -1.09343,-1.40584 0,-0.3216 -0.49204,-0.90712 -1.09343,-1.30116 -0.60139,-0.39405 -1.09343,-0.87577 -1.09343,-1.07051 0,-0.19473 -0.76968,-1.20539 -1.7104,-2.2459 -0.94071,-1.04052 -3.39625,-3.95844 -5.45673,-6.48427 -2.06049,-2.52583 -4.14467,-4.99298 -4.63152,-5.48255 -1.2169,-1.22371 -1.14217,-1.36253 0.91023,-1.69072 0.98747,-0.1579 2.40712,-0.60343 3.15478,-0.99006 1.27755,-0.66064 1.38668,-0.65394 1.81292,0.11135 0.24945,0.44787 1.12273,1.5079 1.94062,2.35562 0.81789,0.84772 1.47119,1.63972 1.45177,1.76 -0.0194,0.12028 1.01049,1.39959 2.28867,2.84293 1.27818,1.44333 4.99235,5.87173 8.2537,9.8409 3.26135,3.96916 6.43351,7.73029 7.04925,8.35806 0.61573,0.62777 1.11951,1.34834 1.11951,1.60127 0,0.25292 0.59672,0.96196 1.32603,1.57564 0.72932,0.61368 1.34412,1.27084 1.36623,1.46035 0.0221,0.18951 1.07734,1.52547 2.34498,2.9688 1.26763,1.44333 4.95893,5.87173 8.20288,9.84089 3.24395,3.96917 6.46324,7.78449 7.15398,8.4785 0.69073,0.69401 1.21123,1.41841 1.15666,1.60978 -0.0546,0.19138 0.47576,0.83177 1.17852,1.42311 0.70276,0.59133 1.17989,1.17301 1.06028,1.29262 -0.11961,0.11961 0.28494,0.61266 0.899,1.09568 0.61406,0.48301 1.11646,0.96593 1.11646,1.07314 0,0.10722 0.66811,0.96457 1.48468,1.90524 1.63544,1.88396 10.56994,12.65854 12.43072,14.99084 0.64569,0.8093 1.73604,2.03941 2.42301,2.73358 0.68697,0.69416 1.10571,1.26212 0.93054,1.26212 -0.17517,0 -0.0988,0.26469 0.16968,0.58821 0.39287,0.47338 -0.10951,0.76256 -2.57345,1.48132 l -3.06161,0.89312 z"
       id="path19259" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 91.18423,257.60544 c -0.13452,-0.13452 -0.86408,-0.32299 -1.62124,-0.41882 -0.75716,-0.0958 -2.5522,-0.4055 -3.98898,-0.68816 -2.88846,-0.56827 -2.33982,-0.0708 -8.7243,-7.91149 -0.60139,-0.73856 -1.51516,-1.7982 -2.0306,-2.35476 -0.51544,-0.55655 -2.48362,-2.93705 -4.37373,-5.28999 -1.89011,-2.35294 -5.34903,-6.54749 -7.68648,-9.32123 -2.33746,-2.77373 -4.69927,-5.59465 -5.24848,-6.26871 -0.54921,-0.67406 -1.4414,-1.7163 -1.98265,-2.31609 -0.54125,-0.59979 -0.98409,-1.26724 -0.98409,-1.48322 0,-0.21598 -0.3664,-0.64988 -0.81422,-0.96421 -0.44782,-0.31433 -2.64153,-2.83492 -4.87491,-5.60131 -2.23338,-2.76639 -5.26209,-6.4319 -6.73047,-8.14559 -1.46838,-1.71369 -3.16182,-3.75606 -3.76321,-4.5386 -0.60139,-0.78253 -1.58548,-1.98593 -2.18687,-2.67421 -0.60139,-0.68828 -1.58548,-1.8499 -2.18686,-2.58137 -0.60139,-0.73147 -1.46369,-1.74371 -1.91621,-2.24942 -0.45253,-0.50571 -2.11304,-2.5174 -3.69002,-4.47043 -2.93982,-3.64085 -9.95406,-11.99795 -11.47527,-13.67218 -0.46794,-0.51502 -0.85081,-1.13828 -0.85081,-1.38502 0,-0.24674 -0.24602,-0.55532 -0.54671,-0.68573 -0.3007,-0.13041 1.22464,-0.12048 3.38964,0.0221 4.34786,0.28629 5.75059,0.80163 7.02094,2.57939 0.92829,1.29906 1.38496,1.85607 5.53202,6.74759 7.85079,9.26013 13.79454,16.45585 14.67989,17.77201 0.54475,0.80983 1.17115,1.47241 1.39199,1.47241 0.22084,0 0.51496,0.34444 0.6536,0.76541 0.13864,0.42097 1.18519,1.78841 2.32568,3.03877 1.14049,1.25035 2.698,3.02171 3.46114,3.93636 1.87244,2.24417 12.96875,15.7244 14.46994,17.57864 0.66005,0.81528 1.49532,1.80743 1.85615,2.20477 0.36084,0.39735 1.42661,1.69848 2.36839,2.8914 0.94178,1.19293 1.93487,2.36578 2.20687,2.60633 0.272,0.24056 1.86002,2.11033 3.52894,4.15505 2.60945,3.19703 4.53934,5.53117 9.00608,10.89252 0.48188,0.57839 1.69785,2.10373 2.70216,3.38964 1.00431,1.28591 1.97622,2.33802 2.15981,2.33802 0.18358,0 0.33379,0.19682 0.33379,0.43737 0,0.46558 -1.00131,0.6024 -1.41092,0.19279 z"
       id="path22728" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 120.52572,255.57575 c -0.80822,-1.02595 -1.81392,-2.26247 -2.2349,-2.74781 -0.42097,-0.48535 -1.08644,-1.2527 -1.47883,-1.70523 -0.39239,-0.45253 -2.00302,-2.42071 -3.57918,-4.37373 -1.57616,-1.95303 -5.24068,-6.36151 -8.14338,-9.79663 -2.90269,-3.43513 -5.84199,-7.0421 -6.53176,-8.0155 -0.68979,-0.97341 -1.52626,-1.87425 -1.85884,-2.00187 -0.33258,-0.12762 -0.6047,-0.49643 -0.6047,-0.81957 0,-0.32315 -0.27144,-0.74493 -0.60319,-0.9373 -0.33176,-0.19237 -2.43182,-2.61317 -4.66681,-5.37955 -2.23498,-2.76639 -6.29323,-7.68684 -9.01833,-10.93433 -2.7251,-3.2475 -5.49628,-6.55885 -6.15818,-7.35856 -0.66191,-0.79971 -1.51308,-1.78379 -1.8915,-2.18686 -0.37842,-0.40307 -2.34646,-2.79944 -4.37342,-5.32527 -3.2485,-4.04801 -9.82142,-11.95075 -12.82867,-15.42413 -2.15672,-2.49103 -2.02502,-2.63784 2.83803,-3.1637 l 2.44283,-0.26416 2.07222,2.53737 c 1.13972,1.39555 2.59908,3.1921 3.24302,3.99235 0.64394,0.80024 2.10042,2.47319 3.23661,3.71767 1.13619,1.24447 2.07107,2.40233 2.07752,2.57302 0.006,0.17068 0.47317,0.76113 1.03717,1.31212 0.56399,0.55098 2.61302,2.96996 4.55339,5.37552 3.43092,4.25344 11.30836,13.76874 12.49206,15.08937 0.6524,0.72788 2.27812,2.68169 18.01448,21.64998 5.98704,7.21666 12.91342,15.54745 15.39196,18.51288 2.47854,2.96543 4.50643,5.55931 4.50643,5.76419 0,0.20487 -1.1317,0.59682 -2.51489,0.871 -1.3832,0.27418 -2.83772,0.58976 -3.23228,0.7013 -0.46438,0.13127 -1.23562,-0.45506 -2.18686,-1.66257 z"
       id="path22767" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="M 132.14105,225.38048 C 98.68993,185.11777 92.80599,178.03416 88.32487,172.63072 c -2.46245,-2.96928 -4.47719,-5.65447 -4.47719,-5.96709 0,-0.82592 1.03034,-1.09935 4.14252,-1.09935 h 2.75886 l 4.96875,6.00855 c 7.5503,9.13036 23.21949,27.97201 32.97665,39.65326 4.80229,5.74929 11.07996,13.32678 13.95037,16.83886 2.87041,3.51208 6.93526,8.43671 9.03301,10.9436 2.09776,2.50689 3.71418,4.81837 3.59206,5.13662 -0.12213,0.31825 -0.39963,0.46888 -0.61668,0.33474 -0.21704,-0.13414 -0.51227,0.0627 -0.65605,0.43737 -0.14379,0.3747 -0.40782,0.5908 -0.58674,0.48022 -0.17892,-0.11057 -0.69954,0.13658 -1.15695,0.54923 -0.4574,0.41265 -1.14323,0.80057 -1.52407,0.86204 -0.44559,0.0719 -7.07186,-7.56671 -18.58836,-21.42829 z"
       id="path22806" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 171.47698,227.52825 c -0.68645,-0.80033 -1.83854,-2.20436 -2.5602,-3.12006 -0.72167,-0.91571 -1.65656,-1.97759 -2.07753,-2.35973 -0.42097,-0.38215 -0.7654,-0.85453 -0.7654,-1.04972 0,-0.19521 -0.54125,-0.90037 -1.20278,-1.56703 -0.66152,-0.66666 -1.79323,-1.95924 -2.51489,-2.87241 -0.72167,-0.91317 -1.53397,-1.89741 -1.80512,-2.18718 -0.27115,-0.28978 -2.59479,-3.07453 -5.16365,-6.18834 -2.56886,-3.1138 -5.4961,-6.62042 -6.50498,-7.79248 -1.00887,-1.17206 -1.91435,-2.35297 -2.01217,-2.62424 -0.0978,-0.27127 -0.63907,-0.89312 -1.20278,-1.3819 -0.5637,-0.48877 -1.02492,-1.03665 -1.02492,-1.21751 0,-0.18087 -0.54125,-0.87983 -1.20277,-1.55324 -0.66153,-0.67342 -1.593,-1.70008 -2.06993,-2.28147 -0.47693,-0.58139 -3.47865,-4.20616 -6.67048,-8.05505 -3.19184,-3.84888 -6.14753,-7.43746 -6.5682,-7.97461 -0.42067,-0.53716 -1.35532,-1.63994 -2.07698,-2.45063 -0.72167,-0.81069 -1.70576,-1.99988 -2.18687,-2.64264 -0.48111,-0.64276 -1.10376,-1.42789 -1.38367,-1.74473 -0.41228,-0.46668 0.17495,-0.69534 3.09218,-1.20406 l 3.60111,-0.62798 4.56185,5.40877 c 2.50902,2.97482 4.87228,5.73578 5.25169,6.13546 0.37941,0.39968 2.16795,2.60083 3.97454,4.89144 3.41942,4.33554 13.03635,15.80969 15.26498,18.21295 0.70578,0.76109 1.28324,1.58779 1.28324,1.83711 0,0.24932 0.27054,0.61071 0.6012,0.80307 0.33066,0.19237 1.8429,1.92431 3.36054,3.84875 1.51764,1.92445 5.19755,6.39805 8.17758,9.94134 5.48101,6.517 5.66546,6.89536 3.96092,8.12511 -0.4357,0.31433 -0.79218,0.82508 -0.79218,1.13499 0,0.54629 -1.346,2.01116 -1.84796,2.01116 -0.13656,0 -0.80992,-0.65481 -1.49637,-1.45514 z"
       id="path22845" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:1.65306"
       d=""
       id="path22884"
       transform="scale(0.26458333)" />
    <path
       style="fill:#3f67d1;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.437372"
       d="m 187.57349,202.74705 c -0.28866,-0.28867 -0.52484,-0.73689 -0.52484,-0.99604 0,-0.25915 -0.54125,-0.99152 -1.20278,-1.62749 -1.96029,-1.88454 -3.12853,-3.30885 -2.90079,-3.5366 0.1173,-0.1173 -0.27632,-0.59838 -0.8747,-1.06908 -0.59839,-0.47069 -2.8092,-3.00256 -4.91291,-5.62637 -2.1037,-2.62381 -5.01959,-6.17037 -6.47974,-7.88125 -1.46015,-1.71087 -3.14686,-3.76482 -3.74825,-4.56433 -0.60139,-0.7995 -1.63468,-1.95295 -2.29621,-2.56322 -0.66153,-0.61027 -1.20278,-1.35644 -1.20278,-1.65816 0,-0.30171 -0.49204,-0.87097 -1.09343,-1.26502 -0.60139,-0.39405 -1.09343,-0.97788 -1.09343,-1.2974 0,-0.31953 -0.38667,-0.85179 -0.85927,-1.18281 -0.47259,-0.33102 -2.08223,-2.16275 -3.57697,-4.0705 -1.49475,-1.90776 -3.46989,-4.33284 -4.38922,-5.38907 -2.03089,-2.33332 -2.09533,-2.8346 -0.31412,-2.44338 0.74657,0.16398 2.46056,0.28496 3.80887,0.26885 2.78747,-0.0333 2.31668,-0.40437 7.16496,5.64743 1.84036,2.2972 5.32961,6.48187 7.7539,9.29928 2.42428,2.8174 4.40779,5.2257 4.40779,5.35177 0,0.25498 1.34052,1.81509 3.17096,3.69039 0.66152,0.67774 1.20277,1.34346 1.20277,1.47937 0,0.13591 0.66898,0.99183 1.48662,1.90205 0.81764,0.91021 3.37865,3.97299 5.69114,6.80617 3.71645,4.55327 4.16778,5.28947 3.88793,6.34192 -0.17414,0.65486 -0.34874,1.33828 -0.388,1.51869 -0.0393,0.18042 -0.12059,0.42644 -0.18073,0.54672 -0.0601,0.12028 -0.14362,0.3663 -0.18552,0.54672 -0.52056,2.24179 -1.29635,2.82625 -2.35125,1.77136 z"
       id="path22923" />
    <path
       style="fill:#08080b;fill-opacity:1;fill-rule:evenodd;stroke:#f4f0e8;stroke-width:0.107786"
       d="m 45.39687,235.60474 c 0.30247,-0.0784 0.15166,-0.29457 -0.25706,-0.36846 -0.20277,-0.0367 -0.2838,-0.073 -0.18005,-0.0808 0.43463,-0.0327 0.10287,-0.32927 -0.38607,-0.34512 -0.22573,-0.007 -0.22635,-0.0106 -0.0181,-0.0966 0.19454,-0.0803 0.17877,-0.10545 -0.16168,-0.25768 -0.20749,-0.0928 -0.33494,-0.17058 -0.28322,-0.1729 0.19755,-0.009 -0.18574,-0.32799 -0.40364,-0.33608 -0.12613,-0.005 -0.16913,-0.0328 -0.0956,-0.0626 0.17591,-0.0711 -0.0983,-0.36007 -0.34164,-0.36007 -0.0975,0 -0.16938,-0.0915 -0.16938,-0.21558 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.14371,0 -0.21557,-0.0719 -0.21557,-0.21557 0,-0.14372 -0.0719,-0.21558 -0.21557,-0.21558 -0.14372,0 -0.21558,-0.0719 -0.21558,-0.21557 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.14371,0 -0.21557,-0.0719 -0.21557,-0.21557 0,-0.14371 -0.0719,-0.21557 -0.21557,-0.21557 -0.12412,0 -0.21557,-0.0719 -0.21557,-0.16938 0,-0.24333 -0.28902,-0.51754 -0.36009,-0.34164 -0.0297,0.0736 -0.0579,0.0246 -0.0625,-0.10875 -0.006,-0.16783 -0.0749,-0.24252 -0.22408,-0.24252 -0.12412,0 -0.21557,-0.0719 -0.21557,-0.16938 0,-0.24333 -0.28902,-0.51754 -0.36008,-0.34164 -0.0308,0.0762 -0.0577,0.0496 -0.0626,-0.0619 -0.005,-0.10764 -0.0646,-0.30058 -0.13322,-0.42874 -0.12188,-0.22775 -0.1266,-0.2282 -0.208,-0.0199 -0.0778,0.19919 -0.0838,0.19716 -0.0909,-0.031 -0.004,-0.13641 -0.22163,-0.46438 -0.49262,-0.7432 -0.26677,-0.27448 -0.48503,-0.54052 -0.48503,-0.5912 0,-0.0507 -0.0613,-0.0922 -0.13612,-0.0922 -0.0749,0 -0.18578,-0.10913 -0.24647,-0.24252 -0.0607,-0.13338 -0.1692,-0.23039 -0.24113,-0.21557 -0.0719,0.0148 -0.13079,-0.0254 -0.13079,-0.0893 0,-0.0639 -0.19401,-0.30264 -0.43114,-0.53048 -0.23713,-0.22783 -0.43114,-0.46243 -0.43114,-0.52132 0,-0.12002 -0.35998,-0.57033 -0.72756,-0.91014 -0.13339,-0.12331 -0.24252,-0.25825 -0.24252,-0.29987 0,-0.0416 -0.19611,-0.28752 -0.43581,-0.54644 -0.89032,-0.96173 -0.97137,-1.06359 -0.84627,-1.06359 0.0703,0 0.0117,-0.1171 -0.13034,-0.26021 -0.14205,-0.14312 -0.39985,-0.43414 -0.57291,-0.64672 -0.17305,-0.21258 -0.36706,-0.38725 -0.43114,-0.38816 -0.0641,-7.9e-4 -0.18614,-0.0457 -0.27125,-0.0996 -0.12514,-0.0792 -0.12892,-0.12904 -0.0197,-0.2606 0.11077,-0.13347 0.0941,-0.20753 -0.0928,-0.41241 -0.4395,-0.48185 -0.51234,-0.5751 -0.63941,-0.81863 -0.0705,-0.13505 -0.16448,-0.22306 -0.20892,-0.1956 -0.0444,0.0275 -0.13943,-0.0439 -0.21108,-0.15866 -0.09,-0.14412 -0.0937,-0.2086 -0.012,-0.2086 0.065,0 -0.007,-0.14923 -0.16077,-0.33162 -0.15347,-0.1824 -0.27905,-0.37641 -0.27905,-0.43115 0,-0.0547 -0.14551,-0.0995 -0.32335,-0.0995 -0.34216,0 -0.40371,-0.0921 -0.19859,-0.29724 0.0945,-0.0945 0.089,-0.16788 -0.0227,-0.30252 -0.0811,-0.0978 -0.19904,-0.2817 -0.26201,-0.40876 -0.0661,-0.13331 -0.2388,-0.24545 -0.40841,-0.26513 -0.31846,-0.037 -0.36395,-0.12221 -0.16913,-0.31702 0.0945,-0.0945 0.089,-0.16789 -0.0227,-0.30252 -0.0811,-0.0978 -0.19904,-0.2817 -0.26201,-0.40876 -0.0661,-0.13332 -0.2388,-0.24545 -0.4084,-0.26513 -0.33947,-0.0394 -0.35831,-0.0933 -0.1233,-0.35303 0.15654,-0.17297 0.15312,-0.1979 -0.0415,-0.30205 -0.11666,-0.0624 -0.24005,-0.22394 -0.27418,-0.35889 -0.0354,-0.13994 -0.21273,-0.31152 -0.41274,-0.39934 -0.23146,-0.10164 -0.29701,-0.17171 -0.19285,-0.20612 0.0868,-0.0287 0.2076,-0.11965 0.26845,-0.20218 0.14994,-0.20338 0.47434,-0.0652 0.59557,0.25362 0.0533,0.14013 0.17082,0.25477 0.26121,0.25477 0.0904,0 0.16434,0.0743 0.16434,0.16506 0,0.0908 0.0728,0.19298 0.16168,0.22711 0.0889,0.0341 0.16168,0.12115 0.16168,0.19339 0,0.0722 0.12126,0.24528 0.26947,0.38451 0.1482,0.13923 0.26946,0.29693 0.26946,0.35044 0,0.0535 0.14458,0.24187 0.32129,0.41857 0.1767,0.17671 0.31647,0.35487 0.31059,0.39591 -0.03,0.20934 0.0299,0.27206 0.12262,0.12851 0.0928,-0.14353 0.10467,-0.14345 0.10614,8e-4 7.9e-4,0.0893 0.17141,0.31823 0.3789,0.50865 0.20749,0.19043 0.37725,0.39114 0.37725,0.44603 0,0.0549 0.12042,0.21403 0.2676,0.35364 0.14719,0.13961 0.26844,0.31275 0.26947,0.38477 10e-4,0.072 0.0989,0.18286 0.21743,0.24631 0.11857,0.0635 0.21557,0.18642 0.21557,0.27326 0,0.0868 0.0773,0.15789 0.17177,0.15789 0.0945,0 0.19714,0.097 0.22815,0.21557 0.031,0.11857 0.12195,0.21557 0.2021,0.21557 0.0801,0 0.1213,0.0636 0.0914,0.14145 -0.03,0.0781 0.0682,0.20698 0.21896,0.28768 0.15028,0.0804 0.27323,0.20327 0.27323,0.27299 0,0.0697 0.0993,0.2166 0.2206,0.3264 0.12133,0.1098 0.29642,0.35941 0.38908,0.55469 0.0927,0.19527 0.20694,0.33127 0.25394,0.30222 0.047,-0.029 0.13743,0.0963 0.20095,0.2785 0.0635,0.18223 0.16526,0.30057 0.22608,0.26298 0.0608,-0.0376 0.11057,-0.017 0.11057,0.0458 0,0.0628 0.0728,0.11415 0.16168,0.11415 0.0889,0 0.15593,0.0364 0.14891,0.0808 -0.0352,0.22328 0.029,0.3503 0.17711,0.3503 0.0904,0 0.20609,0.10913 0.2571,0.24252 0.051,0.13338 0.19532,0.33492 0.32069,0.44785 0.12537,0.11293 0.22794,0.27057 0.22794,0.3503 0,0.0797 0.0485,0.14498 0.10779,0.14498 0.0593,0 0.0957,0.0606 0.0808,0.13473 -0.0148,0.0741 0.0337,0.12261 0.10778,0.10778 0.0741,-0.0148 0.13474,0.0299 0.13474,0.0993 0,0.0695 0.26677,0.38261 0.59282,0.6959 0.32605,0.31329 0.59282,0.61178 0.59282,0.66332 0,0.0515 0.12126,0.20763 0.26947,0.34686 0.1482,0.13923 0.26946,0.31745 0.26946,0.39604 0,0.0786 0.0485,0.14289 0.10779,0.14289 0.0593,0 0.0957,0.0606 0.0808,0.13473 -0.0148,0.0741 0.0328,0.1229 0.10589,0.10842 0.0731,-0.0145 0.16363,0.0964 0.20125,0.24628 0.0376,0.14993 0.20825,0.34491 0.37915,0.43328 0.1709,0.0884 0.31073,0.2322 0.31073,0.3196 0,0.0874 0.097,0.15891 0.21557,0.15891 0.13685,0 0.21557,0.0719 0.21557,0.19678 0,0.10823 0.12126,0.3107 0.26947,0.44994 0.1482,0.13923 0.26946,0.31745 0.26946,0.39604 0,0.0786 0.0849,0.14671 0.18863,0.1514 0.11268,0.005 0.13438,0.0304 0.0539,0.0629 -0.177,0.0714 -0.17356,0.25197 0.005,0.25197 0.0767,0 0.32448,0.24252 0.55053,0.53893 0.23799,0.31208 0.49685,0.53893 0.61497,0.53893 0.13013,0 0.20397,0.0758 0.20397,0.20946 0,0.11521 0.10227,0.28109 0.22726,0.36864 0.12499,0.0875 0.19693,0.20824 0.15988,0.2682 -0.0371,0.06 0.0301,0.17733 0.1493,0.2608 0.11918,0.0835 0.18648,0.18199 0.14956,0.21891 -0.0369,0.0369 0.0618,0.12587 0.21932,0.19766 0.18642,0.0849 0.24237,0.15776 0.16022,0.20853 -0.0818,0.0505 0.0116,0.16734 0.26507,0.33161 0.21521,0.13948 0.3919,0.31422 0.39264,0.38833 7.9e-4,0.0741 0.0753,0.13473 0.16568,0.13473 0.0904,0 0.20659,0.11112 0.25823,0.24695 0.0516,0.13582 0.174,0.31343 0.2719,0.39468 0.1257,0.10432 0.14164,0.17021 0.0542,0.22423 -0.0769,0.0475 0.002,0.13236 0.2095,0.22402 0.27659,0.12243 0.30135,0.16016 0.14562,0.22185 -0.10321,0.0409 -0.33316,0.0721 -0.51101,0.0694 -0.18339,-0.003 -0.23913,-0.0268 -0.12877,-0.0554 z M 29.41162,215.5242 c 0,-0.0593 -0.0514,-0.10779 -0.11414,-0.10779 -0.0628,0 -0.0842,0.0485 -0.0475,0.10779 0.0366,0.0593 0.088,0.10779 0.11415,0.10779 0.0261,0 0.0475,-0.0485 0.0475,-0.10779 z"
       id="path29746" />
  </g>
</svg></div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}

function removeTyping(){const t=document.getElementById('typing');if(t)t.remove();}
function handleKey(e){if(e.key==='Enter')sendMessage();}

function detectCountry(text){
  const t=text.toLowerCase();
  for(const c of COUNTRIES){if(t.includes(c.name.toLowerCase())||t.includes(c.iso3.toLowerCase()))return c;}
  const aliases={'haiti':'HTI','haïti':'HTI','ayiti':'HTI','dominican':'DOM','honduras':'HND','guate':'GTM','nica':'NIC','costa rica':'CRI','puerto rico':'PRI','trinidad':'TTO','tobago':'TTO','el salvador':'SLV','salvador':'SLV'};
  for(const[alias,iso3]of Object.entries(aliases)){if(t.includes(alias))return COUNTRIES.find(c=>c.iso3===iso3);}
  return null;
}

function detectIntents(text){
  // Returns all matching sector intents for multi-intent messages
  const t=text.toLowerCase();
  const sectorMatches=[];
  if(/food|hungry|eat|hambre|faim|manje|manger|nourriture|comida|alimento|alimenta/.test(t))sectorMatches.push('food');
  if(/water|agua|\beau\b|\bdlo\b|sanit|\bsed\b/.test(t))sectorMatches.push('water');
  if(/shelter|house|roof|techo|abri|\bkay\b|logement|refugio|albergue|vivienda/.test(t))sectorMatches.push('shelter');
  if(/hygiene|higiene|sanit|clean|limpi|propre/.test(t))sectorMatches.push('hygiene');
  if(/educat|educaci|school|learn|escuela|école|lekol/.test(t))sectorMatches.push('education');
  if(/\bhealth\b|medical|clinic|hospital|doctor|nurse|medicine|salud|santé|sante|\bmedikal\b|médico|\bmedico\b/.test(t))sectorMatches.push('health');
  return sectorMatches;
}
// ── Out-of-scope country detection ──────────────────────────────────────────
const OUT_OF_SCOPE=[
  'syria','ukraine','afghanistan','yemen','somalia','iraq','iran','libya','sudan','ethiopia',
  'nigeria','kenya','myanmar','pakistan','bangladesh','india','china','russia','france','spain',
  'mexico','brazil','colombia','venezuela','peru','argentina','chile','canada','germany','uk',
  'england','australia','egypt','israel','palestine','turkey','south africa','ghana'
];
function detectOutOfScopeCountry(text){
  const t=text.toLowerCase();
  for(const c of OUT_OF_SCOPE){if(t.includes(c))return c.charAt(0).toUpperCase()+c.slice(1);}
  return null;
}

function detectIntent(text){
  const t=text.toLowerCase();
  // ── Crisis escalation — BEFORE feelings ─────────────────────────────────
  if(/kill myself|end my life|don.t want to live|suicid|self.harm|self harm|quiero morir|no quiero vivir|me veux mourir|veux mourir|mouri tet mwen|mouri tèt mwen|hurt myself|take my life|me matar|quitarme la vida|no vale la pena vivir|no quiero seguir/.test(t))return 'crisis';
  // isolated/alone intent — before feelings
  if(/\balone\b|no one around|don.t have anyone|nobody.*with|by myself|sin nadie|toute? seul|poukont mwen|pa gen moun/.test(t))return 'isolated';
  // feelings
  if(/\bsad\b|scared|afraid|\bcry\b|crying|stress|stressed|worried|worry|hopeless|desperate|exhausted|overwhelmed|nervous|panic|upset|helpless|confused|broken|hurting|suffering|struggling|\bnumb\b|grief|grieving|depressed|depression|\bfear\b|terrified|traumati[sz]|triste|\bsolo\b|\bsola\b|miedo|asustad|angustia|desesperado|desesperada|agotad|preocupad|llorando|sufriendo|pánico|nervioso|déprimé|anxieux|anxieuse|stressé|stressée|désespéré|désespérée|épuisé|inquiet|inquiète|panique|souffre|pleure|\bpè\b|soufri|kè sote|tris|malere|dekouraje|plen lapenn|kriye|estresado|estresada|agobiado|agobiada|angustiado|angustiada|abrumado|abrumada|estréss|stressato|stressata|débordé|débordée|angoissé|angoissée|fatigué|fatiguée|épuisé|épuisée|dekouraje|bouke|kè m pa bon/.test(t))return 'feelings';
  if(/pet|dog|cat|animal|chien|chat|bèt/.test(t))return 'pet';
  // pain/hurt → emergency
  if(/\bpain\b|\bhurt\b|injured|bleeding|blessé|blese|herido|herida|dolor físico|blessé|blessée/.test(t))return 'emergency';
  if(/\bhealth\b|medical|clinic|hospital|doctor|nurse|medicine|salud|santé|sante|\bmedikal\b|médico|\bmedico\b/.test(t))return 'health';
  if(/food|hungry|eat|hambre|faim|manje|manger|nourriture|comida|alimento|alimenta/.test(t))return 'food';
  if(/water|agua|\beau\b|\bdlo\b|sanit|\bsed\b/.test(t))return 'water';
  if(/shelter|house|roof|techo|abri|\bkay\b|logement|refugio|albergue|vivienda/.test(t))return 'shelter';
  if(/hygiene|higiene|sanit|clean|limpi|propre/.test(t))return 'hygiene';
  if(/educat|educaci|school|learn|escuela|école|lekol/.test(t))return 'education';
  // top_funders — before emergency; tightened to avoid matching "country...most"
  // sectors — "what sectors get most funding" — before top_funders
  if(/what sector|which sector|top sector|sector.*fund|fund.*sector|qué sector|cuál sector|sector.*financ|quel secteur|ki sektè/.test(t))return 'sectors';
  // allocation before top_funders to avoid most.*fund false match
  if(/underfund|overfund|funding gap|allocation|not enough fund|too much fund|optimal|how much.*fund|how well.*fund|least.*fund|least.*money|most.*money|least.*aid|receives.*least|receives.*most|gets.*least|gets.*most|menos.*dinero|moins.*fond|mal financ|sous.financ|manque.*fond|finansman|sub.financ|sobre.financ|bien.financ|financiado|financiamiento/.test(t))return 'allocation';
  if(/who fund|sends.*fund|biggest donor|top donor|top fund|top.*org|top.*countri|most fund|org.*fund|organizations.*fund|funded org|orgs.*get|most.*money|who pays|which country.*fund|what country.*fund|quien financia|qui finance|kijan yo finanse|quien ayuda|que pais ayuda|quien le manda|manda dinero|quien apoya|qui aide|ki ede|kijan yo ede|mayores donantes|mayor donante|principales donantes|donateurs|principaux donateurs|pi gwo donatè|donatè|recibe.*dinero|reciben.*dinero|que pais.*dinero|cual pais.*fondo|mas dinero|más dinero|most.*fund|most.*aid|\bfinanc/.test(t))return 'top_funders';
  if(/emergency|urgent|\bhelp\b|danger|auxilio|socorro|urgence|\bsos\b/.test(t))return 'emergency';
  if(/most death|most kill|deadliest|most injur|muertos|mas muertos|más muertos|mas muertes|más muertes|mas victimas|más víctimas|más mortal|mas mortal|más letal|mas letal|desastre.*mortal|desastre.*letal|mortal|letal|plus de mort|plus meurtrier|plus mortel|mouri|casualties|ki mouri plis/.test(t))return 'deadliest';
  // displacement_out
  if(/flee|fleeing|leaving|go to|where.*go|where do.*people.*go|fuir|kote yo ale|où.*vont|adonde van|adónde van|adonde se van|dónde van|donde van|kote.*ale|kote moun/.test(t))return 'displacement_out';
  // displacement_in — expanded: inflow, sends people to, receive people
  if(/come from|where.*come|receive.*people|arrive from|inflow|who sends people|what countries send|people.*sent to|kote yo soti|d.où viennent|de donde vienen|de dónde vienen|de donde llegan|d.où arrivent/.test(t))return 'displacement_in';
  // recurrence_risk — tightened: removed "country.*most" and "most.*country"
  if(/prone|propenso|propensa|suffer again|most at risk|recurrence|risk again|likely.*disaster|highest.*disaster|most disaster|most affected country|which country.*disaster|what country.*disaster|highest risk|most risk|highest.*risk|most.*risk|mayor riesgo|más riesgo|mas riesgo|plus.*risque|pi plis risk|which countries.*risk|what countries.*risk/.test(t))return 'recurrence_risk';
  // Item 13: trend — year-over-year comparison
  if(/trend|over.*year|year.*year|worse|better|increas|decreas|2019|2020|2021|2022|2023|2024|evolv|chang.*over|comparar.*año|tendencia|évolution|tendance|ogmante|diminye/.test(t))return 'trend';
  // Item 14: compare — two countries side by side
  if(/compare|vs\.?|versus|versus|both|side.*side|between.*and|diferencia.*entre|comparer|konpare/.test(t))return 'compare';
  // Meta intents
  if(/what language|which language|do you speak|hablas|langue.*parle|pale.*lang|languages.*speak|speak.*language/.test(t))return 'meta_languages';
  if(/what countries|which countries.*cover|countries.*data|cover.*countries|caribe.*countries|central america.*countries|countries.*region|paises.*datos|pays.*données|peyi.*done/.test(t))return 'meta_countries';
  if(/how do you know|where.*data.*from|data.*source|source.*data|como sabes|cómo sabes|de donde viene|de dónde viene|tu informacion|tu información|d.où vient|kote done yo soti|verify|based on what|who told you|where.*get.*info/.test(t))return 'meta_sources';
  // natural_disaster
  if(/disaster|flood|hurricane|earthquake|cyclone|storm|catastrophe|katastwòf|natural event|common event|desastre|inundacion|terremoto|huracán|huracan|seisme|inondasyon|siklòn/.test(t))return 'natural_disaster';
  return 'unknown';
}
const SECTOR_MAP={food:'Food Security',water:'Water Sanitation Hygiene',shelter:'Emergency Shelter and NFI',hygiene:'Water Sanitation Hygiene',education:'Education',health:'Health'};

// ── Follow-up suggestions by intent ──────────────────────────────────────────
const FOLLOWUP={
  food:       (l,c)=>ml(l,`💡 You can also ask: <em>What sectors get the most funding in ${c}?</em> · <em>Is ${c} underfunded?</em>`,`💡 También puedes preguntar: <em>¿Qué sectores reciben más financiamiento en ${c}?</em> · <em>¿Está ${c} sub-financiado?</em>`,`💡 Vous pouvez aussi demander: <em>Quels secteurs reçoivent le plus de financement à ${c}?</em>`,`💡 Ou ka mande tou: <em>Ki sektè ki resevwa plis finansman nan ${c}?</em>`),
  water:      (l,c)=>ml(l,`💡 You can also ask: <em>What disasters hit ${c} most?</em> · <em>What sectors get the most funding in ${c}?</em>`,`💡 También puedes preguntar: <em>¿Qué desastres afectan más a ${c}?</em> · <em>¿Qué sectores reciben más fondos en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Quelles catastrophes frappent le plus ${c}?</em>`,`💡 Ou ka mande: <em>Ki katastwòf ki pi komen nan ${c}?</em>`),
  shelter:    (l,c)=>ml(l,`💡 You can also ask: <em>Where do displaced people in ${c} come from?</em> · <em>Is ${c} underfunded?</em>`,`💡 También puedes preguntar: <em>¿De dónde vienen los desplazados en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>D'où viennent les déplacés à ${c}?</em>`,`💡 Ou ka mande: <em>Kote moun deplase nan ${c} soti?</em>`),
  natural_disaster:(l,c)=>ml(l,`💡 You can also ask: <em>What was the deadliest event in ${c}?</em> · <em>Which country is most prone to disasters?</em>`,`💡 También puedes preguntar: <em>¿Cuál fue el evento más letal en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Quel a été l'événement le plus meurtrier à ${c}?</em>`,`💡 Ou ka mande: <em>Ki evènman ki pi mòtèl nan ${c}?</em>`),
  deadliest:  (l,c)=>ml(l,`💡 You can also ask: <em>What disasters are most common in ${c}?</em> · <em>Which country is most prone to crises?</em>`,`💡 También puedes preguntar: <em>¿Cuáles son los desastres más comunes en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Quelles catastrophes sont les plus fréquentes à ${c}?</em>`,`💡 Ou ka mande: <em>Ki katastwòf ki pi komen nan ${c}?</em>`),
  displacement_out:(l,c)=>ml(l,`💡 You can also ask: <em>Where do people arriving in ${c} come from?</em> · <em>Is ${c} underfunded?</em>`,`💡 También puedes preguntar: <em>¿De dónde vienen las personas que llegan a ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>D'où viennent les personnes qui arrivent à ${c}?</em>`,`💡 Ou ka mande: <em>Kote moun ki rive nan ${c} soti?</em>`),
  displacement_in:(l,c)=>ml(l,`💡 You can also ask: <em>Where do people from ${c} go when displaced?</em> · <em>What disasters hit ${c}?</em>`,`💡 También puedes preguntar: <em>¿A dónde van los desplazados de ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Où vont les déplacés de ${c}?</em>`,`💡 Ou ka mande: <em>Kote moun deplase soti nan ${c} ale?</em>`),
  sectors:    (l,c)=>ml(l,`💡 You can also ask: <em>Who funds ${c}?</em> · <em>Is ${c} underfunded?</em>`,`💡 También puedes preguntar: <em>¿Quién financia ${c}?</em> · <em>¿Está ${c} sub-financiado?</em>`,`💡 Vous pouvez aussi demander: <em>Qui finance ${c}?</em>`,`💡 Ou ka mande: <em>Kiyès ki finanse ${c}?</em>`),
  top_funders:(l,c)=>ml(l,`💡 You can also ask: <em>Is ${c} underfunded?</em> · <em>What sectors get the most funding in ${c}?</em>`,`💡 También puedes preguntar: <em>¿Está ${c} sub-financiado?</em> · <em>¿Qué sectores reciben más fondos en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>${c} est-il sous-financé?</em>`,`💡 Ou ka mande: <em>Eske ${c} anba-finanse?</em>`),
  allocation: (l,c)=>ml(l,`💡 You can also ask: <em>Who are the biggest donors in ${c}?</em> · <em>What sectors get the most funding in ${c}?</em>`,`💡 También puedes preguntar: <em>¿Quiénes son los mayores donantes en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Qui sont les plus grands donateurs à ${c}?</em>`,`💡 Ou ka mande: <em>Kiyès ki pi gwo donatè nan ${c}?</em>`),
  recurrence_risk:(l,c)=>ml(l,`💡 You can also ask: <em>What disasters are most common in ${c||'these countries'}?</em> · <em>What was the deadliest event in ${c||'the region'}?</em>`,`💡 También puedes preguntar: <em>¿Qué desastres son más comunes en ${c||'estos países'}?</em>`,`💡 Vous pouvez aussi demander: <em>Quelles catastrophes sont les plus fréquentes dans ${c||'ces pays'}?</em>`,`💡 Ou ka mande: <em>Ki katastwòf ki pi komen nan ${c||'peyi sa yo'}?</em>`),
  trend:(l,c)=>ml(l,`💡 You can also ask: <em>Is ${c} underfunded?</em> · <em>What sectors get the most funding in ${c}?</em>`,`💡 También puedes preguntar: <em>¿Está ${c} sub-financiado?</em>`,`💡 Vous pouvez aussi demander: <em>${c} est-il sous-financé?</em>`,`💡 Ou ka mande: <em>Eske ${c} anba-finanse?</em>`),
  compare:(l,c)=>ml(l,`💡 You can also ask: <em>Which country is most underfunded?</em> · <em>Which country is most prone to crises?</em>`,`💡 También puedes preguntar: <em>¿Cuál es el país más sub-financiado?</em>`,`💡 Vous pouvez aussi demander: <em>Quel pays est le plus sous-financé?</em>`,`💡 Ou ka mande: <em>Ki peyi ki pi anba-finanse?</em>`),
  health:(l,c)=>ml(l,`💡 You can also ask: <em>What sectors get the most funding in ${c}?</em> · <em>Is ${c} underfunded?</em>`,`💡 También puedes preguntar: <em>¿Qué sectores reciben más fondos en ${c}?</em>`,`💡 Vous pouvez aussi demander: <em>Quels secteurs reçoivent le plus à ${c}?</em>`,`💡 Ou ka mande: <em>Ki sektè ki resevwa plis nan ${c}?</em>`),
};
function followup(intent,l,cname){
  if(chatState.suppressFollowup)return;
  const fn=FOLLOWUP[intent];
  if(!fn)return;
  setTimeout(()=>addMsg('bot',fn(l,cname||'the region')),1400);
}

async function sendMessage(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text)return;
  // Item 4: input length limit
  if(text.length>300){
    const l=chatState.lang||lang||'en';
    addMsg('bot',ml(l,
      'Please keep your message under 300 characters so I can help you better.',
      'Por favor mantén tu mensaje en menos de 300 caracteres para poder ayudarte mejor.',
      'Veuillez limiter votre message à 300 caractères pour que je puisse mieux vous aider.',
      'Tanpri kenbe mesaj ou anba 300 karaktè pou mwen ka ede ou pi byen.'
    ));
    return;
  }
  input.value='';
  addMsg('user',text);

  // Detect language from this message (override if confident)
  const detectedLang=detectLang(text);
  if(detectedLang!=='en'||!chatState.lang)chatState.lang=detectedLang;
  const l=chatState.lang;

  showTyping();
  await new Promise(r=>setTimeout(r,800));
  removeTyping();

  // ── Language switch request ───────────────────────────────────────────────
  const tLow=text.toLowerCase();
  const langSwitch=(
    /\bin english\b|en inglés|en ingles|switch.*english|english please|\binglés\b|\bingles\b|\benglish\b/.test(tLow)?'en':
    /\ben español\b|in spanish|en espanol|switch.*spanish|español please|\bespañol\b|\bespanol\b|\bspanish\b/.test(tLow)?'es':
    /\ben français\b|en francais|in french|switch.*french|français please|\bfrançais\b|\bfrancais\b|\bfrench\b/.test(tLow)?'fr':
    /\ben kreyòl\b|en creole|in creole|kreyol|kreyòl|en haitian|\bcreole\b|\bhaitian\b/.test(tLow)?'ht':
    null
  );
  if(langSwitch){
    chatState.lang=langSwitch;
    const confirmMsg={
      en:'Switching to English. How can I help you?',
      es:'Cambiando a español. ¿Cómo puedo ayudarte?',
      fr:'Je passe en français. Comment puis-je vous aider?',
      ht:'Mwen ap chanje nan kreyòl. Kijan mwen ka ede ou?'
    }[langSwitch];
    addMsg('bot',confirmMsg);
    return;
  }

  if(chatState.step==='awaiting_country'){
    const country=detectCountry(text);
    if(!country){
      // Item 7: out-of-scope country guardrail
      const outOfScope=detectOutOfScopeCountry(text);
      if(outOfScope){
        const l2=chatState.lang||lang||'en';
        addMsg('bot',ml(l2,
          `I don't have data for <strong>${outOfScope}</strong>. Ávila covers the Caribbean and Central America. Which country in that region can I help you with?`,
          `No tengo datos para <strong>${outOfScope}</strong>. Ávila cubre el Caribe y Centroamérica. ¿Sobre qué país de esa región puedo ayudarte?`,
          `Je n'ai pas de données pour <strong>${outOfScope}</strong>. Ávila couvre les Caraïbes et l'Amérique centrale. Pour quel pays de cette région puis-je vous aider?`,
          `Mwen pa gen done pou <strong>${outOfScope}</strong>. Ávila kouvri Karayib ak Amerik Santral. Ki peyi nan rejyon sa mwen ka ede ou?`
        ));
        return;
      }
      // Global intents that don't require a country — handle immediately
      const globalIntent=detectIntent(text);
      const globalIntents=['recurrence_risk','natural_disaster','allocation','top_funders','sectors','trend','compare','deadliest','feelings','isolated','emergency','crisis','meta_languages','meta_countries','meta_sources'];
      if(globalIntents.includes(globalIntent)){
        chatState.step='awaiting_intent';
        await handleIntent(globalIntent,text);
        return;
      }
      // Check if it's a greeting or truly unknown — give helpful response instead of just asking for country
      const isGreeting=/^(hi|hello|hey|hola|bonjour|salut|bonsoir|bònjou|allo|yo|sup|good morning|good afternoon|buenos días|buenas tarde|buenas noche|buenas|bonswa|bon maten|greetings|howdy|what.s up|wassup|ciao|ça va|comment ça va|koman ou ye|kijan ou ye)[\.!\?\s]*$/i.test(text.trim());
      // Only show full greeting if bot hasn't already greeted (first message in session)
      if(isGreeting && !chatState.greeted){
        addMsg('bot',ml(l,
          `Hello! 👋 I'm Ávila, your humanitarian resource guide for the Caribbean and Central America.<br><br>I can help with: food &amp; water, shelter, emergencies, disaster history, displacement flows, funding, and risk (EN, ES, FR, HT).<br><br>Data coverage: 2019 to ${DATA_LAST_UPDATED}. Which country are you asking about?`,
          `¡Hola! 👋 Soy Ávila, tu guía de recursos humanitarios para el Caribe y Centroamérica.<br><br>Puedo ayudar con: comida y agua, refugio, emergencias, historial de desastres, flujos de desplazamiento, financiamiento y datos de riesgo.<br><br>¿Sobre qué país preguntas?`,
          `Bonjour! 👋 Je suis Ávila, votre guide de ressources humanitaires pour les Caraïbes et l'Amérique centrale.<br><br>Je peux aider avec: nourriture et eau, abri, urgences, historique des catastrophes, déplacements, financement et données de risque.<br><br>De quel pays parlez-vous?`,
          `Bonjou! 👋 Mwen se Ávila, gid resous imanitè ou pou Karayib ak Amerik Santral.<br><br>Mwen ka ede ak: manje ak dlo, abri, ijans, istwa katastwòf, deplaseman, finansman ak done risk.<br><br>Ki peyi ou ap pale de li?`
        ));
      } else if(isGreeting && chatState.greeted){
        // User greeted again after already being welcomed — respond warmly, re-ask country
        addMsg('bot',ml(l,
          `Hi there! Which country are you asking about?`,
          `¡Hola! ¿Sobre qué país preguntas?`,
          `Bonjour! De quel pays parlez-vous?`,
          `Bonjou! Ki peyi ou ap pale de li?`
        ));
      } else if(detectIntent(text)==='unknown'){
        addMsg('bot',ml(l,
          `I didn't quite catch that. I can help with: food, water, shelter, emergencies, disasters, displacement, funding, and risk, for any country in the Caribbean and Central America.<br><br>Which country are you asking about?`,
          `No entendí bien. Puedo ayudar con: comida, agua, refugio, emergencias, desastres, desplazamiento, financiamiento y riesgo, para cualquier país del Caribe y Centroamérica.<br><br>¿Sobre qué país preguntas?`,
          `Je n'ai pas bien compris. Je peux aider avec: nourriture, eau, abri, urgences, catastrophes, déplacement, financement et risques.<br><br>De quel pays parlez-vous?`,
          `Mwen pa konprann byen. Mwen ka ede ak: manje, dlo, abri, ijans, katastwòf, deplaseman, finansman ak risk.<br><br>Ki peyi ou ap pale de li?`
        ));
      } else {
        addMsg('bot',ml(l,
          'I did not catch your country. Could you try again? (e.g. Haiti, Honduras, Jamaica)',
          '¿No entendí tu país. Puedes intentarlo de nuevo? (ej. Haití, Honduras, Jamaica)',
          'Je n\'ai pas saisi votre pays. Pouvez-vous réessayer? (ex. Haïti, Honduras, Jamaïque)',
          'Mwen pa konprann peyi ou. Eske ou ka eseye ankò? (egz. Ayiti, Ondiras, Jamayik)'
        ));
      }
      return;
    }
    chatState.country=country.iso3;
    chatState.countryName=country.name;
    chatState.step='awaiting_intent';
    showCountryBanner(country.name);
    // If a sensitive intent was pending (feelings/isolated), fire it now
    if(chatState.pendingIntent){
      const pending=chatState.pendingIntent;
      chatState.pendingIntent=null;
      await handleIntent(pending,text);
      return;
    }
    // Fix 5: if intent already in message, skip menu and go straight to handler
    const earlyIntent=detectIntent(text);
    const skipMenu=['displacement_out','displacement_in','deadliest','natural_disaster','recurrence_risk','top_funders','sectors','trend','compare','allocation','food','water','shelter','hygiene','health','education','emergency','feelings','isolated','pet','meta_languages','meta_countries','meta_sources'];
    if(skipMenu.includes(earlyIntent)){
      await handleIntent(earlyIntent,text);
      return;
    }
    addMsg('bot',ml(l,
      `Got it, <strong>${country.name}</strong>. Are you in an emergency right now, or are you looking for information and resources?<br><br><strong>🚨 Emergency:</strong> I need help now<br><strong>📊 Information:</strong> I have a question`,
      `Entendido, <strong>${country.name}</strong>. ¿Estás en una emergencia ahora mismo, o estás buscando información y recursos?<br><br><strong>🚨 Emergencia:</strong> Necesito ayuda ahora<br><strong>📊 Información:</strong> Tengo una pregunta`,
      `Compris, <strong>${country.name}</strong>. Êtes-vous en situation d'urgence en ce moment, ou cherchez-vous des informations?<br><br><strong>🚨 Urgence:</strong> J'ai besoin d'aide maintenant<br><strong>📊 Information:</strong> J'ai une question`,
      `Konprann, <strong>${country.name}</strong>. Eske ou nan yon ijans kounye a, oswa ou ap chèche enfòmasyon?<br><br><strong>🚨 Ijans:</strong> Mwen bezwen èd kounye a<br><strong>📊 Enfòmasyon:</strong> Mwen gen yon kesyon`
    ));
    chatState.step='awaiting_triage';
    return;
  }

  // ── Triage step ─────────────────────────────────────────────────────────
  if(chatState.step==='awaiting_triage'){
    const t2=tLow;
    const isUrgent=/emergency|urgent|\bnow\b|right now|dying|help me|sos|emergencia|ahora|urgente|urgence|maintenant|ijans|kounye a|\b🚨\b|\bayuda\b|necesito ayuda|ayúdame|socorro|auxilio|au secours|ede mwen|\bhelp\b/.test(t2);
    const isInfo=/information|info|question|resource|looking|data|stats|learn|informaci|renseignement|enfòmasyon|📊|\bno\b|\bnot\b|just.*question|solo.*pregunta/.test(t2);
    if(isUrgent){
      chatState.step='awaiting_intent';
      const iso3=chatState.country;
      const num=EMERGENCY_NUMBERS[iso3]||'local emergency services';
      addMsg('bot',ml(l,
        `<strong>🚨 Emergency response for ${chatState.countryName}:</strong><br><br>Call <strong>${num}</strong> immediately.<br><br>I'm also pulling up the most active humanitarian organizations in your area. What do you need? Food · Water · Shelter · Medical`,
        `<strong>🚨 Respuesta de emergencia para ${chatState.countryName}:</strong><br><br>Llama a <strong>${num}</strong> inmediatamente.<br><br>También estoy buscando las organizaciones humanitarias más activas en tu área. ¿Qué necesitas? Comida · Agua · Refugio · Médico`,
        `<strong>🚨 Réponse d'urgence pour ${chatState.countryName}:</strong><br><br>Appelez le <strong>${num}</strong> immédiatement.<br><br>Je recherche aussi les organisations humanitaires les plus actives dans votre région. Que vous faut-il? Nourriture · Eau · Abri · Médical`,
        `<strong>🚨 Repons ijans pou ${chatState.countryName}:</strong><br><br>Rele <strong>${num}</strong> imedyatman.<br><br>Mwen ap chèche òganizasyon imanitè ki pi aktif nan zòn ou. Kisa ou bezwen? Manje · Dlo · Abri · Medikal`
      ));
      return;
    }
    if(isInfo){
      chatState.step='awaiting_intent';
      const cname=chatState.countryName;
      addMsg('bot',ml(l,
        `What would you like to know about <strong>${chatState.countryName}</strong>?<br><br>Food · Water · Shelter · Medical · Hygiene · Education · Disasters · Displacement · Funding · Risk`,
        `¿Qué te gustaría saber sobre <strong>${chatState.countryName}</strong>?<br><br>Comida · Agua · Refugio · Médico · Higiene · Educación · Desastres · Desplazamiento · Financiamiento · Riesgo`,
        `Que souhaitez-vous savoir sur <strong>${chatState.countryName}</strong>?<br><br>Nourriture · Eau · Abri · Médical · Hygiène · Éducation · Catastrophes · Déplacement · Financement · Risque`,
        `Kisa ou ta renmen konnen sou <strong>${chatState.countryName}</strong>?<br><br>Manje · Dlo · Abri · Medikal · Ijyèn · Edikasyon · Katastwòf · Deplaseman · Finansman · Risk`
      ));
      followup('allocation',l,cname);
      return;
    }
    // Yes/no explicit answers
    if(/\byes\b|\bsí\b|\bsi\b|\boui\b|\bwi\b|\byeah\b/.test(t2)){
      chatState.step='awaiting_intent';
      chatState.triageRetry=false;
      const iso3t=chatState.country;
      const num=EMERGENCY_NUMBERS[iso3t]||'local emergency services';
      addMsg('bot',ml(l,
        `🚨 Call <strong>${num}</strong> immediately.<br><br>What do you need right now? Food · Water · Shelter · Medical`,
        `🚨 Llama al <strong>${num}</strong> inmediatamente.<br><br>¿Qué necesitas ahora? Comida · Agua · Refugio · Médico`,
        `🚨 Appelez le <strong>${num}</strong> immédiatement.<br><br>Que vous faut-il? Nourriture · Eau · Abri · Médical`,
        `🚨 Rele <strong>${num}</strong> imedyatman.<br><br>Kisa ou bezwen? Manje · Dlo · Abri · Medikal`
      ));
      return;
    }
    if(/\bno\b|\bnon\b|\bnon\b|pa vrè/.test(t2)){
      chatState.step='awaiting_intent';
      chatState.triageRetry=false;
      const cname2=chatState.countryName;
      addMsg('bot',ml(l,
        `What would you like to know about <strong>${chatState.countryName}</strong>? Food · Water · Shelter · Disasters · Funding · Displacement`,
        `¿Qué necesitas saber sobre <strong>${chatState.countryName}</strong>? Comida · Agua · Refugio · Desastres · Financiamiento · Desplazamiento`,
        `Que voulez-vous savoir sur <strong>${chatState.countryName}</strong>? Nourriture · Eau · Abri · Catastrophes · Financement · Déplacement`,
        `Kisa ou bezwen sou <strong>${chatState.countryName}</strong>? Manje · Dlo · Abri · Katastwòf · Finansman · Deplaseman`
      ));
      followup('allocation',l,cname2);
      return;
    }
    // Not clearly urgent or info — check for direct intent first, then fallback
    const triageIntent=detectIntent(text);
    // Expert/info intents bypass triage entirely
    const bypassTriage=['trend','compare','allocation','recurrence_risk','top_funders','sectors','natural_disaster','deadliest','displacement_out','displacement_in','feelings','isolated','emergency','crisis','health','meta_languages','meta_countries','meta_sources'];
    if(bypassTriage.includes(triageIntent)){
      chatState.step='awaiting_intent';
      await handleIntent(triageIntent,text);
      return;
    }
    if(triageIntent!=='unknown'){
      chatState.step='awaiting_intent';
      await handleIntent(triageIntent,text);
      return;
    }
    // Single-word or ambiguous — re-prompt once more, then default to info path
    if(!chatState.triageRetry){
      chatState.triageRetry=true;
      addMsg('bot',ml(l,
        'Just to confirm: are you in an emergency right now? Say <strong>yes</strong> or <strong>no</strong>, or just tell me what you need.',
        'Solo para confirmar: ¿estás en una emergencia ahora? Di <strong>sí</strong> o <strong>no</strong>, o dime directamente qué necesitas.',
        'Pour confirmer: êtes-vous en urgence en ce moment? Dites <strong>oui</strong> ou <strong>non</strong>, ou dites-moi ce dont vous avez besoin.',
        'Jis pou konfime: eske ou nan yon ijans kounye a? Di <strong>wi</strong> oswa <strong>non</strong>, oswa di m kisa ou bezwen.'
      ));
      chatState.step='awaiting_triage';
    } else {
      // Second ambiguous reply — default to info path
      chatState.triageRetry=false;
      chatState.step='awaiting_intent';
      addMsg('bot',ml(l,
        `What would you like to know about <strong>${chatState.countryName}</strong>? Food · Water · Shelter · Emergency · Disasters · Funding`,
        `¿Qué necesitas saber sobre <strong>${chatState.countryName}</strong>? Comida · Agua · Refugio · Emergencia · Desastres · Financiamiento`,
        `Que voulez-vous savoir sur <strong>${chatState.countryName}</strong>? Nourriture · Eau · Abri · Urgence · Catastrophes · Financement`,
        `Kisa ou bezwen sou <strong>${chatState.countryName}</strong>? Manje · Dlo · Abri · Ijans · Katastwòf · Finansman`
      ));
    }
    return;
  }

  if(chatState.step==='awaiting_intent'){
    // Multi-country intents must run BEFORE country-switch detection
    const preIntent=detectIntent(text);
    if(preIntent==='compare'||preIntent==='trend'){
      await handleIntent(preIntent,text);
      return;
    }
    // Check if user is switching to a different country
    const newCountry=detectCountry(text);
    if(newCountry && newCountry.iso3!==chatState.country){
      const prevName=chatState.countryName;
      chatState.country=newCountry.iso3;
      chatState.countryName=newCountry.name;
      showCountryBanner(newCountry.name);
      // If there's also an intent in the message, fire it for the new country
      const switchIntent=detectIntent(text);
      const hasIntent=switchIntent!=='unknown';
      addMsg('bot',ml(l,
        `Switched to <strong>${newCountry.name}</strong>.${hasIntent?'':' How can I help you?'}`,
        `Cambiado a <strong>${newCountry.name}</strong>.${hasIntent?'':' ¿Cómo puedo ayudarte?'}`,
        `Changé pour <strong>${newCountry.name}</strong>.${hasIntent?'':' Comment puis-je vous aider?'}`,
        `Chanje pou <strong>${newCountry.name}</strong>.${hasIntent?'':' Kijan mwen ka ede ou?'}`
      ));
      if(hasIntent) await handleIntent(switchIntent,text);
      return;
    }
    // Multi-intent: fire all matched sector intents sequentially
    const multiIntents=detectIntents(text);
    if(multiIntents.length>1){
      chatState.suppressFollowup=true;
      for(let mi_i=0;mi_i<multiIntents.length;mi_i++){
        if(mi_i===multiIntents.length-1) chatState.suppressFollowup=false;
        await handleIntent(multiIntents[mi_i],text);
      }
      return;
    }
    const intent=detectIntent(text);
    await handleIntent(intent,text);
    return;
  }

  addMsg('bot',ml(l,
    `I can help with food, water, shelter, hygiene, education, or emergency resources. What do you need?`,
    `Puedo ayudar con comida, agua, refugio, higiene, educación o recursos de emergencia. ¿Qué necesitas?`,
    `Je peux aider avec la nourriture, l'eau, l'abri, l'hygiène, l'éducation ou les urgences. Que voulez-vous?`,
    `Mwen ka ede ak manje, dlo, abri, ijyèn, edikasyon oswa resous ijans. Kisa ou bezwen?`
  ));
}

async function handleIntent(intent,text=''){
  const iso3=chatState.country;
  const cname=chatState.countryName;
  const l=chatState.lang||lang||'en';
  const dataIntents=['natural_disaster','deadliest','displacement_out','displacement_in','recurrence_risk','sectors','top_funders','allocation','health','food','water','shelter','hygiene','education','emergency','trend','compare'];
  if(chatState.apiDown&&dataIntents.includes(intent)){
    addMsg('bot',ml(l,
      'Our data service is temporarily unavailable. For emergency assistance, contact local emergency services. Please try again shortly.',
      'Nuestro servicio de datos no está disponible. Para emergencias, contacta servicios de emergencia locales. Intenta de nuevo en breve.',
      'Notre service de données est temporairement indisponible. Pour les urgences, contactez les services d\'urgence locaux.',
      'Sèvis done nou an pa disponib pou kounye a. Pou ijans, kontakte sèvis ijans lokal yo.'
    ));
    return;
  }

  // ── Feelings ──────────────────────────────────────────────────────────────
  if(intent==='feelings'){
    if(!iso3){
      addMsg('bot',ml(l,
        `I hear you, and I'm glad you reached out. You don't have to face this alone.<br><br>To help you find support and resources nearby, could you tell me which country you're in?`,
        `Te escucho, y me alegra que hayas escrito. No tienes que enfrentar esto solo/a.<br><br>Para ayudarte a encontrar apoyo y recursos cercanos, ¿podrías decirme en qué país estás?`,
        `Je vous entends, et je suis content(e) que vous ayez contacté. Vous n'avez pas à traverser cela seul(e).<br><br>Pour vous aider à trouver un soutien proche, pourriez-vous me dire dans quel pays vous êtes?`,
        `Mwen tande ou, epi mwen kontan ou rele. Ou pa bezwen fè fas ak sa poukont ou.<br><br>Pou ede ou jwenn sipò ak resous, eske ou ka di m ki peyi ou ye?`
      ));
      chatState.step='awaiting_country';
      chatState.pendingIntent='feelings';
      return;
    }
    addMsg('bot',ml(l,
      `What you're going through is real, and it takes courage to ask for help. You don't have to face this alone. Take a breath. I'm here with you right now.<br><br>When you feel ready, I can look up organizations active in <strong>${cname}</strong> that offer support. Just say the word.`,
      `Lo que estás viviendo es real, y se necesita valentía para pedir ayuda. No tienes que enfrentar esto solo/a. Respira. Estoy aquí contigo ahora mismo.<br><br>Cuando estés listo/a, puedo buscar organizaciones activas en <strong>${cname}</strong> que ofrecen apoyo. Solo dímelo.`,
      `Ce que vous vivez est réel, et il faut du courage pour demander de l'aide. Vous n'avez pas à traverser cela seul(e). Respirez. Je suis là avec vous en ce moment.<br><br>Quand vous vous sentirez prêt(e), je peux trouver des organisations actives à <strong>${cname}</strong> qui offrent du soutien.`,
      `Sa ou ap viv la se reyèl, epi li mande kouraj pou mande èd. Ou pa bezwen fè fas ak sa poukont ou. Pran yon souf. Mwen la avèk ou kounye a.<br><br>Lè ou prè, mwen ka chèche òganizasyon aktif nan <strong>${cname}</strong> ki ofri sipò. Di m sèlman.`
    ));
    return;
  }

  // ── Pet ───────────────────────────────────────────────────────────────────
  if(intent==='pet'){
    addMsg('bot',ml(l,
      `Your pet matters. They're family. During a crisis, try to keep them with you and carry any ID or vaccination records if possible. Many shelters now accept pets or can direct you to animal-friendly facilities.<br><br>Would you like me to find humanitarian organizations active in <strong>${cname}</strong> that may be able to help?`,
      `Tu mascota importa. Es familia. Durante una crisis, intenta mantenerlos contigo y lleva registros de vacunación si es posible. Muchos albergues ahora aceptan mascotas o pueden orientarte hacia instalaciones amigables con animales.<br><br>¿Quieres que busque organizaciones activas en <strong>${cname}</strong> que puedan ayudar?`,
      `Votre animal compte. Il fait partie de la famille. En cas de crise, essayez de le garder avec vous et emportez ses documents si possible. De nombreux refuges acceptent maintenant les animaux.<br><br>Voulez-vous que je trouve des organisations actives à <strong>${cname}</strong> qui peuvent aider?`,
      `Bèt ou a enpòtan. Li se fanmi. Pandan yon kriz, eseye kenbe yo avèk ou epi pote papye vaksinasyon si posib. Anpil abri kounye a aksepte bèt.<br><br>Eske ou vle mwen jwenn òganizasyon aktif nan <strong>${cname}</strong> ki ka ede?`
    ));
    return;
  }

  // ── Natural disaster (most common) — country or regional ──────────────────
  if(intent==='natural_disaster'){
    try{
      const url=iso3?`${API}/disasters/most-common?iso3=${iso3}`:`${API}/disasters/most-common`;
      const res=await fetch(url);
      const data=await res.json();
      if(iso3){
        const top=data.data.slice(0,3).map(d=>`<strong>${d.disaster_type}</strong> (${Math.round(d.occurrences)} events)`).join(', ');
        addMsg('bot',ml(l,
          `In <strong>${cname}</strong> (2019–2024), the most common disasters were: ${top}.<br><br>If you are in a disaster situation right now, please contact local civil protection authorities immediately.`,
          `En <strong>${cname}</strong> (2019–2024), los desastres más comunes fueron: ${top}.<br><br>Si estás en una situación de desastre ahora mismo, contacta a las autoridades de protección civil locales.`,
          `À <strong>${cname}</strong> (2019–2024), les catastrophes les plus fréquentes étaient: ${top}.<br><br>Si vous êtes actuellement dans une situation de catastrophe, contactez immédiatement les autorités locales de protection civile.`,
          `Nan <strong>${cname}</strong> (2019–2024), katastwòf ki pi komen yo te: ${top}.<br><br>Si ou nan yon sitiyasyon katastwòf kounye a, kontakte otorite pwoteksyon sivil lokal yo imedyatman.`
        )+DISCLAIMER+SOURCES.disasters);
      } else {
        // Regional aggregation — sum across all countries
        const totals={};
        data.data.forEach(d=>{
          totals[d.disaster_type]=(totals[d.disaster_type]||0)+d.occurrences;
        });
        const top=Object.entries(totals)
          .sort((a,b)=>b[1]-a[1]).slice(0,4)
          .map(([type,count])=>`<strong>${type}</strong> (${Math.round(count)} events)`).join(', ');
        addMsg('bot',ml(l,
          `Across the Caribbean and Central America (2019–2024), the most common natural disasters were: ${top}.<br><br>Storms and floods dominate the region, with hurricane season (June–November) as the highest-risk period.`,
          `En el Caribe y Centroamérica (2019–2024), los desastres naturales más comunes fueron: ${top}.<br><br>Las tormentas e inundaciones dominan la región, con la temporada de huracanes (junio–noviembre) como el período de mayor riesgo.`,
          `Dans les Caraïbes et en Amérique centrale (2019–2024), les catastrophes naturelles les plus fréquentes étaient: ${top}.<br><br>Les tempêtes et inondations dominent la région, avec la saison des ouragans (juin–novembre) comme période à risque maximal.`,
          `Nan Karayib ak Amerik Santral (2019–2024), katastwòf natirèl ki pi komen yo te: ${top}.<br><br>Tanpèt ak inondasyon domine rejyon an, ak sezon siklòn (jen–novanm) kòm peryòd risk ki pi wo a.`
        )+DISCLAIMER+SOURCES.disasters);
      }
      followup('natural_disaster',l,cname);
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble reaching the data right now. If you are in a disaster, please contact local emergency services immediately.',
        'Tengo dificultades para acceder a los datos. Si estás en un desastre, contacta a los servicios de emergencia locales.',
        'J\'ai du mal à accéder aux données. Si vous êtes dans une catastrophe, contactez les services d\'urgence locaux.',
        'Mwen gen pwoblèm pou aksede done yo. Si ou nan yon katastwòf, kontakte sèvis ijans lokal yo.'
      ));
    }
    return;
  }

  // ── Deadliest event ───────────────────────────────────────────────────────
  if(intent==='deadliest'){
    try{
      const url=iso3?`${API}/disasters/deadliest?iso3=${iso3}&top_n=3`:`${API}/disasters/deadliest?top_n=5`;
      const res=await fetch(url);
      const data=await res.json();
      const byDeaths=data.deadliest.slice(0,1)[0];
      const byAffected=data.most_affected.slice(0,1)[0];
      let msg='';
      if(byDeaths){
        const scope=iso3?`in <strong>${cname}</strong>`:'in the Caribbean and Central America';
        const scopeES=iso3?`en <strong>${cname}</strong>`:'en el Caribe y Centroamérica';
        const scopeFR=iso3?`à <strong>${cname}</strong>`:'dans les Caraïbes et en Amérique centrale';
        const scopeHT=iso3?`nan <strong>${cname}</strong>`:'nan Karayib ak Amerik Santral';
        msg+=ml(l,
          `The deadliest recorded event ${scope} was a <strong>${byDeaths.disaster_types}</strong>${!iso3&&byDeaths.iso3?' in <strong>'+byDeaths.iso3+'</strong>':''} (<strong>${byDeaths.year_month?.slice(0,7)||'unknown date'}</strong>) with <strong>${Math.round(byDeaths.sum_deaths).toLocaleString()}</strong> deaths.`,
          `El evento más letal registrado ${scopeES} fue una <strong>${byDeaths.disaster_types}</strong>${!iso3&&byDeaths.iso3?' en <strong>'+byDeaths.iso3+'</strong>':''} (${byDeaths.year_month?.slice(0,7)||'fecha desconocida'}) con <strong>${Math.round(byDeaths.sum_deaths).toLocaleString()}</strong> muertes.`,
          `L'événement le plus meurtrier enregistré ${scopeFR} était une <strong>${byDeaths.disaster_types}</strong>${!iso3&&byDeaths.iso3?' en <strong>'+byDeaths.iso3+'</strong>':''} (${byDeaths.year_month?.slice(0,7)||'date inconnue'}) avec <strong>${Math.round(byDeaths.sum_deaths).toLocaleString()}</strong> décès.`,
          `Evènman ki pi mòtèl ${scopeHT} te yon <strong>${byDeaths.disaster_types}</strong>${!iso3&&byDeaths.iso3?' nan <strong>'+byDeaths.iso3+'</strong>':''} (${byDeaths.year_month?.slice(0,7)||'dat enkoni'}) ak <strong>${Math.round(byDeaths.sum_deaths).toLocaleString()}</strong> mouri.`
        );
      }
      if(byAffected&&byAffected.year_month!==byDeaths?.year_month){
        msg+='<br><br>'+ml(l,
          `The event affecting the most people was a <strong>${byAffected.disaster_types}</strong>${!iso3&&byAffected.iso3?' in <strong>'+byAffected.iso3+'</strong>':''} (<strong>${byAffected.year_month?.slice(0,7)||'unknown'}</strong>) affecting <strong>${Math.round(byAffected.sum_affected).toLocaleString()}</strong> people.`,
          `El evento que afectó a más personas fue una <strong>${byAffected.disaster_types}</strong>${!iso3&&byAffected.iso3?' en <strong>'+byAffected.iso3+'</strong>':''} (<strong>${byAffected.year_month?.slice(0,7)||'desconocido'}</strong>) que afectó a <strong>${Math.round(byAffected.sum_affected).toLocaleString()}</strong> personas.`,
          `L'événement ayant touché le plus de personnes était une <strong>${byAffected.disaster_types}</strong>${!iso3&&byAffected.iso3?' en <strong>'+byAffected.iso3+'</strong>':''} (<strong>${byAffected.year_month?.slice(0,7)||'inconnu'}</strong>) touchant <strong>${Math.round(byAffected.sum_affected).toLocaleString()}</strong> personnes.`,
          `Evènman ki te afekte plis moun te yon <strong>${byAffected.disaster_types}</strong>${!iso3&&byAffected.iso3?' nan <strong>'+byAffected.iso3+'</strong>':''} (<strong>${byAffected.year_month?.slice(0,7)||'enkoni'}</strong>) ki te afekte <strong>${Math.round(byAffected.sum_affected).toLocaleString()}</strong> moun.`
        );
      }
      addMsg('bot', (msg||ml(l,'No deadliest event data found.','No se encontraron datos.','Aucune donnée trouvée.','Pa gen done.'))+DISCLAIMER+SOURCES.disasters);
    }catch{
      addMsg('bot',ml(l,'I\'m having trouble reaching that data right now.','Tengo dificultades para acceder a esos datos.','J\'ai du mal à accéder à ces données.','Mwen gen pwoblèm pou jwenn done sa yo.'));
    }
    followup('deadliest',l,cname);
    return;
  }

  // ── Displacement outflows ─────────────────────────────────────────────────
  if(intent==='displacement_out'){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/displacement/outflows?iso3=${iso3}&top_n=5`);
      const data=await res.json();
      const list=data.data.slice(0,5).map(d=>`- <strong>${d.country_asylum||d.asylum_iso3}</strong> (${Math.round(d.total_displaced).toLocaleString()} people)`).join('<br>');
      addMsg('bot',ml(l,
        `When people are displaced from <strong>${cname}</strong>, they most often go to:<br><br>${list}`,
        `Cuando las personas son desplazadas de <strong>${cname}</strong>, generalmente van a:<br><br>${list}`,
        `Quand les personnes sont déplacées de <strong>${cname}</strong>, elles vont le plus souvent vers:<br><br>${list}`,
        `Lè moun deplase soti nan <strong>${cname}</strong>, yo ale plis nan:<br><br>${list}`
      )+DISCLAIMER+SOURCES.displacement);
    }catch{
      addMsg('bot',ml(l,'I\'m having trouble reaching displacement data right now.','Tengo dificultades para acceder a los datos de desplazamiento.','J\'ai du mal à accéder aux données de déplacement.','Mwen gen pwoblèm pou jwenn done deplaseman yo.'));
    }
    followup('displacement_out',l,cname);
    return;
  }

  // ── Displacement inflows ──────────────────────────────────────────────────
  if(intent==='displacement_in'){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/displacement/inflows?iso3=${iso3}&top_n=5`);
      const data=await res.json();
      const list=data.data.slice(0,5).map(d=>`- <strong>${d.country_origin||d.origin_iso3}</strong> (${Math.round(d.total_displaced).toLocaleString()} people)`).join('<br>');
      addMsg('bot',ml(l,
        `Displaced people arriving in <strong>${cname}</strong> most often come from:<br><br>${list}`,
        `Las personas desplazadas que llegan a <strong>${cname}</strong> provienen principalmente de:<br><br>${list}`,
        `Les personnes déplacées arrivant à <strong>${cname}</strong> viennent le plus souvent de:<br><br>${list}`,
        `Moun ki deplase ki rive nan <strong>${cname}</strong> soti plis nan:<br><br>${list}`
      )+DISCLAIMER+SOURCES.displacement);
    }catch{
      addMsg('bot',ml(l,'I\'m having trouble reaching displacement data right now.','Tengo dificultades para acceder a los datos de desplazamiento.','J\'ai du mal à accéder aux données de déplacement.','Mwen gen pwoblèm pou jwenn done deplaseman yo.'));
    }
    followup('displacement_in',l,cname);
    return;
  }

  // ── Recurrence risk — no country required ────────────────────────────────
  if(intent==='recurrence_risk'){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/recurrence-risk`);
      const data=await res.json();
      const top3=data.data.slice(0,3).map((d,i)=>`${i+1}. <strong>${d.iso3}</strong> (score: ${(d.recurrence_risk_score*100).toFixed(0)}/100)`).join('<br>');
      addMsg('bot',ml(l,
        `Based on compound disaster frequency, hazard exposure, and coping capacity, the countries most prone to repeated crises in the region are:<br><br>${top3}<br><br>These scores factor in INFORM risk, disaster history, and humanitarian capacity gaps (2019–2024 data).`,
        `Basado en la frecuencia de desastres compuestos, la exposición a riesgos y la capacidad de respuesta, los países más propensos a crisis repetidas en la región son:<br><br>${top3}`,
        `Sur la base de la fréquence des catastrophes, de l'exposition aux risques et de la capacité d'adaptation, les pays les plus susceptibles de subir des crises répétées sont:<br><br>${top3}`,
        `Baze sou frekans katastwòf, ekspozisyon a risk, ak kapasite rezistans, peyi ki pi pwonn pou kriz repete yo se:<br><br>${top3}`
      )+DISCLAIMER+SOURCES.risk);
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble reaching that data right now.',
        'Tengo dificultades para acceder a esos datos.',
        'J\'ai du mal à accéder à ces données.',
        'Mwen gen pwoblèm pou jwenn done sa yo.'
      ));
    }
    followup('recurrence_risk',l,cname);
    return;
  }

  // ── Crisis escalation ───────────────────────────────────────────────────
  if(intent==='crisis'){
    // Re-detect language from message for crisis — may arrive before country is set
    if(text){const dl=detectLang(text); chatState.lang=dl;}
    const _crisisFallback=ml(l,
      'Contact local emergency services. International: Crisis Text Line, text HOME to 741741.',
      'Contacta servicios de emergencia locales. Internacional: Crisis Text Line, envía HOME al 741741.',
      "Contactez les services d'urgence locaux. International: Crisis Text Line, envoyez HOME au 741741.",
      'Kontakte sèvis ijans lokal yo. Entènasyonal: Crisis Text Line, voye HOME nan 741741.'
    );
    const crisisNum=iso3?({
      HTI:'Zanmi Lasante crisis line: +509 3701-0808 or MSF: +509 3798-3000',
      HND:'AMHON crisis: 800-7777 or emergency: 911',
      GTM:'SIAS: 1551 or emergency: 110',
      SLV:'FOSALUD: 132 or emergency: 911',
      NIC:'MINSA: 131 or emergency: 118',
      CRI:'Crisis: 800-8432-8432 or emergency: 911',
      DOM:'Emergency: 911',
      PAN:'MINSA: 169 or emergency: 911',
      JAM:'Mental health: 888-429-5752 or emergency: 119',
      CUB:'Emergency: 106',
      BHS:'Crisis: 322-2763 or emergency: 919',
      BLZ:'Emergency: 911',BRB:'Emergency: 511',GUY:'Emergency: 911',
      PRI:'Emergency: 911',SUR:'Emergency: 115',TTO:'Emergency: 999',
    }[iso3]||_crisisFallback):_crisisFallback;
    addMsg('bot',ml(l,
      `You matter, and I\'m glad you\'re still here. What you\'re feeling right now is real, and you don\'t have to face it alone.<br><br>Please reach out to someone who can help right now:<br><strong>${crisisNum}</strong><br><br>International: <strong>Crisis Text Line</strong>, text HOME to 741741 (free, 24/7)<br><br>I\'m here with you. Would you like me to find local support organizations as well?`,
      `Lo que sientes es real y tu vida importa. Por favor comunícate con alguien que pueda ayudarte:<br><strong>${crisisNum}</strong><br><br>Internacional: <strong>Crisis Text Line</strong>, envía HOME al 741741<br><br>Estoy aquí contigo. ¿Quieres que busque organizaciones de apoyo locales?`,
      `Ce que vous ressentez est réel et votre vie a de la valeur. Veuillez contacter quelqu\'un qui peut vous aider maintenant:<br><strong>${crisisNum}</strong><br><br>International: <strong>Crisis Text Line</strong>, envoyez HOME au 741741<br><br>Je suis là avec vous.`,
      `Sa ou santi a reyèl epi lavi ou enpòtan. Tanpri kontakte yon moun ki ka ede ou kounye a:<br><strong>${crisisNum}</strong><br><br>Entènasyonal: <strong>Crisis Text Line</strong>, voye HOME nan 741741<br><br>Mwen la avèk ou.`
    ));
    return;
  }

// ── Isolated / alone ─────────────────────────────────────────────────────
  if(intent==='isolated'){
    if(!iso3){
      addMsg('bot',ml(l,
        `You don't have to be alone in this. What you're feeling makes complete sense.<br><br>To connect you with support nearby, could you tell me which country you're in?`,
        `No tienes que estar solo/a en esto. Lo que sientes tiene todo el sentido.<br><br>Para conectarte con apoyo cercano, ¿podrías decirme en qué país estás?`,
        `Vous n'avez pas à être seul(e) dans tout cela. Ce que vous ressentez est tout à fait compréhensible.<br><br>Pour vous connecter à un soutien proche, pourriez-vous me dire dans quel pays vous êtes?`,
        `Ou pa bezwen poukont ou nan sa. Sa ou santi a konplètman konprann.<br><br>Pou konekte ou ak sipò ki toupre, eske ou ka di m ki peyi ou ye?`
      ));
      chatState.step='awaiting_country';
      chatState.pendingIntent='isolated';
      return;
    }
    addMsg('bot',ml(l,
      `You don\'t have to be alone in this. What you\'re feeling is completely understandable given what so many people in the region are facing.<br><br>Let me find shelter and support organizations active in <strong>${cname||'your area'}</strong> that can connect you with people and services nearby.`,
      `No tienes que estar solo/a en esto. Lo que sientes es completamente comprensible dado lo que enfrentan tantas personas en la región.<br><br>Déjame buscar organizaciones de refugio y apoyo activas en <strong>${cname||'tu área'}</strong> que puedan conectarte con personas y servicios cercanos.`,
      `Vous n\'avez pas à être seul(e) dans tout cela. Ce que vous ressentez est tout à fait compréhensible.<br><br>Laissez-moi trouver des organisations d\'abri et de soutien actives à <strong>${cname||'votre région'}</strong>.`,
      `Ou pa bezwen poukont ou nan sa. Sa ou santi a konplètman konprann.<br><br>Kite mwen jwenn òganizasyon abri ak sipò aktif nan <strong>${cname||'zòn ou'}</strong> ki ka konekte ou ak moun ak sèvis ki toupre.`
    ));
    // Also fetch shelter orgs if we have a country
    if(iso3){
      try{
        if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/sectors/orgs?iso3=${iso3}&sector=Emergency%20Shelter%20and%20NFI`);
        const data=await res.json();
        const orgs=data.data.slice(0,4).map(d=>`- ${d.dest_org}`).join('<br>');
        setTimeout(()=>addMsg('bot',ml(l,
          `Organizations providing shelter and support in <strong>${cname}</strong>:<br><br>${orgs}`,
          `Organizaciones que brindan refugio y apoyo en <strong>${cname}</strong>:<br><br>${orgs}`,
          `Organisations fournissant abri et soutien à <strong>${cname}</strong>:<br><br>${orgs}`,
          `Òganizasyon ki bay abri ak sipò nan <strong>${cname}</strong>:<br><br>${orgs}`
        )),1200);
      }catch{}
    }
    return;
  }

  // ── Sectors funding breakdown ──────────────────────────────────────────────
  if(intent==='sectors'){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/sectors${iso3?'?iso3='+iso3:''}`);
      const data=await res.json();
      const top=data.data.slice(0,5).map((d,i)=>`${i+1}. <strong>${d.sector}</strong>: $${(d.total_usd/1e6).toFixed(1)}M`).join('<br>');
      const scope=iso3?`in <strong>${cname}</strong>`:'across the region';
      addMsg('bot',ml(l,
        `Top funded sectors ${scope} (2019–2024):<br><br>${top}`,
        `Sectores más financiados ${iso3?`en <strong>${cname}</strong>`:'en la región'} (2019–2024):<br><br>${top}`,
        `Secteurs les plus financés ${iso3?`à <strong>${cname}</strong>`:'dans la région'} (2019–2024):<br><br>${top}`,
        `Sektè ki pi finanse yo ${iso3?`nan <strong>${cname}</strong>`:'nan rejyon an'} (2019–2024):<br><br>${top}`
      ));
      followup('sectors',l,cname);
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble reaching sector data right now.',
        'Tengo dificultades para acceder a los datos de sectores.',
        'J\'ai du mal à accéder aux données de secteurs.',
        'Mwen gen pwoblèm pou jwenn done sektè yo.'
      ));
    }
    return;
  }

  // ── Top funders (Fix 4) ───────────────────────────────────────────────────
  if(intent==='top_funders'){
    try{
      const tLower3=text.toLowerCase();
      const wantsOrgs=/org|ngo|organization|organisation|who.*active|active.*org|òganizasyon|organiz/.test(tLower3);
      const wantsCountries=/countr|nation|pais|país|peyi/.test(tLower3);
      // Detect year filter e.g. "in 2024", "en 2023"
      const yearMatch=text.match(/20(1[9]|2[0-4])/);
      const yearParam=yearMatch?`&year=${yearMatch[0]}`:'';
      const yearLabel=yearMatch?` in <strong>${yearMatch[0]}</strong>`:'';
      const yearLabelES=yearMatch?` en <strong>${yearMatch[0]}</strong>`:'';
      const yearLabelFR=yearMatch?` en <strong>${yearMatch[0]}</strong>`:'';
      const yearLabelHT=yearMatch?` nan <strong>${yearMatch[0]}</strong>`:'';
      const scope=iso3?`for <strong>${cname}</strong>`:'across the region';
      const scopeES=iso3?`para <strong>${cname}</strong>`:'en la región';
      const scopeFR=iso3?`pour <strong>${cname}</strong>`:'dans la région';
      const scopeHT=iso3?`pou <strong>${cname}</strong>`:'nan rejyon an';
      if(wantsOrgs||(!wantsCountries)){
        // Top destination organizations by funding
        const url=iso3?`${API}/orgs?iso3=${iso3}&top_n=5${yearParam}`:`${API}/orgs?top_n=5${yearParam}`;
        const res=await fetch(url);
        const data=await res.json();
        const list=data.data.slice(0,5).map((d,i)=>`${i+1}. <strong>${d.dest_org||'Unknown'}</strong> ($${(d.total_usd/1e6).toFixed(1)}M)`).join('<br>');
        addMsg('bot',ml(l,
          `Top funded humanitarian organizations ${scope}${yearLabel} (2019–2024):<br><br>${list}`,
          `Organizaciones humanitarias más financiadas ${scopeES}${yearLabelES} (2019–2024):<br><br>${list}`,
          `Organisations humanitaires les plus financées ${scopeFR} (2019–2024):<br><br>${list}`,
          `Òganizasyon imanitè ki pi finanse yo ${scopeHT} (2019–2024):<br><br>${list}`
        )+DISCLAIMER+SOURCES.funding);
      } else {
        // Top destination countries by actual funding received
        if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/allocation/summary${yearMatch?'?year='+yearMatch[0]:''}`);
        const data=await res.json();
        const rows=data.data.slice(0,5).sort((a,b)=>b.actual_usd-a.actual_usd);
        const list=rows.map((d,i)=>`${i+1}. <strong>${d.iso3}</strong> ($${(d.actual_usd/1e6).toFixed(1)}M received)`).join('<br>');
        addMsg('bot',ml(l,
          `Countries receiving the most humanitarian funding ${scope}${yearLabel} (2019–2024):<br><br>${list}`,
          `Países que reciben más financiamiento humanitario ${scopeES}${yearLabelES} (2019–2024):<br><br>${list}`,
          `Pays recevant le plus de financement humanitaire ${scopeFR} (2019–2024):<br><br>${list}`,
          `Peyi ki resevwa plis finansman imanitè yo ${scopeHT} (2019–2024):<br><br>${list}`
        )+DISCLAIMER+SOURCES.funding);
      }
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble reaching funding data right now.',
        'Tengo dificultades para acceder a los datos de financiamiento.',
        'J\'ai du mal à accéder aux données de financement.',
        'Mwen gen pwoblèm pou jwenn done finansman yo.'
      ));
    }
    followup('top_funders',l,cname);
    return;
  }

// ── Allocation summary (Item 11) ─────────────────────────────────────────
  if(intent==='allocation'){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const yearMatch=text.match(/20(1[9]|2[0-4])/);
      const res=await fetchWithTimeout(`${API}/allocation/summary${yearMatch?'?year='+yearMatch[0]:''}`);
      const data=await res.json();
      let rows=data.data;
      if(iso3){
        const country=rows.find(r=>r.iso3===iso3);
        if(country){
          const gap=country.delta_usd;
          const status=gap>0?ml(l,'under-allocated','sub-financiado','sous-financé','anba-finanse'):ml(l,'over-allocated','sobre-financiado','sur-financé','sou-finanse');
          const gapFmt=`$${(Math.abs(gap)/1e6).toFixed(1)}M`;
          addMsg('bot',ml(l,
            `<strong>${cname}</strong> is <strong>${status}</strong> by ${gapFmt} (2019–2024).<br><br>Actual: $${(country.actual_usd/1e6).toFixed(1)}M &nbsp;·&nbsp; Optimal: $${(country.optimal_usd/1e6).toFixed(1)}M<br><br>${gap>0?cname+' receives less than the model recommends given its need score, disaster exposure, and displacement levels.':cname+' receives more than the model recommends relative to comparable countries.'}`,
            `<strong>${cname}</strong> está <strong>${status}</strong> en ${gapFmt} (2019–2024).<br><br>Real: $${(country.actual_usd/1e6).toFixed(1)}M &nbsp;·&nbsp; Óptimo: $${(country.optimal_usd/1e6).toFixed(1)}M`,
            `<strong>${cname}</strong> est <strong>${status}</strong> de ${gapFmt} (2019–2024).<br><br>Réel: $${(country.actual_usd/1e6).toFixed(1)}M &nbsp;·&nbsp; Optimal: $${(country.optimal_usd/1e6).toFixed(1)}M`,
            `<strong>${cname}</strong> se <strong>${status}</strong> pa ${gapFmt} (2019–2024).<br><br>Reyèl: $${(country.actual_usd/1e6).toFixed(1)}M &nbsp;·&nbsp; Optimal: $${(country.optimal_usd/1e6).toFixed(1)}M`
          )+DISCLAIMER+SOURCES.allocation);
        } else {
          addMsg('bot',ml(l,`No allocation data found for <strong>${cname}</strong>.`,`No se encontraron datos para <strong>${cname}</strong>.`,`Aucune donnée pour <strong>${cname}</strong>.`,`Pa gen done pou <strong>${cname}</strong>.`));
        }
      } else {
        const under=rows.filter(r=>r.delta_usd>0).slice(0,3)
          .map((r,i)=>`${i+1}. <strong>${r.iso3}</strong>: underfunded by $${(r.delta_usd/1e6).toFixed(1)}M`).join('<br>');
        addMsg('bot',ml(l,
          `Most underfunded countries in the region (2019–2024):<br><br>${under}<br><br>These gaps are based on need scores, disaster exposure, and displacement levels across the region.`,
          `Países más sub-financiados en la región (2019–2024):<br><br>${under}`,
          `Pays les plus sous-financés (2019–2024):<br><br>${under}`,
          `Peyi ki pi anba-finanse (2019–2024):<br><br>${under}`
        )+DISCLAIMER+SOURCES.allocation);
      }
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble reaching allocation data right now.',
        'Tengo dificultades para acceder a los datos de asignación.',
        'J\'ai du mal à accéder aux données d\'allocation.',
        'Mwen gen pwoblèm pou jwenn done yo.'
      ));
    }
    followup('allocation',l,cname);
    return;
  }

  // ── Emergency ─────────────────────────────────────────────────────────────
  if(intent==='emergency'){
    if(!iso3){
      addMsg('bot',ml(l,
        `🚨 If this is a life-threatening emergency, contact your local emergency services immediately.<br><br>To find active humanitarian organizations near you, which country are you in?`,
        `🚨 Si es una emergencia que pone en peligro la vida, contacta los servicios de emergencia locales inmediatamente.<br><br>Para encontrar organizaciones activas cerca de ti, ¿en qué país estás?`,
        `🚨 S'il s'agit d'une urgence mettant la vie en danger, contactez immédiatement les services d'urgence locaux.<br><br>Pour trouver des organisations actives près de vous, dans quel pays êtes-vous?`,
        `🚨 Si se yon ijans ki mete lavi an danje, kontakte sèvis ijans lokal yo imedyatman.<br><br>Pou jwenn òganizasyon aktif toupre ou, ki peyi ou ye?`
      ));
      chatState.step='awaiting_country';
      chatState.pendingIntent='emergency';
      return;
    }
    const num=EMERGENCY_NUMBERS[iso3]||'local emergency services';
    // Lead with emergency number first
    addMsg('bot',ml(l,
      `🚨 <strong>If this is a life-threatening emergency, call <strong>${num}</strong> now.</strong><br><br>I'm also looking up active organizations in <strong>${cname}</strong>...`,
      `🚨 <strong>Si es una emergencia que pone en peligro la vida, llama al <strong>${num}</strong> ahora.</strong><br><br>También estoy buscando organizaciones activas en <strong>${cname}</strong>...`,
      `🚨 <strong>S'il s'agit d'une urgence mettant la vie en danger, appelez le <strong>${num}</strong> maintenant.</strong><br><br>Je recherche aussi les organisations actives à <strong>${cname}</strong>...`,
      `🚨 <strong>Si se yon ijans ki mete lavi an danje, rele <strong>${num}</strong> kounye a.</strong><br><br>Mwen ap chèche òganizasyon aktif nan <strong>${cname}</strong>...`
    ));
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/orgs?iso3=${iso3}&top_n=5`);
      const data=await res.json();
      const orgs=data.data.slice(0,5).map(d=>`- ${d.dest_org}`).join('<br>');
      setTimeout(()=>addMsg('bot',ml(l,
        `Most active humanitarian organizations in <strong>${cname}</strong>:<br><br>${orgs}<br><br>What do you need? Food · Water · Shelter · Medical`,
        `Organizaciones humanitarias más activas en <strong>${cname}</strong>:<br><br>${orgs}<br><br>¿Qué necesitas? Comida · Agua · Refugio · Médico`,
        `Organisations humanitaires les plus actives à <strong>${cname}</strong>:<br><br>${orgs}<br><br>Que vous faut-il? Nourriture · Eau · Abri · Médical`,
        `Òganizasyon imanitè ki pi aktif nan <strong>${cname}</strong>:<br><br>${orgs}<br><br>Kisa ou bezwen? Manje · Dlo · Abri · Medikal`
      )),1000);
    }catch{}
    return;
  }

  // ── Sector intents (food / water / shelter / hygiene / education) ──────────
  const sector=SECTOR_MAP[intent];
  if(sector){
    try{
      if(!_rateOk()){addMsg('bot',ml(chatState.lang||lang||'en','You\'re sending requests too quickly. Please wait a moment before trying again.','Estás enviando solicitudes muy rápido. Por favor espera un momento.','Vous envoyez des requêtes trop rapidement. Veuillez patienter.','Ou ap voye demann twò vit. Tanpri tann yon moman.')); return;}
      const res=await fetchWithTimeout(`${API}/sectors/orgs?iso3=${iso3}&sector=${encodeURIComponent(sector)}`);
      const data=await res.json();
      const orgs=data.data.slice(0,5).map(d=>`- ${d.dest_org} ($${(d.total_usd/1e6).toFixed(1)}M)`).join('<br>');
      const label={food:ml(l,'food','alimentación','alimentation','manje'),water:ml(l,'water & sanitation','agua y saneamiento','eau et assainissement','dlo ak sanitasyon'),shelter:ml(l,'shelter','refugio','abri','abri'),hygiene:ml(l,'hygiene','higiene','hygiène','ijyèn'),health:ml(l,'health','salud','santé','sante'),education:ml(l,'education','educación','éducation','edikasyon')}[intent];
      addMsg('bot',ml(l,
        `Organizations providing <strong>${label}</strong> support in <strong>${cname}</strong>:<br><br>${orgs}<br><br>Is there anything else I can help you find?`,
        `Organizaciones que brindan apoyo de <strong>${label}</strong> en <strong>${cname}</strong>:<br><br>${orgs}<br><br>¿Hay algo más en lo que pueda ayudarte?`,
        `Organisations fournissant un soutien en <strong>${label}</strong> à <strong>${cname}</strong>:<br><br>${orgs}<br><br>Y a-t-il autre chose que je peux vous aider à trouver?`,
        `Òganizasyon ki bay sipò <strong>${label}</strong> nan <strong>${cname}</strong>:<br><br>${orgs}<br><br>Eske gen lòt bagay mwen ka ede ou jwenn?`
      )+DISCLAIMER+SOURCES.funding);
      followup(intent,l,cname);
    }catch{
      addMsg('bot',ml(l,
        'I\'m having trouble connecting to the data right now. Please try again in a moment.',
        'Tengo dificultades para conectarme. Por favor intenta de nuevo.',
        'J\'ai du mal à me connecter aux données. Veuillez réessayer.',
        'Mwen gen pwoblèm pou konekte. Tanpri eseye ankò.'
      ));
    }
    return;
  }

  // ── Trend (Item 13) — year-over-year comparison ────────────────────────────
  if(intent==='trend'){
    // Detect which years are mentioned, default to 2021 vs 2023
    const years=text.match(/20(1[9]|2[0-4])/g);
    const y1=years?parseInt(years[0]):2021;
    const y2=years&&years.length>1?parseInt(years[1]):2023;
    const trendTopic=
      /disaster|flood|storm|hurricane/.test(text.toLowerCase())?'disasters':
      /displace|migra|refuge|flee/.test(text.toLowerCase())?'displacement':
      /fund|money|donor|aid/.test(text.toLowerCase())?'funding':'disasters';

    try{
      let msg='';
      if(trendTopic==='disasters'&&iso3){
        const [r1,r2]=await Promise.all([
          fetchWithTimeout(`${API}/disasters?iso3=${iso3}&year=${y1}`).then(r=>r.json()),
          fetchWithTimeout(`${API}/disasters?iso3=${iso3}&year=${y2}`).then(r=>r.json()),
        ]);
        const e1=r1.count||0, e2=r2.count||0;
        const dir=e2>e1?ml(l,'increased','aumentó','a augmenté','ogmante'):e2<e1?ml(l,'decreased','disminuyó','a diminué','diminye'):ml(l,'stayed the same','se mantuvo igual','est resté stable','rete menm');
        const pct=e1>0?Math.abs(((e2-e1)/e1)*100).toFixed(0)+'%':'N/A';
        msg=ml(l,
          `Disaster events in <strong>${cname}</strong>: <strong>${e1}</strong> in ${y1} → <strong>${e2}</strong> in ${y2} (${dir}, ${pct} change).<br><br>This is based on EM-DAT event records for the region.`,
          `Eventos de desastre en <strong>${cname}</strong>: <strong>${e1}</strong> en ${y1} → <strong>${e2}</strong> en ${y2} (${dir}, ${pct} de cambio).`,
          `Événements catastrophiques à <strong>${cname}</strong>: <strong>${e1}</strong> en ${y1} → <strong>${e2}</strong> en ${y2} (${dir}, ${pct} de changement).`,
          `Evènman katastwòf nan <strong>${cname}</strong>: <strong>${e1}</strong> nan ${y1} → <strong>${e2}</strong> nan ${y2} (${dir}, ${pct} chanjman).`
        );
      } else if(trendTopic==='funding'&&iso3){
        const [r1,r2]=await Promise.all([
          fetchWithTimeout(`${API}/allocation?iso3=${iso3}&year=${y1}`).then(r=>r.json()),
          fetchWithTimeout(`${API}/allocation?iso3=${iso3}&year=${y2}`).then(r=>r.json()),
        ]);
        const f1=r1.data?.reduce((s,d)=>s+(d.funding_usd||0),0)||0;
        const f2=r2.data?.reduce((s,d)=>s+(d.funding_usd||0),0)||0;
        const dir=f2>f1?ml(l,'increased','aumentó','a augmenté','ogmante'):f2<f1?ml(l,'decreased','disminuyó','a diminué','diminye'):ml(l,'stayed the same','se mantuvo igual','est resté stable','rete menm');
        msg=ml(l,
          `Humanitarian funding in <strong>${cname}</strong>: $${(f1/1e6).toFixed(1)}M in ${y1} → $${(f2/1e6).toFixed(1)}M in ${y2} (${dir}).`,
          `Financiamiento humanitario en <strong>${cname}</strong>: $${(f1/1e6).toFixed(1)}M en ${y1} → $${(f2/1e6).toFixed(1)}M en ${y2} (${dir}).`,
          `Financement humanitaire à <strong>${cname}</strong>: $${(f1/1e6).toFixed(1)}M en ${y1} → $${(f2/1e6).toFixed(1)}M en ${y2} (${dir}).`,
          `Finansman imanitè nan <strong>${cname}</strong>: $${(f1/1e6).toFixed(1)}M nan ${y1} → $${(f2/1e6).toFixed(1)}M nan ${y2} (${dir}).`
        );
      } else if(iso3){
        // Has country but no specific years — show funding trend across all years
        const rAll=await fetchWithTimeout(`${API}/allocation?iso3=${iso3}`).then(r=>r.json());
        const byYear={};
        (rAll.data||[]).forEach(d=>{ byYear[d.year]=(byYear[d.year]||0)+(d.funding_usd||0); });
        const yearRows=Object.entries(byYear).sort((a,b)=>a[0]-b[0]);
        if(yearRows.length>1){
          const rows=yearRows.map(([y,v])=>`${y}: $${(v/1e6).toFixed(1)}M`).join(' · ');
          const first=yearRows[0][1], last=yearRows[yearRows.length-1][1];
          const dir=last>first?ml(l,'increased','aumentó','a augmenté','ogmante'):ml(l,'decreased','disminuyó','a diminué','diminye');
          msg=ml(l,
            `Humanitarian funding in <strong>${cname}</strong> has <strong>${dir}</strong> overall (2019–2024):<br><br>${rows}`,
            `El financiamiento humanitario en <strong>${cname}</strong> ha <strong>${dir}</strong> en general (2019–2024):<br><br>${rows}`,
            `Le financement humanitaire à <strong>${cname}</strong> a <strong>${dir}</strong> en général (2019–2024):<br><br>${rows}`,
            `Finansman imanitè nan <strong>${cname}</strong> te <strong>${dir}</strong> an jeneral (2019–2024):<br><br>${rows}`
          );
        } else {
          msg=ml(l,`No trend data found for <strong>${cname}</strong>.`,`No se encontraron datos de tendencia para <strong>${cname}</strong>.`,`Aucune donnée de tendance pour <strong>${cname}</strong>.`,`Pa gen done tandans pou <strong>${cname}</strong>.`);
        }
      } else {
        msg=ml(l,
          `To compare trends, tell me a country and two years (e.g. "Has disaster activity in Haiti increased from 2020 to 2023?").`,
          `Para comparar tendencias, dime un país y dos años (ej. "¿Han aumentado los desastres en Haití de 2020 a 2023?").`,
          `Pour comparer des tendances, dites-moi un pays et deux années.`,
          `Pou konpare tandans, di m yon peyi ak de ane.`
        );
      }
      addMsg('bot', msg);
    }catch{
      addMsg('bot',ml(l,
        "I\'m having trouble comparing that data right now.",
        'Tengo dificultades para comparar esos datos.',
        "J\'ai du mal à comparer ces données.",
        'Mwen gen pwoblèm pou konpare done sa yo.'
      ));
    }
    followup('trend',l,cname);
    return;
  }

  // ── Compare (Item 14) — two countries side by side ───────────────────────
  if(intent==='compare'){
    // Try to detect two countries in the message
    const allMatches=[];
    const tLower2=text.toLowerCase();
    for(const c of COUNTRIES){
      if(tLower2.includes(c.name.toLowerCase())||tLower2.includes(c.iso3.toLowerCase()))
        allMatches.push(c);
    }
    const c1=allMatches[0]||{iso3,name:cname};
    const c2=allMatches[1]||null;
    if(!c2){
      addMsg('bot',ml(l,
        `Which two countries would you like to compare? You can ask about funding, disasters, or displacement.`,
        `¿Qué dos países quieres comparar? Puedes preguntar sobre financiamiento, desastres o desplazamiento.`,
        `Quels deux pays souhaitez-vous comparer? Vous pouvez poser des questions sur le financement, les catastrophes ou les déplacements.`,
        `Ki de peyi ou vle konpare? Ou ka mande sou finansman, katastwòf oswa deplasaman.`
      ));
      return;
    }
    const compareTopic=
      /disaster|flood|storm/.test(tLower2)?'disasters':
      /displace|migra|refuge/.test(tLower2)?'displacement':
      'funding';
    try{
      let msg='';
      if(compareTopic==='funding'){
        const [r1,r2]=await Promise.all([
          fetchWithTimeout(`${API}/allocation/summary`).then(r=>r.json()),
          fetchWithTimeout(`${API}/allocation/summary`).then(r=>r.json()),
        ]);
        const d1=r1.data?.find(d=>d.iso3===c1.iso3);
        const d2=r1.data?.find(d=>d.iso3===c2.iso3);
        if(d1&&d2){
          msg=ml(l,
            `<strong>Funding comparison (2019–2024):</strong><br><br><strong>${c1.name}</strong>: $${(d1.actual_usd/1e6).toFixed(1)}M actual · $${(d1.optimal_usd/1e6).toFixed(1)}M optimal · ${d1.delta_usd>0?'underfunded':'overfunded'} by $${(Math.abs(d1.delta_usd)/1e6).toFixed(1)}M<br><strong>${c2.name}</strong>: $${(d2.actual_usd/1e6).toFixed(1)}M actual · $${(d2.optimal_usd/1e6).toFixed(1)}M optimal · ${d2.delta_usd>0?'underfunded':'overfunded'} by $${(Math.abs(d2.delta_usd)/1e6).toFixed(1)}M`,
            `<strong>Comparación de financiamiento (2019–2024):</strong><br><br><strong>${c1.name}</strong>: $${(d1.actual_usd/1e6).toFixed(1)}M real · ${d1.delta_usd>0?'sub-financiado':'sobre-financiado'} en $${(Math.abs(d1.delta_usd)/1e6).toFixed(1)}M<br><strong>${c2.name}</strong>: $${(d2.actual_usd/1e6).toFixed(1)}M real · ${d2.delta_usd>0?'sub-financiado':'sobre-financiado'} en $${(Math.abs(d2.delta_usd)/1e6).toFixed(1)}M`,
            `<strong>Comparaison du financement (2019–2024):</strong><br><br><strong>${c1.name}</strong>: $${(d1.actual_usd/1e6).toFixed(1)}M réel · ${d1.delta_usd>0?'sous-financé':'sur-financé'} de $${(Math.abs(d1.delta_usd)/1e6).toFixed(1)}M<br><strong>${c2.name}</strong>: $${(d2.actual_usd/1e6).toFixed(1)}M réel · ${d2.delta_usd>0?'sous-financé':'sur-financé'} de $${(Math.abs(d2.delta_usd)/1e6).toFixed(1)}M`,
            `<strong>Konparezon finansman (2019–2024):</strong><br><br><strong>${c1.name}</strong>: $${(d1.actual_usd/1e6).toFixed(1)}M reyèl · ${d1.delta_usd>0?'anba-finanse':'sou-finanse'} pa $${(Math.abs(d1.delta_usd)/1e6).toFixed(1)}M<br><strong>${c2.name}</strong>: $${(d2.actual_usd/1e6).toFixed(1)}M reyèl · ${d2.delta_usd>0?'anba-finanse':'sou-finanse'} pa $${(Math.abs(d2.delta_usd)/1e6).toFixed(1)}M`
          );
        }
      } else if(compareTopic==='disasters'){
        const [r1,r2]=await Promise.all([
          fetchWithTimeout(`${API}/disasters/most-common?iso3=${c1.iso3}`).then(r=>r.json()),
          fetchWithTimeout(`${API}/disasters/most-common?iso3=${c2.iso3}`).then(r=>r.json()),
        ]);
        const top1=r1.data?.slice(0,2).map(d=>d.disaster_type).join(', ')||'N/A';
        const top2=r2.data?.slice(0,2).map(d=>d.disaster_type).join(', ')||'N/A';
        msg=ml(l,
          `<strong>Most common disasters (2019–2024):</strong><br><br><strong>${c1.name}</strong>: ${top1}<br><strong>${c2.name}</strong>: ${top2}`,
          `<strong>Desastres más comunes (2019–2024):</strong><br><br><strong>${c1.name}</strong>: ${top1}<br><strong>${c2.name}</strong>: ${top2}`,
          `<strong>Catastrophes les plus fréquentes (2019–2024):</strong><br><br><strong>${c1.name}</strong>: ${top1}<br><strong>${c2.name}</strong>: ${top2}`,
          `<strong>Katastwòf ki pi komen (2019–2024):</strong><br><br><strong>${c1.name}</strong>: ${top1}<br><strong>${c2.name}</strong>: ${top2}`
        );
      }
      if(msg) addMsg('bot', msg);
      else addMsg('bot',ml(l,
        `I\'m not sure what to compare. Try asking about two countries, like: funding, disasters, or displacement between any two countries in the region.`,
        `No estoy seguro de qué comparar. Intenta: "Comparar Haití y Honduras en financiamiento".`,
        `Je ne sais pas quoi comparer. Essayez: "Comparer Haïti et Honduras sur le financement".`,
        `Mwen pa sèten kisa pou konpare. Eseye: "Konpare Ayiti ak Ondiras sou finansman".`
      ));
    }catch{
      addMsg('bot',ml(l,
        "I\'m having trouble comparing that data right now.",
        'Tengo dificultades para comparar esos datos.',
        "J\'ai du mal à comparer ces données.",
        'Mwen gen pwoblèm pou konpare done sa yo.'
      ));
    }
    followup('compare',l,cname);
    return;
  }

  // ── Meta: what languages do you speak ─────────────────────────────────────
  if(intent==='meta_languages'){
    addMsg('bot',ml(l,
      `I speak <strong>English, Spanish, French, and Haitian Creole</strong>. You can switch languages at any time by saying "en español", "en français", "in english", or "kreyòl".`,
      `Hablo <strong>inglés, español, francés y creole haitiano</strong>. Puedes cambiar de idioma en cualquier momento diciendo "en español", "en français", "in english" o "kreyòl".`,
      `Je parle <strong>anglais, espagnol, français et créole haïtien</strong>. Vous pouvez changer de langue à tout moment en disant "en español", "en français", "in english" ou "kreyòl".`,
      `Mwen pale <strong>anglè, espanyòl, fransè ak kreyòl ayisyen</strong>. Ou ka chanje lang nenpòt ki lè lè ou di "en español", "en français", "in english" oswa "kreyòl".`
    ));
    return;
  }

  // ── Meta: what countries are in your data ────────────────────────────────
  if(intent==='meta_countries'){
    const countryList='Bahamas (BHS), Belize (BLZ), Barbados (BRB), Costa Rica (CRI), Cuba (CUB), Dominican Republic (DOM), Guatemala (GTM), Guyana (GUY), Honduras (HND), Haiti (HTI), Jamaica (JAM), Nicaragua (NIC), Panama (PAN), Puerto Rico (PRI), El Salvador (SLV), Suriname (SUR), Trinidad & Tobago (TTO)';
    addMsg('bot',ml(l,
      `My data covers <strong>17 countries</strong> in the Caribbean and Central America (2019–2024):<br><br>${countryList}`,
      `Mis datos cubren <strong>17 países</strong> del Caribe y Centroamérica (2019–2024):<br><br>${countryList}`,
      `Mes données couvrent <strong>17 pays</strong> des Caraïbes et d'Amérique centrale (2019–2024):<br><br>${countryList}`,
      `Done mwen yo kouvri <strong>17 peyi</strong> nan Karayib ak Amerik Santral (2019–2024):<br><br>${countryList}`
    ));
    return;
  }

  // ── Meta: data sources ───────────────────────────────────────────────────
  if(intent==='meta_sources'){
    addMsg('bot',ml(l,
      `Ávila's answers are powered by four humanitarian datasets (2019–2024):<br><br><strong>OCHA FTS:</strong> humanitarian funding flows, donor countries, and sector allocations<br><strong>EM-DAT:</strong> disaster events, deaths, and people affected<br><strong>UNHCR:</strong> refugee and displacement flows between countries<br><strong>INFORM:</strong> country-level risk scores, hazard exposure, and coping capacity<br><br>Allocation gaps are estimated using a linear programming model that compares actual funding against need-weighted optimal distribution.`,
      `Las respuestas de Ávila se basan en cuatro conjuntos de datos humanitarios (2019–2024):<br><br><strong>OCHA FTS:</strong> flujos de financiamiento humanitario, países donantes y asignaciones por sector<br><strong>EM-DAT:</strong> eventos de desastre, muertes y personas afectadas<br><strong>UNHCR:</strong> flujos de refugiados y desplazamiento entre países<br><strong>INFORM:</strong> puntuaciones de riesgo, exposición a peligros y capacidad de respuesta<br><br>Las brechas de asignación se estiman comparando el financiamiento real con una distribución óptima ponderada por necesidad.`,
      `Les réponses d'Ávila sont alimentées par quatre ensembles de données humanitaires (2019–2024):<br><br><strong>OCHA FTS:</strong> flux de financement humanitaire<br><strong>EM-DAT:</strong> événements catastrophiques, décès et personnes touchées<br><strong>UNHCR:</strong> flux de déplacement entre pays<br><strong>INFORM:</strong> scores de risque et capacités d'adaptation`,
      `Repons Ávila yo baze sou kat done imanitè (2019–2024):<br><br><strong>OCHA FTS:</strong> finansman imanitè ak sektè<br><strong>EM-DAT:</strong> katastwòf, mouri, ak moun afekte<br><strong>UNHCR:</strong> deplasaman ant peyi<br><strong>INFORM:</strong> risk, ekspozisyon, ak kapasite rezistans`
    ));
    return;
  }

  // ── Other language fallback ───────────────────────────────────────────────
  const isUnknownLang = !['en','es','fr','ht'].includes(l);
  if(isUnknownLang){
    addMsg('bot','I can help in English, Spanish or French. / Puedo ayudar en inglés, español o francés. / Je peux aider en anglais, en espagnol ou en français.<br><br>For local support, contact your nearest humanitarian office.');
    return;
  }

  addMsg('bot',ml(l,
    `I can help with food, water, shelter, hygiene, education, or emergency resources in <strong>${cname}</strong>. What do you need?`,
    `Puedo ayudar con comida, agua, refugio, higiene, educación o recursos de emergencia en <strong>${cname}</strong>. ¿Qué necesitas?`,
    `Je peux aider avec la nourriture, l'eau, l'abri, l'hygiène, l'éducation ou les urgences à <strong>${cname}</strong>. Que voulez-vous?`,
    `Mwen ka ede ak manje, dlo, abri, ijyèn, edikasyon oswa resous ijans nan <strong>${cname}</strong>. Kisa ou bezwen?`
  ));
}

function showCountryBanner(name){
  const b=document.getElementById('countryBanner');
  const l=chatState.lang||lang||'en';
  document.getElementById('bannerText').textContent=ml(l,
    `Showing resources for: ${name}`,
    `Mostrando recursos para: ${name}`,
    `Ressources pour: ${name}`,
    `Resous pou: ${name}`
  );
  b.classList.add('visible');
}

function clearCountry(){
  chatState.country=null;
  chatState.countryName=null;
  chatState.step='awaiting_country';
  chatState.lang=null;
  document.getElementById('countryBanner').classList.remove('visible');
}

function resetChat(){
  // Clear state
  chatState={step:'greeting',country:null,countryName:null,lang:null};
  document.getElementById('countryBanner').classList.remove('visible');
  // Clear messages and restart greeting
  document.getElementById('chatMessages').innerHTML='';
  const l=lang||'en';
  setTimeout(()=>{
    addMsg('bot',ml(l,
      "Hi, I'm Ávila. I'm here to help you find humanitarian resources in the Caribbean and Central America.<br><br>Which country are you in right now?",
      "Hola, soy Ávila. Estoy aquí para ayudarte a encontrar recursos humanitarios en el Caribe y Centroamérica.<br><br>¿En qué país estás ahora mismo?",
      "Bonjour, je suis Ávila. Je suis ici pour vous aider à trouver des ressources humanitaires dans les Caraïbes et en Amérique centrale.<br><br>Dans quel pays êtes-vous?",
      "Bonjou, mwen se Ávila. Mwen la pou ede ou jwenn resous imanitè nan Karayib ak Amerik Santral.<br><br>Ki peyi ou ye kounye a?"
    ));
    chatState.step='awaiting_country';
    chatState.greeted=true;
  },200);
}

// STAT COUNTER ANIMATION
function animateCounter(el){
  const target=parseFloat(el.getAttribute('data-target'));
  const prefix=el.getAttribute('data-prefix')||'';
  const suffix=el.getAttribute('data-suffix')||'';
  const useComma=el.getAttribute('data-comma')==='true';
  const isDecimal=target%1!==0;
  const duration=1800;
  const start=performance.now();
  function format(v){
    if(isDecimal) return prefix+v.toFixed(1)+suffix;
    const n=Math.round(v);
    return prefix+(useComma?n.toLocaleString():n)+suffix;
  }
  function tick(now){
    const elapsed=now-start;
    const progress=Math.min(elapsed/duration,1);
    // ease out expo
    const eased=progress===1?1:1-Math.pow(2,-10*progress);
    el.textContent=format(target*eased);
    if(progress<1) requestAnimationFrame(tick);
    else el.textContent=format(target);
  }
  requestAnimationFrame(tick);
}

const statEls=document.querySelectorAll('.stat-num[data-target]');
let statsAnimated=false;
const statObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!statsAnimated){
      statsAnimated=true;
      statEls.forEach((el,i)=>setTimeout(()=>animateCounter(el),i*120));
      statObs.disconnect();
    }
  });
},{threshold:0.3});
if(statEls.length) statObs.observe(statEls[0].closest('.about-stats'));