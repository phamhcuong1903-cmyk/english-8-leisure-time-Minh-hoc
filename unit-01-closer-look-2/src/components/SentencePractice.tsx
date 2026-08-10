import React, { useState } from 'react';
import sentenceBuilderData from '../data/sentence-builder.json';
import { SentencePracticeData } from '../types';

const data = sentenceBuilderData as SentencePracticeData;

interface SentencePracticeProps {
  onNextTab?: (tab: 'classify' | 'sentence' | 'quiz' | 'theory') => void;
}

export const SentencePractice: React.FC<SentencePracticeProps> = ({ onNextTab }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(data.questions.length).fill('')
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleInputChange = (index: number, val: string) => {
    const updated = [...userAnswers];
    updated[index] = val;
    setUserAnswers(updated);
  };

  const handleReset = () => {
    setUserAnswers(new Array(data.questions.length).fill(''));
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Helper to normalize and check if answer matches any accepted option
  const checkAnswer = (input: string, accepted: string[]) => {
    const cleanInput = input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.+$/, '');
    return accepted.some(
      (acc) => acc.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.+$/, '') === cleanInput
    );
  };

  const correctCount = data.questions.filter((q, idx) =>
    checkAnswer(userAnswers[idx], q.acceptedAnswers)
  ).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Section: Header & Formula */}
      <div className="space-y-4">
        {/* Title Banner */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E42' }}></span>
              <h2 className="text-xl font-bold text-[#334155]">
                Sentence Builder (Hoàn Thành Cấu Trúc Câu)
              </h2>
            </div>
            <p className="text-sm text-[#64748B] mt-1">
              Điền vế câu phù hợp với động từ cho trước trong ngoặc.
            </p>
          </div>

          {isSubmitted && (
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-bold text-[#64748B] bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Làm lại</span>
            </button>
          )}
        </div>

        {/* Formula Box - Prominent display with #DBEAFE background */}
        <div 
          className="p-5 rounded-xl border-2 border-[#3B82C4]/30 shadow-sm text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-3"
          style={{ backgroundColor: '#DBEAFE' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#3B82C4] font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              <i className="fa-solid fa-calculator"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider block">
                CÔNG THỨC CẤU TRÚC (FORMULA):
              </span>
              <p className="text-lg sm:text-xl font-bold text-[#1E40AF] mt-0.5">
                {data.formula}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {data.questions.map((q, idx) => {
          const inputVal = userAnswers[idx];
          const isCorrect = checkAnswer(inputVal, q.acceptedAnswers);

          // Prompt parsing (splitting at _____ if present)
          const parts = q.prompt.split('_____');
          const prefix = parts[0] || '';
          const suffix = parts[1] || '';

          // Input border styling
          let inputStyle = "border-[#CBD5E1] focus:border-[#3B82C4] focus:ring-2 focus:ring-[#DBEAFE] bg-white";
          let statusBadge = null;

          if (isSubmitted) {
            if (isCorrect) {
              inputStyle = "border-[#4ADE80] bg-[#F0FDF4] text-[#166534] font-semibold";
              statusBadge = (
                <span className="px-2.5 py-1 rounded-lg border border-[#4ADE80] bg-[#F0FDF4] text-[#4ADE80] font-bold text-sm flex items-center gap-1 shrink-0">
                  <i className="fa-solid fa-check text-base"></i> ✓
                </span>
              );
            } else {
              inputStyle = "border-[#F87171] bg-[#FEF2F2] text-[#991B1B] font-semibold";
              statusBadge = (
                <span className="px-2.5 py-1 rounded-lg border border-[#F87171] bg-[#FEF2F2] text-[#F87171] font-bold text-sm flex items-center gap-1 shrink-0">
                  <i className="fa-solid fa-xmark text-base"></i> ✗
                </span>
              );
            }
          }

          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap text-base sm:text-lg font-bold text-[#334155] flex-1">
                  <span className="w-7 h-7 rounded-lg bg-[#DBEAFE] text-[#1E40AF] text-sm font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{prefix}</span>
                  
                  {/* Input Box */}
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Nhập phần hoàn thành..."
                    className={`px-3.5 py-2 rounded-xl border text-base outline-none transition-all min-w-[200px] flex-1 sm:flex-none ${inputStyle}`}
                  />

                  {suffix && <span>{suffix}</span>}

                  {/* Hint in parentheses */}
                  <span className="text-base font-normal text-[#64748B]">
                    {q.hint}
                  </span>
                </div>

                {/* Verification icon (✓ or ✗) */}
                {isSubmitted && statusBadge}
              </div>

              {/* Explanation Card right below EACH question */}
              {isSubmitted && (
                <div 
                  className={`p-4 rounded-xl border transition-all text-sm leading-relaxed space-y-1.5 ${
                    isCorrect 
                      ? 'bg-[#F0FDF4] border-[#4ADE80] text-[#166534]' 
                      : 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {isCorrect ? 'ĐÁP ÁN ĐÚNG' : 'CHƯA CHÍNH XÁC - ĐÁP ÁN GỢI Ý:'}
                    </span>
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-white/80 border border-current">
                      {q.acceptedAnswers.join(' HOẶC ')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-normal text-[#334155] bg-white/70 p-2.5 rounded-lg border border-current/20">
                    💡 <strong>Giải thích:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left status info */}
        <div>
          {!isSubmitted ? (
            <p className="text-sm font-semibold text-[#64748B]">
              Hãy hoàn thành cả 5 câu và nhấn <strong>Kiểm tra</strong> để chấm điểm.
            </p>
          ) : (
            <div>
              <h3 className="text-base font-bold text-[#334155]">
                Kết Quả Chấm Điểm: <span className="text-[#3B82C4]">{correctCount}/{data.questions.length}</span> câu đúng
              </h3>
              <p className="text-xs text-[#64748B]">
                {correctCount === data.questions.length
                  ? ' Hoàn hảo! Bạn đã chia đúng cấu trúc cho cả 5 câu.'
                  : 'Hãy xem lại phần giải thích dưới mỗi câu để sửa lỗi nhé!'}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#F59E42] text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-check"></i>
              <span>Kiểm tra</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-xl font-bold hover:bg-[#F8FAFC] transition-all cursor-pointer text-sm"
              >
                Làm lại
              </button>

              {onNextTab && (
                <button
                  onClick={() => onNextTab('quiz')}
                  className="px-6 py-2.5 bg-[#3B82C4] text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <span>Tiếp tục → Mini Quiz</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
