import React, { useState, useEffect, useRef } from 'react';
import { DialogueLine } from '../types';

interface TranscriptBoxProps {
  dialogue: DialogueLine[];
  selectedRole: 'Trang' | 'Tom' | null;
  activeLineIndex: number | null;
  onSelectLine: (index: number) => void;
  onSelectRole?: (role: 'Trang' | 'Tom' | null) => void;
  isLoading: boolean;
  error: string | null;
}

export const TranscriptBox: React.FC<TranscriptBoxProps> = ({
  dialogue,
  selectedRole,
  activeLineIndex,
  onSelectLine,
  onSelectRole,
  isLoading,
  error,
}) => {
  const [speakerFilter, setSpeakerFilter] = useState<'All' | 'Trang' | 'Tom'>('All');
  const [maskSelectedRole, setMaskSelectedRole] = useState<boolean>(false);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [userTurnIndex, setUserTurnIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [isDialogueCompleted, setIsDialogueCompleted] = useState<boolean>(false);

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const prevRoleRef = useRef<'Trang' | 'Tom' | null>(null);
  const hasUserSpokenRef = useRef<boolean>(false);

  // Auto-start roleplay step 0 when a new role is selected
  useEffect(() => {
    if (selectedRole && selectedRole !== prevRoleRef.current && dialogue.length > 0) {
      prevRoleRef.current = selectedRole;
      setTimeout(() => {
        executeRoleplayStep(0);
      }, 200);
    } else if (!selectedRole) {
      prevRoleRef.current = null;
    }
  }, [selectedRole, dialogue]);

  // Scroll active, playing, or user turn line into view smoothly
  useEffect(() => {
    const targetIdx = playingIndex !== null ? playingIndex : userTurnIndex !== null ? userTurnIndex : activeLineIndex;
    if (targetIdx !== null && lineRefs.current[targetIdx]) {
      lineRefs.current[targetIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineIndex, playingIndex, userTurnIndex]);

  // Clean up timers, speech & recognition on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
    };
  }, []);

  // Speech recognition handler when it's the student's turn to speak
  useEffect(() => {
    if (userTurnIndex !== null && selectedRole) {
      hasUserSpokenRef.current = false;
      setUserSpokenText('');
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          recognition.continuous = true;
          recognition.interimResults = true;

          setIsListening(true);
          setSpeechTranscript('Đang lắng nghe... Hãy nói câu thoại của bạn!');

          recognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript + ' ';
            }
            const trimmed = fullText.trim();
            setSpeechTranscript(trimmed);
            setUserSpokenText(trimmed);

            if (trimmed.length > 0) {
              hasUserSpokenRef.current = true;
            }

            // RESET silence timer: Every time a new audio result arrives, reset the 1.5-second timer!
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }

            silenceTimerRef.current = setTimeout(() => {
              // 1.5s passed with no new audio results -> Student stopped speaking!
              silenceTimerRef.current = null;
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {}
              }
              setIsListening(false);
              handleUserTurnCompleted();
            }, 1500);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.onerror = (err: any) => {
            console.warn('Speech recognition notice:', err);
            setIsListening(false);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (err) {
          console.warn('Speech recognition start failed:', err);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    } else {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setSpeechTranscript('');
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, [userTurnIndex, selectedRole]);

  // Stop any currently playing audio, recognition, and timers
  const stopAudioPlayback = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAll(false);
    setPlayingIndex(null);
    setUserTurnIndex(null);
    setIsListening(false);
    setSpeechTranscript('');
    hasUserSpokenRef.current = false;
  };

  // Helper to play single line via Web Speech API (en-US)
  const speakLine = (index: number, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ đọc âm thanh Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingIndex(index);
    setUserTurnIndex(null);
    onSelectLine(index);

    const line = dialogue[index];
    if (!line) return;

    // Speak dialogue text in English (en-US) without "Tom said", "Trang said"
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'en-US';
    utterance.rate = playbackRate;

    if (line.speaker === 'Trang') {
      utterance.pitch = 1.2;
    } else {
      utterance.pitch = 0.95;
    }

    utterance.onend = () => {
      if (onEnd) {
        onEnd();
      } else {
        setPlayingIndex(null);
      }
    };

    utterance.onerror = () => {
      if (onEnd) {
        onEnd();
      } else {
        setPlayingIndex(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play single line on user click
  const handlePlaySingleLine = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    stopAudioPlayback();
    speakLine(index);
  };

  // Roleplay step processor: Computer speaks EXACTLY 1 line if computer's turn, then pauses & waits for student!
  const executeRoleplayStep = (stepIdx: number) => {
    stopAudioPlayback();
    setIsDialogueCompleted(false);
    if (dialogue.length === 0) return;

    if (stepIdx >= dialogue.length) {
      setIsPlayingAll(false);
      setPlayingIndex(null);
      setUserTurnIndex(null);
      setIsDialogueCompleted(true);
      return;
    }

    setIsPlayingAll(true);
    const line = dialogue[stepIdx];

    // If it is the student's turn:
    if (selectedRole && line.speaker === selectedRole) {
      setPlayingIndex(null);
      setUserTurnIndex(stepIdx);
      setUserSpokenText('');
      onSelectLine(stepIdx);
      // Computer STOPS and WAITS for student!
      return;
    }

    // Otherwise it is the computer's turn:
    setUserTurnIndex(null);
    setUserSpokenText('');
    speakLine(stepIdx, () => {
      // Computer finished speaking its 1 line!
      setPlayingIndex(null);
      const nextIdx = stepIdx + 1;
      if (nextIdx < dialogue.length) {
        const nextLine = dialogue[nextIdx];
        if (selectedRole && nextLine.speaker === selectedRole) {
          // Immediately set next line as student's turn and STOP!
          setUserTurnIndex(nextIdx);
          setUserSpokenText('');
          onSelectLine(nextIdx);
        } else {
          // If next line is also computer's line, continue after 1s pause
          pauseTimerRef.current = setTimeout(() => {
            executeRoleplayStep(nextIdx);
          }, 1000);
        }
      } else {
        // End of dialogue
        setIsPlayingAll(false);
        setIsDialogueCompleted(true);
      }
    });
  };

  // Student advances turn after speaking
  const handleUserTurnCompleted = () => {
    stopAudioPlayback();
    const currentIdx = userTurnIndex !== null ? userTurnIndex : activeLineIndex !== null ? activeLineIndex : 0;
    const nextIdx = currentIdx + 1;
    if (nextIdx >= dialogue.length) {
      setIsPlayingAll(false);
      setPlayingIndex(null);
      setUserTurnIndex(null);
      setIsDialogueCompleted(true);
    } else {
      executeRoleplayStep(nextIdx);
    }
  };

  // Start / Stop full sequence
  const startSequenceFrom = (startIndex: number) => {
    setIsDialogueCompleted(false);
    executeRoleplayStep(startIndex);
  };

  // Full audio / Roleplay toggle button handler
  const handlePlayFullAudio = () => {
    if (isPlayingAll || userTurnIndex !== null) {
      stopAudioPlayback();
      return;
    }

    setIsDialogueCompleted(false);
    executeRoleplayStep(0);
  };

  // Continue to next line after student turn
  const handleContinueNextLine = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    handleUserTurnCompleted();
  };

  const filteredDialogue = dialogue.filter((line) => {
    if (speakerFilter === 'All') return true;
    return line.speaker === speakerFilter;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Main Transcript Container */}
      <div id="transcript-container" className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Box Header */}
        <div className="p-4 md:p-5 border-b border-[#E2E8F0] bg-[#DBEAFE]/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="text-[#3B82C4]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <h2 className="text-[#3B82C4] font-bold text-lg uppercase tracking-wide flex items-center gap-2">
              TRANSCRIPT
            </h2>
          </div>

          {/* Toolbar controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-bold text-[#64748B] shadow-2xs">
              {dialogue.length} Dòng Hội Thoại
            </span>

            {/* Speaker Filter */}
            <div className="inline-flex bg-white border border-[#E2E8F0] p-0.5 rounded-lg text-xs font-bold shadow-2xs">
              <button
                id="filter-all"
                onClick={() => setSpeakerFilter('All')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  speakerFilter === 'All'
                    ? 'bg-[#334155] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                TẤT CẢ
              </button>
              <button
                id="filter-trang"
                onClick={() => setSpeakerFilter('Trang')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  speakerFilter === 'Trang'
                    ? 'bg-[#3B82C4] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                TRANG
              </button>
              <button
                id="filter-tom"
                onClick={() => setSpeakerFilter('Tom')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  speakerFilter === 'Tom'
                    ? 'bg-[#F59E42] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#334155]'
                }`}
              >
                TOM
              </button>
            </div>

            {/* Backup Start Practice Button */}
            <button
              id="btn-start-roleplay-header"
              onClick={() => startSequenceFrom(0)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer uppercase bg-[#3B82C4] text-white hover:bg-[#3B82C4]/90 border border-[#3B82C4]"
              title="Bấm nút này để bắt đầu chạy hội thoại luyện nói"
            >
              <i className="fa-solid fa-circle-play text-sm"></i>
              <span>BẮT ĐẦU LUYỆN NÓI</span>
            </button>

            {/* Header Audio Play / Stop Button */}
            <button
              id="btn-play-all"
              onClick={handlePlayFullAudio}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer uppercase ${
                isPlayingAll || userTurnIndex !== null
                  ? 'bg-[#F87171] text-white hover:bg-[#F87171]/90 shadow-xs'
                  : 'bg-[#F59E42] text-white hover:bg-[#F59E42]/90'
              }`}
              title={isPlayingAll ? 'Bấm để dừng đọc' : 'Bấm để phát bài hội thoại'}
            >
              <i className={`fa-solid ${isPlayingAll || userTurnIndex !== null ? 'fa-square' : 'fa-play'}`}></i>
              <span>{isPlayingAll || userTurnIndex !== null ? 'Dừng Đọc' : 'Phát Toàn Bộ'}</span>
            </button>
          </div>
        </div>

        {/* Roleplay Status Bar */}
        {selectedRole && (
          <div className="bg-[#DBEAFE]/70 border-b border-[#3B82C4]/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#1E3A8A] font-medium">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user-check text-[#3B82C4] text-sm"></i>
              <span>
                Bạn đang đóng vai <strong className="text-[#3B82C4] uppercase text-sm font-extrabold">{selectedRole}</strong> (Máy tự đọc lời thoại của {selectedRole === 'Trang' ? 'Tom' : 'Trang'})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-start-roleplay-subbar"
                onClick={() => startSequenceFrom(0)}
                className="px-2.5 py-1 bg-[#3B82C4] hover:bg-[#3B82C4]/90 text-white rounded-md text-[11px] font-bold uppercase tracking-wide cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <i className="fa-solid fa-play text-[10px]"></i>
                <span>Bắt Đầu Ngay</span>
              </button>

              <label className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0">
                <input
                  id="chk-mask-role"
                  type="checkbox"
                  checked={maskSelectedRole}
                  onChange={(e) => setMaskSelectedRole(e.target.checked)}
                  className="rounded text-[#3B82C4] focus:ring-[#3B82C4] w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-bold text-[#334155]">Che lời thoại vai bạn</span>
              </label>
            </div>
          </div>
        )}

        {/* Student Turn Waiting Notification Banner with Speech Recognition Indicator */}
        {userTurnIndex !== null && selectedRole && (
          <div className="bg-[#FFEDD5] border-b-2 border-[#F59E42] p-3.5 px-4 text-xs md:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-[#B45309] font-bold shadow-xs">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${isListening ? 'bg-[#F59E42] animate-bounce shadow-md' : 'bg-[#F59E42]'}`}>
                <i className={`fa-solid ${isListening ? 'fa-microphone text-base' : 'fa-circle-play text-base'}`}></i>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-sm text-[#7C2D12] uppercase tracking-wide flex items-center gap-2 flex-wrap">
                  <span>ĐẾN LƯỢT BẠN NÓI! (Lời thoại của {selectedRole})</span>
                  {isListening && (
                    <span className="text-[10px] bg-[#F59E42] text-white font-bold px-2 py-0.5 rounded-full animate-pulse shadow-2xs">
                      Đang lắng nghe mic...
                    </span>
                  )}
                </p>
                <p className="text-[#92400E] font-medium text-xs mt-1 bg-white/60 p-1.5 rounded border border-[#F59E42]/30">
                  {userSpokenText ? (
                    <span>
                      <strong className="text-[#B45309] font-bold">Bạn vừa nói:</strong> "{userSpokenText}"
                    </span>
                  ) : (
                    <span>
                      {isListening
                        ? 'Đang lắng nghe... Hãy đọc câu thoại của bạn!'
                        : 'Không nhận diện được giọng nói, nhưng bạn vẫn có thể tiếp tục.'}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              id="btn-confirm-spoken-banner"
              onClick={handleContinueNextLine}
              className="w-full sm:w-auto bg-[#F59E42] hover:bg-[#E08C32] text-white px-5 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider cursor-pointer shadow-md border-2 border-[#D97706] transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-95"
            >
              <i className="fa-solid fa-circle-check text-base"></i>
              <span>✓ Tôi đã nói xong, tiếp tục</span>
            </button>
          </div>
        )}

        {/* Transcript Scrollable Content Container */}
        <div id="transcript-scroll-area" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-white to-[#FDFBF7]/40">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 text-[#64748B]">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-[#3B82C4] mb-2"></i>
              <p className="text-sm font-bold uppercase tracking-wider">Đang tải transcript.json...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-[#FEF2F2] border-2 border-[#F87171] rounded-xl text-[#B91C1C] text-sm flex items-center gap-2 font-bold">
              <i className="fa-solid fa-triangle-exclamation text-base"></i>
              <span>Lỗi tải dữ liệu: {error}</span>
            </div>
          )}

          {!isLoading && !error && filteredDialogue.length === 0 && (
            <div className="text-center py-12 text-[#64748B] text-sm font-bold italic">
              Không có câu thoại nào phù hợp.
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredDialogue.map((item) => {
              const realIndex = dialogue.findIndex((d) => d === item);
              const isTom = item.speaker === 'Tom';
              const isTrang = item.speaker === 'Trang';
              const isSelectedUserRole = selectedRole === item.speaker;
              const isCurrentActive = activeLineIndex === realIndex;
              const isCurrentSpeaking = playingIndex === realIndex;
              const isStudentTurn = userTurnIndex === realIndex;

              return (
                <div
                  key={realIndex}
                  ref={(el) => (lineRefs.current[realIndex] = el)}
                  onClick={() => onSelectLine(realIndex)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isCurrentSpeaking
                      ? 'bg-[#DBEAFE] border-2 border-[#3B82C4] shadow-md ring-4 ring-[#3B82C4]/20 scale-[1.01]'
                      : isStudentTurn
                      ? 'bg-[#FFEDD5] border-2 border-[#F59E42] shadow-md ring-4 ring-[#F59E42]/20 scale-[1.01]'
                      : isCurrentActive
                      ? 'bg-[#F0FDF4] border-l-4 border-l-[#4ADE80] border-[#E2E8F0] shadow-md'
                      : isSelectedUserRole
                      ? 'bg-white border-2 border-[#3B82C4]/40 hover:border-[#3B82C4] shadow-2xs'
                      : 'bg-white border border-[#E2E8F0] hover:border-[#3B82C4]/60 shadow-2xs'
                  }`}
                >
                  {/* Badge for Student Turn or Computer Speaking */}
                  {isStudentTurn && (
                    <div className="self-start inline-flex items-center gap-1.5 bg-[#F59E42] text-white px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider shadow-2xs mb-1">
                      <i className="fa-solid fa-user"></i>
                      <span>ĐẾN LƯỢT BẠN NÓI ({selectedRole})</span>
                    </div>
                  )}

                  {isCurrentSpeaking && (
                    <div className="self-start inline-flex items-center gap-1.5 bg-[#3B82C4] text-white px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider shadow-2xs mb-1 animate-pulse">
                      <i className="fa-solid fa-volume-high"></i>
                      <span>MÁY ĐANG ĐỌC ({item.speaker})</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    {/* Speaker Name Tag on Left */}
                    <span
                      className={`font-bold w-16 md:w-20 shrink-0 text-right text-base leading-relaxed ${
                        isTrang ? 'text-[#3B82C4]' : 'text-[#F59E42]'
                      }`}
                    >
                      {item.speaker}:
                    </span>

                    {/* Speech Text Content */}
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p
                        className={`text-base md:text-lg leading-relaxed ${
                          isCurrentSpeaking
                            ? 'text-[#1E3A8A] font-extrabold'
                            : isStudentTurn
                            ? 'text-[#7C2D12] font-extrabold'
                            : isSelectedUserRole && maskSelectedRole
                            ? 'bg-[#E2E8F0] text-transparent select-none blur-xs rounded px-2 py-0.5 cursor-pointer hover:text-[#334155] hover:bg-transparent hover:blur-none transition-all'
                            : 'text-[#334155]'
                        }`}
                      >
                        {item.text}
                      </p>

                      {/* Animated Sound Waves when computer speaking */}
                      {isCurrentSpeaking && (
                        <div className="flex items-center gap-1 text-[#3B82C4] shrink-0 ml-2">
                          <span className="w-1 h-4 bg-[#3B82C4] rounded-full animate-bounce"></span>
                          <span className="w-1 h-6 bg-[#3B82C4] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="w-1 h-3 bg-[#3B82C4] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                      )}
                    </div>

                    {/* Audio Button */}
                    <button
                      onClick={(e) => handlePlaySingleLine(realIndex, e)}
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isCurrentSpeaking
                          ? 'bg-[#3B82C4] text-white animate-pulse scale-110 shadow-sm'
                          : 'bg-[#FDFBF7] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white border border-[#E2E8F0]'
                      }`}
                      title="Nghe máy đọc riêng câu này"
                    >
                      <i
                        className={`fa-solid ${
                          isCurrentSpeaking ? 'fa-volume-high' : 'fa-play text-xs'
                        }`}
                      ></i>
                    </button>
                  </div>

                  {/* Student turn continue button directly inside item */}
                  {isStudentTurn && (
                    <div className="mt-3 pt-3 border-t-2 border-[#F59E42]/30 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/70 p-2.5 rounded-xl">
                      <div className="text-xs text-[#7C2D12] font-semibold">
                        {userSpokenText ? (
                          <span>
                            <strong className="text-[#B45309]">Bạn vừa nói:</strong> "{userSpokenText}"
                          </span>
                        ) : (
                          <span>Không nhận diện được giọng nói, nhưng bạn vẫn có thể tiếp tục.</span>
                        )}
                      </div>
                      <button
                        id="btn-confirm-spoken-line"
                        onClick={handleContinueNextLine}
                        className="w-full sm:w-auto bg-[#F59E42] hover:bg-[#E08C32] text-white text-xs px-4 py-2 rounded-lg font-black uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-[#D97706] shrink-0 hover:scale-[1.02]"
                      >
                        <i className="fa-solid fa-circle-check text-sm"></i>
                        <span>✓ Tôi đã nói xong, tiếp tục</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Completion Modal Overlay when entire dialogue finished */}
        {isDialogueCompleted && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white border-4 border-[#F59E42] rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-[#FEF3C7] border-4 border-[#F59E42] rounded-full flex items-center justify-center text-3xl shadow-md animate-bounce">
                🎉
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#1E293B] uppercase tracking-wide">
                  Hoàn Thành Bài Hội Thoại!
                </h3>
                <p className="text-[#475569] font-medium text-sm md:text-base mt-2 leading-relaxed">
                  Chúc mừng bạn đã thực hành thành công tất cả các câu thoại đóng vai <strong className="text-[#3B82C4] font-extrabold uppercase">{selectedRole || 'đã chọn'}</strong>!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
                <button
                  id="btn-replay-dialogue"
                  onClick={() => {
                    setIsDialogueCompleted(false);
                    executeRoleplayStep(0);
                  }}
                  className="w-full sm:w-auto flex-1 py-3.5 px-5 bg-[#3B82C4] hover:bg-[#3B82C4]/90 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#3B82C4]"
                >
                  <i className="fa-solid fa-rotate-right text-base"></i>
                  <span>Luyện Lại (Vai {selectedRole})</span>
                </button>

                <button
                  id="btn-change-role-dialogue"
                  onClick={() => {
                    setIsDialogueCompleted(false);
                    stopAudioPlayback();
                    const nextRole = selectedRole === 'Trang' ? 'Tom' : 'Trang';
                    if (onSelectRole) {
                      onSelectRole(nextRole);
                    }
                  }}
                  className="w-full sm:w-auto flex-1 py-3.5 px-5 bg-[#F59E42] hover:bg-[#E08C32] text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D97706]"
                >
                  <i className="fa-solid fa-users text-base"></i>
                  <span>Đổi Vai ({selectedRole === 'Trang' ? 'Đóng Tom' : 'Đóng Trang'})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Box Footer Stats & Speed Selector */}
        <div className="bg-[#FDFBF7] border-t border-[#E2E8F0] px-4 py-3 flex items-center justify-between text-xs text-[#64748B] shrink-0 font-medium">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-info-circle text-[#3B82C4]"></i>
            <span>Bấm biểu tượng loa hoặc nhấp chọn câu thoại để thực hành.</span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold">Tốc độ:</span>
            <select
              id="playback-rate-select"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-white border border-[#E2E8F0] rounded px-2 py-1 text-xs text-[#334155] font-bold cursor-pointer focus:outline-none focus:border-[#3B82C4]"
            >
              <option value={0.75}>0.75x (Chậm)</option>
              <option value={1}>1.0x (Chuẩn)</option>
              <option value={1.25}>1.25x (Nhanh)</option>
            </select>
          </div>
        </div>
      </div>

      {/* FULL AUDIO SPEAKER BAR (Located directly below transcript box on the left) */}
      <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Speaker Icon Button on the Left */}
          <button
            id="btn-speaker-icon"
            type="button"
            onClick={handlePlayFullAudio}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 ${
              isPlayingAll || userTurnIndex !== null
                ? 'bg-[#F87171] text-white ring-4 ring-[#F87171]/30 shadow-md scale-105'
                : 'bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white border border-[#3B82C4]/20'
            }`}
            title={
              isPlayingAll || userTurnIndex !== null
                ? 'Đang phát hội thoại. Bấm để dừng lại'
                : 'Phát toàn bộ audio hội thoại'
            }
          >
            <i
              className={`fa-solid ${
                isPlayingAll
                  ? 'fa-volume-high text-xl text-white animate-pulse'
                  : 'fa-volume-low text-xl'
              }`}
            ></i>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#334155] uppercase tracking-wider">
                {selectedRole ? `MÁY ĐỌC LỜI THOẠI CỦA ${selectedRole === 'Trang' ? 'TOM' : 'TRANG'}` : 'PHÁT AUDIO TOÀN BỘ HỘI THOẠI'}
              </h3>
              {isPlayingAll && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#4ADE80]/40 animate-pulse uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping"></span>
                  MÁY ĐANG ĐỌC
                </span>
              )}
              {userTurnIndex !== null && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#B45309] bg-[#FFEDD5] px-2 py-0.5 rounded-md border border-[#F59E42]/40 animate-pulse uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#F59E42] animate-ping"></span>
                  ĐẾN LƯỢT BẠN NÓI
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {selectedRole
                ? `Máy sẽ đọc câu thoại của ${selectedRole === 'Trang' ? 'Tom' : 'Trang'} và dừng lại khi đến lượt ${selectedRole}.`
                : 'Bấm biểu tượng loa bên trái để nghe bài hội thoại từ đầu đến cuối.'}
            </p>
          </div>
        </div>

        <button
          id="btn-play-audio-bottom"
          onClick={handlePlayFullAudio}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0 shadow-xs ${
            isPlayingAll || userTurnIndex !== null
              ? 'bg-[#F87171] text-white hover:bg-[#F87171]/90 shadow-md'
              : 'bg-[#3B82C4] text-white hover:bg-[#3B82C4]/90'
          }`}
        >
          <i className={`fa-solid ${isPlayingAll || userTurnIndex !== null ? 'fa-square' : 'fa-play'}`}></i>
          <span className="hidden sm:inline">
            {isPlayingAll || userTurnIndex !== null ? 'DỪNG ĐỌC' : 'PHÁT AUDIO'}
          </span>
        </button>
      </div>
    </div>
  );
};


