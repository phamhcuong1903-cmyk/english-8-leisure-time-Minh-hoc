import React from 'react';
import { PassageQuestions, QuestionGrading } from '../types/quiz';

interface PassageQuestionProps {
  passageData: PassageQuestions;
  answers: Record<string, string>; // e.g. { "2": "reading", "3": "messaging", ... }
  onChange: (blankNumber: number, val: string) => void;
  gradings: Record<number, QuestionGrading>;
  isGraded: boolean;
}

export const PassageQuestion: React.FC<PassageQuestionProps> = ({
  passageData,
  answers,
  onChange,
  gradings,
  isGraded,
}) => {
  const { passageTemplate, blanks } = passageData;

  // Split template by placeholder pattern [[number]]
  const parts = passageTemplate.split(/(\[\[\d+\]\])/g);

  return (
    <div className="space-y-6">
      {/* Passage Content Card */}
      <div
        className={`bg-[#FFFFFF] rounded-xl p-6 sm:p-8 shadow-sm border transition-all duration-300 ${
          isGraded
            ? 'border-[#3B82C4]/40 bg-white'
            : 'border-[#E2E8F0] hover:border-[#3B82C4]/50'
        }`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-base sm:text-lg font-bold text-[#334155] flex items-center gap-2">
            <i className="fa-solid fa-book-open text-[#DB2777]"></i>
            Đoạn văn tự đọc & hoàn thành
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FCE7F3] text-[#DB2777]">
            5 chỗ trống cần điền
          </span>
        </div>

        {/* Paragraph text with inline inputs */}
        <div className="text-lg sm:text-xl text-[#334155] leading-loose sm:leading-[2.5rem]">
          {parts.map((part, idx) => {
            const match = part.match(/^\[\[(\d+)\]\]$/);
            if (!match) {
              return <span key={idx}>{part}</span>;
            }

            const blankNum = parseInt(match[1], 10);
            const blank = blanks.find((b) => b.number === blankNum);
            if (!blank) return null;

            const grading = gradings[blankNum];
            const isCorrect = grading?.isCorrect;
            const val = answers[blankNum.toString()] || '';

            return (
              <span key={idx} className="inline-inline-block align-baseline mx-1 my-1 relative group">
                {/* Inline input container with floating verbHint */}
                <span className="inline-flex flex-col items-center align-middle mx-1">
                  {/* Verb hint above input */}
                  <span className="text-[11px] font-bold text-[#DB2777] bg-[#FCE7F3] px-1.5 py-0.2 rounded border border-[#DB2777]/20 -mb-1 z-10">
                    ({blankNum}) {blank.verbHint}
                  </span>

                  {/* Input field with inline grading badge */}
                  <span className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => onChange(blankNum, e.target.value)}
                      disabled={isGraded}
                      placeholder="..."
                      className={`px-3 py-1 text-center font-semibold text-base sm:text-lg border-b-2 rounded-md outline-none transition-all ${
                        isGraded
                          ? isCorrect
                            ? 'border-[#4ADE80] text-[#166534] bg-[#F0FDF4] shadow-2xs'
                            : 'border-[#F87171] text-[#991B1B] bg-[#FEF2F2] shadow-2xs'
                          : 'border-[#DB2777] bg-[#FDFBF7] text-[#334155] focus:bg-white focus:border-[#F59E42] focus:ring-2 focus:ring-[#F59E42]/20'
                      }`}
                      style={{ minWidth: '130px', maxWidth: '170px' }}
                    />

                    {/* Grading Icon */}
                    {isGraded && (
                      <span className="inline-flex items-center">
                        {isCorrect ? (
                          <i className="fa-solid fa-circle-check text-[#4ADE80] text-base" title="Đúng!"></i>
                        ) : (
                          <i className="fa-solid fa-circle-xmark text-[#F87171] text-base" title="Chưa đúng"></i>
                        )}
                      </span>
                    )}
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Explanations List for Passage Blanks after grading */}
      {isGraded && (
        <div className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
          <h4 className="text-base font-bold text-[#334155] flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <i className="fa-solid fa-lightbulb text-[#F59E42]"></i>
            Giải thích chi tiết đoạn văn:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {blanks.map((blank) => {
              const grading = gradings[blank.number];
              const isCorrect = grading?.isCorrect;

              return (
                <div
                  key={blank.number}
                  className={`p-3.5 rounded-xl border text-sm transition-all ${
                    isCorrect
                      ? 'bg-[#F0FDF4] border-[#4ADE80]'
                      : 'bg-[#FEF2F2] border-[#F87171]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs text-white ${
                          isCorrect ? 'bg-[#4ADE80]' : 'bg-[#F87171]'
                        }`}
                      >
                        {blank.number}
                      </span>
                      <span className="text-[#334155]">
                        Chỗ trống ({blank.number}) - Gợi ý: {blank.verbHint}
                      </span>
                    </span>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isCorrect
                          ? 'bg-[#4ADE80]/20 text-[#166534]'
                          : 'bg-[#F87171]/20 text-[#991B1B]'
                      }`}
                    >
                      {isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>

                  <p className="text-[#334155] leading-relaxed pl-8">
                    {blank.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
