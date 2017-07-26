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

let s = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
let b = [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0];
let drumTrack = {
    snare: s,
    bass: b
};

let context = new AudioContext();
let bass = new Bass(context);
let snare = new Snare(context);
const bpm = 300;
let ticker = 0;

const timer = new Interval(() => {
    let playSnare = drumTrack.snare[ticker];
    let playBass = drumTrack.bass[ticker];
    let now = context.currentTime;
    if (playBass) bass.trigger(now);
    if (playSnare) snare.trigger(now);
    ticker = ticker >= s.length - 1 ? 0 : ticker + 1;
}, (60 / bpm) * 1000);
timer.run();