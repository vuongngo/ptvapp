'use strict';

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define('User', {
	username: {
	  type: DataTypes.STRING,
	  validate: {
	  	// is: ["^[a-z]+$",'i'],
	  	notEmpty: true
	  }
	},
	password: {
	  type: DataTypes.STRING,
	  validate: {
	  	notEmpty: true,
	  	min: 11,
	  }
	},
	accessToken: {
	  type: DataTypes.STRING	
	}
    }, {
    timestamps: true,
    classMethods: {
      associate: function(models) {
      	User.hasMany(models.Travel);
      },
      findAndUpdate: function(arg, elem) {
      	return new Promise(function(resolve	, reject){
          User.findOne({where: arg})
            .then(function(user) {
              user.updateAttributes(elem)
	            .then(function() {
	              resolve(user.dataValues);
	            })
	            .catch(function(err) {
	              reject({error: 'Can not create token'});
	            })
            })
            .catch(function(err) {
              reject({error: 'User does not exist'});
            })
      	})
      } 
    },
    hooks: {
	  beforeCreate: function (user, options, fn) {
	  	var bcrypt = require('bcryptjs');
	  	var jwt = require('jsonwebtoken');
	  	
	  	bcrypt.genSalt(10, function(err, salt) {
	  	  if (err) return fn(err);
	      // Hash password
	  	  bcrypt.hash(user.password, salt, function(err, hash) {
	  		if (err) return fn(err);
  			user.password = hash;
	  		fn(null, user);
	  	  });
	  	});
	  },    	
    }
  });

  return User;
};
