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
	superagent.get('http://localhost:3000/api/')
	  .query()
	  .end(function(err, res) {
	  	// Console.log(res.body)
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
	  	done()
	  })
  });

  it('successfully get nearby stops', function(done){
	superagent.get('http://localhost:3000/api/nearby')
	  .query({"lat": "-37.7380710", "lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('fail to get nearby stops', function(done){
	superagent.get('http://localhost:3000/api/nearby')
	  .query({"lng": "145.0277730"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('fail to search', function(done){
  	superagent.get('http://localhost:3000/api/search')
  	  .query({'search': 'hihwrhewr]'})
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	expect(res.status).to.eql(404);
  	  	done();
  	  })
  })

  it('successfully search', function(done){
  	superagent.get('http://localhost:3000/api/search')
  	  .query({'search': 'Northland'})
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	expect(res.status).to.eql(200);
  	  	done();
  	  })
  });

  it('successfully get departures using broad departure', function(done){
	superagent.get('http://localhost:3000/api/departures')
	  .query({"mode": "1", "stop": "2536", "limit": "10"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(err).to.eql(null);
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('fail to get departures using broad departure', function(done){
	superagent.get('http://localhost:3000/api/departures')
	  .query({"mode": "1", "stop": " ", "limit": "10"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

})