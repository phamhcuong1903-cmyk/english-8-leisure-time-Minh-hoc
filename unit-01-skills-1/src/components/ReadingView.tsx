import React, { useState, useEffect } from 'react';
import { ReadingPassage, VocabularyWord } from '../types';
import { vocabularyList } from '../data/readingData';
import { speakText, stopSpeech } from '../utils/speech';

interface ReadingViewProps {
  passageData: ReadingPassage;
  onGoToDialogue: () => void;
  onOpenVocabulary: (word: VocabularyWord) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  passageData,
  onGoToDialogue,
  onOpenVocabulary,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedParaFilter, setSelectedParaFilter] = useState<number | 'all'>('all');

  // Stop speech when leaving component
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePlayAll = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      setCurrentParagraphIndex(null);
      return;
    }

    // Start playing
    const fullText = passageData.paragraphs.join(' ');
    setIsPlaying(true);
    setCurrentParagraphIndex(0);

    speakText(
      fullText,
      playbackSpeed,
      undefined,
      () => {
        setIsPlaying(false);
        setCurrentParagraphIndex(null);
      },
      () => {
        setIsPlaying(false);
        setCurrentParagraphIndex(null);
      }
    );
  };

  const handlePlayParagraph = (index: number) => {
    stopSpeech();
    setIsPlaying(true);
    setCurrentParagraphIndex(index);

    const paraText = passageData.paragraphs[index];
    speakText(
      paraText,
      playbackSpeed,
      undefined,
      () => {
        setIsPlaying(false);
        setCurrentParagraphIndex(null);
      },
      () => {
        setIsPlaying(false);
        setCurrentParagraphIndex(null);
      }
    );
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      setCurrentParagraphIndex(null);
    }
  };

  // Helper function to render text with clickable vocabulary highlights
  const renderInteractiveParagraph = (paragraphText: string, paraIdx: number) => {
    // Words to match for vocabulary lookup
    const vocabKeys = Object.keys(vocabularyList);

    // Split paragraph into words/tokens
    const words = paragraphText.split(/(\s+)/);

    return (
      <p className="text-lg leading-relaxed text-[#334155] text-justify indent-6">
        {words.map((word, wIdx) => {
          // Clean punctuation for matching
          const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, '').toLowerCase();
          const matchedKey = vocabKeys.find(
            (k) => k.toLowerCase() === cleanWord || cleanWord.startsWith(k.toLowerCase())
          );

          if (matchedKey && vocabularyList[matchedKey]) {
            return (
              <span
                key={wIdx}
                onClick={() => onOpenVocabulary(vocabularyList[matchedKey])}
                className="cursor-pointer text-[#3B82C4] font-semibold underline decoration-[#DBEAFE] decoration-2 underline-offset-4 hover:bg-[#DBEAFE] hover:text-[#1E40AF] px-1 rounded transition-all"
                title={`Nhấp để xem nghĩa từ "${matchedKey}"`}
              >
                {word}
              </span>
            );
          }

          return <span key={wIdx}>{word}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8 md:p-10 mb-8 relative">
        {/* Unit Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3B82C4]"></span>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Reading Passage • Bài Đọc
            </span>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-lg border border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] font-semibold px-2">Tốc độ:</span>
            {[0.8, 1.0, 1.2].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`text-xs px-2 py-1 rounded-md font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-[#3B82C4] text-white'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Page Title: "title" */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3B82C4] mb-8 font-serif leading-tight">
          {passageData.title}
        </h2>

        {/* Paragraphs Container */}
        <div className="space-y-6 mb-8">
          {passageData.paragraphs.map((paragraph, index) => {
            const isParagraphActive = currentParagraphIndex === index && isPlaying;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl transition-all duration-300 relative border ${
                  isParagraphActive
                    ? 'bg-[#DBEAFE]/40 border-[#3B82C4] shadow-xs'
                    : 'bg-white border-transparent hover:border-[#E2E8F0] hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DBEAFE] text-[#3B82C4] text-xs font-bold flex items-center justify-center mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    {renderInteractiveParagraph(paragraph, index)}
                  </div>
                  <button
                    onClick={() => handlePlayParagraph(index)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white flex items-center justify-center text-xs transition-colors"
                    title={`Nghe đoạn ${index + 1}`}
                  >
                    <i className={`fa-solid ${isParagraphActive ? 'fa-pause' : 'fa-volume-low'}`}></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speaker Icon Section - Directly below passage as requested */}
        {/* "Phía dưới bài đọc, hiển thị 1 biểu tượng loa (nền #DBEAFE)" */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col items-center justify-center gap-3">
          <div className="text-center">
            <span className="text-xs font-semibold text-[#64748B] mb-2 block">
              {isPlaying ? 'Đang phát âm thanh bài đọc...' : 'Nhấp vào biểu tượng loa để nghe toàn bộ bài đọc'}
            </span>

            {/* Speaker Icon Button on #DBEAFE background */}
            <button
              onClick={handleTogglePlayAll}
              className={`w-16 h-16 rounded-full bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 group border-2 border-white`}
              title={isPlaying ? 'Dừng đọc' : 'Nghe bài đọc'}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause animate-pulse' : 'fa-volume-high'}`}></i>
            </button>
          </div>

          {/* Quick status bar if playing */}
          {isPlaying && (
            <div className="flex items-center gap-2 text-xs font-medium text-[#3B82C4] bg-[#DBEAFE] px-3 py-1 rounded-full animate-bounce">
              <span className="w-2 h-2 rounded-full bg-[#3B82C4] animate-ping"></span>
              <span>Đang đọc tự động (Tốc độ {playbackSpeed}x)</span>
            </div>
          )}

          <p className="text-xs text-[#64748B] italic text-center mt-1">
            * Mẹo: Bạn có thể nhấp vào các <span className="text-[#3B82C4] font-semibold underline">từ xanh</span> để xem từ vựng và nghe phát âm riêng lẻ.
          </p>
        </div>
      </div>

      {/* Action Button at Bottom of Page */}
      {/* "Có 1 nút 'Đối thoại' (màu #F59E42) ở cuối trang, sẽ dùng để dẫn sang tính năng luyện nói ở bước sau." */}
      <div className="flex justify-center pb-8">
        <button
          onClick={onGoToDialogue}
          className="bg-[#F59E42] text-white hover:bg-[#E08A2E] active:bg-[#C97820] font-bold text-lg px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-3 border-2 border-white"
        >
          <i className="fa-solid fa-comments text-xl"></i>
          <span>Đối thoại</span>
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  );
};
