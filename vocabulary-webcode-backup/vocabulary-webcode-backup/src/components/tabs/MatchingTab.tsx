import React, { useState, useEffect } from 'react';
import { WordItem } from '../../data/vocabularyData';
import { speakWord, playSoundEffect } from '../../utils/speech';

interface MatchingTabProps {
  filteredWords: WordItem[];
  allWords: WordItem[];
  soundEnabled: boolean;
  onCorrectMatch: (wordId: number) => void;
  onWrongMatch: (wordId: number) => void;
}

interface CardItem {
  id: number; // word.id
  text: string;
  type: 'word' | 'meaning';
}

export const MatchingTab: React.FC<MatchingTabProps> = ({
  filteredWords,
  allWords,
  soundEnabled,
  onCorrectMatch,
  onWrongMatch,
}) => {
  const [leftCards, setLeftCards] = useState<CardItem[]>([]);
  const [rightCards, setRightCards] = useState<CardItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ leftId: number; rightId: number } | null>(null);

  // Initialize pairs
  const setupGame = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setWrongPair(null);

    // Pick 2-8 words from filteredWords, prioritizing 5 if enough words exist
    const pool = filteredWords.length >= 2 ? filteredWords : allWords;
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const count = Math.min(Math.max(shuffledPool.length, 2), 5);
    const chosenWords = shuffledPool.slice(0, count);

    // Left cards: word
    const lefts: CardItem[] = chosenWords.map((w) => ({
      id: w.id,
      text: w.word,
      type: 'word' as const,
    }));

    // Right cards: meaning (shuffled independently)
    const rights: CardItem[] = chosenWords
      .map((w) => ({
        id: w.id,
        text: w.meaning,
        type: 'meaning' as const,
      }))
      .sort(() => Math.random() - 0.5);

    setLeftCards(lefts);
    setRightCards(rights);
  };

  useEffect(() => {
    setupGame();
  }, [filteredWords]);

  // Handle Left click
  const handleLeftClick = (id: number, text: string) => {
    if (matchedIds.has(id)) return;
    speakWord(text, soundEnabled);
    setSelectedLeft(id);
    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  // Handle Right click
  const handleRightClick = (id: number) => {
    if (matchedIds.has(id)) return;
    setSelectedRight(id);
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, id);
    }
  };

  // Check match
  const checkMatch = (leftId: number, rightId: number) => {
    if (leftId === rightId) {
      // MATCH!
      playSoundEffect('correct', soundEnabled);
      const newMatched = new Set(matchedIds);
      newMatched.add(leftId);
      setMatchedIds(newMatched);

      onCorrectMatch(leftId);

      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // MISMATCH
      playSoundEffect('wrong', soundEnabled);
      setWrongPair({ leftId, rightId });
      onWrongMatch(leftId);

      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  };

  const isAllMatched = leftCards.length > 0 && matchedIds.size === leftCards.length;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full gap-5">
      {/* Header Info */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#334155]">
            Nối Từ Tiếng Anh với Nghĩa Tiếng Việt
          </h2>
          <p className="text-xs text-[#64748B]">
            Bấm 1 từ ở cột trái, sau đó bấm nghĩa tương ứng ở cột phải
          </p>
        </div>
        <button
          onClick={setupGame}
          className="px-3.5 py-2 rounded-xl bg-[#DBEAFE] hover:bg-[#3B82C4] hover:text-white text-[#3B82C4] font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <i className="fa-solid fa-rotate text-xs"></i>
          <span>Ván mới</span>
        </button>
      </div>

      {/* Columns Grid */}
      <div className="w-full grid grid-cols-2 gap-4">
        {/* Left Column (English Words) */}
        <div className="flex flex-col gap-2.5">
          <div className="text-center font-bold text-xs uppercase tracking-wider text-[#3B82C4] bg-[#DBEAFE] py-1.5 rounded-lg border border-[#3B82C4]/20">
            Cột Từ Tiếng Anh
          </div>
          {leftCards.map((card) => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedLeft === card.id;
            const isWrong = wrongPair?.leftId === card.id;

            let cardStyle =
              'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#DBEAFE] hover:border-[#3B82C4]';

            if (isMatched) {
              cardStyle = 'bg-[#F0FDF4] border-[#4ADE80] text-[#334155] border-2 font-bold cursor-default';
            } else if (isWrong) {
              cardStyle = 'bg-[#FEF2F2] border-[#F87171] text-[#F87171] border-2 font-bold animate-shake';
            } else if (isSelected) {
              cardStyle = 'bg-[#3B82C4] text-white border-[#3B82C4] font-bold shadow-md scale-[1.02]';
            }

            return (
              <button
                key={card.id}
                onClick={() => handleLeftClick(card.id, card.text)}
                disabled={isMatched}
                className={`p-3.5 rounded-xl border text-sm font-semibold text-center transition-all flex items-center justify-between ${cardStyle}`}
              >
                <span className="flex-1 text-left">{card.text}</span>
                {isMatched ? (
                  <i className="fa-solid fa-check text-[#4ADE80] text-base ml-2"></i>
                ) : (
                  <i className="fa-solid fa-volume-high text-xs opacity-40"></i>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column (Vietnamese Meanings) */}
        <div className="flex flex-col gap-2.5">
          <div className="text-center font-bold text-xs uppercase tracking-wider text-[#F59E42] bg-[#FFEDD5] py-1.5 rounded-lg border border-[#F59E42]/20">
            Cột Nghĩa Tiếng Việt
          </div>
          {rightCards.map((card, idx) => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedRight === card.id;
            const isWrong = wrongPair?.rightId === card.id;

            let cardStyle =
              'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#FFEDD5] hover:border-[#F59E42]';

            if (isMatched) {
              cardStyle = 'bg-[#F0FDF4] border-[#4ADE80] text-[#334155] border-2 font-bold cursor-default';
            } else if (isWrong) {
              cardStyle = 'bg-[#FEF2F2] border-[#F87171] text-[#F87171] border-2 font-bold animate-shake';
            } else if (isSelected) {
              cardStyle = 'bg-[#F59E42] text-white border-[#F59E42] font-bold shadow-md scale-[1.02]';
            }

            return (
              <button
                key={`${card.id}-${idx}`}
                onClick={() => handleRightClick(card.id)}
                disabled={isMatched}
                className={`p-3.5 rounded-xl border text-sm font-semibold text-center transition-all flex items-center justify-between ${cardStyle}`}
              >
                <span className="flex-1 text-left">{card.text}</span>
                {isMatched && <i className="fa-solid fa-check text-[#4ADE80] text-base ml-2"></i>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Banner */}
      {isAllMatched && (
        <div className="w-full bg-[#F0FDF4] border-2 border-[#4ADE80] rounded-2xl p-5 text-center flex flex-col items-center gap-3">
          <i className="fa-solid fa-award text-4xl text-[#4ADE80]"></i>
          <h3 className="text-xl font-bold text-[#334155]">
            Chúc mừng! Bạn đã hoàn thành nối tất cả các từ!
          </h3>
          <p className="text-sm text-[#64748B]">Bạn nhận được +{leftCards.length * 10} điểm.</p>
          <button
            onClick={setupGame}
            className="px-6 py-2.5 rounded-xl bg-[#F59E42] hover:bg-[#e08b33] text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <i className="fa-solid fa-play"></i>
            <span>Chơi ván mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
