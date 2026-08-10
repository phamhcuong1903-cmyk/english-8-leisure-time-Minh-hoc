import React from 'react';

interface AudioSpeakerCardProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  audioSourceType: 'file' | 'speech' | 'none';
  customFileName?: string;
  onSpeakerClick: () => void;
  onRewind: () => void;
  onRateChange: (rate: number) => void;
  onFileUpload: (file: File) => void;
}

export const AudioSpeakerCard: React.FC<AudioSpeakerCardProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  audioSourceType,
  customFileName,
  onSpeakerClick,
  onRewind,
  onRateChange,
  onFileUpload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col justify-between h-full min-h-[420px]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,.mp3,.wav,.m4a"
        className="hidden"
      />

      {/* Top Header info */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3B82C4]"></span>
          <h2 className="text-xl font-bold text-[#334155]">1. Nghe Âm Thanh</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs bg-[#DBEAFE] text-[#3B82C4] font-semibold px-3 py-1.5 rounded-lg border border-[#3B82C4]/30 hover:bg-[#3B82C4] hover:text-white transition-all cursor-pointer shadow-xs"
            title="Tải/chọn file Communication.mp3 từ máy tính"
          >
            <i className="fa-solid fa-file-arrow-up"></i>
            <span>{customFileName ? `Đã chọn: ${customFileName}` : 'Tải file MP3 từ máy'}</span>
          </button>
        </div>
      </div>

      {/* Main Big Speaker Container with #DBEAFE background */}
      <div className="my-6 bg-[#DBEAFE] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 border border-[#3B82C4]/20 shadow-inner">
        {/* Decorative subtle background elements */}
        <div className="absolute top-3 left-4 text-xs font-medium text-[#3B82C4]/70 flex items-center gap-1.5">
          <i className="fa-solid fa-file-audio"></i>
          <span>File audio: Communication.mp3</span>
        </div>

        {/* Status badge */}
        <div className="mb-6">
          {isPlaying ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#F59E42] text-sm font-semibold border border-[#F59E42]/30 shadow-xs">
              <i className="fa-solid fa-volume-high animate-bounce"></i>
              <span>Đang phát từ đầu...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#3B82C4] text-sm font-semibold border border-[#3B82C4]/20">
              <i className="fa-solid fa-circle-play"></i>
              <span>Chạm biểu tượng loa để nghe</span>
            </span>
          )}
        </div>

        {/* Big Speaker Button */}
        <button
          onClick={onSpeakerClick}
          title="Bấm vào loa để phát âm thanh từ đầu"
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#F59E42]/40 shadow-lg cursor-pointer relative ${
            isPlaying
              ? 'bg-white text-[#F59E42] border-4 border-[#F59E42] playing-speaker'
              : 'bg-white text-[#3B82C4] border-4 border-[#3B82C4] hover:bg-[#FDFBF7] hover:border-[#F59E42] hover:text-[#F59E42]'
          }`}
        >
          {/* Big FontAwesome Speaker Icon */}
          <i className={`text-6xl sm:text-7xl fa-solid transition-colors duration-300 ${
            isPlaying ? 'fa-volume-high text-[#F59E42]' : 'fa-volume-low text-[#3B82C4]'
          }`}></i>

          {/* Label inside button */}
          <span className="absolute bottom-3 text-xs font-bold tracking-wide uppercase opacity-80">
            {isPlaying ? 'Đang phát' : 'Phát bài'}
          </span>
        </button>

        <p className="mt-6 text-sm text-[#334155] font-medium text-center">
          {isPlaying ? (
            <span className="text-[#F59E42] font-semibold">Bấm lại vào loa để phát lại từ đầu</span>
          ) : (
            <span>Nhấn vào nút <strong className="text-[#3B82C4]">LOA</strong> để nghe audio nói tiếng Anh</span>
          )}
        </p>
      </div>

      {/* Audio Controls & Progress */}
      <div className="space-y-4 pt-2">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#64748B] font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#F59E42] h-full rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Rewind 5s */}
          <button
            onClick={onRewind}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] text-xs text-[#334155] font-semibold hover:bg-[#DBEAFE] hover:text-[#3B82C4] transition-colors shrink-0 cursor-pointer"
            title="Tua lại 5 giây"
          >
            <i className="fa-solid fa-rotate-left text-[#3B82C4]"></i>
            <span>Tua lại 5s</span>
          </button>

          {/* Speed Selection Slider (Kéo thả chọn tốc độ) */}
          <div className="flex-1 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E2E8F0] flex flex-col justify-center gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#64748B]">
                <i className="fa-solid fa-gauge-high text-[#3B82C4]"></i>
                <span>Tốc độ đọc (Kéo thả):</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#3B82C4] text-white font-bold text-xs shadow-xs">
                {playbackRate.toFixed(2)}x
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#64748B] font-bold">0.5x</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={playbackRate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#F59E42] focus:outline-none focus:ring-2 focus:ring-[#F59E42]/40"
                title="Kéo thả thanh trượt để thay đổi tốc độ đọc"
              />
              <span className="text-[10px] text-[#64748B] font-bold">2.0x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
