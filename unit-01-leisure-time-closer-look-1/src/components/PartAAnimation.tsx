import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ANIMATION_SENTENCES } from '../data/sentences';
import { SentenceItem } from '../types';

interface PartAAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const PartAAnimation: React.FC<PartAAnimationProps> = ({ onComplete, onSkip }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const currentSentence: SentenceItem = ANIMATION_SENTENCES[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Text-To-Speech reader
  const speakSentence = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for students
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Speak sentence automatically on appearance if available
    speakSentence(currentSentence.text);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const DURATION_PER_SENTENCE = 3000; // 3 seconds per sentence

    timerRef.current = setTimeout(() => {
      if (currentIndex < ANIMATION_SENTENCES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Animation finished all 5 sentences
        onComplete();
      }
    }, DURATION_PER_SENTENCE);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, onComplete]);

  const handleNext = () => {
    if (currentIndex < ANIMATION_SENTENCES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[500px] py-6 px-4">
      {/* Top Bar: Progress and Skip */}
      <div className="w-full flex items-center justify-between bg-white border border-[#E2E8F0] shadow-sm rounded-xl px-5 py-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#3382C4] flex items-center justify-[#3382C4] justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h2 className="text-base font-bold text-[#334155] leading-tight">
              Phần A: Quan sát các câu ví dụ
            </h2>
            <p className="text-xs text-[#64748B]">
              Câu {currentIndex + 1} / {ANIMATION_SENTENCES.length}
            </p>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="hidden sm:flex items-center gap-2">
          {ANIMATION_SENTENCES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[#F59E42]'
                  : idx < currentIndex
                  ? 'w-2.5 bg-[#3B82C4]'
                  : 'w-2.5 bg-[#E2E8F0]'
              }`}
              title={`Chuyển đến câu ${idx + 1}`}
            />
          ))}
        </div>

        {/* Skip Animation Button */}
        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#334155] bg-[#FDFBF7] hover:bg-[#E2E8F0] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
        >
          <span>Xem công thức</span>
          <i className="fa-solid fa-forward text-[10px]"></i>
        </button>
      </div>

      {/* Main Animation Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-8 min-h-[340px]">
        {/* Subtle decorative background graphic */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <i className="fa-solid fa-sparkles text-9xl text-[#3B82C4]"></i>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSentence.id}
            initial={{ scale: 1.8, y: 50, opacity: 0 }}
            animate={{
              scale: [1.8, 1.6, 0.95],
              y: [50, 0, -70],
              opacity: [0, 1, 0.05],
            }}
            transition={{
              duration: 2.8,
              times: [0, 0.25, 1],
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col items-center justify-center text-center max-w-2xl px-4 py-6"
          >
            {/* Icon representation */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border"
              style={{
                backgroundColor: `${currentSentence.color}15`,
                borderColor: `${currentSentence.color}40`,
                color: currentSentence.color,
              }}
            >
              <i className={`${currentSentence.icon} text-3xl`}></i>
            </div>

            {/* Sentence Text - Big Font shrinking floating up */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 select-none"
              style={{ color: currentSentence.color }}
            >
              {currentSentence.text}
            </h1>

            {/* Vietnamese Translation */}
            <div className="bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl px-4 py-2 mt-2 shadow-xs">
              <p className="text-sm md:text-base text-[#64748B] italic">
                "{currentSentence.translation}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Audio Speaker Button */}
        <button
          onClick={() => speakSentence(currentSentence.text)}
          className={`absolute bottom-4 right-4 p-3 rounded-full border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
            isPlayingAudio
              ? 'bg-[#FFEDD5] border-[#F59E42] text-[#F59E42] scale-105'
              : 'bg-white border-[#E2E8F0] text-[#3B82C4] hover:bg-[#DBEAFE]'
          }`}
          title="Nghe phát âm chuẩn tiếng Anh"
        >
          <i className={`fa-solid ${isPlayingAudio ? 'fa-volume-high animate-pulse' : 'fa-volume-low'} text-lg`}></i>
        </button>
      </div>

      {/* Playback Controls */}
      <div className="w-full flex items-center justify-between mt-6 px-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#FDFBF7] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span>Câu trước</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#FDFBF7] transition-all shadow-xs cursor-pointer"
          >
            <i className={`fa-solid ${isPaused ? 'fa-play text-[#4ADE80]' : 'fa-pause text-[#F59E42]'} text-sm`}></i>
            <span>{isPaused ? 'Tiếp tục chạy' : 'Tạm dừng'}</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#3B82C4] text-white hover:bg-[#2d6fa8] transition-all shadow-xs cursor-pointer"
        >
          <span>{currentIndex === ANIMATION_SENTENCES.length - 1 ? 'Xem công thức' : 'Câu tiếp'}</span>
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};
