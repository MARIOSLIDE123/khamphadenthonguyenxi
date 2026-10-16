import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { User, School, BookOpen, Sparkles, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const RegistrationModal: React.FC = () => {
  const { registerLearner, isLoading } = useSession();
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedSchool = schoolName.trim();
    const trimmedClass = className.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Vui lòng nhập họ và tên của em (tối thiểu 2 ký tự).');
      return;
    }

    if (!trimmedSchool || trimmedSchool.length < 2) {
      setErrorMessage('Vui lòng nhập tên trường học của em.');
      return;
    }

    if (!trimmedClass) {
      setErrorMessage('Vui lòng nhập lớp học của em (ví dụ: 4A, 5B).');
      return;
    }

    try {
      await registerLearner(trimmedName, trimmedSchool, trimmedClass);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ. Em hãy kiểm tra mạng và thử lại nhé!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#21354D]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF6E5] rounded-3xl shadow-2xl border-4 border-[#D9A441] overflow-hidden my-8">
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] px-6 py-6 text-white text-center relative shadow-md">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 mb-2 bg-[#D9A441]/25 border border-[#D9A441] rounded-full text-xs font-semibold text-[#FFF6E5]">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>DI TÍCH QUỐC GIA ĐẶC BIỆT • XÃ ĐÔNG LỘC, TỈNH NGHỆ AN</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-heritage tracking-wide text-white drop-shadow">
            Chào mừng em đến với hành trình khám phá di sản!
          </h1>
          <p className="text-sm text-[#FFF6E5]/90 mt-1 max-w-lg mx-auto">
            Hành trình khám phá Đền thờ Nguyễn Xí – Nơi hội tụ tinh hoa lịch sử và hào khí non sông.
          </p>
        </div>

        {/* Content Form */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-100 border border-red-300 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Chưa hoàn tất thông tin:</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#21354D] mb-1.5">
                Họ và tên của em <span className="text-[#B93632]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#307A67]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Hải Đăng"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#D9A441]/60 rounded-xl text-[#21354D] placeholder-gray-400 focus:outline-none focus:border-[#B93632] focus:ring-2 focus:ring-[#B93632]/20 font-medium transition"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Nhập đầy đủ họ và tên để nhận chứng nhận và ghi danh thành tích.</p>
            </div>

            {/* School & Class in 2 Columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#21354D] mb-1.5">
                  Trường của em <span className="text-[#B93632]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#307A67]">
                    <School className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Ví dụ: Tiểu học Nghi Hợp hoặc Đông Lộc..."
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#D9A441]/60 rounded-xl text-[#21354D] placeholder-gray-400 focus:outline-none focus:border-[#B93632] focus:ring-2 focus:ring-[#B93632]/20 font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#21354D] mb-1.5">
                  Lớp <span className="text-[#B93632]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#307A67]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: 4A, 5B"
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#D9A441]/60 rounded-xl text-[#21354D] placeholder-gray-400 focus:outline-none focus:border-[#B93632] focus:ring-2 focus:ring-[#B93632]/20 font-medium transition"
                  />
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#307A67] mt-0.5" />
              <p>
                <strong>Bảo mật thông tin:</strong> Tên đầy đủ và lớp được bảo mật trong hệ thống quản lý học tập. Bảng xếp hạng công khai sẽ hiển thị tên viết tắt an toàn (ví dụ: <em>Nguyễn H. Đ. - TH Nghi Hợp</em>).
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#B93632] to-[#8B1A17] hover:from-[#9D2824] hover:to-[#741310] text-[#FFF6E5] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 border border-[#D9A441] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang kết nối hệ thống di sản...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#D9A441]" />
                    <span className="font-heritage tracking-wide">BẮT ĐẦU KHÁM PHÁ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
