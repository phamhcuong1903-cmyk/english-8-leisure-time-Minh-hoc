import React, { useState } from 'react';
import { ActiveTab } from './types';
import { unitMindmapData, selfAssessmentData } from './data/unitData';
import { Header } from './components/Header';
import { MindmapView } from './components/MindmapView';
import { SelfAssessmentView } from './components/SelfAssessmentView';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mindmap');
  // Store session ratings in React state (no localStorage)
  const [sessionRatings, setSessionRatings] = useState<Record<string, number>>({});

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#334155]">
      
      {/* Header Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'mindmap' ? (
          <MindmapView 
            data={unitMindmapData} 
            onNavigateToAssessment={() => setActiveTab('assessment')} 
          />
        ) : (
          <SelfAssessmentView 
            data={selfAssessmentData} 
            sessionRatings={sessionRatings}
            setSessionRatings={setSessionRatings}
            onNavigateToMindmap={() => setActiveTab('mindmap')} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
