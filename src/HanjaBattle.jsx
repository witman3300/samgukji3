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

// 진선미 → 카테고리 매핑
// 眞(天) - 하늘은 진실무망하고 자강불식하다
// 善(地) - 땅은 후덕재물하고 계지자선한다
// 美(人) - 사람은 성지자성하고 교이만물한다
const JSM_CATS = {
  jin:  [0,13,12,15,14,5],  // 眞(天): 數字·時節·方位·動態·干支·天體
  seon: [6,8,10,7,3,4],     // 善(地): 地理·住居·宮室·衣食·動物·植物
  mi:   [1,2,16,9,11,17],   // 美(人): 人體·呼稱·狀況·道具·兵器·其他
};

// 전투 정적 상황 (AI 키 없을 때 사용)
const BATTLE_SITS = [
  "조조의 대군이 관도에 집결했다. 원소의 70만 대군과 맞닥뜨린 상황!",
  "적벽에 불길이 치솟는다. 조조의 수군이 화공에 휘청이고 있다!",
  "형주 성문이 열렸다. 여몽의 오군이 야밤에 기습해 온다!",
  "가정에서 마속이 산 위에 진을 쳤다. 장합의 군이 물길을 끊었다!",
  "합비 성벽 앞에 10만 오군이 집결했다. 장료가 선제 기습을 결정한다!",
  "원소가 기주에서 남하했다. 조조의 7만 군으로 70만에 맞선다!",
  "동탁이 낙양을 장악했다. 천자를 등에 업고 천하에 호령한다!",
  "유비가 세 번째로 융중을 찾았다. 제갈량이 마침내 초당 문을 열었다!",
  "사마의가 오장원 맞은편에 진영을 쳤다. 싸우지 않고 지구전을 편다!",
  "적장이 전열을 정비하고 있다. 하늘이 붉게 물들었다!",
];

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

// 아군 장수 10인 (상담 + 전투)
const GENERALS = [
  { id:"jl", name:"제갈량", hanja:"諸葛亮", emoji:"🦅", color:"#4a90d9",
    intro:"주군, 한자 전투로 적을 제압하겠나이다!",
    correct:"훌륭하십니다! 역시 주군이십니다! 와신상담의 정신으로!",
    wrong:"주군... 솔직히 좀 창피하지 않으십니까? 다시 하시옵소서.",
    advisorStyle:"제갈량: 차분하고 지혜롭게, 삼국지 고사성어와 전략 인용. 이후 맥락에 맞는 한자 1글자 제시." },
  { id:"jb", name:"장비", hanja:"張飛", emoji:"🐯", color:"#cc4040",
    intro:"야! 나 장비다! 덤벼라 이 놈들아!",
    correct:"그렇지! 바로 이거다! 이따위 놈들은 이렇게 이겨버려!",
    wrong:"이 멍청한 놈아! 전쟁도 모르냐! 다시 해봐!",
    advisorStyle:"장비: 거칠고 직설적이지만 의리 있게. 약한 욕설·구어체 허용. 용기 관련 한자 제시." },
  { id:"gu", name:"관우", hanja:"關羽", emoji:"🌙", color:"#9b2020",
    intro:"관우다. 의리로써 싸우자.",
    correct:"훌륭하다! 그것이 바로 충의의 힘이다!",
    wrong:"으음... 의리를 앞세웠지만 학식이 부족하군.",
    advisorStyle:"관우: 충의롭고 의연하게. 의리와 충성 강조. 의리 관련 한자 제시." },
  { id:"yb", name:"유비", hanja:"劉備", emoji:"🦁", color:"#b5341a",
    intro:"유비다. 함께 천하를 위해 싸우자!",
    correct:"아, 훌륭해! 역시 내 편이 되어줄 인재로군!",
    wrong:"음... 어렵지? 괜찮아. 실패해도 일어나면 된다.",
    advisorStyle:"유비: 따뜻하고 인자하게. 인덕 강조. 인의 관련 한자 제시." },
  { id:"ma", name:"마초", hanja:"馬超", emoji:"🐎", color:"#7a2080",
    intro:"마초다! 서량 철기로 쓸어버린다!",
    correct:"좋아! 역시 실력이 있어! 서량 철기처럼 돌진해!",
    wrong:"흠... 아직 멀었군. 나 같은 맹장은 이런 실수 안 해.",
    advisorStyle:"마초: 호방하고 거침없이. 담력과 용맹 강조. 전투 관련 한자 제시." },
  { id:"zl", name:"조자룡", hanja:"趙子龍", emoji:"🐲", color:"#1a7a50",
    intro:"나는 조자룡! 백만 대군 속에서도 살아 돌아온다!",
    correct:"훌륭하오! 이것이 바로 백만 대군을 뚫는 힘이오!",
    wrong:"흠... 전장에서 이런 실수는 목숨을 잃소. 다시 하시오.",
    advisorStyle:"조자룡: 충성스럽고 용맹하게. 충의와 담력 강조. 용기 관련 한자 제시." },
  { id:"hc", name:"황충", hanja:"黃忠", emoji:"🏹", color:"#c87820",
    intro:"황충이다! 노익장을 보여주마!",
    correct:"허허! 잘했구나! 노익장이 무엇인지 보여주마!",
    wrong:"이봐! 늙은이도 이건 아는데... 다시 해보게.",
    advisorStyle:"황충: 노련하고 결단력 있게. 경험과 용기 강조. 전략 관련 한자 제시." },
  { id:"wy", name:"위연", hanja:"魏延", emoji:"🗡️", color:"#6a20a0",
    intro:"위연이다! 나를 막을 자가 누구냐!",
    correct:"잘했다! 역시! 나 위연의 부하답다!",
    wrong:"허! 이런 것도 못 맞춰? 제대로 다시 해라!",
    advisorStyle:"위연: 자신만만하고 공격적으로. 용맹과 전략 강조. 전투 관련 한자 제시." },
  { id:"gy", name:"강유", hanja:"姜維", emoji:"🌠", color:"#1a60c0",
    intro:"강유다! 승상의 뜻을 이어받았다!",
    correct:"훌륭합니다! 승상께서도 흐뭇해하실 것입니다!",
    wrong:"아... 승상께서 보셨다면 안타까워하셨을 것입니다.",
    advisorStyle:"강유: 지략적이고 충성스럽게. 승상의 유지 계승 강조. 전략 관련 한자 제시." },
  { id:"wp", name:"왕평", hanja:"王平", emoji:"🛡️", color:"#5a4020",
    intro:"왕평이다! 신중하게 나아가겠다!",
    correct:"잘했네. 신중하게 생각했기에 맞출 수 있었던 것이야.",
    wrong:"서두르면 안 된다네. 신중하게 다시 생각해보게.",
    advisorStyle:"왕평: 신중하고 차분하게. 방어와 신중함 강조. 전략 관련 한자 제시." },
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

// 카테고리별 2글자 이상 단어 DB — 생활한자 20개 × 18류 = 360단어
const WORD_DB = [
  // 0 數字類
  [{h:"一等",r:"일등",m:"1등"},{h:"二等",r:"이등",m:"2등"},{h:"三角",r:"삼각",m:"삼각형"},{h:"四角",r:"사각",m:"사각형"},{h:"百分",r:"백분",m:"백분율"},{h:"千萬",r:"천만",m:"천만"},{h:"數字",r:"수자",m:"숫자"},{h:"計算",r:"계산",m:"계산"},{h:"加算",r:"가산",m:"더하기"},{h:"減算",r:"감산",m:"빼기"},{h:"合計",r:"합계",m:"합계"},{h:"平均",r:"평균",m:"평균"},{h:"比率",r:"비율",m:"비율"},{h:"倍數",r:"배수",m:"배수"},{h:"半分",r:"반분",m:"절반"},{h:"全部",r:"전부",m:"전부"},{h:"部分",r:"부분",m:"부분"},{h:"整數",r:"정수",m:"정수"},{h:"分數",r:"분수",m:"분수"},{h:"百萬",r:"백만",m:"백만"}],
  // 1 人體類
  [{h:"頭部",r:"두부",m:"머리"},{h:"面目",r:"면목",m:"면목"},{h:"眼耳",r:"안이",m:"눈과 귀"},{h:"鼻口",r:"비구",m:"코와 입"},{h:"手足",r:"수족",m:"손발"},{h:"身體",r:"신체",m:"몸"},{h:"心臟",r:"심장",m:"심장"},{h:"筋骨",r:"근골",m:"근골"},{h:"血液",r:"혈액",m:"혈액"},{h:"肩背",r:"견배",m:"어깨와 등"},{h:"腰部",r:"요부",m:"허리"},{h:"膝蓋",r:"슬개",m:"무릎"},{h:"手指",r:"수지",m:"손가락"},{h:"頸部",r:"경부",m:"목"},{h:"胸部",r:"흉부",m:"가슴"},{h:"腹部",r:"복부",m:"배"},{h:"背部",r:"배부",m:"등"},{h:"臂膀",r:"비방",m:"팔"},{h:"腿部",r:"퇴부",m:"다리"},{h:"頭腦",r:"두뇌",m:"두뇌"}],
  // 2 呼稱類
  [{h:"將軍",r:"장군",m:"장군"},{h:"大人",r:"대인",m:"대인"},{h:"主君",r:"주군",m:"주군"},{h:"先生",r:"선생",m:"선생"},{h:"夫人",r:"부인",m:"부인"},{h:"公子",r:"공자",m:"공자"},{h:"大王",r:"대왕",m:"대왕"},{h:"丞相",r:"승상",m:"승상"},{h:"太守",r:"태수",m:"태수"},{h:"都督",r:"도독",m:"도독"},{h:"軍師",r:"군사",m:"군사"},{h:"參謀",r:"참모",m:"참모"},{h:"武將",r:"무장",m:"무장"},{h:"文臣",r:"문신",m:"문신"},{h:"部下",r:"부하",m:"부하"},{h:"同僚",r:"동료",m:"동료"},{h:"兄弟",r:"형제",m:"형제"},{h:"父母",r:"부모",m:"부모"},{h:"子女",r:"자녀",m:"자녀"},{h:"朋友",r:"붕우",m:"친구"}],
  // 3 動物類
  [{h:"白馬",r:"백마",m:"흰 말"},{h:"黑牛",r:"흑우",m:"검은 소"},{h:"飛鳥",r:"비조",m:"나는 새"},{h:"游魚",r:"유어",m:"노니는 물고기"},{h:"家畜",r:"가축",m:"가축"},{h:"野獸",r:"야수",m:"야수"},{h:"虎豹",r:"호표",m:"호랑이와 표범"},{h:"狐狸",r:"호리",m:"여우"},{h:"兎鹿",r:"토록",m:"토끼와 사슴"},{h:"雕鷹",r:"조응",m:"독수리와 매"},{h:"蛟龍",r:"교룡",m:"교룡"},{h:"猿猴",r:"원후",m:"원숭이"},{h:"獅子",r:"사자",m:"사자"},{h:"牛馬",r:"우마",m:"소와 말"},{h:"羊豚",r:"양돈",m:"양과 돼지"},{h:"雞犬",r:"계견",m:"닭과 개"},{h:"貓鼠",r:"묘서",m:"고양이와 쥐"},{h:"魚蝦",r:"어하",m:"물고기와 새우"},{h:"蛇龜",r:"사구",m:"뱀과 거북"},{h:"鴨鵝",r:"압아",m:"오리와 거위"}],
  // 4 植物類
  [{h:"松竹",r:"송죽",m:"소나무와 대나무"},{h:"梅花",r:"매화",m:"매화"},{h:"菊花",r:"국화",m:"국화"},{h:"牡丹",r:"모란",m:"모란"},{h:"蓮花",r:"연화",m:"연꽃"},{h:"桃花",r:"도화",m:"복숭아꽃"},{h:"竹林",r:"죽림",m:"대나무숲"},{h:"松林",r:"송림",m:"소나무숲"},{h:"草木",r:"초목",m:"풀과 나무"},{h:"藥草",r:"약초",m:"약초"},{h:"百合",r:"백합",m:"백합"},{h:"桂花",r:"계화",m:"계수나무꽃"},{h:"芙蓉",r:"부용",m:"부용화"},{h:"薔薇",r:"장미",m:"장미"},{h:"杏花",r:"행화",m:"살구꽃"},{h:"李花",r:"이화",m:"자두꽃"},{h:"柳樹",r:"유수",m:"버드나무"},{h:"銀杏",r:"은행",m:"은행나무"},{h:"楓葉",r:"풍엽",m:"단풍잎"},{h:"綠草",r:"녹초",m:"푸른 풀"}],
  // 5 天體類
  [{h:"太陽",r:"태양",m:"태양"},{h:"月光",r:"월광",m:"달빛"},{h:"星星",r:"성성",m:"별"},{h:"北斗",r:"북두",m:"북두칠성"},{h:"銀河",r:"은하",m:"은하수"},{h:"流星",r:"유성",m:"유성"},{h:"日月",r:"일월",m:"해와 달"},{h:"天空",r:"천공",m:"하늘"},{h:"日食",r:"일식",m:"일식"},{h:"月食",r:"월식",m:"월식"},{h:"明星",r:"명성",m:"밝은 별"},{h:"夕陽",r:"석양",m:"석양"},{h:"黎明",r:"여명",m:"새벽"},{h:"朝陽",r:"조양",m:"아침 해"},{h:"月夜",r:"월야",m:"달밤"},{h:"星夜",r:"성야",m:"별밤"},{h:"天氣",r:"천기",m:"날씨"},{h:"大氣",r:"대기",m:"대기"},{h:"晴天",r:"청천",m:"맑은 하늘"},{h:"雨天",r:"우천",m:"비 오는 날"}],
  // 6 地理類
  [{h:"山川",r:"산천",m:"산과 내"},{h:"平野",r:"평야",m:"평야"},{h:"江湖",r:"강호",m:"강과 호수"},{h:"海洋",r:"해양",m:"해양"},{h:"島嶼",r:"도서",m:"섬"},{h:"半島",r:"반도",m:"반도"},{h:"大陸",r:"대륙",m:"대륙"},{h:"高原",r:"고원",m:"고원"},{h:"草原",r:"초원",m:"초원"},{h:"沙漠",r:"사막",m:"사막"},{h:"瀑布",r:"폭포",m:"폭포"},{h:"溪谷",r:"계곡",m:"계곡"},{h:"丘陵",r:"구릉",m:"언덕"},{h:"湖水",r:"호수",m:"호수"},{h:"河川",r:"하천",m:"강"},{h:"海岸",r:"해안",m:"해안"},{h:"山脈",r:"산맥",m:"산맥"},{h:"盆地",r:"분지",m:"분지"},{h:"平原",r:"평원",m:"평원"},{h:"海灣",r:"해만",m:"만"}],
  // 7 衣食類
  [{h:"衣服",r:"의복",m:"옷"},{h:"飮食",r:"음식",m:"음식"},{h:"糧食",r:"양식",m:"양식"},{h:"料理",r:"요리",m:"요리"},{h:"食事",r:"식사",m:"식사"},{h:"服裝",r:"복장",m:"복장"},{h:"飯菜",r:"반찬",m:"반찬"},{h:"酒食",r:"주식",m:"술과 음식"},{h:"穀物",r:"곡물",m:"곡물"},{h:"蔬菜",r:"소채",m:"채소"},{h:"果實",r:"과실",m:"과일"},{h:"肉類",r:"육류",m:"고기"},{h:"魚類",r:"어류",m:"생선"},{h:"茶酒",r:"다주",m:"차와 술"},{h:"醬油",r:"장유",m:"간장"},{h:"米飯",r:"미반",m:"쌀밥"},{h:"麵類",r:"면류",m:"국수"},{h:"湯類",r:"탕류",m:"국"},{h:"乾糧",r:"건량",m:"건식량"},{h:"軍糧",r:"군량",m:"군 식량"}],
  // 8 住居類
  [{h:"家屋",r:"가옥",m:"집"},{h:"住宅",r:"주택",m:"주택"},{h:"門戶",r:"문호",m:"문호"},{h:"庭園",r:"정원",m:"정원"},{h:"廚房",r:"주방",m:"부엌"},{h:"寢室",r:"침실",m:"침실"},{h:"書齋",r:"서재",m:"서재"},{h:"倉庫",r:"창고",m:"창고"},{h:"浴室",r:"욕실",m:"욕실"},{h:"居室",r:"거실",m:"거실"},{h:"客室",r:"객실",m:"객실"},{h:"玄關",r:"현관",m:"현관"},{h:"廊下",r:"낭하",m:"복도"},{h:"牆壁",r:"장벽",m:"담벽"},{h:"窓門",r:"창문",m:"창문"},{h:"階段",r:"계단",m:"계단"},{h:"地下",r:"지하",m:"지하"},{h:"屋上",r:"옥상",m:"옥상"},{h:"門前",r:"문전",m:"문 앞"},{h:"宮室",r:"궁실",m:"궁궐"}],
  // 9 道具類
  [{h:"筆墨",r:"필묵",m:"붓과 먹"},{h:"紙硯",r:"지연",m:"종이와 벼루"},{h:"燈火",r:"등화",m:"등불"},{h:"棋盤",r:"기반",m:"바둑판"},{h:"琴瑟",r:"금슬",m:"현악기"},{h:"旗幟",r:"기치",m:"깃발"},{h:"印章",r:"인장",m:"도장"},{h:"地圖",r:"지도",m:"지도"},{h:"羅盤",r:"나반",m:"나침반"},{h:"藥箱",r:"약상",m:"약상자"},{h:"工具",r:"공구",m:"공구"},{h:"器械",r:"기계",m:"기계"},{h:"算盤",r:"산반",m:"주판"},{h:"書冊",r:"서책",m:"책"},{h:"弓箭",r:"궁전",m:"활과 화살"},{h:"旗鼓",r:"기고",m:"깃발과 북"},{h:"筆硯",r:"필연",m:"붓과 벼루"},{h:"銅鏡",r:"동경",m:"구리 거울"},{h:"戰鼓",r:"전고",m:"전투 북"},{h:"車船",r:"거선",m:"수레와 배"}],
  // 10 宮室類
  [{h:"宮殿",r:"궁전",m:"궁전"},{h:"城郭",r:"성곽",m:"성곽"},{h:"樓閣",r:"누각",m:"누각"},{h:"亭子",r:"정자",m:"정자"},{h:"廟堂",r:"묘당",m:"묘당"},{h:"正殿",r:"정전",m:"정전"},{h:"內殿",r:"내전",m:"내전"},{h:"東宮",r:"동궁",m:"동궁"},{h:"城門",r:"성문",m:"성문"},{h:"城壁",r:"성벽",m:"성벽"},{h:"城樓",r:"성루",m:"성루"},{h:"望樓",r:"망루",m:"망루"},{h:"行宮",r:"행궁",m:"행궁"},{h:"離宮",r:"이궁",m:"별궁"},{h:"宗廟",r:"종묘",m:"종묘"},{h:"社稷",r:"사직",m:"사직"},{h:"廣場",r:"광장",m:"광장"},{h:"殿閣",r:"전각",m:"전각"},{h:"別宮",r:"별궁",m:"별궁"},{h:"御所",r:"어소",m:"임금의 처소"}],
  // 11 兵器類
  [{h:"長劍",r:"장검",m:"장검"},{h:"弓矢",r:"궁시",m:"활과 화살"},{h:"盾牌",r:"순패",m:"방패"},{h:"鐵甲",r:"철갑",m:"철갑"},{h:"長槍",r:"장창",m:"장창"},{h:"大刀",r:"대도",m:"큰 칼"},{h:"戰斧",r:"전부",m:"전투 도끼"},{h:"投石",r:"투석",m:"돌 던지기"},{h:"連弩",r:"연노",m:"연속 쇠뇌"},{h:"毒箭",r:"독전",m:"독화살"},{h:"戰車",r:"전차",m:"전차"},{h:"雲梯",r:"운제",m:"공성 사다리"},{h:"鐵錘",r:"철추",m:"쇠망치"},{h:"短刀",r:"단도",m:"단도"},{h:"匕首",r:"비수",m:"비수"},{h:"鐵棒",r:"철봉",m:"쇠몽둥이"},{h:"飛刀",r:"비도",m:"날리는 칼"},{h:"火炮",r:"화포",m:"화포"},{h:"戈矛",r:"과모",m:"창"},{h:"兵甲",r:"병갑",m:"갑옷"}],
  // 12 方位類
  [{h:"東西",r:"동서",m:"동서"},{h:"南北",r:"남북",m:"남북"},{h:"左右",r:"좌우",m:"좌우"},{h:"前後",r:"전후",m:"앞뒤"},{h:"上下",r:"상하",m:"위아래"},{h:"中央",r:"중앙",m:"중앙"},{h:"方向",r:"방향",m:"방향"},{h:"位置",r:"위치",m:"위치"},{h:"東南",r:"동남",m:"동남"},{h:"西北",r:"서북",m:"서북"},{h:"正面",r:"정면",m:"정면"},{h:"側面",r:"측면",m:"측면"},{h:"內外",r:"내외",m:"안팎"},{h:"遠近",r:"원근",m:"원근"},{h:"高低",r:"고저",m:"높낮이"},{h:"深淺",r:"심천",m:"깊고 얕음"},{h:"前方",r:"전방",m:"앞쪽"},{h:"後方",r:"후방",m:"뒤쪽"},{h:"左側",r:"좌측",m:"왼쪽"},{h:"右側",r:"우측",m:"오른쪽"}],
  // 13 時節類
  [{h:"春天",r:"춘천",m:"봄"},{h:"夏天",r:"하천",m:"여름"},{h:"秋天",r:"추천",m:"가을"},{h:"冬天",r:"동천",m:"겨울"},{h:"四季",r:"사계",m:"사계절"},{h:"節氣",r:"절기",m:"절기"},{h:"歲月",r:"세월",m:"세월"},{h:"新年",r:"신년",m:"새해"},{h:"秋夕",r:"추석",m:"추석"},{h:"冬至",r:"동지",m:"동지"},{h:"立春",r:"입춘",m:"입춘"},{h:"白露",r:"백로",m:"백로"},{h:"霜降",r:"상강",m:"상강"},{h:"寒食",r:"한식",m:"한식"},{h:"年末",r:"연말",m:"연말"},{h:"月初",r:"월초",m:"월초"},{h:"週末",r:"주말",m:"주말"},{h:"平日",r:"평일",m:"평일"},{h:"春秋",r:"춘추",m:"봄과 가을"},{h:"冬夏",r:"동하",m:"겨울과 여름"}],
  // 14 干支類
  [{h:"甲子",r:"갑자",m:"갑자년"},{h:"乙丑",r:"을축",m:"을축년"},{h:"丙寅",r:"병인",m:"병인년"},{h:"丁卯",r:"정묘",m:"정묘년"},{h:"戊辰",r:"무진",m:"무진년"},{h:"己巳",r:"기사",m:"기사년"},{h:"庚午",r:"경오",m:"경오년"},{h:"辛未",r:"신미",m:"신미년"},{h:"壬申",r:"임신",m:"임신년"},{h:"癸酉",r:"계유",m:"계유년"},{h:"甲戌",r:"갑술",m:"갑술년"},{h:"乙亥",r:"을해",m:"을해년"},{h:"子年",r:"자년",m:"쥐띠 해"},{h:"丑年",r:"축년",m:"소띠 해"},{h:"寅年",r:"인년",m:"호랑이띠 해"},{h:"卯年",r:"묘년",m:"토끼띠 해"},{h:"辰年",r:"진년",m:"용띠 해"},{h:"巳年",r:"사년",m:"뱀띠 해"},{h:"午年",r:"오년",m:"말띠 해"},{h:"未年",r:"미년",m:"양띠 해"}],
  // 15 動態類
  [{h:"出發",r:"출발",m:"출발"},{h:"到着",r:"도착",m:"도착"},{h:"前進",r:"전진",m:"전진"},{h:"後退",r:"후퇴",m:"후퇴"},{h:"上昇",r:"상승",m:"상승"},{h:"下降",r:"하강",m:"하강"},{h:"移動",r:"이동",m:"이동"},{h:"停止",r:"정지",m:"정지"},{h:"出入",r:"출입",m:"출입"},{h:"往來",r:"왕래",m:"왕래"},{h:"進行",r:"진행",m:"진행"},{h:"歸還",r:"귀환",m:"귀환"},{h:"上陸",r:"상륙",m:"상륙"},{h:"乘車",r:"승차",m:"승차"},{h:"登山",r:"등산",m:"등산"},{h:"出門",r:"출문",m:"문 나섬"},{h:"入門",r:"입문",m:"입문"},{h:"進退",r:"진퇴",m:"진퇴"},{h:"攻守",r:"공수",m:"공격과 수비"},{h:"行進",r:"행진",m:"행진"}],
  // 16 狀況類
  [{h:"危機",r:"위기",m:"위기"},{h:"緊急",r:"긴급",m:"긴급"},{h:"平和",r:"평화",m:"평화"},{h:"勝利",r:"승리",m:"승리"},{h:"敗北",r:"패배",m:"패배"},{h:"包圍",r:"포위",m:"포위"},{h:"突破",r:"돌파",m:"돌파"},{h:"逆轉",r:"역전",m:"역전"},{h:"決戰",r:"결전",m:"결전"},{h:"停戰",r:"정전",m:"정전"},{h:"講和",r:"강화",m:"강화"},{h:"降伏",r:"항복",m:"항복"},{h:"撤退",r:"철퇴",m:"철수"},{h:"進擊",r:"진격",m:"진격"},{h:"好機",r:"호기",m:"좋은 기회"},{h:"轉機",r:"전기",m:"전환점"},{h:"窮地",r:"궁지",m:"궁지"},{h:"膠着",r:"교착",m:"교착"},{h:"混亂",r:"혼란",m:"혼란"},{h:"勝敗",r:"승패",m:"승패"}],
  // 17 其他類
  [{h:"天下",r:"천하",m:"천하"},{h:"英雄",r:"영웅",m:"영웅"},{h:"忠義",r:"충의",m:"충의"},{h:"仁德",r:"인덕",m:"인덕"},{h:"勇猛",r:"용맹",m:"용맹"},{h:"威嚴",r:"위엄",m:"위엄"},{h:"名譽",r:"명예",m:"명예"},{h:"功績",r:"공적",m:"공적"},{h:"運命",r:"운명",m:"운명"},{h:"吉凶",r:"길흉",m:"길흉"},{h:"禍福",r:"화복",m:"화복"},{h:"榮辱",r:"영욕",m:"영욕"},{h:"興亡",r:"흥망",m:"흥망"},{h:"强弱",r:"강약",m:"강약"},{h:"平安",r:"평안",m:"평안"},{h:"幸福",r:"행복",m:"행복"},{h:"自由",r:"자유",m:"자유"},{h:"希望",r:"희망",m:"희망"},{h:"夢想",r:"몽상",m:"꿈"},{h:"仁義",r:"인의",m:"인의"}],
];

async function genProblem(catId, difficulty, key, usedList=[], battleCtx='', masteredMap={}){
  const cat = CATS[catId];
  const diff = difficulty<30?"초급":difficulty<60?"중급":"고급";
  const exclude = usedList.length>0 ? `이미출제(제외): ${usedList.slice(-10).join('·')}. ` : '';
  const ctxHint = battleCtx ? `현재상황: ${battleCtx.slice(0,40)}. 상황연관단어우선. ` : '';
  const sys = `삼국지 한자 게임 문제 출제자. ${cat.name}(${cat.kor}) ${diff} 문제를 JSON으로 출제.
반드시 2글자 이상 한자 단어. 단일 글자 금지. ${exclude}${ctxHint}
{"hanja":"2글자이상한자단어","reading":"음독","meaning":"뜻(8자이내)","context":"삼국지예시(25자이내)","wrong1":"2글자이상뜻1","wrong2":"2글자이상뜻2","wrong3":"2글자이상뜻3"}
오답도 2글자이상 의미. 순수 JSON만 응답.`;
  try{
    const raw = await callClaude([{role:"user",content:`${cat.name} ${diff} 2글자이상 단어 출제`}],sys,key);
    const j = JSON.parse(raw.replace(/```json\n?|\n?```/g,'').trim());
    if(!j.hanja||j.hanja.length<2) throw new Error('단글자');
    return { hanja:j.hanja, reading:j.reading, meaning:j.meaning, context:j.context,
      options:shuffle([j.meaning,j.wrong1,j.wrong2,j.wrong3]), correct:j.meaning, catId, fromAI:true };
  }catch{ return genStatic(catId, new Set(usedList), masteredMap, battleCtx); }
}

function genStatic(catId, usedSet=new Set(), masteredMap={}, battleCtx=''){
  const words = WORD_DB[catId];
  if(words && words.length>0){
    const allWords = WORD_DB.flatMap(ws=>ws);
    // 최근 출제 단어의 한자 글자들 (연속 겹침 방지)
    const recentChars = new Set([...usedSet].flatMap(h=>[...h]));
    // 전투 상황 키워드
    const ctxChars = battleCtx ? [...battleCtx].filter(c=>/[一-鿿]/.test(c)) : [];
    // 마스터(3연속 정답) 제외
    const notMastered = words.filter(w=>(masteredMap[w.h]||0)<3);
    const basePool = notMastered.length>0 ? notMastered : words;
    // 이번 세션 미출제 우선
    const notUsed = basePool.filter(w=>!usedSet.has(w.h));
    const sessionPool = notUsed.length>0 ? notUsed : basePool;
    // 1순위: 상황 연관 + 글자 겹침 없음
    const priority = sessionPool.filter(w=>
      ![...w.h].some(c=>recentChars.has(c)) && ctxChars.some(c=>w.h.includes(c))
    );
    // 2순위: 글자 겹침 없음
    const noOverlap = sessionPool.filter(w=>![...w.h].some(c=>recentChars.has(c)));
    const pool = priority.length>0 ? priority : noOverlap.length>0 ? noOverlap : sessionPool;
    const correct = pool[Math.floor(Math.random()*pool.length)];
    const wrongs = shuffle(allWords.filter(w=>w.m!==correct.m)).slice(0,3);
    return { hanja:correct.h, reading:correct.r, meaning:correct.m,
      context:`${correct.h}(${correct.r}) — ${CATS[catId].kor}`,
      options:shuffle([correct.m,...wrongs.map(w=>w.m)]), correct:correct.m, catId, fromAI:false };
  }
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

async function genBattleContext(enemyName, enemyHanja, generalName, generalHanja, rankName, correctN, strippedN, key){
  const sys = `삼국지 전투 상황·대사 생성자. 삼국지 역사 기반으로 매번 완전히 다른 전투 상황과 장수 대사를 JSON으로 생성.
{"situation":"전투상황(50자이내,삼국지역사기반,긴박하게)","ally":"${generalName} 대사(30자이내,성격반영,B급유머·비어허용)","enemy":"${enemyName} 대사(30자이내,위협적,개성있게)"}
순수 JSON만 응답.`;
  const ctx = `아군:${generalName}(${generalHanja}), 적장:${enemyName}(${enemyHanja}), 계급:${rankName}, 정답${correctN}회, 탈취${strippedN}/18`;
  try{
    const raw = await callClaude([{role:"user",content:ctx}],sys,key);
    const j = JSON.parse(raw.replace(/```json\n?|\n?```/g,'').trim());
    if(j?.situation) return j;
    throw new Error('empty');
  }catch{ return { situation:BATTLE_SITS[Math.floor(Math.random()*BATTLE_SITS.length)], ally:null, enemy:null }; }
}

async function genHanjaDetail(hanja, reading, meaning, key){
  const sys = `한자 단어 학습 정보 생성기. 아래 형식의 순수 JSON만 응답.
{"readings":[{"char":"廟","sound":"묘","kun":"사당 묘"}],"explanation":["뜻풀이1","뜻풀이2","뜻풀이3"],"notes":["유의사항1(사자성어나 파생어 포함)","유의사항2","유의사항3"],"episode":"삼국지 역사 에피소드 2~3문장","usage":["삼국지 활용 예시1","삼국지 활용 예시2"]}
readings는 한자 글자 수만큼. explanation·notes·usage는 각 2~3개. 매번 다른 내용 생성.`;
  try{
    const raw = await callClaude([{role:"user",content:`한자:${hanja}, 독음:${reading}, 뜻:${meaning}`}],sys,key);
    const j = JSON.parse(raw.replace(/```json\n?|\n?```/g,'').trim());
    if(j?.readings) return j;
    throw new Error('empty');
  }catch{ return null; }
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
  const [selectedEnemyIdx, setSelectedEnemyIdx] = useState(0);
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

  // 전투 상황 텍스트
  const [battleSit, setBattleSit]   = useState('');
  const [sitLoading, setSitLoading] = useState(false);
  // 동적 장수 대사
  const [allyLine, setAllyLine]     = useState('');
  const [enemyLine, setEnemyLine]   = useState('');
  // 출제 이력 (세션)
  const [usedSet, setUsedSet]       = useState(()=>new Set());
  // 마스터 맵 (3연속 정답 → 영구 제외) — localStorage 동기화
  const [masteredMap, setMasteredMap] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('hanja-mastered-map')||'{}'); }catch{ return {}; } });
  useEffect(()=>{ localStorage.setItem('hanja-mastered-map', JSON.stringify(masteredMap)); },[masteredMap]);
  // 정답 후 상세 학습 정보
  const [hanjaDetail, setHanjaDetail]     = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // 북마크 (localStorage)
  const [bookmarks, setBookmarks] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('hanja-bookmarks')||'[]'); }catch{ return []; } });
  useEffect(()=>{ localStorage.setItem('hanja-bookmarks', JSON.stringify(bookmarks)); },[bookmarks]);

  const enemy = ENEMIES[enemyIdx];
  const strippedN = stripped.filter(Boolean).length;
  const rank = getRank(correctN);
  const masteredCount = Object.values(masteredMap).filter(v=>v>=3).length;
  const totalWordCount = WORD_DB.flat().length;

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

  // ── 전투 상황·대사 자동 생성 (action 단계 진입 시)
  useEffect(()=>{
    if(bPhase==='action' && screen==='battle'){
      setSitLoading(true);
      setAllyLine(''); setEnemyLine('');
      if(apiKey && general){
        genBattleContext(enemy.name, enemy.hanja, general.name, general.hanja, rank.rank, correctN, strippedN, apiKey).then(ctx=>{
          setBattleSit(ctx.situation); setSitLoading(false);
          if(ctx.ally) setAllyLine(ctx.ally);
          if(ctx.enemy) setEnemyLine(ctx.enemy);
        });
      } else {
        setBattleSit(BATTLE_SITS[Math.floor(Math.random()*BATTLE_SITS.length)]);
        setSitLoading(false);
      }
    }
  },[bPhase, enemyIdx, screen]);

  // ── 액션 선택 → 한자 출제
  async function onAction(act){
    setAction(act);
    setBPhase('loading');
    doAnim('atk',600);
    const cats = JSM_CATS[act] || ACTION_CATS[act] || ACTION_CATS.attack;
    const avail = cats.filter(c=>!stripped[c]);
    const pool  = avail.length>0?avail:cats;
    const catId = pool[Math.floor(Math.random()*pool.length)];
    const diff  = Math.min(90, correctN*4);
    const p = apiKey
      ? await genProblem(catId, diff, apiKey, [...usedSet], battleSit, masteredMap)
      : genStatic(catId, usedSet, masteredMap, battleSit);
    setUsedSet(prev=>new Set([...prev, p.hanja]));
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
    setMasteredMap(prev=>({...prev,[problem.hanja]:0}));
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
    // 마스터 카운트 +1 (3회 → 영구 제외)
    setMasteredMap(prev=>({...prev,[problem.hanja]:Math.min(3,(prev[problem.hanja]||0)+1)}));
    // 상세 학습 정보 생성
    setHanjaDetail(null); setDetailLoading(true);
    if(apiKey){
      genHanjaDetail(problem.hanja, problem.reading, problem.meaning, apiKey)
        .then(d=>{ setHanjaDetail(d); setDetailLoading(false); })
        .catch(()=>setDetailLoading(false));
    } else { setDetailLoading(false); }

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
    setMasteredMap(prev=>({...prev,[problem.hanja]:0}));
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
      setEnemyIdx(next); setStripped(Array(18).fill(false)); setUsedSet(new Set());
      setBPhase('action'); setNarration('');
      doAnim('entrance',800);
    },2600);
  }

  // ── 다음으로
  function onContinue(){
    setBPhase('action'); setProblem(null); setAnswer(null); setIsRight(null); setNarration(''); setAction(null); setLastItem('');
    setHanjaDetail(null); setDetailLoading(false);
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
        <button style={{...btn(),width:"100%",marginBottom:8,fontSize:17,padding:14}} onClick={()=>{ setScreen('setup'); setEnemyIdx(0); setSelectedEnemyIdx(0); setStripped(Array(18).fill(false)); setCatStats(Array(18).fill(0)); setServants([]); setCorrectN(0); setWrongN(0); setBPhase('action'); }}>다시 도전</button>
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
          <div style={{fontSize:26,fontWeight:700,color:G.goldL,letterSpacing:"0.1em",marginBottom:6}}>한글文字 전투 시스템</div>
          <div style={{fontSize:15,color:G.dim,lineHeight:1.8}}>
            한자를 맞혀 적장을 털어라!<br/>
            18개 카테고리 한자 완전 정복 후 적장이 항복!
          </div>
        </div>
        {/* 학습 현황 */}
        <div style={{...box({marginBottom:16,padding:12})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,color:G.dim,marginBottom:2}}>📚 단어 마스터 현황</div>
              <div style={{fontSize:15,fontWeight:700,color:G.goldL}}>{masteredCount} <span style={{fontSize:12,color:G.dim,fontWeight:400}}>/ {totalWordCount} 단어 마스터</span></div>
            </div>
            {masteredCount>0&&(
              <button onClick={()=>{ localStorage.removeItem('hanja-mastered-map'); setMasteredMap({}); }}
                style={{...btn("rgba(224,80,64,0.12)","#e05040"),padding:"6px 12px",fontSize:12,border:"1px solid rgba(224,80,64,0.3)"}}>초기화</button>
            )}
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
        {/* 적장 선택 */}
        <div style={{...box({marginBottom:16})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:14,color:G.dim}}>🏴‍☠️ 정복할 적장을 선택하라 (6인)</div>
            <div style={{fontSize:11,color:G.dim}}>클릭하여 선택</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {ENEMIES.map((e,i)=>{
              const sel = selectedEnemyIdx===i;
              return (
                <div key={e.id} onClick={()=>setSelectedEnemyIdx(i)}
                  className="hOpt"
                  style={{
                    background: sel ? `rgba(${e.color.startsWith('#')?parseInt(e.color.slice(1,3),16)+','+parseInt(e.color.slice(3,5),16)+','+parseInt(e.color.slice(5,7),16):'100,80,30'},0.18)` : "rgba(255,255,255,0.03)",
                    border: sel ? `2px solid ${e.color}` : `1px solid ${e.color}44`,
                    borderRadius:6, padding:"8px 10px", fontSize:13, color:G.text,
                    flex:"1 1 100px", textAlign:"center", cursor:"pointer",
                    transition:"all 0.18s", position:"relative",
                    boxShadow: sel ? `0 0 14px ${e.color}55` : "none",
                  }}>
                  {sel&&<div style={{position:"absolute",top:4,right:5,fontSize:11,color:e.color,fontWeight:700}}>✔</div>}
                  <span style={{fontSize:22}}>{e.emoji}</span>
                  <div style={{color:e.color,fontWeight:700,marginTop:2}}>{e.name}</div>
                  <div style={{fontSize:10,color:G.dim}}>{e.title}</div>
                </div>
              );
            })}
          </div>
          {/* 선택 확인 문구 */}
          <div style={{marginTop:10,padding:"8px 12px",background:`rgba(${
            (() => { const c=ENEMIES[selectedEnemyIdx].color; return parseInt(c.slice(1,3),16)+','+parseInt(c.slice(3,5),16)+','+parseInt(c.slice(5,7),16); })()
          },0.12)`,borderRadius:6,border:`1px solid ${ENEMIES[selectedEnemyIdx].color}55`,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>{ENEMIES[selectedEnemyIdx].emoji}</span>
            <span style={{fontSize:14,color:ENEMIES[selectedEnemyIdx].color,fontWeight:700}}>선택된 적장: {ENEMIES[selectedEnemyIdx].name} — {ENEMIES[selectedEnemyIdx].title}</span>
          </div>
        </div>
        {/* 시스템 설명 */}
        <div style={{...box({marginBottom:20})}}>
          <div style={{fontSize:14,color:G.dim,marginBottom:8}}>📖 진선미 선택 → 한글文字 문제 연결</div>
          {[["💎 진(眞)","자강불식 → 數字類·時節類·方位類·動態類·干支類·天體類 출제"],["🌿 선(善)","계지자선 → 地理類·住居類·宮室類·衣食類·動物類·植物類 출제"],["🌸 미(美)","교이만물 → 人體類·呼稱類·狀況類·道具類·兵器類·其他類 출제"],["✅ 정답","단어 문제 우선 출제, 단어 없으면 한 글자 출제"],["⏰ 10초","타임어택: 빨리 맞힐수록 보너스"]].map(([t,d])=>(
            <div key={t} style={{display:"flex",gap:10,marginBottom:6,fontSize:14}}>
              <span style={{color:G.gold,minWidth:70}}>{t}</span>
              <span style={{color:G.dim}}>{d}</span>
            </div>
          ))}
        </div>
        <button style={{width:"100%",fontSize:20,padding:18,letterSpacing:"0.12em",background:"linear-gradient(90deg,#a07010,#c8a030,#f0d060,#c8a030,#a07010)",border:"2px solid rgba(240,200,60,0.8)",borderRadius:6,color:"#0a0704",fontWeight:900,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 28px rgba(200,160,30,0.55)",marginBottom:4}} onClick={()=>{ setEnemyIdx(selectedEnemyIdx); setStripped(Array(18).fill(false)); setUsedSet(new Set()); setScreen('general'); }}>⚔ {ENEMIES[selectedEnemyIdx].name} {ENEMIES[selectedEnemyIdx].emoji} 에게 출전!</button>
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
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:G.dim}}>📚 마스터</div>
            <div style={{fontSize:13,fontWeight:700,color:G.gold}}>{masteredCount}/{totalWordCount}</div>
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

            {/* AI 전략 상황 */}
            <div style={{...box({padding:14,marginBottom:10,borderColor:"rgba(200,160,40,0.45)",background:"rgba(12,8,2,0.95)"})}}>
              {sitLoading
                ? <div style={{display:"flex",alignItems:"center",gap:8,color:G.dim,fontSize:14}}><div style={{width:14,height:14,border:`2px solid ${G.border}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>전략 상황 분석 중...</div>
                : <div style={{fontSize:15,color:"#d4c49a",lineHeight:1.85,letterSpacing:"0.02em"}}>{battleSit}</div>
              }
            </div>

            {/* 장수 · 적장 대사 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {general&&(
                <div style={{...box({padding:10,marginBottom:0,borderColor:`${general.color}44`}),fontSize:12,color:G.text,lineHeight:1.65}}>
                  <span style={{color:general.color,fontWeight:700}}>{general.emoji} {general.name}</span><br/>
                  <span style={{fontStyle:"italic",color:G.dim}}>"{allyLine || general.intro}"</span>
                </div>
              )}
              <div style={{...box({padding:10,marginBottom:0,borderColor:`${enemy.color}44`}),fontSize:12,color:G.text,lineHeight:1.65}}>
                <span style={{color:enemy.color,fontWeight:700}}>{enemy.emoji} {enemy.name}</span><br/>
                <span style={{fontStyle:"italic",color:G.dim}}>"{enemyLine || enemy.intro}"</span>
              </div>
            </div>

            <div style={{fontSize:15,fontWeight:700,color:G.gold,textAlign:"center",marginBottom:12,letterSpacing:"0.08em"}}>— 공격 방식을 선택하라 —</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                { act:"jin",  emoji:"💎", label:"진(眞)", sub:"자강불식", color:"#4a90d9" },
                { act:"seon", emoji:"🌿", label:"선(善)", sub:"계지자선", color:"#7ab040" },
                { act:"mi",   emoji:"🌸", label:"미(美)", sub:"교이만물", color:"#c8a030" },
              ].map(({act,emoji,label,sub,color})=>(
                <button key={act} className="hOpt" onClick={()=>onAction(act)}
                  style={{...box({padding:14,marginBottom:0,cursor:"pointer",textAlign:"center",transition:"all 0.15s",border:`1px solid ${color}55`})}}>
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

            {/* 상세 학습 정보 (정답 시) */}
            {isRight&&(
              <div style={{...box({padding:14,marginBottom:10,borderColor:"rgba(74,144,217,0.35)"})}}>
                {detailLoading?(
                  <div style={{textAlign:"center",color:G.dim,fontSize:13,padding:"8px 0"}}>📖 학습 정보 생성 중…</div>
                ):hanjaDetail?(
                  <>
                    {/* 음과 훈 */}
                    {hanjaDetail.readings?.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:G.gold,fontWeight:700,marginBottom:5,letterSpacing:"0.05em"}}>📖 음과 훈</div>
                        {hanjaDetail.readings.map((r,i)=>(
                          <div key={i} style={{fontSize:13,color:G.text,paddingLeft:8,lineHeight:1.7}}>
                            · <span style={{color:G.goldL,fontWeight:700}}>{r.char}</span>: {r.sound} — {r.kun}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 뜻풀이 */}
                    {hanjaDetail.explanation?.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:G.gold,fontWeight:700,marginBottom:5,letterSpacing:"0.05em"}}>📝 뜻풀이</div>
                        {hanjaDetail.explanation.map((e,i)=>(
                          <div key={i} style={{fontSize:13,color:G.text,paddingLeft:8,lineHeight:1.7}}>· {e}</div>
                        ))}
                      </div>
                    )}
                    {/* 유의사항 */}
                    {hanjaDetail.notes?.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:G.gold,fontWeight:700,marginBottom:5,letterSpacing:"0.05em"}}>💡 유의사항</div>
                        {hanjaDetail.notes.map((n,i)=>(
                          <div key={i} style={{fontSize:13,color:G.text,paddingLeft:8,lineHeight:1.7}}>· {n}</div>
                        ))}
                      </div>
                    )}
                    {/* 에피소드 */}
                    {hanjaDetail.episode&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:G.gold,fontWeight:700,marginBottom:5,letterSpacing:"0.05em"}}>🎭 에피소드</div>
                        <div style={{fontSize:13,color:G.text,paddingLeft:8,lineHeight:1.7}}>{hanjaDetail.episode}</div>
                      </div>
                    )}
                    {/* 삼국지 활용 */}
                    {hanjaDetail.usage?.length>0&&(
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:G.gold,fontWeight:700,marginBottom:5,letterSpacing:"0.05em"}}>⚔️ 삼국지 활용</div>
                        {hanjaDetail.usage.map((u,i)=>(
                          <div key={i} style={{fontSize:13,color:G.text,paddingLeft:8,lineHeight:1.7}}>· {u}</div>
                        ))}
                      </div>
                    )}
                    {/* 북마크 버튼 */}
                    <button
                      style={{background:bookmarks.some(b=>b.hanja===problem?.hanja)?"rgba(240,208,96,0.15)":"rgba(255,255,255,0.05)",
                        border:`1px solid rgba(200,160,40,${bookmarks.some(b=>b.hanja===problem?.hanja)?0.6:0.25})`,
                        borderRadius:6,padding:"8px 16px",color:G.gold,fontSize:13,fontWeight:600,
                        cursor:"pointer",width:"100%",letterSpacing:"0.03em",marginTop:4}}
                      onClick={()=>{
                        const key2=problem?.hanja;
                        if(bookmarks.some(b=>b.hanja===key2)){
                          setBookmarks(prev=>prev.filter(b=>b.hanja!==key2));
                        } else {
                          setBookmarks(prev=>[...prev,{hanja:problem.hanja,reading:problem.reading,meaning:problem.meaning,detail:hanjaDetail,savedAt:Date.now()}]);
                        }
                      }}>
                      {bookmarks.some(b=>b.hanja===problem?.hanja)?"🔖 북마크됨 (해제하려면 클릭)":"☆ 북마크 저장"}
                    </button>
                  </>
                ):null}
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
              {isRight?"다음 문제로 ➡️":"계속 전투 ⚔️"}
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
