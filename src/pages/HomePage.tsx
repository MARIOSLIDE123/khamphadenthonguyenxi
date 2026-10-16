import React from 'react';
import { useSession } from '../context/SessionContext';
import {
  BookOpen,
  Compass,
  HelpCircle,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface Props {
  onNavigate: (tab: 'topics' | 'tour' | 'quiz' | 'arena' | 'leaderboard') => void;
  onOpenBadgesModal: () => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onOpenBadgesModal }) => {
  const { learner, session, activeSeconds, earnedBadges } = useSession();

  const completedModules = session?.completedModules || [];
  const topicCount = completedModules.filter((m) => m.startsWith('topic-')).length;
  const isTourCompleted = completedModules.includes('tour-360');

  const minutes = Math.floor(activeSeconds / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#B93632] via-[#91201D] to-[#21354D] text-white p-6 md:p-10 shadow-2xl border-4 border-[#D9A441]">
        {/* Background Traditional Watermark Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Building className="w-80 h-80 text-[#D9A441]" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D9A441]/25 border border-[#D9A441] rounded-full text-xs font-bold text-[#FFF6E5]">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>DI TÍCH QUỐC GIA ĐẶC BIỆT • XÃ ĐÔNG LỘC, TỈNH NGHỆ AN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heritage tracking-wide leading-tight text-white drop-shadow-md">
            HÀNH TRÌNH KHÁM PHÁ ĐỀN THỜ NGUYỄN XÍ
          </h1>

          <p className="text-sm md:text-base text-[#FFF6E5]/90 leading-relaxed font-medium">
            Cùng tìm hiểu lịch sử, khám phá kiến trúc và gìn giữ giá trị di sản quê hương. Khám phá dấu tích oanh liệt của Thái sư Cương Quốc công qua 4 triều vua Lê lừng lẫy.
          </p>

          {/* Quick Welcome Stats */}
          {learner && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 text-xs md:text-sm font-semibold">
                👤 Người học: <strong className="text-[#D9A441]">{learner.fullName}</strong> ({learner.schoolName})
              </div>
              <div className="px-4 py-2 bg-[#D9A441]/30 backdrop-blur-md rounded-xl border border-[#D9A441] text-xs md:text-sm font-bold text-[#FFF6E5]">
                ⭐ {session?.totalScore ?? 0} Điểm tích lũy
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5 MAIN ACTION CARDS (CENTRAL HUB) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-heritage text-[#21354D]">
              5 Phân Hệ Khám Phá Trọng Tâm
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Chọn một hoạt động để bắt đầu hành trình tìm hiểu và ghi danh thành tích
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. TÌM HIỂU DI TÍCH */}
          <div
            onClick={() => onNavigate('topics')}
            className="group relative bg-white hover:bg-amber-50/40 rounded-3xl border-3 border-[#D9A441]/50 hover:border-[#B93632] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B93632] to-[#8B1A17] text-white flex items-center justify-center shadow-md border-2 border-[#D9A441] group-hover:scale-105 transition">
                  <BookOpen className="w-7 h-7 text-[#D9A441]" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                  {topicCount}/7 Chủ đề
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#B93632] uppercase tracking-wider block mb-1">
                  Phân Hệ 1
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#21354D] group-hover:text-[#B93632] transition">
                  TÌM HIỂU DI TÍCH
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  Khám phá nhân vật lịch sử, khởi nghĩa Lam Sơn, lịch sử hình thành, nghệ thuật kiến trúc cổ và sơ đồ tư duy di sản.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
              <span className="text-xs font-bold text-[#307A67]">+2 điểm / mỗi chủ đề</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#B93632] text-gray-600 group-hover:text-white flex items-center justify-center transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. THAM QUAN 360° */}
          <div
            onClick={() => onNavigate('tour')}
            className="group relative bg-white hover:bg-amber-50/40 rounded-3xl border-3 border-[#D9A441]/50 hover:border-[#307A67] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#307A67] to-[#1E5244] text-white flex items-center justify-center shadow-md border-2 border-[#D9A441] group-hover:scale-105 transition">
                  <Compass className="w-7 h-7 text-[#D9A441]" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isTourCompleted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isTourCompleted ? 'Đã hoàn thành' : 'Thực tế ảo VR3D'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#307A67] uppercase tracking-wider block mb-1">
                  Phân Hệ 2
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#21354D] group-hover:text-[#307A67] transition">
                  THAM QUAN 360°
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  Mở không gian tham quan trực tuyến 360 độ của di tích Đền thờ Nguyễn Xí. Quan sát hồ bán nguyệt, nghi môn và thượng điện.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
              <span className="text-xs font-bold text-[#307A67]">+3 điểm thưởng</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#307A67] text-gray-600 group-hover:text-white flex items-center justify-center transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 3. CÂU HỎI TƯƠNG TÁC */}
          <div
            onClick={() => onNavigate('quiz')}
            className="group relative bg-white hover:bg-amber-50/40 rounded-3xl border-3 border-[#D9A441]/50 hover:border-[#D9A441] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D9A441] to-[#AA7B24] text-white flex items-center justify-center shadow-md border-2 border-amber-300 group-hover:scale-105 transition">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                  32 Câu hỏi • 6 Dạng
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Phân Hệ 3
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#21354D] group-hover:text-[#B93632] transition">
                  CÂU HỎI TƯƠNG TÁC
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  Trả lời các câu hỏi trắc nghiệm, kéo thả sắp xếp, ghép cột, điền từ còn thiếu và củng cố kiến thức lịch sử sâu sắc.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
              <span className="text-xs font-bold text-[#307A67]">Tối đa 10đ / câu đúng</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#D9A441] text-gray-600 group-hover:text-white flex items-center justify-center transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 4. ĐẤU TRƯỜNG TRÍ TUỆ */}
          <div
            onClick={() => onNavigate('arena')}
            className="group relative bg-white hover:bg-amber-50/40 rounded-3xl border-3 border-[#D9A441]/50 hover:border-[#B93632] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B93632] via-[#E65100] to-[#8B1A17] text-white flex items-center justify-center shadow-md border-2 border-[#D9A441] group-hover:scale-105 transition">
                  <Flame className="w-7 h-7 text-[#D9A441]" />
                </div>
                <span className="px-3 py-1 bg-red-100 text-[#B93632] rounded-full text-xs font-bold">
                  5 Vòng thi đấu
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#B93632] uppercase tracking-wider block mb-1">
                  Phân Hệ 4
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#21354D] group-hover:text-[#B93632] transition">
                  ĐẤU TRƯỜNG TRÍ TUỆ
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  Tham gia các vòng thi tính giờ, vượt qua thử thách lịch sử và nhận huy hiệu danh giá <em>Hộ Thần Di Tích Quốc Gia</em>.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
              <span className="text-xs font-bold text-[#B93632]">+5đ - 10đ thưởng vòng</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#B93632] text-gray-600 group-hover:text-white flex items-center justify-center transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 5. BẢNG XẾP HẠNG TOÀN QUỐC */}
          <div
            onClick={() => onNavigate('leaderboard')}
            className="group relative bg-white hover:bg-amber-50/40 rounded-3xl border-3 border-[#D9A441]/50 hover:border-[#21354D] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer md:col-span-2 lg:col-span-2"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#21354D] to-[#121F2D] text-white flex items-center justify-center shadow-md border-2 border-[#D9A441] group-hover:scale-105 transition">
                  <Trophy className="w-7 h-7 text-[#D9A441]" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Cập nhật trực tiếp</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#21354D] uppercase tracking-wider block mb-1">
                  Phân Hệ 5
                </span>
                <h3 className="text-xl font-bold font-heritage text-[#21354D] group-hover:text-[#B93632] transition">
                  BẢNG XẾP HẠNG TOÀN QUỐC
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  Theo dõi vị trí của bản thân và thành tích của những người học khác trong toàn hệ thống ứng dụng. Dữ liệu đồng bộ trực tiếp từ máy chủ.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-6">
              <span className="text-xs font-bold text-[#21354D]">Top vinh danh danh dự</span>
              <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-[#21354D] text-gray-600 group-hover:text-white flex items-center justify-center transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "HÀNH TRÌNH CỦA EM" SHOWCASE SECTION */}
      <section className="bg-white rounded-3xl border-3 border-[#D9A441] p-6 md:p-8 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl border border-[#D9A441]">
              <Award className="w-6 h-6 text-[#B93632]" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-heritage text-[#21354D]">
                Hành Trình Khám Phá Của Em
              </h3>
              <p className="text-xs text-gray-500">
                Ghi nhận các nội dung đã hoàn thành, huy hiệu và tiến độ học tập
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBadgesModal}
            className="px-4 py-2 bg-[#FFF6E5] hover:bg-amber-100 text-[#21354D] border border-[#D9A441] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Xem chi tiết kho huy hiệu ({earnedBadges.length})</span>
            <ChevronRight className="w-4 h-4 text-[#B93632]" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]/40 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#D9A441] flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#B93632]">{session?.totalScore ?? 0}</div>
              <div className="text-xs text-gray-600">Điểm tích lũy</div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]/40 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-[#307A67] flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#307A67]">{session?.totalCorrect ?? 0}</div>
              <div className="text-xs text-gray-600">Câu trả lời đúng</div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]/40 flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#21354D] flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#21354D]">{minutes} phút</div>
              <div className="text-xs text-gray-600">Thời gian chủ động</div>
            </div>
          </div>

          <div className="p-4 bg-[#FFF6E5] rounded-2xl border border-[#D9A441]/40 flex items-center gap-3">
            <Award className="w-8 h-8 text-[#D9A441] flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#8B5E00]">{earnedBadges.length} Huy hiệu</div>
              <div className="text-xs text-gray-600">Thành tích đạt được</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
