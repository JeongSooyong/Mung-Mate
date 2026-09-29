// 강아지 정보의 형태를 검사하기 위해 Dog 타입을 가져옵니다.
import { Dog } from "./types";

// 화면에서 사용할 강아지 목록을 정의합니다.
export const DOGS_DATA: Dog[] = [
  // 망고의 기본 정보 묶음을 시작합니다.
  {
    // 망고를 구분하는 고유 아이디입니다.
    id: "mango",
    // 강아지의 한글 이름입니다.
    name: "망고",
    // 강아지의 영문 이름입니다.
    enName: "Mango",
    // 강아지의 품종 설명입니다.
    breed: "친화력 갑 코기 믹스",
    // 카드에 표시할 짧은 소개입니다.
    desc: "당신과 완벽한 호흡을 자랑할 친구를 만나보세요. 망고는 사람을 정말 좋아하는 사교적인 친구입니다.",
    // 상세 창에 표시할 긴 소개입니다.
    fullDesc: "망고는 구조된 지 3개월 대리에서 안정을 되찾은 밝고 긍정적인 코기 믹스 강아지입니다. 닥스훈트나 웰시코기처럼 다리가 짧고 허리가 길지만, 달리기 실력은 언제나 국가대표급 에너지 만점이랍니다! 처음 만난 사람에게도 꼬리를 회전하며 다가오는 사교성의 끝판왕입니다. 산책을 온몸으로 사랑하여 매일 아침 러닝 메이트로 최고입니다.",
    // 강아지가 있는 전체 위치입니다.
    location: "서울 마포구 연남동 • 2.5km",
    // 사용자와 강아지 사이의 거리입니다.
    distance: "2.5km",
    // 검색에 사용할 동네 이름입니다.
    neighborhood: "서울 마포구 연남동",
    // 강아지의 나이입니다.
    age: "2살",
    // 강아지의 성별입니다.
    gender: "남아",
    // 강아지의 몸무게입니다.
    weight: "8.5kg",
    // 예방접종 및 중성화 상태입니다.
    neutralized: "완료",
    // 강아지를 검색하고 설명하는 태그입니다.
    tags: ["궁금했던 강아지", "친화력 갑", "초보추천", "사교적"],
    // 강아지 사진의 주소입니다.
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop",
    // 사용자 생활 방식별 궁합 점수입니다.
    compatibility: {
      // 활동적인 사용자와의 궁합입니다.
      activeOwner: 95,
      // 작은 집에서 지내기 좋은 정도입니다.
      smallHome: 80,
      // 바쁜 사용자와의 궁합입니다.
      busyOwner: 70,
      // 아이와 지내기 좋은 정도입니다.
      kidsFriendly: 98
    // 망고의 궁합 점수 묶음을 닫습니다.
    }
  // 망고 정보 묶음을 닫습니다.
  },
  {
    id: "dubu",
    name: "두부",
    enName: "Dubu",
    breed: "비숑 프리제",
    desc: "비숑 프리제 • 뽀얗게 귀여운 친구. 솜사탕 같은 풍성한 털과 사랑스러운 애교를 가졌습니다.",
    fullDesc: "솜사탕을 꼭 빼닮은 두부는 전 소유자의 해외 이주로 인해 안타깝게 구조된 비숑 프리제 공주님입니다. 비숑 특유의 기품 있고 풍성한 하이바가 매일 아침 웃음을 줍니다. 털 빠짐이 워낙 없어서 위생이나 알레르기를 고민하시는 가정에 무척 좋습니다. 조용하고 점잖게 거실 한구석에서 솜인형처럼 잠자는 시간을 사랑합니다.",
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
    fullDesc: "토리는 대단히 민첩하고 두뇌 회전이 호기심 천국인 잭 러셀 테리어 청년견입니다. 공이나 원반을 기적같이 낚아채며 매사 성취감이 아주 또렷합니다. 영리해서 앉아, 손, 엎드려는 물론 문을 스스로 여닫는 영재성도 보여줘요. 등산이나 매일의 주말 하이킹, 조깅 라이프스타일을 추구하는 분에게 완벽한 에너지 주입기입니다.",
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
    fullDesc: "시바는 기품 있고 기품 넘치는 소형견처럼 영점이 단단히 잡힌 시바견입니다. 혼자만의 영역과 명상 시간을 진정으로 존중할 줄 알아서, 1인 가구나 장시간 자리를 비우는 사무직 반려인의 가정에 놀라운 평온과 휴식을 보상해 줍니다. 배변 훈련도 완벽하게 실외에서만 하여 실내 공기를 산뜻하게 보호해 드려요.",
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
    fullDesc: "보리는 기적같이 사랑스럽고 듬직하며 순박한 표정으로 힐링을 주는 프렌치 불독입니다. 천진난만하게 뒤집어져 낮잠을 청하며 독특한 귀여움을 흘리고 다녀요. 식욕만큼이나 교감 능력이 우수해서 반려인의 감정 상태를 마법같이 위로해 주는 타고난 어시스턴트독이기도 합니다. 산책 속도도 여유로워 산책 로망을 편하게 즐길 수 있습니다.",
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

// Helper function to calculate compatibility score between a UserProfile and a Dog
export function calculateCompatibilityScore(profile: { homeType: string; activityLevel: string; freeTime: string; hasPetExperience: boolean }, dog: Dog): number {
  // 모든 강아지에게 적용할 기본 궁합 점수입니다.
  let score = 75; // Baseline

  // 1. Home Type Match
  // 원룸이나 아파트라면 작은 집 적합도에 따라 점수를 조정합니다.
  if (profile.homeType === 'studio' || profile.homeType === 'apartment') {
    // 작은 집 점수를 기준점과 비교해 일부만 반영합니다.
    score += (dog.compatibility.smallHome - 75) * 0.4;
  } else {
    // 단독 주택은 공간 여유가 있다고 보고 추가 점수를 줍니다.
    // House owners like higher energy or larger, no penalty for small home
    score += 10;
  }

  // 2. Activity Match
  // 사용자의 활동량에 맞춰 활동적인 강아지 선호도를 반영합니다.
  if (profile.activityLevel === 'high') {
    // 활동적인 사용자는 활동 궁합 점수의 영향을 크게 받습니다.
    score += (dog.compatibility.activeOwner - 75) * 0.5;
  } else if (profile.activityLevel === 'low') {
    // Low activity prefers lower active dogs (like Shiba or Bori)
    if (dog.compatibility.activeOwner < 80) score += 12;
    else score -= 15;
  }

  // 3. Busy Match
  // 사용자가 강아지와 보낼 수 있는 시간에 맞춰 점수를 조정합니다.
  if (profile.freeTime === 'busy') {
    // 시간이 적을수록 바쁜 사용자와 잘 맞는 강아지를 우대합니다.
    score += (dog.compatibility.busyOwner - 75) * 0.5;
  } else if (profile.freeTime === 'abundant') {
    // Highly active / young puppies like abundant time
    if (dog.id === 'dubu' || dog.id === 'tori') score += 10;
  }

  // 4. Experience Match
  // 반려 경험이 없는 사용자에게는 초보자용 강아지를 우선합니다.
  if (!profile.hasPetExperience) {
    if (dog.tags.includes('초보추천')) {
      score += 15;
    } else if (dog.id === 'tori' || dog.id === 'shiba') {
      // Harder breeds for complete beginners
      score -= 10;
    }
  } else {
    // Experienced owners match nicely with smart/energetic dogs
    if (dog.id === 'tori') score += 8;
  }

  // Bound the score between 40 and 100
  // 최종 점수를 40점에서 100점 사이의 정수로 제한합니다.
  return Math.max(40, Math.min(100, Math.round(score)));
}
