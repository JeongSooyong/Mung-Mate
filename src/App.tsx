// React 상태와 생명주기 기능을 가져옵니다.
import React, { useState, useEffect } from 'react';
// 화면에서 사용할 데이터 타입을 가져옵니다.
import { Dog, UserProfile, Message } from './types';
// 등록된 강아지 목록을 가져옵니다.
import { DOGS_DATA } from './dogs-data';
// 강아지 요약 카드를 가져옵니다.
import DogCard from './components/DogCard';
// 사용자 프로필 설문 컴포넌트를 가져옵니다.
import UserProfileQuiz from './components/UserProfileQuiz';
// AI 상담 컴포넌트를 가져옵니다.
import CareAdvisorAI from './components/CareAdvisorAI';
// 강아지 상세 모달을 가져옵니다.
import DogDetailModal from './components/DogDetailModal';
// 내비게이션과 상태 표현에 사용할 아이콘을 가져옵니다.
import { 
  Heart, 
  Sparkles, 
  MessageSquare, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  PawPrint,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
// 탭과 모달 전환에 사용할 애니메이션 기능을 가져옵니다.
import { motion, AnimatePresence } from 'motion/react';

// MungMate 전체 화면을 관리하는 최상위 컴포넌트입니다.
export default function App() {
  // 현재 선택된 화면 탭을 저장합니다.
  // Current active tab state
  const [activeTab, setActiveTab] = useState<'recommend' | 'search' | 'ai' | 'likes'>('recommend');
  
  // Local storage lists for persistence
  // 관심 목록을 상태로 저장하고 처음에는 브라우저 저장소에서 읽습니다.
  const [likedDogs, setLikedDogs] = useState<string[]>(() => {
    // 이전에 저장된 관심 목록을 가져옵니다.
    const saved = localStorage.getItem('mungmate_saved_likes');
    // 저장값이 없으면 기본 관심 강아지로 망고를 사용합니다.
    return saved ? JSON.parse(saved) : ['mango']; // Default liked
  });

  // User Profile configuration
  // 사용자 프로필을 상태로 저장하고 저장된 값을 우선 사용합니다.
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // 이전 프로필을 브라우저 저장소에서 읽습니다.
    const saved = localStorage.getItem('mungmate_profile');
    // 저장값이 없을 때 사용할 기본 프로필입니다.
    return saved ? JSON.parse(saved) : {
      homeType: 'apartment',
      activityLevel: 'medium',
      freeTime: 'normal',
      hasPetExperience: false,
      name: '김은지'
    };
  });

  // Dynamic state for selected dog modal
  // 상세 모달에 표시할 강아지를 저장합니다.
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  // Prepopulate messaging context state
  // 상세 화면에서 AI 탭으로 넘길 상담 문장을 저장합니다.
  const [pendingAIMessage, setPendingAIMessage] = useState<string | null>(null);

  // Search tab configurations
  // 품종과 이름 검색어를 저장합니다.
  const [searchBreedQuery, setSearchBreedQuery] = useState("");
  // 지역 검색 조건을 저장합니다.
  const [searchRegionFilter, setSearchRegionFilter] = useState<string>("all");
  // 성별 검색 조건을 저장합니다.
  const [searchGenderFilter, setSearchGenderFilter] = useState<string>("all");
  // 연령 검색 조건을 저장합니다.
  const [searchAgeFilter, setSearchAgeFilter] = useState<string>("all");

  // Notification Drawer State
  // 알림 패널의 표시 여부를 저장합니다.
  const [showNotifications, setShowNotifications] = useState(false);
  // 읽지 않은 알림이 있는지 저장합니다.
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  // 화면에 표시할 알림 샘플 목록입니다.
  const notifications = [
    { id: 1, title: '하루의 맞춤 매칭 성과', text: '김은지 님을 위한 맞춤 비숑 프리제 [두부]의 가중치가 분석되었습니다.', time: '방금 전' },
    { id: 2, title: '안심 동반 훈련 꿀팁', text: '초보 반려인 안심 가이드북 다운로드 서비스가 활성화되었습니다.', time: '3시간 전' },
    { id: 3, title: '입양 축하 희망 편지', text: '이전 입양자 소식: 연남동 망고 형님네 평화 소식이 도달했습니다.', time: '어제' }
  ];

  // User Profile Custom Drawer State
  // 오른쪽 프로필 서랍의 표시 여부를 저장합니다.
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Sync state to localStorage
  // 관심 목록이 바뀔 때마다 브라우저 저장소에 기록합니다.
  useEffect(() => {
    localStorage.setItem('mungmate_saved_likes', JSON.stringify(likedDogs));
  }, [likedDogs]);

  // 사용자 프로필이 바뀔 때마다 브라우저 저장소에 기록합니다.
  useEffect(() => {
    localStorage.setItem('mungmate_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Heart toggle trigger
  // 강아지를 관심 목록에 추가하거나 제거합니다.
  const handleToggleLike = (dogId: string) => {
    // 이전 목록을 기준으로 선택 상태를 뒤집습니다.
    setLikedDogs(prev => {
      if (prev.includes(dogId)) {
        return prev.filter(id => id !== dogId);
      } else {
        return [...prev, dogId];
      }
    });

    // Short-lived notifications when hearted
    // 관심 변경이 있었음을 알림 표시로 알려줍니다.
    setHasNewNotifications(true);
  };

  // Direct inquire action inside dog details
  // 강아지 상세 정보에서 AI 상담으로 이동할 문장을 준비합니다.
  const handleStartInquiryChat = (dogName: string) => {
    // 이름으로 품종 정보를 찾아 상담 문장에 넣습니다.
    const breedInfo = DOGS_DATA.find(d => d.name === dogName)?.breed || "우리 센터 강아지";
    // 사용자 주거 형태와 강아지 이름을 포함한 첫 질문을 만듭니다.
    const initialMsg = `안녕하세요! 인연을 진정으로 예우하고 싶어 망설임 끝에 상담을 요청합니다. ${dogName}(${breedInfo})는 저의 주거 형태인 ${userProfile.homeType === 'apartment' ? '아파트' : userProfile.homeType === 'studio' ? '원룸' : '단독 주택'}와 일상에서 어떤 매칭 성향을 최대로 발휘할 수 있을까요?`;
    
    // AI 화면에 전달할 문장을 보관합니다.
    setPendingAIMessage(initialMsg);
    // 현재 열린 상세 모달을 닫습니다.
    setSelectedDog(null); // Close modal
    // AI 상담 탭으로 전환합니다.
    setActiveTab('ai'); // Switch to Haru AI Advisor tab
  };

  // Highlight Hero Dog
  // 첫 번째 강아지를 추천 화면의 대표 강아지로 사용합니다.
  const heroDog = DOGS_DATA[0]; // 망고 (Mango)

  // Filtered Dogs computed list
  // 검색 조건에 맞는 강아지만 남긴 목록을 계산합니다.
  const filteredDogs = DOGS_DATA.filter(dog => {
    // 1. Breed search filter
    if (searchBreedQuery.trim() !== "") {
      const q = searchBreedQuery.toLowerCase();
      const breedMatch = dog.breed.toLowerCase().includes(q);
      const nameMatch = dog.name.toLowerCase().includes(q);
      const enMatch = dog.enName.toLowerCase().includes(q);
      if (!breedMatch && !nameMatch && !enMatch) return false;
    }

    // 2. Region / Address filter
    if (searchRegionFilter !== "all") {
      if (!dog.location.includes(searchRegionFilter)) return false;
    }

    // 3. Gender filter
    if (searchGenderFilter !== "all") {
      if (dog.gender !== searchGenderFilter) return false;
    }

    // 4. Age filter
    if (searchAgeFilter !== "all") {
      if (searchAgeFilter === "puppy" && !dog.age.includes("개월")) return false;
      if (searchAgeFilter === "adult" && dog.age.includes("개월")) return false;
    }

    return true;
  });

  // 전체 앱 화면과 현재 선택된 보조 화면을 반환합니다.
  return (
    <div className="min-h-screen bg-mint-100 font-sans text-inkplum flex flex-col selection:bg-rose-container selection:text-brand-red">
      
      {/* 1. 전역 내비게이션과 알림/프로필 도구를 표시합니다. */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mint-200/50 shadow-soft" id="mungmate-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* 왼쪽에는 브랜드 로고와 홈 이동 영역을 표시합니다. */}
          <div 
            onClick={() => setActiveTab('recommend')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl hope-gradient flex items-center justify-center text-white font-extrabold soft-shadow transition-soft group-hover:rotate-12">
              <PawPrint className="w-5.5 h-5.5 fill-current" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#b52331] tracking-tight leading-none">MungMate</span>
              <span className="text-[10px] text-inkplum/55 font-bold block tracking-wider uppercase mt-0.5">Hopeful Companion</span>
            </div>
          </div>

          {/* 가운데에는 데스크톱용 주요 탭을 표시합니다. */}
          <nav className="hidden md:flex items-center gap-1 bg-mint-50 p-1.5 rounded-2xl border border-mint-200/30">
            <button
              onClick={() => setActiveTab('recommend')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-soft cursor-pointer ${
                activeTab === 'recommend' 
                  ? 'bg-white text-brand-red shadow-soft' 
                  : 'text-inkplum/60 hover:text-inkplum hover:bg-white/40'
              }`}
              id="nav-tab-recommend"
            >
              매칭추천
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-soft cursor-pointer ${
                activeTab === 'search' 
                  ? 'bg-white text-brand-red shadow-soft' 
                  : 'text-inkplum/60 hover:text-inkplum hover:bg-white/40'
              }`}
              id="nav-tab-search"
            >
              상세검색
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-soft cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai' 
                  ? 'hope-gradient text-white soft-shadow font-extrabold' 
                  : 'text-inkplum/60 hover:text-inkplum hover:bg-white/40'
              }`}
              id="nav-tab-ai"
            >
              <Sparkles className="w-4 h-4 text-sunset fill-current" />
              <span>안심케어 AI</span>
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-soft cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'likes' 
                  ? 'bg-white text-brand-red shadow-soft' 
                  : 'text-inkplum/60 hover:text-inkplum hover:bg-white/40'
              }`}
              id="nav-tab-likes"
            >
              <Heart className={`w-4 h-4 ${activeTab === 'likes' ? 'fill-current text-coral' : ''}`} />
              <span>내 관심 ({likedDogs.length})</span>
            </button>
          </nav>

          {/* 오른쪽에는 알림과 프로필 버튼을 표시합니다. */}
          <div className="flex items-center gap-3">
            {/* 알림 버튼과 알림 개수 표시 영역입니다. */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setHasNewNotifications(false);
                }}
                className={`p-3 rounded-xl border border-mint-200/50 bg-mint-50/20 text-inkplum hover:bg-mint-50 shadow-xs transition-soft relative cursor-pointer`}
                aria-label="알림"
                id="btn-bell"
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifications && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-coral rounded-full border-2 border-white ring-1 ring-coral/20 animate-ping" />
                )}
              </button>

              {/* 알림 버튼을 눌렀을 때만 알림 목록을 표시합니다. */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-soft-lg border border-mint-200 overflow-hidden z-50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-mint-50 pb-2">
                      <span className="font-extrabold text-xs text-inkplum tracking-wider uppercase">안심 알림 보드</span>
                      <button onClick={() => setShowNotifications(false)} className="text-inkplum/40 hover:text-inkplum" aria-label="닫기">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl hover:bg-mint-50/50 border border-transparent hover:border-mint-200/20 transition-soft text-left">
                          <h5 className="font-bold text-xs text-brand-red flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-coral rounded-full" />
                            {n.title}
                          </h5>
                          <p className="text-[11px] text-inkplum/70 font-medium mt-0.5 leading-relaxed">{n.text}</p>
                          <span className="text-[9px] text-inkplum/35 block mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 프로필 수정 서랍을 여는 버튼입니다. */}
            <button
              onClick={() => setShowProfileDrawer(true)}
              className="px-4 py-2 bg-rose-container hover:bg-rose-container/80 border border-coral/10 text-brand-red rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-soft cursor-pointer"
              id="btn-user-profile-toggle"
            >
              <User className="w-4 h-4" />
              <span>{userProfile.name} 님</span>
            </button>
          </div>
        </div>

        {/* 작은 화면에서는 하단 탭 내비게이션을 표시합니다. */}
        <div className="md:hidden flex h-14 border-t border-mint-100 bg-white items-center justify-around text-xs font-bold">
          <button 
            onClick={() => setActiveTab('recommend')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'recommend' ? 'text-brand-red' : 'text-inkplum/40'}`}
          >
            <PawPrint className="w-5 h-5" />
            <span>매칭추천</span>
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-brand-red' : 'text-inkplum/40'}`}
          >
            <Search className="w-5 h-5" />
            <span>상세검색</span>
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-brand-red font-extrabold' : 'text-inkplum/40'}`}
          >
            <Sparkles className="w-5 h-5 fill-current text-sunset animate-pulse" />
            <span>안심 AI</span>
          </button>
          <button 
            onClick={() => setActiveTab('likes')}
            className={`flex flex-col items-center gap-1 relative ${activeTab === 'likes' ? 'text-brand-red' : 'text-inkplum/40'}`}
          >
            <Heart className="w-5 h-5" />
            <span>관심 {likedDogs.length > 0 && `(${likedDogs.length})`}</span>
          </button>
        </div>
      </header>

      {/* 2. 현재 탭의 본문 콘텐츠를 표시합니다. */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* 탭 1: 사용자 프로필에 맞는 추천 화면입니다. */}
          {activeTab === 'recommend' && (
            <motion.div
              key="recommend-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* 추천 화면의 제목과 설명입니다. */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-inkplum">매칭추천</h1>
                <p className="text-sm md:text-base text-inkplum/60 font-medium max-w-2xl mx-auto">
                  당신과 완벽한 호흡을 자랑할 친구를 만나보세요. 상호 조화로운 라이프스타일을 진단합니다.
                </p>
              </div>

              {/* 대표 강아지 망고를 강조하는 큰 추천 카드입니다. */}
              <div 
                onClick={() => setSelectedDog(heroDog)}
                className="hope-border soft-shadow transition-soft cursor-pointer"
                id="hero-dog-matching-banner"
              >
                <div className="hope-border-inner overflow-hidden flex flex-col md:flex-row relative bg-white w-full h-full">
                  {/* 카드 왼쪽에 대표 강아지 사진을 표시합니다. */}
                  <div className="md:w-[48%] relative bg-mint-50 min-h-64 md:min-h-96">
                    <img 
                      src={heroDog.image} 
                      alt={heroDog.name} 
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    {/* Decorative background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/90 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:hidden" />
                  </div>

                  {/* 대표 강아지의 관심 상태를 바꾸는 하트 버튼입니다. */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(heroDog.id);
                    }}
                    className={`absolute top-6 right-6 p-3.5 rounded-full shadow-soft z-10 transition-soft ${
                      likedDogs.includes(heroDog.id) 
                        ? 'bg-coral text-white' 
                        : 'bg-white/90 backdrop-blur-xs text-inkplum hover:bg-white'
                    }`}
                    aria-label={likedDogs.includes(heroDog.id) ? '관심 목록에서 제거' : '관심 등록'}
                    id="btn-hero-heart"
                  >
                    <Heart className={`w-5 h-5 ${likedDogs.includes(heroDog.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* 카드 오른쪽에 대표 강아지의 설명을 표시합니다. */}
                  <div className="p-6 md:p-10 flex-1 flex flex-col justify-center space-y-4 md:pl-8">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-coral text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                        궁금했던 강아지
                      </span>
                      <span className="bg-mint-200 text-inkplum/80 text-xs font-bold px-3 py-1 rounded-full">
                        친화력 갑 코기 믹스
                      </span>
                      <span className="bg-spectrum text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 text-sunset fill-current" />
                        <span>기은지 님과 {heroDog.compatibility.activeOwner}% 일칭</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-extrabold text-inkplum tracking-tight leading-none">
                        {heroDog.name} <span className="text-xl md:text-2xl font-normal text-inkplum/50">({heroDog.enName})</span>
                      </h2>
                    </div>

                    <p className="text-xs md:text-sm text-inkplum/70 font-medium leading-relaxed max-w-lg">
                      {heroDog.desc} 망고는 낯섬을 뛰어넘는 해사한 미소로 언제든 반려견 맞이의 무게를 훌륭히 덜어줄 사교성의 명수입니다.
                    </p>

                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-inkplum/60 bg-mint-50/50 p-2.5 rounded-xl border border-mint-200/25 w-fit">
                      <MapPin className="w-4 h-4 text-coral shrink-0" />
                      <span>서울 마포구 연남동 • 2.5km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 대표 강아지 아래에 다른 추천 강아지 목록을 표시합니다. */}
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-inkplum tracking-tight flex items-center gap-2">
                      <PawPrint className="w-6 h-6 text-coral" />
                      <span>매칭 반려견</span>
                    </h3>
                    <p className="text-xs text-inkplum/50 font-medium mt-1">우리 숲속 마당에서 당신을 기다리는 따스한 천사들</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchBreedQuery("");
                      setActiveTab('search');
                    }}
                    className="text-brand-red hover:text-coral text-sm font-extrabold flex items-center gap-0.5 leading-none transition-soft cursor-pointer"
                    id="btn-view-all"
                  >
                    <span>모두 보기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 대표 강아지를 제외한 강아지 카드를 한 줄 목록으로 표시합니다. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Dubu, Tori, Shiba, Bori exclusion of Hero */}
                  {DOGS_DATA.filter(d => d.id !== 'mango').map((dog) => (
                    <DogCard 
                      key={dog.id}
                      dog={dog}
                      userProfile={userProfile}
                      isLiked={likedDogs.includes(dog.id)}
                      onToggleLike={handleToggleLike}
                      onClick={() => setSelectedDog(dog)}
                    />
                  ))}
                </div>
              </div>

              {/* 추천 점수에 반영할 사용자 프로필 설정 영역입니다. */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                  <div className="hope-gradient p-5 rounded-3xl text-white soft-shadow">
                    <Award className="w-8 h-8 text-sunset fill-current mb-3" />
                    <h4 className="text-lg font-bold leading-tight">입양 성향 진단서</h4>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                      오른쪽의 상세 요소들을 변경 시, 플랫폼 내 모든 아이들의 <strong>MungMate 안심 매칭 %</strong>가 그에 맞춰 정교하게 재계산됩니다.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-mint-200/25 text-xs text-inkplum/50 leading-relaxed font-normal">
                    💡 <strong>Tip:</strong> 1인가구 직장인 환경이라면 독립심 강한 중형견(시바)을, 좁은 아파트 거주라면 헛짖음이 극단적으로 적고 털 안 빠지는 소형견(두부)을 추천합니다.
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <UserProfileQuiz 
                    userProfile={userProfile}
                    onChangeProfile={setUserProfile}
                  />
                </div>
              </div>

            </motion.div>
          )}

          {/* 탭 2: 품종, 지역, 성별, 연령으로 찾는 상세 검색 화면입니다. */}
          {activeTab === 'search' && (
            <motion.div
              key="search-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* 검색 조건을 입력하는 상단 필터 카드입니다. */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft border border-mint-200/30 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-inkplum tracking-tight">안심 맞춤 상세 검색</h2>
                  <p className="text-xs md:text-sm text-inkplum/50 font-medium">품종, 성별, 나이, 지역 필터를 정렬하여 찾으시는 동반 성향을 특정합니다.</p>
                </div>

                {/* 네 가지 검색 조건을 격자로 배치합니다. */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  
                  {/* 품종 또는 이름 검색 입력입니다. */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-bold text-inkplum/75 block" htmlFor="breed-search-input">품종 및 이름 검색</label>
                    <div className="relative">
                      <input 
                        id="breed-search-input"
                        type="text"
                        value={searchBreedQuery}
                        onChange={(e) => setSearchBreedQuery(e.target.value)}
                        placeholder="예: 망고, 비숑, 테리어..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mint-200 text-xs text-inkplum bg-mint-50/10 focus:outline-none focus:border-coral transition-soft"
                      />
                      <Search className="w-3.5 h-3.5 text-inkplum/40 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* 지역 선택 입력입니다. */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-inkplum/75 block" htmlFor="region-select">활동 영역 (서울 자치구)</label>
                    <select
                      id="region-select"
                      value={searchRegionFilter}
                      onChange={(e) => setSearchRegionFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-mint-200 text-xs text-inkplum bg-white focus:outline-none focus:border-coral cursor-pointer"
                    >
                      <option value="all">전체 자치구</option>
                      <option value="마포구">마포구 (연남, 성산)</option>
                      <option value="용산구">용산구 (한남)</option>
                      <option value="강남구">강남구 (역삼)</option>
                      <option value="성동구">성동구 (성수)</option>
                    </select>
                  </div>

                  {/* 성별 선택 입력입니다. */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-inkplum/75 block" htmlFor="gender-select">반려 아이 성별</label>
                    <select
                      id="gender-select"
                      value={searchGenderFilter}
                      onChange={(e) => setSearchGenderFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-mint-200 text-xs text-inkplum bg-white focus:outline-none focus:border-coral cursor-pointer"
                    >
                      <option value="all">전체 성별</option>
                      <option value="남아">멋쟁이 남아 (♂)</option>
                      <option value="여아">사랑스런 여아 (♀)</option>
                    </select>
                  </div>

                  {/* 연령 선택 입력입니다. */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-inkplum/75 block" htmlFor="age-select">성장 연령 범주</label>
                    <select
                      id="age-select"
                      value={searchAgeFilter}
                      onChange={(e) => setSearchAgeFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-mint-200 text-xs text-inkplum bg-white focus:outline-none focus:border-coral cursor-pointer"
                    >
                      <option value="all">전체 연령대</option>
                      <option value="puppy">아기 강아지 (1년 미만 소형아)</option>
                      <option value="adult">듬직한 성견 (1년 이상 중지견)</option>
                    </select>
                  </div>
                </div>

                {/* 검색 결과 수와 초기화 버튼을 표시합니다. */}
                <div className="flex justify-between items-center bg-mint-50/50 p-3.5 rounded-xl border border-mint-200/20 text-xs text-inkplum/60 font-semibold">
                  <span>총 <strong className="text-brand-red text-sm">{filteredDogs.length}</strong> 마리의 소중한 아이가 조건에 맞춰 손짓합니다.</span>
                  <button 
                    onClick={() => {
                      setSearchBreedQuery("");
                      setSearchRegionFilter("all");
                      setSearchGenderFilter("all");
                      setSearchAgeFilter("all");
                    }}
                    className="text-brand-red font-extrabold hover:underline cursor-pointer"
                  >
                    필터 전체 초기화
                  </button>
                </div>
              </div>

              {/* 검색 결과가 있으면 카드 목록을, 없으면 안내 문구를 표시합니다. */}
              {filteredDogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDogs.map((dog) => (
                    <DogCard 
                      key={dog.id}
                      dog={dog}
                      userProfile={userProfile}
                      isLiked={likedDogs.includes(dog.id)}
                      onToggleLike={handleToggleLike}
                      onClick={() => setSelectedDog(dog)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-mint-200/35 shadow-soft space-y-4">
                  <PawPrint className="w-16 h-16 text-mint-200 mx-auto stroke-1" />
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-inkplum">부합하는 아이가 센터에 숨어있나 봐요</h4>
                    <p className="text-xs text-inkplum/50 font-normal max-w-sm mx-auto">전체 검색 리포트를 위해 필터를 가볍게 넓혀보시거나 하루 상담실에 입양 보듬을 제보해 보세요!</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchBreedQuery("");
                      setSearchRegionFilter("all");
                      setSearchGenderFilter("all");
                      setSearchAgeFilter("all");
                    }}
                    className="px-5 py-2.5 bg-mint-100 hover:bg-mint-200 border border-mint-200/50 text-inkplum font-bold rounded-xl text-xs transition-soft cursor-pointer"
                  >
                    조건 다시 불러오기
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 탭 3: 하루 AI 상담과 걱정 리프레임 화면입니다. */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <CareAdvisorAI 
                userProfile={userProfile}
                initialMessageToSend={pendingAIMessage}
                onClearInitialMessage={() => setPendingAIMessage(null)}
              />
            </motion.div>
          )}

          {/* 탭 4: 사용자가 관심 표시한 강아지 목록입니다. */}
          {activeTab === 'likes' && (
            <motion.div
              key="likes-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-coral fill-current" />
                <div>
                  <h2 className="text-2xl font-extrabold text-inkplum tracking-tight">나의 안심 관심 목록 ({likedDogs.length})</h2>
                  <p className="text-xs text-inkplum/55 font-medium mt-0.5">관심을 표하신 반려 아이들의 일상 적합도가 상시 대기 중입니다.</p>
                </div>
              </div>

              {likedDogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {DOGS_DATA.filter(dog => likedDogs.includes(dog.id)).map((dog) => (
                    <DogCard 
                      key={dog.id}
                      dog={dog}
                      userProfile={userProfile}
                      isLiked={true}
                      onToggleLike={handleToggleLike}
                      onClick={() => setSelectedDog(dog)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-mint-200/35 shadow-soft space-y-4">
                  <Heart className="w-16 h-16 text-mint-200 mx-auto stroke-1" />
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-inkplum">아직 동반의 심장이 고요히 뛰고 있어요</h4>
                    <p className="text-xs text-inkplum/50 font-normal max-w-xs mx-auto">
                      매칭추천 메뉴를 다시 방문하여 마음을 쿵쾅이게 만드는 포근한 파트너를 발견해 보세요!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('recommend')}
                    className="px-6 py-2.5 bg-spectrum text-white hover:opacity-90 font-bold rounded-xl text-xs shadow-soft transition-soft cursor-pointer"
                  >
                    소중한 인연 찾아나서기
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. 서비스 소개 문구를 담은 푸터입니다. */}
      <footer className="mt-auto bg-white border-t border-mint-200/50 py-10 text-center" id="mungmate-footer">
        <div className="max-w-7xl mx-auto px-4 text-inkplum/40 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-brand-red text-sm">
            <PawPrint className="w-4 h-4 fill-current" />
            <span>MungMate • Hopeful Companion</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            모든 생명이 가진 고유의 온도가 예우받을 수 있도록 사랑을 재조합합니다.
          </p>
          <div className="text-[10px] opacity-80 pt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 font-bold">
            <span>사업자등록: 104-안심-9111</span>
            <span>분양/입양 책임보증보험 완료</span>
            <span>AI Studio 융합 연구관 가동</span>
          </div>
          <p className="text-[9px] opacity-60">
            © 2026 MungMate Inc. All rights, love, and hope reserved.
          </p>
        </div>
      </footer>

      {/* 4. 선택한 강아지의 상세 모달을 표시합니다. */}
      <DogDetailModal 
        dog={selectedDog}
        onClose={() => setSelectedDog(null)}
        userProfile={userProfile}
        isLiked={selectedDog ? likedDogs.includes(selectedDog.id) : false}
        onToggleLike={handleToggleLike}
        onStartChat={handleStartInquiryChat}
      />

      {/* 5. 어느 화면에서나 프로필을 수정할 수 있는 오른쪽 서랍입니다. */}
      <AnimatePresence>
        {showProfileDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="프로필 수정">
            {/* 서랍 뒤쪽을 어둡게 하고 클릭 시 서랍을 닫는 배경입니다. */}
            <div 
              className="absolute inset-0 bg-inkplum/50 backdrop-blur-xs transition-opacity"
              onClick={() => setShowProfileDrawer(false)}
            />
            
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-screen max-w-md"
              >
                <div className="h-full flex flex-col bg-white shadow-soft-lg overflow-y-auto">
                  <div className="p-6 bg-gradient-to-r from-coral to-sunset text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <h3 className="font-extrabold text-base">매칭 프로필 설정</h3>
                    </div>
                    <button
                      onClick={() => setShowProfileDrawer(false)}
                      className="p-1 rounded-full hover:bg-white/10 text-white"
                      aria-label="서랍 닫기"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    {/* 서랍 안에 동일한 프로필 설문을 넣습니다. */}
                    <UserProfileQuiz 
                      userProfile={userProfile}
                      onChangeProfile={setUserProfile}
                      onSave={() => setShowProfileDrawer(false)}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    {/* 앱 전체 컨테이너를 닫습니다. */}
    </div>
  );
// 최상위 앱 컴포넌트를 닫습니다.
}
