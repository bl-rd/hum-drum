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

export { Bass, Snare }