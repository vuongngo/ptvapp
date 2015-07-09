'use strict';
// Libraries to fetch data from PTV API
// Parameters:
// Mode: Train => 0, Tram => 1, Bus => 2, Vline => 3, Nightrider => 4
// Time: ISO 8601 UTC format
// Lat, lng: in decimal degree

var crypto = require('crypto-js/hmac-sha1');
var request = require('request');

// Get config variables based on environment
var Config = require('../config/config');
var conf = new Config();
var dev_id = conf.devId;
var dev_secret = conf.devSecret;

// Check if string is null, unidentified or blank
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = {

  healthCheck: function (callback) {
    var date = new Date();
    date = date.toISOString();
    var url = '/v2/healthcheck?timestamp=' + date + '&devid=' + dev_id;
    var signature = crypto(url, dev_secret);      
    
    var requesturl = 'http://timetableapi.ptv.vic.gov.au'+ url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      console.log(error);
      console.log(body);
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        callback({error: 'Can not get neaby stops'});
      } else {
        callback(null, body);         
      }
    })
   },
	
  // Get nearby stop based on user location
  getNearby:  function (lat, lng, callback) {
    if (isBlank(lat) || isBlank(lng)) {
      return callback({error: 'Missing params'})
    };
    var url = '/v2/nearme/latitude/' + lat + '/longitude/' + lng + '?devid=' + dev_id;
    var signature = crypto(url, dev_secret);      

    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Can not get neaby stops'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })
  },

  // Get nearby stops based on the boundaries
  getStops: function(poi, lat, lng, callback) {
    if (isBlank(poi) || isBlank(lat) || isBlank(lng)) {
      return callback({error: 'Missing params'});
    };
    var locate = require('./location.js');
    var location = locate.getBoundaries(lat, lng);
    var url = '/v2/poi/' + poi + '/lat1/' + location.lat1 + '/long1/' + location.lng1 + '/lat2/' + location.lat2 + '/long2/' + location.lng2 + 
        '/griddepth/' + 20 + '/limit/' + 4 + '?devid=' + dev_id;
    var signature = crypto(url, dev_secret);      

    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;

    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Can not get neaby stops'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })
  },

  // Get departures based on current time
  getBroadDepartures: function (mode, stop, limit, callback) {
    if ( isBlank(mode) || isBlank(stop) || isBlank(limit)) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/mode/' + mode + '/stop/' + stop + '/departures/by-destination/limit/' + limit + '?devid=' + dev_id;
    var signature = crypto(url, dev_secret);

    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Can not get departures'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })
  },

  // Get departures based on specific time and direction
  getSpecificDepartures: function(mode, line, stop, directionid, limit, time, callback) {
    if ( isBlank(mode) || isBlank(line) || isBlank(stop) || isBlank(directionid) || isBlank(limit) || isBlank(time) ) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/mode/'+ mode + '/line/' + line + '/stop/' + stop + '/directionid/' + directionid + '/departures/all/limit/' + limit + '?for_utc=' + time + '&devid=' + dev_id;

    var signature = crypto(url, dev_secret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Cannot get specific departures'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })    
  },

  // Get stops on line
  getLine: function (mode, line, callback) {
    if ( isBlank(mode) || isBlank(line)) {
      return callback({error: 'Missing params'});
    };
  	var url = '/v2/mode/' + mode + '/line/' + line + '/stops-for-line?devid=' + dev_id;

    var signature = crypto(url, dev_secret);
  	var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Can not get line'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })
  },

  // Get stops based on search keywords
  search: function (text, callback) {
    // console.log(text);
    if ( isBlank(text)) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/search/' + text + '?&devid=' + dev_id;

    var signature = crypto(url, dev_secret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1) || (JSON.parse(body).Error)) {
        return callback({error: 'search error'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })
  },

  lineByMode: function(mode, name, callback) {
    if ( isBlank(mode) || isBlank(name) ) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/lines/mode/'+ mode + '?name=' + name + '&devid=' + dev_id;

    var signature = crypto(url, dev_secret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Cannot get line by mode'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })    
  },

  // Get stops timetable when traveling on specific routes
  getStopPattern: function(mode, run, stop, time, callback) {
    if ( isBlank(mode) || isBlank(run) || isBlank(stop) || isBlank(time) ) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/mode/'+ mode + '/run/' + run + '/stop/' + stop + '/stopping-pattern?for_utc=' + time + '&devid=' + dev_id;

    var signature = crypto(url, dev_secret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Cannot get stop pattern'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })    
  },

  getDisruption: function(mode, callback) {
    if ( isBlank(mode) ) {
      return callback({error: 'Missing params'});
    };
    var url = '/v2/disruptions/modes/'+ mode + '&devid=' + dev_id;

    var signature = crypto(url, dev_secret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      var arg = body.toString();
      if ((error) || (arg.indexOf('DOCTYPE') > -1)) {
        return callback({error: 'Cannot get disruption'});
      } else {
        return callback(null, JSON.parse(body));         
      }
    })    
  }

}