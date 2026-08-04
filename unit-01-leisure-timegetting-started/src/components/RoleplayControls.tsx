import React, { useState } from 'react';

interface RoleplayControlsProps {
  selectedRole: 'Trang' | 'Tom' | null;
  activeLineIndex: number | null;
  totalLines: number;
  onNextLine: () => void;
  onPrevLine: () => void;
  onSelectRole: (role: 'Trang' | 'Tom') => void;
}

export const RoleplayControls: React.FC<RoleplayControlsProps> = ({
  selectedRole,
  activeLineIndex,
  totalLines,
  onNextLine,
  onPrevLine,
  onSelectRole,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setPracticeCompleted(false);
      // Simulate recording voice feedback
      setTimeout(() => {
        setIsRecording(false);
        setPracticeCompleted(true);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div id="roleplay-controls-panel" className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-4 md:p-5 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Role Practice Status */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs ${
              selectedRole === 'Trang'
                ? 'bg-[#DBEAFE] text-[#3B82C4]'
                : selectedRole === 'Tom'
                ? 'bg-[#FFEDD5] text-[#F59E42]'
                : 'bg-[#E2E8F0] text-[#64748B]'
            }`}
          >
            <i
              className={`fa-solid ${
                selectedRole === 'Trang'
                  ? 'fa-user-nurse'
                  : selectedRole === 'Tom'
                  ? 'fa-user-tie'
                  : 'fa-masks-theater'
              }`}
            ></i>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#334155] uppercase tracking-wide">
                {selectedRole
                  ? `CHẾ ĐỘ LUYỆN NÓI: VAI ${selectedRole.toUpperCase()}`
                  : 'CHỌN NHÂN VẬT ĐỂ BẮT ĐẦU'}
              </span>
              {selectedRole && (
                <span className="bg-[#F0FDF4] text-[#15803D] border border-[#4ADE80] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  SẴN SÀNG
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {activeLineIndex !== null
                ? `Đang chọn câu thoại #${activeLineIndex + 1} / ${totalLines}`
                : 'Nhấp chọn câu thoại hoặc bấm nút để chuyển tiếp'}
            </p>
          </div>
        </div>

        {/* Practice Line Navigation & Voice Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Backup Start Practice Button */}
          <button
            id="btn-start-roleplay-footer"
            onClick={() => {
              if (!selectedRole) {
                onSelectRole('Trang');
              }
              const startBtn = document.getElementById('btn-start-roleplay-header');
              if (startBtn) startBtn.click();
            }}
            className="px-4 py-2.5 bg-[#3B82C4] hover:bg-[#3B82C4]/90 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md cursor-pointer uppercase tracking-wider border border-[#3B82C4]"
          >
            <i className="fa-solid fa-circle-play text-sm"></i>
            <span>BẮT ĐẦU LUYỆN NÓI</span>
          </button>

          <button
            id="btn-prev-line"
            onClick={onPrevLine}
            disabled={activeLineIndex === null || activeLineIndex <= 0}
            className="px-3.5 py-2.5 bg-white hover:bg-[#DBEAFE] text-[#334155] border-2 border-[#E2E8F0] rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-2xs"
          >
            <i className="fa-solid fa-chevron-left"></i>
            <span>CÂU TRƯỚC</span>
          </button>

          {/* Practice Speaking Button */}
          <button
            id="btn-record-voice"
            onClick={handleToggleRecord}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              isRecording
                ? 'bg-[#F87171] text-white animate-pulse'
                : 'bg-[#F59E42] text-white hover:bg-[#F59E42]/90'
            }`}
          >
            <i className={`fa-solid ${isRecording ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
            <span>{isRecording ? 'ĐANG THU ÂM...' : 'THỬ PHÁT ÂM'}</span>
          </button>

          <button
            id="btn-next-line"
            onClick={onNextLine}
            disabled={activeLineIndex === null || activeLineIndex >= totalLines - 1}
            className="px-3.5 py-2.5 bg-[#334155] hover:bg-[#334155]/90 text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-md cursor-pointer uppercase tracking-wider"
          >
            <span>CÂU TIẾP</span>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Recording Feedback Toast */}
      {practiceCompleted && (
        <div className="mt-3 bg-[#F0FDF4] border-2 border-[#4ADE80] text-[#15803D] p-3 rounded-xl text-xs flex items-center justify-between font-bold shadow-2xs">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-base text-[#4ADE80]"></i>
            <span>Tuyệt vời! Bạn đã hoàn thành phát âm câu thoại này.</span>
          </div>
          <span className="font-bold text-[#15803D] bg-white px-2.5 py-1 rounded-lg border border-[#4ADE80]/30 uppercase text-[11px]">
            100% Khớp giọng
          </span>
        </div>
      )}
    </div>
  );
};
