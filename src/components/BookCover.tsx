import React from 'react';
import { BookOpen } from 'lucide-react';
import { RobotGuide } from './RobotGuide';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface BookCoverProps {
  onOpen: () => void;
  isOpening?: boolean;
  isMuted?: boolean;
  onOpenRobotAssistant?: () => void;
  onOpenSendMessage?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  onOpen,
  isOpening = false,
  isMuted = false,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).cover;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-2 sm:py-3 pb-6 sm:pb-8 select-none">
      {/* Welcoming Guide Robot Assistant */}
      <div
        className={`w-full flex justify-center scale-[0.88] sm:scale-100 mb-1 sm:mb-2 transition-all duration-300 ${
          isOpening ? 'opacity-0 -translate-y-2' : ''
        }`}
      >
        <RobotGuide
          currentSpreadIndex={0}
          isTransformed={false}
          isMuted={isMuted}
          isCover={true}
        />
      </div>

      {/* Upright Illustrated Hardcover Book with 3D Perspective Hinge */}
      <div style={{ perspective: '1300px' }}>
        <div
          onClick={onOpen}
          role="button"
          tabIndex={0}
          aria-label={t.openBookAria}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          style={{
            transformOrigin: isUrdu ? 'right center' : 'left center',
            transform: isOpening
              ? isUrdu
                ? 'rotateY(38deg) scale(0.95) translateY(-14px)'
                : 'rotateY(-38deg) scale(0.95) translateY(-14px)'
              : undefined,
          }}
          className={`group relative cursor-pointer transition-all duration-500 ease-out focus:outline-none rounded-2xl ${
            isOpening ? 'opacity-0 pointer-events-none' : 'hover:scale-[1.015]'
          }`}
        >
          {/* Realistic Page Thickness / Edge (Right edge in EN, Left edge in Urdu RTL) */}
          <div
            className={`absolute ${
              isUrdu
                ? 'left-[-12px] rounded-l-md border-l bg-gradient-to-l'
                : 'right-[-12px] rounded-r-md border-r bg-gradient-to-r'
            } top-[12px] bottom-[12px] w-[15px] from-[#D8C7A5] via-[#EDE0C4] to-[#C9B690] shadow-xl border-y border-[#8C7350]/40 flex flex-col justify-evenly py-2 overflow-hidden pointer-events-none`}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-[#9C825D]/30" />
            ))}
          </div>

          {/* Soft Book Drop Shadow */}
          <div className="absolute -inset-3 bg-black/70 rounded-3xl blur-xl -z-10 group-hover:bg-[#E7B96A]/15 transition-colors duration-500" />

          {/* Hardcover Front Face */}
          <div className="aspect-[7/10] h-[320px] sm:h-[410px] md:h-[470px] lg:h-[510px] rounded-2xl bg-[#0D2548] border-2 border-[#E7B96A] shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {isUrdu ? (
              /* ============================================================ */
              /* URDU RTL HARDCOVER FACE (MATCHING NAVY & GOLD ASTRIVA MOTIF) */
              /* ============================================================ */
              <div
                dir="rtl"
                aria-label={t.coverAlt}
                className="relative w-full h-full bg-gradient-to-b from-[#0E284E] via-[#0B2040] to-[#081933] flex flex-col items-center justify-between px-6 py-6 sm:px-8 sm:py-7 overflow-hidden"
              >
                {/* Background celestial dots & soft glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#1C487D]/30 blur-2xl" />
                  <span className="absolute top-[16%] left-[18%] w-1 h-1 rounded-full bg-[#F7DCA1]/70" />
                  <span className="absolute top-[22%] right-[16%] w-1.5 h-1.5 rounded-full bg-[#E7B96A]/80" />
                  <span className="absolute top-[36%] left-[12%] w-1 h-1 rounded-full bg-[#FFF1C5]/60" />
                  <span className="absolute top-[52%] right-[12%] w-1 h-1 rounded-full bg-[#E7B96A]/70" />
                  <span className="absolute bottom-[30%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#F7DCA1]/60" />
                  <span className="absolute bottom-[28%] right-[18%] w-1 h-1 rounded-full bg-[#FFF1C5]/70" />
                </div>

                {/* Double Gold Art-Deco Corner Frame */}
                <svg
                  viewBox="0 0 350 500"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Outer border with notched stepped corners */}
                  <path
                    d="M 28 18 H 322 M 28 482 H 322 M 18 28 V 472 M 332 28 V 472"
                    stroke="#D6A95C"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Corner squares */}
                  <rect x="14" y="14" width="14" height="14" fill="none" stroke="#D6A95C" strokeWidth="1.8" />
                  <rect x="322" y="14" width="14" height="14" fill="none" stroke="#D6A95C" strokeWidth="1.8" />
                  <rect x="14" y="472" width="14" height="14" fill="none" stroke="#D6A95C" strokeWidth="1.8" />
                  <rect x="322" y="472" width="14" height="14" fill="none" stroke="#D6A95C" strokeWidth="1.8" />
                  {/* Inner hairline frame */}
                  <rect
                    x="24"
                    y="24"
                    width="302"
                    height="452"
                    fill="none"
                    stroke="#D6A95C"
                    strokeWidth="0.9"
                    opacity="0.7"
                  />
                </svg>

                {/* Top Title & Subtitle */}
                <div className="relative z-10 flex flex-col items-center text-center pt-1 sm:pt-2">
                  <h1 className="font-urdu-nastaliq text-[36px] sm:text-[46px] font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)] leading-[1.3]">
                    {t.coverTitle}
                  </h1>
                  <p className="font-urdu-nastaliq text-[11px] sm:text-[13px] text-white leading-[1.6] mt-0.5 whitespace-pre-line">
                    {t.coverSubtitle}
                  </p>
                </div>

                {/* Central Emblem: Star Spiral, Small Rover & Open Book */}
                <div className="relative z-10 w-full flex-1 flex items-center justify-center my-1">
                  <svg
                    viewBox="0 0 260 210"
                    className="w-[78%] max-w-[220px] h-auto overflow-visible"
                    aria-hidden="true"
                  >
                    {/* Dotted golden spiral rising out of the open book */}
                    <path
                      d="M 130 148 C 110 132, 86 112, 92 88 C 98 62, 162 66, 164 44 C 166 24, 134 14, 108 24"
                      fill="none"
                      stroke="#E7B96A"
                      strokeWidth="1.8"
                      strokeDasharray="2.5 5"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M 130 148 C 154 130, 174 106, 166 84 C 158 64, 108 72, 106 50"
                      fill="none"
                      stroke="#F5D78E"
                      strokeWidth="1.3"
                      strokeDasharray="2 5"
                      strokeLinecap="round"
                      opacity="0.7"
                    />

                    {/* Stars & orbital dots */}
                    <path d="M168 38 L170 44 L176 46 L170 48 L168 54 L166 48 L160 46 L166 44 Z" fill="#FFF1C5" />
                    <path d="M84 68 L85.5 72 L90 73.5 L85.5 75 L84 79 L82.5 75 L78 73.5 L82.5 72 Z" fill="#E7B96A" />
                    <path d="M178 96 L179.5 100 L184 101.5 L179.5 103 L178 107 L176.5 103 L172 101.5 L176.5 100 Z" fill="#F5D78E" />
                    <circle cx="115" cy="96" r="2.2" fill="#FFF1C5" />
                    <circle cx="148" cy="112" r="2" fill="#E7B96A" />

                    {/* Mini Sojourner Rover at top of spiral */}
                    <g transform="translate(108, 12)">
                      <rect x="6" y="10" width="24" height="6" rx="1.5" fill="#E7B96A" />
                      <rect x="9" y="6" width="18" height="4" rx="1" fill="#F7DCA1" />
                      <line x1="25" y1="6" x2="25" y2="1" stroke="#FFF1C5" strokeWidth="1.4" />
                      <circle cx="25" cy="1" r="1.5" fill="#FFF1C5" />
                      <circle cx="10" cy="19" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                      <circle cx="18" cy="19" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                      <circle cx="26" cy="19" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                    </g>

                    {/* Central Golden Open Book */}
                    <g transform="translate(46, 134)">
                      {/* Outer cover */}
                      <path
                        d="M 8 42 Q 44 35, 84 48 Q 124 35, 160 42 L 166 50 Q 124 43, 84 56 Q 44 43, 2 50 Z"
                        fill="#C89B4E"
                        stroke="#FFF1C5"
                        strokeWidth="1.1"
                      />
                      {/* Left & Right open curved pages */}
                      <path
                        d="M 10 38 Q 46 28, 84 44 L 84 18 Q 46 2, 18 14 Z"
                        fill="#E7B96A"
                        stroke="#FFF1C5"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M 158 38 Q 122 28, 84 44 L 84 18 Q 122 2, 150 14 Z"
                        fill="#F4D388"
                        stroke="#FFF1C5"
                        strokeWidth="1.2"
                      />
                      {/* Subtle page lines */}
                      <path d="M 28 22 Q 52 16, 75 26" fill="none" stroke="#8C6426" strokeWidth="1" opacity="0.65" />
                      <path d="M 25 29 Q 50 23, 75 33" fill="none" stroke="#8C6426" strokeWidth="1" opacity="0.65" />
                      <path d="M 140 22 Q 116 16, 93 26" fill="none" stroke="#8C6426" strokeWidth="1" opacity="0.65" />
                      <path d="M 143 29 Q 118 23, 93 33" fill="none" stroke="#8C6426" strokeWidth="1" opacity="0.65" />
                    </g>
                  </svg>
                </div>

                {/* Bottom Horizon Terrain with Explorers + Tagline */}
                <div className="relative z-10 w-full flex flex-col items-center space-y-1">
                  <svg
                    viewBox="0 0 280 82"
                    className="w-full max-w-[240px] h-auto"
                    aria-hidden="true"
                  >
                    {/* Dotted planetary hills */}
                    <path
                      d="M 8 68 Q 70 46, 138 62 T 272 56"
                      fill="none"
                      stroke="#D6A95C"
                      strokeWidth="1.8"
                      strokeDasharray="2 4.5"
                    />
                    <path
                      d="M 22 76 Q 110 64, 196 74 T 268 70"
                      fill="none"
                      stroke="#D6A95C"
                      strokeWidth="1.4"
                      strokeDasharray="1.8 4.5"
                      opacity="0.7"
                    />

                    {/* Left Rover Silhouette */}
                    <g transform="translate(30, 32)">
                      <rect x="10" y="10" width="22" height="7" rx="1.5" fill="#E7B96A" />
                      <line x1="16" y1="10" x2="16" y2="2" stroke="#F4D388" strokeWidth="2" />
                      <rect x="12" y="0" width="9" height="4" rx="1" fill="#FFF1C5" />
                      <circle cx="13" cy="21" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.5" />
                      <circle cx="21" cy="21" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.5" />
                      <circle cx="29" cy="21" r="3" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.5" />
                    </g>

                    {/* Center Lunar Lander */}
                    <g transform="translate(116, 20)">
                      <polygon points="14,12 34,12 38,24 10,24" fill="#E7B96A" />
                      <ellipse cx="24" cy="7" rx="9" ry="4" fill="#F4D388" />
                      <line x1="12" y1="24" x2="5" y2="35" stroke="#E7B96A" strokeWidth="1.8" />
                      <line x1="36" y1="24" x2="43" y2="35" stroke="#E7B96A" strokeWidth="1.8" />
                      <line x1="24" y1="24" x2="24" y2="36" stroke="#E7B96A" strokeWidth="1.8" />
                      <ellipse cx="5" cy="36" rx="3.2" ry="1.4" fill="#FFF1C5" />
                      <ellipse cx="43" cy="36" rx="3.2" ry="1.4" fill="#FFF1C5" />
                      <ellipse cx="24" cy="37" rx="3.2" ry="1.4" fill="#FFF1C5" />
                    </g>

                    {/* Right Explorer Rover */}
                    <g transform="translate(204, 24)">
                      <rect x="8" y="13" width="26" height="8" rx="1.5" fill="#E7B96A" />
                      <line x1="28" y1="13" x2="28" y2="3" stroke="#F4D388" strokeWidth="2.2" />
                      <rect x="23" y="0" width="11" height="5" rx="1" fill="#FFF1C5" />
                      <circle cx="11" cy="25" r="3.2" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                      <circle cx="21" cy="25" r="3.2" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                      <circle cx="31" cy="25" r="3.2" fill="#0B2040" stroke="#E7B96A" strokeWidth="1.6" />
                    </g>
                  </svg>

                  <p className="font-urdu-nastaliq text-[10px] sm:text-[12px] text-white text-center leading-snug">
                    {t.coverTagline}
                  </p>
                </div>
              </div>
            ) : (
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.38.02_AM_20eccc9a.jpeg"
                alt={t.coverAlt}
                className="w-full h-full object-cover object-left select-none pointer-events-none"
              />
            )}

            {/* Subtle spine crease shading (Left edge in EN, Right edge in Urdu RTL) */}
            <div
              className={`absolute top-0 bottom-0 w-[14px] pointer-events-none ${
                isUrdu
                  ? 'right-0 bg-gradient-to-l from-black/45 to-transparent border-l border-[#E7B96A]/25'
                  : 'left-0 bg-gradient-to-r from-black/40 to-transparent border-r border-[#E7B96A]/20'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Button Below Book */}
      <div className="mt-3 sm:mt-4 mb-2 sm:mb-4 z-20 flex flex-col items-center">
        <button
          dir={dir}
          onClick={onOpen}
          className={`group px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-[#102C57] hover:bg-[#1B3B6F] border border-[#E7B96A] text-[#F5F8FF] font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-[0_0_20px_rgba(231,185,106,0.3)] hover:shadow-[0_0_30px_rgba(231,185,106,0.5)] transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95 ${
            isUrdu ? 'font-urdu text-sm sm:text-base' : ''
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#E7B96A] group-hover:rotate-6 transition-transform" />
          <span className="text-[#FFF1C5] font-bold">{t.openBookButton}</span>
        </button>
      </div>
    </div>
  );
};
