import React, { useState } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { Header } from './components/Header';
import { RegistrationModal } from './components/RegistrationModal';
import { LearnerJourneyModal } from './components/LearnerJourneyModal';
import { HomePage } from './pages/HomePage';
import { HeritageTopicsPage } from './pages/HeritageTopicsPage';
import { Tour360Page } from './pages/Tour360Page';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { WisdomArenaPage } from './pages/WisdomArenaPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import {
  Sparkles,
  BookOpen,
  Compass,
  HelpCircle,
  Flame,
  Trophy,
  MessageCircle,
  X,
  Building
} from 'lucide-react';

type ActiveView = 'home' | 'topics' | 'tour' | 'quiz' | 'arena' | 'leaderboard';

const AppContent: React.FC = () => {
  const { isRegistered, learner } = useSession();
  const [activeTab, setActiveTab] = useState<ActiveView>('home');
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [showHeritageGuide, setShowHeritageGuide] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF6E5] text-[#21354D] pattern-heritage">
      {/* Registration Modal if not registered */}
      {!isRegistered && <RegistrationModal />}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onNavigateHome={() => setActiveTab('home')}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
      />

      {/* Navigation Bar (Desktop & Mobile Pills) */}
      {isRegistered && (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-[#D9A441]/30 sticky top-[61px] md:top-[69px] z-30">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-1.5 md:gap-3 min-w-max">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-[#B93632] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Trang Chủ</span>
              </button>

              <button
                onClick={() => setActiveTab('topics')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'topics'
                    ? 'bg-[#B93632] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Tìm Hiểu Di Tích</span>
              </button>

              <button
                onClick={() => setActiveTab('tour')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tour'
                    ? 'bg-[#307A67] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tham Quan 360°</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-[#D9A441] text-[#21354D] shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Câu Hỏi Tương Tác</span>
              </button>

              <button
                onClick={() => setActiveTab('arena')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'arena'
                    ? 'bg-[#B93632] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Đấu Trường Trí Tuệ</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#21354D] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <Trophy className="w-4 h-4 text-[#D9A441]" />
                <span>Bảng Xếp Hạng</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
          />
        )}

        {activeTab === 'topics' && (
          <HeritageTopicsPage onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'tour' && (
          <Tour360Page onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'quiz' && (
          <QuestionBankPage onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'arena' && (
          <WisdomArenaPage
            onBackToHome={() => setActiveTab('home')}
            onNavigateToLeaderboard={() => setActiveTab('leaderboard')}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage onBackToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Badges / Journey Modal */}
      <LearnerJourneyModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
      />

      {/* Sứ giả di sản (Heritage Mascot / Guide Dialog) */}
      <div className="fixed bottom-5 right-5 z-40">
        {showHeritageGuide ? (
          <div className="bg-white rounded-3xl border-3 border-[#D9A441] shadow-2xl p-4 w-80 max-w-[90vw] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#B93632] flex items-center justify-center text-[#D9A441] text-xs font-bold">
                  ★
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#B93632]">
                  Sứ Giả Di Sản Hướng Dẫn
                </h4>
              </div>
              <button
                onClick={() => setShowHeritageGuide(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              Chào {learner?.fullName || 'bạn'}! Hãy nhớ ghé thăm <strong>Tham quan 360°</strong> để chiêm ngưỡng Hồ Bán Nguyệt và Nghi môn tứ trụ uy nghi. Sau đó thử sức tại <strong>Đấu trường trí tuệ</strong> để ghi tên lên Bảng vàng nhé!
            </p>

            <div className="text-[11px] text-[#307A67] font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              💡 Mẹo học tập: Nguyễn Xí mất năm 1465, và Đền thờ được xây dựng vào năm 1467 theo lệnh vua Lê Thánh Tông!
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowHeritageGuide(true)}
            className="p-3 bg-gradient-to-r from-[#B93632] to-[#8B1A17] text-white rounded-2xl shadow-xl hover:shadow-2xl border-2 border-[#D9A441] flex items-center gap-2 cursor-pointer hover:scale-105 transition"
            title="Nhận gợi ý từ Sứ giả di sản"
          >
            <Sparkles className="w-5 h-5 text-[#D9A441]" />
            <span className="text-xs font-bold font-heritage hidden sm:inline">
              Sứ Giả Di Sản
            </span>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#21354D] text-white py-8 border-t-4 border-[#D9A441]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold font-heritage text-[#FFF6E5] text-sm">
              HÀNH TRÌNH KHÁM PHÁ ĐỀN THỜ NGUYỄN XÍ
            </p>
            <p className="text-gray-400">
              Di tích quốc gia đặc biệt – xã Đông Lộc, tỉnh Nghệ An (Quyết định số 2280/QĐ-TTg ngày 31/12/2020)
            </p>
          </div>

          <div className="text-center md:text-right text-gray-400">
            <p>Hệ thống học tập và bảo tồn di sản văn hóa truyền thống</p>
            <p className="text-[#D9A441] text-[11px] mt-0.5">Dữ liệu đồng bộ máy chủ & Google Sheets</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
