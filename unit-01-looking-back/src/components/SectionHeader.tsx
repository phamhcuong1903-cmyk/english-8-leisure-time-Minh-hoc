import React from 'react';

interface SectionHeaderProps {
  sectionIndex: number;
  totalSections: number;
  title: string;
  instruction: string;
  type: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionIndex,
  totalSections,
  title,
  instruction,
  type,
}) => {
  const getTypeBadge = () => {
    switch (type) {
      case 'fill-blank':
        return { label: 'Dạng I: Điền từ phù hợp', icon: 'fa-pen-to-square', color: 'bg-[#DBEAFE] text-[#3B82C4]' };
      case 'sentence-building':
        return { label: 'Dạng II: Viết câu hoàn chỉnh', icon: 'fa-align-left', color: 'bg-[#FFEDD5] text-[#F59E42]' };
      case 'verb-form':
        return { label: 'Dạng III: Chia động từ', icon: 'fa-spell-check', color: 'bg-[#E0E7FF] text-[#4F46E5]' };
      case 'passage':
        return { label: 'Dạng IV: Hoàn thành đoạn văn', icon: 'fa-book-open', color: 'bg-[#FCE7F3] text-[#DB2777]' };
      default:
        return { label: 'Bài tập', icon: 'fa-circle-question', color: 'bg-[#DBEAFE] text-[#3B82C4]' };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm border border-[#E2E8F0] mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
          <i className={`fa-solid ${badge.icon}`}></i>
          {badge.label}
        </span>
        <span className="text-xs text-[#64748B] font-semibold bg-[#FDFBF7] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
          Phần {sectionIndex + 1} / {totalSections}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-[#334155] mb-2 leading-snug">
        {title}
      </h2>

      <div className="flex items-start gap-2 text-sm text-[#64748B] bg-[#FDFBF7] p-3 rounded-lg border border-[#E2E8F0]">
        <i className="fa-solid fa-circle-info text-[#3B82C4] mt-0.5 shrink-0"></i>
        <span><strong>Hướng dẫn:</strong> {instruction}</span>
      </div>
    </div>
  );
};

