// Google Sheets config — change SHEET_ID to your sheet
const SHEET_ID="1GcgjCJEPDAFtqOwONsfN_np5zdZFe3v2qa2lNzqDZd4";
const SHEET_URL=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
// Apps Script web app URL for writing — deploy from Extensions > Apps Script
let APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbzDJy4ysMJpXiDXI1_nwZYP1BCx0S1bZ7y9NHmDiD6wPhgfyRb4oXwDRO4twW2NfwNr1A/exec";

// i18n
const I18N={
  ua:{
    eyebrow:"K-RnD Lab / Oksana Kolisnyk \u{1F9D9} - TEZv / Real-prep research",
    title:"Master Training",
    lede:"\u{1F91D} Дослідницький тренажер для підготовки: ТЗНК, English та IT. Це K-RnD Lab study prototype; зовнішні ресурси винесені окремо для глибшої практики.",
    subF:"\u{1F9EE} Logic, Math",
    subEn:"\u{1F4D6} Reading, Grammar, Vocabulary, Listening",
    subS:"\u{1F52C} Biology, Chemistry, Physics, Bioinformatics",
    subE:"\u{1F4C8} Management, Marketing, Finance, Analytics",
    subT:"\u{1F6E0}\uFE0F Programming, AI, Algorithms, Databases",
    subST:"\u{1F9EC} Biotech, Bioinformatics, Data Analysis",
    subET:"\u{1F4CA} Digital Marketing, ERP, IT Management",
    subSE:"\u{1F48A} Pharma, Health Economics, Biotech Business",
    msgTitle:"Your trainer is ready.",
    msgBody:"Pick a sphere and level \u2014 then press Start. You've got this!",
    startTitle:"Ready to begin?",
    startDesc:"Choose your subject and mode, then press Start.",
    startBtn:"Start Session",
    timerLabel:"elapsed",
    timerExam:"remaining",
    pracHint:"Practice: 10 questions at your own pace.",
    simHint:"Simulation: all available questions with countdown timer.",
    practice:"Practice",
    simulation:"Simulation",
    resources:"Resources",
    back:"Back",
    next:"Next",
    desc:"Descriptive",
    diag:"Diagnostic",
    presc:"Prescriptive",
    pred:"Predictive",
    descTitle:"Descriptive analytics \u2014 what happened?",
    diagTitle:"Diagnostic \u2014 why?",
    prescTitle:"Prescriptive \u2014 what to do?",
    predTitle:"Predictive \u2014 what's next?",
    readiness:"Readiness signal",
    sharedTitle:"Overall progress by subject",
    endTitle:"Session complete!",
    endGreat:"Well done!",
    endMsg:"Every session is a step forward. Keep going!",
    newSession:"New session",
    allSubjects:"All subjects",
    correct:"Correct!",
    wrong:"Incorrect. Answer: ",
    finish:"Finish \u2708",
    min:"min",
    sessions:"sessions",
    accBySub:"Accuracy by subject",
    weakZones:"Weak zones (errors)",
    priority:"Learning priority (to 80%)",
    needMin2:"Need at least 2 sessions",
    forecast:"Next session forecast: ",
    totalAcc:"Overall accuracy (all sessions)"
  },
  en:{
    eyebrow:"K-RnD Lab / Oksana Kolisnyk \u{1F9D9} - TEZv / Real-prep research",
    title:"Master Training",
    lede:"\u{1F91D} Research trainer for exam practice: TZNK, English, and IT. Built as a K-RnD Lab study prototype; external resources are linked separately for deeper practice.",
    frontDoor:"Front Door",
    uiLang:"Interface language",qLang:"Question language",
    subF:"\u{1F9EE} Logic, Math",
    subEn:"\u{1F4D6} Reading, Grammar, Vocabulary, Listening",
    subS:"\u{1F52C} Biology, Chemistry, Physics, Bioinformatics",
    subE:"\u{1F4C8} Management, Marketing, Finance, Analytics",
    subT:"\u{1F6E0}\uFE0F Programming, AI, Algorithms, Databases",
    subST:"\u{1F9EC} Biotech, Bioinformatics, Data Analysis",
    subET:"\u{1F4CA} Digital Marketing, ERP, IT Management",
    subSE:"\u{1F48A} Pharma, Health Economics, Biotech Business",
    msgTitle:"Your trainer is right here.",
    msgBody:"Pick a sphere and level \u2014 then press Start. You've got this!",
    startTitle:"Ready to begin?",
    startDesc:"Choose your subject and mode, then press Start.",
    startBtn:"Start Session",
    timerLabel:"elapsed",
    timerExam:"remaining",
    pracHint:"Practice: 10 questions at your own pace.",
    simHint:"Simulation: all available questions with countdown timer.",
    practice:"Practice",
    simulation:"Simulation",
    resources:"Resources",
    back:"Back",
    next:"Next",
    desc:"Descriptive",
    diag:"Diagnostic",
    presc:"Prescriptive",
    pred:"Predictive",
    descTitle:"Descriptive analytics — what happened?",
    diagTitle:"Diagnostic — why?",
    prescTitle:"Prescriptive — what to do?",
    predTitle:"Predictive — what's next?",
    readiness:"Readiness signal",sharedTitle:"Overall progress by subject",
    endTitle:"Session complete!",endGreat:"Well done!",
    endMsg:"Every session is a step forward. Keep going, you've got this!",
    newSession:"New session",
    allSubjects:"All subjects",correct:"Correct!",wrong:"Wrong. Answer: ",
    finish:"Finish 🏁",min:"min",sessions:"sessions",
    accBySub:"Accuracy by subject",weakZones:"Weak zones (errors)",
    priority:"Study priority (to 80%)",needMin2:"Need at least 2 sessions",
    forecast:"Next session forecast: ",totalAcc:"Overall accuracy (all sessions)"
  }
};
let lang=localStorage.getItem("mt_lang")||"ua";
function t(k){return(I18N[lang]||I18N.ua)[k]||k;}
function applyI18N(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k=el.dataset.i18n;
    if(t(k)!==k)el.textContent=t(k);
  });
  // Update analytics titles
  const at={descriptive:"descTitle",diagnostic:"diagTitle",prescriptive:"prescTitle",predictive:"predTitle"};
  const ct=document.getElementById("chartTitle");
  if(ct&&at[state.analyticsType])ct.textContent=t(at[state.analyticsType]);
}

let state={sphere:null,level:"bachelor",subject:"all",variant:1,mode:"practice",analyticsType:"descriptive",questions:[],currentIdx:0,answers:{},sessionStart:null,sessions:[],sessionLog:[],sheetsData:[],examBank:null};

// One-time: clear stale localStorage (old entries without sphere/id cause duplicates)
const _LS_VER="mt_v5";
if(localStorage.getItem("mt_ver")!==_LS_VER){
  localStorage.removeItem("mt_sessions");
  localStorage.setItem("mt_ver",_LS_VER);
}

// Derive sphere from subject key (for legacy data without sphere field)
const _SUBJ_SPHERE={tznk:"F",english:"F",it:"F",all:"F",foundation:"F",S:"S",E:"E",T:"T",ST:"ST",ET:"ET",SE:"SE"};
function subjectInfo(s){return{sphere:_SUBJ_SPHERE[(s||"").toLowerCase()]||_SUBJ_SPHERE[s]||s||"F"};}

// Load from Google Sheets on init
async function loadSheetsData(){
  try{
    // 1. Try gviz (works when Sheet is "Anyone with link can view")
    const r=await fetch(SHEET_URL);
    const txt=await r.text();
    const json=JSON.parse(txt.replace(/^\)\]\}'\n/,""));
    const rows=json.table.rows;
    state.sheetsData=rows.map(r=>r.c.map(c=>c?v(c.v):""));
    // Merge sheets data into sessions if not already present
    // Columns after migration: session_id(0), date(1), subject(2), sphere(3), platform(4), mode(5),
    // source_group(6), is_internal(7), questions_total(8), correct(9),
    // accuracy_pct(10), minutes(11), session_label(12), predicted_score(13), actual_score(14), notes(15)
    if(state.sheetsData.length>0){
      const existing=JSON.parse(localStorage.getItem("mt_sessions")||"[]");
      const existingIds=new Set(existing.map(s=>s.id||s.date));
      const fromSheet=state.sheetsData.filter(r=>r[1]&&!existingIds.has(r[0]||r[1])).map(r=>({
        id:r[0],date:r[1],subject:r[2],sphere:r[3]||subjectInfo(r[2]).sphere,mode:r[5],
        minutes:parseInt(r[11])||1,total:parseInt(r[8])||0,correct:parseInt(r[9])||0,
        accuracy:parseInt(r[10])||0,label:r[12],log:[]
      }));
      if(fromSheet.length){
        state.sessions=[...existing,...fromSheet];
        localStorage.setItem("mt_sessions",JSON.stringify(state.sessions));
      }
    }
  }catch(e){
    console.log("gviz skipped:",e.message);
    // 2. Fallback: Apps Script GET (returns named objects)
    try{
      const r2=await fetch(APPS_SCRIPT_URL);
      const data=await r2.json();
      const rows=data.sessions||[];
      const existing=JSON.parse(localStorage.getItem("mt_sessions")||"[]");
      const existingIds=new Set(existing.map(s=>s.id||s.date));
      const fromScript=rows.filter(r=>r.date&&!existingIds.has(r.session_id||r.date)).map(r=>({
        id:r.session_id,date:r.date,subject:r.subject,sphere:r.sphere||subjectInfo(r.subject).sphere,mode:r.mode,
        minutes:parseInt(r.minutes)||1,total:parseInt(r.questions_total)||0,
        correct:parseInt(r.correct)||0,accuracy:parseInt(r.accuracy_pct)||0,
        label:r.session_label,log:[]
      }));
      if(fromScript.length){
        state.sessions=[...existing,...fromScript];
        localStorage.setItem("mt_sessions",JSON.stringify(state.sessions));
      }
    }catch(e2){console.log("Apps Script load skipped:",e2.message);}
  }
  // Clean up localStorage: add sphere to legacy entries, deduplicate
  const sessions=JSON.parse(localStorage.getItem("mt_sessions")||"[]");
  const subjectToSphere={tznk:"F",english:"F",it:"F",all:"F",foundation:"F",S:"S",E:"E",T:"T",ST:"ST",ET:"ET",SE:"SE"};
  let changed=false;
  sessions.forEach(s=>{
    if(!s.sphere&&s.subject){
      s.sphere=subjectToSphere[(s.subject+"").toLowerCase()]||s.subject;
      changed=true;
    }
  });
  // Deduplicate by id/date
  if(changed||sessions.length>0){
    const seen=new Set();
    const deduped=sessions.filter(s=>{
      const key=s.id||s.date;
      if(seen.has(key))return false;
      seen.add(key);return true;
    });
    if(deduped.length!==sessions.length||changed){
      state.sessions=deduped;
      localStorage.setItem("mt_sessions",JSON.stringify(deduped));
    }
  }
}

// Save session to Google Sheets via Apps Script
async function saveToSheet(session){
  if(!APPS_SCRIPT_URL)return;
  try{
    const modeLabel=state.mode==="simulation"?"simulation":"training";
    const sessionId=`${modeLabel}-${Date.now()}`;
    const sessLabel=state.mode==="simulation"?"s001-exam":"s001";
    const predScore=getReadiness().pct||session.accuracy;
    const row={
      session_id:sessionId,
      date:session.date,
      subject:session.subject||"all",
      sphere:session.sphere||"F",
      platform:"Master Trainer",
      mode:modeLabel,
      source_group:"internal",
      is_internal:true,
      questions_total:session.total,
      correct:session.correct,
      accuracy_pct:session.accuracy,
      minutes:session.minutes,
      session_label:sessLabel,
      predicted_score:predScore,
      actual_score:"",
      notes:""
    };
    await fetch(APPS_SCRIPT_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain"},
      body:JSON.stringify({type:"session",row:row})
    });
  }catch(e){console.log("Sheets save skipped:",e.message);}
}

// Init: load sheets data
loadSheetsData();

// Language controls
document.getElementById("uiLang").value=lang;
applyI18N();
document.getElementById("uiLang").addEventListener("change",e=>{
  lang=e.target.value;
  localStorage.setItem("mt_lang",lang);
  applyI18N();
  if(state.sphere){initSubjects();renderQ();renderStats();renderAnalytics();}
});
// Question language is locked to EN (questions are in English)
// qLang select stays disabled

// Real exam bank adapter: keep the dark trainer UI, feed it the serious IT/TZNK/English bank.
const EXAM_SUBJECT_BY_SPHERE={foundation:"tznk",F:"tznk",english:"english",T:"it"};
const EXAM_LABELS={tznk:"ТЗНК",english:"English",it:"IT / Computer Science"};
const CHOICE_KEYS=["A","B","C","D","E"];
async function ensureExamBank(){
  if(state.examBank)return state.examBank;
  const res=await fetch("./app_data/quiz_bank_v1.json",{cache:"no-store"});
  if(!res.ok)throw new Error("Cannot load quiz_bank_v1.json");
  state.examBank=await res.json();
  return state.examBank;
}
function examSubjectForState(){
  return EXAM_SUBJECT_BY_SPHERE[state.sphere]||null;
}
function getExamSet(subject,variant){
  if(!state.examBank||!state.examBank.quiz_sets)return null;
  return Object.values(state.examBank.quiz_sets).find(set=>
    Number(set.variant)===Number(variant)&&
    Array.isArray(set.questions)&&
    set.questions[0]&&set.questions[0].subject===subject
  )||null;
}
function toTrainerQuestion(q,i){
  const keys=CHOICE_KEYS.filter(k=>q.choices&&Object.prototype.hasOwnProperty.call(q.choices,k));
  return {
    q:q.prompt,
    opts:keys.map(k=>q.choices[k]),
    ans:keys.indexOf(q.correct_answer),
    subject:EXAM_LABELS[q.subject]||q.subject,
    idx:i,
    id:q.id,
    block:q.block,
    topic:q.topic,
    explanation:q.explanation||"",
    choiceExplanations:q.choice_explanations||{},
    scientific:q.scientific_explanation||"",
    life:q.real_life_example||"",
    sourceSubject:q.subject,
    variant:q.variant
  };
}
function ensureVariantControl(){
  if(document.getElementById("variantFilter"))return;
  const subject=document.getElementById("subjectFilter");
  const row=subject&&subject.closest("div");
  if(!row)return;
  const wrap=document.createElement("label");
  wrap.id="variantLabel";
  wrap.innerHTML='<span>\u0412\u0430\u0440\u0456\u0430\u043d\u0442</span><select id="variantFilter"><option value="1">\u0412\u0430\u0440\u0456\u0430\u043d\u0442 1</option><option value="2">\u0412\u0430\u0440\u0456\u0430\u043d\u0442 2</option><option value="3">\u0412\u0430\u0440\u0456\u0430\u043d\u0442 3</option></select>';
  row.insertBefore(wrap, subject.closest("label")?.nextSibling||subject.nextSibling);
  const sel=document.getElementById("variantFilter");
  sel.value=String(state.variant||1);
  sel.addEventListener("change",e=>{state.variant=Number(e.target.value)||1;});
}
function shuffle(pool){
  for(let i=pool.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [pool[i],pool[j]]=[pool[j],pool[i]];
  }
  return pool;
}

// Sphere cards
document.querySelectorAll(".sphere-card").forEach(c=>{
  c.addEventListener("click",()=>{
    document.querySelectorAll(".sphere-card").forEach(x=>x.classList.remove("active"));
    c.classList.add("active");
    const sp=c.dataset.sphere;
    state.sphere=sp==="foundation"?"F":sp;
    state.subject=sp==="english"?"english":"all";
    document.getElementById("sphereSection").style.display="none";
    document.getElementById("msgBox").style.display="none";
    showStartScreen();
  });
});

// Level tabs
document.querySelectorAll("#levelTabs button").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll("#levelTabs button").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");state.level=b.dataset.level;
    if(state.sphere){initSubjects();startSession();}
  });
});

// Mode tabs (wired dynamically in showStartScreen)

// Analytics tabs
document.querySelectorAll(".analytics-tabs button").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll(".analytics-tabs button").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");state.analyticsType=b.dataset.type;renderAnalytics();
  });
});

document.getElementById("prevBtn").addEventListener("click",()=>{if(state.currentIdx>0){state.currentIdx--;renderQ();}});
document.getElementById("nextBtn").addEventListener("click",()=>{if(state.currentIdx<state.questions.length-1){state.currentIdx++;renderQ();}else endSession();});

function initSubjects(){
  const sel=document.getElementById("subjectFilter");
  ensureVariantControl();
  const examSubject=examSubjectForState();
  if(examSubject){
    sel.innerHTML="";
    const o=document.createElement("option");
    o.value=examSubject;
    o.textContent=EXAM_LABELS[examSubject];
    sel.appendChild(o);
    state.subject=examSubject;
    const variantLabel=document.getElementById("variantLabel");
    if(variantLabel)variantLabel.style.display="flex";
    return;
  }
  const variantLabel=document.getElementById("variantLabel");
  if(variantLabel)variantLabel.style.display="none";
  // For English card: subjects from SPHERES.english; for F: from SPHERES.F
  const sphereKey=state.subject==="english"?"english":state.sphere;
  const subs=SPHERES[sphereKey]?SPHERES[sphereKey][state.level]:SPHERES[state.sphere][state.level];
  sel.innerHTML=`<option value="all">${t('allSubjects')}</option>`;
  subs.forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;sel.appendChild(o);});
}

function showStartScreen(){
  initSubjects();
  const ss=document.getElementById("startScreen");
  ss.style.display="block";
  document.getElementById("startTitle").textContent=t('startTitle');
  document.getElementById("startDesc").textContent=t('startDesc');
  document.getElementById("startBtn").textContent=t('startBtn');
  document.getElementById("trainerMain").style.display="none";
  document.getElementById("sessionEnd").style.display="none";
  // Wire mode tabs on start screen
  const modeTabs=ss.querySelectorAll(".mode-tabs button");
  modeTabs.forEach(b=>{
    b.onclick=()=>{
      modeTabs.forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      state.mode=b.dataset.mode;
      const hint=document.getElementById("modeHint");
      if(hint)hint.textContent=state.mode==="simulation"?t('simHint'):t('pracHint');
    };
  });
  // Wire subject filter on start screen
  const sf=document.getElementById("subjectFilter");
  if(sf)sf.onchange=e=>{state.subject=e.target.value;};
  // Update mode hint
  const hint=document.getElementById("modeHint");
  if(hint)hint.textContent=state.mode==="simulation"?t('simHint'):t('pracHint');
}

document.getElementById("startBtn").addEventListener("click",()=>{
  document.getElementById("startScreen").style.display="none";
  document.getElementById("trainerMain").style.display="grid";
  startSession();
});

// Back to sphere selection
document.getElementById("backToSpheres").addEventListener("click",()=>{
  document.getElementById("startScreen").style.display="none";
  document.getElementById("sphereSection").style.display="block";
  document.getElementById("msgBox").style.display="block";
  document.querySelectorAll(".sphere-card").forEach(x=>x.classList.remove("active"));
  state.sphere=null;
});

// Back to start screen (from session)
document.getElementById("backToStart").addEventListener("click",()=>{
  stopTimer();
  document.getElementById("trainerMain").style.display="none";
  document.getElementById("startScreen").style.display="block";
});

let timerInterval=null;
const EXAM_MINUTES={foundation:60,F:60,english:60,S:90,E:90,T:120,ST:120,ET:120,SE:90}; // real exam durations by sphere

function startTimer(){
  if(timerInterval)clearInterval(timerInterval);
  const bar=document.getElementById("timerBar");
  bar.style.display="flex";
  const isSim=state.mode==="simulation";
  const examMins=EXAM_MINUTES[state.sphere]||90;
  const startMs=Date.now();
  const limitMs=isSim?examMins*60000:0;
  document.getElementById("timerLabel").textContent=isSim?t('timerExam'):t('timerLabel');
  timerInterval=setInterval(()=>{
    const elapsed=Date.now()-startMs;
    const totalSec=Math.floor(elapsed/1000);
    const mm=String(Math.floor(totalSec/60)).padStart(2,'0');
    const ss=String(totalSec%60).padStart(2,'0');
    if(isSim&&limitMs>0){
      const remain=Math.max(0,limitMs-elapsed);
      const rm=String(Math.floor(remain/60000)).padStart(2,'0');
      const rs=String(Math.floor((remain%60000)/1000)).padStart(2,'0');
      document.getElementById("timerValue").textContent=rm+':'+rs;
      if(remain<=0){clearInterval(timerInterval);endSession();}
    }else{
      document.getElementById("timerValue").textContent=mm+':'+ss;
    }
  },1000);
}

function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}

async function startSession(){
  let pool=[];
  const examSubject=examSubjectForState();
  if(examSubject){
    try{
      await ensureExamBank();
      const set=getExamSet(examSubject,state.variant||1);
      if(!set)throw new Error("No exam set for "+examSubject+" variant "+state.variant);
      pool=set.questions.map(toTrainerQuestion);
    }catch(e){
      console.error(e);
      alert("Could not load quiz_bank_v1.json. Check app_data/quiz_bank_v1.json.");
      return;
    }
  }else{
    const subs=state.subject==="all"?(SPHERES[state.sphere]||SPHERES.F)[state.level]:state.subject==="english"?(SPHERES.english||SPHERES.F)[state.level]:[state.subject];
    subs.forEach(sub=>{if(Q[sub])Q[sub].forEach((q,i)=>pool.push({...q,subject:sub,idx:i}));});
    shuffle(pool);
  }
  const n=state.mode==="simulation"?pool.length:Math.min(pool.length,10);
  state.questions=(state.mode==="simulation"?pool:shuffle([...pool])).slice(0,n);state.currentIdx=0;state.answers={};state.sessionStart=Date.now();state.sessionLog=[];
  document.getElementById("sessionEnd").style.display="none";
  document.getElementById("trainerMain").style.display="grid";
  startTimer();
  renderQ();renderResources();renderStats();renderAnalytics();
}

function renderQ(){
  const q=state.questions[state.currentIdx];
  const area=document.getElementById("questionArea");
  if(!q){
    area.innerHTML=`<div class="q-card"><h3>No questions loaded.</h3></div>`;
    return;
  }
  document.getElementById("qNav").style.display="flex";
  document.getElementById("qCounter").textContent=`${state.currentIdx+1} / ${state.questions.length}`;
  const answered=state.answers[state.currentIdx]!==undefined;
  const ua=state.answers[state.currentIdx];
  let oh=q.opts.map((o,i)=>{
    let c="q-opt";
    if(answered){if(i===q.ans)c+=" correct";else if(i===ua&&i!==q.ans)c+=" wrong";else c+=" reveal";}
    else if(ua===i)c+=" selected";
    return `<div class="${c}" data-i="${i}">${o}</div>`;
  }).join("");
  area.innerHTML=`<div class="q-card"><div style="font-size:12px;color:var(--muted);margin-bottom:8px">${q.subject}${q.block?" / "+q.block:""}${q.topic?" / "+q.topic:""}${q.variant?" / v"+q.variant:""}</div><h3>${q.q}</h3><div class="q-options">${oh}</div>${answered?renderExplanation(q,ua):""}</div>`;
  area.querySelectorAll(".q-opt:not(.correct):not(.wrong):not(.reveal)").forEach(el=>{
    el.addEventListener("click",()=>{
      const idx=parseInt(el.dataset.i);state.answers[state.currentIdx]=idx;
      state.sessionLog.push({subject:q.sourceSubject||q.subject,correct:idx===q.ans,time:Date.now()});
      renderQ();renderStats();renderAnalytics();
    });
  });
  document.getElementById("prevBtn").disabled=state.currentIdx===0;
  document.getElementById("nextBtn").innerHTML=state.currentIdx===state.questions.length-1?t("finish"):t("next")+" ?";
}

function renderExplanation(q,ua){
  const ok=ua===q.ans;
  const answerLine=`<div style="margin-top:12px;font-size:13px;color:${ok?'#22c55e':'#ef4444'}">${ok?'? '+t('correct'):'? '+t('wrong')+q.opts[q.ans]}</div>`;
  if(!q.explanation&&!q.scientific&&!q.life&&!q.choiceExplanations)return answerLine;
  const letters=CHOICE_KEYS.slice(0,q.opts.length);
  const choices=q.choiceExplanations?letters.map(letter=>
    q.choiceExplanations[letter]?`<li><b>${letter}.</b> ${q.choiceExplanations[letter]}</li>`:""
  ).join(""):"";
  return `${answerLine}<div style="margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:14px;background:color-mix(in srgb,var(--accent) 6%,transparent);font-size:13px;line-height:1.55">
    ${q.explanation?`<div><b>\u041a\u043e\u0440\u043e\u0442\u043a\u043e:</b> ${q.explanation}</div>`:""}
    ${q.scientific?`<div style="margin-top:8px">${q.scientific}</div>`:""}
    ${q.life?`<div style="margin-top:8px">${q.life}</div>`:""}
    ${choices?`<ul style="margin:10px 0 0;padding-left:18px">${choices}</ul>`:""}
  </div>`;
}
function endSession(){
  const el=Math.max(1,Math.round((Date.now()-state.sessionStart)/60000));
  const tot=state.sessionLog.length,cor=state.sessionLog.filter(l=>l.correct).length;
  const acc=tot?Math.round(cor/tot*100):0;
  // Subject: "all" for foundation core, "english" for English, or specific SET subject
  const subjLabel=state.subject;
  const sphereKey=state.sphere;
  const dateStr=new Date().toISOString().slice(0,10); // YYYY-MM-DD
  const sessionId=`${state.mode==="simulation"?"simulation":"training"}-${Date.now()}`;
  state.sessions.push({id:sessionId,sphere:sphereKey,level:state.level,subject:subjLabel,mode:state.mode,date:dateStr,minutes:el,total:tot,correct:cor,accuracy:acc,log:state.sessionLog});
  localStorage.setItem("mt_sessions",JSON.stringify(state.sessions));
  saveToSheet(state.sessions[state.sessions.length-1]);
  stopTimer();
  document.getElementById("trainerMain").style.display="none";
  document.getElementById("sessionEnd").style.display="block";
  document.getElementById("finalScore").textContent=acc+"%";
  document.getElementById("finalScore").style.color=acc>=80?"#22c55e":acc>=60?"#eab308":"#ef4444";
  const r=getReadiness();
  document.getElementById("finalStats").innerHTML=`<span class="stat-pill">⏱ ${el} ${t('min')}</span><span class="stat-pill">✅ ${cor}/${tot}</span><span class="stat-pill">🎯 ${acc}%</span><span class="stat-pill">🟢 ${r.label}</span>`;
}

function renderStats(){
  const log=state.sessionLog,tot=log.length,cor=log.filter(l=>l.correct).length;
  const acc=tot?Math.round(cor/tot*100):0;
  const el=state.sessionStart?Math.max(0,Math.round((Date.now()-state.sessionStart)/60000)):0;
  const r=getReadiness();
  document.getElementById("sessionStats").innerHTML=`<span class="stat-pill">⏱ <span class="val">${el} ${t('min')}</span></span><span class="stat-pill">✅ <span class="val">${cor}/${tot}</span></span><span class="stat-pill">🎯 <span class="val">${acc}%</span></span><span class="stat-pill">📋 <span class="val">${state.sessions.length} ${t('sessions')}</span></span><span class="stat-pill">🟢 <span class="val">${r.label}</span></span>`;
  const rv=document.getElementById("readinessValue");rv.textContent=r.label;rv.className="readiness "+r.cls;
  const bar=document.getElementById("readinessBar");bar.style.width=r.pct+"%";bar.style.background=r.cls==="high"?"#22c55e":r.cls==="medium"?"#eab308":"#ef4444";
}

function getReadiness(){
  const r=state.sessions.slice(-5);
  if(!r.length)return{label:"New",cls:"low",pct:10};
  const a=r.reduce((s,x)=>s+x.accuracy,0)/r.length;
  const t=r.reduce((s,x)=>s+x.total,0);
  if(a>=85&&t>=30)return{label:"High",cls:"high",pct:Math.min(95,a)};
  if(a>=65)return{label:"Medium",cls:"medium",pct:a};
  return{label:"Low",cls:"low",pct:a};
}

function renderResources(){
  const groups=["guide"];
  const subject=(state.subject||"").toLowerCase();
  const sphere=(state.sphere||"").toLowerCase();
  if(subject==="english"||sphere==="english")groups.push("english");
  else if(subject==="it"||sphere==="t")groups.push("it");
  else groups.push("tznk");
  groups.push("research");
  const labels={guide:"Core guide",tznk:"TZNK practice",english:"English practice",it:"IT practice",nmt:"NMT base",research:"Research context"};
  const h=groups.map(g=>{
    const links=RES[g]||[];
    return `<div class="resource-group"><div class="resource-title">${labels[g]||g}</div>${links.map(r=>`<a href="${r.u}" target="_blank" rel="noreferrer">${r.l}</a>`).join("")}</div>`;
  }).join("");
  document.getElementById("resourceLinks").innerHTML=h;
}

function renderAnalytics(){
  const atype=state.analyticsType;
  const titles={descriptive:t('descTitle'),diagnostic:t('diagTitle'),prescriptive:t('prescTitle'),predictive:t('predTitle')};
  document.getElementById("chartTitle").textContent=titles[atype]||"";
  const c=document.getElementById("mainChart"),ctx=c.getContext("2d");
  c.width=c.offsetWidth*2;c.height=360;ctx.clearRect(0,0,c.width,c.height);
  const subs=(SPHERES[state.sphere]||SPHERES.F)[state.level],log=state.sessionLog,sess=state.sessions.filter(s=>s.sphere===state.sphere);
  if(atype==="descriptive")drawAcc(ctx,c,subs,log);
  else if(atype==="diagnostic")drawWeak(ctx,c,subs,log);
  else if(atype==="prescriptive")drawPriority(ctx,c,subs,log);
  else if(atype==="predictive")drawPredict(ctx,c,sess);
  drawShared();
}

function drawAcc(ctx,c,subs,log){
  const acc={};subs.forEach(s=>acc[s]={c:0,t:0});
  log.forEach(l=>{if(acc[l.subject]){acc[l.subject].t++;if(l.correct)acc[l.subject].c++;}});
  const vals=subs.map(s=>acc[s].t?Math.round(acc[s].c/acc[s].t*100):0);
  barChart(ctx,c.width,c.height,subs,vals,["#3b82f6","#8b5cf6","#06b6d4","#f59e0b","#ef4444"],t('accBySub'));
}

function drawWeak(ctx,c,subs,log){
  const w={};subs.forEach(s=>w[s]=0);
  log.filter(l=>!l.correct).forEach(l=>{if(w[l.subject]!==undefined)w[l.subject]++;});
  const mx=Math.max(...Object.values(w),1),vals=subs.map(s=>Math.round(w[s]/mx*100));
  barChart(ctx,c.width,c.height,subs,vals,["#ef4444","#f97316","#eab308","#f43f5e","#dc2626"],t('weakZones'));
}

function drawPriority(ctx,c,subs,log){
  const acc={};const cnt={};subs.forEach(s=>{acc[s]=0;cnt[s]=0;});
  log.forEach(l=>{if(cnt[l.subject]!==undefined){cnt[l.subject]++;if(l.correct)acc[l.subject]++;}});
  const vals=subs.map(s=>{const a=cnt[s]?Math.round(acc[s]/cnt[s]*100):0;return Math.max(0,80-a);});
  barChart(ctx,c.width,c.height,subs,vals,["#22c55e","#16a34a","#15803d","#166534","#14532d"],t('priority'));
}

function drawPredict(ctx,c,sess){
  const r=sess.slice(-10);
  if(r.length<2){ctx.fillStyle="var(--muted)";ctx.font="14px system-ui";ctx.fillText(t('needMin2'),60,100);return;}
  const a=r.map(s=>s.accuracy),n=a.length;
  const sx=a.reduce((s,_,i)=>s+i,0),sy=a.reduce((s,v)=>s+v,0),sxy=a.reduce((s,v,i)=>s+i*v,0),sxx=a.reduce((s,_,i)=>s+i*i,0);
  const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx),intercept=(sy-slope*sx)/n;
  const pred=Math.min(100,Math.max(0,Math.round(intercept+slope*n)));
  const w=c.width,h=c.height,pad=60,cw=w-pad*2,ch=h-pad*2;
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--ink")||"#333";
  ctx.font="bold 14px system-ui";ctx.fillText(t('forecast')+pred+"%",pad,30);
  a.forEach((v,i)=>{const x=pad+i*(cw/(n-1||1)),y=h-pad-(v/100)*ch;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle="#3b82f6";ctx.fill();});
  ctx.strokeStyle="#3b82f6";ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(pad,h-pad-(a[0]/100)*ch);ctx.lineTo(pad+(n-1)*(cw/(n-1||1)),h-pad-(a[n-1]/100)*ch);ctx.stroke();
  const px=pad+n*(cw/(n-1||1)),py=h-pad-(pred/100)*ch;
  ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fillStyle="#22c55e";ctx.fill();
}

function drawShared(){
  const c=document.getElementById("sharedChart"),ctx=c.getContext("2d");
  c.width=c.offsetWidth*2;c.height=360;ctx.clearRect(0,0,c.width,c.height);
  const subs=(SPHERES[state.sphere]||SPHERES.F)[state.level],all=state.sessions.filter(s=>s.sphere===state.sphere);
  const acc={};subs.forEach(s=>acc[s]={c:0,t:0});
  all.forEach(s=>(s.log||[]).forEach(l=>{if(acc[l.subject]){acc[l.subject].t++;if(l.correct)acc[l.subject].c++;}}));
  const vals=subs.map(s=>acc[s].t?Math.round(acc[s].c/acc[s].t*100):0);
  barChart(ctx,c.width,c.height,subs,vals,["#3b82f6","#8b5cf6","#06b6d4","#f59e0b","#ef4444"],t('totalAcc'));
}

function barChart(ctx,w,h,labels,values,colors,title){
  const pad=60,bw=Math.min(60,(w-pad*2)/labels.length-10),mx=Math.max(...values,1),ch=h-pad*2;
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--ink")||"#333";
  ctx.font="bold 14px system-ui";ctx.fillText(title,pad,30);
  labels.forEach((l,i)=>{
    const x=pad+i*(bw+10)+10,bh=Math.max(2,(values[i]/mx)*ch),y=h-pad-bh;
    ctx.fillStyle=colors[i%colors.length];ctx.beginPath();ctx.roundRect(x,y,bw,bh,6);ctx.fill();
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--ink")||"#333";
    ctx.font="11px system-ui";ctx.textAlign="center";
    ctx.fillText(l.length>12?l.substring(0,11)+"\u2026":l,x+bw/2,h-pad+16);
    ctx.fillText(values[i]+"%",x+bw/2,y-6);
  });ctx.textAlign="start";
}
