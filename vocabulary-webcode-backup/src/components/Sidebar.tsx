import React from 'react';
import { WordItem } from '../data/vocabularyData';

interface SidebarProps {
  score: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
  sections: string[];
  selectedSection: string;
  onSelectSection: (sec: string) => void;
  filteredWords: WordItem[];
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
  masteredIds: Set<number>;
  reviewIds: Set<number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  score,
  soundEnabled,
  onToggleSound,
  onResetGame,
  sections,
  selectedSection,
  onSelectSection,
  filteredWords,
  selectedIndex,
  onSelectIndex,
  masteredIds,
  reviewIds,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
      {/* CARD 1: ĐIỀU KHIỂN GAME */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4">
        <h2 className="text-xs font-bold text-[#64748B] tracking-wider uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-gamepad text-[#3B82C4]"></i>
          <span>Điều khiển Game</span>
        </h2>

        {/* Score Display */}
        <div className="bg-[#DBEAFE] border border-[#3B82C4]/20 rounded-xl p-3 mb-3 text-center">
          <span className="text-xs text-[#64748B] block font-semibold">Điểm Số Hiện Tại</span>
          <div className="text-2xl font-black text-[#3B82C4] flex items-center justify-center gap-1.5 mt-0.5">
            <i className="fa-solid fa-trophy text-[#F59E42] text-xl"></i>
            <span>{score}</span>
            <span className="text-xs font-normal text-[#64748B]">điểm</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
              soundEnabled
                ? 'bg-[#F0FDF4] border-[#4ADE80] text-[#334155]'
                : 'bg-[#FEF2F2] border-[#F87171] text-[#334155]'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            <i className={`fa-solid ${soundEnabled ? 'fa-volume-high text-[#4ADE80]' : 'fa-volume-xmark text-[#F87171]'}`}></i>
            <span>{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#DBEAFE] text-xs font-bold text-[#334155] transition-colors"
            title="Toàn màn hình"
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress text-[#3B82C4]' : 'fa-expand text-[#3B82C4]'}`}></i>
            <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn'}</span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={onResetGame}
          className="w-full py-2 px-3 rounded-lg bg-[#FFEDD5] hover:bg-[#F59E42] hover:text-white border border-[#F59E42] text-[#F59E42] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-rotate-right"></i>
          <span>Làm lại bài (Reset)</span>
        </button>
      </div>

      {/* CARD 2: BỘ LỌC THEO SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4">
        <label htmlFor="section-filter" className="text-xs font-bold text-[#64748B] tracking-wider uppercase mb-2 block flex items-center gap-2">
          <i className="fa-solid fa-[#3B82C4] fa-filter text-[#3B82C4]"></i>
          <span>Lọc theo Section</span>
        </label>
        <select
          id="section-filter"
          value={selectedSection}
          onChange={(e) => onSelectSection(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#FDFBF7] text-[#334155] text-sm font-semibold focus:outline-none focus:border-[#3B82C4] transition-colors"
        >
          <option value="Tất cả">Tất cả bài học ({60} từ)</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      {/* CARD 3: LƯỚI CÁC NÚT SỐ */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#64748B] tracking-wider uppercase flex items-center gap-2">
            <i className="fa-solid fa-hashtag text-[#3B82C4]"></i>
            <span>Danh sách từ ({filteredWords.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"></span> Đã thuộc
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
          {filteredWords.map((word, idx) => {
            const isSelected = selectedIndex === idx;
            const isMastered = masteredIds.has(word.id);
            const isNeedsReview = reviewIds.has(word.id);

            let btnStyle = 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#DBEAFE]';

            if (isSelected) {
              btnStyle = 'bg-[#3B82C4] text-white border-[#3B82C4] font-bold shadow-sm';
            } else if (isMastered) {
              btnStyle = 'bg-[#F0FDF4] text-[#334155] border-[#4ADE80] border-2 font-bold';
            } else if (isNeedsReview) {
              btnStyle = 'bg-[#FEF2F2] text-[#334155] border-[#F87171] font-semibold';
            }

            return (
              <button
                key={word.id}
                onClick={() => onSelectIndex(idx)}
                className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all relative ${btnStyle}`}
                title={`${word.word} (${word.meaning})`}
              >
                <span>{idx + 1}</span>
                {isMastered && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4ADE80] rounded-full border border-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
