import { Instrument, InstrumentConfig, Note } from "./Instrument";


export class Noise extends Instrument {
  private _oscillator: OscillatorNode;
  private isStarted = false;
  private volume = 0.2;
  constructor(config: InstrumentConfig) {
    super(config);

    this._oscillator = new OscillatorNode(this.audio.audioContext, {
      type: 'square',
    });
    this._oscillator.connect(this.gain);
  }

  noiseBuffer() {
    const context = this.audio.audioContext;
    const bufferSize = context.sampleRate;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
  
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  
    return buffer;
  }

  set frequency(frequency: number) {
    this._oscillator.frequency.value = frequency;
  }

  start(time: number) {
    if (!this.isStarted) {
      this._oscillator.start(0);
      this.isStarted = true;
    }
    this.gain.gain.setTargetAtTime(this.volume, time, 0);
  }

  stop(time: number) {
    this.gain.gain.setTargetAtTime(0, time, 0);
  }

  playNote(note: Note, time: number): void {
    if (note.rest) return;
    const frequency = this.getFrequency(note);
    this.frequency = frequency;
    this.start(time);
    this.stop(time + note.noteLength);
  }

}

