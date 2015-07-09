'user strict';
var isUser = require('../lib/isUser');
var ptv = require('./ptv');
var auth = require('./authentication');
var schedule = require('./schedule'); 

module.exports = function(app) {
  app.get('/', function (req, res){
  	res.sendFile('index.html');
  });
  app.get('/api/', ptv.health_check);
  app.get('/api/nearby', ptv.get_nearby);
  app.get('/api/departures', ptv.get_departures);
  app.get('/api/search', ptv.search);
  app.post('/api/signup', auth.sign_up);
  app.post('/api/signin', auth.sign_in);
  app.get('/api/signout', isUser, auth.sign_out);
  app.post('/api/schedule', schedule.createOrUpdate);
  app.get('/api/schedule/:uid', schedule.find);
}