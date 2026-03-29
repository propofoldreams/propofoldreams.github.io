// scorer.js
import { getCents } from "./audio.js";

export class Scorer {
  constructor(notes, uiCallbacks) {
    this.notes = notes;
    this.currentIndex = 0;
    this.ui = uiCallbacks;
    
    this.history = []; // store results
    this.activeCentsBuffer = []; // filter jitter
    
    // Timing logic for auto-advance
    this.holdStartTime = 0;
    this.holdThresholdMs = 800; // time to hold note to advance
    this.toleranceCents = 80;   // must be within 80 cents to be counted as "trying" this note.
  }

  processPitch(detectedPitchFreq) {
    if (this.currentIndex >= this.notes.length) return;
    
    const targetNote = this.notes[this.currentIndex];
    const targetFreq = targetNote.freq;

    if (!detectedPitchFreq) {
      this.resetHold();
      this.ui.onPitchLost();
      return;
    }

    const cents = getCents(detectedPitchFreq, targetFreq);

    // Filter extreme jumps
    if (Math.abs(cents) > this.toleranceCents) {
      this.resetHold();
      this.ui.onPitchLost();
      return;
    }

    // Add to smoothing buffer
    this.activeCentsBuffer.push(cents);
    if (this.activeCentsBuffer.length > 5) this.activeCentsBuffer.shift();
    
    const avgCents = Math.round(this.activeCentsBuffer.reduce((a,b)=>a+b,0) / this.activeCentsBuffer.length);
    
    this.ui.onNoteUpdate(targetNote, avgCents);

    // Check hold duration
    const now = Date.now();
    if (this.holdStartTime === 0) {
      this.holdStartTime = now;
    } else if (now - this.holdStartTime > this.holdThresholdMs) {
      // Note successfully held & completed!
      this.lockNote(avgCents);
    }
  }

  resetHold() {
    this.holdStartTime = 0;
    this.activeCentsBuffer = [];
  }

  lockNote(finalCents) {
    // Determine color class
    let colorClass = "needle-perfect";
    if (finalCents < -15) colorClass = "needle-flat";
    else if (finalCents > 15) colorClass = "needle-sharp";

    this.history.push({
      noteIndex: this.currentIndex,
      cents: finalCents,
      color: colorClass
    });

    this.ui.onNoteLocked(this.currentIndex, finalCents, colorClass);
    this.resetHold();
    this.currentIndex++;

    if (this.currentIndex >= this.notes.length) {
      this.ui.onCompletion(this.history);
    } else {
      setTimeout(() => {
        this.ui.onTargetChanged(this.notes[this.currentIndex]);
      }, 500); // short pause before demanding next note
    }
  }
}
