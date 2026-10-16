import React, { useState } from 'react';
import { TOPICS_DATA, HISTORICAL_SOURCES } from '../data/topics';
import { useSession } from '../context/SessionContext';
import { ImageLightboxModal } from '../components/ImageLightboxModal';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  Network,
  ArrowLeft,
  Share2,
  ZoomIn,
  Maximize2
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
}

export const HeritageTopicsPage: React.FC<Props> = ({ onBackToHome }) => {
  const { session, recordTopicCompleted } = useSession();
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS_DATA[0].id);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [interactiveAnswered, setInteractiveAnswered] = useState<Record<string, number>>({});
  const [interactiveFeedback, setInteractiveFeedback] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'topics' | 'mindmap'>('topics');

  const activeTopic = TOPICS_DATA.find((t) => t.id === selectedTopicId) || TOPICS_DATA[0];
  const completedModules = session?.completedModules || [];

  const handleCheckAnswer = (topicId: string, optionIdx: number) => {
    setInteractiveAnswered({ ...interactiveAnswered, [topicId]: optionIdx });
    if (optionIdx === activeTopic.interactivePrompt.correctIndex) {
      setInteractiveFeedback({
        ...interactiveFeedback,
        [topicId]: activeTopic.interactivePrompt.explanation
      });
      // Record topic completed (+2 points)
      recordTopicCompleted(topicId);
    } else {
      setInteractiveFeedback({
        ...interactiveFeedback,
        [topicId]: 'Chưa đúng rồi! Em hãy đọc lại kỹ các điểm kiến thức bên trên và thử lại nhé.'
      });
    }
  };

  const handleNextTopic = () => {
    const currIdx = TOPICS_DATA.findIndex((t) => t.id === activeTopic.id);
    if (currIdx < TOPICS_DATA.length - 1) {
      setSelectedTopicId(TOPICS_DATA[currIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-[#21354D] border border-[#D9A441] rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B93632]" />
          <span>Về Trang Chủ</span>
        </button>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#D9A441]/40 shadow-sm">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'topics'
                ? 'bg-[#B93632] text-white shadow'
                : 'text-gray-600 hover:text-[#21354D]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>7 Chủ Đề Di Tích</span>
          </button>
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'mindmap'
                ? 'bg-[#307A67] text-white shadow'
                : 'text-gray-600 hover:text-[#21354D]'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Sơ Đồ Tư Duy Di Sản</span>
          </button>
        </div>
      </div>

      {activeTab === 'mindmap' ? (
        /* Sơ Đồ Tư Duy Di Sản (Mind Map) */
        <div className="bg-white rounded-3xl border-3 border-[#D9A441] shadow-xl p-6 md:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-[#D9A441] rounded-full text-xs font-bold uppercase tracking-wider">
              Khái Quát Toàn Cảnh
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-heritage text-[#21354D] mt-2">
              Sơ Đồ Tư Duy: Lăng Mộ & Đền Thờ Nguyễn Xí
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Khám phá mối liên hệ mật thiết giữa nhân vật lịch sử, khởi nghĩa Lam Sơn, triều Lê, quê hương xứ Nghệ và giá trị bảo tồn di sản.
            </p>
          </div>

          {/* Visual Mind Map Graph */}
          <div className="relative p-6 md:p-8 bg-[#FFF6E5] rounded-3xl border-2 border-[#D9A441]/60">
            {/* Center Core Node */}
            <div className="text-center mb-10">
              <div className="inline-block px-8 py-5 bg-gradient-to-r from-[#B93632] via-[#8B1A17] to-[#B93632] text-white rounded-3xl border-4 border-[#D9A441] shadow-xl">
                <span className="text-xs tracking-widest text-[#FFF6E5] font-semibold block mb-1">
                  TRỌNG TÂM DI SẢN
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-heritage text-white">
                  THÁI SƯ NGUYỄN XÍ
                </h3>
                <span className="text-xs text-[#FFF6E5] font-medium">(1397 – 1465 • Nghĩa Vương)</span>
              </div>
            </div>

            {/* Branch Nodes in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Branch 1 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#307A67] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#307A67] font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#307A67] text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Khởi Nghĩa Lam Sơn</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Phò tá Lê Lợi dấy binh từ 1418, thống lĩnh quân Thiết đột tinh nhuệ, đại thắng Tốt Động – Chúc Động và Chi Lăng – Xương Giang.
                </p>
              </div>

              {/* Branch 2 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#D9A441] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D9A441] text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Phụ Chính 4 Đời Vua Lê</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Tận trung son sắt phụng sự: Lê Thái Tổ, Lê Thái Tông, Lê Nhân Tông và Lê Thánh Tông; được phong Thái sư Cương Quốc công.
                </p>
              </div>

              {/* Branch 3 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#307A67] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#307A67] font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#307A67] text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Công Lao Với Quê Hương</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Khai hoang mở đất lấn biển vùng Nghi Lộc – Cửa Lò, đắp đê ngăn mặn, đào kênh dẫn thủy, xây cầu mở chợ ấm no cho nhân dân.
                </p>
              </div>

              {/* Branch 4 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#B93632] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#B93632] font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#B93632] text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Khởi Dựng Đền Thờ (1467)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Nguyễn Xí mất năm 1465. Năm 1467, vua Lê Thánh Tông hạ sắc chỉ trích ngân khố xây đền thờ tri ân bậc công thần kiệt xuất.
                </p>
              </div>

              {/* Branch 5 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#21354D] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#21354D] font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#21354D] text-white flex items-center justify-center text-xs">
                    5
                  </span>
                  <span>Kiến Trúc Cổ & Phong Thủy</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Bố cục "Nội công ngoại quốc", hồ bán nguyệt phong thủy tụ thủy, nghi môn tứ trụ uy nghiêm, chạm khắc gỗ Tứ linh tinh xảo.
                </p>
              </div>

              {/* Branch 6 */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#D9A441] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D9A441] text-white flex items-center justify-center text-xs">
                    6
                  </span>
                  <span>Di Tích Quốc Gia Đặc Biệt</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Xếp hạng theo Quyết định số 2280/QĐ-TTg ngày 31/12/2020 của Thủ tướng Chính phủ, khẳng định giá trị trường tồn của di tích.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Danh sách 7 chủ đề */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topic List Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/40 shadow-sm">
              <h3 className="font-bold font-heritage text-[#21354D] text-base mb-1">
                Các Chủ Đề Lịch Sử
              </h3>
              <p className="text-xs text-gray-500">
                Hoàn thành mỗi chủ đề để nhận <strong className="text-[#307A67]">+2 điểm</strong> tích lũy!
              </p>
            </div>

            <div className="space-y-2">
              {TOPICS_DATA.map((t) => {
                const isSelected = t.id === selectedTopicId;
                const isCompleted = completedModules.includes(t.id);

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF6E5] border-[#B93632] shadow-md'
                        : 'bg-white hover:bg-amber-50/50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                          isCompleted
                            ? 'bg-[#307A67] text-white border-[#307A67]'
                            : isSelected
                            ? 'bg-[#B93632] text-white border-[#B93632]'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : t.number}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-bold truncate ${
                            isSelected ? 'text-[#B93632]' : 'text-[#21354D]'
                          }`}
                        >
                          Chủ đề {t.number}: {t.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{t.shortDesc}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? 'text-[#B93632]' : 'text-gray-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Topic Content */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-white rounded-3xl border-3 border-[#D9A441]/70 shadow-lg overflow-hidden">
              {/* Topic Hero Image with Caption & Zoom Button */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative h-64 md:h-84 w-full overflow-hidden bg-gray-950 group cursor-pointer"
                title="Nhấp để phóng to và xem kỹ chi tiết ảnh"
              >
                <img
                  src={activeTopic.imageUrl}
                  alt={activeTopic.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>

                {/* Floating Zoom Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-3.5 py-2 bg-black/60 hover:bg-[#B93632] text-white rounded-xl text-xs font-bold border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4 text-amber-300" />
                  <span>Phóng to ảnh</span>
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D9A441] text-[#21354D] rounded-full text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeTopic.period}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heritage drop-shadow">
                    Chủ đề {activeTopic.number}: {activeTopic.title}
                  </h2>
                  <p className="text-xs text-amber-100/90 mt-1 italic flex flex-wrap items-center gap-1.5">
                    <span>{activeTopic.imageCaption}</span>
                    <span className="text-amber-300 not-italic font-semibold underline ml-1">
                      (Nhấp ảnh để phóng to)
                    </span>
                  </p>
                </div>
              </div>

              {/* Topic Content Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="text-base text-gray-800 leading-relaxed space-y-4">
                  {activeTopic.contentParagraphs.map((para, idx) => (
                    <p key={idx} className="font-medium text-justify">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Facts Highlight Box */}
                <div className="p-5 bg-[#FFF6E5] rounded-2xl border-2 border-[#D9A441] space-y-3">
                  <h4 className="font-bold font-heritage text-[#B93632] text-sm md:text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#D9A441]" />
                    <span>Các Điểm Kiến Thức Quan Trọng Cần Ghi Nhớ</span>
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-800">
                    {activeTopic.keyFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#D9A441]/40">
                        <CheckCircle2 className="w-4 h-4 text-[#307A67] flex-shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Check Question for this Topic */}
                <div className="p-6 bg-gradient-to-br from-amber-50 to-[#FFF6E5] rounded-2xl border-2 border-amber-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B93632] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D9A441]" />
                      <span>Câu hỏi gợi mở & củng cố kiến thức</span>
                    </span>
                    {completedModules.includes(activeTopic.id) && (
                      <span className="text-xs px-2.5 py-1 bg-green-100 text-green-800 font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span>Đã hoàn thành (+2 điểm)</span>
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-base text-[#21354D]">
                    {activeTopic.interactivePrompt.question}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeTopic.interactivePrompt.options.map((opt, optIdx) => {
                      const isSelected = interactiveAnswered[activeTopic.id] === optIdx;
                      const isCorrect = optIdx === activeTopic.interactivePrompt.correctIndex;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleCheckAnswer(activeTopic.id, optIdx)}
                          className={`p-3 text-left rounded-xl text-xs md:text-sm font-semibold border-2 transition cursor-pointer ${
                            isSelected && isCorrect
                              ? 'bg-green-100 border-green-500 text-green-900'
                              : isSelected && !isCorrect
                              ? 'bg-red-50 border-red-400 text-red-900'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-[#21354D]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {interactiveFeedback[activeTopic.id] && (
                    <div className="p-3 bg-white rounded-xl border border-[#D9A441] text-xs font-medium text-[#21354D]">
                      {interactiveFeedback[activeTopic.id]}
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Chủ đề {activeTopic.number} / {TOPICS_DATA.length}
                  </span>

                  {activeTopic.number < TOPICS_DATA.length && (
                    <button
                      type="button"
                      onClick={handleNextTopic}
                      className="px-6 py-3 bg-[#B93632] hover:bg-[#9D2824] text-white font-bold rounded-xl text-sm transition shadow flex items-center gap-2 cursor-pointer"
                    >
                      <span>Khám phá chủ đề tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Official Government Citations Section */}
      <footer className="mt-8 p-6 bg-white rounded-3xl border border-[#D9A441]/50 shadow-sm space-y-3">
        <h4 className="font-bold font-heritage text-[#21354D] text-sm uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#B93632]" />
          <span>Nguồn Tư Liệu Lịch Sử Tham Khảo Chính Thức</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HISTORICAL_SOURCES.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#FFF6E5]/60 hover:bg-[#FFF6E5] rounded-xl border border-amber-200 transition text-xs block group"
            >
              <div className="font-bold text-[#B93632] group-hover:underline flex items-center justify-between">
                <span>{source.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#B93632]" />
              </div>
              <p className="text-gray-600 mt-1">{source.note}</p>
            </a>
          ))}
        </div>
      </footer>

      {/* Lightbox Modal with Zoom & Pan for detailed exploration */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        topic={activeTopic}
        allTopics={TOPICS_DATA}
        onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
      />
    </div>
  );
};
