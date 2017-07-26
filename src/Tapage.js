// `require` any node modules, `import` any custom modules (thanks rollup)

import { baseFrequencies, getNote, getLevel } from './frequencies';

export default class Tapage {

    constructor(bpm) {
        this.bpm = bpm;
        this.tracks = [];
    }

    addTrack(track) {
        this.tracks.push(track);
        this.tracks = [...new Set(this.tracks)];
        return this;
    }

    normaliseTracks() {
        // this will make sure the tracks are the same length
        return;
    }

    play() {
        this.normaliseTracks();
        this.tracks.map(track => this.playTrack(track));
    }

    listenForStop() {
        document.addEventListener('keyup', e => {
            if (e.keyCode === 32) {
                // oscillator.stop();
                console.log('stopped');
            }
        });
    }

    playTrack(track) {
        let audioCtx = new AudioContext();
        let oscillator = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        let start = 0;
        let note = 0;
        oscillator.frequency.value = note;
        oscillator.type = 'square';
        oscillator.start();

        setInterval(() => {
            note = getNote(track[start], 4);
            oscillator.frequency.value = note;
            start = start === track.length - 1 ? 0 : start + 1;
        }, (60 / this.bpm) * 1000);
    }
}

// const bpm = 150;
// let audioCtx = new AudioContext();
// let oscillator = audioCtx.createOscillator();
// let gainNode = audioCtx.createGain();

// oscillator.connect(gainNode);
// gainNode.connect(audioCtx.destination);

// let note = 0;
// oscillator.frequency.value = note;
// oscillator.type = 'square';
// oscillator.start();

// const melody = ['', 'd', '', 'd', '', 'g', '', 'g'];

// let initialValue = 1;
// let diff = 1;
// let stop = true;

// let start = 0;
// setInterval(() => {
//     note = getNote(melody[start], 4);
//     oscillator.frequency.value = note;
//     start = start === melody.length -1 ? 0 : start + 1;
// }, (60 / bpm) * 1000);

// document.addEventListener('keyup', e => {
//     if (e.keyCode === 32) {
//         oscillator.stop();
//         console.log('stopped');
//     }
// });