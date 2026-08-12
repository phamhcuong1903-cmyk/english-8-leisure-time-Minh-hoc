import React, { useState, useEffect } from 'react';
import { UsefulQuestion, SpeechEvaluation } from '../types';
import { speakText, stopSpeech, isSpeechRecognitionSupported, createSpeechRecognizer } from '../utils/speech';

interface DialogueViewProps {
  questions: UsefulQuestion[];
  onBackToReading: () => void;
}

export const DialogueView: React.FC<DialogueViewProps> = ({ questions, onBackToReading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [evaluation, setEvaluation] = useState<SpeechEvaluation | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognizer) {
        try {
          recognizer.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [recognizer]);

  // Reset answer when changing question
  const handleSelectQuestion = (index: number) => {
    stopSpeech();
    if (isRecording && recognizer) {
      recognizer.stop();
      setIsRecording(false);
    }
    setCurrentIndex(index);
    setRecordedText('');
    setEvaluation(null);
    setShowSampleAnswer(false);
  };

  const handleSpeakQuestion = () => {
    stopSpeech();
    setIsPlayingAudio(true);
    speakText(currentQ.question, 0.9, undefined, () => setIsPlayingAudio(false));
  };

  const handleSpeakPhrase = (phrase: string) => {
    stopSpeech();
    speakText(phrase.replace('[activity]', 'swimming'), 0.9);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognizer) {
        recognizer.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể tự gõ văn bản hoặc sử dụng Chrome/Edge mới nhất.');
      return;
    }

    setRecordedText('');
    setEvaluation(null);

    const newRecognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setRecordedText(transcript);
        if (isFinal) {
          evaluateResponse(transcript);
        }
      },
      (error) => {
        console.error('Speech error:', error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (newRecognizer) {
      setRecognizer(newRecognizer);
      try {
        newRecognizer.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsRecording(false);
      }
    }
  };

  const evaluateResponse = (text: string) => {
    const cleanText = text.trim().toLowerCase();
    if (!cleanText) return;

    // Check key phrases or minimum length
    const words = cleanText.split(/\s+/);
    const score = Math.min(100, Math.max(30, words.length * 10 + (cleanText.length > 20 ? 30 : 0)));

    // Extract matched keywords from useful language
    const matchedKeywords: string[] = [];
    currentQ.usefulLanguage.forEach((lang) => {
      const simplified = lang.toLowerCase().replace(/[^\w\s]/g, '');
      const parts = simplified.split(' ');
      parts.forEach((p) => {
        if (p.length > 3 && cleanText.includes(p) && !matchedKeywords.includes(p)) {
          matchedKeywords.push(p);
        }
      });
    });

    const isGood = score >= 60 || words.length >= 5;

    let feedback = '';
    const suggestions: string[] = [];

    if (isGood) {
      feedback = 'Xuất sắc! Bạn đã trả lời đúng trọng tâm và nói rất lưu loát.';
      if (matchedKeywords.length > 0) {
        suggestions.push(`Bạn đã vận dụng tốt từ ngữ: ${matchedKeywords.join(', ')}`);
      }
      suggestions.push(currentQ.depthPrompt);
    } else {
      feedback = 'Câu trả lời hơi ngắn. Hãy dùng thêm mẫu câu gợi ý bên trên để nói chi tiết hơn nhé!';
      suggestions.push('Gợi ý: Thử ghép mẫu câu "I usually..." hoặc "The activity I like..."');
    }

    setEvaluation({
      transcript: text,
      isGood,
      score,
      feedback,
      matchedKeywords,
      suggestions,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recordedText) {
      evaluateResponse(recordedText);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToReading}
          className="flex items-center gap-2 text-[#3B82C4] hover:text-[#1E40AF] font-bold text-sm bg-white px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-xs transition-all hover:bg-[#DBEAFE]/30"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Quay lại Bài đọc</span>
        </button>

        <div className="flex items-center gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(idx)}
              className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                currentIndex === idx
                  ? 'bg-[#F59E42] text-white shadow-xs scale-105'
                  : 'bg-white text-[#64748B] hover:text-[#334155] border border-[#E2E8F0]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dialogue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8 relative mb-8">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
          <span className="text-xs font-bold text-[#F59E42] bg-[#FFEDD5] px-3 py-1 rounded-full uppercase tracking-wider">
            Luyện Nói • Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs text-[#64748B]">Grade 7 Speaking Practice</span>
        </div>

        {/* Question Display */}
        <div className="mb-6 bg-[#FDFBF7] p-5 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-start gap-4">
            <button
              onClick={handleSpeakQuestion}
              className={`w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#3B82C4] hover:bg-[#3B82C4] hover:text-white flex items-center justify-center text-xl flex-shrink-0 transition-all shadow-xs ${
                isPlayingAudio ? 'animate-pulse bg-[#3B82C4] text-white' : ''
              }`}
              title="Nghe câu hỏi"
            >
              <i className="fa-solid fa-volume-high"></i>
            </button>
            <div className="flex-1">
              <span className="text-xs font-bold text-[#3B82C4] uppercase block mb-1">
                Câu hỏi luyện tập:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#334155] font-serif leading-snug">
                "{currentQ.question}"
              </h3>
            </div>
          </div>
        </div>

        {/* Useful Language Section */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-[#F59E42]"></i>
            <span>Mẫu câu gợi ý (Useful Language):</span>
          </h4>
          <div className="space-y-2">
            {currentQ.usefulLanguage.map((phrase, pIdx) => (
              <div
                key={pIdx}
                onClick={() => handleSpeakPhrase(phrase)}
                className="bg-[#FDFBF7] hover:bg-[#DBEAFE]/40 border border-[#E2E8F0] hover:border-[#3B82C4] p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all group"
              >
                <span className="text-sm font-medium text-[#334155] font-serif">
                  {phrase}
                </span>
                <span className="text-xs text-[#3B82C4] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <i className="fa-solid fa-volume-low"></i> Nghe
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pronunciation Tip & Depth Prompt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pronunciation Tip */}
          <div className="bg-[#DBEAFE]/40 border border-[#3B82C4]/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-[#3B82C4] font-bold text-xs uppercase">
              <i className="fa-solid fa-microphone-lines"></i>
              <span>Gợi ý phát âm (Pronunciation Tip):</span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              {currentQ.pronunciationTip}
            </p>
          </div>

          {/* Depth Prompt */}
          <div className="bg-[#FFEDD5]/50 border border-[#F59E42]/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-[#D97706] font-bold text-xs uppercase">
              <i className="fa-solid fa-comments"></i>
              <span>Gợi ý mở rộng (Depth Prompt):</span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              {currentQ.depthPrompt}
            </p>
          </div>
        </div>

        {/* Speech Input & Recording Box */}
        <div className="mb-6 bg-[#FDFBF7] p-5 rounded-xl border border-[#E2E8F0]">
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
            Thực hành nói câu trả lời của con:
          </label>

          <form onSubmit={handleManualSubmit}>
            <div className="relative mb-3">
              <textarea
                value={recordedText}
                onChange={(e) => setRecordedText(e.target.value)}
                placeholder="Nhấp vào nút ghi âm màu cam bên dưới để bắt đầu nói, hoặc tự gõ câu trả lời của con..."
                rows={3}
                className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#334155] focus:outline-none focus:border-[#F59E42] focus:ring-1 focus:ring-[#F59E42] transition-all font-serif resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Record Button */}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-xs ${
                  isRecording
                    ? 'bg-[#F87171] text-white animate-pulse'
                    : 'bg-[#F59E42] text-white hover:bg-[#E08A2E]'
                }`}
              >
                <i className={`fa-solid ${isRecording ? 'fa-square' : 'fa-microphone'}`}></i>
                <span>{isRecording ? 'Đang ghi âm (Bấm để dừng)' : 'Bấm vào đây để Ghi Âm'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!recordedText.trim()}
                  className="px-4 py-2.5 bg-[#3B82C4] hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Đánh giá câu trả lời</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="px-3.5 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#334155] rounded-xl font-bold text-xs transition-all flex items-center gap-1"
                >
                  <i className="fa-solid fa-eye"></i>
                  <span>{showSampleAnswer ? 'Ẩn mẫu' : 'Xem câu mẫu'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Sample Answer Display */}
          {showSampleAnswer && currentQ.sampleAnswer && (
            <div className="mt-4 p-3.5 rounded-lg bg-[#DBEAFE]/40 border border-[#3B82C4]/30 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#3B82C4]">Câu trả lời mẫu tham khảo:</span>
                <button
                  onClick={() => speakText(currentQ.sampleAnswer!, 0.9)}
                  className="text-xs text-[#3B82C4] font-semibold flex items-center gap-1 hover:underline"
                >
                  <i className="fa-solid fa-volume-high"></i> Nghe đọc mẫu
                </button>
              </div>
              <p className="text-sm font-serif italic text-[#334155]">
                "{currentQ.sampleAnswer}"
              </p>
            </div>
          )}
        </div>

        {/* Feedback Section - Strictly matching specific color guidelines */}
        {/*
          Đúng: viền/icon #4ADE80, nền #F0FDF4
          Sai: viền/icon #F87171, nền #FEF2F2
        */}
        {evaluation && (
          <div
            className={`p-5 rounded-xl border-2 transition-all animate-fadeIn ${
              evaluation.isGood
                ? 'bg-[#F0FDF4] border-[#4ADE80]'
                : 'bg-[#FEF2F2] border-[#F87171]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                  evaluation.isGood
                    ? 'bg-[#4ADE80] text-white'
                    : 'bg-[#F87171] text-white'
                }`}
              >
                <i
                  className={`fa-solid ${
                    evaluation.isGood ? 'fa-circle-check' : 'fa-circle-xmark'
                  }`}
                ></i>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-bold text-base ${
                      evaluation.isGood ? 'text-[#15803D]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {evaluation.isGood ? 'Kết quả: Tốt / Chính xác' : 'Kết quả: Cần hoàn thiện thêm'}
                  </h4>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      evaluation.isGood
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEE2E2] text-[#B91C1C]'
                    }`}
                  >
                    Đánh giá: {evaluation.score}/100
                  </span>
                </div>

                <p className="text-sm font-medium text-[#334155] mb-2">
                  {evaluation.feedback}
                </p>

                {evaluation.suggestions.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-black/5">
                    {evaluation.suggestions.map((sug, sIdx) => (
                      <p key={sIdx} className="text-xs text-[#64748B] flex items-center gap-1.5">
                        <i className="fa-solid fa-chevron-right text-[10px]"></i>
                        <span>{sug}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Next/Prev Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] mt-6">
          <button
            onClick={() => handleSelectQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#334155] disabled:opacity-40 font-bold text-sm rounded-xl transition-all hover:bg-[#FDFBF7] flex items-center gap-1.5"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
            <span>Câu trước</span>
          </button>

          <span className="text-xs font-semibold text-[#64748B]">
            {currentIndex + 1} / {questions.length}
          </span>

          <button
            onClick={() => handleSelectQuestion(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 bg-[#3B82C4] hover:bg-[#1E40AF] disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Câu tiếp</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
