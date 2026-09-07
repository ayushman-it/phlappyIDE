// AI Speech Audio Service with Web Audio Destination & Clean Stream Capture

class AIAudioService {
  constructor() {
    this.audioCtx = null;
    this.destination = null;
    this.masterGain = null;
    this.currentAudio = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.destination = this.audioCtx.createMediaStreamDestination();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.destination);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch((e) => console.warn('AudioContext resume error:', e));
    }
  }

  getAudioTrack() {
    this.init();
    if (this.destination && this.destination.stream) {
      const tracks = this.destination.stream.getAudioTracks();
      if (tracks.length > 0) return tracks[0];
    }
    return null;
  }

  stopCurrentSpeech() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  async playSpeech(rawText, onPauseCheck = null) {
    if (!rawText || !rawText.trim()) return;

    this.init();
    this.stopCurrentSpeech();

    const cleanedText = rawText
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/[\#\*\_\~\>\`\[\]\(\)\{\}\\\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    const chunks = cleanedText.match(/.{1,160}(?:\s+|$)/g) || [cleanedText];

    for (const chunk of chunks) {
      const textToSpeak = chunk.trim();
      if (!textToSpeak) continue;
      if (onPauseCheck && onPauseCheck()) break;

      await this.speakChunk(textToSpeak, onPauseCheck);
    }
  }

  speakChunk(text, onPauseCheck) {
    return new Promise((resolve) => {
      let isResolved = false;
      const safeResolve = () => {
        if (!isResolved) {
          isResolved = true;
          this.currentAudio = null;
          resolve();
        }
      };

      const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=hi&client=tw-ob`;
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;

      const playAudioUrl = (url, onFail) => {
        // Do NOT set crossOrigin = 'anonymous' because translate.google.com does not include CORS header.
        // Plain HTML5 Audio element plays clearly through tab audio & speakers.
        const audio = new Audio(url);
        audio.playbackRate = 0.95;
        this.currentAudio = audio;

        // Route through AudioContext if possible
        if (this.audioCtx && this.masterGain) {
          try {
            const source = this.audioCtx.createMediaElementSource(audio);
            source.connect(this.masterGain);
          } catch (e) {
            // If already connected or cross-origin restricted, Audio element still plays to default output
          }
        }

        audio.onended = safeResolve;
        audio.onerror = () => onFail();

        audio.play().catch(() => onFail());
      };

      // Attempt 1: Hindi Google TTS
      playAudioUrl(primaryUrl, () => {
        if (onPauseCheck && onPauseCheck()) {
          safeResolve();
          return;
        }
        // Attempt 2: English Google TTS
        playAudioUrl(fallbackUrl, () => {
          if (onPauseCheck && onPauseCheck()) {
            safeResolve();
            return;
          }
          // Attempt 3: Web Speech API Fallback
          this.speakWebSpeechFallback(text).then(safeResolve);
        });
      });

      // Safety timeout after 9 seconds per chunk
      setTimeout(safeResolve, 9000);
    });
  }

  speakWebSpeechFallback(text) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        setTimeout(resolve, 1500);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) =>
          v.lang.includes('hi-IN') ||
          v.lang.includes('en-IN') ||
          v.name.includes('Hindi') ||
          v.name.includes('India')
      );
      if (indianVoice) utterance.voice = indianVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const aiAudioService = new AIAudioService();
