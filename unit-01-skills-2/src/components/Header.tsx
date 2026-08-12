import React from 'react';

interface HeaderProps {
  completedTracksCount: number;
  totalTracksCount: number;
  canProceed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  completedTracksCount,
  totalTracksCount,
  canProceed,
}) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center text-2xl shadow-xs border border-[#DBEAFE]">
              <i className="fa-solid fa-headphones-simple"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#DBEAFE] text-[#3B82C4] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#3B82C4]/20">
                  Lớp 8 • Global Success
                </span>
                <span className="bg-[#FFEDD5] text-[#F59E42] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#F59E42]/20">
                  Listening Skills 2
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#334155] mt-1 tracking-tight">
                Tiếng Anh 8 - Unit 1: Leisure Time - Skills 2
              </h1>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3 bg-[#FDFBF7] p-2.5 px-4 rounded-xl border border-[#E2E8F0]">
            <div className="text-right">
              <p className="text-xs text-[#64748B] font-medium">Tiến độ 2 lượt nghe</p>
              <p className="text-sm font-bold text-[#334155]">
                Đã hoàn thành Lượt 2: <span className="text-[#3B82C4]">{completedTracksCount}/{totalTracksCount} bài</span>
              </p>
            </div>

            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              canProceed ? 'bg-[#F0FDF4] text-[#4ADE80] border border-[#4ADE80]' : 'bg-[#DBEAFE] text-[#3B82C4]'
            }`}>
              {canProceed ? (
                <i className="fa-solid fa-circle-check text-lg"></i>
              ) : (
                <i className="fa-solid fa-list-check text-base"></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
