import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowLeft,
  Sparkles,
  Info,
  Book,
  Radio,
  BookOpen,
  ExternalLink,
  ZoomIn,
  X,
  Loader2
} from 'lucide-react';
import { Explorer, ExplorerVideo, PageSpread, BookSlot, ChapterIntro, ChapterEquipmentPhoto } from '../data/explorers';
import { getLocalizedMobilePages, getLocalizedExplorers } from '../data/explorersUr';
import { ExplorerCharacter } from './ExplorerCharacter';
import { RobotGuide } from './RobotGuide';
import { DeepSpaceDispatchPage } from './DeepSpaceDispatchPage';
import { soundFX, speechNarrator } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { getTranslations } from '../i18n/translations';
import realisticMarsImg from '../assets/images/realistic_mars_globe_1794654684673.jpg';
import realisticMoonImg from '../assets/images/realistic_moon_globe_1794654789542.jpg';

interface InteractiveBookProps {
  spreads: PageSpread[];
  currentSpreadIndex: number;
  onPageChange: (newIndex: number) => void;
  onCloseToCover: () => void;
  onOpenSources: () => void;
  isMuted: boolean;
}

export const InteractiveBook: React.FC<InteractiveBookProps> = ({
  spreads,
  currentSpreadIndex,
  onPageChange,
  onCloseToCover,
  onOpenSources,
  isMuted,
}) => {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslations(language).book;
  const mobilePages = getLocalizedMobilePages(language);
  const localizedExplorers = getLocalizedExplorers(language);

  // Mobile Viewport Detection (< 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Total mobile pages: Moon Intro + 2 Moon + Mars Intro + 2 Mars/Deep Space + Send Message = 7 pages
  const TOTAL_MOBILE_PAGES = mobilePages.length;
  const LAST_MOBILE_PAGE_INDEX = TOTAL_MOBILE_PAGES - 1;

  // Mobile page index (0 to 6)
  const [mobilePageIndex, setMobilePageIndex] = useState<number>(() => {
    return currentSpreadIndex === spreads.length - 1 ? LAST_MOBILE_PAGE_INDEX : currentSpreadIndex * 2;
  });

  // Sync mobilePageIndex if parent updates currentSpreadIndex externally
  useEffect(() => {
    const mappedSpread = mobilePageIndex === LAST_MOBILE_PAGE_INDEX ? spreads.length - 1 : Math.floor(mobilePageIndex / 2);
    if (mappedSpread !== currentSpreadIndex) {
      setMobilePageIndex(currentSpreadIndex === spreads.length - 1 ? LAST_MOBILE_PAGE_INDEX : currentSpreadIndex * 2);
    }
  }, [currentSpreadIndex]);

  // Transformation state: reading upright book vs transformed horizontal stage
  const [isTransformed, setIsTransformed] = useState(false);
  const [selectedExplorer, setSelectedExplorer] = useState<Explorer | null>(null);
  
  // Physical 3D Page Flipping state
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [flippingSpreadIndex, setFlippingSpreadIndex] = useState(currentSpreadIndex);

  // Gesture & Swipe to Turn Pages
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);

  // Automatically fade out the swipe guide hint
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Narration & Audio
  const [currentParaIdx, setCurrentParaIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);

  // Keep selectedExplorer synchronized with active language
  const activeExplorer = selectedExplorer
    ? localizedExplorers.find((e) => e.id === selectedExplorer.id) || selectedExplorer
    : null;

  useEffect(() => {
    setIsPlayingAudio(false);
    setIsLoadingVoice(false);
  }, [language]);
  
  // Timeline
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Full-size NASA Photo & Mission Video Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<ChapterEquipmentPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<ExplorerVideo | null>(null);
  const [videoNeedsUnmute, setVideoNeedsUnmute] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cosmic Flashhh Boom state when Deep Space dispatch ticket appears
  const [isDispatchFlashing, setIsDispatchFlashing] = useState(false);
  const dispatchFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDispatchFlash = () => {
    if (dispatchFlashTimerRef.current) {
      clearTimeout(dispatchFlashTimerRef.current);
    }
    setIsDispatchFlashing(true);
    dispatchFlashTimerRef.current = setTimeout(() => {
      setIsDispatchFlashing(false);
    }, 980);
  };

  useEffect(() => {
    if (!selectedPhoto && !selectedVideo) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setSelectedPhoto(null);
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleEsc, true);
    return () => window.removeEventListener('keydown', handleEsc, true);
  }, [selectedPhoto, selectedVideo]);

  // Ensure the expanded mission video starts playing immediately (falling back to muted autoplay if browser blocks audio)
  useEffect(() => {
    if (!selectedVideo) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = isMuted;
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (!videoEl.muted) {
          videoEl.muted = true;
          setVideoNeedsUnmute(true);
          videoEl.play().catch(() => {});
        }
      });
    }
  }, [selectedVideo, isMuted]);

  useEffect(() => {
    return () => {
      if (dispatchFlashTimerRef.current) {
        clearTimeout(dispatchFlashTimerRef.current);
      }
    };
  }, []);

  // Current desktop page spread
  const currentSpread = spreads[currentSpreadIndex];
  const canGoPrevDesktop = currentSpreadIndex > 0;
  const canGoNextDesktop = currentSpreadIndex < spreads.length - 1;

  // Current mobile page item
  const currentMobilePage = mobilePages[mobilePageIndex] || mobilePages[0];
  const currentMobileExplorer = currentMobilePage.type === 'explorer' ? currentMobilePage.explorer || null : null;
  const currentMobileIntro = currentMobilePage.type === 'intro' ? currentMobilePage.intro || null : null;
  const canGoPrevMobile = mobilePageIndex > 0;
  const canGoNextMobile = mobilePageIndex < TOTAL_MOBILE_PAGES - 1;

  const canGoPrev = isMobile ? canGoPrevMobile : canGoPrevDesktop;
  const canGoNext = isMobile ? canGoNextMobile : canGoNextDesktop;

  // Turn page handlers with visible 3D flip animation
  const handlePrevPage = () => {
    if (isTransformed || isFlipping) return;

    if (isMobile) {
      if (!canGoPrevMobile) return;
      soundFX.playPageTurn();
      setFlipDirection('prev');
      setIsFlipping(true);

      setTimeout(() => {
        const nextIdx = mobilePageIndex - 1;
        setMobilePageIndex(nextIdx);
        onPageChange(nextIdx === LAST_MOBILE_PAGE_INDEX ? spreads.length - 1 : Math.floor(nextIdx / 2));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 620);
      return;
    }

    if (!canGoPrevDesktop) return;
    soundFX.playPageTurn();
    setFlippingSpreadIndex(currentSpreadIndex);
    setFlipDirection('prev');
    setIsFlipping(true);

    setTimeout(() => {
      const nextSpread = currentSpreadIndex - 1;
      onPageChange(nextSpread);
      setMobilePageIndex(nextSpread === spreads.length - 1 ? LAST_MOBILE_PAGE_INDEX : nextSpread * 2);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 620);
  };

  const handleNextPage = () => {
    if (isTransformed || isFlipping) return;

    if (isMobile) {
      if (!canGoNextMobile) return;
      soundFX.playPageTurn();
      setFlipDirection('next');
      setIsFlipping(true);

      setTimeout(() => {
        const nextIdx = mobilePageIndex + 1;
        setMobilePageIndex(nextIdx);
        onPageChange(nextIdx === LAST_MOBILE_PAGE_INDEX ? spreads.length - 1 : Math.floor(nextIdx / 2));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 620);
      return;
    }

    if (!canGoNextDesktop) return;
    soundFX.playPageTurn();
    setFlippingSpreadIndex(currentSpreadIndex);
    setFlipDirection('next');
    setIsFlipping(true);

    setTimeout(() => {
      const nextSpread = currentSpreadIndex + 1;
      onPageChange(nextSpread);
      setMobilePageIndex(nextSpread === spreads.length - 1 ? LAST_MOBILE_PAGE_INDEX : nextSpread * 2);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 620);
  };

  const handleJumpToSpread = (index: number) => {
    if (index === currentSpreadIndex || isTransformed || isFlipping) return;
    soundFX.playPageTurn();
    setFlippingSpreadIndex(currentSpreadIndex);
    setFlipDirection(index > currentSpreadIndex ? 'next' : 'prev');
    setIsFlipping(true);

    setTimeout(() => {
      onPageChange(index);
      setMobilePageIndex(index === spreads.length - 1 ? LAST_MOBILE_PAGE_INDEX : index * 2);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 620);
  };

  const handleJumpToMobilePage = (index: number) => {
    if (index === mobilePageIndex || isTransformed || isFlipping) return;
    soundFX.playPageTurn();
    setFlipDirection(index > mobilePageIndex ? 'next' : 'prev');
    setIsFlipping(true);

    setTimeout(() => {
      setMobilePageIndex(index);
      onPageChange(index === LAST_MOBILE_PAGE_INDEX ? spreads.length - 1 : Math.floor(index / 2));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 620);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransformed || isFlipping) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, select')) return;

    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    dragDistanceRef.current = 0;
    setIsDragging(true);
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || touchStartX === null || isTransformed || isFlipping) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - (touchStartY ?? touch.clientY);

    // If movement is predominantly vertical, don't interrupt standard scroll
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 15) {
      return;
    }

    dragDistanceRef.current = deltaX;
    setDragOffset(Math.max(-75, Math.min(75, deltaX)));
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    const deltaX = dragDistanceRef.current;
    setIsDragging(false);
    isDraggingRef.current = false;
    setDragOffset(0);

    const SWIPE_THRESHOLD = 35;
    const isSwipeNext = isUrdu ? deltaX > SWIPE_THRESHOLD : deltaX < -SWIPE_THRESHOLD;
    const isSwipePrev = isUrdu ? deltaX < -SWIPE_THRESHOLD : deltaX > SWIPE_THRESHOLD;

    if (isSwipeNext && canGoNext) {
      setShowSwipeHint(false);
      handleNextPage();
    } else if (isSwipePrev && canGoPrev) {
      setShowSwipeHint(false);
      handlePrevPage();
    }
  };

  // Desktop Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isTransformed || isFlipping) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, select')) return;

    setTouchStartX(e.clientX);
    setTouchStartY(e.clientY);
    dragDistanceRef.current = 0;
    setIsDragging(true);
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartX === null || isTransformed || isFlipping) return;
    const deltaX = e.clientX - touchStartX;
    dragDistanceRef.current = deltaX;
    setDragOffset(Math.max(-75, Math.min(75, deltaX)));
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    const deltaX = dragDistanceRef.current;
    setIsDragging(false);
    isDraggingRef.current = false;
    setDragOffset(0);

    const SWIPE_THRESHOLD = 35;
    const isSwipeNext = isUrdu ? deltaX > SWIPE_THRESHOLD : deltaX < -SWIPE_THRESHOLD;
    const isSwipePrev = isUrdu ? deltaX < -SWIPE_THRESHOLD : deltaX > SWIPE_THRESHOLD;

    if (isSwipeNext && canGoNext) {
      setShowSwipeHint(false);
      handleNextPage();
    } else if (isSwipePrev && canGoPrev) {
      setShowSwipeHint(false);
      handlePrevPage();
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  };

  // Visitor clicks an explorer -> Book tilts backward & character emerges ABOVE the book!
  const handleSelectExplorer = (explorer: Explorer) => {
    if (isTransformed || isFlipping || Math.abs(dragDistanceRef.current) > 12) return;

    soundFX.playCharacterRise();
    setSelectedExplorer(explorer);
    setCurrentParaIdx(0);
    setSelectedMilestoneId(explorer.timeline[0]?.id || null);

    // Trigger physical 3D backward tilt and emergence
    setIsTransformed(true);
  };

  // REVERSE: Visitor clicks "BACK TO BOOK"
  const handleBackToBook = () => {
    speechNarrator.stop();
    setIsPlayingAudio(false);
    setIsLoadingVoice(false);
    soundFX.playPageTurn();
    setIsTransformed(false);

    setTimeout(() => {
      setSelectedExplorer(null);
    }, 750);
  };

  // Play / Pause Narration
  const handleToggleAudio = () => {
    if (!activeExplorer) return;

    if (isPlayingAudio || isLoadingVoice) {
      speechNarrator.stop();
      setIsPlayingAudio(false);
      setIsLoadingVoice(false);
    } else {
      const textToSpeak = activeExplorer.storyParagraphs[currentParaIdx];
      speechNarrator.speak(
        textToSpeak,
        () => setIsPlayingAudio(true),
        () => {
          if (currentParaIdx < activeExplorer.storyParagraphs.length - 1) {
            setCurrentParaIdx((prev) => prev + 1);
          } else {
            setIsPlayingAudio(false);
          }
        },
        () => {
          setIsPlayingAudio(false);
          setIsLoadingVoice(false);
        },
        language,
        (loading) => setIsLoadingVoice(loading)
      );
    }
  };

  const handleNextParagraph = () => {
    if (!activeExplorer) return;
    if (currentParaIdx < activeExplorer.storyParagraphs.length - 1) {
      setCurrentParaIdx((prev) => prev + 1);
    } else {
      setCurrentParaIdx(0);
    }
  };

  const handlePrevParagraph = () => {
    if (currentParaIdx > 0) {
      setCurrentParaIdx((prev) => prev - 1);
    }
  };

  // Keep timeline milestone synchronized with the active story paragraph
  useEffect(() => {
    if (!activeExplorer) return;
    const matchingMilestone = activeExplorer.timeline[currentParaIdx];
    if (matchingMilestone) {
      setSelectedMilestoneId(matchingMilestone.id);
    }
  }, [currentParaIdx, activeExplorer]);

  useEffect(() => {
    if (isPlayingAudio && activeExplorer) {
      const textToSpeak = activeExplorer.storyParagraphs[currentParaIdx];
      speechNarrator.speak(
        textToSpeak,
        () => setIsPlayingAudio(true),
        () => {
          if (currentParaIdx < activeExplorer.storyParagraphs.length - 1) {
            setCurrentParaIdx((prev) => prev + 1);
          } else {
            setIsPlayingAudio(false);
          }
        },
        () => {
          setIsPlayingAudio(false);
          setIsLoadingVoice(false);
        },
        language,
        (loading) => setIsLoadingVoice(loading)
      );
    }
  }, [currentParaIdx]);

  useEffect(() => {
    if (isMuted && (isPlayingAudio || isLoadingVoice)) {
      speechNarrator.stop();
      setIsPlayingAudio(false);
      setIsLoadingVoice(false);
    }
  }, [isMuted, isPlayingAudio, isLoadingVoice]);

  useEffect(() => {
    return () => {
      speechNarrator.stop();
    };
  }, []);

  const activeMilestone = activeExplorer?.timeline.find(
    (m) => m.id === selectedMilestoneId
  );

  // Determine active spread index to feed robot guide
  const activeRobotSpread = isMobile
    ? (mobilePageIndex === LAST_MOBILE_PAGE_INDEX ? spreads.length - 1 : Math.floor(mobilePageIndex / 2))
    : currentSpreadIndex;

  const renderChapterIntroContent = (intro: ChapterIntro) => (
    <div dir={dir} className="w-full h-full flex flex-col justify-between items-center text-center py-2 sm:py-3 px-1 sm:px-2">
      {/* Compact Chapter Header */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#091D3C] border-2 border-[#E7B96A] shadow-md flex items-center justify-center mb-2 overflow-hidden">
          {intro.iconType === 'moon' ? (
            <img
              src={realisticMoonImg}
              alt="The Moon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-[1.08] rounded-full"
            />
          ) : (
            <img
              src={realisticMarsImg}
              alt="Planet Mars"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-[1.18] rounded-full"
            />
          )}
        </div>

        <span className={`text-[9px] sm:text-[10px] tracking-[0.24em] text-[#8B6B3C] font-bold uppercase ${isUrdu ? 'font-urdu text-xs' : ''}`}>
          {intro.chapterLabel}
        </span>

        <h2 className={`font-storybook text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#28231E] leading-tight mt-0.5 ${isUrdu ? 'font-urdu leading-relaxed' : ''}`}>
          {intro.title}
        </h2>

        <div className="w-12 h-[1px] bg-[#8B6B3C]/50 my-2" />

        {intro.subtitle && (
          <p className={`text-[10px] sm:text-[11px] text-[#5A4526]/85 italic font-storybook ${isUrdu ? 'font-urdu not-italic text-xs' : ''}`}>
            {intro.subtitle}
          </p>
        )}
      </div>

      {/* Archival NASA Mission Photographs of Both Equipments */}
      <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 my-auto pt-2">
        {intro.equipments.map((item) => (
          <button
            key={item.explorerId}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playMarkerClick();
              setSelectedPhoto(item);
            }}
            className={`group flex flex-col bg-[#FAF3E3] hover:bg-[#FFF9ED] border border-[#8B6B3C]/45 hover:border-[#CA8A04] rounded-xl p-1.5 sm:p-2 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none active:scale-[0.98] ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
            title={t.inspectPhotoTitle(item.name)}
          >
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#050C1A] border border-[#28231E]/15">
              <img
                src={item.photo}
                alt={item.photoCaption}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#06132D]/85 border border-[#E7B96A]/50 text-[9px] font-mono font-bold text-[#FFF1C5]">
                {item.number}
              </span>
              <span className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-[#06132D]/80 text-[#E7B96A] opacity-80 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" />
              </span>
            </div>

            <div className="pt-1.5 px-0.5">
              <div className={`font-storybook text-[11px] sm:text-xs font-extrabold text-[#28231E] leading-tight line-clamp-1 ${isUrdu ? 'font-urdu text-xs sm:text-sm' : ''}`}>
                {item.name}
              </div>
              <div className={`text-[9px] sm:text-[10px] font-semibold text-[#8B6B3C] leading-tight mt-0.5 line-clamp-1 ${isUrdu ? 'font-urdu' : ''}`}>
                {item.sourceLabel}
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className={`text-[9px] sm:text-[10px] text-[#5A4526]/75 font-medium tracking-wide uppercase pt-1 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
        {t.tapPhotoHint}
      </p>
    </div>
  );

  const renderExplorerSlotContent = (explorer: Explorer) => (
    <>
      <div dir={dir} className="w-full">
        <span className={`text-[10px] sm:text-xs tracking-[0.2em] text-[#8B6B3C] font-bold uppercase block mb-1 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
          {explorer.epithet}
        </span>
        <h2 className={`font-storybook text-lg sm:text-2xl md:text-3xl font-extrabold text-[#28231E] leading-tight ${isUrdu ? 'font-urdu' : ''}`}>
          {explorer.name}
        </h2>
        <p className={`font-storybook text-xs sm:text-sm text-[#28231E]/85 italic mt-1 line-clamp-2 px-1 ${isUrdu ? 'font-urdu not-italic leading-relaxed' : ''}`}>
          &ldquo;{explorer.shortIntro}&rdquo;
        </p>
      </div>

      <div
        onClick={() => handleSelectExplorer(explorer)}
        className="my-auto transition-all duration-300 flex flex-col items-center cursor-pointer hover:scale-105"
      >
        <ExplorerCharacter
          explorerId={explorer.id}
          size="page"
          isAnimated={true}
        />
      </div>

      <div className="transition-opacity duration-300">
        <button
          onClick={() => handleSelectExplorer(explorer)}
          className={`text-xs sm:text-sm font-bold tracking-widest text-[#102C57] hover:text-[#CA8A04] transition-colors py-1 cursor-pointer flex items-center gap-1 uppercase border-b-2 border-[#102C57]/40 hover:border-[#CA8A04] ${isUrdu ? 'font-urdu text-sm' : ''}`}
        >
          <span>{t.tapToMeetMe}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
        </button>
      </div>
    </>
  );

  const renderDesktopSlot = (slot: BookSlot | undefined) => {
    if (!slot) return null;
    if (slot.kind === 'intro' && slot.intro) {
      return renderChapterIntroContent(slot.intro);
    }
    if (slot.kind === 'explorer' && slot.explorer) {
      return renderExplorerSlotContent(slot.explorer);
    }
    return null;
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[92vh] w-full px-2 sm:px-4 py-2 select-none max-w-6xl mx-auto">
      
      {/* Top Header Row: Navigation & Historical Sources */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 z-20 flex-wrap gap-2">
        <button
          onClick={isTransformed ? handleBackToBook : onCloseToCover}
          className={`flex items-center gap-1.5 text-xs text-[#E7B96A] hover:text-[#FFF1C5] px-3 sm:px-3.5 py-1.5 rounded-lg border border-[#E7B96A]/30 bg-[#102C57]/50 hover:bg-[#102C57]/90 transition-all cursor-pointer shadow-md ${isUrdu ? 'font-urdu' : ''}`}
        >
          <Book className="w-3.5 h-3.5" />
          <span className="font-semibold">{isTransformed ? t.backToPage : t.closeBookCover}</span>
        </button>

        {/* Historical Sources (shifted left of floating top-right controls on small screens) */}
        <div className="flex items-center gap-2 mr-28 sm:mr-32 md:mr-36">
          <button
            onClick={onOpenSources}
            className={`flex items-center gap-1.5 text-xs text-[#F2E6CB]/80 hover:text-[#E7B96A] px-2.5 py-1.5 rounded-lg border border-[#E7B96A]/20 hover:border-[#E7B96A]/50 transition-colors cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nasaSources}</span>
          </button>
        </div>
      </div>

      {/* CUTE ROBOT GUIDE: Present while browsing book pages, hidden during character encounter for maximum focus */}
      {!isTransformed && (
        <RobotGuide
          currentSpreadIndex={activeRobotSpread}
          isTransformed={false}
          selectedExplorerName={isMobile ? currentMobileExplorer?.name : undefined}
          isMuted={isMuted}
        />
      )}

      {/* CENTRAL STAGE CONTAINER */}
      <div 
        style={{ perspective: isTransformed ? 'none' : '1400px' }}
        className={`relative w-full flex-1 flex flex-col items-center justify-center my-auto py-1 ${
          isDispatchFlashing ? 'animate-stage-boom' : ''
        }`}
      >
        {/* Full-screen & Stage Cosmic Flashhh Boom Overlay */}
        {isDispatchFlashing && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 animate-cosmic-flash" />
            <div className="w-64 h-64 rounded-full border-[#FFFFFF] shadow-[0_0_80px_rgba(56,189,248,0.95)] animate-boom-shockwave" />
          </div>
        )}
        {isTransformed && activeExplorer ? (
          /* ========================================================================= */
          /* CLEAN, PRISTINE CHARACTER ENCOUNTER VIEW (ZERO OVERLAP, CRYSTAL CLEAR)    */
          /* ========================================================================= */
          <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-1 overflow-y-auto max-h-[82vh] pr-2 pb-8 animate-[fadeIn_0.35s_ease-out] select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#E7B96A]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* 1. Mascot Character with soft starlight glow pedestal & badge */}
            <div className="flex flex-col items-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-[#00E5FF]/15 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="transform scale-90 sm:scale-105 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] z-10 transition-transform">
                <ExplorerCharacter
                  explorerId={activeExplorer.id}
                  size={isMobile ? 'page' : 'stage'}
                  isAnimated={true}
                  isSpeaking={isPlayingAudio}
                />
              </div>

              {/* Character Identity & Mission Badge */}
              <div dir={dir} className="mt-1 flex items-center gap-2 bg-[#061226]/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#E7B96A]/40 shadow-lg">
                <span className={`text-[11px] sm:text-xs font-bold text-[#E7B96A] tracking-wider uppercase font-cinzel ${isUrdu ? 'font-urdu text-xs sm:text-sm' : ''}`}>
                  {activeExplorer.name}
                </span>
                <span className="text-white/30">•</span>
                <span className={`text-[10px] text-[#94A3B8] font-medium tracking-wide uppercase ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  {activeExplorer.displayDestination || activeExplorer.destination} · {activeExplorer.activeYears}
                </span>
              </div>
            </div>

            {/* 2. Story Speech Parchment Card: High contrast, pristine typography */}
            <div className="w-full rounded-2xl bg-[#F4E8D0] text-[#28231E] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#E7B96A] relative z-20">
              {/* Header */}
              <div dir={dir} className="flex items-center justify-between gap-2 border-b border-[#28231E]/15 pb-2 mb-2.5 flex-wrap">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className={`text-xs sm:text-sm font-bold tracking-wider text-[#8B6B3C] uppercase font-cinzel ${isUrdu ? 'font-urdu text-sm' : ''}`}>
                    {activeExplorer.name} {t.speaksSuffix}
                  </span>
                  {activeMilestone && (
                    <span className={`text-[11px] font-semibold text-[#5A4526]/85 ${isUrdu ? 'font-urdu' : ''}`}>
                      · {activeMilestone.title} ({activeMilestone.date})
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold text-[#8B6B3C] bg-[#E8DCBF] px-2.5 py-0.5 rounded-full border border-[#D7C9A7] shrink-0 ${isUrdu ? 'font-urdu' : ''}`}>
                  {t.partOf(currentParaIdx + 1, activeExplorer.storyParagraphs.length)}
                </span>
              </div>

              {/* Story text */}
              <p
                dir={dir}
                className={`font-storybook text-sm sm:text-base text-[#28231E] min-h-[58px] ${
                  isUrdu ? 'font-urdu leading-[2.1] text-right text-base sm:text-lg' : 'leading-relaxed'
                }`}
              >
                &ldquo;{activeExplorer.storyParagraphs[currentParaIdx]}&rdquo;
              </p>

              {/* Audio Voice & Pagination Controls */}
              <div dir={dir} className="flex items-center justify-between pt-3 mt-3 border-t border-[#28231E]/15">
                <button
                  onClick={handleToggleAudio}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 ${
                    isPlayingAudio || isLoadingVoice
                      ? 'bg-[#E7B96A] text-[#102C57] ring-2 ring-[#102C57] animate-pulse'
                      : 'bg-[#102C57] text-[#FFF1C5] hover:bg-[#1B3B6F]'
                  } ${isUrdu ? 'font-urdu text-xs sm:text-sm' : ''}`}
                >
                  {isLoadingVoice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.loadingVoice}</span>
                    </>
                  ) : isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{t.pauseVoice}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{t.readToMe}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handlePrevParagraph}
                    disabled={currentParaIdx === 0}
                    className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#102C57] hover:bg-[#1B3B6F] border border-[#E7B96A] text-[#FFF1C5] font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:bg-[#E8DCBF] disabled:text-[#8B6B3C]/60 disabled:border-[#8B6B3C]/30 disabled:shadow-none disabled:cursor-not-allowed ${isUrdu ? 'font-urdu' : ''}`}
                    aria-label={t.prevPartAria}
                  >
                    {isUrdu ? (
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    )}
                    <span>{t.prev}</span>
                  </button>

                  <span dir="ltr" className="text-xs font-mono text-[#5A4526] font-bold bg-[#E8DCBF] px-2.5 py-1 rounded-full border border-[#8B6B3C]/30">
                    {currentParaIdx + 1} / {activeExplorer.storyParagraphs.length}
                  </span>

                  <button
                    onClick={handleNextParagraph}
                    disabled={currentParaIdx === activeExplorer.storyParagraphs.length - 1}
                    className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#102C57] hover:bg-[#1B3B6F] border border-[#E7B96A] text-[#FFF1C5] font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:bg-[#E8DCBF] disabled:text-[#8B6B3C]/60 disabled:border-[#8B6B3C]/30 disabled:shadow-none disabled:cursor-not-allowed ${isUrdu ? 'font-urdu' : ''}`}
                    aria-label={t.nextPartAria}
                  >
                    <span>{t.next}</span>
                    {isUrdu ? (
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Sleek Mission Milestones Timeline */}
            <div className="w-full rounded-2xl bg-[#061226]/90 backdrop-blur-md border border-[#38BDF8]/35 p-3 sm:p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)]">
              <div dir={dir} className="flex items-center justify-between mb-2 pb-1 border-b border-white/10 text-[10px] sm:text-[11px] tracking-widest text-[#E7B96A] font-bold uppercase">
                <span className={isUrdu ? 'font-urdu text-xs' : ''}>{t.missionMilestones} · {activeExplorer.name}</span>
                <span className={`text-[#38BDF8] font-mono text-[9px] sm:text-[10px] ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  {t.keyMoments(activeExplorer.timeline.length)}
                </span>
              </div>

              {/* Clean horizontal timeline stepper with dates and labels only */}
              <div className="relative py-1 sm:py-2">
                <div className="absolute top-3.5 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-[#102C57] via-[#38BDF8]/60 to-[#102C57]" />

                <div className="relative flex justify-between items-start z-10 px-0.5 gap-0.5 w-full">
                  {activeExplorer.timeline.map((m, idx) => {
                    const isSelected = selectedMilestoneId === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          soundFX.playMarkerClick();
                          setSelectedMilestoneId(m.id);
                          if (idx < activeExplorer.storyParagraphs.length) {
                            setCurrentParaIdx(idx);
                          }
                        }}
                        className="flex flex-col items-center group cursor-pointer focus:outline-none shrink-0 text-center max-w-[58px] sm:max-w-[100px] transition-transform active:scale-95"
                      >
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#00E5FF] border-white scale-110 shadow-[0_0_12px_#00E5FF]'
                              : 'bg-[#0B1E3B] border-[#38BDF8]/40 group-hover:border-[#00E5FF]'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-[#06132D]' : 'bg-[#E7B96A]'
                            }`}
                          />
                        </div>
                        <span className={`text-[7px] sm:text-[9px] font-mono text-[#38BDF8] mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
                          {m.date}
                        </span>
                        <span
                          className={`text-[8px] sm:text-[10px] font-bold tracking-wider leading-tight uppercase transition-colors ${
                            isSelected ? 'text-[#00E5FF]' : 'text-[#F5F8FF]/80 group-hover:text-white'
                          } ${isUrdu ? 'font-urdu text-[9px] sm:text-[11px]' : ''}`}
                        >
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3b. Mission Video Card (Opens & plays expanded inside the app) */}
            {activeExplorer.video && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playMarkerClick();
                  speechNarrator.stop();
                  setIsPlayingAudio(false);
                  setIsLoadingVoice(false);
                  setVideoError(false);
                  setVideoNeedsUnmute(false);
                  setSelectedVideo(activeExplorer.video!);
                }}
                dir={dir}
                className={`group w-full rounded-2xl bg-[#061226]/90 hover:bg-[#0B1E3B]/95 backdrop-blur-md border border-[#E7B96A]/45 hover:border-[#E7B96A] p-2.5 sm:p-3 shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center gap-3 sm:gap-4 transition-all cursor-pointer active:scale-[0.99] ${
                  isUrdu ? 'text-right' : 'text-left'
                }`}
                title={activeExplorer.video.title}
              >
                <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-[#030712] border border-[#E7B96A]/35 shrink-0">
                  <img
                    src={activeExplorer.video.poster}
                    alt={activeExplorer.video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-[#06132D]/85 border border-[#E7B96A] text-[#FFF1C5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-1 right-1 p-1 rounded-full bg-[#06132D]/80 text-[#E7B96A] opacity-85 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase text-[#E7B96A] block ${isUrdu ? 'font-urdu text-[11px]' : ''}`}>
                    {activeExplorer.video.subtitle}
                  </span>
                  <h4 className={`font-storybook text-xs sm:text-sm font-bold text-[#F5F8FF] leading-snug mt-0.5 line-clamp-1 ${isUrdu ? 'font-urdu text-sm' : ''}`}>
                    {activeExplorer.video.title}
                  </h4>
                  <span className={`text-[10px] sm:text-[11px] text-[#38BDF8] font-medium mt-1 inline-flex items-center gap-1 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                    {t.watchVideoPrompt}
                  </span>
                </div>
              </button>
            )}

            {/* 4. Action Bar: Radio Link & "BACK TO BOOK" Button */}
            <div dir={dir} className="w-full flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  handleBackToBook();
                  setTimeout(() => {
                    if (isMobile) {
                      handleJumpToMobilePage(LAST_MOBILE_PAGE_INDEX);
                    } else {
                      handleJumpToSpread(spreads.length - 1);
                    }
                  }, 350);
                }}
                className={`flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-[#7DD3FC] font-semibold transition-colors cursor-pointer px-2 ${isUrdu ? 'font-urdu' : ''}`}
              >
                <Radio className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="hidden sm:inline">{t.beamRadioDesktop}</span>
                <span className="sm:hidden">{t.beamRadioMobile}</span>
              </button>

              <button
                onClick={handleBackToBook}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#102C57] hover:bg-[#1B3B6F] border-2 border-[#E7B96A] text-[#FFF1C5] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${isUrdu ? 'font-urdu text-sm' : ''}`}
              >
                <ArrowLeft className={`w-4 h-4 text-[#E7B96A] ${isUrdu ? 'rotate-180' : ''}`} />
                <span>{t.backToBook}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* NORMAL BOOK VIEW (FLIPPABLE, SWIPEABLE, SINGLE/DOUBLE PAGE)               */
          /* ========================================================================= */
          <>
            {/* Subtle, elegant swipe hint above the book that fades out */}
            {showSwipeHint && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-500 animate-pulse">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#061226]/90 border border-[#E7B96A]/40 text-[#E7B96A] text-[11px] shadow-lg backdrop-blur-sm font-medium tracking-wide whitespace-nowrap ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  <span>✦</span>
                  <span>{t.swipeHint}</span>
                  <span>✦</span>
                </div>
              </div>
            )}

            {/* THE PHYSICAL BOOK CONTAINER */}
            <div
              style={{
                transform: isDragging
                  ? `rotateX(0deg) translateY(0px) rotateY(${dragOffset * 0.08}deg) scale(1)`
                  : 'rotateX(0deg) translateY(0px) translateZ(0px) scale(1)',
                transformOrigin: 'center 85%',
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`relative w-full ${
                isMobile ? 'max-w-md' : 'max-w-4xl'
              } rounded-2xl bg-[#091D3C] p-2 sm:p-3 border-2 border-[#E7B96A]/70 shadow-[0_25px_60px_rgba(0,0,0,0.95)] touch-pan-y ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Realistic Page Thickness Bottom Edges */}
              <div className="absolute -bottom-2.5 left-4 right-4 sm:left-6 sm:right-6 h-3 bg-[#D3C19C] rounded-b-md shadow-inner border-x border-b border-[#8C7350]/30 -z-10" />

              {/* MOBILE VIEWPORT (< 768px): SINGLE PAGE DISPLAY */}
              {isMobile ? (
                <div className={`w-full rounded-xl overflow-hidden shadow-2xl relative flex ${
                  currentMobilePage.type === 'sendMessage'
                    ? 'min-h-[420px] h-auto'
                    : 'h-[390px] sm:h-[430px]'
                }`}>
                  {/* LAST PAGE: SEND MESSAGE TO SPACE */}
                  {currentMobilePage.type === 'sendMessage' ? (
                    <div className="w-full flex-1 flex relative">
                      <DeepSpaceDispatchPage 
                        isMuted={isMuted} 
                        onBackToFleet={() => handleJumpToMobilePage(0)}
                        onDispatchFlash={triggerDispatchFlash}
                      />
                    </div>
                  ) : currentMobileIntro || currentMobileExplorer ? (
                    /* SINGLE PARCHMENT PAGE (CHAPTER INTRO OR EQUIPMENT) */
                    <div
                      className={`parchment-page ${
                        isUrdu ? 'parchment-left-page' : 'parchment-right-page'
                      } ${
                        currentMobileIntro?.id === 'moon-intro'
                          ? 'parchment-chapter-moon'
                          : currentMobileIntro?.id === 'mars-intro'
                          ? 'parchment-chapter-mars'
                          : ''
                      } w-full p-3 sm:p-5 flex flex-col justify-around items-center text-center relative rounded-xl h-[390px] sm:h-[430px]`}
                    >
                      {/* REALISTIC SPINAL GUTTER SHADOW (LEFT IN EN, RIGHT IN URDU RTL) */}
                      <div
                        className={`absolute ${
                          isUrdu
                            ? 'right-0 bg-gradient-to-l rounded-r-xl'
                            : 'left-0 bg-gradient-to-r rounded-l-xl'
                        } top-0 bottom-0 w-8 from-black/45 via-black/15 to-transparent pointer-events-none z-20`}
                      />
                      <div
                        className={`absolute ${
                          isUrdu ? 'right-2.5' : 'left-2.5'
                        } top-0 bottom-0 w-[1px] bg-[#604928]/40 pointer-events-none z-20`}
                      />

                      {/* Subtle Book Spine Thread Stitching */}
                      <div
                        className={`absolute ${
                          isUrdu ? 'right-1.5' : 'left-1.5'
                        } top-8 bottom-8 flex flex-col justify-between pointer-events-none z-20 opacity-60`}
                      >
                        <div className={`w-1.5 h-3 ${isUrdu ? 'border-l-2 rotate-12' : 'border-r-2 -rotate-12'} border-[#E7B96A]/60`} />
                        <div className={`w-1.5 h-3 ${isUrdu ? 'border-l-2 rotate-12' : 'border-r-2 -rotate-12'} border-[#E7B96A]/60`} />
                        <div className={`w-1.5 h-3 ${isUrdu ? 'border-l-2 rotate-12' : 'border-r-2 -rotate-12'} border-[#E7B96A]/60`} />
                        <div className={`w-1.5 h-3 ${isUrdu ? 'border-l-2 rotate-12' : 'border-r-2 -rotate-12'} border-[#E7B96A]/60`} />
                      </div>

                      {/* Bottom-Left Dog-Ear (PREV in EN, NEXT in Urdu RTL) */}
                      {(isUrdu ? canGoNextMobile : canGoPrevMobile) && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isUrdu) {
                              handleNextPage();
                            } else {
                              handlePrevPage();
                            }
                          }}
                          className="absolute bottom-0 left-0 w-12 h-12 cursor-pointer z-20 group"
                          title={isUrdu ? t.nextCornerTitle : t.prevCornerTitle}
                        >
                          <div
                            className={`absolute bottom-0 left-0 w-0 h-0 border-solid border-t-[32px] border-r-[32px] border-b-0 border-l-0 border-t-transparent ${
                              currentMobileIntro?.id === 'moon-intro' || currentMobileIntro?.id === 'mars-intro'
                                ? 'border-r-[#D6B499]'
                                : 'border-r-[#C5AF7E]'
                            } drop-shadow-md group-hover:scale-125 transition-transform origin-bottom-left`}
                          />
                          <div className="absolute bottom-1.5 left-1 text-[10px] text-[#5A4526] font-bold opacity-75 group-hover:opacity-100 flex items-center">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}

                      {/* Bottom-Right Dog-Ear (NEXT in EN, PREV in Urdu RTL) */}
                      {(isUrdu ? canGoPrevMobile : canGoNextMobile) && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isUrdu) {
                              handlePrevPage();
                            } else {
                              handleNextPage();
                            }
                          }}
                          className="absolute bottom-0 right-0 w-12 h-12 cursor-pointer z-20 group"
                          title={isUrdu ? t.prevCornerTitle : t.nextCornerTitle}
                        >
                          <div
                            className={`absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[32px] border-l-[32px] border-b-0 border-r-0 border-t-transparent ${
                              currentMobileIntro?.id === 'moon-intro' || currentMobileIntro?.id === 'mars-intro'
                                ? 'border-l-[#D6B499]'
                                : 'border-l-[#C5AF7E]'
                            } drop-shadow-md group-hover:scale-125 transition-transform origin-bottom-right`}
                          />
                          <div className="absolute bottom-1.5 right-1 text-[10px] text-[#5A4526] font-bold opacity-75 group-hover:opacity-100 flex items-center">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}

                      {currentMobileIntro ? (
                        renderChapterIntroContent(currentMobileIntro)
                      ) : currentMobileExplorer ? (
                        <>
                          {/* Top Header */}
                          <div dir={dir} className="w-full pt-1 px-4">
                            <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
                              <span className={`text-[9px] tracking-[0.2em] text-[#8B6B3C] font-bold uppercase block ${isUrdu ? 'font-urdu text-[11px]' : ''}`}>
                                {currentMobileExplorer.epithet}
                              </span>
                              <span className="text-[#8B6B3C]/50">•</span>
                              <span className={`text-[9px] font-semibold tracking-wider text-[#102C57] bg-[#E7B96A]/25 px-2 py-0.5 rounded-full ${isUrdu ? 'font-urdu text-[11px]' : ''}`}>
                                {currentMobileExplorer.displayDestination || currentMobileExplorer.destination}
                              </span>
                            </div>

                            <h2 className={`font-storybook text-2xl font-extrabold text-[#28231E] leading-tight ${isUrdu ? 'font-urdu' : ''}`}>
                              {currentMobileExplorer.name}
                            </h2>

                            <p className={`font-storybook text-xs sm:text-sm text-[#28231E]/85 italic mt-1 line-clamp-2 px-2 max-w-sm mx-auto ${isUrdu ? 'font-urdu not-italic leading-relaxed' : ''}`}>
                              &ldquo;{currentMobileExplorer.shortIntro}&rdquo;
                            </p>
                          </div>

                          {/* Character Illustration Slot */}
                          <div
                            onClick={() => handleSelectExplorer(currentMobileExplorer)}
                            className="my-auto py-2 transition-all duration-300 flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <ExplorerCharacter
                              explorerId={currentMobileExplorer.id}
                              size="page"
                              isAnimated={true}
                            />
                          </div>

                          {/* Bottom "TAP TO MEET ME" Prompt */}
                          <div className="transition-opacity duration-300 pb-1">
                            <button
                              onClick={() => handleSelectExplorer(currentMobileExplorer)}
                              className={`text-xs font-bold tracking-widest text-[#102C57] hover:text-[#CA8A04] transition-colors py-2 px-5 rounded-full bg-[#102C57]/10 hover:bg-[#102C57]/20 border border-[#102C57]/30 flex items-center gap-1.5 uppercase shadow-sm cursor-pointer active:scale-95 ${isUrdu ? 'font-urdu text-sm' : ''}`}
                            >
                              <span>{t.tapToMeetMe}</span>
                              <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : null}

                  {/* 3D Mobile Visible Page Flip Leaf */}
                  {isFlipping && (
                    <div
                      className={`absolute inset-0 z-30 pointer-events-none ${
                        isUrdu
                          ? flipDirection === 'next'
                            ? 'animate-flip-mobile-rtl-next'
                            : 'animate-flip-mobile-rtl-prev'
                          : flipDirection === 'next'
                          ? 'animate-flip-mobile-next'
                          : 'animate-flip-mobile-prev'
                      }`}
                      style={{
                        transformOrigin: isUrdu ? 'right center' : 'left center',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div
                        className={`absolute inset-0 parchment-page ${
                          isUrdu ? 'parchment-left-page' : 'parchment-right-page'
                        } p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl rounded-xl`}
                      >
                        <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                          <Sparkles className="w-8 h-8 text-[#CA8A04]" />
                        </div>
                        <div className="w-3/4 h-2.5 bg-[#8C7350]/20 rounded mb-2" />
                        <div className="w-1/2 h-2.5 bg-[#8C7350]/20 rounded" />
                      </div>
                      <div
                        className={`absolute inset-0 parchment-page ${
                          isUrdu ? 'parchment-left-page' : 'parchment-right-page'
                        } p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl rounded-xl`}
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                          <BookOpen className="w-8 h-8 text-[#CA8A04]" />
                        </div>
                        <div className="w-3/4 h-2.5 bg-[#8C7350]/20 rounded mb-2" />
                        <div className="w-1/2 h-2.5 bg-[#8C7350]/20 rounded" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* DESKTOP VIEWPORT (>= 768px): TWO PARCHMENT PAGES */
                <div
                  className={`flex ${
                    isUrdu ? 'flex-row-reverse' : 'flex-row'
                  } w-full rounded-xl overflow-hidden shadow-2xl relative min-h-[430px] sm:min-h-[470px] ${
                    currentSpread.type === 'sendMessage' ? 'md:min-h-[470px]' : 'md:h-[470px]'
                  }`}
                >
                  {/* Central Spine */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-r from-black/25 via-black/45 to-black/25" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#5A4526]/50" />
                  </div>

                  {/* Last Spread: Send Message to Space */}
                  {currentSpread.type === 'sendMessage' ? (
                    <DeepSpaceDispatchPage 
                      isMuted={isMuted} 
                      onBackToFleet={() => handleJumpToSpread(0)}
                      onDispatchFlash={triggerDispatchFlash}
                    />
                  ) : currentSpread.leftSlot && currentSpread.rightSlot ? (
                    <>
                      {/* First Page of Spread (Left in LTR, Right in Urdu RTL) */}
                      <div
                        className={`parchment-page ${
                          isUrdu ? 'parchment-right-page' : 'parchment-left-page border-r border-[#D4C3A3]'
                        } ${
                          currentSpread.leftSlot.intro?.id === 'moon-intro'
                            ? 'parchment-chapter-moon'
                            : currentSpread.leftSlot.intro?.id === 'mars-intro'
                            ? 'parchment-chapter-mars'
                            : ''
                        } w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-around items-center text-center relative`}
                      >
                        {canGoPrevDesktop && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevPage();
                            }}
                            className={`absolute bottom-0 ${isUrdu ? 'right-0' : 'left-0'} w-11 h-11 cursor-pointer z-20 group`}
                            title={t.prevCornerTitle}
                          >
                            <div
                              className={`absolute bottom-0 ${
                                isUrdu
                                  ? 'right-0 border-l-[28px] border-r-0 origin-bottom-right'
                                  : 'left-0 border-r-[28px] border-l-0 origin-bottom-left'
                              } w-0 h-0 border-solid border-t-[28px] border-b-0 border-t-transparent ${
                                currentSpread.leftSlot.intro?.id === 'moon-intro' || currentSpread.leftSlot.intro?.id === 'mars-intro'
                                  ? isUrdu
                                    ? 'border-l-[#D6B499]'
                                    : 'border-r-[#D6B499]'
                                  : isUrdu
                                  ? 'border-l-[#C5AF7E]'
                                  : 'border-r-[#C5AF7E]'
                              } drop-shadow-sm group-hover:scale-125 transition-transform`}
                            />
                            <div
                              className={`absolute bottom-1 ${
                                isUrdu ? 'right-1' : 'left-1'
                              } text-[10px] text-[#5A4526] font-bold opacity-60 group-hover:opacity-100 flex items-center`}
                            >
                              {isUrdu ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                            </div>
                          </div>
                        )}

                        {renderDesktopSlot(currentSpread.leftSlot)}
                      </div>

                      {/* Second Page of Spread (Right in LTR, Left in Urdu RTL) */}
                      <div
                        className={`parchment-page ${
                          isUrdu ? 'parchment-left-page border-r border-[#D4C3A3]' : 'parchment-right-page'
                        } ${
                          currentSpread.rightSlot.intro?.id === 'moon-intro'
                            ? 'parchment-chapter-moon'
                            : currentSpread.rightSlot.intro?.id === 'mars-intro'
                            ? 'parchment-chapter-mars'
                            : ''
                        } w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-around items-center text-center relative`}
                      >
                        {canGoNextDesktop && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextPage();
                            }}
                            className={`absolute bottom-0 ${isUrdu ? 'left-0' : 'right-0'} w-11 h-11 cursor-pointer z-20 group`}
                            title={t.nextCornerTitle}
                          >
                            <div
                              className={`absolute bottom-0 ${
                                isUrdu
                                  ? 'left-0 border-r-[28px] border-l-0 origin-bottom-left'
                                  : 'right-0 border-l-[28px] border-r-0 origin-bottom-right'
                              } w-0 h-0 border-solid border-t-[28px] border-b-0 border-t-transparent ${
                                currentSpread.rightSlot.intro?.id === 'moon-intro' || currentSpread.rightSlot.intro?.id === 'mars-intro'
                                  ? isUrdu
                                    ? 'border-r-[#D6B499]'
                                    : 'border-l-[#D6B499]'
                                  : isUrdu
                                  ? 'border-r-[#C5AF7E]'
                                  : 'border-l-[#C5AF7E]'
                              } drop-shadow-sm group-hover:scale-125 transition-transform`}
                            />
                            <div
                              className={`absolute bottom-1 ${
                                isUrdu ? 'left-1' : 'right-1'
                              } text-[10px] text-[#5A4526] font-bold opacity-60 group-hover:opacity-100 flex items-center`}
                            >
                              {isUrdu ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </div>
                          </div>
                        )}

                        {renderDesktopSlot(currentSpread.rightSlot)}
                      </div>
                    </>
                  ) : null}

                  {/* 3D VISIBLE PAGE FLIPPING LEAF (TURNING FROM RIGHT-TO-LEFT IN LTR / LEFT-TO-RIGHT IN URDU) */}
                  {isFlipping && ((isUrdu && flipDirection === 'prev') || (!isUrdu && flipDirection === 'next')) && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none z-30 animate-shadow-sweep" />
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1/2 z-30 pointer-events-none animate-flip-next"
                        style={{
                          transformOrigin: 'left center',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="absolute inset-0 parchment-page parchment-right-page border-l border-[#8C7350]/50 p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl">
                          <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                            <Sparkles className="w-8 h-8 text-[#CA8A04]" />
                          </div>
                          <div className="w-3/4 h-2 bg-[#8C7350]/20 rounded mb-2" />
                          <div className="w-1/2 h-2 bg-[#8C7350]/20 rounded" />
                        </div>
                        <div
                          className="absolute inset-0 parchment-page parchment-left-page border-r border-[#8C7350]/50 p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl"
                          style={{ transform: 'rotateY(180deg)' }}
                        >
                          <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                            <BookOpen className="w-8 h-8 text-[#CA8A04]" />
                          </div>
                          <div className="w-3/4 h-2 bg-[#8C7350]/20 rounded mb-2" />
                          <div className="w-1/2 h-2 bg-[#8C7350]/20 rounded" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3D VISIBLE PAGE FLIPPING LEAF (TURNING FROM LEFT-TO-RIGHT IN URDU NEXT / LTR PREV) */}
                  {isFlipping && ((isUrdu && flipDirection === 'next') || (!isUrdu && flipDirection === 'prev')) && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/40 pointer-events-none z-30 animate-shadow-sweep" />
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1/2 z-30 pointer-events-none animate-flip-prev"
                        style={{
                          transformOrigin: 'right center',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="absolute inset-0 parchment-page parchment-left-page border-r border-[#8C7350]/50 p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl">
                          <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                            <BookOpen className="w-8 h-8 text-[#CA8A04]" />
                          </div>
                          <div className="w-3/4 h-2 bg-[#8C7350]/20 rounded mb-2" />
                          <div className="w-1/2 h-2 bg-[#8C7350]/20 rounded" />
                        </div>
                        <div
                          className="absolute inset-0 parchment-page parchment-right-page border-l border-[#8C7350]/50 p-6 flex flex-col justify-center items-center opacity-95 backface-hidden shadow-2xl"
                          style={{ transform: 'rotateY(180deg)' }}
                        >
                          <div className="w-16 h-16 rounded-full bg-[#102C57]/10 flex items-center justify-center mb-3">
                            <Sparkles className="w-8 h-8 text-[#CA8A04]" />
                          </div>
                          <div className="w-3/4 h-2 bg-[#8C7350]/20 rounded mb-2" />
                          <div className="w-1/2 h-2 bg-[#8C7350]/20 rounded" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* LAYER 4: BOTTOM MINIMALIST NAVIGATION (WHEN BROWSING BOOK)*/}
      {/* ======================================================== */}
      {!isTransformed && (
        <div className="w-full max-w-xl flex items-center justify-center mt-3 px-2 z-20">
          {isMobile ? (
            /* MOBILE PAGINATION: 7 Clean Pages */
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div dir={dir} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#061226]/85 backdrop-blur-md border border-[#E7B96A]/30 shadow-lg max-w-full overflow-x-auto">
                {mobilePages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToMobilePage(idx)}
                    disabled={isFlipping}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none shrink-0 ${
                      idx === mobilePageIndex
                        ? 'w-6 h-2 bg-gradient-to-r from-[#E7B96A] to-[#F5D78E] shadow-[0_0_10px_rgba(231,185,106,0.6)]'
                        : 'w-2 h-2 bg-[#E7B96A]/30 hover:bg-[#E7B96A]/75'
                    }`}
                    title={
                      page.type === 'sendMessage'
                        ? `${t.pageOf(idx + 1, TOTAL_MOBILE_PAGES)}: ${t.deepSpaceNetwork}`
                        : page.type === 'intro'
                        ? `${t.pageOf(idx + 1, TOTAL_MOBILE_PAGES)}: ${page.intro?.title}`
                        : `${t.pageOf(idx + 1, TOTAL_MOBILE_PAGES)}: ${page.explorer?.name}`
                    }
                    aria-label={t.pageOf(idx + 1, TOTAL_MOBILE_PAGES)}
                  />
                ))}
              </div>

              <div dir={dir} className={`text-[11px] text-[#E7B96A]/80 font-storybook tracking-wider flex items-center gap-1.5 text-center px-2 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                {currentMobilePage.type === 'sendMessage' ? (
                  <span className="text-[#00E5FF] font-semibold">
                    {t.pageOf(TOTAL_MOBILE_PAGES, TOTAL_MOBILE_PAGES)} · {t.deepSpaceNetwork}
                  </span>
                ) : (
                  <span>
                    {t.pageOf(mobilePageIndex + 1, TOTAL_MOBILE_PAGES)} ·{' '}
                    <span className="font-bold text-[#FFF1C5]">
                      {currentMobilePage.type === 'intro' ? currentMobilePage.intro?.title : currentMobilePage.explorer?.name}
                    </span>
                  </span>
                )}
                <span className="text-white/20">•</span>
                <span className={`text-[#94A3B8] font-sans text-[10px] uppercase tracking-widest ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  {t.swipeToFlip}
                </span>
              </div>
            </div>
          ) : (
            /* DESKTOP PAGINATION: 4 Spreads */
            <div className="flex flex-col items-center gap-1.5">
              <div dir={dir} className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#061226]/85 backdrop-blur-md border border-[#E7B96A]/30 shadow-lg">
                {spreads.map((spread, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToSpread(idx)}
                    disabled={isFlipping}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                      idx === currentSpreadIndex
                        ? 'w-7 h-2 bg-gradient-to-r from-[#E7B96A] to-[#F5D78E] shadow-[0_0_10px_rgba(231,185,106,0.6)]'
                        : 'w-2 h-2 bg-[#E7B96A]/30 hover:bg-[#E7B96A]/75 hover:scale-125'
                    }`}
                    title={spread.type === 'sendMessage' ? `${t.spreadLabel(idx + 1)}: ${t.deepSpaceNetwork}` : t.spreadLabel(idx + 1)}
                    aria-label={t.spreadLabel(idx + 1)}
                  />
                ))}
              </div>

              <div dir={dir} className={`text-[11px] text-[#E7B96A]/80 font-storybook tracking-wider flex items-center gap-2 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                {currentSpread.type === 'sendMessage' ? (
                  <span className="text-[#00E5FF] font-semibold">
                    {t.spreadLabel(spreads.length)} · {t.deepSpaceNetwork}
                  </span>
                ) : (
                  <span>{t.spreadOf(currentSpreadIndex + 1, spreads.length)}</span>
                )}
                <span className="text-white/20">•</span>
                <span className={`text-[#94A3B8] font-sans text-[10px] uppercase tracking-widest flex items-center gap-1 ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  <span>{t.swipePageToFlip}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NASA ARCHIVE PHOTO INSPECTION LIGHTBOX */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.name}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={dir}
            className="relative w-full max-w-xl rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] text-[#F5F8FF] shadow-[0_25px_65px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7B96A]/30 bg-[#102C57]/60">
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest text-[#E7B96A] block ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  {t.equipmentPrefix(selectedPhoto.number, selectedPhoto.role)}
                </span>
                <h3 className={`font-cinzel text-sm sm:text-base font-bold text-[#FFF1C5] ${isUrdu ? 'font-urdu text-base' : ''}`}>
                  {selectedPhoto.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg text-[#F2E6CB]/70 hover:text-[#FFF1C5] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={t.closePhotoPreview}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#030712] flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedPhoto.photo}
                alt={selectedPhoto.photoCaption}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>

            <div className="p-4 space-y-3 bg-[#091D3C]/90">
              <p className={`text-xs sm:text-sm text-[#F2E6CB]/90 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                {selectedPhoto.photoCaption}
              </p>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                <span className={`text-[11px] font-semibold text-[#93C5FD] ${isUrdu ? 'font-urdu' : ''}`}>
                  {t.sourceLabel(selectedPhoto.sourceLabel)}
                </span>
                <a
                  href={selectedPhoto.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A8A]/70 hover:bg-[#2563EB] text-[#F5F8FF] text-xs font-semibold border border-[#E7B96A]/40 hover:border-[#E7B96A] transition-colors ${isUrdu ? 'font-urdu' : ''}`}
                >
                  <span>{t.openNasaArchive}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E7B96A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MISSION VIDEO LIGHTBOX PLAYER */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={dir}
            className="relative w-full max-w-2xl rounded-2xl bg-[#06132D] border-2 border-[#E7B96A] text-[#F5F8FF] shadow-[0_25px_65px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7B96A]/30 bg-[#102C57]/60">
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest text-[#E7B96A] block ${isUrdu ? 'font-urdu text-xs' : ''}`}>
                  {selectedVideo.subtitle}
                </span>
                <h3 className={`font-cinzel text-sm sm:text-base font-bold text-[#FFF1C5] ${isUrdu ? 'font-urdu text-base' : ''}`}>
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-[#F2E6CB]/70 hover:text-[#FFF1C5] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={t.closeVideoPlayer}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#030712] relative flex items-center justify-center w-full aspect-video max-h-[65vh] overflow-hidden">
              {videoError ? (
                <div className="p-6 text-center space-y-3">
                  <p className={`text-sm text-[#F2E6CB]/90 ${isUrdu ? 'font-urdu' : ''}`}>
                    {t.videoLoadError}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoError(false);
                      videoRef.current?.load();
                      videoRef.current?.play().catch(() => {});
                    }}
                    className={`px-4 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] border border-[#E7B96A]/50 text-xs font-semibold text-[#FFF1C5] cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
                  >
                    {t.retryPlayback}
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    key={selectedVideo.url}
                    src={selectedVideo.url}
                    poster={selectedVideo.poster}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    muted={isMuted || videoNeedsUnmute}
                    onError={() => setVideoError(true)}
                    className="w-full h-full max-h-[65vh] object-contain"
                  />
                  {videoNeedsUnmute && !isMuted && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoNeedsUnmute(false);
                        if (videoRef.current) {
                          videoRef.current.muted = false;
                          videoRef.current.play().catch(() => {});
                        }
                      }}
                      className={`absolute top-3 right-3 px-3 py-1.5 rounded-full bg-[#06132D]/90 hover:bg-[#102C57] border border-[#E7B96A] text-[#FFF1C5] text-xs font-bold shadow-lg cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
                    >
                      {t.tapForSound}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="p-4 bg-[#091D3C]/90">
              <p className={`text-xs sm:text-sm text-[#F2E6CB]/90 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                {selectedVideo.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
