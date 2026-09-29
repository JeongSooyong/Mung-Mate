// React 상태와 참조, 생명주기, 고유 아이디 기능을 가져옵니다.
import React, { useState, useRef, useEffect, useId } from 'react';
// 상담 메시지와 사용자 프로필의 타입을 가져옵니다.
import { Message, UserProfile } from '../types';
// 상담 화면에 사용할 아이콘을 가져옵니다.
import { Sparkles, Send, Brain, User, ShieldAlert, Heart, BookOpen, Loader2 } from 'lucide-react';
// 메시지와 패널 전환 애니메이션을 가져옵니다.
import { motion } from 'motion/react';

// AI 상담 컴포넌트가 부모로부터 받는 값의 형태입니다.
interface CareAdvisorAIProps {
  // 현재 사용자의 프로필입니다.
  userProfile: UserProfile;
  // 외부에서 상담창에 처음 보낼 선택적 메시지입니다.
  initialMessageToSend?: string | null;
  // 외부 메시지를 처리한 뒤 초기화하는 선택적 콜백입니다.
  onClearInitialMessage?: () => void;
// AI 상담 속성 정의를 닫습니다.
}

// AI 상담과 걱정 리프레임 기능을 제공하는 컴포넌트입니다.
export default function CareAdvisorAI({
  // 부모가 전달한 사용자 프로필을 받습니다.
  userProfile,
  // 상세 모달에서 전달된 초기 메시지를 받습니다.
  initialMessageToSend,
  // 초기 메시지를 비우는 콜백을 받습니다.
  onClearInitialMessage
}: CareAdvisorAIProps) {
  // 결과 제목에 연결할 고유 아이디를 만듭니다.
  const headingId = useId();
  // 걱정 입력창에 연결할 고유 아이디를 만듭니다.
  const inputId = useId();
  
  // Chat States
  // 상담 대화 목록을 환영 메시지로 시작합니다.
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! MungMate의 따뜻한 안심 길잡이 상담사 **하루(Haru)**입니다. 🌸\n\n아이들이 전하는 사랑과 따뜻함을 소중히 안겨드리고 싶어요. 혹시 이전에 반려견을 기른 적이 있으시거나, 준비 과정에서 마음에 가려움이 있다면 어떤 고민이든 소란스레 들려주세요. 무엇이든 함께 보듬어가며 가장 포근한 해답(Hope Reframe)을 찾아드릴게요!",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  // 사용자가 입력 중인 상담 메시지를 저장합니다.
  const [inputValue, setInputValue] = useState("");
  // AI 응답을 기다리는 동안 로딩 상태를 저장합니다.
  const [isTyping, setIsTyping] = useState(false);
  // 새 메시지가 추가될 때 스크롤할 하단 요소를 참조합니다.
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Reframe Container States
  // 사용자가 작성한 걱정 내용을 저장합니다.
  const [worryValue, setWorryValue] = useState("");
  // 서버가 바꿔준 희망 메시지를 저장합니다.
  const [reframedValue, setReframedValue] = useState<string | null>(null);
  // 걱정 리프레임 요청 진행 상태를 저장합니다.
  const [isReframing, setIsReframing] = useState(false);

  // Standard Suggested Worries
  // 사용자가 바로 선택할 수 있는 대표 걱정 문장 목록입니다.
  const SUGGESTED_WORRIES = [
    { text: "아파트/원룸이 너무 좁아 답답할까 걱정돼요.", brief: "주거 크기" },
    { text: "직장 근무로 9 to 6 동안 혼자 두어 죄책감이 들어요.", brief: "부재 시간" },
    { text: "반려견을 한 번도 안 키워본 초보라 두려워요.", brief: "초보 두려움" },
    { text: "비싼 수술비나 병원비 같은 예산 지출이 겁나요.", brief: "병원비 고민" }
  ];

  // Auto scroll to bottom of chat
  // 메시지나 입력 진행 상태가 바뀌면 최신 메시지가 보이도록 이동합니다.
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle triggered message from detailed modal inquiry
  // 외부에서 전달된 초기 메시지가 있으면 상담 메시지로 자동 전송합니다.
  useEffect(() => {
    if (initialMessageToSend) {
      handleSendText(initialMessageToSend);
      if (onClearInitialMessage) onClearInitialMessage();
    }
  }, [initialMessageToSend]);

  // 사용자의 상담 문장을 서버에 보내고 응답을 대화에 추가합니다.
  const handleSendText = async (text: string) => {
    // 빈 문장은 서버에 보내지 않습니다.
    if (!text.trim()) return;

    // 사용자의 문장을 화면에 추가할 메시지 객체로 만듭니다.
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    // 사용자 메시지를 기존 대화 뒤에 추가합니다.
    setMessages(prev => [...prev, userMsg]);
    // 서버 응답을 기다리는 동안 입력 상태를 표시합니다.
    setIsTyping(true);

    // 서버 요청과 오류 처리를 시작합니다.
    try {
      // AI 상담 API에 대화 기록과 사용자 프로필을 전송합니다.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          userProfile: userProfile
        })
      });

      // HTTP 응답이 실패하면 오류 처리로 이동합니다.
      if (!response.ok) {
        throw new Error("Chat response was not OK");
      }

      // 서버에서 받은 JSON 응답을 읽습니다.
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      // 서버 오류를 개발자 콘솔에 기록합니다.
      console.error("AI Chat error:", err);
      // 서버가 응답하지 않아도 사용자에게 보여줄 안전한 안내를 추가합니다.
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: "네, 들려주신 소중한 고민 깊게 경청했습니다. 동반의 길에는 비록 크고 작은 서투름이 있을지라도, 사용자의 세심하고 아끼는 마음결이 있다면 아이는 충분한 행복을 느낄 수 있어요. 안심 훈련 팁북을 받아가시거나 매칭 강상 목록을 상세히 검수해보세요! 언제든 구체적인 질문을 재차 여쭤봐 주시면 답해 드릴게요.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      // 성공 여부와 관계없이 입력 대기 상태를 종료합니다.
      setIsTyping(false);
    }
  };

  // 상담 입력 폼 제출을 처리합니다.
  const handleSendSubmit = (e: React.FormEvent) => {
    // 브라우저의 기본 폼 새로고침을 막습니다.
    e.preventDefault();
    // 빈 입력은 보내지 않습니다.
    if (!inputValue.trim()) return;
    // 전송할 문장을 임시 변수에 보관합니다.
    const text = inputValue;
    // 입력창을 비웁니다.
    setInputValue("");
    // 보관한 문장을 상담 서버로 전송합니다.
    handleSendText(text);
  };

  // Perform Hope Reframe using Server-Side endpoint
  // 사용자의 걱정을 서버에 보내 희망적인 표현으로 바꿉니다.
  const handlePerformReframe = async (worryText: string) => {
    // 빈 걱정 문장은 처리하지 않습니다.
    if (!worryText.trim()) return;
    // 리프레임 요청 중임을 표시합니다.
    setIsReframing(true);
    // 이전 결과를 먼저 지웁니다.
    setReframedValue(null);

    // 서버 요청과 오류 처리를 시작합니다.
    try {
      // 리프레임 API에 사용자의 걱정을 전달합니다.
      const response = await fetch('/api/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worry: worryText })
      });

      // HTTP 응답이 실패하면 오류 처리로 이동합니다.
      if (!response.ok) {
        throw new Error("Reframe request failed");
      }

      // 서버 결과를 JSON으로 읽습니다.
      const data = await response.json();
      // 새롭게 바뀐 문장을 화면에 표시합니다.
      setReframedValue(data.reframed);
    } catch (err) {
      // 리프레임 오류를 개발자 콘솔에 기록합니다.
      console.error("Reframe error:", err);
      // 서버 오류가 나도 사용자에게 보여줄 기본 위로 문장을 설정합니다.
      setReframedValue("걱정하시는 그 마음 자체가 사려 깊은 반려인으로서 자격이 충분하다는 가장 예쁜 방증이에요. 서툰 구석은 단단한 실천과 교육 시스템이 보태어 채워줄 수 있으며, 아이는 부가적인 거실 운동장 크기가 아닌 오로지 반려인의 눈빛 단 1mm의 정성 깊이 안에서 가장 만족한 세계를 채운답니다.");
    } finally {
      // 성공 여부와 관계없이 리프레임 진행 상태를 종료합니다.
      setIsReframing(false);
    }
  };

  // 상담 화면과 걱정 리프레임 화면을 반환합니다.
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 왼쪽에는 하루 AI와 대화하는 패널을 배치합니다. */}
      <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-soft border border-mint-200/40 h-[650px] flex flex-col">
        {/* 상담사 이름과 현재 사용자 상태를 보여주는 헤더입니다. */}
        <div className="p-4 md:p-5 hope-gradient text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/20">
              하루
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-none animate-pulse">안심 보듬 상담사 하루 (Haru)</h3>
              <span className="text-[10px] md:text-xs opacity-85 mt-0.5 block">
                {userProfile.name} 님을 위한 희망-퍼스트 큐레이터 가동 중
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 bg-black/15 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            실시간 코칭
          </div>
        </div>

        {/* 대화 메시지를 세로로 쌓는 본문 영역입니다. */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-mint-50/10">
          {/* 모든 대화 메시지를 보낸 사람에 맞는 방향으로 그립니다. */}
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* 사용자와 AI를 구분하는 프로필 아이콘입니다. */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-coral'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-inkplum/40 font-bold px-1 tracking-wider block">
                    {msg.role === 'user' ? userProfile.name : '하루 가이드'}
                  </span>
                  
                  {/* 실제 대화 내용을 담는 말풍선입니다. */}
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed font-normal whitespace-pre-line ${
                    msg.role === 'user' 
                      ? 'bg-coral text-white rounded-tr-none shadow-soft' 
                      : 'bg-mint-100 text-inkplum rounded-tl-none border border-mint-200/50 shadow-soft'
                  }`}>
                    {msg.content}
                  </div>
                  
                  <span className="text-[9px] text-inkplum/35 block px-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* AI가 답변 중일 때 로딩 말풍선을 표시합니다. */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-mint-100 px-4 py-3 rounded-2xl rounded-tl-none border border-mint-200/50 flex items-center gap-2 text-xs text-inkplum/60 font-semibold shadow-soft">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-coral" />
                  <span>하루가 신중하게 희망 리프레임을 가다듬는 중...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* 상담 문장을 입력하고 보내는 폼입니다. */}
        <form onSubmit={handleSendSubmit} className="p-4 border-t border-mint-200 bg-white">
          <div className="flex gap-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="하루에게 주거나 부재 걱정 등 자유롭게 조언을 구해보세요..."
              className="flex-1 px-4 py-3 rounded-xl border border-mint-200 bg-mint-50/15 text-sm text-inkplum focus:outline-none focus:border-coral font-medium transition-soft"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-coral hover:bg-coral/90 text-white rounded-xl transition-soft shadow-soft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="메시지 전송"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* 오른쪽에는 걱정을 희망 문장으로 바꾸는 패널을 배치합니다. */}
      <div className="lg:col-span-5 space-y-6">
        {/* 걱정 내용을 작성하는 핵심 입력 카드입니다. */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-mint-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-container rounded-full blur-2xl opacity-60" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-rose-container text-coral rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-inkplum tracking-tight leading-none">마음 해독 연구소</h3>
              <span className="text-xs text-inkplum/50 font-medium block mt-1">입양 전 나의 막연한 두려움을 희망으로 녹입니다.</span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-inkplum/70 font-normal leading-relaxed mb-4">
            반려견 영입 단계에서 발목을 붙잡는 고민을 적어주세요. MungMate AI 시스템은 그 속의 <strong>진정성</strong>에 주목하여, 입양에 확신을 불어넣는 따스하고 이성적인 reframing 솔루션을 제공해 드립니다.
          </p>

          {/* 사용자의 걱정 문장을 입력받습니다. */}
          <div className="space-y-3">
            <textarea
              id={inputId}
              value={worryValue}
              onChange={(e) => setWorryValue(e.target.value)}
              placeholder="예: 일이 너무 늦게 끝나고 넓은 집도 없어 강아지의 삶을 우울하게 만들까봐 깊은 자책감이 가득 차올라요..."
              className="w-full h-24 p-3 rounded-xl border border-mint-200 text-xs md:text-sm bg-mint-50/20 text-inkplum placeholder-inkplum/35 focus:outline-none focus:border-coral font-medium resize-none transition-soft"
            />

            {/* 대표 걱정을 빠르게 선택할 수 있는 버튼 목록입니다. */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-inkplum/40 font-bold block tracking-wider">추천 걱정 키워드:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_WORRIES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWorryValue(item.text);
                      handlePerformReframe(item.text);
                    }}
                    className="px-2.5 py-1 bg-mint-50 border border-mint-200 text-[10px] font-bold text-inkplum/80 rounded-lg hover:border-coral hover:text-coral transition-soft cursor-pointer"
                  >
                    💡 {item.brief}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePerformReframe(worryValue)}
              disabled={!worryValue.trim() || isReframing}
              className="w-full py-3 bg-inkplum text-white hover:bg-inkplum/90 font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-soft transition-soft cursor-pointer disabled:opacity-40"
              id="btn-reframe-submit"
            >
              {isReframing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sunset" />
                  <span>마음을 포근히 분석 및 재구성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sunset fill-current" />
                  <span>걱정거리를 희망(Hope Reframe)으로 교환하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 리프레임 결과가 있거나 처리 중일 때 결과 상자를 표시합니다. */}
        {(reframedValue || isReframing) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hope-border soft-shadow"
          >
            <div className="hope-border-inner p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-coral">
                  <Heart className="w-5 h-5 fill-current text-coral" />
                  <h4 className="text-sm font-extrabold tracking-tight" id={headingId}>하루의 마음 리프레임 선율</h4>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  완전 안심 가이드
                </span>
              </div>

              {isReframing ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-coral" />
                  <p className="text-xs text-inkplum/50 font-bold">
                    생명을 소중히 여기는 당신의 상냥함과 성찰을 분석해 희망찬 동반의 시선으로 전환하고 있습니다...
                  </p>
                </div>
              ) : (
                <blockquote className="text-xs md:text-sm text-inkplum/90 leading-relaxed font-semibold italic pl-3 border-l-2 border-coral bg-rose-container/10 p-3 rounded-r-xl">
                  "{reframedValue}"
                </blockquote>
              )}

              <p className="text-[10px] text-inkplum/40 font-normal leading-relaxed text-right">
                걱정을 털어내는 것이 입양 책임감의 첫 시작입니다.
              </p>
            </div>
          </motion.div>
        )}

        {/* 추가로 읽을 수 있는 안내서 정보를 표시합니다. */}
        <div className="bg-white/80 p-5 rounded-2xl border border-mint-200/30 flex items-center gap-3">
          <div className="p-2.5 bg-mint-100 text-emerald-800 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-inkplum">안내서: 초보 반려인의 10가지 자물쇠 풀기</h4>
            <span className="text-[10px] text-inkplum/50 mt-0.5 block">짖음 대처부터 초기 사료급여 안심 매뉴얼(PDF 무상 제공)</span>
          </div>
        </div>
      </div>
    {/* 전체 상담 화면을 닫습니다. */}
    </div>
  );
// AI 상담 컴포넌트를 닫습니다.
}
