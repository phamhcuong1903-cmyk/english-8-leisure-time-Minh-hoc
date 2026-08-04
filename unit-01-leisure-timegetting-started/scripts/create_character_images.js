import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG content for Trang
const trangSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgTrang" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>
    <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4C0519" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background Card -->
  <rect width="400" height="500" rx="24" fill="url(#bgTrang)" />
  
  <!-- Outer Glow -->
  <circle cx="200" cy="220" r="170" fill="#FFFFFF" opacity="0.4" />

  <!-- Body / Dress -->
  <path d="M 120,500 C 120,380 150,330 200,330 C 250,330 280,380 280,500 Z" fill="url(#dressGrad)" />
  
  <!-- Blouse Collar / Sleeves -->
  <path d="M 140,340 Q 200,390 260,340 C 275,370 285,410 290,450 C 250,470 150,470 110,450 C 115,410 125,370 140,340 Z" fill="#FFFBEB" />
  <path d="M 170,330 C 185,360 200,370 200,370 C 200,370 215,360 230,330 C 210,345 190,345 170,330 Z" fill="#78350F" />
  
  <!-- Neck -->
  <rect x="182" y="270" width="36" height="65" rx="10" fill="#FCE7F3" />
  <rect x="182" y="270" width="36" height="65" rx="10" fill="#FBCFE8" opacity="0.3" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="220" rx="65" ry="75" fill="#FD2C8D" opacity="0" />
  <!-- Face skin tone -->
  <ellipse cx="200" cy="210" rx="62" ry="70" fill="#FFEDD5" />
  
  <!-- Cheeks blush -->
  <ellipse cx="165" cy="225" rx="14" ry="8" fill="#F87171" opacity="0.3" />
  <ellipse cx="235" cy="225" rx="14" ry="8" fill="#F87171" opacity="0.3" />

  <!-- Eyes -->
  <ellipse cx="170" cy="200" rx="7" ry="9" fill="#1E293B" />
  <ellipse cx="230" cy="200" rx="7" ry="9" fill="#1E293B" />
  <!-- Eye highlights -->
  <circle cx="168" cy="197" r="2.5" fill="#FFFFFF" />
  <circle cx="228" cy="197" r="2.5" fill="#FFFFFF" />

  <!-- Eyebrows -->
  <path d="M 158,185 Q 170,180 182,186" stroke="#451A03" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 218,186 Q 230,180 242,185" stroke="#451A03" stroke-width="3" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 200,205 Q 197,215 201,217" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />

  <!-- Smile -->
  <path d="M 182,232 Q 200,248 218,232" stroke="#E11D48" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <!-- Hair (Short dark wavy hair) -->
  <path d="M 132,200 C 120,130 160,110 200,110 C 240,110 280,130 268,200 C 275,230 265,260 255,270 C 245,230 240,190 235,170 C 215,160 185,160 165,170 C 160,190 155,230 145,270 C 135,260 125,230 132,200 Z" fill="#1E1B18" />
  <!-- Bangs -->
  <path d="M 145,165 Q 175,145 200,160 Q 225,145 255,165 Q 230,125 200,125 Q 170,125 145,165 Z" fill="#292524" />

  <!-- Green Bow Headband -->
  <path d="M 145,145 Q 200,120 255,145" stroke="#10B981" stroke-width="10" fill="none" stroke-linecap="round" />
  <!-- Bow -->
  <g transform="translate(225, 122) rotate(-15)">
    <path d="M 0,0 Q -18,-12 -24,0 Q -18,12 0,0 Z" fill="#059669" />
    <path d="M 0,0 Q 18,-12 24,0 Q 18,12 0,0 Z" fill="#059669" />
    <circle cx="0" cy="0" r="5" fill="#047857" />
  </g>
</svg>`;

// SVG content for Tom
const tomSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgTom" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="100%" stop-color="#BAE6FD" />
    </linearGradient>
    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <filter id="shadowTom" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="400" height="500" rx="24" fill="url(#bgTom)" />
  
  <!-- Outer Glow -->
  <circle cx="200" cy="220" r="170" fill="#FFFFFF" opacity="0.4" />

  <!-- Body / White Shirt -->
  <path d="M 100,500 C 100,370 140,330 200,330 C 260,330 300,370 300,500 Z" fill="url(#shirtGrad)" />
  
  <!-- Collar V-neck -->
  <path d="M 160,330 L 200,390 L 240,330 Z" fill="#E2E8F0" />
  <path d="M 150,330 L 200,395 L 185,330 Z" fill="#FFFFFF" />
  <path d="M 250,330 L 200,395 L 215,330 Z" fill="#FFFFFF" />

  <!-- Red Sash/Belt at Waist -->
  <path d="M 115,460 C 160,475 240,475 285,460 L 290,500 L 110,500 Z" fill="#DC2626" />

  <!-- Neck -->
  <rect x="180" y="260" width="40" height="75" rx="8" fill="#FFEDD5" />
  <rect x="180" y="260" width="40" height="75" rx="8" fill="#FDBA74" opacity="0.2" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="205" rx="60" ry="68" fill="#FFEDD5" />
  
  <!-- Cheeks blush -->
  <ellipse cx="165" cy="218" rx="12" ry="7" fill="#F87171" opacity="0.25" />
  <ellipse cx="235" cy="218" rx="12" ry="7" fill="#F87171" opacity="0.25" />

  <!-- Eyes -->
  <ellipse cx="170" cy="195" rx="7.5" ry="9" fill="#0F172A" />
  <ellipse cx="230" cy="195" rx="7.5" ry="9" fill="#0F172A" />
  <!-- Eye highlights -->
  <circle cx="168" cy="192" r="2.5" fill="#FFFFFF" />
  <circle cx="228" cy="192" r="2.5" fill="#FFFFFF" />

  <!-- Eyebrows -->
  <path d="M 158,178 Q 172,172 184,180" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <path d="M 216,180 Q 228,172 242,178" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 200,198 Q 196,208 202,210" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />

  <!-- Big Confident Smile -->
  <path d="M 178,225 Q 200,248 222,225" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <!-- Hair (Dark stylish hair) -->
  <path d="M 135,190 C 125,120 160,95 200,95 C 240,95 275,120 265,190 C 275,180 270,140 250,110 C 220,90 180,90 150,110 C 130,140 125,180 135,190 Z" fill="#0F172A" />
  <!-- Top hair volume -->
  <path d="M 140,150 Q 180,105 230,115 Q 260,120 265,150 Q 240,110 200,110 Q 160,110 140,150 Z" fill="#1E293B" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'trang.svg'), trangSvg);
fs.writeFileSync(path.join(publicDir, 'tom.svg'), tomSvg);
// Also write as trang.png and tom.png (browsers accept SVG format in img tags)
fs.writeFileSync(path.join(publicDir, 'trang.png'), trangSvg);
fs.writeFileSync(path.join(publicDir, 'tom.png'), tomSvg);

console.log('Successfully generated trang.png, tom.png, trang.svg, tom.svg!');
