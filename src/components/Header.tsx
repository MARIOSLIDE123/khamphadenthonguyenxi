import React from 'react';
import { useSession } from '../context/SessionContext';
import {
  Award,
  Clock,
  Volume2,
  VolumeX,
  UserCheck,
  Compass,
  LogOut,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenBadgesModal: () => void;
  onNavigateHome: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBadgesModal, onNavigateHome, activeTab }) => {
  const {
    learner,
    session,
    activeSeconds,
    soundEnabled,
    toggleSound,
    switchLearner,
    earnedBadges
  } = useSession();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m < 60) {
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}h ${String(remM).padStart(2, '0')}p`;
  };

  const completedCount = session?.completedModules.length || 0;
  const totalTasksEstimate = 14; // 7 topics + 360 tour + 5 arena rounds + 1
  const progressPercent = Math.min(Math.round((completedCount / totalTasksEstimate) * 100), 100);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF6E5]/95 backdrop-blur-md border-b-2 border-[#D9A441] shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo / Title */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#B93632] to-[#8B1A17] border-2 border-[#D9A441] flex items-center justify-center text-[#D9A441] shadow group-hover:scale-105 transition">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-widest font-bold text-[#B93632]">
                  Di tích Quốc gia đặc biệt
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D9A441]"></span>
                <span className="text-xs text-gray-600 hidden sm:inline">Nghệ An</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold font-heritage text-[#21354D] leading-tight group-hover:text-[#B93632] transition">
                Đền Thờ Nguyễn Xí
              </h1>
            </div>
          </button>

          {/* Stats Bar */}
          {learner && (
            <div className="flex items-center flex-wrap gap-2 md:gap-4">
              {/* Greeting */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#D9A441]/40 text-xs font-medium text-[#21354D]">
                <UserCheck className="w-4 h-4 text-[#307A67]" />
                <span>Chào em, <strong className="text-[#B93632]">{learner.fullName}</strong></span>
              </div>

              {/* Points */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-[#D9A441] rounded-xl text-xs md:text-sm font-bold text-[#8B5E00]">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>{session?.totalScore ?? 0}</span>
                <span className="text-xs font-normal text-gray-600">điểm</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#21354D]">
                <Clock className="w-4 h-4 text-[#307A67]" />
                <span>{formatTime(activeSeconds)}</span>
              </div>

              {/* Badges / Journey button */}
              <button
                onClick={onOpenBadgesModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#307A67]/10 hover:bg-[#307A67]/20 border border-[#307A67]/40 rounded-xl text-xs font-bold text-[#307A67] transition cursor-pointer"
                title="Xem Hành trình & Huy hiệu"
              >
                <Award className="w-4 h-4 text-[#D9A441]" />
                <span className="hidden sm:inline">Huy hiệu:</span>
                <span>{earnedBadges.length}</span>
              </button>

              {/* Progress bar pill */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs">
                <span className="text-gray-600">Tiến độ:</span>
                <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#307A67] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <span className="font-bold text-[#307A67]">{progressPercent}%</span>
              </div>

              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-100/60 border-[#D9A441] text-[#B93632]'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Switch Learner */}
              <button
                onClick={() => {
                  if (confirm('Em có muốn đổi tài khoản người học khác trên thiết bị này không?')) {
                    switchLearner();
                  }
                }}
                className="p-2 rounded-xl border border-gray-200 hover:border-red-300 bg-white hover:bg-red-50 text-gray-500 hover:text-[#B93632] transition cursor-pointer"
                title="Đổi người học"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
