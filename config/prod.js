// Set production environment variables
'use strict';
var ptv = require('./ptv');
var email = require('./email');

module.exports = {
  // PTV keys  
  devId: ptv.devId,
  devSecret: ptv.devSecret,

  // Email
  email: email.email,
  password: email.password,

  // ENV port
  env_port: 88

};