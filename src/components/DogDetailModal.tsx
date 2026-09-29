// React와 접근성 연결에 사용할 고유 아이디 기능을 가져옵니다.
import React, { useId } from 'react';
// 상세 화면에 사용할 강아지와 사용자 프로필 타입을 가져옵니다.
import { Dog, UserProfile } from '../types';
// 상세 화면에서 궁합 점수를 계산할 함수를 가져옵니다.
import { calculateCompatibilityScore } from '../dogs-data';
// 상세 화면에 사용할 아이콘을 가져옵니다.
import { X, MapPin, Sparkles, ShieldCheck, Scale, Calendar, Heart, MessageSquare } from 'lucide-react';
// 모달 등장과 사라짐 애니메이션을 가져옵니다.
import { motion, AnimatePresence } from 'motion/react';

// 상세 모달이 부모로부터 받는 값의 형태입니다.
interface DogDetailModalProps {
  // 현재 선택된 강아지이며 선택 전에는 null입니다.
  dog: Dog | null;
  // 모달을 닫는 콜백입니다.
  onClose: () => void;
  // 궁합 점수 계산에 사용할 사용자 프로필입니다.
  userProfile: UserProfile;
  // 관심 목록에 포함되었는지 나타냅니다.
  isLiked: boolean;
  // 관심 상태를 바꾸는 콜백입니다.
  onToggleLike: (dogId: string) => void;
  // 상담 탭으로 이동시키는 콜백입니다.
  onStartChat: (dogName: string) => void;
// 상세 모달 속성 정의를 닫습니다.
}

// 선택한 강아지의 상세 정보와 상담 진입 버튼을 보여주는 모달입니다.
export default function DogDetailModal({
  // 선택한 강아지 정보를 받습니다.
  dog,
  // 모달 닫기 함수를 받습니다.
  onClose,
  // 사용자 프로필을 받습니다.
  userProfile,
  // 관심 상태를 받습니다.
  isLiked,
  // 관심 상태 변경 함수를 받습니다.
  onToggleLike,
  // 상담 시작 함수를 받습니다.
  onStartChat,
}: DogDetailModalProps) {
  // 제목과 대화상자를 연결할 고유 아이디를 만듭니다.
  const headingId = useId();
  // 선택된 강아지가 없으면 모달을 렌더링하지 않습니다.
  if (!dog) return null;

  // 현재 사용자와 선택한 강아지의 궁합 점수를 계산합니다.
  const score = calculateCompatibilityScore(userProfile, dog);

  // 점수 구간에 맞는 쉬운 설명을 반환합니다.
  const getScoreMessage = (s: number) => {
    // 가장 높은 궁합의 설명입니다.
    if (s >= 90) return '우주 최강의 궁합! 서로가 첫눈에 반하기 충분해요 ✨';
    if (s >= 80) return '아주 좋은 시너지! 라이프스타일이 쾌적하게 맞닿아 있습니다 🌱';
    if (s >= 65) return '다정한 조율형 궁합. 서로 한 걸음씩 맞춰 성장하는 보람이 있어요!';
    return '독특한 개성의 수란형 매칭. 조금의 공부와 세심한 보듬이 필요해요 🐾';
  };

  // 애니메이션이 적용된 상세 모달을 반환합니다.
  return (
    <AnimatePresence>
      {/* 화면 전체를 덮는 접근 가능한 대화상자 영역입니다. */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkplum/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        {/* 모달 본체에 등장과 퇴장 애니메이션을 적용합니다. */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-soft-lg max-h-[90vh] flex flex-col"
        >
          {/* 강아지 사진과 핵심 정보를 보여주는 상단 영역입니다. */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-mint-50">
            <img 
              src={dog.image} 
              alt={dog.name} 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inkplum/40 via-transparent to-transparent" />
            
            {/* 관심 등록과 모달 닫기 버튼을 사진 위에 배치합니다. */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(dog.id);
                }}
                className={`p-3 rounded-full shadow-soft transition-soft ${
                  isLiked ? 'bg-coral text-white' : 'bg-white/80 backdrop-blur-xs text-inkplum hover:bg-white'
                }`}
                aria-label={isLiked ? '관심 목록에서 제거' : '관심 등록'}
                id={`modal-like-${dog.id}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-white/80 backdrop-blur-xs text-inkplum hover:bg-white shadow-soft transition-soft"
                aria-label="모달 닫기"
                id={`modal-close-${dog.id}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 품종, 이름, 위치를 사진 아래에 겹쳐 표시합니다. */}
            <div className="absolute bottom-6 left-6 right-6 text-white text-wrap">
              <span className="inline-block bg-coral text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                {dog.breed}
              </span>
              <h2 id={headingId} className="text-3xl font-bold tracking-tight mb-1">
                {dog.name} <span className="text-lg font-normal opacity-85">({dog.enName})</span>
              </h2>
              <div className="flex items-center gap-2 text-sm opacity-90 font-medium">
                <MapPin className="w-4 h-4 text-sunset shrink-0" />
                <span>{dog.location}</span>
              </div>
            </div>
          </div>

          {/* 상세 내용을 스크롤할 수 있는 본문 영역입니다. */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* 사용자와 강아지의 궁합 점수 카드입니다. */}
            <div className="p-6 hope-gradient rounded-2xl text-white relative overflow-hidden shadow-soft-lg">
              {/* 카드에 은은한 빛을 더하는 장식 레이어입니다. */}
              <div className="absolute inset-0 bg-radial-to-r from-white/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between gap-4 relative z-10 mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sunset fill-current" />
                  <span className="font-semibold text-sm tracking-wide opacity-90">MungMate AI 안심 적합성 리포트</span>
                </div>
                <div className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                  {userProfile.name} 님과의 궁합
                </div>
              </div>

              <div className="flex items-end gap-x-3 relative z-10">
                <span className="text-5xl font-extrabold tracking-tight" id={`modal-match-score-${dog.id}`}>
                  {score}%
                </span>
                <span className="text-lg font-semibold pb-1 tracking-tight">
                  {score >= 90 ? '운명적인 매칭!' : score >= 85 ? '찰떡궁합' : '포근한 단짝'}
                </span>
              </div>
              <p className="text-xs md:text-sm mt-2 opacity-95 relative z-10 font-medium leading-relaxed">
                {getScoreMessage(score)}
              </p>
            </div>

            {/* 강아지의 특징 태그를 나열합니다. */}
            <div className="flex flex-wrap gap-2">
              {dog.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    idx === 0 
                      ? 'bg-rose-container text-brand-red border border-coral-200' 
                      : 'bg-mint-200 text-inkplum hover:bg-mint-200/80'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 나이, 성별, 몸무게, 중성화 상태를 격자로 표시합니다. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-salmon-bg border border-coral/10 rounded-xl flex flex-col items-center justify-center text-center">
                <Calendar className="w-5 h-5 text-coral mb-1 shrink-0" />
                <span className="text-[11px] text-coral/70 font-semibold uppercase tracking-wider block">나이</span>
                <span className="text-sm font-extrabold text-inkplum block mt-0.5">{dog.age}</span>
              </div>
              
              <div className="p-3 bg-salmon-bg border border-coral/10 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-coral leading-none mb-1">
                  {dog.gender === '남아' ? '♂' : '♀'}
                </span>
                <span className="text-[11px] text-coral/70 font-semibold uppercase tracking-wider block">성별</span>
                <span className="text-sm font-extrabold text-inkplum block mt-0.5">{dog.gender}</span>
              </div>

              <div className="p-3 bg-salmon-bg border border-coral/10 rounded-xl flex flex-col items-center justify-center text-center">
                <Scale className="w-5 h-5 text-coral mb-1 shrink-0" />
                <span className="text-[11px] text-coral/70 font-semibold uppercase tracking-wider block">몸무게</span>
                <span className="text-sm font-extrabold text-inkplum block mt-0.5">{dog.weight}</span>
              </div>

              <div className="p-3 bg-salmon-bg border border-coral/10 rounded-xl flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-5 h-5 text-coral mb-1 shrink-0" />
                <span className="text-[11px] text-coral/70 font-semibold uppercase tracking-wider block">중성화 수술</span>
                <span className="text-sm font-extrabold text-inkplum block mt-0.5">{dog.neutralized}</span>
              </div>
            </div>

            {/* 강아지의 자세한 소개를 표시합니다. */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight text-inkplum">아이 정보</h3>
              <p className="text-sm text-inkplum/80 leading-relaxed font-normal bg-salmon-bg/40 p-4 rounded-2xl border border-coral/5">
                {dog.fullDesc}
              </p>
            </div>

            {/* 입양 지원 안내와 보장 내용을 표시합니다. */}
            <div className="p-4 bg-mint-50 border border-mint-200/60 rounded-xl text-xs text-inkplum/70 leading-relaxed font-normal">
              💡 <strong>MungMate 안심 보장제:</strong> 모든 입양아는 건강 검진 및 기초 위생 케어를 마쳤으며, 입양 희망자 전원에게 1:1 맞춤 영양 설계 가이드 및 무료 평생 안심 교육 원격 서비스를 지원합니다.
            </div>
          </div>

          {/* 상담을 시작하는 하단 행동 영역입니다. */}
          <div className="p-4 md:p-6 bg-salmon-bg border-t border-coral/10 flex gap-3">
            <button
              onClick={() => onStartChat(dog.name)}
              className="flex-1 py-3.5 hope-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2 soft-shadow transition-soft cursor-pointer text-sm md:text-base hover:scale-[1.01] active:scale-95"
              id={`modal-chat-start-${dog.id}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>하루(Haru)에게 {dog.name} 입양 매칭 문의하기</span>
            </button>
          </div>
        {/* 모달 본체를 닫습니다. */}
        </motion.div>
      </div>
    </AnimatePresence>
  );
// 상세 모달 컴포넌트를 닫습니다.
}
