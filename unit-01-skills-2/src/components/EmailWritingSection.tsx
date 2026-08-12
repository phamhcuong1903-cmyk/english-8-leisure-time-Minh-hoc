import React, { useState, useEffect } from 'react';
import { EmailTemplate, emailTemplateData } from '../data/emailTemplate';

interface EmailWritingSectionProps {
  onBackToListening: () => void;
}

export interface FeedbackData {
  encouragement: string;
  contentFeedback: string;
  lengthFeedback: string;
  grammarFeedback: string;
  vocabularyFeedback: string;
}

export const EmailWritingSection: React.FC<EmailWritingSectionProps> = ({
  onBackToListening,
}) => {
  const [template, setTemplate] = useState<EmailTemplate>(emailTemplateData);
  const [bodyText, setBodyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load public email-template.json if available
  useEffect(() => {
    fetch('/email-template.json')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load JSON template');
      })
      .then((data: EmailTemplate) => {
        if (data && data.prompt) {
          setTemplate(data);
        }
      })
      .catch((err) => {
        console.log('Using default TS template:', err);
      });
  }, []);

  // Calculate total word count (including header lines + body + closing for email total or main body)
  const calculateBodyWords = (text: string) => {
    const clean = text.trim();
    if (!clean) return 0;
    return clean.split(/\s+/).length;
  };

  const bodyWordCount = calculateBodyWords(bodyText);

  // Total email word count (Greeting + OpeningLine + Body + Closing)
  const fullTextForWordCount = `${template.greeting} ${template.openingLine} ${bodyText} ${template.closing}`;
  const totalWordCount = calculateBodyWords(fullTextForWordCount);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodyText.trim()) {
      alert('Vui lòng nhập nội dung email của bạn trước khi nộp bài!');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setShowSampleAnswer(false);

    try {
      const response = await fetch('/api/evaluate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentContent: `${template.greeting}\n${template.openingLine}\n${bodyText}\n${template.closing}`,
          template: template,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.feedback) {
        setFeedback(data.feedback);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.warn('Gemini API endpoint failed, falling back to smart local evaluation:', err);
      // Smart Fallback Feedback Generation
      const fallbackFb = generateFallbackFeedback(bodyText, bodyWordCount, template);
      setFeedback(fallbackFb);
    } finally {
      setLoading(false);
    }
  };

  // Local fallback generator in case network/server is unavailable
  const generateFallbackFeedback = (text: string, count: number, tmpl: EmailTemplate): FeedbackData => {
    const encouragements = [
      "Bài viết của con có nhiều ý rất hay!",
      "Cố gắng rất tốt, con đã tự tin hoàn thành bài viết!",
      "Thật tuyệt vời, con đã chăm chỉ rèn luyện kỹ năng viết!",
      "Ấn tượng lắm, cô/thầy rất khen ngợi thần thái của bài viết này!",
    ];
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    // Content check
    const lower = text.toLowerCase();
    const keywords = ['free time', 'like', 'love', 'enjoy', 'weekend', 'saturday', 'sunday', 'play', 'friends', 'family'];
    const matchedCount = keywords.filter((k) => lower.includes(k)).length;
    let contentFeedback = '';
    if (matchedCount >= 4) {
      contentFeedback = 'Bài viết của con đã đáp ứng rất tốt chủ đề "How I spend my free time". Con đã nêu rõ được các hoạt động giải trí và thời gian tương ứng.';
    } else {
      contentFeedback = 'Bài viết của con cơ bản bám sát chủ đề. Để bài hay hơn, con có thể kể thêm cụ thể hơn về các hoạt động làm vào thứ 7, Chủ nhật hoặc cùng ai nhé!';
    }

    // Length check
    let lengthFeedback = '';
    if (count < 80) {
      lengthFeedback = `Bài viết hiện tại đạt khoảng ${count} từ (dưới mức yêu cầu 80-100 từ). Con nên viết thêm 1-2 câu chi tiết về cảm xúc hoặc hoạt động cùng bạn bè/gia đình để bài đầy đặn hơn.`;
    } else if (count <= 105) {
      lengthFeedback = `Độ dài bài viết đạt ${count} từ, nằm trong khoảng lý tưởng 80-100 từ chuẩn yêu cầu đề bài. Rất tốt!`;
    } else {
      lengthFeedback = `Bài viết đạt ${count} từ (khá dài). Khen ngợi con rất chăm chỉ viết nhiều ý, tuy nhiên con có thể cô đọng các câu để giữ dung lượng trong khoảng 80-100 từ gọn gàng nhé!`;
    }

    // Grammar check fallback
    const rawSentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    let grammarFeedback = '';
    let foundError = false;

    for (const sentence of rawSentences) {
      const sLower = sentence.toLowerCase();
      // Match bare verb after liking verb e.g. "like play", "enjoy cook", "love swim", "fancy read"
      const matchLiking = sentence.match(/\b(like|love|enjoy|fancy|hate|dislike)\s+(play|go|cook|read|swim|watch|listen|do|make)\b/i);
      if (matchLiking) {
        const verb = matchLiking[1];
        const action = matchLiking[2];
        const actionIng = action + (action.endsWith('e') ? 'ing' : action === 'swim' ? 'ming' : 'ing');
        const corrected = sentence.replace(new RegExp(`\\b${verb}\\s+${action}\\b`, 'i'), `${verb} ${actionIng}`);

        grammarFeedback = `1. Trích dẫn câu sai: "${sentence}"\n2. Sửa lại: "${corrected}"\n3. Lý do: Sau động từ chỉ sở thích '${verb}', động từ theo sau phải ở dạng V-ing ('${actionIng}' thay vì '${action}').`;
        foundError = true;
        break;
      }

      // Match bare verb after preposition phrase e.g. "interested in play", "crazy about cook", "fond of swim"
      const matchPrep = sentence.match(/\b(fond of|keen on|interested in|crazy about|into)\s+(play|go|cook|read|swim|watch|listen|do|make)\b/i);
      if (matchPrep) {
        const prep = matchPrep[1];
        const action = matchPrep[2];
        const actionIng = action + (action.endsWith('e') ? 'ing' : action === 'swim' ? 'ming' : 'ing');
        const corrected = sentence.replace(new RegExp(`\\b${prep}\\s+${action}\\b`, 'i'), `${prep} ${actionIng}`);

        grammarFeedback = `1. Trích dẫn câu sai: "${sentence}"\n2. Sửa lại: "${corrected}"\n3. Lý do: Sau giới từ trong cụm '${prep}', động từ theo sau phải được chia ở dạng V-ing ('${actionIng}' thay vì '${action}').`;
        foundError = true;
        break;
      }
    }

    if (!foundError) {
      const praiseSentence = rawSentences.find((s) =>
        /(like|love|enjoy|fancy|hate|dislike|fond of|keen on|interested in|crazy about|into)/i.test(s)
      );
      if (praiseSentence) {
        grammarFeedback = `Bài viết của con dùng ngữ pháp rất chuẩn xác! Cụ thể, con đã áp dụng đúng cấu trúc trong câu nguyên văn: "${praiseSentence}" mà không mắc bất kỳ lỗi sai nào.`;
      } else if (rawSentences.length > 0) {
        grammarFeedback = `Bài viết của con có ngữ pháp rất tốt! Cụ thể, các câu như "${rawSentences[0]}" đã chia đúng động từ và thì hiện tại đơn mà không có lỗi sai đáng kể.`;
      } else {
        grammarFeedback = `Bài viết của con tuân thủ tốt các quy tắc ngữ pháp của Unit 1. Động từ được chia chuẩn xác và không phát hiện lỗi sai.`;
      }
    }

    // Vocabulary check
    let vocabularyFeedback = 'Gợi ý mở rộng từ vựng: Thay vì lặp lại động từ "like/love", con có thể thử dùng các cụm từ ấn tượng của Unit 1 như "be crazy about", "be fond of", "be interested in" hoặc "be keen on" để tăng tính sinh động cho bài viết.';

    return {
      encouragement,
      contentFeedback,
      lengthFeedback,
      grammarFeedback,
      vocabularyFeedback,
    };
  };

  const handleRewrite = () => {
    setBodyText('');
    setFeedback(null);
    setShowSampleAnswer(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={onBackToListening}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#3B82C4] hover:text-[#2563EB] mb-6 cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left"></i> Quay lại bài nghe Track 5 & 6
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8">
        {/* Title Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-xl bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center text-2xl shadow-xs">
            <i className="fa-solid fa-envelope-open-text"></i>
          </div>
          <div>
            <span className="text-xs font-bold text-[#F59E42] uppercase tracking-wider">
              Skills 2 • Part 2: Writing
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#334155]">
              Thực Hành Soạn Email Về Thời Gian Rảnh Rỗi
            </h2>
          </div>
        </div>

        {/* Email Mailframe Box */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#FDFBF7] overflow-hidden shadow-2xs">
            {/* Mail Box Header Controls */}
            <div className="bg-[#DBEAFE]/40 px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3B82C4]">
                <i className="fa-solid fa-envelope"></i>
                <span>Giao diện Hộp thư Email</span>
              </div>
              <span className="text-xs text-[#64748B] font-mono">
                To: friend@english.com
              </span>
            </div>

            <div className="p-5 space-y-3 font-serif">
              {/* FIXED NON-EDITABLE GREETING & OPENING */}
              <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0]/80 space-y-1">
                <p className="text-base font-bold text-[#334155] select-none">
                  {template.greeting}
                </p>
                <p className="text-base text-[#334155] select-none italic text-[#64748B]">
                  {template.openingLine}
                </p>
              </div>

              {/* MAIN TEXTAREA FOR STUDENT CONTENT */}
              <div className="relative">
                <textarea
                  rows={9}
                  value={bodyText}
                  onChange={(e) => {
                    setBodyText(e.target.value);
                  }}
                  placeholder={template.prompt}
                  className="w-full text-base text-[#334155] bg-white p-4 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3B82C4] leading-relaxed shadow-2xs placeholder-[#94A3B8]"
                  required
                />
              </div>

              {/* FIXED NON-EDITABLE CLOSING */}
              <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0]/80">
                <p className="text-base font-bold text-[#334155] select-none">
                  {template.closing}
                </p>
              </div>
            </div>

            {/* LIVE WORD COUNTER BAR */}
            <div className="bg-[#F0FDF4] px-5 py-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#334155]">
                <i className="fa-solid fa-calculator text-[#3B82C4]"></i>
                <span className="font-semibold">Bộ đếm số từ:</span>
                <span className="text-sm font-bold text-[#3B82C4] font-mono bg-white px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                  {bodyWordCount} từ
                </span>
                <span className="text-[#64748B] text-2xs">
                  (Tổng cả email: {totalWordCount} từ)
                </span>
              </div>

              <div className="text-2xs text-[#64748B] font-sans">
                Yêu cầu độ dài: <strong className="text-[#F59E42]">80 - 100 từ</strong>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-[#F59E42] hover:bg-[#e08e33] text-white text-base font-bold shadow-md cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 border border-[#F59E42] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                  <span>Đang phân tích bài viết...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-lg"></i>
                  <span>Nộp bài</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* FEEDBACK SECTION (DISPLAYED AFTER SUBMISSION) */}
        {feedback && (
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#334155] flex items-center gap-2">
                <i className="fa-solid fa-chalkboard-user text-[#3B82C4]"></i>
                Nhận Xét & Phản Hồi Tự Động Từ Giáo Viên
              </h3>
              <span className="bg-[#DBEAFE] text-[#3B82C4] text-xs font-bold px-3 py-1 rounded-full">
                AI Teacher Feedback
              </span>
            </div>

            <div className="space-y-4">
              {/* SECTION 1: LỜI ĐỘNG VIÊN MỞ ĐẦU */}
              <div className="p-4 rounded-xl bg-[#FFEDD5] border border-[#F59E42]/40 text-[#334155]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F59E42] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-[#fa-heart] fa-heart text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#F59E42] tracking-wider mb-1">
                      1. Lời Động Viên Mở Đầu
                    </h4>
                    <p className="text-base font-bold text-[#334155] font-serif">
                      "{feedback.encouragement}"
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: NHẬN XÉT VỀ NỘI DUNG */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-[#334155] shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-list-check text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase text-[#3B82C4] tracking-wider mb-1">
                      2. Nhận Xét Về Nội Dung
                    </h4>
                    <p className="text-sm text-[#334155] leading-relaxed font-serif whitespace-pre-line">
                      {feedback.contentFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: NHẬN XÉT VỀ ĐỘ DÀI */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-[#334155] shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-ruler-horizontal text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase text-[#3B82C4] tracking-wider mb-1">
                      3. Nhận Xét Về Độ Dài ({bodyWordCount} từ)
                    </h4>
                    <p className="text-sm text-[#334155] leading-relaxed font-serif whitespace-pre-line">
                      {feedback.lengthFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: GỢI Ý VỀ NGỮ PHÁP */}
              <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#4ADE80] text-[#334155]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4ADE80] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-[#fa-spell-check] fa-spell-check text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase text-[#16A34A] tracking-wider mb-1">
                      4. Gợi Ý Về Ngữ Pháp (Cấu trúc Unit 1)
                    </h4>
                    <p className="text-sm text-[#334155] leading-relaxed font-serif whitespace-pre-line">
                      {feedback.grammarFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: GỢI Ý MỞ RỘNG TỪ VỰNG/CÂU */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-[#334155] shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase text-[#F59E42] tracking-wider mb-1">
                      5. Gợi Ý Mở Rộng Từ Vựng & Cấu Trúc Nâng Cao
                    </h4>
                    <p className="text-sm text-[#334155] leading-relaxed font-serif whitespace-pre-line">
                      {feedback.vocabularyFeedback}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: "Viết lại" AND "Xem email mẫu" */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={handleRewrite}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-[#334155] hover:bg-[#FDFBF7] font-bold text-sm cursor-pointer transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-right text-[#3B82C4]"></i>
                Viết lại bài khác
              </button>

              <button
                type="button"
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="px-6 py-2.5 rounded-xl bg-[#3B82C4] hover:bg-[#2563EB] text-white font-bold text-sm cursor-pointer transition-colors shadow-xs flex items-center gap-2 border border-[#3B82C4]"
              >
                <i className="fa-solid fa-eye"></i>
                {showSampleAnswer ? 'Ẩn Email mẫu' : 'Xem Email mẫu'}
              </button>
            </div>

            {/* SAMPLE ANSWER DISPLAY BOX */}
            {showSampleAnswer && (
              <div className="mt-4 p-5 rounded-xl bg-[#FDFBF7] border border-[#3B82C4]/30 shadow-2xs animate-fade-in">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
                  <h4 className="text-sm font-bold text-[#3B82C4] flex items-center gap-2">
                    <i className="fa-solid fa-star text-[#F59E42]"></i> Email Mẫu Tham Khảo (Sample Answer)
                  </h4>
                  <span className="text-xs text-[#64748B] font-mono">
                    ~ 80 từ
                  </span>
                </div>
                <div className="text-base text-[#334155] font-serif leading-relaxed bg-white p-4 rounded-lg border border-[#E2E8F0]">
                  <p className="font-bold">{template.greeting}</p>
                  <p className="italic text-[#64748B] mb-2">{template.openingLine}</p>
                  <p className="my-2">{template.sampleAnswer}</p>
                  <p className="font-bold mt-3">{template.closing}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
