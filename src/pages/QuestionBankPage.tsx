import React, { useState } from 'react';
import { CLIENT_QUESTIONS } from '../data/clientQuestions';
import { InteractiveQuestionCard } from '../components/InteractiveQuestionCard';
import { useSession } from '../context/SessionContext';
import {
  HelpCircle,
  Filter,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
}

export const QuestionBankPage: React.FC<Props> = ({ onBackToHome }) => {
  const { session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'practice' | 'browser'>('practice');

  // Filtered questions
  const filteredQuestions = CLIENT_QUESTIONS.filter((q) => {
    const matchTopic = selectedTopicFilter === 'all' || q.topicId === selectedTopicFilter;
    const matchType = selectedTypeFilter === 'all' || q.type === selectedTypeFilter;
    return matchTopic && matchType;
  });

  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const topicOptions = [
    { id: 'all', label: 'Tất cả chủ đề' },
    { id: 'topic-1', label: 'Nguyễn Xí là ai?' },
    { id: 'topic-2', label: 'Khởi nghĩa Lam Sơn' },
    { id: 'topic-3', label: 'Công lao quê hương' },
    { id: 'topic-4', label: 'Lịch sử dựng đền' },
    { id: 'topic-5', label: 'Khám phá kiến trúc' },
    { id: 'topic-6', label: 'Di tích quốc gia đặc biệt' },
    { id: 'topic-7', label: 'Gìn giữ di sản' }
  ];

  const typeOptions = [
    { id: 'all', label: 'Tất cả các dạng' },
    { id: 'single_choice', label: 'Chọn một đáp án' },
    { id: 'multiple_choice', label: 'Chọn nhiều đáp án' },
    { id: 'drag_sort', label: 'Sắp xếp thời gian' },
    { id: 'fill_blank', label: 'Điền từ còn thiếu' },
    { id: 'drag_sentence', label: 'Điền từ vào câu' },
    { id: 'matching', label: 'Ghép cặp đôi' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-[#21354D] border border-[#D9A441] rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B93632]" />
          <span>Về Trang Chủ</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('practice')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              viewMode === 'practice'
                ? 'bg-[#B93632] text-white shadow'
                : 'bg-white text-gray-600 hover:text-[#21354D] border border-gray-200'
            }`}
          >
            Luyện Tập Từng Câu
          </button>
          <button
            onClick={() => setViewMode('browser')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              viewMode === 'browser'
                ? 'bg-[#307A67] text-white shadow'
                : 'bg-white text-gray-600 hover:text-[#21354D] border border-gray-200'
            }`}
          >
            Danh Sách Ngân Hàng ({CLIENT_QUESTIONS.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#D9A441]/50 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
            <Filter className="w-4 h-4 text-[#B93632]" />
            <span>Bộ lọc:</span>
          </div>

          {/* Topic Select */}
          <select
            value={selectedTopicFilter}
            onChange={(e) => {
              setSelectedTopicFilter(e.target.value);
              setCurrentQuestionIndex(0);
            }}
            className="px-3 py-2 bg-[#FFF6E5] border border-[#D9A441] rounded-xl text-xs font-semibold text-[#21354D] focus:outline-none focus:ring-1 focus:ring-[#B93632]"
          >
            {topicOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Type Select */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => {
              setSelectedTypeFilter(e.target.value);
              setCurrentQuestionIndex(0);
            }}
            className="px-3 py-2 bg-[#FFF6E5] border border-[#D9A441] rounded-xl text-xs font-semibold text-[#21354D] focus:outline-none focus:ring-1 focus:ring-[#B93632]"
          >
            {typeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-600 font-medium">
          Hiển thị <strong>{filteredQuestions.length}</strong> câu hỏi phù hợp
        </div>
      </div>

      {/* VIEW MODE 1: PRACTICE RUNNER */}
      {viewMode === 'practice' && (
        <div className="space-y-6">
          {filteredQuestions.length > 0 ? (
            <>
              {/* Question Index Progress Tracker */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-600 bg-white px-5 py-3 rounded-2xl border border-gray-200">
                <span>
                  Câu hỏi <strong>{currentQuestionIndex + 1}</strong> / {filteredQuestions.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={handlePrev}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition cursor-pointer"
                  >
                    Câu trước
                  </button>
                  <button
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                    onClick={handleNext}
                    className="px-3 py-1.5 rounded-lg bg-[#307A67] text-white hover:bg-[#256051] disabled:opacity-40 transition cursor-pointer"
                  >
                    Câu sau
                  </button>
                </div>
              </div>

              {/* Main Question Card with All 6 Formats */}
              <InteractiveQuestionCard
                key={activeQuestion.id}
                question={activeQuestion}
                onNext={handleNext}
                showNextButton={currentQuestionIndex < filteredQuestions.length - 1}
              />
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-gray-500 space-y-2">
              <HelpCircle className="w-10 h-10 mx-auto text-gray-400" />
              <p className="font-bold">Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.</p>
              <button
                onClick={() => {
                  setSelectedTopicFilter('all');
                  setSelectedTypeFilter('all');
                }}
                className="text-xs text-[#B93632] underline font-bold"
              >
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: BROWSE ALL QUESTIONS */}
      {viewMode === 'browser' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                setViewMode('practice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-white hover:bg-amber-50/50 rounded-2xl border-2 border-gray-200 hover:border-[#D9A441] shadow-sm transition space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold">
                  Câu #{idx + 1}
                </span>
                <span className="text-[11px] text-[#307A67] font-semibold bg-[#307A67]/10 px-2 py-0.5 rounded-full">
                  {q.topicTitle}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#21354D] group-hover:text-[#B93632] transition line-clamp-2">
                {q.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1">{q.instruction}</p>
              <div className="text-[11px] text-gray-400 pt-1 flex items-center justify-between">
                <span>Dạng: {q.type}</span>
                <span className="text-[#B93632] font-bold group-hover:underline">Bắt đầu giải →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
