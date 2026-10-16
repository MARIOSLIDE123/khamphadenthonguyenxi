import React, { useState, useEffect } from 'react';
import { ARENA_ROUNDS } from '../data/arena';
import { CLIENT_QUESTIONS } from '../data/clientQuestions';
import { InteractiveQuestionCard } from '../components/InteractiveQuestionCard';
import { useSession } from '../context/SessionContext';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  Flame,
  Clock,
  Award,
  Crown,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Shield,
  Zap,
  Play
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
  onNavigateToLeaderboard: () => void;
}

export const WisdomArenaPage: React.FC<Props> = ({ onBackToHome, onNavigateToLeaderboard }) => {
  const { session, recordArenaRoundCompleted, recordArenaCompleted } = useSession();

  // Arena progress state
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [currentQuestionInRound, setCurrentQuestionInRound] = useState<number>(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_passed' | 'game_completed'>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [roundScores, setRoundScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [roundCorrects, setRoundCorrects] = useState<number[]>([0, 0, 0, 0, 0]);

  const activeRound = ARENA_ROUNDS[currentRoundIdx];
  const roundQuestions = CLIENT_QUESTIONS.filter((q) => activeRound.questionIds.includes(q.id));
  const currentQuestion = roundQuestions[currentQuestionInRound] || roundQuestions[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && gameState === 'playing') {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      // Time up: advance or summarize
      handleRoundEnded();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, gameState]);

  // Start Arena
  const handleStartArena = () => {
    setCurrentRoundIdx(0);
    setCurrentQuestionInRound(0);
    setTimeLeft(ARENA_ROUNDS[0].timeLimitSeconds);
    setTimerActive(true);
    setGameState('playing');
  };

  // Question finished in round
  const handleQuestionCompleted = (res: any) => {
    if (res.isCorrect) {
      const nextScores = [...roundScores];
      nextScores[currentRoundIdx] += res.pointsAwarded;
      setRoundScores(nextScores);

      const nextCorr = [...roundCorrects];
      nextCorr[currentRoundIdx] += 1;
      setRoundCorrects(nextCorr);
    }
  };

  // Next question inside round
  const handleNextInRound = () => {
    if (currentQuestionInRound < roundQuestions.length - 1) {
      setCurrentQuestionInRound(currentQuestionInRound + 1);
    } else {
      // Round completed!
      handleRoundEnded();
    }
  };

  // Round ended transition
  const handleRoundEnded = async () => {
    setTimerActive(false);
    soundEffects.playTriumph();

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D9A441', '#B93632', '#307A67']
      });
    } catch {}

    // Record server round reward
    await recordArenaRoundCompleted(activeRound.roundNumber);

    if (currentRoundIdx < ARENA_ROUNDS.length - 1) {
      setGameState('round_passed');
    } else {
      // Completed all 5 rounds! Champion
      await recordArenaCompleted();
      setGameState('game_completed');
    }
  };

  // Continue to next round
  const handleProceedNextRound = () => {
    const nextIdx = currentRoundIdx + 1;
    setCurrentRoundIdx(nextIdx);
    setCurrentQuestionInRound(0);
    setTimeLeft(ARENA_ROUNDS[nextIdx].timeLimitSeconds);
    setTimerActive(true);
    setGameState('playing');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Compute final stats
  const totalArenaCorrect = roundCorrects.reduce((a, b) => a + b, 0);
  const totalArenaQuestions = ARENA_ROUNDS.reduce((acc, r) => acc + r.questionIds.length, 0);
  const arenaAccuracy = Math.round((totalArenaCorrect / Math.max(totalArenaQuestions, 1)) * 100);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-[#21354D] border border-[#D9A441] rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B93632]" />
          <span>Về Trang Chủ</span>
        </button>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm ${
                timeLeft < 30
                  ? 'bg-red-50 border-red-500 text-red-700 animate-pulse'
                  : 'bg-white border-[#D9A441] text-[#21354D]'
              }`}
            >
              <Clock className="w-4 h-4 text-[#B93632]" />
              <span>Thời gian còn: {formatTimer(timeLeft)}</span>
            </div>

            {/* Current Round Indicator */}
            <div className="px-3.5 py-1.5 bg-[#B93632] text-white rounded-xl text-xs font-bold uppercase tracking-wider">
              {activeRound.title}
            </div>
          </div>
        )}
      </div>

      {/* STATE 1: INTRO SCREEN */}
      {gameState === 'intro' && (
        <div className="bg-white rounded-3xl border-4 border-[#D9A441] shadow-2xl overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] p-8 md:p-12 text-white text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D9A441]/25 border border-[#D9A441] rounded-full text-xs font-bold text-[#FFF6E5] mb-4">
              <Flame className="w-4 h-4 text-[#D9A441]" />
              <span>SÂN CHƠI LỊCH SỬ KỊCH TÍNH & HÀO HÙNG</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-heritage drop-shadow tracking-wide">
              ĐẤU TRƯỜNG TRÍ TUỆ
            </h1>
            <p className="text-base md:text-lg text-[#FFF6E5]/90 mt-2 font-medium">
              Thử Thách Nhà Khám Phá Di Sản – Chinh phục 5 vòng thi đỉnh cao
            </p>
          </div>

          {/* 5 Rounds Overview */}
          <div className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {ARENA_ROUNDS.map((r, idx) => (
                <div
                  key={r.roundNumber}
                  className="p-4 bg-[#FFF6E5] rounded-2xl border-2 border-[#D9A441]/50 shadow-sm text-center space-y-2"
                >
                  <span className="w-8 h-8 mx-auto rounded-full bg-[#B93632] text-white font-bold text-sm flex items-center justify-center">
                    {r.roundNumber}
                  </span>
                  <h4 className="font-bold text-xs md:text-sm text-[#21354D] leading-tight">
                    {r.title.replace(`Vòng ${r.roundNumber}: `, '')}
                  </h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2">{r.subtitle}</p>
                  <div className="text-[11px] font-bold text-[#307A67]">
                    {r.questionIds.length} câu • {r.timeLimitSeconds}s
                  </div>
                </div>
              ))}
            </div>

            {/* Rules Callout */}
            <div className="p-5 bg-amber-50 rounded-2xl border border-[#D9A441]/60 text-xs md:text-sm text-gray-800 space-y-2">
              <h4 className="font-bold text-sm text-[#B93632] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Quy chế thi đấu & Điểm thưởng:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Mỗi câu hỏi trả lời đúng ngay lần 1 được <strong>+10 điểm</strong>, lần 2 được <strong>+5 điểm</strong>.</li>
                <li>Vượt qua mỗi vòng thi được thưởng thêm <strong>+5 điểm</strong> và mở khóa Huy hiệu danh dự.</li>
                <li>Chinh phục toàn diện cả 5 vòng thi được thưởng <strong>+10 điểm</strong> và danh hiệu <em>Hộ Thần Di Tích Quốc Gia</em>.</li>
              </ul>
            </div>

            {/* Launch CTA */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleStartArena}
                className="px-10 py-5 bg-gradient-to-r from-[#B93632] to-[#8B1A17] hover:from-[#9D2824] hover:to-[#741310] text-[#FFF6E5] font-bold text-lg md:text-xl rounded-2xl shadow-xl transition flex items-center justify-center gap-3 border-2 border-[#D9A441] cursor-pointer mx-auto transform hover:scale-105 active:scale-95"
              >
                <Play className="w-6 h-6 text-[#D9A441] fill-current" />
                <span className="font-heritage tracking-wider">BẮT ĐẦU VÒNG 1: KHỞI ĐỘNG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: PLAYING ACTIVE ROUND */}
      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* Round Header Bar */}
          <div className="bg-white p-5 rounded-2xl border-2 border-[#D9A441]/50 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#B93632] uppercase tracking-wider block">
                {activeRound.title}
              </span>
              <h3 className="text-base md:text-lg font-bold font-heritage text-[#21354D]">
                {activeRound.subtitle}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500">Tiến độ vòng:</span>
              <div className="flex items-center gap-1.5">
                {roundQuestions.map((_, qIdx) => (
                  <span
                    key={qIdx}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                      qIdx === currentQuestionInRound
                        ? 'bg-[#B93632] text-white border-[#B93632]'
                        : qIdx < currentQuestionInRound
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {qIdx + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <InteractiveQuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onQuestionCompleted={handleQuestionCompleted}
            onNext={handleNextInRound}
            showNextButton={true}
          />
        </div>
      )}

      {/* STATE 3: ROUND PASSED */}
      {gameState === 'round_passed' && (
        <div className="bg-white rounded-3xl border-4 border-[#D9A441] shadow-2xl p-8 md:p-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border-3 border-[#D9A441] flex items-center justify-center text-[#D9A441] shadow-lg animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Chiến Thắng Vòng Thi!
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-heritage text-[#21354D]">
              Chúc Mừng Em Đã Vượt Qua {activeRound.title}!
            </h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Em đã hoàn thành xuất sắc các thử thách và nhận thêm <strong>+5 điểm thưởng</strong> từ máy chủ.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleProceedNextRound}
              className="px-8 py-4 bg-[#B93632] hover:bg-[#9D2824] text-white font-bold rounded-2xl text-base transition shadow-lg flex items-center gap-2 border border-[#D9A441] cursor-pointer transform hover:scale-105"
            >
              <span>Tiếp Tục Vòng {currentRoundIdx + 2}</span>
              <ArrowRight className="w-5 h-5 text-[#D9A441]" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: ALL 5 ROUNDS COMPLETED (CHAMPION) */}
      {gameState === 'game_completed' && (
        <div className="bg-white rounded-3xl border-4 border-[#D9A441] shadow-2xl overflow-hidden">
          {/* Champion Banner */}
          <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] p-8 md:p-12 text-white text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#D9A441] text-[#21354D] flex items-center justify-center shadow-xl mb-4 animate-pulse">
              <Crown className="w-12 h-12" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFF6E5] block mb-1">
              CHỨNG NHẬN ĐỈNH CAO TRÍ TUỆ
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-heritage">
              HỘ THẦN DI TÍCH QUỐC GIA ĐẶC BIỆT
            </h2>
            <p className="text-sm text-[#FFF6E5]/90 mt-2">
              Xuất sắc vượt qua toàn bộ 5 vòng thi của Đấu trường trí tuệ Đền thờ Nguyễn Xí!
            </p>
          </div>

          {/* Results Summary */}
          <div className="p-6 md:p-10 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]">
                <Sparkles className="w-6 h-6 text-[#D9A441] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#B93632]">{session?.totalScore ?? 0}</div>
                <div className="text-xs text-gray-600 font-medium">Tổng điểm tích lũy</div>
              </div>

              <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]">
                <CheckCircle2 className="w-6 h-6 text-[#307A67] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#307A67]">{totalArenaCorrect}</div>
                <div className="text-xs text-gray-600 font-medium">Số câu trả lời đúng</div>
              </div>

              <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]">
                <Award className="w-6 h-6 text-[#8B5E00] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#8B5E00]">{arenaAccuracy}%</div>
                <div className="text-xs text-gray-600 font-medium">Độ chính xác</div>
              </div>

              <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]">
                <Trophy className="w-6 h-6 text-[#D9A441] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#21354D]">5 / 5 Vòng</div>
                <div className="text-xs text-gray-600 font-medium">Vòng thi chinh phục</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleStartArena}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#21354D] font-bold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Thách Lại</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToLeaderboard}
                className="px-8 py-3.5 bg-[#307A67] hover:bg-[#256051] text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center gap-2 border border-[#D9A441] cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#D9A441]" />
                <span>Xem Vị Trí Trên Bảng Xếp Hạng Toàn Quốc</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
