import React, { useState } from 'react';

interface DictationTextareaCardProps {
  text: string;
  onChangeText: (newText: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  timeSpentSeconds: number;
  onNextToVideo?: () => void;
}

export const DictationTextareaCard: React.FC<DictationTextareaCardProps> = ({
  text,
  onChangeText,
  onSubmit,
  onReset,
  timeSpentSeconds,
  onNextToVideo,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Calculate statistics
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col justify-between h-full min-h-[420px]">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F59E42]"></span>
          <h2 className="text-xl font-bold text-[#334155]">2. Khung Chép Chính Tả</h2>
        </div>

        {/* Text size adjuster */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Cỡ chữ:</span>
          <div className="flex items-center bg-[#FDFBF7] border border-[#E2E8F0] rounded-lg p-0.5">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                fontSize === 'normal' ? 'bg-[#3B82C4] text-white' : 'text-[#64748B] hover:text-[#334155]'
              }`}
              title="Cỡ chữ vừa"
            >
              Vừa
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                fontSize === 'large' ? 'bg-[#3B82C4] text-white' : 'text-[#64748B] hover:text-[#334155]'
              }`}
              title="Cỡ chữ lớn"
            >
              Lớn
            </button>
          </div>
        </div>
      </div>

      {/* Main Textarea section */}
      <div className="my-4 flex-1 flex flex-col">
        <label htmlFor="dictation-input" className="sr-only">
          Nội dung chép chính tả
        </label>
        <div className="relative flex-1 flex flex-col">
          <textarea
            id="dictation-input"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Vừa nghe vừa viết nội dung bài nghe vào đây... (Ví dụ: Good morning students...)"
            rows={10}
            className={`w-full flex-1 p-4 rounded-xl border border-[#E2E8F0] bg-[#FDFBF7] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3B82C4] focus:border-transparent transition-all resize-y ${
              fontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-normal'
            }`}
            style={{ minHeight: '220px' }}
          />

          {/* Textarea Bottom Quick Info */}
          <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-[#64748B] px-1">
            <div className="flex items-center gap-4">
              <span>
                <i className="fa-solid fa-font text-[#3B82C4] mr-1"></i>
                Số từ: <strong className="text-[#334155]">{wordCount}</strong>
              </span>
              <span>
                <i className="fa-solid fa-i-cursor text-[#3B82C4] mr-1"></i>
                Ký tự: <strong className="text-[#334155]">{charCount}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <i className="fa-solid fa-stopwatch text-[#F59E42]"></i>
              <span>Thời gian làm bài: <strong className="text-[#334155]">{formatTimer(timeSpentSeconds)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation box if reset is clicked */}
      {showResetConfirm && (
        <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#F87171]/40 rounded-xl flex items-center justify-between text-xs text-[#334155]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-[#F87171] text-base"></i>
            <span>Bạn có chắc chắn muốn xoá toàn bộ bài đã gõ không?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirmReset}
              className="px-3 py-1 bg-[#F87171] text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Xoá sạch
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg font-medium hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons: "Nộp bài" and "Làm lại" */}
      <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Nút Làm lại */}
        <button
          onClick={() => {
            if (text.trim().length > 0) {
              setShowResetConfirm(true);
            } else {
              onReset();
            }
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] font-semibold hover:bg-[#FEF2F2] hover:text-[#F87171] hover:border-[#F87171]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          title="Xoá toàn bộ nội dung đã gõ"
        >
          <i className="fa-solid fa-trash-arrow-up"></i>
          <span>Làm lại</span>
        </button>

        {/* Nút Nộp bài */}
        <button
          onClick={onSubmit}
          disabled={text.trim().length === 0}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer ${
            text.trim().length === 0
              ? 'bg-[#CBD5E1] cursor-not-allowed shadow-none'
              : 'bg-[#F59E42] hover:bg-[#e08b30] active:scale-95 shadow-[#F59E42]/20'
          }`}
          title="Nộp bài làm của bạn"
        >
          <i className="fa-solid fa-paper-plane"></i>
          <span>Nộp bài</span>
        </button>
      </div>

      {/* Button to go to Next Screen: Xem Video */}
      {onNextToVideo && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onNextToVideo}
            className="w-full py-3 px-4 rounded-xl bg-[#DBEAFE] text-[#3B82C4] font-bold border border-[#3B82C4]/30 hover:bg-[#3B82C4] hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer group"
          >
            <span>Tiếp tục → Xem video</span>
            <i className="fa-solid fa-circle-play group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      )}
    </div>
  );
};
