// audio.js
import { PitchDetector } from "https://esm.sh/pitchy@4";

export class AudioHandler {
  constructor(onPitchDetected) {
    this.onPitchDetected = onPitchDetected;
    this.audioContext = null;
    this.analyser = null;
    this.detector = null;
    this.inputArray = null;
    this.running = false;
    this.source = null;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048; // good balance of speed/accuracy
      
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
      
      this.detector = PitchDetector.forFloat32Array(this.analyser.fftSize);
      this.inputArray = new Float32Array(this.detector.inputLength);
      
      this.running = true;
      this.updatePitch();
      return true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      return false;
    }
  }

  stop() {
    this.running = false;
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  updatePitch = () => {
    if (!this.running) return;

    this.analyser.getFloatTimeDomainData(this.inputArray);
    const [pitch, clarity] = this.detector.findPitch(this.inputArray, this.audioContext.sampleRate);
    
    // Only trust somewhat clear signals (cello overtones can confuse algorithms, 
    // but MPM is robust. 0.8 is a decent clarity threshold, but let's use 0.7 for now)
    if (clarity > 0.7 && pitch > 50 && pitch < 1200) {
      this.onPitchDetected(pitch, clarity);
    } else {
       // Optional: pass null when quiet/unclear
       this.onPitchDetected(null, null);
    }

    requestAnimationFrame(this.updatePitch);
  }
}

// Math Utility: Calculate Cents between two frequencies
export function getCents(detectedHz, targetHz) {
  return Math.round(1200 * Math.log2(detectedHz / targetHz));
}
