/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { getLocalizedSpreads } from './data/explorersUr';
import { CosmicBackground } from './components/CosmicBackground';
import { BookCover } from './components/BookCover';
import { InteractiveBook } from './components/InteractiveBook';
import { NasaSourcesModal } from './components/NasaSourcesModal';
import { soundFX, speechNarrator } from './utils/audio';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { getTranslations } from './i18n/translations';

type BookState = 'closed' | 'open';

function AstrivaAppContent() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const t = getTranslations(language);
  const spreads = getLocalizedSpreads(language);

  const [bookState, setBookState] = useState<BookState>('closed');
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCoverOpening, setIsCoverOpening] = useState(false);

  // Sync mute state with soundFX & speechNarrator
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.isMuted = nextMuted;
    if (nextMuted) {
      speechNarrator.stop();
    }
  };

  // Open Cover
  const handleOpenBook = () => {
    soundFX.playBookOpen();
    setIsCoverOpening(true);
    setTimeout(() => {
      setBookState('open');
      setIsCoverOpening(false);
    }, 400);
  };

  // Close Cover
  const handleCloseBook = () => {
    soundFX.playPageTurn();
    speechNarrator.stop();
    setBookState('closed');
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSourcesOpen) {
        if (e.key === 'Escape') {
          setIsSourcesOpen(false);
        }
        return;
      }

      if (bookState === 'open') {
        const goNextKey = isUrdu ? 'ArrowLeft' : 'ArrowRight';
        const goPrevKey = isUrdu ? 'ArrowRight' : 'ArrowLeft';

        if (e.key === goNextKey && currentSpreadIndex < spreads.length - 1) {
          soundFX.playPageTurn();
          setCurrentSpreadIndex((prev) => prev + 1);
        } else if (e.key === goPrevKey && currentSpreadIndex > 0) {
          soundFX.playPageTurn();
          setCurrentSpreadIndex((prev) => prev - 1);
        } else if (e.key === 'Escape') {
          handleCloseBook();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookState, currentSpreadIndex, isSourcesOpen, spreads.length, isUrdu]);

  return (
    <div className="relative h-screen w-full bg-[#030712] text-[#F8FAFC] overflow-hidden flex flex-col justify-between selection:bg-[#E7B96A]/30">
      {/* Full-Screen Deep Navy Blue Space Background with Stars & Planets */}
      <CosmicBackground />

      {/* Floating Controls (Top-Right): Bilingual Language Switcher + Audio Mute */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <div
          role="group"
          aria-label={t.app.switchLanguageLabel}
          className="flex items-center rounded-full bg-[#102C57]/85 border border-[#E7B96A]/45 p-0.5 shadow-lg backdrop-blur-sm"
        >
          <span className="pl-2 pr-1 text-[#E7B96A]" aria-hidden="true">
            <Globe className="w-3.5 h-3.5" />
          </span>
          <button
            type="button"
            onClick={() => {
              soundFX.playMarkerClick();
              setLanguage('en');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              !isUrdu
                ? 'bg-[#E7B96A] text-[#06132D] shadow-sm'
                : 'text-[#F2E6CB]/80 hover:text-[#FFF1C5]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playMarkerClick();
              setLanguage('ur');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-bold font-urdu transition-all cursor-pointer ${
              isUrdu
                ? 'bg-[#E7B96A] text-[#06132D] shadow-sm'
                : 'text-[#F2E6CB]/80 hover:text-[#FFF1C5]'
            }`}
          >
            اردو
          </button>
        </div>

        <button
          onClick={handleToggleMute}
          aria-label={isMuted ? t.app.unmuteAria : t.app.muteAria}
          className="p-2.5 rounded-full bg-[#102C57]/80 hover:bg-[#1B3B6F] border border-[#E7B96A]/40 text-[#E7B96A] hover:text-[#FFF1C5] transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm active:scale-95"
          title={isMuted ? t.app.unmuteTooltip : t.app.muteTooltip}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Storybook Experience */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center py-2">
        {bookState === 'closed' ? (
          <BookCover
            onOpen={handleOpenBook}
            isOpening={isCoverOpening}
            isMuted={isMuted}
          />
        ) : (
          <InteractiveBook
            spreads={spreads}
            currentSpreadIndex={currentSpreadIndex}
            onPageChange={setCurrentSpreadIndex}
            onCloseToCover={handleCloseBook}
            onOpenSources={() => setIsSourcesOpen(true)}
            isMuted={isMuted}
          />
        )}
      </main>

      {/* NASA Sources and Historical Verification Modal */}
      <NasaSourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AstrivaAppContent />
    </LanguageProvider>
  );
}
