import { useState, useEffect, useRef } from "react";
import DATA from "./data/samgukji_text.json";

// ══════════════════════════════════════════════════════════════════
//  삼국지 원문 한 문장씩 학습 — 8단계 진행
//  1.원문  2.한글해석  3.AI해설  4.장수한마디  5.진선미
//  6.핵심한자 문제  7.정답보상+에피소드  8.오답→제갈량 힌트
//  데이터: src/data/samgukji_text.json (시드 — 추후 확장)
// ══════════════════════════════════════════════════════════════════

const G = {
  bg:"radial-gradient(ellipse at 15% 10%, #120804 0%, #080604 50%, #060810 100%)",
  panel:"rgba(8,5,2,0.92)", border:"rgba(139,100,30,0.32)",
  gold:"#c8a030", goldL:"#f0d060", text:"#e0d0b0", dim:"rgba(220,200,150,0.5)",
  red:"#e05040", green:"#7ab040", blue:"#4a90d9",
};

const JSM = {
  jin:  { key:"jin",  emoji:"💎", name:"진(眞)", creed:"자강불식", color:"#6ab4ff" },
  seon: { key:"seon", emoji:"🌿", name:"선(善)", creed:"계지자선", color:"#8edd50" },
  mi:   { key:"mi",   emoji:"🌸", name:"미(美)", creed:"교이만물", color:"#f0c840" },
};
const JSM_ORDER = ["jin","seon","mi"];
const CAT2JSM = { "진":"jin", "선":"seon", "미":"mi" };

// 지위 사다리 — 한자능력 기준
const RANKS = [
  { min:0,name:"필부(匹夫)",emoji:"👤" },{ min:10,name:"신병(新兵)",emoji:"🪖" },
  { min:25,name:"오장(伍長)",emoji:"🛡️" },{ min:45,name:"도독(都督)",emoji:"👑" },
  { min:80,name:"교위(校尉)",emoji:"🎖️" },{ min:130,name:"편장군(偏將軍)",emoji:"⚔️" },
  { min:200,name:"장군(將軍)",emoji:"🏯" },{ min:320,name:"대장군(大將軍)",emoji:"🐲" },
  { min:480,name:"대도독(大都督)",emoji:"🔱" },{ min:700,name:"승상(丞相)",emoji:"⚜️" },
  { min:1000,name:"황제(皇帝)",emoji:"🦚" },
];
function getRank(p){ for(let i=RANKS.length-1;i>=0;i--) if(p>=RANKS[i].min) return RANKS[i]; return RANKS[0]; }

// 완독 보상 칭호
const COMPLETION_TITLES = [
  { ch:1,   title:"독서입문(讀書入門)", reward:"특별 칭호 획득", emoji:"📖" },
  { ch:10,  title:"박람강기(博覽強記)", reward:"전설 아이템 획득", emoji:"🏆" },
  { ch:120, title:"天下統一",          reward:"천하통일 달성 · 최고 계급", emoji:"🐉" },
];

const SENTS = DATA.sentences || [];
const ALL_MEANINGS = [...new Set(SENTS.flatMap(s=>(s.key_hanja||[]).map(k=>k.m)))];

function shuffle(a){ const r=[...a]; for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }

// 공유 스탯 저장소 (전투 화면과 공유)
const SKEY = "samgukji-battle-v1";
function loadStats(){ try{ const r=localStorage.getItem(SKEY); if(r) return JSON.parse(r); }catch{} return { jiryak:62, gokgan:1000, hanjaPower:0, jin:0, seon:0, mi:0, wins:0 }; }
function saveStats(s){ try{ localStorage.setItem(SKEY, JSON.stringify(s)); }catch{} }

const PKEY = "samgukji-text-progress";  // 가장 멀리 도달한 문장 인덱스
function loadProgress(){ try{ return Math.max(0, parseInt(localStorage.getItem(PKEY)||"0",10)||0); }catch{ return 0; } }
function saveProgress(i){ try{ localStorage.setItem(PKEY, String(i)); }catch{} }

const MKEY = "samgukji-mastered-hanja"; // 마스터한 한자 누적
function loadMastered(){ try{ return JSON.parse(localStorage.getItem(MKEY)||"[]"); }catch{ return []; } }
function saveMastered(a){ try{ localStorage.setItem(MKEY, JSON.stringify(a)); }catch{} }

function getKey(){ try{ return localStorage.getItem("hanja-claude-key")||""; }catch{ return ""; } }
async function callClaude(prompt, key){
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key":key, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500, messages:[{role:"user",content:prompt}] }),
  });
  const d = await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}
async function genCommentary(sent, lord, key){
  if(!key) return null;
  const prompt = `삼국지연의 원문을 배우는 학습 게임 해설자다.
원문: "${sent.original}"
해석: "${sent.korean}"
아래 JSON만 출력(설명 금지):
{"commentary":"이 문장의 의미·삼국지 맥락 해설 2~3문장","general":{"name":"장수이름","line":"이 이치를 강조하는 한마디(약한 유머 허용)"}}`;
  try{
    const txt = await callClaude(prompt, key);
    const m = txt.match(/\{[\s\S]*\}/);
    if(m){ const o=JSON.parse(m[0]); if(o.commentary) return o; }
  }catch{}
  return null;
}

// 곳간 카운트업
function useCountUp(target, dur=900){
  const [val,setVal]=useState(target); const fromRef=useRef(target);
  useEffect(()=>{
    const from=fromRef.current; if(from===target){ setVal(target); return; }
    const t0=performance.now(); let raf;
    const tick=(t)=>{ const p=Math.min(1,(t-t0)/dur); const e=1-Math.pow(1-p,3); setVal(Math.round(from+(target-from)*e)); if(p<1) raf=requestAnimationFrame(tick); else fromRef.current=target; };
    raf=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(raf);
  },[target,dur]);
  return val;
}

// ══════════════════════════════════════════════════════════════════
export default function SamgukjiText({ lord, onBack }){
  const [idx, setIdx]       = useState(()=>Math.min(loadProgress(), Math.max(0,SENTS.length-1)));
  const [stats, setStats]   = useState(loadStats);
  const [mastered, setMastered] = useState(loadMastered);
  const [usedKey] = useState(getKey());
  const [ai, setAi]         = useState(null);    // {commentary, general}
  const [loadingAi, setLoadingAi] = useState(false);
  const [picked, setPicked] = useState(null);    // 진선미
  const [quiz, setQuiz]     = useState(null);    // {word, options}
  const [answered, setAnswered] = useState(null);// {correct, choice}
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(null); // 완독 보상

  const sent = SENTS[idx] || null;
  const rank = getRank(stats.hanjaPower);
  const displayGokgan = useCountUp(stats.gokgan);

  // 진행 현황
  const chapter = sent?.chapter || 1;
  const chapterSents = SENTS.filter(s=>s.chapter===chapter);
  const posInChapter = chapterSents.findIndex(s=>s.id===sent?.id) + 1;

  useEffect(()=>{ saveStats(stats); },[stats]);
  useEffect(()=>{ saveMastered(mastered); },[mastered]);

  // 문장 바뀔 때 AI 해설/장수 준비 + 단계 초기화
  useEffect(()=>{
    if(!sent) return;
    setPicked(null); setQuiz(null); setAnswered(null); setShowHint(false);
    setAi(null);
    let alive = true;
    (async()=>{
      if(usedKey){
        setLoadingAi(true);
        const o = await genCommentary(sent, lord, usedKey);
        if(alive && o){ setAi(o); }
        if(alive) setLoadingAi(false);
      }
    })();
    return ()=>{ alive=false; };
  },[idx]); // eslint-disable-line

  // 정적 폴백 해설/장수
  const commentary = ai?.commentary || `${sent?.episode || "이 문장은 삼국지의 흐름을 이해하는 한 조각입니다."}`;
  const general = ai?.general || { name:"제갈량", line:"주군, 이 이치를 아는 자만이 천하를 얻을 수 있사옵니다!" };

  function choose(jsmKey){
    if(picked) return;
    setPicked(jsmKey);
    const pool = sent.key_hanja || [];
    const word = pool[Math.floor(Math.random()*pool.length)];
    const decoyPool = ALL_MEANINGS.filter(m=>m!==word.m);
    const decoys = shuffle(decoyPool).slice(0,3);
    const options = shuffle([{ m:word.m, ok:true }, ...decoys.map(m=>({ m, ok:false }))]);
    setQuiz({ word, options });
  }

  function answer(opt){
    if(answered?.correct) return;
    const correct = !!opt.ok;
    if(correct){
      setStats(prev=>({
        ...prev,
        jiryak: prev.jiryak+5,
        gokgan: prev.gokgan+50,
        hanjaPower: Math.min(1000, prev.hanjaPower+1),
        [picked]: (prev[picked]||0)+3,
        wins: prev.wins+1,
      }));
      // 마스터 한자 누적
      setMastered(prev=> prev.includes(quiz.word.h) ? prev : [...prev, quiz.word.h]);
      setAnswered({ correct:true, choice:opt });
      setShowHint(false);
    }else{
      setAnswered({ correct:false, choice:opt });
      setStats(prev=>({ ...prev, jiryak:Math.max(0,prev.jiryak-2), gokgan:Math.max(0,prev.gokgan-20) }));
      setShowHint(true);
    }
  }

  function retry(){ setAnswered(null); setShowHint(false); }

  function next(){
    const ni = idx+1;
    if(ni >= SENTS.length){
      // 시드 끝 — 완독 체크
      checkCompletion(chapter);
      return;
    }
    // 완독 보상 체크: 챕터가 끝났는가?
    if(SENTS[ni].chapter !== chapter) checkCompletion(chapter);
    setIdx(ni);
    saveProgress(Math.max(loadProgress(), ni));
  }

  function checkCompletion(ch){
    const t = COMPLETION_TITLES.find(c=>c.ch===ch);
    if(t){ setCelebrate(t); }
  }

  if(!sent){
    return (
      <div style={{minHeight:"100vh",background:G.bg,color:G.text,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:18,marginBottom:12}}>학습할 원문 데이터가 없습니다.</div>
          <button onClick={onBack} style={miniBtn}>↩ 본영</button>
        </div>
      </div>
    );
  }

  const jsm = picked ? JSM[picked] : null;
  const box=(ex={})=>({ background:G.panel, border:`1px solid ${G.border}`, borderRadius:8, padding:"15px 16px", marginBottom:12, backdropFilter:"blur(12px)", ...ex });

  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif"}}>
      <style>{`
        @keyframes tFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tGold{0%{opacity:0;transform:scale(0.8);filter:brightness(2.2)}60%{opacity:1;transform:scale(1.04)}100%{opacity:1;transform:scale(1);filter:brightness(1)}}
        @keyframes tSlide{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:translateX(0)}}
        @keyframes tGlow{0%,100%{box-shadow:0 0 16px rgba(240,200,80,0.3)}50%{box-shadow:0 0 32px rgba(240,200,80,0.65)}}
        @keyframes tShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes tSpin{to{transform:rotate(360deg)}}
        @keyframes tPop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        .topt:hover{background:rgba(200,160,40,0.16)!important;border-color:rgba(220,180,60,0.7)!important;transform:translateY(-2px)}
      `}</style>

      {/* 완독 축하 모달 */}
      {celebrate && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(4,2,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{animation:"tPop 0.5s ease both",background:"linear-gradient(180deg,rgba(50,34,6,0.95),rgba(10,6,2,0.97))",border:"2px solid rgba(240,200,80,0.7)",borderRadius:14,padding:"30px 24px",textAlign:"center",maxWidth:380,boxShadow:"0 0 40px rgba(240,200,80,0.4)"}}>
            <div style={{fontSize:54,marginBottom:10}}>{celebrate.emoji}</div>
            <div style={{fontSize:14,color:G.dim,letterSpacing:"0.2em",marginBottom:6}}>제{celebrate.ch}회 완독!</div>
            <div style={{fontSize:26,fontWeight:900,color:G.goldL,marginBottom:8,textShadow:"0 0 20px rgba(240,200,80,0.5)"}}>{celebrate.title}</div>
            <div style={{fontSize:15,color:G.green,fontWeight:700,marginBottom:20}}>🎁 {celebrate.reward}</div>
            <button onClick={()=>{ setCelebrate(null); const ni=Math.min(idx+1,SENTS.length-1); if(SENTS[ni]&&SENTS[ni].id!==sent.id){ setIdx(ni); saveProgress(Math.max(loadProgress(),ni)); } }} style={nextBtn}>계속 정진하기 ⚔</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:560,margin:"0 auto",padding:"10px 14px 60px"}}>

        {/* 상단 고정: 지위 + 수준 */}
        <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(6,4,2,0.96)",backdropFilter:"blur(10px)",borderRadius:8,border:`1px solid ${G.border}`,padding:"9px 12px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontWeight:700}}>
            <span style={{fontSize:18}}>{rank.emoji}</span>
            <span style={{color:G.goldL,fontSize:15}}>{rank.name}</span>
          </div>
          <div style={{display:"flex",gap:11,fontSize:13,flexWrap:"wrap"}}>
            <span>⚔ <b style={{color:G.text}}>지략 {stats.jiryak}</b></span>
            <span>🏯 <b style={{color:"#f0c860"}}>곳간 {displayGokgan.toLocaleString()}</b></span>
            <span>📚 <b style={{color:"#8edd50"}}>{stats.hanjaPower}/1000</b></span>
          </div>
        </div>

        {/* 진행 현황 */}
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
          <button onClick={onBack} style={miniBtn}>↩ 본영</button>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.dim,marginBottom:4}}>
              <span>제{chapter}회 「{sent.chapter_title}」 {posInChapter}/{chapterSents.length}문장</span>
              <span>전체 {idx+1}/{SENTS.length}</span>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${((idx+1)/SENTS.length)*100}%`,background:"linear-gradient(90deg,#c8a030,#f0d060)",borderRadius:3,transition:"width 0.6s ease"}}/>
            </div>
          </div>
          <span style={{fontSize:11,color:G.dim}}>{usedKey?"🟢AI":"⚪정적"}</span>
        </div>

        {/* 1️⃣ 원문 (황금빛) */}
        <div style={{animation:"tGold 0.7s ease both",border:"1.5px solid rgba(240,200,80,0.55)",borderRadius:10,padding:"20px 18px",background:"linear-gradient(180deg,rgba(40,28,6,0.55),rgba(8,5,2,0.92))",marginBottom:12,textAlign:"center",boxShadow:"0 0 18px rgba(240,200,80,0.2)"}}>
          <div style={{fontSize:11,color:G.dim,letterSpacing:"0.25em",marginBottom:10}}>◈ 原 文 ◈</div>
          <div style={{fontSize:25,fontWeight:700,color:G.goldL,lineHeight:1.7,letterSpacing:"0.06em",textShadow:"0 0 24px rgba(240,200,80,0.45)"}}>{sent.original}</div>
        </div>

        {/* 2️⃣ 한글 해석 */}
        <div style={{...box({animation:"tFade 0.5s ease 0.15s both"})}}>
          <div style={{fontSize:11,color:G.dim,letterSpacing:"0.18em",marginBottom:7}}>◈ 풀 이</div>
          <div style={{fontSize:16.5,lineHeight:1.95,color:"#e4d6ae"}}>{sent.korean}</div>
        </div>

        {/* 3️⃣ AI 해설 */}
        <div style={{...box({animation:"tFade 0.5s ease 0.3s both",borderColor:"rgba(74,144,217,0.35)"})}}>
          <div style={{fontSize:11,color:"#7ab4e8",letterSpacing:"0.18em",marginBottom:7}}>◈ 해 설 {usedKey?"(AI)":""}</div>
          {loadingAi ? (
            <div style={{display:"flex",alignItems:"center",gap:10,color:G.dim,fontSize:14}}>
              <div style={{width:16,height:16,border:`2px solid ${G.border}`,borderTopColor:G.blue,borderRadius:"50%",animation:"tSpin 0.8s linear infinite"}}/>
              해설을 짓는 중…
            </div>
          ) : (
            <div style={{fontSize:15,lineHeight:1.9,color:"#cfdbe8"}}>{commentary}</div>
          )}
        </div>

        {/* 4️⃣ 장수 한마디 */}
        <div style={{...box({animation:"tSlide 0.5s ease 0.42s both",borderColor:"rgba(122,176,64,0.45)",display:"flex",gap:10,alignItems:"flex-start"})}}>
          <span style={{fontSize:22}}>🎖️</span>
          <div><b style={{color:G.green}}>{general.name}</b><div style={{fontSize:15.5,color:G.text,marginTop:3,lineHeight:1.6}}>"{general.line}"</div></div>
        </div>

        {/* 5️⃣ 진선미 선택 */}
        {!picked && (
          <div style={{animation:"tFade 0.5s ease 0.54s both",display:"grid",gap:9,marginTop:4}}>
            <div style={{textAlign:"center",fontSize:13,color:G.dim,marginBottom:2}}>어떤 마음으로 이 글을 새기겠는가?</div>
            {JSM_ORDER.map(k=>{
              const j=JSM[k]; const recommended = CAT2JSM[sent.category]===k;
              return (
                <button key={k} className="topt" onClick={()=>choose(k)} style={{
                  display:"flex",alignItems:"center",gap:12,textAlign:"left",
                  background:"rgba(255,255,255,0.04)",border:`1.5px solid ${j.color}${recommended?"99":"44"}`,
                  borderRadius:8,padding:"13px 15px",cursor:"pointer",fontFamily:"inherit",color:G.text,transition:"all 0.2s",
                }}>
                  <span style={{fontSize:26}}>{j.emoji}</span>
                  <span style={{flex:1}}>
                    <span style={{fontSize:17,fontWeight:800,color:j.color}}>{j.name} {j.creed}</span>
                    {recommended && <span style={{fontSize:12,color:j.color,marginLeft:8,opacity:0.8}}>· 이 문장의 결</span>}
                  </span>
                  <span style={{fontSize:18,color:j.color,opacity:0.7}}>›</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 6️⃣ 핵심 한자 문제 */}
        {quiz && (
          <div style={{animation:"tGold 0.7s ease both",border:"1.5px solid rgba(240,200,80,0.6)",borderRadius:10,padding:"18px 16px",background:"linear-gradient(180deg,rgba(40,28,6,0.6),rgba(8,5,2,0.92))",boxShadow:"0 0 18px rgba(240,200,80,0.25)",marginTop:4}}>
            <div style={{textAlign:"center",fontSize:12,color:jsm.color,fontWeight:700,marginBottom:8}}>{jsm.emoji} {jsm.name} {jsm.creed}</div>
            <div style={{textAlign:"center",fontSize:11,color:G.dim,letterSpacing:"0.2em",marginBottom:8}}>◈ 문장 속 핵심 한자 ◈</div>
            <div style={{textAlign:"center",marginBottom:4}}>
              <div style={{fontSize:42,fontWeight:900,color:G.goldL,letterSpacing:"0.08em",textShadow:"0 0 24px rgba(240,200,80,0.55)"}}>{quiz.word.h}</div>
              <div style={{fontSize:14,color:G.dim,marginTop:4}}>「{quiz.word.r}」 — 이 한자의 뜻은?</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}}>
              {quiz.options.map((opt,i)=>{
                const isAns = answered && opt.ok;
                const isWrong = answered && answered.choice===opt && !opt.ok;
                return (
                  <button key={i} className={!answered?.correct?"topt":""} onClick={()=>answer(opt)} disabled={answered?.correct} style={{
                    background:isAns?"rgba(122,176,64,0.22)":isWrong?"rgba(224,80,64,0.2)":"rgba(255,255,255,0.05)",
                    border:`1.5px solid ${isAns?G.green:isWrong?G.red:G.border}`,
                    borderRadius:7,padding:"12px 9px",cursor:answered?.correct?"default":"pointer",
                    color:G.text,fontSize:14.5,fontWeight:600,fontFamily:"inherit",transition:"all 0.18s",
                    opacity:answered?.correct&&!opt.ok?0.4:1,
                  }}>
                    {isAns?"✅ ":isWrong?"❌ ":""}{opt.m}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 8️⃣ 오답 → 제갈량 힌트 + 재도전 */}
        {showHint && answered && !answered.correct && (
          <div style={{...box({marginTop:12,animation:"tShake 0.5s ease both",borderColor:"rgba(224,80,64,0.55)"})}}>
            <div style={{fontSize:16,fontWeight:800,color:G.red,marginBottom:8,textAlign:"center"}}>😵 오답! 적장이 코웃음친다…</div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",background:"rgba(74,144,217,0.08)",border:"1px solid rgba(74,144,217,0.3)",borderRadius:7,padding:"11px 12px",marginBottom:12}}>
              <span style={{fontSize:20}}>🪶</span>
              <div><b style={{color:"#7ab4e8"}}>제갈량의 힌트</b>
                <div style={{fontSize:14.5,color:G.text,marginTop:3,lineHeight:1.65}}>이 문장은 "{sent.korean}" — 「{quiz.word.h}」은(는) <b style={{color:G.goldL}}>그 안의 핵심</b>이옵니다. 뜻을 다시 헤아리소서.</div>
              </div>
            </div>
            <button onClick={retry} style={{...nextBtn,background:"linear-gradient(90deg,#3a5a8b,#4a90d9)"}}>다시 도전 🔄</button>
          </div>
        )}

        {/* 7️⃣ 정답 보상 + 에피소드 + 다음 */}
        {answered?.correct && (
          <div style={{...box({marginTop:12,animation:"tGlow 1.4s ease 1",borderColor:"rgba(240,200,80,0.6)"})}}>
            <div style={{textAlign:"center",fontSize:19,fontWeight:900,color:G.goldL,marginBottom:10}}>🎉 적중! 「{quiz.word.h}({quiz.word.r})」 = {quiz.word.m}</div>
            <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",fontSize:15,fontWeight:700,marginBottom:12}}>
              <span style={{color:G.blue}}>지략 +5</span>
              <span style={{color:"#f0c860"}}>곳간 +50</span>
              <span style={{color:G.green}}>한자능력 +1</span>
              <span style={{color:jsm.color}}>{jsm.name} +3</span>
            </div>
            {/* 음훈·뜻풀이·에피소드 */}
            <div style={{borderTop:`1px solid ${G.border}`,paddingTop:11,marginBottom:12}}>
              <div style={{fontSize:13,color:G.dim,marginBottom:6}}>📜 음훈·뜻풀이</div>
              {(sent.key_hanja||[]).map((k,i)=>(
                <div key={i} style={{display:"flex",gap:8,fontSize:14,marginBottom:3,color:"#d8c8a0"}}>
                  <b style={{color:G.goldL,minWidth:54}}>{k.h}</b><span style={{color:G.dim}}>{k.r}</span><span>— {k.m}</span>
                </div>
              ))}
              {sent.episode && <div style={{fontSize:13.5,color:"#b8a878",fontStyle:"italic",marginTop:8,lineHeight:1.7}}>💡 {sent.episode}</div>}
              <div style={{fontSize:12,color:G.dim,marginTop:8}}>📚 마스터한 한자: {mastered.length}자</div>
            </div>
            <button onClick={next} style={nextBtn}>{idx+1>=SENTS.length?"시드 완료 — 결과 보기 ⚑":"다음 문장으로 →"}</button>
          </div>
        )}

      </div>
    </div>
  );
}

const miniBtn = { background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, borderRadius:6, padding:"6px 12px", color:G.dim, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" };
const nextBtn = { width:"100%", background:"linear-gradient(90deg,#8b0000,#c8601c,#c8a030)", border:"1.5px solid rgba(240,180,40,0.7)", borderRadius:7, padding:"13px", color:"#fff", fontSize:16.5, fontWeight:800, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.06em" };
