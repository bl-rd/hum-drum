// `require` any node modules, `import` any custom modules (thanks rollup)

import { baseFrequencies, getNote, getLevel } from './frequencies';
import { Bass, Snare } from './drums';

/**
 * More accurate set version of setInterval
 * Based on https://gist.github.com/manast/1185904
 * @class Interval
 */
export class Interval {

    /**
     * @constructor
     * @param {Function} fn     The function to call every interval
     * @param {Number} duration The duration between calls
     */
    constructor(fn, duration) {
        this.fn = fn;
        this.duration = duration;
        this.baseline = null;
    }

    run() {
        if (!this.baseline) {
            this.baseline = new Date().getTime();
        }

        this.fn();

        const end = new Date().getTime();
        this.baseline += this.duration;

        let nextTick = this.duration - (end - this.baseline);
        if (nextTick < 0) {
            nextTick = 0;
        }

        this.timer = setTimeout(() => this.run(), nextTick);
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

}

export class HumDrum {

    constructor(bpm) {
        this.bpm = bpm;
        this.tracks = [];
    }

    // addTrack(track) {
    //     this.tracks.push(track);
    //     this.tracks = [...new Set(this.tracks)];
    //     return this;
    // }

    // normaliseTracks() {
    //     // this will make sure the tracks are the same length
    //     return;
    // }

    // play() {
    //     this.normaliseTracks();
    //     this.tracks.map(track => this.playTrack(track));
    // }

    // listenForStop() {
    //     document.addEventListener('keyup', e => {
    //         if (e.keyCode === 32) {
    //             // oscillator.stop();
    //             console.log('stopped');
    //         }
    //     });
    // }

    // playTrack(track) {
    //     let audioCtx = new AudioContext();
    //     let oscillator = audioCtx.createOscillator();
    //     let gainNode = audioCtx.createGain();
    //     oscillator.connect(gainNode);
    //     gainNode.connect(audioCtx.destination);

    //     let start = 0;
    //     let note = 0;
    //     oscillator.frequency.value = note;
    //     oscillator.type = 'square';
    //     oscillator.start();

    //     setInterval(() => {
    //         note = getNote(track[start], 4);
    //         oscillator.frequency.value = note;
    //         start = start === track.length - 1 ? 0 : start + 1;
    //     }, (60 / this.bpm) * 1000);
    // }
}