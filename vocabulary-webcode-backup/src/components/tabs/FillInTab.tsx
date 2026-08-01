import React, { useState, useEffect } from 'react';
import { WordItem } from '../../data/vocabularyData';
import { speakWord, playSoundEffect } from '../../utils/speech';

interface FillInTabProps {
  currentWord: WordItem;
  soundEnabled: boolean;
  onCorrect: (wordId: number) => void;
  onWrong: (wordId: number) => void;
  onNext: () => void;
}

export const FillInTab: React.FC<FillInTabProps> = ({
  currentWord,
  soundEnabled,
  onCorrect,
  onWrong,
  onNext,
}) => {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrectResult, setIsCorrectResult] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrectResult(null);
    setShowHint(false);
  }, [currentWord]);

  // Create sentence with blank
  // We need to match currentWord.word or variants in example sentence case-insensitively
  const renderSentenceWithBlank = () => {
    const word = currentWord.word;
    const example = currentWord.example;

    // Build regex to catch word or base form
    // Handles multi-word phrases, e.g. "look for", "looking for"
    // If simple replace doesn't find exact word, check for key stemmed or phrase match
    const regex = new RegExp(word.replace(/[-[\]{}()*+?~=><!?:^\${}()|[\\]/g, '\\$&'), 'gi');

    if (regex.test(example)) {
      return example.replace(regex, '______');
    }

    // Fallback: search for first word if phrase has verb forms (e.g. "looking for" vs "look for")
    const words = word.split(' ');
    if (words.length > 0) {
      const firstWordBase = words[0];
      const flexibleRegex = new RegExp(`\\b${firstWordBase}\\w*\\b(.*)`, 'gi');
      if (flexibleRegex.test(example)) {
        return example.replace(flexibleRegex, '______ $1');
      }
    }

    return example + ' (______)';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted || !userInput.trim()) return;

    // Normalize comparison: remove extra spaces, case insensitive
    const cleanUser = userInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanWord = currentWord.word.trim().toLowerCase().replace(/\s+/g, ' ');

    // Also accept matching if user entered word with equal signs stripped, e.g., "free time = leisure time" -> "free time" or "leisure time"
    const targetVariants = cleanWord.split('=').map((v) => v.trim());

    const isMatch = targetVariants.some(
      (variant) =>
        cleanUser === variant ||
        cleanUser === variant.replace(/^(to|be)\s+/, '') // ignore leading "to " or "be "
    );

    setIsSubmitted(true);
    setIsCorrectResult(isMatch);

    if (isMatch) {
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
      {/* Exercise Card */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82C4] bg-[#DBEAFE] px-3 py-1 rounded-full inline-block mb-2">
            Điền từ Tiếng Anh thích hợp vào ô trống
          </span>
          <p className="text-sm text-[#64748B]">
            Nghĩa gợi ý: <span className="font-bold text-[#3B82C4]">"{currentWord.meaning}"</span>
          </p>
        </div>

        {/* Sentence Container */}
        <div className="bg-[#FDFBF7] border border-[#E2E8F0] p-4 rounded-xl text-center mb-5">
          <p className="text-lg font-medium text-[#334155] leading-relaxed">
            "{renderSentenceWithBlank()}"
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <div className="w-full relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isSubmitted}
              placeholder="Nhập từ Tiếng Anh còn thiếu..."
              className={`w-full p-3.5 rounded-xl border text-base font-semibold focus:outline-none transition-colors ${
                isSubmitted
                  ? isCorrectResult
                    ? 'border-[#4ADE80] bg-[#F0FDF4] text-[#334155]'
                    : 'border-[#F87171] bg-[#FEF2F2] text-[#334155]'
                  : 'border-[#E2E8F0] bg-white focus:border-[#3B82C4]'
              }`}
              autoFocus
            />
          </div>

          {/* Buttons Row */}
          {!isSubmitted ? (
            <div className="flex items-center gap-2 w-full justify-between">
              {/* Hint Button */}
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#334155] hover:bg-[#DBEAFE] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <i className="fa-solid fa-lightbulb text-[#F59E42]"></i>
                <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
              </button>

              {/* Submit Check Button */}
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#F59E42] hover:bg-[#e08b33] disabled:opacity-50 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
              >
                <i className="fa-solid fa-circle-check"></i>
                <span>Kiểm tra</span>
              </button>
            </div>
          ) : null}
        </form>

        {/* Hint Display */}
        {showHint && !isSubmitted && (
          <div className="mt-3 p-3 bg-[#FFEDD5]/40 border border-[#F59E42]/30 rounded-xl text-xs text-[#334155] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#F59E42]">Gợi ý:</span> Phát âm /{currentWord.ipa}/ ({currentWord.type}) - Độ dài: {currentWord.word.length} ký tự
            </div>
            <button onClick={handleSpeak} className="text-[#3B82C4] font-bold text-xs underline ml-2">
              Nghe
            </button>
          </div>
        )}
      </div>

      {/* Answer Feedback & Next Action */}
      {isSubmitted && (
        <div className="w-full flex flex-col items-center gap-3">
          {isCorrectResult ? (
            <div className="w-full text-[#4ADE80] font-bold text-sm flex items-center gap-2 bg-[#F0FDF4] border border-[#4ADE80] p-3 rounded-xl justify-center">
              <i className="fa-solid fa-circle-check text-xl"></i>
              <span>Xuất sắc! Đáp án chính xác (+10 điểm).</span>
            </div>
          ) : (
            <div className="w-full text-[#F87171] font-bold text-sm flex flex-col items-center gap-1 bg-[#FEF2F2] border border-[#F87171] p-3 rounded-xl text-center">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-xmark text-xl"></i>
                <span>Chưa chính xác!</span>
              </div>
              <p className="text-xs text-[#334155] font-normal">
                Từ đúng là: <strong className="text-[#F87171] text-sm">{currentWord.word}</strong> (/{currentWord.ipa}/)
              </p>
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
