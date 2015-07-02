// Set test environment variables
'use strict';
var ptv = require('./ptv.js');
var email = require('./email.js');

module.exports = {
  // PTV keys  
  devId: ptv.devId,
  devSecret: ptv.devSecret,

  // Email
  email: email.email,
  password: email.password,

  db: 'catchnshare',
  db_user: 'root',
  db_password: '',
  db_host: 'localhost'
};