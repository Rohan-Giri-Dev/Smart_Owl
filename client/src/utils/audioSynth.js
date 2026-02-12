// Basic Synth for Makey Makey Arcade
// Uses Web Audio API to generate sounds without external assets

const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

let audioCtx;

export const initAudio = () => {
  if (!audioCtx) audioCtx = createAudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
};

// --- Piano / Synth Sounds ---
// Generates a tone with a slight decay
export const playNote = (frequency, type = 'triangle', duration = 0.5) => {
  if (!audioCtx) initAudio();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

// --- Drum Sounds ---

// Kick: Low frequency sine sweep
export const playKick = () => {
  if (!audioCtx) initAudio();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
};

// Snare: White noise + Triangle sweep
export const playSnare = () => {
  if (!audioCtx) initAudio();

  // Noise
  const bufferSize = audioCtx.sampleRate * 0.5; // 0.5s
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(1, audioCtx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);

  // Oscillator snap
  const osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  const oscGain = audioCtx.createGain();
  osc.frequency.setValueAtTime(100, audioCtx.currentTime);
  oscGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);

  noise.start();
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
  noise.stop(audioCtx.currentTime + 0.2);
};

// Hi-Hat: High pass noise
export const playHiHat = () => {
    if (!audioCtx) initAudio();
    
    const bufferSize = audioCtx.sampleRate * 0.1;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 10000;
    
    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
    noise.stop(audioCtx.currentTime + 0.05);
};

// Tom: Mid freq sweep
export const playTom = () => {
    if (!audioCtx) initAudio();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
  
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
  
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
    osc.connect(gain);
    gain.connect(audioCtx.destination);
  
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  };
