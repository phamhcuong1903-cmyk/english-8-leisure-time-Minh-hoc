import React, { useState } from 'react';
import { Track, ListeningRound } from '../types';
import { AudioPlayerControl } from './AudioPlayerControl';

interface TrackCardProps {
  track: Track;
  trackIndex: number;
  onRoundChange: (trackId: string, newRound: ListeningRound) => void;
  hasVisitedRound2: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  trackIndex,
  onRoundChange,
  hasVisitedRound2,
}) => {
  const [currentRound, setCurrentRound] = useState<ListeningRound>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [studentNotes, setStudentNotes] = useState('');

  const handleSwitchRound = (round: ListeningRound) => {
    setCurrentRound(round);
    onRoundChange(track.id, round);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 sm:p-7 transition-all">
      {/* Block Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82C4] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {trackIndex + 1}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#334155] tracking-tight">
              {track.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Nguồn audio: <span className="font-mono text-[#3B82C4]">/{track.audioFile}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {hasVisitedRound2 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#4ADE80] self-start sm:self-center">
            <i className="fa-solid fa-circle-check"></i> Đã hoàn thành Lượt 2
          </span>
        )}
      </div>

      {/* Mode Switcher Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-3">
        <button
          type="button"
          onClick={() => handleSwitchRound(1)}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
            currentRound === 1
              ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-xs'
              : 'bg-[#FDFBF7] text-[#334155] border-[#E2E8F0] hover:bg-[#DBEAFE]/50'
          }`}
        >
          <i className="fa-solid fa-headphones text-base"></i>
          Lượt 1: Nghe ý chính
        </button>

        <button
          type="button"
          onClick={() => handleSwitchRound(2)}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
            currentRound === 2
              ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-xs'
              : 'bg-[#FDFBF7] text-[#334155] border-[#E2E8F0] hover:bg-[#DBEAFE]/50'
          }`}
        >
          <i className="fa-solid fa-[#fa-file-lines] fa-file-lines text-base"></i>
          Lượt 2: Đối chiếu transcript
        </button>
      </div>

      {/* Audio Player Box (Available in both rounds) */}
      <div className="mt-4">
        <AudioPlayerControl
          track={track}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
          showTranscript={currentRound === 2}
          activeLineIndex={activeLineIndex}
        />
      </div>

      {/* ROUND 1 CONTENT: No transcript shown */}
      {currentRound === 1 && (
        <div className="mt-4 p-5 rounded-xl bg-[#FDFBF7] border border-[#E2E8F0]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center shrink-0 mt-0.5">
              <i className="fa-solid fa-lightbulb text-base"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#334155]">
                Hướng dẫn Lượt 1 - Nghe lấy ý chính (Main Idea)
              </h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                Hãy tập trung lắng nghe biểu tượng loa ở trên mà không nhìn phụ đề. Bạn có thể bấm nút loa để nghe lại nhiều lần tùy ý.
              </p>

              {/* Student Scratchpad for main ideas */}
              <div className="mt-4 bg-white p-3.5 rounded-lg border border-[#E2E8F0]">
                <label className="block text-xs font-bold text-[#3B82C4] uppercase tracking-wider mb-2">
                  <i className="fa-solid fa-[#fa-pen-to-square] fa-pen-to-square mr-1"></i>
                  Ghi chú từ khóa/ý chính bạn nghe được (Tùy chọn):
                </label>
                <textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Ví dụ: Mark's free time, weekend, family, Saturdays, friends, Sundays, cook food, play volleyball..."
                  rows={2}
                  className="w-full text-sm text-[#334155] bg-[#FDFBF7] p-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:border-[#3B82C4] transition-colors"
                />
              </div>

              <div className="mt-4 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs text-[#64748B]">
                  Khi sẵn sàng, hãy nhấn nút <strong>"Lượt 2: Đối chiếu transcript"</strong> để mở toàn bộ lời thoại.
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchRound(2)}
                  className="px-4 py-2 rounded-lg bg-[#FFEDD5] text-[#F59E42] hover:bg-[#F59E42] hover:text-white font-bold text-xs transition-colors cursor-pointer border border-[#F59E42]/30"
                >
                  Chuyển sang Lượt 2 <i className="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROUND 2 CONTENT: Show full transcript */}
      {currentRound === 2 && (
        <div className="mt-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B82C4]"></span>
              <h3 className="text-base font-bold text-[#334155]">
                Transcript Lượt 2 - Đối chiếu lời thoại
              </h3>
            </div>
            <span className="text-xs bg-[#DBEAFE] text-[#3B82C4] px-2.5 py-1 rounded-full font-semibold">
              {track.transcript.length} câu đối thoại
            </span>
          </div>

          {/* Transcript Lines List */}
          <div className="space-y-3">
            {track.transcript.map((line, index) => {
              const isInterviewer = line.speaker.toLowerCase().includes('interviewer');
              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl transition-all border ${
                    activeLineIndex === index
                      ? 'bg-[#FFEDD5] border-[#F59E42] shadow-xs'
                      : isInterviewer
                      ? 'bg-[#FDFBF7] border-[#E2E8F0] hover:border-[#3B82C4]/40'
                      : 'bg-[#F0FDF4]/60 border-[#4ADE80]/30 hover:border-[#4ADE80]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase shrink-0 mt-0.5 ${
                        isInterviewer
                          ? 'bg-[#DBEAFE] text-[#3B82C4] border border-[#3B82C4]/20'
                          : 'bg-[#FFEDD5] text-[#F59E42] border border-[#F59E42]/20'
                      }`}
                    >
                      {line.speaker}
                    </span>
                    <p className="text-base text-[#334155] leading-relaxed font-serif">
                      {line.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#F0FDF4] border border-[#4ADE80] text-xs text-[#16A34A] flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-sm"></i>
            <span>
              Tuyệt vời! Bạn đã hoàn thành <strong>Lượt 2</strong> cho bài nghe này. Bạn có thể bấm biểu tượng loa để vừa nghe vừa đọc lại.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
