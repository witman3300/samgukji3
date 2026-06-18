import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════
// ── 진선미 철학 v2 ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
const CHEONJIIN = [
  { key:"cheon", hanja:"진(眞)", name:"자강불식", emoji:"💎", color:"#4a90d9",
    desc:"초심을 잃지 않는 마음. 흔들리는 세상에서도 변치 않는 뜻.",
    wisdom:"하늘은 항상 그 자리에 있다. 흔들리는 것은 세상이지, 뜻이 아니다." },
  { key:"ji",    hanja:"선(善)", name:"계지자선",   emoji:"🌿", color:"#7ab040",
    desc:"아낌없이 주는 땅처럼. 베풀고 품어 세력의 뿌리를 삼아라.",
    wisdom:"땅은 씨앗을 가리지 않는다. 베풂이 쌓여 큰 세력이 된다." },
  { key:"in",    hanja:"미(美)", name:"교이만물", emoji:"🌸", color:"#c8a030",
    desc:"진정성 있고 능력 있는 사람을 모아라. 함께하는 노력이 난세를 가른다.",
    wisdom:"천하는 혼자 얻을 수 없다. 사람이 모여야 뜻이 이루어진다." },
];

// ══════════════════════════════════════════════════════════════════
// ── 군주 데이터 ─────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
const LORDS = [
  { id:"yubi",  name:"유비",  hanja:"유비(劉備)",   title:"인덕의 군주",  emoji:"🦁", color:"#b5341a",
    creed:"세상을 바로잡아 백성을 편안케 하리라", cji:"cheon",
    stat:{virtue:95,strategy:70,force:75},
    profile:"인의(仁義)의 군주. 삼고초려로 제갈량을 얻고 도원결의로 관우·장비와 의형제. 패하고 또 패해도 포기하지 않는 불굴의 의지. 백성을 위한 정치가 핵심.",
    allies:"관우, 장비, 제갈량, 조자룡", rivals:"조조, 손권" },
  { id:"jegal", name:"제갈량",hanja:"제갈량(諸葛亮)",title:"와룡의 군사",  emoji:"🦅", color:"#1e5fa8",
    creed:"하늘의 이치를 읽어 천하를 도모한다",  cji:"cheon",
    stat:{virtue:85,strategy:99,force:60},
    profile:"천하삼분지계 구상자. 적벽대전 연합 외교, 맹획 칠종칠금, 기산 북벌 6차. 읍참마속(泣斬馬謖)으로 군기 확립. 鞠躬盡瘁 死而後已.",
    allies:"유비, 강유, 마속", rivals:"사마의, 조진" },
  { id:"jocho", name:"조조",  hanja:"조조(曹操)",   title:"난세의 간웅",  emoji:"🦊", color:"#1f7a40",
    creed:"난세를 평정하여 새 질서를 세운다",    cji:"ji",
    stat:{virtue:65,strategy:95,force:90},
    profile:"유재시거(唯才是擧) — 출신 불문 인재 등용. 관도대전으로 원소 격파. 둔전제로 군량 자급. 의심 많아 화타·공융 처형. 寧教我負天下人.",
    allies:"순욱, 곽가, 허저, 장료", rivals:"유비, 원소, 손권" },
  { id:"sono",  name:"손권",  hanja:"손권(孫權)",   title:"강동의 호랑이",emoji:"🌊", color:"#167a6e",
    creed:"강동을 지켜 천하의 한 축이 되리라",   cji:"in",
    stat:{virtue:80,strategy:82,force:78},
    profile:"부형의 기업을 이어받아 강동 수성. 적벽대전에서 주유를 대도독으로 조조 격퇴. 여몽으로 형주 탈환. 육손의 이릉 화공으로 유비 격파.",
    allies:"주유, 노숙, 여몽, 육손", rivals:"조조, 유비" },
  { id:"gwanu", name:"관우",  hanja:"관우(關羽)",   title:"무신의 현신",  emoji:"⚔️", color:"#a06020",
    creed:"의리를 지키는 곳에 승리가 있다",      cji:"in",
    stat:{virtue:90,strategy:65,force:99},
    profile:"충의(忠義)의 화신. 오관참장으로 유비에게 귀환. 화용도에서 조조를 의리로 놓아줌. 단도부회. 번성 수공으로 우금 7군 격파. 여몽 기습에 맥성에서 최후.",
    allies:"유비, 장비, 조자룡", rivals:"여몽, 육손" },
  { id:"luma",  name:"마초",  hanja:"마초(馬超)",   title:"서량의 금마초",emoji:"🐎", color:"#7a2080",
    creed:"철기로 천하를 달려 패업을 이룬다",    cji:"ji",
    stat:{virtue:70,strategy:60,force:97},
    profile:"서량 철기를 이끄는 맹장. 부친 마등 복수를 위해 조조와 대결. 위남 전투에서 조조를 공포에 떨게 함. 이간책에 속아 한수와 결별 후 유비에 귀순.",
    allies:"유비, 제갈량", rivals:"조조, 조홍" },
];

// ══════════════════════════════════════════════════════════════════
// ── 삼국지 전체 상황 DB — 4단계 분류, 무한 루프용 ──────────────────
// ══════════════════════════════════════════════════════════════════
const SITUATION_DB = {
  // ── 입지(立志): 뜻을 세워라 ────────────────────────────────────
  0: [
    { id:"lj01", idiom:{word:"군웅할거(群雄割據)", meaning:"여러 영웅이 각지에서 세력을 나누어 다투는 난세의 형세"}, title:"황건적의 난", era:"184년", scene:"거록 평원",
      story:"황건 수령 장각이 '창천이사 황천당립(蒼天已死 黃天當立)'을 외치며 36방 수십만 무리를 이끌고 봉기했다. 관군은 무너지고 백성은 도탄에 빠졌다. 지금이 바로 세상에 뜻을 펼칠 때다.",
      question:"황건적 진압에 나서는 방법은?",
      options:[
        { cji:"天", text:"격문을 내려 의로운 선비들을 규합한다",      wisdom:"대의명분으로 인심을 먼저 얻는다",
          effects:{ personnel:+15, intel:+5,  ops:-5,  supply:-5,  military:+5  }, wisdomScore:85 },
        { cji:"地", text:"군량과 무기를 먼저 확보해 군세를 키운다",   wisdom:"실탄 없는 전쟁은 없다",
          effects:{ personnel:+5,  intel:-5,  ops:+10, supply:+20, military:+10 }, wisdomScore:72 },
        { cji:"人", text:"황건적 내부 이탈자를 포섭해 분열시킨다",   wisdom:"싸우지 않고 이기는 것이 최선이다",
          effects:{ personnel:+10, intel:+20, ops:+5,  supply:-5,  military:+5  }, wisdomScore:90 },
      ]},
    { id:"lj02", idiom:{word:"도원결의(桃園結義)", meaning:"복숭아 꽃 아래서 뜻을 같이하며 생사를 함께하기로 맹세함"}, title:"도원결의", era:"184년", scene:"탁현 도원",
      story:"낙양 성문 아래 방(榜)을 읽으며 탄식하는 사나이가 있었다. 그가 바로 유비였다. 불같은 성격의 장비가 시비를 걸었으나, 세 사람은 그 자리에서 서로의 뜻을 알아보고 복숭아 꽃 아래 하늘에 맹세했다. 뜻이 맞는 사람을 얻었다.",
      question:"의형제 결맹 후 첫 행동은?",
      options:[
        { cji:"人", text:"더 많은 의사(義士)를 모아 세력을 키운다",   wisdom:"사람이 모여야 대업이 이루어진다",
          effects:{ personnel:+25, intel:+5,  ops:0,   supply:-10, military:+10 }, wisdomScore:88 },
        { cji:"地", text:"즉시 황건적 토벌에 나서 이름을 알린다",    wisdom:"공을 세워야 발판이 생긴다",
          effects:{ personnel:+5,  intel:0,   ops:+15, supply:-15, military:+20 }, wisdomScore:75 },
        { cji:"天", text:"인근 현령을 찾아가 뜻을 선포하고 공인받는다",wisdom:"명분 없는 군사는 도적과 다름없다",
          effects:{ personnel:+10, intel:+10, ops:+5,  supply:+5,  military:+5  }, wisdomScore:82 },
      ]},
    { id:"lj03", idiom:{word:"하극상(下剋上)", meaning:"아랫사람이 윗사람을 꺾고 권력을 찬탈하는 난세의 모습"}, title:"동탁의 폭정", era:"189년", scene:"낙양 조정",
      story:"외척 하진이 살해되고 동탁이 낙양을 장악했다. 동탁은 소제를 폐하고 헌제를 옹립한 뒤 권력을 쥐었다. 황족 충신들이 암암리에 저항을 모색하고 있다.",
      question:"동탁에 맞서는 방법은?",
      options:[
        { cji:"天", text:"의를 내세워 각지 제후를 규합해 연합군을 만든다", wisdom:"大義名分이 천하를 움직인다",
          effects:{ personnel:+20, intel:+10, ops:+5,  supply:-15, military:+15 }, wisdomScore:90 },
        { cji:"人", text:"동탁 측근에 첩자를 심어 내부 분열을 꾀한다",  wisdom:"적의 내부가 스스로 무너지게 한다",
          effects:{ personnel:+5,  intel:+30, ops:+5,  supply:0,   military:0   }, wisdomScore:88 },
        { cji:"地", text:"낙양 탈출 후 근거지를 확보하고 때를 기다린다", wisdom:"힘을 기르는 것이 먼저다",
          effects:{ personnel:-5,  intel:+5,  ops:+10, supply:+15, military:+10 }, wisdomScore:70 },
      ]},
    { id:"lj04", idiom:{word:"대의명분(大義名分)", meaning:"큰 의로움과 명분이 있어야 천하의 인심을 모을 수 있다"}, title:"십팔로 제후 연합", era:"190년", scene:"산동 진류",
      story:"원소를 맹주로 십팔로 제후가 반동탁 연합군을 결성했다. 대군이 낙양을 향해 진격했으나 각 제후들은 저마다 딴 속셈을 품고 있다. 연합의 균열이 보이기 시작한다.",
      question:"연합군 내에서의 포지션은?",
      options:[
        { cji:"人", text:"제후들 사이를 중재하며 신뢰를 쌓는다",       wisdom:"사람의 마음을 얻는 자가 대업을 이룬다",
          effects:{ personnel:+20, intel:+15, ops:0,   supply:+5,  military:0   }, wisdomScore:92 },
        { cji:"地", text:"선봉에 서서 공을 세워 명성을 높인다",        wisdom:"실력으로 지위를 증명한다",
          effects:{ personnel:+5,  intel:0,   ops:+20, supply:-20, military:+25 }, wisdomScore:78 },
        { cji:"天", text:"대의를 앞세워 연합의 목표를 분명히 한다",    wisdom:"뜻이 흔들리면 연합이 깨진다",
          effects:{ personnel:+10, intel:+10, ops:+5,  supply:0,   military:+5  }, wisdomScore:85 },
      ]},
    { id:"lj05", idiom:{word:"봉천자령(奉天子令)", meaning:"천자를 받들어 제후에게 호령하는 최고의 정치적 명분"}, title:"조조의 봉천자령", era:"196년", scene:"허도",
      story:"조조가 헌제를 허도로 모셔 '천자를 받들어 제후에게 호령한다(奉天子以令諸侯)'는 전략을 완성했다. 명분과 실권을 동시에 쥔 조조의 기세가 날로 강성해지고 있다.",
      question:"조조의 봉천자 전략에 어떻게 대응하는가?",
      options:[
        { cji:"天", text:"한실(漢室) 부흥의 대의로 맞불을 놓는다",    wisdom:"더 큰 명분으로 천하의 인심을 얻는다",
          effects:{ personnel:+20, intel:+5,  ops:0,   supply:0,   military:+10 }, wisdomScore:90 },
        { cji:"人", text:"조조에게 등 돌린 인재들을 적극 영입한다",   wisdom:"조조의 실수는 우리의 기회다",
          effects:{ personnel:+25, intel:+10, ops:0,   supply:-5,  military:+5  }, wisdomScore:88 },
        { cji:"地", text:"당장 실력 배양에 집중해 독자 세력을 키운다", wisdom:"명분보다 실력이 먼저다",
          effects:{ personnel:+5,  intel:0,   ops:+15, supply:+20, military:+15 }, wisdomScore:72 },
      ]},
    { id:"lj06", idiom:{word:"삼고초려(三顧草廬)", meaning:"초가집을 세 번 찾아가 인재를 정성껏 맞이하는 진정한 예우"}, title:"와룡 은거", era:"207년", scene:"융중 초당",
      story:"제갈량은 융중(隆中)에 은거하며 세상을 관망하고 있다. '천하삼분지계'를 품고 때를 기다리는 그에게 유비가 세 번 찾아왔다. 첫 방문과 두 번째 방문에서 제갈량은 나타나지 않았다.",
      question:"세 번째 방문. 어떻게 임해야 하는가?",
      options:[
        { cji:"人", text:"지성(至誠)으로 간청하며 문 밖에서 기다린다", wisdom:"진정성이 사람의 마음을 움직인다",
          effects:{ personnel:+30, intel:+20, ops:0,   supply:-5,  military:+10 }, wisdomScore:98 },
        { cji:"天", text:"천하의 대의를 설명하고 함께할 것을 청한다",  wisdom:"뜻이 같아야 오래 함께한다",
          effects:{ personnel:+20, intel:+15, ops:+5,  supply:0,   military:+10 }, wisdomScore:92 },
        { cji:"地", text:"후한 예물과 높은 직위를 약속한다",          wisdom:"실리도 사람을 움직이는 힘이다",
          effects:{ personnel:+10, intel:+5,  ops:0,   supply:-20, military:+5  }, wisdomScore:65 },
      ]},
  ],

  // ── 취인(聚人): 사람을 모아라 ──────────────────────────────────
  1: [
    { id:"ci01", idiom:{word:"인재등용(人材登用)", meaning:"사람을 가려 쓰는 것이 모든 전략의 시작이다"}, title:"관도대전 전야", era:"200년", scene:"관도 진영",
      story:"원소가 70만 대군을 이끌고 남하했다. 조조의 군사는 고작 7만. 순욱은 '원소는 외형만 크고 결단력이 없다'며 결전을 권했다. 허유가 밤에 홀로 조조 진영으로 투항해 왔다.",
      question:"허유의 투항을 어떻게 처리하는가?",
      options:[
        { cji:"人", text:"맨발로 달려나가 맞이하며 전력을 다해 대우한다", wisdom:"인재를 얻는 자가 천하를 얻는다",
          effects:{ personnel:+25, intel:+35, ops:+15, supply:0,   military:+10 }, wisdomScore:98 },
        { cji:"天", text:"진심 여부를 시험한 뒤 신중하게 받아들인다",    wisdom:"경솔한 믿음이 화를 부른다",
          effects:{ personnel:+10, intel:+20, ops:+5,  supply:0,   military:+5  }, wisdomScore:80 },
        { cji:"地", text:"첩자일 수 있으므로 격리하고 정보만 취한다",    wisdom:"의심도 전략이다",
          effects:{ personnel:-10, intel:+10, ops:0,   supply:0,   military:0   }, wisdomScore:55 },
      ]},
    { id:"ci02", idiom:{word:"오관참장(五關斬將)", meaning:"다섯 관문을 돌파하며 의리를 지켜 끝까지 나아가는 불굴의 충성"}, title:"오관참장", era:"200년", scene:"황하 다섯 관문",
      story:"조조에게 일시 투항했던 관우가 유비의 소식을 듣고 아황·미부인을 모시며 다섯 관문을 돌파하고 있다. 관문마다 조조 부하 장수들이 막아섰지만 관우는 모두 베며 나아갔다.",
      question:"관우가 귀환한 후 어떻게 활용하는가?",
      options:[
        { cji:"人", text:"형주 수비 대장으로 삼아 전권을 맡긴다",       wisdom:"믿음이 충성을 이끌어낸다",
          effects:{ personnel:+15, intel:+5,  ops:+20, supply:0,   military:+30 }, wisdomScore:85 },
        { cji:"天", text:"의리를 치하하고 정예부대 지휘를 맡긴다",      wisdom:"의리에 보답하는 것이 군심을 얻는다",
          effects:{ personnel:+20, intel:0,   ops:+15, supply:0,   military:+25 }, wisdomScore:90 },
        { cji:"地", text:"귀환 경위를 조사해 조조와의 관계를 명확히 한다",wisdom:"신중함이 조직을 지킨다",
          effects:{ personnel:-5,  intel:+15, ops:0,   supply:0,   military:+10 }, wisdomScore:60 },
      ]},
    { id:"ci03", idiom:{word:"설전군유(舌戰群儒)", meaning:"혀로 여러 유학자를 논파하듯, 말 한마디가 전쟁을 결정한다"}, title:"적벽대전 전야 — 주유 설득", era:"208년", scene:"시상구 동오 진영",
      story:"조조 80만 대군이 남하했다. 동오 조정은 항복파와 주전파로 나뉘었다. 제갈량이 동오에 사신으로 왔다. 주유는 항복을 권유하는 척하며 제갈량을 시험했다.",
      question:"주유 설득에 성공하기 위한 방법은?",
      options:[
        { cji:"天", text:"이교(二喬) 고사를 들어 조조의 야욕을 자극한다", wisdom:"상대의 자존심을 건드리면 움직인다",
          effects:{ personnel:+5,  intel:+20, ops:+25, supply:0,   military:+15 }, wisdomScore:92 },
        { cji:"人", text:"공동의 이익을 강조하며 동맹의 필요성을 역설한다",wisdom:"이해관계가 같을 때 진정한 동맹이 생긴다",
          effects:{ personnel:+15, intel:+15, ops:+20, supply:+5,  military:+10 }, wisdomScore:88 },
        { cji:"地", text:"군사력 통계를 제시해 합리적 승산을 보여준다",   wisdom:"냉정한 사실이 사람을 설득한다",
          effects:{ personnel:+5,  intel:+10, ops:+15, supply:+10, military:+5  }, wisdomScore:75 },
      ]},
    { id:"ci04", idiom:{word:"유재시거(唯才是擧)", meaning:"오직 재능 있는 자를 등용하라 — 출신과 도덕은 부차적이다"}, title:"유재시거(唯才是擧)", era:"210년", scene:"허도 위나라 조정",
      story:"조조가 '유재시거령(唯才是擧令)'을 반포했다. 출신·도덕 불문하고 오직 재능 있는 자를 등용하겠다는 파격 선언. 천하의 인재들이 귀를 기울이고 있다.",
      question:"인재 등용 기준을 어떻게 세우는가?",
      options:[
        { cji:"人", text:"재능 최우선, 도덕·출신은 부차적으로 본다",    wisdom:"난세에는 능력이 덕목보다 급하다",
          effects:{ personnel:+30, intel:+20, ops:+15, supply:0,   military:+20 }, wisdomScore:88 },
        { cji:"天", text:"재능과 덕망을 함께 갖춘 인재만을 선발한다",   wisdom:"덕 없는 재주는 오래가지 못한다",
          effects:{ personnel:+15, intel:+10, ops:+5,  supply:+5,  military:+10 }, wisdomScore:85 },
        { cji:"地", text:"검증된 명문 가문 출신을 기반으로 선발한다",   wisdom:"검증된 집안이 안정을 준다",
          effects:{ personnel:+5,  intel:+5,  ops:0,   supply:+10, military:+5  }, wisdomScore:55 },
      ]},
    { id:"ci05", idiom:{word:"칠종칠금(七縱七擒)", meaning:"일곱 번 잡고 일곱 번 풀어주어 마음으로 복종하게 만든다"}, title:"맹획 칠종칠금", era:"225년", scene:"남중 밀림",
      story:"제갈량이 남중 반란을 진압하러 나섰다. 맹획을 일곱 번 잡고 일곱 번 풀어주며 진심으로 복종하게 만드는 전략. 참모들은 '왜 죽이지 않느냐'고 의아해한다.",
      question:"맹획을 또 잡았다. 어떻게 처리하는가?",
      options:[
        { cji:"人", text:"다시 풀어주며 '다음엔 진심으로 복종하라' 한다", wisdom:"마음을 얻어야 영원히 복종한다",
          effects:{ personnel:+25, intel:+10, ops:-5,  supply:-10, military:+5  }, wisdomScore:98 },
        { cji:"天", text:"관용을 베풀되 향후 배신 시 엄벌을 천명한다",   wisdom:"관용과 엄격함을 동시에 보인다",
          effects:{ personnel:+15, intel:+5,  ops:+10, supply:-5,  military:+10 }, wisdomScore:85 },
        { cji:"地", text:"이번엔 처형해 남중 전체에 위엄을 보인다",      wisdom:"두려움도 복종의 방법이다",
          effects:{ personnel:-15, intel:0,   ops:+10, supply:+5,  military:+15 }, wisdomScore:40 },
      ]},
    { id:"ci06", idiom:{word:"읍참마속(泣斬馬謖)", meaning:"눈물을 흘리며 아끼는 부하를 베어 군율을 세우는 지도자의 결단"}, title:"읍참마속(泣斬馬謖)", era:"228년", scene:"가정 전투 후",
      story:"마속이 가정(街亭)에서 제갈량의 명을 어기고 산꼭대기에 진을 쳤다가 장합에게 대패했다. 북벌 1차가 실패로 끝났다. 마속은 제갈량이 가장 아끼는 참모였다.",
      question:"마속을 어떻게 처리하는가?",
      options:[
        { cji:"天", text:"군율대로 처형하되 눈물로 그 죽음을 애도한다",  wisdom:"법은 사정을 보지 않는다",
          effects:{ personnel:-5,  intel:+5,  ops:+20, supply:0,   military:+25 }, wisdomScore:98 },
        { cji:"地", text:"공과를 따져 강등 후 재기 기회를 준다",         wisdom:"인재 낭비는 아군의 손실이다",
          effects:{ personnel:+10, intel:0,   ops:-5,  supply:0,   military:-5  }, wisdomScore:60 },
        { cji:"人", text:"명을 어긴 것은 맞지만 재능을 살려 다시 쓴다",  wisdom:"지나친 처벌은 인재를 잃는다",
          effects:{ personnel:+5,  intel:0,   ops:-10, supply:0,   military:-10 }, wisdomScore:45 },
      ]},
    { id:"ci07", idiom:{word:"이이제이(以夷制夷)", meaning:"적의 내부를 이용해 적을 물리치는 고도의 전략"}, title:"여몽의 위병(僞病)", era:"219년", scene:"육구 오나라 진영",
      story:"여몽이 병을 핑계로 직위를 내려놓고 젊은 육손을 천거했다. 형주의 관우는 육손이 무능하다 판단해 경계를 풀고 병력을 번성 쪽으로 돌렸다. 이것이 계략이었다.",
      question:"관우의 형주 방비를 어떻게 강화할 것인가?",
      options:[
        { cji:"天", text:"이변이 있을 때까지 현 경계 태세를 유지한다",   wisdom:"방심은 패망의 시작이다",
          effects:{ personnel:+5,  intel:+20, ops:+15, supply:-5,  military:+10 }, wisdomScore:88 },
        { cji:"人", text:"동오에 첩자를 심어 진짜 의도를 파악한다",      wisdom:"적의 마음을 알아야 대비할 수 있다",
          effects:{ personnel:+5,  intel:+30, ops:+10, supply:-5,  military:+5  }, wisdomScore:95 },
        { cji:"地", text:"번성 공략을 서둘러 신속히 결판을 낸다",        wisdom:"공격이 최선의 방어다",
          effects:{ personnel:-5,  intel:-5,  ops:+20, supply:-20, military:+20 }, wisdomScore:55 },
      ]},
    { id:"ci08", idiom:{word:"지성감천(至誠感天)", meaning:"지극한 정성은 하늘도 감동시킨다"}, title:"삼고초려의 진심", era:"207년", scene:"융중 초당",
      story:"유비가 세 번 찾아왔다. 제갈량은 그 진심에 감동받았다. 진정성이 천하의 인재를 움직인다.",
      question:"진정성으로 인재를 설득하는 방법은?",
      options:[
        { cji:"天", text:"세 번 찾아가며 포기하지 않는다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:96 },
        { cji:"地", text:"상대가 원하는 것을 먼저 파악해 제공한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"대의를 설명하고 함께할 것을 청한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci09", idiom:{word:"인재천거(人才薦擧)", meaning:"인재를 알아보는 눈이 가장 큰 능력이다"}, title:"순욱의 인재 추천", era:"196년", scene:"허도",
      story:"순욱이 조조에게 곽가·정욱·유엽 등을 추천했다. 뛰어난 참모는 또 다른 인재를 알아본다.",
      question:"인재가 인재를 추천하게 만드는 방법은?",
      options:[
        { cji:"天", text:"인재를 잘 대우해 좋은 평판을 만든다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"추천 인재의 성과를 공개적으로 칭찬한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"인재 추천 시스템을 제도화한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci10", idiom:{word:"관인대도(寬仁大度)", meaning:"너그러운 인자함과 큰 아량으로 사람을 얻는다"}, title:"여포의 배신과 조조의 대응", era:"199년", scene:"하비성 함락 후",
      story:"여포를 처형하자 부하 장료가 당당하게 결박된 채 서 있었다. 조조가 직접 풀어주었다. 용기 있는 적을 포용하는 아량.",
      question:"항복한 적 장수를 포용하는 방법은?",
      options:[
        { cji:"天", text:"용기와 능력을 인정하고 전향을 권유한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"충성을 시험하며 점진적으로 신뢰한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"중요 임무를 주어 능력을 검증한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci11", idiom:{word:"충심(忠心)", meaning:"충성하는 마음은 어떤 상황에서도 변하지 않는다"}, title:"제갈량의 출사표 작성", era:"227년", scene:"성도",
      story:"제갈량이 출사표를 쓰며 눈물을 흘렸다. 충성의 극치. 글 한 편이 후세에 길이 남는 충성의 표상이 되었다.",
      question:"충성을 표현하는 가장 진정한 방법은?",
      options:[
        { cji:"天", text:"행동으로 증명한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"묵묵히 맡은 바를 다한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"말과 글로 분명히 표현한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ci12", idiom:{word:"원려심모(遠慮深謀)", meaning:"멀리 생각하고 깊이 도모하는 것이 지략의 핵심"}, title:"노숙의 장기 전략", era:"208년", scene:"시상구",
      story:"노숙이 손권에게 천하이분지계를 설명했다. '한실은 이미 기울었습니다. 강동을 지키고 기회를 노리십시오.' 장기 전략의 중요성.",
      question:"장기 전략을 수립하는 방법은?",
      options:[
        { cji:"天", text:"20년 이상을 내다보는 큰 그림을 그린다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"단기 목표를 달성하며 장기 방향을 잡는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"전문가의 조언을 종합해 전략을 짠다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci13", idiom:{word:"인재위본(人材爲本)", meaning:"인재가 사업의 근본이다 — 항상 후계를 준비하라"}, title:"주유의 죽음과 후계", era:"210년", scene:"강동",
      story:"주유가 젊은 나이에 죽으며 노숙을 후계로 추천했다. '공명을 빼면 노숙이 최고입니다.' 죽음 앞에서도 조직을 생각한다.",
      question:"핵심 인재의 갑작스러운 사망에 대비하는 방법은?",
      options:[
        { cji:"天", text:"항상 후계자를 준비해둔다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"인재가 스스로 후계를 추천하게 한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"복수의 인재를 동시에 육성한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci14", idiom:{word:"사생취의(捨生取義)", meaning:"목숨을 버리고 의를 취한다 — 의로움이 생명보다 크다"}, title:"조운의 충성", era:"208년", scene:"장판파",
      story:"조자룡이 혼자 조조 백만 대군 속을 뚫고 아두를 구했다. 이것이 진정한 충성이다. 목숨을 걸어야 할 때 목숨을 건다.",
      question:"목숨을 다하는 충성을 이끌어내는 방법은?",
      options:[
        { cji:"天", text:"군주가 먼저 부하를 가족처럼 대한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:97 },
        { cji:"地", text:"공정한 보상으로 헌신을 인정한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"대의와 명분으로 충성의 이유를 만든다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:92 },
      ] },
    { id:"ci15", idiom:{word:"이과격중(以寡擊衆)", meaning:"적은 수로 많은 수를 공격하는 용기와 지략"}, title:"장료의 합비 방어", era:"215년", scene:"합비성",
      story:"장료가 7000명으로 손권 10만을 막았다. 목숨 걸고 선봉에 선 장수가 아군의 사기를 올린다.",
      question:"열세 병력으로 사기를 유지하는 방법은?",
      options:[
        { cji:"天", text:"지휘관이 직접 선두에 선다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"철저한 방어 태세로 안전을 보장한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"결정적 승리를 하나 만들어 사기를 올린다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci16", idiom:{word:"위급지신(危急之臣)", meaning:"위기에 빛나는 신하가 진정한 충신이다"}, title:"허저의 조조 호위", era:"212년", scene:"동관 전투",
      story:"마초가 조조를 추격할 때 허저가 목숨을 걸고 막았다. 진정한 충신은 위기에 빛난다.",
      question:"위기에서 부하의 충성을 이끌어내는 방법은?",
      options:[
        { cji:"天", text:"평소에 부하와 신뢰를 쌓는다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"충성에 반드시 보답한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"위기 시 군주가 먼저 용기를 보인다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci17", idiom:{word:"공수겸비(攻守兼備)", meaning:"공격과 수비를 모두 갖추어야 완전한 전력이다"}, title:"제갈량의 요새 구축", era:"229년", scene:"한중 방어선",
      story:"제갈량이 한중의 방어 체계를 철저히 구축했다. '이길 수 없으면 지켜라. 지킬 수 있으면 공격하라.' 방어와 공격의 균형.",
      question:"방어와 공격의 균형을 맞추는 방법은?",
      options:[
        { cji:"天", text:"방어를 완벽히 한 후 공격에 나선다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"항상 공격적 자세를 유지한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"상황에 따라 유연하게 선택한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci18", idiom:{word:"겸허납언(謙虛納言)", meaning:"겸손하게 남의 말을 받아들이는 것이 지도자의 덕이다"}, title:"손권의 인재 사랑", era:"210년", scene:"강동 조정",
      story:"손권이 말했다. '나는 형의 기업을 이었지만 형보다 더 뛰어난 참모를 얻었다.' 겸손함이 인재를 모은다.",
      question:"겸손으로 인재를 모으는 방법은?",
      options:[
        { cji:"天", text:"자신의 한계를 인정하고 도움을 청한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"인재의 공을 자신의 것으로 삼지 않는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"인재의 의견을 항상 경청한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci19", idiom:{word:"도의지교(道義之交)", meaning:"도와 의리로 맺은 교우는 어떤 유혹도 흔들 수 없다"}, title:"조조의 관우 존중", era:"200년", scene:"하비성 투항 후",
      story:"조조가 관우에게 금은보화와 높은 지위를 주었지만 관우의 마음은 유비에게 있었다. 진정한 인재는 돈으로 살 수 없다.",
      question:"돈으로 살 수 없는 충성을 얻는 방법은?",
      options:[
        { cji:"天", text:"같은 뜻과 가치관을 공유한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"인재가 원하는 환경과 역할을 만든다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"진심 어린 관계를 먼저 쌓는다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ci20", idiom:{word:"석별지정(惜別之情)", meaning:"진심으로 아쉬워하는 이별이 오히려 깊은 인연을 만든다"}, title:"유비의 서서 이별", era:"208년", scene:"신야",
      story:"조조가 서서의 모친을 인질로 잡아 서서를 강제로 데려갔다. 유비는 슬픔 속에서도 강제로 잡지 않았다. '그는 내 마음을 이미 알고 있다.'",
      question:"부하가 떠날 때 어떻게 대해야 하는가?",
      options:[
        { cji:"天", text:"진심으로 아쉬워하며 떠나도록 허락한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"더 좋은 조건을 제시해 마음을 돌린다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"붙잡아서 함께하도록 설득한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:82 },
      ] },
    { id:"ci21", idiom:{word:"인재불인외(人才不認外)", meaning:"인재는 겉모습으로 판단할 수 없다"}, title:"방통의 재능 발굴", era:"211년", scene:"익주 입성 후",
      story:"방통이 처음 유비를 만났을 때 인정받지 못했다. 제갈량의 추천으로 재기용됐다. 인재를 알아보는 데도 시간이 필요하다.",
      question:"숨은 인재를 발굴하는 방법은?",
      options:[
        { cji:"天", text:"다양한 기회를 주어 능력을 관찰한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"첫인상에 속지 않고 재평가한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:85 },
        { cji:"人", text:"신뢰할 수 있는 사람의 추천을 경청한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:90 },
      ] },
    { id:"ci22", idiom:{word:"외교의 묘(外交之妙)", meaning:"외교는 칼보다 강하고 전쟁보다 효율적인 무기다"}, title:"마량의 외교 능력", era:"219년", scene:"동오 방문",
      story:"마량이 동오에 사신으로 가 손권을 설득했다. 뛰어난 외교관이 전쟁을 막는다.",
      question:"뛰어난 외교관을 양성하는 방법은?",
      options:[
        { cji:"天", text:"다양한 문화와 전략을 배우게 한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"실전 외교 경험을 쌓게 한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"탁월한 언변과 인품을 먼저 개발한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ci23", idiom:{word:"영웅불문출신(英雄不問出身)", meaning:"영웅은 출신을 묻지 않는다"}, title:"오나라 육손의 등장", era:"221년", scene:"이릉",
      story:"36세 육손이 대도독이 되었다. 모두가 의아해했다. 젊음과 경험 부족이 오히려 선입견 없는 전략을 가능하게 했다.",
      question:"젊은 인재를 발탁하는 방법은?",
      options:[
        { cji:"天", text:"나이보다 능력과 잠재력을 본다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"전권을 주고 완전히 믿는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"경험자를 조언자로 붙여 보조한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci24", idiom:{word:"적장영입(敵將迎入)", meaning:"적장을 아군으로 만드는 것이 최고의 인재 영입이다"}, title:"강유의 항복과 재기", era:"234년", scene:"위나라 투항 후",
      story:"강유가 제갈량에게 귀순했다. 적의 인재를 얻는 것이 전쟁에서 이기는 것보다 낫다.",
      question:"적의 뛰어난 인재를 아군으로 만드는 방법은?",
      options:[
        { cji:"天", text:"진심으로 환영하고 능력을 인정한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"귀순 인재에게 즉각 중요 임무를 준다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"관찰 기간을 두어 충성도를 확인한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ci25", idiom:{word:"권한위임(權限委任)", meaning:"적절한 위임이 조직의 역량을 최대화한다"}, title:"제갈량과 사마의의 인재 비교", era:"234년", scene:"오장원 대치",
      story:"제갈량의 군량 공급 문제를 사마의가 알고 있었다. '공명은 작은 일도 직접 한다. 오래 가지 못할 것이다.' 권한 위임의 중요성.",
      question:"권한을 적절히 위임하는 방법은?",
      options:[
        { cji:"天", text:"믿을 수 있는 사람에게 전권을 준다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"핵심 결정만 직접 하고 나머지는 위임한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:92 },
        { cji:"人", text:"단계적으로 권한을 늘려간다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci26", idiom:{word:"삼인행필유아사(三人行必有我師)", meaning:"세 사람이 가면 그 중 반드시 나의 스승이 있다"}, title:"유비의 삼인방", era:"184년", scene:"탁군 의병",
      story:"유비·관우·장비 삼인방이 처음 뭉쳤다. 지도자·실행자·돌격대의 완벽한 조합. 팀이 전부다.",
      question:"완벽한 팀을 구성하는 방법은?",
      options:[
        { cji:"天", text:"각자의 강점이 서로 보완되도록 구성한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"능력보다 신뢰와 의리를 우선시한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:95 },
        { cji:"人", text:"같은 가치관과 목표를 공유하는 사람을 모은다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:88 },
      ] },
    { id:"ci27", idiom:{word:"옥불탁불성기(玉不琢不成器)", meaning:"옥도 갈지 않으면 그릇이 되지 않는다 — 교육이 인재를 만든다"}, title:"조조의 청주 10만 군", era:"192년", scene:"청주",
      story:"황건적 투항자 30만 중 10만을 정예로 훈련시켰다. 원자재를 가공해 최고의 제품을 만드는 능력.",
      question:"원석을 보석으로 만드는 인재 교육 방법은?",
      options:[
        { cji:"天", text:"기본기를 철저히 교육한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"실전 경험을 통해 빠르게 성장시킨다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"탁월한 지도자가 직접 훈련한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci28", idiom:{word:"불拘一格(불구일격)", meaning:"한 가지 틀에 얽매이지 않고 인재를 발굴한다"}, title:"손권의 젊은 장수 발탁", era:"200년", scene:"강동",
      story:"손권이 주유·노숙 등 젊은 장수들을 과감히 발탁했다. '아버지와 형이 쓰지 않은 인재가 내 인재다.'",
      question:"이전 세대가 놓친 인재를 발굴하는 방법은?",
      options:[
        { cji:"天", text:"선입견 없이 새로운 인재를 평가한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"은거하거나 알려지지 않은 인재를 찾는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"내부 추천보다 외부 탐색을 병행한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci29", idiom:{word:"시스템이 인재보다 오래 간다(制度超越人才)", meaning:"좋은 시스템은 뛰어난 인재보다 오래 조직을 지탱한다"}, title:"제갈량의 팔진도", era:"223년", scene:"어복포",
      story:"제갈량의 팔진도(八陣圖)에 동오군이 갇혔다. 죽은 제갈량의 진법이 살아있는 적을 가뒀다.",
      question:"혁신적 시스템으로 조직을 강화하는 방법은?",
      options:[
        { cji:"天", text:"자신이 없어도 작동하는 시스템을 만든다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"규칙과 매뉴얼로 지식을 조직화한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"훈련을 통해 시스템을 내재화한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ci30", idiom:{word:"이적위우(以敵爲友)", meaning:"적을 친구로 만드는 것이 최고의 외교다"}, title:"마초의 귀순과 활용", era:"215년", scene:"한중",
      story:"마초가 유비에게 귀순했다. 적이었던 자를 아군의 핵심으로 만드는 포용력.",
      question:"귀순한 적장을 효과적으로 활용하는 방법은?",
      options:[
        { cji:"天", text:"즉각 중요 임무를 주어 신뢰를 보인다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"단계적으로 신뢰를 쌓으며 권한을 늘린다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"귀순 이유를 파악해 진심을 확인한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:82 },
      ] },
  ],

  // ── 척토(拓土): 영토를 넓혀라 ──────────────────────────────────
  2: [
    { id:"ct01", idiom:{word:"화공지계(火攻之計)", meaning:"불로 적을 공격하는 계략 — 바람과 때를 읽는 자가 이긴다"}, title:"적벽대전 — 화공", era:"208년", scene:"장강 적벽",
      story:"주유의 대도독 지휘 하에 황개가 고육계(苦肉計)를 자처했다. 조조에게 투항하는 척 화공선을 이끌고 쇄도했다. 동남풍이 불었다. 불길이 조조의 수군 전체를 삼켰다.",
      question:"화공 성공 후 추격 작전을 어떻게 지휘하는가?",
      options:[
        { cji:"地", text:"전군이 육·수로로 동시 추격해 조조를 섬멸한다",  wisdom:"적이 무너질 때 끝까지 몰아야 한다",
          effects:{ personnel:-10, intel:+5,  ops:+30, supply:-25, military:+35 }, wisdomScore:80 },
        { cji:"人", text:"화용도에 복병을 심어 퇴로를 차단한다",          wisdom:"도망치는 적보다 퇴로를 막는 것이 중요",
          effects:{ personnel:+5,  intel:+20, ops:+25, supply:-15, military:+25 }, wisdomScore:95 },
        { cji:"天", text:"조조를 살려 보내 삼국 균형을 유지한다",         wisdom:"한 세력이 너무 강해지면 오히려 위험",
          effects:{ personnel:+10, intel:+10, ops:-5,  supply:+10, military:+5  }, wisdomScore:85 },
      ]},
    { id:"ct02", idiom:{word:"순망치한(脣亡齒寒)", meaning:"입술이 없으면 이가 시리듯, 동맹이 무너지면 함께 위태롭다"}, title:"형주 쟁탈전", era:"210년", scene:"형주 강릉",
      story:"적벽 후 유비가 형주 4군을 취했다. 손권은 형주를 빌려줬으나 돌려받지 못하고 있다. 노숙은 유비와의 동맹 유지를 주장하고, 주유는 즉각 형주 탈환을 주장한다.",
      question:"형주 문제를 어떻게 해결하는가?",
      options:[
        { cji:"天", text:"익주를 얻은 후 반드시 돌려준다는 약속을 지킨다", wisdom:"신의(信義)가 동맹의 기반이다",
          effects:{ personnel:+15, intel:+10, ops:0,   supply:+5,  military:+5  }, wisdomScore:88 },
        { cji:"人", text:"노숙의 중재로 서서히 협상해 실리를 취한다",      wisdom:"급하지 않게 시간을 쓰는 것이 협상력",
          effects:{ personnel:+10, intel:+15, ops:+5,  supply:+5,  military:+5  }, wisdomScore:85 },
        { cji:"地", text:"형주를 유지하면서 군사력으로 압박한다",          wisdom:"실력이 있어야 협상도 유리하다",
          effects:{ personnel:-10, intel:0,   ops:+15, supply:-10, military:+20 }, wisdomScore:65 },
      ]},
    { id:"ct03", idiom:{word:"지피지기(知彼知己)", meaning:"적을 알고 나를 알면 백 번 싸워도 위태롭지 않다"}, title:"한중 쟁탈전", era:"219년", scene:"한중 정군산",
      story:"유비가 한중 공략에 나섰다. 황충이 정군산에서 조조의 대장 하후연을 참수하는 대승을 거뒀다. 조조가 직접 대군을 이끌고 왔다. 진퇴양난의 국면.",
      question:"조조의 대군에 어떻게 대응하는가?",
      options:[
        { cji:"地", text:"수비를 굳히며 장기전으로 끌어 군량을 소진시킨다", wisdom:"시간이 지나면 적이 지쳐 물러난다",
          effects:{ personnel:+5,  intel:+10, ops:+15, supply:-20, military:+20 }, wisdomScore:90 },
        { cji:"人", text:"조조의 진영에 이간책을 심어 내분을 일으킨다",    wisdom:"싸우지 않고 이기는 것이 최선",
          effects:{ personnel:+10, intel:+25, ops:+10, supply:-5,  military:+10 }, wisdomScore:92 },
        { cji:"天", text:"명분을 앞세워 한실 부흥을 천하에 선포한다",      wisdom:"대의는 군사보다 강한 무기다",
          effects:{ personnel:+20, intel:+5,  ops:+5,  supply:0,   military:+5  }, wisdomScore:82 },
      ]},
    { id:"ct04", idiom:{word:"성동격서(聲東擊西)", meaning:"동쪽을 치는 척하며 서쪽을 공격하는 양동 작전의 정수"}, title:"관도대전 — 오소 기습", era:"200년", scene:"오소 군량고",
      story:"허유가 투항해 알려준 정보: 원소의 군량기지 오소(烏巢)는 허술하게 지켜지고 있다. 조조가 직접 5000 기병을 이끌고 야간 기습을 감행했다. 군량 전부가 불에 탔다.",
      question:"오소 기습 성공 후 전략은?",
      options:[
        { cji:"地", text:"혼란에 빠진 원소군을 전방위로 즉각 공격한다",   wisdom:"적이 흔들릴 때 총공격이 승부수",
          effects:{ personnel:-5,  intel:+5,  ops:+35, supply:-20, military:+40 }, wisdomScore:95 },
        { cji:"人", text:"원소군 내 투항을 권유해 피를 최소화한다",       wisdom:"항복을 받는 것이 싸워 이기는 것보다 낫다",
          effects:{ personnel:+20, intel:+10, ops:+15, supply:-5,  military:+20 }, wisdomScore:88 },
        { cji:"天", text:"승세에 취하지 말고 포위망을 완성한 뒤 결전한다", wisdom:"서두름이 승리를 망친다",
          effects:{ personnel:+5,  intel:+15, ops:+20, supply:-10, military:+25 }, wisdomScore:85 },
      ]},
    { id:"ct05", idiom:{word:"교병필패(驕兵必敗)", meaning:"교만한 군대는 반드시 패한다 — 승리에 취하면 방심이 온다"}, title:"이릉대전 — 화공", era:"222년", scene:"이릉 장강 연안",
      story:"관우의 죽음에 분노한 유비가 동오 원정에 나섰다. 육손은 7개월간 수비만 했다. 유비의 군영이 강가 연안 700리에 산림을 의지해 늘어섰다. 육손이 화공을 명했다.",
      question:"화공에 대응하는 방법은?",
      options:[
        { cji:"天", text:"즉시 후퇴해 피해를 최소화하고 재건을 도모한다",  wisdom:"살아서 돌아가야 다시 도모할 수 있다",
          effects:{ personnel:-10, intel:+10, ops:-20, supply:-15, military:-20 }, wisdomScore:80 },
        { cji:"地", text:"수군을 강으로 급파해 강 위에서 탈출로를 만든다",  wisdom:"물길이 살길이다",
          effects:{ personnel:-5,  intel:+5,  ops:-15, supply:-20, military:-10 }, wisdomScore:72 },
        { cji:"人", text:"오반이 매복 부대를 이끌어 육손의 추격을 저지한다",wisdom:"후퇴를 엄호해야 전군이 산다",
          effects:{ personnel:-15, intel:0,   ops:-10, supply:-10, military:-5  }, wisdomScore:78 },
      ]},
    { id:"ct06", idiom:{word:"이공위수(以攻爲守)", meaning:"공격이 최선의 수비 — 수세에 몰렸을 때 역습으로 돌파한다"}, title:"합비 공방전", era:"215년", scene:"합비성",
      story:"조조가 서쪽 원정 중인 틈에 손권이 10만 대군으로 합비를 포위했다. 수비 병력은 고작 7000. 장료가 '공격이 최선의 수비'를 주장하며 새벽 기습을 제안했다.",
      question:"장료의 새벽 기습 제안을 받아들이는가?",
      options:[
        { cji:"地", text:"장료의 기습을 허가하고 전군 사기를 올린다",      wisdom:"역발상 기습이 수성을 가능케 한다",
          effects:{ personnel:+5,  intel:+5,  ops:+30, supply:-10, military:+30 }, wisdomScore:95 },
        { cji:"Heaven", text:"성문을 굳게 잠그고 지원군을 기다린다",       wisdom:"정면 충돌 피하고 때를 기다린다",
          effects:{ personnel:-5,  intel:+5,  ops:0,   supply:-15, military:0   }, wisdomScore:65 },
        { cji:"人", text:"화친을 제안해 전투 없이 포위를 풀게 한다",       wisdom:"싸움 없이 위기를 넘기는 것이 지혜",
          effects:{ personnel:+10, intel:+10, ops:-10, supply:+5,  military:-5  }, wisdomScore:70 },
      ]},
    { id:"ct07", idiom:{word:"원교근공(遠交近攻)", meaning:"먼 나라와 손잡고 가까운 적을 먼저 치는 외교·군사 전략"}, title:"오환 원정", era:"207년", scene:"백랑산 북방",
      story:"조조가 원소의 잔당 원상·원담이 도주한 오환 땅까지 원정했다. 군량이 바닥나고 뒤에서는 유표·유비가 허도를 노릴 수 있는 상황. 곽가는 '반드시 가야 한다'며 원정을 지지했다.",
      question:"원정을 계속할 것인가?",
      options:[
        { cji:"天", text:"뜻을 굽히지 않고 끝까지 원정을 완수한다",       wisdom:"시작한 일은 반드시 매듭짓는다",
          effects:{ personnel:-10, intel:+5,  ops:+25, supply:-30, military:+30 }, wisdomScore:90 },
        { cji:"地", text:"군량 사정을 고려해 일단 철수 후 재도전한다",    wisdom:"준비 없는 고집은 패망을 부른다",
          effects:{ personnel:+5,  intel:+5,  ops:-10, supply:+20, military:-5  }, wisdomScore:72 },
        { cji:"人", text:"현지 호족을 회유해 보급선을 개설한다",          wisdom:"사람을 얻으면 문제가 풀린다",
          effects:{ personnel:+15, intel:+10, ops:+15, supply:+10, military:+15 }, wisdomScore:88 },
      ]},
    { id:"ct08", idiom:{word:"기회를 포착하라(把握機會)", meaning:"기회는 준비된 자에게만 온다"}, title:"적벽 화공의 승리", era:"208년", scene:"적벽",
      story:"황개의 화공선이 불길을 일으키며 조조의 수군을 전소시켰다. 불과 바람이 역사를 바꿨다.",
      question:"결정적 순간에 최적의 전술을 구사하는 방법은?",
      options:[
        { cji:"天", text:"적의 약점을 정확히 파악하고 집중 공격한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"자연을 활용해 최소 피해로 최대 효과를 낸다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"기습의 시기를 완벽하게 선택한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct09", idiom:{word:"출기불의(出奇不意)", meaning:"예상치 못한 기발한 방법으로 적을 놀라게 한다"}, title:"오나라의 형주 기습", era:"219년", scene:"형주",
      story:"여몽의 계책으로 형주가 함락됐다. 완벽한 기만전술. 예상치 못한 방향의 공격이 가장 강하다.",
      question:"적이 전혀 예상치 못한 곳을 공격하는 방법은?",
      options:[
        { cji:"天", text:"적의 방어 체계 허점을 철저히 분석한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"기만전술로 적의 시선을 다른 곳으로 돌린다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"신속하게 움직여 적이 반응할 시간을 주지 않는다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct10", idiom:{word:"노당익장(老當益壯)", meaning:"늙어도 더욱 굳세다 — 경험이 용기를 완성한다"}, title:"한중 정군산 전투", era:"219년", scene:"정군산",
      story:"황충이 정군산에서 하후연을 참수했다. 노장의 결단과 용기. 나이는 전략적 판단을 막지 않는다.",
      question:"나이와 경험이 장점이 될 때는?",
      options:[
        { cji:"天", text:"경험에서 나오는 판단력을 발휘한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"적이 방심하는 순간을 정확히 포착한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"담력과 결단으로 적의 핵심을 친다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct11", idiom:{word:"신속함이 핵심(迅速爲要)", meaning:"빠른 자가 느린 자를 이긴다 — 속도가 전략이다"}, title:"마초의 위남 전투", era:"211년", scene:"위수 북안",
      story:"마초가 조조를 위수까지 몰아붙였다. 천하제일의 기병이 가져온 압도적 기세.",
      question:"기세로 적을 압박하는 방법은?",
      options:[
        { cji:"天", text:"신속한 이동으로 적이 반응할 틈을 주지 않는다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"결정적 승리를 연속으로 만들어 사기를 높인다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"적의 핵심 거점을 빠르게 점령한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct12", idiom:{word:"지리적 이점(地理之利)", meaning:"지형을 아는 자가 전투를 지배한다"}, title:"위나라의 오나라 침공", era:"222년", scene:"광릉",
      story:"조인이 광릉에서 손권의 군대와 대치했다. 장강이 자연 요새가 되어 위나라를 막았다.",
      question:"지형을 전략적으로 활용하는 방법은?",
      options:[
        { cji:"天", text:"지형의 특성을 최대한 이용한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"적이 지형 이점을 활용하기 전에 선점한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"지형 분석을 바탕으로 전술을 수립한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct13", idiom:{word:"패이위훈(敗而爲訓)", meaning:"실패를 교훈으로 삼으면 결국 승리한다"}, title:"촉한의 기산 1차 북벌", era:"228년", scene:"기산",
      story:"제갈량의 첫 북벌. 가정 패배로 실패했지만 위나라를 공포에 떨게 했다.",
      question:"실패에서 교훈을 얻는 방법은?",
      options:[
        { cji:"天", text:"패인을 냉철히 분석하고 개선한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:85 },
        { cji:"地", text:"실패한 부분은 과감히 수정한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"성공한 부분은 강화하며 다시 시도한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:82 },
      ] },
    { id:"ct14", idiom:{word:"속전속결(速戰速決)", meaning:"빠른 전투로 빠른 결론을 낸다"}, title:"위나라의 요동 정복", era:"238년", scene:"요동",
      story:"사마의가 요동의 공손연을 정복했다. 1년 만에 완료한 신속한 원정.",
      question:"신속한 원정으로 완전한 승리를 거두는 방법은?",
      options:[
        { cji:"天", text:"목표를 명확히 하고 모든 자원을 집중한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"예상 기간의 반에 완수를 목표로 한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"항복 조건을 미리 제시해 저항을 최소화한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct15", idiom:{word:"협력의 힘(協力之力)", meaning:"혼자 할 수 없는 것을 함께 이룬다"}, title:"손권의 위나라 침공 견제", era:"227년", scene:"합비 공방",
      story:"손권이 위나라를 여러 방면에서 견제했다. 제갈량의 북벌을 돕는 양동 작전.",
      question:"동맹의 전략과 연계하는 방법은?",
      options:[
        { cji:"天", text:"아군의 공격 시기에 맞춰 적을 분산시킨다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"독립적으로 움직이며 서로 보완한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"사전에 세밀한 협력 계획을 수립한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct16", idiom:{word:"양초지요(糧草之要)", meaning:"군량이 전쟁의 핵심이다 — 보급 없이는 승리도 없다"}, title:"제갈량의 2차 북벌", era:"228년", scene:"산관",
      story:"제갈량의 2차 북벌. 군량 부족으로 철수했지만 진창 요새를 공략했다.",
      question:"보급이 부족한 원정을 관리하는 방법은?",
      options:[
        { cji:"天", text:"보급이 가능한 범위 내에서만 작전한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:85 },
        { cji:"地", text:"현지 조달을 최대화한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"신속하게 목표를 달성하고 철수한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct17", idiom:{word:"취약점공략(脆弱點攻略)", meaning:"적의 가장 약한 곳을 가장 강하게 치는 것이 전략의 핵심"}, title:"위나라 장합의 전략", era:"228년", scene:"가정",
      story:"장합이 마속의 약점을 간파하고 수원(水源)을 차단했다. 적의 약점을 정확히 공략하는 것이 전략.",
      question:"적의 핵심 약점을 찾아 공략하는 방법은?",
      options:[
        { cji:"天", text:"적의 보급과 물자 흐름을 분석한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"방어의 빈틈을 정찰로 파악한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"심리적 약점을 이용한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct18", idiom:{word:"내부단결(內部團結)", meaning:"내부가 하나로 뭉쳐야 외부와 싸울 수 있다"}, title:"오나라의 산월 평정 완성", era:"230년", scene:"강동 산악",
      story:"손권이 산월족을 완전히 평정하며 후방 안정을 완성했다. 내부 안정 없이 외부 팽창 불가.",
      question:"내부 안정이 외부 팽창의 전제조건인 이유는?",
      options:[
        { cji:"天", text:"내부 반란은 전방 전투보다 더 위험하다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"안정된 후방이 전방 보급의 기반이다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"내부 단결이 전투력의 배가(倍加) 효과를 낸다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct19", idiom:{word:"점진확장(漸進擴張)", meaning:"조급하지 않게 하나씩 쌓아가는 것이 진정한 확장이다"}, title:"촉한의 3차 북벌", era:"229년", scene:"무도·음평",
      story:"제갈량의 3차 북벌. 무도·음평 두 군을 차지하며 영토를 넓혔다.",
      question:"영토를 점진적으로 확장하는 방법은?",
      options:[
        { cji:"天", text:"한 번에 많은 곳보다 확실히 지킬 수 있는 곳만 확보한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"점령지 안정화를 완료한 뒤 다음을 노린다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"전략적으로 중요한 거점을 우선 확보한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct20", idiom:{word:"수육병용(水陸竝用)", meaning:"물과 육지 모두를 활용해야 완전한 전력이 된다"}, title:"위나라의 동오 공략 실패", era:"234년", scene:"합비",
      story:"위나라가 동오를 공략했지만 장강에 막혀 실패했다. 자연의 장벽을 극복하는 것이 관건.",
      question:"자연 장벽을 극복하는 방법은?",
      options:[
        { cji:"天", text:"수군을 양성해 수로를 통해 공략한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:82 },
        { cji:"地", text:"장벽 우회 경로를 개발한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"내부 이탈자를 이용해 안에서 무너뜨린다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct21", idiom:{word:"자립이 최강(自立最强)", meaning:"남에게 의존하지 않는 것이 가장 강한 힘이다"}, title:"제갈량의 4차 북벌", era:"231년", scene:"기산 재도전",
      story:"제갈량이 다시 기산에서 사마의와 대치했다. 이종의 군량 운반 실패로 또다시 철수.",
      question:"외부 의존도를 줄이는 방법은?",
      options:[
        { cji:"天", text:"자체 군량 생산 능력을 먼저 키운다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"보급을 담당할 믿을 수 있는 인재를 선발한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"여러 경로의 보급선을 확보한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct22", idiom:{word:"성동격서(聲東擊西)", meaning:"동쪽을 치는 척하며 서쪽을 공격한다"}, title:"손권의 산동 공략", era:"232년", scene:"요동 방면",
      story:"손권이 요동 공손연과 교류하며 위나라 후방을 위협했다. 우회 전략으로 적의 전력을 분산시킨다.",
      question:"우회 전략으로 적의 전력을 분산시키는 방법은?",
      options:[
        { cji:"天", text:"적의 후방과 측면을 동시에 위협한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"먼 동맹을 통해 적을 사방에서 압박한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"외교로 적의 동맹국을 이탈시킨다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct23", idiom:{word:"불굴의 의지(不屈之志)", meaning:"어떤 상황에서도 굽히지 않는 의지가 결국 역사를 만든다"}, title:"촉한의 5차 북벌", era:"234년", scene:"오장원 최후",
      story:"제갈량의 마지막 북벌. 오장원에서 사마의와 대치하다 병사했다. 끝까지 포기하지 않는 의지.",
      question:"최후까지 포기하지 않는 정신을 유지하는 방법은?",
      options:[
        { cji:"天", text:"목표의 의미와 가치를 항상 상기한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"작은 성취를 통해 포기하지 않는 이유를 만든다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"동료의 격려로 서로 버팀목이 된다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct24", idiom:{word:"유시유종(有始有終)", meaning:"시작이 있으면 반드시 끝이 있어야 한다"}, title:"위나라의 오환 원정 완성", era:"207년", scene:"오환 백랑산",
      story:"조조가 오환 원정으로 원소 잔당을 완전 제거했다. 끝까지 마무리하는 철저함.",
      question:"시작한 일을 반드시 완수하는 방법은?",
      options:[
        { cji:"天", text:"중도 포기의 손실을 항상 계산한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"목표를 작게 나누어 단계적으로 완수한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"완수 후 성과를 명확히 평가한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct25", idiom:{word:"우공이산(愚公移山)", meaning:"우공이 산을 옮기듯 포기하지 않고 방법을 바꿔 나아간다"}, title:"손권의 합비 재도전", era:"234년", scene:"합비성",
      story:"손권이 합비를 다시 공략했지만 또 실패했다. 같은 방법으로 같은 곳을 반복 공략하면 안 된다.",
      question:"반복 실패를 극복하는 방법은?",
      options:[
        { cji:"天", text:"실패 원인을 분석해 다른 방법을 시도한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:82 },
        { cji:"地", text:"목표 자체가 옳은지 재검토한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"다른 방향에서 접근해 적의 허를 찌른다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct26", idiom:{word:"청출어람(靑出於藍)", meaning:"제자가 스승보다 나아지는 것이 참된 계승이다"}, title:"강유의 1차 북벌", era:"240년", scene:"위나라 국경",
      story:"강유가 처음으로 북벌을 시작했다. 제갈량의 유지를 이어받아 출정한 첫걸음.",
      question:"스승의 뜻을 이어받아 새로 시작하는 방법은?",
      options:[
        { cji:"天", text:"스승의 방식을 기반으로 자신만의 색을 더한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:85 },
        { cji:"地", text:"스승의 성공과 실패 모두에서 배운다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"스승보다 나아지려는 목표를 갖는다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct27", idiom:{word:"자강불식(自彊不息)", meaning:"스스로 강해지기를 멈추지 않는다"}, title:"위나라의 삼국 중 최강 군사력", era:"240년", scene:"낙양",
      story:"위나라가 세 나라 중 가장 강한 군사력을 유지했다. 강함을 지속시키는 비결.",
      question:"강함을 오래 유지하는 방법은?",
      options:[
        { cji:"天", text:"혁신을 멈추지 않는다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"내부 결속을 항상 다진다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"적을 절대 과소평가하지 않는다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"ct28", idiom:{word:"양지탁세(量之度勢)", meaning:"형세를 헤아리고 능력을 재어 전략을 세운다"}, title:"촉한의 강유 9차 북벌", era:"253년", scene:"적도",
      story:"강유가 위나라에 계속 도전했다. 국력이 소모되었지만 포기하지 않았다.",
      question:"지속적인 도전의 가치와 한계를 판단하는 방법은?",
      options:[
        { cji:"天", text:"목표 대비 투입 비용을 냉철히 계산한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:82 },
        { cji:"地", text:"동료의 의견을 충분히 듣는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"외부 상황 변화를 놓치지 않는다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"ct29", idiom:{word:"출기제승(出奇制勝)", meaning:"기발한 전략으로 상대를 제압한다"}, title:"위나라 등애의 기습 성공", era:"263년", scene:"음평 절벽",
      story:"등애가 불가능한 루트로 성도를 기습했다. 불가능을 가능으로 만드는 결단.",
      question:"불가능해 보이는 일을 실행하는 용기는?",
      options:[
        { cji:"天", text:"먼저 가능성을 확인하고 결단한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"실패를 두려워하지 않고 도전한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"핵심 인원의 완전한 헌신을 이끌어낸다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"ct30", idiom:{word:"최후의 결전(最後之決戰)", meaning:"결정적 순간에 모든 것을 걸어 완전한 승리를 거둔다"}, title:"진나라 통일 전쟁", era:"280년", scene:"장강 도하",
      story:"진나라 수군이 장강을 건너 오나라를 완전히 정복했다. 100년 분열의 종식.",
      question:"최후의 통일 전쟁에서 확실한 승리를 거두는 방법은?",
      options:[
        { cji:"天", text:"수군을 이용해 강 방어선을 무력화한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"여러 방면의 동시 공격으로 적을 분산시킨다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"내부 투항을 유도해 저항을 최소화한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
  ],

  // ── 일통(一統): 천하를 통일하라 ────────────────────────────────
  3: [
    { id:"it01", idiom:{word:"거국일치(擧國一致)", meaning:"나라 전체가 하나의 뜻으로 모여 대업을 향해 나아간다"}, title:"출사표(出師表)", era:"227년", scene:"성도 한나라 조정",
      story:"제갈량이 북벌을 앞두고 후주 유선에게 출사표를 올렸다. '先帝創業未半而中道崩殂(선제께서 창업을 반도 이루지 못하고 돌아가셨습니다).' 눈물 없이 읽을 수 없는 글이었다.",
      question:"북벌의 방향을 어떻게 잡는가?",
      options:[
        { cji:"天", text:"한실 부흥의 대의를 높이 내걸고 천하에 선포한다",  wisdom:"명분이 군사보다 먼저 싸운다",
          effects:{ personnel:+20, intel:+10, ops:+10, supply:+5,  military:+15 }, wisdomScore:92 },
        { cji:"地", text:"위수 유역 농경지를 점령해 군량 자급 기반을 만든다", wisdom:"군량이 확보돼야 장기전이 가능하다",
          effects:{ personnel:+5,  intel:+5,  ops:+15, supply:+25, military:+10 }, wisdomScore:88 },
        { cji:"人", text:"위나라 내 반조조 세력과 내통해 내부 분열을 유도한다",wisdom:"적의 분열이 최고의 전략",
          effects:{ personnel:+10, intel:+25, ops:+10, supply:0,   military:+10 }, wisdomScore:90 },
      ]},
    { id:"it02", idiom:{word:"이일대로(以逸待勞)", meaning:"편안히 쉬며 지쳐서 오는 적을 기다리는 소모전의 지혜"}, title:"사마의의 방어 전략", era:"231년", scene:"기산 대치",
      story:"사마의가 기산에서 제갈량과 대치했다. 사마의는 절대 싸우지 않고 수비만 했다. 군량 때문에 먼저 포기해야 하는 쪽은 촉한이다. '시간이 적'임을 알게 된 제갈량.",
      question:"사마의의 수비 전략을 어떻게 돌파하는가?",
      options:[
        { cji:"人", text:"사마의가 아닌 다른 위 장수를 도발해 무리하게 출전시킨다", wisdom:"상대의 약한 고리를 공략한다",
          effects:{ personnel:+5,  intel:+25, ops:+20, supply:-10, military:+20 }, wisdomScore:88 },
        { cji:"地", text:"현지에서 군량을 조달하는 둔전(屯田)을 시작한다",  wisdom:"보급 문제를 현지에서 해결한다",
          effects:{ personnel:+10, intel:0,   ops:-5,  supply:+30, military:0   }, wisdomScore:90 },
        { cji:"Heaven", text:"천자의 이름으로 사마의를 역적으로 규탄한다",  wisdom:"명분으로 적의 사기를 꺾는다",
          effects:{ personnel:+15, intel:+10, ops:+5,  supply:0,   military:+10 }, wisdomScore:75 },
      ]},
    { id:"it03", idiom:{word:"국궁진췌(鞠躬盡瘁)", meaning:"몸이 다 닳도록 충성하고 죽어서야 그친다는 불멸의 헌신"}, title:"오장원의 최후", era:"234년", scene:"오장원 촉한 진영",
      story:"제갈량이 오장원에서 병으로 쓰러졌다. 별이 떨어지는 것을 본 사마의가 '공명이 죽었다'고 직감했다. 강유가 사마의의 추격을 막았다. 제갈량의 마지막 유언은 '초심을 잃지 말라'였다.",
      question:"제갈량 사후 촉한을 어떻게 이끌어 가는가?",
      options:[
        { cji:"天", text:"제갈량의 유지를 받들어 북벌을 계속한다",         wisdom:"초심을 잃지 않는 것이 가장 강한 무기",
          effects:{ personnel:+15, intel:+10, ops:+20, supply:-20, military:+25 }, wisdomScore:90 },
        { cji:"人", text:"강유를 중심으로 인재를 결집해 내부를 안정시킨다", wisdom:"사람이 있어야 나라가 선다",
          effects:{ personnel:+25, intel:+5,  ops:+5,  supply:+5,  military:+10 }, wisdomScore:88 },
        { cji:"地", text:"내치를 충실히 하며 국력을 회복한 뒤 도모한다",   wisdom:"때를 기다리는 것도 전략이다",
          effects:{ personnel:+10, intel:+5,  ops:-10, supply:+20, military:+5  }, wisdomScore:82 },
      ]},
    { id:"it04", idiom:{word:"역성혁명(易姓革命)", meaning:"왕조가 바뀌어 새 성씨의 천자가 천명을 받아 다스림"}, title:"위나라 선양(禪讓)", era:"265년", scene:"낙양 위나라 조정",
      story:"사마염이 마침내 위 원제(元帝)에게 선양을 요구했다. 한을 멸하고 위를 세운 조씨가 이번엔 사마씨에게 천하를 내주어야 하는 역사의 아이러니. 천하는 진(晉)나라가 된다.",
      question:"천하를 넘겨받는 절차를 어떻게 처리하는가?",
      options:[
        { cji:"天", text:"덕치(德治)를 선포하며 민심부터 얻는다",          wisdom:"천하는 힘이 아닌 덕으로 다스린다",
          effects:{ personnel:+25, intel:+10, ops:+5,  supply:+10, military:+10 }, wisdomScore:95 },
        { cji:"地", text:"군사력을 바탕으로 신속히 체제를 안정시킨다",     wisdom:"빠른 안정이 민심을 잡는다",
          effects:{ personnel:+5,  intel:+5,  ops:+20, supply:+5,  military:+25 }, wisdomScore:80 },
        { cji:"人", text:"구 위나라 신하들을 포용해 내부 저항을 없앤다",   wisdom:"적도 품으면 아군이 된다",
          effects:{ personnel:+20, intel:+15, ops:+5,  supply:+5,  military:+5  }, wisdomScore:88 },
      ]},
    { id:"it05", idiom:{word:"천하통일(天下統一)", meaning:"분열된 천하를 하나로 묶어 만백성이 평안한 세상을 연다"}, title:"동오 최후 공략", era:"280년", scene:"건업 장강",
      story:"진(晉)나라 무제 사마염이 수군 20만을 이끌고 장강을 건넜다. 동오의 마지막 황제 손호는 수레에 관(棺)을 싣고 스스로 투항했다. 삼국시대 100년 역사가 막을 내리는 순간.",
      question:"최후의 통일 이후 새 질서를 어떻게 세우는가?",
      options:[
        { cji:"天", text:"천하를 하나로 묶는 대동(大同)의 이상을 선포한다", wisdom:"통일은 끝이 아니라 새로운 시작이다",
          effects:{ personnel:+30, intel:+10, ops:+10, supply:+15, military:+10 }, wisdomScore:98 },
        { cji:"人", text:"삼국 모든 인재를 품어 천하의 지혜를 모은다",     wisdom:"사람이 모인 곳에 번영이 온다",
          effects:{ personnel:+35, intel:+20, ops:+5,  supply:+5,  military:+5  }, wisdomScore:95 },
        { cji:"地", text:"군사력으로 신속히 전국을 안정시킨다",            wisdom:"혼란을 빨리 잡아야 백성이 산다",
          effects:{ personnel:+5,  intel:+5,  ops:+20, supply:+10, military:+20 }, wisdomScore:82 },
      ]},
    { id:"it06", idiom:{word:"화용도의리(華容道義)", meaning:"적장이라도 은혜를 갚는 의리 — 의리는 전략보다 크다"}, title:"화용도의 의리", era:"208년", scene:"화용도 퇴로",
      story:"적벽에서 패한 조조가 화용도로 도주했다. 매복한 관우 앞에 조조가 나타났다. 조조는 '오관참장 때의 은혜를 생각해달라'고 했다. 관우의 칼이 멈칫했다.",
      question:"관우는 어떤 결단을 내려야 하는가?",
      options:[
        { cji:"天", text:"은혜를 갚고 조조를 놓아준다 — 의리를 지킨다",    wisdom:"의리는 전략보다 크다",
          effects:{ personnel:+20, intel:-5,  ops:-15, supply:0,   military:-20 }, wisdomScore:85 },
        { cji:"地", text:"명령대로 조조를 사로잡아 유비에게 데려간다",     wisdom:"명령이 의리보다 우선이다",
          effects:{ personnel:-5,  intel:+10, ops:+20, supply:0,   military:+25 }, wisdomScore:75 },
        { cji:"人", text:"조조를 놓아주되 그의 부하들을 거두어 들인다",    wisdom:"큰 것을 잃고 작은 것을 취하는 지혜",
          effects:{ personnel:+15, intel:+5,  ops:0,   supply:+5,  military:+5  }, wisdomScore:80 },
      ]},
    { id:"it07", idiom:{word:"계세지업(繼世之業)", meaning:"대를 이어 전해지는 사업이 가장 위대하다"}, title:"위나라의 3대 황제", era:"226년", scene:"낙양",
      story:"조비가 죽고 조예가 황제에 올랐다. 할아버지 조조, 아버지 조비의 기업을 이어받았다.",
      question:"3대에 걸친 대업을 이어받는 방법은?",
      options:[
        { cji:"天", text:"앞선 세대의 성취를 기반으로 더 나아간다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"앞선 세대의 실수를 반복하지 않는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"자신만의 새로운 비전을 만든다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"it08", idiom:{word:"충신보국(忠臣報國)", meaning:"충신은 군주보다 나라와 백성에게 충성한다"}, title:"제갈량의 군신 신뢰", era:"221년", scene:"성도",
      story:"유비가 죽으며 유선을 제갈량에게 맡겼다. 제갈량은 유선이 무능해도 끝까지 보좌했다.",
      question:"무능한 군주를 보좌하는 충신의 자세는?",
      options:[
        { cji:"天", text:"군주의 부족함을 자신의 능력으로 보완한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"충성의 대상이 개인이 아닌 대의임을 인식한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"군주가 성장하도록 돕는다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"it09", idiom:{word:"명성이 무기다(名聲爲武器)", meaning:"훌륭한 명성은 살아서도 죽어서도 적을 제압한다"}, title:"사마의의 위장 병사", era:"234년", scene:"오장원",
      story:"제갈량이 죽은 후 사마의가 촉군을 추격했다가 목각인형에 속았다. 죽은 공명이 산 중달을 물리쳤다.",
      question:"심리전으로 적을 제압하는 방법은?",
      options:[
        { cji:"天", text:"적의 두려움을 이용해 행동을 통제한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"정확한 정보 없이 섣불리 행동하지 않는다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"신화와 명성을 전략적 자산으로 활용한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"it10", idiom:{word:"집분결합(集分結合)", meaning:"집권과 분권을 상황에 맞게 결합한다"}, title:"위나라의 중앙집권 강화", era:"235년", scene:"낙양",
      story:"사마씨 집권 이후 위나라 중앙집권이 강화됐다. 권력 집중이 효율을 높이지만 다양성을 줄인다.",
      question:"중앙집권과 분권의 균형을 맞추는 방법은?",
      options:[
        { cji:"天", text:"핵심 결정은 집중하되 실행은 분권한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:85 },
        { cji:"地", text:"상황에 따라 유연하게 조정한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"제도로 균형을 제도화한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"it11", idiom:{word:"계승의 중요성(繼承之重)", meaning:"후계자 선정이 모든 대업의 성패를 결정한다"}, title:"손권의 말년 혼란", era:"250년", scene:"강동",
      story:"태자 분쟁으로 손권의 말년이 혼란스러워졌다. 현명한 자도 후계 문제에서 실수한다.",
      question:"후계 문제를 미리 해결하는 방법은?",
      options:[
        { cji:"天", text:"일찍 명확히 정하고 교육한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"복수 후보를 두되 명확한 기준을 세운다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"신뢰할 수 있는 원로 집단의 합의를 구한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"it12", idiom:{word:"배수진(背水陣)", meaning:"물을 등지고 싸우듯 최후의 각오로 임하는 결사의 전략"}, title:"강유의 마지막 계략", era:"264년", scene:"촉한 멸망 후",
      story:"강유가 종회를 부추겨 반란을 일으키게 했다. 촉한 재건을 노렸지만 실패했다.",
      question:"마지막 순간의 도박적 전략을 평가하는 방법은?",
      options:[
        { cji:"天", text:"성공 확률보다 실패 시 결과를 먼저 계산한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:85 },
        { cji:"地", text:"도박적 전략은 최후의 수단으로만 쓴다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:82 },
        { cji:"人", text:"다른 모든 방법이 없을 때만 시도한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:80 },
      ] },
    { id:"it13", idiom:{word:"여민안락(與民安樂)", meaning:"백성과 함께 편안하고 즐거운 세상을 만든다"}, title:"진나라 무제의 치세", era:"265년", scene:"낙양 진나라",
      story:"사마염이 황제에 올라 선정을 베풀었다. 오래된 전쟁 후 백성이 원하는 것은 평화와 안정이다.",
      question:"오랜 혼란 후 평화를 정착시키는 방법은?",
      options:[
        { cji:"天", text:"백성의 생활 안정을 최우선으로 한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"이전 체제의 유능한 인재를 포용한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"새 시대의 비전을 분명히 제시한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"it14", idiom:{word:"역사는 교훈이다(歷史爲訓)", meaning:"역사를 배우지 않으면 반드시 역사를 반복한다"}, title:"삼국의 흥망 교훈", era:"280년", scene:"역사의 흐름",
      story:"삼국시대 100년. 조조·유비·손권의 천하 다툼이 결국 사마씨에게 돌아갔다. 역사는 예측할 수 없다.",
      question:"역사에서 진정한 교훈을 얻는 방법은?",
      options:[
        { cji:"天", text:"승자의 교만보다 패자의 지혜를 배운다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"역사를 반복하지 않으려면 끊임없이 배운다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"현재의 선택이 미래를 결정함을 인식한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:95 },
      ] },
    { id:"it15", idiom:{word:"영정치원(寧靜致遠)", meaning:"마음이 고요해야 멀리까지 나아갈 수 있다"}, title:"제갈량의 자녀 교육", era:"223년", scene:"성도",
      story:"제갈량이 아들에게 편지를 썼다. '非淡泊無以明志 非寧靜無以致遠(담박하지 않으면 뜻을 밝힐 수 없고 고요하지 않으면 멀리 갈 수 없다).'",
      question:"자녀와 후계자를 교육하는 핵심 원칙은?",
      options:[
        { cji:"天", text:"뜻을 세우게 한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:95 },
        { cji:"地", text:"절제와 집중력을 기른다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"실제 경험을 통해 성장하게 한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"it16", idiom:{word:"두려움이 없는 자는 위험하다(無懼者危)", meaning:"두려움을 아는 자가 진정으로 강하다"}, title:"조조의 마지막 유언", era:"220년", scene:"낙양 임종",
      story:"조조가 임종 전에 말했다. '나의 수십 년 용병은 천하 영웅들과 다투었다. 그러나 가장 두려웠던 것은 유비와 곽가의 부재였다.'",
      question:"진정한 강자가 두려워하는 것은 무엇인가?",
      options:[
        { cji:"天", text:"더 뛰어난 전략을 가진 상대", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:90 },
        { cji:"地", text:"자신을 가장 잘 아는 책사의 부재", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:92 },
        { cji:"人", text:"민심의 이반", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:88 },
      ] },
    { id:"it17", idiom:{word:"외교는 국력이다(外交卽國力)", meaning:"외교 능력이 군사력만큼 중요한 국가의 힘이다"}, title:"손권의 외교 유산", era:"252년", scene:"강동 말기",
      story:"손권이 임종 전에 남긴 것은 강동의 안정된 외교 체계였다. 한 사람의 외교가 국가를 지킨다.",
      question:"외교 유산을 남기는 방법은?",
      options:[
        { cji:"天", text:"안정적인 외교 제도를 구축한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"차세대 외교 인재를 키운다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:85 },
        { cji:"人", text:"명확한 외교 원칙을 남긴다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:90 },
      ] },
    { id:"it18", idiom:{word:"민생이 천하다(民生卽天下)", meaning:"백성의 삶이 곧 천하의 모습이다"}, title:"삼국의 백성", era:"280년", scene:"천하",
      story:"100년의 전쟁을 견딘 것은 결국 백성이었다. 영웅들의 역사 뒤에는 이름 없는 백성의 삶이 있다.",
      question:"백성을 위한 진정한 정치를 실현하는 방법은?",
      options:[
        { cji:"天", text:"백성의 일상에 관심을 갖는다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"백성의 고통을 직접 체험한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:7,intel:10,ops:11,supply:10,military:9}, wisdomScore:88 },
        { cji:"人", text:"백성이 원하는 것을 먼저 한다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:95 },
      ] },
    { id:"it19", idiom:{word:"사필귀정(事必歸正)", meaning:"모든 일은 반드시 바른 곳으로 돌아간다"}, title:"역사의 반복", era:"280년", scene:"통일 후",
      story:"삼국이 통일되었지만 곧 팔왕의 난이 시작됐다. 역사는 반복된다. 통일도 분열의 씨앗을 품는다.",
      question:"역사의 반복을 방지하는 방법은?",
      options:[
        { cji:"天", text:"과거의 실수를 기록하고 교육한다", wisdom:"자강불식으로 판단한다", effects:{personnel:11,intel:6,ops:7,supply:7,military:10}, wisdomScore:88 },
        { cji:"地", text:"제도로 반복을 막는 시스템을 만든다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"끊임없이 개혁하며 정체를 방지한다", wisdom:"교이만물으로 판단한다", effects:{personnel:10,intel:10,ops:9,supply:8,military:10}, wisdomScore:85 },
      ] },
    { id:"it20", idiom:{word:"영웅의 기준(英雄之標)", meaning:"영웅은 이름이 아닌 행동으로 판단된다"}, title:"영웅의 조건", era:"280년", scene:"역사 앞에",
      story:"삼국의 모든 영웅이 사라졌다. 영웅이란 무엇인가. 이름보다 그가 남긴 것으로 기억된다.",
      question:"진정한 영웅으로 기억되는 방법은?",
      options:[
        { cji:"天", text:"세상에 이로운 일을 한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:92 },
        { cji:"地", text:"자신보다 더 큰 것을 위해 헌신한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:90 },
        { cji:"人", text:"후세에 교훈이 될 삶을 산다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:95 },
      ] },
    { id:"it21", idiom:{word:"진선미의 실천(眞善美實踐)", meaning:"진실한 마음, 계지자선, 교이만물을 매일 실천한다"}, title:"창업과 삼국지", era:"현재", scene:"우리의 이야기",
      story:"삼국의 영웅들이 걸어간 길. 세상을 이롭게 하고, 초심을 잃지 않고, 진정성 있는 사람을 모아 천하를 통일하는 것. 그것이 오늘 우리의 사업이기도 하다.",
      question:"삼국지의 교훈을 현실에 적용하는 방법은?",
      options:[
        { cji:"天", text:"초심을 매일 기억하고 다짐한다", wisdom:"자강불식으로 판단한다", effects:{personnel:12,intel:7,ops:8,supply:8,military:11}, wisdomScore:98 },
        { cji:"地", text:"진정성 있는 동료를 찾고 함께한다", wisdom:"계지자선으로 판단한다",   effects:{personnel:8,intel:11,ops:12,supply:11,military:10}, wisdomScore:95 },
        { cji:"人", text:"세상에 이로운 목표를 향해 꾸준히 나아간다", wisdom:"교이만물으로 판단한다", effects:{personnel:11,intel:11,ops:10,supply:9,military:11}, wisdomScore:97 },
      ] },
  ],
};

// 스토리지 키
const STORAGE_KEY = "samgukji-legend-v1";

// 칭호 13단계
const LEGEND_RANKS = [
  { min:0,     max:99,    rank:"필부(匹夫)",        color:"#706050", desc:"아직 세상에 이름을 알리지 못한 자",          stars:"☆",  starSize:18, grad:null,                                        anim:"none",    glow:"none" },
  { min:100,   max:299,   rank:"향사(鄕士)",        color:"#8a7a50", desc:"고향에서 뜻을 키우는 선비",                  stars:"✦",  starSize:20, grad:null,  starColor:"#c8a030",                                      anim:"none",    glow:"none" },
  { min:300,   max:599,   rank:"지사(志士)",        color:"#a09060", desc:"뜻을 세우고 길을 나선 자",                   stars:"★",  starSize:22, grad:"linear-gradient(90deg,#a09060,#c8a040)",   starColor:"#d4a020", anim:"none",    glow:"none" },
  { min:600,   max:999,   rank:"무장(武將)",        color:"#b0a040", desc:"전장에서 이름을 떨치는 장수",                stars:"⚔️", starSize:22, grad:"linear-gradient(90deg,#b0a040,#d4c060)",   anim:"none",    glow:"none" },
  { min:1000,  max:1799,  rank:"책사(策士)",        color:"#c8a030", desc:"천하의 흐름을 읽는 책략가",                  stars:"🌟", starSize:24, grad:"linear-gradient(90deg,#c8a030,#f0d060)",   anim:"none",    glow:"0 0 8px rgba(200,160,40,0.5)" },
  { min:1800,  max:2999,  rank:"태수(太守)",        color:"#d0b040", desc:"한 고을을 다스리는 목민관",                  stars:"💫", starSize:25, grad:"linear-gradient(90deg,#c8a030,#f4d840,#c8a030)", anim:"shimmerRank 3s linear infinite", glow:"0 0 10px rgba(210,180,40,0.5)" },
  { min:3000,  max:4999,  rank:"장군(將軍)",        color:"#d8c050", desc:"삼군을 호령하는 대장군",                     stars:"⭐", starSize:26, grad:"linear-gradient(90deg,#c8a030,#ffe860,#c8a030)", anim:"shimmerRank 2.5s linear infinite", glow:"0 0 12px rgba(220,190,50,0.6)" },
  { min:5000,  max:7999,  rank:"제후(諸侯)",        color:"#e0c860", desc:"한 지역을 다스리는 제후왕",                  stars:"🔱", starSize:27, grad:"linear-gradient(90deg,#d4a820,#fff080,#d4a820)", anim:"shimmerRank 2s linear infinite",   glow:"0 0 14px rgba(230,200,60,0.65)" },
  { min:8000,  max:11999, rank:"패자(覇者)",        color:"#e8d870", desc:"천하를 호령하는 패자",                       stars:"👑", starSize:29, grad:"linear-gradient(90deg,#e8a000,#fff59d,#ff8c00,#fff59d,#e8a000)", anim:"shimmerRank 1.8s linear infinite", glow:"0 0 16px rgba(240,180,20,0.7)" },
  { min:12000, max:17999, rank:"왕(王)",            color:"#f0e080", desc:"왕의 자리에 오른 영웅",                      stars:"⚜️", starSize:31, grad:"linear-gradient(90deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c)", anim:"shimmerRank 1.5s linear infinite", glow:"0 0 20px rgba(250,220,80,0.8)" },
  { min:18000, max:25999, rank:"천하인(天下人)",   color:"#f8e890", desc:"천하에 이름을 드리운 자",                    stars:"🐉", starColor:"#d4a020", starSize:33, grad:"linear-gradient(90deg,#c0392b,#f39c12,#f1c40f,#f39c12,#c0392b)", anim:"shimmerRank 1.3s linear infinite", glow:"0 0 22px rgba(241,196,15,0.85)" },
  { min:26000, max:36499, rank:"황제(皇帝)",        color:"#fff0a0", desc:"천하를 통일한 황제",                         stars:"🦚", starColor:"#f0c000", starSize:35, grad:"linear-gradient(90deg,#ff6b6b,#ffd93d,#ffffff,#ffd93d,#ff6b6b)",  anim:"shimmerRank 1.1s linear infinite", glow:"0 0 26px rgba(255,200,50,0.9)" },
  { min:36500, max:999999,rank:"만고영웅(萬古英雄)",color:"#ffffff", desc:"만 년이 지나도 기억될 영웅 — 10년의 정진",   stars:"🐲", starSize:38, grad:"linear-gradient(90deg,#a18cd1,#fbc2eb,#ffffff,#fbc2eb,#a18cd1)",   anim:"shimmerRank 0.9s linear infinite", glow:"0 0 32px rgba(255,255,255,0.95)" },
];

// 칭호별 그라데이션 텍스트 컴포넌트
function RankBadge({points, fontSize=16}) {
  const r = getRank(points);
  if(!r.grad) return (
    <span style={{fontSize, fontWeight:700, color:r.color, letterSpacing:"0.06em"}}>{r.rank}</span>
  );
  return (
    <span style={{
      fontSize, fontWeight:700, letterSpacing:"0.06em",
      background: r.grad,
      backgroundSize:"200% auto",
      WebkitBackgroundClip:"text",
      WebkitTextFillColor:"transparent",
      backgroundClip:"text",
      animation: r.anim,
      display:"inline-block",
      textShadow:"none",
      filter: r.glow!=="none" ? `drop-shadow(${r.glow})` : "none",
    }}>{r.rank}</span>
  );
}

// 이모지 글로우 컴포넌트
function StarBadge({points, customEmojis={}}) {
  const r = getRank(points);
  const idx = LEGEND_RANKS.findIndex(lr=>lr.rank===r.rank);
  const myEmoji = customEmojis[idx] || r.stars;
  return (
    <span style={{
      fontSize: r.starSize,
      display:"inline-block",
      color: r.starColor || "inherit",
      filter: r.glow!=="none" ? `drop-shadow(${r.glow})` : "none",
      animation: r.starSize >= 28 ? "starPulse 2s ease-in-out infinite" : "none",
    }}>{myEmoji}</span>
  );
}

const POINT_RULES = {
  dailyVisit:10, gameWisdom:3, streak3:20, streak7:60, streak30:300, streak365:3650,
  idle1day:-5, idle3day:-20, idle7day:-50, idle30day:-200,
};

function getRank(p){ const v=Math.max(0,p); return LEGEND_RANKS.find(r=>v>=r.min&&v<=r.max)||LEGEND_RANKS[LEGEND_RANKS.length-1]; }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function loadLegendData(){ try{ const r=localStorage.getItem(STORAGE_KEY); if(r) return JSON.parse(r); }catch(e){} return null; }
function loadGameState(){ try{ const r=localStorage.getItem('samgukji-gamestate'); if(r) return JSON.parse(r); }catch(e){} return null; }
function saveGameState(d){ try{ localStorage.setItem('samgukji-gamestate',JSON.stringify(d)); }catch(e){} }
function saveLegendData(d){ try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(d)); }catch(e){} }
function initLegendData(){ return {points:0,totalPoints:0,streak:0,lastVisit:null,lastVisitDate:null,situationsAnswered:0,totalWisdom:0,joinedAt:Date.now(),log:[]}; }

// 군사력 지표 라벨
const MILITARY_LABELS = {
  personnel: { label:"인사(人事)", icon:"👥", color:"#4a90d9", desc:"장수·참모·병사 규모" },
  intel:     { label:"정보(情報)", icon:"🔍", color:"#9b59b6", desc:"첩보·정찰·외교 정보" },
  ops:       { label:"작전(作戰)", icon:"⚔️", color:"#e74c3c", desc:"전술·기동·공방 능력" },
  supply:    { label:"군수(軍需)", icon:"🌾", color:"#e67e22", desc:"군량·무기·보급 능력" },
  military:  { label:"군사력(軍事力)", icon:"🏯", color:"#c8a030", desc:"종합 전투 전력" },
};

// ── 창업 태그 매핑 ──────────────────────────────────────────────────────
const BIZ_TAGS = {
  "天": { label:"🧭 비전·명분",   desc:"창업의 방향과 가치관을 세우는 것" },
  "地": { label:"💰 자원·실행",   desc:"자금·공간·시스템 등 실질적 토대" },
  "人": { label:"🤝 인재·네트워크", desc:"함께할 사람과 파트너십" },
};

// 상황별 창업 비유 생성 (cji + wisdomScore 기반)
function getBizAnalogy(situation, chosen) {
  const tag = BIZ_TAGS[chosen.cji] || BIZ_TAGS["天"];
  const analogies = {
    "天": [
      "창업도 마찬가지 — 명분 없는 사업은 고객의 마음을 얻지 못한다.",
      "초심이 흔들리면 팀도 흔들린다. 사업의 방향을 매일 점검하라.",
      "비전이 있는 사장에게 사람이 모인다. 뜻을 먼저 세워라.",
      "고객에게 왜 이 사업을 하는지 설명할 수 없다면 다시 생각해야 한다.",
    ],
    "地": [
      "군량 없이 전쟁 없듯 — 현금흐름 없이 사업도 없다. 자금 관리가 먼저다.",
      "사무실, 시스템, 도구 — 실질적 기반을 먼저 갖춰야 성장할 수 있다.",
      "둔전제처럼 — 수익 구조를 스스로 만드는 사업이 오래간다.",
      "좋은 입지가 전쟁을 유리하게 하듯, 좋은 상권이 매출을 만든다.",
    ],
    "人": [
      "삼고초려처럼 — 좋은 직원 한 명을 얻기 위해 세 번 찾아가는 사장이 성공한다.",
      "진정성 있는 파트너 하나가 광고비 수천만 원보다 낫다.",
      "고객도 사람이다. 관계를 먼저 쌓으면 판매는 자연스럽게 따라온다.",
      "팀이 흔들리면 사업이 흔들린다. 사람에게 투자하는 것이 최고의 투자다.",
    ],
  };
  const list = analogies[chosen.cji] || analogies["天"];
  return list[Math.floor(Math.random() * list.length)];
}

// ══════════════════════════════════════════════════════════════════
// ── Claude API ──────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, system, messages }),
  });
  const data = await res.json();
  return data.content?.map(b=>b.text||"").join("")||"";
}

// AI로 상황 해설 가져오기
async function fetchAICommentary(situation, chosenOption, lord) {
  const sys = `당신은 삼국지 전략 시뮬레이션의 해설자다. 
군주 ${lord.name}(${lord.hanja})이 "${situation.title}" 상황에서 "${chosenOption.text}"를 선택했다.
이 선택의 역사적 맥락과 현명함을 80자 이내로 평가하라. 
wisdomScore ${chosenOption.wisdomScore}점(100점 만점) 기준으로 평가.
실제 삼국지 결과와 비교해 간결하게. 순수 텍스트만 응답.`;
  try {
    return await callClaude([{role:"user",content:"이 선택을 평가하라."}], sys);
  } catch { return ""; }
}

// ══════════════════════════════════════════════════════════════════
// ── 홈 배경 SVG ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
function HeroBackground() {
  return (
    <svg viewBox="0 0 700 420" style={{width:"100%",display:"block"}}>
      <defs>
        <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a0a"/>
          <stop offset="40%" stopColor="#5a3a10"/>
          <stop offset="100%" stopColor="#2a1800"/>
        </linearGradient>
        <linearGradient id="hGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a07020"/><stop offset="50%" stopColor="#f0d060"/><stop offset="100%" stopColor="#a07020"/>
        </linearGradient>
        <linearGradient id="hFog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0)"/><stop offset="100%" stopColor="rgba(5,2,0,0.92)"/>
        </linearGradient>
        <linearGradient id="hGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a6a20"/><stop offset="100%" stopColor="#5a8a30"/>
        </linearGradient>
        <linearGradient id="hBrown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a5a20"/><stop offset="100%" stopColor="#a07030"/>
        </linearGradient>
        <filter id="hG"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="hSG"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="hBlur"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>

      {/* 배경 - 고지도 느낌 */}
      <rect width="700" height="420" fill="url(#hSky)"/>
      <rect width="700" height="420" fill="url(#hBrown)" opacity="0.3"/>

      {/* 산맥 - 서쪽 */}
      <path d="M0,180 Q20,140 40,155 Q60,120 80,138 Q100,105 120,125 Q140,95 160,115 Q170,125 175,145 L0,250Z" fill="rgba(100,70,30,0.7)" stroke="rgba(150,110,50,0.4)" strokeWidth="1"/>
      <path d="M0,170 Q15,135 35,148 Q55,115 75,132 Q95,100 115,120 Q135,90 155,110" fill="none" stroke="rgba(180,140,70,0.5)" strokeWidth="1.5"/>

      {/* 산맥 - 북쪽 */}
      <path d="M200,0 Q240,25 260,15 Q290,35 320,20 Q350,38 380,22 Q410,40 440,18 Q470,35 500,10 L500,0Z" fill="rgba(90,65,25,0.6)"/>

      {/* 강 */}
      <path d="M180,80 Q250,100 320,110 Q390,120 450,140 Q500,158 540,180 Q580,200 620,195 Q660,190 700,200" fill="none" stroke="rgba(60,120,200,0.6)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M300,200 Q340,220 380,240 Q420,255 460,260 Q500,265 530,280" fill="none" stroke="rgba(60,120,200,0.5)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M100,150 Q130,170 160,200 Q180,225 195,260" fill="none" stroke="rgba(60,120,200,0.45)" strokeWidth="2.5" strokeLinecap="round"/>

      {/* 위(魏) 영토 - 붉은색, 북동쪽 */}
      <path d="M320,30 Q400,20 480,35 Q550,50 600,80 Q650,110 680,150 Q700,180 700,220 Q680,240 640,245 Q600,250 560,240 Q520,228 490,210 Q460,195 430,175 Q400,155 370,140 Q340,128 310,120 Q290,115 280,105 Q270,90 280,65 Q290,45 320,30Z" fill="rgba(160,50,30,0.45)" stroke="rgba(220,80,50,0.7)" strokeWidth="1.5"/>
      <text x="520" y="130" textAnchor="middle" fontSize="28" fontWeight="700" fill="rgba(240,100,70,0.95)" fontFamily="serif" filter="url(#hG)">魏</text>
      <text x="520" y="155" textAnchor="middle" fontSize="11" fill="rgba(240,150,120,0.8)" fontFamily="serif">위(魏)</text>

      {/* 촉(蜀) 영토 - 녹색, 서남쪽 */}
      <path d="M60,180 Q100,155 145,160 Q185,165 215,180 Q240,195 248,220 Q252,245 240,270 Q225,295 200,310 Q175,322 148,320 Q120,315 98,300 Q75,284 62,262 Q48,238 48,212 Q50,195 60,180Z" fill="rgba(40,110,40,0.45)" stroke="rgba(70,180,70,0.7)" strokeWidth="1.5"/>
      <text x="155" y="242" textAnchor="middle" fontSize="28" fontWeight="700" fill="rgba(80,210,80,0.95)" fontFamily="serif" filter="url(#hG)">蜀</text>
      <text x="155" y="267" textAnchor="middle" fontSize="11" fill="rgba(120,220,120,0.8)" fontFamily="serif">촉(蜀)</text>

      {/* 오(吳) 영토 - 파란색, 동남쪽 */}
      <path d="M340,230 Q390,215 440,220 Q490,228 530,248 Q565,268 578,295 Q588,320 575,345 Q558,365 530,375 Q498,382 465,378 Q430,372 400,358 Q368,342 350,318 Q330,292 330,265 Q330,248 340,230Z" fill="rgba(30,80,160,0.45)" stroke="rgba(60,130,230,0.7)" strokeWidth="1.5"/>
      <text x="455" y="300" textAnchor="middle" fontSize="28" fontWeight="700" fill="rgba(80,160,255,0.95)" fontFamily="serif" filter="url(#hG)">吳</text>
      <text x="455" y="325" textAnchor="middle" fontSize="11" fill="rgba(120,190,255,0.8)" fontFamily="serif">오(吳)</text>

      {/* 주요 도시 */}
      <circle cx="480" cy="90" r="5" fill="rgba(240,200,80,0.9)" stroke="rgba(200,160,40,0.8)" strokeWidth="1.5"/>
      <text x="480" y="80" textAnchor="middle" fontSize="9" fill="rgba(240,210,120,0.9)" fontFamily="serif">낙양</text>
      <circle cx="400" cy="105" r="4" fill="rgba(240,200,80,0.8)" stroke="rgba(200,160,40,0.7)" strokeWidth="1"/>
      <text x="400" y="96" textAnchor="middle" fontSize="9" fill="rgba(240,210,120,0.85)" fontFamily="serif">허창</text>
      <circle cx="280" cy="190" r="4" fill="rgba(240,200,80,0.8)" stroke="rgba(200,160,40,0.7)" strokeWidth="1"/>
      <text x="280" y="180" textAnchor="middle" fontSize="9" fill="rgba(240,210,120,0.85)" fontFamily="serif">형주</text>
      <circle cx="120" cy="240" r="4" fill="rgba(240,200,80,0.8)" stroke="rgba(200,160,40,0.7)" strokeWidth="1"/>
      <text x="120" y="230" textAnchor="middle" fontSize="9" fill="rgba(240,210,120,0.85)" fontFamily="serif">성도</text>
      <circle cx="560" cy="290" r="4" fill="rgba(240,200,80,0.8)" stroke="rgba(200,160,40,0.7)" strokeWidth="1"/>
      <text x="560" y="280" textAnchor="middle" fontSize="9" fill="rgba(240,210,120,0.85)" fontFamily="serif">건업</text>

      {/* 안개 */}
      <rect width="700" height="420" fill="url(#hFog)" y="200"/>

      {/* 타이틀 */}
      <text x="350" y="320" textAnchor="middle" fontSize="40" fontWeight="700" fill="url(#hGold)" fontFamily="serif" letterSpacing="10" filter="url(#hSG)">天下統一</text>
      <text x="350" y="355" textAnchor="middle" fontSize="13" fill="rgba(200,170,100,0.75)" fontFamily="serif" letterSpacing="5">삼국지 AI 무한 전략 시뮬레이션</text>
      <line x1="140" y1="370" x2="560" y2="370" stroke="rgba(200,160,40,0.35)" strokeWidth="0.8"/>
      <circle cx="350" cy="370" r="3.5" fill="rgba(200,160,40,0.7)"/>
      <circle cx="140" cy="370" r="2" fill="rgba(200,160,40,0.4)"/><circle cx="560" cy="370" r="2" fill="rgba(200,160,40,0.4)"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// ── 메인 컴포넌트 ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
export default function SamgukjiGame() {
  const _gs = (() => { try { const s = loadGameState(); return s || {}; } catch(e) { return {}; } })();
  const [phase, setPhase]         = useState(_gs.phase && _gs.phase !== "intro" ? _gs.phase : "intro");
  const [lord, setLord]           = useState(_gs.lord || null);
  const [phaseIdx, setPhaseIdx]   = useState(_gs.phaseIdx || 0);
  const [usedIds, setUsedIds]     = useState(_gs.usedIds || []);        // 사용된 상황 ID
  const [situation, setSituation] = useState(null);      // 현재 상황
  const [chosen, setChosen]       = useState(null);      // 선택한 옵션
  const [commentary, setCommentary] = useState("");      // AI 해설
  const [loadingAI, setLoadingAI] = useState(false);
  const [showResult, setShowResult] = useState(false);   // 선택 결과 표시
  const [bizAnalogy, setBizAnalogy]   = useState("");      // 창업 비유 한 줄
  // 군사력 지표
  const [milStats, setMilStats]   = useState(_gs.milStats || { personnel:50, intel:50, ops:50, supply:50, military:50 });
  const [statDeltas, setStatDeltas] = useState(null);    // 방금 변화한 델타
  // 영구 포인트
  const [legend, setLegend]       = useState(null);
  const [pointAnim, setPointAnim] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  // 게임 통계
  const [roundCount, setRoundCount] = useState(_gs.roundCount || 0);
  const [totalWisdom, setTotalWisdom] = useState(_gs.totalWisdom || 0);
  const [phaseCount, setPhaseCount] = useState({0:0,1:0,2:0,3:0}); // 단계별 상황 수
  const [customEmojis, setCustomEmojis] = useState(() => {       // 사용자 커스텀 이모지
    try { const s = localStorage.getItem('samgukji-emojis'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [editingEmoji, setEditingEmoji] = useState(null);
  const [emojiInput, setEmojiInput]   = useState("");
  const [isAdmin, setIsAdmin]         = useState(false);  // 관리자 모드
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwInput, setAdminPwInput]     = useState("");
  const [adminError, setAdminError]         = useState("");



  // ── 초기 로드
  useEffect(()=>{
    let data = loadLegendData();
    if(!data) data = initLegendData();
    const today = todayStr();
    const logs = [...(data.log||[])];
    if(data.lastVisitDate !== today){
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      const isConsec = data.lastVisitDate === yesterday;
      const newStreak = isConsec ? (data.streak||0)+1 : 1;
      const streakBonus = newStreak>=365?POINT_RULES.streak365:newStreak>=30?POINT_RULES.streak30:newStreak>=7?POINT_RULES.streak7:newStreak>=3?POINT_RULES.streak3:0;
      const idleDays = data.lastVisit ? Math.floor((Date.now()-data.lastVisit)/86400000) : 0;
      const penalty = idleDays>=30?POINT_RULES.idle30day:idleDays>=7?POINT_RULES.idle7day:idleDays>=3?POINT_RULES.idle3day:idleDays>=1?POINT_RULES.idle1day:0;
      const visitDelta = POINT_RULES.dailyVisit + streakBonus + penalty;
      if(penalty<0) logs.unshift({date:today,delta:penalty,reason:`${idleDays}일 미방문 패널티`});
      logs.unshift({date:today,delta:POINT_RULES.dailyVisit,reason:"오늘의 방문"});
      if(streakBonus>0) logs.unshift({date:today,delta:streakBonus,reason:`${newStreak}일 연속 보너스!`});
      data={...data,points:Math.max(0,data.points+visitDelta),totalPoints:data.totalPoints+Math.max(0,visitDelta),streak:newStreak,lastVisit:Date.now(),lastVisitDate:today,log:logs.slice(0,30)};
      saveLegendData(data);
      setTimeout(()=>{setPointAnim({delta:visitDelta,reason:penalty<0?`방문(${penalty}패널티)`:streakBonus>0?`방문+${newStreak}일 연속!`:"오늘의 방문"});setTimeout(()=>setPointAnim(null),3000);},1000);
    }
    setLegend(data);
  },[]);

  function addPoints(delta, reason){
    if(!legend) return;
    const logs = [{date:todayStr(),delta,reason},...(legend.log||[])].slice(0,30);
    const updated = {...legend,points:Math.max(0,legend.points+delta),totalPoints:legend.totalPoints+Math.max(0,delta),situationsAnswered:(legend.situationsAnswered||0)+1,totalWisdom:(legend.totalWisdom||0)+delta,log:logs};
    setLegend(updated);
    saveLegendData(updated);
    setPointAnim({delta,reason});
    setTimeout(()=>setPointAnim(null),3000);
  }

  // ── 게임 상태 자동 저장
  useEffect(()=>{
    if(phase === "intro") return;
    saveGameState({ phase, lord, phaseIdx, usedIds, milStats, roundCount, totalWisdom });
  },[phase, lord, phaseIdx, milStats, roundCount]);

  // ── 상황 선택: 4단계 순환, 랜덤
  function pickSituation(pIdx, used){
    const pool = SITUATION_DB[pIdx] || [];
    const available = pool.filter(s=>!used.includes(s.id));
    if(available.length===0){
      // 이 단계 소진 → 다음 단계로, 사용 ID 초기화
      const nextPhase = (pIdx+1)%4;
      const newPool = SITUATION_DB[nextPhase]||[];
      const pick = newPool[Math.floor(Math.random()*newPool.length)];
      return { situation:pick, nextPhaseIdx:nextPhase, newUsed:[pick.id] };
    }
    const pick = available[Math.floor(Math.random()*available.length)];
    return { situation:pick, nextPhaseIdx:pIdx, newUsed:[...used,pick.id] };
  }

  function startGame(selectedLord){
    setLord(selectedLord);
    const { situation:s, nextPhaseIdx, newUsed } = pickSituation(0, []);
    setSituation(s); setPhaseIdx(nextPhaseIdx); setUsedIds(newUsed);
    setMilStats({personnel:50,intel:50,ops:50,supply:50,military:50});
    setRoundCount(0); setTotalWisdom(0); setPhaseCount({0:0,1:0,2:0,3:0});
    setChosen(null); setCommentary(""); setShowResult(false);
    setPhase("game");
  }

  async function handleChoice(option){
    if(chosen) return;
    setChosen(option);
    setBizAnalogy(getBizAnalogy(situation, option));
    setLoadingAI(true);

    // 군사력 업데이트
    const newStats = {};
    Object.keys(milStats).forEach(k=>{
      newStats[k] = Math.min(100,Math.max(0, milStats[k]+(option.effects[k]||0)));
    });
    setMilStats(newStats);
    setStatDeltas(option.effects);

    // 현명함 포인트
    const wisdomPt = Math.round(option.wisdomScore * POINT_RULES.gameWisdom / 100);
    const newTotalWisdom = totalWisdom + option.wisdomScore;
    const newRound = roundCount + 1;
    setTotalWisdom(newTotalWisdom);
    setRoundCount(newRound);

    // AI 해설
    let aiText = "";
    try { aiText = await fetchAICommentary(situation, option, lord); } catch{}
    setCommentary(aiText);
    setLoadingAI(false);
    setShowResult(true);

    // 포인트 지급
    addPoints(wisdomPt, `${situation.title} — ${option.wisdomScore}점`);
    setPhaseCount(prev=>({...prev,[phaseIdx]:(prev[phaseIdx]||0)+1}));
  }

  function nextRound(){
    setBizAnalogy("");
    const { situation:s, nextPhaseIdx, newUsed } = pickSituation(phaseIdx, usedIds);
    setSituation(s); setPhaseIdx(nextPhaseIdx); setUsedIds(newUsed);
    setChosen(null); setCommentary(""); setShowResult(false); setStatDeltas(null);
  }

  function endGame(){
    setPhase("result");
  }

  const ADMIN_PW = "semyung2016";  // 관리자 비밀번호

  function tryAdminLogin() {
    if (adminPwInput === ADMIN_PW) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPwInput("");
      setAdminError("");
    } else {
      setAdminError("비밀번호가 틀렸습니다.");
      setAdminPwInput("");
    }
  }

  function saveEmoji(idx, emoji) {
    if (!emoji.trim()) return;
    const updated = { ...customEmojis, [idx]: emoji.trim() };
    setCustomEmojis(updated);
    try { localStorage.setItem('samgukji-emojis', JSON.stringify(updated)); } catch {}
    setEditingEmoji(null);
    setEmojiInput("");
  }

  function resetEmoji(idx) {
    const updated = { ...customEmojis };
    delete updated[idx];
    setCustomEmojis(updated);
    try { localStorage.setItem('samgukji-emojis', JSON.stringify(updated)); } catch {}
  }

  function getStars(r, idx) {
    return customEmojis[idx] || r.stars;
  }

  function restart(){
    setPhase("intro"); setLord(null); setPhaseIdx(0); setUsedIds([]);
    setSituation(null); setChosen(null); setCommentary(""); setShowResult(false);
    setStatDeltas(null); setRoundCount(0); setTotalWisdom(0);
    setPhaseCount({0:0,1:0,2:0,3:0});
  }

  // ── 스타일
  const G={panel:"rgba(10,7,4,0.85)",border:"rgba(139,100,30,0.3)",gold:"#c8a030",goldL:"#f0d060",text:"#e0d0b0",dim:"rgba(220,200,150,0.45)"};
  const box=(ex={})=>({background:G.panel,border:`1px solid ${G.border}`,borderRadius:6,padding:"22px 18px",marginBottom:12,backdropFilter:"blur(14px)",...ex});
  const barTrack={height:6,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"};
  const bar=(v,c)=>({height:"100%",width:`${Math.max(2,v)}%`,background:c,borderRadius:3,transition:"width 0.8s ease"});
  const btn=(bg=G.gold,fg="#0a0704")=>({background:bg,border:"none",borderRadius:4,padding:"14px 24px",color:fg,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em"});
  const phaseNames=["입지(立志)","취인(聚人)","척토(拓土)","일통(一統)"];
  const phaseEmojis=["🌅","👥","🗺️","👑"];
  const totalMil = Object.values(milStats).reduce((a,b)=>a+b,0);
  const avgWisdom = roundCount>0 ? Math.round(totalWisdom/roundCount) : 0;

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 15% 10%, #120804 0%, #080604 50%, #060810 100%)",color:G.text,fontFamily:"'Noto Serif KR',Georgia,serif",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.7}50%{opacity:1}}
        @keyframes inkF{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
        .fade{animation:fadeUp 0.45s ease both}
        @keyframes shimmerRank{0%{background-position:0% center}100%{background-position:200% center}}
        @keyframes starPulse{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.15);filter:brightness(1.3)}}
        @keyframes rankGlow{0%,100%{opacity:0.8}50%{opacity:1}}
        .pulse{animation:pulse 2s ease infinite}
        .opt:hover{background:rgba(180,140,20,0.14)!important;border-color:rgba(200,160,40,0.6)!important;transform:translateX(4px)}
        .lc:hover{transform:translateY(-3px)!important;box-shadow:0 8px 24px rgba(0,0,0,0.6)!important}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(139,100,30,0.4);border-radius:2px}
      `}</style>

      {/* 포인트 토스트 */}
      {pointAnim&&(
        <div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",zIndex:200,animation:"popIn 0.3s ease both",pointerEvents:"none"}}>
          <div style={{background:"rgba(10,7,2,0.96)",border:`1px solid ${pointAnim.delta>=0?"#c8a030":"#c03020"}`,borderRadius:20,padding:"8px 18px",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 20px rgba(0,0,0,0.6)"}}>
            <span style={{fontSize:19}}>{pointAnim.delta>=0?"⭐":"💔"}</span>
            <span style={{fontSize:17,fontWeight:700,color:pointAnim.delta>=0?"#f0d060":"#e06050"}}>{pointAnim.delta>=0?"+":""}{pointAnim.delta}pt</span>
            <span style={{fontSize:15,color:"rgba(220,200,150,0.6)"}}>{pointAnim.reason}</span>
          </div>
        </div>
      )}



      {/* 전설 패널 — 하단 슬라이드업 */}
      {showLegend&&legend&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:49,animation:"fadeUp 0.3s ease both",maxHeight:"75vh",overflowY:"auto"}}>
          <div style={{background:"rgba(8,5,2,0.97)",border:"1px solid rgba(200,160,40,0.4)",borderRadius:"14px 14px 0 0",padding:"20px 18px 28px",backdropFilter:"blur(18px)"}}>
            {/* 핸들 바 */}
            <div style={{width:40,height:4,background:"rgba(200,160,40,0.3)",borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:16,color:G.dim,letterSpacing:"0.08em"}}>{getRank(legend.points).stars} 전설 기록</div>
              <button onClick={()=>setShowLegend(false)} style={{background:"rgba(255,255,255,0.08)",border:`1px solid ${G.border}`,borderRadius:5,width:32,height:32,cursor:"pointer",color:G.text,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            {(()=>{const r=getRank(legend.points);const idx=LEGEND_RANKS.findIndex(lr=>lr.rank===r.rank);const next=LEGEND_RANKS[idx+1];const needed=next?next.min-legend.points:0;const pct=next?Math.round(((legend.points-r.min)/(next.min-r.min))*100):100;return(
              <div style={{textAlign:"center",marginBottom:16,padding:"16px",background:`${r.color}12`,border:`1px solid ${r.color}44`,borderRadius:8}}>
                <div style={{marginBottom:6,display:"flex",justifyContent:"center",gap:10,alignItems:"center"}}>
                  {(()=>{const hasGrad=r.grad;return hasGrad?(
                    <span style={{fontSize:26,fontWeight:700,letterSpacing:"0.08em",background:r.grad,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:r.anim,display:"inline-block",filter:r.glow!=="none"?`drop-shadow(${r.glow})`:"none"}}>{r.rank}</span>
                  ):(
                    <span style={{fontSize:26,fontWeight:700,color:r.color,letterSpacing:"0.08em"}}>{r.rank}</span>
                  );})()}
                </div>
                <div style={{fontSize:14,color:G.dim,marginBottom:10}}>{r.desc}</div>
                <div style={{fontSize:30,fontWeight:700,color:r.color}}>{(legend.points||0).toLocaleString()}<span style={{fontSize:16,fontWeight:400}}> pt</span></div>
                {next&&<><div style={{fontSize:13,color:"rgba(220,200,150,0.45)",margin:"8px 0 5px"}}>{next.rank}까지 {needed.toLocaleString()}pt</div><div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:r.color,borderRadius:3}}/></div></>}
              </div>
            );})()}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[["상황수",(legend.situationsAnswered||0)+"회"],["연속방문",(legend.streak||0)+"일"],["현명함",avgWisdom+"점"],["누적pt",(legend.totalPoints||0).toLocaleString()]].map(([lb,v])=>(
                <div key={lb} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${G.border}`,borderRadius:5,padding:"10px 6px",textAlign:"center"}}>
                  <div style={{fontSize:12,color:G.dim,marginBottom:4}}>{lb}</div>
                  <div style={{fontSize:16,fontWeight:700,color:G.gold}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:12}}>
              <div style={{fontSize:14,color:G.dim,marginBottom:10}}>📋 포인트 규칙</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 20px"}}>
                {[["매일 방문","+10"],["3일 연속","+20"],["7일 연속","+60"],["30일 연속","+300"],["1년 연속","+3650"],["현명한 선택","점수×3%"],["1일 미방문","-5"],["7일 미방문","-50"],["30일 미방문","-200"]].map(([r,p])=>(
                  <div key={r} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:p.startsWith("-")?"#e06060":G.dim,marginBottom:2}}>
                    <span>{r}</span><span style={{fontWeight:700}}>{p}pt</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 칭호 전체 로드맵 */}
            <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:14,color:G.dim}}>🏯 칭호 로드맵</div>
                {isAdmin ? (
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11,color:"#7ab040"}}>🔓 관리자</span>
                    <button onClick={()=>setIsAdmin(false)} style={{background:"rgba(200,80,60,0.15)",border:"1px solid rgba(200,80,60,0.3)",borderRadius:3,padding:"2px 8px",color:"#e06050",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>로그아웃</button>
                  </div>
                ) : (
                  <button onClick={()=>setShowAdminLogin(v=>!v)} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${G.border}`,borderRadius:3,padding:"3px 10px",color:G.dim,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🔒 관리자</button>
                )}
              </div>
              {/* 관리자 로그인 폼 */}
              {showAdminLogin&&!isAdmin&&(
                <div style={{background:"rgba(10,7,4,0.9)",border:`1px solid ${G.border}`,borderRadius:6,padding:"12px",marginBottom:12}}>
                  <div style={{fontSize:12,color:G.dim,marginBottom:8}}>관리자 비밀번호</div>
                  <div style={{display:"flex",gap:6}}>
                    <input
                      type="password"
                      value={adminPwInput}
                      onChange={e=>setAdminPwInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")tryAdminLogin();if(e.key==="Escape")setShowAdminLogin(false);}}
                      placeholder="비밀번호 입력"
                      style={{flex:1,background:"rgba(255,255,255,0.08)",border:`1px solid ${G.border}`,borderRadius:4,padding:"7px 10px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none"}}
                      autoFocus
                    />
                    <button onClick={tryAdminLogin} style={{...btn(),padding:"7px 14px",fontSize:13}}>확인</button>
                  </div>
                  {adminError&&<div style={{fontSize:12,color:"#e06050",marginTop:6}}>{adminError}</div>}
                </div>
              )}
              {LEGEND_RANKS.map((r,i)=>{
                const isCurrent = legend.points >= r.min && legend.points <= r.max;
                const isAchieved = legend.points > r.max;
                const myEmoji = customEmojis[i] || r.stars;
                const isEditing = editingEmoji === i;
                return (
                  <div key={r.rank}>
                    <div style={{
                      display:"flex",alignItems:"center",gap:10,
                      padding:"7px 10px",marginBottom:isEditing?0:4,borderRadius:isEditing?"6px 6px 0 0":6,
                      background: isCurrent ? `${r.color}18` : isAchieved ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                      border:`1px solid ${isCurrent ? r.color+"66" : isAchieved ? r.color+"33" : "rgba(255,255,255,0.05)"}`,
                      opacity: isAchieved ? 0.75 : 1,
                    }}>
                      {/* 이모지 — 관리자만 편집 */}
                      <button onClick={()=>{ if(!isAdmin)return; setEditingEmoji(isEditing?null:i); setEmojiInput(myEmoji); }} style={{
                        cursor: isAdmin?"pointer":"default",
                        background:"rgba(255,255,255,0.06)",border:`1px solid ${isEditing?r.color+"88":"rgba(255,255,255,0.1)"}`,
                        borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:Math.min(r.starSize,22),
                        color: r.starColor||"inherit",minWidth:36,textAlign:"center",
                        filter: isCurrent&&r.glow!=="none"?`drop-shadow(${r.glow})`:"none",
                        animation: isCurrent&&r.starSize>=28?"starPulse 2s ease-in-out infinite":"none",
                      }}>{myEmoji}</button>
                      {/* 칭호명 */}
                      {isCurrent ? (
                        r.grad ? (
                          <span style={{fontSize:14,fontWeight:700,background:r.grad,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:r.anim,flex:1}}>{r.rank}</span>
                        ) : (
                          <span style={{fontSize:14,fontWeight:700,color:r.color,flex:1}}>{r.rank}</span>
                        )
                      ) : (
                        <span style={{fontSize:13,fontWeight:isAchieved?600:400,color:isAchieved?r.color:G.dim,flex:1}}>{r.rank}</span>
                      )}
                      <span style={{fontSize:12,color:isCurrent?r.color:G.dim,whiteSpace:"nowrap"}}>
                        {isAchieved?"✓":isCurrent?`${legend.points}pt`:`${r.min.toLocaleString()}pt~`}
                      </span>
                      {isCurrent&&<span style={{fontSize:11,color:r.color,fontWeight:700,background:`${r.color}22`,padding:"1px 6px",borderRadius:3}}>현재</span>}
                    </div>
                    {/* 이모지 편집 패널 */}
                    {isEditing&&(
                      <div style={{display:"flex",gap:6,padding:"8px 10px",marginBottom:4,background:"rgba(255,255,255,0.05)",border:`1px solid ${r.color}44`,borderRadius:"0 0 6px 6px",borderTop:"none",alignItems:"center"}}>
                        <input
                          value={emojiInput}
                          onChange={e=>setEmojiInput(e.target.value)}
                          onKeyDown={e=>{ if(e.key==="Enter") saveEmoji(i,emojiInput); if(e.key==="Escape") setEditingEmoji(null); }}
                          placeholder="이모지 입력"
                          style={{flex:1,background:"rgba(255,255,255,0.08)",border:`1px solid ${G.border}`,borderRadius:4,padding:"6px 10px",color:"#fff",fontSize:18,fontFamily:"inherit",outline:"none",textAlign:"center"}}
                          autoFocus
                        />
                        <button onClick={()=>saveEmoji(i,emojiInput)} style={{...btn(r.color,"#000"),padding:"6px 14px",fontSize:13}}>저장</button>
                        {customEmojis[i]&&<button onClick={()=>resetEmoji(i)} style={{...btn("rgba(80,40,20,0.8)",G.dim),padding:"6px 10px",fontSize:12,border:`1px solid ${G.border}`}}>초기화</button>}
                        <button onClick={()=>setEditingEmoji(null)} style={{background:"transparent",border:"none",color:G.dim,fontSize:18,cursor:"pointer",padding:"0 4px"}}>✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {legend.log?.slice(0,5).map((l,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:G.dim,marginBottom:4}}>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.reason}</span>
                <span style={{color:l.delta>=0?"#c8a030":"#e06050",fontWeight:700,marginLeft:8}}>{l.delta>=0?"+":""}{l.delta}pt</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{maxWidth:720,margin:"0 auto",padding:"0 0 60px",position:"relative",zIndex:2}}>

        {/* ── INTRO ── */}
        {phase==="intro"&&(
          <div className="fade">
            <HeroBackground/>
            <div style={{padding:"0 16px"}}>
              <div style={box({textAlign:"center",padding:"20px 16px"})}>
                <div style={{fontSize:14,color:G.dim,letterSpacing:"0.2em",marginBottom:12}}>◈ 진선미(眞善美)</div>
                <svg viewBox="0 0 300 262" style={{width:"100%",maxWidth:"300px",display:"block",margin:"0 auto"}}>
                  <polygon points="150,13 252,72 252,190 150,249 48,190 48,72" fill="rgba(8,5,2,0.96)"/>
                  <polygon points="150,131 48,190 48,72 150,13" fill="rgba(74,144,217,0.28)" stroke="#4a90d9" strokeWidth="1.5"/>
                  <polygon points="150,131 150,13 252,72 252,190" fill="rgba(122,176,64,0.28)" stroke="#7ab040" strokeWidth="1.5"/>
                  <polygon points="150,131 252,190 150,249 48,190" fill="rgba(200,160,48,0.28)" stroke="#c8a030" strokeWidth="1.5"/>
                  <polygon points="150,13 252,72 252,190 150,249 48,190 48,72" fill="none" stroke="rgba(200,160,40,0.9)" strokeWidth="2.5"/>
                  <defs><filter id="tGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                   <line x1="150" y1="131" x2="252" y2="190" stroke="rgba(200,160,40,0.35)" strokeWidth="1"/>
                  <line x1="150" y1="131" x2="48"  y2="190" stroke="rgba(200,160,40,0.35)" strokeWidth="1"/>
                  <text x="86"  y="74"  textAnchor="middle" fontSize="22" dominantBaseline="middle">☯️</text>
                  <text x="86"  y="98"  textAnchor="middle" fontSize="20" fontWeight="900" fill="#6ab4ff" fontFamily="Noto Serif KR,serif">진(眞)</text>
                  <text x="86"  y="116" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6ab4ff" fontFamily="Noto Serif KR,serif">자강불식</text>
                  <text x="214" y="74"  textAnchor="middle" fontSize="22" dominantBaseline="middle">🌾</text>
                  <text x="214" y="98"  textAnchor="middle" fontSize="20" fontWeight="900" fill="#8edd50" fontFamily="Noto Serif KR,serif">선(善)</text>
                  <text x="214" y="116" textAnchor="middle" fontSize="12" fontWeight="700" fill="#8edd50" fontFamily="Noto Serif KR,serif">계지자선</text>
                  <text x="150" y="170" textAnchor="middle" fontSize="22" dominantBaseline="middle">👥</text>
                  <text x="150" y="196" textAnchor="middle" fontSize="20" fontWeight="900" fill="#f0c840" fontFamily="Noto Serif KR,serif">미(美)</text>
                  <text x="150" y="214" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f0c840" fontFamily="Noto Serif KR,serif">교이만물</text>
                  <circle cx="150" cy="131" r="6" fill="rgba(200,160,40,0.15)" stroke="rgba(200,160,40,0.8)" strokeWidth="1.5"/>
                  <circle cx="150" cy="131" r="2.5" fill="#c8a030" opacity="0.95"/>
                </svg>
                <div style={{fontSize:16,color:G.dim,lineHeight:2,marginTop:14}}>
                  漢室이 기울고 군웅이 일어서다.<br/>
                  <span style={{color:G.gold}}>세상을 이롭게</span> 할 뜻을 품고 <span style={{color:"#4a90d9"}}>초심을 잃지 않는</span> 자,<br/>
                  <span style={{color:"#7ab040"}}>진정성 있는 사람</span>을 모아 마침내 <span style={{color:G.goldL,fontWeight:700}}>천하를 통일하라!</span>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                {[["입지(立志)","🌅","뜻을 세워라"],["취인(聚人)","👥","사람을 모아라"],["척토(拓土)","🗺️","영토를 넓혀라"],["일통(一統)","👑","천하를 통일하라"]].map(([n,e,d])=>(
                  <div key={n} style={{flex:"1 1 120px",...box({padding:"10px 8px",textAlign:"center",marginBottom:0})}}>
                    <div style={{fontSize:19,marginBottom:2}}>{e}</div>
                    <div style={{fontSize:14,color:G.gold}}>{n}</div>
                    <div style={{fontSize:13,color:G.dim}}>{d}</div>
                  </div>
                ))}
              </div>
              {/* 전설 포인트 — 인트로 */}
              {legend&&(
                <button onClick={()=>setShowLegend(v=>!v)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:`${getRank(legend.points).color}12`,border:`1px solid ${getRank(legend.points).color}44`,borderRadius:6,padding:"10px 14px",cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <StarBadge points={legend.points} customEmojis={customEmojis}/>
                    <RankBadge points={legend.points} fontSize={17}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:16,color:"#f0d060",fontWeight:700}}>{(legend.points||0).toLocaleString()}pt</span>
                    <span style={{fontSize:13,color:"rgba(220,200,150,0.5)"}}>▼ 기록 보기</span>
                  </div>
                </button>
              )}
              <button style={{...btn(),width:"100%",fontSize:18,padding:"16px",letterSpacing:"0.15em"}} onClick={()=>setPhase("lord")}>⚔ 군주를 선택하라</button>
            </div>
          </div>
        )}

        {/* ── LORD SELECT ── */}
        {phase==="lord"&&(
          <div className="fade" style={{padding:"16px 16px 0"}}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:19,fontWeight:700,color:G.gold,letterSpacing:"0.1em",marginBottom:3}}>어떤 뜻을 품고 천하에 나설 것인가</div>
              <div style={{fontSize:14,color:G.dim}}>군주의 특성이 AI 해설에 반영됩니다</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,marginBottom:14}}>
              {LORDS.map(l=>(
                <div key={l.id} className="lc" style={{background:lord?.id===l.id?`${l.color}15`:"rgba(255,255,255,0.02)",border:`2px solid ${lord?.id===l.id?l.color:G.border}`,borderRadius:5,padding:"14px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",transform:lord?.id===l.id?"translateY(-3px)":"none"}} onClick={()=>setLord(l)}>
                  <div style={{fontSize:32,marginBottom:4}}>{l.emoji}</div>
                  <div style={{fontSize:17,fontWeight:700,color:l.color,marginBottom:1}}>{l.name}</div>
                  <div style={{fontSize:13,color:"rgba(200,168,75,0.5)",letterSpacing:"0.12em",marginBottom:5}}>{l.hanja} · {l.title}</div>
                  <div style={{fontSize:13,color:G.dim,fontStyle:"italic",lineHeight:1.6,marginBottom:6}}>"{l.creed}"</div>
                  {[["덕망",l.stat.virtue,"#c85030"],["지략",l.stat.strategy,"#3060a8"],["무력",l.stat.force,"#308050"]].map(([lb,v,c])=>(
                    <div key={lb} style={{marginBottom:3}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:G.dim,marginBottom:1}}><span>{lb}</span><span>{v}</span></div>
                      <div style={barTrack}><div style={bar(v,c)}/></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {lord&&(
              <div className="fade">
                <div style={box({padding:"11px 13px",marginBottom:10,borderColor:`${lord.color}55`})}>
                  <div style={{fontSize:14,color:G.dim,lineHeight:1.8}}>{lord.profile}</div>
                  <div style={{fontSize:13,color:"rgba(200,168,75,0.5)",marginTop:5}}>동료: {lord.allies} | 라이벌: {lord.rivals}</div>
                </div>
                <button style={{...btn(lord.color,"#fff"),width:"100%",fontSize:17,letterSpacing:"0.1em"}} onClick={()=>startGame(lord)}>
                  {lord.emoji} {lord.name}의 기치를 세운다 ⚔
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── GAME ── */}
        {phase==="game"&&situation&&(
          <div className="fade" style={{padding:"14px 16px 0"}}>

            {/* 상단 헤더 */}
            <div style={box({padding:"12px 14px",marginBottom:10})}>
              {/* 전설 포인트 바 — 인라인 */}
              {legend&&(
                <button onClick={()=>setShowLegend(v=>!v)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:`${getRank(legend.points).color}12`,border:`1px solid ${getRank(legend.points).color}44`,borderRadius:6,padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <StarBadge points={legend.points} customEmojis={customEmojis}/>
                    <RankBadge points={legend.points} fontSize={16}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:15,color:"#f0d060",fontWeight:700}}>{(legend.points||0).toLocaleString()}pt</span>
                    <span style={{fontSize:13,color:"rgba(220,200,150,0.5)"}}>▼ 기록 보기</span>
                  </div>
                </button>
              )}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:24}}>{lord?.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:G.gold}}>{lord?.name} · {lord?.title}</div>
                  <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap"}}>
                    {[0,1,2,3].map(i=>(
                      <span key={i} style={{fontSize:13,padding:"1px 5px",borderRadius:2,background:i===phaseIdx?"rgba(139,100,10,0.3)":"rgba(255,255,255,0.03)",color:i===phaseIdx?G.gold:G.dim,border:`1px solid ${i===phaseIdx?"rgba(200,160,40,0.4)":"transparent"}`}}>
                        {phaseEmojis[i]} {phaseNames[i]}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,color:G.dim}}>라운드</div>
                  <div style={{fontSize:22,fontWeight:700,color:G.goldL}}>{roundCount+1}</div>
                </div>
              </div>

              {/* 군사력 5개 지표 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {Object.entries(MILITARY_LABELS).map(([key,{label,icon,color}])=>(
                  <div key={key}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:G.dim,marginBottom:3}}>
                      <span>{icon} {label}</span>
                      <span style={{color,fontWeight:700}}>
                        {statDeltas&&statDeltas[key]!==0&&(
                          <span style={{color:statDeltas[key]>0?"#7ab040":"#e06050",marginRight:4,fontSize:13}}>
                            {statDeltas[key]>0?"+":""}{statDeltas[key]}
                          </span>
                        )}
                        {milStats[key]}
                      </span>
                    </div>
                    <div style={barTrack}><div style={bar(milStats[key],color)}/></div>
                  </div>
                ))}
              </div>

              {/* 현명함 평균 & 전체 군사력 */}
              <div style={{display:"flex",gap:10,marginTop:8,paddingTop:8,borderTop:`1px solid ${G.border}`}}>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:13,color:G.dim,marginBottom:1}}>⚖ 현명함 평균</div>
                  <div style={{fontSize:17,fontWeight:700,color:avgWisdom>=80?"#f0d060":avgWisdom>=60?"#c8a030":"#e06050"}}>{avgWisdom}<span style={{fontSize:13}}>점</span></div>
                </div>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:13,color:G.dim,marginBottom:1}}>🏯 종합 군사력</div>
                  <div style={{fontSize:17,fontWeight:700,color:G.gold}}>{totalMil}<span style={{fontSize:13}}>/500</span></div>
                </div>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:13,color:G.dim,marginBottom:1}}>📋 상황 수</div>
                  <div style={{fontSize:17,fontWeight:700,color:G.text}}>{roundCount}회</div>
                </div>
              </div>
            </div>

            {/* 상황 카드 */}
            {!showResult&&(
              <div className="fade" style={box({borderColor:"rgba(200,160,40,0.4)",background:"rgba(8,5,2,0.9)"})}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:19}}>{phaseEmojis[phaseIdx]}</span>
                  <div>
                    <div style={{fontSize:18,fontWeight:700,color:G.goldL,letterSpacing:"0.06em"}}>{situation.title}</div>
                    <div style={{fontSize:13,color:G.dim}}>{situation.era} · {situation.scene}</div>
                  </div>
                </div>
                <div style={{fontSize:18,lineHeight:2.1,color:"#d4c49a",marginBottom:14,letterSpacing:"0.03em"}}>{situation.story}</div>
                <div style={{fontSize:15,fontWeight:700,color:G.gold,marginBottom:10,textAlign:"center",letterSpacing:"0.1em"}}>— {situation.question} —</div>

                {[...situation.options].sort((a,b)=>{const o={天:0,地:1,人:2};return(o[a.cji]??2)-(o[b.cji]??2);}).map((opt,i)=>{
                  const cjiInfo = CHEONJIIN.find(c=>c.key===(opt.cji==="天"?"cheon":opt.cji==="地"?"ji":"in"));
                  return(
                    <button key={i} className={!chosen?"opt":""} onClick={()=>handleChoice(opt)} style={{
                      width:"100%",display:"flex",alignItems:"flex-start",gap:10,
                      background:"rgba(255,255,255,0.025)",border:`1px solid ${G.border}`,
                      borderRadius:5,padding:"13px 14px",marginBottom:8,
                      color:G.text,fontSize:17,cursor:chosen?"default":"pointer",lineHeight:1.7,
                      fontFamily:"inherit",textAlign:"left",transition:"all 0.18s",
                      opacity:chosen&&chosen!==opt?0.35:1,
                    }}>
                      <div style={{flexShrink:0,marginTop:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:cjiInfo?.color||G.gold,border:`1px solid ${cjiInfo?.color||G.gold}`,borderRadius:3,padding:"1px 5px",letterSpacing:"0.05em"}}>{opt.cji==="天"?"진(眞)":opt.cji==="地"?"선(善)":"미(美)"}</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{lineHeight:1.6,marginBottom:4}}>{opt.text}</div>
                        <div style={{fontSize:15,color:G.dim,fontStyle:"italic"}}>"{opt.wisdom}"</div>
                        {/* 창업 태그 */}
                        {BIZ_TAGS[opt.cji]&&(
                          <div style={{display:"inline-block",marginTop:5,fontSize:11,color:"rgba(200,220,160,0.7)",background:"rgba(100,160,60,0.1)",border:"1px solid rgba(100,160,60,0.25)",borderRadius:3,padding:"1px 7px"}}>
                            {BIZ_TAGS[opt.cji].label}
                          </div>
                        )}
                      </div>
                      <div style={{flexShrink:0,textAlign:"right",fontSize:13,color:G.dim}}>
                        {Object.entries(opt.effects).filter(([,v])=>v!==0).map(([k,v])=>(
                          <div key={k} style={{color:v>0?"#7ab040":"#e06050",marginBottom:1}}>
                            {MILITARY_LABELS[k]?.icon} {v>0?"+":""}{v}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}

                {loadingAI&&(
                  <div style={{textAlign:"center",padding:"10px",fontSize:15,color:G.dim}}>
                    <div style={{width:18,height:18,border:`2px solid ${G.border}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 6px"}}/>
                    AI 해설 생성 중…
                  </div>
                )}
              </div>
            )}

            {/* 결과 카드 */}
            {showResult&&chosen&&(
              <div className="fade">
                <div style={box({borderColor:`rgba(200,160,40,0.5)`,background:"rgba(8,5,2,0.92)",padding:"16px"})}>
                  <div style={{fontSize:15,color:G.dim,letterSpacing:"0.12em",marginBottom:10}}>◈ 선택 결과</div>

                  {/* 선택한 항목 */}
                  <div style={{background:"rgba(200,160,40,0.08)",border:`1px solid rgba(200,160,40,0.3)`,borderRadius:4,padding:"10px 12px",marginBottom:10}}>
                    <div style={{fontSize:18,fontWeight:700,color:G.goldL,marginBottom:5}}>{chosen.text}</div>
                    <div style={{fontSize:15,color:G.dim,fontStyle:"italic"}}>"{chosen.wisdom}"</div>
                  </div>

                  {/* 현명함 점수 */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:G.dim,marginBottom:3}}>⚖ 현명함 점수</div>
                      <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4}}>
                        <div style={{height:"100%",width:`${chosen.wisdomScore}%`,background:chosen.wisdomScore>=80?"#f0d060":chosen.wisdomScore>=60?"#c8a030":"#e06050",borderRadius:4,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                    <div style={{fontSize:26,fontWeight:700,color:chosen.wisdomScore>=80?"#f0d060":chosen.wisdomScore>=60?"#c8a030":"#e06050",minWidth:40,textAlign:"right"}}>{chosen.wisdomScore}</div>
                  </div>

                  {/* 군사력 변화 */}
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:13,color:G.dim,letterSpacing:"0.15em",marginBottom:6}}>🏯 군사력 변화</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                      {Object.entries(chosen.effects).filter(([,v])=>v!==0).map(([k,v])=>{
                        const {label,icon,color}=MILITARY_LABELS[k]||{label:k,icon:"",color:G.gold};
                        return(
                          <div key={k} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.03)",borderRadius:3,padding:"5px 8px",border:`1px solid ${v>0?"rgba(122,176,64,0.3)":"rgba(200,80,60,0.3)"}`}}>
                            <span style={{fontSize:17}}>{icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,color:G.dim}}>{label}</div>
                              <div style={{fontSize:16,fontWeight:700,color:v>0?"#7ab040":"#e06050"}}>{v>0?"+":""}{v}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI 역사 해설 */}
                  {commentary&&(
                    <div style={{background:"rgba(74,144,217,0.06)",border:"1px solid rgba(74,144,217,0.2)",borderRadius:4,padding:"10px 12px",marginBottom:10}}>
                      <div style={{fontSize:13,color:"#4a90d9",marginBottom:4}}>🤖 AI 역사 해설</div>
                      <div style={{fontSize:15,color:"#c4b890",lineHeight:1.8}}>{commentary}</div>
                    </div>
                  )}

                  {/* 창업 비유 카드 */}
                  {bizAnalogy&&chosen&&(
                    <div style={{background:"rgba(100,160,60,0.07)",border:"1px solid rgba(100,160,60,0.3)",borderRadius:6,padding:"12px 14px",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <span style={{fontSize:14}}>{BIZ_TAGS[chosen.cji]?.label||"💼"}</span>
                        <span style={{fontSize:12,color:"rgba(160,220,100,0.7)",letterSpacing:"0.1em"}}>창업·사업 적용</span>
                      </div>
                      <div style={{fontSize:15,color:"rgba(200,230,160,0.9)",lineHeight:1.85}}>
                        💡 {bizAnalogy}
                      </div>
                    </div>
                  )}

                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <button style={{...btn(),flex:1,fontSize:17}} onClick={nextRound}>다음 상황 ⚔</button>
                    <button style={{...btn("rgba(60,40,20,0.8)",G.dim),flex:1,fontSize:17,border:`1px solid ${G.border}`}} onClick={endGame}>결산 보기 📜</button>
                  </div>

                  {/* 사자성어 카드 — 맨 아래 */}
                  {situation?.idiom&&(
                    <div style={{background:"linear-gradient(135deg,rgba(139,100,10,0.14),rgba(200,160,40,0.06))",border:"1px solid rgba(200,160,40,0.45)",borderRadius:6,padding:"14px 16px"}}>
                      <div style={{fontSize:13,color:"rgba(200,160,40,0.55)",letterSpacing:"0.22em",marginBottom:8}}>◈ 이 순간의 사자성어</div>
                      <div style={{fontSize:22,fontWeight:700,color:G.goldL,fontFamily:"serif",letterSpacing:"0.08em",marginBottom:6}}>{situation.idiom.word}</div>
                      <div style={{fontSize:16,color:"#b09a70",lineHeight:1.85,fontStyle:"italic"}}>"{situation.idiom.meaning}"</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {phase==="result"&&(
          <div className="fade" style={{padding:"20px 16px"}}>
            <div style={box({textAlign:"center",borderColor:"rgba(200,160,40,0.5)",padding:"28px 20px"})}>
              <div style={{fontSize:36,marginBottom:8}}>📜</div>
              <div style={{fontSize:22,fontWeight:700,color:G.goldL,marginBottom:4,letterSpacing:"0.1em"}}>{lord?.name}의 천하 경략</div>
              <div style={{fontSize:15,color:G.dim,marginBottom:20}}>총 {roundCount}번의 결단 · 현명함 평균 {avgWisdom}점</div>

              {/* 최종 군사력 */}
              <div style={box({textAlign:"left",marginBottom:12})}>
                <div style={{fontSize:14,color:G.dim,letterSpacing:"0.15em",marginBottom:10}}>🏯 최종 군사력 현황</div>
                {Object.entries(MILITARY_LABELS).map(([k,{label,icon,color,desc}])=>(
                  <div key={k} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:3}}>
                      <span style={{color:G.dim}}>{icon} {label} <span style={{fontSize:13,color:"rgba(220,200,150,0.35)"}}>({desc})</span></span>
                      <span style={{color,fontWeight:700}}>{milStats[k]}</span>
                    </div>
                    <div style={barTrack}><div style={bar(milStats[k],color)}/></div>
                  </div>
                ))}
                <div style={{height:1,background:G.border,margin:"10px 0"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:17,fontWeight:700}}>
                  <span style={{color:G.dim}}>종합 군사력</span>
                  <span style={{color:G.goldL}}>{totalMil} <span style={{fontSize:14,fontWeight:400}}>/500</span></span>
                </div>
              </div>

              {/* 단계별 통계 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                {[0,1,2,3].map(i=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${G.border}`,borderRadius:4,padding:"8px",textAlign:"center"}}>
                    <div style={{fontSize:15,marginBottom:2}}>{phaseEmojis[i]}</div>
                    <div style={{fontSize:13,color:G.gold}}>{phaseNames[i]}</div>
                    <div style={{fontSize:19,fontWeight:700,color:G.text}}>{phaseCount[i]}회</div>
                  </div>
                ))}
              </div>

              {/* 현명함 평가 */}
              <div style={box({marginBottom:12,textAlign:"left"})}>
                <div style={{fontSize:14,color:G.dim,marginBottom:6}}>⚖ 현명함 종합 평가</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,height:10,background:"rgba(255,255,255,0.06)",borderRadius:5}}>
                    <div style={{height:"100%",width:`${avgWisdom}%`,background:avgWisdom>=80?"#f0d060":avgWisdom>=60?"#c8a030":"#e06050",borderRadius:5}}/>
                  </div>
                  <div style={{fontSize:28,fontWeight:700,color:avgWisdom>=80?"#f0d060":avgWisdom>=60?"#c8a030":"#e06050"}}>{avgWisdom}점</div>
                </div>
                <div style={{fontSize:15,color:G.dim,marginTop:6,lineHeight:1.7}}>
                  {avgWisdom>=90?"천하의 이치를 꿰뚫는 지략가. 제갈량에 버금가는 전략 감각!":avgWisdom>=80?"뛰어난 판단력. 역사의 흐름을 읽는 명장!":avgWisdom>=65?"선전했으나 아직 갈 길이 있다. 더 깊이 삼국지를 공부하라.":"결단이 아쉬웠다. 삼국지를 다시 펼쳐 더 깊이 탐구하라!"}
                </div>
              </div>

              {legend&&(
                <div style={box({marginBottom:16,textAlign:"left",borderColor:`${getRank(legend.points).color}44`})}>
                  <div style={{fontSize:14,color:G.dim,marginBottom:4}}>⭐ 전설 칭호</div>
                  <div style={{marginBottom:2}}><RankBadge points={legend.points} fontSize={20}/></div>
                  <div style={{fontSize:14,color:G.dim,marginTop:2}}>{(legend.points||0).toLocaleString()}pt · 연속 {legend.streak}일 방문</div>
                </div>
              )}

              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                <button style={{...btn(),fontSize:17}} onClick={()=>{setPhase("game");setShowResult(false);setChosen(null);setCommentary("");setStatDeltas(null);}}>⚔ 계속 도전</button>
                <button style={{...btn("rgba(40,20,10,0.9)",G.dim),fontSize:17,border:`1px solid ${G.border}`}} onClick={restart}>↺ 처음부터</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
