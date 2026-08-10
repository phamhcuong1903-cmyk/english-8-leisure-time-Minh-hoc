import React from 'react';

interface VideoSectionProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onNextStep, onPrevStep }) => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevStep}
            className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] flex items-center justify-center text-[#334155] hover:bg-[#DBEAFE] hover:text-[#3B82C4] transition-colors cursor-pointer"
            title="Quay lại phần Luyện chép chính tả"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <span className="text-xs font-semibold text-[#F59E42] uppercase tracking-wider">
              Bước 2 / 3 • Video tình huống
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#334155]">
              Xem cách mời và nhận lời trong tình huống thực tế
            </h2>
          </div>
        </div>

        <button
          onClick={onNextStep}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F59E42] text-white font-bold hover:bg-[#e08b30] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Tiếp tục → Khám phá hoạt động giải trí quanh thế giới</span>
          <i className="fa-solid fa-earth-americas"></i>
        </button>
      </div>

      {/* Main Video Frame Card (Nền trắng, bo góc, đổ bóng nhẹ) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E2E8F0] space-y-5">
        {/* Title above video (Hiển thị đúng yêu cầu) */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center text-xl shadow-xs">
            <i className="fa-solid fa-circle-play"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#334155]">
              Xem cách mời và nhận lời trong tình huống thực tế
            </h3>
            <p className="text-xs text-[#64748B]">
              Video minh họa tiếng Anh giao tiếp chuẩn: Making, accepting & declining invitations
            </p>
          </div>
        </div>

        {/* Responsive YouTube Embed Iframe */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-inner border border-[#E2E8F0]" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/UPB0ms02W3A?rel=0&modestbranding=1"
            title="Xem cách mời và nhận lời trong tình huống thực tế"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Learning Key Points / Vocabulary Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Box 1: Mời người khác (Making Invitations) */}
          <div className="p-4 rounded-xl bg-[#DBEAFE]/40 border border-[#3B82C4]/30 space-y-2">
            <h4 className="font-bold text-[#3B82C4] flex items-center gap-2 text-sm">
              <i className="fa-solid fa-envelope-open-text"></i>
              <span>Cấu trúc Mời (Making Invitations)</span>
            </h4>
            <ul className="text-xs text-[#334155] space-y-1.5 list-disc list-inside">
              <li><strong>Would you like to + V...?</strong> (Bạn có muốn... không?)</li>
              <li><strong>Do you want to + V...?</strong> (Bạn muốn... cùng mình không?)</li>
              <li><strong>How about + V-ing...?</strong> (Hay là chúng mình cùng...?)</li>
            </ul>
          </div>

          {/* Box 2: Nhận lời & Từ chối (Accepting / Declining) */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#4ADE80]/40 space-y-2">
            <h4 className="font-bold text-[#4ADE80] flex items-center gap-2 text-sm">
              <i className="fa-solid fa-circle-check"></i>
              <span>Nhận lời & Từ chối lịch sự</span>
            </h4>
            <ul className="text-xs text-[#334155] space-y-1.5 list-disc list-inside">
              <li><strong>Yes, I'd love to! / That sounds great!</strong> (Đồng ý)</li>
              <li><strong>I'm sorry, I can't. I'm busy today.</strong> (Từ chối)</li>
              <li><strong>Thanks, but I have another plan.</strong> (Cảm ơn, nhưng mình có lịch khác)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Continuation Button Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center font-bold">
            <i className="fa-solid fa-compass"></i>
          </div>
          <div>
            <span className="font-bold text-[#334155] block">Sẵn sàng sang bước tiếp theo?</span>
            <span className="text-xs text-[#64748B]">
              Khám phá các hoạt động giải trí phổ biến của học sinh trên thế giới qua bản đồ tương tác.
            </span>
          </div>
        </div>

        <button
          onClick={onNextStep}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F59E42] text-white font-bold hover:bg-[#e08b30] transition-colors shadow-md flex items-center justify-center gap-2 text-base cursor-pointer shrink-0"
        >
          <span>Tiếp tục → Khám phá hoạt động giải trí quanh thế giới</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
