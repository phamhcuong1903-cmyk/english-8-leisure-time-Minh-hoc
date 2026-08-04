import React, { useState } from 'react';
import { PREPOSITION_STRUCTURES } from '../data/sentences';

interface PartBGrammarProps {
  onContinue: () => void;
  onReplayAnimation: () => void;
}

export const PartBGrammar: React.FC<PartBGrammarProps> = ({ onContinue, onReplayAnimation }) => {
  const [selectedStructureId, setSelectedStructureId] = useState<string>('keen_on');

  const selectedStructure = PREPOSITION_STRUCTURES.find((s) => s.id === selectedStructureId) || PREPOSITION_STRUCTURES[0];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[500px] py-4 px-4">
      {/* Top Header Card */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center font-bold text-base shadow-xs">
            B
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#334155] leading-tight">
              Phần B: Cấu trúc & Quy tắc Ngữ pháp
            </h2>
            <p className="text-xs text-[#64748B]">
              Unit 1: Prepositions following Adjectives of Fondness
            </p>
          </div>
        </div>

        <button
          onClick={onReplayAnimation}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#3B82C4] bg-[#DBEAFE] hover:bg-[#c2dcfe] rounded-lg transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-rotate-right text-xs"></i>
          <span>Xem lại Animation câu ví dụ</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-6 md:p-8 space-y-8">

        {/* 1. GRAMMAR FORMULA DISPLAY */}
        <div className="w-full flex flex-col items-center justify-center text-center bg-[#FDFBF7] border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#F59E42] text-xs font-bold uppercase tracking-wide mb-4">
            <i className="fa-solid fa-book-bookmark"></i>
            <span>Công thức trọng tâm</span>
          </div>

          {/* Color-Coded Formula */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-2xl sm:text-3xl md:text-4xl font-extrabold my-2 select-none">
            <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-xl text-[#3B82C4] shadow-xs" title="S = Chủ ngữ (Subject)">
              S
            </span>
            <span className="text-[#64748B] font-normal">+</span>
            <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-xl text-[#A78BFA] shadow-xs" title="be = Động từ To Be (am / is / are)">
              be
            </span>
            <span className="text-[#64748B] font-normal">+</span>
            <span className="px-3 py-1 bg-[#FFEDD5] border border-[#F59E42] rounded-xl text-[#F59E42] shadow-xs" title="Tính từ chỉ sở thích">
              keen
            </span>
            <span className="text-[#64748B] font-normal">+</span>
            <span className="px-3.5 py-1 bg-[#FEF2F2] border border-[#F87171] rounded-xl text-[#EF4444] shadow-xs" title="Giới từ cố định đi kèm">
              on
            </span>
            <span className="text-[#64748B] font-normal">+</span>
            <span className="px-3.5 py-1 bg-[#F0FDF4] border border-[#4ADE80] rounded-xl text-[#10B981] shadow-xs" title="Danh từ (Noun) hoặc Động từ đuôi -ing (V-ing)">
              N / V-ing
            </span>
          </div>

          {/* Component Labels Legend */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-[#64748B]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82C4]"></span> S: Chủ ngữ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]"></span> be: am/is/are
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E42]"></span> keen: Tính từ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> on: Giới từ
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> N / V-ing: Danh từ / V-ing
            </span>
          </div>
        </div>

        {/* 2. EXPLANATION PARAGRAPH */}
        <div className="bg-[#FDFBF7] border-l-4 border-[#3B82C4] rounded-r-xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-circle-info text-[#3B82C4] text-xl mt-0.5"></i>
            <div>
              <h3 className="text-base font-bold text-[#334155] mb-1">
                Quy tắc sử dụng Giới từ đi kèm Tính từ
              </h3>
              <p className="text-sm md:text-base text-[#334155] leading-relaxed">
                Trong tiếng Anh, sau nhiều tính từ chỉ cảm xúc/sở thích, luôn phải có một giới từ đi kèm cố định — không phải giới từ nào cũng được, và không thể bỏ qua.
              </p>
            </div>
          </div>
        </div>

        {/* 3. EXAMPLE ILLUSTRATION BOX (BACKGROUND #DBEAFE) */}
        <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-xl p-6 shadow-xs relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3B82C4] text-white p-1.5 rounded-lg text-xs font-bold flex items-center justify-center">
              <i className="fa-solid fa-lightbulb"></i>
            </span>
            <h4 className="text-base font-bold text-[#1E3A8A]">
              Ví dụ minh hoạ chi tiết
            </h4>
          </div>

          <p className="text-sm md:text-base text-[#1E3A8A] leading-relaxed mb-4">
            '<strong>on</strong>' là giới từ, nên theo sau nó phải là danh từ hoặc V-ing (không dùng to-infinitive). Vì thế câu:
          </p>

          {/* Example Sentence Box */}
          <div className="bg-white border border-[#BFDBFE] rounded-xl p-4 my-3 text-center shadow-xs">
            <p className="text-lg md:text-xl font-bold text-[#334155]">
              "Actually, I'm keen on{' '}
              <span className="text-[#F59E42] underline decoration-2 underline-offset-4 font-black bg-[#FFEDD5] px-2 py-0.5 rounded-md">
                many DIY activities
              </span>
              "
            </p>
          </div>

          <p className="text-sm md:text-base text-[#1E3A8A] leading-relaxed mt-3">
            dùng '<span className="text-[#F59E42] font-extrabold bg-white px-2 py-0.5 rounded border border-[#FFEDD5]">many DIY activities</span>' (danh từ) chứ không phải 'to do DIY'.
          </p>
        </div>

        {/* INTERACTIVE STRUCTURE TOGGLER FOR ALL 5 ADJECTIVES */}
        <div className="border border-[#E2E8F0] rounded-xl p-5 bg-[#FDFBF7]">
          <h4 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-[#3B82C4]"></i>
            Mở rộng: 5 Cấu trúc Tính từ + Giới từ đã gặp trong Phần A
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            {PREPOSITION_STRUCTURES.map((struct) => (
              <button
                key={struct.id}
                onClick={() => setSelectedStructureId(struct.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  selectedStructureId === struct.id
                    ? 'bg-white border-[#F59E42] text-[#F59E42] shadow-sm ring-2 ring-[#FFEDD5]'
                    : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#DBEAFE]'
                }`}
              >
                {struct.adjective} {struct.preposition}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-lg font-bold text-[#334155]">
                be <span style={{ color: selectedStructure.color }}>{selectedStructure.adjective} {selectedStructure.preposition}</span> + N / V-ing
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDFBF7] text-[#64748B] border border-[#E2E8F0]">
                Ý nghĩa: {selectedStructure.meaning}
              </span>
            </div>

            <p className="text-sm text-[#334155] italic">
              Ví dụ: "{selectedStructure.exampleSentence}"
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER ACTION BUTTON: "Tiếp tục" COLOR #F59E42 */}
      <div className="w-full flex justify-center mt-8">
        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-3.5 text-base font-bold rounded-xl text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          style={{ backgroundColor: '#F59E42' }}
        >
          <span>Tiếp tục: Luyện tập & Củng cố</span>
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  );
};
