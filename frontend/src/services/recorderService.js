// Screen & Studio Recorder Service with Clean Audio Destination & Zero-Echo Guard
import { aiAudioService } from './aiAudioService';
import { useStudioStore } from '../store/studioStore';

class RecorderService {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.displayStream = null;
    this.combinedStream = null;
    this.isRecording = false;
    this.timerInterval = null;
    this.secondsRecorded = 0;
    this.lastLessonTitle = 'Phlappy_AI_Studio_Lesson';
  }

  async startRecording(onTick = null) {
    try {
      this.recordedChunks = [];
      this.secondsRecorded = 0;

      // 1. Capture Display Screen / Window / Tab (Video stream)
      this.displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          cursor: 'always',
          frameRate: { ideal: 30, max: 30 }
        },
        audio: true
      });

      // 2. Select Audio Track: Use ONLY AIAudioService track to eliminate double sound in recording!
      const audioTracks = [];
      const aiTrack = aiAudioService.getAudioTrack();

      if (aiTrack) {
        // Dedicated pure AI voice track from Web Audio Destination Node
        audioTracks.push(aiTrack);
      } else {
        // Fallback to display audio if AI track is unavailable
        const displayAudioTracks = this.displayStream.getAudioTracks();
        if (displayAudioTracks.length > 0) {
          audioTracks.push(...displayAudioTracks);
        }
      }

      // NOTE: Zero microphone (getUserMedia) is used to prevent ambient/room noise completely.

      // 3. Combine video + single pure audio track into MediaStream
      const tracksToRecord = [
        ...this.displayStream.getVideoTracks(),
        ...audioTracks
      ];

      this.combinedStream = new MediaStream(tracksToRecord);

      // Select best supported MIME type in current browser
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      this.mediaRecorder = new MediaRecorder(this.combinedStream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps fixed bitrate for smooth 1.0x real-time playback
        audioBitsPerSecond: 128000
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (errEvent) => {
        console.error('MediaRecorder error encountered:', errEvent);
        if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'paused') {
          try {
            this.mediaRecorder.resume();
          } catch (e) {
            console.warn('MediaRecorder resume failed:', e);
          }
        }
      };

      this.mediaRecorder.onpause = () => {
        if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'paused') {
          try {
            this.mediaRecorder.resume();
          } catch (e) {
            // ignore
          }
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveRecording();
        this.cleanup();
        useStudioStore.getState().setIsRecording(false);
      };

      // Guard video track: Stop only if user manually closes browser share bar
      const videoTrack = this.displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          if (this.isRecording && videoTrack.readyState === 'ended') {
            console.warn('Browser video track ended by user banner action');
            this.stopRecording();
          }
        };
      }

      this.mediaRecorder.start(250); // Collect 250ms data slices for accurate 1.0x WebM timestamp sync
      this.isRecording = true;

      if (onTick) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          if (this.isRecording) {
            this.secondsRecorded++;
            onTick(this.secondsRecorded);
          }
        }, 1000);
      }

      return true;
    } catch (err) {
      console.error('Screen recording start error:', err);
      this.cleanup();
      useStudioStore.getState().setIsRecording(false);
      throw err;
    }
  }

  stopRecording(customTitle = null) {
    if (!this.isRecording || !this.mediaRecorder) return;
    this.isRecording = false;

    if (customTitle) {
      this.lastLessonTitle = customTitle;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('Error calling mediaRecorder.stop():', e);
        this.cleanup();
      }
    }
  }

  saveRecording() {
    if (this.recordedChunks.length === 0) return;

    const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
    const blob = new Blob(this.recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);

    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const title = this.lastLessonTitle || 'Phlappy_AI_Studio_Lesson';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '_');
    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${timestamp}.${ext}`;

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  cleanup() {
    this.isRecording = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.displayStream) {
      this.displayStream.getTracks().forEach((track) => track.stop());
      this.displayStream = null;
    }
    this.combinedStream = null;
    this.mediaRecorder = null;
  }
}

export const recorderInstance = new RecorderService();
