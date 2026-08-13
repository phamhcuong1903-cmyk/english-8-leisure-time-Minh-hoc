import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="mt-14 pb-12 pt-6 text-center border-t border-[#E2E8F0] px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2">
        <p
          id="cheer-message"
          className="text-xl sm:text-2xl font-bold text-[#F59E42] tracking-wide"
        >
          Chúc con học vui vẻ! 🎉
        </p>
        <p className="text-sm text-[#64748B] mt-1">
          Học tập chủ động • Tự tin bứt phá điểm số Tiếng Anh 8
        </p>
      </div>
    </footer>
  );
};
