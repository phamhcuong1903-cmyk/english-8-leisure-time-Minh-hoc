import React, { useState } from 'react';

interface CharacterSelectionProps {
  selectedRole: 'Trang' | 'Tom' | null;
  onSelectRole: (role: 'Trang' | 'Tom') => void;
  trangLineCount: number;
  tomLineCount: number;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedRole,
  onSelectRole,
  trangLineCount,
  tomLineCount,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // When clicking tom.png: Student plays Trang (Computer plays Tom)
  const handleTomImageClick = () => {
    onSelectRole('Trang');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("You chose to play Trang. I will play Tom and speak Tom's lines for you!");
      utterance.lang = 'en-US';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
    setToastMessage('Bạn chọn đóng vai TRANG! Máy sẽ tự động đọc các câu thoại của TOM.');
  };

  // When clicking trang.png: Student plays Tom (Computer plays Trang)
  const handleTrangImageClick = () => {
    onSelectRole('Tom');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("You chose to play Tom. I will play Trang and speak Trang's lines for you!");
      utterance.lang = 'en-US';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
    setToastMessage('Bạn chọn đóng vai TOM! Máy sẽ tự động đọc các câu thoại của TRANG.');
  };

  return (
    <div id="character-selection-box" className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-5 md:p-6 flex flex-col h-[650px] justify-between">
      {/* Container Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center font-bold text-lg shrink-0">
              <i className="fa-solid fa-users-viewfinder"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#334155] uppercase tracking-wide">
                CHỌN VAI LUYỆN NÓI
              </h2>
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
                BẤM VÀO NHÂN VẬT ĐỂ PHÂN VAI VỚI MÁY
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E2E8F0] rounded-full text-xs font-bold text-[#64748B]">
            2 NHÂN VẬT
          </span>
        </div>

        {/* Clear Notification Banner when role is selected */}
        {selectedRole ? (
          <div className="mb-4 bg-[#DBEAFE] border-2 border-[#3B82C4] text-[#1E3A8A] p-3.5 rounded-xl text-xs flex items-center gap-3 shadow-2xs font-medium">
            <div className="w-9 h-9 rounded-full bg-[#3B82C4] text-white flex items-center justify-center shrink-0 text-base font-bold shadow-xs">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-sm text-[#1E3A8A] uppercase tracking-wide">
                Bạn đang đóng vai: <span className="text-[#3B82C4] underline">{selectedRole}</span>
              </p>
              <p className="text-[#334155] text-xs mt-0.5">
                Bạn tự nói câu thoại của <strong>{selectedRole}</strong>. Máy sẽ tự động đọc tiếng Anh câu thoại của <strong>{selectedRole === 'Trang' ? 'Tom' : 'Trang'}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#334155] flex items-center gap-3">
            <i className="fa-solid fa-circle-info text-[#3B82C4] text-lg shrink-0"></i>
            <div>
              <p className="font-bold text-[#334155] uppercase tracking-wider text-[11px] mb-0.5">
                HƯỚNG DẪN CHỌN VAI:
              </p>
              <p className="text-[#64748B] text-xs">
                • Bấm vào <strong>Tom</strong> để bạn đóng vai <strong>Trang</strong> (Máy đóng Tom).<br />
                • Bấm vào <strong>Trang</strong> để bạn đóng vai <strong>Tom</strong> (Máy đóng Trang).
              </p>
            </div>
          </div>
        )}

        {/* Toast Feedback Banner */}
        {toastMessage && (
          <div className="mb-4 bg-[#F0FDF4] border-2 border-[#4ADE80] text-[#15803D] p-3 rounded-xl text-xs flex items-center gap-2.5 shadow-2xs font-bold animate-fadeIn">
            <i className="fa-solid fa-circle-check text-base text-[#4ADE80]"></i>
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}

        {/* Character Images Grid (TRANG on Left, TOM on Right) */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 my-2">
          {/* TRANG CARD (Student plays Trang when clicking Tom, OR clicking Trang directly) */}
          <div className="flex flex-col items-center gap-2.5 group">
            <div
              id="card-character-trang"
              onClick={handleTrangImageClick}
              className={`w-full bg-white rounded-xl shadow-sm overflow-hidden transition-all flex flex-col items-center justify-center gap-3 p-4 cursor-pointer relative ${
                selectedRole === 'Trang'
                  ? 'border-4 border-[#3B82C4] ring-4 ring-[#3B82C4]/20 shadow-md bg-[#DBEAFE]/20 scale-[1.02]'
                  : 'border-2 border-[#E2E8F0] hover:border-[#3B82C4]/60'
              }`}
            >
              {/* Role Tag Badge */}
              {selectedRole === 'Trang' && (
                <span className="absolute top-2 right-2 bg-[#3B82C4] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shadow-xs">
                  BẠN ĐÓNG VAI
                </span>
              )}
              {selectedRole === 'Tom' && (
                <span className="absolute top-2 right-2 bg-[#64748B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  MÁY ĐÓNG VAI
                </span>
              )}

              {/* Circular Avatar Wrapper */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 shadow-inner overflow-hidden relative transition-all ${
                  selectedRole === 'Trang'
                    ? 'border-[#3B82C4] bg-[#DBEAFE]'
                    : 'border-white bg-[#FFEDD5]'
                }`}
              >
                <img
                  src="/trang.png"
                  alt="Trang"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/trang.svg';
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#334155]">Trang</h3>
                <p className="text-xs text-[#3B82C4] font-bold mt-0.5">
                  {trangLineCount} Câu Thoại
                </p>
              </div>
            </div>

            <button
              id="btn-select-trang"
              onClick={() => {
                onSelectRole('Trang');
                setToastMessage('Bạn chọn đóng vai TRANG! Máy sẽ tự đọc lời thoại của TOM.');
              }}
              className={`w-full font-bold py-2.5 rounded-xl border transition-all text-xs tracking-wider cursor-pointer ${
                selectedRole === 'Trang'
                  ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-md'
                  : 'bg-[#FDFBF7] text-[#3B82C4] border-[#E2E8F0] hover:border-[#3B82C4]'
              }`}
            >
              {selectedRole === 'Trang' ? 'BẠN ĐANG ĐÓNG VAI TRANG' : 'ĐÓNG VAI TRANG'}
            </button>
          </div>

          {/* TOM CARD (Student plays Tom when clicking Trang, OR clicking Tom directly) */}
          <div className="flex flex-col items-center gap-2.5 group">
            <div
              id="card-character-tom"
              onClick={handleTomImageClick}
              className={`w-full bg-white rounded-xl shadow-sm overflow-hidden transition-all flex flex-col items-center justify-center gap-3 p-4 cursor-pointer relative ${
                selectedRole === 'Tom'
                  ? 'border-4 border-[#3B82C4] ring-4 ring-[#3B82C4]/20 shadow-md bg-[#DBEAFE]/20 scale-[1.02]'
                  : 'border-2 border-[#E2E8F0] hover:border-[#F59E42]/60'
              }`}
            >
              {/* Role Tag Badge */}
              {selectedRole === 'Tom' && (
                <span className="absolute top-2 right-2 bg-[#3B82C4] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shadow-xs">
                  BẠN ĐÓNG VAI
                </span>
              )}
              {selectedRole === 'Trang' && (
                <span className="absolute top-2 right-2 bg-[#64748B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  MÁY ĐÓNG VAI
                </span>
              )}

              {/* Circular Avatar Wrapper */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 shadow-inner overflow-hidden relative transition-all ${
                  selectedRole === 'Tom'
                    ? 'border-[#3B82C4] bg-[#DBEAFE]'
                    : 'border-white bg-[#DBEAFE]'
                }`}
              >
                <img
                  src="/tom.png"
                  alt="Tom"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/tom.svg';
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#334155]">Tom</h3>
                <p className="text-xs text-[#F59E42] font-bold mt-0.5">
                  {tomLineCount} Câu Thoại
                </p>
              </div>
            </div>

            <button
              id="btn-select-tom"
              onClick={() => {
                onSelectRole('Tom');
                setToastMessage('Bạn chọn đóng vai TOM! Máy sẽ tự đọc lời thoại của TRANG.');
              }}
              className={`w-full font-bold py-2.5 rounded-xl border transition-all text-xs tracking-wider cursor-pointer ${
                selectedRole === 'Tom'
                  ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-md'
                  : 'bg-[#FDFBF7] text-[#F59E42] border-[#E2E8F0] hover:border-[#F59E42]'
              }`}
            >
              {selectedRole === 'Tom' ? 'BẠN ĐANG ĐÓNG VAI TOM' : 'ĐÓNG VAI TOM'}
            </button>
          </div>
        </div>
      </div>

      {/* Roleplay Summary Panel at Bottom */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0] bg-[#FDFBF7] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-xs mb-2 font-bold">
          <span className="text-[#64748B] uppercase tracking-wider">XÁC NHẬN PHÂN VAI:</span>
          <span className="text-[#3B82C4]">
            {selectedRole ? `BẠN: ${selectedRole.toUpperCase()} | MÁY: ${selectedRole === 'Trang' ? 'TOM' : 'TRANG'}` : 'CHƯA CHỌN VAI'}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            id="btn-choose-trang-direct"
            onClick={() => {
              onSelectRole('Trang');
              setToastMessage('Bạn đóng vai Trang - Máy đóng vai Tom.');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
              selectedRole === 'Trang'
                ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-sm'
                : 'bg-white text-[#3B82C4] border-[#3B82C4]/30 hover:bg-[#DBEAFE]'
            }`}
          >
            <i className="fa-solid fa-user"></i>
            <span>Bạn Đóng Trang</span>
          </button>

          <button
            id="btn-choose-tom-direct"
            onClick={() => {
              onSelectRole('Tom');
              setToastMessage('Bạn đóng vai Tom - Máy đóng vai Trang.');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
              selectedRole === 'Tom'
                ? 'bg-[#3B82C4] text-white border-[#3B82C4] shadow-sm'
                : 'bg-white text-[#F59E42] border-[#F59E42]/30 hover:bg-[#FFEDD5]'
            }`}
          >
            <i className="fa-solid fa-user-tie"></i>
            <span>Bạn Đóng Tom</span>
          </button>
        </div>

        {/* Prominent Backup Start Practice Button */}
        <button
          id="btn-start-roleplay-character-panel"
          onClick={() => {
            if (!selectedRole) {
              onSelectRole('Trang');
            }
            const startBtn = document.getElementById('btn-start-roleplay-header');
            if (startBtn) startBtn.click();
          }}
          className="w-full mt-3 py-3 rounded-xl bg-[#3B82C4] hover:bg-[#3B82C4]/90 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#3B82C4]"
        >
          <i className="fa-solid fa-circle-play text-sm"></i>
          <span>BẮT ĐẦU LUYỆN NÓI NGAY</span>
        </button>
      </div>
    </div>
  );
};

