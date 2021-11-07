const Gme = {}

Gme.PcmBuffer = function(size) {
    this.size = size;
    this.buffer = Module._malloc(size * 2);
};

Gme.PcmBuffer.prototype.get_sample = function(offset) {
    return Module.getValue(this.buffer + (offset * 4), "i16") / 0x7fff;
};

Gme.Engine = function(payload, samplerate) {
    var ref = Module._malloc(4);
    var err = Module.ccall("gme_open_data", "number",
                           ["array", "number", "number", "number"],
                           [payload, payload.length, ref, samplerate]);
    if (err != 0)
        throw new Error("gme_open_data failed");

    this.engine = Module.getValue(ref, "i32");
    if (this.engine == 0)
        throw new Error("Could not allocate engine");
};

Gme.Engine.prototype.start_track = function(track) {
    var err = Module._gme_start_track(this.engine, track);
    if (err != 0)
        throw new Error("gme_start_track failed");
};

Gme.Engine.prototype.track_ended = function() {
    return Module._gme_track_ended(this.engine) == 1
};

Gme.Engine.prototype.decode = function(buffer) {
    var err = Module._gme_play(this.engine, buffer.size, buffer.buffer);
    if (err != 0)
        throw new Error("gme_play failed");
};

Gme.Engine.prototype.track_count = function() {
    return Module._gme_track_count(this.engine);
};

Gme.Engine.prototype.set_stereo_depth = function(depth) {
    Module._gme_set_stereo_depth(this.engine, depth);
};

Gme.Engine.prototype.enable_accuracy = function(enable) {
    Module._gme_enable_accuracy(this.engine, enable);
};

Gme.onRuntimeInitialized = function(fun) {
    Module.onRuntimeInitialized = fun;
};

return Gme;
})();
if (typeof module !== 'undefined') module.exports = Gme;
if (typeof define === 'function') define(Gme);
