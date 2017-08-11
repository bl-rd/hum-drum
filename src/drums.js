// https://dev.opera.com/articles/drum-sounds-webaudio/

class Bass {
    /**
     * 
     * @param {AudioContext} context 
     */
    constructor(context) {
        this.context = context;
    }

    initialise() {
        this.osc = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.osc.connect(this.gain);
        this.gain.connect(this.context.destination);
    }

    trigger(time) {
        this.initialise();

        this.osc.frequency.setValueAtTime(150, time);
        this.gain.gain.setValueAtTime(1, time);

        this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        this.gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        this.osc.start(time);

        this.osc.stop(time + 0.5);
    }
}

class HiTom extends Bass {

    /**
     * 
     * @param {AudioContext} context 
     */
    constructor(context) {

        super(context);

        this.duration = 0.2;
        this.rampVal = 0.001;
        this.endVal = 900;
    }

    initialise() {
        super.initialise();
    }

    trigger(time) {

        this.initialise();
        this.osc.frequency.setValueAtTime(this.endVal, time);
        this.gain.gain.setValueAtTime(1, time);

        this.osc.frequency.exponentialRampToValueAtTime(this.rampVal, time + this.duration);
        this.gain.gain.exponentialRampToValueAtTime(this.rampVal, time + this.duration);

        this.osc.start(time);
        this.osc.stop(time + this.duration);

    }
}

class MidTom extends HiTom {
    constructor(context) {
        super(context);
        this.endVal = 400;
    }

    initialise() {
        super.initialise();
    }

    trigger(time) {
        super.trigger(time);
    }
}

class LowTom extends HiTom {
    constructor(context) {
        super(context);
        this.endVal = 200;
    }

    initialise() {
        super.initialise();
    }

    trigger(time) {
        super.trigger(time);
    }
}

class HiHat {
    /**
     * Thanks to Joe Sullivan http://joesul.li/van/synthesizing-hi-hats/
     * @param {AudioContext} context 
     */
    constructor(context) {
        this.context = context;
        this.fundamental = 40;
        this.ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
    }

    initialise() {
        this.gain = this.context.createGain();
        
        // bandpass
        this.bandpass = this.context.createBiquadFilter();
        this.bandpass.type = 'bandpass';
        this.bandpass.frequency.value = 10000;

        // highpass
        this.highpass = this.context.createBiquadFilter();
        this.highpass.type = 'highpass';
        this.highpass.frequency.value = 7000;

        // connect
        this.bandpass.connect(this.highpass);
        this.highpass.connect(this.gain);
        this.gain.connect(this.context.destination);
    }

    trigger(time) {
        this.initialise();

        // define the volume envelope
        this.gain.gain.setValueAtTime(0.00001, time);
        this.gain.gain.exponentialRampToValueAtTime(1, time + 0.02);
        this.gain.gain.exponentialRampToValueAtTime(0.3, time + 0.03);
        this.gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.3);

        this.ratios.map(ratio => {
            // create oscillator
            let osc = this.context.createOscillator();
            osc.type = 'square';

            // frequency is the fundamental * this oscillator's ratio
            osc.frequency.value = this.fundamental * ratio;
            osc.connect(this.bandpass);
            osc.start(time);
            osc.stop(time + 0.3);
        });

    }
}

class Snare {

    /**
     * 
     * @param {AudioContext} context 
     */
    constructor(context) {
        this.context = context;
    }

    initialise() {
        this.noise = this.context.createBufferSource();
        this.noise.buffer = this.noiseBuffer();
        let noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        this.noise.connect(noiseFilter);

        this.noiseEnvelope = this.context.createGain();
        noiseFilter.connect(this.noiseEnvelope);
        this.noiseEnvelope.connect(this.context.destination);

        this.osc = this.context.createOscillator();
        this.osc.type = 'triangle';
        this.oscEnvelope = this.context.createGain();
        this.osc.connect(this.oscEnvelope);
    }

    noiseBuffer() {
        const bufferSize = this.context.sampleRate;
        let buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        let output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }

    trigger(time) {
        this.initialise();

        this.noiseEnvelope.gain.setValueAtTime(1, time);
        this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        this.noise.start(time);

        this.osc.frequency.setValueAtTime(100, time);
        this.oscEnvelope.gain.setValueAtTime(0.7, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        this.osc.start(time);

        this.osc.stop(time + 0.2);
        this.noise.stop(time + 0.2);
    }
}

export { Bass, Snare, HiTom, MidTom, LowTom, HiHat }