const { Transport, Synth, AutoFilter, Gain, Destination, Sequence, Freeverb } = Tone;

let seq;

function invokeTone(){
    Tone.start();
}

function generateRandomAmbientPiece(){
    Destination.volume.value = -50;
    const { Transport, Sequence, Synth, Freeverb, PingPongDelay, Reverb, Gain } = Tone;

// Create a synthesizer with added effects
const synth = new Synth({
  oscillator: { type: 'sine' },
  envelope: {
    attack: 1,
    decay: 2,
    sustain: 0.5,
    release: 4,
  },
}).toDestination();

const synth2 = new Synth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 1,
      decay: 1,
      sustain: 0.3,
      release: 4,
    },
  }).toDestination();

// Create a freeverb reverb effect
const freeverb = new Freeverb().toDestination();

// Create a ping pong delay effect
const pingPongDelay = new PingPongDelay().toDestination();

// Create a gain node for volume control
const gain = new Gain(0.4).toDestination();

// Chain effects together
synth.connect(freeverb);
synth2.connect(freeverb); 
freeverb.connect(pingPongDelay);
pingPongDelay.connect(gain);

// Create a sequence of random notes
const noteArrays = [
  ['C5', 'D5', 'E5', 'F5', 'G5'],
  ['A4', 'B4', 'C4', 'D4', 'E4'],
  ['G4', 'A4', 'B4', 'C5', 'D5'],
  ['E5', 'F5', 'G5', 'A5', 'B5'],
];
 let array = [];
function randomNote() {
  array = noteArrays[Math.floor(Math.random() * noteArrays.length)];
  return array[Math.floor(Math.random() * array.length)];
}


function newSequence(){
    console.log('init new sequence')
     seq = new Sequence((time, note) => {
  synth.triggerAttackRelease(note, 1, time+0.1);
}, Array.from({ length: 8 }, () => randomNote())).start(0);
}

newSequence()
  
let seq2 = new Sequence((time, note) => {
    synth2.triggerAttackRelease(note, 0.8, time);
  }, Array.from({ length: 8 }, () => randomNote())).start(0);

// Start the transport
Transport.start();
}

// Start generating random music when you call this function.
function startRandomMusic() {
    Tone.start().then(() => {
        generateRandomAmbientPiece();
    });
  }
  
  // Stop the random music after a certain time (e.g., 2 minutes).
  function stopRandomMusic() {
    // setTimeout(() => Tone.Transport.stop(), 2 * 60 * 1000);
    Transport.cancel()
    Transport.stop()
    if (seq){
    seq.stop();
    }
  }
  
  // Start generating and stop after 2 minutes (you can change the duration).

export {startRandomMusic, stopRandomMusic, generateRandomAmbientPiece, invokeTone}