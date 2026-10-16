import React from 'react';
import { useSession } from '../context/SessionContext';
import { BADGES_LIST } from '../data/arena';
import {
  Award,
  CheckCircle2,
  Lock,
  X,
  Clock,
  Sparkles,
  BookOpen,
  Compass,
  Flame,
  Shield,
  Landmark,
  Zap,
  Crown,
  Scroll
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnerJourneyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { learner, session, activeSeconds, earnedBadges } = useSession();

  if (!isOpen || !learner) return null;

  const getIcon = (name: string, isUnlocked: boolean) => {
    const className = `w-7 h-7 ${isUnlocked ? 'text-[#D9A441]' : 'text-gray-400'}`;
    switch (name) {
      case 'Scroll':
        return <Scroll className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Landmark':
        return <Landmark className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const minutes = Math.floor(activeSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#21354D]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FFF6E5] rounded-3xl shadow-2xl border-4 border-[#D9A441] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] px-6 py-5 text-white flex items-center justify-between shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D9A441]/20 rounded-xl border border-[#D9A441]">
              <Award className="w-6 h-6 text-[#D9A441]" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heritage">Hành Trình Khám Phá Của Em</h2>
              <p className="text-xs text-[#FFF6E5]/80">Tổng hợp dấu ấn học tập & huy hiệu danh dự</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/30 shadow-sm text-center">
              <Sparkles className="w-5 h-5 text-[#D9A441] mx-auto mb-1" />
              <div className="text-2xl font-bold text-[#B93632]">{session?.totalScore ?? 0}</div>
              <div className="text-xs text-gray-600 font-medium">Điểm tích lũy</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/30 shadow-sm text-center">
              <CheckCircle2 className="w-5 h-5 text-[#307A67] mx-auto mb-1" />
              <div className="text-2xl font-bold text-[#307A67]">{session?.totalCorrect ?? 0}</div>
              <div className="text-xs text-gray-600 font-medium">Câu trả lời đúng</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/30 shadow-sm text-center">
              <Clock className="w-5 h-5 text-[#21354D] mx-auto mb-1" />
              <div className="text-2xl font-bold text-[#21354D]">{minutes}p</div>
              <div className="text-xs text-gray-600 font-medium">Thời gian học tập</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/30 shadow-sm text-center">
              <Award className="w-5 h-5 text-[#D9A441] mx-auto mb-1" />
              <div className="text-2xl font-bold text-[#8B5E00]">
                {earnedBadges.length}/{BADGES_LIST.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Huy hiệu đạt được</div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="p-4 bg-white/80 rounded-2xl border border-[#D9A441]/40 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <span className="text-gray-500">Người học:</span>{' '}
              <strong className="text-[#21354D] font-bold">{learner.fullName}</strong>
            </div>
            <div>
              <span className="text-gray-500">Trường:</span>{' '}
              <strong className="text-[#21354D]">{learner.schoolName}</strong>
            </div>
            <div>
              <span className="text-gray-500">Lớp:</span>{' '}
              <strong className="text-[#21354D]">{learner.className}</strong>
            </div>
            <div>
              <span className="text-gray-500">Mã định danh:</span>{' '}
              <code className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{learner.studentId.substring(0, 14)}...</code>
            </div>
          </div>

          {/* Badges Grid */}
          <div>
            <h3 className="text-lg font-bold font-heritage text-[#21354D] mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D9A441]" />
              <span>Kho Huy Hiệu Danh Dự</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BADGES_LIST.map((badge) => {
                const isUnlocked = earnedBadges.some((b) => b.id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-white border-[#D9A441] shadow-md ring-1 ring-[#D9A441]/30'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isUnlocked ? 'bg-amber-50 border-[#D9A441]/50' : 'bg-gray-200 border-gray-300'
                        }`}
                      >
                        {getIcon(badge.iconName, isUnlocked)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-bold text-sm truncate ${
                              isUnlocked ? 'text-[#21354D]' : 'text-gray-500'
                            }`}
                          >
                            {badge.name}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                              Đã đạt
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</p>
                        <div className="mt-2 text-[11px] text-amber-800 font-medium">
                          Nhiệm vụ: {badge.requirement}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F8EFE1] px-6 py-4 border-t border-[#D9A441]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#B93632] hover:bg-[#9D2824] text-white font-bold rounded-xl text-sm transition shadow cursor-pointer"
          >
            Đóng bảng thành tích
          </button>
        </div>
      </div>
    </div>
  );
};
