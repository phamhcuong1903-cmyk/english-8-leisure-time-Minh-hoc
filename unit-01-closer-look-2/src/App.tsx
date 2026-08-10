import { useState } from 'react';
import { Header } from './components/Header';
import { VerbClassifier } from './components/VerbClassifier';
import { SentencePractice } from './components/SentencePractice';
import { MultipleChoiceQuiz } from './components/MultipleChoiceQuiz';
import { GrammarTheory } from './components/GrammarTheory';

export default function App() {
  const [activeTab, setActiveTab] = useState<'classify' | 'sentence' | 'quiz' | 'theory'>('classify');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'classify' && <VerbClassifier onNextTab={setActiveTab} />}
        {activeTab === 'sentence' && <SentencePractice onNextTab={setActiveTab} />}
        {activeTab === 'quiz' && <MultipleChoiceQuiz />}
        {activeTab === 'theory' && <GrammarTheory />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 mt-12 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3B82C4' }}></span>
            <span className="font-semibold text-[#334155]">
              Hệ thống Học Tập & Luyện Tập Tiếng Anh THCS - Unit 1: Verbs of Liking
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('classify')}
              className="hover:text-[#3B82C4] transition-colors cursor-pointer"
            >
              Phân loại động từ
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('theory')}
              className="hover:text-[#3B82C4] transition-colors cursor-pointer"
            >
              Tóm tắt lý thuyết
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
