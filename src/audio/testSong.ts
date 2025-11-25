import { Note } from "./Instrument"

// volume, fade, duty, samples, length: 320

const doubleD: Array<Note> = [{
  note: 'D',
  noteLength: 0.2,
  octave: 3,
},
{
  note: 'D',
  noteLength: 0.2,
}]

const doubleA: Array<Note> = [  {
  octave: 2,
  note: 'A',
  noteLength: 0.2,
},
{
  note: 'A',
  noteLength: 0.2,
}]

const dRest: Array<Note> = [{
  note: 'D',
  noteLength: 0.1,
  octave: 4,
},
{
  rest: true,
  noteLength: 0.1,
},
{
  note: 'D',
  noteLength: 0.1,
},
{
  rest: true,
  noteLength: 0.1,
}];

const a4: Array<Note> = [{
  note: 'A',
  noteLength: 0.4,
},]

export const channel1Track: Array<Note> = [
  ...doubleA,
  {
    note: 'D',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'D#',
    octave: 3,
    noteLength: 0.4,
  },
  ...doubleA,
  {
    note: 'D',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  ...doubleA,
  {
    note: 'D',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'G',
    noteLength: 0.4,
    octave: 3,
  },
  {
    note: 'A',
    noteLength: 0.8,
    octave: 3,
  },
  {
    note: 'A',
    noteLength: 0.8,
    octave: 2,
  },
  {
    note: 'F',
    noteLength: 0.8,
    octave: 3,
  },
  {
    note: 'F',
    noteLength: 0.8,
    octave: 2,
  },
  ...doubleA,
  {
    note: 'D',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'D#',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'F',
    noteLength: 0.4,
    octave: 3,
  },
  ...doubleA,
  {
    note: 'G',
    noteLength: 0.4,
    octave: 3,
  },
  {
    note: 'F',
    noteLength: 1.6,
    octave: 3,
  },
  {
    note: 'D',
    noteLength: 1.6,
    octave: 4,
  
  }
];

export const channel2Track: Array<Note> = [
  // Bar 1
  ...doubleD,
  {
    note: 'A',
    noteLength: 0.4,
  },
  ...doubleD,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  // Bar 2
  ...doubleD,
  {
    note: 'A',
    noteLength: 0.4,
  },
  ...doubleD,
  {
    note: 'C#',
    noteLength: 0.4,
  },
  // Bar 3
  ...doubleD,
  {
    note: 'A',
    noteLength: 0.4,
  },
  ...doubleD,
  {
    note: 'C#',
    noteLength: 0.4,
    octave: 4,
  },
  // Bar 4
  {
    note: 'D',
    noteLength: 0.8,
  },
  {
    note: 'D',
    noteLength: 0.8,
    octave: 3,
  },
  // Bar 5
  {
    note: 'C',
    noteLength: 0.8,
    octave: 4,
  },
  {
    note: 'C',
    noteLength: 0.8,
    octave: 3,
  },
  ...doubleD,
  {
    note: 'A',
    noteLength: 0.4,
  },
  ...doubleD,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  ...doubleD,
  {
    note: 'C',
    noteLength: 0.4,
    octave: 4,
  },
  ...doubleD,
  {
    note: 'C#',
    noteLength: 0.4,
    octave: 4,
  },
  {
    note: 'D',
    noteLength: 1.6,
  },
  {
    note: 'D',
    noteLength: 1.6,
    octave: 5,
  }
]

export const channel3Track: Array<Note> = [
  ...dRest,
  ...a4,
  ...dRest,
  ...a4,
  ...dRest,
  ...a4,
  ...dRest,
  {
    note: 'F#',
    noteLength: 0.4,
  },
  ...dRest,
  ...a4,
  ...dRest,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  {
    note: 'A',
    noteLength: 0.8,
  },
  {
    note: 'D',
    noteLength: 0.8,
  },
  {
    note: 'A#',
    noteLength: 0.8,
  },
  {
    note: 'D',
    noteLength: 0.8,
  },
  ...dRest,
  ...a4,
  ...dRest,
  ...a4,
  ...dRest,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  ...dRest,
  {
    note: 'A#',
    noteLength: 0.4,
  },
  {
    note: 'A',
    noteLength: 1.6,
  },
  {
    note: 'D',
    noteLength: 0.1,
  },
  {
    rest: true,
    noteLength: 0.1,
  }
]
