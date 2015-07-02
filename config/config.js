'use strict'; 

// Return variable according to environment

var dev = require('./dev.js');
var prod = require('./prod.js');
var test = require('./test.js');

module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
      return dev;

    case 'production':
      return prod;

    case 'test':
      return test;

    default:
      return {err: 'No environment'};
  }
};