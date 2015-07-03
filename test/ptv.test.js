var superagent = require('superagent');
var expect = require('expect.js');

describe('restful api for public transport', function(){
  before(function(done) {
	var server = require('../server');
  	done();
  });

  after(function(done) {
	var models = require('../models');
	models.sequelize.drop({force: true})
	  .then(function(){
	  	done();
	  })
  });

  it('do healthcheck', function(done){
	superagent.get('http://localhost:3000/')
	  .send()
	  .end(function(err, res) {
	  	// Console.log(res.body)
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
	  	done()
	  })
  });

  it('successfully get nearby stops', function(done){
	superagent.post('http://localhost:3000/nearby')
	  .send({"lat": "-37.7380710", "lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('fail to get nearby stops', function(done){
	superagent.post('http://localhost:3000/nearby')
	  .send({"lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('successfully get stops using point of interest', function(done){
	superagent.post('http://localhost:3000/stops')
	  .send({"poi": "1", "lat": "-37.7380710", "lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('fail to get nearby stops using point of interest', function(done) {
	superagent.post('http://localhost:3000/stops')
	  .send({"lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })		
  });

  it('successfully get departures using broad departure', function(done){
	superagent.post('http://localhost:3000/departures')
	  .send({"mode": "1", "stop": "2536", "limit": "10"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('fail to get departures using broad departure', function(done){
	superagent.post('http://localhost:3000/departures')
	  .send({"mode": "1", "stop": " ", "limit": "10"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('fail to get line', function(done){
	superagent.post('http://localhost:3000/line')
	  .send({"mode": "1", "line": ""})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('successfully get line', function(done){
	superagent.post('http://localhost:3000/line')
	  .send({"mode": "1", "line": "3343"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

})