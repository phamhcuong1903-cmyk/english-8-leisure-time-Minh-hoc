import React, { useState } from 'react';
import { SelfAssessmentData } from '../types';
import { speakText } from '../utils/speech';

interface SelfAssessmentViewProps {
  data: SelfAssessmentData;
  sessionRatings: Record<string, number>;
  setSessionRatings: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onNavigateToMindmap: () => void;
}

export const SelfAssessmentView: React.FC<SelfAssessmentViewProps> = ({
  data,
  sessionRatings,
  setSessionRatings,
  onNavigateToMindmap,
}) => {
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean;
    message: string;
    congrats: string;
  } | null>(null);

  // Handle selecting a rating level for a skill
  const handleSelectLevel = (itemId: string, levelIndex: number) => {
    setSessionRatings((prev) => ({
      ...prev,
      [itemId]: levelIndex,
    }));
  };

  // Reset ratings for current session
  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm lại bài tự đánh giá này?')) {
      setSessionRatings({});
      setSaveStatus(null);
    }
  };

  // Save handler (saves to session state, shows confirmation & congratulations)
  const handleSave = () => {
    setSaveStatus({
      show: true,
      message: 'Đã lưu kết quả tự đánh giá!',
      congrats: '🎉 Chúc mừng con đã hoàn thành Unit 1 - Leisure Time!',
    });
  };

  // Calculate statistics
  const totalItems = data.items.length;
  const answeredCount = data.items.filter(
    (item) => sessionRatings[item.id] !== undefined
  ).length;
  const completionPercentage = Math.round((answeredCount / totalItems) * 100);

  // Subtitles for the 3 levels
  const levelSubtitles = ['Cần cố gắng', 'Khá tốt', 'Thành thạo'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Navigation & Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white inline-block mb-1.5"
            style={{ backgroundColor: '#F59E42' }}
          >
            Unit 1 • Bảng tự đánh giá
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#334155]">
            Self-Assessment (Tự Đánh Giá)
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Chọn mức độ đạt được cho từng kỹ năng sau khi học xong Unit 1.
          </p>
        </div>

        <button
          onClick={onNavigateToMindmap}
          className="px-4 py-2 rounded-xl text-sm font-bold text-[#334155] bg-white border border-[#E2E8F0] hover:bg-[#FDFBF7] hover:border-[#3B82C4] shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-[#3B82C4]"></i>
          <span>← Quay lại Sơ đồ tư duy</span>
        </button>
      </div>

      {/* Main Interactive Table Card */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mb-6">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            
            {/* Header Row (Background #FFEDD5 as required) */}
            <thead style={{ backgroundColor: '#FFEDD5' }}>
              <tr className="border-b border-[#E2E8F0]">
                {/* Column 1: Title (Now I can ...) */}
                <th className="p-4 sm:p-5 text-base sm:text-lg font-bold text-[#334155] w-7/12">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-graduation-cap text-[#F59E42]"></i>
                    <span>{data.title}</span>
                  </div>
                </th>

                {/* Columns 2, 3, 4: Level headings (✓, ✓✓, ✓✓✓) */}
                {data.levels.map((lvl, lvlIdx) => (
                  <th
                    key={lvlIdx}
                    className="p-3 text-center border-l border-[#E2E8F0]/80 w-1/12"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-base sm:text-lg font-extrabold text-[#3B82C4]">
                        {lvl}
                      </span>
                      <span className="text-[11px] font-semibold text-[#64748B] mt-0.5 whitespace-nowrap">
                        {levelSubtitles[lvlIdx]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#E2E8F0]">
              {data.items.map((item, index) => {
                const selectedLevel = sessionRatings[item.id];
                const isLevel1Selected = selectedLevel === 0; // Selected ✓ (lowest level)

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FDFBF7]/70 transition-colors"
                  >
                    {/* Skill Column */}
                    <td className="p-4 sm:p-5 align-top">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#DBEAFE] text-[#3B82C4] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <p className="text-sm sm:text-base font-medium text-[#334155] leading-relaxed">
                              {item.skill}
                            </p>
                            <button
                              onClick={() => speakText(item.skill)}
                              className="p-1 rounded text-[#64748B] hover:text-[#3B82C4] hover:bg-[#DBEAFE] transition-colors cursor-pointer flex-shrink-0"
                              title="Nghe phát âm kỹ năng"
                            >
                              <i className="fa-solid fa-volume-high text-xs"></i>
                            </button>
                          </div>

                          {/* Gentle hint if student selects level 1 (✓) */}
                          {isLevel1Selected && (
                            <div className="mt-2.5 p-2.5 rounded-lg bg-[#FDFBF7] border border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B] animate-fadeIn">
                              <i className="fa-solid fa-circle-info text-[#F59E42] text-sm flex-shrink-0"></i>
                              <span>Con có thể ôn lại phần này trước khi qua Unit 2 nhé!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3 Radio Button Rating Columns */}
                    {data.levels.map((lvl, lvlIdx) => {
                      const isChecked = selectedLevel === lvlIdx;

                      return (
                        <td
                          key={lvlIdx}
                          onClick={() => handleSelectLevel(item.id, lvlIdx)}
                          className={`p-3 text-center align-middle border-l border-[#E2E8F0] cursor-pointer transition-all ${
                            isChecked ? 'bg-[#DBEAFE]' : 'hover:bg-[#FDFBF7]'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <input
                              type="radio"
                              name={`skill-${item.id}`}
                              checked={isChecked}
                              onChange={() => handleSelectLevel(item.id, lvlIdx)}
                              className="w-5 h-5 cursor-pointer accent-[#3B82C4]"
                            />
                            {isChecked && (
                              <i className="fa-solid fa-check text-xs text-[#3B82C4] font-bold"></i>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Summary Bar at Bottom of Table */}
        <div className="p-4 bg-[#FDFBF7] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center font-bold">
              <i className="fa-solid fa-clipboard-check text-base"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-[#334155]">
                Bạn đã tự đánh giá <span className="text-[#3B82C4] font-extrabold">{answeredCount}</span>/{totalItems} kỹ năng
              </p>
              <p className="text-xs text-[#64748B]">
                {answeredCount === totalItems
                  ? 'Tuyệt vời! Bạn đã hoàn thành toàn bộ bảng tự đánh giá.'
                  : `Còn ${totalItems - answeredCount} kỹ năng chưa được chọn mức độ.`}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full sm:w-48 bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B82C4] transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Save Button & Reset Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#334155] hover:bg-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left mr-1.5"></i>
          <span>Bỏ chọn tất cả / Làm lại</span>
        </button>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-sm flex items-center justify-center gap-2 text-base transition-all hover:opacity-95 hover:shadow-md cursor-pointer"
          style={{ backgroundColor: '#F59E42' }}
        >
          <i className="fa-solid fa-floppy-disk"></i>
          <span>Lưu đánh giá</span>
        </button>

      </div>

      {/* Saved Notification Banner & Congratulations Modal/Alert */}
      {saveStatus && saveStatus.show && (
        <div className="mt-6 p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#F59E42] shadow-md animate-fadeIn">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-xs"
              style={{ backgroundColor: '#F59E42' }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#334155]">
                {saveStatus.message}
              </h3>
              <p className="text-base font-semibold text-[#3B82C4] mt-1">
                {saveStatus.congrats}
              </p>
              <p className="text-xs text-[#64748B] mt-2">
                Kết quả tự đánh giá đã được lưu vào phiên làm việc hiện tại. Hãy tự tin tiến lên Unit 2!
              </p>
            </div>

            <button
              onClick={() => setSaveStatus(null)}
              className="text-[#64748B] hover:text-[#334155] p-1"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
