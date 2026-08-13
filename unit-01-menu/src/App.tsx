import React, { useState } from 'react';
import { LESSONS } from './data/lessons';
import { LessonCard } from './components/LessonCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = LESSONS.filter((lesson) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query) ||
      lesson.tag.toLowerCase().includes(query) ||
      lesson.subtitle.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between selection:bg-[#DBEAFE] selection:text-[#3B82C4]">
      {/* Top Banner & Header */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        {/* Optional Search / Quick Filter Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <i className="fa-solid fa-magnifying-glass text-sm" aria-hidden="true"></i>
            </div>
            <input
              id="lesson-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh bài học (VD: Từ vựng, Ngữ pháp, Quiz...)"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#334155] placeholder-[#64748B]/70 shadow-xs focus:outline-none focus:border-[#3B82C4] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Xóa tìm kiếm"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#334155]"
              >
                <i className="fa-solid fa-circle-xmark text-sm" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </div>

        {/* 9 Lessons Grid */}
        <main id="lessons-container" className="w-full">
          {filteredLessons.length > 0 ? (
            <div
              id="lessons-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div
              id="empty-search-results"
              className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center max-w-md mx-auto shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center mx-auto mb-3 text-xl">
                <i className="fa-solid fa-face-smile" aria-hidden="true"></i>
              </div>
              <h4 className="text-lg font-bold text-[#334155] mb-1">Không tìm thấy bài học</h4>
              <p className="text-sm text-[#64748B] mb-4">
                Thử tìm với từ khóa khác như "Skills", "Grammar", "Quiz" nhé!
              </p>
              <button
                id="reset-filter-btn"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82C4] text-white rounded-lg text-sm font-semibold hover:bg-[#3270a8] transition-colors"
              >
                <i className="fa-solid fa-rotate-left"></i>
                Xem tất cả 9 bài học
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
