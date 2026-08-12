import React from 'react';
import { StandardQuestion, QuestionGrading } from '../types/quiz';

interface FillBlankQuestionProps {
  question: StandardQuestion;
  index: number;
  value: string;
  onChange: (val: string) => void;
  grading?: QuestionGrading;
  isGraded: boolean;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  index,
  value,
  onChange,
  grading,
  isGraded,
}) => {
  const isCorrect = grading?.isCorrect;
  const prompt = question.prompt || '';
  const parts = prompt.split('_____');

  return (
    <div
      className={`bg-[#FFFFFF] rounded-xl p-5 shadow-sm border transition-all duration-300 ${
        isGraded
          ? isCorrect
            ? 'border-[#4ADE80] bg-[#F0FDF4]'
            : 'border-[#F87171] bg-[#FEF2F2]'
          : 'border-[#E2E8F0] hover:border-[#3B82C4]/50'
      }`}
    >
      {/* Header index & status icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#DBEAFE] text-[#3B82C4]">
          Câu {index + 1}
        </span>
        {isGraded && (
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isCorrect
                ? 'bg-[#4ADE80]/20 text-[#166534] border border-[#4ADE80]'
                : 'bg-[#F87171]/20 text-[#991B1B] border border-[#F87171]'
            }`}
          >
            <i className={`fa-solid ${isCorrect ? 'fa-circle-check text-[#4ADE80]' : 'fa-circle-xmark text-[#F87171]'}`}></i>
            {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
          </span>
        )}
      </div>

      {/* Prompt sentence with inline or styled input */}
      <div className="text-base sm:text-lg text-[#334155] leading-relaxed mb-4">
        {parts.length === 2 ? (
          <span>
            {parts[0]}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={isGraded}
              placeholder="nhập đáp án..."
              className={`inline-block mx-1.5 px-3 py-1 border-b-2 font-semibold text-center transition-all outline-none rounded-md ${
                isGraded
                  ? isCorrect
                    ? 'border-[#4ADE80] text-[#166534] bg-white shadow-xs'
                    : 'border-[#F87171] text-[#991B1B] bg-white shadow-xs'
                  : 'border-[#3B82C4] bg-[#FDFBF7] text-[#334155] focus:bg-white focus:border-[#F59E42] focus:ring-2 focus:ring-[#F59E42]/20'
              }`}
              style={{ minWidth: '160px', width: 'auto' }}
            />
            {parts[1]}
          </span>
        ) : (
          <div>
            <p className="mb-2">{prompt}</p>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={isGraded}
              placeholder="Nhập câu trả lời của bạn..."
              className={`w-full max-w-md px-3 py-2 border rounded-lg font-medium transition-all outline-none ${
                isGraded
                  ? isCorrect
                    ? 'border-[#4ADE80] text-[#166534] bg-white'
                    : 'border-[#F87171] text-[#991B1B] bg-white'
                  : 'border-[#E2E8F0] bg-[#FDFBF7] text-[#334155] focus:border-[#3B82C4] focus:ring-2 focus:ring-[#3B82C4]/20'
              }`}
            />
          </div>
        )}
      </div>

      {/* Explanation & Tip feedback after grading */}
      {isGraded && (
        <div className="mt-4 pt-3 border-t border-black/5 text-sm space-y-2">
          {/* Explanation */}
          <div className="flex items-start gap-2 text-[#334155] bg-white/80 p-3 rounded-lg border border-black/5">
            <i className="fa-solid fa-circle-info text-[#3B82C4] mt-0.5 shrink-0"></i>
            <div>
              <strong className="text-[#3B82C4]">Giải thích: </strong>
              <span>{question.explanation}</span>
            </div>
          </div>

          {/* Tip if available */}
          {question.tip && question.tip.trim() !== '' && (
            <div className="flex items-start gap-2 text-xs text-[#64748B] bg-[#FFEDD5]/60 p-2.5 rounded-lg border border-[#F59E42]/30">
              <span className="shrink-0 text-base">💡</span>
              <div>
                <strong className="text-[#F59E42]">Mẹo: </strong>
                <span>{question.tip}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
