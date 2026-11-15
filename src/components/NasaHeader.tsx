import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface NasaHeaderProps {
  subtitle?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const NasaHeader: React.FC<NasaHeaderProps> = ({
  subtitle,
  isMuted,
  onToggleMute,
}) => {
  const { language, isUrdu } = useLanguage();
  const appT = getTranslations(language).app;
  const dispatchT = getTranslations(language).dispatch;
  const resolvedSubtitle =
    subtitle || `${dispatchT.brandTitle} — ${dispatchT.brandSubtitle}`;

  return (
    <header
      className={`w-full flex items-center justify-between px-4 sm:px-8 py-3 z-30 select-none ${
        isUrdu ? 'font-urdu' : ''
      }`}
    >
      {/* Official NASA Meatball Badge (Left) */}
      <div className="flex items-center gap-2">
        <svg className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" viewBox="0 0 100 100" fill="none" aria-label="NASA Logo">
          <circle cx="50" cy="50" r="48" fill="#0B3D91" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M20 50 L80 32 L56 68 L72 74"
            stroke="#FC3D21"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="32" cy="30" r="1.5" fill="#FFFFFF" />
          <circle cx="45" cy="24" r="1" fill="#FFFFFF" />
          <circle cx="68" cy="25" r="1.5" fill="#FFFFFF" />
          <circle cx="75" cy="42" r="1" fill="#FFFFFF" />
          <circle cx="28" cy="65" r="1" fill="#FFFFFF" />
          <circle cx="42" cy="72" r="1.5" fill="#FFFFFF" />
          <circle cx="62" cy="66" r="1" fill="#FFFFFF" />
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="21"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            NASA
          </text>
        </svg>
      </div>

      {/* Center Challenge Title */}
      <div className="flex flex-col items-center text-center px-2">
        <span className="text-[11px] sm:text-xs text-[#E7B96A] font-medium tracking-wider uppercase">
          {isUrdu ? 'ناسا اسپیس ایپس چیلنج' : 'NASA Space Apps Challenge'}
        </span>
        <h1 className="font-storybook text-xs sm:text-sm md:text-base text-[#F5F8FF] font-semibold tracking-wide">
          {resolvedSubtitle}
        </h1>
      </div>

      {/* Right NASA Badge or Sound Control */}
      <div className="flex items-center gap-2">
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? appT.unmuteAria : appT.muteAria}
            className="p-1.5 sm:p-2 rounded-full bg-[#102C57]/60 hover:bg-[#1B3B6F] text-[#E7B96A] hover:text-[#FFF1C5] transition-colors cursor-pointer border border-[#E7B96A]/30"
            title={isMuted ? appT.unmuteTooltip : appT.muteTooltip}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        <div className="hidden sm:flex items-center">
          <svg className="w-8 h-8 opacity-90" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" fill="#0B3D91" stroke="#E7B96A" strokeWidth="1.5" />
            <text
              x="50"
              y="56"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="20"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              NASA
            </text>
          </svg>
        </div>
      </div>
    </header>
  );
};
