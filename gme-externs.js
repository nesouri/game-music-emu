var Gme = {};

/**
 * @param {number}
 */
var Gme.PcmBuffer = function(size) {};

/**
 * @param {number}
 */
var Gme.PcmBuffer.prototype.get_sample(offset);

/**
 * @param {Uint8Array}
 * @param {number}
 */
var Gme.Engine = function(payload, samplerate) {};

/**
 * @param {number}
 */
var Gme.Engine.prototype.start_track = function(track) {};

/**
 * @return {boolean}
 */
var Gme.Engine.prototype.track_ended = function() {};

/**
 * @param {Gme.PcmBuffer}
 */
var Gme.Engine.prototype.decode = function(buffer) {};

/**
 */
Gme.Engine.prototype.track_count = function() {};

/**
 * @param {number}
 */
Gme.Engine.prototype.set_stereo_depth = function(depth) {};
