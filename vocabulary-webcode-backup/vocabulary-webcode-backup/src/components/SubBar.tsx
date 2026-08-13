import React from 'react';
import { WordItem } from '../data/vocabularyData';

interface SubBarProps {
  currentWord?: WordItem;
  currentIndex: number;
  totalFiltered: number;
  correctCount: number;
  wrongCount: number;
}

export const SubBar: React.FC<SubBarProps> = ({
  currentWord,
  currentIndex,
  totalFiltered,
  correctCount,
  wrongCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
      {/* Badges Left */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Word Index Badge */}
        <span className="bg-[#3B82C4] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
          <i className="fa-solid fa-bookmark text-[10px]"></i>
          <span>Từ #{currentIndex + 1}/{totalFiltered}</span>
        </span>

        {/* Section Name Badge */}
        {currentWord && (
          <span className="bg-[#DBEAFE] text-[#3B82C4] border border-[#3B82C4]/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <i className="fa-solid fa-folder text-[10px]"></i>
            <span>{currentWord.section}</span>
          </span>
        )}
      </div>

      {/* Accuracy Stats Right */}
      <div className="flex items-center gap-2">
        <span className="bg-[#F0FDF4] border border-[#4ADE80] text-[#334155] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
          <i className="fa-solid fa-circle-check text-[#4ADE80]"></i>
          <span>✓ {correctCount} Đúng</span>
        </span>
        <span className="bg-[#FEF2F2] border border-[#F87171] text-[#334155] text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
          <i className="fa-solid fa-[#F87171] fa-circle-xmark text-[#F87171]"></i>
          <span>✗ {wrongCount} Sai</span>
        </span>
      </div>
    </div>
  );
};
