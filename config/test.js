// Set test environment variables
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

  db: 'catchnshare',
  db_user: 'root',
  db_password: '',
  db_host: 'localhost',

  // ENV port
  env_port: 3000

};