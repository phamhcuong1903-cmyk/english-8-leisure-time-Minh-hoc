import React from 'react';

export const GrammarTheory: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#3B82C4] font-bold flex items-center justify-center text-xl">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#334155]">
              Tổng Quan Lý Thuyết: Động Từ Chỉ Sở Thích (Verbs of Liking)
            </h2>
            <p className="text-sm text-[#64748B]">
              Kiến thức trọng tâm Unit 1 - Tiếng Anh Lớp 8 THCS
            </p>
          </div>
        </div>

        <p className="text-base text-[#334155] leading-relaxed">
          Trong tiếng Anh, các động từ diễn tả cảm xúc, sở thích (như <em>like, love, enjoy, dislike, hate, detest, fancy, prefer</em>) khi có một hành động khác đi liền sau sẽ đi kèm với <strong>Gerund (V-ing)</strong> hoặc <strong>To-Infinitive (To V)</strong>.
        </p>
      </div>

      {/* Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#DBEAFE]">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider block">
              NHÓM 1
            </span>
            <h3 className="text-lg font-bold text-[#1E3A8A] mt-0.5">
              Động Từ CHỈ ĐI VỚI V-ING (Gerund Only)
            </h3>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <p className="text-sm text-[#64748B]">
              Các động từ này <strong>bắt buộc</strong> phải theo sau bởi danh động từ (V-ing), không bao giờ dùng dạng to-V.
            </p>

            <div className="space-y-2">
              {[
                { verb: 'enjoy', meaning: 'Thích, thưởng thức', eg: 'She enjoys knitting sweaters.' },
                { verb: 'dislike', meaning: 'Không thích', eg: 'My cousin dislikes cooking.' },
                { verb: 'fancy', meaning: 'Thích, muốn', eg: 'Do you fancy going to the cinema?' },
                { verb: 'detest', meaning: 'Ghét cay ghét đắng', eg: 'I detest hunting animals.' },
              ].map((item) => (
                <div key={item.verb} className="p-3 bg-[#FAFBFD] rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#3B82C4]">{item.verb}</span>
                    <span className="text-xs text-[#64748B] italic">{item.meaning}</span>
                  </div>
                  <p className="text-xs text-[#334155] mt-1">
                    👉 <em>{item.eg}</em>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#FFEDD5]">
            <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider block">
              NHÓM 2
            </span>
            <h3 className="text-lg font-bold text-[#9A3412] mt-0.5">
              Động Từ ĐI VỚI CẢ V-ING VÀ TO-V
            </h3>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <p className="text-sm text-[#64748B]">
              Các động từ này có thể đi với <strong>CẢ V-ing lẫn To-V</strong> mà nghĩa không có sự khác biệt rõ rệt.
            </p>

            <div className="space-y-2">
              {[
                { verb: 'like', meaning: 'Thích', eg: 'likes surfing / likes to surf the net' },
                { verb: 'love', meaning: 'Yêu thích', eg: 'loves swimming / loves to swim' },
                { verb: 'hate', meaning: 'Ghét', eg: 'hates going / hates to go shopping' },
                { verb: 'prefer', meaning: 'Thích hơn', eg: 'prefers doing / prefers to do DIY' },
              ].map((item) => (
                <div key={item.verb} className="p-3 bg-[#FAFBFD] rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#F59E42]">{item.verb}</span>
                    <span className="text-xs text-[#64748B] italic">{item.meaning}</span>
                  </div>
                  <p className="text-xs text-[#334155] mt-1">
                    👉 <em>{item.eg}</em>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Formula Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] space-y-3">
        <h3 className="text-lg font-bold text-[#334155] flex items-center gap-2">
          <i className="fa-solid fa-key text-[#F59E42]"></i>
          <span>Lưu ý quan trọng khi làm bài thi:</span>
        </h3>
        <ul className="space-y-2 text-sm text-[#334155]">
          <li className="flex items-start gap-2">
            <span className="text-[#4ADE80] font-bold">✓</span>
            <span>Luôn chú ý <strong>chia động từ chính</strong> theo thì của câu (ví dụ: thì hiện tại đơn với ngôi thứ 3 số ít cần thêm <em>-s/-es</em>: <em>likes, dislikes, hates, enjoys</em>).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#4ADE80] font-bold">✓</span>
            <span>Ghi nhớ quy tắc gấp đôi phụ âm khi thêm <em>-ing</em>: <em>knit → knitting</em>, <em>swim → swimming</em>.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
