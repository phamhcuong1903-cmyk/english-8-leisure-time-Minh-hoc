import React, { useState, useRef, useEffect } from 'react';
import { MindMapData, MindMapBranch } from '../types';
import { speakText } from '../utils/speech';

interface MindmapViewProps {
  data: MindMapData;
  onNavigateToAssessment: () => void;
}

export const MindmapView: React.FC<MindmapViewProps> = ({ data, onNavigateToAssessment }) => {
  // State for expanded/collapsed branches. Default all expanded for immediate review!
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.branches.forEach(b => { initial[b.id] = true; });
    return initial;
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas container ref
  const canvasRef = useRef<HTMLDivElement>(null);

  // Practice Quiz modal state
  const [activeQuizBranch, setActiveQuizBranch] = useState<MindMapBranch | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Toggle single branch
  const toggleBranch = (id: string) => {
    setExpandedBranches(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand all branches
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    data.branches.forEach(b => { allExpanded[b.id] = true; });
    setExpandedBranches(allExpanded);
  };

  // Collapse all branches
  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    data.branches.forEach(b => { allCollapsed[b.id] = false; });
    setExpandedBranches(allCollapsed);
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only trigger drag if clicking canvas or non-interactive elements
    if ((e.target as HTMLElement).closest('button, input, .sub-item-card')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if ((e.target as HTMLElement).closest('button, input, .sub-item-card')) return;
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Filter subItems based on search query
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Get icon for branch
  const getBranchIcon = (id: string) => {
    switch (id) {
      case 'vocabulary': return 'fa-book-open';
      case 'pronunciation': return 'fa-[#F59E42] fa-volume-high';
      case 'grammar': return 'fa-spell-check';
      case 'communication': return 'fa-comments';
      default: return 'fa-layer-group';
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* Control Bar: Search, Expand/Collapse, Zoom controls */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 py-3 sticky top-[73px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm từ vựng, ngữ pháp, phát âm..."
              className="w-full pl-10 pr-9 py-1.5 text-sm rounded-lg border border-[#E2E8F0] bg-[#FDFBF7] text-[#334155] focus:outline-none focus:border-[#3B82C4]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155]"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            )}
          </div>

          {/* Action Buttons: Expand/Collapse All & Zoom */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Expand / Collapse All */}
            <div className="flex items-center gap-1.5 bg-[#FDFBF7] p-1 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={expandAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3B82C4] hover:bg-[#DBEAFE] rounded-md transition-colors cursor-pointer"
                title="Mở tất cả các nhánh"
              >
                <i className="fa-solid fa-[#3B82C4] fa-folder-open"></i>
                <span>Mở tất cả</span>
              </button>
              <span className="text-[#E2E8F0]">|</span>
              <button
                onClick={collapseAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer"
                title="Đóng tất cả các nhánh"
              >
                <i className="fa-solid fa-folder"></i>
                <span>Đóng tất cả</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 flex items-center justify-center text-[#334155] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <i className="fa-solid fa-minus text-xs"></i>
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 h-8 text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer"
                title="Đặt lại phóng to 100%"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 flex items-center justify-center text-[#334155] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer"
                title="Phóng to"
              >
                <i className="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Mindmap Stage Canvas */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 mindmap-canvas relative overflow-hidden p-6 min-h-[560px] flex flex-col justify-center items-center ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        
        {/* Canvas Transform Wrapper */}
        <div 
          className="transition-transform duration-75 ease-out origin-center w-full max-w-6xl"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >

          {/* Central Topic Node */}
          <div className="flex justify-center mb-10 relative z-10">
            <div 
              className="relative px-8 py-5 rounded-2xl shadow-md text-white text-center border-4 border-white transition-transform hover:scale-105"
              style={{ backgroundColor: '#3B82C4' }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#F59E42] text-white shadow-xs">
                UNIT 1 • PROJECT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mt-1">
                {data.centralTopic}
              </h2>
              <p className="text-xs font-medium text-blue-100 mt-1 flex items-center justify-center gap-1">
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Sơ đồ tổng kết kiến thức trọng tâm</span>
              </p>
            </div>
          </div>

          {/* 4 Main Branches Layout (2x2 Grid with Branch Colors) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
            {data.branches.map((branch) => {
              const isExpanded = expandedBranches[branch.id];
              const visibleSubItems = branch.subItems.filter(item => matchesSearch(item));
              const iconClass = getBranchIcon(branch.id);

              return (
                <div 
                  key={branch.id} 
                  className="bg-[#FFFFFF] rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md flex flex-col overflow-hidden"
                  style={{ borderColor: branch.color }}
                >
                  
                  {/* Branch Header (Click to Toggle) */}
                  <div 
                    onClick={() => toggleBranch(branch.id)}
                    className="p-4 cursor-pointer select-none flex items-center justify-between gap-3 border-b border-[#E2E8F0] transition-colors"
                    style={{ backgroundColor: `${branch.color}10` }} // 10% opacity tint background
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-xs font-bold text-lg"
                        style={{ backgroundColor: branch.color }}
                      >
                        <i className={`fa-solid ${iconClass}`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#334155] leading-tight flex items-center gap-2">
                          {branch.label}
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: branch.color }}
                          >
                            {branch.subItems.length} mục
                          </span>
                        </h3>
                        <p className="text-xs text-[#64748B]">Nhấn để {isExpanded ? 'thu gọn' : 'mở rộng'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveQuizBranch(branch);
                          setQuizScore(null);
                        }}
                        className="p-1.5 text-xs rounded-md bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#FDFBF7] hover:text-[#3B82C4] transition-colors cursor-pointer"
                        title={`Luyện tập ${branch.label}`}
                      >
                        <i className="fa-solid fa-[#3B82C4] fa-lightbulb mr-1"></i>
                        <span>Ôn tập</span>
                      </button>

                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#334155] bg-white border border-[#E2E8F0]"
                      >
                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs`}></i>
                      </div>
                    </div>
                  </div>

                  {/* Branch Sub-Items (Collapsible) */}
                  {isExpanded && (
                    <div className="p-4 flex-1 flex flex-col gap-3 bg-white">
                      {visibleSubItems.length > 0 ? (
                        visibleSubItems.map((item, idx) => (
                          <div 
                            key={idx}
                            className="sub-item-card p-3 rounded-lg border border-[#E2E8F0] bg-[#FDFBF7] hover:bg-white hover:border-[#3B82C4] transition-all flex items-start justify-between gap-3 group shadow-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              <span 
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 flex-shrink-0"
                                style={{ backgroundColor: branch.color }}
                              >
                                {idx + 1}
                              </span>
                              <p className="text-sm text-[#334155] leading-relaxed font-normal">
                                {item}
                              </p>
                            </div>

                            {/* Pronunciation Audio Button */}
                            <button
                              onClick={() => speakText(item)}
                              className="p-1.5 rounded-md text-[#64748B] hover:text-[#3B82C4] hover:bg-[#DBEAFE] transition-colors flex-shrink-0 cursor-pointer"
                              title="Nghe phát âm tiếng Anh"
                            >
                              <i className="fa-solid fa-volume-high text-xs"></i>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#64748B] italic py-3 text-center">
                          {searchQuery ? 'Không tìm thấy nội dung phù hợp với từ khóa.' : 'Không có nội dung.'}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Bottom Navigation CTA: Tiếp tục -> Tự đánh giá */}
      <div className="bg-[#FFFFFF] border-t border-[#E2E8F0] p-4 sticky bottom-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[#64748B] text-center sm:text-left">
            <i className="fa-solid fa-[#3B82C4] fa-circle-check text-[#3B82C4]"></i>
            <span>Hoàn thành ôn tập kiến thức? Hãy kiểm tra lại khả năng của bạn!</span>
          </div>

          <button
            onClick={onNavigateToAssessment}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 hover:shadow-md cursor-pointer"
            style={{ backgroundColor: '#F59E42' }}
          >
            <span>Tiếp tục → Tự đánh giá</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Quick Practice Modal */}
      {activeQuizBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E2E8F0] relative">
            
            <button
              onClick={() => setActiveQuizBranch(null)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#334155] w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FDFBF7]"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: activeQuizBranch.color }}
              >
                <i className={`fa-solid ${getBranchIcon(activeQuizBranch.id)} text-lg`}></i>
              </div>
              <div>
                <span className="text-xs text-[#64748B]">Thử thách ghi nhớ</span>
                <h3 className="text-xl font-bold text-[#334155]">
                  Ôn tập: {activeQuizBranch.label}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E2E8F0] mb-5">
              <p className="text-sm font-semibold text-[#334155] mb-2">
                Đọc các kiến thức dưới đây và bấm vào icon loa để luyện nói:
              </p>
              <ul className="space-y-2">
                {activeQuizBranch.subItems.map((sub, i) => (
                  <li key={i} className="text-xs text-[#64748B] flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                    <span>{sub}</span>
                    <button
                      onClick={() => speakText(sub)}
                      className="p-1 text-[#3B82C4] hover:bg-[#DBEAFE] rounded"
                    >
                      <i className="fa-solid fa-volume-high"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveQuizBranch(null)}
                className="px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setActiveQuizBranch(null);
                  onNavigateToAssessment();
                }}
                className="px-5 py-2 text-sm font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                style={{ backgroundColor: '#3B82C4' }}
              >
                Chuyển sang Tự đánh giá
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
