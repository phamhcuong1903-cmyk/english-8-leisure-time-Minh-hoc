import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: '#3B82C4' }}
            >
              <i className="fa-solid fa-sitemap text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: '#DBEAFE', color: '#3B82C4' }}
                >
                  Lớp 8 • Project
                </span>
                <span className="text-xs text-[#64748B]">Bộ GD&ĐT</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#334155] leading-tight mt-0.5">
                Tiếng Anh 8 - Unit 1: Leisure Time - Project
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#FDFBF7] p-1.5 rounded-xl border border-[#E2E8F0] w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mindmap'
                  ? 'bg-[#3B82C4] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#334155] hover:bg-white/60'
              }`}
            >
              <i className="fa-solid fa-diagram-project"></i>
              <span>Sơ đồ tư duy</span>
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-[#F59E42] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#334155] hover:bg-white/60'
              }`}
            >
              <i className="fa-solid fa-clipboard-check"></i>
              <span>Tự đánh giá</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
