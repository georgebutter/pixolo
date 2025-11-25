import { Instrument, InstrumentConfig, Note } from "./Instrument";


export class Oscillator extends Instrument {
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

  set frequency(frequency: number) {
    this._oscillator.frequency.value = frequency;
  }

  start(time: number) {
    if (!this.isStarted) {
      this._oscillator.start(0);
      this.isStarted = true;
    }
    this.gain.gain.setTargetAtTime(this.volume, time, 0.01);
  }

  stop(time: number) {
    this.gain.gain.setTargetAtTime(0, time, 0.01);
  }

  playNote(note: Note, time: number): void {
    if (note.rest) return;
    const frequency = this.getFrequency(note);
    this.frequency = frequency;
    this.start(time);
    this.stop(time + note.noteLength);
  }

}

