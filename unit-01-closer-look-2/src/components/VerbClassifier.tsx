import React, { useState, useEffect } from 'react';
import classifyData from '../data/classify-verbs.json';
import { ClassifyData, ClassifyItem } from '../types';

const data = classifyData as ClassifyData;

// Function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface VerbClassifierProps {
  onNextTab?: (tab: 'classify' | 'sentence' | 'quiz' | 'theory') => void;
}

export const VerbClassifier: React.FC<VerbClassifierProps> = ({ onNextTab }) => {
  // Items in shuffled order
  const [items, setItems] = useState<ClassifyItem[]>([]);
  
  // Mapping of word -> columnId ('gerund-only' | 'both' | null)
  const [placements, setPlacements] = useState<Record<string, string | null>>({});
  
  // Status after pressing "Kiểm tra kết quả"
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Currently dragged word
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  // Active drop target column highlighting
  const [activeDropColumn, setActiveDropColumn] = useState<string | null>(null);

  // Currently selected card for tap-to-move (mobile friendly)
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Initialize and shuffle items
  const handleReset = () => {
    const shuffled = shuffleArray(data.items);
    setItems(shuffled);
    
    const initialPlacements: Record<string, string | null> = {};
    shuffled.forEach((item) => {
      initialPlacements[item.word] = null; // null means unassigned (in word pool)
    });
    setPlacements(initialPlacements);
    setIsSubmitted(false);
    setSelectedWord(null);
    setDraggedWord(null);
  };

  useEffect(() => {
    handleReset();
  }, []);

  // Move word to column or back to pool
  const moveWord = (word: string, targetColumn: string | null) => {
    setPlacements((prev) => ({
      ...prev,
      [word]: targetColumn,
    }));
    setSelectedWord(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    setActiveDropColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string | null) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain') || draggedWord;
    if (word) {
      moveWord(word, columnId);
    }
    setDraggedWord(null);
    setActiveDropColumn(null);
  };

  // Check results
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Calculate score
  const totalItems = items.length;
  const correctCount = items.filter(
    (item) => placements[item.word] === item.correctColumn
  ).length;
  const placedCount = items.filter((item) => placements[item.word] !== null).length;

  // Unassigned pool items
  const poolItems = items.filter((item) => placements[item.word] === null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Instruction Banner - High Density Style */}
      <section className="bg-[#FFEDD5] p-4 rounded-xl border-l-4 border-[#F59E42] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#334155]">
            <strong className="text-[#3B82C4] font-bold">Instruction:</strong>{' '}
            <span className="font-normal text-[#334155]">{data.instruction}</span>
          </p>
          <p className="text-xs text-[#64748B] flex items-center gap-1.5">
            <i className="fa-solid fa-circle-info text-[#3B82C4]"></i>
            <span>Bạn có thể kéo-thả hoặc nhấp vào động từ rồi chọn cột để di chuyển.</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#F59E42] text-white rounded-xl shadow-sm hover:brightness-110 font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-check"></i>
              <span>Kiểm tra kết quả</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-xl font-bold hover:bg-[#F8FAFC] transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </section>

      {/* Unassigned Word Bank (Chưa phân loại) */}
      <div 
        className={`bg-white p-4 rounded-xl shadow-sm border-2 transition-all ${
          activeDropColumn === 'pool' ? 'border-[#3B82C4] ring-2 ring-[#DBEAFE]' : 'border-[#E2E8F0]'
        }`}
        onDragOver={(e) => handleDragOver(e, null)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#3B82C4]"></i>
            Verb Bank (Chưa phân loại - {poolItems.length} từ)
          </h3>
          {poolItems.length === 0 && (
            <span className="text-xs font-semibold text-[#4ADE80] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#4ADE80]">
              <i className="fa-solid fa-check text-xs mr-1"></i> Đã phân loại hết các từ
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 p-3 bg-[#FDFBF7] rounded-lg border border-dashed border-[#CBD5E1] min-h-[60px] items-center">
          {poolItems.length === 0 ? (
            <div className="w-full text-center text-xs text-[#64748B] italic">
              Tất cả động từ đã được đưa vào cột. Nhấn <strong>Kiểm tra kết quả</strong> để chấm điểm.
            </div>
          ) : (
            poolItems.map((item) => {
              const isSelected = selectedWord === item.word;
              return (
                <div
                  key={item.word}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, item.word)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (isSubmitted) return;
                    setSelectedWord(isSelected ? null : item.word);
                  }}
                  className={`group relative px-4 py-2 bg-white border-2 border-[#3B82C4] text-[#3B82C4] font-semibold rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:bg-[#DBEAFE] transition-all select-none text-base flex items-center gap-2 ${
                    isSelected ? 'ring-2 ring-[#3B82C4] bg-[#DBEAFE]' : ''
                  }`}
                >
                  <i className="fa-solid fa-grip-vertical text-xs text-[#3B82C4]/60"></i>
                  <span>{item.word}</span>

                  {/* Tap-to-move menu */}
                  {isSelected && !isSubmitted && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 bg-white border-2 border-[#3B82C4] rounded-xl shadow-xl p-2 flex flex-col gap-1.5 min-w-[210px]">
                      <span className="text-[11px] font-semibold text-[#64748B] px-2 text-center">
                        Chuyển "{item.word}" vào:
                      </span>
                      {data.columns.map((col) => (
                        <button
                          key={col.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWord(item.word, col.id);
                          }}
                          className="text-xs text-left px-3 py-1.5 rounded-lg font-semibold bg-[#DBEAFE] hover:bg-[#3B82C4] text-[#1E40AF] hover:text-white transition-colors"
                        >
                          → {col.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2 Destination Columns - High Density Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {data.columns.map((col) => {
          const colItems = items.filter((item) => placements[item.word] === col.id);
          const isTargeted = activeDropColumn === col.id;

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-xl overflow-hidden border-2 border-[#DBEAFE] bg-[#FFFFFF] shadow-sm transition-all ${
                isTargeted ? 'ring-2 ring-[#3B82C4] scale-[1.01]' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Header */}
              <div className="bg-[#DBEAFE] px-4 py-3 border-b border-[#3B82C4]/20 flex items-center justify-between">
                <h2 className="text-center font-bold text-[#3B82C4] uppercase tracking-wide text-sm sm:text-base">
                  {col.label}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#3B82C4] border border-[#3B82C4]/30">
                  {colItems.length}
                </span>
              </div>

              {/* Items Container */}
              <div className="p-4 flex flex-wrap gap-2.5 content-start flex-1 bg-white min-h-[200px]">
                {colItems.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#E2E8F0] rounded-lg text-[#94A3B8]">
                    <i className="fa-solid fa-arrow-down-long text-xl mb-1 text-[#CBD5E1]"></i>
                    <p className="text-xs font-medium">Kéo thả động từ vào đây</p>
                  </div>
                ) : (
                  colItems.map((item) => {
                    const isCorrect = item.correctColumn === col.id;
                    const isSelected = selectedWord === item.word;

                    let cardClass = "bg-white border-2 border-[#E2E8F0] text-[#334155] rounded-lg shadow-sm hover:border-[#3B82C4]";
                    let iconNode = null;

                    if (isSubmitted) {
                      if (isCorrect) {
                        cardClass = "bg-[#F0FDF4] border-2 border-[#4ADE80] text-[#334155] rounded-lg shadow-sm font-semibold";
                        iconNode = <i className="fa-solid fa-check text-[#4ADE80]"></i>;
                      } else {
                        cardClass = "bg-[#FEF2F2] border-2 border-[#F87171] text-[#334155] rounded-lg shadow-sm font-semibold";
                        iconNode = <i className="fa-solid fa-xmark text-[#F87171]"></i>;
                      }
                    } else if (isSelected) {
                      cardClass = "bg-[#DBEAFE] border-2 border-[#3B82C4] text-[#1E40AF] rounded-lg shadow-sm font-semibold ring-2 ring-[#3B82C4]";
                    }

                    return (
                      <div
                        key={item.word}
                        draggable={!isSubmitted}
                        onDragStart={(e) => handleDragStart(e, item.word)}
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          if (isSubmitted) return;
                          setSelectedWord(isSelected ? null : item.word);
                        }}
                        className={`px-4 py-2 text-base flex items-center gap-2 cursor-pointer transition-all select-none ${cardClass}`}
                      >
                        <span>{item.word}</span>
                        {iconNode}
                        {!isSubmitted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveWord(item.word, null);
                            }}
                            className="ml-1 text-xs text-[#94A3B8] hover:text-[#EF4444]"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submitted Result Score Banner */}
      {isSubmitted && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
                correctCount === totalItems 
                  ? 'bg-[#F0FDF4] text-[#4ADE80] border border-[#4ADE80]' 
                  : 'bg-[#FFEDD5] text-[#F59E42] border border-[#F59E42]'
              }`}
            >
              {correctCount === totalItems ? (
                <i className="fa-solid fa-trophy"></i>
              ) : (
                <i className="fa-solid fa-star-half-stroke"></i>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#334155]">
                Kết quả: <span className="text-[#3B82C4]">{correctCount}/{totalItems}</span> câu đúng
              </h3>
              <p className="text-xs text-[#64748B]">
                {correctCount === totalItems
                  ? 'Tuyệt vời! Bạn đã phân loại chính xác 100% động từ.'
                  : `Đúng ${correctCount} từ, chưa chính xác ${totalItems - correctCount} từ.`}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2 bg-[#F59E42] text-white rounded-xl font-bold hover:brightness-110 transition-all cursor-pointer text-sm"
          >
            Làm lại bài này
          </button>
        </div>
      )}

      {/* Explanation Footer Card */}
      {isSubmitted && (
        <footer className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-xs">
          <p className="text-sm text-[#334155] leading-relaxed">
            <strong className="text-[#3B82C4]">Explanation:</strong> {data.explanation}
          </p>
        </footer>
      )}

      {/* Next Step Transition Banner */}
      {onNextTab && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNextTab('sentence')}
            className="px-6 py-3 bg-[#3B82C4] text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-sm flex items-center gap-2 cursor-pointer text-base"
          >
            <span>Tiếp tục → Sentence Builder</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};
