// 사용자의 생활 습관과 반려 경험을 표현하는 타입입니다.
export interface UserProfile {
  // 사용자가 사는 집의 형태입니다.
  homeType: 'apartment' | 'house' | 'studio';
  // 사용자의 평소 활동량입니다.
  activityLevel: 'low' | 'medium' | 'high';
  // 사용자가 반려동물에게 쓸 수 있는 시간입니다.
  freeTime: 'busy' | 'normal' | 'abundant';
  // 반려동물을 키워본 경험이 있는지 나타냅니다.
  hasPetExperience: boolean;
  // 사용자 이름입니다.
  name: string;
// 사용자 프로필 타입을 닫습니다.
}

// 강아지와 사용자의 궁합 점수를 모아둔 타입입니다.
export interface Compatibility {
  // 활동적인 사용자와 잘 맞는 정도입니다.
  activeOwner: number;
  // 작은 집에서 지내기 좋은 정도입니다.
  smallHome: number;
  // 바쁜 사용자와 잘 맞는 정도입니다.
  busyOwner: number;
  // 아이와 함께 지내기 좋은 정도입니다.
  kidsFriendly: number;
// 궁합 점수 타입을 닫습니다.
}

// 강아지 한 마리의 전체 정보를 표현하는 타입입니다.
export interface Dog {
  // 강아지를 구분하는 고유 아이디입니다.
  id: string;
  // 강아지의 한글 이름입니다.
  name: string;
  // 강아지의 영문 이름입니다.
  enName: string;
  // 강아지의 품종입니다.
  breed: string;
  // 목록에 표시할 짧은 소개입니다.
  desc: string;
  // 상세 화면에 표시할 긴 소개입니다.
  fullDesc: string;
  // 강아지가 있는 위치입니다.
  location: string;
  // 사용자와 강아지 사이의 거리입니다.
  distance: string;
  // 강아지가 있는 동네입니다.
  neighborhood: string;
  // 강아지의 나이입니다.
  age: string;
  // 강아지의 성별입니다.
  gender: '남아' | '여아';
  // 강아지의 몸무게입니다.
  weight: string;
  // 예방접종 또는 중성화 상태입니다.
  neutralized: string;
  // 강아지를 설명하는 태그 목록입니다.
  tags: string[];
  // 강아지 사진의 주소입니다.
  image: string;
  // 생활 방식별 궁합 점수입니다.
  compatibility: Compatibility;
// 강아지 타입을 닫습니다.
}

// AI 상담 메시지 한 개의 형태입니다.
export interface Message {
  // 메시지를 보낸 사람의 종류입니다.
  id: string;
  // 사용자 메시지인지 AI 메시지인지 구분합니다.
  role: 'user' | 'assistant';
  // 메시지에 표시할 글입니다.
  content: string;
  // 메시지가 만들어진 시간입니다.
  timestamp: string;
// 메시지 타입을 닫습니다.
}
