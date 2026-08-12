import React, { useRef, useState, useEffect } from 'react';
import { Track, TranscriptLine } from '../types';

interface AudioPlayerControlProps {
  track: Track;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  showTranscript: boolean;
  activeLineIndex: number | null;
  onLineClick?: (index: number) => void;
}

export const AudioPlayerControl: React.FC<AudioPlayerControlProps> = ({
  track,
  isPlaying,
  onPlayStateChange,
  onTimeUpdate,
  showTranscript,
  activeLineIndex,
  onLineClick,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeechFallback, setIsSpeechFallback] = useState(false);
  const speechUttRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Audio file URL (e.g., "/track-5.mp3" or "/track-6.mp3")
  const audioUrl = `/${track.audioFile}`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle Play/Pause toggling
  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pause
      if (audioRef.current && !isSpeechFallback) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onPlayStateChange(false);
    } else {
      // Play
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsSpeechFallback(false);
          onPlayStateChange(true);
        }).catch((err) => {
          console.log("Audio file playback fallback to Speech Synthesis:", err);
          startSpeechSynthesis();
        });
      } else {
        startSpeechSynthesis();
      }
    }
  };

  // Web Speech Synthesis Fallback for clear Grade 8 English listening
  const startSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) {
      onPlayStateChange(true);
      return;
    }
    window.speechSynthesis.cancel();
    
    // Combine transcript text for speech
    const fullText = track.transcript.map(t => `${t.speaker}: ${t.text}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed * 0.9;
    
    utterance.onend = () => {
      onPlayStateChange(false);
      setCurrentTime(duration || 30);
    };

    utterance.onerror = () => {
      onPlayStateChange(false);
    };

    speechUttRef.current = utterance;
    setIsSpeechFallback(true);
    window.speechSynthesis.speak(utterance);
    onPlayStateChange(true);

    if (duration === 0) {
      setDuration(Math.max(30, track.transcript.length * 4));
    }
  };

  // Audio event listeners
  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 0;
      setCurrentTime(cur);
      if (dur > 0) setDuration(dur);
      if (onTimeUpdate) onTimeUpdate(cur, dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    onPlayStateChange(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && !isSpeechFallback) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FDFBF7] rounded-xl border border-[#E2E8F0] p-4 sm:p-5 my-3 shadow-2xs">
      {/* Hidden audio element pointing strictly to /track-5.mp3 or /track-6.mp3 */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={() => {
          // If mp3 is empty or un-decodable, fallback seamlessly
          console.log(`Audio element pointed to ${audioUrl}. Will fallback to speech if played.`);
        }}
        preload="metadata"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main Speaker Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? "Tạm dừng audio" : "Phát audio"}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-[#F59E42] text-white ring-4 ring-[#FFEDD5] animate-pulse'
                : 'bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white border border-[#3B82C4]/20'
            }`}
          >
            {isPlaying ? (
              <div className="flex items-center justify-center gap-1">
                <i className="fa-solid fa-volume-high text-2xl sm:text-3xl"></i>
              </div>
            ) : (
              <i className="fa-solid fa-volume-low text-2xl sm:text-3xl pl-1"></i>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isPlaying ? 'bg-[#FFEDD5] text-[#F59E42]' : 'bg-[#DBEAFE] text-[#3B82C4]'
              }`}>
                {isPlaying ? "Đang phát audio..." : "Sẵn sàng phát"}
              </span>
              <span className="text-xs text-[#64748B]">
                {track.audioFile}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#334155] mt-1">
              {isPlaying ? "Nhấp vào nút loa để tạm dừng" : "Nhấp vào biểu tượng loa để nghe audio"}
            </p>

            {/* Audio Wave Visualizer when playing */}
            {isPlaying && (
              <div className="flex items-center gap-1 mt-2 h-4">
                <span className="w-1 bg-[#F59E42] h-full rounded-full animate-wave-1"></span>
                <span className="w-1 bg-[#F59E42] h-full rounded-full animate-wave-2"></span>
                <span className="w-1 bg-[#F59E42] h-full rounded-full animate-wave-3"></span>
                <span className="w-1 bg-[#F59E42] h-full rounded-full animate-wave-4"></span>
                <span className="w-1 bg-[#F59E42] h-full rounded-full animate-wave-1"></span>
                <span className="text-xs text-[#F59E42] font-bold ml-2">Audio Playing</span>
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls & Speed Selector */}
        <div className="flex-1 max-w-md w-full bg-white p-3 rounded-lg border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
            <span className="font-mono font-bold text-[#3B82C4]">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1">
              <span className="text-2xs uppercase text-[#64748B] mr-1">Tốc độ:</span>
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-2xs font-bold transition-colors cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-[#3B82C4] text-white'
                      : 'bg-[#FDFBF7] text-[#64748B] hover:bg-[#DBEAFE]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <span className="font-mono">{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#3B82C4]"
          />
        </div>
      </div>
    </div>
  );
};
