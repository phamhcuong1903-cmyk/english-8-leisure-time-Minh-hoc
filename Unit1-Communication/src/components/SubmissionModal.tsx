import React, { useState } from 'react';
import { SAMPLE_COMMUNICATION_TEXT } from '../utils/audioHelper';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  userText: string;
  timeSpentSeconds: number;
  onNextToVideo?: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  userText,
  timeSpentSeconds,
  onNextToVideo,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  const wordCount = userText.trim() === '' ? 0 : userText.trim().split(/\s+/).length;
  const charCount = userText.length;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins > 0 ? `${mins} phút ` : ''}${secs} giây`;
  };

  // Compare words roughly for basic accuracy calculation
  const targetWords = SAMPLE_COMMUNICATION_TEXT.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  const userWords = userText.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  
  let matchedCount = 0;
  userWords.forEach((word) => {
    if (word && targetWords.includes(word)) {
      matchedCount++;
    }
  });

  const accuracyPercent = userWords.length > 0 
    ? Math.min(100, Math.round((matchedCount / targetWords.length) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] max-w-xl w-full p-6 sm:p-8 transform transition-all animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Success Banner */}
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#4ADE80] text-center flex flex-col items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#4ADE80] border-2 border-[#4ADE80] mb-3 shadow-xs">
            <i className="fa-solid fa-circle-check text-3xl"></i>
          </div>
          {/* Explicitly required message */}
          <h3 className="text-2xl font-bold text-[#334155]">
            Đã ghi nhận bài làm của bạn
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            Bài chép chính tả của bạn đã được lưu thành công trên hệ thống.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center mb-6">
          <div className="bg-[#FDFBF7] border border-[#E2E8F0] p-3 rounded-xl">
            <span className="block text-xs text-[#64748B]">Số từ</span>
            <span className="text-xl font-bold text-[#3B82C4]">{wordCount}</span>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E2E8F0] p-3 rounded-xl">
            <span className="block text-xs text-[#64748B]">Thời gian</span>
            <span className="text-xl font-bold text-[#F59E42]">{formatTimer(timeSpentSeconds)}</span>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E2E8F0] p-3 rounded-xl">
            <span className="block text-xs text-[#64748B]">Độ chính xác từ</span>
            <span className="text-xl font-bold text-[#4ADE80]">~{accuracyPercent}%</span>
          </div>
        </div>

        {/* Optional Transcript Comparison */}
        <div className="flex-1 overflow-y-auto mb-6 pr-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#334155]">
              Xem đáp án & so sánh bài làm
            </span>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs text-[#3B82C4] font-semibold hover:underline flex items-center gap-1"
            >
              <i className={`fa-solid ${showComparison ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              <span>{showComparison ? 'Ẩn đáp án' : 'Hiển thị đáp án gõ'}</span>
            </button>
          </div>

          {showComparison && (
            <div className="space-y-3 text-sm">
              <div className="p-3.5 bg-[#F0FDF4] border border-[#4ADE80]/40 rounded-xl">
                <span className="block text-xs font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
                  Đoạn văn gốc bài nghe (Standard Transcript):
                </span>
                <p className="text-[#334155] leading-relaxed italic">
                  "{SAMPLE_COMMUNICATION_TEXT}"
                </p>
              </div>

              <div className="p-3.5 bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl">
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Bài gõ của học sinh:
                </span>
                <p className="text-[#334155] leading-relaxed whitespace-pre-wrap">
                  {userText || '(Chưa gõ nội dung)'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#334155] font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Sửa bài</span>
          </button>
          
          {onNextToVideo && (
            <button
              onClick={() => {
                onClose();
                onNextToVideo();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B82C4] text-white font-bold hover:bg-[#2e6aa3] transition-colors shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Tiếp tục → Xem video</span>
              <i className="fa-solid fa-circle-play"></i>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onRestart();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F59E42] text-white font-bold hover:bg-[#e08b30] transition-colors shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right"></i>
            <span>Làm bài mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
