import React from 'react';
import { WordItem } from '../../data/vocabularyData';

interface ReportTabProps {
  score: number;
  masteredIds: Set<number>;
  reviewIds: Set<number>;
  allWords: WordItem[];
  wordWrongStats: Record<number, number>;
  sections: string[];
}

export const ReportTab: React.FC<ReportTabProps> = ({
  score,
  masteredIds,
  reviewIds,
  allWords,
  wordWrongStats,
  sections,
}) => {
  const totalWords = allWords.length;
  const masteredCount = masteredIds.size;
  const reviewCount = reviewIds.size;
  const masteryRate = Math.round((masteredCount / totalWords) * 100);

  // Sort words by wrong count descending
  const wrongWordsList = allWords
    .filter((w) => (wordWrongStats[w.id] || 0) > 0 || reviewIds.has(w.id))
    .sort((a, b) => (wordWrongStats[b.id] || 0) - (wordWrongStats[a.id] || 0));

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full gap-6">
      {/* 4 STAT BOXES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Box 1: Tổng điểm */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm text-center">
          <i className="fa-solid fa-trophy text-[#F59E42] text-2xl mb-1 block"></i>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Tổng Điểm
          </span>
          <span className="text-2xl font-black text-[#3B82C4]">{score}</span>
        </div>

        {/* Box 2: Số từ Đã Ghi Nhớ */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm text-center">
          <i className="fa-solid fa-circle-check text-[#4ADE80] text-2xl mb-1 block"></i>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Đã Ghi Nhớ
          </span>
          <span className="text-2xl font-black text-[#4ADE80]">{masteredCount} từ</span>
        </div>

        {/* Box 3: Số từ Cần Ôn Lại */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm text-center">
          <i className="fa-solid fa-circle-xmark text-[#F87171] text-2xl mb-1 block"></i>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Cần Ôn Lại
          </span>
          <span className="text-2xl font-black text-[#F87171]">{reviewCount} từ</span>
        </div>

        {/* Box 4: Tỷ Lệ Thuộc (%) */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm text-center">
          <i className="fa-solid fa-chart-line text-[#3B82C4] text-2xl mb-1 block"></i>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Tỷ Lệ Thuộc
          </span>
          <span className="text-2xl font-black text-[#3B82C4]">{masteryRate}%</span>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#334155] flex items-center gap-2">
            <i className="fa-solid fa-bars-progress text-[#3B82C4]"></i>
            <span>Tiến độ hoàn thành toàn bộ Unit 1</span>
          </h3>
          <span className="text-xs font-bold text-[#3B82C4]">{masteredCount}/{totalWords} từ</span>
        </div>

        {/* Bar */}
        <div className="w-full bg-[#E2E8F0] h-4 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-[#4ADE80] h-full rounded-full transition-all duration-500"
            style={{ width: `${masteryRate}%` }}
          ></div>
        </div>
      </div>

      {/* SECTION BREAKDOWN PROGRESS BARS */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <h3 className="text-sm font-bold text-[#334155] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-[#3B82C4]"></i>
          <span>Tiến độ theo từng Phần (Section)</span>
        </h3>

        <div className="space-y-3.5">
          {sections.map((sec) => {
            const secWords = allWords.filter((w) => w.section === sec);
            const secMastered = secWords.filter((w) => masteredIds.has(w.id)).length;
            const secPercent =
              secWords.length > 0 ? Math.round((secMastered / secWords.length) * 100) : 0;

            return (
              <div key={sec} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#334155]">
                  <span>{sec}</span>
                  <span className="text-[#64748B]">{secMastered}/{secWords.length} ({secPercent}%)</span>
                </div>
                <div className="w-full bg-[#FDFBF7] border border-[#E2E8F0] h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-[#3B82C4] h-full rounded-full transition-all duration-500"
                    style={{ width: `${secPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOST FREQUENT MISTAKES LIST */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <h3 className="text-sm font-bold text-[#334155] mb-3 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-[#F87171]"></i>
          <span>Danh sách từ hay trả lời sai / Cần chú ý ôn tập</span>
        </h3>

        {wrongWordsList.length === 0 ? (
          <p className="text-xs text-[#64748B] italic py-2">
            Tuyệt vời! Bạn chưa trả lời sai từ nào trong phiên học này.
          </p>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {wrongWordsList.map((word) => {
              const wrongTimes = wordWrongStats[word.id] || 0;
              return (
                <div key={word.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#334155] text-sm">{word.word}</span>
                    <span className="text-[#64748B] ml-2">/{word.ipa}/</span>
                    <span className="block text-[#64748B] italic">{word.meaning} ({word.section})</span>
                  </div>
                  <div className="text-right">
                    {wrongTimes > 0 && (
                      <span className="bg-[#FEF2F2] border border-[#F87171] text-[#F87171] font-bold px-2 py-0.5 rounded text-[11px] block">
                        Sai {wrongTimes} lần
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
