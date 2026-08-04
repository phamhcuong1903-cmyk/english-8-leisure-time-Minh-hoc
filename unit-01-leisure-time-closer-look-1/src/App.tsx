import React, { useState } from 'react';
import { Header } from './components/Header';
import { PartAAnimation } from './components/PartAAnimation';
import { PartBGrammar } from './components/PartBGrammar';
import { PartVideo } from './components/PartVideo';
import { PartDragGame } from './components/PartDragGame';
import { PartCPractice } from './components/PartCPractice';

export default function App() {
  const [activeTab, setActiveTab] = useState<'partA' | 'partB' | 'partVideo' | 'partGame' | 'partC'>('partA');

  const handleAnimationComplete = () => {
    setActiveTab('partB');
  };

  const handleSkipAnimation = () => {
    setActiveTab('partB');
  };

  const handleContinueFromGrammar = () => {
    setActiveTab('partVideo');
  };

  const handleContinueFromVideo = () => {
    setActiveTab('partGame');
  };

  const handleContinueFromGame = () => {
    setActiveTab('partC');
  };

  const handleReplayAnimation = () => {
    setActiveTab('partA');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif selection:bg-[#FFEDD5] selection:text-[#F59E42]">
      {/* Header with Title and Navigation Tabs */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-4 flex flex-col items-center">
        {activeTab === 'partA' && (
          <PartAAnimation
            onComplete={handleAnimationComplete}
            onSkip={handleSkipAnimation}
          />
        )}

        {activeTab === 'partB' && (
          <PartBGrammar
            onContinue={handleContinueFromGrammar}
            onReplayAnimation={handleReplayAnimation}
          />
        )}

        {activeTab === 'partVideo' && (
          <PartVideo
            onContinue={handleContinueFromVideo}
            onBackToGrammar={() => setActiveTab('partB')}
          />
        )}

        {activeTab === 'partGame' && (
          <PartDragGame
            onContinue={handleContinueFromGame}
            onBackToVideo={() => setActiveTab('partVideo')}
          />
        )}

        {activeTab === 'partC' && (
          <PartCPractice
            onRestart={handleReplayAnimation}
            onBackToGrammar={() => setActiveTab('partB')}
          />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-[#E2E8F0] py-4 px-4 text-center text-xs text-[#64748B]">
        <p>Unit 1: Hobbies - English Grade 7 Grammar & Pronunciation Module | Theme Color Palette: #FDFBF7, #3B82C4, #F59E42</p>
      </footer>
    </div>
  );
}
