import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════
//  전투 화면 — 7단계 + 선택 품질 차등 난이도 시스템
//  진선미 선택의 질(최적/보통/잘못)이 한자 문제 난이도와 보상을 결정.
//  Claude API 키(localStorage 'hanja-claude-key') 있으면 상황을 새로
//  생성하고 최적 선택까지 판정, 없으면 정적 데이터로 폴백.
// ══════════════════════════════════════════════════════════════════

const G = {
  bg:"radial-gradient(ellipse at 15% 10%, #120804 0%, #080604 50%, #060810 100%)",
  panel:"rgba(8,5,2,0.92)", border:"rgba(139,100,30,0.32)",
  gold:"#c8a030", goldL:"#f0d060", text:"#e0d0b0", dim:"rgba(220,200,150,0.5)",
  red:"#e05040", green:"#7ab040", blue:"#4a90d9", silver:"#cfcfd6",
};

const JSM = {
  jin:  { key:"jin",  emoji:"💎", name:"진(眞)", creed:"자강불식", sub:"정면돌파", color:"#6ab4ff" },
  seon: { key:"seon", emoji:"🌿", name:"선(善)", creed:"계지자선", sub:"민심수습", color:"#8edd50" },
  mi:   { key:"mi",   emoji:"🌸", name:"미(美)", creed:"교이만물", sub:"기지발휘", color:"#f0c840" },
};
const JSM_ORDER = ["jin","seon","mi"];

// 지위(관직) 사다리 — 한자능력 기준
const RANKS = [
  { min:0,name:"필부(匹夫)",emoji:"👤" },{ min:10,name:"신병(新兵)",emoji:"🪖" },
  { min:25,name:"오장(伍長)",emoji:"🛡️" },{ min:45,name:"도독(都督)",emoji:"👑" },
  { min:80,name:"교위(校尉)",emoji:"🎖️" },{ min:130,name:"편장군(偏將軍)",emoji:"⚔️" },
  { min:200,name:"장군(將軍)",emoji:"🏯" },{ min:320,name:"대장군(大將軍)",emoji:"🐲" },
  { min:480,name:"대도독(大都督)",emoji:"🔱" },{ min:700,name:"승상(丞相)",emoji:"⚜️" },
  { min:1000,name:"황제(皇帝)",emoji:"🦚" },
];
function getRank(p){ for(let i=RANKS.length-1;i>=0;i--) if(p>=RANKS[i].min) return RANKS[i]; return RANKS[0]; }

// ── 난이도별 한자 풀 ────────────────────────────────────────────
// 최적 선택 → EASY(생활한자), 보통 → 상황 단어, 잘못 → HARD(사자성어/계략)
const EASY = [
  {h:"太陽",r:"태양",m:"해"},{h:"山川",r:"산천",m:"산과 내"},{h:"家族",r:"가족",m:"한 집안 사람"},
  {h:"天地",r:"천지",m:"하늘과 땅"},{h:"日月",r:"일월",m:"해와 달"},{h:"父母",r:"부모",m:"어버이"},
  {h:"草木",r:"초목",m:"풀과 나무"},{h:"衣食",r:"의식",m:"옷과 음식"},{h:"江山",r:"강산",m:"강과 산"},
  {h:"春秋",r:"춘추",m:"봄과 가을"},
];
const HARD = [
  {h:"臥薪嘗膽",r:"와신상담",m:"원수를 갚으려 괴로움을 참고 견딤"},
  {h:"背水陣",r:"배수진",m:"물러설 곳 없는 결사의 진"},
  {h:"空城計",r:"공성계",m:"빈 성으로 적을 속이는 계책"},
  {h:"苦肉計",r:"고육계",m:"제 몸을 상해가며 적을 속이는 꾀"},
  {h:"連環計",r:"연환계",m:"여러 계책을 잇따라 거는 꾀"},
  {h:"三顧草廬",r:"삼고초려",m:"인재를 세 번 찾아가 모심"},
  {h:"聲東擊西",r:"성동격서",m:"동쪽을 치는 척 서쪽을 침"},
  {h:"借刀殺人",r:"차도살인",m:"남의 칼을 빌려 적을 침"},
];

// ── 정적 상황 풀 (best/ok/bad = 진선미 선택 품질, reason = 이유) ──
const SITS = [
  {
    loc:"관도 벌판 — 원소의 70만 대군이 남하하고 있다",
    detail:"아군 군량이 사흘치뿐. 허유가 투항해 오소(烏巢)의 군량창고 위치를 일러준다. 정면으로 부딪칠 것인가, 허를 찌를 것인가.",
    ally:{ name:"조조", line:"오소를 불태워라! 승부는 바로 지금이다!" },
    enemy:{ name:"원소", line:"함정이다, 속지 마라… 응? 왜 우리 창고가 타고 있느냐!" },
    words:[{h:"糧食",r:"양식",m:"식량"},{h:"火攻",r:"화공",m:"불로 하는 공격"},{h:"奇襲",r:"기습",m:"몰래 들이침"},{h:"兵糧",r:"병량",m:"군대의 식량"}],
    best:"mi", ok:"jin", bad:"seon",
    reason:"적의 보급을 끊는 기습은 정공법이 아닌 기지(美·교이만물)가 최적입니다. 민심수습(善)은 지금 한가한 선택이지요.",
  },
  {
    loc:"적벽 강변 — 조조의 백만 수군이 강을 메웠다",
    detail:"북군은 물에 약하다. 동남풍이 불기 시작했고 황개가 거짓 항복으로 화선(火船)을 끌고 다가간다. 바람과 불의 한 수.",
    ally:{ name:"주유", line:"동남풍이 분다! 황개, 불을 놓아라!" },
    enemy:{ name:"조조", line:"배를 사슬로 묶었으니 끄떡없다… 어이쿠 뜨거!" },
    words:[{h:"東風",r:"동풍",m:"동쪽 바람"},{h:"水軍",r:"수군",m:"물 위 군대"},{h:"火船",r:"화선",m:"불 붙인 배"},{h:"連環",r:"연환",m:"고리로 이음"}],
    best:"mi", ok:"jin", bad:"seon",
    reason:"바람과 불을 읽어 적을 태우는 화계는 기지(美)의 정수입니다. 정면충돌(眞)은 차선, 민심(善)은 무관합니다.",
  },
  {
    loc:"가정(街亭) 요충지 — 위군 장합이 물길을 노린다",
    detail:"마속이 명을 어기고 산 위에 진을 쳤다. 군율을 세워 원칙을 지킬 것인가, 인재를 감싸 민심을 살릴 것인가.",
    ally:{ name:"제갈량", line:"눈물을 머금고 마속을 베어 군율을 세우리라." },
    enemy:{ name:"장합", line:"산 위에 진을 쳤다고? 물만 끊으면 끝이지. 고맙구나!" },
    words:[{h:"水路",r:"수로",m:"물길"},{h:"軍律",r:"군율",m:"군대의 규율"},{h:"包圍",r:"포위",m:"에워쌈"},{h:"要衝",r:"요충",m:"중요한 길목"}],
    best:"jin", ok:"seon", bad:"mi",
    reason:"군율을 흔들림 없이 세우는 원칙(眞·자강불식)이 최적입니다. 인재를 감싸는 정(善)은 차선, 잔꾀(美)는 위험합니다.",
  },
  {
    loc:"합비 성벽 — 십만 오군이 성을 에워쌌다",
    detail:"성안의 병력은 칠천뿐. 장료가 새벽 결사대로 적의 기세를 정면에서 꺾자 한다. 기다리면 성은 함락된다.",
    ally:{ name:"장료", line:"팔백 결사대다! 손권의 코앞까지 쳐들어간다!" },
    enemy:{ name:"손권", line:"고작 팔백에 십만이… 체면이 말이 아니로구나." },
    words:[{h:"城壁",r:"성벽",m:"성의 담"},{h:"決死",r:"결사",m:"죽기를 각오함"},{h:"先攻",r:"선공",m:"먼저 침"},{h:"突擊",r:"돌격",m:"냅다 돌진"}],
    best:"jin", ok:"mi", bad:"seon",
    reason:"소수로 기선을 제압하는 결사의 정면돌파(眞)가 최적입니다. 기지(美)는 차선, 민심수습(善)은 지금 무력합니다.",
  },
  {
    loc:"오장원 — 사마의가 지구전으로 버틴다",
    detail:"승상의 병이 깊다. 사마의는 굳게 지키며 싸움을 피한다. 도발에 흔들리지 않고 꾸준히 버틸 것인가.",
    ally:{ name:"제갈량", line:"오장원의 별이 저무는구나… 후사를 부탁하노라." },
    enemy:{ name:"사마의", line:"안 싸우는 게 이기는 거다. 옷? 잘 입을게, 고맙다." },
    words:[{h:"持久",r:"지구",m:"오래 버팀"},{h:"挑發",r:"도발",m:"집적거림"},{h:"忍耐",r:"인내",m:"참고 견딤"},{h:"星落",r:"성락",m:"별이 떨어짐"}],
    best:"seon", ok:"jin", bad:"mi",
    reason:"흔들림 없이 민심과 보급을 다지며 때를 기다리는 후덕함(善·계지자선)이 최적입니다. 무리한 잔꾀(美)는 패착입니다.",
  },
  {
    loc:"형주 본영 — 관우가 번성을 수공(水攻)으로 노린다",
    detail:"가을 장맛비로 한수가 불었다. 우금의 칠군이 평지에 진을 쳤다. 둑을 터 수장할 기지를 낼 것인가, 후방을 살필 것인가.",
    ally:{ name:"관우", line:"하늘이 물을 내리셨다! 칠군을 수장하라!" },
    enemy:{ name:"우금", line:"비 좀 온다고 설마… 어, 어어, 배가 필요해!" },
    words:[{h:"水攻",r:"수공",m:"물로 공격"},{h:"洪水",r:"홍수",m:"큰물"},{h:"後方",r:"후방",m:"뒤쪽"},{h:"堤防",r:"제방",m:"둑"}],
    best:"mi", ok:"seon", bad:"jin",
    reason:"불어난 물을 무기로 쓰는 수공의 기지(美)가 최적입니다. 후방경계(善)는 차선, 무모한 정면(眞)은 위험합니다.",
  },
  {
    loc:"정군산 — 노장 황충이 하후연과 맞선다",
    detail:"법정이 고지 선점을 권한다. 북소리 한 번에 산을 내달려 적장의 목을 정면에서 노린다. 노익장을 보일 때.",
    ally:{ name:"황충", line:"늙었다 누가 그랬나! 단칼에 하후연을 베리라!" },
    enemy:{ name:"하후연", line:"저 늙은이가 설마 저 속도로… 헉!" },
    words:[{h:"老將",r:"노장",m:"늙은 장수"},{h:"高地",r:"고지",m:"높은 땅"},{h:"先占",r:"선점",m:"먼저 차지"},{h:"勇猛",r:"용맹",m:"날쌔고 사나움"}],
    best:"jin", ok:"mi", bad:"seon",
    reason:"고지를 딛고 단숨에 적장을 베는 용맹한 정면돌파(眞)가 최적입니다. 민심(善)은 지금 어울리지 않습니다.",
  },
  {
    loc:"위남 — 마초의 서량 철기가 조조를 몰아친다",
    detail:"철기의 속도가 위군을 공포에 빠뜨린다. 조조가 수염을 자르고 달아난다. 속도로 정면에서 짓밟을 것인가.",
    ally:{ name:"마초", line:"수염 깎은 자가 조조다! 도포 벗은 자가 조조다!" },
    enemy:{ name:"조조", line:"수염을… 도포를… 아니 나 좀 그만 알아봐 줄래?!" },
    words:[{h:"鐵騎",r:"철기",m:"철갑 기병"},{h:"迅速",r:"신속",m:"매우 빠름"},{h:"離間",r:"이간",m:"사이 갈라놓기"},{h:"恐怖",r:"공포",m:"두려움"}],
    best:"jin", ok:"mi", bad:"seon",
    reason:"철기의 속도로 적을 정면에서 짓밟는 강공(眞)이 최적입니다. 다만 이간책(美의 어두운 면)을 경계해야 합니다.",
  },
];

// 아군 칭찬(최적) / 적장 비웃음(잘못) 대사 풀
const PRAISE = ["과연 주군! 그 안목이면 천하가 우리 것이오!","탁월하십니다! 장수들이 목숨 걸 만하옵니다!","역시! 주군의 한 수에 적이 무너집니다!"];
const TAUNT = ["사마의: 역시 생각이 짧군. 덕분에 편하게 이기겠다!","여포: 하하! 그게 최선이냐? 실망이다!","조조: 그 정도 머리로 천하를? 어림없지!"];

const DECOY_MEANINGS = ["하늘의 뜻","바다의 깊이","봄날의 햇살","산속의 절","말 위의 장수","책 속의 지혜","밤하늘의 달","마을의 잔치","빈 수레","돌다리","굳은 약속","먼 길손","새벽 안개","빈 들판"];
function shuffle(a){ const r=[...a]; for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }
function pick1(a){ return a[Math.floor(Math.random()*a.length)]; }

// ── Claude API ──────────────────────────────────────────────────
function getKey(){ try{ return localStorage.getItem("hanja-claude-key")||""; }catch{ return ""; } }
async function callClaude(prompt, key){
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key":key, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user",content:prompt}] }),
  });
  const d = await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}
async function genSituation(lord, key){
  if(!key) return null;
  const prompt = `삼국지 전략 시뮬레이션의 전투 상황을 하나 생성하라. 군주는 ${lord?.name||"주군"}. B급 유머와 약한 비어 허용.
진선미 중 이 상황의 최적/보통/잘못 선택을 판정하라(jin=정면돌파, seon=민심수습, mi=기지발휘).
아래 JSON만 출력(설명 금지):
{"loc":"장소 — 한 줄 위기(20자내)","detail":"상황 2~3문장","ally":{"name":"아군장수","line":"한마디(유머)"},"enemy":{"name":"적장","line":"한마디(유머)"},"words":[{"h":"두글자한자","r":"음","m":"짧은뜻"}],"best":"jin|seon|mi","ok":"jin|seon|mi","bad":"jin|seon|mi","reason":"왜 best가 최적인지 한 문장"}
words는 상황 연관 한자 4개. 순수 JSON만.`;
  try{
    const txt = await callClaude(prompt, key);
    const m = txt.match(/\{[\s\S]*\}/);
    if(m){ const o=JSON.parse(m[0]); if(o.loc&&o.detail&&Array.isArray(o.words)&&o.words.length&&o.best) return o; }
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

// ── 영속 상태 (선택 통계 포함) ──────────────────────────────────
const SKEY = "samgukji-battle-v1";
function loadStats(){
  try{ const r=localStorage.getItem(SKEY); if(r) return { ...defaultStats(), ...JSON.parse(r) }; }catch{}
  return defaultStats();
}
function defaultStats(){
  return {
    jiryak:62, gokgan:1000, hanjaPower:0, jin:0, seon:0, mi:0, wins:0,
    combo:0,                                   // 연속 최적 콤보
    choiceTotal:0, optimalCount:0,             // 최적 선택률
    cstat:{ jin:{ch:0,opt:0}, seon:{ch:0,opt:0}, mi:{ch:0,opt:0} }, // 진선미별 선택/최적
  };
}
function saveStats(s){ try{ localStorage.setItem(SKEY, JSON.stringify(s)); }catch{} }

// 품질별 연출/보상 정의
const QUALITY = {
  optimal:{ ring:"#f0d060", border:G.green, title:"✨ 탁월한 선택입니다, 주군!", label:"쉬운 문제 (1~2단계)", pool:"easy",
            reward:{jiryak:10,gokgan:100,hp:2}, penalty:{jiryak:-2,gokgan:-20} },
  ok:     { ring:G.silver, border:G.silver, title:"🤝 나쁘지 않은 선택입니다", label:"보통 문제 (2~3단계)", pool:"normal",
            reward:{jiryak:5,gokgan:50,hp:1},  penalty:{jiryak:-2,gokgan:-20} },
  bad:    { ring:G.red, border:G.red, title:"⚠ 위험한 선택입니다, 주군!", label:"어려운 문제 (3단계)", pool:"hard",
            reward:{jiryak:2,gokgan:20,hp:1},  penalty:{jiryak:-5,gokgan:-50} },
};

// ══════════════════════════════════════════════════════════════════
export default function BattleScreen({ lord, onBack, onHanja }){
  const [stats, setStats]   = useState(loadStats);
  const [sit, setSit]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [usedKey] = useState(getKey());
  const [step, setStep]     = useState("situation"); // situation | quiz | result
  const [picked, setPicked] = useState(null);
  const [quality, setQuality] = useState(null);      // 'optimal'|'ok'|'bad'
  const [quiz, setQuiz]     = useState(null);
  const [answered, setAnswered] = useState(null);    // {correct, choice, gain}
  const [comboHit, setComboHit] = useState(false);
  const seedRef = useRef(0);

  const rank = getRank(stats.hanjaPower);
  const displayGokgan = useCountUp(stats.gokgan);
  const optimalRate = stats.choiceTotal>0 ? Math.round(stats.optimalCount/stats.choiceTotal*100) : 0;

  // 취약 진선미 분석
  const weak = (()=>{
    const c = stats.cstat||{}; let worst=null, worstRate=2;
    JSM_ORDER.forEach(k=>{
      const e=c[k]||{ch:0,opt:0};
      const rate = e.ch>0 ? e.opt/e.ch : -1; // 미선택은 -1(가장 약함 취급)
      if(rate<worstRate){ worstRate=rate; worst=k; }
    });
    if(!worst || stats.choiceTotal<3) return null;
    return { key:worst, never:(c[worst]?.ch||0)===0 };
  })();

  async function loadSituation(){
    setStep("situation"); setPicked(null); setQuality(null); setQuiz(null); setAnswered(null); setComboHit(false);
    setLoading(true);
    let s = await genSituation(lord, usedKey);
    if(!s){
      const idx = (seedRef.current + Math.floor(Math.random()*SITS.length)) % SITS.length;
      seedRef.current = idx+1;
      s = SITS[idx];
    }
    setSit(s); setLoading(false);
  }
  useEffect(()=>{ loadSituation(); /* eslint-disable-next-line */ },[]);
  useEffect(()=>{ saveStats(stats); },[stats]);

  // 진선미 선택 → 품질 판정 → 난이도별 문제 구성
  function choose(jsmKey){
    if(picked) return;
    const q = jsmKey===sit.best ? "optimal" : jsmKey===sit.bad ? "bad" : "ok";
    setPicked(jsmKey); setQuality(q);

    const conf = QUALITY[q];
    let pool = conf.pool==="easy" ? EASY : conf.pool==="hard" ? HARD : (sit.words||EASY);
    const word = pick1(pool);
    const decoys = shuffle([...DECOY_MEANINGS, ...pool.filter(w=>w.m!==word.m).map(w=>w.m)]).filter(m=>m!==word.m).slice(0,3);
    const options = shuffle([{ m:word.m, ok:true }, ...decoys.map(m=>({ m, ok:false }))]);
    setQuiz({ word, options });

    // 선택 통계 갱신
    setStats(prev=>{
      const cstat = { ...prev.cstat, [jsmKey]:{ ch:(prev.cstat[jsmKey]?.ch||0)+1, opt:(prev.cstat[jsmKey]?.opt||0)+(q==="optimal"?1:0) } };
      return { ...prev, choiceTotal:prev.choiceTotal+1, optimalCount:prev.optimalCount+(q==="optimal"?1:0), cstat };
    });
    setStep("quiz");
  }

  function answer(opt){
    if(answered) return;
    const correct = !!opt.ok;
    const conf = QUALITY[quality];
    let gain;
    setStats(prev=>{
      let combo = prev.combo;
      if(correct){
        if(quality==="optimal"){ combo = prev.combo+1; } else { combo = 0; }
        const mult = (quality==="optimal" && combo>=2) ? 2 : 1;
        gain = { jiryak:conf.reward.jiryak*mult, gokgan:conf.reward.gokgan*mult, hp:conf.reward.hp*mult, mult };
        return {
          ...prev,
          jiryak: prev.jiryak + gain.jiryak,
          gokgan: prev.gokgan + gain.gokgan,
          hanjaPower: Math.min(1000, prev.hanjaPower + gain.hp),
          [picked]: (prev[picked]||0)+3,
          wins: prev.wins+1, combo,
        };
      }else{
        gain = { jiryak:conf.penalty.jiryak, gokgan:conf.penalty.gokgan, hp:0, mult:1 };
        return {
          ...prev,
          jiryak: Math.max(0, prev.jiryak + gain.jiryak),
          gokgan: Math.max(0, prev.gokgan + gain.gokgan),
          combo: 0,
        };
      }
    });
    if(correct && quality==="optimal" && stats.combo+1>=2) setComboHit(true);
    setAnswered({ correct, choice:opt, gain });
    setStep("result");
  }

  const jsm = picked ? JSM[picked] : null;
  const conf = quality ? QUALITY[quality] : null;
  const box=(ex={})=>({ background:G.panel, border:`1px solid ${G.border}`, borderRadius:8, padding:"16px", marginBottom:12, backdropFilter:"blur(12px)", ...ex });

  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif"}}>
      <style>{`
        @keyframes bFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bSlide{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:translateX(0)}}
        @keyframes bSlideR{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:translateX(0)}}
        @keyframes bGold{0%{opacity:0;transform:scale(0.7);filter:brightness(2.4)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1);filter:brightness(1)}}
        @keyframes bGlow{0%,100%{box-shadow:0 0 18px rgba(240,200,80,0.35)}50%{box-shadow:0 0 34px rgba(240,200,80,0.7)}}
        @keyframes bShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes bSpin{to{transform:rotate(360deg)}}
        @keyframes bCheer{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-8px) rotate(-6deg)}75%{transform:translateY(-8px) rotate(6deg)}}
        @keyframes bSneer{0%,100%{transform:translateX(0) rotate(0)}30%{transform:translateX(5px) rotate(4deg)}60%{transform:translateX(-5px) rotate(-4deg)}}
        @keyframes bPop{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}
        .bopt:hover{background:rgba(200,160,40,0.16)!important;border-color:rgba(220,180,60,0.7)!important;transform:translateY(-2px)}
      `}</style>

      <div style={{maxWidth:560,margin:"0 auto",padding:"10px 14px 60px"}}>

        {/* ── 1️⃣ 상단 고정: 지위 + 수준 + 최적률 ── */}
        <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(6,4,2,0.96)",backdropFilter:"blur(10px)",borderRadius:8,border:`1px solid ${G.border}`,padding:"9px 12px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
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

        {/* 최적 선택률 + 콤보 + 취약 */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{fontSize:12.5,color:G.dim}}>🎯 최적 선택률 <b style={{color:optimalRate>=70?G.green:optimalRate>=40?G.goldL:G.red}}>{optimalRate}%</b></span>
          {stats.combo>=2 && <span style={{fontSize:12.5,color:"#ff8c1a",fontWeight:800}}>🔥 {stats.combo}연속 최적! x2</span>}
          {weak && <span style={{fontSize:12,color:G.red}}>· {JSM[weak.key].name} {weak.never?"미시도 — 도전해보세요!":"선택이 약합니다!"}</span>}
        </div>

        {/* 뒤로 / 한자배틀 */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={onBack} style={miniBtn}>↩ 본영</button>
          {onHanja&&<button onClick={onHanja} style={miniBtn}>📜 한자배틀</button>}
          <div style={{flex:1}}/>
          <span style={{fontSize:12,color:G.dim,alignSelf:"center"}}>{usedKey?"🟢 AI 생성":"⚪ 정적 생성"}</span>
        </div>

        {loading && (
          <div style={box({textAlign:"center",padding:"40px 0"})}>
            <div style={{width:30,height:30,border:`3px solid ${G.border}`,borderTopColor:G.gold,borderRadius:"50%",margin:"0 auto 12px",animation:"bSpin 0.8s linear infinite"}}/>
            <div style={{color:G.dim}}>전장의 안개가 걷히는 중…</div>
          </div>
        )}

        {!loading && sit && (
        <>
          {/* ── 2️⃣ 현재 위치 ── */}
          <div style={{animation:"bFade 0.5s ease both",margin:"4px 0 14px",textAlign:"center"}}>
            <div style={{fontSize:12,color:G.dim,letterSpacing:"0.25em",marginBottom:6}}>◈ 전 황 ◈</div>
            <div style={{fontSize:23,fontWeight:900,color:"#f5d050",lineHeight:1.4,textShadow:"0 0 22px rgba(240,200,60,0.45)"}}>{sit.loc}</div>
          </div>

          {/* ── 3️⃣ 디테일한 상황 ── */}
          <div style={{...box({animation:"bFade 0.5s ease 0.18s both",borderColor:"rgba(200,160,40,0.45)"})}}>
            <div style={{fontSize:16.5,lineHeight:2,color:"#d8c8a0"}}>{sit.detail}</div>
          </div>

          {/* ── 4️⃣ 질문 ── */}
          <div style={{animation:"bFade 0.5s ease 0.36s both",textAlign:"center",margin:"16px 0 14px"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#ff6b5a",textShadow:"0 0 16px rgba(224,80,64,0.4)"}}>주군이여, 이 위기를 어떻게 돌파하시겠습니까?</div>
          </div>

          {/* ── 5️⃣ 진선미 선택 ── */}
          {step==="situation" && (
            <div style={{animation:"bFade 0.5s ease 0.54s both",display:"grid",gap:10}}>
              {JSM_ORDER.map(k=>{
                const j=JSM[k];
                return (
                  <button key={k} className="bopt" onClick={()=>choose(k)} style={{
                    display:"flex",alignItems:"center",gap:14,textAlign:"left",
                    background:"rgba(255,255,255,0.04)",border:`1.5px solid ${j.color}55`,
                    borderRadius:8,padding:"15px 16px",cursor:"pointer",fontFamily:"inherit",color:G.text,transition:"all 0.2s",
                  }}>
                    <span style={{fontSize:30}}>{j.emoji}</span>
                    <span style={{flex:1}}>
                      <span style={{fontSize:18,fontWeight:800,color:j.color}}>{j.name} {j.creed}</span>
                      <span style={{display:"block",fontSize:14,color:G.dim,marginTop:2}}>— {j.sub}</span>
                    </span>
                    <span style={{fontSize:20,color:j.color,opacity:0.7}}>›</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── 선택 결과 피드백 (품질별 연출) ── */}
          {(step==="quiz"||step==="result") && conf && (
            <div style={{animation:"bPop 0.4s ease both",border:`1.5px solid ${conf.border}`,borderRadius:10,padding:"14px 16px",marginBottom:12,
                         background:quality==="optimal"?"linear-gradient(180deg,rgba(50,40,8,0.5),rgba(8,5,2,0.9))":quality==="bad"?"linear-gradient(180deg,rgba(50,12,8,0.5),rgba(8,5,2,0.9))":"linear-gradient(180deg,rgba(40,40,46,0.4),rgba(8,5,2,0.9))",
                         boxShadow:`0 0 20px ${conf.ring}44`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:30,animation:quality==="optimal"?"bCheer 0.8s ease 2":quality==="bad"?"bSneer 0.6s ease 2":"none"}}>{quality==="optimal"?"🎉":quality==="bad"?"😈":"🪙"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:17,fontWeight:900,color:conf.ring}}>{conf.title}</div>
                  <div style={{fontSize:13,color:G.dim,marginTop:2}}>{jsm.emoji} {jsm.name} {jsm.creed} 선택 · <b style={{color:conf.border}}>{conf.label}</b></div>
                </div>
              </div>
              {/* 선택 이유(철학 연계) */}
              {sit.reason && <div style={{fontSize:13.5,color:"#cbb98a",lineHeight:1.7,marginTop:10,paddingTop:10,borderTop:`1px solid ${G.border}`}}>💡 {sit.reason}</div>}
              {/* 칭찬/비웃음 */}
              {quality==="optimal" && <div style={{fontSize:14,color:G.green,marginTop:8}}>🟢 <b>{sit.ally.name}</b>: "{pick1(PRAISE)}"</div>}
              {quality==="bad" && (<>
                <div style={{fontSize:14,color:G.red,marginTop:8}}>🔴 {pick1(TAUNT)}</div>
                <div style={{fontSize:14,color:"#7ab4e8",marginTop:4}}>🪶 제갈량: "주군… 이건 좀 아니올시다! 😂"</div>
              </>)}
            </div>
          )}

          {/* ── 6️⃣ 장수 한마디(상황) ── */}
          {(step==="quiz"||step==="result") && jsm && (
            <div style={{marginBottom:12}}>
              <div style={{...box({animation:"bSlide 0.45s ease both",borderColor:"rgba(122,176,64,0.5)",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"})}}>
                <span style={{fontSize:22}}>🟢</span>
                <div><b style={{color:G.green}}>{sit.ally.name}</b><div style={{fontSize:15.5,color:G.text,marginTop:3,lineHeight:1.6}}>"{sit.ally.line}"</div></div>
              </div>
              <div style={{...box({animation:"bSlideR 0.45s ease 0.12s both",borderColor:"rgba(224,80,64,0.5)",marginBottom:0,display:"flex",gap:10,alignItems:"flex-start"})}}>
                <span style={{fontSize:22}}>🔴</span>
                <div><b style={{color:G.red}}>{sit.enemy.name}</b><div style={{fontSize:15.5,color:G.text,marginTop:3,lineHeight:1.6}}>"{sit.enemy.line}"</div></div>
              </div>
            </div>
          )}

          {/* ── 7️⃣ 한자 문제 (난이도별 테두리 색) ── */}
          {(step==="quiz"||step==="result") && quiz && conf && (
            <div style={{animation:"bGold 0.7s ease both",border:`2px solid ${conf.border}`,borderRadius:10,padding:"18px 16px",background:"linear-gradient(180deg,rgba(30,22,8,0.55),rgba(8,5,2,0.92))",boxShadow:`0 0 18px ${conf.border}33`}}>
              <div style={{textAlign:"center",fontSize:12,color:conf.border,letterSpacing:"0.15em",marginBottom:8,fontWeight:700}}>◈ {conf.label} ◈</div>
              <div style={{textAlign:"center",marginBottom:4}}>
                <div style={{fontSize:quiz.word.h.length>=3?38:46,fontWeight:900,color:G.goldL,letterSpacing:"0.08em",textShadow:"0 0 26px rgba(240,200,80,0.5)"}}>{quiz.word.h}</div>
                <div style={{fontSize:14,color:G.dim,marginTop:4}}>「{quiz.word.r}」 — 이 한자의 뜻은?</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}}>
                {quiz.options.map((opt,i)=>{
                  const isAns = answered && opt.ok;
                  const isWrong = answered && answered.choice===opt && !opt.ok;
                  return (
                    <button key={i} className={!answered?"bopt":""} onClick={()=>answer(opt)} disabled={!!answered} style={{
                      background:isAns?"rgba(122,176,64,0.22)":isWrong?"rgba(224,80,64,0.2)":"rgba(255,255,255,0.05)",
                      border:`1.5px solid ${isAns?G.green:isWrong?G.red:G.border}`,
                      borderRadius:7,padding:"13px 9px",cursor:answered?"default":"pointer",
                      color:G.text,fontSize:14.5,fontWeight:600,fontFamily:"inherit",transition:"all 0.18s",
                      opacity:answered&&!opt.ok&&!isWrong?0.45:1,
                    }}>
                      {isAns?"✅ ":isWrong?"❌ ":""}{opt.m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 결과 + 다음 ── */}
          {step==="result" && answered && (
            <div style={{...box({marginTop:12,animation:answered.correct?"bGlow 1.4s ease 1":"bShake 0.5s ease both",borderColor:answered.correct?conf.border:"rgba(224,80,64,0.6)",textAlign:"center"})}}>
              {answered.correct ? (
                <>
                  {comboHit && <div style={{fontSize:15,fontWeight:900,color:"#ff8c1a",marginBottom:6}}>🔥 콤보 보너스 x2!</div>}
                  <div style={{fontSize:20,fontWeight:900,color:G.goldL,marginBottom:8}}>🎉 적중! 「{quiz.word.h}({quiz.word.r})」</div>
                  <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",fontSize:15,fontWeight:700}}>
                    <span style={{color:G.blue}}>지략 +{answered.gain.jiryak}</span>
                    <span style={{color:"#f0c860"}}>곳간 +{answered.gain.gokgan}</span>
                    {answered.gain.hp>0 && <span style={{color:G.green}}>한자능력 +{answered.gain.hp}</span>}
                    <span style={{color:jsm.color}}>{jsm.name} +3</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{fontSize:19,fontWeight:900,color:G.red,marginBottom:8}}>😵 오답! 정답은 「{quiz.word.m}」</div>
                  <div style={{fontSize:14,color:G.dim,fontStyle:"italic",marginBottom:8}}>{quality==="bad"?"어려운 길을 골랐으니 대가가 크다…":"적장이 코웃음친다."}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:14,fontSize:15,fontWeight:700}}>
                    <span style={{color:G.red}}>지략 {answered.gain.jiryak}</span>
                    <span style={{color:G.red}}>곳간 {answered.gain.gokgan}</span>
                  </div>
                </>
              )}
              <button onClick={loadSituation} style={{...nextBtn,marginTop:16}}>다음 전투 ⚔</button>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
}

const miniBtn = { background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, borderRadius:6, padding:"6px 12px", color:G.dim, fontSize:13, cursor:"pointer", fontFamily:"inherit" };
const nextBtn = { width:"100%", background:"linear-gradient(90deg,#8b0000,#c8601c,#c8a030)", border:"1.5px solid rgba(240,180,40,0.7)", borderRadius:7, padding:"14px", color:"#fff", fontSize:17, fontWeight:800, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.08em" };
