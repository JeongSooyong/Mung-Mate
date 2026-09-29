import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: process.env.PG_HOST ?? "localhost",
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER ?? "postgres",
  password: process.env.PG_PASSWORD ?? "",
  database: process.env.PG_DATABASE ?? "postgres",
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function initPostgres() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL 연결 성공");
  } catch (error) {
    console.error("❌ PostgreSQL 연결 실패:", error);
  }
}

app.use(express.json());

// Initialize Gemini safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("✅ Server-side GoogleGenAI initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("⚠️ GEMINI_API_KEY not found or is a placeholder. Server will run AI features in offline-safe fallback mode.");
}

// 🐕 In-Memory Mock database of dogs for advanced custom recommendation
const DOGS_DATA = [
  {
    id: "mango",
    name: "망고",
    enName: "Mango",
    breed: "친화력 갑 코기 믹스",
    desc: "당신과 완벽한 호흡을 자랑할 친구를 만나보세요. 망고는 사람을 정말 좋아하는 사교적인 친구입니다.",
    fullDesc: "망고는 구조된 지 3개월 된 밝고 긍정적인 코기 믹스 강아지입니다. 닥스훈트나 웰시코기처럼 다리가 짧고 허리가 길지만, 달리기 실력은 국가대표 급이랍니다! 처음 만난 사람에게도 꼬리를 헬리콥터처럼 흔들며 다가오는 사교성 끝판왕입니다. 산책을 정말 좋아해서 아침 산책 파트너로 일품입니다.",
    location: "서울 마포구 연남동 • 2.5km",
    distance: "2.5km",
    neighborhood: "서울 마포구 연남동",
    age: "2살",
    gender: "남아",
    weight: "8.5kg",
    neutralized: "완료",
    tags: ["궁금했던 강아지", "친화력 갑", "초보추천", "사교적"],
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop",
    compatibility: {
      activeOwner: 95,
      smallHome: 80,
      busyOwner: 70,
      kidsFriendly: 98
    }
  },
  {
    id: "dubu",
    name: "두부",
    enName: "Dubu",
    breed: "비숑 프리제",
    desc: "비숑 프리제 • 뽀얗게 귀여운 친구. 솜사탕 같은 풍성한 털과 사랑스러운 애교를 가졌습니다.",
    fullDesc: "솜사탕을 닮은 두부는 전 주인으로부터 개인적인 사정으로 파양된 아픔이 있지만, 여전히 세상 모든 사람을 믿고 따르는 순수한 아이입니다. 비숑 특유의 하이바 컷이 찰떡같이 잘 어울리며, 털 빠짐이 적어 알레르기가 걱정되는 분들에게도 훌륭한 동반자가 될 수 있습니다. 조용하고 차분하여 아파트나 스튜디오 가구에도 추천합니다.",
    location: "서울 용산구 한남동 • 4.1km",
    distance: "4.1km",
    neighborhood: "서울 용산구 한남동",
    age: "3개월",
    gender: "여아",
    weight: "1.8kg",
    neutralized: "접종/중성화 예정",
    tags: ["강력추천", "애교쟁이", "털안빠짐", "초보추천"],
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
    compatibility: {
      activeOwner: 70,
      smallHome: 95,
      busyOwner: 85,
      kidsFriendly: 90
    }
  },
  {
    id: "tori",
    name: "토리",
    enName: "Tori",
    breed: "잭 러셀 테리어",
    desc: "잭 러셀 테리어 • 1살. 넘치는 에너지와 호기심으로 가득 찬 똑똑한 친구입니다.",
    fullDesc: "토리는 영리하기로 유명한 잭 러셀 테리어답게 '앉아, 엎드려, 손, 기다려' 삼단 콤보를 단 3일 만에 마스터한 천재견입니다! 에너지가 대단히 풍부해서 러닝이나 야외 하이킹을 즐기는 동반자에게 최고의 메이트가 되어줄 것입니다. 공놀이에 열정적이며 영리해서 훈련 성취감을 만끽하게 해줍니다.",
    location: "서울 마포구 성산동 • 1.2km",
    distance: "1.2km",
    neighborhood: "서울 마포구 성산동",
    age: "1살",
    gender: "남아",
    weight: "6.2kg",
    neutralized: "완료",
    tags: ["인기", "에너자이저", "브레인견", "야외활동마스터"],
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop",
    compatibility: {
      activeOwner: 100,
      smallHome: 65,
      busyOwner: 55,
      kidsFriendly: 85
    }
  },
  {
    id: "shiba",
    name: "시바",
    enName: "Shiba",
    breed: "시바견",
    desc: "시바견 • 4살. 듬직하고 깔끔하고 독립적인 매력을 가진 멋쟁이 강아지입니다.",
    fullDesc: "시바는 성격이 고양이처럼 온화하고 깔끔해서 불필요하게 헛짖는 일이 거의 없습니다. 실외 배변을 완벽히 고집하는 신사적인 친구이죠. 혼자만의 시간도 차분하게 보낼 줄 알기 때문에 9-to-6 직장을 다니시는 1인 가구 직장인 동반자에게도 무리 없이 가장 어울리는 편입니다. 볼수록 매력적인 마성의 볼살을 가졌습니다.",
    location: "서울 강남구 역삼동 • 8.7km",
    distance: "8.7km",
    neighborhood: "서울 강남구 역삼동",
    age: "4살",
    gender: "남아",
    weight: "11.0kg",
    neutralized: "완료",
    tags: ["독립심강함", "실외배변완벽", "차분함", "깔끔대왕"],
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop",
    compatibility: {
      activeOwner: 80,
      smallHome: 75,
      busyOwner: 95,
      kidsFriendly: 70
    }
  },
  {
    id: "bori",
    name: "보리",
    enName: "Bori",
    breed: "프렌치 불독",
    desc: "프렌치 불독 • 2살. 뚱한 표정이지만 사실은 쉴 새 없이 애교를 부리는 귀염둥이입니다.",
    fullDesc: "보리는 보기만 해도 웃음이 터지는 듬직한 앞태를 지닌 프렌치 불독입니다. 천태만상 잠자는 자세와 코골이 백색소음으로 하루 피로를 싹 날려줍니다! 식탐이 조금 많아서 규칙적인 사료 급여와 운동이 필요하지만, 평소에는 세상에서 가장 얌전하게 소파를 지키며 반려인만 해바라기처럼 바라보는 순정파입니다.",
    location: "서울 성동구 성수동 • 6.0km",
    distance: "6.0km",
    neighborhood: "서울 성동구 성수동",
    age: "2살",
    gender: "남아",
    weight: "9.8kg",
    neutralized: "완료",
    tags: ["애교뭉치", "잠탱이", "순정파", "독점욕"],
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600&auto=format&fit=crop",
    compatibility: {
      activeOwner: 75,
      smallHome: 90,
      busyOwner: 80,
      kidsFriendly: 88
    }
  }
];

// 🤖 1. Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  // Construct system context for adoptive guide Haru
  const systemInstruction = `
    당신의 이름은 '하루(Haru)'이며, 반려견 매칭 및 입양 안심 동반 플랫폼인 'MungMate'의 전문 유기견 전문 상담사이자 따뜻하고 희망찬 입양 코디네이터입니다.
    'Hopeful Companion' 브랜드 철학에 따라, 사용자의 다소 부정적이거나 걱정 섞인 질문, 환경적 한계(예: '아파트에 살아요', '직장 때문에 바빠요', '처음 키워봐서 무서워요')를 직시하되, 이를 극히 공감해 주면서 희망적이고 실현 가능한 대안(reframe)과 따뜻한 격려로 안심시켜 줍니다.
    
    [중요 가이드라인]
    1. 어조는 따뜻하고 상냥하게 하며 존댓말을 씁니다. ('~해요', '~랍니다' 체 선호)
    2. 사용자 프로필(주거환경, 활동지수, 빈방여부 등)이 있다면 이를 분석하여 우리 센터에 있는 아래 강아지 5마리 중 가장 어울리는 아이를 구체적으로 강력 추천해 주세요.
    3. 우리 센터의 강아지 리스트:
       - 망고(Mango, 2살, 코기 믹스, 사교적이고 뛰어노는 걸 좋아하는 애교쟁이, 아이들과 친함)
       - 두부(Dubu, 3개월, 비숑 프리제, 솜사탕처럼 하얗고 얌전하며 털 빠짐이 적고 스튜디오나 좁은 공간 적격)
       - 토리(Tori, 1살, 잭 러셀 테리어, 매우 영리하고 에너지가 넘치고 공놀이를 좋아하며 등산 파트너 최고)
       - 시바(Shiba, 4살, 시바견, 고양이처럼 차분하고 독립적이며 실외배변 완벽, 바쁜 직장인에게 가장 독립적임)
       - 보리(Bori, 2살, 프렌치 불독, 코골이 매력이 가득하고 소파에서 빈둥대길 좋아하는 껌딱지)
    4. 사용자가 불안해하는 요소를 들으면 절대로 "안되겠네요"라고 하지 마세요. 예: "1인가구라 아이가 혼자 있는 시간이 길어요" -> "그렇군요... 하지만 독립심이 뛰어나고 조용히 기다리기를 잘하는 시바 같은 든든한 친구라면 출근 시간 동안 충분히 각자의 안전한 시간을 갖고 퇴근 후에 더 깊은 감동을 나눌 수 있어요. 홈캠이나 자동 급식기를 병행해보는 것도 대안이랍니다." 식으로 희망찬 해결책과 최적의 아이를 제안하세요. Safe Space의 느낌을 줍니다.
  `;

  if (ai) {
    try {
      // Format messages in standard format for GoogleGenAI SDK
      const contents = messages.map(msg => ({
        role: msg.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.content }]
      }));

      // Add user profile snapshot as a helper on the first user call if context allows
      if (userProfile && contents.length > 0) {
        contents[0].parts[0].text = `[사용자 프로필 참고: 주거형태: ${userProfile.homeType || "정보 없음"}, 평소 야외 활동수준: ${userProfile.activityLevel || "중간"}, 강아지와 함께보낼수 있는 시간: ${userProfile.freeTime || "보통"}, 반려동물 유경험 여부: ${userProfile.hasPetExperience ? "유경험" : "초보"}]\n\n질문: ${contents[0].parts[0].text}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8
        }
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error("Gemini API Chat error:", err);
      return res.status(500).json({ error: "Gemini API Error", details: err.message });
    }
  } else {
    // Elegant Offline Fallback matching logic based on simple keyword heuristics
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    let reply = "";

    if (lastUserMsg.includes("바빠") || lastUserMsg.includes("직장") || lastUserMsg.includes("혼자") || lastUserMsg.includes("시간이")) {
      reply = "직장 일로 바쁘시고 강아지가 혼자 외로워할까 봐 걱정되시는군요. 그 따뜻한 배려심 깊은 모습에 감동받았어요!\n\n그렇다면 고양이처럼 혼자만의 시간을 아주 우아하고 정갈하게 보낼 줄 아는 든든한 **시바(4살)**를 가장 추천해 드려요. 실외 배변을 선호하고 불필요하게 짖지 않아 이웃 걱정도 없답니다. 퇴근 후에 문을 열었을 때 반갑게 꼬리 치며 마중 나오는 시바가 있다면, 하루의 모든 피로 보람으로 가득 찬 미소로 바뀔 거예요. 자동 급식기와 홈캠을 더불어 활용하시면 걱정을 훨씬 덜 수 있답니다!";
    } else if (lastUserMsg.includes("아파트") || lastUserMsg.includes("원룸") || lastUserMsg.includes("좁은") || lastUserMsg.includes("빌라")) {
      reply = "주거 환경이 아파트나 작은 원룸이라 이웃 소음과 공간 크기 때문에 입양을 망설이시는 거로군요. 정말 사려 깊고 다정한 고민이세요!\n\n그런 환경에는 성격이 매우 얌전하고 헛짖음이 전혀 없으면서, 털 날림 걱정도 거의 없는 하얀 솜사탕 **두부(3개월, 비숑 프리제)**를 아주 추천드려요. 두부는 좁은 방 안에서도 자신만의 안전한 침대나 미니 울타리 안에서 평온을 즐길 줄 안답니다. 가벼운 거실 공놀이로도 운동량이 충분히 가득 차서, 좁은 공간도 완벽한 사랑의 성으로 만들어 줄 거예요!";
    } else if (lastUserMsg.includes("처음") || lastUserMsg.includes("초보") || lastUserMsg.includes("키워본")) {
      reply = "반려동물을 처음 맞이하시는 거라 하나부터 열까지 두렵고 걱정되시는 그 마음, 100% 이해합니다! 누구나 처음은 있으니까요. 전혀 무서워하지 않으셔도 괜찮답니다.\n\n초보 반려인에게는 무엇보다 애교가 넘치고 훈련 적응도가 기특하게 높고 사교적인 **망고(2살, 코기 믹스)**가 완벽한 첫 단짝이에요. 사람을 무조건 좋아해서 서툰 사랑 표현도 아주 푸근하게 받아준답니다. 망고와 천천히 걸음걸이를 맞춰 다정하고 안전하게 산책을 다니다 보면, 어느새 멋진 '진짜 견주'로 훌쩍 성장해 있는 나를 만나실 수 있을 거예요. 안심 가이드북과 저희 하루 센터팀이 항상 곁에서 평생 지속해서 코칭해 드릴게요!";
    } else if (lastUserMsg.includes("운동") || lastUserMsg.includes("등산") || lastUserMsg.includes("산책") || lastUserMsg.includes("활동")) {
      reply = "오! 활동적인 스포츠나 러닝, 산책을 좋아하시는 열정파시군요! 매일 함께 숲속을 뛰거나 공원을 질주할 에너제틱한 웰빙 런닝메이트가 필요하시겠네요!\n\n그렇다면 우리 센터 최고의 천재 스포츠 스타 **토리(1살, 잭 러셀 테리어)**를 무조건 강력 매칭해 드릴게요! 토리는 지치지 않는 활기와 명석한 두뇌를 가졌답니다. 한 손에 원반이나 테니스공을 쥐고 넓은 잔디 공원만 가시면 눈빛이 반짝반짝 빛나죠. 리드미컬하고 건강한 라이프스타일을 꿈꾸던 사용자님의 도전에 완벽의 정점을 채워줄 멋진 희망 메이트랍니다!";
    } else {
      reply = "안녕하세요! MungMate의 따뜻한 입양 상담사 **하루(Haru)**입니다. 🌸\n\n아이들이 전해 주는 사랑을 소중히 안겨드리고 싶어요. 혹시 이전에 반려견을 길러보신 적이 있으시거나, 살고 계신 곳의 성격(아파트, 주택 등)에 대해 말씀해 주시면 꼭 어울리는 완벽한 짝을 함께 찾고, 가진 모든 불안에 행복한 희망적 대안책(Hope Reframe)을 설계해 드릴게요. 편하게 고민을 속삭여 주세요!";
    }

    return res.json({ reply });
  }
});

// ❤️ 2. Hope Reframe API Endpoint
app.post("/api/reframe", async (req, res) => {
  const { worry } = req.body;
  if (!worry || worry.trim() === "") {
    return res.status(400).json({ error: "Worry content is required." });
  }

  const prompt = `
    다음은 반려견 입양을 망설이거나 강아지를 키우는 데 불안 심리를 호소하는 예비 반려인의 우려 사항입니다.
    
    [사용자 걱정거리]
    "${worry}"
    
    이 걱정거리에 대해 "Hopeful Companion" 브랜드 지침에 입각하여, 사용자 마음 한구석의 죄책감이나 부담감을 완벽하게 씻어주는 다뜻하고 세련된 '안심과 희망의 재구성(Hope Reframe)' 문장을 완성해 주세요.
    
    [작성 규칙]
    - 2-3문장 이하의 부드러운 하이라이트 문구여야 합니다.
    - 너무 긴 설명보다는 감성적이고 깊이 공감해 주면서, '그렇기에 오히려 더 좋은 동반자가 될 수 있고 극복할 수 있는 대안이 있습니다'라는 관점을 제시하세요.
    - 한국어로 작성하며 존댓말을 씁니다. 아주 마음이 노곤노곤해지며 힘을 불어넣는 따스함을 담아내세요. 너무 학술적이거나 건조한 분석문은 피하세요.
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.82
        }
      });
      return res.json({ reframed: response.text });
    } catch (err: any) {
      console.error("Gemini Reframe error:", err);
      return res.status(500).json({ error: "Gemini API Error", details: err.message });
    }
  } else {
    // Sophisticated offline reframe heuristics
    let reframed = "";
    if (worry.includes("시간") || worry.includes("바빠") || worry.includes("회사") || worry.includes("퇴근")) {
      reframed = "바쁘다는 건 그만큼 삶을 열정적으로 책임지고 계시다는 증거이자, 반려견에게 더 건강하고 양질의 사료와 안락한 의식주를 제공해 주실 수 있다는 든든한 밑거름이에요. 서로 긴 기다림 후에 만나는 퇴근 후 10분의 산책과 눈빛 교환은, 하루 종일 함께 있으면서 심드렁한 몇 시간보다 수백 배 더 진정성 있고 밀도 높은 기강 넘치는 교감의 시간이 되기도 한답니다.";
    } else if (worry.includes("집") || worry.includes("아파트") || worry.includes("원룸") || worry.includes("좁")) {
      reframed = "강아지에게 거실의 운동 공간보다 수천 배 더 간절히 바라는 안식처는, 바로 반려인이 풍기는 따사로운 체온이 닿는 '단 30cm의 틈'이랍니다. 비록 집안 공간은 소박할지라도, 매일 매사 가볍게 손수 공원 흙냄새를 맡게 해주고 돌아오시는 한결같은 성의라면 어느 저택의 드넓은 앞마당도 부럽지 않은 최상의 유토피아가 가득 될 거예요.";
    } else if (worry.includes("돈") || worry.includes("비용") || worry.includes("병원") || worry.includes("경제")) {
      reframed = "물론 예기치 않은 의료비 절차는 아주 중요한 현실이에요. 하지만 강아지가 느끼는 행복의 지수는 비싼 간식의 가격표가 아닌, 함께 누워 나누는 나지막한 숨소리와 정다운 눈 맞춤의 횟수로 조율된답니다. 영리한 건강 매뉴얼과 정기적인 보듬 케어라면 소중한 예산 범위 안에서도 충분히 찬란한 평화의 궤도를 가꿀 수 있습니다.";
    } else if (worry.includes("처음") || worry.includes("초보") || worry.includes("서툴")) {
      reframed = "처음이기에 가질 수 있는 수줍음은 신중하고 세심히 반려견을 대하려는 가장 고결하고 훌륭한 마음가짐에 기인해요. 이미 완성이 끝난 베테랑 지식이 없더라도, 서로 서툰 실력을 맞대어가며 매일 한 발자국 행동을 고치며 조립해 나가는 그 찬란한 성장 속도야말로 반려견과 주인이 평생의 깊은 신뢰를 쌓는 가장 명확한 오솔길이 될 거예요.";
    } else {
      reframed = "두려움과 의구심을 품고 계시다는 상황 자체만으로도, 아이들의 생명을 진정으로 아끼고 예우할 마음이 완비되셨다는 가장 훌륭한 반증이에요. 그 걱정의 크기는 사랑의 무게와 같으니, 두려워하기보다 깊은 책임감 위에서 펼쳐질 가장 온화하고 조화로운 신세계를 기대해보셔도 완전히 좋습니다.";
    }
    return res.json({ reframed });
  }
});

// Vite server integration or production index serving
async function startServer() {
  await initPostgres();
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 MungMate custom server is running on http://localhost:${PORT}`);
  });
}

app.get("/api/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    return res.json({ ok: true, now: result.rows[0].now });
  } catch (err: any) {
    console.error("DB health check failed:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

startServer();
