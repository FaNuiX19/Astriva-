import type { Language } from './LanguageContext';

export interface Translations {
  app: {
    muteTooltip: string;
    unmuteTooltip: string;
    muteAria: string;
    unmuteAria: string;
    switchLanguageLabel: string;
  };
  cover: {
    openBookAria: string;
    coverAlt: string;
    openBookButton: string;
    coverTitle: string;
    coverSubtitle: string;
    coverTagline: string;
  };
  robotGuide: {
    avatarTitle: string;
    avatarAria: string;
    stopVoice: string;
    readAloud: string;
    loadingVoice: string;
    nextFact: string;
    coverMessages: string[];
    stageMessages: string[];
    guideMessages: Record<number, string[]>;
  };
  book: {
    backToPage: string;
    closeBookCover: string;
    nasaSources: string;
    swipeHint: string;
    tapPhotoHint: string;
    inspectPhotoTitle: (name: string) => string;
    tapToMeetMe: string;
    speaksSuffix: string;
    partOf: (current: number, total: number) => string;
    pauseVoice: string;
    readToMe: string;
    loadingVoice: string;
    prev: string;
    next: string;
    prevPartAria: string;
    nextPartAria: string;
    missionMilestones: string;
    keyMoments: (count: number) => string;
    watchVideoPrompt: string;
    beamRadioDesktop: string;
    beamRadioMobile: string;
    backToBook: string;
    pageOf: (current: number, total: number) => string;
    spreadOf: (current: number, total: number) => string;
    spreadLabel: (num: number) => string;
    deepSpaceNetwork: string;
    swipeToFlip: string;
    swipePageToFlip: string;
    equipmentPrefix: (num: string, role: string) => string;
    sourceLabel: (label: string) => string;
    openNasaArchive: string;
    closePhotoPreview: string;
    closeVideoPlayer: string;
    videoLoadError: string;
    retryPlayback: string;
    tapForSound: string;
    prevCornerTitle: string;
    nextCornerTitle: string;
  };
  dispatch: {
    backToFleet: string;
    brandTitle: string;
    brandSubtitle: string;
    heading: string;
    subheading: string;
    selectTarget: string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    ideaHint: string;
    presetIdeas: string[];
    transmittingTo: (name: string) => string;
    launchMessage: string;
    beamingPhotons: string;
    photonsSpeedNote: string;
    earthDsnLabel: string;
    spaceMailLine1: string;
    spaceMailLine2: string;
    sentByExplorer: string;
    defaultExplorerName: string;
    messageBeamed: string;
    targetDestination: string;
    voyageType: string;
    speed: string;
    speedValue: string;
    time: string;
    missionId: string;
    travelLine1: string;
    travelLine2: string;
    sendAnother: string;
    voyageTypes: {
      rover: string;
      lander: string;
      telescope: string;
      instrument: string;
    };
    distances: {
      moon: string;
      mars: string;
      kepler: string;
    };
    travelTimes: {
      moon: string;
      mars: string;
      kepler: string;
    };
  };
  sourcesModal: {
    title: string;
    subtitle: string;
    closeAria: string;
    aboutTitle: string;
    aboutText: string;
    archivesTitle: string;
    nasaPage: string;
    closeButton: string;
  };
  robotAssistant: {
    welcomeText: string;
    justNow: string;
    now: string;
    subtitle: string;
    deepSpace: string;
    stopAudio: string;
    readOutLoud: string;
    telemetryLabel: string;
    loadingText: string;
    suggestedQuestionsLabel: string;
    presetQuestions: string[];
    inputPlaceholder: string;
    askButton: string;
    fallbackReply: string;
  };
  sendModal: {
    title: string;
    badge: string;
    subtitle: string;
    targetDestination: string;
    signalDistance: string;
    lightTravelTime: string;
    chooseRecipient: string;
    yourCallsign: string;
    callsignPlaceholder: string;
    yourTransmission: string;
    messagePlaceholder: string;
    pickTemplate: string;
    presetMessages: string[];
    beamButton: (name: string) => string;
    beamingTitle: string;
    beamingSubtitle: string;
    carrierInfo: (name: string) => string;
    replyDownlinked: string;
    yourMessage: string;
    responds: (name: string) => string;
    stopVoice: string;
    playTransmission: string;
    sendAnother: string;
    sessionLog: (count: number) => string;
    toLabel: (name: string) => string;
    defaultSender: string;
    defaultReply: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    app: {
      muteTooltip: 'Mute audio & sound effects',
      unmuteTooltip: 'Unmute audio & sound effects',
      muteAria: 'Mute sounds',
      unmuteAria: 'Unmute sounds',
      switchLanguageLabel: 'Switch language',
    },
    cover: {
      openBookAria: 'Open the Astriva storybook',
      coverAlt: 'Astriva — Not all worlds are found. Some are written. Every explorer has a story.',
      openBookButton: 'OPEN THE BOOK',
      coverTitle: 'ASTRIVA',
      coverSubtitle: 'Not all worlds are found.\nSome are written.',
      coverTagline: 'Every explorer has a story.',
    },
    robotGuide: {
      avatarTitle: 'Click to hear another cool space fact!',
      avatarAria: 'Robot space guide',
      stopVoice: 'Stop Voice',
      readAloud: 'Read aloud',
      loadingVoice: 'Loading voice...',
      nextFact: 'Next fact',
      coverMessages: [
        "Welcome to Astriva! I'm A.S.T.R.O., your space guide. Open the book below to meet the real NASA robotic explorers of the Moon and Mars!",
        'Inside these pages, Apollo 12 ALSEP, Surveyor 3, Sojourner, and the Kepler Space Telescope come alive to share their true adventures.',
        "Ready for liftoff? Tap the book cover or click 'Open the Book' to start exploring—and send a Space Mail on the last page!",
      ],
      stageMessages: [
        "Look! The explorer has climbed right out of the storybook! Tap 'Read to Me' to hear it speak to you.",
        'Every robotic part you see here is based on real NASA schematics and true history.',
        'Check out the mission timeline below the book to see the biggest milestones in space exploration!',
      ],
      guideMessages: {
        0: [
          "Welcome to Equipments on Moon! Here you'll meet NASA's Surveyor Landers and ALSEP Scientific Packages.",
          'Surveyor 3 bounced twice into a 200-meter lunar crater in 1967 and dug four soil trenches to prove the Moon could hold Apollo astronauts!',
          'In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean walked right down to Surveyor 3 and brought its TV camera home to Earth.',
        ],
        1: [
          "Apollo 12's Lunar Module Intrepid (1969-099C) carried the ALSEP science suite to Oceanus Procellarum, powered by a SNAP-27 nuclear generator.",
          "When Intrepid's ascent stage crashed back into the Moon on November 20, 1969, the ALSEP seismometer recorded vibrations for nearly an hour!",
          'Turn the page for Equipments on Mars—featuring Sojourner Landers and the Kepler Space Telescope!',
        ],
        2: [
          'In 1997, Mars Pathfinder landed inside giant airbags in Ares Vallis, and Sojourner became the first wheeled rover ever to drive on Mars!',
          'Designed for just 7 days on Mars, Sojourner and the Pathfinder lander explored together for 83 Martian days!',
          'Kepler launched in 2009 and confirmed over 2,600 exoplanets—proving our galaxy holds more planets than stars!',
        ],
        3: [
          'Welcome to the Deep Space Network page! From here, you can beam a Space Mail Pass to any of our four historic NASA explorers.',
          'Radio waves travel at 299,792 km/s! Signals reach the Moon in 1.28 seconds, Kepler in ~8.4 minutes, and Mars in ~12.5 minutes.',
          'Write a message for ALSEP, Surveyor 3, Sojourner, or Kepler and launch your custom Space Mail Pass!',
        ],
      },
    },
    book: {
      backToPage: 'Back to Page',
      closeBookCover: 'Close Book Cover',
      nasaSources: 'NASA Sources',
      swipeHint: 'Swipe or tap corner to flip',
      tapPhotoHint: 'Tap a NASA photo to inspect archive details',
      inspectPhotoTitle: (name: string) => `Inspect official NASA photo of ${name}`,
      tapToMeetMe: 'TAP TO MEET ME',
      speaksSuffix: 'SPEAKS',
      partOf: (current: number, total: number) => `Part ${current} of ${total}`,
      pauseVoice: 'PAUSE VOICE',
      readToMe: 'READ TO ME',
      loadingVoice: 'LOADING VOICE...',
      prev: 'Prev',
      next: 'Next',
      prevPartAria: 'Previous story part',
      nextPartAria: 'Next story part',
      missionMilestones: 'MISSION MILESTONES',
      keyMoments: (count: number) => `${count} Key Moments`,
      watchVideoPrompt: 'Tap to expand & watch mission video',
      beamRadioDesktop: 'Beam Radio Message in Chapter V',
      beamRadioMobile: 'Send Radio',
      backToBook: 'BACK TO BOOK',
      pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
      spreadOf: (current: number, total: number) => `Spread ${current} of ${total}`,
      spreadLabel: (num: number) => `Spread ${num}`,
      deepSpaceNetwork: 'Deep Space Network',
      swipeToFlip: 'Swipe to flip',
      swipePageToFlip: 'Swipe page to flip',
      equipmentPrefix: (num: string, role: string) => `Equipment ${num} · ${role}`,
      sourceLabel: (label: string) => `Source: ${label}`,
      openNasaArchive: 'Open NASA Archive',
      closePhotoPreview: 'Close photo preview',
      closeVideoPlayer: 'Close video player',
      videoLoadError: 'Unable to load the video stream right now.',
      retryPlayback: 'Retry Playback',
      tapForSound: 'Tap for Sound',
      prevCornerTitle: 'Swipe right or click corner to turn previous page',
      nextCornerTitle: 'Swipe left or click corner to turn next page',
    },
    dispatch: {
      backToFleet: 'Back to Fleet',
      brandTitle: 'ASTRIVA',
      brandSubtitle: 'A Story Beyond the Stars',
      heading: 'Send a message to space',
      subheading: "You've heard their stories. Now it's your turn.",
      selectTarget: 'Select Explorer Target:',
      nameLabel: 'Name:',
      namePlaceholder: 'Enter your name...',
      messageLabel: 'My Message:',
      messagePlaceholder: 'Type your message...',
      ideaHint: 'Tap an idea below or write your own:',
      presetIdeas: ['Thank you for exploring space!', 'Greetings from Earth!'],
      transmittingTo: (name: string) => `Transmitting to ${name}...`,
      launchMessage: 'Launch Message',
      beamingPhotons: 'Beaming radio photons at 299,792 km/s...',
      photonsSpeedNote: 'Radio photons transmit at the speed of light',
      earthDsnLabel: 'EARTH DSN',
      spaceMailLine1: 'SPACE MAIL',
      spaceMailLine2: 'PASS',
      sentByExplorer: 'SENT BY EXPLORER',
      defaultExplorerName: 'Space Explorer',
      messageBeamed: 'MESSAGE BEAMED',
      targetDestination: 'TARGET DESTINATION',
      voyageType: 'VOYAGE TYPE',
      speed: 'SPEED',
      speedValue: '299,792 km/s',
      time: 'TIME',
      missionId: 'MISSION ID',
      travelLine1: 'TRAVEL',
      travelLine2: 'BEYOND LIMITS',
      sendAnother: 'Send Another Space Mail',
      voyageTypes: {
        rover: 'Planetary Survey',
        lander: 'Lunar Lander',
        telescope: 'Exoplanet Survey',
        instrument: 'Lunar Observatory',
      },
      distances: {
        moon: '384,400 km from Earth',
        mars: '225 million km from Earth',
        kepler: '~151 million km from Earth',
      },
      travelTimes: {
        moon: '1.28 seconds',
        mars: '12 mins 30 secs',
        kepler: '8 mins 24 secs',
      },
    },
    sourcesModal: {
      title: 'NASA & JPL Scientific Sources',
      subtitle: 'Verified mission records for the NASA Space Apps Challenge',
      closeAria: 'Close sources dialog',
      aboutTitle: 'About Astriva',
      aboutText:
        'These four pioneering NASA robotic missions were designed for one-way scientific journeys across the Moon, Mars, and solar orbit. Having completed or far exceeded their mission goals, their spacecraft and instruments remain preserved across the cosmos as monuments of human curiosity.',
      archivesTitle: 'Official NASA Mission Archives',
      nasaPage: 'NASA Page',
      closeButton: 'Close',
    },
    robotAssistant: {
      welcomeText:
        "Beep-boop! Hello Earthling! I'm A.S.T.R.O., your Astriva robot assistant. Ask me anything about Apollo 12 ALSEP, Surveyor 3, Sojourner, or the Kepler Space Telescope!",
      justNow: 'Just now',
      now: 'Now',
      subtitle: 'Robotic telemetry & explorer guide',
      deepSpace: 'Deep Space',
      stopAudio: 'Stop Audio',
      readOutLoud: 'Read Out Loud',
      telemetryLabel: 'NASA Telemetry',
      loadingText: 'A.S.T.R.O. is querying deep space telemetry...',
      suggestedQuestionsLabel: 'Suggested Questions:',
      presetQuestions: [
        'Why are equipments left on the Moon and Mars?',
        'What did Apollo 12 ALSEP measure on the Moon?',
        'How did Apollo 12 astronauts visit Surveyor 3?',
        'What made Sojourner special on Mars?',
        'How did Kepler find over 2,600 exoplanets?',
      ],
      inputPlaceholder: 'Ask A.S.T.R.O. about Mars, rovers, the Moon...',
      askButton: 'Ask',
      fallbackReply:
        'Beep-boop! Radio telemetry confirmed! From ALSEP and Surveyor 3 on the Moon to Sojourner on Mars and Kepler in solar orbit, these four NASA missions transformed space science!',
    },
    sendModal: {
      title: 'SEND MESSAGE TO SPACE',
      badge: 'DEEP SPACE NETWORK',
      subtitle: 'Beam an interplanetary radio signal across Astriva',
      targetDestination: 'Target Destination',
      signalDistance: 'Signal Distance',
      lightTravelTime: 'Light-Travel Time',
      chooseRecipient: '1. Choose Your Recipient Explorer:',
      yourCallsign: '2. Your Callsign / Earth Name:',
      callsignPlaceholder: 'e.g. Cadet Sarah, Astro-Alex, Classroom 4B...',
      yourTransmission: '3. Your Interplanetary Transmission:',
      messagePlaceholder: 'Write a message to beam to the Moon, Mars, or Kepler...',
      pickTemplate: 'Or pick a transmission template:',
      presetMessages: [
        'Thank you for monitoring moonquakes from Oceanus Procellarum for eight years!',
        'Thank you Surveyor 3 for testing lunar soil before Apollo astronauts arrived!',
        'Sojourner, you were the first rover on Mars and inspired an entire generation!',
        'Kepler, thank you for showing us more planets than stars in our galaxy!',
        'Beep-boop! Sending warm greetings from Earth schoolchildren!',
      ],
      beamButton: (name: string) => `BEAM TRANSMISSION TO ${name.toUpperCase()}`,
      beamingTitle: 'BEAMING SIGNAL ACROSS THE SOLAR SYSTEM...',
      beamingSubtitle: 'Uplinking via NASA Deep Space Network 70-Meter Parabolic Antenna',
      carrierInfo: (name: string) => `Carrier: 8.4 GHz · Photon velocity: 299,792 km/s · Target: ${name}`,
      replyDownlinked: 'Interplanetary Reply Downlinked',
      yourMessage: 'Your Message:',
      responds: (name: string) => `${name} Responds:`,
      stopVoice: 'Stop Voice',
      playTransmission: 'Play Radio Transmission',
      sendAnother: 'Send Another',
      sessionLog: (count: number) => `Session Radio Log (${count} Beamed Transmissions):`,
      toLabel: (name: string) => `To: ${name}`,
      defaultSender: 'Cadet Earthling',
      defaultReply: 'Transmission received and logged in mission memory!',
    },
  },
  ur: {
    app: {
      muteTooltip: 'آواز اور صوتی اثرات بند کریں',
      unmuteTooltip: 'آواز اور صوتی اثرات چلائیں',
      muteAria: 'آواز بند کریں',
      unmuteAria: 'آواز چلائیں',
      switchLanguageLabel: 'زبان تبدیل کریں',
    },
    cover: {
      openBookAria: 'ایسٹریوا کہانیوں کی کتاب کھولیں',
      coverAlt: 'ایسٹریوا — تمام دنیائیں دریافت نہیں ہوتیں، کچھ لکھی جاتی ہیں۔ ہر خلائی کھوجی کی اپنی کہانی ہے۔',
      openBookButton: 'کتاب کھولیں',
      coverTitle: 'ایسٹریوا',
      coverSubtitle: 'تمام دنیائیں دریافت نہیں ہوتیں۔\nکچھ لکھی جاتی ہیں۔',
      coverTagline: 'ہر خلائی کھوجی کی اپنی کہانی ہے۔',
    },
    robotGuide: {
      avatarTitle: 'ایک اور دلچسپ خلائی حقیقت سننے کے لیے کلک کریں!',
      avatarAria: 'روبوٹ خلائی رہنما',
      stopVoice: 'آواز بند کریں',
      readAloud: 'سنیں',
      loadingVoice: 'آواز تیار ہو رہی ہے...',
      nextFact: 'اگلی حقیقت',
      coverMessages: [
        'ایسٹریوا میں خوش آمدید! میں آسٹرو (A.S.T.R.O.) ہوں، آپ کا خلائی رہنما۔ چاند اور مریخ کے حقیقی ناسا روبوٹک کھوجیوں سے ملنے کے لیے نیچے کتاب کھولیں!',
        'ان صفحات میں اپالو 12 ایلسیپ، سرویئر 3، سوجرنر، اور کیپلر خلائی دوربین زندہ ہو کر اپنی سچی مہمات سناتے ہیں۔',
        'کیا آپ خلائی سفر کے لیے تیار ہیں؟ دریافت شروع کرنے کے لیے کتاب کے سرورق یا "کتاب کھولیں" پر ٹیپ کریں—اور آخری صفحے پر خلائی پیغام بھیجیں!',
      ],
      stageMessages: [
        'دیکھیے! یہ خلائی کھوجی کتاب سے باہر آ گیا ہے! اس کی آواز سننے کے لیے "مجھے سنائیں" پر ٹیپ کریں۔',
        'یہاں نظر آنے والا ہر روبوٹک پرزہ ناسا کے حقیقی ڈیزائن اور سچی تاریخ پر مبنی ہے۔',
        'خلائی تحقیق کے اہم ترین سنگِ میل دیکھنے کے لیے نیچے دیے گئے مشن ٹائم لائن کو دیکھیں!',
      ],
      guideMessages: {
        0: [
          'چاند پر موجود آلات کے باب میں خوش آمدید! یہاں آپ ناسا کے سرویئر لینڈرز اور ایلسیپ سائنسی آلات سے ملیں گے۔',
          'سرویئر 3 نے 1967 میں چاند کے 200 میٹر گڑھے میں دو بار اچھل کر لینڈنگ کی اور مٹی کی چار نالیاں کھود کر ثابت کیا کہ چاند اپالو خلا نوردوں کا وزن اٹھا سکتا ہے!',
          'نومبر 1969 میں اپالو 12 کے خلا نورد پیٹ کونراڈ اور ایلن بین پیدل چل کر سرویئر 3 کے پاس آئے اور اس کا ٹی وی کیمرا زمین پر واپس لے گئے۔',
        ],
        1: [
          'اپالو 12 کا لونر ماڈیول انٹریپڈ (1969-099C) ایلسیپ سائنسی آلات کو اوشینس پروسیلارم لے کر گیا، جو SNAP-27 جوہری جنریٹر سے چلتا تھا۔',
          'جب 20 نومبر 1969 کو انٹریپڈ کا بالائی حصہ چاند سے ٹکرایا تو ایلسیپ کے زلزلہ پیما نے تقریباً ایک گھنٹے تک چاند کی لرزش ریکارڈ کی!',
          'مریخ پر موجود آلات دیکھنے کے لیے صفحہ پلٹیں—جہاں سوجرنر روور اور کیپلر خلائی دوربین آپ کے منتظر ہیں!',
        ],
        2: [
          '1997 میں مارس پاتھ فائنڈر دیوہیکل ایئر بیگز کے اندر ایرس ویلس میں اترا، اور سوجرنر مریخ پر چلنے والا پہلا پہیوں والا روور بن گیا!',
          'صرف 7 دن کے لیے بنایا گیا سوجرنر اور پاتھ فائنڈر لینڈر مل کر 83 مریخی دنوں تک تحقیق کرتے رہے!',
          'کیپلر 2009 میں روانہ ہوا اور اس نے 2,600 سے زیادہ بیرونی سیاروں کی تصدیق کی—یہ ثابت کرتے ہوئے کہ ہماری کہکشاں میں ستاروں سے زیادہ سیارے ہیں!',
        ],
        3: [
          'ڈیپ اسپیس نیٹ ورک کے صفحے پر خوش آمدید! یہاں سے آپ ہمارے چاروں تاریخی ناسا کھوجیوں کو خلائی ڈاک پاس بھیج سکتے ہیں۔',
          'ریڈیو لہریں 299,792 کلومیٹر فی سیکنڈ کی رفتار سے سفر کرتی ہیں! سگنل چاند تک 1.28 سیکنڈ، کیپلر تک تقریباً 8.4 منٹ اور مریخ تک 12.5 منٹ میں پہنچتے ہیں۔',
          'ایلسیپ، سرویئر 3، سوجرنر یا کیپلر کے لیے پیغام لکھیں اور اپنا خلائی ڈاک پاس روانہ کریں!',
        ],
      },
    },
    book: {
      backToPage: 'صفحے پر واپس',
      closeBookCover: 'کتاب بند کریں',
      nasaSources: 'ناسا ذرائع',
      swipeHint: 'صفحہ پلٹنے کے لیے سوائپ کریں یا کونے پر ٹیپ کریں',
      tapPhotoHint: 'تفصیلات دیکھنے کے لیے ناسا کی تصویر پر ٹیپ کریں',
      inspectPhotoTitle: (name: string) => `${name} کی سرکاری ناسا تصویر دیکھیں`,
      tapToMeetMe: 'مجھ سے ملیں',
      speaksSuffix: 'کی زبانی',
      partOf: (current: number, total: number) => `حصہ ${current} از ${total}`,
      pauseVoice: 'آواز روکیں',
      readToMe: 'مجھے سنائیں',
      loadingVoice: 'آواز تیار ہو رہی ہے...',
      prev: 'پچھلا',
      next: 'اگلا',
      prevPartAria: 'پچھلا حصہ',
      nextPartAria: 'اگلا حصہ',
      missionMilestones: 'مشن کے سنگِ میل',
      keyMoments: (count: number) => `${count} اہم لمحات`,
      watchVideoPrompt: 'مشن کی ویڈیو دیکھنے کے لیے ٹیپ کریں',
      beamRadioDesktop: 'باب پنجم میں ریڈیو پیغام بھیجیں',
      beamRadioMobile: 'ریڈیو پیغام',
      backToBook: 'کتاب پر واپس جائیں',
      pageOf: (current: number, total: number) => `صفحہ ${current} از ${total}`,
      spreadOf: (current: number, total: number) => `پھیلاؤ ${current} از ${total}`,
      spreadLabel: (num: number) => `صفحہ ${num}`,
      deepSpaceNetwork: 'ڈیپ اسپیس نیٹ ورک',
      swipeToFlip: 'پلٹنے کے لیے سوائپ کریں',
      swipePageToFlip: 'صفحہ پلٹنے کے لیے سوائپ کریں',
      equipmentPrefix: (num: string, role: string) => `آلہ ${num} · ${role}`,
      sourceLabel: (label: string) => `ذریعہ: ${label}`,
      openNasaArchive: 'ناسا آرکائیو کھولیں',
      closePhotoPreview: 'تصویر بند کریں',
      closeVideoPlayer: 'ویڈیو پلیئر بند کریں',
      videoLoadError: 'اس وقت ویڈیو اسٹریم لوڈ نہیں ہو سکی۔',
      retryPlayback: 'دوبارہ چلائیں',
      tapForSound: 'آواز کے لیے ٹیپ کریں',
      prevCornerTitle: 'پچھلے صفحے کے لیے بائیں سوائپ کریں یا کونے پر کلک کریں',
      nextCornerTitle: 'اگلے صفحے کے لیے دائیں سوائپ کریں یا کونے پر کلک کریں',
    },
    dispatch: {
      backToFleet: 'فلیٹ پر واپس',
      brandTitle: 'ایسٹریوا',
      brandSubtitle: 'ستاروں سے پرے ایک کہانی',
      heading: 'خلا میں پیغام بھیجیں',
      subheading: 'آپ نے ان کی کہانیاں سن لیں۔ اب آپ کی باری ہے۔',
      selectTarget: 'خلائی کھوجی منتخب کریں:',
      nameLabel: 'نام:',
      namePlaceholder: 'اپنا نام لکھیں...',
      messageLabel: 'میرا پیغام:',
      messagePlaceholder: 'اپنا پیغام لکھیں...',
      ideaHint: 'نیچے دیا گیا خیال چنیں یا خود لکھیں:',
      presetIdeas: ['خلا کی کھوج کرنے کا شکریہ!', 'زمین سے سلام!'],
      transmittingTo: (name: string) => `${name} کو پیغام بھیجا جا رہا ہے...`,
      launchMessage: 'پیغام روانہ کریں',
      beamingPhotons: '299,792 کلومیٹر فی سیکنڈ کی رفتار سے ریڈیو سگنل جا رہا ہے...',
      photonsSpeedNote: 'ریڈیو لہریں روشنی کی رفتار سے سفر کرتی ہیں',
      earthDsnLabel: 'زمین DSN',
      spaceMailLine1: 'خلائی ڈاک',
      spaceMailLine2: 'پاس',
      sentByExplorer: 'بھیجنے والا کھوجی',
      defaultExplorerName: 'خلائی مسافر',
      messageBeamed: 'بھیجا گیا پیغام',
      targetDestination: 'ہدف و منزل',
      voyageType: 'سفر کی قسم',
      speed: 'رفتار',
      speedValue: '299,792 کلومیٹر/سیکنڈ',
      time: 'وقت',
      missionId: 'مشن آئی ڈی',
      travelLine1: 'حدود سے',
      travelLine2: 'پرے سفر',
      sendAnother: 'ایک اور خلائی پیغام بھیجیں',
      voyageTypes: {
        rover: 'سیاروی سروے',
        lander: 'چاند لینڈر',
        telescope: 'بیرونی سیاروں کا سروے',
        instrument: 'چاند کی رصدگاہ',
      },
      distances: {
        moon: 'زمین سے 384,400 کلومیٹر',
        mars: 'زمین سے 22.5 کروڑ کلومیٹر',
        kepler: 'زمین سے ~15.1 کروڑ کلومیٹر',
      },
      travelTimes: {
        moon: '1.28 سیکنڈ',
        mars: '12 منٹ 30 سیکنڈ',
        kepler: '8 منٹ 24 سیکنڈ',
      },
    },
    sourcesModal: {
      title: 'ناسا اور جے پی ایل کے سائنسی ذرائع',
      subtitle: 'ناسا اسپیس ایپس چیلنج کے لیے تصدیق شدہ مشن ریکارڈز',
      closeAria: 'ذرائع کا ڈائیلاگ بند کریں',
      aboutTitle: 'ایسٹریوا کے بارے میں',
      aboutText:
        'یہ چاروں انقلابی ناسا روبوٹک مشن چاند، مریخ اور شمسی مدار کے یکطرفہ سائنسی سفر کے لیے بنائے گئے تھے۔ اپنے مقاصد مکمل کرنے یا ان سے کہیں آگے بڑھنے کے بعد، ان کے خلائی جہاز اور آلات آج بھی کائنات میں انسانی تجسس کی یادگار کے طور پر محفوظ ہیں۔',
      archivesTitle: 'سرکاری ناسا مشن آرکائیوز',
      nasaPage: 'ناسا صفحہ',
      closeButton: 'بند کریں',
    },
    robotAssistant: {
      welcomeText:
        'بیپ بوپ! سلام زمین والو! میں آسٹرو (A.S.T.R.O.) ہوں، آپ کا ایسٹریوا روبوٹ مددگار۔ مجھ سے اپالو 12 ایلسیپ، سرویئر 3، سوجرنر، یا کیپلر خلائی دوربین کے بارے میں کچھ بھی پوچھیں!',
      justNow: 'ابھی',
      now: 'ابھی',
      subtitle: 'روبوٹک ٹیلی میٹری اور کھوجی رہنما',
      deepSpace: 'گہری خلا',
      stopAudio: 'آواز روکیں',
      readOutLoud: 'بلند آواز میں سنیں',
      telemetryLabel: 'ناسا ٹیلی میٹری',
      loadingText: 'آسٹرو گہری خلا سے معلومات حاصل کر رہا ہے...',
      suggestedQuestionsLabel: 'تجویز کردہ سوالات:',
      presetQuestions: [
        'چاند اور مریخ پر آلات کیوں چھوڑے گئے ہیں؟',
        'اپالو 12 ایلسیپ نے چاند پر کیا پیمائش کی؟',
        'اپالو 12 کے خلا نورد سرویئر 3 کے پاس کیسے گئے؟',
        'مریخ پر سوجرنر کی خاص بات کیا تھی؟',
        'کیپلر نے 2,600 سے زیادہ بیرونی سیارے کیسے دریافت کیے؟',
      ],
      inputPlaceholder: 'آسٹرو سے مریخ، روورز یا چاند کے بارے میں پوچھیں...',
      askButton: 'پوچھیں',
      fallbackReply:
        'بیپ بوپ! ریڈیو رابطہ بحال! چاند پر ایلسیپ اور سرویئر 3 سے لے کر مریخ پر سوجرنر اور شمسی مدار میں کیپلر تک، ان چاروں ناسا مشنوں نے خلائی سائنس کو بدل دیا!',
    },
    sendModal: {
      title: 'خلا میں پیغام بھیجیں',
      badge: 'ڈیپ اسپیس نیٹ ورک',
      subtitle: 'ایسٹریوا کے ذریعے بین السیاروی ریڈیو سگنل بھیجیں',
      targetDestination: 'مطلوبہ منزل',
      signalDistance: 'سگنل کا فاصلہ',
      lightTravelTime: 'روشنی کے سفر کا وقت',
      chooseRecipient: '1. اپنا خلائی کھوجی منتخب کریں:',
      yourCallsign: '2. آپ کا نام / کال سائن:',
      callsignPlaceholder: 'مثلاً کیڈٹ سارہ، آسٹرو علی، کلاس چہارم...',
      yourTransmission: '3. آپ کا خلائی پیغام:',
      messagePlaceholder: 'چاند، مریخ یا کیپلر کو بھیجنے کے لیے پیغام لکھیں...',
      pickTemplate: 'یا کوئی تیار پیغام منتخب کریں:',
      presetMessages: [
        'آٹھ سال تک اوشینس پروسیلارم سے چاند کے زلزلے ریکارڈ کرنے کا شکریہ!',
        'اپالو خلا نوردوں کی آمد سے پہلے چاند کی مٹی جانچنے پر سرویئر 3 کا شکریہ!',
        'سوجرنر، آپ مریخ پر چلنے والے پہلے روور تھے اور پوری نسل کے لیے مشعلِ راہ بنے!',
        'کیپلر، ہماری کہکشاں میں ستاروں سے زیادہ سیارے دکھانے کا شکریہ!',
        'بیپ بوپ! زمین کے اسکول کے بچوں کی طرف سے گرمجوش سلام!',
      ],
      beamButton: (name: string) => `${name} کو پیغام روانہ کریں`,
      beamingTitle: 'نظامِ شمسی میں سگنل بھیجا جا رہا ہے...',
      beamingSubtitle: 'ناسا ڈیپ اسپیس نیٹ ورک کے 70 میٹر اینٹینا کے ذریعے رابطہ جاری ہے',
      carrierInfo: (name: string) => `فریکوئنسی: 8.4 GHz · رفتار: 299,792 کلومیٹر/سیکنڈ · ہدف: ${name}`,
      replyDownlinked: 'خلا سے جوابی پیغام موصول ہو گیا',
      yourMessage: 'آپ کا پیغام:',
      responds: (name: string) => `${name} کا جواب:`,
      stopVoice: 'آواز روکیں',
      playTransmission: 'ریڈیو پیغام سنیں',
      sendAnother: 'ایک اور بھیجیں',
      sessionLog: (count: number) => `سیشن ریڈیو لاگ (${count} بھیجے گئے پیغامات):`,
      toLabel: (name: string) => `بنام: ${name}`,
      defaultSender: 'کیڈٹ زمین والا',
      defaultReply: 'پیغام موصول ہو گیا اور مشن میموری میں محفوظ کر لیا گیا!',
    },
  },
};

export function getTranslations(language: Language): Translations {
  return TRANSLATIONS[language];
}
