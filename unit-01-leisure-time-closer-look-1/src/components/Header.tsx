import React from 'react';

interface HeaderProps {
  activeTab: 'partA' | 'partB' | 'partVideo' | 'partGame' | 'partC';
  onSelectTab: (tab: 'partA' | 'partB' | 'partVideo' | 'partGame' | 'partC') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82C4] text-white flex items-center justify-center text-xl font-black shadow-xs">
            U1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F59E42] bg-[#FFEDD5] px-2 py-0.5 rounded-md">
                Tiếng Anh Cấp 2
              </span>
              <span className="text-xs text-[#64748B]">Unit 1: Hobbies</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#334155] leading-snug">
              Giới từ đi kèm tính từ & Phát âm /ʊ/ - /uː/
            </h1>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#FDFBF7] p-1 border border-[#E2E8F0] rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => onSelectTab('partA')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'partA'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-play text-[10px]"></i>
            <span>A. Animation</span>
          </button>

          <button
            onClick={() => onSelectTab('partB')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'partB'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-book-open text-[10px]"></i>
            <span>B. Công thức</span>
          </button>

          <button
            onClick={() => onSelectTab('partVideo')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'partVideo'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-circle-play text-[10px]"></i>
            <span>C. Video Âm</span>
          </button>

          <button
            onClick={() => onSelectTab('partGame')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'partGame'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-gamepad text-[10px]"></i>
            <span>D. Game Phân Âm</span>
          </button>

          <button
            onClick={() => onSelectTab('partC')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'partC'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-pen-to-square text-[10px]"></i>
            <span>E. Luyện tập</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
