Used something like this:

```javascript
import { GmeWorkletNode } from './gme-worklet-node.js';

// Some of this needs to happen based on user interaction rather than page load.
const context = new AudioContext();

await context.audioWorklet.addModule('gme-worklet-processor.js');

const decoder = new GmeWorkletNode(context);
decoder.connect(context.destination);

var xhr = new XMLHttpRequest();
xhr.open("GET", "somefile.nsf", true);
xhr.responseType = "arraybuffer";
xhr.onload = function(e) {
	decoder.load(new Uint8Array(this.response));
	decoder.enable_accuracy(true);
	decoder.subtune(params.subtune);
};
xhr.send();
```
