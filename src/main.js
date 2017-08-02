import { HumDrum } from './humdrum';

let s = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
let b = [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0];
let drumTrack = {
    snare: s,
    bass: b
};
let midNotes = ['', 'a', '', 'a', '', 'a', '', 'a', '', 'g', '', 'g', '', 'g', '', 'g'];
let bassNotes = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'];
let highNotes = ['', '', '', '', '', '', 'a', 'g', 'c', 'a', 'g', 'c', 'a', 'g', 'c', 'a'];

let track = new HumDrum(300);

// loop arg not currently honoured
track
    .addDrumTrack('drums', drumTrack, 0, true)
    .addSynthTrack('bass', bassNotes, 0, true, 2)
    .addSynthTrack('mid', midNotes, 0, true, 4)
    .addSynthTrack('high', highNotes, 4, true, 6)
    .start();