import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { AudioSpeakerCard } from './components/AudioSpeakerCard';
import { DictationTextareaCard } from './components/DictationTextareaCard';
import { SubmissionModal } from './components/SubmissionModal';
import { DictationTips } from './components/DictationTips';
import { VideoSection } from './components/VideoSection';
import { InteractiveMapSection } from './components/InteractiveMapSection';
import { DictationAudioEngine } from './utils/audioHelper';

export default function App() {
  // Step navigation state: 1 = Dictation, 2 = Video, 3 = Interactive Map
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [audioSourceType, setAudioSourceType] = useState<'file' | 'speech' | 'none'>('file');
  const [customFileName, setCustomFileName] = useState<string>('');

  // Textarea dictation state
  const [userText, setUserText] = useState<string>('');
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Modal submission state
  const [showModal, setShowModal] = useState<boolean>(false);

  // Audio Engine instance reference
  const audioEngineRef = useRef<DictationAudioEngine | null>(null);

  // Initialize Audio Engine
  useEffect(() => {
    audioEngineRef.current = new DictationAudioEngine();

    audioEngineRef.current.setCallbacks(
      (time, dur) => {
        setCurrentTime(time);
        if (dur > 0) setDuration(dur);
      },
      () => {
        setIsPlaying(false);
      },
      (err) => {
        console.warn('Audio notice:', err);
        setIsPlaying(false);
      }
    );

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  // Timer effect for time spent on exercise
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Handle speaker click: "Phát audio từ đầu, nghe lại không giới hạn"
  const handleSpeakerClick = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    if (audioEngineRef.current) {
      setIsPlaying(true);
      audioEngineRef.current.playFromStart(playbackRate, () => {
        setIsPlaying(true);
      });
    }
  };

  // Handle Rewind 5 seconds
  const handleRewind = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.rewind(5);
    }
  };

  // Handle Speed Change
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioEngineRef.current) {
      audioEngineRef.current.setRate(rate);
    }
  };

  // Handle text change
  const handleTextChange = (newText: string) => {
    setUserText(newText);
    if (!isTimerRunning && newText.length > 0) {
      setIsTimerRunning(true);
    }
  };

  // Handle custom file upload
  const handleFileUpload = (file: File) => {
    setCustomFileName(file.name);
    if (audioEngineRef.current) {
      audioEngineRef.current.loadCustomAudioFile(file);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Handle Submission: Shows modal with "Đã ghi nhận bài làm của bạn"
  const handleSubmit = () => {
    setIsTimerRunning(false);
    if (audioEngineRef.current) {
      audioEngineRef.current.pause();
    }
    setIsPlaying(false);
    setShowModal(true);
  };

  // Handle Reset: Clear textarea content
  const handleReset = () => {
    setUserText('');
    setTimeSpentSeconds(0);
    setIsTimerRunning(false);
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Change step with audio cleanup
  const goToStep = (step: number) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* App Header */}
      <Header topicName="Communication" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Progress Step Bar */}
        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
          <button
            onClick={() => goToStep(1)}
            className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-[#FDFBF7]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            <span>Chép chính tả</span>
          </button>

          <div className="text-[#CBD5E1] text-xs">→</div>

          <button
            onClick={() => goToStep(2)}
            className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-[#F59E42] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-[#FDFBF7]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            <span>Xem Video tình huống</span>
          </button>

          <div className="text-[#CBD5E1] text-xs">→</div>

          <button
            onClick={() => goToStep(3)}
            className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#334155] hover:bg-[#FDFBF7]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
            <span>Bản đồ tương tác</span>
          </button>
        </div>

        {/* STEP 1: DICTATION SCREEN */}
        {currentStep === 1 && (
          <>
            {/* Student Tips & Instructions */}
            <DictationTips />

            {/* 2-Column Split Screen Layout (BỐ CỤC 2 NỬA THEO CHIỀU NGANG) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch flex-1">
              {/* NỬA TRÁI: 1 biểu tượng loa lớn, nền #DBEAFE */}
              <AudioSpeakerCard
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                playbackRate={playbackRate}
                audioSourceType={audioSourceType}
                customFileName={customFileName}
                onSpeakerClick={handleSpeakerClick}
                onRewind={handleRewind}
                onRateChange={handleRateChange}
                onFileUpload={handleFileUpload}
              />

              {/* NỬA PHẢI: 1 khung textarea nhiều dòng để chép chính tả */}
              <DictationTextareaCard
                text={userText}
                onChangeText={handleTextChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                timeSpentSeconds={timeSpentSeconds}
                onNextToVideo={() => goToStep(2)}
              />
            </div>
          </>
        )}

        {/* STEP 2: VIDEO SCREEN */}
        {currentStep === 2 && (
          <VideoSection
            onNextStep={() => goToStep(3)}
            onPrevStep={() => goToStep(1)}
          />
        )}

        {/* STEP 3: INTERACTIVE MAP SCREEN */}
        {currentStep === 3 && (
          <InteractiveMapSection
            onPrevStep={() => goToStep(2)}
            onRestartAll={() => goToStep(1)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#64748B] border-t border-[#E2E8F0] bg-white mt-8">
        <p>© Luyện nghe chép chính tả Tiếng Anh • Dành cho học sinh Cấp 2 (Lớp 6 - Lớp 9)</p>
      </footer>

      {/* Submission Success Modal */}
      <SubmissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRestart={handleReset}
        userText={userText}
        timeSpentSeconds={timeSpentSeconds}
        onNextToVideo={() => goToStep(2)}
      />
    </div>
  );
}
