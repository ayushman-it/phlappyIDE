// AI Speech Audio Service with ElevenLabs Voice Integration & Zero-Echo Audio Destination

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_fb75bb624ad286558e3c26f1198664922079c180091b2690';
// High Quality ElevenLabs Indian Male Accent Voice IDs (Rohan: bIHbv24MWmeMcoE5x698, Aarav: SOYueYiUtmM1II5vi7vi)
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'bIHbv24MWmeMcoE5x698'; // Rohan (Clear Indian Male Accent)
const ELEVENLABS_FALLBACK_VOICE = 'SOYueYiUtmM1II5vi7vi'; // Aarav (Smooth Indian Accent Male)

class AIAudioService {
  constructor() {
    this.audioCtx = null;
    this.destination = null;
    this.masterGain = null;
    this.currentBufferSource = null;
    this.currentAudioElement = null;
    this.audioCache = new Map();
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.destination = this.audioCtx.createMediaStreamDestination();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 1.0;
        
        // Route masterGain to stream destination (for recorder) AND speakers
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
    if (this.currentBufferSource) {
      try {
        this.currentBufferSource.onended = null;
        this.currentBufferSource.stop(0);
        this.currentBufferSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentBufferSource = null;
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement.onended = null;
        this.currentAudioElement.onerror = null;
      } catch (e) {
        // ignore
      }
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  async playSpeech(rawText, onPauseCheck = null) {
    if (!rawText || !rawText.trim()) return;

    this.init();
    // Stop any ongoing speech immediately to eliminate overlapping/double sound
    this.stopCurrentSpeech();

    // Clean text thoroughly for ultra-smooth natural human speech without reading symbols
    const cleanedText = rawText
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/[\#\*\_\~\>\`\[\]\(\)\{\}\\\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    // Split text into smooth natural speech blocks (150-200 chars for fluid ElevenLabs intonation)
    const sentences = cleanedText.split(/(?<=[.!?\n।])\s+/).map(s => s.trim()).filter(Boolean);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + ' ' + sentence).length <= 200) {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    if (chunks.length === 0) chunks.push(cleanedText);

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
          this.currentBufferSource = null;
          this.currentAudioElement = null;
          resolve();
        }
      };

      // 1. Attempt Smooth ElevenLabs Voice TTS via Web Audio API
      this.speakElevenLabs(text, ELEVENLABS_VOICE_ID)
        .then(() => safeResolve())
        .catch((err1) => {
          console.warn('ElevenLabs Primary Voice failed, trying fallback voice...', err1);
          if (onPauseCheck && onPauseCheck()) { safeResolve(); return; }

          this.speakElevenLabs(text, ELEVENLABS_FALLBACK_VOICE)
            .then(() => safeResolve())
            .catch((err2) => {
              console.warn('ElevenLabs Fallback Voice failed, trying Google TTS...', err2);
              if (onPauseCheck && onPauseCheck()) { safeResolve(); return; }

              // 2. Attempt Google Translate TTS Fallback
              this.speakGoogleTTS(text, safeResolve, () => {
                if (onPauseCheck && onPauseCheck()) { safeResolve(); return; }

                // 3. Attempt Web Speech API Fallback
                this.speakWebSpeechFallback(text).then(safeResolve);
              });
            });
        });
    });
  }

  async speakElevenLabs(text, voiceId) {
    const cacheKey = `${voiceId}:${text}`;
    let arrayBuffer;

    if (this.audioCache.has(cacheKey)) {
      arrayBuffer = this.audioCache.get(cacheKey).slice(0);
    } else {
      if (!ELEVENLABS_API_KEY) throw new Error('No ElevenLabs API Key configured');

      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.50,        // Natural human mentor warmth & smooth voice stability
            similarity_boost: 0.75, // Natural Hindi/English balance
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API Error (${response.status}): ${errText}`);
      }

      arrayBuffer = await response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Empty audio buffer received from ElevenLabs');
      }

      // Maintain up to 50 audio buffers in cache
      if (this.audioCache.size >= 50) {
        const firstKey = this.audioCache.keys().next().value;
        this.audioCache.delete(firstKey);
      }
      this.audioCache.set(cacheKey, arrayBuffer.slice(0));
    }

    return new Promise((resolve, reject) => {
      this.init();
      if (!this.audioCtx) return reject(new Error('AudioContext unavailable'));

      this.audioCtx.decodeAudioData(
        arrayBuffer,
        (decodedBuffer) => {
          try {
            // Create single Web Audio BufferSource Node connected directly to masterGain
            const source = this.audioCtx.createBufferSource();
            source.buffer = decodedBuffer;
            source.connect(this.masterGain);

            this.currentBufferSource = source;
            source.onended = () => {
              this.currentBufferSource = null;
              resolve();
            };
            source.start(0);
          } catch (e) {
            reject(e);
          }
        },
        (decodeErr) => reject(decodeErr)
      );
    });
  }

  speakGoogleTTS(text, safeResolve, onFail) {
    const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=hi&client=tw-ob`;

    const audio = new Audio(primaryUrl);
    audio.playbackRate = 0.95;
    this.currentAudioElement = audio;

    audio.onended = () => {
      this.currentAudioElement = null;
      safeResolve();
    };
    audio.onerror = () => onFail();

    audio.play().catch(() => onFail());
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
      const maleVoice = voices.find(
        (v) =>
          (v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('India')) &&
          (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('george'))
      ) || voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'));

      if (maleVoice) utterance.voice = maleVoice;
      utterance.rate = 0.9;
      utterance.pitch = 0.85; // Male vocal pitch tuning

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const aiAudioService = new AIAudioService();
