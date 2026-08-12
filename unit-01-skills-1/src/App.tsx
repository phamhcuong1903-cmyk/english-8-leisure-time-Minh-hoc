import { useState } from 'react';
import { Header } from './components/Header';
import { ReadingView } from './components/ReadingView';
import { DialogueView } from './components/DialogueView';
import { VocabularyModal } from './components/VocabularyModal';
import { readingPassageData } from './data/readingData';
import { dialogueQuestions } from './data/dialogueData';
import { VocabularyWord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reading' | 'dialogue'>('reading');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'reading' ? (
          <ReadingView
            passageData={readingPassageData}
            onGoToDialogue={() => setActiveTab('dialogue')}
            onOpenVocabulary={(word) => setSelectedWord(word)}
          />
        ) : (
          <DialogueView
            questions={dialogueQuestions}
            onBackToReading={() => setActiveTab('reading')}
          />
        )}
      </main>

      {/* Vocabulary Modal Popup */}
      <VocabularyModal
        wordData={selectedWord}
        onClose={() => setSelectedWord(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#64748B]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Tiếng Anh Cấp 2 • Unit 1: Trang's Leisure Activities</span>
          <span>Thiết kế học tập thân thiện học sinh • Font Times New Roman</span>
        </div>
      </footer>
    </div>
  );
}
