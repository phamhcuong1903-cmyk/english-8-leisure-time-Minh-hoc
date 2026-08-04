import React from 'react';

interface PartVideoProps {
  onContinue: () => void;
  onBackToGrammar: () => void;
}

export const PartVideo: React.FC<PartVideoProps> = ({ onContinue, onBackToGrammar }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[500px] py-4 px-4">
      {/* Header Bar */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center font-bold text-base shadow-xs">
            <i className="fa-solid fa-file-video text-base"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#334155] leading-tight">
              Video Hướng Dẫn Phát Âm: Âm /ʊ/ và /uː/
            </h2>
            <p className="text-xs text-[#64748B]">
              Unit 1 Pronunciation: Short /ʊ/ vs Long /uː/
            </p>
          </div>
        </div>

        <button
          onClick={onBackToGrammar}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#3B82C4] bg-[#DBEAFE] hover:bg-[#c2dcfe] rounded-lg transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Xem lại Công thức Ngữ pháp</span>
        </button>
      </div>

      {/* Intro Note Card */}
      <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center shrink-0 mt-0.5">
            <i className="fa-solid fa-headphones text-base"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#334155] mb-1">
              Phần Luyện Âm: Phân biệt hai âm /ʊ/ (ngắn) và /uː/ (dài)
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Theo dõi kỹ khẩu hình môi, lưỡi và luồng hơi trong 2 video bên dưới để phát âm chính xác các từ chứa nguyên âm <strong className="text-[#3B82C4]">/ʊ/</strong> (như <em>book, look, put</em>) và <strong className="text-[#F59E42]">/uː/</strong> (như <em>food, blue, group</em>).
            </p>
          </div>
        </div>
      </div>

      {/* 2 Embedded YouTube Videos Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Video 1: Âm /ʊ/ (UH Vowel) */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:border-[#3B82C4] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3B82C4]"></span>
                <h3 className="text-lg font-bold text-[#334155]">
                  Âm /ʊ/ (UH Vowel)
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#3B82C4]">
                Nguyên âm ngắn
              </span>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Hướng dẫn phát âm chuẩn âm /ʊ/ ngắn, môi thả lỏng tự nhiên.
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1E293B] border border-[#E2E8F0] shadow-xs">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/phlnzlzCPqE"
              title="Âm /ʊ/ (UH Vowel)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Video 2: Âm /uː/ */}
        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:border-[#F59E42] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F59E42]"></span>
                <h3 className="text-lg font-bold text-[#334155]">
                  Âm /uː/
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFEDD5] text-[#F59E42]">
                Nguyên âm dài
              </span>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Hướng dẫn phát âm chuẩn âm /uː/ dài, môi tròn và nhô ra trước.
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1E293B] border border-[#E2E8F0] shadow-xs">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/HOZngteqqzM"
              title="Âm /uː/"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>

      {/* FOOTER ACTION BUTTON: "Tiếp tục → Luyện tập phân biệt âm" COLOR #F59E42 */}
      <div className="w-full flex justify-center mt-2">
        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-3.5 text-base font-bold rounded-xl text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          style={{ backgroundColor: '#F59E42' }}
        >
          <span>Tiếp tục → Luyện tập phân biệt âm</span>
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  );
};
