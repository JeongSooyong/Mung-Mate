// React JSX 문법을 사용하기 위해 React를 가져옵니다.
import React from 'react';
// 카드에 표시할 강아지와 사용자 프로필 타입을 가져옵니다.
import { Dog, UserProfile } from '../types';
// 사용자와 강아지의 궁합 점수를 계산하는 함수를 가져옵니다.
import { calculateCompatibilityScore } from '../dogs-data';
// 카드에 사용할 아이콘을 가져옵니다.
import { Heart, MapPin, Sparkles } from 'lucide-react';

// 강아지 카드가 부모로부터 받는 값의 형태입니다.
interface DogCardProps {
  // React 목록에서 사용할 수 있는 선택적 키입니다.
  key?: string;
  // 카드에 표시할 강아지 정보입니다.
  dog: Dog;
  // 궁합 점수 계산에 사용할 사용자 프로필입니다.
  userProfile: UserProfile;
  // 현재 관심 목록에 포함되어 있는지 나타냅니다.
  isLiked: boolean;
  // 관심 상태를 바꾸는 부모 콜백입니다.
  onToggleLike: (dogId: string) => void;
  // 카드를 눌렀을 때 상세 화면을 여는 콜백입니다.
  onClick: () => void;
// 카드 속성 정의를 닫습니다.
}

// 한 마리의 강아지를 요약 카드로 보여주는 컴포넌트입니다.
export default function DogCard({
  // 카드에 전달된 강아지 정보를 받습니다.
  dog,
  // 카드에 전달된 사용자 프로필을 받습니다.
  userProfile,
  // 현재 관심 상태를 받습니다.
  isLiked,
  // 관심 상태 변경 함수를 받습니다.
  onToggleLike,
  // 카드 클릭 함수를 받습니다.
  onClick
}: DogCardProps) {
  // 현재 사용자와 강아지의 궁합 점수를 계산합니다.
  const matchScore = calculateCompatibilityScore(userProfile, dog);

  // 카드 전체를 클릭할 수 있는 화면 구조를 반환합니다.
  return (
    // 강아지 카드의 바깥 컨테이너입니다.
    <div 
      // 카드 클릭 시 부모의 상세 보기 동작을 실행합니다.
      onClick={onClick}
      // 카드의 배치, 색상, 그림자, 마우스 효과를 지정합니다.
      className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-mint-200/40 hover:shadow-soft-lg transition-soft transition-transform hover:-y-1 cursor-pointer flex flex-col"
      // 자동화나 스타일 구분에 사용할 카드 아이디입니다.
      id={`dog-card-${dog.id}`}
    >
      {/* 강아지 사진과 사진 위 배지를 담는 영역입니다. */}
      <div className="relative h-48 w-full overflow-hidden bg-mint-50">
        {/* 강아지 사진을 카드 비율에 맞춰 표시합니다. */}
        <img 
          src={dog.image} 
          alt={dog.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-soft"
          referrerPolicy="no-referrer"
        />
        
        {/* 사진의 글자가 잘 보이도록 아래쪽에 어두운 그라데이션을 덮습니다. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

        {/* 계산된 궁합 점수를 사진 위에 표시합니다. */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-red px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-soft">
          {/* 점수 배지의 반짝임 아이콘입니다. */}
          <Sparkles className="w-3 h-3 text-sunset fill-current" />
          {/* 계산된 점수를 글자로 표시합니다. */}
          <span>{matchScore}% 일치</span>
        {/* 점수 배지를 닫습니다. */}
        </div>

        {/* 인기 태그가 있는 강아지에게만 인기 배지를 표시합니다. */}
        {dog.tags.includes('인기') && (
          <div className="absolute top-3 right-12 bg-sunset text-[10px] font-extrabold px-1.5 py-0.5 rounded text-inkplum tracking-wider">
            인기
          </div>
        )}

        {/* 관심 목록에 추가하거나 제거하는 하트 버튼입니다. */}
        {/* 카드 클릭으로 전파되지 않도록 하트 버튼 클릭을 분리합니다. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(dog.id);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-soft transition-soft ${
            isLiked ? 'bg-coral text-white' : 'bg-white/80 backdrop-blur-xs text-inkplum hover:bg-white'
          }`}
          aria-label={isLiked ? '관심 해제' : '관심 등록'}
          id={`dog-card-heart-${dog.id}`}
        >
          {/* 관심 상태에 따라 채워지는 하트 아이콘입니다. */}
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        {/* 하트 버튼을 닫습니다. */}
        </button>

        {/* 사진 아래에 성별과 품종을 겹쳐 표시합니다. */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 items-center">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
            dog.gender === '남아' ? 'bg-indigo-600/90 text-white' : 'bg-pink-600/90 text-white'
          }`}>
            {dog.gender}
          </span>
          <span className="text-[10px] text-white/95 font-bold shadow-xs">
            {dog.breed}
          </span>
        </div>
      {/* 사진 영역을 닫습니다. */}
      </div>

      {/* 이름, 소개, 위치를 담는 카드 정보 영역입니다. */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* 이름과 나이를 한 줄에 배치합니다. */}
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-inkplum group-hover:text-coral transition-soft">
              {dog.name} <span className="text-xs font-normal text-inkplum/40">({dog.enName})</span>
            </h4>
            <span className="text-xs font-semibold text-coral bg-rose-container/50 px-2 py-0.5 rounded">
              {dog.age}
            </span>
          </div>
          
          {/* 짧은 소개를 두 줄까지 표시합니다. */}
          <p className="text-xs text-inkplum/60 font-normal line-clamp-2 mt-1 leading-relaxed">
            {dog.desc}
          </p>
        </div>

        {/* 강아지의 동네와 거리를 표시합니다. */}
        <div className="flex items-center justify-between text-[10px] text-inkplum/50 font-bold border-t border-mint-50 pt-2 shrink-0">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
            <span className="truncate max-w-[120px]">{dog.neighborhood}</span>
          </div>
          <span className="text-brand-red font-semibold">{dog.distance}</span>
        </div>
      {/* 정보 영역을 닫습니다. */}
      </div>
    {/* 카드 전체를 닫습니다. */}
    </div>
  );
// 강아지 카드 컴포넌트를 닫습니다.
}
