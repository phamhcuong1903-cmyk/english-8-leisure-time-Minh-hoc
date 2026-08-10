import React, { useState, useEffect } from 'react';
import worldData from '../data/world-map-leisure.json';

interface LocationItem {
  name: string;
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  activity: string;
}

interface InteractiveMapSectionProps {
  onPrevStep: () => void;
  onRestartAll: () => void;
}

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({
  onPrevStep,
  onRestartAll,
}) => {
  const [locations, setLocations] = useState<LocationItem[]>(worldData.locations || []);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [visitedNames, setVisitedNames] = useState<Set<string>>(new Set());

  // Load from json file dynamically if needed, fallback to worldData import
  useEffect(() => {
    fetch('/world-map-leisure.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.locations && Array.isArray(data.locations)) {
          setLocations(data.locations);
        }
      })
      .catch(() => {
        // Use imported default
      });
  }, []);

  const handleMarkerClick = (loc: LocationItem) => {
    setSelectedLocation(loc);
    setVisitedNames((prev) => new Set(prev).add(loc.name));
  };

  const isAllDiscovered = locations.length > 0 && visitedNames.size >= locations.length;

  // Convert (lat, lng) to SVG percentage (Equirectangular projection)
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const xPercent = ((lng + 180) / 360) * 100;
    // Map latitude -90 to 90 -> yPercent 100 to 0 with slight equator adjustment
    const yPercent = ((90 - lat) / 180) * 100;
    return { xPercent, yPercent };
  };

  // Flag emojis helper
  const getFlagEmoji = (country: string) => {
    if (country.toLowerCase().includes('japan')) return '🇯🇵';
    if (country.toLowerCase().includes('switzerland')) return '🇨🇭';
    if (country.toLowerCase().includes('viet')) return '🇻🇳';
    return '🌍';
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevStep}
            className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] flex items-center justify-center text-[#334155] hover:bg-[#DBEAFE] hover:text-[#3B82C4] transition-colors cursor-pointer"
            title="Quay lại phần Video"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <span className="text-xs font-semibold text-[#3B82C4] uppercase tracking-wider">
              Bước 3 / 3 • Bản đồ tương tác thế giới
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#334155]">
              Bản đồ thế giới tương tác — Hoạt động giải trí của teen các nước
            </h2>
          </div>
        </div>

        <button
          onClick={onRestartAll}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#334155] font-semibold hover:bg-[#FDFBF7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-rotate-right text-[#F59E42]"></i>
          <span>Luyện lại từ đầu</span>
        </button>
      </div>

      {/* Completion Banner & Reflective Question */}
      {isAllDiscovered && (
        <div className="bg-[#F0FDF4] border-2 border-[#4ADE80] p-5 rounded-2xl shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3 text-[#334155]">
            <span className="text-3xl">🎉</span>
            <div>
              <h3 className="text-lg font-bold text-[#334155]">
                Chúc mừng! Bạn đã khám phá xong cả {locations.length} hoạt động giải trí!
              </h3>
              <p className="text-xs text-[#64748B]">
                Đã mở khóa toàn bộ điểm tương tác trên bản đồ thế giới.
              </p>
            </div>
          </div>

          {/* Open question for student/parent/teacher discussion */}
          <div className="p-4 bg-white rounded-xl border border-[#4ADE80]/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFEDD5] text-[#F59E42] flex items-center justify-center font-bold text-lg shrink-0">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#F59E42] uppercase tracking-wider block">
                Câu hỏi gợi mở thảo luận (Giao tiếp):
              </span>
              <p className="text-base font-bold text-[#334155] mt-0.5">
                "Con thích hoạt động nào nhất? Vì sao?"
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                (Thầy cô & phụ huynh có thể dùng câu hỏi này để trò chuyện, trao đổi Tiếng Anh cùng học sinh).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col gap-4 relative">
        {/* Subtitle & Discovery Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#334155] text-base flex items-center gap-2">
              <i className="fa-solid fa-earth-americas text-[#3B82C4]"></i>
              <span>Nhấp vào điểm đánh dấu trên bản đồ để khám phá</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Màu cam (#F59E42): Chưa xem • Màu xanh (#4ADE80): Đã xem qua
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FDFBF7] px-3 py-1.5 rounded-full border border-[#E2E8F0] text-xs font-semibold">
            <span className="text-[#64748B]">Tiến độ khám phá:</span>
            <span className="text-[#3B82C4] font-bold">{visitedNames.size} / {locations.length} địa điểm</span>
          </div>
        </div>

        {/* SVG World Map Container */}
        <div className="relative w-full bg-[#EBF3FA] rounded-xl border border-[#3B82C4]/20 p-2 overflow-hidden shadow-inner min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
          
          {/* Detailed Vector SVG World Map Outline */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full object-contain filter drop-shadow-xs"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect width="1000" height="500" fill="#EBF3FA" rx="12" />

            {/* Latitude / Longitude subtle grid lines */}
            <g stroke="#3B82C4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.25">
              <line x1="0" y1="250" x2="1000" y2="250" /> {/* Equator */}
              <line x1="500" y1="0" x2="500" y2="500" /> {/* Prime Meridian */}
              <line x1="0" y1="125" x2="1000" y2="125" />
              <line x1="0" y1="375" x2="1000" y2="375" />
              <line x1="250" y1="0" x2="250" y2="500" />
              <line x1="750" y1="0" x2="750" y2="500" />
            </g>

            {/* SVG Continents outlines */}
            <g fill="#D5E5F5" stroke="#3B82C4" strokeWidth="1.2" strokeLinejoin="round" opacity="0.95">
              {/* North America */}
              <path d="M120 70 L220 50 L320 80 L350 140 L280 200 L240 220 L180 180 L120 150 L100 100 Z" />
              <path d="M220 220 L260 250 L240 280 L210 250 Z" />
              
              {/* South America */}
              <path d="M280 280 L360 300 L380 370 L340 460 L290 440 L260 350 Z" />
              
              {/* Europe */}
              <path d="M460 70 L540 60 L580 90 L560 150 L480 160 L450 120 Z" />
              <path d="M440 100 L460 80 L470 110 Z" /> {/* British Isles */}
              
              {/* Africa */}
              <path d="M460 170 L580 170 L620 250 L580 380 L500 390 L450 280 Z" />
              
              {/* Asia */}
              <path d="M580 60 L850 50 L920 120 L880 220 L800 240 L720 260 L620 220 L560 150 Z" />
              <path d="M860 140 L880 130 L870 170 Z" /> {/* Japan islands */}
              <path d="M720 240 L760 240 L780 280 L740 310 Z" /> {/* SE Asia / Indochina */}
              
              {/* Australia & Oceania */}
              <path d="M800 330 L900 320 L920 390 L820 410 Z" />
            </g>
          </svg>

          {/* HTML Interactive Markers overlay on SVG */}
          {locations.map((loc) => {
            const { xPercent, yPercent } = getCoordinatesPercent(loc.coordinates.lat, loc.coordinates.lng);
            const isVisited = visitedNames.has(loc.name);
            const isSelected = selectedLocation?.name === loc.name;

            return (
              <div
                key={loc.name}
                style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center group cursor-pointer"
                onClick={() => handleMarkerClick(loc)}
              >
                {/* Pulse Ring effect when unvisited */}
                {!isVisited && (
                  <span className="absolute w-8 h-8 rounded-full bg-[#F59E42]/40 animate-ping"></span>
                )}

                {/* Marker Circle */}
                <button
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 transition-all duration-300 transform group-hover:scale-125 cursor-pointer ${
                    isVisited
                      ? 'bg-[#4ADE80] border-white ring-2 ring-[#4ADE80]/40'
                      : 'bg-[#F59E42] border-white ring-2 ring-[#F59E42]/40'
                  } ${isSelected ? 'scale-125 ring-4 ring-[#3B82C4]' : ''}`}
                  title={`Nhấp để xem hoạt động ở ${loc.country}`}
                >
                  {isVisited ? (
                    <i className="fa-solid fa-check text-xs"></i>
                  ) : (
                    <i className="fa-solid fa-location-dot text-xs"></i>
                  )}
                </button>

                {/* Country Name Tag right next to marker */}
                <div
                  className={`ml-2 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap transition-all border ${
                    isVisited
                      ? 'bg-[#F0FDF4] text-[#22C55E] border-[#4ADE80]'
                      : 'bg-white text-[#334155] border-[#E2E8F0] group-hover:bg-[#FFEDD5] group-hover:text-[#F59E42]'
                  }`}
                >
                  <span className="mr-1">{getFlagEmoji(loc.country)}</span>
                  <span>{loc.country}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Location Info Card / Modal Popup */}
        {selectedLocation && (
          <div className="absolute inset-0 z-30 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-lg w-full p-6 relative animate-scaleUp">
              {/* Close Button (X) */}
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FDFBF7] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#334155] hover:bg-gray-100 transition-colors cursor-pointer"
                title="Đóng khung thông tin"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              {/* Card Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] pr-10">
                <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#3B82C4] flex items-center justify-center text-2xl font-bold shadow-xs shrink-0">
                  {getFlagEmoji(selectedLocation.country)}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#4ADE80] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#4ADE80]/30 inline-block mb-0.5">
                    <i className="fa-solid fa-circle-check mr-1"></i>
                    Đã xem qua
                  </span>
                  <h4 className="text-xl font-bold text-[#334155] leading-tight">
                    {selectedLocation.name} ({selectedLocation.city}, {selectedLocation.country})
                  </h4>
                </div>
              </div>

              {/* Activity Description */}
              <div className="py-5 space-y-3">
                <span className="text-xs font-bold text-[#F59E42] uppercase tracking-wider block">
                  Hoạt động giải trí (Leisure Activity):
                </span>
                <p className="text-base text-[#334155] leading-relaxed italic bg-[#FDFBF7] p-4 rounded-xl border border-[#E2E8F0]">
                  "{selectedLocation.activity}"
                </p>
              </div>

              {/* Action / Dismiss */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Nhấn <strong className="text-[#334155]">Đóng (X)</strong> để tiếp tục khám phá địa điểm khác
                </span>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-5 py-2 rounded-xl bg-[#3B82C4] text-white font-bold hover:bg-[#2e6aa3] transition-colors text-xs cursor-pointer"
                >
                  Trở lại bản đồ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Location Cards below map for easy discovery */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {locations.map((loc) => {
          const isVisited = visitedNames.has(loc.name);
          return (
            <div
              key={loc.name}
              onClick={() => handleMarkerClick(loc)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isVisited
                  ? 'bg-[#F0FDF4] border-[#4ADE80] hover:border-[#22C55E]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#F59E42]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getFlagEmoji(loc.country)}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isVisited ? 'bg-[#4ADE80] text-white' : 'bg-[#FFEDD5] text-[#F59E42]'
                  }`}
                >
                  {isVisited ? 'Đã xem' : 'Chưa xem'}
                </span>
              </div>
              <h4 className="font-bold text-[#334155] text-sm">
                {loc.name} • {loc.city}
              </h4>
              <p className="text-xs text-[#64748B] font-semibold">{loc.country}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
