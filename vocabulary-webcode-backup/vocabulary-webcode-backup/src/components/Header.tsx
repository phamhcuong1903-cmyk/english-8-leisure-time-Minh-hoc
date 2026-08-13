import React from 'react';

export const Header: React.FC = () => {
  return (
    <header id="main-header" className="pt-10 pb-8 text-center px-4 max-w-4xl mx-auto">
      {/* Category / Grade Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold text-sm tracking-wide mb-4 shadow-xs border border-[#3B82C4]/20">
        <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
        <span>CHƯƠNG TRÌNH TIẾNG ANH 8</span>
      </div>

      {/* Main Title */}
      <h1
        id="unit-title"
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#334155] tracking-tight leading-snug mb-3"
      >
        Tiếng Anh 8 - Unit 1: Leisure Time
      </h1>

      {/* Subtitle */}
      <p
        id="unit-subtitle"
        className="text-lg sm:text-xl text-[#64748B] max-w-xl mx-auto font-normal leading-relaxed"
      >
        Chọn phần bạn muốn học
      </p>

      {/* Highlights Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-[#64748B]">
        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
          <i className="fa-solid fa-clock text-[#F59E42]"></i>
          <span>Chủ đề: Hoạt động giải trí</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
          <i className="fa-solid fa-list-check text-[#3B82C4]"></i>
          <span>9 phần học đầy đủ</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
          <i className="fa-solid fa-arrow-up-right-from-square text-emerald-600"></i>
          <span>Mở tab mới tiện lợi</span>
        </span>
      </div>
    </header>
  );
};
