// `require` any node modules, `import` any custom modules (thanks rollup)

import { baseFrequencies, getNote, getLevel } from './frequencies';
import { Bass, Snare, HiTom, MidTom, LowTom, HiHat } from './drums';
import Synth from './synth';

/**
 * More accurate set version of setInterval
 * Based on https://gist.github.com/manast/1185904
 * @class Interval
 */
class Interval {

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

export default class HumDrum {

    /**
     * 
     * @param {Number} bpm The beats per minute (bpm) the track should play to...
     */
    constructor(bpm, loopLength) {
        this.bpm = bpm;
        this.synthTracks = new Map();
        this.drumTracks = new Map();
        this.play = false;
        this.ticker = 0;
        this.loop = 0;
        this.context = new AudioContext();

        // this should be worked out automatically
        this.loopLength = loopLength || 16;

        // this '8' is a problem - needs to be modified depending on the loopLength
        this.timeBetweenTicks = (60 / this.bpm) * 1000 / (this.loopLength / 4);

        this.started = false;
        this.createEvents();
    }

    createEvents() {
        this.events = [];
        for (let i = 0; i < this.loopLength; i++) {
            let e = new CustomEvent('humdrumTick', {
                detail: {
                    tick: i
                }
            });
            this.events.push(e);
        }
    }

    start() {
        this.play = true;
        this.go();
    }

    stop() {
        this.play = false;
    }

    dispatchStartEvent() {
        if (!this.started) {
            let ev = new Event('humdrumStart', {});
            setTimeout(() => window.dispatchEvent(ev), 0);
        }
        this.started = true;
    }

    /**
     * 
     * @param {Number} point 
     */
    timeToTick(point) {
        let now = this.context.currentTime;
        
        let diff;
        if (point > this.ticker) {
            // only handle going up for now
            diff = point - this.ticker;
        } else if (point < this.ticker) {
            diff = this.ticker + point;
        } else {
            // return now;
        }

        return now + (diff * this.timeBetweenTicks);
    }

    getCurrentTime() {
        return this.context.currentTime;
    }

    go() {
        if (!this.play) return;
        this.dispatchStartEvent();
        const timer = new Interval(() => {
            this.drumTracks.forEach(value => {
                // was this.playTrack but javascript and `this`
                if (!value.play) return;
                let now = this.context.currentTime;
                let playSnare = this.shouldPlayDrum(value.data.snare, this.ticker);
                let playBass = this.shouldPlayDrum(value.data.bass, this.ticker);
                let playHiTom = this.shouldPlayDrum(value.data.hiTom, this.ticker);
                let playMidTom = this.shouldPlayDrum(value.data.midTom, this.ticker);
                let playLowTom = this.shouldPlayDrum(value.data.lowTom, this.ticker);
                let playHiHat = this.shouldPlayDrum(value.data.hiHat, this.ticker);

                if (playSnare) value.snare.trigger(now);
                if (playBass) value.bass.trigger(now);
                if (playHiTom) value.hiTom.trigger(now);
                if (playMidTom) value.midTom.trigger(now);
                if (playLowTom) value.lowTom.trigger(now);
                if (playHiHat) value.hiHat.trigger(now);
            });

            this.synthTracks.forEach(value => {
                if (!value.play) {
                    value.synth.osc.frequency.value = 0;
                    return;
                }

                if (this.loop >= value.start) {
                    value.synth.trigger(
                        value.notes[this.ticker], value.pitch);
                }
            });
            
            // increment the ticker
            if (this.ticker >= this.loopLength - 1) {
                // increment the loop
                this.loop++;
                // reset the ticker
                this.ticker = 0;
            } else {
                this.ticker++;                
            }
            // dispatch event
            window.dispatchEvent(this.events[this.ticker]);
        }, this.timeBetweenTicks);//(60 / this.bpm) * 1000 / (this.loopLength / 4));

        timer.run();
    }

    /**
     * 
     * @param {*} value 
     * @param {*} ticker 
     * @return {Boolean}
     */
    shouldPlayDrum(value, ticker) {
        if (!value) {
            return false;
        }

        return value[ticker];
    }

    /**
     * Adds a drum track
     * @param {String} key 
     * @param {Object} data 
     * @param {Number} start 
     * @param {Boolean} loop 
     * @param {Boolean} play
     */
    addDrumTrack(key, data, start, loop, play = true) {
        let snare = new Snare(this.context);
        let bass = new Bass(this.context);
        let hiTom = new HiTom(this.context);
        let midTom = new MidTom(this.context);
        let lowTom = new LowTom(this.context);
        let hiHat = new HiHat(this.context);

        let dataObj = {
            data: data,
            snare: snare,
            bass: bass,
            hiTom: hiTom,
            midTom: midTom,
            lowTom: lowTom,
            hiHat: hiHat,
            start: start,
            loop: loop,
            play: play
        };
        this.drumTracks.set(key, dataObj);
        return this;
    }

    /**
     * 
     * @param {String} key 
     * @param {Array} data 
     * @param {Number} start 
     * @param {Boolean} loop
     * @param {Number} pitch - @todo to be got from notation
     * @param {Boolean} play
     */
    addSynthTrack(key, data, start, loop, pitch, play = true) {
        let synth = new Synth(this.context);
        this.synthTracks.set(key, {
            synth: synth,
            notes: data,
            start: start,
            loop: loop,
            pitch: pitch,
            play: play
        });
        return this;
    }

    muteTrack(key) {
        let track = this.getTrack(key);
        if (track)
            track.play = false;
        return this;
    }

    unMuteTrack(key) {
        let track = this.getTrack(key);
        if (track)
            track.play = true;
        return this;
    }

    isMuted(key) {
        let track = this.getTrack(key);
        if (track) {
            return track.play;
        }
        return null;
    }

    getTrack(key) {
        return this.drumTracks.get(key) || this.synthTracks.get(key) || false;
    }
}
