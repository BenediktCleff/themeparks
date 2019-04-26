"use strict";

var PlopsaPark = require("./index");

/**
 * Plopsaland De Panne
 * @class
 * @extends PlopsaPark
 */
class Plopsaland extends PlopsaPark {
    /**
     * Create a new Plopsaland object
     */
    constructor(options = {}) {
        options.name = options.name || "Plopsaland De Panne";
        options.timezone = options.timezone || "Europe/Brussels";

        options.latitude = options.latitude || 51.080928;
        options.longitude = options.longitude || 2.598484;

        // Park API options
        options.clientId = options.clientId || "3_1oiabkbe2q4ko0gkkc8kkg4g0gc8swcg4cowkwwsww08080k4g";
        options.clientSecret = options.clientSecret || "5yaln3dq9b0g4osw8woc44cw08k00osgso8oswko80gksgcc4w";

        // inherit from base class
        super(options);
    }
}

module.exports = Plopsaland;
