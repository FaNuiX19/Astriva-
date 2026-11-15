import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Compass,
  Radio,
  Satellite,
  Rocket,
  Clock,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { getLocalizedExplorers } from '../data/explorersUr';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface DeepSpaceDispatchPageProps {
  isMuted: boolean;
  onBackToFleet?: () => void;
  onDispatchFlash?: () => void;
}

interface FleetTarget {
  id: string;
  name: string;
  destination: string;
  status: 'transmitting' | 'lost' | 'dormant';
  statusLabel: string;
  distance: string;
  travelTime: string;
  category: string;
}

export const DeepSpaceDispatchPage: React.FC<DeepSpaceDispatchPageProps> = ({
  onBackToFleet,
  onDispatchFlash,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).dispatch;
  const localizedExplorers = getLocalizedExplorers(language);

  const fleetTargets: FleetTarget[] = localizedExplorers.map((explorer) => {
    const isMoon = explorer.destination === 'The Moon';
    const isMars = explorer.destination === 'Mars';

    return {
      id: explorer.id,
      name: explorer.name,
      destination: explorer.landingSite,
      status: 'dormant',
      statusLabel: (explorer.displayStatus || explorer.status).toLowerCase(),
      distance: isMoon
        ? t.distances.moon
        : isMars
        ? t.distances.mars
        : t.distances.kepler,
      travelTime: isMoon
        ? t.travelTimes.moon
        : isMars
        ? t.travelTimes.mars
        : t.travelTimes.kepler,
      category: explorer.category,
    };
  });

  const [selectedTargetId, setSelectedTargetId] = useState<string>(fleetTargets[0].id);
  const [kidName, setKidName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [totalTransmissions, setTotalTransmissions] = useState<number>(1431);

  const selectedTarget =
    fleetTargets.find((target) => target.id === selectedTargetId) || fleetTargets[0];

  const maxChars = 200;

  const handleSelectIdea = (idea: string) => {
    soundFX.playMarkerClick();
    setMessage(idea);
  };

  const handleLaunch = () => {
    if (!message.trim() || isTransmitting) return;

    soundFX.playTransmissionBeep();
    setIsTransmitting(true);
    setFlightProgress(0);
    setIsDispatched(false);

    const startTime = Date.now();
    const duration = 2200;

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFlightProgress(progress);

      if (progress >= 1) {
        clearInterval(animationInterval);
        soundFX.playFlashBoom();
        onDispatchFlash?.();

        setTimeout(() => {
          setIsTransmitting(false);
          setIsDispatched(true);
          setTotalTransmissions((prev) => prev + 1);
        }, 170);
      }
    }, 16);
  };

  const handleResetForAnother = () => {
    setIsDispatched(false);
    setIsTransmitting(false);
    setMessage('');
    setFlightProgress(0);
  };

  const voyageTypeLabel =
    selectedTarget.category === 'rover'
      ? t.voyageTypes.rover
      : selectedTarget.category === 'lander'
      ? t.voyageTypes.lander
      : selectedTarget.category === 'telescope'
      ? t.voyageTypes.telescope
      : t.voyageTypes.instrument;

  return (
    <div
      className={`flex flex-col ${
        isUrdu ? 'md:flex-row-reverse' : 'md:flex-row'
      } w-full min-h-[420px] md:min-h-[470px] select-none bg-[#06132D] text-[#F5F8FF]`}
    >
      {/* ======================================================== */}
      {/* LEFT PAGE (OR RIGHT IN RTL): INPUT CONSOLE                */}
      {/* ======================================================== */}
      <div
        dir={dir}
        className={`${
          isDispatched ? 'hidden md:flex' : 'flex'
        } flex-1 md:flex-none w-full md:w-1/2 p-3 sm:p-4 md:p-4 lg:p-5 flex-col justify-between ${
          isUrdu ? 'md:border-l' : 'md:border-r'
        } border-[#1D3B6A] relative bg-gradient-to-b from-[#091C3E] to-[#06132D] ${
          isUrdu ? 'font-urdu text-right' : ''
        }`}
      >
        <div>
          {/* Top Row: Back to Fleet & Brand */}
          <div className="flex items-center justify-between mb-2">
            {onBackToFleet && (
              <button
                type="button"
                onClick={onBackToFleet}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F2852]/80 hover:bg-[#1A3C74] border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className={`w-3 h-3 ${isUrdu ? 'rotate-180' : ''}`} />
                <span>{t.backToFleet}</span>
              </button>
            )}

            {/* Astriva brand tag */}
            <div className={`flex items-center gap-2 ${isUrdu ? 'text-left' : 'text-right'}`}>
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-bold text-[#E7B96A] uppercase leading-tight ${
                    isUrdu ? 'font-urdu' : 'tracking-widest font-cinzel'
                  }`}
                >
                  {t.brandTitle}
                </span>
                <span className="text-[8px] text-[#93C5FD]/75">
                  {t.brandSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Heading lockup */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#F5F8FF] tracking-tight leading-tight">
            {t.heading}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#93C5FD] mt-0.5 font-medium">
            {t.subheading}
          </p>

          {/* Fleet Target Selector Pills */}
          <div className="mt-2.5">
            <span className="text-[9px] font-bold tracking-wider uppercase text-[#E7B96A] block mb-1">
              {t.selectTarget}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {fleetTargets.map((target) => {
                const isSelected = target.id === selectedTargetId;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => {
                      soundFX.playMarkerClick();
                      setSelectedTargetId(target.id);
                    }}
                    className={`flex flex-col ${isUrdu ? 'text-right' : 'text-left'} px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#103467] border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                        : 'bg-[#0B2044]/60 border-[#1E3B68] hover:border-[#38BDF8]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span
                        className={`text-[10.5px] font-bold truncate ${
                          isSelected ? 'text-[#F5F8FF]' : 'text-[#E2E8F0]'
                        }`}
                      >
                        {target.name}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          target.status === 'transmitting'
                            ? 'bg-emerald-400 shadow-[0_0_5px_#34D399]'
                            : target.status === 'dormant'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & My Message Input Card */}
          <div className="mt-2.5 rounded-xl bg-[#0B2144]/90 border border-[#274B82] p-2.5 shadow-lg flex flex-col justify-between gap-1.5">
            {/* Name Field */}
            <div className="flex items-center gap-2 pb-1.5 border-b border-white/10">
              <label
                htmlFor="kid-name-input"
                className="text-[10px] font-bold tracking-wider uppercase text-[#E7B96A] shrink-0"
              >
                {t.nameLabel}
              </label>
              <input
                id="kid-name-input"
                type="text"
                maxLength={32}
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full bg-transparent text-xs text-[#F5F8FF] placeholder-[#64748B] focus:outline-none font-medium"
              />
            </div>

            {/* My Message Field */}
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="kid-message-input"
                className="text-[10px] font-bold tracking-wider uppercase text-[#38BDF8]"
              >
                {t.messageLabel}
              </label>
              <textarea
                id="kid-message-input"
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setMessage(e.target.value);
                  }
                }}
                placeholder={t.messagePlaceholder}
                rows={2}
                className="w-full bg-transparent text-xs text-[#F5F8FF] placeholder-[#64748B] focus:outline-none resize-none leading-snug"
              />
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[9.5px] text-[#94A3B8] font-medium">
              <span>{t.ideaHint}</span>
              <span
                dir="ltr"
                className={`font-mono ${message.length > 0 ? 'text-[#00E5FF] font-bold' : ''}`}
              >
                {message.length}/{maxChars}
              </span>
            </div>
          </div>

          {/* Preset Idea Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {t.presetIdeas.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectIdea(idea)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  message === idea
                    ? 'bg-[#103B75] border-[#00E5FF] text-[#F5F8FF] shadow-sm'
                    : 'bg-[#0B2144]/70 border-[#274B82]/70 text-[#CBD5E1] hover:text-white hover:border-[#38BDF8]'
                }`}
              >
                &ldquo;{idea}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Launch Message Button & Target Info (Bottom of Left Page) */}
        <div className="pt-2.5 mt-2 border-t border-white/15 space-y-2">
          <button
            type="button"
            onClick={handleLaunch}
            disabled={!message.trim() || isTransmitting}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
              isTransmitting
                ? 'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0284C7] text-[#FFFFFF] border-2 border-[#7DD3FC] ring-2 ring-[#38BDF8]/50 animate-pulse shadow-[0_0_28px_rgba(56,189,248,0.75)]'
                : !message.trim()
                ? 'bg-gradient-to-r from-[#0F2F5E] via-[#153D78] to-[#0F2F5E] border-2 border-[#38BDF8]/65 text-[#E0F2FE] shadow-[0_0_18px_rgba(56,189,248,0.28)] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0284C7] hover:from-[#38BDF8] hover:via-[#0EA5E9] hover:to-[#0284C7] border-2 border-[#E7B96A] ring-2 ring-[#38BDF8]/40 text-[#FFFFFF] shadow-[0_0_30px_rgba(14,165,233,0.75)] hover:shadow-[0_0_40px_rgba(231,185,106,0.7)]'
            }`}
          >
            {isTransmitting ? (
              <>
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#FFF1C5]" />
                <span>{t.transmittingTo(selectedTarget.name)}</span>
              </>
            ) : (
              <>
                <Send className={`w-4 h-4 sm:w-5 sm:h-5 rotate-45 ${!message.trim() ? 'text-[#38BDF8]' : 'text-[#FFF1C5]'}`} />
                <span>{t.launchMessage}</span>
              </>
            )}
          </button>

          {/* Mobile-only prominent speed-of-light indicator (desktop/tablet shows it under the trajectory canvas) */}
          <div className="md:hidden flex justify-center">
            <div className="w-full px-3 py-1.5 rounded-xl bg-[#0F2A56]/90 border border-[#E7B96A]/70 shadow-[0_0_16px_rgba(231,185,106,0.25)] flex items-center justify-center gap-2">
              <Compass className="w-4 h-4 text-[#FDE047] shrink-0 drop-shadow-[0_0_6px_rgba(231,185,106,0.85)]" />
              <span className="text-[11px] font-bold text-[#FFF1C5] tracking-wide leading-snug text-center">
                {t.photonsSpeedNote}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT PAGE: THE ANIMATED FLIGHT TRAJECTORY & TELEMETRY   */}
      {/* ======================================================== */}
      <div
        className={`${
          isDispatched ? 'flex' : 'hidden md:flex'
        } flex-1 md:flex-none w-full md:w-1/2 p-3.5 sm:p-4 md:py-3.5 md:px-5 flex-col justify-between items-center relative overflow-hidden ${
          isDispatched
            ? 'bg-[#051024]'
            : 'bg-gradient-to-b from-[#06132D] via-[#091D3C] to-[#06132D]'
        }`}
      >
        {/* Background stars / constellation mesh */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-6 left-12 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-[#38BDF8] rounded-full" />
          <div className="absolute bottom-24 left-1/3 w-1 h-1 bg-[#E7B96A] rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
        </div>

        {/* State A: Ready / In-Flight Trajectory */}
        {!isDispatched ? (
          <div className="w-full h-full flex flex-col justify-between items-center relative my-auto py-2 z-10">
            {/* Top Target Explorer Card */}
            <div className="w-full max-w-sm flex justify-end">
              <div
                dir={dir}
                className={`rounded-xl bg-[#0F2A56]/90 border border-[#38BDF8]/60 p-2.5 sm:p-3 shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center gap-3 backdrop-blur-md ${
                  isUrdu ? 'font-urdu text-right' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0369A1]/30 border border-[#38BDF8]/50 flex items-center justify-center shrink-0">
                  <Satellite className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {selectedTarget.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-[#38BDF8] font-mono block">
                    {selectedTarget.distance}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Path Canvas / SVG */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[165px]">
              <svg viewBox="0 0 320 200" className="w-full max-w-xs h-40 overflow-visible">
                {/* Dotted Flight Trajectory Arc */}
                <path
                  id="flight-path"
                  d="M 40 160 Q 140 140 250 50"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  opacity={isTransmitting ? 0.9 : 0.45}
                  className={isTransmitting ? 'animate-pulse' : ''}
                />

                {/* Earth Station Origin (Bottom-Left) */}
                <g transform="translate(30, 150)">
                  <circle cx="10" cy="10" r="10" fill="#0369A1" opacity="0.3" className="animate-ping" />
                  <circle cx="10" cy="10" r="8" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" fill="#FFFFFF" />
                  <text x="18" y="14" fill="#93C5FD" fontSize="8" fontWeight="bold">
                    {t.earthDsnLabel}
                  </text>
                </g>

                {/* Target Destination Node (Top-Right) */}
                <g transform="translate(240, 40)">
                  <circle
                    cx="10"
                    cy="10"
                    r="14"
                    fill="#00E5FF"
                    opacity={isTransmitting ? 0.35 : 0.15}
                    className="animate-pulse"
                  />
                  <circle cx="10" cy="10" r="7" fill="#0C2340" stroke="#00E5FF" strokeWidth="2" />
                  <circle cx="10" cy="10" r="2.5" fill="#00E5FF" />
                </g>

                {/* Flying Cyan Paper Airplane Beacon */}
                {(() => {
                  const progress = isTransmitting ? flightProgress : 0;
                  const x = Math.round(
                    (1 - progress) * (1 - progress) * 40 +
                      2 * (1 - progress) * progress * 140 +
                      progress * progress * 250
                  );
                  const y = Math.round(
                    (1 - progress) * (1 - progress) * 160 +
                      2 * (1 - progress) * progress * 140 +
                      progress * progress * 50
                  );
                  const dx = 2 * (1 - progress) * (140 - 40) + 2 * progress * (250 - 140);
                  const dy = 2 * (1 - progress) * (140 - 160) + 2 * progress * (50 - 140);
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                  return (
                    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
                      <circle cx="0" cy="0" r="14" fill="#00E5FF" opacity="0.3" className="animate-ping" />
                      <path
                        d="M -12 -6 L 8 0 L -12 6 L -6 0 Z"
                        fill="#00E5FF"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        filter="drop-shadow(0 0 6px #00E5FF)"
                      />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* In-Flight Status Indicator */}
            <div dir={dir} className={`w-full text-center ${isUrdu ? 'font-urdu' : ''}`}>
              {isTransmitting ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0369A1]/50 border-2 border-[#38BDF8] text-[#FFFFFF] text-xs sm:text-[13px] font-bold animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.55)]">
                  <Radio className="w-4 h-4 text-[#00E5FF] animate-spin" />
                  <span>{t.beamingPhotons}</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0F2A56]/90 border border-[#E7B96A]/75 shadow-[0_0_20px_rgba(231,185,106,0.28)] backdrop-blur-sm">
                  <Compass className="w-5 h-5 text-[#FDE047] shrink-0 drop-shadow-[0_0_8px_rgba(231,185,106,0.9)]" />
                  <span className="text-xs lg:text-[13px] font-bold text-[#FFF1C5] tracking-wide leading-snug">
                    {t.photonsSpeedNote}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* State B: Celestial Space Mail Pass Ticket                */
          /* ======================================================== */
          <div className="w-full my-auto flex flex-col items-center justify-center gap-2 z-10">
            <div
              className={`relative w-full max-w-[335px] rounded-[18px] bg-[#F3EDE0] text-[#091A33] shadow-[0_20px_50px_rgba(0,0,0,0.75)] overflow-hidden animate-ticket-boom ${
                isUrdu ? 'font-urdu' : ''
              }`}
            >
              {/* Ticket Punch Notches */}
              <div className="absolute top-[64px] -left-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />
              <div className="absolute top-[64px] -right-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />
              <div className="absolute top-[48%] -left-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />
              <div className="absolute top-[48%] -right-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />
              <div className="absolute bottom-[42px] -left-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />
              <div className="absolute bottom-[42px] -right-2 w-4 h-4 rounded-full bg-[#051024] z-30 pointer-events-none" />

              {/* Top Midnight-Navy Header Band */}
              <div className="relative bg-[#07162E] text-[#F3EDE0] px-4 pt-2.5 pb-2.5 border border-[#F3EDE0]/35 rounded-t-[18px] rounded-b-[10px]">
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Orbital Star Mark + Brand Title */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <svg viewBox="0 0 46 38" className="w-8 h-6 shrink-0 text-[#F3EDE0]" fill="none">
                      <ellipse
                        cx="22"
                        cy="19"
                        rx="19"
                        ry="8.5"
                        transform="rotate(-26 22 19)"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M27 8 L28.6 14.4 L35 16 L28.6 17.6 L27 24 L25.4 17.6 L19 16 L25.4 14.4 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="min-w-0">
                      <div
                        className={`text-[16px] sm:text-[17px] font-bold leading-none text-[#F3EDE0] truncate ${
                          isUrdu ? 'font-urdu' : 'font-cinzel tracking-[0.22em]'
                        }`}
                      >
                        {t.brandTitle}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-[0.5px] w-3 bg-[#F3EDE0]/45" />
                        <span
                          className={`text-[#F3EDE0]/85 whitespace-nowrap ${
                            isUrdu ? 'text-[7.5px]' : 'text-[6.5px] tracking-[0.2em] uppercase'
                          }`}
                        >
                          {t.brandSubtitle}
                        </span>
                        <span className="h-[0.5px] w-3 bg-[#F3EDE0]/45" />
                      </div>
                    </div>
                  </div>

                  {/* Vertical Hairline */}
                  <div className="w-[1px] h-9 bg-[#F3EDE0]/35 shrink-0" />

                  {/* Right: SPACE MAIL PASS */}
                  <div className="text-center pl-1 pr-0.5 shrink-0">
                    <div
                      className={`leading-tight text-[#F3EDE0] ${
                        isUrdu
                          ? 'text-[9.5px] font-bold'
                          : 'font-cinzel text-[9px] tracking-[0.2em] uppercase'
                      }`}
                    >
                      {t.spaceMailLine1}
                      <br />
                      {t.spaceMailLine2}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="h-[0.5px] w-4 bg-[#F3EDE0]/50" />
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-[#F3EDE0]" fill="currentColor">
                        <path d="M6 0.5 L7.2 4.8 L11.5 6 L7.2 7.2 L6 11.5 L4.8 7.2 L0.5 6 L4.8 4.8 Z" />
                      </svg>
                      <span className="h-[0.5px] w-4 bg-[#F3EDE0]/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Explorer & Message Section */}
              <div dir={dir} className={`px-4 pt-2 pb-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-[#1A2E4C] block">
                      {t.sentByExplorer}
                    </span>
                    <span className="font-storybook text-[17px] sm:text-[18px] font-bold text-[#091A33] leading-tight block truncate mt-0.5">
                      {kidName.trim() || t.defaultExplorerName}
                    </span>
                  </div>
                  {/* Four-pointed star emblem */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#091A33] shrink-0 mt-1" fill="currentColor">
                    <path d="M12 1 L14.1 9.9 L23 12 L14.1 14.1 L12 23 L9.9 14.1 L1 12 L9.9 9.9 Z" />
                  </svg>
                </div>

                <div className="h-[1px] bg-[#091A33]/65 my-1.5" />

                <div>
                  <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-[#1A2E4C] block">
                    {t.messageBeamed}
                  </span>
                  <p className="font-storybook italic text-[13px] text-[#091A33] leading-snug mt-0.5 break-words line-clamp-2">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Curved-Top Monochrome Cosmic Rover Illustration Panel */}
              <div className="px-2.5 pt-0.5">
                <div className="relative w-full h-[74px] rounded-b-[10px] overflow-hidden bg-[#040E1F]">
                  <svg viewBox="0 0 360 116" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <radialGradient id="planetGlow" cx="22%" cy="95%" r="65%">
                        <stop offset="0%" stopColor="#091A33" />
                        <stop offset="58%" stopColor="#122B4E" />
                        <stop offset="86%" stopColor="#4F6D93" />
                        <stop offset="100%" stopColor="#DCE6F2" />
                      </radialGradient>
                      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#030A18" />
                        <stop offset="100%" stopColor="#091C3A" />
                      </linearGradient>
                      <linearGradient id="roverMetal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="50%" stopColor="#64748B" />
                        <stop offset="100%" stopColor="#0F2342" />
                      </linearGradient>
                    </defs>

                    <rect width="360" height="116" fill="url(#skyGrad)" />

                    <circle cx="48" cy="24" r="0.9" fill="#E2E8F0" opacity="0.8" />
                    <circle cx="96" cy="38" r="1.1" fill="#F8FAFC" opacity="0.9" />
                    <circle cx="142" cy="18" r="0.8" fill="#CBD5E1" opacity="0.7" />
                    <circle cx="176" cy="48" r="1" fill="#F8FAFC" opacity="0.85" />
                    <circle cx="215" cy="22" r="1.2" fill="#E2E8F0" opacity="0.9" />
                    <circle cx="288" cy="30" r="0.9" fill="#CBD5E1" opacity="0.7" />
                    <circle cx="326" cy="52" r="1.1" fill="#F8FAFC" opacity="0.8" />
                    <path d="M168 35 L169.2 38.8 L173 40 L169.2 41.2 L168 45 L166.8 41.2 L163 40 L166.8 38.8 Z" fill="#F8FAFC" opacity="0.85" />
                    <path d="M234 55 L234.8 57.2 L237 58 L234.8 58.8 L234 61 L233.2 58.8 L231 58 L233.2 57.2 Z" fill="#E2E8F0" opacity="0.75" />

                    <circle cx="62" cy="126" r="96" fill="url(#planetGlow)" />
                    <path
                      d="M 10 54 A 96 96 0 0 1 154 108"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1.6"
                      opacity="0.85"
                    />
                    <ellipse cx="78" cy="72" rx="11" ry="4" transform="rotate(18 78 72)" fill="#07152B" opacity="0.55" />
                    <ellipse cx="104" cy="88" rx="7" ry="2.6" transform="rotate(24 104 88)" fill="#07152B" opacity="0.45" />
                    <ellipse cx="44" cy="86" rx="14" ry="5" transform="rotate(12 44 86)" fill="#07152B" opacity="0.5" />

                    <path
                      d="M 0 105 Q 90 101 175 103 T 360 98 L 360 116 L 0 116 Z"
                      fill="#071326"
                    />
                    <path
                      d="M 160 103 Q 240 97 360 99"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="1"
                      opacity="0.7"
                    />

                    <g transform="translate(198, 22)">
                      <rect x="64" y="16" width="5" height="32" fill="url(#roverMetal)" />
                      <rect x="55" y="4" width="23" height="13" rx="2" fill="#1E3A5F" stroke="#CBD5E1" strokeWidth="1" />
                      <circle cx="62" cy="10.5" r="3.2" fill="#040E1F" stroke="#E2E8F0" strokeWidth="1" />
                      <circle cx="71" cy="10.5" r="3.2" fill="#040E1F" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="104" y1="20" x2="104" y2="48" stroke="#CBD5E1" strokeWidth="1.4" />
                      <circle cx="104" cy="20" r="1.8" fill="#F8FAFC" />

                      <polygon points="34,46 108,46 116,60 30,60" fill="url(#roverMetal)" stroke="#CBD5E1" strokeWidth="0.9" />
                      <rect x="44" y="50" width="46" height="8" rx="1" fill="#0B1E38" stroke="#64748B" strokeWidth="0.7" />
                      <circle cx="38" cy="54" r="3.5" fill="#040E1F" stroke="#E2E8F0" strokeWidth="0.9" />

                      <path d="M 32 62 L 16 78 M 55 60 L 42 78 M 82 60 L 94 78 M 106 60 L 122 76" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M 30 62 L 82 62" stroke="#94A3B8" strokeWidth="2" />

                      {[
                        { cx: 14, cy: 78, r: 10 },
                        { cx: 43, cy: 80, r: 10 },
                        { cx: 94, cy: 79, r: 10.5 },
                        { cx: 123, cy: 77, r: 9.5 },
                      ].map((w, i) => (
                        <g key={i}>
                          <circle cx={w.cx} cy={w.cy} r={w.r} fill="#08162C" stroke="#E2E8F0" strokeWidth="1.5" />
                          <circle cx={w.cx} cy={w.cy} r={w.r * 0.55} fill="#1E3A5F" stroke="#94A3B8" strokeWidth="1" />
                          <circle cx={w.cx} cy={w.cy} r={2} fill="#E2E8F0" />
                        </g>
                      ))}
                    </g>

                    <path
                      d="M 0 0 L 360 0 L 360 12 C 325 4, 290 0, 250 10 C 195 24, 145 30, 80 28 C 40 27, 15 24, 0 28 Z"
                      fill="#F3EDE0"
                    />
                  </svg>
                </div>
              </div>

              {/* 2x2 Telemetry Grid */}
              <div dir={dir} className={`px-4 pt-2 pb-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
                {/* Row 1: Target Destination & Voyage Type */}
                <div className="grid grid-cols-2 pb-1.5 border-b border-[#091A33]/60">
                  <div
                    className={`flex items-start gap-2 ${
                      isUrdu ? 'pl-2 border-l' : 'pr-2 border-r'
                    } border-[#091A33]/60`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#091A33] shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="2.5" />
                      <path d="M12 2 V6 M12 18 V22 M2 12 H6 M18 12 H22" strokeLinecap="round" />
                    </svg>
                    <div className="min-w-0">
                      <span className="text-[7px] font-semibold tracking-[0.16em] uppercase text-[#1A2E4C] block">
                        {t.targetDestination}
                      </span>
                      <span className="font-storybook text-[13px] font-bold text-[#091A33] leading-tight block truncate">
                        {selectedTarget.name}
                      </span>
                      <span className="font-storybook text-[9.5px] text-[#1E3557] leading-tight block truncate">
                        ({selectedTarget.destination})
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-start gap-2 ${isUrdu ? 'pr-3' : 'pl-3'}`}>
                    <Rocket className="w-4 h-4 text-[#091A33] shrink-0 mt-1" />
                    <div className="min-w-0">
                      <span className="text-[7px] font-semibold tracking-[0.16em] uppercase text-[#1A2E4C] block">
                        {t.voyageType}
                      </span>
                      <span className="font-storybook text-[12.5px] font-bold text-[#091A33] leading-tight block mt-0.5">
                        {voyageTypeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Speed & Time */}
                <div className="grid grid-cols-2 pt-1.5">
                  <div
                    className={`flex items-center gap-2 ${
                      isUrdu ? 'pl-2 border-l' : 'pr-2 border-r'
                    } border-[#091A33]/60`}
                  >
                    <Gauge className="w-4 h-4 text-[#091A33] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[7px] font-semibold tracking-[0.16em] uppercase text-[#1A2E4C] block">
                        {t.speed}
                      </span>
                      <span className="font-storybook text-[12.5px] font-bold text-[#091A33] leading-tight block">
                        {t.speedValue}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 ${isUrdu ? 'pr-3' : 'pl-3'}`}>
                    <Clock className="w-4 h-4 text-[#091A33] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[7px] font-semibold tracking-[0.16em] uppercase text-[#1A2E4C] block">
                        {t.time}
                      </span>
                      <span className="font-storybook text-[12.5px] font-bold text-[#091A33] leading-tight block truncate">
                        +{selectedTarget.travelTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stub: Barcode, Mission ID & Travel Beyond Limits Wedge */}
              <div className="relative flex items-end justify-between pl-4 pt-1 pb-0 mt-0.5">
                {/* Barcode */}
                <div className="flex items-stretch gap-[2px] h-7 pb-3" aria-hidden="true">
                  {[3, 1, 2, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3].map((w, idx) => (
                    <span
                      key={idx}
                      style={{ width: `${w}px` }}
                      className="bg-[#091A33] h-full block"
                    />
                  ))}
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-7 bg-[#091A33]/60 mb-3 mx-1.5 shrink-0" />

                {/* Mission ID */}
                <div className="pb-3 px-1 text-left shrink-0">
                  <span className="text-[7.5px] font-semibold tracking-[0.18em] uppercase text-[#1A2E4C] block">
                    {t.missionId}
                  </span>
                  <span dir="ltr" className="font-storybook text-[11px] font-bold text-[#091A33] tracking-wide block mt-0.5">
                    AST-2026-{totalTransmissions}
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-7 bg-[#091A33]/60 mb-3 ml-1.5 shrink-0" />

                {/* Bottom-Right Curved Dark Navy Corner Badge */}
                <div className="relative bg-[#07162E] text-[#F3EDE0] pl-5 pr-3 pt-2.5 pb-2.5 rounded-tl-[26px] rounded-br-[20px] flex items-center gap-1.5 shrink-0 ml-1">
                  <div className="text-center leading-tight">
                    <span className="text-[7.5px] tracking-[0.2em] uppercase block text-[#F3EDE0]/90">
                      {t.travelLine1}
                    </span>
                    <span className="text-[7.5px] tracking-[0.16em] uppercase font-semibold block text-[#F3EDE0] mt-0.5">
                      {t.travelLine2}
                    </span>
                  </div>
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#F3EDE0] shrink-0" fill="currentColor">
                    <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reset Action Below Ticket */}
            <button
              type="button"
              onClick={handleResetForAnother}
              className={`flex items-center gap-1.5 text-[11px] font-semibold text-[#93C5FD] hover:text-white bg-[#0B2044]/80 hover:bg-[#103467] px-3.5 py-1.5 rounded-full border border-[#38BDF8]/40 transition-all cursor-pointer active:scale-95 shadow-md ${
                isUrdu ? 'font-urdu' : ''
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.sendAnother}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
