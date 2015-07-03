'use strict';
// Middleware for url parameters
var models = require('../models');

module.exports = function paramsUid(app){
  app.param('uid', function(req, res, next, uid){
  	models.User.findById(uid)
  	  .then(function(user){
  	  	if (!user) {
  	  	  res.status(400).json({error: 'User not found'})
  	  	} else {
  	  	  req.userId = user.dataValues.id;
  	  	  next();
  	  	};
  	  })
  	  .catch(function(){
  	  	res.status(400).json({error: 'User not found'})
  	  })
  })
};