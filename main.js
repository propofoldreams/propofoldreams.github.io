// main.js
import { generateScale } from "./scale-generator.js";
import { AudioHandler, getCents } from "./audio.js";
import { Scorer } from "./scorer.js";

const setupPanel = document.getElementById("setup-panel");
const tunerPanel = document.getElementById("tuner-panel");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const micStatus = document.getElementById("mic-status");

const targetHzEl = document.getElementById("target-hz");
const centsDisplayEl = document.getElementById("cents-display");
const statusLabelEl = document.getElementById("status-label");
const needleEl = document.getElementById("tuner-needle");
const detectedPitchEl = document.getElementById("current-played-note");

let audioHandler = null;
let currentScorer = null;

startBtn.addEventListener("click", async () => {
  const rootNote = document.getElementById("scale-root").value;
  const type = document.getElementById("scale-type").value;
  const octaves = parseInt(document.getElementById("scale-octaves").value);

  const { abc, noteSequence } = generateScale(rootNote, type, octaves);

  // Render sheet music
  window.ABCJS.renderAbc("sheet-music", abc, {
    responsive: "resize",
    add_classes: true // important for coloring notes
  });

  // Init Audio
  micStatus.textContent = "Requesting microphone...";
  micStatus.style.color = "var(--text-primary)";
  
  if (!audioHandler) {
    audioHandler = new AudioHandler(handlePitchDetection);
  }
  
  const success = await audioHandler.start();
  if (success) {
    // Setup UI
    document.getElementById("current-scale-display").textContent = `${rootNote} ${type} (${octaves} Octave${octaves>1?'s':''})`;
    setupPanel.classList.remove("active");
    tunerPanel.classList.add("active");
    
    // Initialize Scorer
    currentScorer = new Scorer(noteSequence, {
      onTargetChanged: (targetNote) => {
        targetHzEl.textContent = targetNote.freq.toFixed(1);
        statusLabelEl.textContent = `Awaiting ${targetNote.name}`;
      },
      onNoteUpdate: (targetNote, avgCents) => {
        centsDisplayEl.textContent = `${avgCents > 0 ? '+' : ''}${avgCents} cents`;
        detectedPitchEl.textContent = targetNote.name;
        
        // update needle
        let clamped = Math.max(-50, Math.min(50, avgCents));
        needleEl.style.transform = `translateX(-50%) translateX(${clamped * 2}px)`;
        
        // live colors
        needleEl.className = "tuner-needle";
        if (avgCents < -15) needleEl.classList.add("needle-flat");
        else if (avgCents > 15) needleEl.classList.add("needle-sharp");
        else needleEl.classList.add("needle-perfect");

        statusLabelEl.textContent = "Holding...";
      },
      onPitchLost: () => {
        centsDisplayEl.textContent = "-- cents";
        detectedPitchEl.textContent = "--";
        needleEl.style.transform = `translateX(-50%)`;
        needleEl.className = "tuner-needle";
        statusLabelEl.textContent = "Waiting to play";
      },
      onNoteLocked: (noteIndex, finalCents, colorClass) => {
        // Color the note on the sheet music
        const noteElements = document.querySelectorAll(".abcjs-note");
        if (noteElements[noteIndex]) {
          const colorHex = colorClass.includes("perfect") ? "var(--color-perfect)" : 
                           colorClass.includes("sharp") ? "var(--color-sharp)" : "var(--color-flat)";
          
          noteElements[noteIndex].style.fill = colorHex;
          
          // Add a cent label visually above/below the note if possible, 
          // or at least give visual feedback
          noteElements[noteIndex].style.transition = "fill 0.5s ease";
        }
      },
      onCompletion: (history) => {
        audioHandler.stop();
        statusLabelEl.textContent = "Scale Complete!";
        targetHzEl.textContent = "Done";
      }
    });

    // Start with the first note
    currentScorer.currentIndex = 0;
    currentScorer.ui.onTargetChanged(noteSequence[0]);

  } else {
    micStatus.textContent = "Microphone access denied.";
    micStatus.style.color = "var(--color-flat)";
  }
});

backBtn.addEventListener("click", () => {
  if (audioHandler) audioHandler.stop();
  tunerPanel.classList.remove("active");
  setupPanel.classList.add("active");
  currentScorer = null;
});

function handlePitchDetection(pitchFreq, clarity) {
  if (currentScorer && pitchFreq) {
    currentScorer.processPitch(pitchFreq);
  } else if (currentScorer) {
    currentScorer.processPitch(null);
  }
}
