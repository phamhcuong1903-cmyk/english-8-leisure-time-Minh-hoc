import React, { useState, useMemo } from 'react';
import { quizData } from './data/quizData';
import { SectionGrading, QuestionGrading, StandardQuestion, PassageQuestions } from './types/quiz';
import { isAnswerCorrect, sounds } from './utils/quizUtils';
import { Header } from './components/Header';
import { SectionHeader } from './components/SectionHeader';
import { FillBlankQuestion } from './components/FillBlankQuestion';
import { SentenceBuildingQuestion } from './components/SentenceBuildingQuestion';
import { VerbFormQuestion } from './components/VerbFormQuestion';
import { PassageQuestion } from './components/PassageQuestion';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // User answers map e.g. { "s0_q0": "doing puzzles", "s3_b2": "reading", ... }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Section gradings map e.g. sectionGradings[0] = { sectionIndex: 0, graded: true, score: 5, ... }
  const [sectionGradings, setSectionGradings] = useState<SectionGrading[]>([
    { sectionIndex: 0, graded: false, score: 0, totalQuestions: 5, details: {} },
    { sectionIndex: 1, graded: false, score: 0, totalQuestions: 5, details: {} },
    { sectionIndex: 2, graded: false, score: 0, totalQuestions: 5, details: {} },
    { sectionIndex: 3, graded: false, score: 0, totalQuestions: 5, details: {} },
  ]);

  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const totalSections = quizData.sections.length;
  const currentSection = quizData.sections[currentSectionIndex];

  // Calculate total completed questions across entire quiz for global progress bar
  const totalQuestionsCount = 20;

  const completedQuestionsCount = useMemo(() => {
    let count = 0;
    // Section 0
    for (let q = 0; q < 5; q++) {
      if (userAnswers[`s0_q${q}`]?.trim()) count++;
    }
    // Section 1
    for (let q = 0; q < 5; q++) {
      if (userAnswers[`s1_q${q}`]?.trim()) count++;
    }
    // Section 2
    for (let q = 0; q < 5; q++) {
      if (userAnswers[`s2_q${q}`]?.trim()) count++;
    }
    // Section 3
    [2, 3, 4, 5, 6].forEach((b) => {
      if (userAnswers[`s3_b${b}`]?.trim()) count++;
    });

    return count;
  }, [userAnswers]);

  // Calculate cumulative total score across all graded sections
  const totalScore = useMemo(() => {
    return sectionGradings.reduce((sum, sg) => sum + (sg.graded ? sg.score : 0), 0);
  }, [sectionGradings]);

  // Handle single question input change
  const handleAnswerChange = (key: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [key]: val }));
    if (warningMsg) setWarningMsg(null);
  };

  // Grade current section
  const handleGradeCurrentSection = () => {
    const sec = quizData.sections[currentSectionIndex];
    const details: Record<string, QuestionGrading> = {};
    let sectionScore = 0;

    if (sec.type === 'passage') {
      const passageObj = sec.questions as PassageQuestions;
      passageObj.blanks.forEach((blank) => {
        const key = `s3_b${blank.number}`;
        const userVal = userAnswers[key] || '';
        const isCorrect = isAnswerCorrect(userVal, blank.acceptedAnswers);

        if (isCorrect) sectionScore++;

        details[key] = {
          isCorrect,
          userAnswer: userVal,
          acceptedAnswers: blank.acceptedAnswers,
          explanation: blank.explanation,
        };
      });
    } else {
      const questions = sec.questions as StandardQuestion[];
      questions.forEach((q, idx) => {
        const key = `s${currentSectionIndex}_q${idx}`;
        const userVal = userAnswers[key] || '';
        const isCorrect = isAnswerCorrect(userVal, q.acceptedAnswers);

        if (isCorrect) sectionScore++;

        details[key] = {
          isCorrect,
          userAnswer: userVal,
          acceptedAnswers: q.acceptedAnswers,
          explanation: q.explanation,
          tip: q.tip,
        };
      });
    }

    // Play feedback sound
    if (sectionScore === 5) {
      sounds.playCorrect();
    } else if (sectionScore >= 3) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }

    // Update section grading
    setSectionGradings((prev) => {
      const copy = [...prev];
      copy[currentSectionIndex] = {
        sectionIndex: currentSectionIndex,
        graded: true,
        score: sectionScore,
        totalQuestions: 5,
        details,
      };
      return copy;
    });

    setWarningMsg(null);
  };

  // Advance to next section or complete review
  const handleNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished all sections!
      setIsFinished(true);
      sounds.playCompletion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Restart entire quiz
  const handleRestart = () => {
    setUserAnswers({});
    setSectionGradings([
      { sectionIndex: 0, graded: false, score: 0, totalQuestions: 5, details: {} },
      { sectionIndex: 1, graded: false, score: 0, totalQuestions: 5, details: {} },
      { sectionIndex: 2, graded: false, score: 0, totalQuestions: 5, details: {} },
      { sectionIndex: 3, graded: false, score: 0, totalQuestions: 5, details: {} },
    ]);
    setCurrentSectionIndex(0);
    setIsFinished(false);
    setWarningMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentGrading = sectionGradings[currentSectionIndex];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif antialiased">
      {/* Top Fixed Global Header */}
      <Header
        currentSectionIndex={currentSectionIndex}
        totalSections={totalSections}
        completedQuestionsCount={completedQuestionsCount}
        totalQuestionsCount={totalQuestionsCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isFinished={isFinished}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {isFinished ? (
          /* Final Results Screen */
          <ResultScreen
            quizData={quizData}
            sectionGradings={sectionGradings}
            totalScore={totalScore}
            totalQuestions={totalQuestionsCount}
            onRestart={handleRestart}
          />
        ) : (
          /* Current Active Section */
          <div className="space-y-6">
            <SectionHeader
              sectionIndex={currentSectionIndex}
              totalSections={totalSections}
              title={currentSection.sectionTitle}
              instruction={currentSection.instruction}
              type={currentSection.type}
            />

            {/* Questions area according to section type */}
            <div className="space-y-5">
              {currentSection.type === 'fill-blank' &&
                (currentSection.questions as StandardQuestion[]).map((q, idx) => {
                  const key = `s0_q${idx}`;
                  const grading = currentGrading?.details[key];
                  return (
                    <FillBlankQuestion
                      key={idx}
                      question={q}
                      index={idx}
                      value={userAnswers[key] || ''}
                      onChange={(val) => handleAnswerChange(key, val)}
                      grading={grading}
                      isGraded={currentGrading.graded}
                    />
                  );
                })}

              {currentSection.type === 'sentence-building' &&
                (currentSection.questions as StandardQuestion[]).map((q, idx) => {
                  const key = `s1_q${idx}`;
                  const grading = currentGrading?.details[key];
                  return (
                    <SentenceBuildingQuestion
                      key={idx}
                      question={q}
                      index={idx}
                      value={userAnswers[key] || ''}
                      onChange={(val) => handleAnswerChange(key, val)}
                      grading={grading}
                      isGraded={currentGrading.graded}
                    />
                  );
                })}

              {currentSection.type === 'verb-form' &&
                (currentSection.questions as StandardQuestion[]).map((q, idx) => {
                  const key = `s2_q${idx}`;
                  const grading = currentGrading?.details[key];
                  return (
                    <VerbFormQuestion
                      key={idx}
                      question={q}
                      index={idx}
                      value={userAnswers[key] || ''}
                      onChange={(val) => handleAnswerChange(key, val)}
                      grading={grading}
                      isGraded={currentGrading.graded}
                    />
                  );
                })}

              {currentSection.type === 'passage' && (() => {
                const passageData = currentSection.questions as PassageQuestions;

                // Build passage answers map e.g. { "2": "reading", "3": "messaging", ... }
                const passageAnswers: Record<string, string> = {};
                passageData.blanks.forEach((b) => {
                  passageAnswers[b.number.toString()] = userAnswers[`s3_b${b.number}`] || '';
                });

                // Build gradings map by blank number
                const gradings: Record<number, QuestionGrading> = {};
                passageData.blanks.forEach((b) => {
                  const key = `s3_b${b.number}`;
                  if (currentGrading?.details[key]) {
                    gradings[b.number] = currentGrading.details[key];
                  }
                });

                return (
                  <PassageQuestion
                    passageData={passageData}
                    answers={passageAnswers}
                    onChange={(bNum, val) => handleAnswerChange(`s3_b${bNum}`, val)}
                    gradings={gradings}
                    isGraded={currentGrading.graded}
                  />
                );
              })()}
            </div>

            {/* Warning toast if unanswered */}
            {warningMsg && (
              <div className="bg-[#FFEDD5] border border-[#F59E42] text-[#334155] p-3 rounded-xl flex items-center gap-2 text-sm">
                <i className="fa-solid fa-triangle-exclamation text-[#F59E42]"></i>
                <span>{warningMsg}</span>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-xs sm:text-sm text-[#64748B]">
                {currentGrading.graded ? (
                  <span className="flex items-center gap-2 text-[#166534] font-bold">
                    <i className="fa-solid fa-circle-check text-[#4ADE80] text-base"></i>
                    Đã chấm điểm! Số câu đúng phần này: {currentGrading.score}/5
                  </span>
                ) : (
                  <span>Lưu ý: Hoàn thành tất cả các câu trước khi kiểm tra.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {!currentGrading.graded ? (
                  <button
                    onClick={handleGradeCurrentSection}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base text-white bg-[#F59E42] hover:bg-[#e08b30] shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <i className="fa-solid fa-check-double"></i>
                    Kiểm tra phần này
                  </button>
                ) : (
                  <button
                    onClick={handleNextSection}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base text-white bg-[#3B82C4] hover:bg-[#2e6ba3] shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <span>
                      {currentSectionIndex < totalSections - 1
                        ? 'Sang phần tiếp theo'
                        : 'Hoàn thành bài ôn tập'}
                    </span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs text-[#64748B] border-t border-[#E2E8F0] bg-white">
        <p>Tiếng Anh 8 - Unit 1: Leisure Time - Looking Back | Quiz Tổng Hợp Vượt Ải</p>
      </footer>
    </div>
  );
}
