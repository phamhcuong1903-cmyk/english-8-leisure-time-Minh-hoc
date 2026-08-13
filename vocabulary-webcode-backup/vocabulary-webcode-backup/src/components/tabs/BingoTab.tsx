import React, { useState, useEffect, useMemo } from 'react';
import { WordItem } from '../../data/vocabularyData';
import { speakWord, playSoundEffect } from '../../utils/speech';

interface BingoTabProps {
  filteredWords: WordItem[];
  allWords: WordItem[];
  soundEnabled: boolean;
  onCorrectHit: (wordId: number) => void;
  onWrongHit: (wordId: number) => void;
}

type BingoMode = 'meaning-to-word' | 'word-to-meaning' | 'example-to-word';

export const BingoTab: React.FC<BingoTabProps> = ({
  filteredWords,
  allWords,
  soundEnabled,
  onCorrectHit,
  onWrongHit,
}) => {
  const [mode, setMode] = useState<BingoMode>('meaning-to-word');
  const [gridWords, setGridWords] = useState<WordItem[]>([]);
  const [hitIndexes, setHitIndexes] = useState<Set<number>>(new Set());
  const [calledIndex, setCalledIndex] = useState<number | null>(null);
  const [calledHistory, setCalledHistory] = useState<number[]>([]);
  const [wrongWordsList, setWrongWordsList] = useState<WordItem[]>([]);

  // Initialize 5x5 Grid (25 tiles)
  const initBoard = () => {
    // Pick 25 words. If filteredWords has < 25, mix in rest of allWords
    let pool = [...filteredWords];
    if (pool.length < 25) {
      const rest = allWords.filter((w) => !pool.some((p) => p.id === w.id));
      pool = [...pool, ...rest];
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen25 = shuffled.slice(0, 25);

    setGridWords(chosen25);
    setHitIndexes(new Set());
    setCalledIndex(null);
    setCalledHistory([]);
    setWrongWordsList([]);
  };

  useEffect(() => {
    initBoard();
  }, [filteredWords]);

  // Call Next Word button handler
  const callNextWord = () => {
    if (gridWords.length === 0) return;

    // Remaining uncalled indexes among unhit or all
    const uncalled = Array.from({ length: 25 }, (_, i) => i).filter(
      (idx) => !calledHistory.includes(idx) && !hitIndexes.has(idx)
    );

    let nextIdx: number;
    if (uncalled.length > 0) {
      nextIdx = uncalled[Math.floor(Math.random() * uncalled.length)];
    } else {
      // If all called, pick any unhit
      const unhit = Array.from({ length: 25 }, (_, i) => i).filter((idx) => !hitIndexes.has(idx));
      if (unhit.length === 0) return; // Board fully cleared
      nextIdx = unhit[Math.floor(Math.random() * unhit.length)];
    }

    setCalledIndex(nextIdx);
    setCalledHistory((prev) => [...prev, nextIdx]);

    // Speak audio
    const item = gridWords[nextIdx];
    if (item) {
      speakWord(item.word, soundEnabled);
    }
  };

  // Click on tile
  const handleTileClick = (idx: number) => {
    if (hitIndexes.has(idx)) return; // already hit
    if (calledIndex === null) {
      // If student clicks without calling, call this word or prompt call first
      return;
    }

    const targetWord = gridWords[calledIndex];
    const clickedWord = gridWords[idx];

    if (clickedWord.id === targetWord.id) {
      // CORRECT!
      playSoundEffect('correct', soundEnabled);
      const newHits = new Set<number>(hitIndexes);
      newHits.add(idx);

      // Check if this newly hit tile completes a new line
      const oldLines = countBingoLines(hitIndexes);
      const newLines = countBingoLines(newHits);
      if (newLines > oldLines) {
        playSoundEffect('bingo', soundEnabled);
      }

      setHitIndexes(newHits);
      onCorrectHit(clickedWord.id);
    } else {
      // WRONG!
      playSoundEffect('wrong', soundEnabled);
      onWrongHit(clickedWord.id);

      // Add to wrong list if not already included
      if (!wrongWordsList.some((w) => w.id === clickedWord.id)) {
        setWrongWordsList((prev) => [...prev, clickedWord]);
      }
    }
  };

  // Helper to calculate bingo lines
  const countBingoLines = (hits: Set<number>) => {
    let lines = 0;
    // Rows
    for (let r = 0; r < 5; r++) {
      if ([0, 1, 2, 3, 4].every((c) => hits.has(r * 5 + c))) lines++;
    }
    // Cols
    for (let c = 0; c < 5; c++) {
      if ([0, 1, 2, 3, 4].every((r) => hits.has(r * 5 + c))) lines++;
    }
    // Diagonals
    if ([0, 6, 12, 18, 24].every((i) => hits.has(i))) lines++;
    if ([4, 8, 12, 16, 20].every((i) => hits.has(i))) lines++;

    return lines;
  };

  const bingoLines = useMemo(() => countBingoLines(hitIndexes), [hitIndexes]);

  const currentCalledWord = calledIndex !== null ? gridWords[calledIndex] : null;

  // Render tile display text depending on mode
  const getTileText = (item: WordItem) => {
    if (mode === 'word-to-meaning') {
      return item.meaning;
    }
    return item.word;
  };

  // Render call box prompt text depending on mode
  const getCallPromptText = () => {
    if (!currentCalledWord) return 'Bấm nút "Gọi Từ" để bắt đầu ván Bingo!';

    if (mode === 'meaning-to-word') {
      return `Nghĩa: "${currentCalledWord.meaning}"`;
    } else if (mode === 'word-to-meaning') {
      return `Từ: "${currentCalledWord.word}" (/${currentCalledWord.ipa}/)`;
    } else {
      // Example mode
      return `Ví dụ: "${currentCalledWord.example}"`;
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full gap-4">
      {/* Mode Bar */}
      <div className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-2 flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => setMode('meaning-to-word')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            mode === 'meaning-to-word'
              ? 'bg-[#3B82C4] text-white'
              : 'bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#DBEAFE]'
          }`}
        >
          1. [Nghĩa TV → Từ Anh]
        </button>

        <button
          onClick={() => setMode('word-to-meaning')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            mode === 'word-to-meaning'
              ? 'bg-[#3B82C4] text-white'
              : 'bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#DBEAFE]'
          }`}
        >
          2. [Từ Anh → Chọn Nghĩa]
        </button>

        <button
          onClick={() => setMode('example-to-word')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            mode === 'example-to-word'
              ? 'bg-[#3B82C4] text-white'
              : 'bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#DBEAFE]'
          }`}
        >
          3. [Câu Ví Dụ → Từ Thiếu]
        </button>
      </div>

      {/* Control Action Header */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Call button */}
          <button
            onClick={callNextWord}
            className="px-5 py-2.5 rounded-xl bg-[#F59E42] hover:bg-[#e08b33] text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <i className="fa-solid fa-[#F59E42] fa-bullhorn"></i>
            <span>Gọi Từ ({calledHistory.length}/25)</span>
          </button>

          {/* New Game button */}
          <button
            onClick={initBoard}
            className="px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#DBEAFE] text-[#334155] font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <i className="fa-solid fa-rotate-right text-[#3B82C4]"></i>
            <span>Tạo Ván Mới</span>
          </button>
        </div>

        {/* Bingo Counter Badge */}
        <div className="bg-[#F0FDF4] border border-[#4ADE80] text-[#334155] px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
          <i className="fa-solid fa-trophy text-[#4ADE80] text-lg"></i>
          <span>Số hàng Bingo: <strong className="text-[#3B82C4] text-base">{bingoLines}</strong></span>
        </div>
      </div>

      {/* Callout Prompt Box */}
      <div className="w-full bg-gradient-to-r from-[#DBEAFE] to-[#FFEDD5] border-2 border-[#3B82C4]/40 rounded-2xl p-4 text-center shadow-sm relative">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B82C4] block mb-1">
          GỢI Ý TỪ ĐANG GỌI
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#334155]">
          {getCallPromptText()}
        </h3>
        {currentCalledWord && (
          <button
            onClick={() => speakWord(currentCalledWord.word, soundEnabled)}
            className="mt-2 text-xs font-bold text-[#3B82C4] hover:underline inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#3B82C4]/30"
          >
            <i className="fa-solid fa-volume-high"></i>
            <span>Nghe lại âm thanh</span>
          </button>
        )}
      </div>

      {/* 5x5 Grid */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-3 grid grid-cols-5 gap-2">
        {gridWords.map((item, idx) => {
          const isHit = hitIndexes.has(idx);

          let tileStyle =
            'bg-[#FDFBF7] border-[#E2E8F0] text-[#334155] hover:bg-[#DBEAFE] hover:border-[#3B82C4]';

          if (isHit) {
            tileStyle = 'bg-[#F0FDF4] border-[#4ADE80] text-[#334155] border-2 font-bold shadow-inner';
          }

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              disabled={isHit}
              className={`h-20 sm:h-24 p-1.5 rounded-xl border text-xs sm:text-sm font-semibold flex flex-col items-center justify-center text-center transition-all leading-tight ${tileStyle}`}
            >
              <span>{getTileText(item)}</span>
              {isHit && (
                <i className="fa-solid fa-circle-check text-[#4ADE80] text-lg mt-1"></i>
              )}
            </button>
          );
        })}
      </div>

      {/* List of Wrong Words for this round */}
      {wrongWordsList.length > 0 && (
        <div className="w-full bg-[#FEF2F2] border border-[#F87171] rounded-2xl p-4">
          <h4 className="text-xs font-bold text-[#F87171] uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Danh sách từ cần củng cố lại trong ván này ({wrongWordsList.length}):</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {wrongWordsList.map((w) => (
              <span
                key={w.id}
                className="bg-white border border-[#F87171]/40 text-[#334155] text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <span>{w.word}</span>
                <span className="text-[#64748B] font-normal">({w.meaning})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
