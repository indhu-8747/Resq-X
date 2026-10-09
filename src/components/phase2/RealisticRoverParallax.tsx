import React, { useRef, useEffect } from 'react';

interface RealisticRoverParallaxProps {
  className?: string;
  isLightOn?: boolean;
}

/**
 * Interactive Realistic RESQ-X Rover Component
 *
 * Implements real-time cursor-following parallax & perspective tilt using
 * a requestAnimationFrame lerp loop and direct DOM transform updates for 60fps+ fluidity.
 *
 * - Cursor moves LEFT  -> Rover visibly tilts LEFT (rotateY up to -12deg)
 * - Cursor moves RIGHT -> Rover visibly tilts RIGHT (rotateY up to +12deg)
 * - Cursor moves UP    -> Rover visibly tilts UP (rotateX up to +8deg)
 * - Cursor moves DOWN  -> Rover visibly tilts DOWN (rotateX up to -8deg)
 * - Subtle parallax translation (translateX, translateY)
 * - Smooth ground shadow reaction
 * - Smooth easing reset when cursor leaves the card
 */
export const RealisticRoverParallax: React.FC<RealisticRoverParallaxProps> = ({
  className = '',
  isLightOn = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const roverTransformRef = useRef<HTMLDivElement | null>(null);
  const shadowTransformRef = useRef<HTMLDivElement | null>(null);
  const beamTransformRef = useRef<HTMLDivElement | null>(null);

  // Animation state (target vs current values for smooth lerp easing)
  const animState = useRef({
    targetRotX: 0,
    targetRotY: 0,
    targetTransX: 0,
    targetTransY: 0,
    currentRotX: 0,
    currentRotY: 0,
    currentTransX: 0,
    currentTransY: 0,
    isHovered: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    // Render loop: smoothly interpolates current transforms toward targets
    const renderLoop = () => {
      const s = animState.current;

      // Easing speed factor (0.1 = smooth glide, responsive yet soft)
      const ease = 0.12;
      s.currentRotX += (s.targetRotX - s.currentRotX) * ease;
      s.currentRotY += (s.targetRotY - s.currentRotY) * ease;
      s.currentTransX += (s.targetTransX - s.currentTransX) * ease;
      s.currentTransY += (s.targetTransY - s.currentTransY) * ease;

      // Apply 3D transform to Rover
      if (roverTransformRef.current) {
        roverTransformRef.current.style.transform = `perspective(900px) rotateX(${s.currentRotX.toFixed(
          2
        )}deg) rotateY(${s.currentRotY.toFixed(2)}deg) translate3d(${s.currentTransX.toFixed(
          2
        )}px, ${s.currentTransY.toFixed(2)}px, 15px)`;
      }

      // Apply reactive transform to ground contact shadow
      if (shadowTransformRef.current) {
        const shadowShiftX = -s.currentTransX * 0.75;
        const shadowShiftY = s.currentTransY * 0.4;
        const shadowScale = s.isHovered ? 1.05 : 1.0;
        shadowTransformRef.current.style.transform = `translate3d(${shadowShiftX.toFixed(
          2
        )}px, ${shadowShiftY.toFixed(2)}px, -10px) scale(${shadowScale})`;
      }

      // Apply reactive transform to searchlight beam
      if (beamTransformRef.current) {
        const beamShiftX = s.currentTransX * 0.8;
        const beamShiftY = -s.currentTransY * 0.6;
        beamTransformRef.current.style.transform = `translate3d(${beamShiftX.toFixed(
          2
        )}px, ${beamShiftY.toFixed(2)}px, 0px)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Mouse / Pointer Movement Handler
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Normalized coordinates: -0.5 (left/top) to +0.5 (right/bottom)
      const normX = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
      const normY = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));

      const s = animState.current;
      s.isHovered = true;

      // Map to target angles:
      // normX > 0 (cursor right) -> targetRotY > 0 (+12 deg tilt right)
      // normX < 0 (cursor left)  -> targetRotY < 0 (-12 deg tilt left)
      // normY > 0 (cursor down)  -> targetRotX < 0 (-8 deg tilt down)
      // normY < 0 (cursor up)    -> targetRotX > 0 (+8 deg tilt up)
      s.targetRotY = normX * 24;       // -12° to +12°
      s.targetRotX = -normY * 16;      // -8° to +8°
      s.targetTransX = normX * 14;     // -7px to +7px
      s.targetTransY = normY * 8;      // -4px to +4px
    };

    const handlePointerLeave = () => {
      const s = animState.current;
      s.isHovered = false;
      // Smoothly return to default rest position
      s.targetRotX = 0;
      s.targetRotY = 0;
      s.targetTransX = 0;
      s.targetTransY = 0;
    };

    // Attach listeners with passive flag for high scrolling performance
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden cursor-crosshair ${className}`}
      aria-label="Interactive RESQ-X Rover"
      style={{ touchAction: 'pan-y' }}
    >
      {/* 3D Transform Container containing the realistic rover */}
      <div
        ref={roverTransformRef}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3] flex items-center justify-center p-2"
      >
        {/* Ground Contact Shadow (reacts smoothly to tilt) */}
        <div
          ref={shadowTransformRef}
          style={{ willChange: 'transform' }}
          className="absolute bottom-4 w-52 sm:w-64 h-7 bg-black/60 blur-md rounded-full pointer-events-none"
        />

        {/* Searchlight Ambient Glow when LED is ON */}
        {isLightOn && (
          <div
            ref={beamTransformRef}
            style={{ willChange: 'transform' }}
            className="absolute top-1/3 -right-6 w-36 h-28 bg-[radial-gradient(ellipse_at_left,_rgba(254,240,138,0.25)_0%,_transparent_70%)] pointer-events-none blur-sm"
          />
        )}

        {/* Existing Realistic Physical Hardware SVG Asset */}
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl pointer-events-none"
        >
          <defs>
            <linearGradient id="hubGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <linearGradient id="tireGradClean" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="50%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            <linearGradient id="battGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="40%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            <linearGradient id="chassisGradClean" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="60%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#09090B" />
            </linearGradient>

            <radialGradient id="beamGradClean" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FDE047" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Front LED Illumination Cone */}
          {isLightOn && (
            <path
              d="M 270 125 L 320 70 L 320 180 Z"
              fill="url(#beamGradClean)"
              className="animate-pulse"
            />
          )}

          {/* Rear Left Wheel */}
          <g opacity="0.9">
            <rect x="52" y="48" width="48" height="32" rx="7" fill="url(#tireGradClean)" stroke="#3F3F46" strokeWidth="1.5" />
            <line x1="64" y1="48" x2="64" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <line x1="76" y1="48" x2="76" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <line x1="88" y1="48" x2="88" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <rect x="57" y="53" width="38" height="22" rx="5" fill="url(#hubGradClean)" stroke="#A16207" strokeWidth="1" />
            <circle cx="76" cy="64" r="4" fill="#18181B" />
          </g>

          {/* Front Left Wheel */}
          <g opacity="0.9">
            <rect x="202" y="48" width="48" height="32" rx="7" fill="url(#tireGradClean)" stroke="#3F3F46" strokeWidth="1.5" />
            <line x1="214" y1="48" x2="214" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <line x1="226" y1="48" x2="226" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <line x1="238" y1="48" x2="238" y2="80" stroke="#09090B" strokeWidth="2.5" />
            <rect x="207" y="53" width="38" height="22" rx="5" fill="url(#hubGradClean)" stroke="#A16207" strokeWidth="1" />
            <circle cx="226" cy="64" r="4" fill="#18181B" />
          </g>

          {/* Bottom Chassis Plate */}
          <rect
            x="60"
            y="88"
            width="190"
            height="62"
            rx="7"
            fill="url(#chassisGradClean)"
            stroke="#52525B"
            strokeWidth="1.5"
          />

          {/* Standoff Spacers */}
          <rect x="74" y="80" width="6" height="12" fill="#EAB308" />
          <rect x="152" y="80" width="6" height="12" fill="#EAB308" />
          <rect x="230" y="80" width="6" height="12" fill="#EAB308" />

          {/* Top Chassis Plate */}
          <rect
            x="66"
            y="80"
            width="178"
            height="14"
            rx="4"
            fill="#18181B"
            stroke="#3F3F46"
            strokeWidth="1"
          />

          {/* Blue Li-ion Battery Pack */}
          <g>
            <rect x="82" y="65" width="56" height="16" rx="3" fill="url(#battGradClean)" stroke="#1D4ED8" strokeWidth="1" />
            <rect x="138" y="69" width="3" height="8" rx="1" fill="#CBD5E1" />
            <rect x="82" y="50" width="56" height="15" rx="3" fill="url(#battGradClean)" stroke="#1D4ED8" strokeWidth="1" />
            <rect x="138" y="54" width="3" height="7" rx="1" fill="#CBD5E1" />
            <rect x="104" y="50" width="10" height="31" fill="#09090B" opacity="0.85" />
            <text x="88" y="77" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.95">
              11.8V Li-ion
            </text>
          </g>

          {/* PCB & Electronics */}
          <rect x="150" y="62" width="54" height="18" rx="2" fill="#065F46" stroke="#047857" strokeWidth="1" />
          <rect x="158" y="66" width="16" height="10" rx="1" fill="#18181B" stroke="#334155" strokeWidth="0.5" />
          <circle cx="184" cy="68" r="2" fill="#EF4444" />
          <circle cx="190" cy="68" r="2" fill="#10B981" />
          <circle cx="196" cy="68" r="2" fill="#3B82F6" />
          <path d="M 138 72 Q 144 80 150 71" stroke="#EF4444" strokeWidth="1.8" fill="none" />
          <path d="M 138 75 Q 146 83 150 74" stroke="#000000" strokeWidth="1.8" fill="none" />
          <path d="M 204 71 Q 218 64 232 73" stroke="#F59E0B" strokeWidth="1.5" fill="none" />

          {/* ESP32-CAM Module */}
          <rect x="234" y="74" width="18" height="34" rx="3" fill="#27272A" stroke="#52525B" strokeWidth="1" />
          <rect x="242" y="70" width="22" height="28" rx="2" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
          <circle cx="253" cy="84" r="7" fill="#09090B" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="253" cy="84" r="4" fill="#0284C7" />
          <circle cx="254" cy="83" r="1.5" fill="#FFFFFF" opacity="0.8" />
          <line x1="244" y1="70" x2="244" y2="62" stroke="#CA8A04" strokeWidth="1.5" />
          <text x="240" y="96" fill="#94A3B8" fontSize="5" fontFamily="monospace" fontWeight="bold">
            ESP32
          </text>

          {/* Front Searchlight LED */}
          <g>
            <rect x="250" y="112" width="18" height="14" rx="3" fill="#18181B" stroke="#71717A" strokeWidth="1" />
            <circle
              cx="259"
              cy="119"
              r="5"
              fill={isLightOn ? '#FEF08A' : '#71717A'}
              stroke={isLightOn ? '#FBBF24' : '#52525B'}
              strokeWidth="1.2"
            />
            {isLightOn && <circle cx="259" cy="119" r="2" fill="#FFFFFF" />}
          </g>

          <rect x="248" y="132" width="22" height="10" rx="3" fill="#09090B" stroke="#3F3F46" strokeWidth="1" />

          {/* Foreground Bottom-Left Wheel */}
          <g>
            <rect x="44" y="130" width="60" height="42" rx="9" fill="url(#tireGradClean)" stroke="#3F3F46" strokeWidth="2" />
            <line x1="58" y1="130" x2="58" y2="172" stroke="#09090B" strokeWidth="3" />
            <line x1="74" y1="130" x2="74" y2="172" stroke="#09090B" strokeWidth="3" />
            <line x1="90" y1="130" x2="90" y2="172" stroke="#09090B" strokeWidth="3" />
            <rect x="52" y="138" width="44" height="26" rx="6" fill="url(#hubGradClean)" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="74" cy="151" r="6" fill="#18181B" stroke="#52525B" strokeWidth="1.5" />
            <circle cx="74" cy="151" r="2.5" fill="#71717A" />
          </g>

          {/* Foreground Bottom-Right Wheel */}
          <g>
            <rect x="194" y="130" width="60" height="42" rx="9" fill="url(#tireGradClean)" stroke="#3F3F46" strokeWidth="2" />
            <line x1="208" y1="130" x2="208" y2="172" stroke="#09090B" strokeWidth="3" />
            <line x1="224" y1="130" x2="224" y2="172" stroke="#09090B" strokeWidth="3" />
            <line x1="240" y1="130" x2="240" y2="172" stroke="#09090B" strokeWidth="3" />
            <rect x="202" y="138" width="44" height="26" rx="6" fill="url(#hubGradClean)" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="224" cy="151" r="6" fill="#18181B" stroke="#52525B" strokeWidth="1.5" />
            <circle cx="224" cy="151" r="2.5" fill="#71717A" />
          </g>
        </svg>
      </div>
    </div>
  );
};
