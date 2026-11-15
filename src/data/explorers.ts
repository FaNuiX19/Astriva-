import apollo12AlsepImg from '../assets/images/nasa/apollo12_alsep.jpg';
import surveyor3Img from '../assets/images/nasa/surveyor3_nasa.jpg';
import sojournerPathfinderImg from '../assets/images/nasa/pathfinder_hero.jpg';
import keplerImg from '../assets/images/nasa/kepler_k2.jpg';

export interface Milestone {
  id: string;
  label: string;
  date: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface ExplorerVideo {
  url: string;
  poster: string;
  title: string;
  subtitle: string;
  caption: string;
}

export interface Explorer {
  id: string;
  name: string;
  epithet: string;
  destination: 'The Moon' | 'Mars' | 'Deep Space (Heliocentric Orbit)';
  displayDestination?: string;
  category: 'instrument' | 'lander' | 'rover' | 'telescope';
  status: 'Completed' | 'Concluded' | 'Retired';
  displayStatus?: string;
  activeYears: string;
  landingDate: string;
  landingSite: string;
  shortIntro: string;
  characterGreeting: string;
  storyParagraphs: string[];
  timeline: Milestone[];
  funFact: string;
  hardwareFeatures: string[];
  photo: string;
  photoCaption: string;
  video?: ExplorerVideo;
  nasaSource: {
    title: string;
    organization: string;
    url: string;
    summary: string;
  };
}

export interface ChapterEquipmentPhoto {
  number: string;
  explorerId: string;
  name: string;
  role: string;
  photo: string;
  photoCaption: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface ChapterIntro {
  id: 'moon-intro' | 'mars-intro';
  chapterLabel: string;
  title: string;
  subtitle: string;
  description: string;
  destinationTag: string;
  iconType: 'moon' | 'mars';
  equipments: ChapterEquipmentPhoto[];
}

export interface BookSlot {
  kind: 'intro' | 'explorer';
  intro?: ChapterIntro;
  explorer?: Explorer;
}

export const CHAPTER_INTROS: Record<'moon-intro' | 'mars-intro', ChapterIntro> = {
  'moon-intro': {
    id: 'moon-intro',
    chapterLabel: 'CHAPTER I',
    title: 'Equipments on Moon',
    subtitle: 'Official NASA Mission Archive Photographs',
    description: 'Real NASA photographs of our two lunar explorers from the verified mission archives.',
    destinationTag: 'The Moon · Oceanus Procellarum',
    iconType: 'moon',
    equipments: [
      {
        number: '01',
        explorerId: 'surveyor3',
        name: 'Surveyor Landers',
        role: 'Surveyor 3 · 1967',
        photo: surveyor3Img,
        photoCaption: 'Astronaut Pete Conrad inspects the Surveyor 3 lander on the Moon during Apollo 12 (AS12-48-7134).',
        sourceLabel: 'NASA Science · Surveyor 3',
        sourceUrl: 'https://science.nasa.gov/mission/surveyor-3/',
      },
      {
        number: '02',
        explorerId: 'apollo12-alsep',
        name: 'ALSEP Scientific Packages',
        role: 'Apollo 12 · 1969–1977',
        photo: apollo12AlsepImg,
        photoCaption: 'Apollo 12 Lunar Module Intrepid carrying the ALSEP science package over the Moon (NSSDCA 1969-099C).',
        sourceLabel: 'NASA NSSDCA · 1969-099C',
        sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',
      },
    ],
  },
  'mars-intro': {
    id: 'mars-intro',
    chapterLabel: 'CHAPTER II',
    title: 'Equipments on Mars',
    subtitle: 'Official NASA Mission Archive Photographs',
    description: 'Real NASA photographs of Sojourner on Mars and the Kepler Space Telescope.',
    destinationTag: 'Mars & Deep Space',
    iconType: 'mars',
    equipments: [
      {
        number: '03',
        explorerId: 'sojourner',
        name: 'Sojourner Landers',
        role: 'Mars Pathfinder · 1997',
        photo: sojournerPathfinderImg,
        photoCaption: 'Mars Pathfinder lander petals and the Sojourner rover beside Yogi Rock in Ares Vallis, Mars.',
        sourceLabel: 'NASA / JPL · Mars Pathfinder',
        sourceUrl: 'https://science.nasa.gov/mission/mars-pathfinder/',
      },
      {
        number: '04',
        explorerId: 'kepler',
        name: 'Kepler Space Telescope',
        role: 'Solar Orbit · 2009–2018',
        photo: keplerImg,
        photoCaption: 'NASA planet-hunting Kepler spacecraft surveying Milky Way star fields in its K2 profile (PIA18904).',
        sourceLabel: 'NASA Ames / JPL · Kepler',
        sourceUrl: 'https://science.nasa.gov/mission/kepler/',
      },
    ],
  },
};

export const EXPLORERS: Explorer[] = [
  {
    id: 'surveyor3',
    name: 'Surveyor Landers',
    epithet: 'LUNAR EQUIPMENT 01 · SURVEYOR 3',
    destination: 'The Moon',
    category: 'lander',
    status: 'Concluded',
    activeYears: '1967 (Visited by Apollo 12 in 1969)',
    landingDate: 'April 20, 1967',
    landingSite: 'Oceanus Procellarum (Surveyor Crater), The Moon',
    shortIntro: 'I proved the Moon could safely hold a spacecraft—and two years later, Apollo 12 astronauts walked down to visit me.',
    characterGreeting:
      'Hello from Surveyor Crater! I am Surveyor 3, one of NASA’s robotic lunar landers that tested the Moon’s surface before Apollo astronauts arrived.',
    storyParagraphs: [
      'I am Surveyor 3, part of NASA’s robotic Surveyor program sent to test soft landings on the Moon ahead of the crewed Apollo missions. I launched on April 17, 1967, aboard an Atlas-Centaur rocket from Cape Canaveral.',
      'On April 20, 1967, highly reflective rocks confused my descent radar during landing in Oceanus Procellarum. My engines kept firing too long, causing me to bounce twice across a 200-meter crater before settling safely on its slope!',
      'I was the first Surveyor lander equipped with a soil-mechanics surface sampler arm. My extendable claw dug four trenches up to 18 centimeters deep, proving lunar soil was firm enough to support heavy Apollo landing gear.',
      'Before the freezing lunar night arrived on May 3, 1967, my television camera transmitted more than 6,300 photographs of the crater walls, soil texture, and lunar rocks back to Earth.',
      'On November 19–20, 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed just 180 meters away, walked down into my crater, and brought my television camera back to Earth so scientists could study 2.5 years of space exposure.'
    ],
    timeline: [
      {
        id: 'sur-launch',
        label: 'LAUNCH',
        date: 'April 17, 1967',
        title: 'Atlas-Centaur Liftoff',
        description: 'Launched from Cape Canaveral Air Force Station Launch Complex 36B toward the Moon.'
      },
      {
        id: 'sur-landing',
        label: 'TOUCHDOWN',
        date: 'April 20, 1967',
        title: 'Bouncing Into Surveyor Crater',
        description: 'Soft-landed inside a 200-meter crater in Oceanus Procellarum after two gentle radar-delayed rebounds.'
      },
      {
        id: 'sur-trenches',
        label: 'SOIL SAMPLER',
        date: 'April–May 1967',
        title: 'Digging Lunar Regolith',
        description: 'First Surveyor with a surface-sampling arm, digging trenches to verify soil bearing strength for Apollo.'
      },
      {
        id: 'sur-tv',
        label: '6,300+ IMAGES',
        date: 'May 3, 1967',
        title: 'Lunar Television Survey',
        description: 'Beamed back over 6,300 television images before powering down at lunar sunset.'
      },
      {
        id: 'sur-apollo',
        label: 'APOLLO 12 VISIT',
        date: 'Nov 19–20, 1969',
        title: 'Visited by Astronauts',
        description: 'Apollo 12 astronauts Pete Conrad and Alan Bean walked to Surveyor 3 and returned its camera and parts to Earth.'
      }
    ],
    funFact: 'Surveyor 3 is the only robotic spacecraft on another world whose hardware was visited, inspected, and partially returned to Earth by human astronauts!',
    hardwareFeatures: [
      'Soil Mechanics Surface Sampler Arm',
      'Television Scanning Camera',
      'Three Shock-Absorbing Landing Legs',
      'Mast-Mounted Solar Panel & Planar Antenna'
    ],
    photo: surveyor3Img,
    photoCaption: 'Astronaut Pete Conrad inspects the Surveyor 3 lander on the Moon during Apollo 12 (AS12-48-7134).',
    video: {
      url: '/assets/videos/surveyor3_mission.mp4',
      poster: '/assets/videos/surveyor3_poster.jpg',
      title: 'Surveyor 3: Launch, Landing & Lunar Soil Story',
      subtitle: 'Animated Mission Film · April–May 1967',
      caption: 'Watch Surveyor 3 lift off from Cape Canaveral on April 17, 1967, fire its Centaur stage toward the Moon, touch down, scoop lunar soil, and beam home images before its final contact on May 4, 1967.'
    },
    nasaSource: {
      title: 'NASA Science: Surveyor 3 Mission',
      organization: 'NASA Science & Jet Propulsion Laboratory (JPL)',
      url: 'https://science.nasa.gov/mission/surveyor-3/',
      summary: 'Official NASA mission documentation covering Surveyor 3 launch, crater landing, soil sampling experiments, and Apollo 12 hardware retrieval.'
    }
  },
  {
    id: 'apollo12-alsep',
    name: 'ALSEP Scientific Packages',
    epithet: 'LUNAR EQUIPMENT 02 · APOLLO 12',
    destination: 'The Moon',
    category: 'instrument',
    status: 'Completed',
    activeYears: '1969 – 1977 (Nearly 8 Years)',
    landingDate: 'November 19, 1969',
    landingSite: 'Oceanus Procellarum (Ocean of Storms), The Moon',
    shortIntro: 'Deployed by Apollo 12 astronauts, I listened to moonquakes and measured the lunar environment for eight years.',
    characterGreeting:
      'Greetings from the Ocean of Storms! I am the Apollo 12 ALSEP scientific package, cataloged as 1969-099C aboard Lunar Module Intrepid.',
    storyParagraphs: [
      'I am the Apollo 12 ALSEP—the Apollo Lunar Surface Experiments Package. On November 14, 1969, I launched from Earth aboard the Apollo 12 spacecraft inside Lunar Module Intrepid (NSSDC ID 1969-099C).',
      'On November 19, 1969, astronauts Charles "Pete" Conrad and Alan Bean landed on Oceanus Procellarum, unpacked my scientific instruments, and arranged them across the lunar regolith.',
      'To survive the freezing two-week lunar nights without sunlight, I was powered by a SNAP-27 radioisotope thermoelectric generator (RTG), delivering steady electrical power to my central station and sensors.',
      'On November 20, 1969, NASA intentionally crashed the empty Lunar Module ascent stage (1969-099C) back into the Moon to test my Passive Seismic Experiment—sending seismic waves echoing through the lunar crust for nearly an hour.',
      'Working alongside my Lunar Surface Magnetometer, Solar Wind Spectrometer, and ion detectors, I transmitted continuous data back to Earth until NASA ended ALSEP operations on September 30, 1977.'
    ],
    timeline: [
      {
        id: 'alsep-launch',
        label: 'LAUNCH',
        date: 'Nov 14, 1969',
        title: 'Apollo 12 Liftoff',
        description: 'Launched aboard Saturn V with Lunar Module Intrepid (NSSDC ID 1969-099C) carrying the ALSEP science suite.'
      },
      {
        id: 'alsep-deploy',
        label: 'DEPLOYED',
        date: 'Nov 19, 1969',
        title: 'Set Up on Oceanus Procellarum',
        description: 'Astronauts Pete Conrad and Alan Bean deployed ALSEP instruments and activated the SNAP-27 RTG power source.'
      },
      {
        id: 'alsep-impact',
        label: 'SEISMIC TEST',
        date: 'Nov 20, 1969',
        title: 'LM Ascent Stage Impact',
        description: 'Intrepid’s ascent stage (1969-099C) impacted the Moon, letting the ALSEP seismometer record vibrations for nearly an hour.'
      },
      {
        id: 'alsep-science',
        label: 'CONTINUOUS DATA',
        date: '1969–1977',
        title: 'Eight Years of Lunar Science',
        description: 'Monitored moonquakes, solar wind particles, and lunar magnetic fields continuously across nearly eight years.'
      },
      {
        id: 'alsep-complete',
        label: 'OPERATIONS END',
        date: 'Sept 30, 1977',
        title: 'Mission Concluded',
        description: 'NASA shut down ALSEP transmissions after vastly exceeding its original one-year design goal.'
      }
    ],
    funFact: 'The intentional crash of the Apollo 12 Lunar Module ascent stage (1969-099C) let the ALSEP seismometer observe the Moon reverberating for almost an hour!',
    hardwareFeatures: [
      'SNAP-27 Radioisotope Power Generator',
      'Passive Seismic Experiment',
      'Lunar Surface Magnetometer',
      'Solar Wind & Ion Detectors'
    ],
    photo: apollo12AlsepImg,
    photoCaption: 'Apollo 12 Lunar Module Intrepid carrying the ALSEP science package over the Moon (NSSDCA 1969-099C).',
    nasaSource: {
      title: 'Apollo 12 LM / ALSEP Spacecraft Record (1969-099C)',
      organization: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',
      summary: 'Official NASA NSSDCA spacecraft record for Apollo 12 Lunar Module Intrepid (1969-099C) and its deployed ALSEP lunar surface science experiments.'
    }
  },
  {
    id: 'sojourner',
    name: 'Sojourner Landers',
    epithet: 'MARS EQUIPMENT 03 · MARS PATHFINDER',
    destination: 'Mars',
    category: 'rover',
    status: 'Concluded',
    activeYears: '1997 (83 Martian Days)',
    landingDate: 'July 4, 1997',
    landingSite: 'Ares Vallis, Mars',
    shortIntro: 'Arriving inside Mars Pathfinder’s tetrahedral lander, I rolled down the ramp to become the first rover ever to drive on Mars.',
    characterGreeting:
      'Beep-beep from Ares Vallis! I am Sojourner, delivered by the Mars Pathfinder lander as humanity’s very first wheeled explorer on Mars.',
    storyParagraphs: [
      'I am Sojourner, the six-wheeled robotic rover carried inside NASA’s Mars Pathfinder lander. We launched from Cape Canaveral aboard a Delta II 7925 rocket on December 4, 1996.',
      'On July 4, 1997, Mars Pathfinder plunged into the Martian atmosphere using a heatshield, a supersonic parachute, braking rockets, and giant airbags—bouncing across the rocky floodplain of Ares Vallis before coming to rest.',
      'As the lander unfolded its three tetrahedral petals—renamed the Carl Sagan Memorial Station—I rolled carefully down the deployment ramp onto Martian soil, becoming the first wheeled vehicle ever to operate on another planet.',
      'Powered by my flat rooftop solar panel, I drove up to Martian boulders and used my Alpha Proton X-Ray Spectrometer (APXS) and cameras to measure the chemistry of rocks and dust.',
      'Even though my primary mission was planned for just 7 days, Pathfinder and I operated together for 83 Martian days until our final transmission on September 27, 1997—proving low-cost Mars rovers could work.'
    ],
    timeline: [
      {
        id: 'soj-launch',
        label: 'LAUNCH',
        date: 'Dec 4, 1996',
        title: 'Mars Pathfinder Departs',
        description: 'Launched from Cape Canaveral aboard a Delta II 7925 rocket carrying the Pathfinder lander and Sojourner rover.'
      },
      {
        id: 'soj-landing',
        label: 'AIRBAG LANDING',
        date: 'July 4, 1997',
        title: 'Touchdown in Ares Vallis',
        description: 'Bounced safely onto Mars inside giant airbags before opening the tetrahedral lander petals.'
      },
      {
        id: 'soj-roll',
        label: 'FIRST DRIVE',
        date: 'July 5, 1997',
        title: 'First Rover on Mars',
        description: 'Rolled down the lander ramp to become humanity’s first wheeled rover operating on another planet.'
      },
      {
        id: 'soj-apxs',
        label: 'ROCK ANALYSIS',
        date: 'July–Aug 1997',
        title: 'APXS Science Measurements',
        description: 'Measured elemental rock compositions and captured hundreds of surface images alongside the lander.'
      },
      {
        id: 'soj-final',
        label: 'MISSION END',
        date: 'Sept 27, 1997',
        title: '83 Days of Exploration',
        description: 'Completed 83 Martian days of surface science—nearly twelve times longer than the original 7-day rover plan.'
      }
    ],
    funFact: 'Mars Pathfinder’s airbag landing and Sojourner’s 83-day mission proved that small, nimble rovers could explore the Martian surface.',
    hardwareFeatures: [
      'Tetrahedral Airbag Lander Station',
      'Solar Cell Rooftop Array',
      'Alpha Proton X-Ray Spectrometer (APXS)',
      '6-Wheel Rocker-Bogie Mobility System'
    ],
    photo: sojournerPathfinderImg,
    photoCaption: 'Mars Pathfinder lander petals and the Sojourner rover beside Yogi Rock in Ares Vallis, Mars.',
    video: {
      url: '/assets/videos/sojourner_mission.mp4',
      poster: '/assets/videos/sojourner_poster.jpg',
      title: 'Mars Pathfinder & Sojourner: Journey to the Red Planet',
      subtitle: 'Animated Mission Film · 1996–1997',
      caption: 'Watch Mars Pathfinder launch on December 4, 1996, deploy its parachute and giant airbags onto Mars, and release Sojourner to explore rocks across Ares Vallis.'
    },
    nasaSource: {
      title: 'NASA Science: Mars Pathfinder & Sojourner',
      organization: 'NASA Jet Propulsion Laboratory (JPL)',
      url: 'https://science.nasa.gov/mission/mars-pathfinder/',
      summary: 'Official NASA mission overview for Mars Pathfinder and the Sojourner rover, detailing airbag entry-descent-landing and 83-day Ares Vallis science.'
    }
  },
  {
    id: 'kepler',
    name: 'Kepler Space Telescope',
    epithet: 'DEEP SPACE EQUIPMENT 04 · EXOPLANET HUNTER',
    destination: 'Deep Space (Heliocentric Orbit)',
    category: 'telescope',
    status: 'Retired',
    activeYears: '2009 – 2018 (9.6 Years)',
    landingDate: 'March 6, 2009 (Launch Date)',
    landingSite: 'Earth-Trailing Heliocentric Orbit',
    shortIntro: 'As NASA’s first planet-hunting mission, I stared at distant stars and discovered more than 2,600 exoplanets.',
    characterGreeting:
      'Starlight confirmed! I am the Kepler Space Telescope. From my peaceful orbit around the Sun, I proved there are more planets than stars in our galaxy.',
    storyParagraphs: [
      'I am the Kepler Space Telescope, NASA’s first mission dedicated to searching for Earth-size planets orbiting other stars. I launched from Cape Canaveral on March 6, 2009, into an Earth-trailing heliocentric orbit.',
      'Staring steadily at a patch of the Milky Way containing more than 150,000 stars, my sensitive photometer watched for tiny, regular dips in starlight—the transit method—caused when a planet crosses in front of its star.',
      'In 2013, after two of my four reaction wheels failed, NASA engineers invented a clever new way to balance me using sunlight pressure—launching my extended K2 mission in 2014 to survey even more star fields along the ecliptic.',
      'Over more than nine years of observing, I confirmed over 2,600 exoplanets, revealing that our galaxy holds billions of hidden worlds—and more planets than stars!',
      'In October 2018, after finally running out of thruster fuel, NASA officially retired me. Today I drift quietly in a safe heliocentric orbit around the Sun, far from Earth.'
    ],
    timeline: [
      {
        id: 'kep-launch',
        label: 'LAUNCH',
        date: 'March 6, 2009',
        title: 'Launch to Solar Orbit',
        description: 'Launched from Cape Canaveral into an Earth-trailing heliocentric orbit to survey Milky Way stars.'
      },
      {
        id: 'kep-transits',
        label: 'TRANSIT SURVEY',
        date: '2009–2013',
        title: '150,000+ Stars Monitored',
        description: 'Measured minuscule starlight dips to detect thousands of exoplanet candidates across the Cygnus field.'
      },
      {
        id: 'kep-k2',
        label: 'K2 MISSION',
        date: '2014',
        title: 'Solar-Balanced Second Life',
        description: 'Engineers used solar radiation pressure to stabilize pointing after reaction wheel failure, extending discoveries.'
      },
      {
        id: 'kep-2600',
        label: '2,600+ WORLDS',
        date: '2016–2018',
        title: 'More Planets Than Stars',
        description: 'Surpassed 2,600 confirmed exoplanets, transforming humanity’s understanding of planetary systems.'
      },
      {
        id: 'kep-retire',
        label: 'RETIRED',
        date: 'Oct 30, 2018',
        title: 'Fuel Depleted, Safe Orbit',
        description: 'NASA retired Kepler after depleting its fuel; the spacecraft remains safely parked in heliocentric orbit.'
      }
    ],
    funFact: 'Kepler discovered more than 2,600 confirmed exoplanets and showed scientists that our Milky Way galaxy actually has more planets than stars!',
    hardwareFeatures: [
      '0.95-Meter Schmidt Photometer Telescope',
      '42-CCD Focal Plane Array (95 Megapixels)',
      'Curved Solar Array & Sunshade',
      'K2 Solar-Pressure Stabilization'
    ],
    photo: keplerImg,
    photoCaption: 'NASA planet-hunting Kepler spacecraft surveying Milky Way star fields in its K2 profile (PIA18904).',
    nasaSource: {
      title: 'NASA Science: Kepler Space Telescope',
      organization: 'NASA Ames Research Center & JPL',
      url: 'https://science.nasa.gov/mission/kepler/',
      summary: 'Official NASA mission documentation for Kepler and K2, covering its 2009 launch, transit photometry, 2,600+ exoplanet discoveries, and 2018 retirement.'
    }
  }
];

export interface PageSpread {
  spreadNumber: number;
  type: 'book' | 'sendMessage';
  leftSlot?: BookSlot;
  rightSlot?: BookSlot;
}

export const SPREADS: PageSpread[] = [
  {
    spreadNumber: 1,
    type: 'book',
    leftSlot: { kind: 'intro', intro: CHAPTER_INTROS['moon-intro'] },
    rightSlot: { kind: 'explorer', explorer: EXPLORERS[0] }, // 1. Surveyor Landers
  },
  {
    spreadNumber: 2,
    type: 'book',
    leftSlot: { kind: 'explorer', explorer: EXPLORERS[1] }, // 2. ALSEP Scientific Packages
    rightSlot: { kind: 'intro', intro: CHAPTER_INTROS['mars-intro'] },
  },
  {
    spreadNumber: 3,
    type: 'book',
    leftSlot: { kind: 'explorer', explorer: EXPLORERS[2] }, // 3. Sojourner Landers
    rightSlot: { kind: 'explorer', explorer: EXPLORERS[3] }, // 4. Kepler Space Telescope
  },
  {
    spreadNumber: 4,
    type: 'sendMessage',
  },
];

export interface MobileBookPage {
  pageNumber: number;
  type: 'intro' | 'explorer' | 'sendMessage';
  intro?: ChapterIntro;
  explorer?: Explorer;
}

export const MOBILE_PAGES: MobileBookPage[] = [
  { pageNumber: 1, type: 'intro', intro: CHAPTER_INTROS['moon-intro'] },
  { pageNumber: 2, type: 'explorer', explorer: EXPLORERS[0] },
  { pageNumber: 3, type: 'explorer', explorer: EXPLORERS[1] },
  { pageNumber: 4, type: 'intro', intro: CHAPTER_INTROS['mars-intro'] },
  { pageNumber: 5, type: 'explorer', explorer: EXPLORERS[2] },
  { pageNumber: 6, type: 'explorer', explorer: EXPLORERS[3] },
  { pageNumber: 7, type: 'sendMessage' },
];
