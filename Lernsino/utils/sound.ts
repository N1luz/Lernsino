
export class SoundManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private nextNoteTime: number = 0;
  private musicTimer: number | null = null;
  
  // Expanded Vibe Generator Config
  private currentTrack: 'upbeat' | 'chill' | 'fast' | 'dark' | 'dreamy' | 'retro' = 'upbeat';
  private noteIndex: number = 0;

  constructor() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      if (this.context) {
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = 0.10; // Slightly lower background music
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.context.createGain();
        this.sfxGain.gain.value = 0.4;
        this.sfxGain.connect(this.masterGain);
      }
    } catch (e) {
      console.error('Web Audio API not supported');
    }
  }

  public init() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.context!.currentTime, 0.1);
    }
    if (!muted && !this.isMusicPlaying) {
      this.startMusic();
    } else if (muted) {
      this.stopMusic();
    }
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- SFX Generators ---

  public play(type: 'click' | 'correct' | 'wrong' | 'coin' | 'win' | 'flip' | 'tick' | 'legendary' | 'electric') {
    if (this.isMuted || !this.context || !this.sfxGain) return;
    this.init();

    const t = this.context.currentTime;

    switch (type) {
      case 'click':
        this.playTone(800, 'sine', 0.05, t, 0.05);
        break;
      
      case 'flip':
        this.playNoise(0.05, t);
        break;

      case 'tick':
         // Crisper tick sound
         this.playTone(1200, 'square', 0.02, t, 0.02);
         break;

      case 'correct':
        this.playTone(523.25, 'sine', 0.1, t, 0.1); // C5
        this.playTone(659.25, 'sine', 0.1, t + 0.05, 0.1); // E5
        this.playTone(783.99, 'sine', 0.2, t + 0.1, 0.1); // G5
        break;

      case 'wrong':
        this.playTone(150, 'sawtooth', 0.3, t, 0.2, 50);
        break;
        
      case 'coin':
        this.playTone(1200, 'sine', 0.1, t, 0.1);
        this.playTone(1800, 'sine', 0.4, t + 0.05, 0.05);
        break;

      case 'win':
        const speed = 0.1;
        this.playTone(523.25, 'square', speed, t, 0.1);
        this.playTone(523.25, 'square', speed, t + speed, 0.1);
        this.playTone(523.25, 'square', speed, t + speed*2, 0.1);
        this.playTone(659.25, 'square', speed*3, t + speed*3, 0.1);
        this.playTone(783.99, 'square', speed*3, t + speed*4, 0.1);
        break;
      
      case 'legendary':
        const now = t;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 1);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.5);
        
        osc.start(now);
        osc.stop(now + 1.5);
        break;

      case 'electric':
        const start = t;
        const dur = 2.5; // Duration of spin sound
        const oscE = this.context.createOscillator();
        const gainE = this.context.createGain();
        const lfo = this.context.createOscillator();
        const lfoGain = this.context.createGain();

        // Carrier
        oscE.type = 'sawtooth';
        oscE.frequency.setValueAtTime(50, start);
        oscE.frequency.linearRampToValueAtTime(200, start + dur); // Rev up

        // LFO for "hum" texture
        lfo.type = 'square';
        lfo.frequency.value = 50;
        lfo.connect(lfoGain);
        lfoGain.gain.value = 500;
        lfoGain.connect(oscE.frequency);

        // Volume Envelope
        gainE.gain.setValueAtTime(0, start);
        gainE.gain.linearRampToValueAtTime(0.1, start + 0.5);
        gainE.gain.linearRampToValueAtTime(0, start + dur);

        oscE.connect(gainE);
        gainE.connect(this.sfxGain);
        
        oscE.start(start);
        lfo.start(start);
        oscE.stop(start + dur);
        lfo.stop(start + dur);
        break;
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number, vol: number, endFreq?: number) {
    if (!this.context || !this.sfxGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq) {
      osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
    }

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playNoise(duration: number, startTime: number) {
    if (!this.context || !this.sfxGain) return;
    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    noise.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(startTime);
  }

  // --- NCS-Style Procedural Music ---
  
  public startMusic() {
    if (this.isMusicPlaying || this.isMuted || !this.context) return;
    this.isMusicPlaying = true;
    this.nextNoteTime = this.context.currentTime;
    
    // Pick a random track style
    const styles: ('upbeat' | 'chill' | 'fast' | 'dark' | 'dreamy' | 'retro')[] = ['upbeat', 'chill', 'fast', 'dark', 'dreamy', 'retro'];
    this.currentTrack = styles[Math.floor(Math.random() * styles.length)];
    this.scheduleMusic();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) window.clearTimeout(this.musicTimer);
  }

  private scheduleMusic() {
    if (!this.isMusicPlaying || !this.context || !this.musicGain) return;

    const lookahead = 25.0; // ms
    const secondsPerBeat = 
        this.currentTrack === 'fast' ? 0.3 : 
        this.currentTrack === 'upbeat' ? 0.45 : 
        this.currentTrack === 'dark' ? 0.5 : 0.6;

    while (this.nextNoteTime < this.context.currentTime + 0.1) {
        this.playPattern(this.nextNoteTime, secondsPerBeat);
        this.nextNoteTime += secondsPerBeat;
        this.noteIndex++;
    }

    this.musicTimer = window.setTimeout(() => this.scheduleMusic(), lookahead);
  }

  private playPattern(time: number, beatDur: number) {
    if (!this.context || !this.musicGain) return;

    // Scales
    const scales = {
        major: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88], // C Major
        minor: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00], // A Minor
        pentatonic: [261.63, 293.66, 329.63, 392.00, 440.00] // C Pentatonic
    };
    
    const currentScale = 
        (this.currentTrack === 'upbeat' || this.currentTrack === 'dreamy') ? scales.major :
        this.currentTrack === 'chill' ? scales.pentatonic : scales.minor;

    // 16-step patterns (Indices into scale)
    const patterns = {
        upbeat: [0, 2, 4, 7, 5, 7, 4, 2, 0, 4, 7, 9, 7, 4, 2, 0],
        chill:  [0, -1, 4, -1, 2, -1, 4, -1, 5, -1, 4, -1, 2, -1, 0, -1], 
        fast:   [0, 0, 7, 7, 4, 4, 2, 2, 0, 2, 4, 5, 7, 5, 4, 2],
        dark:   [0, -1, 0, -1, 3, 2, -1, 0, -1, -1, 0, 1, 0, -1, -1, -1],
        dreamy: [0, 2, 4, 6, 4, 2, 0, -1, 4, 6, 8, 6, 4, -1, 0, -1],
        retro:  [0, 4, 7, 4, 0, 4, 7, 4, 0, 4, 7, 4, 0, 4, 7, 4] // Arpeggio style
    };

    const currentPattern = patterns[this.currentTrack] || patterns.upbeat;
    const step = this.noteIndex % 16;
    const noteIdx = currentPattern[step];

    if (noteIdx !== -1 && noteIdx !== undefined) {
        // Handle index overflow by wrapping or octaves
        const octave = Math.floor(noteIdx / currentScale.length);
        const baseFreq = currentScale[noteIdx % currentScale.length];
        const freq = baseFreq * Math.pow(2, octave);
        
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        // Sound Design based on track
        if (this.currentTrack === 'upbeat') osc.type = 'sawtooth';
        else if (this.currentTrack === 'fast') osc.type = 'square';
        else if (this.currentTrack === 'retro') osc.type = 'square'; 
        else if (this.currentTrack === 'dark') osc.type = 'sawtooth';
        else osc.type = 'triangle';

        osc.frequency.setValueAtTime(freq, time);
        
        // Envelope
        const attack = 0.02;
        const release = beatDur * (this.currentTrack === 'dreamy' ? 1.5 : 0.8);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.1, time + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, time + release);

        // Lowpass Filter
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        
        // Cutoff modulation
        const cutoff = this.currentTrack === 'dark' ? 300 : 500;
        filter.frequency.setValueAtTime(cutoff, time);
        filter.frequency.linearRampToValueAtTime(cutoff * 4, time + attack);
        filter.frequency.linearRampToValueAtTime(cutoff, time + release);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        
        osc.start(time);
        osc.stop(time + release);
    }

    // Kick Drum logic
    const kickBeats = (this.currentTrack === 'chill' || this.currentTrack === 'dreamy') ? [] : [0, 4, 8, 12];
    if (kickBeats.includes(step)) {
        this.playKick(time);
    }
  }

  private playKick(time: number) {
      if (!this.context || !this.musicGain) return;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(time);
      osc.stop(time + 0.5);
  }
}

export const soundManager = new SoundManager();
