// AI Speech Audio Service with ElevenLabs Voice Integration & Zero-Echo Audio Destination

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
// High Quality Multilingual Voice IDs (George: JBFqnCBsd6RMkjVDRZzb, Jessica: cgSgspJ2msm6clMCkdW9)
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const ELEVENLABS_FALLBACK_VOICE = 'cgSgspJ2msm6clMCkdW9';

class AIAudioService {
  constructor() {
    this.audioCtx = null;
    this.destination = null;
    this.masterGain = null;
    this.currentBufferSource = null;
    this.currentAudioElement = null;
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

    // Split text into smooth chunks (max 200 chars for optimal pacing)
    const chunks = cleanedText.match(/.{1,200}(?:\s+|$)/g) || [cleanedText];

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
          stability: 0.70,        // Smooth, stable mentor tone
          similarity_boost: 0.80, // High clarity & crisp pronunciation
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs API Error (${response.status}): ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Empty audio buffer received from ElevenLabs');
    }

    return new Promise((resolve, reject) => {
      this.init();
      if (!this.audioCtx) return reject(new Error('AudioContext unavailable'));

      this.audioCtx.decodeAudioData(
        arrayBuffer,
        (decodedBuffer) => {
          try {
            // Create single Web Audio BufferSource Node connected directly to masterGain
            // This outputs to speakers AND recorder stream without any double sound
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
