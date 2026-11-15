import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AI Studio dev server and Cloud Run app-container port resolution
function resolvePort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.APP_PORT) {
    const parsed = parseInt(process.env.APP_PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.DEFAULT_APP_PORT) {
    const parsed = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.PORT && !process.env.NGINX_PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 3000;
}

const app = express();
const PORT = resolvePort();

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. ROBOT ASSISTANT ENDPOINT
app.post('/api/robot-assistant', async (req: Request, res: Response) => {
  const { question, language } = req.body;
  const lang = language === 'ur' ? 'ur' : 'en';

  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: lang === 'ur' ? 'سوال درکار ہے' : 'Question is required' });
    return;
  }

  // Pre-baked smart answers for offline or fallback mode
  const lowerQ = question.toLowerCase();
  const getFallbackAnswer = () => {
    if (lang === 'ur') {
      if (lowerQ.includes('long') || lowerQ.includes('time') || question.includes('وقت') || question.includes('دیر')) {
        return 'ریڈیو سگنل روشنی کی رفتار (300,000 کلومیٹر فی سیکنڈ) سے سفر کرتے ہیں! پیغام چاند پر ایلسیپ اور سرویئر 3 تک تقریباً 1.28 سیکنڈ، کیپلر تک 8.4 منٹ اور مریخ پر سوجرنر تک تقریباً 12.5 منٹ میں پہنچتا ہے!';
      }
      if (lowerQ.includes('why') || lowerQ.includes('left') || question.includes('کیوں') || question.includes('چھوڑے')) {
        return 'ناسا کے لینڈرز، روورز اور خلائی دوربینیں یکطرفہ سائنسی سفر کے لیے بنائے گئے تھے! انہیں واپس لانے کے لیے بہت بڑے راکٹ درکار ہوتے، تاہم اپالو 12 کے خلا نوردوں نے چاند پر سرویئر 3 سے ملاقات کی اور اس کا ٹی وی کیمرا زمین پر واپس لائے!';
      }
      if (lowerQ.includes('alsep') || lowerQ.includes('apollo') || question.includes('ایلسیپ') || question.includes('اپالو')) {
        return 'اپالو 12 ایلسیپ (1969-099C) نومبر 1969 میں اوشینس پروسیلارم میں نصب کیا گیا! SNAP-27 جوہری جنریٹر سے چلتے ہوئے اس کے زلزلہ پیما اور سینسرز نے 30 ستمبر 1977 تک تقریباً آٹھ سال مسلسل کام کیا!';
      }
      if (lowerQ.includes('surveyor') || question.includes('سرویئر')) {
        return 'سرویئر 3 اپریل 1967 میں چاند کے 200 میٹر گڑھے میں دو بار اچھل کر اترا، چار نالیاں کھودیں اور 6,300 سے زائد تصاویر بھیجیں! نومبر 1969 میں اپالو 12 کے خلا نورد پیٹ کونراڈ اور ایلن بین اس کے پاس آئے اور اس کا کیمرا زمین پر واپس لے گئے!';
      }
      if (lowerQ.includes('sojourner') || lowerQ.includes('pathfinder') || question.includes('سوجرنر') || question.includes('مریخ')) {
        return 'سوجرنر 4 جولائی 1997 کو مارس پاتھ فائنڈر کے ایئر بیگ لینڈر کے اندر مریخ پر اترا! صرف 7 دن کے لیے بنایا گیا یہ پہلا مریخی روور ایرس ویلس میں 83 مریخی دنوں تک سائنسی تحقیق کرتا رہا!';
      }
      if (lowerQ.includes('kepler') || lowerQ.includes('exoplanet') || question.includes('کیپلر') || question.includes('سیارے')) {
        return 'مارچ 2009 میں شمسی مدار میں روانہ ہونے والی کیپلر خلائی دوربین نے 150,000 سے زائد ستاروں کا مشاہدہ کیا اور 2,600 سے زیادہ بیرونی سیاروں کی تصدیق کی—یہ ثابت کرتے ہوئے کہ ہماری کہکشاں میں ستاروں سے زیادہ سیارے ہیں!';
      }
      return 'بیپ بوپ! میں آسٹرو (A.S.T.R.O.) ہوں، آپ کا ایسٹریوا رہنما! مجھ سے ہمارے چاروں ناسا آلات کے بارے میں پوچھیں: چاند پر اپالو 12 ایلسیپ اور سرویئر 3، مریخ پر سوجرنر، یا کیپلر خلائی دوربین!';
    }

    if (lowerQ.includes('long') && (lowerQ.includes('message') || lowerQ.includes('time') || lowerQ.includes('reach'))) {
      return "Radio signals travel at the speed of light (300,000 km per second)! A message reaches ALSEP and Surveyor 3 on the Moon in ~1.28 seconds, Kepler in heliocentric orbit in ~8.4 minutes, and Sojourner on Mars in ~12.5 minutes on average!";
    }
    if (lowerQ.includes('why') && (lowerQ.includes('left') || lowerQ.includes('stay') || lowerQ.includes('remain'))) {
      return "NASA landers, rovers, and deep-space telescopes were designed for one-way heroic journeys! Returning them would require massive rockets, though Apollo 12 astronauts did visit Surveyor 3 on the Moon and brought its TV camera home to Earth!";
    }
    if (lowerQ.includes('alsep') || lowerQ.includes('apollo 12') || lowerQ.includes('1969-099c')) {
      return "Apollo 12 ALSEP (cataloged as 1969-099C) was deployed in Oceanus Procellarum in November 1969! Powered by a SNAP-27 nuclear generator, its seismometer and sensors operated continuously for nearly eight years until September 30, 1977!";
    }
    if (lowerQ.includes('surveyor')) {
      return "Surveyor 3 bounced twice into a 200-meter lunar crater in April 1967, dug four soil trenches, and beamed back over 6,300 photographs! In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean walked into its crater and returned its camera to Earth!";
    }
    if (lowerQ.includes('sojourner') || lowerQ.includes('pathfinder')) {
      return "Sojourner arrived inside Mars Pathfinder's tetrahedral airbag lander on July 4, 1997! Planned for just 7 days, humanity's first wheeled Mars rover operated for 83 Martian days in Ares Vallis using its APXS rock analyzer!";
    }
    if (lowerQ.includes('kepler') || lowerQ.includes('exoplanet') || lowerQ.includes('telescope')) {
      return "Launched in March 2009 into an Earth-trailing heliocentric orbit, the Kepler Space Telescope monitored over 150,000 stars and confirmed more than 2,600 exoplanets—proving our galaxy has more planets than stars before retiring in October 2018!";
    }
    return "Beep-boop! I'm A.S.T.R.O., your Astriva guide! Ask me about our four featured NASA equipments: Apollo 12 ALSEP and Surveyor 3 on the Moon, Mars Pathfinder's Sojourner, or the planet-hunting Kepler Space Telescope!";
  };

  if (!ai) {
    res.json({ answer: getFallbackAnswer(), source: 'offline-knowledge-base' });
    return;
  }

  try {
    const languageInstruction =
      lang === 'ur'
        ? 'IMPORTANT: Respond completely in natural, child-friendly Urdu script (اردو). Do not respond in English (you may keep technical acronyms like NASA, ALSEP, SNAP-27, APXS, K2 if helpful).'
        : 'Respond in English.';

    const prompt = `You are A.S.T.R.O., a cheerful, friendly robotic assistant for the NASA Space Apps "Astriva — A Story Beyond the Stars" storybook.
Our storybook features exactly four verified NASA equipments:
1. Apollo 12 ALSEP Scientific Packages (1969-099C, Moon — Oceanus Procellarum, 1969–1977)
2. Surveyor 3 Lander (Moon — Surveyor Crater, 1967, visited by Apollo 12 astronauts in 1969)
3. Mars Pathfinder & Sojourner Rover (Mars — Ares Vallis, 1997, 83 Martian days)
4. Kepler Space Telescope (Earth-trailing heliocentric orbit, 2009–2018, 2,600+ confirmed exoplanets)
The visitor asks: "${question}".
${languageInstruction}
Answer in a warm, enthusiastic, scientifically accurate tone that school-age children, students, and space enthusiasts will love.
Keep your response between 2 and 4 sentences. Speak with subtle robot charm.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
    });

    const answer = response.text || getFallbackAnswer();
    res.json({ answer, source: 'gemini-ai' });
  } catch (error) {
    console.error('Error generating robot assistant response:', error);
    res.json({ answer: getFallbackAnswer(), source: 'fallback' });
  }
});

// 2. SEND MESSAGE TO SPACE ENDPOINT
app.post('/api/send-message-to-space', async (req: Request, res: Response) => {
  const { targetExplorerId, explorerName, message, senderName, language } = req.body;
  const lang = language === 'ur' ? 'ur' : 'en';

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: lang === 'ur' ? 'پیغام درکار ہے' : 'Message is required' });
    return;
  }

  const name = explorerName || (lang === 'ur' ? 'ایسٹریوا ایکسپلورر' : 'Astriva Explorer');
  const from = senderName ? senderName.trim() : lang === 'ur' ? 'زمین کا دوست' : 'Earth Friend';

  const isMoon = targetExplorerId?.includes('surveyor') || targetExplorerId?.includes('alsep');
  const isKepler = targetExplorerId?.includes('kepler');
  const distanceKm = isMoon ? 384400 : isKepler ? 151000000 : 225000000;
  const lightTravelTimeSec = isMoon ? 1.28 : isKepler ? 504 : 750;

  // Fallback responses tailored strictly to our 4 equipments
  const fallbackRepliesEn: Record<string, string> = {
    'apollo12-alsep': `Carrier wave locked! Greetings ${from} from Oceanus Procellarum! My SNAP-27 nuclear generator powered moonquake and solar-wind measurements across nearly eight years (1969–1977). The Moon remembers every vibration! — Apollo 12 ALSEP (1969-099C)`,
    surveyor3: `Lunar downlink established! Hello ${from} from Surveyor Crater! I bounced twice before landing in 1967, dug four lunar soil trenches, and welcomed Apollo 12 astronauts in 1969. Thank you for beaming across 384,400 km! — Surveyor 3`,
    sojourner: `Beep-beep-chirp! Signal received at Ares Vallis! After Mars Pathfinder's airbags bounced to a stop on July 4, 1997, I rolled onto Mars for 83 Martian days of science. Hearing from ${from} makes my solar panel shine! — Sojourner`,
    kepler: `Starlight telemetry locked! Greetings ${from} from Earth-trailing heliocentric orbit! Over 9.6 years, I watched 150,000+ stars and confirmed over 2,600 exoplanets. Keep looking up at distant worlds! — Kepler Space Telescope`,
  };

  const fallbackRepliesUr: Record<string, string> = {
    'apollo12-alsep': `سگنل موصول ہوا! اوشینس پروسیلارم سے ${from} کو سلام! میرے SNAP-27 جنریٹر نے تقریباً آٹھ سال (1969–1977) تک چاند کے زلزلوں اور شمسی ہوا کی پیمائش کی۔ چاند ہر لرزش کو یاد رکھتا ہے! — اپالو 12 ایلسیپ (1969-099C)`,
    surveyor3: `قمری رابطہ قائم! سرویئر گڑھے سے ${from} کو سلام! میں 1967 میں دو بار اچھل کر اترا، مٹی کی چار نالیاں کھودیں، اور 1969 میں اپالو 12 کے خلا نوردوں کا استقبال کیا۔ 384,400 کلومیٹر دور سے پیغام بھیجنے کا شکریہ! — سرویئر 3`,
    sojourner: `بیپ بیپ! ایرس ویلس میں سگنل مل گیا! 4 جولائی 1997 کو مارس پاتھ فائنڈر کے ایئر بیگز رکنے کے بعد، میں نے 83 مریخی دن سائنس کی تحقیق کی۔ ${from} کا پیغام سن کر میرا سولر پینل چمک اٹھا! — سوجرنر`,
    kepler: `ستاروں کی روشنی سے رابطہ قائم! شمسی مدار سے ${from} کو سلام! 9.6 سالوں میں میں نے 150,000+ ستاروں کو دیکھا اور 2,600 سے زیادہ بیرونی سیاروں کی تصدیق کی۔ دور دراز دنیاؤں کی طرف دیکھتے رہیں! — کیپلر خلائی دوربین`,
  };

  const defaultReply =
    (lang === 'ur' ? fallbackRepliesUr[targetExplorerId] : fallbackRepliesEn[targetExplorerId]) ||
    (lang === 'ur'
      ? `ناسا ڈیپ اسپیس نیٹ ورک کے ذریعے پیغام موصول ہوا! سلام ${from}! آپ کا پیغام خلا کے پار ${name} تک پہنچ گیا۔ خلا ہر کھوجی کو یاد رکھتا ہے!`
      : `Transmission acknowledged through NASA Deep Space Network! Hello ${from}! Your message echoed across space to ${name}. Space remembers every explorer!`);

  if (!ai) {
    res.json({
      reply: defaultReply,
      distanceKm,
      lightTravelTimeSec,
      frequency: 'X-Band 8.4 GHz (DSN Goldstone Station)',
      timestamp: new Date().toISOString(),
      source: 'offline-dsn',
    });
    return;
  }

  try {
    const languageInstruction =
      lang === 'ur'
        ? 'Write the entire reply in natural, warm, expressive Urdu script (اردو).'
        : 'Write the reply in English.';

    const prompt = `You are the NASA spacecraft or scientific equipment "${name}".
An Earthling named "${from}" just beamed the following radio message across space to you:
"${message}"

${languageInstruction}
Write an authentic, heartwarming, first-person radio transmission reply from you back to Earth.
Include:
1. Mention receiving their transmission through the Deep Space Network.
2. A warm, friendly acknowledgment of what they said.
3. A real historical detail about your destination (The Moon, Mars, or Earth-trailing heliocentric orbit), your equipment, or your mission legacy.
4. Sign off with your mission callsign.
Keep the response under 70 words so it reads like an interplanetary radio teletype.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
    });

    const reply = response.text || defaultReply;

    res.json({
      reply,
      distanceKm,
      lightTravelTimeSec,
      frequency: 'X-Band 8.4 GHz (DSN Goldstone Station 14)',
      timestamp: new Date().toISOString(),
      source: 'gemini-ai',
    });
  } catch (err) {
    console.error('Error generating space message reply:', err);
    res.json({
      reply: defaultReply,
      distanceKm,
      lightTravelTimeSec,
      frequency: 'X-Band 8.4 GHz',
      timestamp: new Date().toISOString(),
      source: 'fallback',
    });
  }
});

// 3. TEXT-TO-SPEECH ENDPOINT (English & Urdu natural narration via Gemini TTS)
const ttsCache = new Map<string, string>();
const MAX_TTS_CACHE = 150;

app.post('/api/tts', async (req: Request, res: Response) => {
  const { text, language, voiceName } = req.body;
  const lang = language === 'ur' ? 'ur' : 'en';

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  if (!ai) {
    res.status(503).json({ error: 'TTS service unavailable without GEMINI_API_KEY', fallback: true });
    return;
  }

  const trimmedText = text.trim().slice(0, 1500);
  const selectedVoice =
    typeof voiceName === 'string' && ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'].includes(voiceName)
      ? voiceName
      : lang === 'ur'
      ? 'Kore'
      : 'Zephyr';

  const cacheKey = `${lang}:${selectedVoice}:${trimmedText}`;
  const cached = ttsCache.get(cacheKey);
  if (cached) {
    res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style:
                  lang === 'ur'
                    ? 'Warm, expressive Urdu storybook narrator for children, clear and natural Urdu pronunciation'
                    : 'Warm, friendly, engaging English storybook narrator for children',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(502).json({ error: 'No audio generated', fallback: true });
      return;
    }

    if (ttsCache.size >= MAX_TTS_CACHE) {
      const oldestKey = ttsCache.keys().next().value;
      if (oldestKey) ttsCache.delete(oldestKey);
    }
    ttsCache.set(cacheKey, base64Audio);

    res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', cached: false });
  } catch (error) {
    console.error('Error generating TTS audio:', error);
    res.status(500).json({ error: 'Failed to synthesize speech', fallback: true });
  }
});

// Health check endpoints for Cloud Run / preview proxies
app.get(['/api/health', '/healthz'], (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Mount Vite or serve static files
async function startServer() {
  app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

  const distDir = path.join(__dirname, 'dist');
  const distIndexPath = path.join(distDir, 'index.html');
  const hasProdBuild = fs.existsSync(distIndexPath);

  if (process.env.NODE_ENV !== 'production' || !hasProdBuild) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(distIndexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Astriva full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
