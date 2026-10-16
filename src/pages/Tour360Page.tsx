import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import {
  Compass,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Eye,
  CheckSquare,
  Square,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onBackToHome: () => void;
}

export const Tour360Page: React.FC<Props> = ({ onBackToHome }) => {
  const { session, recordTour360Completed } = useSession();
  const [hasOpenedTour, setHasOpenedTour] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [showCompletionToast, setShowCompletionToast] = useState<boolean>(false);

  const TOUR_URL = 'https://vr3d.com.vn/vnpt-na/8/dennguyenxi/';
  const isAlreadyCredited = session?.completedModules.includes('tour-360');

  const observationItems = [
    {
      id: 'obs-1',
      title: 'Hồ Bán Nguyệt phía trước đền',
      description: 'Quan sát mặt nước tĩnh lặng tạo thế phong thủy tụ thủy sinh phúc khí cho toàn bộ di tích.'
    },
    {
      id: 'obs-2',
      title: 'Nghi Môn Tứ Trụ uy nghi',
      description: 'Chiêm ngưỡng 4 cột trụ cổ kính sừng sững dẫn lối vào sân đền trang nghiêm.'
    },
    {
      id: 'obs-3',
      title: 'Nhà Tiền tế (Hạ điện) và Trung điện',
      description: 'Quan sát kiến trúc khung gỗ lim cổ với hệ thống vì kèo vững chãi trường tồn hơn 5 thế kỷ.'
    },
    {
      id: 'obs-4',
      title: 'Hậu cung (Thượng điện) thâm nghiêm',
      description: 'Nơi đặt bài vị và tượng thờ danh thần Thái sư Cương Quốc công Nguyễn Xí.'
    },
    {
      id: 'obs-5',
      title: 'Hoa văn chạm khắc gỗ cổ truyền',
      description: 'Tìm kiếm các nét chạm trổ tinh hoa: hình rồng mây, phượng múa, hoa sen và các linh vật phong thủy.'
    }
  ];

  const handleOpen360Tour = () => {
    setHasOpenedTour(true);
    const win = window.open(TOUR_URL, '_blank', 'noopener,noreferrer');
    if (!win) {
      alert('Trình duyệt của bạn đang chặn mở cửa sổ mới. Vui lòng bấm vào liên kết trực tiếp bên dưới.');
    }
  };

  const toggleCheck = (id: string) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((item) => item !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  const handleFinishTour = async () => {
    if (!isAlreadyCredited) {
      await recordTour360Completed();
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9A441', '#307A67', '#B93632']
        });
      } catch {}
    }
    setShowCompletionToast(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-[#21354D] border border-[#D9A441] rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B93632]" />
          <span>Quay lại hành trình</span>
        </button>

        {isAlreadyCredited && (
          <span className="px-3.5 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-300">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Đã hoàn thành nhiệm vụ tham quan (+3 điểm)</span>
          </span>
        )}
      </div>

      {/* Main Showcase Hero Card */}
      <div className="bg-white rounded-3xl border-4 border-[#D9A441] shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] p-8 text-white text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D9A441]/25 border border-[#D9A441] rounded-full text-xs font-bold text-[#FFF6E5] mb-3">
            <Compass className="w-4 h-4 text-[#D9A441]" />
            <span>THAM QUAN THỰC TẾ ẢO 360° CHÍNH THỨC</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold font-heritage drop-shadow">
            Không Gian 360° Đền Thờ Nguyễn Xí
          </h2>

          <p className="text-sm md:text-base text-[#FFF6E5]/90 mt-2 max-w-2xl mx-auto">
            “Đã đến lúc khám phá Đền thờ Nguyễn Xí từ một góc nhìn mới. Hãy quan sát thật kỹ để khám phá những điều thú vị!”
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Visual Preview / Instruction Callout */}
          <div className="p-6 bg-[#FFF6E5] rounded-3xl border-2 border-[#D9A441]/60 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#307A67] to-[#1E5244] border-2 border-[#D9A441] flex items-center justify-center text-[#FFF6E5] flex-shrink-0 shadow-lg">
              <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-lg font-bold font-heritage text-[#21354D]">
                Mở Không Gian Tham Quan Trực Tuyến 360°
              </h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                Tour 360° chính thức từ VNPT Nghệ An sẽ mở ra trong một tab mới. Người học có thể xoay 360 độ, phóng to thu nhỏ để chiêm ngưỡng toàn cảnh khuôn viên lăng mộ, nghi môn và các tòa điện thờ cổ kính.
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleOpen360Tour}
                className="px-8 py-4 bg-gradient-to-r from-[#B93632] to-[#8B1A17] hover:from-[#9D2824] hover:to-[#741310] text-[#FFF6E5] font-bold text-base rounded-2xl shadow-xl transition flex items-center gap-2 border border-[#D9A441] cursor-pointer transform active:scale-95"
              >
                <Eye className="w-5 h-5 text-[#D9A441]" />
                <span className="font-heritage">MỞ TOUR 360°</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Direct link fallback if browser blocked popup */}
          <div className="text-center text-xs text-gray-500">
            Nếu cửa sổ mới không tự mở, em có thể bấm vào liên kết trực tiếp này:{' '}
            <a
              href={TOUR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B93632] underline font-bold"
            >
              {TOUR_URL}
            </a>
          </div>

          {/* Observation Checklist Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold font-heritage text-[#21354D] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#307A67]" />
                  <span>Sổ Tay Quan Sát Thực Địa</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Đánh dấu các hạng mục em đã quan sát thấy trong chuyến tham quan 360°:
                </p>
              </div>

              <span className="text-xs font-bold text-[#307A67] bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Đã quan sát: {checkedList.length}/{observationItems.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {observationItems.map((item) => {
                const isChecked = checkedList.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition flex items-start gap-3 cursor-pointer ${
                      isChecked
                        ? 'bg-green-50/70 border-green-500 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h5
                        className={`text-sm font-bold ${
                          isChecked ? 'text-green-900' : 'text-[#21354D]'
                        }`}
                      >
                        {item.title}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completion Action Box */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-[#D9A441] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="font-bold text-sm text-[#21354D] flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Ghi nhận hoàn thành chuyến tham quan</span>
              </h5>
              <p className="text-xs text-gray-600">
                Sau khi quan sát không gian 360°, nhấn nút bên cạnh để máy chủ ghi nhận thành tích (+3 điểm thưởng).
              </p>
            </div>

            <button
              type="button"
              disabled={isAlreadyCredited}
              onClick={handleFinishTour}
              className={`px-6 py-3 rounded-xl font-bold text-sm shadow transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                isAlreadyCredited
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-[#307A67] hover:bg-[#256051] text-white border border-[#D9A441]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
              <span>{isAlreadyCredited ? 'Đã hoàn thành' : 'Em đã hoàn thành chuyến tham quan'}</span>
            </button>
          </div>

          {showCompletionToast && (
            <div className="p-4 bg-green-100 border border-green-400 rounded-2xl text-green-900 text-sm font-medium flex items-center gap-3 animate-fade-in">
              <Award className="w-5 h-5 text-green-700 flex-shrink-0" />
              <span>
                Chúc mừng em! Hoạt động tham quan 360° đã được máy chủ ghi nhận thành công và cộng vào điểm tích lũy của em.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
