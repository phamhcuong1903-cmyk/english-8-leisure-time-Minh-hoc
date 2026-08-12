import React, { useState } from 'react';
import { listeningData } from './data/listeningTracks';
import { ListeningRound } from './types';
import { Header } from './components/Header';
import { TrackCard } from './components/TrackCard';
import { EmailWritingSection } from './components/EmailWritingSection';

export default function App() {
  // Track state for Round 2 visits
  const [visitedRound2Map, setVisitedRound2Map] = useState<Record<string, boolean>>({
    'track-5': false,
    'track-6': false,
  });

  // Main view state: 'listening' or 'writing'
  const [currentView, setCurrentView] = useState<'listening' | 'writing'>('listening');

  // Handle when a track switches its listening round
  const handleRoundChange = (trackId: string, round: ListeningRound) => {
    if (round === 2) {
      setVisitedRound2Map((prev) => ({
        ...prev,
        [trackId]: true,
      }));
    }
  };

  // Check if both tracks have visited Round 2
  const completedCount = Object.values(visitedRound2Map).filter(Boolean).length;
  const totalTracks = listeningData.tracks.length;
  const canProceed = completedCount === totalTracks;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* Header */}
      <Header
        completedTracksCount={completedCount}
        totalTracksCount={totalTracks}
        canProceed={canProceed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {currentView === 'listening' ? (
          <div>
            {/* Top Introductory Banner */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E2E8F0] mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#3B82C4] text-xs font-bold mb-2">
                    <i className="fa-solid fa-graduation-cap"></i> Quy trình 2 Lượt nghe Chuẩn
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#334155] tracking-tight">
                    Luyện nghe bài phỏng vấn về Hoạt động giải trí (Leisure Time)
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1 font-sans leading-relaxed">
                    Mỗi khối bên dưới hoạt động độc lập. Bắt đầu với <strong>Lượt 1</strong> (nghe ý chính không transcript), sau đó chuyển sang <strong>Lượt 2</strong> (đối chiếu transcript) để mở khóa phần Viết email.
                  </p>
                </div>

                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E8F0] text-center shrink-0">
                  <span className="text-2xs uppercase tracking-wider text-[#64748B] font-bold block">
                    Số lượng bài nghe
                  </span>
                  <span className="text-xl font-bold text-[#3B82C4]">
                    2 Tracks (5 & 6)
                  </span>
                </div>
              </div>
            </div>

            {/* Listening Track Blocks */}
            <div className="space-y-6">
              {listeningData.tracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  trackIndex={index}
                  onRoundChange={handleRoundChange}
                  hasVisitedRound2={!!visitedRound2Map[track.id]}
                />
              ))}
            </div>

            {/* Bottom Proceed Button: Only appears when BOTH tracks have visited Round 2 at least once */}
            <div className="mt-8 mb-12 flex flex-col items-center justify-center">
              {canProceed ? (
                <div className="w-full max-w-md text-center space-y-3 animate-fade-in">
                  <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#4ADE80] text-xs text-[#16A34A] font-bold flex items-center justify-center gap-2">
                    <i className="fa-solid fa-circle-check text-base"></i>
                    <span>Xuất sắc! Em đã chuyển sang Lượt 2 của cả Track 5 & Track 6!</span>
                  </div>

                  <button
                    onClick={() => setCurrentView('writing')}
                    className="w-full py-4 px-6 rounded-xl bg-[#F59E42] hover:bg-[#e08e33] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3 border border-[#F59E42]"
                  >
                    <span>Tiếp tục → Viết email</span>
                    <i className="fa-solid fa-arrow-right text-xl"></i>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-4 px-6 rounded-xl border border-[#E2E8F0] text-center shadow-2xs max-w-lg">
                  <p className="text-xs text-[#64748B] font-sans">
                    🔒 <strong className="text-[#334155]">Nút "Tiếp tục → Viết email" sẽ xuất hiện tại đây</strong> sau khi em chuyển sang <strong>Lượt 2</strong> của cả 2 bài nghe (Track 5 và Track 6).
                  </p>
                  <div className="flex justify-center gap-4 mt-2 text-2xs font-bold font-sans">
                    <span className={visitedRound2Map['track-5'] ? 'text-[#16A34A]' : 'text-[#64748B]'}>
                      • Track 5: {visitedRound2Map['track-5'] ? '✓ Đã xong Lượt 2' : 'Chưa xong Lượt 2'}
                    </span>
                    <span className={visitedRound2Map['track-6'] ? 'text-[#16A34A]' : 'text-[#64748B]'}>
                      • Track 6: {visitedRound2Map['track-6'] ? '✓ Đã xong Lượt 2' : 'Chưa xong Lượt 2'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmailWritingSection onBackToListening={() => setCurrentView('listening')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#64748B] font-sans mt-auto">
        <p>Tiếng Anh 8 - Unit 1: Leisure Time - Skills 2 • Luyện tập Nghe & Viết Email</p>
      </footer>
    </div>
  );
}
