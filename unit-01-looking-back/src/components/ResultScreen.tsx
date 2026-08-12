import React, { useState } from 'react';
import { SectionGrading, QuizData } from '../types/quiz';

interface ResultScreenProps {
  quizData: QuizData;
  sectionGradings: SectionGrading[];
  totalScore: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  quizData,
  sectionGradings,
  totalScore,
  totalQuestions,
  onRestart,
}) => {
  const [activeTab, setActiveTab] = useState<number | 'all'>('all');

  const percentage = Math.round((totalScore / totalQuestions) * 100);

  // Encouragement praise message logic based on percentage
  const getPraise = () => {
    if (percentage >= 90) {
      return {
        title: 'Xuất sắc! 🎉',
        message: 'Con đã nắm rất vững Unit 1 rồi!',
        color: 'text-[#166534]',
        bg: 'bg-[#F0FDF4]',
        border: 'border-[#4ADE80]',
        badgeBg: 'bg-[#4ADE80]',
        icon: 'fa-trophy text-[#F59E42]',
      };
    } else if (percentage >= 70) {
      return {
        title: 'Rất tốt! 🌟',
        message: 'Con đã hiểu bài khá chắc.',
        color: 'text-[#3B82C4]',
        bg: 'bg-[#DBEAFE]/40',
        border: 'border-[#3B82C4]',
        badgeBg: 'bg-[#3B82C4]',
        icon: 'fa-star text-[#3B82C4]',
      };
    } else {
      return {
        title: 'Cố gắng lên nào! 💪',
        message: 'Con đã cố gắng rồi! Hãy xem lại phần giải thích và thử lại nhé.',
        color: 'text-[#F59E42]',
        bg: 'bg-[#FFEDD5]/50',
        border: 'border-[#F59E42]',
        badgeBg: 'bg-[#F59E42]',
        icon: 'fa-heart text-[#F59E42]',
      };
    }
  };

  const praise = getPraise();

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fade-in">
      {/* Primary Score Banner */}
      <div className={`bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 shadow-sm border ${praise.border} text-center relative overflow-hidden`}>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3B82C4] via-[#F59E42] to-[#4ADE80]"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FDFBF7] border-4 border-[#3B82C4]/20 shadow-sm mb-4 mx-auto">
          <i className={`fa-solid ${praise.icon} text-3xl sm:text-4xl`}></i>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-extrabold ${praise.color} mb-2`}>
          {praise.title}
        </h2>

        <p className="text-base sm:text-lg text-[#334155] font-medium max-w-lg mx-auto mb-6">
          {praise.message}
        </p>

        {/* Score metrics */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#FDFBF7] p-4 rounded-xl border border-[#E2E8F0] mb-6">
          <div className="px-4 py-2 text-center border-r border-[#E2E8F0] last:border-r-0">
            <span className="block text-xs font-bold text-[#64748B] uppercase">Tổng Điểm</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#3B82C4]">
              {totalScore} / {totalQuestions}
            </span>
          </div>

          <div className="px-4 py-2 text-center border-r border-[#E2E8F0] last:border-r-0">
            <span className="block text-xs font-bold text-[#64748B] uppercase">Tỷ Lệ Đúng</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F59E42]">
              {percentage}%
            </span>
          </div>

          <div className="px-4 py-2 text-center">
            <span className="block text-xs font-bold text-[#64748B] uppercase">Kết Quả</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#166534]">
              {percentage >= 70 ? 'ĐẠT' : 'CẦN ÔN TẬP'}
            </span>
          </div>
        </div>

        {/* Action Button: Restart Entire Quiz */}
        <div>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-lg text-white bg-[#F59E42] hover:bg-[#e08b30] shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right"></i>
            Làm lại toàn bộ
          </button>
        </div>
      </div>

      {/* Breakdown per Section */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
        <h3 className="text-lg font-bold text-[#334155] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-[#3B82C4]"></i>
          Chi tiết kết quả theo từng phần:
        </h3>

        {/* Tabs for sections */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#3B82C4] text-white shadow-xs'
                : 'bg-[#FDFBF7] text-[#64748B] hover:bg-[#DBEAFE]'
            }`}
          >
            Tất cả (4 Phần)
          </button>
          {quizData.sections.map((sec, idx) => {
            const secGrading = sectionGradings[idx];
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#3B82C4] text-white shadow-xs'
                    : 'bg-[#FDFBF7] text-[#64748B] hover:bg-[#DBEAFE]'
                }`}
              >
                Phần {idx + 1} ({secGrading?.score || 0}/{secGrading?.totalQuestions || 5})
              </button>
            );
          })}
        </div>

        {/* Display section details */}
        <div className="space-y-4">
          {quizData.sections.map((sec, secIdx) => {
            if (activeTab !== 'all' && activeTab !== secIdx) return null;

            const secGrading = sectionGradings[secIdx];
            const isSectionPerfect = secGrading?.score === secGrading?.totalQuestions;

            return (
              <div
                key={secIdx}
                className="bg-[#FDFBF7] rounded-xl p-4 border border-[#E2E8F0] space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <h4 className="font-bold text-[#334155] text-sm sm:text-base">
                    Phần {secIdx + 1}: {sec.sectionTitle}
                  </h4>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isSectionPerfect
                        ? 'bg-[#4ADE80]/20 text-[#166534] border border-[#4ADE80]'
                        : 'bg-[#FFEDD5] text-[#F59E42] border border-[#F59E42]'
                    }`}
                  >
                    {secGrading?.score} / {secGrading?.totalQuestions} đúng
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2">
                  {Object.entries(secGrading?.details || {}).map(([qKey, qGrading]) => {
                    return (
                      <div
                        key={qKey}
                        className={`p-3 rounded-lg text-xs sm:text-sm border ${
                          qGrading.isCorrect
                            ? 'bg-[#F0FDF4] border-[#4ADE80] text-[#166534]'
                            : 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            <i
                              className={`fa-solid ${
                                qGrading.isCorrect ? 'fa-check text-[#4ADE80]' : 'fa-xmark text-[#F87171]'
                              }`}
                            ></i>
                            <span>Câu trả lời của con: </span>
                            <span className="underline italic">{qGrading.userAnswer || '(Bỏ trống)'}</span>
                          </span>

                          {!qGrading.isCorrect && (
                            <span className="font-semibold text-xs bg-white px-2 py-0.5 rounded border border-[#F87171]">
                              Đáp án chuẩn: {qGrading.acceptedAnswers.join(' / ')}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#334155] opacity-90 mt-1">
                          {qGrading.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
