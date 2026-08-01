import React, { useState } from 'react';
import { WordItem } from '../../data/vocabularyData';
import { speakWord } from '../../utils/speech';

interface FlashcardTabProps {
  currentWord: WordItem;
  soundEnabled: boolean;
  onMarkMastered: (id: number) => void;
  onMarkReview: (id: number) => void;
  isMastered: boolean;
  isReview: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const FlashcardTab: React.FC<FlashcardTabProps> = ({
  currentWord,
  soundEnabled,
  onMarkMastered,
  onMarkReview,
  isMastered,
  isReview,
  onPrev,
  onNext,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip status when word changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [currentWord.id]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakWord(currentWord.word, soundEnabled);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[420px] gap-6">
      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full max-w-xl h-80 perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-[#3B82C4]/30 shadow-md p-6 flex flex-col items-center justify-between backface-hidden bg-gradient-to-b from-white to-[#FDFBF7]">
            {/* Top badge */}
            <div className="w-full flex justify-between items-center text-xs text-[#64748B]">
              <span className="bg-[#DBEAFE] text-[#3B82C4] font-bold px-2.5 py-1 rounded-md">
                {currentWord.type}
              </span>
              <span className="italic flex items-center gap-1 text-[#64748B]">
                <i className="fa-solid fa-hand-pointer text-[#3B82C4]"></i> Chạm để xem nghĩa
              </span>
            </div>

            {/* Main Word & IPA */}
            <div className="text-center my-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#334155] mb-2 tracking-wide">
                {currentWord.word}
              </h2>
              <p className="text-lg text-[#64748B] font-medium tracking-normal mb-4">
                /{currentWord.ipa}/
              </p>

              {/* Speaker Button */}
              <button
                onClick={handleSpeak}
                className="inline-flex items-center gap-2 bg-[#3B82C4] hover:bg-[#2e689d] text-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold transition-transform active:scale-95"
              >
                <i className="fa-solid fa-volume-high text-base"></i>
                <span>Phát âm (Audio)</span>
              </button>
            </div>

            {/* Bottom Indicator */}
            <div className="text-xs text-[#64748B] font-medium flex items-center gap-2">
              {isMastered && (
                <span className="text-[#4ADE80] font-bold flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i> Đã thuộc từ này
                </span>
              )}
              {isReview && !isMastered && (
                <span className="text-[#F87171] font-bold flex items-center gap-1">
                  <i className="fa-solid fa-triangle-exclamation"></i> Cần ôn lại
                </span>
              )}
              {!isMastered && !isReview && <span>Mặt trước (Tiếng Anh)</span>}
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-[#F59E42] shadow-md p-6 flex flex-col items-center justify-between backface-hidden rotate-y-180 bg-gradient-to-b from-white to-[#FFEDD5]/30">
            {/* Top badge */}
            <div className="w-full flex justify-between items-center text-xs text-[#64748B]">
              <span className="bg-[#FFEDD5] text-[#F59E42] font-bold px-2.5 py-1 rounded-md">
                Nghĩa tiếng Việt
              </span>
              <span className="italic flex items-center gap-1 text-[#64748B]">
                <i className="fa-solid fa-rotate-left text-[#F59E42]"></i> Lật lại mặt trước
              </span>
            </div>

            {/* Meaning & Example */}
            <div className="text-center my-auto px-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F59E42] mb-3">
                {currentWord.meaning}
              </h3>
              <div className="bg-[#FDFBF7] border border-[#E2E8F0] p-3 rounded-xl max-w-md mx-auto">
                <span className="text-xs font-bold text-[#64748B] block mb-1 uppercase tracking-wider">Ví dụ:</span>
                <p className="text-sm text-[#334155] italic">"{currentWord.example}"</p>
              </div>
            </div>

            {/* Bottom text */}
            <div className="text-xs text-[#64748B] font-medium">
              Mặt sau (Giải nghĩa & Ví dụ)
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls & Navigation */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Prev Button */}
        <button
          onClick={onPrev}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#DBEAFE] text-[#334155] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-[#3B82C4]"></i>
          <span>Từ trước</span>
        </button>

        {/* Learning Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          {/* Cần Ôn Lại */}
          <button
            onClick={() => {
              onMarkReview(currentWord.id);
              onNext();
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#F87171] bg-[#FEF2F2] hover:bg-[#F87171] hover:text-white text-[#F87171] font-bold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-circle-xmark"></i>
            <span>Cần Ôn Lại</span>
          </button>

          {/* Đã Thuộc */}
          <button
            onClick={() => {
              onMarkMastered(currentWord.id);
              onNext();
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-[#4ADE80] bg-[#4ADE80] hover:bg-[#3ec470] text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-circle-check"></i>
            <span>Đã Thuộc (+10)</span>
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#DBEAFE] text-[#334155] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>Từ tiếp</span>
          <i className="fa-solid fa-chevron-right text-[#3B82C4]"></i>
        </button>
      </div>
    </div>
  );
};
