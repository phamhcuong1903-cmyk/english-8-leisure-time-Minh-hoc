import React from 'react';
import { VocabularyWord } from '../types';
import { speakText } from '../utils/speech';

interface VocabularyModalProps {
  wordData: VocabularyWord | null;
  onClose: () => void;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({ wordData, onClose }) => {
  if (!wordData) return null;

  const handleSpeak = () => {
    speakText(wordData.word, 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#334155] w-8 h-8 rounded-full bg-[#FDFBF7] border border-[#E2E8F0] flex items-center justify-center transition-colors"
          title="Đóng"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center text-xl font-bold">
            <i className="fa-solid fa-language"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#334155] capitalize">{wordData.word}</h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#FFEDD5] text-[#F59E42] font-semibold">
                {wordData.type}
              </span>
            </div>
            <p className="text-sm font-mono text-[#64748B]">{wordData.phonetic}</p>
          </div>
        </div>

        <div className="my-4 p-3 rounded-lg bg-[#FDFBF7] border border-[#E2E8F0]">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            Nghĩa tiếng Việt
          </span>
          <p className="text-base font-medium text-[#334155]">{wordData.meaning}</p>
        </div>

        <div className="mb-5">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            Ví dụ trong bài
          </span>
          <p className="text-sm text-[#334155] italic bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
            "{wordData.example}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white rounded-lg font-bold text-sm transition-all"
          >
            <i className="fa-solid fa-volume-high"></i>
            <span>Nghe phát âm</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#334155] text-white hover:bg-[#1E293B] rounded-lg font-bold text-sm transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
