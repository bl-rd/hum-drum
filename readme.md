Hum-drum
========

Little library for generating music using the WebAudio API. Doesn't do anything special (in fact there are a lot better versions of things like this out there) but this was a good learning excerise. I created this for my JS13K 2017 game (which I never finished 😢)

## Example usage

```javascript
import HumDrum from 'hum-drum';

/**
 * 100 bpm
 * 16 ticks per look
 */
let track = new HumDrum(100, 16);

// create the drun track
let snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
let bass =  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
let hh =    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
let data = {
    snare: snare,
    bass: bass,
    hiHat: hh
}

let midNotes =  ['c',  '', '',  '', '',  '',   'a#', 'c',  '',   'f', 'g', 'a#', 'c', 'g', '',  ''];
let bassNotes = ['c', 'c', 'c', '', 'c', 'a#', 'a#', 'a#', 'a#', '',  'c', 'a#', 'f', 'f', 'f', 'f'];

track
    // key, data, start, loop
    .addDrumTrack('drums', data, 0, true, true)
    // key, data, start, loop, pitch
    .addSynthTrack('bass', bassNotes, 0, true, 2)
    .addSynthTrack('mid', midNotes, 0, true, 6)
    .play();

window.addEventListener('humdrumTick' e => {
    let tick = e.detail.tick;
    if (tick % 8 === 0) {
        track.muteTrack('mid');
    }
    if (tick === 0) {
        track.unMuteTrack('mid');
    }
});
```