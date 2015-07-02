// Libraries to fetch data from PTV API

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
        return callback(null, body);         
      }
    })
  },

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
        return callback(null, body);         
      }
    })
  },

  getDepartures: function (mode, stop, limit, callback) {
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
        return callback(null, body);         
      }
    })
  },

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
        return callback(null, body);         
      }
    })
  }


}