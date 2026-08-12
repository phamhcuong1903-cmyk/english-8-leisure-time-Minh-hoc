import React from 'react';
import { sounds } from '../utils/quizUtils';

interface HeaderProps {
  currentSectionIndex: number;
  totalSections: number;
  completedQuestionsCount: number;
  totalQuestionsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFinished: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSectionIndex,
  totalSections,
  completedQuestionsCount,
  totalQuestionsCount,
  soundEnabled,
  onToggleSound,
  isFinished,
}) => {
  const percentage = Math.round((completedQuestionsCount / totalQuestionsCount) * 100);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          {/* Title & Stage Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#3B82C4] border border-[#3B82C4]/20 shadow-xs">
              <i className="fa-solid fa-trophy text-[#3B82C4]"></i>
              {isFinished ? 'Hoàn thành' : `Ải ${currentSectionIndex + 1}/${totalSections}`}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#334155] truncate">
              Tiếng Anh 8 - Unit 1: Leisure Time - Looking Back
            </h1>
          </div>

          {/* Sound toggle & progress text */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm font-semibold text-[#64748B]">
            <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
              <i className="fa-solid fa-[#3B82C4] fa-circle-check text-[#3B82C4]"></i>
              <span>Tiến trình: <strong className="text-[#334155]">{completedQuestionsCount}/{totalQuestionsCount}</strong> câu</span>
            </span>

            <button
              onClick={() => {
                onToggleSound();
                sounds.enabled = !soundEnabled;
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[#FFEDD5] text-[#F59E42] border-[#F59E42]/30 hover:bg-[#F59E42] hover:text-white'
                  : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
              }`}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
              <span className="hidden sm:inline">{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>
          </div>
        </div>

        {/* Global Single Progress Bar */}
        <div className="relative w-full h-3.5 bg-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#3B82C4] via-[#60A5FA] to-[#F59E42] transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
