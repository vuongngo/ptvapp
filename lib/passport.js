'use strict';
var models = require('../models');
var bcrypt = require('bcryptjs');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({ username: username })
      .then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        } else {
          bcrypt.compare(password, user.password, function(err, res) {
            if (!res) {
              return done(null, false, {
                message: 'Invalid Password'
              });
            } else {
              return done(null, user.dataValues);
            }
          });        
        }
      })
      .catch(function(error){
        return done(error);
      });
  })
);

module.exports = passport;