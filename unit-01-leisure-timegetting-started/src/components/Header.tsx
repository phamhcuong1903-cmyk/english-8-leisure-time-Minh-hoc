import React from 'react';

interface HeaderProps {
  onReset: () => void;
  selectedRole: 'Trang' | 'Tom' | null;
  onClearRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  selectedRole,
  onClearRole,
}) => {
  return (
    <header id="unit1-header" className="h-20 flex items-center px-4 md:px-10 border-b border-[#E2E8F0] bg-white shrink-0 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Title and Icon Badge */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center text-[#3B82C4] shrink-0 shadow-xs">
            <i className="fa-solid fa-comments text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-none mb-1 text-[#334155] tracking-tight">
              UNIT 1: LEISURE TIME
            </h1>
            <p className="text-xs md:text-sm text-[#64748B] uppercase tracking-[0.18em] font-bold">
              LUYỆN HỘI THOẠI ĐÓNG VAI
            </p>
          </div>
        </div>

        {/* Selected Role Indicator & Quick Actions */}
        <div className="flex items-center gap-3">
          {selectedRole ? (
            <div className="flex items-center gap-2 bg-[#FFEDD5] border-2 border-[#F59E42] px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">ĐANG CHỌN VAI:</span>
              <span className="text-sm font-bold text-[#F59E42] flex items-center gap-1.5">
                <i className={`fa-solid ${selectedRole === 'Trang' ? 'fa-user-nurse' : 'fa-user-tie'}`}></i>
                {selectedRole}
              </span>
              <button
                id="btn-clear-role"
                onClick={onClearRole}
                className="ml-1 text-[#64748B] hover:text-[#F87171] transition-colors p-0.5"
                title="Bỏ chọn vai"
              >
                <i className="fa-solid fa-xmark text-xs font-bold"></i>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] font-bold uppercase tracking-wider bg-[#FDFBF7] border-2 border-[#E2E8F0] px-3 py-2 rounded-xl">
              <i className="fa-solid fa-hand-pointer text-[#F59E42]"></i>
              <span>Bấm chọn nhân vật bên phải</span>
            </div>
          )}

          <button
            id="btn-reset-conversation"
            onClick={onReset}
            className="bg-white border-2 border-[#E2E8F0] text-[#64748B] hover:text-[#3B82C4] hover:border-[#3B82C4] px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
            title="Làm mới bài luyện"
          >
            <i className="fa-solid fa-rotate-right"></i>
            <span className="hidden sm:inline uppercase tracking-wider">ĐẶT LẠI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
