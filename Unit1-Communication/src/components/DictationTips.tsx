import React, { useState } from 'react';

export const DictationTips: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-5">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-[#3B82C4]">
          <i className="fa-solid fa-lightbulb text-lg text-[#F59E42]"></i>
          <h3 className="text-base font-bold text-[#334155]">
            Hướng dẫn luyện nghe chép chính tả cho học sinh
          </h3>
        </div>
        <button className="text-[#64748B] hover:text-[#334155] text-sm">
          <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-[#64748B]">
          <div className="flex items-start gap-2 bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E2E8F0]">
            <span className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold flex items-center justify-center shrink-0">1</span>
            <p>
              Nhấn vào <strong>BIỂU TƯỢNG LOA LỚN</strong> ở nửa bên trái để bắt đầu nghe phát âm từ đầu.
            </p>
          </div>

          <div className="flex items-start gap-2 bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E2E8F0]">
            <span className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold flex items-center justify-center shrink-0">2</span>
            <p>
              Vừa nghe vừa gõ lại câu tiếng Anh vào <strong>KHUNG TEXTAREA</strong> ở nửa bên phải.
            </p>
          </div>

          <div className="flex items-start gap-2 bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E2E8F0]">
            <span className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold flex items-center justify-center shrink-0">3</span>
            <p>
              Nếu thấy người nói quá nhanh, chọn tốc độ <strong>0.75x</strong> để nghe rõ từng từ hơn.
            </p>
          </div>

          <div className="flex items-start gap-2 bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E2E8F0]">
            <span className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold flex items-center justify-center shrink-0">4</span>
            <p>
              Khi làm xong, nhấn <strong>NỘP BÀI</strong> để xem kết quả ghi nhận và đáp án chính xác.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
