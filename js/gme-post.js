

var Gme = {}

Gme.PcmBuffer = function(size) {
    this.size = size;
    // TODO: Investigate other allocation types
    this.buffer = Module.allocate(size * 2, "i8", Module.ALLOC_STACK);
};

Gme.PcmBuffer.prototype.get_sample = function(offset) {
    return Module.getValue(this.buffer + offset, "i16") * 1.0 / 0x7fff;
};

Gme.Engine = function(payload, samplerate) {
    // TODO: Investigate other allocation types
    var ref = Module.allocate(1, "i32", Module.ALLOC_STACK);
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
    var err = Module.ccall("gme_start_track", "number",
                           ["number", "number"],
                           [this.engine, track]);
    if (err != 0)
        throw new Error("gme_start_track failed");
};

Gme.Engine.prototype.track_ended = function() {
    return Module.ccall("gme_track_ended", "number", ["number"], [this.engine]) == 1
};

Gme.Engine.prototype.decode = function(buffer) {
    var err = Module.ccall("gme_play", "number",
                           ["number", "number", "number"],
                           [this.engine, buffer.size, buffer.buffer]);
    if (err != 0)
        throw new Error("gme_play failed");
};

Gme.Engine.prototype.track_count = function() {
    return Module.ccall("gme_track_count", "number", ["number"], [this.engine]);
};

Gme.Engine.prototype.set_stereo_depth = function(depth) {
    Module.ccall("gme_set_stereo_depth", "number",
                 ["number", "number"],
                 [this.engine, depth]);
};

return Gme;
})();
if (typeof module !== 'undefined') module.exports = Gme;
if (typeof define === 'function') define(Gme);
