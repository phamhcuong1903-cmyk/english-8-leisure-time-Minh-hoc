import React, { useState } from 'react';
import { PRACTICE_QUESTIONS, PREPOSITION_STRUCTURES } from '../data/sentences';
import { PracticeQuestion } from '../types';

interface PartCPracticeProps {
  onRestart: () => void;
  onBackToGrammar: () => void;
}

export const PartCPractice: React.FC<PartCPracticeProps> = ({ onRestart, onBackToGrammar }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const question: PracticeQuestion = PRACTICE_QUESTIONS[currentQuestionIdx];
  const selectedOption = selectedAnswers[question.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === question.correctAnswer;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return; // lock answer

    const newAnswers = { ...selectedAnswers, [question.id]: option };
    setSelectedAnswers(newAnswers);
    setShowExplanation({ ...showExplanation, [question.id]: true });

    if (option === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < PRACTICE_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[500px] py-4 px-4">
      {/* Header Bar */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F0FDF4] text-[#10B981] flex items-center justify-center font-bold text-base shadow-xs border border-[#4ADE80]">
            C
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#334155] leading-tight">
              Phần C: Luyện tập & Đánh giá kiến thức
            </h2>
            <p className="text-xs text-[#64748B]">
              {isCompleted ? 'Hoàn thành bài tập!' : `Câu hỏi ${currentQuestionIdx + 1} / ${PRACTICE_QUESTIONS.length}`}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToGrammar}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#334155] bg-[#FDFBF7] hover:bg-[#E2E8F0] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Xem lại Công thức</span>
        </button>
      </div>

      {!isCompleted ? (
        /* Question Card */
        <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
          {/* Question Prompt */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B82C4] bg-[#DBEAFE] px-3 py-1 rounded-full">
              {question.type === 'preposition' ? 'Điền giới từ' : 'Dạng từ sau giới từ'}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">
              Đã đúng: {score} câu
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#334155]">
            {question.questionPrompt}
          </h3>

          {/* Sentence Display */}
          <div className="bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl p-5 text-center text-lg sm:text-xl font-bold text-[#334155]">
            <span>{question.sentenceBefore} </span>
            <span className="inline-block px-4 py-1 mx-1 my-1 border-2 border-dashed border-[#3B82C4] rounded-lg bg-white min-w-[80px] text-[#F59E42]">
              {selectedOption || '...'}
            </span>
            <span> {question.sentenceAfter}</span>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {question.options.map((option) => {
              let optionStyle = 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#FDFBF7] hover:border-[#3B82C4]';

              if (isAnswered) {
                if (option === question.correctAnswer) {
                  // Correct answer status style (#4ADE80 / #F0FDF4)
                  optionStyle = 'bg-[#F0FDF4] border-[#4ADE80] text-[#166534] font-black shadow-xs';
                } else if (option === selectedOption && !isCorrect) {
                  // Wrong answer status style (#F87171 / #FEF2F2)
                  optionStyle = 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B] font-bold';
                } else {
                  optionStyle = 'bg-white border-[#E2E8F0] text-[#94A3B8] opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-base font-bold transition-all text-left cursor-pointer ${optionStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && option === question.correctAnswer && (
                    <i className="fa-solid fa-circle-check text-[#4ADE80] text-lg"></i>
                  )}
                  {isAnswered && option === selectedOption && !isCorrect && (
                    <i className="fa-solid fa-circle-xmark text-[#F87171] text-lg"></i>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-[#F0FDF4] border-[#4ADE80] text-[#166534]'
                  : 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <i className={`fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                <span>{isCorrect ? 'Chính xác!' : 'Chưa đúng rồi!'}</span>
              </div>
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer"
                style={{ backgroundColor: '#F59E42' }}
              >
                <span>{currentQuestionIdx < PRACTICE_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Results Summary */
        <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F0FDF4] border-2 border-[#4ADE80] text-[#4ADE80] flex items-center justify-center text-4xl shadow-sm">
            <i className="fa-solid fa-trophy animate-bounce"></i>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#334155] mb-2">
              Xuất sắc! Bạn đã hoàn thành phần luyện tập
            </h3>
            <p className="text-base text-[#64748B]">
              Kết quả của bạn: <strong className="text-[#3B82C4]">{score}</strong> / {PRACTICE_QUESTIONS.length} câu đúng
            </p>
          </div>

          {/* Table Summary of All 5 Structures */}
          <div className="text-left border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FDFBF7]">
            <div className="bg-[#DBEAFE] px-4 py-3 border-b border-[#E2E8F0]">
              <h4 className="font-bold text-sm text-[#1E3A8A] flex items-center gap-2">
                <i className="fa-solid fa-table-list"></i>
                Bảng tổng hợp 5 Cấu trúc Tính từ + Giới từ Unit 1
              </h4>
            </div>

            <div className="divide-y divide-[#E2E8F0] text-sm">
              {PREPOSITION_STRUCTURES.map((struct) => (
                <div key={struct.id} className="p-3.5 bg-white hover:bg-[#FDFBF7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-[#334155]">
                    be <span style={{ color: struct.color }}>{struct.adjective} {struct.preposition}</span> + N / V-ing
                  </div>
                  <div className="text-xs text-[#64748B] italic">
                    "{struct.exampleSentence}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-[#334155] bg-white border border-[#E2E8F0] hover:bg-[#FDFBF7] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left"></i>
              <span>Làm lại bài tập</span>
            </button>

            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer"
              style={{ backgroundColor: '#F59E42' }}
            >
              <i className="fa-solid fa-play"></i>
              <span>Xem lại từ đầu (Phần A)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
