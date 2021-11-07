export class GmeWorkletNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'gme-worklet-processor', {
            outputChannelCount: [1, 1],
            numberOfInputs: 0,
            numberOfOutputs: 2
        });
    }

    load(payload) {
        this.port.postMessage({ cmd: 'load', payload: payload});
    }

    subtune(index) {
        this.port.postMessage({ cmd: 'subtune', subtune: index});
    }
    enable_accuracy(enable) {
        this.port.postMessage({ cmd: 'enable_accuracy', enable: enable ? 1 : 0 });
    }
}
