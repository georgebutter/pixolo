import { GameAudio } from ".";

export abstract class Instrument {
  private _audio: GameAudio;
  public gain: GainNode;
  abstract start(time: number): void;
  abstract stop(time: number): void;
  abstract playNote(note: Note, time: number): void
  private _octave: Octave = 4;
  constructor({
    audio,
  }: InstrumentConfig) {
    this._audio = audio;
    this.gain = new GainNode(audio.audioContext, {
      gain: 0,
    });
    this.gain.connect(audio.audioContext.destination);
  }

  get audio() {
    return this._audio;
  }


  public getFrequency(note: Note): number {
    if (note.octave) {
      this._octave = note.octave;
    }
    const octaves = {
      0: 1,
      1: 2,
      2: 4,
      3: 8,
      4: 16,
      5: 32,
      6: 64,
      7: 128,
      8: 256,
    };
    const notes = {
      C: 16.35,
      'C#': 17.32,
      D: 18.35,
      'D#': 19.45,
      E: 20.60,
      F: 21.83,
      'F#': 23.12,
      G: 24.50,
      'G#': 25.96,
      A: 27.50,
      'A#': 29.14,
      B: 30.87,
    };
    return notes[note.note!] * octaves[(this._octave + 2) as Octave];
  }
}

export type InstrumentConfig = {
  audio: GameAudio;
}

export type Note = {
  noteLength: number;
  note?: 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B',
  octave?: Octave;
  // dont play this note
  rest?: boolean;
};

type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8