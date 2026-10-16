import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { BADGES_LIST } from '../data/arena';
import { getGoogleAppsScriptConfig, setGoogleAppsScriptConfig } from '../services/localStore';
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
  Scroll,
  History,
  FileSpreadsheet,
  Check,
  ExternalLink,
  Save,
  HelpCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnerJourneyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { learner, session, activeSeconds, earnedBadges, activityHistory } = useSession();
  const [activeTab, setActiveTab] = useState<'badges' | 'history' | 'sheets'>('badges');

  // GAS settings state
  const gasConfig = getGoogleAppsScriptConfig();
  const [gasUrl, setGasUrl] = useState(gasConfig.url);
  const [gasSecret, setGasSecret] = useState(gasConfig.secret);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !learner) return null;

  const handleSaveGasConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleAppsScriptConfig(gasUrl, gasSecret);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const secs = String(d.getSeconds()).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${mins}:${secs} - ${date}/${month}/${year}`;
    } catch {
      return iso;
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
              <p className="text-xs text-[#FFF6E5]/80">Tổng hợp dấu ấn học tập, bảng xếp hạng & đồng bộ dữ liệu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D9A441]/40 bg-white/70 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'badges'
                ? 'bg-[#FFF6E5] text-[#B93632] border-t-2 border-x-2 border-[#D9A441] shadow-sm'
                : 'text-gray-600 hover:text-[#21354D]'
            }`}
          >
            <Crown className="w-4 h-4 text-[#D9A441]" />
            <span>Kho Huy Hiệu ({earnedBadges.length}/{BADGES_LIST.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#FFF6E5] text-[#B93632] border-t-2 border-x-2 border-[#D9A441] shadow-sm'
                : 'text-gray-600 hover:text-[#21354D]'
            }`}
          >
            <History className="w-4 h-4 text-[#307A67]" />
            <span>Lịch Sử Hoạt Động ({activityHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sheets'
                ? 'bg-[#FFF6E5] text-[#B93632] border-t-2 border-x-2 border-[#D9A441] shadow-sm'
                : 'text-gray-600 hover:text-[#21354D]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#107C41]" />
            <span>Đồng Bộ Google Sheets</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
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

          {/* Tab 1: Badges */}
          {activeTab === 'badges' && (
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
          )}

          {/* Tab 2: Activity History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-heritage text-[#21354D] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#307A67]" />
                  <span>Dòng Thời Gian Lịch Sử Hoạt Động</span>
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {activityHistory.length} hoạt động được ghi nhận
                </span>
              </div>

              {activityHistory.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-sm">
                  Chưa có lịch sử hoạt động nào được ghi lại trong phiên này.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activityHistory.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 bg-white rounded-2xl border border-[#D9A441]/30 shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-[#D9A441]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {act.category === 'quiz' ? (
                            <HelpCircle className="w-4 h-4 text-[#B93632]" />
                          ) : act.category === 'arena' ? (
                            <Flame className="w-4 h-4 text-[#D9A441]" />
                          ) : act.category === 'tour' ? (
                            <Compass className="w-4 h-4 text-[#307A67]" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-[#21354D]" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-[#21354D]">{act.title}</h5>
                          {act.details && <p className="text-xs text-gray-500 mt-0.5">{act.details}</p>}
                          <span className="text-[11px] text-gray-400 mt-1 inline-block">
                            {formatTimestamp(act.timestamp)}
                          </span>
                        </div>
                      </div>

                      {act.points > 0 ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg flex-shrink-0 border border-green-200">
                          +{act.points} điểm
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-lg flex-shrink-0">
                          Ghi nhận
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Google Sheets Sync Settings */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-sm text-green-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-800">
                  <FileSpreadsheet className="w-5 h-5 text-green-700" />
                  <span>Đồng bộ 6 Sheet thời gian thực với Google Apps Script</span>
                </div>
                <p className="text-xs text-green-800/90 leading-relaxed">
                  Mỗi khi học sinh đăng ký, trả lời câu hỏi, hoàn thành chủ đề hay tham gia đấu trường, điểm số và thành tích được đồng bộ tự động vào Google Sheets để giáo viên theo dõi và xếp hạng trực tiếp.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">📊 1. Students</span>
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">⏱️ 2. Sessions</span>
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">📝 3. Attempts</span>
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">🏆 4. ActivityEvents</span>
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">🥇 5. Scores (Xếp hạng)</span>
                  <span className="bg-white/80 px-2 py-1 rounded border border-green-300">⚙️ 6. Config</span>
                </div>
              </div>

              {/* Configure URL form */}
              <form onSubmit={handleSaveGasConfig} className="p-5 bg-white rounded-2xl border-2 border-[#D9A441] space-y-3.5">
                <h4 className="font-bold text-sm text-[#21354D] flex items-center justify-between">
                  <span>Cấu hình Web App Google Apps Script</span>
                  {gasUrl ? (
                    <span className="text-xs px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã kết nối
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                      Chưa gắn URL
                    </span>
                  )}
                </h4>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL Ứng dụng web (Google Apps Script Web App URL)
                  </label>
                  <input
                    type="url"
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#B93632]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Dán URL nhận được sau khi nhấn <em>Triển khai (Deploy) → Ứng dụng web (Web app)</em> trên Apps Script.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Khóa bảo mật chung (SHARED_SECRET - Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={gasSecret}
                    onChange={(e) => setGasSecret(e.target.value)}
                    placeholder="Ví dụ: nguyen_xi_secret_key_2026"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#B93632]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {savedSuccess ? (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-600" /> Đã lưu cấu hình Google Apps Script!
                    </span>
                  ) : (
                    <span></span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#107C41] hover:bg-[#0E6837] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Cấu Hình</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F8EFE1] px-6 py-4 border-t border-[#D9A441]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#B93632] hover:bg-[#9D2824] text-white font-bold rounded-xl text-sm transition shadow cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
