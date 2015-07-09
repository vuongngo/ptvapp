'use strict';

var request = require('request');
var crypto = require('crypto-js/hmac-sha1');

// Get config variables based on environment
var Config = require('../config/config');
var conf = new Config();
var devId = conf.devId;
var devSecret = conf.devSecret;

var fetch = require('../lib/fetch_ptv')
/**
 * PtvController
 *
 */

module.exports = {

  // Health Check 
  health_check: function (req, res) {
    fetch.healthCheck(function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })
  },

  // Get stops nearby with Nearby API
  get_nearby: function (req, res) {
    var params = req.query;
    fetch.getNearby(params.lat, params.lng, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })
  },

  // Get stops by keywords
  search: function(req, res) {
    var params = req.query;
    fetch.search(params.search, function (error, response){
      if (error) {
        return res.status(404).json(error);
      } else {
        console.log(response);
        return res.status(200).json(response);
      }
    })
  },

  // Get departures with Broad Departure api
  get_departures: function (req, res) {
    var params = req.query;
    fetch.getBroadDepartures(params.mode, params.stop, params.limit, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response.values);         
      }
    })
  },

};

