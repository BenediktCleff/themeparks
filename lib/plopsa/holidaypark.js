"use strict";

var PlopsaPark = require("./index");

/**
 * Holiday Park
 * @class
 * @extends PlopsaPark
 */
class HolidayPark extends PlopsaPark {
    /**
     * Create a new Holiday Park object
     */
    constructor(options = {}) {
        options.name = options.name || "Holiday Park";
        options.timezone = options.timezone || "Europe/Berlin";

        options.latitude = options.latitude || 49.317913;
        options.longitude = options.longitude || 8.300116;

        // Park API options
        options.clientId = options.clientId || "4_11ugysbvevgg40s4cg4kw0gsg88cswww8ccw44skookogkkoos";
        options.clientSecret = options.clientSecret || "1ord9al2jp8gs00cw44cowgogo0sws0s0s0goskg40cs4sc4g4";

        // inherit from base class
        super(options);
    }
}

module.exports = HolidayPark;
