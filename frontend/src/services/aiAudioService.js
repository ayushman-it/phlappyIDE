// AI Speech Audio Service with ElevenLabs Voice Integration & Pure Web Audio Destination

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
        this.currentBufferSource.stop();
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
    this.stopCurrentSpeech();

    const cleanedText = rawText
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/[\#\*\_\~\>\`\[\]\(\)\{\}\\\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    // Split text into chunks suitable for speech synthesis
    const chunks = cleanedText.match(/.{1,180}(?:\s+|$)/g) || [cleanedText];

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

      // 1. Attempt ElevenLabs Voice TTS via Web Audio API
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

      // Safety timeout per speech chunk (12 seconds max)
      setTimeout(safeResolve, 12000);
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
          stability: 0.5,
          similarity_boost: 0.75,
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
            const source = this.audioCtx.createBufferSource();
            source.buffer = decodedBuffer;
            source.connect(this.masterGain);

            this.currentBufferSource = source;
            source.onended = () => resolve();
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

    if (this.audioCtx && this.masterGain) {
      try {
        const source = this.audioCtx.createMediaElementSource(audio);
        source.connect(this.masterGain);
      } catch (e) {
        // ignore if already connected
      }
    }

    audio.onended = safeResolve;
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
