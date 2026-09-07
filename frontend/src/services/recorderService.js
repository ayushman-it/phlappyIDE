// Screen & Studio Recorder Service with HTML5 Audio Stream Capture & Pure AI Audio
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

      // 1. Capture Display Screen / Window / Tab (Video + Tab System Audio)
      this.displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          cursor: 'always',
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true
      });

      // 2. Collect Audio Tracks: Tab Audio + Dedicated AI Audio Destination Track
      const audioTracks = [];

      // Add Display Tab Audio if provided by user selection
      const displayAudioTracks = this.displayStream.getAudioTracks();
      if (displayAudioTracks.length > 0) {
        audioTracks.push(...displayAudioTracks);
      }

      // Add Dedicated AI Audio Track from AIAudioService (Web Audio Destination)
      const aiTrack = aiAudioService.getAudioTrack();
      if (aiTrack) {
        audioTracks.push(aiTrack);
      }

      // NOTE: We intentionally DO NOT request navigator.mediaDevices.getUserMedia (Microphone).
      // This guarantees ZERO external ambient/room noise ("bahar ka audio nahi") is recorded.

      // 3. Create combined stream for recording
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

      this.mediaRecorder = new MediaRecorder(this.combinedStream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveRecording();
        this.cleanup();
        useStudioStore.getState().setIsRecording(false);
      };

      // Handle user manually stopping screen share via browser UI banner
      const videoTrack = this.displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          if (this.isRecording) {
            this.stopRecording();
          }
        };
      }

      this.mediaRecorder.start(1000); // Collect 1s data slices
      this.isRecording = true;

      if (onTick) {
        this.timerInterval = setInterval(() => {
          this.secondsRecorded++;
          onTick(this.secondsRecorded);
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

    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
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
