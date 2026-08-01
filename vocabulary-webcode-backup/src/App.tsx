import { useState, useMemo } from 'react';
import { vocabularyData, WordItem } from './data/vocabularyData';
import { TabType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SubBar } from './components/SubBar';
import { FlashcardTab } from './components/tabs/FlashcardTab';
import { QuizTab } from './components/tabs/QuizTab';
import { FillInTab } from './components/tabs/FillInTab';
import { MatchingTab } from './components/tabs/MatchingTab';
import { BingoTab } from './components/tabs/BingoTab';
import { ReportTab } from './components/tabs/ReportTab';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('flashcard');
  const [score, setScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] = useState<string>('Tất cả');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);

  // Learning tracking state
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<number>>(new Set());
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [wordWrongStats, setWordWrongStats] = useState<Record<number, number>>({});

  // All words and section list
  const allWords = vocabularyData.words;
  const sections = useMemo(() => {
    const setSec = new Set<string>();
    allWords.forEach((w) => setSec.add(w.section));
    return Array.from(setSec);
  }, [allWords]);

  // Filtered words based on section
  const filteredWords = useMemo(() => {
    if (selectedSection === 'Tất cả') return allWords;
    return allWords.filter((w) => w.section === selectedSection);
  }, [selectedSection, allWords]);

  // Ensure selectedWordIndex stays in bounds when section changes
  const activeIndex = Math.min(selectedWordIndex, Math.max(0, filteredWords.length - 1));
  const currentWord: WordItem | undefined = filteredWords[activeIndex];

  // Section selection change
  const handleSelectSection = (sec: string) => {
    setSelectedSection(sec);
    setSelectedWordIndex(0);
  };

  // Reset Game handler
  const handleResetGame = () => {
    setScore(0);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setCorrectCount(0);
    setWrongCount(0);
    setWordWrongStats({});
    setSelectedWordIndex(0);
  };

  // Marking mastered / correct
  const handleCorrect = (wordId: number) => {
    setScore((prev) => prev + 10);
    setCorrectCount((prev) => prev + 1);

    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.add(wordId);
      return next;
    });

    // Remove from review if it was there
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(wordId);
      return next;
    });
  };

  // Marking wrong / review
  const handleWrong = (wordId: number) => {
    setWrongCount((prev) => prev + 1);

    setReviewIds((prev) => {
      const next = new Set(prev);
      next.add(wordId);
      return next;
    });

    setWordWrongStats((prev) => ({
      ...prev,
      [wordId]: (prev[wordId] || 0) + 1,
    }));
  };

  // Next Word Navigation
  const handleNextWord = () => {
    if (filteredWords.length === 0) return;
    setSelectedWordIndex((prev) => (prev + 1) % filteredWords.length);
  };

  // Prev Word Navigation
  const handlePrevWord = () => {
    if (filteredWords.length === 0) return;
    setSelectedWordIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* HEADER WITH UNIT TITLE & TAB NAVIGATION */}
      <Header
        unitTitle={vocabularyData.unitTitle}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR (LEFT) */}
        <Sidebar
          score={score}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onResetGame={handleResetGame}
          sections={sections}
          selectedSection={selectedSection}
          onSelectSection={handleSelectSection}
          filteredWords={filteredWords}
          selectedIndex={activeIndex}
          onSelectIndex={setSelectedWordIndex}
          masteredIds={masteredIds}
          reviewIds={reviewIds}
        />

        {/* MAIN CONTENT AREA (RIGHT / CENTER) */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Sub-bar above main exercise box (For non-report tabs) */}
          {currentTab !== 'report' && (
            <SubBar
              currentWord={currentWord}
              currentIndex={activeIndex}
              totalFiltered={filteredWords.length}
              correctCount={correctCount}
              wrongCount={wrongCount}
            />
          )}

          {/* TAB CONTENT */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 flex-1">
            {currentTab === 'flashcard' && currentWord && (
              <FlashcardTab
                currentWord={currentWord}
                soundEnabled={soundEnabled}
                onMarkMastered={handleCorrect}
                onMarkReview={handleWrong}
                isMastered={masteredIds.has(currentWord.id)}
                isReview={reviewIds.has(currentWord.id)}
                onPrev={handlePrevWord}
                onNext={handleNextWord}
              />
            )}

            {currentTab === 'quiz' && currentWord && (
              <QuizTab
                currentWord={currentWord}
                allWords={allWords}
                filteredWords={filteredWords}
                soundEnabled={soundEnabled}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onNext={handleNextWord}
              />
            )}

            {currentTab === 'fill' && currentWord && (
              <FillInTab
                currentWord={currentWord}
                soundEnabled={soundEnabled}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onNext={handleNextWord}
              />
            )}

            {currentTab === 'match' && (
              <MatchingTab
                filteredWords={filteredWords}
                allWords={allWords}
                soundEnabled={soundEnabled}
                onCorrectMatch={handleCorrect}
                onWrongMatch={handleWrong}
              />
            )}

            {currentTab === 'bingo' && (
              <BingoTab
                filteredWords={filteredWords}
                allWords={allWords}
                soundEnabled={soundEnabled}
                onCorrectHit={handleCorrect}
                onWrongHit={handleWrong}
              />
            )}

            {currentTab === 'report' && (
              <ReportTab
                score={score}
                masteredIds={masteredIds}
                reviewIds={reviewIds}
                allWords={allWords}
                wordWrongStats={wordWrongStats}
                sections={sections}
              />
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#64748B] mt-6">
        <p>© 2026 Unit 1: Leisure Time - Tiếng Anh 8 Global Success | Luyện từ vựng thông minh</p>
      </footer>
    </div>
  );
}
