import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════
// 18류 카테고리 데이터
// ══════════════════════════════════════════════════════════
const CATS = [
  { id:0,  name:"數字類", kor:"숫자류",  emoji:"🔢", ability:"재물 능력",  item:"금은보화",
    hanja:[{h:"一",r:"일",m:"하나"},{h:"二",r:"이",m:"둘"},{h:"三",r:"삼",m:"셋"},{h:"四",r:"사",m:"넷"},{h:"五",r:"오",m:"다섯"},{h:"六",r:"육",m:"여섯"},{h:"七",r:"칠",m:"일곱"},{h:"八",r:"팔",m:"여덟"},{h:"九",r:"구",m:"아홉"},{h:"十",r:"십",m:"열"},{h:"百",r:"백",m:"백"},{h:"千",r:"천",m:"천"},{h:"萬",r:"만",m:"일만"},{h:"億",r:"억",m:"억"}]},
  { id:1,  name:"人體類", kor:"인체류",  emoji:"🫀", ability:"체력 능력",  item:"갑옷",
    hanja:[{h:"頭",r:"두",m:"머리"},{h:"面",r:"면",m:"얼굴"},{h:"目",r:"목",m:"눈"},{h:"耳",r:"이",m:"귀"},{h:"鼻",r:"비",m:"코"},{h:"口",r:"구",m:"입"},{h:"手",r:"수",m:"손"},{h:"足",r:"족",m:"발"},{h:"心",r:"심",m:"마음"},{h:"骨",r:"골",m:"뼈"},{h:"血",r:"혈",m:"피"},{h:"力",r:"력",m:"힘"}]},
  { id:2,  name:"呼稱類", kor:"호칭류",  emoji:"👑", ability:"명성 능력",  item:"칭호",
    hanja:[{h:"王",r:"왕",m:"왕"},{h:"侯",r:"후",m:"제후"},{h:"將",r:"장",m:"장수"},{h:"相",r:"상",m:"재상"},{h:"君",r:"군",m:"군주"},{h:"臣",r:"신",m:"신하"},{h:"父",r:"부",m:"아버지"},{h:"母",r:"모",m:"어머니"},{h:"兄",r:"형",m:"형"},{h:"弟",r:"제",m:"아우"},{h:"帝",r:"제",m:"황제"},{h:"師",r:"사",m:"스승"}]},
  { id:3,  name:"動物類", kor:"동물류",  emoji:"🐴", ability:"기마 능력",  item:"군마",
    hanja:[{h:"馬",r:"마",m:"말"},{h:"牛",r:"우",m:"소"},{h:"羊",r:"양",m:"양"},{h:"犬",r:"견",m:"개"},{h:"鷄",r:"계",m:"닭"},{h:"龍",r:"룡",m:"용"},{h:"虎",r:"호",m:"호랑이"},{h:"鳥",r:"조",m:"새"},{h:"魚",r:"어",m:"물고기"},{h:"熊",r:"웅",m:"곰"},{h:"鷹",r:"응",m:"매"},{h:"蛇",r:"사",m:"뱀"}]},
  { id:4,  name:"植物類", kor:"식물류",  emoji:"🌿", ability:"보급 능력",  item:"식량",
    hanja:[{h:"木",r:"목",m:"나무"},{h:"花",r:"화",m:"꽃"},{h:"草",r:"초",m:"풀"},{h:"竹",r:"죽",m:"대나무"},{h:"梅",r:"매",m:"매화"},{h:"松",r:"송",m:"소나무"},{h:"菊",r:"국",m:"국화"},{h:"桃",r:"도",m:"복숭아"},{h:"林",r:"림",m:"숲"},{h:"根",r:"근",m:"뿌리"},{h:"葉",r:"엽",m:"잎"},{h:"實",r:"실",m:"열매"}]},
  { id:5,  name:"天體類", kor:"천체류",  emoji:"⭐", ability:"천문 능력",  item:"깃발",
    hanja:[{h:"日",r:"일",m:"해"},{h:"月",r:"월",m:"달"},{h:"星",r:"성",m:"별"},{h:"天",r:"천",m:"하늘"},{h:"地",r:"지",m:"땅"},{h:"風",r:"풍",m:"바람"},{h:"雨",r:"우",m:"비"},{h:"雲",r:"운",m:"구름"},{h:"雪",r:"설",m:"눈"},{h:"火",r:"화",m:"불"},{h:"雷",r:"뢰",m:"천둥"},{h:"光",r:"광",m:"빛"}]},
  { id:6,  name:"地理類", kor:"지리류",  emoji:"🗺️", ability:"지략 능력",  item:"영토",
    hanja:[{h:"山",r:"산",m:"산"},{h:"川",r:"천",m:"내"},{h:"江",r:"강",m:"강"},{h:"河",r:"하",m:"하천"},{h:"湖",r:"호",m:"호수"},{h:"海",r:"해",m:"바다"},{h:"國",r:"국",m:"나라"},{h:"城",r:"성",m:"성"},{h:"道",r:"도",m:"길"},{h:"野",r:"야",m:"들판"},{h:"谷",r:"곡",m:"골짜기"},{h:"原",r:"원",m:"평원"}]},
  { id:7,  name:"衣食類", kor:"의식류",  emoji:"🍚", ability:"생존 능력",  item:"의복",
    hanja:[{h:"衣",r:"의",m:"옷"},{h:"食",r:"식",m:"음식"},{h:"飯",r:"반",m:"밥"},{h:"米",r:"미",m:"쌀"},{h:"水",r:"수",m:"물"},{h:"酒",r:"주",m:"술"},{h:"油",r:"유",m:"기름"},{h:"鹽",r:"염",m:"소금"},{h:"茶",r:"다",m:"차"},{h:"布",r:"포",m:"천"}]},
  { id:8,  name:"住居類", kor:"주거류",  emoji:"🏠", ability:"거점 능력",  item:"성채",
    hanja:[{h:"門",r:"문",m:"문"},{h:"戶",r:"호",m:"집"},{h:"窗",r:"창",m:"창문"},{h:"牆",r:"장",m:"담"},{h:"床",r:"상",m:"침대"},{h:"桌",r:"탁",m:"탁자"},{h:"椅",r:"의",m:"의자"},{h:"宮",r:"궁",m:"궁궐"},{h:"室",r:"실",m:"방"},{h:"堂",r:"당",m:"집"}]},
  { id:9,  name:"道具類", kor:"도구류",  emoji:"⚙️", ability:"제조 능력",  item:"도구",
    hanja:[{h:"刀",r:"도",m:"칼"},{h:"弓",r:"궁",m:"활"},{h:"箭",r:"전",m:"화살"},{h:"車",r:"거",m:"수레"},{h:"船",r:"선",m:"배"},{h:"旗",r:"기",m:"깃발"},{h:"鼓",r:"고",m:"북"},{h:"鐘",r:"종",m:"종"},{h:"筆",r:"필",m:"붓"},{h:"印",r:"인",m:"도장"}]},
  { id:10, name:"宮室類", kor:"궁실류",  emoji:"🏯", ability:"권위 능력",  item:"궁궐",
    hanja:[{h:"殿",r:"전",m:"전각"},{h:"廟",r:"묘",m:"사당"},{h:"壇",r:"단",m:"제단"},{h:"樓",r:"루",m:"누각"},{h:"閣",r:"각",m:"각"},{h:"院",r:"원",m:"뜰"},{h:"府",r:"부",m:"관청"},{h:"臺",r:"대",m:"누대"},{h:"苑",r:"원",m:"동산"},{h:"亭",r:"정",m:"정자"}]},
  { id:11, name:"兵器類", kor:"병기류",  emoji:"⚔️", ability:"전투 능력",  item:"무기",
    hanja:[{h:"兵",r:"병",m:"병사"},{h:"甲",r:"갑",m:"갑옷"},{h:"盾",r:"순",m:"방패"},{h:"槍",r:"창",m:"창"},{h:"戟",r:"극",m:"극"},{h:"弩",r:"노",m:"쇠뇌"},{h:"矛",r:"모",m:"창모"},{h:"斧",r:"부",m:"도끼"},{h:"鞭",r:"편",m:"채찍"},{h:"劍",r:"검",m:"검"}]},
  { id:12, name:"方位類", kor:"방위류",  emoji:"🧭", ability:"전술 능력",  item:"지도",
    hanja:[{h:"東",r:"동",m:"동쪽"},{h:"西",r:"서",m:"서쪽"},{h:"南",r:"남",m:"남쪽"},{h:"北",r:"북",m:"북쪽"},{h:"上",r:"상",m:"위"},{h:"下",r:"하",m:"아래"},{h:"左",r:"좌",m:"왼쪽"},{h:"右",r:"우",m:"오른쪽"},{h:"前",r:"전",m:"앞"},{h:"後",r:"후",m:"뒤"},{h:"中",r:"중",m:"가운데"},{h:"外",r:"외",m:"바깥"}]},
  { id:13, name:"時節類", kor:"시절류",  emoji:"📅", ability:"기회 능력",  item:"시간",
    hanja:[{h:"春",r:"춘",m:"봄"},{h:"夏",r:"하",m:"여름"},{h:"秋",r:"추",m:"가을"},{h:"冬",r:"동",m:"겨울"},{h:"年",r:"년",m:"해"},{h:"時",r:"시",m:"때"},{h:"旦",r:"단",m:"새벽"},{h:"夜",r:"야",m:"밤"},{h:"朝",r:"조",m:"아침"},{h:"昔",r:"석",m:"옛날"}]},
  { id:14, name:"干支類", kor:"간지류",  emoji:"☯️", ability:"운명 능력",  item:"부적",
    hanja:[{h:"甲",r:"갑",m:"첫째천간"},{h:"乙",r:"을",m:"둘째천간"},{h:"丙",r:"병",m:"셋째천간"},{h:"丁",r:"정",m:"넷째천간"},{h:"子",r:"자",m:"쥐"},{h:"丑",r:"축",m:"소"},{h:"寅",r:"인",m:"호랑이"},{h:"卯",r:"묘",m:"토끼"},{h:"辰",r:"진",m:"용"},{h:"巳",r:"사",m:"뱀"}]},
  { id:15, name:"動態類", kor:"동태류",  emoji:"⚡", ability:"속도 능력",  item:"전마",
    hanja:[{h:"行",r:"행",m:"가다"},{h:"走",r:"주",m:"달리다"},{h:"飛",r:"비",m:"날다"},{h:"攻",r:"공",m:"공격하다"},{h:"守",r:"수",m:"지키다"},{h:"進",r:"진",m:"나아가다"},{h:"退",r:"퇴",m:"물러나다"},{h:"立",r:"립",m:"서다"},{h:"坐",r:"좌",m:"앉다"},{h:"起",r:"기",m:"일어나다"}]},
  { id:16, name:"狀況類", kor:"상황류",  emoji:"🎯", ability:"판단 능력",  item:"참모",
    hanja:[{h:"勝",r:"승",m:"이기다"},{h:"敗",r:"패",m:"지다"},{h:"強",r:"강",m:"강하다"},{h:"弱",r:"약",m:"약하다"},{h:"生",r:"생",m:"살다"},{h:"死",r:"사",m:"죽다"},{h:"苦",r:"고",m:"괴롭다"},{h:"樂",r:"락",m:"즐겁다"},{h:"難",r:"난",m:"어렵다"},{h:"吉",r:"길",m:"길하다"}]},
  { id:17, name:"其他類", kor:"기타류",  emoji:"📚", ability:"잡학 능력",  item:"잡동사니",
    hanja:[{h:"仁",r:"인",m:"어질다"},{h:"義",r:"의",m:"의롭다"},{h:"禮",r:"례",m:"예절"},{h:"智",r:"지",m:"지혜"},{h:"信",r:"신",m:"믿음"},{h:"忠",r:"충",m:"충성"},{h:"孝",r:"효",m:"효도"},{h:"學",r:"학",m:"배우다"},{h:"知",r:"지",m:"알다"},{h:"德",r:"덕",m:"덕"}]},
];

// 액션 → 카테고리 매핑
const ACTION_CATS = {
  attack:   [11,12,15],
  defense:  [1,8,10],
  strategy: [5,14,16],
};

// 적장 6인
const ENEMIES = [
  { id:"dt", name:"동탁", hanja:"董卓", title:"낙양의 폭군", emoji:"😈", color:"#cc3030",
    intro:"나 동탁이다! 감히 도전하는 것이냐!", taunt:"이 멍청한 놈! 한자도 모르면서!", wrong:"캬하하하! 역시 수준이 그거구나!",
    surrender:"으... 살려주십시오! 하인이 되겠나이다...",
    items:["💰금은보화","🛡️황금갑옷","👑황제칭호","🐎천리마","🌾만석창고","🚩황룡기","🗺️낙양성","👗금비단","🏯낙양성채","⚙️병기창","🏛️황궁","⚔️천자보검","🧭군략지도","⏳황제시계","🔮신비부적","🏇전투마","🧠핵심참모","📦잡동사니"] },
  { id:"ys", name:"원소", hanja:"袁紹", title:"사세삼공", emoji:"😤", color:"#8060cc",
    intro:"나 원소를 모르느냐! 사세삼공(四世三公)이시다!", taunt:"고작 이 한자에서 막히다니! 실력이 그 정도냐?", wrong:"하하! 역시 범인은 범인이야!",
    surrender:"잠깐... 이건 협상의... 알겠소, 섬기겠소이다!",
    items:["💰막대한재산","🛡️칠보갑옷","👑공칭호","🐎우량군마","🌾풍부군량","🚩청룡기","🗺️기주성","👗명주비단","🏯기주성채","⚙️공성병기","🏛️원씨저택","⚔️사세가검","🧭전략도면","⏳청동시계","🔮점술부적","🏇경주마","🧠모사군","📦희귀물건"] },
  { id:"lb", name:"여포", hanja:"呂布", title:"천하제일", emoji:"⚡", color:"#cc8800",
    intro:"나 여포다! 방천화극을 받아라!", taunt:"야 이 바보야! 한자도 못 읽어?", wrong:"캬캬! 실력이 없구만!",
    surrender:"...믿을 수가 없어. 한자가 이렇게 무서운 무기일 줄이야... 항복한다.",
    items:["💰황금갑옷대금","🛡️방천화극방패","👑천하제일칭호","🐎적토마!","🌾전투식량","🚩여포기","🗺️병주땅","👗맹수가죽","🏯하비성","⚙️방천화극","🏛️호화별장","⚔️방천화극","🧭전술비서","⏳황금시계","🔮장성부적","🏇천하명마","🧠진궁참모","📦전리품"] },
  { id:"cc", name:"조조", hanja:"曹操", title:"난세의 간웅", emoji:"🦊", color:"#206040",
    intro:"나는 조조다. 유재시거(唯才是擧)! 한자로 겨뤄보자.", taunt:"흠, 틀렸군. 역시 배움이 부족한 자로구나.", wrong:"분발하게. 내 인재 기준에 못 미치는구나.",
    surrender:"대단하다... 인정한다. 너의 학식 앞에 무릎을 꿇겠다.",
    items:["💰위나라국고","🛡️철갑주","👑위왕칭호","🐎절영마","🌾둔전군량","🚩위깃발","🗺️허도","👗승상의복","🏯허도성","⚙️연노","🏛️동작대","⚔️의천검","🧭작전계획","⏳해시계","🔮오행부적","🏇천하준마","🧠곽가·순욱","📦각종희귀품"] },
  { id:"smy", name:"사마의", hanja:"司馬懿", title:"인내의 여우", emoji:"🦉", color:"#404060",
    intro:"사마의다. 제갈량도 못 이긴 나를 이길 수 있을까?", taunt:"하, 오답이군. 나는 수십 년을 기다렸다. 넌 10초도 못 버텼군.", wrong:"역시 급하면 안 된다. 더 생각하게.",
    surrender:"...참으로 대단한 학식이다. 내가 졌다. 섬기겠다.",
    items:["💰진나라자산","🛡️사마갑주","👑태부칭호","🐎기산준마","🌾위나라군량","🚩사마기","🗺️낙양지도","👗명재상의복","🏯오장원","⚙️연환계병기","🏛️사마저택","⚔️비장검","🧭기산전술도","⏳인내시계","🔮천수부적","🏇능하마","🧠두예·종회","📦천하보물"] },
  { id:"sh", name:"손호", hanja:"孫皓", title:"오나라 마지막 황제", emoji:"😭", color:"#205080",
    intro:"나는 오나라의 황제다! 감히 도전하는 것이냐!", taunt:"틀렸다! 오나라가 이긴다!", wrong:"흥! 그 정도로는 날 이길 수 없다!",
    surrender:"알겠다... 관을 싣고 항복하겠다. 삼국시대가 끝났구나...",
    items:["💰강동재산전부","🛡️오나라갑옷","👑오황제칭호","🐎강동준마","🌾강남군량","🚩오나라깃발","🗺️건업지도","👗황제용포","🏯건업성","⚙️오나라수군","🏛️오황궁","⚔️오보검","🧭수로전술도","⏳강동시계","🔮오나라부적","🏇오마","🧠마지막참모","📦삼국유산"] },
];

// 아군 장수 5인 (상담 + 전투)
const GENERALS = [
  { id:"jl", name:"제갈량", hanja:"諸葛亮", emoji:"🦅", color:"#4a90d9",
    intro:"주군, 한자 전투로 적을 제압하겠나이다!",
    correct:"훌륭하십니다! 역시 주군이십니다! 臥薪嘗膽의 정신으로!",
    wrong:"주군... 솔직히 좀 창피하지 않으십니까? 다시 하시옵소서.",
    advisorStyle:"제갈량: 차분하고 지혜롭게, 삼국지 故事成語와 전략 인용. 이후 맥락에 맞는 한자 1글자 제시." },
  { id:"jb", name:"장비", hanja:"張飛", emoji:"🐯", color:"#cc4040",
    intro:"야! 나 張飛다! 덤벼라 이 놈들아!",
    correct:"그렇지! 바로 이거다! 이따위 놈들은 이렇게 이겨버려!",
    wrong:"이 멍청한 놈아! 戰도 모르냐! 다시 해봐!",
    advisorStyle:"장비: 거칠고 직설적이지만 의리 있게. 약한 욕설·구어체 허용. 용기 관련 한자 제시." },
  { id:"gu", name:"관우", hanja:"關羽", emoji:"🌙", color:"#9b2020",
    intro:"관우(關羽)다. 의(義)로써 싸우자.",
    correct:"훌륭하다! 그것이 바로 충의(忠義)의 힘이다!",
    wrong:"으음... 의(義)를 앞세웠지만 학식이 부족하군.",
    advisorStyle:"관우: 충의롭고 의연하게. 의리와 충성 강조. 의리 관련 한자 제시." },
  { id:"yb", name:"유비", hanja:"劉備", emoji:"🦁", color:"#b5341a",
    intro:"유비(劉備)다. 함께 천하를 위해 싸우자!",
    correct:"아, 훌륭해! 역시 내 편이 되어줄 인재로군!",
    wrong:"음... 어렵지? 괜찮아. 실패해도 일어나면 된다.",
    advisorStyle:"유비: 따뜻하고 인자하게. 인덕(仁德) 강조. 인의 관련 한자 제시." },
  { id:"ma", name:"마초", hanja:"馬超", emoji:"🐎", color:"#7a2080",
    intro:"마초(馬超)다! 서량 철기로 쓸어버린다!",
    correct:"좋아! 역시 실력이 있어! 서량 철기처럼 돌진해!",
    wrong:"흠... 아직 멀었군. 나 같은 맹장은 이런 실수 안 해.",
    advisorStyle:"마초: 호방하고 거침없이. 담력과 용맹 강조. 전투 관련 한자 제시." },
];

// 계급
const RANKS = [
  { min:0,  max:9,   rank:"병졸(兵卒)",        emoji:"🪖", color:"#808080" },
  { min:10, max:29,  rank:"부장(部將)",        emoji:"⚔️", color:"#a09060" },
  { min:30, max:59,  rank:"장수(將帥)",        emoji:"🛡️", color:"#b0a040" },
  { min:60, max:99,  rank:"대장(大將)",        emoji:"🌟", color:"#c8a030" },
  { min:100,max:149, rank:"장군(將軍)",        emoji:"👑", color:"#d8b040" },
  { min:150,max:199, rank:"도독(都督)",        emoji:"🦅", color:"#e0c860" },
  { min:200,max:9999,rank:"천하제일(天下第一)",emoji:"🐉", color:"#f0d060" },
];

function getRank(n){ return RANKS.find(r=>n>=r.min&&n<=r.max)||RANKS[0]; }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

// ══════════════════════════════════════════════════════════
// Claude API
// ══════════════════════════════════════════════════════════
function getKey(){ return localStorage.getItem('hanja-claude-key')||''; }
function setKey(k){ localStorage.setItem('hanja-claude-key',k); }

async function callClaude(messages, system, key){
  const k = key || getKey();
  if(!k) throw new Error('키없음');
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":k,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:400,system,messages}),
  });
  if(!r.ok) throw new Error(`${r.status}`);
  const d = await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}

async function genProblem(catId, difficulty, key){
  const cat = CATS[catId];
  const diff = difficulty<30?"초급(쉬운 기초 한자)":difficulty<60?"중급":"고급(어렵고 획 많은 한자)";
  const sys = `삼국지 한자 게임 문제 출제자. ${cat.name}(${cat.kor}) ${diff} 문제를 JSON으로 출제.
{"hanja":"한자1글자","reading":"음독","meaning":"뜻(5자이내)","context":"삼국지 예시(20자이내)","wrong1":"틀린뜻1","wrong2":"틀린뜻2","wrong3":"틀린뜻3"}
오답은 헷갈리도록. 순수 JSON만 응답.`;
  try{
    const raw = await callClaude([{role:"user",content:`${cat.name} ${diff} 문제 출제`}],sys,key);
    const j = JSON.parse(raw.replace(/```json\n?|\n?```/g,'').trim());
    return { hanja:j.hanja, reading:j.reading, meaning:j.meaning, context:j.context,
      options:shuffle([j.meaning,j.wrong1,j.wrong2,j.wrong3]), correct:j.meaning, catId, fromAI:true };
  }catch{ return genStatic(catId); }
}

function genStatic(catId){
  const cat = CATS[catId];
  const all = CATS.flatMap(c=>c.hanja);
  const correct = cat.hanja[Math.floor(Math.random()*cat.hanja.length)];
  const wrongs = shuffle(all.filter(h=>h.m!==correct.m)).slice(0,3);
  return { hanja:correct.h, reading:correct.r, meaning:correct.m,
    context:`${correct.h}(${correct.r}) — ${cat.kor}`, options:shuffle([correct.m,...wrongs.map(w=>w.m)]),
    correct:correct.m, catId, fromAI:false };
}

async function genAdvisorReply(msg, general, key){
  const sys = `당신은 삼국지 ${general.name}(${general.hanja})다. ${general.advisorStyle}
플레이어 고민에 삼국지 지혜로 답변. 반드시 순수 JSON:
{"advice":"200자이내조언(삼국지고사포함)","hanja":"한자1글자","reading":"음독","meaning":"뜻","category":0~17}
B급유머·구어체 가능. 삼국지 실제 에피소드 인용 필수.`;
  try{
    const raw = await callClaude([{role:"user",content:msg}],sys,key);
    return JSON.parse(raw.replace(/```json\n?|\n?```/g,'').trim());
  }catch{
    return { advice:`${general.name}이 고민을 듣고 있다... (Claude API 키가 필요합니다)`, hanja:"忍", reading:"인", meaning:"참을 인", category:16 };
  }
}

// ══════════════════════════════════════════════════════════
// 메인 컴포넌트
// ══════════════════════════════════════════════════════════
export default function HanjaBattle({ onBack }){
  const G={ bg:"radial-gradient(ellipse at 15% 10%, #120804 0%, #080604 50%, #060810 100%)", panel:"rgba(8,5,2,0.92)", border:"rgba(139,100,30,0.35)", gold:"#c8a030", goldL:"#f0d060", text:"#e0d0b0", dim:"rgba(220,200,150,0.5)", red:"#e05040", green:"#7ab040", blue:"#4a90d9" };
  const box=(ex={})=>({background:G.panel,border:`1px solid ${G.border}`,borderRadius:8,padding:"16px",marginBottom:12,backdropFilter:"blur(14px)",...ex});
  const btn=(bg=G.gold,fg="#0a0704")=>({background:bg,border:"none",borderRadius:6,padding:"12px 20px",color:fg,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.04em",transition:"all 0.15s"});

  // 게임 상태
  const [screen, setScreen]         = useState('setup');   // setup|general|battle|advisor|victory
  const [general, setGeneral]       = useState(null);
  const [enemyIdx, setEnemyIdx]     = useState(0);
  const [stripped, setStripped]     = useState(Array(18).fill(false));
  const [catStats, setCatStats]     = useState(Array(18).fill(0));
  const [servants, setServants]     = useState([]);
  const [correctN, setCorrectN]     = useState(0);
  const [wrongN, setWrongN]         = useState(0);

  // 전투 하위 상태
  const [bPhase, setBPhase]         = useState('action'); // action|loading|question|result|surrender
  const [action, setAction]         = useState(null);
  const [problem, setProblem]       = useState(null);
  const [answer, setAnswer]         = useState(null);
  const [isRight, setIsRight]       = useState(null);
  const [narration, setNarration]   = useState('');
  const [lastItem, setLastItem]     = useState('');

  // 타이머
  const [timer, setTimer]           = useState(10);
  const [timerOn, setTimerOn]       = useState(false);
  const timerRef                    = useRef(null);

  // 애니메이션 플래그
  const [anim, setAnim]             = useState({ atk:false, hit:false, ok:false, ko:false, fly:false, kneel:false, rankUp:false, entrance:false });

  // 참모 상담
  const [msgs, setMsgs]             = useState([]);
  const [chatInput, setChatInput]   = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [advisor, setAdvisor]       = useState(null);
  const chatRef                     = useRef(null);

  // API 키
  const [apiKey, setApiKey]         = useState(getKey);
  const [keyInput, setKeyInput]     = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // 랭크업 팝업
  const [rankPopup, setRankPopup]   = useState(null);

  const enemy = ENEMIES[enemyIdx];
  const strippedN = stripped.filter(Boolean).length;
  const rank = getRank(correctN);

  // ── 타이머
  useEffect(()=>{
    if(timerOn && timer>0){ timerRef.current=setTimeout(()=>setTimer(t=>t-1),1000); }
    else if(timerOn && timer===0){ onTimeout(); }
    return ()=>clearTimeout(timerRef.current);
  },[timer,timerOn]);

  function startTimer(){ setTimer(10); setTimerOn(true); }
  function stopTimer(){ setTimerOn(false); clearTimeout(timerRef.current); }

  // ── 참모 스크롤
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs]);

  // ── 액션 선택 → 한자 출제
  async function onAction(act){
    setAction(act);
    setBPhase('loading');
    doAnim('atk',600);
    const cats = ACTION_CATS[act];
    const avail = cats.filter(c=>!stripped[c]);
    const pool  = avail.length>0?avail:cats;
    const catId = pool[Math.floor(Math.random()*pool.length)];
    const diff  = Math.min(90, correctN*4);
    const p = apiKey ? await genProblem(catId,diff,apiKey) : genStatic(catId);
    setProblem(p); setAnswer(null); setIsRight(null);
    setBPhase('question'); startTimer();
  }

  // ── 정답 선택
  function onAnswer(opt){
    if(answer!==null || !timerOn) return;
    stopTimer();
    setAnswer(opt);
    const ok = opt===problem.correct;
    setIsRight(ok);
    if(ok) handleCorrect(); else handleWrong();
    setBPhase('result');
  }

  // ── 타임아웃
  function onTimeout(){
    stopTimer();
    if(!problem) return;
    doAnim('ko',1000);
    setIsRight(false); setAnswer(null);
    setWrongN(n=>n+1);
    const newStats=[...catStats]; newStats[problem.catId]=Math.max(0,newStats[problem.catId]-3); setCatStats(newStats);
    setNarration(`⏰ 시간 초과! ${enemy.name}: "${enemy.taunt}"`);
    setBPhase('result');
  }

  // ── 정답 처리
  function handleCorrect(){
    const bonus = timer;
    doAnim('ok',1500); doAnim('hit',800);
    const ns=[...catStats]; ns[problem.catId]=Math.min(100,ns[problem.catId]+10+bonus); setCatStats(ns);
    const prev=getRank(correctN);
    const newN=correctN+1; setCorrectN(newN);
    const next=getRank(newN);
    if(prev.rank!==next.rank){ setRankPopup(next); setTimeout(()=>setRankPopup(null),3000); doAnim('rankUp',3000); }

    if(!stripped[problem.catId]){
      const ns2=[...stripped]; ns2[problem.catId]=true; setStripped(ns2);
      const item=enemy.items[problem.catId]; setLastItem(item);
      doAnim('fly',1000);
      setNarration(`✅ 정답! "${item}" 탈취! +${10+bonus} 능력치`);
      if(ns2.every(Boolean)){ setTimeout(()=>surrender(),1500); return; }
    } else {
      setNarration(`✅ 정답! +${10+bonus} 능력치`);
    }
  }

  // ── 오답 처리
  function handleWrong(){
    doAnim('ko',1000);
    setWrongN(n=>n+1);
    const ns=[...catStats]; if(problem?.catId!==undefined){ ns[problem.catId]=Math.max(0,ns[problem.catId]-5); setCatStats(ns); }
    setNarration(`❌ 오답! ${enemy.name}: "${enemy.wrong}"`);
  }

  // ── 항복
  function surrender(){
    doAnim('kneel',2500);
    setBPhase('surrender');
    setTimeout(()=>{
      setServants(s=>[...s,{...enemy}]);
      const next=enemyIdx+1;
      if(next>=ENEMIES.length){ setScreen('victory'); return; }
      setEnemyIdx(next); setStripped(Array(18).fill(false));
      setBPhase('action'); setNarration('');
      doAnim('entrance',800);
    },2600);
  }

  // ── 다음으로
  function onContinue(){
    setBPhase('action'); setProblem(null); setAnswer(null); setIsRight(null); setNarration(''); setAction(null); setLastItem('');
  }

  // ── 참모 상담
  async function onSend(){
    if(!chatInput.trim()) return;
    const adv=advisor||GENERALS[Math.floor(Math.random()*GENERALS.length)];
    setAdvisor(adv);
    const userMsg=chatInput.trim(); setChatInput('');
    setMsgs(m=>[...m,{role:'user',text:userMsg}]);
    setChatLoading(true);
    const res = await genAdvisorReply(userMsg,adv,apiKey);
    setMsgs(m=>[...m,{role:'adv',adv:adv.name,emoji:adv.emoji,color:adv.color,advice:res.advice,hanja:res.hanja,reading:res.reading,meaning:res.meaning,cat:res.category}]);
    setChatLoading(false);
    // 상담 후 해당 한자 자동 출제
    if(res.hanja && res.category!==undefined){
      setTimeout(()=>{
        setScreen('battle');
        const p={hanja:res.hanja,reading:res.reading,meaning:res.meaning,context:`${adv.name}의 상담에서 출제`,options:shuffle([res.meaning,'어렵다','강하다','기쁘다']),correct:res.meaning,catId:res.category,fromAI:true};
        setProblem(p); setAnswer(null); setIsRight(null);
        setBPhase('question'); startTimer();
      },1500);
    }
  }

  function doAnim(key,ms){ setAnim(a=>({...a,[key]:true})); setTimeout(()=>setAnim(a=>({...a,[key]:false})),ms); }

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════

  const CSS=`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes hAtk{0%{transform:translateX(0)}40%{transform:translateX(30px)}100%{transform:translateX(0)}}
    @keyframes hHit{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
    @keyframes hOk{0%{box-shadow:none}50%{box-shadow:0 0 40px 10px rgba(240,210,60,0.8)}100%{box-shadow:none}}
    @keyframes hKo{0%{transform:rotate(0deg)}30%{transform:rotate(-20deg)}60%{transform:rotate(15deg)}100%{transform:rotate(0deg)}}
    @keyframes hFly{0%{opacity:0;transform:translateX(0) scale(0.5)}50%{opacity:1;transform:translateX(-50px) scale(1.2)}100%{opacity:0;transform:translateX(-100px) scale(0.8)}}
    @keyframes hKneel{0%,100%{transform:translateY(0)}50%{transform:translateY(20px) scale(0.8)}}
    @keyframes hRankUp{0%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
    @keyframes hEntrance{0%{opacity:0;transform:translateX(50px)}100%{opacity:1;transform:translateX(0)}}
    @keyframes hPulse{0%,100%{opacity:0.7}50%{opacity:1}}
    @keyframes hTimer{0%{color:#e0d0b0}60%{color:#e0d0b0}80%{color:#f0a040}100%{color:#e05040}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .hFade{animation:fadeUp 0.35s ease both}
    .hOpt:hover{background:rgba(200,160,40,0.15)!important;border-color:rgba(200,160,40,0.7)!important;transform:translateY(-2px)}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(139,100,30,0.4);border-radius:2px}
  `;

  // ── 승리 화면
  if(screen==='victory') return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{CSS}</style>
      <div className="hFade" style={{maxWidth:500,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:60,marginBottom:16}}>🏆</div>
        <div style={{fontSize:26,fontWeight:700,color:G.goldL,marginBottom:8,letterSpacing:"0.1em"}}>천하통일!</div>
        <div style={{fontSize:15,color:G.dim,marginBottom:24}}>6명의 적장을 모두 털었습니다!</div>
        <div style={{...box({padding:20,marginBottom:20})}}>
          <div style={{fontSize:14,color:G.dim,marginBottom:12}}>👥 하인 목록</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {servants.map(s=>(
              <div key={s.id} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${s.color}44`,borderRadius:6,padding:"8px 12px",fontSize:14,color:G.text}}>
                {s.emoji} {s.name}({s.hanja})<div style={{fontSize:12,color:G.dim,marginTop:2}}>하인으로 복종</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[["정답",correctN+"회","#7ab040"],["오답",wrongN+"회","#e05040"],["계급",rank.emoji+" "+rank.rank,rank.color]].map(([l,v,c])=>(
            <div key={l} style={{...box({padding:12,marginBottom:0,textAlign:"center"})}}>
              <div style={{fontSize:12,color:G.dim,marginBottom:4}}>{l}</div>
              <div style={{fontSize:16,fontWeight:700,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <button style={{...btn(),width:"100%",marginBottom:8,fontSize:17,padding:14}} onClick={()=>{ setScreen('setup'); setEnemyIdx(0); setStripped(Array(18).fill(false)); setCatStats(Array(18).fill(0)); setServants([]); setCorrectN(0); setWrongN(0); setBPhase('action'); }}>다시 도전</button>
        <button style={{...btn("rgba(30,20,10,0.8)",G.dim),width:"100%",fontSize:15,border:`1px solid ${G.border}`}} onClick={onBack}>← 전략 시뮬레이션으로</button>
      </div>
    </div>
  );

  // ── 참모 상담 화면
  if(screen==='advisor') return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:600,margin:"0 auto",width:"100%",padding:"0 0 20px",display:"flex",flexDirection:"column",height:"100vh"}}>
        {/* 헤더 */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:`1px solid ${G.border}`}}>
          <button onClick={()=>setScreen('battle')} style={{background:"transparent",border:"none",color:G.gold,fontSize:22,cursor:"pointer",padding:0}}>←</button>
          <div style={{flex:1,fontSize:17,fontWeight:700,color:G.goldL}}>삼국지 AI 참모 상담</div>
          <div style={{fontSize:13,color:G.dim}}>고민을 말하면 장수가 답변 + 한자 출제</div>
        </div>
        {/* 채팅 */}
        <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.length===0&&(
            <div style={{textAlign:"center",padding:"40px 20px",color:G.dim}}>
              <div style={{fontSize:40,marginBottom:12}}>🎴</div>
              <div style={{fontSize:15,marginBottom:8}}>현실 고민을 입력하면</div>
              <div style={{fontSize:14}}>삼국지 장수가 지혜로 답변하고</div>
              <div style={{fontSize:14,color:G.gold,marginTop:4}}>관련 한자 문제를 출제합니다</div>
              <div style={{fontSize:13,color:"rgba(200,150,50,0.5)",marginTop:12}}>예) "요즘 사업이 너무 힘들어..."</div>
              <div style={{fontSize:13,color:"rgba(200,150,50,0.5)"}}>예) "직원이 말을 안 들어요"</div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} className="hFade">
              {m.role==='user'?(
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <div style={{maxWidth:"80%",background:"rgba(74,144,217,0.15)",border:"1px solid rgba(74,144,217,0.3)",borderRadius:12,borderTopRightRadius:2,padding:"10px 14px",fontSize:15,color:G.text}}>{m.text}</div>
                </div>
              ):(
                <div style={{display:"flex",gap:10}}>
                  <div style={{fontSize:28,flexShrink:0,width:36,textAlign:"center"}}>{m.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:m.color,marginBottom:4}}>{m.adv}({GENERALS.find(g=>g.name===m.adv)?.hanja})</div>
                    <div style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${G.border}`,borderRadius:12,borderTopLeftRadius:2,padding:"12px 14px",fontSize:15,color:G.text,lineHeight:1.8,marginBottom:8}}>{m.advice}</div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(200,160,40,0.12)",border:"1px solid rgba(200,160,40,0.35)",borderRadius:8,padding:"8px 14px"}}>
                      <span style={{fontSize:28,fontWeight:700,color:G.goldL,fontFamily:"serif"}}>{m.hanja}</span>
                      <div><div style={{fontSize:13,color:G.gold}}>{m.reading}({m.meaning})</div><div style={{fontSize:11,color:G.dim}}>{CATS[m.cat]?.kor} 카테고리 문제 예정</div></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {chatLoading&&(
            <div style={{display:"flex",alignItems:"center",gap:8,color:G.dim,fontSize:14,padding:"0 4px"}}>
              <div style={{width:16,height:16,border:`2px solid ${G.border}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>장수가 답변 중...
            </div>
          )}
        </div>
        {/* 입력창 */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${G.border}`,display:"flex",gap:8}}>
          <input
            value={chatInput} onChange={e=>setChatInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&onSend()}
            placeholder="고민을 입력하세요... (예: 요즘 사업이 힘들어요)"
            style={{flex:1,background:"rgba(255,255,255,0.06)",border:`1px solid ${G.border}`,borderRadius:8,padding:"10px 14px",color:G.text,fontSize:15,fontFamily:"inherit",outline:"none"}}
          />
          <button onClick={onSend} disabled={chatLoading||!chatInput.trim()} style={{...btn(),padding:"10px 18px",opacity:chatLoading||!chatInput.trim()?0.5:1}}>전송</button>
        </div>
      </div>
    </div>
  );

  // ── 장수 선택
  if(screen==='general') return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",padding:"20px 16px"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <button onClick={()=>setScreen('setup')} style={{...btn("transparent",G.dim),border:`1px solid ${G.border}`,fontSize:14,padding:"8px 14px",marginBottom:16}}>← 뒤로</button>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:700,color:G.goldL,marginBottom:6}}>⚔️ 내 장수를 선택하라</div>
          <div style={{fontSize:14,color:G.dim}}>선택한 장수가 전투를 이끕니다</div>
        </div>
        <div style={{display:"grid",gap:10}}>
          {GENERALS.map(g=>(
            <button key={g.id} className="hFade" onClick={()=>{ setGeneral(g); setScreen('battle'); setBPhase('action'); }}
              style={{...box({padding:16,marginBottom:0,textAlign:"left",cursor:"pointer",border:`1px solid ${general?.id===g.id?g.color:G.border}`}),display:"flex",gap:14,alignItems:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:40,flexShrink:0}}>{g.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:700,color:g.color,marginBottom:2}}>{g.name}({g.hanja})</div>
                <div style={{fontSize:13,color:G.dim,fontStyle:"italic",marginBottom:6}}>"{g.intro}"</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── 세팅 화면
  if(screen==='setup') return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{CSS}</style>
      <div style={{maxWidth:520,width:"100%"}} className="hFade">
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:50,marginBottom:12}}>⚔️</div>
          <div style={{fontSize:26,fontWeight:700,color:G.goldL,letterSpacing:"0.1em",marginBottom:6}}>한자 전투 시스템</div>
          <div style={{fontSize:15,color:G.dim,lineHeight:1.8}}>
            한자를 맞혀 적장을 털어라!<br/>
            18개 카테고리 한자 완전 정복 후 적장이 항복!
          </div>
        </div>
        {/* API 키 설정 */}
        <div style={{...box({marginBottom:16})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:14,color:G.dim}}>🔑 Claude API 키 (선택)</div>
            <button onClick={()=>setShowKeyInput(v=>!v)} style={{...btn("rgba(74,144,217,0.15)","#4a90d9"),padding:"4px 10px",fontSize:12,border:"1px solid rgba(74,144,217,0.3)"}}>
              {apiKey?'변경':'설정'}
            </button>
          </div>
          {apiKey&&<div style={{fontSize:13,color:"#7ab040"}}>✅ API 키 설정됨 — AI 문제 생성 활성화</div>}
          {!apiKey&&<div style={{fontSize:13,color:G.dim}}>미설정 시 기본 한자 데이터로 진행</div>}
          {showKeyInput&&(
            <div style={{marginTop:10,display:"flex",gap:6}}>
              <input value={keyInput} onChange={e=>setKeyInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&keyInput.startsWith('sk-ant-')){setApiKey(keyInput);setKey(keyInput);setShowKeyInput(false);setKeyInput('');}}}
                placeholder="sk-ant-..." type="password"
                style={{flex:1,background:"rgba(255,255,255,0.08)",border:`1px solid ${G.border}`,borderRadius:6,padding:"8px 12px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none"}}/>
              <button onClick={()=>{if(keyInput.startsWith('sk-ant-')){setApiKey(keyInput);setKey(keyInput);setShowKeyInput(false);setKeyInput('');}}}
                style={{...btn(),padding:"8px 14px",fontSize:13}}>저장</button>
            </div>
          )}
        </div>
        {/* 적장 목록 */}
        <div style={{...box({marginBottom:16})}}>
          <div style={{fontSize:14,color:G.dim,marginBottom:10}}>🏴‍☠️ 정복 대상 적장 (6인)</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {ENEMIES.map((e,i)=>(
              <div key={e.id} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${e.color}44`,borderRadius:6,padding:"6px 10px",fontSize:13,color:G.text,flex:"1 1 120px",textAlign:"center"}}>
                <span style={{fontSize:20}}>{e.emoji}</span>
                <div style={{color:e.color,fontWeight:700}}>{e.name}</div>
                <div style={{fontSize:11,color:G.dim}}>{e.title}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 시스템 설명 */}
        <div style={{...box({marginBottom:20})}}>
          <div style={{fontSize:14,color:G.dim,marginBottom:8}}>📖 전투 방식</div>
          {[["⚔️ 공격","兵器·方位·動態 카테고리 한자 출제"],["🛡️ 방어","人體·住居·宮室 카테고리 한자 출제"],["🔮 계책","天體·干支·狀況 카테고리 한자 출제"],["✅ 정답","해당 카테고리 능력치 상승 + 아이템 탈취"],["⏰ 10초","빨리 맞힐수록 보너스 능력치"]].map(([t,d])=>(
            <div key={t} style={{display:"flex",gap:10,marginBottom:6,fontSize:14}}>
              <span style={{color:G.gold,minWidth:60}}>{t}</span>
              <span style={{color:G.dim}}>{d}</span>
            </div>
          ))}
        </div>
        <button style={{...btn(),width:"100%",fontSize:18,padding:16,marginBottom:8,letterSpacing:"0.1em"}} onClick={()=>setScreen('general')}>⚔️ 장수 선택 후 출전!</button>
        <button style={{...btn("rgba(30,20,10,0.8)",G.dim),width:"100%",fontSize:15,border:`1px solid ${G.border}`,padding:12}} onClick={onBack}>← 전략 시뮬레이션으로</button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // 전투 화면
  // ══════════════════════════════════════════════════════════
  const strippedPct = (strippedN/18)*100;
  const timerColor = timer>6?"#e0d0b0":timer>3?"#f0a040":"#e05040";

  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* 계급 승급 팝업 */}
      {rankPopup&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.7)",animation:"hRankUp 0.5s ease both",pointerEvents:"none"}}>
          <div style={{textAlign:"center",padding:40,background:"rgba(8,5,2,0.98)",border:`2px solid ${rankPopup.color}`,borderRadius:16,boxShadow:`0 0 40px ${rankPopup.color}66`}}>
            <div style={{fontSize:60,marginBottom:12}}>👑</div>
            <div style={{fontSize:14,color:G.dim,marginBottom:6,letterSpacing:"0.2em"}}>계급 승급!</div>
            <div style={{fontSize:30,fontWeight:700,color:rankPopup.color,letterSpacing:"0.08em"}}>{rankPopup.emoji} {rankPopup.rank}</div>
          </div>
        </div>
      )}

      <div style={{maxWidth:620,margin:"0 auto",padding:"14px 14px 80px"}}>

        {/* ── 헤더 */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <button onClick={()=>setScreen('setup')} style={{background:"transparent",border:"none",color:G.dim,fontSize:20,cursor:"pointer",padding:"0 4px"}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:G.dim}}>아군 장수 · 계급</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:18}}>{general?.emoji}</span>
              <span style={{fontSize:15,fontWeight:700,color:rank.color}}>{rank.emoji} {rank.rank}</span>
              <span style={{fontSize:13,color:G.dim}}>정답 {correctN}회</span>
            </div>
          </div>
          <button onClick={()=>setScreen('advisor')} style={{...btn("rgba(74,144,217,0.15)","#4a90d9"),padding:"8px 14px",fontSize:13,border:"1px solid rgba(74,144,217,0.3)"}}>
            💬 참모 상담
          </button>
        </div>

        {/* ── 전투 아레나 */}
        <div style={{...box({padding:16,marginBottom:10,overflow:"hidden"})}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            {/* 아군 */}
            <div style={{flex:1,textAlign:"center",animation:anim.atk?"hAtk 0.6s ease":anim.ko?"hKo 0.8s ease":"none"}}>
              <div style={{fontSize:44}}>{general?.emoji||"🦅"}</div>
              <div style={{fontSize:13,fontWeight:700,color:general?.color||G.gold,marginTop:4}}>{general?.name||"장수"}</div>
              <div style={{fontSize:11,color:rank.color}}>{rank.emoji} {rank.rank}</div>
            </div>
            {/* VS */}
            <div style={{textAlign:"center",padding:"0 8px"}}>
              <div style={{fontSize:20,fontWeight:700,color:G.gold}}>VS</div>
              <div style={{fontSize:11,color:G.dim,marginTop:4}}>한자 전투</div>
            </div>
            {/* 적장 */}
            <div style={{flex:1,textAlign:"center",animation:anim.hit?"hHit 0.5s ease":anim.kneel?"hKneel 0.8s ease":anim.entrance?"hEntrance 0.6s ease":"none"}}>
              <div style={{fontSize:44,filter:anim.ok?"drop-shadow(0 0 12px rgba(255,200,50,0.9))":"none"}}>{enemy.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,color:enemy.color,marginTop:4}}>{enemy.name}({enemy.hanja})</div>
              <div style={{fontSize:11,color:G.dim}}>{enemy.title}</div>
            </div>
          </div>

          {/* 적장 아이템 탈취 현황 */}
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.dim,marginBottom:4}}>
              <span>아이템 탈취 현황</span>
              <span style={{color:strippedN>=18?G.goldL:G.gold}}>{strippedN}/18</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${strippedPct}%`,background:`linear-gradient(90deg,${enemy.color},#f0d060)`,borderRadius:4,transition:"width 0.5s ease"}}/>
            </div>
          </div>

          {/* 아이템 그리드 */}
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {enemy.items.map((item,i)=>(
              <div key={i} style={{fontSize:11,padding:"3px 6px",borderRadius:4,
                background:stripped[i]?"rgba(122,176,64,0.12)":"rgba(255,255,255,0.04)",
                border:`1px solid ${stripped[i]?"rgba(122,176,64,0.4)":"rgba(255,255,255,0.08)"}`,
                color:stripped[i]?"#7ab040":G.dim,textDecoration:stripped[i]?"line-through":"none",
                animation:anim.fly&&lastItem===item?"hFly 1s ease":"none",
                transition:"all 0.3s"}}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── 배틀 컨텐츠 */}

        {/* 항복 */}
        {bPhase==='surrender'&&(
          <div className="hFade" style={{...box({textAlign:"center",padding:24,borderColor:`${enemy.color}66`})}}>
            <div style={{fontSize:50,marginBottom:12}}>{enemy.emoji}</div>
            <div style={{fontSize:18,color:G.dim,marginBottom:8,letterSpacing:"0.1em"}}>{enemy.name}의 항복</div>
            <div style={{fontSize:17,color:G.goldL,lineHeight:1.9,marginBottom:12}}>"{enemy.surrender}"</div>
            <div style={{fontSize:15,color:"#7ab040"}}>✅ {enemy.name}이(가) 하인으로 복종합니다!</div>
          </div>
        )}

        {/* 액션 선택 */}
        {bPhase==='action'&&(
          <div className="hFade">
            {narration&&(
              <div style={{...box({padding:12,marginBottom:10,borderColor:"rgba(200,160,40,0.3)"}),fontSize:14,color:G.dim,textAlign:"center"}}>
                {narration}
              </div>
            )}
            <div style={{fontSize:14,color:G.dim,textAlign:"center",marginBottom:10}}>{enemy.name}: "{enemy.intro}"</div>
            <div style={{fontSize:15,fontWeight:700,color:G.gold,textAlign:"center",marginBottom:12,letterSpacing:"0.08em"}}>— 공격 방식을 선택하라 —</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                { act:"attack",  emoji:"⚔️", label:"공격", sub:"兵器·方位·動態", color:"#e05040" },
                { act:"defense", emoji:"🛡️", label:"방어", sub:"人體·住居·宮室", color:"#4a90d9" },
                { act:"strategy",emoji:"🔮", label:"계책", sub:"天體·干支·狀況", color:"#9b59b6" },
              ].map(({act,emoji,label,sub,color})=>(
                <button key={act} className="hOpt" onClick={()=>onAction(act)}
                  style={{...box({padding:14,marginBottom:0,cursor:"pointer",textAlign:"center",transition:"all 0.15s",border:`1px solid ${color}44`})}}>
                  <div style={{fontSize:30,marginBottom:6}}>{emoji}</div>
                  <div style={{fontSize:15,fontWeight:700,color,marginBottom:4}}>{label}</div>
                  <div style={{fontSize:11,color:G.dim}}>{sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 로딩 */}
        {bPhase==='loading'&&(
          <div style={{...box({textAlign:"center",padding:40})}}>
            <div style={{width:32,height:32,border:`3px solid ${G.border}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
            <div style={{color:G.dim,fontSize:15}}>한자 문제 생성 중...</div>
          </div>
        )}

        {/* 한자 문제 */}
        {bPhase==='question'&&problem&&(
          <div className="hFade">
            {/* 타이머 */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{flex:1,height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(timer/10)*100}%`,background:timerColor,borderRadius:3,transition:"width 1s linear"}}/>
              </div>
              <div style={{fontSize:22,fontWeight:700,color:timerColor,minWidth:28,textAlign:"right",fontVariantNumeric:"tabular-nums",animation:timer<=3?"hPulse 0.5s ease infinite":"none"}}>{timer}</div>
            </div>

            {/* 한자 카드 */}
            <div style={{...box({textAlign:"center",padding:24,marginBottom:10,borderColor:"rgba(200,160,40,0.4)",animation:anim.ok?"hOk 1.5s ease":"none"})}}>
              <div style={{fontSize:11,color:G.dim,letterSpacing:"0.2em",marginBottom:8}}>
                {CATS[problem.catId]?.emoji} {CATS[problem.catId]?.name} ({CATS[problem.catId]?.kor})
                {problem.fromAI&&<span style={{marginLeft:8,color:"#4a90d9"}}>· AI 생성</span>}
              </div>
              <div style={{fontSize:80,fontWeight:700,color:G.goldL,fontFamily:"serif",letterSpacing:"0.05em",lineHeight:1.1,marginBottom:8,textShadow:`0 0 30px rgba(240,210,60,0.4)`}}>
                {problem.hanja}
              </div>
              <div style={{fontSize:15,color:G.dim,fontStyle:"italic"}}>{problem.context}</div>
            </div>

            {/* 보기 4개 */}
            <div style={{fontSize:14,color:G.dim,textAlign:"center",marginBottom:8}}>이 한자의 뜻은?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {problem.options.map((opt,i)=>(
                <button key={i} className="hOpt" onClick={()=>onAnswer(opt)}
                  style={{...box({padding:"14px 10px",marginBottom:0,cursor:"pointer",textAlign:"center",transition:"all 0.15s",
                    border:`1px solid ${answer===opt?(opt===problem.correct?"rgba(122,176,64,0.6)":"rgba(224,80,64,0.6)"):G.border}`,
                    background:answer===opt?(opt===problem.correct?"rgba(122,176,64,0.1)":"rgba(224,80,64,0.1)"):"rgba(8,5,2,0.7)"})}}>
                  <div style={{fontSize:11,color:G.dim,marginBottom:4}}>선택지 {i+1}</div>
                  <div style={{fontSize:18,fontWeight:700,color:G.text}}>{opt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 결과 */}
        {bPhase==='result'&&problem&&(
          <div className="hFade">
            {/* 정오 배너 */}
            <div style={{...box({padding:16,marginBottom:10,textAlign:"center",borderColor:isRight?"rgba(122,176,64,0.5)":"rgba(224,80,64,0.5)",background:isRight?"rgba(122,176,64,0.06)":"rgba(224,80,64,0.06)"})}}>
              <div style={{fontSize:32,marginBottom:6}}>{isRight?"✅":"❌"}</div>
              <div style={{fontSize:18,fontWeight:700,color:isRight?"#7ab040":"#e05040",marginBottom:8}}>
                {isRight?"정답입니다!":"틀렸습니다!"}
              </div>
              <div style={{fontSize:40,fontWeight:700,color:G.goldL,fontFamily:"serif",marginBottom:4}}>{problem.hanja}</div>
              <div style={{fontSize:16,color:G.gold}}>{problem.reading}({problem.meaning})</div>
              {isRight&&timer>0&&<div style={{fontSize:13,color:G.dim,marginTop:4}}>+{10+timer} 능력치 (빠른 답변 +{timer})</div>}
            </div>

            {/* 해설 */}
            <div style={{...box({padding:12,marginBottom:10})}}>
              <div style={{fontSize:13,color:G.dim,marginBottom:4}}>
                {CATS[problem.catId]?.emoji} {CATS[problem.catId]?.name} — {CATS[problem.catId]?.ability}
              </div>
              <div style={{fontSize:14,color:G.text}}>{problem.context}</div>
            </div>

            {/* 내레이션 */}
            {narration&&(
              <div style={{...box({padding:12,marginBottom:10,borderColor:"rgba(200,160,40,0.3)"}),fontSize:14,color:G.dim}}>
                {narration}
              </div>
            )}

            {/* 장수 대사 */}
            {general&&(
              <div style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                <div style={{fontSize:28,flexShrink:0}}>{general.emoji}</div>
                <div style={{...box({padding:12,marginBottom:0,flex:1,borderColor:`${general.color}44`}),fontSize:14,color:G.text,fontStyle:"italic"}}>
                  "{isRight?general.correct:general.wrong}"
                </div>
              </div>
            )}

            <button style={{...btn(),width:"100%",fontSize:16,padding:14}} onClick={onContinue}>
              계속 전투 ⚔️
            </button>
          </div>
        )}

        {/* ── 18류 능력치 */}
        <div style={{...box({marginTop:12,padding:14})}}>
          <div style={{fontSize:13,color:G.dim,marginBottom:10,letterSpacing:"0.1em"}}>📊 18류 능력치 현황</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 12px"}}>
            {CATS.map(cat=>(
              <div key={cat.id}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:G.dim,marginBottom:2}}>
                  <span>{cat.emoji} {cat.kor}</span>
                  <span style={{color:catStats[cat.id]>0?"#7ab040":G.dim}}>{catStats[cat.id]}</span>
                </div>
                <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${catStats[cat.id]}%`,background:catStats[cat.id]>=80?"#f0d060":catStats[cat.id]>=50?"#7ab040":"#4a90d9",borderRadius:2,transition:"width 0.5s ease"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 하인 목록 */}
        {servants.length>0&&(
          <div style={{...box({marginTop:12,padding:14})}}>
            <div style={{fontSize:13,color:G.dim,marginBottom:8}}>👥 하인 목록 ({servants.length}명)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {servants.map(s=>(
                <div key={s.id} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${s.color}44`,borderRadius:6,padding:"6px 10px",fontSize:13,color:G.text}}>
                  {s.emoji} {s.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
