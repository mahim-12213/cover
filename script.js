const $=id=>document.getElementById(id);
const C=['type','style','accent','dept','courseTitle','courseCode','topicNo','topicName','expDate','subDate','name','id','session','yearSem','section','members','teacherName','designation','teacherDept','boxUpC'];
const X=['idxStyle','idxAccent','idxFS','idxRH','rowCount','idxBox','boxUpI'];
const MIR=[['dept','idxDepartment'],['courseTitle','idxCourse'],['courseCode','idxCode'],['name','iName'],['id','iId'],['session','iSession'],['section','iSection'],['teacherName','iTeacher'],['designation','iDesig'],['teacherDept','iTDept']];
const ALL=C.concat(X),DEF={};ALL.forEach(k=>DEF[k]=$(k).value);
const COLS0=[{k:'sl',t:'SL No',on:true},{k:'name',t:'Experiment / Topic Name',on:true},{k:'exp',t:'Date of Experiment',on:false},{k:'sub',t:'Date of Submission',on:false},{k:'page',t:'Page No',on:true},{k:'rem',t:'Remarks',on:false}];
const W={sl:9,name:46,exp:16,sub:16,page:14,rem:20},KEY='jstuCover6';
const LOGO=window.LOGO||'assets/logo.jpg',UNI='Jamalpur Science &amp; Technology University';
let rows=[],cols=JSON.parse(JSON.stringify(COLS0)),active='cover',idxLogo=LOGO;
const val=k=>$(k).value.trim();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fdL=v=>v?new Date(v+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):'';
const fdS=v=>v?new Date(v+'T00:00').toLocaleDateString('en-GB'):'';
const fitFs=(len,max,width)=>Math.max(12,Math.min(max,Math.floor(width/(Math.max(len,1)*0.53))));

function boxesHTML(){
  const mem=val('members')?val('members').split('\n').filter(Boolean).map(esc).join('\n'):'';
  const L=t=>t?`<div>${t}</div>`:'';
  const ys=[esc(val('yearSem')),val('section')&&'Section: '+esc(val('section'))].filter(Boolean).join(', ');
  return `<div class="box"><h4>Submitted by :</h4><div class="nm">${esc(val('name'))}</div>
    ${L(val('id')&&'ID: '+esc(val('id')))}${L(val('session')&&'Session: '+esc(val('session')))}${L(ys)}${mem?`<small>${mem}</small>`:''}<div>${esc(val('dept'))}</div><div>${UNI}</div></div>
  <div class="box"><h4>Submitted to :</h4><div class="nm">${esc(val('teacherName'))}</div>
    ${L(val('designation')&&esc(val('designation')))}<div>${esc(val('teacherDept'))}</div><div>${UNI}</div></div>`;
}
function renderCover(){
  const v={};C.forEach(k=>v[k]=val(k));const lab=v.type==='lab';
  $('noLabel').textContent=lab?'Experiment No':'Assignment No';
  $('nameLabel').textContent=lab?'Experiment Name':'Assignment Title';
  document.querySelectorAll('.labonly').forEach(e=>e.style.display=lab?'':'none');
  const c=$('cover');c.className='page '+v.style;c.style.setProperty('--ac',v.accent);
  const exp=[v.topicNo&&(lab?'Experiment No: ':'Assignment No: ')+esc(v.topicNo),(lab?'Experiment Name: ':'Assignment Title: ')+esc(v.topicName)].filter(Boolean);
  const up=+v.boxUpC||0;$('bcL').textContent=up+' px';
  c.innerHTML=`
  <div class="dept" style="font-size:${fitFs(v.dept.length,30,v.style==='border'?640:660)}px">${esc(v.dept)}</div><div class="uni">${UNI}</div>
  <img class="logo" src="${LOGO}" alt=""><div class="type">${lab?'Lab Report':'Assignment'}</div>
  <div class="main"><div>Course Name: ${esc(v.courseTitle)}</div><div>Course Code: ${esc(v.courseCode)}</div><div class="exp">${exp.join('<br>')}</div></div>
  <div class="two" style="margin-top:${Math.max(0,64-up)}px">${boxesHTML()}</div>
  <div class="dates">${lab&&v.expDate?`<div>Date of Experiment : ${fdL(v.expDate)}</div>`:''}${v.subDate?`<div>Submission Date : ${fdL(v.subDate)}</div>`:''}</div>`;
}
function renderIndex(){
  const el=$('index'),on=cols.filter(c=>c.on),tot=on.reduce((a,c)=>a+W[c.k],0),rh=+$('idxRH').value,fs=+$('idxFS').value,up=+$('boxUpI').value||0,show=$('idxBox').value==='1';
  el.style.setProperty('--ac',$('idxAccent').value);el.style.setProperty('--bc',$('accent').value);el.style.setProperty('--fs',fs+'px');el.style.setProperty('--rh',rh+'px');
  $('fsL').textContent=fs+' px';$('rhL').textContent=rh+' px';$('biL').textContent=up+' px';
  const dept=val('idxDepartment'),course=val('idxCourse'),code=val('idxCode');
  const cell=(c,r,i)=>c.k==='sl'?String(i+1).padStart(2,'0'):c.k==='name'?esc(r.name):c.k==='exp'?fdS(r.exp):c.k==='sub'?fdS(r.sub):c.k==='page'?esc(r.page):esc(r.rem);
  el.innerHTML=`<div class="hd"><img src="${idxLogo}" alt=""><div class="u">${UNI}</div>
    <div class="d" style="font-size:${fitFs(dept.length,18,640)}px">${esc(dept)}</div></div>
    <div class="ttl">INDEX</div><div class="crs">${esc(course)}${code?' · '+esc(code):''}</div>
    <table class="${$('idxStyle').value}"><colgroup>${on.map(c=>`<col style="width:${(W[c.k]/tot*100).toFixed(1)}%">`).join('')}</colgroup>
    <thead><tr>${on.map(c=>`<th>${esc(c.t)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r,i)=>`<tr>${on.map(c=>`<td class="c-${c.k}">${cell(c,r,i)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    ${show?`<div class="two bot" style="bottom:${48+up}px">${boxesHTML()}</div>`:''}`;
  const cap=Math.max(0,Math.floor((1123-330-44-(show?48+up+250:45))/rh)),h=$('hint');
  h.textContent=rows.length>cap?`⚠ Only about ${cap} rows fit above the boxes. Reduce rows, row height, or move boxes down.`:`About ${cap} rows fit on one A4 page.`;
  h.className='hint'+(rows.length>cap?' bad':'');
}
function renderColEditor(){
  $('colEditor').innerHTML=cols.map((c,i)=>`<div class="colrow"><input type="checkbox" data-ci="${i}" ${c.on?'checked':''} ${c.k==='sl'?'disabled':''}><input type="text" data-ct="${i}" value="${esc(c.t)}"></div>`).join('');
}
function renderRowEditor(){
  const T=k=>esc(cols.find(c=>c.k===k).t),on=k=>cols.find(c=>c.k===k).on;
  $('rowEditor').innerHTML=rows.map((r,i)=>`<div class="rowcard"><div class="rch"><b>Row ${i+1}</b><button class="del" data-del="${i}">Delete</button></div>
   ${on('name')?`<label>${T('name')}<input data-r="${i}" data-k="name" value="${esc(r.name)}"></label>`:''}
   ${on('page')?`<label>${T('page')}<input data-r="${i}" data-k="page" value="${esc(r.page)}"></label>`:''}
   <div class="grid2">${on('exp')?`<label>${T('exp')}<input type="date" data-r="${i}" data-k="exp" value="${esc(r.exp)}"></label>`:''}
   ${on('sub')?`<label>${T('sub')}<input type="date" data-r="${i}" data-k="sub" value="${esc(r.sub)}"></label>`:''}</div>
   ${on('rem')?`<label>${T('rem')}<input data-r="${i}" data-k="rem" value="${esc(r.rem)}"></label>`:''}</div>`).join('');
}
const blank=()=>({name:'',exp:'',sub:'',page:'',rem:''});
function mirror(){MIR.forEach(([a,b])=>$(b).value=$(a).value);}
function setRows(n){n=Math.min(40,Math.max(1,n||1));while(rows.length<n)rows.push(blank());rows.length=n;$('rowCount').value=n;renderRowEditor();renderIndex();save();}
function save(){try{const f={};ALL.forEach(k=>f[k]=$(k).value);localStorage.setItem(KEY,JSON.stringify({f,rows,cols}))}catch(e){}}
function load(){let s={};try{s=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
  ALL.forEach(k=>$(k).value=s.f&&s.f[k]!==undefined?s.f[k]:DEF[k]);mirror();
  if(s.cols&&s.cols.length===6)cols=s.cols;rows=s.rows&&s.rows.length?s.rows:Array.from({length:6},blank);$('rowCount').value=rows.length;}
function render(){renderCover();renderIndex();save();fit();}
function fit(){document.querySelectorAll('.wrap').forEach(w=>{w.style.transform='';w.style.height=''});
  const a=document.querySelector('.preview').clientWidth;if(a<=0)return;
  const w=$('wrap-'+active),s=Math.min(1,a/794);w.style.transform=`scale(${s})`;w.style.height=(1123*s)+'px';}
function tab(t){active=t;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  $('t-cover').style.display=t==='cover'?'':'none';$('t-index').style.display=t==='index'?'':'none';
  $('wrap-cover').style.display=t==='cover'?'':'none';$('wrap-index').style.display=t==='index'?'':'none';fit();}
function view(v){document.body.className='view-'+v;$('mEdit').classList.toggle('on',v==='edit');$('mPrev').classList.toggle('on',v==='preview');window.scrollTo(0,0);fit();}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>tab(b.dataset.t));
$('mEdit').onclick=()=>view('edit');$('mPrev').onclick=()=>view('preview');
MIR.forEach(([a,b])=>{$(a).addEventListener('input',()=>$(b).value=$(a).value);$(b).addEventListener('input',()=>$(a).value=$(b).value);});
C.concat(['idxStyle','idxAccent','idxFS','idxRH','idxBox','boxUpI','idxDepartment','idxCourse','idxCode','iName','iId','iSession','iSection','iTeacher','iDesig','iTDept']).forEach(k=>{$(k).addEventListener('input',render);$(k).addEventListener('change',render)});
$('rstC').onclick=()=>{$('boxUpC').value=0;render()};$('rstI').onclick=()=>{$('boxUpI').value=0;render()};
$('rowCount').addEventListener('change',e=>setRows(parseInt(e.target.value)));
$('addRow').onclick=()=>setRows(rows.length+1);
$('rowEditor').addEventListener('input',e=>{const t=e.target;if(t.dataset.r!==undefined){rows[+t.dataset.r][t.dataset.k]=t.value;renderIndex();save();}});
$('rowEditor').addEventListener('click',e=>{const d=e.target.dataset.del;if(d!==undefined){rows.splice(+d,1);if(!rows.length)rows.push(blank());$('rowCount').value=rows.length;renderRowEditor();renderIndex();save();}});
$('colEditor').addEventListener('input',e=>{const t=e.target;if(t.dataset.ct!==undefined){cols[+t.dataset.ct].t=t.value;renderIndex();save();renderRowEditor();}});
$('colEditor').addEventListener('change',e=>{const t=e.target;if(t.dataset.ci!==undefined){cols[+t.dataset.ci].on=t.checked;renderRowEditor();renderIndex();save();}});
async function snap(id){document.body.classList.add('cap');const w=$('wrap-'+id),p={d:w.style.display,t:w.style.transform,h:w.style.height};
  w.style.display='block';w.style.transform='none';w.style.height='auto';await new Promise(r=>setTimeout(r,80));
  try{return await html2canvas($(id),{scale:2,backgroundColor:'#fff',scrollX:0,scrollY:0,windowWidth:1200});}
  finally{w.style.display=p.d;w.style.transform=p.t;w.style.height=p.h;document.body.classList.remove('cap');}}
const base=()=>(val('type')==='lab'?'Lab_Report':'Assignment')+'_'+(val('courseCode')||'cover').replace(/\s+/g,'_');
async function busy(fn){$('busy').classList.add('on');try{await fn()}catch(e){alert('Could not create file. Check internet connection and try again.')}$('busy').classList.remove('on');}
async function makePdf(ids){const {jsPDF}=window.jspdf,p=new jsPDF('p','mm','a4');
  for(let i=0;i<ids.length;i++){const c=await snap(ids[i]);if(i)p.addPage();p.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297);}return p;}
const pdf=(ids,name)=>busy(async()=>{(await makePdf(ids)).save(name+'.pdf');});
function showReady(file){const r=$('ready');r.classList.add('on');
  $('readyShare').onclick=async()=>{r.classList.remove('on');try{await navigator.share({files:[file],title:file.name})}catch(e){}};
  $('readyClose').onclick=()=>r.classList.remove('on');}
async function shareIt(){let file;
  await busy(async()=>{const p=await makePdf([active]);file=new File([p.output('blob')],nm()+'.pdf',{type:'application/pdf'});});
  if(!file)return;const data={files:[file],title:file.name};
  if(navigator.canShare&&navigator.canShare(data)){
    try{await navigator.share(data);return;}
    catch(e){if(e&&e.name==='AbortError')return;if(e&&e.name==='NotAllowedError'){showReady(file);return;}}
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();
  alert('Sharing is not supported on this browser, so the PDF was downloaded instead. Share it from your Downloads.');}
const nm=()=>active==='cover'?base():'Index_'+base();
$('pdf').onclick=()=>pdf([active],nm());$('mPdf').onclick=()=>pdf([active],nm());
$('print').onclick=()=>window.print();$('share').onclick=shareIt;$('mShare').onclick=shareIt;
$('reset').onclick=()=>{if(confirm('Reset everything?')){localStorage.removeItem(KEY);cols=JSON.parse(JSON.stringify(COLS0));idxLogo=LOGO;load();renderColEditor();renderRowEditor();render();}};

/* ---- suggestions: department + EEE course code/title ---- */
const DEPTS=['Department of Electrical and Electronic Engineering','Department of Computer Science and Engineering','Department of Fisheries','Department of Geology','Department of Mathematics','Department of Management','Department of Social Work'];
const DC=window.DEPT_COURSES||{},deptKey=()=>{const d=val('dept');return /electrical and electronic/i.test(d)?'eee':/fisheries/i.test(d)?'fish':''},COURSES_NOW=()=>DC[deptKey()]||[];
const norm=s=>String(s).replace(/\s+/g,'').toUpperCase();
function suggest(inp,getItems,onPick,onFocusAll){
  const box=document.createElement('div');box.className='sg';inp.parentNode.appendChild(box);
  const show=all=>{const items=getItems(all?'':inp.value.trim());if(!items.length){box.style.display='none';return;}
    box._items=items;box.innerHTML=items.map((it,i)=>`<div data-i="${i}"><b>${esc(it.main)}</b>${it.sub?`<small>${esc(it.sub)}</small>`:''}</div>`).join('');box.style.display='block';};
  inp.addEventListener('focus',()=>show(onFocusAll));inp.addEventListener('input',()=>show(false));
  inp.addEventListener('blur',()=>setTimeout(()=>box.style.display='none',160));
  box.addEventListener('mousedown',e=>{const d=e.target.closest('[data-i]');if(!d)return;e.preventDefault();onPick(box._items[+d.dataset.i]);box.style.display='none';});
}
const fire=el=>el.dispatchEvent(new Event('input',{bubbles:true}));
['dept','idxDepartment','teacherDept','iTDept'].forEach(id=>suggest($(id),q=>DEPTS.filter(d=>!q||d.toLowerCase().includes(q.toLowerCase())).map(d=>({main:d})),it=>{$(id).value=it.main;fire($(id));},true));
[['courseTitle','courseCode'],['idxCourse','idxCode']].forEach(([tId,cId])=>{
  const T=$(tId),Cd=$(cId);let lastAuto='';
  const fill=co=>{Cd.value=co[0];T.value=co[1];lastAuto=co[1];fire(Cd);fire(T);};
  suggest(Cd,q=>{const L=COURSES_NOW();if(!L.length||!q)return[];const n=norm(q);return L.filter(c=>norm(c[0]).includes(n)||c[1].toLowerCase().includes(q.toLowerCase())).slice(0,10).map(c=>({main:c[0],sub:c[1],co:c}));},it=>fill(it.co),false);
  suggest(T,q=>{const L=COURSES_NOW();if(!L.length||!q)return[];const l=q.toLowerCase();return L.filter(c=>c[1].toLowerCase().includes(l)||norm(c[0]).includes(norm(q))).slice(0,10).map(c=>({main:c[1],sub:c[0],co:c}));},it=>fill(it.co),false);
  Cd.addEventListener('input',()=>{const L=COURSES_NOW();if(!L.length)return;const m=L.find(c=>norm(c[0])===norm(Cd.value));
    if(m&&(!T.value.trim()||T.value===lastAuto)){T.value=m[1];lastAuto=m[1];fire(T);}
    else if(!m&&lastAuto&&T.value===lastAuto){T.value='';lastAuto='';fire(T);}});
});
/* ---- EEE teachers + designation ---- */
const TEACHERS={
eee:[['Dr. Md. Rasidul Islam','Assistant Professor','On study leave'],['Md. Shizer Rahman','Assistant Professor'],['Md. Mahfuzul Haque','Assistant Professor'],['Md. Amimul Ihsan','Lecturer'],['Md. Rezwanur Rahman','Lecturer'],['Afsana Sharmin Shanta','Lecturer'],['Jannatul Ambia Akhi','Lecturer']],
cse:[['Dr. Mahmudul Alam','Assistant Professor'],['Md. Humaun Kabir','Assistant Professor'],['Sujit Roy','Assistant Professor'],['Mohammad Hasan','Assistant Professor'],['Md. Sydur Rahman','Lecturer'],['Md. Khabir Uddin Ahamed','Lecturer']],
math:[['Dr. Muhammad Shahjalal','Assistant Professor'],['Ripan Roy','Assistant Professor'],['Md. Nazmul Hossain','Assistant Professor'],['Mohammad Abul Heyath Sajib','Assistant Professor'],['Tozam Hossain','Assistant Professor'],['Ayantika Ghosh','Lecturer'],['Sharaban Tahura','Lecturer']],
fish:[['Dr. Abdus Satter','Associate Professor'],['Dr. Mohammad Shadiqur Rahman','Associate Professor'],['Dr. Muhammad Forhad Ali','Associate Professor'],['Dr. Mahmudul Hasan','Associate Professor'],['Dr. Mousumi Akter','Associate Professor'],['Mohammad Rafiqul Bari','Assistant Professor'],['Raihana Rahman','Assistant Professor'],['Mizanur Rahman','Assistant Professor'],['Md. Fakhrul Islam','Assistant Professor'],['Syed Ariful Haque','Assistant Professor'],['Partha Sarathi Das','Assistant Professor'],['Md. Mokhlasur Rahman','Assistant Professor'],['Sumit Kumer Paul','Assistant Professor'],['Runa Akther Juthi','Assistant Professor'],['Sumaiya Binte Salam','Lecturer'],['Mahfuzul Alam Mithu','Lecturer']],
geo:[['Dr. Mrinal Kanti Roy Chowdhury','Professor'],['Waheda Akhter','Lecturer'],['Ishrat Jahan Eva','Lecturer']],
sw:[['AHM Mahbubur Rahman','Assistant Professor'],['Md. Al Mamun Sarker','Assistant Professor'],['Dr. Most Ummay Hani Kulsum','Assistant Professor'],['Md. Oly Ullah Chowdhury','Assistant Professor'],['Imrul Kabir','Assistant Professor'],['Taiyeba Tabassum','Assistant Professor'],['Hossain Mahmud','Lecturer']],
mgt:[['S.M. Yusuf Ali','Assistant Professor'],['Md. Enamul Haque','Assistant Professor'],['Md. Zahid Hasan','Assistant Professor'],['Jannatul Fardous','Assistant Professor'],['Atiqur Rahaman','Assistant Professor']]
};
const tKey=x=>/electrical and electronic/i.test(x)?'eee':/computer science/i.test(x)?'cse':/mathematics/i.test(x)?'math':/fisheries/i.test(x)?'fish':/geology/i.test(x)?'geo':/social work/i.test(x)?'sw':/management/i.test(x)?'mgt':'';
const DESIGS=['Professor','Associate Professor','Assistant Professor','Lecturer'];
[['teacherName','designation'],['iTeacher','iDesig']].forEach(([nId,dId])=>{
  suggest($(nId),q=>{const TL=TEACHERS[tKey(val('teacherDept'))]||[];if(!TL.length)return[];const l=q.toLowerCase();
    return TL.filter(t=>!l||t[0].toLowerCase().includes(l)).map(t=>({main:t[0],sub:t[1]+(t[2]?' · '+t[2]:''),t}));},
    it=>{$(nId).value=it.t[0];$(dId).value=it.t[1];fire($(nId));fire($(dId));},true);
  suggest($(dId),q=>{const l=q.toLowerCase();return DESIGS.filter(d=>!l||d.toLowerCase().includes(l)).map(d=>({main:d}));},it=>{$(dId).value=it.main;fire($(dId));},true);
});
window.addEventListener('resize',fit);
load();renderColEditor();renderRowEditor();render();
