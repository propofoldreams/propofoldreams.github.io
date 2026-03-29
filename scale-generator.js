// scale-generator.js

// Map of chromatic steps. Index 0 is C2 (Lowest Cello String).
// MIDI note for C2 is 36.
const chromaticSteps = [
  "C,", "^C,", "D,", "^D,", "E,", "F,", "^F,", "G,", "^G,", "A,", "^A,", "B,", // 0 - 11 (C2 - B2)
  "C",  "^C",  "D",  "^D",  "E",  "F",  "^F",  "G",  "^G",  "A",  "^A",  "B",  // 12 - 23 (C3 - B3)
  "c",  "^c",  "d",  "^d",  "e",  "f",  "^f",  "g",  "^g",  "a",  "^a",  "b",  // 24 - 35 (C4 - B4)
  "c'", "^c'", "d'", "^d'", "e'", "f'", "^f'", "g'", "^g'", "a'", "^a'", "b'"  // 36 - 47 (C5 - B5)
];

const noteNames = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

// Flat mappings for specific keys might be correct musically,
// but for an MVP, sharp mappings are sufficient to generate playback.
// Advanced: Use proper enharmonic spellings based on key signature.

export function generateScale(rootNoteName, type, octaves) {
  // Find index of root note in the lowest possible octave (Octave 2 or 3)
  let rootIndexBase = noteNames.indexOf(rootNoteName);
  
  // Cello lowest note is C2 (index 0).
  // Root index should start from the lowest available note >= 0.
  let startIndex = rootIndexBase;
  // If we are looking for A, B, etc., they naturally fall above C.
  
  const intervals = {
    "major": [2, 2, 1, 2, 2, 2, 1],
    "minor": [2, 1, 2, 2, 2, 2, 1] // Melodic minor ascending
  }[type];

  let currentStep = startIndex;
  let notes = [];
  let abcString = "";

  for (let o = 0; o < octaves; o++) {
    for (let i = 0; i < 7; i++) {
        notes.push(getNoteData(currentStep));
        abcString += chromaticSteps[currentStep] + " ";
        currentStep += intervals[i];
    }
  }
  // Add the final root note at the top
  notes.push(getNoteData(currentStep));
  abcString += chromaticSteps[currentStep];

  // Build full ABC notation wrapper
  // K: {root}{type} determines key signature but we just use C and write accidentals explicitly for simplicity in MVP, 
  // or use the correct Key and omit accidentals. 
  // Actually, explicitly writing accidentals and setting Key to C is visually less elegant but easier to compute.
  // Wait, if we set K:C we need accidentals, which we provided (e.g., ^F).
  // Let's just output Key: C and all accidentals explicitly.
  const typeStr = type === 'minor' ? 'm' : '';
  const keySig = `${rootNoteName.replace('#', '#')}${typeStr}`; // e.g. C, Dm, F#

  const fullAbc = `
X:1
T:${rootNoteName} ${type.charAt(0).toUpperCase() + type.slice(1)} Scale
M:4/4
L:1/4
K:C
V:1 clef=bass
${abcString} |]
  `.trim();

  return { abc: fullAbc, noteSequence: notes };
}

function getNoteData(stepIndex) {
  const midiNote = 36 + stepIndex; // C2 = 36
  const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
  const name = noteNames[stepIndex % 12];
  
  return {
    abc: chromaticSteps[stepIndex],
    midi: midiNote,
    freq: freq,
    name: name
  };
}
