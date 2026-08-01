import React, { useState, useEffect } from 'react';
import { WordItem } from '../../data/vocabularyData';
import { speakWord, playSoundEffect } from '../../utils/speech';

interface QuizTabProps {
  currentWord: WordItem;
  allWords: WordItem[];
  filteredWords: WordItem[];
  soundEnabled: boolean;
  onCorrect: (wordId: number) => void;
  onWrong: (wordId: number) => void;
  onNext: () => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  currentWord,
  allWords,
  filteredWords,
  soundEnabled,
  onCorrect,
  onWrong,
  onNext,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 4 options whenever currentWord changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);

    // 1. Correct meaning
    const correctMeaning = currentWord.meaning;

    // 2. Other meanings from same section
    const sameSectionOtherWords = filteredWords.filter(
      (w) => w.id !== currentWord.id && w.meaning !== correctMeaning
    );

    let distractors: string[] = [];

    // Shuffle same section distractors
    const shuffledSameSection = [...sameSectionOtherWords].sort(() => Math.random() - 0.5);

    distractors = shuffledSameSection.slice(0, 3).map((w) => w.meaning);

    // If less than 3, pick from remaining allWords
    if (distractors.length < 3) {
      const remainingAll = allWords.filter(
        (w) =>
          w.id !== currentWord.id &&
          w.meaning !== correctMeaning &&
          !distractors.includes(w.meaning)
      );
      const shuffledAll = [...remainingAll].sort(() => Math.random() - 0.5);
      const needed = 3 - distractors.length;
      distractors.push(...shuffledAll.slice(0, needed).map((w) => w.meaning));
    }

    // Combine and shuffle
    const fourOptions = [correctMeaning, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(fourOptions);
  }, [currentWord, filteredWords, allWords]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentWord.meaning) {
      playSoundEffect('correct', soundEnabled);
      onCorrect(currentWord.id);
    } else {
      playSoundEffect('wrong', soundEnabled);
      onWrong(currentWord.id);
    }
  };

  const handleSpeak = () => {
    speakWord(currentWord.word, soundEnabled);
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full gap-5">
      {/* Question Card */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3B82C4] bg-[#DBEAFE] px-3 py-1 rounded-full inline-block mb-3">
          Chọn nghĩa tiếng Việt đúng
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#334155] mb-1">
          {currentWord.word}
        </h2>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[#64748B] text-base font-medium">/{currentWord.ipa}/</span>
          <span className="text-xs bg-[#FDFBF7] border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded font-bold">
            {currentWord.type}
          </span>
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white transition-colors text-sm"
            title="Nghe âm thanh"
          >
            <i className="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isCorrect = option === currentWord.meaning;
          const isSelected = selectedOption === option;

          let btnClass =
            'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#DBEAFE] hover:border-[#3B82C4]';

          if (isAnswered) {
            if (isCorrect) {
              btnClass = 'bg-[#F0FDF4] border-[#4ADE80] text-[#334155] border-2 font-bold shadow-sm';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-[#FEF2F2] border-[#F87171] text-[#334155] border-2 font-bold';
            } else {
              btnClass = 'bg-white border-[#E2E8F0] text-[#64748B] opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 ${btnClass}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  isAnswered && isCorrect
                    ? 'bg-[#4ADE80] text-white'
                    : isAnswered && isSelected && !isCorrect
                    ? 'bg-[#F87171] text-white'
                    : 'bg-[#DBEAFE] text-[#3B82C4]'
                }`}
              >
                {letter}
              </span>
              <span className="text-sm font-semibold pt-0.5 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Next Action */}
      {isAnswered && (
        <div className="w-full flex flex-col items-center gap-3 mt-2">
          {selectedOption === currentWord.meaning ? (
            <div className="text-[#4ADE80] font-bold text-sm flex items-center gap-2 bg-[#F0FDF4] border border-[#4ADE80] px-4 py-2 rounded-xl">
              <i className="fa-solid fa-circle-check text-lg"></i>
              <span>Chính xác! Bạn được +10 điểm.</span>
            </div>
          ) : (
            <div className="text-[#F87171] font-bold text-sm flex items-center gap-2 bg-[#FEF2F2] border border-[#F87171] px-4 py-2 rounded-xl text-center">
              <i className="fa-solid fa-circle-xmark text-lg"></i>
              <span>Chưa đúng! Đáp án đúng là: "{currentWord.meaning}"</span>
            </div>
          )}

          <button
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#F59E42] hover:bg-[#e08b33] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>Tiếp tục</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};
