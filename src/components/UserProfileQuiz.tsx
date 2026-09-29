// React 이벤트 타입과 JSX를 사용하기 위해 React를 가져옵니다.
import React from 'react';
// 사용자 프로필의 자료형을 가져옵니다.
import { UserProfile } from '../types';
// 프로필 항목을 설명하는 아이콘을 가져옵니다.
import { Sparkles, Home, Activity, Clock, Smile, Save, Check } from 'lucide-react';

// 프로필 설문 컴포넌트가 부모로부터 받는 값의 형태입니다.
interface UserProfileQuizProps {
  // 현재 사용자 프로필입니다.
  userProfile: UserProfile;
  // 프로필이 바뀔 때 부모 상태를 갱신하는 콜백입니다.
  onChangeProfile: (profile: UserProfile) => void;
  // 저장 버튼을 눌렀을 때 실행할 선택적 콜백입니다.
  onSave?: () => void;
// 프로필 설문 속성 정의를 닫습니다.
}

// 사용자의 생활 환경과 반려 경험을 입력받는 설문 컴포넌트입니다.
export default function UserProfileQuiz({
  // 현재 프로필 값을 받습니다.
  userProfile,
  // 프로필을 바꾸는 함수를 받습니다.
  onChangeProfile,
  // 저장 동작을 선택적으로 받습니다.
  onSave,
}: UserProfileQuizProps) {

  // 이름 입력값을 프로필에 반영합니다.
  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 기존 프로필은 유지하고 이름만 새 값으로 교체합니다.
    onChangeProfile({ ...userProfile, name: e.target.value });
  };

  // 주거 형태 선택을 프로필에 반영합니다.
  const handleSelectHome = (home: 'apartment' | 'house' | 'studio') => {
    // 기존 프로필은 유지하고 주거 형태만 변경합니다.
    onChangeProfile({ ...userProfile, homeType: home });
  };

  // 활동량 선택을 프로필에 반영합니다.
  const handleSelectActivity = (act: 'low' | 'medium' | 'high') => {
    // 기존 프로필은 유지하고 활동량만 변경합니다.
    onChangeProfile({ ...userProfile, activityLevel: act });
  };

  // 여가 시간 선택을 프로필에 반영합니다.
  const handleSelectFreeTime = (time: 'busy' | 'normal' | 'abundant') => {
    // 기존 프로필은 유지하고 여가 시간만 변경합니다.
    onChangeProfile({ ...userProfile, freeTime: time });
  };

  // 반려견 경험 여부를 프로필에 반영합니다.
  const handleSelectExperience = (exp: boolean) => {
    // 기존 프로필은 유지하고 경험 여부만 변경합니다.
    onChangeProfile({ ...userProfile, hasPetExperience: exp });
  };

  // 프로필 입력 화면을 반환합니다.
  return (
    // 설문 전체를 감싸는 카드입니다.
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-mint-200/40 space-y-6">
      {/* 설문 제목과 설명을 보여줍니다. */}
      <div className="flex items-start gap-3.5 mb-2">
        <div className="p-3 bg-rose-container rounded-2xl text-coral">
          <Smile className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-inkplum tracking-tight">지능형 일상 & 환경 매칭</h3>
          <p className="text-sm text-inkplum/60 mt-0.5 leading-relaxed">
            나의 주거형태와 반려견 케어 성향을 상세히 조합하여 안심 가중치를 매칭합니다.
          </p>
        </div>
      </div>

      {/* 사용자가 입력할 프로필 항목들을 세로로 배치합니다. */}
      <div className="space-y-5">
        {/* 사용자 이름 입력 영역입니다. */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-inkplum/80 flex items-center gap-1.5" htmlFor="user-name-input">
            예비 반려인 동반자 이름
          </label>
          <input 
            id="user-name-input"
            type="text" 
            value={userProfile.name}
            onChange={handleUpdateName}
            placeholder="이름을 입력해 주세요"
            className="w-full px-4 py-3 rounded-xl border border-mint-200 bg-mint-50/20 text-inkplum placeholder-inkplum/40 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral text-sm transition-soft"
          />
        </div>

        {/* 주거 형태 선택 영역입니다. */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-inkplum/80 flex items-center gap-1.5" id="home-type-label">
            <Home className="w-4 h-4 text-coral" />
            주거 형태
          </label>
          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-labelledby="home-type-label">
            <button
              onClick={() => handleSelectHome('apartment')}
              aria-checked={userProfile.homeType === 'apartment'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.homeType === 'apartment'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              아파트/빌라
            </button>
            <button
              onClick={() => handleSelectHome('house')}
              aria-checked={userProfile.homeType === 'house'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.homeType === 'house'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              단독 주택
            </button>
            <button
              onClick={() => handleSelectHome('studio')}
              aria-checked={userProfile.homeType === 'studio'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.homeType === 'studio'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              원룸/스튜디오
            </button>
          </div>
        </div>

        {/* 야외 활동량 선택 영역입니다. */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-inkplum/80 flex items-center gap-1.5" id="activity-level-label">
            <Activity className="w-4 h-4 text-coral" />
            야외 활동 성향
          </label>
          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-labelledby="activity-level-label">
            <button
              onClick={() => handleSelectActivity('low')}
              aria-checked={userProfile.activityLevel === 'low'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.activityLevel === 'low'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              여유로운 차분형
            </button>
            <button
              onClick={() => handleSelectActivity('medium')}
              aria-checked={userProfile.activityLevel === 'medium'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.activityLevel === 'medium'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              주말공원 산책형
            </button>
            <button
              onClick={() => handleSelectActivity('high')}
              aria-checked={userProfile.activityLevel === 'high'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.activityLevel === 'high'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              액티브 런닝 메이트
            </button>
          </div>
        </div>

        {/* 강아지와 함께할 수 있는 시간 선택 영역입니다. */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-inkplum/80 flex items-center gap-1.5" id="free-time-label">
            <Clock className="w-4 h-4 text-coral" />
            주변에 함께 머무르는 시간
          </label>
          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-labelledby="free-time-label">
            <button
              onClick={() => handleSelectFreeTime('busy')}
              aria-checked={userProfile.freeTime === 'busy'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.freeTime === 'busy'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              바쁜 직장인 (출퇴근)
            </button>
            <button
              onClick={() => handleSelectFreeTime('normal')}
              aria-checked={userProfile.freeTime === 'normal'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.freeTime === 'normal'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              유연 근무 밸런스형
            </button>
            <button
              onClick={() => handleSelectFreeTime('abundant')}
              aria-checked={userProfile.freeTime === 'abundant'}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.freeTime === 'abundant'
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              하루 종일 밀착 케어형
            </button>
          </div>
        </div>

        {/* 반려견 경험 선택 영역입니다. */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-inkplum/80 flex items-center gap-1.5" id="experience-label">
            <Sparkles className="w-4 h-4 text-coral" />
            반려견을 키워본 경험
          </label>
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="experience-label">
            <button
              onClick={() => handleSelectExperience(false)}
              aria-checked={!userProfile.hasPetExperience}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                !userProfile.hasPetExperience
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              서서히 동반하는 초보 🐾
            </button>
            <button
              onClick={() => handleSelectExperience(true)}
              aria-checked={userProfile.hasPetExperience}
              role="radio"
              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-soft cursor-pointer ${
                userProfile.hasPetExperience
                  ? 'border-coral bg-rose-container/40 text-brand-red font-bold'
                  : 'border-mint-200 hover:border-mint-200/80 bg-transparent text-inkplum/80'
              }`}
            >
              든든한 베테랑 유경험자 🛡️
            </button>
          </div>
        </div>
      {/* 프로필 항목 영역을 닫습니다. */}
      </div>

      {/* 저장 콜백이 있을 때만 저장 버튼을 표시합니다. */}
      {onSave && (
        <button
          onClick={onSave}
          className="w-full mt-2 py-3.5 bg-spectrum text-white hover:opacity-90 font-bold rounded-xl flex items-center justify-center gap-2 shadow-soft transition-soft hover:shadow-soft-lg cursor-pointer"
          id="btn-quiz-save"
        >
          {/* 저장 완료를 의미하는 체크 아이콘입니다. */}
          <Check className="w-5 h-5" />
          <span>매칭 지표 저장 & 반영하기</span>
        </button>
      )}
    {/* 설문 카드 전체를 닫습니다. */}
    </div>
  );
// 프로필 설문 컴포넌트를 닫습니다.
}
