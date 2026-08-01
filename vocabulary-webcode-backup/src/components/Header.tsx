import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  unitTitle: string;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ unitTitle, currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'flashcard', label: 'Flashcard', icon: 'fa-solid fa-layer-group' },
    { id: 'quiz', label: 'Trắc nghiệm', icon: 'fa-solid fa-list-check' },
    { id: 'fill', label: 'Điền từ', icon: 'fa-solid fa-pen-to-square' },
    { id: 'match', label: 'Nối từ', icon: 'fa-solid fa-arrow-right-arrow-left' },
    { id: 'bingo', label: 'Bingo', icon: 'fa-solid fa-border-all' },
    { id: 'report', label: 'Báo cáo', icon: 'fa-solid fa-chart-pie' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-[#E2E8F0] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82C4] text-white flex items-center justify-center text-xl font-bold shadow-sm">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#334155] tracking-tight leading-tight">
              {unitTitle}
            </h1>
            <p className="text-xs text-[#64748B]">Hệ thống luyện từ vựng Tiếng Anh 8 - 6 chế độ học</p>
          </div>
        </div>

        {/* Top Bar Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-sm'
                    : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#DBEAFE] hover:border-[#3B82C4]/40'
                }`}
              >
                <i className={`${tab.icon} text-base ${isActive ? 'text-white' : 'text-[#3B82C4]'}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
