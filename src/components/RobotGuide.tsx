import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { speechNarrator, soundFX } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface RobotGuideProps {
  currentSpreadIndex: number;
  isTransformed: boolean;
  selectedExplorerName?: string;
  isMuted: boolean;
  onToggleMute?: () => void;
  isCover?: boolean;
}

export const RobotGuide: React.FC<RobotGuideProps> = ({
  currentSpreadIndex,
  isTransformed,
  isMuted,
  isCover = false,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).robotGuide;

  const [factIndex, setFactIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // Get active text in current language
  const messagePool = isCover
    ? t.coverMessages
    : isTransformed
    ? t.stageMessages
    : (t.guideMessages[currentSpreadIndex] || t.guideMessages[0]);

  const currentText = messagePool[factIndex % messagePool.length];

  // Reset to first message when page or language changes
  useEffect(() => {
    setFactIndex(0);
    setIsSpeaking(false);
    setIsLoadingVoice(false);
    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), 1200);
    return () => clearTimeout(timer);
  }, [currentSpreadIndex, isTransformed, isCover, language]);

  useEffect(() => {
    if (isMuted && (isSpeaking || isLoadingVoice)) {
      speechNarrator.stop();
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    }
  }, [isMuted, isSpeaking, isLoadingVoice]);

  useEffect(() => {
    return () => {
      speechNarrator.stop();
    };
  }, []);

  const handleNextFact = () => {
    soundFX.playRobotChirp();
    setFactIndex((prev) => (prev + 1) % messagePool.length);
    if (isSpeaking || isLoadingVoice) {
      speechNarrator.stop();
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking || isLoadingVoice) {
      speechNarrator.stop();
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    } else {
      speechNarrator.speak(
        currentText,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          setIsLoadingVoice(false);
        },
        () => {
          setIsSpeaking(false);
          setIsLoadingVoice(false);
        },
        language,
        (loading) => setIsLoadingVoice(loading)
      );
    }
  };

  return (
    <div className="w-full max-w-4xl px-3 my-2 z-30 flex items-center justify-center select-none pointer-events-auto">
      <div className="flex items-center gap-3 sm:gap-4 max-w-2xl bg-transparent">
        {/* Detailed Friendly Space Robot Avatar */}
        <div 
          onClick={handleNextFact}
          className="relative group cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95"
          title={t.avatarTitle}
        >
          {/* Circular Celestial Porthole Frame */}
          <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-gradient-to-b from-[#0E2850] via-[#07162E] to-[#030B18] border-2 border-[#5496FF]/70 shadow-[0_0_22px_rgba(56,189,248,0.45)] flex items-center justify-center overflow-visible">
            {/* Soft inner starlight glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[#38BDF8]/15 to-white/25 pointer-events-none" />

            {/* Robot Face SVG */}
            <svg
              viewBox="0 0 88 88"
              className={`w-16 h-16 sm:w-[68px] sm:h-[68px] overflow-visible transition-transform duration-300 ${
                isWaving ? 'rotate-6 scale-105' : ''
              }`}
              aria-label="Robot space guide"
            >
              <defs>
                <linearGradient id="botShell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="55%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="botSlate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="botVisor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#041022" />
                  <stop offset="100%" stopColor="#081E3D" />
                </linearGradient>
                <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Top Comms Antenna */}
              <rect x="41.5" y="1" width="5" height="10" rx="2" fill="#64748B" />
              <circle
                cx="44"
                cy="-1"
                r="4.5"
                fill="#FFD700"
                stroke="#FFFBEB"
                strokeWidth="1.4"
                className="animate-pulse"
              />
              {/* Forehead Crest Plate */}
              <path
                d="M 33 13 L 36 8 L 52 8 L 55 13 Z"
                fill="#3B82F6"
                stroke="#93C5FD"
                strokeWidth="0.9"
              />

              {/* Left & Right Mechanical Ear Bolts / Comms Pods */}
              <rect x="7" y="31" width="7" height="22" rx="3" fill="#2563EB" stroke="#93C5FD" strokeWidth="1" />
              <circle cx="10.5" cy="37" r="1.4" fill="#E7B96A" />
              <circle cx="10.5" cy="47" r="1.4" fill="#E7B96A" />

              <rect x="74" y="31" width="7" height="22" rx="3" fill="#2563EB" stroke="#93C5FD" strokeWidth="1" />
              <circle cx="77.5" cy="37" r="1.4" fill="#E7B96A" />
              <circle cx="77.5" cy="47" r="1.4" fill="#E7B96A" />

              {/* Shoulder & Neck Joint */}
              <rect x="35" y="66" width="18" height="7" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <line x1="39" y1="68" x2="39" y2="72" stroke="#475569" strokeWidth="1.2" />
              <line x1="44" y1="68" x2="44" y2="72" stroke="#475569" strokeWidth="1.2" />
              <line x1="49" y1="68" x2="49" y2="72" stroke="#475569" strokeWidth="1.2" />
              <path
                d="M 23 79 C 25 72, 63 72, 65 79 Z"
                fill="url(#botSlate)"
                stroke="#64748B"
                strokeWidth="1"
              />

              {/* Main Robotic Head Chassis (Chamfered / Box-Rounded Bot Shape) */}
              <rect
                x="13"
                y="13"
                width="62"
                height="54"
                rx="15"
                fill="url(#botShell)"
                stroke="#E2E8F0"
                strokeWidth="1.4"
              />

              {/* Subtle Panel Seams & Corner Rivets */}
              <path d="M 15 24 L 22 24 M 66 24 L 73 24" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
              <circle cx="18" cy="19" r="1.2" fill="#64748B" />
              <circle cx="70" cy="19" r="1.2" fill="#64748B" />

              {/* Dark Glass OLED Visor Screen */}
              <rect
                x="19"
                y="22"
                width="50"
                height="28"
                rx="9"
                fill="url(#botVisor)"
                stroke="#1E3A8A"
                strokeWidth="1.5"
              />
              {/* Subtle Glass Reflection Streak */}
              <path
                d="M 24 25 L 40 25 L 35 28 L 23 28 Z"
                fill="#FFFFFF"
                opacity="0.14"
              />

              {/* Expressive Glowing LED Robot Eyes */}
              {isWaving ? (
                /* Happy Curved Digital Eyes when switching facts */
                <g filter="url(#cyanGlow)" stroke="#00E5FF" strokeWidth="2.8" strokeLinecap="round" fill="none">
                  <path d="M 27 37 Q 32.5 30 38 37" />
                  <path d="M 50 37 Q 55.5 30 61 37" />
                </g>
              ) : (
                /* Crisp Rounded-Rect / Circular Optic Lenses */
                <g filter="url(#cyanGlow)">
                  <rect x="26.5" y="29" width="11" height="12" rx="4.5" fill="#00E5FF" />
                  <rect x="50.5" y="29" width="11" height="12" rx="4.5" fill="#00E5FF" />
                  {/* Inner Pupil Optics & Specular Catchlights */}
                  <circle cx="32" cy="35" r="2.2" fill="#03263E" />
                  <circle cx="56" cy="35" r="2.2" fill="#03263E" />
                  <circle cx="30" cy="32.5" r="1.5" fill="#FFFFFF" />
                  <circle cx="54" cy="32.5" r="1.5" fill="#FFFFFF" />
                </g>
              )}

              {/* Mechanical Jaw / Voice Speaker Grille */}
              <rect
                x="28"
                y="54"
                width="32"
                height="9"
                rx="4.5"
                fill="url(#botSlate)"
                stroke="#64748B"
                strokeWidth="1"
              />

              {isSpeaking ? (
                /* Animated Equalizer Bars when speaking */
                <g fill="#00E5FF" filter="url(#cyanGlow)">
                  <rect x="33" y="56.5" width="3" height="4" rx="1" className="animate-pulse" />
                  <rect x="38.5" y="55.5" width="3" height="6" rx="1" className="animate-pulse" />
                  <rect x="44" y="55" width="3" height="7" rx="1" className="animate-pulse" />
                  <rect x="49.5" y="56" width="3" height="5" rx="1" className="animate-pulse" />
                </g>
              ) : (
                /* Clean Metallic Speaker Slots + Subtle Cyan Smile Line */
                <g>
                  <line x1="34" y1="56.5" x2="34" y2="60.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="39" y1="56.5" x2="39" y2="60.5" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="44" y1="56.5" x2="44" y2="60.5" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="49" y1="56.5" x2="49" y2="60.5" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="54" y1="56.5" x2="54" y2="60.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Dark Blue Speech Bubble with Rounded Corners and Sparkle Icon */}
        <div className="relative flex-1 rounded-2xl bg-[#0B2144]/95 border border-[#3E7BDB]/50 text-[#F5F8FF] p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Bubble Pointer Arrow pointing to the robot */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-[9px] border-r-[#0B2144]" />

          {/* Sparkle Icon on top-right */}
          <div className="absolute top-2.5 right-3 text-[#38BDF8] opacity-70">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Dialogue Text */}
          <p
            dir={dir}
            className={`text-xs sm:text-sm text-[#E2E8F0] pr-6 ${
              isUrdu ? 'font-urdu leading-loose text-right text-sm sm:text-base' : 'font-sans leading-relaxed'
            }`}
          >
            {currentText}
          </p>

          {/* Bottom Interactive Strip */}
          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/10 text-[11px]">
            {/* Audio Voice Button */}
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                isSpeaking || isLoadingVoice ? 'text-[#00E5FF] animate-pulse' : 'text-[#93C5FD] hover:text-white'
              } ${isUrdu ? 'font-urdu text-xs' : ''}`}
              title={isSpeaking || isLoadingVoice ? t.stopVoice : t.readAloud}
            >
              {isLoadingVoice ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.loadingVoice}</span>
                </>
              ) : isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{t.stopVoice}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.readAloud}</span>
                </>
              )}
            </button>

            {/* Next Fact button */}
            <button
              onClick={handleNextFact}
              className={`flex items-center gap-0.5 text-[#E7B96A] hover:text-[#FFF1C5] font-semibold transition-colors cursor-pointer ${
                isUrdu ? 'font-urdu text-xs' : ''
              }`}
            >
              <span>{t.nextFact}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
