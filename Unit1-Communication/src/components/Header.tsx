import React from 'react';

interface HeaderProps {
  topicName?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  topicName = "Communication",
  className = "" 
}) => {
  return (
    <header className={`bg-white shadow-sm border-b border-[#E2E8F0] px-4 py-4 md:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#3B82C4] shadow-sm">
            <i className="fa-solid fa-headphones text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#334155] tracking-tight leading-tight">
              Luyện Nghe Chép Chính Tả
            </h1>
            <p className="text-sm text-[#64748B] flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80]"></span>
              <span>Chương trình Tiếng Anh Cấp 2</span>
              <span className="text-[#CBD5E1]">|</span>
              <span className="font-semibold text-[#3B82C4]">Chủ đề: {topicName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#E2E8F0] px-3 py-1.5 rounded-full text-xs text-[#64748B]">
          <i className="fa-solid fa-graduation-cap text-[#F59E42] text-sm"></i>
          <span>Giao diện luyện tập học sinh</span>
        </div>
      </div>
    </header>
  );
};
