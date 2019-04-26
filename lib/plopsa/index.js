"use strict";

// include core Park class
const Park = require("../park");
const Moment = require("moment-timezone");

var s_clientId = Symbol();
var s_clientSecret = Symbol();
var s_apiBase = Symbol();
var s_apiVersion = Symbol();

/**
 * Implements the Plopsa Park API framework. Plopsaland, Holiday Park use this API framework
 * @class
 * @extends Park
 */
class PlopsaPark extends Park {
    /**
     * Create new Plopsa Object.
     * This object should not be called directly, but rather extended for each of the individual Plopsa parks
     * @param {Object} options
     * @param {String} options.client_id Client ID to access this park's API
     * @param {String} options.client_secret Client secret to access this park's API
     * @param {String} [options.api_base] API Base to use when accessing the API
     * @param {String} [options.api_version] API Version to use when accessing the API
     */
    constructor(options = {}) {
        options.name = options.name || "Plopsa Park";
        options.useragent = "okhttp/3.9.1";

        // inherit from base class
        super(options);

        // custom API options
        if (!options.clientId) throw new Error("Plopsa Parks require a client_id");
        this[s_clientId] = options.clientId;

        if (!options.clientSecret) throw new Error("Plopsa Parks require a client_secret");
        this[s_clientSecret] = options.clientSecret;

        // default base API
        this[s_apiBase] = options.apiBase || "https://dashboard.plopsa.be/api/";
        this[s_apiVersion] = options.apiVersion || "v1.0";
    }

    /**
     * Get our current access token
     */
    GetAccessToken() {
        var expiresIn;
        return this.Cache.Wrap("accesstoken", function() {
            return new Promise(function(resolve, reject) {
                // request a fresh access token
                this.HTTP({
                    url: this[s_apiBase] + this[s_apiVersion] + "/token",
                    method: "POST",
                    body: JSON.stringify({
                        client_id: this[s_clientId],
                        client_secret: this[s_clientSecret],
                        grant_type: "client_credentials"
                    })
                }).then(function(body) {
                    if (!body.access_token) {
                        this.Log("Error body", body);
                        return reject("Returned access token data missing access_token");
                    }
                    if (!body.expires_in) {
                        this.Log("Error body", body);
                        return reject("Returned access token data missing expires_in");
                    }

                    // The ttlExpiresIn is the maximum time the access_token is valid.
                    // It's possible for the token to be given back just moments before
                    // it is invalid.
                    expiresIn = Math.ceil(body.access_token * .9);

                    this.Log(`Fetched new Plopsa access_token ${body.access_token}`);

                    // return our new access token
                    return resolve(body.access_token);
                }.bind(this), reject);
            }.bind(this));
        }.bind(this), function() {
            return expiresIn;
        }.bind(this));
    }

    /**
     * Fetch Wait times
     */
    FetchWaitTimes() {
        return new Promise(function(resolve, reject) {
            // Get access_token before getting wait times (usually this will come from the cache)
            this.GetAccessToken().then(function(access_token) {
                this.HTTP({
                    url: this[s_apiBase] + this[s_apiVersion] + "/en/locations?_format=json",
                    headers: {
                        Authorization: "Bearer " + access_token
                    }
                }).then(function(waitTimes) {
                    for (var i = 0, attraction; attraction = waitTimes.elements[i++];) {
                        // FYI, ridetime.type:
                        //  1: attraction
                        //  2: show
                        //  3: food
                        //  4: meet & greet
                        //  5: shop

                        if (attraction.type === 1) {
                            // get this ride's' object
                            var rideObject = this.GetRideObject({
                                id: attraction.uniqueId,
                                name: attraction.name || "???",
                            });

                            // set new wait time
                            var active = (!attraction.temporaryClosed && attraction.isOpen);
                            var waittime = (attraction.waitingTime === null ? "0" : attraction.waitingTime);
                            rideObject.WaitTime = active ? waittime : -1;
                        }
                    }

                    resolve();
                }.bind(this), reject);
            }.bind(this), reject);
        }.bind(this));
    }

    /**
     * Fetch Plopsa Park opening time data
     * @returns {Promise}
     */
    FetchOpeningTimes() {
        return new Promise(function(resolve, reject) {
            // Get access_token before getting opening times (usually this will come from the cache)
            this.GetAccessToken().then(function(access_token) {
                this.HTTP({
                    url: this[s_apiBase] + this[s_apiVersion] + "/en/day-scheme?_format=json",
                    headers: {
                        Authorization: "Bearer " + access_token
                    }
                }).then(function(openingTimes) {
                    // TODO - this endpoint only returns todays opening times
                    // find out how to get all properly!

                    resolve();
                }.bind(this), reject);
            }.bind(this), reject);
        }.bind(this));
    }
}

// export the class
module.exports = PlopsaPark;
