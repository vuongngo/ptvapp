'user strict';
var isUser = require('../lib/isUser');
var ptv = require('./ptv');
var auth = require('./authentication');
var schedule = require('./schedule'); 

module.exports = function(app) {
  app.get('/', ptv.health_check);
  app.post('/nearby', ptv.get_nearby);
  app.post('/stops', ptv.get_stops);
  app.post('/departures', ptv.get_departures);
  app.post('/line', ptv.get_line);
  app.post('/signup', auth.sign_up);
  app.post('/signin', auth.sign_in);
  app.get('/signout', isUser, auth.sign_out);
  app.post('/schedule', schedule.createOrUpdate);
  app.get('/schedule/:uid', schedule.find);
}