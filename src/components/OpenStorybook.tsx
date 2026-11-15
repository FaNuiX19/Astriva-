import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, X } from 'lucide-react';
import { Explorer, PageSpread } from '../data/explorers';
import { ExplorerCharacter } from './ExplorerCharacter';
import { soundFX } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';

interface OpenStorybookProps {
  spreads: PageSpread[];
  currentSpreadIndex: number;
  onPageChange: (newIndex: number) => void;
  onSelectExplorer: (explorer: Explorer) => void;
  onCloseBook: () => void;
  allExplorers: Explorer[];
}

export const OpenStorybook: React.FC<OpenStorybookProps> = ({
  spreads,
  currentSpreadIndex,
  onPageChange,
  onSelectExplorer,
  allExplorers,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const bookT = getTranslations(language).book;

  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const [showIndex, setShowIndex] = useState(false);

  const currentSpread = spreads[currentSpreadIndex];
  const canGoPrev = currentSpreadIndex > 0;
  const canGoNext = currentSpreadIndex < spreads.length - 1;

  const handlePrev = () => {
    if (!canGoPrev) return;
    soundFX.playPageTurn();
    setIsFlipping('prev');
    setTimeout(() => {
      onPageChange(currentSpreadIndex - 1);
      setIsFlipping(null);
    }, 250);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    soundFX.playPageTurn();
    setIsFlipping('next');
    setTimeout(() => {
      onPageChange(currentSpreadIndex + 1);
      setIsFlipping(null);
    }, 250);
  };

  const handleJumpFromIndex = (explorer: Explorer) => {
    const foundSpreadIdx = spreads.findIndex(
      (s) => s.leftSlot?.explorer?.id === explorer.id || s.rightSlot?.explorer?.id === explorer.id
    );
    if (foundSpreadIdx !== -1) {
      onPageChange(foundSpreadIdx);
    }
    setShowIndex(false);
    onSelectExplorer(explorer);
  };

  return (
    <div
      className={`relative z-10 flex flex-col items-center justify-center flex-1 px-3 sm:px-6 py-2 select-none max-w-6xl mx-auto w-full ${
        isUrdu ? 'font-urdu' : ''
      }`}
    >
      {/* OPEN STORYBOOK */}
      <div className="relative w-full max-w-4xl my-auto">
        <div className="absolute -inset-3 sm:-inset-4 bg-[#091D3C] rounded-2xl sm:rounded-3xl border border-[#E7B96A]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] -z-10" />
        <div className="absolute -bottom-2.5 left-6 right-6 h-3 bg-[#D3C19C] rounded-b-md shadow-inner border-x border-b border-[#8C7350]/30 -z-10" />
        <div className="absolute -bottom-4.5 left-10 right-10 h-2 bg-[#C4B18B] rounded-b-md shadow-inner border-x border-b border-[#8C7350]/30 -z-20" />

        <div
          dir={dir}
          className={`grid grid-cols-1 md:grid-cols-2 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-200 ${
            isFlipping ? 'opacity-85 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Visible Central Spine Crease */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 z-20 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-black/20 via-black/40 to-black/20" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#5A4526]/40" />
          </div>

          {/* FIRST PAGE OF SPREAD (LEFT IN LTR, RIGHT IN RTL) */}
          {currentSpread.leftSlot?.explorer && (
            <div
              dir={dir}
              className={`parchment-page ${
                isUrdu
                  ? 'parchment-right-page md:border-l'
                  : 'parchment-left-page md:border-r'
              } p-6 sm:p-8 flex flex-col justify-between items-center text-center relative border-b md:border-b-0 border-[#D4C3A3] min-h-[460px] sm:min-h-[500px]`}
            >
              <div className="w-full">
                <h2
                  className={`text-base sm:text-lg md:text-xl font-bold text-[#28231E] tracking-wider uppercase mb-1 ${
                    isUrdu ? 'font-urdu' : 'font-cinzel'
                  }`}
                >
                  {currentSpread.leftSlot.explorer.epithet}
                </h2>
                <p className="font-storybook text-xs sm:text-sm text-[#28231E]/85 italic max-w-xs mx-auto leading-relaxed">
                  &ldquo;{currentSpread.leftSlot.explorer.shortIntro}&rdquo;
                </p>

                <div
                  className={`text-[11px] sm:text-xs text-[#28231E]/75 mt-2.5 space-y-0.5 font-medium ${
                    isUrdu ? 'text-right' : 'text-left'
                  } max-w-[240px] mx-auto bg-[#E8DCBF]/50 p-2 rounded-lg border border-[#D7C9A7]`}
                >
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'منزل:' : 'Destination:'}
                    </span>{' '}
                    {currentSpread.leftSlot.explorer.displayDestination ||
                      currentSpread.leftSlot.explorer.destination}
                  </div>
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'مشن کا دورانیہ:' : 'Mission Period:'}
                    </span>{' '}
                    {currentSpread.leftSlot.explorer.activeYears}
                  </div>
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'مشن کی حالت:' : 'Mission Status:'}
                    </span>{' '}
                    <span>
                      {currentSpread.leftSlot.explorer.displayStatus ||
                        currentSpread.leftSlot.explorer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  currentSpread.leftSlot?.explorer &&
                  onSelectExplorer(currentSpread.leftSlot.explorer)
                }
                className="my-3 cursor-pointer group flex flex-col items-center"
              >
                <div className="transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  <ExplorerCharacter
                    explorerId={currentSpread.leftSlot.explorer.id}
                    size="page"
                    isAnimated={true}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  currentSpread.leftSlot?.explorer &&
                  onSelectExplorer(currentSpread.leftSlot.explorer)
                }
                className="group text-xs sm:text-sm font-bold tracking-widest text-[#102C57] hover:text-[#CA8A04] transition-colors py-1 cursor-pointer flex items-center gap-1.5 uppercase border-b-2 border-[#102C57]/40 hover:border-[#CA8A04]"
              >
                <span>{bookT.tapToMeetMe}</span>
              </button>
            </div>
          )}

          {/* SECOND PAGE OF SPREAD (RIGHT IN LTR, LEFT IN RTL) */}
          {currentSpread.rightSlot?.explorer && (
            <div
              dir={dir}
              className={`parchment-page ${
                isUrdu ? 'parchment-left-page' : 'parchment-right-page'
              } p-6 sm:p-8 flex flex-col justify-between items-center text-center relative min-h-[460px] sm:min-h-[500px]`}
            >
              <div className="w-full">
                <h2
                  className={`text-base sm:text-lg md:text-xl font-bold text-[#28231E] tracking-wider uppercase mb-1 ${
                    isUrdu ? 'font-urdu' : 'font-cinzel'
                  }`}
                >
                  {currentSpread.rightSlot.explorer.epithet}
                </h2>
                <p className="font-storybook text-xs sm:text-sm text-[#28231E]/85 italic max-w-xs mx-auto leading-relaxed">
                  &ldquo;{currentSpread.rightSlot.explorer.shortIntro}&rdquo;
                </p>

                <div
                  className={`text-[11px] sm:text-xs text-[#28231E]/75 mt-2.5 space-y-0.5 font-medium ${
                    isUrdu ? 'text-right' : 'text-left'
                  } max-w-[240px] mx-auto bg-[#E8DCBF]/50 p-2 rounded-lg border border-[#D7C9A7]`}
                >
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'منزل:' : 'Destination:'}
                    </span>{' '}
                    {currentSpread.rightSlot.explorer.displayDestination ||
                      currentSpread.rightSlot.explorer.destination}
                  </div>
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'مشن کا دورانیہ:' : 'Mission Period:'}
                    </span>{' '}
                    {currentSpread.rightSlot.explorer.activeYears}
                  </div>
                  <div>
                    <span className="font-semibold text-[#8B6B3C]">
                      {isUrdu ? 'مشن کی حالت:' : 'Mission Status:'}
                    </span>{' '}
                    <span>
                      {currentSpread.rightSlot.explorer.displayStatus ||
                        currentSpread.rightSlot.explorer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  currentSpread.rightSlot?.explorer &&
                  onSelectExplorer(currentSpread.rightSlot.explorer)
                }
                className="my-3 cursor-pointer group flex flex-col items-center"
              >
                <div className="transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  <ExplorerCharacter
                    explorerId={currentSpread.rightSlot.explorer.id}
                    size="page"
                    isAnimated={true}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  currentSpread.rightSlot?.explorer &&
                  onSelectExplorer(currentSpread.rightSlot.explorer)
                }
                className="group text-xs sm:text-sm font-bold tracking-widest text-[#102C57] hover:text-[#CA8A04] transition-colors py-1 cursor-pointer flex items-center gap-1.5 uppercase border-b-2 border-[#102C57]/40 hover:border-[#CA8A04]"
              >
                <span>{bookT.tapToMeetMe}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS BELOW THE BOOK */}
      <div dir={dir} className="w-full max-w-4xl flex items-center justify-between mt-4 px-2">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label={isUrdu ? 'پچھلی کہانی' : 'Previous story'}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-[#E7B96A]/60 bg-[#102C57]/80 text-[#F5F8FF] transition-all cursor-pointer ${
            canGoPrev
              ? 'hover:bg-[#1B3B6F] hover:border-[#E7B96A] hover:scale-110 active:scale-95'
              : 'opacity-30 cursor-not-allowed border-slate-700'
          }`}
        >
          {isUrdu ? (
            <ChevronRight className="w-5 h-5 text-[#E7B96A]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[#E7B96A]" />
          )}
        </button>

        <div className="text-xs sm:text-sm text-[#F2E6CB] font-storybook italic tracking-wider">
          {bookT.spreadOf(currentSpreadIndex + 1, spreads.length)}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowIndex(true)}
            className="flex items-center gap-1 text-[11px] sm:text-xs text-[#E7B96A] hover:text-[#FFF1C5] px-2.5 py-1.5 rounded-lg border border-[#E7B96A]/40 bg-[#102C57]/60 hover:bg-[#1B3B6F] transition-colors cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'کھوجیوں کی فہرست' : 'Explorer index'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label={isUrdu ? 'اگلی کہانی' : 'Next story'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-[#E7B96A]/60 bg-[#102C57]/80 text-[#F5F8FF] transition-all cursor-pointer ${
              canGoNext
                ? 'hover:bg-[#1B3B6F] hover:border-[#E7B96A] hover:scale-110 active:scale-95'
                : 'opacity-30 cursor-not-allowed border-slate-700'
            }`}
          >
            {isUrdu ? (
              <ChevronLeft className="w-5 h-5 text-[#E7B96A]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#E7B96A]" />
            )}
          </button>
        </div>
      </div>

      {/* QUICK EXPLORER INDEX MODAL */}
      {showIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
          <div
            dir={dir}
            className={`relative w-full max-w-xl rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] p-5 shadow-2xl ${
              isUrdu ? 'font-urdu text-right' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7B96A]/30">
              <h3
                className={`text-sm sm:text-base font-bold text-[#E7B96A] ${
                  isUrdu ? 'font-urdu' : 'font-cinzel'
                }`}
              >
                {isUrdu ? 'خلائی کھوجیوں کی فہرست' : 'EXPLORER INDEX'}
              </h3>
              <button
                onClick={() => setShowIndex(false)}
                className="p-1 text-[#F2E6CB]/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allExplorers.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleJumpFromIndex(exp)}
                  className="flex flex-col items-center p-2.5 rounded-xl border border-white/10 hover:border-[#E7B96A] bg-[#102C57]/50 hover:bg-[#102C57] transition-all cursor-pointer group text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <ExplorerCharacter explorerId={exp.id} size="page" isAnimated={false} />
                  </div>
                  <span className="font-bold text-xs text-[#F5F8FF] group-hover:text-[#E7B96A] mt-1">
                    {exp.name}
                  </span>
                  <span className="text-[10px] text-[#F2E6CB]/60">
                    {exp.displayDestination || exp.destination}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
