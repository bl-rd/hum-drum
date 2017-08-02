// import HumDrum from './humdrum';

// let s = new Tapage(120);
// const over = ['', 'd', '', 'd', '', 'g', '', 'g'];
// const under = ['d', 'd', 'd', 'd', 'g', 'g', 'g', 'g'];
// s
//     .addTrack(over)
//     .addTrack(under)
//     .play();

import { Interval } from './humdrum';
import { Bass, Snare } from './drums';
import Synth from './synth';

let s = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
let b = [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0];
let drumTrack = {
    snare: s,
    bass: b
};

let context = new AudioContext();
let bass = new Bass(context);
let snare = new Snare(context);
let synth = new Synth(context);
let bassSynth = new Synth(context);
let highSynth = new Synth(context);
let synthnotes = ['', 'a', '', 'a', '', 'a', '', 'a', '', 'g', '', 'g', '', 'g', '', 'g'];
let bassNotes = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'];
let highNotes = ['', '', '', '', '', '', 'a', 'g', 'c', 'a', 'g', 'c', 'a', 'g', 'c', 'a'];

/** @todo this needs fixing... */
const bpm = 300;
/*******************************/

let ticker = 0;
let notes = ['a', 'g'];
let note = notes[0];

let loopCounter = 0;

let loopEvent = new CustomEvent('loop', { detail: loopCounter });

const timer = new Interval(() => {
    let playSnare = drumTrack.snare[ticker];
    let playBass = drumTrack.bass[ticker];
    let now = context.currentTime;
    if (playBass) bass.trigger(now);
    if (playSnare) snare.trigger(now);
    synth.trigger(synthnotes[ticker], 4);
    bassSynth.trigger(bassNotes[ticker], 2);
    if (loopCounter >= 4) {
        highSynth.trigger(highNotes[ticker], 6);
    }
    if (ticker >= s.length - 1) {
        ticker = 0;
        loopCounter++;
        document.dispatchEvent(loopEvent);
    } else {
        ticker += 1;
    }
}, (60 / bpm) * 1000);
timer.run();

document.addEventListener('keydown', e => {
    note = note === notes[0] ? notes[1] : notes[0];
    console.log(note);
});

let separate = 0;
document.addEventListener('loop', e => {
    console.log(++separate);
    console.log(`loop no ${e.detail} complete`)
});