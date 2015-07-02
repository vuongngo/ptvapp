'user strict';
var ptv = require('./ptv');
var auth = require('./authentication');
var isUser = require('../lib/isUser');

module.exports = function(app) {
  app.get('/', ptv.health_check);
  app.post('/nearby', ptv.get_nearby);
  app.post('/stops', ptv.get_stops);
  app.post('/departures', ptv.get_departures);
  app.post('/line', ptv.get_line);
  app.post('/signup', auth.sign_up);
  app.post('/signin', auth.sign_in);
  app.get('/signout', isUser, auth.sign_out);
}