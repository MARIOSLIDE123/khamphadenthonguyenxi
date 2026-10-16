import React, { useState, useEffect } from 'react';
import { LeaderboardItem } from '../types';
import { apiClient } from '../services/api';
import { useSession } from '../context/SessionContext';
import {
  Trophy,
  Medal,
  RefreshCw,
  Search,
  School,
  Clock,
  Sparkles,
  Award,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
}

export const LeaderboardPage: React.FC<Props> = ({ onBackToHome }) => {
  const { learner } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [schoolFilter, setSchoolFilter] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLeaderboard = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.getLeaderboard(learner?.studentId, schoolFilter);
      setLeaderboard(data.leaderboard);
      setLastUpdated(new Date());
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải bảng xếp hạng lúc này.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
  }, [schoolFilter]);

  // Auto-refresh every 15 seconds while open (as per specification)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [learner?.studentId, schoolFilter]);

  const formatStudyTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}p ${String(s).padStart(2, '0')}s`;
  };

  // Filter client-side search query
  const displayedItems = leaderboard.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      item.publicDisplayName.toLowerCase().includes(q) ||
      item.schoolName.toLowerCase().includes(q)
    );
  });

  const top3 = displayedItems.slice(0, 3);
  const restList = displayedItems.slice(3);

  // Check if current learner is in the list
  const currentLearnerRank = leaderboard.find((item) => item.studentId === learner?.studentId);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-[#21354D] border border-[#D9A441] rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B93632]" />
          <span>Về Trang Chủ</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:inline">
            Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
          </span>
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white hover:bg-amber-50 border border-[#D9A441] rounded-xl text-xs md:text-sm font-bold text-[#21354D] transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 text-[#B93632] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] rounded-3xl p-8 text-white text-center shadow-xl border-3 border-[#D9A441] relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D9A441]/25 border border-[#D9A441] rounded-full text-xs font-bold text-[#FFF6E5] mb-2">
          <Trophy className="w-4 h-4 text-[#D9A441]" />
          <span>HỆ THỐNG GHI DANH TOÀN HỆ THỐNG ỨNG DỤNG</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold font-heritage drop-shadow">
          BẢNG XẾP HẠNG TOÀN QUỐC
        </h1>
        <p className="text-xs md:text-sm text-[#FFF6E5]/90 mt-2 max-w-2xl mx-auto">
          Tuyên dương các nhà khám phá di sản có thành tích xuất sắc, thời gian học tập chăm chỉ và độ chính xác cao.
        </p>

        {/* Current Learner Position Banner if in list */}
        {currentLearnerRank && (
          <div className="mt-5 inline-flex items-center gap-3 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-[#D9A441] text-xs md:text-sm font-semibold">
            <UserCheck className="w-4 h-4 text-[#D9A441]" />
            <span>Vị trí hiện tại của em: <strong>Hạng #{currentLearnerRank.rank}</strong> ({currentLearnerRank.totalScore} điểm)</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/50 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hiển thị hoặc trường..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFF6E5] border border-[#D9A441]/70 rounded-xl text-xs md:text-sm text-[#21354D] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B93632]"
          />
        </div>

        <div className="flex items-center gap-2">
          <School className="w-4 h-4 text-[#307A67]" />
          <input
            type="text"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            placeholder="Lọc trường (ví dụ: Nghi Hợp...)"
            className="px-3.5 py-2.5 bg-[#FFF6E5] border border-[#D9A441]/70 rounded-xl text-xs md:text-sm text-[#21354D] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B93632]"
          />
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-xs md:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{errorMessage} Dữ liệu đang được đồng bộ lại.</span>
        </div>
      )}

      {/* TOP 3 PODIUM */}
      {top3.length > 0 && (
        <div
          className={`pt-4 ${
            top3.length === 1
              ? 'flex justify-center'
              : top3.length === 2
              ? 'grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto gap-4'
              : 'grid grid-cols-1 md:grid-cols-3 gap-4'
          }`}
        >
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div
              className={`order-2 md:order-1 p-6 rounded-3xl border-2 shadow-lg text-center space-y-3 relative overflow-hidden ${
                top3[1].isCurrent
                  ? 'bg-amber-50/80 border-[#B93632] ring-2 ring-[#B93632]'
                  : 'bg-white border-gray-300'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 border-2 border-gray-400 flex items-center justify-center text-gray-700 font-bold text-xl shadow">
                🥈 2
              </div>
              <h3 className="font-bold text-base text-[#21354D] truncate">{top3[1].publicDisplayName}</h3>
              <p className="text-xs text-gray-500 truncate">{top3[1].schoolName}</p>
              <div className="text-2xl font-bold text-[#B93632]">{top3[1].totalScore} điểm</div>
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                <div>Độ chính xác: <strong>{top3[1].accuracy}%</strong></div>
                <div>Thời gian: <strong>{formatStudyTime(top3[1].activeSeconds)}</strong></div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div
              className={`order-1 md:order-2 p-6 md:-mt-4 rounded-3xl border-4 shadow-2xl text-center space-y-3 relative overflow-hidden ${
                top3.length === 1 ? 'w-full max-w-md' : ''
              } ${
                top3[0].isCurrent
                  ? 'bg-amber-100/70 border-[#B93632] ring-4 ring-[#D9A441]'
                  : 'bg-gradient-to-b from-amber-50 to-white border-[#D9A441]'
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D9A441] text-white flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-amber-300 animate-pulse">
                👑 1
              </div>
              <div className="inline-block px-3 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[11px] font-bold">
                Quán Quân Di Sản
              </div>
              <h3 className="font-bold text-lg text-[#21354D] truncate">{top3[0].publicDisplayName}</h3>
              <p className="text-xs text-gray-600 truncate">{top3[0].schoolName}</p>
              <div className="text-3xl font-black text-[#B93632]">{top3[0].totalScore} điểm</div>
              <div className="text-xs text-gray-700 space-y-1 pt-2 border-t border-amber-200">
                <div>Độ chính xác: <strong>{top3[0].accuracy}%</strong> ({top3[0].totalCorrect} câu đúng)</div>
                <div>Thời gian: <strong>{formatStudyTime(top3[0].activeSeconds)}</strong></div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div
              className={`order-3 p-6 rounded-3xl border-2 shadow-lg text-center space-y-3 relative overflow-hidden ${
                top3[2].isCurrent
                  ? 'bg-amber-50/80 border-[#B93632] ring-2 ring-[#B93632]'
                  : 'bg-white border-amber-600/40'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-700/10 border-2 border-amber-700/50 flex items-center justify-center text-amber-800 font-bold text-xl shadow">
                🥉 3
              </div>
              <h3 className="font-bold text-base text-[#21354D] truncate">{top3[2].publicDisplayName}</h3>
              <p className="text-xs text-gray-500 truncate">{top3[2].schoolName}</p>
              <div className="text-2xl font-bold text-[#B93632]">{top3[2].totalScore} điểm</div>
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                <div>Độ chính xác: <strong>{top3[2].accuracy}%</strong></div>
                <div>Thời gian: <strong>{formatStudyTime(top3[2].activeSeconds)}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEADERBOARD TABLE FOR ALL POSITIONS */}
      <div className="bg-white rounded-3xl border-2 border-[#D9A441]/50 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FFF6E5] text-[#21354D] font-heritage border-b-2 border-[#D9A441]">
              <tr>
                <th className="py-4 px-4 font-bold text-center w-16">Thứ hạng</th>
                <th className="py-4 px-4 font-bold">Tên hiển thị</th>
                <th className="py-4 px-4 font-bold">Trường</th>
                <th className="py-4 px-4 font-bold text-center">Tổng điểm</th>
                <th className="py-4 px-4 font-bold text-center">Độ chính xác</th>
                <th className="py-4 px-4 font-bold text-center">Thời gian học</th>
                <th className="py-4 px-4 font-bold text-center">Huy hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedItems.length > 0 ? (
                displayedItems.map((item, idx) => {
                  const isCurrent = item.studentId === learner?.studentId;
                  const rankNum = item.rank || idx + 1;

                  return (
                    <tr
                      key={item.studentId}
                      className={`transition ${
                        isCurrent
                          ? 'bg-amber-100/80 font-bold text-[#B93632]'
                          : 'hover:bg-amber-50/50 text-[#21354D]'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold">
                        {rankNum === 1 && '🥇 1'}
                        {rankNum === 2 && '🥈 2'}
                        {rankNum === 3 && '🥉 3'}
                        {rankNum > 3 && `#${rankNum}`}
                      </td>
                      <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                        <span>{item.publicDisplayName}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-[#B93632] text-white rounded-full text-[10px] font-bold">
                            Em
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{item.schoolName}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#B93632]">
                        {item.totalScore}
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs">
                        <span className="font-semibold text-[#307A67]">{item.accuracy}%</span>
                        <span className="text-gray-400 block text-[10px]">({item.totalCorrect} câu đúng)</span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs text-gray-600">
                        {formatStudyTime(item.activeSeconds)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 rounded-full text-xs font-semibold border border-amber-200">
                          <Award className="w-3.5 h-3.5 text-[#D9A441]" />
                          <span>{item.badgeCount}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <p className="font-bold text-base">Chưa có đủ dữ liệu xếp hạng.</p>
                    <p className="text-xs mt-1">Hãy bắt đầu hành trình để ghi dấu thành tích của em!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
