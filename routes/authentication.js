'use strict';
var models = require('../models');
var passport = require('../lib/passport');
var jwt = require('jsonwebtoken');
var secret = require('../config/session').secret;

module.exports = {
  sign_up: function(req, res, next) {
  	var params = {};
  	params.username = req.body.username;
  	params.password = req.body.password;
  	models.User.create(params)
  	  .then(function(user) {
  	  	if (!user) return res.status(400).json({error: 'Can not signup'});
  	  	return res.status(201).json(user.dataValues);
  	  })
  	  .catch(function(error){
  	  	res.status(404).json(error)
  	  })
  },
  sign_in: function(req, res, next) {
  	passport.authenticate('local', function(error, user, info) {
  		if ((error === true) || (user === false)){
  			return res.status(404).json({error: 'Failed to login'})
  		} else {
	        var token;                  
	        if (user.accessToken) {
            // Verify if stored token is expired
	          jwt.verify(user.accessToken, secret, function(err, decoded) {
	            if (err) {
	              token = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });          
	              // Update new token is previous token is expired 
                models.User.findAndUpdate({id: user.id}, {accessToken: token})
	                .then(function(obj) {
	                  return res.status(200).json(obj);
	                })
	                .catch(function(err) {
	                  if (err) return res.status(400).json(err);
	                })
	            } else {
                // Return user with previous accessToken
                // Reason: keep login in other devices
	              return res.status(200).json(user);
	            }
	          })
	        } else {
            // In case user signout or first login, create new token
	          token = jwt.sign({user: user}, secret, { expiresInMinutes: 60*24 });          
              models.User.findAndUpdate({id: user.id}, {accessToken: token})
                .then(function(obj) {
                  return res.status(200).json(obj);
                })
                .catch(function(err) {
                  if (err) return res.status(400).json(err);
                })
	        };   			
  		}
  	})(req, res, next);
  },

  sign_out: function(req, res, next) {
  	var id = req.user.id;
  	models.User.findOne({where: {id: id}})
  	  .then(function(user) {
  	  	if (!user) return res.status(401).json({error: 'User not found'});
  	  	user.updateAttributes({accessToken: null})
  	  	  .then(function(){
  	  	  	return res.status(204).json({success: 'Signed out'});
  	  	  })
  	  	  .catch(function(err){
  	  	  	return res.status(500)
  	  	  })
  	  })
  	  .catch(function(err){
  	  	return res.status(404).json(err);
  	  })
  }
}