import React, { useState, useEffect } from 'react';
import { PRONUNCIATION_WORDS } from '../data/pronunciationWords';
import { PronunciationWord } from '../types';

interface PartDragGameProps {
  onContinue: () => void;
  onBackToVideo: () => void;
}

export const PartDragGame: React.FC<PartDragGameProps> = ({ onContinue, onBackToVideo }) => {
  const [unplacedWords, setUnplacedWords] = useState<PronunciationWord[]>([]);
  const [shortUWords, setShortUWords] = useState<PronunciationWord[]>([]);
  const [longUWords, setLongUWords] = useState<PronunciationWord[]>([]);
  const [draggedWord, setDraggedWord] = useState<PronunciationWord | null>(null);
  const [selectedWord, setSelectedWord] = useState<PronunciationWord | null>(null); // For tap/click select on mobile
  const [errorWordId, setErrorWordId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<'short_u' | 'long_u' | null>(null);

  // Function to shuffle array
  const shuffleArray = (array: PronunciationWord[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Initialize game with shuffled words
  const initGame = () => {
    setUnplacedWords(shuffleArray(PRONUNCIATION_WORDS));
    setShortUWords([]);
    setLongUWords([]);
    setDraggedWord(null);
    setSelectedWord(null);
    setErrorWordId(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Pronounce word using SpeechSynthesis
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle word selection (pronounce immediately on click/press)
  const handleCardClick = (word: PronunciationWord) => {
    speakWord(word.word);
    setSelectedWord((prev) => (prev?.id === word.id ? null : word));
  };

  // Drag start handler
  const handleDragStart = (e: React.DragEvent, word: PronunciationWord) => {
    speakWord(word.word);
    setDraggedWord(word);
    e.dataTransfer.setData('text/plain', word.id);
  };

  // Handle Drop in target zone
  const handleDropInZone = (targetZone: 'short_u' | 'long_u') => {
    const wordToPlace = draggedWord || selectedWord;
    if (!wordToPlace) return;

    if (wordToPlace.sound === targetZone) {
      // CORRECT DROP
      if (targetZone === 'short_u') {
        setShortUWords((prev) => [...prev, wordToPlace]);
      } else {
        setLongUWords((prev) => [...prev, wordToPlace]);
      }
      setUnplacedWords((prev) => prev.filter((w) => w.id !== wordToPlace.id));
      setSelectedWord(null);
      setDraggedWord(null);
      setErrorWordId(null);
    } else {
      // WRONG DROP -> Trigger shake and error red border
      setErrorWordId(wordToPlace.id);
      setSelectedWord(null);
      setDraggedWord(null);
      setTimeout(() => {
        setErrorWordId(null);
      }, 700);
    }
    setActiveDropZone(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: 'short_u' | 'long_u') => {
    e.preventDefault();
    setActiveDropZone(zone);
  };

  const totalSorted = shortUWords.length + longUWords.length;
  const isAllCompleted = totalSorted === PRONUNCIATION_WORDS.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[500px] py-4 px-4">
      {/* Top Header Card */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center font-bold text-base shadow-xs">
            <i className="fa-solid fa-gamepad text-base"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#334155] leading-tight">
              Trò chơi Phân loại âm: /ʊ/ và /uː/
            </h2>
            <p className="text-xs text-[#64748B]">
              Kéo-thả (hoặc chạm chọn) các từ vào đúng cột phát âm tương ứng
            </p>
          </div>
        </div>

        <button
          onClick={onBackToVideo}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#3B82C4] bg-[#DBEAFE] hover:bg-[#c2dcfe] rounded-lg transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Xem lại Video</span>
        </button>
      </div>

      {/* Progress & Instructions Bar */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#334155]">
          <span className="w-3 h-3 rounded-full bg-[#F59E42] animate-pulse"></span>
          <span>Đã hoàn thành:</span>
          <span className="text-base px-3 py-0.5 rounded-full bg-[#FFEDD5] text-[#F59E42] border border-[#F59E42] font-black">
            {totalSorted} / {PRONUNCIATION_WORDS.length} từ đã đúng
          </span>
        </div>

        <div className="text-xs text-[#64748B] flex items-center gap-2">
          <i className="fa-solid fa-volume-high text-[#3B82C4]"></i>
          <span>Nhấp vào từ để nghe đọc mẫu giọng Mỹ!</span>
        </div>
      </div>

      {/* 1. UNPLACED WORD POOL */}
      {unplacedWords.length > 0 && (
        <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 mb-6">
          <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#3B82C4]"></i>
            Danh sách thẻ từ cần phân loại ({unplacedWords.length} từ còn lại):
          </h3>

          <div className="flex flex-wrap gap-2.5 items-center justify-center min-h-[90px] p-3 bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl">
            {unplacedWords.map((wordObj) => {
              const isSelected = selectedWord?.id === wordObj.id;
              const isError = errorWordId === wordObj.id;

              return (
                <div
                  key={wordObj.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, wordObj)}
                  onClick={() => handleCardClick(wordObj)}
                  className={`px-4 py-2 rounded-xl text-base font-bold transition-all cursor-grab active:cursor-grabbing select-none flex items-center gap-2 border shadow-xs ${
                    isError
                      ? 'bg-[#FEF2F2] border-[#F87171] text-[#EF4444] animate-bounce ring-2 ring-[#F87171]'
                      : isSelected
                      ? 'bg-[#FFEDD5] border-[#F59E42] text-[#F59E42] shadow-md ring-2 ring-[#F59E42] scale-105'
                      : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#3B82C4] hover:shadow-sm hover:scale-102'
                  }`}
                  title="Giữ kéo hoặc nhấp để chọn & nghe phát âm"
                >
                  <span>{wordObj.word}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(wordObj.word);
                    }}
                    className="text-xs text-[#94A3B8] hover:text-[#3B82C4] p-1 rounded"
                    title="Nghe âm chuẩn"
                  >
                    <i className="fa-solid fa-volume-high"></i>
                  </button>
                </div>
              );
            })}
          </div>

          {selectedWord && (
            <div className="mt-3 text-center text-xs text-[#F59E42] font-semibold animate-pulse">
              👉 Đã chọn từ "<strong>{selectedWord.word}</strong>". Hãy nhấp vào 1 trong 2 cột bên dưới để thả từ!
            </div>
          )}
        </div>
      )}

      {/* 2. DROP ZONE COLUMNS (SIDE BY SIDE ON WIDE SCREENS, STACKED ON MOBILE) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* LEFT COLUMN: /ʊ/ (Short Vowel) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'short_u')}
          onDragLeave={() => setActiveDropZone(null)}
          onDrop={() => handleDropInZone('short_u')}
          onClick={() => selectedWord && handleDropInZone('short_u')}
          className={`flex flex-col min-h-[300px] bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
            activeDropZone === 'short_u' || (selectedWord && selectedWord.sound === 'short_u')
              ? 'border-[#3B82C4] ring-2 ring-[#DBEAFE]'
              : 'border-[#E2E8F0]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#DBEAFE] border-b border-[#BFDBFE] p-4 text-center">
            <span className="inline-block px-3 py-1 bg-white border border-[#93C5FD] rounded-full text-xs font-bold text-[#3B82C4] mb-1">
              Nguyên âm ngắn
            </span>
            <h3 className="text-2xl font-black text-[#1E3A8A]">
              Âm /ʊ/
            </h3>
            <p className="text-xs text-[#1E3A8A] mt-0.5">
              (VD: cook, book, foot)
            </p>
          </div>

          {/* Column Drop Content */}
          <div className="flex-1 p-4 bg-[#FDFBF7] flex flex-wrap content-start gap-2.5 min-h-[200px]">
            {shortUWords.length === 0 ? (
              <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center text-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-xl p-4">
                <i className="fa-solid fa-cloud-arrow-down text-3xl mb-2 text-[#CBD5E1]"></i>
                <p className="text-xs font-medium">Thả các từ có âm <strong>/ʊ/</strong> vào đây</p>
              </div>
            ) : (
              shortUWords.map((item) => (
                <div
                  key={item.id}
                  onClick={() => speakWord(item.word)}
                  className="px-3.5 py-2 rounded-xl text-sm font-extrabold bg-[#F0FDF4] border border-[#4ADE80] text-[#166534] shadow-xs flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  title="Chính xác! Nhấp để nghe lại"
                >
                  <i className="fa-solid fa-circle-check text-[#4ADE80] text-xs"></i>
                  <span>{item.word}</span>
                  <span className="text-[11px] font-normal text-[#15803D] opacity-80">{item.ipa}</span>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-white border-t border-[#E2E8F0] text-center text-xs font-bold text-[#3B82C4]">
            Đã xếp: {shortUWords.length} / 7 từ
          </div>
        </div>

        {/* RIGHT COLUMN: /uː/ (Long Vowel) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'long_u')}
          onDragLeave={() => setActiveDropZone(null)}
          onDrop={() => handleDropInZone('long_u')}
          onClick={() => selectedWord && handleDropInZone('long_u')}
          className={`flex flex-col min-h-[300px] bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
            activeDropZone === 'long_u' || (selectedWord && selectedWord.sound === 'long_u')
              ? 'border-[#F59E42] ring-2 ring-[#FFEDD5]'
              : 'border-[#E2E8F0]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#FFEDD5] border-b border-[#FDBA74] p-4 text-center">
            <span className="inline-block px-3 py-1 bg-white border border-[#FDBA74] rounded-full text-xs font-bold text-[#F59E42] mb-1">
              Nguyên âm dài
            </span>
            <h3 className="text-2xl font-black text-[#9A3412]">
              Âm /uː/
            </h3>
            <p className="text-xs text-[#9A3412] mt-0.5">
              (VD: food, school, group)
            </p>
          </div>

          {/* Column Drop Content */}
          <div className="flex-1 p-4 bg-[#FDFBF7] flex flex-wrap content-start gap-2.5 min-h-[200px]">
            {longUWords.length === 0 ? (
              <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center text-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-xl p-4">
                <i className="fa-solid fa-cloud-arrow-down text-3xl mb-2 text-[#CBD5E1]"></i>
                <p className="text-xs font-medium">Thả các từ có âm <strong>/uː/</strong> vào đây</p>
              </div>
            ) : (
              longUWords.map((item) => (
                <div
                  key={item.id}
                  onClick={() => speakWord(item.word)}
                  className="px-3.5 py-2 rounded-xl text-sm font-extrabold bg-[#F0FDF4] border border-[#4ADE80] text-[#166534] shadow-xs flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  title="Chính xác! Nhấp để nghe lại"
                >
                  <i className="fa-solid fa-circle-check text-[#4ADE80] text-xs"></i>
                  <span>{item.word}</span>
                  <span className="text-[11px] font-normal text-[#15803D] opacity-80">{item.ipa}</span>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-white border-t border-[#E2E8F0] text-center text-xs font-bold text-[#F59E42]">
            Đã xếp: {longUWords.length} / 7 từ
          </div>
        </div>

      </div>

      {/* COMPLETION POPUP / NOTIFICATION */}
      {isAllCompleted && (
        <div className="w-full bg-[#F0FDF4] border-2 border-[#4ADE80] rounded-2xl p-6 text-center shadow-md mb-6 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#4ADE80] text-[#4ADE80] flex items-center justify-center text-3xl mb-3 shadow-xs">
            <i className="fa-solid fa-party-horn"></i>
          </div>
          <h3 className="text-2xl font-black text-[#166534] mb-1">
            🎉 Hoàn thành! Bạn đã phân biệt đúng cả 14 từ!
          </h3>
          <p className="text-sm text-[#15803D] mb-4">
            Bạn đã nắm vững sự khác biệt giữa âm ngắn /ʊ/ và âm dài /uː/.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer"
              style={{ backgroundColor: '#F59E42' }}
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Chơi lại (Xáo trộn từ)</span>
            </button>

            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#3B82C4] rounded-xl shadow-xs hover:bg-[#2d6fa8] transition-all cursor-pointer"
            >
              <span>Chuyển sang Bài tập Củng cố</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM CONTINUE BUTTON IF NOT YET ALL COMPLETED */}
      {!isAllCompleted && (
        <div className="w-full flex justify-between items-center mt-2">
          <button
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#FDFBF7] transition-all shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>Làm mới trò chơi</span>
          </button>

          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold rounded-xl text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            style={{ backgroundColor: '#F59E42' }}
          >
            <span>Tiếp tục: Bài tập Củng cố</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      )}
    </div>
  );
};
