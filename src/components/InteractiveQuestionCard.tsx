import React, { useState } from 'react';
import { ClientQuestion, AnswerResult } from '../types';
import { apiClient, generateTransactionId } from '../services/api';
import { useSession } from '../context/SessionContext';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MoveUp,
  MoveDown,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface Props {
  question: ClientQuestion;
  onQuestionCompleted?: (result: AnswerResult) => void;
  onNext?: () => void;
  showNextButton?: boolean;
}

export const InteractiveQuestionCard: React.FC<Props> = ({
  question,
  onQuestionCompleted,
  onNext,
  showNextButton = true
}) => {
  const { session, learner, updateScoreFromAnswer } = useSession();

  // Answer states depending on question type
  const [singleAnswer, setSingleAnswer] = useState<string>('');
  const [multiAnswer, setMultiAnswer] = useState<string[]>([]);
  const [sortItems, setSortItems] = useState<string[]>(() => question.options ? [...question.options] : []);
  const [blankInput, setBlankInput] = useState<string>('');
  const [sentenceBlanks, setSentenceBlanks] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);

  // Submission & evaluation states
  const [attemptNumber, setAttemptNumber] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D9A441', '#B93632', '#307A67', '#FFF6E5']
      });
    } catch {}
  };

  // Compile user's answer into appropriate payload structure
  const getUserAnswer = () => {
    switch (question.type) {
      case 'single_choice':
        return singleAnswer;
      case 'multiple_choice':
        return multiAnswer;
      case 'drag_sort':
        return sortItems;
      case 'fill_blank':
        return blankInput.trim();
      case 'drag_sentence':
        // Array of blanks in order: blank1, blank2
        const blanksCount = question.blankCount || 2;
        const arr: string[] = [];
        for (let i = 1; i <= blanksCount; i++) {
          arr.push(sentenceBlanks[`blank${i}`] || '');
        }
        return arr;
      case 'matching':
        return matchingSelections;
      default:
        return '';
    }
  };

  // Check if answer is provided before submit
  const isAnswerProvided = () => {
    switch (question.type) {
      case 'single_choice':
        return Boolean(singleAnswer);
      case 'multiple_choice':
        return multiAnswer.length > 0;
      case 'drag_sort':
        return sortItems.length > 0;
      case 'fill_blank':
        return Boolean(blankInput.trim());
      case 'drag_sentence': {
        const count = question.blankCount || 2;
        return Object.keys(sentenceBlanks).length >= count;
      }
      case 'matching': {
        const totalLeft = question.matchingPairs?.left.length || 0;
        return Object.keys(matchingSelections).length === totalLeft;
      }
      default:
        return false;
    }
  };

  // Submit Answer to server
  const handleSubmit = async () => {
    if (!isAnswerProvided() || isSubmitting || !session || !learner) return;

    setIsSubmitting(true);
    const nextAttempt = attemptNumber + 1;

    try {
      const txn = generateTransactionId('ANS');
      const res = await apiClient.submitAnswer({
        sessionId: session.sessionId,
        studentId: learner.studentId,
        questionId: question.id,
        attemptNumber: nextAttempt,
        answer: getUserAnswer(),
        transactionId: txn
      });

      setAttemptNumber(nextAttempt);
      setResult(res);

      if (res.isCorrect) {
        soundEffects.playCorrect();
        triggerConfetti();
        updateScoreFromAnswer(res.pointsAwarded, true, res.currentScore, res.totalCorrect);
        if (onQuestionCompleted) onQuestionCompleted(res);
      } else {
        soundEffects.playIncorrect();
        if (nextAttempt >= 2) {
          // Both attempts used
          updateScoreFromAnswer(0, false, res.currentScore, res.totalCorrect);
          if (onQuestionCompleted) onQuestionCompleted(res);
        } else {
          // Give hint for second chance
          setShowHint(true);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Có lỗi khi gửi đáp án. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move item up / down in drag_sort
  const moveSortItem = (index: number, direction: 'up' | 'down') => {
    if (result?.isCorrect || attemptNumber >= 2) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortItems.length) return;

    const newArr = [...sortItems];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setSortItems(newArr);
  };

  // Reset to retry attempt 2
  const handleRetryAttempt = () => {
    setResult(null);
  };

  const isCompleted = result?.isCorrect || attemptNumber >= 2;

  return (
    <div className="bg-white rounded-3xl border-2 border-[#D9A441]/50 shadow-md p-6 md:p-8 space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#307A67]/15 text-[#307A67] rounded-full text-xs font-bold uppercase tracking-wider">
            {question.topicTitle}
          </span>
          <span className="text-xs text-gray-600 font-semibold">
            {question.type === 'single_choice' && 'Trắc nghiệm một lựa chọn'}
            {question.type === 'multiple_choice' && 'Trắc nghiệm nhiều lựa chọn'}
            {question.type === 'drag_sort' && 'Sắp xếp theo thứ tự'}
            {question.type === 'fill_blank' && 'Điền từ vào chỗ trống'}
            {question.type === 'drag_sentence' && 'Kéo từ hoàn thiện câu'}
            {question.type === 'matching' && 'Ghép cặp đôi tương ứng'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Lần thử: {attemptNumber}/2
          </span>
        </div>
      </div>

      {/* Question Title & Instructions */}
      <div>
        <h3 className="text-lg md:text-xl font-bold font-heritage text-[#21354D] leading-relaxed">
          {question.title}
        </h3>
        <p className="text-sm text-gray-700 mt-1 font-medium">{question.instruction}</p>
      </div>

      {/* QUESTION INTERACTIVE BODIES */}

      {/* 1. Single Choice */}
      {question.type === 'single_choice' && question.options && (
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = singleAnswer === opt;
            const isRevealedCorrect = result && result.correctAnswer === opt;
            return (
              <button
                key={idx}
                type="button"
                disabled={isCompleted || isSubmitting}
                onClick={() => setSingleAnswer(opt)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-center justify-between cursor-pointer disabled:cursor-default ${
                  isRevealedCorrect
                    ? 'bg-green-50 border-green-500 text-green-900 font-bold'
                    : isSelected
                    ? 'bg-amber-50 border-[#B93632] text-[#B93632] font-semibold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-[#21354D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                      isRevealedCorrect
                        ? 'bg-green-500 text-white border-green-600'
                        : isSelected
                        ? 'bg-[#B93632] text-white border-[#B93632]'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm md:text-base">{opt}</span>
                </div>
                {isRevealedCorrect && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Multiple Choice */}
      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = multiAnswer.includes(opt);
            const isRevealedCorrect =
              result && Array.isArray(result.correctAnswer) && result.correctAnswer.includes(opt);

            const toggleOpt = () => {
              if (isCompleted || isSubmitting) return;
              if (isSelected) {
                setMultiAnswer(multiAnswer.filter((item) => item !== opt));
              } else {
                setMultiAnswer([...multiAnswer, opt]);
              }
            };

            return (
              <button
                key={idx}
                type="button"
                disabled={isCompleted || isSubmitting}
                onClick={toggleOpt}
                className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-center justify-between cursor-pointer disabled:cursor-default ${
                  isRevealedCorrect
                    ? 'bg-green-50 border-green-500 text-green-900 font-bold'
                    : isSelected
                    ? 'bg-amber-50 border-[#307A67] text-[#307A67] font-semibold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-[#21354D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border ${
                      isRevealedCorrect
                        ? 'bg-green-500 text-white border-green-600'
                        : isSelected
                        ? 'bg-[#307A67] text-white border-[#307A67]'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                  <span className="text-sm md:text-base">{opt}</span>
                </div>
                {isRevealedCorrect && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Drag Sort */}
      {question.type === 'drag_sort' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">
            Nhấn nút mũi tên Lên / Xuống để sắp xếp sự kiện từ trên xuống dưới (sớm nhất ở trên cùng).
          </p>
          {sortItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 bg-gray-50 border-2 rounded-2xl flex items-center justify-between gap-3 ${
                result?.isCorrect ? 'border-green-400 bg-green-50/50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#D9A441]/30 border border-[#D9A441] text-[#21354D] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-[#21354D]">{item}</span>
              </div>
              {!isCompleted && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSortItem(idx, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Chuyển lên"
                  >
                    <MoveUp className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sortItems.length - 1}
                    onClick={() => moveSortItem(idx, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="Chuyển xuống"
                  >
                    <MoveDown className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. Fill in Blank */}
      {question.type === 'fill_blank' && (
        <div className="space-y-4">
          {question.fillPrompt && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-base font-semibold text-[#21354D]">
              {question.fillPrompt}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nhập từ hoặc cụm từ câu trả lời:</label>
            <input
              type="text"
              value={blankInput}
              disabled={isCompleted || isSubmitting}
              onChange={(e) => setBlankInput(e.target.value)}
              placeholder="Nhập câu trả lời của em..."
              className="w-full px-4 py-3 bg-white border-2 border-[#D9A441] rounded-2xl text-base font-medium text-[#21354D] focus:outline-none focus:border-[#B93632]"
            />
          </div>
        </div>
      )}

      {/* 5. Drag Sentence (Word Bank) */}
      {question.type === 'drag_sentence' && (
        <div className="space-y-4">
          {/* Word Bank */}
          {!isCompleted && question.wordBank && (
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Ngân hàng từ (Chọn từ rồi nhấn vào ô trống tương ứng):
              </span>
              <div className="flex flex-wrap gap-2">
                {question.wordBank.map((word, wIdx) => {
                  const isWordSelected = selectedWord === word;
                  return (
                    <button
                      key={wIdx}
                      type="button"
                      onClick={() => setSelectedWord(word)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition cursor-pointer ${
                        isWordSelected
                          ? 'bg-[#B93632] text-white border-[#B93632] shadow'
                          : 'bg-white hover:bg-amber-50 text-[#21354D] border-[#D9A441]'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sentence with slots */}
          <div className="p-5 bg-amber-50/70 border-2 border-dashed border-[#D9A441] rounded-2xl text-base leading-loose text-[#21354D]">
            {question.sentenceTemplate?.split(/(\{blank\d+\})/).map((part, idx) => {
              const match = part.match(/\{blank(\d+)\}/);
              if (match) {
                const key = `blank${match[1]}`;
                const val = sentenceBlanks[key];
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isCompleted}
                    onClick={() => {
                      if (selectedWord) {
                        setSentenceBlanks({ ...sentenceBlanks, [key]: selectedWord });
                        setSelectedWord(null);
                      } else if (val) {
                        // Clear slot
                        const copy = { ...sentenceBlanks };
                        delete copy[key];
                        setSentenceBlanks(copy);
                      }
                    }}
                    className={`inline-block mx-1.5 px-3 py-1 min-w-[100px] border-2 rounded-xl font-bold text-sm transition cursor-pointer align-middle ${
                      val
                        ? 'bg-white border-[#307A67] text-[#307A67] shadow-sm'
                        : 'bg-white/80 border-dashed border-gray-400 text-gray-400 hover:border-[#B93632]'
                    }`}
                  >
                    {val || `[ Ô ${match[1]} ]`}
                  </button>
                );
              }
              return <span key={idx}>{part}</span>;
            })}
          </div>
        </div>
      )}

      {/* 6. Matching Columns */}
      {question.type === 'matching' && question.matchingPairs && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Chọn 1 mục ở Cột A (trái) rồi chọn mục phù hợp ở Cột B (phải) để ghép đôi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#B93632] uppercase tracking-wider block">Cột A:</span>
              {question.matchingPairs.left.map((item) => {
                const isSelected = selectedLeftId === item.id;
                const pairedRightId = matchingSelections[item.id];
                const pairedText = question.matchingPairs?.right.find((r) => r.id === pairedRightId)?.text;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isCompleted}
                    onClick={() => setSelectedLeftId(item.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-[#B93632] shadow'
                        : pairedRightId
                        ? 'bg-green-50 border-green-500 text-green-900 font-semibold'
                        : 'bg-white border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#21354D]">{item.text}</div>
                    {pairedText && (
                      <div className="text-xs text-green-800 mt-1 font-normal flex items-center gap-1">
                        <span>→ Nối với:</span> <em>{pairedText}</em>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#307A67] uppercase tracking-wider block">Cột B:</span>
              {question.matchingPairs.right.map((item) => {
                const isPaired = Object.values(matchingSelections).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isCompleted}
                    onClick={() => {
                      if (selectedLeftId) {
                        setMatchingSelections({
                          ...matchingSelections,
                          [selectedLeftId]: item.id
                        });
                        setSelectedLeftId(null);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                      isPaired
                        ? 'bg-green-50 border-green-400 text-green-900 font-semibold'
                        : 'bg-white border-gray-200 hover:border-[#307A67]'
                    }`}
                  >
                    <span className="text-sm text-[#21354D]">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RESULT & FEEDBACK SECTION */}
      {result && (
        <div
          className={`p-5 rounded-2xl border-2 transition ${
            result.isCorrect
              ? 'bg-green-50 border-green-500 text-green-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base">
                  {result.isCorrect
                    ? `Chính xác! (+${result.pointsAwarded} điểm)`
                    : attemptNumber === 1
                    ? 'Chưa chính xác!'
                    : 'Chưa chính xác sau 2 lần thử.'}
                </h4>
              </div>

              {/* Explanation text */}
              <p className="text-sm leading-relaxed">{result.explanation}</p>

              {/* Reveal correct answer if attempt >= 2 */}
              {attemptNumber >= 2 && !result.isCorrect && result.correctAnswer && (
                <div className="mt-2 p-3 bg-white/80 rounded-xl border border-amber-300 text-xs">
                  <span className="font-bold text-amber-900">Đáp án chuẩn: </span>
                  <span className="text-gray-800">
                    {Array.isArray(result.correctAnswer)
                      ? result.correctAnswer.join(', ')
                      : typeof result.correctAnswer === 'object'
                      ? JSON.stringify(result.correctAnswer)
                      : String(result.correctAnswer)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gentle Hint for Attempt 2 */}
      {showHint && !result?.isCorrect && attemptNumber === 1 && (
        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <strong>Gợi ý nhỏ: </strong>
            <span>{question.hint}</span>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div>
          {!showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#B93632] transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Xem gợi ý câu hỏi</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Retry attempt 2 button if failed attempt 1 */}
          {!result?.isCorrect && attemptNumber === 1 && result !== null && (
            <button
              type="button"
              onClick={handleRetryAttempt}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại lần 2 (+5 điểm)</span>
            </button>
          )}

          {/* Submit answer button */}
          {!isCompleted && result === null && (
            <button
              type="button"
              disabled={!isAnswerProvided() || isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-[#B93632] to-[#8B1A17] hover:from-[#9D2824] hover:to-[#741310] text-[#FFF6E5] font-bold rounded-xl text-sm transition shadow flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang chấm điểm...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D9A441]" />
                  <span>Nộp câu trả lời</span>
                </>
              )}
            </button>
          )}

          {/* Next question button */}
          {isCompleted && showNextButton && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 bg-[#307A67] hover:bg-[#256051] text-white font-bold rounded-xl text-sm transition shadow flex items-center gap-2 cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
