'use strict';

var jwt = require('jsonwebtoken');
var secret = require('../config/session').secret;
var models = require('../models');

module.exports = function isUser(req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.status(401).json({error: 'Format is Authorization: Bearer [token]'});
    }
  } else {
    return res.status(401).json({error: 'No Authorization header was found'});
  }

  jwt.verify(token, secret, function(err, decoded) {
    if (err) return res.status(401).json({error: 'The token is not valid'});

    if (!decoded.user) {
      return res.status(401).json({error: 'Is not user'});
    } else {
      models.User.findOne({where: {id: decoded.user.id}})
        .then(function (user) {
          if (!user) {
            return res.status(401).json({error: 'Invalid user'});
          } else {
            req.user = decoded.user;
            next();
          }
        })
        .catch(function(err) {
          if (err) return res.status(401).json({error: 'Invalid user'});                
        })
    }
  });
};