import React, { useState, useEffect } from 'react';

interface ExplorerCharacterProps {
  explorerId: string;
  size?: 'page' | 'stage';
  isAnimated?: boolean;
  isSpeaking?: boolean;
  className?: string;
  onClick?: () => void;
}

const SPEECH_MOUTH_SEQUENCE = [1, 2, 3, 2, 0, 2, 1, 3, 2, 1] as const;

export const ExplorerCharacter: React.FC<ExplorerCharacterProps> = ({
  explorerId,
  size = 'page',
  isAnimated = true,
  isSpeaking = false,
  className = '',
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [mouthStep, setMouthStep] = useState(0);

  // Animate lips/mouth cadence while speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthStep(0);
      return;
    }

    setMouthStep(1);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SPEECH_MOUTH_SEQUENCE.length;
      setMouthStep(SPEECH_MOUTH_SEQUENCE[idx]);
    }, 115);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Periodic natural blinking
  useEffect(() => {
    if (!isAnimated) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isAnimated]);

  const handlePointerEnter = () => {
    if (isAnimated) {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1400);
    }
  };

  const isStage = size === 'stage';
  const widthClass = isStage ? 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96' : 'w-48 h-48 sm:w-56 sm:h-56';

  return (
    <div
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      className={`relative flex items-center justify-center select-none transition-transform duration-300 ${
        isAnimated && !isStage ? 'hover:scale-105 cursor-pointer' : ''
      } ${widthClass} ${className}`}
      role="img"
      aria-label={`Storybook illustration of NASA equipment ${explorerId}`}
    >
      {renderExplorerSvg(explorerId, isBlinking, isWaving, isStage, isSpeaking, mouthStep)}
    </div>
  );
};

function renderExplorerSvg(
  id: string,
  isBlinking: boolean,
  isWaving: boolean,
  isStage: boolean,
  isSpeaking: boolean,
  mouthStep: number
) {
  switch (id) {
    case 'apollo12-alsep':
      return renderAlsep(isBlinking, isWaving, isStage, isSpeaking, mouthStep);
    case 'surveyor3':
      return renderSurveyor3(isBlinking, isWaving, isStage, isSpeaking, mouthStep);
    case 'sojourner':
      return renderSojourner(isBlinking, isWaving, isStage, isSpeaking, mouthStep);
    case 'kepler':
      return renderKepler(isBlinking, isWaving, isStage, isSpeaking, mouthStep);
    default:
      return renderAlsep(isBlinking, isWaving, isStage, isSpeaking, mouthStep);
  }
}

// 1. APOLLO 12 ALSEP SCIENTIFIC PACKAGES (Moon)
function renderAlsep(
  isBlinking: boolean,
  isWaving: boolean,
  isStage: boolean,
  isSpeaking: boolean,
  mouthStep: number
) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-md overflow-visible">
      {/* Lunar Ocean of Storms Ground Shadow */}
      <ellipse cx="200" cy="355" rx={isStage ? "120" : "90"} ry="16" fill="rgba(30, 20, 10, 0.25)" />

      {/* Orange/Gold Ribbon Telemetry Cables connecting instruments */}
      <path d="M120,320 Q160,335 190,300" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M220,300 Q260,335 300,320" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Left: SNAP-27 Radioisotope Thermoelectric Generator (RTG) with Cooling Fins */}
      <g transform="translate(60, 270)">
        <rect x="20" y="10" width="35" height="45" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
        <line x1="26" y1="5" x2="26" y2="60" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <line x1="37" y1="5" x2="37" y2="60" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="5" x2="48" y2="60" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="37" cy="32" r="5" fill="#F59E0B" />
        <circle cx="37" cy="32" r="2" fill="#FEF08A" />
      </g>

      {/* Right: Passive Seismic Experiment Dome (Listening to Moonquakes) */}
      <g transform="translate(280, 275)">
        <ellipse cx="25" cy="45" rx="30" ry="10" fill="#CA8A04" stroke="#854D0E" strokeWidth="2" />
        <path d="M-5,45 Q25,10 55,45 Z" fill="#FBBF24" stroke="#CA8A04" strokeWidth="2.5" />
        <path d="M25,8 Q35,4 40,8" stroke="#F59E0B" strokeWidth="2" fill="none" opacity={isWaving ? "1" : "0.5"} />
        <path d="M20,0 Q35,-5 50,0" stroke="#F59E0B" strokeWidth="2" fill="none" opacity={isWaving ? "1" : "0.3"} />
      </g>

      {/* Center: ALSEP Central Station Unit */}
      <rect x="150" y="215" width="100" height="85" rx="12" fill="#E2E8F0" stroke="#334155" strokeWidth="3.5" />
      {/* Sunshield Top Cover */}
      <polygon points="140,215 260,215 250,195 150,195" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />

      {/* Helical High-Gain Antenna on Mast (Pointing to Earth) */}
      <line x1="200" y1="195" x2="200" y2="90" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <path d="M194,145 Q206,140 194,135 Q206,130 194,125 Q206,120 194,115 Q206,110 200,95" stroke="#E7B96A" strokeWidth="3" fill="none" />
      <circle cx="200" cy="90" r="5" fill="#EF4444" />

      {/* Expressive Optics on Central Station Box */}
      <circle cx="178" cy="245" r="14" fill="#0F172A" />
      <circle cx="178" cy="245" r="11" fill="#10B981" />
      {isBlinking ? (
        <line x1="168" y1="245" x2="188" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="178" cy="245" r="7" fill="#0F172A" />
          <circle cx="175" cy="242" r="3" fill="#FFFFFF" />
        </>
      )}

      <circle cx="222" cy="245" r="14" fill="#0F172A" />
      <circle cx="222" cy="245" r="11" fill="#10B981" />
      {isBlinking ? (
        <line x1="212" y1="245" x2="232" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="222" cy="245" r="7" fill="#0F172A" />
          <circle cx="219" cy="242" r="3" fill="#FFFFFF" />
        </>
      )}

      {/* Moving Lips / Mouth */}
      {isSpeaking && mouthStep === 1 ? (
        <g>
          <path d="M192,265 Q200,263 208,265 Q208,271 200,271 Q192,271 192,265 Z" fill="#0F172A" stroke="#334155" strokeWidth="2.2" strokeLinejoin="round" />
          <ellipse cx="200" cy="269.5" rx="3.5" ry="1.3" fill="#FB7185" />
        </g>
      ) : isSpeaking && mouthStep === 2 ? (
        <g>
          <path d="M191,264 Q200,260 209,264 Q209,276 200,276 Q191,276 191,264 Z" fill="#0F172A" stroke="#334155" strokeWidth="2.2" strokeLinejoin="round" />
          <ellipse cx="200" cy="273" rx="4.5" ry="2" fill="#FB7185" />
          <path d="M194,264 Q200,262 206,264" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      ) : isSpeaking && mouthStep === 3 ? (
        <g>
          <ellipse cx="200" cy="267.5" rx="4.5" ry="4.5" fill="#0F172A" stroke="#334155" strokeWidth="2.2" />
          <ellipse cx="200" cy="269.5" rx="2.2" ry="1.2" fill="#FB7185" />
        </g>
      ) : (
        <path d="M194,265 Q200,272 206,265" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Telemetry Status Lights */}
      <circle cx="175" cy="285" r="3" fill="#10B981" />
      <circle cx="190" cy="285" r="3" fill="#3B82F6" />
      <circle cx="205" cy="285" r="3" fill="#F59E0B" />
      <circle cx="220" cy="285" r="3" fill="#8B5CF6" />
    </svg>
  );
}

// 2. SURVEYOR 3 LUNAR LANDER (Moon)
function renderSurveyor3(
  isBlinking: boolean,
  isWaving: boolean,
  isStage: boolean,
  isSpeaking: boolean,
  mouthStep: number
) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-md overflow-visible">
      <ellipse cx="200" cy="355" rx={isStage ? "110" : "85"} ry="16" fill="rgba(30, 20, 10, 0.25)" />
      <path d="M80,345 C150,358 250,358 320,345" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* Three Tripod Shock-Absorbing Landing Legs */}
      <path d="M200,240 L110,340 M110,340 L135,320" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="110" cy="342" rx="16" ry="6" fill="#94A3B8" stroke="#334155" strokeWidth="2" />

      <path d="M200,240 L290,340 M290,340 L265,320" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="290" cy="342" rx="16" ry="6" fill="#94A3B8" stroke="#334155" strokeWidth="2" />

      <path d="M200,240 L200,340" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="200" cy="342" rx="16" ry="6" fill="#94A3B8" stroke="#334155" strokeWidth="2" />

      {/* Triangular Central Spacecraft Body */}
      <polygon points="200,180 145,260 255,260" fill="#E2E8F0" stroke="#334155" strokeWidth="3" />
      <polygon points="200,195 160,250 240,250" fill="#CBD5E1" />

      {/* Tall Mast with Planar Solar Panel & High-Gain Antenna */}
      <line x1="200" y1="180" x2="200" y2="75" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <rect x="180" y="60" width="40" height="24" rx="3" fill="#1E3A8A" stroke="#E7B96A" strokeWidth="2" />
      <line x1="200" y1="60" x2="200" y2="84" stroke="#93C5FD" strokeWidth="1" />
      <ellipse cx="200" cy="50" rx="18" ry="6" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />

      {/* Television Camera Cylinder */}
      <g transform="translate(160, 205)">
        <rect x="0" y="0" width="30" height="40" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="15" cy="20" r="11" fill="#0F172A" />
        <circle cx="15" cy="20" r="9" fill="#3B82F6" />
        {isBlinking ? (
          <line x1="6" y1="20" x2="24" y2="20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <>
            <circle cx="15" cy="20" r="5" fill="#0F172A" />
            <circle cx="13" cy="18" r="2.5" fill="#FFFFFF" />
          </>
        )}
      </g>

      <circle cx="218" cy="225" r="11" fill="#0F172A" />
      <circle cx="218" cy="225" r="9" fill="#3B82F6" />
      {isBlinking ? (
        <line x1="209" y1="225" x2="227" y2="225" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="218" cy="225" r="5" fill="#0F172A" />
          <circle cx="216" cy="223" r="2.5" fill="#FFFFFF" />
        </>
      )}

      {/* Moving Lips / Mouth */}
      {isSpeaking && mouthStep === 1 ? (
        <g>
          <path d="M207,240 Q214,238 221,240 Q221,246 214,246 Q207,246 207,240 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="214" cy="244.5" rx="3" ry="1.1" fill="#FB7185" />
        </g>
      ) : isSpeaking && mouthStep === 2 ? (
        <g>
          <path d="M206,239 Q214,236 222,239 Q222,249 214,249 Q206,249 206,239 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="214" cy="246.8" rx="3.8" ry="1.6" fill="#FB7185" />
          <path d="M209,239 Q214,237.5 219,239" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      ) : isSpeaking && mouthStep === 3 ? (
        <g>
          <circle cx="214" cy="242.5" r="4" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="214" cy="244.2" rx="1.8" ry="1" fill="#FB7185" />
        </g>
      ) : (
        <path d="M208,240 Q214,246 220,240" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* Extendable Surface Sampler Arm & Claw */}
      <g className={`transition-transform duration-500 origin-[235px_245px] ${isWaving ? '-rotate-20' : ''}`}>
        <path d="M235,245 L260,235 L285,250 L310,240 L330,265" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M330,265 L345,280 L338,290 L325,275 Z" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
        <ellipse cx="340" cy="292" rx="8" ry="3" fill="#64748B" opacity="0.6" />
      </g>
    </svg>
  );
}

// 3. SOJOURNER ROVER & MARS PATHFINDER LANDER (Mars)
function renderSojourner(
  isBlinking: boolean,
  isWaving: boolean,
  isStage: boolean,
  isSpeaking: boolean,
  mouthStep: number
) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-md overflow-visible">
      <ellipse cx="200" cy="355" rx={isStage ? "90" : "70"} ry="14" fill="rgba(30, 20, 10, 0.25)" />
      <polygon points="60,350 150,335 150,345 60,360" fill="#64748B" opacity="0.4" />

      {/* Gold Foil Thermal Body */}
      <rect x="135" y="195" width="130" height="90" rx="14" fill="#FBBF24" stroke="#B45309" strokeWidth="3.5" />
      <line x1="145" y1="210" x2="255" y2="210" stroke="#D97706" strokeWidth="1.5" />
      <line x1="145" y1="235" x2="255" y2="235" stroke="#D97706" strokeWidth="1.5" />
      <line x1="145" y1="260" x2="255" y2="260" stroke="#D97706" strokeWidth="1.5" />

      {/* Rooftop Solar Cell Plate */}
      <polygon points="125,195 275,195 260,165 140,165" fill="#1E3A8A" stroke="#1E293B" strokeWidth="3" />
      <line x1="170" y1="167" x2="160" y2="193" stroke="#60A5FA" strokeWidth="1.5" />
      <line x1="200" y1="167" x2="200" y2="193" stroke="#60A5FA" strokeWidth="1.5" />
      <line x1="230" y1="167" x2="240" y2="193" stroke="#60A5FA" strokeWidth="1.5" />

      {/* Stereo Camera Eyes */}
      <circle cx="170" cy="235" r="16" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
      {isBlinking ? (
        <line x1="158" y1="235" x2="182" y2="235" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="172" cy="235" r="10" fill="#1E293B" />
          <circle cx="170" cy="232" r="4" fill="#FFFFFF" />
          <circle cx="175" cy="237" r="1.5" fill="#FFFFFF" />
        </>
      )}

      <circle cx="230" cy="235" r="16" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
      {isBlinking ? (
        <line x1="218" y1="235" x2="242" y2="235" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="228" cy="235" r="10" fill="#1E293B" />
          <circle cx="226" cy="232" r="4" fill="#FFFFFF" />
          <circle cx="231" cy="237" r="1.5" fill="#FFFFFF" />
        </>
      )}

      <circle cx="150" cy="246" r="6" fill="#F87171" opacity="0.5" />
      <circle cx="250" cy="246" r="6" fill="#F87171" opacity="0.5" />
      {/* Moving Lips / Mouth */}
      {isSpeaking && mouthStep === 1 ? (
        <g>
          <path d="M189,252 Q200,249 211,252 Q211,260 200,260 Q189,260 189,252 Z" fill="#451A03" stroke="#78350F" strokeWidth="2.4" strokeLinejoin="round" />
          <ellipse cx="200" cy="257.8" rx="4.5" ry="1.6" fill="#FB7185" />
        </g>
      ) : isSpeaking && mouthStep === 2 ? (
        <g>
          <path d="M188,251 Q200,246 212,251 Q212,266 200,266 Q188,266 188,251 Z" fill="#451A03" stroke="#78350F" strokeWidth="2.4" strokeLinejoin="round" />
          <ellipse cx="200" cy="262.2" rx="5.5" ry="2.2" fill="#FB7185" />
          <path d="M192,251 Q200,249 208,251" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      ) : isSpeaking && mouthStep === 3 ? (
        <g>
          <ellipse cx="200" cy="256.5" rx="5.5" ry="5.8" fill="#451A03" stroke="#78350F" strokeWidth="2.4" />
          <ellipse cx="200" cy="259" rx="2.8" ry="1.5" fill="#FB7185" />
        </g>
      ) : (
        <path d="M190,252 Q200,262 210,252" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Whip Antenna */}
      <g className={`transition-transform duration-300 origin-[245px_165px] ${isWaving ? 'rotate-12' : ''}`}>
        <path d="M245,165 Q255,120 260,85" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="260" cy="85" r="5" fill="#EF4444" />
        <path d="M266,79 Q273,85 266,91" stroke="#EF4444" strokeWidth="2" fill="none" opacity={isWaving ? "1" : "0.5"} />
        <path d="M272,74 Q283,85 272,96" stroke="#EF4444" strokeWidth="2" fill="none" opacity={isWaving ? "1" : "0.2"} />
      </g>

      {/* Rocker-Bogie Suspension & 6 Cleated Rover Wheels */}
      <path d="M140,270 L110,310 M150,270 L160,310 M250,270 L240,310 M260,270 L290,310" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

      <g>
        <circle cx="110" cy="315" r="17" fill="#475569" stroke="#1E293B" strokeWidth="3" />
        <circle cx="110" cy="315" r="7" fill="#CBD5E1" />
        <circle cx="160" cy="315" r="17" fill="#475569" stroke="#1E293B" strokeWidth="3" />
        <circle cx="160" cy="315" r="7" fill="#CBD5E1" />
        <circle cx="200" cy="315" r="17" fill="#475569" stroke="#1E293B" strokeWidth="3" />
        <circle cx="200" cy="315" r="7" fill="#CBD5E1" />
        <circle cx="240" cy="315" r="17" fill="#475569" stroke="#1E293B" strokeWidth="3" />
        <circle cx="240" cy="315" r="7" fill="#CBD5E1" />
        <circle cx="290" cy="315" r="17" fill="#475569" stroke="#1E293B" strokeWidth="3" />
        <circle cx="290" cy="315" r="7" fill="#CBD5E1" />
      </g>

      {/* APXS Spectrometer Arm */}
      <g className={`transition-transform duration-500 origin-[140px_260px] ${isWaving ? '-rotate-12' : ''}`}>
        <path d="M140,260 L95,275" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <rect x="75" y="265" width="22" height="18" rx="4" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
        <circle cx="80" cy="274" r="3" fill="#38BDF8" />
        <polygon points="50,335 85,310 95,340 45,342" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <circle cx="68" cy="324" r="2" fill="#78350F" />
      </g>
    </svg>
  );
}

// 4. KEPLER SPACE TELESCOPE (Heliocentric Orbit / Exoplanet Hunter)
function renderKepler(
  isBlinking: boolean,
  isWaving: boolean,
  isStage: boolean,
  isSpeaking: boolean,
  mouthStep: number
) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-md overflow-visible">
      <defs>
        <linearGradient id="kep-barrel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="45%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="kep-solar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="kep-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Orbital Shadow */}
      <ellipse cx="200" cy="355" rx={isStage ? "105" : "80"} ry="14" fill="rgba(30, 20, 10, 0.22)" />

      {/* Sparkling Exoplanet & Star Backdrop around Kepler */}
      <g opacity="0.9">
        <circle cx="80" cy="95" r="14" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
        <path d="M62,100 Q80,108 98,96" stroke="#E0F2FE" strokeWidth="2" fill="none" />
        <circle cx="325" cy="115" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <path d="M312,68 L314,74 L320,76 L314,78 L312,84 L310,78 L304,76 L310,74 Z" fill="#FACC15" />
        <path d="M96,155 L97.5,160 L102,161.5 L97.5,163 L96,168 L94.5,163 L90,161.5 L94.5,160 Z" fill="#38BDF8" />
      </g>

      {/* Main Tilted Telescope Assembly */}
      <g className={`transition-transform duration-500 origin-[200px_220px] ${isWaving ? '-rotate-6 scale-105' : ''}`}>
        {/* Curved Wrap-Around Solar Array Wing (Kepler's Iconic 4-Panel Solar Shield!) */}
        <path
          d="M 105 245 Q 200 285 295 245 L 285 160 Q 200 190 115 160 Z"
          fill="url(#kep-solar)"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Solar Panel Grid Seams */}
        <line x1="145" y1="168" x2="138" y2="256" stroke="#93C5FD" strokeWidth="1.5" opacity="0.7" />
        <line x1="200" y1="175" x2="200" y2="265" stroke="#93C5FD" strokeWidth="1.5" opacity="0.7" />
        <line x1="255" y1="168" x2="262" y2="256" stroke="#93C5FD" strokeWidth="1.5" opacity="0.7" />
        <path d="M 110 205 Q 200 238 290 205" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.65" />

        {/* Hexagonal Spacecraft Bus Base */}
        <polygon
          points="150,250 250,250 265,285 235,305 165,305 135,285"
          fill="url(#kep-gold)"
          stroke="#78350F"
          strokeWidth="3"
        />
        <rect x="172" y="268" width="56" height="22" rx="4" fill="#1E293B" />
        <text x="200" y="283" textAnchor="middle" fill="#FDE047" fontSize="9" fontWeight="bold" letterSpacing="1">
          KEPLER
        </text>

        {/* High-Gain Dish Antenna Below */}
        <line x1="200" y1="305" x2="200" y2="326" stroke="#475569" strokeWidth="4" />
        <ellipse cx="200" cy="330" rx="28" ry="8" fill="#E2E8F0" stroke="#334155" strokeWidth="2.5" />
        <circle cx="200" cy="334" r="3" fill="#0284C7" />

        {/* Cylindrical Schmidt Photometer Barrel */}
        <rect
          x="152"
          y="108"
          width="96"
          height="142"
          rx="12"
          fill="url(#kep-barrel)"
          stroke="#94A3B8"
          strokeWidth="3"
        />

        {/* Beveled Sunshade Hood on Top */}
        <polygon
          points="146,112 254,112 246,72 154,88"
          fill="#CBD5E1"
          stroke="#334155"
          strokeWidth="3"
        />
        <ellipse cx="200" cy="80" rx="46" ry="11" fill="#041022" stroke="#64748B" strokeWidth="2.5" />
        {/* Starlight Mirror Glint inside Aperture */}
        <ellipse cx="200" cy="80" rx="34" ry="7" fill="#0EA5E9" opacity="0.35" />

        {/* Friendly Telescope Visor & Eyes on Barrel */}
        <rect x="162" y="138" width="76" height="44" rx="12" fill="#041022" stroke="#38BDF8" strokeWidth="2.2" />

        {/* Left Star-Hunting Lens Eye */}
        <circle cx="182" cy="158" r="11" fill="#0EA5E9" />
        {isBlinking ? (
          <line x1="173" y1="158" x2="191" y2="158" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <>
            <circle cx="182" cy="158" r="6" fill="#041022" />
            <circle cx="179.5" cy="155.5" r="2.8" fill="#FFFFFF" />
            <circle cx="184.5" cy="160.5" r="1.3" fill="#7DD3FC" />
          </>
        )}

        {/* Right Star-Hunting Lens Eye */}
        <circle cx="218" cy="158" r="11" fill="#0EA5E9" />
        {isBlinking ? (
          <line x1="209" y1="158" x2="227" y2="158" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <>
            <circle cx="218" cy="158" r="6" fill="#041022" />
            <circle cx="215.5" cy="155.5" r="2.8" fill="#FFFFFF" />
            <circle cx="220.5" cy="160.5" r="1.3" fill="#7DD3FC" />
          </>
        )}

        {/* Moving Digital Lips / Mouth */}
        {isSpeaking && mouthStep === 1 ? (
          <path
            d="M191,173 Q200,170 209,173 Q208,178 200,178 Q192,178 191,173 Z"
            fill="#0EA5E9"
            fillOpacity="0.35"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        ) : isSpeaking && mouthStep === 2 ? (
          <path
            d="M190,172 Q200,168 210,172 Q209,181 200,181 Q191,181 190,172 Z"
            fill="#0EA5E9"
            fillOpacity="0.5"
            stroke="#7DD3FC"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        ) : isSpeaking && mouthStep === 3 ? (
          <ellipse
            cx="200"
            cy="174.5"
            rx="4.2"
            ry="4"
            fill="#0EA5E9"
            fillOpacity="0.45"
            stroke="#38BDF8"
            strokeWidth="2.2"
          />
        ) : (
          <path d="M193,173 Q200,178 207,173" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  );
}
