const Gme = {}

Gme.PcmBuffer = function(size) {
    this.size = size;
    this.buffer = _malloc(size * 2);
};

Gme.PcmBuffer.prototype.get_sample = function(offset) {
    return getValue(this.buffer + (offset * 4), "i16") / 0x7fff;
};

Gme.Engine = function(payload, samplerate) {
    var ref = stackAlloc(4);
    var err = Module.ccall("gme_open_data", "number",
                           ["array", "number", "number", "number"],
                           [payload, payload.length, ref, samplerate]);
    if (err != 0)
        throw new Error("gme_open_data failed");

    this.engine = getValue(ref, "i32");
    if (this.engine == 0)
        throw new Error("Could not allocate engine");
};

Gme.Engine.prototype.info = function(track) {
    var count = _gme_track_count(this.engine);
    if (count == 0)
        throw new Error("gme_track_count failed");

    var ref = stackAlloc(4);

    var err = _gme_track_info(this.engine, ref, track);
    if (err != 0)
        throw new Error("gme_track_info failed");

    var ptr = getValue(ref, "i32");

    var metadata = {
        length: {
            total: getValue(ptr, "i32"),
            intro: getValue(ptr + 4, "i32"),
	        loop: getValue(ptr + 8, "i32"),
	        play: getValue(ptr + 12, "i32"),
            fade: getValue(ptr + 16, "i32"),
        },
	    system: UTF8ToString(getValue(ptr + 64, "i8*"), 255),
	    game: UTF8ToString(getValue(ptr + 68, "i8*"), 255),
	    song: UTF8ToString(getValue(ptr + 72, "i8*"), 255),
	    author: UTF8ToString(getValue(ptr + 76, "i8*"), 255),
	    copyright: UTF8ToString(getValue(ptr + 80, "i8*"), 255),
	    comment: UTF8ToString(getValue(ptr + 84, "i8*"), 255),
        numberOfTracks: count,
        currentTrack: track,
    };

    _gme_free_info(ptr);

    return metadata;
};

Gme.Engine.prototype.start_track = function(track) {
    var err = _gme_start_track(this.engine, track);
    if (err != 0)
        throw new Error("gme_start_track failed");
};

Gme.Engine.prototype.track_ended = function() {
    return _gme_track_ended(this.engine) == 1
};

Gme.Engine.prototype.decode = function(buffer) {
    var err = _gme_play(this.engine, buffer.size, buffer.buffer);
    if (err != 0)
        throw new Error("gme_play failed");
};

Gme.Engine.prototype.track_count = function() {
    return _gme_track_count(this.engine);
};

Gme.Engine.prototype.set_stereo_depth = function(depth) {
    _gme_set_stereo_depth(this.engine, depth);
};

Gme.Engine.prototype.enable_accuracy = function(enable) {
    _gme_enable_accuracy(this.engine, enable);
};

Gme.onRuntimeInitialized = function(fun) {
    Module.onRuntimeInitialized = fun;
};

return Gme;
})();
if (typeof module !== 'undefined') module.exports = Gme;
if (typeof define === 'function') define(Gme);
