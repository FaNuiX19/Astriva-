import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  Sparkles,
  FileText,
  X,
} from 'lucide-react';
import { Explorer, Milestone } from '../data/explorers';
import { ExplorerCharacter } from './ExplorerCharacter';
import { soundFX, speechNarrator } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface StorytellingStageProps {
  explorer: Explorer;
  onBackToBook: () => void;
  onOpenSources: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StorytellingStage: React.FC<StorytellingStageProps> = ({
  explorer,
  onBackToBook,
  onOpenSources,
  isMuted,
  onToggleMute,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const bookT = getTranslations(language).book;

  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    explorer.timeline[0] || null
  );
  const [stageReady, setStageReady] = useState(false);
  const autoPlayRef = useRef(false);

  // Sync selectedMilestone when localized explorer updates
  useEffect(() => {
    if (selectedMilestone) {
      const updated = explorer.timeline.find((m) => m.id === selectedMilestone.id);
      if (updated) setSelectedMilestone(updated);
    }
  }, [explorer, selectedMilestone]);

  // Smooth entrance: book tilts flat, character rises
  useEffect(() => {
    soundFX.playCharacterRise();
    const timer = setTimeout(() => {
      setStageReady(true);
    }, 120);

    return () => {
      clearTimeout(timer);
      speechNarrator.stop();
    };
  }, [explorer.id]);

  // Handle Speech Narration for current paragraph
  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      speechNarrator.stop();
      setIsPlayingAudio(false);
      autoPlayRef.current = false;
    } else {
      const textToSpeak = explorer.storyParagraphs[currentParagraphIndex];
      autoPlayRef.current = true;
      setIsPlayingAudio(true);
      speechNarrator.speak(
        textToSpeak,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          if (autoPlayRef.current && currentParagraphIndex < explorer.storyParagraphs.length - 1) {
            setCurrentParagraphIndex((prev) => prev + 1);
          } else {
            autoPlayRef.current = false;
          }
        },
        () => setIsPlayingAudio(false),
        language
      );
    }
  };

  const handleRestart = () => {
    speechNarrator.stop();
    setCurrentParagraphIndex(0);
    setIsPlayingAudio(false);
    autoPlayRef.current = false;
  };

  const handleNextPart = () => {
    if (currentParagraphIndex < explorer.storyParagraphs.length - 1) {
      setCurrentParagraphIndex((prev) => prev + 1);
    } else {
      setCurrentParagraphIndex(0);
    }
  };

  // Sync speech when current paragraph changes
  useEffect(() => {
    if (autoPlayRef.current) {
      const textToSpeak = explorer.storyParagraphs[currentParagraphIndex];
      speechNarrator.speak(
        textToSpeak,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          if (autoPlayRef.current && currentParagraphIndex < explorer.storyParagraphs.length - 1) {
            setCurrentParagraphIndex((prev) => prev + 1);
          } else {
            autoPlayRef.current = false;
          }
        },
        () => setIsPlayingAudio(false),
        language
      );
    }
  }, [currentParagraphIndex, explorer, language]);

  const handleSelectMilestone = (milestone: Milestone) => {
    soundFX.playMarkerClick();
    setSelectedMilestone(selectedMilestone?.id === milestone.id ? null : milestone);
  };

  const handleReturn = () => {
    speechNarrator.stop();
    onBackToBook();
  };

  return (
    <div
      className={`relative z-10 flex flex-col items-center justify-between flex-1 px-3 sm:px-6 py-2 select-none max-w-6xl mx-auto w-full ${
        isUrdu ? 'font-urdu' : ''
      }`}
    >
      {/* 2.5D HORIZONTAL STAGE */}
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center my-auto">
        <div
          style={{ perspective: '1000px' }}
          className="w-full flex justify-center items-center relative py-2 sm:py-4"
        >
          {/* Tilted Horizontal Book Stage Platform */}
          <div
            style={{
              transform: stageReady
                ? 'rotateX(52deg) translateY(30px) translateZ(-30px) scale(0.97)'
                : 'rotateX(0deg) translateY(0px) translateZ(0px) scale(1)',
              transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="w-[94%] sm:w-[90%] h-48 sm:h-60 rounded-2xl bg-gradient-to-b from-[#F2E6CB] via-[#E2D4B7] to-[#CBB895] border-2 border-[#E7B96A] shadow-[0_35px_60px_rgba(0,0,0,0.9)] relative pointer-events-none"
          >
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#8C6F42]/35" />
            <div className="absolute inset-2 border border-[#E7B96A]/35 rounded-xl" />
          </div>

          {/* On Stage Content */}
          <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-10 z-20 pointer-events-auto">
            <div
              style={{
                transform: stageReady
                  ? 'translateY(-20px) translateZ(60px) scale(1)'
                  : 'translateY(30px) translateZ(0px) scale(0.9)',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="flex-1 max-w-[260px] sm:max-w-[320px] flex justify-center items-center"
            >
              <ExplorerCharacter
                explorerId={explorer.id}
                size="stage"
                isAnimated={true}
              />
            </div>

            {/* Speech Bubble */}
            <div className="flex-1 max-w-[320px] sm:max-w-[420px] ml-2 sm:ml-4">
              <div
                dir={dir}
                className={`relative rounded-2xl bg-[#F4E8D0] text-[#28231E] p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-2 border-[#E7B96A] ${
                  isUrdu ? 'text-right' : 'text-left'
                }`}
              >
                <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-[12px] border-r-[#F4E8D0]" />

                <div className="flex items-center justify-between border-b border-[#28231E]/15 pb-1.5 mb-2">
                  <span className="text-[11px] font-bold tracking-widest text-[#8B6B3C] uppercase">
                    {explorer.name}
                  </span>
                  <span className="text-[10px] text-[#8B6B3C] font-semibold">
                    {bookT.partOf(currentParagraphIndex + 1, explorer.storyParagraphs.length)}
                  </span>
                </div>

                {showCaptions ? (
                  <p className="font-storybook text-xs sm:text-sm md:text-base text-[#28231E] leading-relaxed min-h-[72px] sm:min-h-[85px]">
                    &ldquo;{explorer.storyParagraphs[currentParagraphIndex]}&rdquo;
                  </p>
                ) : (
                  <div className="flex items-center justify-center min-h-[72px] sm:min-h-[85px] text-xs text-[#28231E]/50 italic">
                    {isUrdu ? 'تحریر پوشیدہ ہے۔ آواز جاری ہے۔' : 'Captions hidden. Audio playing.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AUDIO CONTROL BAR */}
        <div
          dir={dir}
          className="mt-2 sm:mt-3 px-3 py-1.5 sm:py-2 rounded-full bg-[#102C57]/90 border border-[#E7B96A]/60 flex items-center justify-center gap-3 sm:gap-5 shadow-lg z-30"
        >
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FFF1C5] hover:text-[#E7B96A] transition-colors cursor-pointer"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current text-[#E7B96A]" />
                <span>{bookT.pauseVoice}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#E7B96A]" />
                <span>{bookT.readToMe}</span>
              </>
            )}
          </button>

          <span className="text-white/20">|</span>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F2E6CB] hover:text-[#FFF1C5] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#E7B96A]" />
            <span>{isUrdu ? 'دوبارہ شروع' : 'RESTART'}</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            onClick={handleNextPart}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F2E6CB] hover:text-[#FFF1C5] transition-colors cursor-pointer"
          >
            <span>{bookT.next}</span>
            <SkipForward className={`w-3 h-3 text-[#E7B96A] ${isUrdu ? 'rotate-180' : ''}`} />
          </button>

          <span className="text-white/20 hidden sm:inline">|</span>

          <button
            onClick={onToggleMute}
            className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[#F2E6CB] hover:text-[#FFF1C5] transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#E7B96A]" />
            )}
            <span>{isMuted ? (isUrdu ? 'بند' : 'MUTED') : isUrdu ? 'آواز' : 'AUDIO'}</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className="text-[11px] font-medium text-[#F2E6CB] hover:text-[#FFF1C5] transition-colors cursor-pointer"
          >
            {isUrdu
              ? showCaptions
                ? 'تحریر: آن'
                : 'تحریر: آف'
              : `CAPTIONS ${showCaptions ? 'ON' : 'OFF'}`}
          </button>
        </div>

        {/* TIMELINE */}
        <div className="w-full mt-4 sm:mt-5 px-2 z-30">
          <div className="relative py-2">
            <div className="absolute top-1/2 left-4 right-4 h-[1.5px] -translate-y-1/2 bg-gradient-to-r from-[#102C57] via-[#E7B96A]/60 to-[#102C57] -z-0" />

            <div className="relative flex justify-between items-center z-10 overflow-x-auto pb-1 px-2">
              {explorer.timeline.map((m) => {
                const isSelected = selectedMilestone?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMilestone(m)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none shrink-0 px-2 sm:px-3"
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-[#E7B96A] border-[#FFF1C5] scale-110 shadow-[0_0_12px_#E7B96A]'
                          : 'bg-[#102C57] border-[#E7B96A]/50 group-hover:border-[#E7B96A]'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#102C57]' : 'bg-[#E7B96A]'
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[9px] sm:text-[10px] font-bold tracking-wider mt-1 transition-colors uppercase ${
                        isSelected ? 'text-[#E7B96A]' : 'text-[#F5F8FF]/70 group-hover:text-[#F5F8FF]'
                      }`}
                    >
                      {m.label}
                    </span>

                    <span className="text-[8px] sm:text-[9px] text-[#F5F8FF]/50">
                      {m.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMilestone && (
            <div
              dir={dir}
              className={`mt-2 p-3 rounded-xl bg-[#102C57]/80 border border-[#E7B96A]/40 transition-all duration-300 ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-storybook text-xs sm:text-sm font-bold text-[#E7B96A]">
                  {selectedMilestone.title}
                </span>
                <span className="text-[11px] text-[#F2E6CB]/70 font-medium">
                  {selectedMilestone.date}
                </span>
              </div>
              <p className="text-xs text-[#F5F8FF]/90 leading-relaxed">
                {selectedMilestone.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div
        dir={dir}
        className="w-full max-w-4xl flex items-center justify-between mt-3 px-2 z-30 pt-2 border-t border-white/10"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleReturn}
            className="w-8 h-8 rounded-full border border-[#E7B96A]/60 bg-[#102C57]/80 flex items-center justify-center text-[#E7B96A] hover:bg-[#1B3B6F] transition-colors cursor-pointer"
            aria-label={bookT.backToBook}
            title={bookT.backToBook}
          >
            <ChevronLeft className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setShowTranscript(true)}
            className="text-xs text-[#F2E6CB]/80 hover:text-[#FFF1C5] underline underline-offset-4 cursor-pointer"
          >
            {isUrdu ? 'مکمل تحریر' : 'Full Transcript'}
          </button>

          <span className="text-white/20">·</span>

          <button
            onClick={onOpenSources}
            className="text-xs text-[#E7B96A] hover:text-[#FFF1C5] underline underline-offset-4 cursor-pointer"
          >
            {bookT.nasaSources}
          </button>
        </div>

        <button
          onClick={handleReturn}
          className="group flex items-center gap-2 px-5 py-2 rounded-full bg-[#102C57] hover:bg-[#1B3B6F] border border-[#E7B96A] text-[#FFF1C5] font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          <span>{bookT.backToBook}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E7B96A] group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* FULL TRANSCRIPT MODAL */}
      {showTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
          <div
            dir={dir}
            className={`relative w-full max-w-lg rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] p-5 shadow-2xl max-h-[85vh] flex flex-col ${
              isUrdu ? 'font-urdu text-right' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7B96A]/30">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E7B96A]" />
                <h3
                  className={`text-sm sm:text-base font-bold text-[#E7B96A] ${
                    isUrdu ? 'font-urdu' : 'font-cinzel'
                  }`}
                >
                  {isUrdu ? `مکمل کہانی: ${explorer.name}` : `Full Story Transcript: ${explorer.name}`}
                </h3>
              </div>
              <button
                onClick={() => setShowTranscript(false)}
                className="p-1 text-[#F2E6CB]/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 text-xs sm:text-sm text-[#F5F8FF]/90 leading-relaxed font-storybook">
              {explorer.storyParagraphs.map((para, i) => (
                <p key={i} className="p-2.5 rounded-lg bg-[#102C57]/40 border border-white/5">
                  <span className="font-bold text-[#E7B96A] block mb-1">
                    {bookT.partOf(i + 1, explorer.storyParagraphs.length)}
                  </span>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
