import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#FFFFFF] border-t border-[#E2E8F0] py-6 px-4 text-center text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-book-bookmark text-[#3B82C4]"></i>
          <span className="font-semibold text-[#334155]">Tiếng Anh 8 - Global Success</span>
          <span>•</span>
          <span>Unit 1: Leisure Time - Project</span>
        </div>

        <p className="text-[11px] text-[#64748B]">
          Công cụ ôn tập nhanh và tự đánh giá năng lực dành cho học sinh THCS
        </p>
      </div>
    </footer>
  );
};
