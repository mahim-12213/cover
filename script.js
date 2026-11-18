const $=id=>document.getElementById(id);
const C=['type','style','accent','dept','courseTitle','courseCode','topicNo','topicName','expDate','subDate','name','id','session','yearSem','section','members','teacherName','designation','teacherDept','boxUpC'];
const X=['idxUniversity','idxStyle','idxAccent','idxFS','idxRH','rowCount','idxBox','boxUpI'];
const MIR=[['dept','idxDepartment'],['courseTitle','idxCourse'],['courseCode','idxCode'],['name','iName'],['id','iId'],['session','iSession'],['section','iSection'],['teacherName','iTeacher'],['designation','iDesig'],['teacherDept','iTDept']];
const ALL=C.concat(X),DEF={};ALL.forEach(k=>DEF[k]=$(k).value);
const COLS0=[{k:'sl',t:'SL No',on:true},{k:'name',t:'Experiment / Topic Name',on:true},{k:'exp',t:'Date of Experiment',on:false},{k:'sub',t:'Date of Submission',on:false},{k:'page',t:'Page No',on:true},{k:'rem',t:'Remarks',on:false}];
const W={sl:9,name:46,exp:16,sub:16,page:14,rem:20},KEY='jstuCover5';
const LOGO=window.LOGO||'assets/logo.jpg',UNI='Jamalpur Science &amp; Technology University';
let rows=[],cols=JSON.parse(JSON.stringify(COLS0)),active='cover',idxLogo=LOGO;
const val=k=>$(k).value.trim();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fdL=v=>v?new Date(v+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):'';
const fdS=v=>v?new Date(v+'T00:00').toLocaleDateString('en-GB'):'';
const fitFs=(len,max,width)=>Math.max(12,Math.min(max,Math.floor(width/(Math.max(len,1)*0.53))));

function boxesHTML(){
  const mem=val('members')?val('members').split('\n').filter(Boolean).map(esc).join('\n'):'';
  const idLine=[val('id')&&'ID: '+esc(val('id')),val('session')&&'Session: '+esc(val('session'))].filter(Boolean).join(', ');
  const ys=[esc(val('yearSem')),val('section')&&'Section: '+esc(val('section'))].filter(Boolean).join(', ');
  return `<div class="box"><h4>Submitted by :</h4><div class="nm">${esc(val('name'))}</div>
    ${idLine?`<div>${idLine}</div>`:''}${ys?`<div>${ys}</div>`:''}${mem?`<small>${mem}</small>`:''}<div>${esc(val('dept'))}</div><div>${UNI}</div></div>
  <div class="box"><h4>Submitted to :</h4><div class="nm">${esc(val('teacherName'))}</div>
    ${val('designation')?`<div>${esc(val('designation'))},</div>`:''}<div>${esc(val('teacherDept'))}</div><div>${UNI}</div></div>`;
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
  el.innerHTML=`<div class="hd"><img src="${idxLogo}" alt=""><div class="u">${esc(val('idxUniversity'))}</div>
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
C.concat(['idxUniversity','idxStyle','idxAccent','idxFS','idxRH','idxBox','boxUpI','idxDepartment','idxCourse','idxCode','iName','iId','iSession','iSection','iTeacher','iDesig','iTDept']).forEach(k=>{$(k).addEventListener('input',render);$(k).addEventListener('change',render)});
$('rstC').onclick=()=>{$('boxUpC').value=0;render()};$('rstI').onclick=()=>{$('boxUpI').value=0;render()};
$('rowCount').addEventListener('change',e=>setRows(parseInt(e.target.value)));
$('addRow').onclick=()=>setRows(rows.length+1);
$('rowEditor').addEventListener('input',e=>{const t=e.target;if(t.dataset.r!==undefined){rows[+t.dataset.r][t.dataset.k]=t.value;renderIndex();save();}});
$('rowEditor').addEventListener('click',e=>{const d=e.target.dataset.del;if(d!==undefined){rows.splice(+d,1);if(!rows.length)rows.push(blank());$('rowCount').value=rows.length;renderRowEditor();renderIndex();save();}});
$('colEditor').addEventListener('input',e=>{const t=e.target;if(t.dataset.ct!==undefined){cols[+t.dataset.ct].t=t.value;renderIndex();save();renderRowEditor();}});
$('colEditor').addEventListener('change',e=>{const t=e.target;if(t.dataset.ci!==undefined){cols[+t.dataset.ci].on=t.checked;renderRowEditor();renderIndex();save();}});
$('idxLogoUpload').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{idxLogo=r.result;renderIndex();};r.readAsDataURL(f);};
$('idxUseLogo').onclick=()=>{idxLogo=LOGO;renderIndex();};
async function snap(id){document.body.classList.add('cap');const w=$('wrap-'+id),p={d:w.style.display,t:w.style.transform,h:w.style.height};
  w.style.display='block';w.style.transform='none';w.style.height='auto';await new Promise(r=>setTimeout(r,80));
  try{return await html2canvas($(id),{scale:2,backgroundColor:'#fff',scrollX:0,scrollY:0,windowWidth:1200});}
  finally{w.style.display=p.d;w.style.transform=p.t;w.style.height=p.h;document.body.classList.remove('cap');}}
const base=()=>(val('type')==='lab'?'Lab_Report':'Assignment')+'_'+(val('courseCode')||'cover').replace(/\s+/g,'_');
async function busy(fn){$('busy').classList.add('on');try{await fn()}catch(e){alert('Could not create file. Check internet connection and try again.')}$('busy').classList.remove('on');}
const pdf=(ids,name)=>busy(async()=>{const {jsPDF}=window.jspdf,p=new jsPDF('p','mm','a4');
  for(let i=0;i<ids.length;i++){const c=await snap(ids[i]);if(i)p.addPage();p.addImage(c.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297);}p.save(name+'.pdf');});
const nm=()=>active==='cover'?base():'Index_'+base();
$('pdf').onclick=()=>pdf([active],nm());$('mPdf').onclick=()=>pdf([active],nm());
$('pdf2').onclick=()=>pdf(['cover','index'],base()+'_with_Index');
$('png').onclick=()=>busy(async()=>{const c=await snap(active),a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=nm()+'.png';a.click();});
$('print').onclick=()=>window.print();
$('reset').onclick=()=>{if(confirm('Reset everything?')){localStorage.removeItem(KEY);cols=JSON.parse(JSON.stringify(COLS0));idxLogo=LOGO;load();renderColEditor();renderRowEditor();render();}};
window.addEventListener('resize',fit);
load();renderColEditor();renderRowEditor();render();
