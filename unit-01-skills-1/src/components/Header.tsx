import React from 'react';

interface HeaderProps {
  activeTab: 'reading' | 'dialogue';
  onTabChange: (tab: 'reading' | 'dialogue') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center font-bold text-xl shadow-xs">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#334155] tracking-tight">
                Tiếng Anh 7 - Unit 1: Leisure Activities
              </h1>
              <span className="bg-[#DBEAFE] text-[#3B82C4] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Cấp 2
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Luyện nghe bài đọc & thực hành đối thoại tiếng Anh giao tiếp
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#FDFBF7] p-1 rounded-xl border border-[#E2E8F0] w-full sm:w-auto">
          <button
            onClick={() => onTabChange('reading')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'reading'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-align-left"></i>
            <span>Bài Đọc</span>
          </button>
          <button
            onClick={() => onTabChange('dialogue')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'dialogue'
                ? 'bg-[#F59E42] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white/60'
            }`}
          >
            <i className="fa-solid fa-comments"></i>
            <span>Đối Thoại</span>
          </button>
        </div>
      </div>
    </header>
  );
};
