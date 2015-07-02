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
    var params = req.body;
    fetch.getNearby(params.lat, params.lng, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })
  },

  // Get stops nearby with POI API
  get_stops: function (req, res) {
    var params = req.body;
    fetch.getStops(params.poi, params.lat, params.lng, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })

  },
  
  // Get departures with Broad Departure api
  get_departures: function (req, res) {
    var params = req.body;
    fetch.getDepartures(params.mode, params.stop, params.limit, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })
  },

  // Get line with Line api
  get_line: function (req, res) {
    var params = req.body;
    fetch.getLine(params.mode, params.line, function (error, response) {
      if (error) {
        return res.status(404).json(error);
      } else {
        return res.status(200).json(response);         
      }
    })
  },
  
  // Share journey
  share: function (req, res) {
    var params = req.body;
    var nodemailer = require('nodemailer');
    var moment = require('moment');
    var email = sails.config.email.email;
    var password = sails.config.password.password;

    params.arrivaltime = moment(params.arrivaltime).add(1, 'hours').calendar();

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: email,
          pass: password
        }
    });

    var mailOptions = {
        from: email, // sender address
        to: params.email, // list of receivers
        subject: 'Catch up', // Subject line
        text: 'Catch ' + params.name + ' at ' + params.arrivalplace + ' ' + params.arrivaltime, // plaintext body
        html: 'Catch ' + params.name + ' at ' + params.arrivalplace + ' ' + params.arrivaltime // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.badRequest(error);
        }else{
            console.log('Message sent: ' + info.response);
            res.ok({mes: 'Thank you. Have a great trip.'});
        }
    });
  }  
};

