import React from 'react';

interface ResqXLogoProps {
  className?: string;
  size?: number;
}

/**
 * Official RESQ-X Firefighter & Rescue Emblem
 * Faithfully vector-recreated from the official project logo:
 * Firefighter helmet, goggles, dual-filter respirator gas mask, turnout bunker coat,
 * crossed rescue axes, and enveloping smoke/flame shield crest.
 */
export const ResqXLogo: React.FC<ResqXLogoProps> = ({
  className = '',
  size = 130,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.05 }}
      aria-label="RESQ-X Official Fire & Rescue Insignia"
    >
      <svg
        viewBox="0 0 320 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Metallic Silver Primary Gradient for Linework and Plates */}
          <linearGradient id="silverPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F1F5F9" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Platinum Stroke Gradient */}
          <linearGradient id="silverStroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Deep Charcoal Plate Fills */}
          <linearGradient id="charcoalFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Subtle Rescue Red Accent for Center Badge Core */}
          <radialGradient id="redAccentGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="80%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
        </defs>

        {/* ========================================== */}
        {/* 1. CROSSED RESCUE AXES (BACKGROUND LAYER)   */}
        {/* ========================================== */}
        {/* Left-to-Right Axe Handle */}
        <path
          d="M 50 310 L 255 45 L 268 56 L 63 321 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3"
        />
        {/* Right-to-Left Axe Handle */}
        <path
          d="M 270 310 L 65 45 L 52 56 L 257 321 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3"
        />

        {/* Axe 1: Top Left Axe Head */}
        <g stroke="url(#silverStroke)" strokeWidth="3.5" fill="url(#charcoalFill)">
          {/* Blade & Eye */}
          <path d="M 65 45 L 42 28 C 30 48 30 75 44 95 L 75 75 Z" />
          {/* Blade Cutting Edge Highlight */}
          <path d="M 40 30 C 28 50 28 73 42 93" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          {/* Rear Pick / Spike */}
          <path d="M 75 60 L 98 42 L 82 35 Z" />
        </g>

        {/* Axe 2: Top Right Axe Head */}
        <g stroke="url(#silverStroke)" strokeWidth="3.5" fill="url(#charcoalFill)">
          {/* Blade & Eye */}
          <path d="M 255 45 L 278 28 C 290 48 290 75 276 95 L 245 75 Z" />
          {/* Blade Cutting Edge Highlight */}
          <path d="M 280 30 C 292 50 292 73 278 93" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          {/* Rear Pick / Spike */}
          <path d="M 245 60 L 222 42 L 238 35 Z" />
        </g>

        {/* ========================================== */}
        {/* 2. OUTER SMOKE & FLAME SHIELD EMBLEM       */}
        {/* ========================================== */}
        <path
          d="M 160 325 
             C 140 300 110 280 85 285 
             C 65 290 55 270 60 250 
             C 65 230 40 220 40 195 
             C 40 170 60 160 70 140 
             C 80 120 75 105 90 95 
             C 98 90 102 98 108 105 
             C 100 125 115 140 115 155
             C 105 175 90 195 95 220
             C 100 245 130 255 160 275
             C 190 255 220 245 225 220
             C 230 195 215 175 205 155
             C 205 140 220 125 212 105
             C 218 98 222 90 230 95
             C 245 105 240 120 250 140
             C 260 160 280 170 280 195
             C 280 220 255 230 260 250
             C 265 270 255 290 235 285
             C 210 280 180 300 160 325 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Internal Flame Flourish Swirls */}
        <path
          d="M 75 250 C 95 240 110 265 140 265"
          stroke="url(#silverStroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 245 250 C 225 240 210 265 180 265"
          stroke="url(#silverStroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 160 315 C 160 285 145 270 125 255"
          stroke="url(#silverStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 160 315 C 160 285 175 270 195 255"
          stroke="url(#silverStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ========================================== */}
        {/* 3. FIREFIGHTER TURNOUT COAT & SHOULDERS    */}
        {/* ========================================== */}
        {/* Main Bunker Coat Body */}
        <path
          d="M 98 175 L 85 240 L 160 260 L 235 240 L 222 175 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3"
        />
        {/* Center Placket / Storm Flap */}
        <path
          d="M 152 180 L 152 260 M 168 180 L 168 260"
          stroke="url(#silverStroke)"
          strokeWidth="2"
        />
        {/* Left Suspender Strap & Buckle */}
        <rect
          x="115"
          y="180"
          width="18"
          height="65"
          fill="#1E293B"
          stroke="url(#silverStroke)"
          strokeWidth="2.5"
        />
        <line x1="115" y1="210" x2="133" y2="210" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Right Suspender Strap & Buckle */}
        <rect
          x="187"
          y="180"
          width="18"
          height="65"
          fill="#1E293B"
          stroke="url(#silverStroke)"
          strokeWidth="2.5"
        />
        <line x1="187" y1="210" x2="205" y2="210" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Coat Collar */}
        <path
          d="M 115 175 L 140 185 L 160 178 L 180 185 L 205 175"
          stroke="url(#silverStroke)"
          strokeWidth="3"
          fill="none"
        />

        {/* ========================================== */}
        {/* 4. GAS MASK & RESPIRATOR SYSTEM            */}
        {/* ========================================== */}
        {/* Central Mask Body */}
        <path
          d="M 140 135 L 132 170 L 160 188 L 188 170 L 180 135 Z"
          fill="#0B0F19"
          stroke="url(#silverStroke)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Center Exhalation Valve / Diaphragm */}
        <circle
          cx="160"
          cy="158"
          r="14"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="2.5"
        />
        {/* Exhale Valve Slits / Mesh */}
        <circle cx="160" cy="158" r="7" fill="url(#redAccentGlow)" />
        <line x1="160" y1="147" x2="160" y2="169" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="149" y1="158" x2="171" y2="158" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Left Canister Filter */}
        <g stroke="url(#silverStroke)" strokeWidth="2.5" fill="url(#charcoalFill)">
          <ellipse cx="124" cy="156" rx="14" ry="12" transform="rotate(-15 124 156)" />
          <ellipse cx="124" cy="156" rx="8" ry="6" fill="#1E293B" transform="rotate(-15 124 156)" />
          <circle cx="124" cy="156" r="3" fill="#94A3B8" />
        </g>

        {/* Right Canister Filter */}
        <g stroke="url(#silverStroke)" strokeWidth="2.5" fill="url(#charcoalFill)">
          <ellipse cx="196" cy="156" rx="14" ry="12" transform="rotate(15 196 156)" />
          <ellipse cx="196" cy="156" rx="8" ry="6" fill="#1E293B" transform="rotate(15 196 156)" />
          <circle cx="196" cy="156" r="3" fill="#94A3B8" />
        </g>

        {/* ========================================== */}
        {/* 5. PROTECTIVE SEARCH & RESCUE GOGGLES      */}
        {/* ========================================== */}
        {/* Goggle Outer Frame */}
        <path
          d="M 122 108 
             C 122 100 138 98 160 102 
             C 182 98 198 100 198 108 
             C 200 124 185 130 160 126 
             C 135 130 120 124 122 108 Z"
          fill="#0B0F19"
          stroke="url(#silverStroke)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Left Lens Glass */}
        <path
          d="M 130 110 C 130 104 142 104 154 107 C 152 120 138 122 132 118 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="1.5"
        />
        {/* Left Lens Specular Glint */}
        <path d="M 134 107 L 144 109" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Right Lens Glass */}
        <path
          d="M 190 110 C 190 104 178 104 166 107 C 168 120 182 122 188 118 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="1.5"
        />
        {/* Right Lens Specular Glint */}
        <path d="M 176 109 L 186 107" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* ========================================== */}
        {/* 6. TRADITIONAL FIREFIGHTER HELMET          */}
        {/* ========================================== */}
        {/* Helmet Brim Flange (Wide curved protector) */}
        <path
          d="M 104 108 
             C 112 88 135 84 160 84 
             C 185 84 208 88 216 108 
             C 228 116 230 124 216 128
             C 188 118 132 118 104 128
             C 90 124 92 116 104 108 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Helmet Dome / Crown */}
        <path
          d="M 124 88 
             C 124 45 142 32 160 30 
             C 178 32 196 45 196 88 Z"
          fill="url(#charcoalFill)"
          stroke="url(#silverStroke)"
          strokeWidth="3.5"
        />

        {/* Helmet Center Ridge / Comb */}
        <path
          d="M 160 28 L 157 84 L 163 84 Z"
          fill="url(#silverPlate)"
          stroke="url(#silverStroke)"
          strokeWidth="1.5"
        />

        {/* Front Helmet Badge / Shield Plate */}
        <path
          d="M 152 48 L 160 40 L 168 48 L 165 72 L 155 72 Z"
          fill="url(#silverPlate)"
          stroke="url(#silverStroke)"
          strokeWidth="2"
        />
        <circle cx="160" cy="55" r="3.5" fill="url(#redAccentGlow)" />

        {/* Helmet Fluted Side Ridges */}
        <path d="M 142 46 C 140 60 140 76 142 86" stroke="url(#silverStroke)" strokeWidth="2" fill="none" />
        <path d="M 178 46 C 180 60 180 76 178 86" stroke="url(#silverStroke)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};
