import React from 'react';
import { LessonItem } from '../data/lessons';

interface LessonCardProps {
  lesson: LessonItem;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <a
      id={`lesson-card-${lesson.id}`}
      href={lesson.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#3B82C4] hover:shadow-md cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#3B82C4] focus:ring-offset-2"
    >
      {/* Top row: Icon & Lesson Number Badge */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div
            id={`icon-wrapper-${lesson.id}`}
            className="w-14 h-14 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#3B82C4] text-2xl transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#3B82C4] group-hover:text-white"
          >
            <i className={lesson.iconClass} aria-hidden="true"></i>
          </div>

          <span
            id={`lesson-number-${lesson.id}`}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#F59E42] border border-[#F59E42]/20"
          >
            Phần {lesson.id}
          </span>
        </div>

        {/* Lesson Title */}
        <h3
          id={`lesson-title-${lesson.id}`}
          className="text-xl font-bold text-[#334155] group-hover:text-[#3B82C4] transition-colors leading-tight mb-2"
        >
          {lesson.title}
        </h3>

        {/* Lesson Description */}
        <p
          id={`lesson-desc-${lesson.id}`}
          className="text-base text-[#64748B] leading-relaxed mb-4"
        >
          {lesson.description}
        </p>
      </div>

      {/* Bottom row: Tag & Action Prompt */}
      <div className="pt-4 mt-auto border-t border-[#E2E8F0]/70 flex items-center justify-between text-sm">
        <span className="text-xs font-semibold text-[#64748B] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
          {lesson.tag}
        </span>
        <span
          id={`lesson-action-${lesson.id}`}
          className="inline-flex items-center gap-1.5 font-bold text-[#F59E42] group-hover:translate-x-0.5 transition-transform"
        >
          Vào học
          <i className="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
        </span>
      </div>
    </a>
  );
};
