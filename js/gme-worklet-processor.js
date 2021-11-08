import { Gme } from './gme.js';

class GmeWorkletProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.port.onmessage = this.handleMessage.bind(this);
        this.buffer = new Gme.PcmBuffer(128*2);
    }

    async handleMessage(e) {
        if (e.data.cmd == "load") {
            this.engine = new Gme.Engine(e.data.payload, sampleRate);
            this.engine.start_track(0);
        }
        else if (e.data.cmd == "subtune") {
            this.engine.start_track(e.data.subtune);
            this.emitMetadata(e.data.subtune);
        }
        else if (e.data.cmd == "enable_accuracy") {
            this.engine.enable_accuracy(e.data.enable);
        }
    }

    emitMetadata(subtune) {
        this.port.postMessage({
            "cmd": "metadata",
            "info": this.engine.info(subtune),
        });
    }

    process (inputs, output, parameters) {
        if (this.engine == undefined)
            return true;
        const chunks = this.buffer.size / output.length;
        this.engine.decode(this.buffer);
        for (let i = 0; i < chunks; i++) {
            for (let n = 0; n < output.length; n++) {
                output[n][0][i] = this.buffer.get_sample(i + n);
            }
        }
        return !this.engine.track_ended();
    }
}

registerProcessor('gme-worklet-processor', GmeWorkletProcessor);
