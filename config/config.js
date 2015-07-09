'use strict'; 

// Return variable according to environment

var dev = require('./dev');
var prod = require('./prod');
var test = require('./test');

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