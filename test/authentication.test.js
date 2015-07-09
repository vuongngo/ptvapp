var superagent = require('superagent');
var expect = require('expect.js');
var token;

describe('authentication test', function(){
  before(function() {
	var server = require('../server');
  });

  after(function(done) {
	var models = require('../models');
	models.sequelize.drop({force: true})
	  .then(function(){
	  	done();
	  })
  });

  it('fail to signup', function(done){
	superagent.post('http://localhost:3000/api/signup')
	  .send({"username": "", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('fail to signup', function(done){
	superagent.post('http://localhost:3000/api/signup')
	  .send({"username": "vuongngo", "password": ""})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('successfully signup', function(done){
	superagent.post('http://localhost:3000/api/signup')
	  .send({"username": "vuongngo", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(201);
		done();
	  })
  });

  it('fail to signin', function(done){
	superagent.post('http://localhost:3000/api/signin')
	  .send({"username": "", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(404);
		done();
	  })
  });

  it('successfully signin', function(done){
	superagent.post('http://localhost:3000/api/signin')
	  .send({"username": "vuongngo", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('successfully signin', function(done){
	superagent.post('http://localhost:3000/api/signin')
	  .send({"username": "vuongngo", "password": "12345"})
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	token = res.body.accessToken;
	  	expect(res.status).to.eql(200);
		done();
	  })
  });

  it('failed to signout', function(done){
	superagent.get('http://localhost:3000/api/signout')
	  .set('Accept', 'application/json')
	  .end(function(err, res){
	  	expect(res.status).to.eql(401);
		done();
	  })
  });
  it('successfully signout', function(done){
  	superagent.get('http://localhost:3000/api/signout')
  	  .set('Authorization', 'Bearer ' + token)
  	  .set('Accept', 'application/json')
  	  .end(function(err, res){
  	  	console.log(err);
  	  	expect(res.status).to.eql(204);
  	  	done();
  	  })
  })
})