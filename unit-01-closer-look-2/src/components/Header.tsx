import React from 'react';

interface HeaderProps {
  activeTab: 'classify' | 'sentence' | 'quiz' | 'theory';
  setActiveTab: (tab: 'classify' | 'sentence' | 'quiz' | 'theory') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: '#3B82C4' }}
            >
              <i className="fa-solid fa-book-open"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                  Tiếng Anh 8 - Unit 1
                </span>
                <span className="text-xs text-[#64748B] flex items-center gap-1">
                  <i className="fa-regular fa-clock text-xs"></i> Verbs of Liking
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#334155] mt-0.5">
                Luyện Tập Động Từ Chỉ Sở Thích (Gerund & To-Infinitive)
              </h1>
            </div>
          </div>

          {/* Quick stats or info badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#FDFBF7] text-[#64748B]">
            <i className="fa-solid fa-graduation-cap text-[#3B82C4] text-sm"></i>
            <span>Chương trình GDPT Tiếng Anh THCS</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-[#E2E8F0] pt-3">
          <button
            onClick={() => setActiveTab('classify')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'classify'
                ? 'text-white shadow-sm scale-[1.02]'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
            }`}
            style={{
              backgroundColor: activeTab === 'classify' ? '#3B82C4' : 'transparent',
            }}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Bài 1: Phân loại động từ</span>
          </button>

          <button
            onClick={() => setActiveTab('sentence')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sentence'
                ? 'text-white shadow-sm scale-[1.02]'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
            }`}
            style={{
              backgroundColor: activeTab === 'sentence' ? '#3B82C4' : 'transparent',
            }}
          >
            <i className="fa-solid fa-[#fa-pen-to-square] fa-pen-to-square"></i>
            <span>Bài 2: Viết câu</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz'
                ? 'text-white shadow-sm scale-[1.02]'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
            }`}
            style={{
              backgroundColor: activeTab === 'quiz' ? '#3B82C4' : 'transparent',
            }}
          >
            <i className="fa-solid fa-circle-question"></i>
            <span>Bài 3: Trắc nghiệm</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'theory'
                ? 'text-white shadow-sm scale-[1.02]'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]'
            }`}
            style={{
              backgroundColor: activeTab === 'theory' ? '#3B82C4' : 'transparent',
            }}
          >
            <i className="fa-solid fa-lightbulb text-[#F59E42]"></i>
            <span>Lý thuyết ngữ pháp</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
