var superagent = require('superagent');
var expect = require('expect.js');
var server = require('../server');
var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
var uid;

describe('schedule test', function(){
  before(function(done){
  	var models = require('../models')
  	models.User.create({username: 'Tome', password: '12345'})
  	  .then(function(user){
  	  	uid = user.dataValues.id;
  	  	console.log(uid);
  	  	done();
  	  })
  	  .catch(function(){
  	  	done();
  	  })
  });

  after(function() {
	var models = require('../models');
	models.sequelize.drop()
  });

  it('fail to create schedule', function(done){
	superagent.post('http://localhost:3000/schedule')
	  .send({"username": "", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).not.to.equal(null);
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('create one schedule', function(done){
  	superagent.post('http://localhost:3000/schedule')
  	  .send({'userId': uid, 'mode': 1, 'line': 1, 'stop': 2, 'directionid': 2, 'limit': 1, 'timeslot': date, 'time': date, 'day': [1]})
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	console.log(err);
  	  	expect(err).to.eql(null);
  	  	expect(res.status).to.eql(200);
  	  	done();
  	  })
  });

  it('create one schedule', function(done){
  	superagent.post('http://localhost:3000/schedule')
  	  .send({'userId': uid, 'mode': 1, 'line': 1, 'stop': 2, 'directionid': 2, 'limit': 1, 'timeslot': date, 'time': date, 'day': [1]})
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	console.log(err);
  	  	expect(err).to.eql(null);
  	  	expect(res.status).to.eql(200);
  	  	done();
  	  })
  });

  it('create many schedules', function(done){
  	superagent.post('http://localhost:3000/schedule')
  	  .send({'userId': uid, 'mode': 2, 'line': 1, 'stop': 2, 'directionid': 2, 'limit': 1, 'timeslot': date, 'time': date, 'day': [0, 1, 3]})
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	console.log(err);
  	  	expect(err).to.eql(null);
  	  	expect(res.status).to.eql(200);
  	  	done();
  	  })
  })
})