// Browser Web Audio synthetic sound effects & Web Speech API synthesis

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft organic page turn swoosh
  playPageTurn() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Filtered noise sweep simulating paper rustle
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);
      filter.Q.setValueAtTime(1.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.25);
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Soft resonant celestial chime for book opening
  playBookOpen() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Soft gentle rise sound when character stands on stage
  playCharacterRise() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Delicate chime on timeline marker click
  playMarkerClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Interplanetary radio transmission burst (DSN Uplink)
  playTransmissionBeep() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Telemetry frequency sweep (chirp)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Incoming interplanetary reply chime
  playIncomingTransmission() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Dramatic cosmic "flashhh boom" sound effect when ticket materializes
  playFlashBoom() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Sub-bass impact boom drop (150Hz -> 36Hz)
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(150, now);
      boomOsc.frequency.exponentialRampToValueAtTime(36, now + 0.48);

      boomGain.gain.setValueAtTime(0.01, now);
      boomGain.gain.linearRampToValueAtTime(0.32, now + 0.025);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      boomOsc.connect(boomGain);
      boomGain.connect(ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.68);

      // 2. Crisp cosmic flash noise burst (filtered whoosh)
      const bufferSize = Math.floor(ctx.sampleRate * 0.55);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.14));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.52);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.55);

      // 3. Radiant starburst harmonic chime as the ticket appears
      const shimmerFreqs = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6
      shimmerFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.045);

        gain.gain.setValueAtTime(0.001, now + 0.06 + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.055, now + 0.09 + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75 + idx * 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.06 + idx * 0.045);
        osc.stop(now + 0.8 + idx * 0.045);
      });
    } catch {
      // Audio errors are ignored gracefully
    }
  }

  // Cute robot assistant chirp
  playRobotChirp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6
      osc.frequency.setValueAtTime(1760.00, now + 0.14); // A6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio errors are ignored gracefully
    }
  }
}

export const soundFX = new SoundEngine();

export type SpeechLanguage = 'en' | 'ur';

// Speech Synthesis Helper (Bilingual: English & Urdu via Gemini TTS + Web Speech fallback)
export class SpeechNarrator {
  private utterance: SpeechSynthesisUtterance | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  private audioCache: Map<string, string> = new Map();
  private speakSessionId: number = 0;
  private isSpeakingInternal: boolean = false;

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || typeof Audio !== 'undefined');
  }

  public async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
    language: SpeechLanguage = 'en',
    onLoadingChange?: (loading: boolean) => void
  ) {
    if (!this.isAvailable() || !text.trim()) {
      onError?.();
      return;
    }

    this.stop();
    const sessionId = ++this.speakSessionId;

    if (language === 'ur') {
      const playedServerTts = await this.speakViaServerTts(
        text,
        'ur',
        sessionId,
        onStart,
        onEnd,
        onLoadingChange
      );
      if (playedServerTts || sessionId !== this.speakSessionId) {
        return;
      }
      // Fallback to Web Speech API if server TTS unavailable
      this.speakViaWebSpeech(text, 'ur', sessionId, onStart, onEnd, onError);
      return;
    }

    // English: use browser Web Speech if an English voice is installed, otherwise server TTS
    const synthVoices =
      typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.getVoices()
        : [];
    const hasEnVoice = synthVoices.some((v) => v.lang.toLowerCase().startsWith('en'));

    if (hasEnVoice || typeof window === 'undefined') {
      this.speakViaWebSpeech(text, 'en', sessionId, onStart, onEnd, onError);
    } else {
      const playedServerTts = await this.speakViaServerTts(
        text,
        'en',
        sessionId,
        onStart,
        onEnd,
        onLoadingChange
      );
      if (!playedServerTts && sessionId === this.speakSessionId) {
        this.speakViaWebSpeech(text, 'en', sessionId, onStart, onEnd, onError);
      }
    }
  }

  private async speakViaServerTts(
    text: string,
    language: SpeechLanguage,
    sessionId: number,
    onStart?: () => void,
    onEnd?: () => void,
    onLoadingChange?: (loading: boolean) => void
  ): Promise<boolean> {
    const cacheKey = `${language}:${text.trim()}`;
    let objectUrl = this.audioCache.get(cacheKey);

    if (!objectUrl) {
      const controller = new AbortController();
      this.abortController = controller;
      onLoadingChange?.(true);

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language }),
          signal: controller.signal,
        });

        if (!res.ok) {
          onLoadingChange?.(false);
          return false;
        }

        const data = await res.json();
        if (!data?.audioBase64 || sessionId !== this.speakSessionId) {
          onLoadingChange?.(false);
          return false;
        }

        const byteChars = atob(data.audioBase64);
        const byteNumbers = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: data.mimeType || 'audio/wav' });
        objectUrl = URL.createObjectURL(blob);

        if (this.audioCache.size >= 100) {
          const oldestKey = this.audioCache.keys().next().value;
          if (oldestKey) {
            const oldUrl = this.audioCache.get(oldestKey);
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            this.audioCache.delete(oldestKey);
          }
        }
        this.audioCache.set(cacheKey, objectUrl);
      } catch {
        onLoadingChange?.(false);
        return false;
      } finally {
        if (this.abortController === controller) {
          this.abortController = null;
        }
      }
      onLoadingChange?.(false);
    }

    if (sessionId !== this.speakSessionId || !objectUrl) {
      return false;
    }

    try {
      const audio = new Audio(objectUrl);
      this.audioEl = audio;

      audio.onplay = () => {
        if (sessionId !== this.speakSessionId) return;
        this.isSpeakingInternal = true;
        onStart?.();
      };

      audio.onended = () => {
        if (this.audioEl === audio) {
          this.audioEl = null;
        }
        this.isSpeakingInternal = false;
        if (sessionId === this.speakSessionId) {
          onEnd?.();
        }
      };

      audio.onerror = () => {
        if (this.audioEl === audio) {
          this.audioEl = null;
        }
        this.isSpeakingInternal = false;
      };

      await audio.play();
      return true;
    } catch {
      this.audioEl = null;
      this.isSpeakingInternal = false;
      return false;
    }
  }

  private speakViaWebSpeech(
    text: string,
    language: SpeechLanguage,
    sessionId: number,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.();
      return;
    }

    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      this.utterance = utterance;

      const voices = synth.getVoices();
      if (language === 'ur') {
        utterance.lang = 'ur-PK';
        const urduVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ur'));
        if (urduVoice) {
          utterance.voice = urduVoice;
        }
        utterance.pitch = 1.0;
        utterance.rate = 0.92;
      } else {
        utterance.lang = 'en-US';
        const naturalVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Victoria') ||
                v.name.includes('Google US English') ||
                v.name.includes('Daniel'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (naturalVoice) {
          utterance.voice = naturalVoice;
        }
        utterance.pitch = 1.05;
        utterance.rate = 0.95;
      }

      utterance.onstart = () => {
        if (sessionId !== this.speakSessionId) return;
        this.isSpeakingInternal = true;
        onStart?.();
      };

      utterance.onend = () => {
        if (sessionId !== this.speakSessionId) return;
        this.isSpeakingInternal = false;
        this.utterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeakingInternal = false;
        this.utterance = null;
        if (e.error !== 'interrupted' && e.error !== 'canceled' && sessionId === this.speakSessionId) {
          onError?.();
        }
      };

      synth.speak(utterance);
    } catch {
      this.isSpeakingInternal = false;
      onError?.();
    }
  }

  public stop() {
    this.speakSessionId++;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch {
        // Ignore
      }
      this.audioEl = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.isSpeakingInternal = false;
    this.utterance = null;
  }

  public pause() {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
      } catch {
        // Ignore
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Ignore
      }
    }
  }

  public resume() {
    if (this.audioEl) {
      try {
        this.audioEl.play().catch(() => {});
      } catch {
        // Ignore
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // Ignore
      }
    }
  }

  public isSpeaking(): boolean {
    if (this.audioEl && !this.audioEl.paused) return true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking || this.isSpeakingInternal;
    }
    return this.isSpeakingInternal;
  }
}

export const speechNarrator = new SpeechNarrator();
