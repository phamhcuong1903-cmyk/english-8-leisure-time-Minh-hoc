import React, { useState } from 'react';
import quizData from '../data/quiz.json';
import { MultipleChoiceData, MultipleChoiceQuestion } from '../types';

const data = quizData as MultipleChoiceData;

function shuffleQuestions(questions: MultipleChoiceQuestion[]): MultipleChoiceQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const MultipleChoiceQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>(() =>
    shuffleQuestions(data.questions)
  );
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const handleSelectOption = (qIdx: number, optKey: string) => {
    // If already answered this question, do nothing (instant grading is locked)
    if (userAnswers[qIdx] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optKey,
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setQuestions(shuffleQuestions(data.questions));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = questions.length;
  const isCompleted = answeredCount === totalQuestions;

  const correctCount = questions.filter(
    (q, idx) => userAnswers[idx] === q.correctAnswer
  ).length;

  // Congratulatory message logic
  const getCongratulationMessage = () => {
    if (correctCount === totalQuestions) {
      return 'Xuất sắc! 🎉 Bằng sự cố gắng tuyệt vời, bạn đã nắm vững 100% ngữ pháp!';
    } else if (correctCount >= 3) {
      return 'Làm tốt lắm! 👍 Bạn đã hiểu bài rất tốt, hãy cố gắng phát huy thêm nhé!';
    } else {
      return 'Cố gắng thêm chút nữa nhé! 💪 Đọc lại phần giải thích dưới mỗi câu để ghi nhớ sâu hơn nào!';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Progress Header */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: '#F59E42' }}
            ></span>
            <h2 className="text-xl font-bold text-[#334155]">
              Mini-Quiz Trắc Nghiệm Ngữ Pháp
            </h2>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Chọn đáp án đúng (A, B hoặc C) cho mỗi câu. Kết quả sẽ được chấm LẬP TỨC!
          </p>
        </div>

        {/* Progress pill or reset */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] flex items-center gap-2">
            <i className="fa-solid fa-list-check text-[#3B82C4]"></i>
            <span>
              Đã làm: <strong className="text-[#334155]">{answeredCount}/{totalQuestions}</strong> câu
            </span>
          </div>

          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white border-2 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl font-bold transition-all text-sm flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const selectedKey = userAnswers[qIdx];
          const isAnswered = selectedKey !== undefined;
          const isUserCorrect = selectedKey === q.correctAnswer;

          return (
            <div
              key={qIdx}
              className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] space-y-4 transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#1E40AF] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <p className="text-lg font-bold text-[#334155] leading-snug">
                    {q.question}
                  </p>
                </div>

                {/* Instant Result Indicator */}
                {isAnswered && (
                  <div className="shrink-0">
                    {isUserCorrect ? (
                      <span className="px-3 py-1 rounded-full border border-[#4ADE80] bg-[#F0FDF4] text-[#166534] font-bold text-xs flex items-center gap-1.5 shadow-xs">
                        <i className="fa-solid fa-circle-check text-[#4ADE80] text-sm"></i> Đúng
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full border border-[#F87171] bg-[#FEF2F2] text-[#991B1B] font-bold text-xs flex items-center gap-1.5 shadow-xs">
                        <i className="fa-solid fa-circle-xmark text-[#F87171] text-sm"></i> Chưa đúng
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(q.options).map(([optKey, optVal]) => {
                  const isThisOptCorrect = optKey === q.correctAnswer;
                  const isThisOptSelected = selectedKey === optKey;

                  let btnStyle =
                    'bg-[#FFFFFF] border-2 border-[#E2E8F0] text-[#334155] hover:border-[#3B82C4] hover:bg-[#F1F5F9] cursor-pointer';
                  let iconNode = null;
                  let badgeStyle = 'bg-white text-[#64748B] border-[#CBD5E1]';

                  if (isAnswered) {
                    if (isThisOptCorrect) {
                      // Correct option: border #4ADE80, light bg #F0FDF4, checkmark ✓
                      btnStyle =
                        'bg-[#F0FDF4] border-2 border-[#4ADE80] text-[#166534] font-bold shadow-xs cursor-default';
                      badgeStyle = 'bg-[#4ADE80] text-white border-[#4ADE80]';
                      iconNode = (
                        <span className="ml-auto text-[#4ADE80] font-bold text-lg">
                          ✓
                        </span>
                      );
                    } else if (isThisOptSelected && !isUserCorrect) {
                      // Selected incorrect option: border #F87171, light bg #FEF2F2, cross ✗
                      btnStyle =
                        'bg-[#FEF2F2] border-2 border-[#F87171] text-[#991B1B] font-bold shadow-xs cursor-default';
                      badgeStyle = 'bg-[#F87171] text-white border-[#F87171]';
                      iconNode = (
                        <span className="ml-auto text-[#F87171] font-bold text-lg">
                          ✗
                        </span>
                      );
                    } else {
                      // Unselected non-correct option
                      btnStyle =
                        'bg-[#F8FAFC] border-2 border-[#E2E8F0] text-[#94A3B8] opacity-60 cursor-default';
                      badgeStyle = 'bg-[#E2E8F0] text-[#94A3B8] border-[#E2E8F0]';
                    }
                  }

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, optKey)}
                      disabled={isAnswered}
                      className={`p-3.5 rounded-xl text-left transition-all flex items-center gap-3 select-none ${btnStyle}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}
                      >
                        {optKey}
                      </span>
                      <span className="text-base font-semibold">{optVal}</span>
                      {iconNode}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box (in background #F0FDF4) */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#4ADE80]/40 text-[#166534] space-y-1 transition-all">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-[#15803D]">
                    <i className="fa-solid fa-lightbulb"></i>
                    <span>Giải thích đáp án {q.correctAnswer}:</span>
                  </div>
                  <p className="text-sm font-normal text-[#334155] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Summary & Congratulatory Card */}
      {isCompleted && (
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-[#4ADE80] space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                  correctCount === totalQuestions
                    ? 'bg-[#F0FDF4] text-[#4ADE80] border-2 border-[#4ADE80]'
                    : 'bg-[#FFEDD5] text-[#F59E42] border-2 border-[#F59E42]'
                }`}
              >
                {correctCount === totalQuestions ? (
                  <i className="fa-solid fa-trophy"></i>
                ) : (
                  <i className="fa-solid fa-award"></i>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#334155]">
                  Tổng kết bài làm: <span className="text-[#3B82C4]">{correctCount}/{totalQuestions}</span> câu đúng
                </h3>
                <p className="text-sm font-semibold text-[#15803D] mt-1">
                  {getCongratulationMessage()}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95 cursor-pointer whitespace-nowrap text-base flex items-center gap-2 shrink-0"
              style={{ backgroundColor: '#F59E42' }}
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Làm lại (Xáo trộn)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
