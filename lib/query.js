'use strict';
var models = require('../models');
var async = require('async');

function createEachSchedule(travel, schedule_args){
  return new Promise(function(resolve, reject){
  // Create reminder for each day set
  async.map(schedule_args.day
    ,function(day, callback){
      models.Schedule.create({time: schedule_args.time, day: day})
        .then(function(schedule){
          // Create association between schedule and travel
          travel.setSchedules(schedule)
            .then(function(){
              return callback(null, 'success')
            })
            .catch(function(err){
              return callback(err);
            })
        })
        .catch(function(err){
        	return callback(err);
        })
    }
    ,function(err, results){
      if (err) return reject(err);
      return resolve(results);
    })          	  				  	
  })
};

module.exports = {
  // Create or update reminder for user
  createOrUpdateSchedule: function(uid, travel_args, schedule_args, callback) {
  	  models.User.findOne({where: {id: uid}})
  	    .then(function(user) {
  	      // Check if user already set travel routes
  	      models.Travel.findOne({where: travel_args})
  	        .then(function(travel){
  	          // Destroy all previous setted reminders before updaste
			  models.Schedule.destroy({where: {TravelId: travel.dataValues.id}, truncate: true})
	  			.then(function(affectedRows){
	  			  return createEachSchedule(travel, schedule_args)
	  			})
	  			.then(function(results){
	  			  return callback(null, 'success')
	  			})
	  			.catch(function(){
	  				return callback({error: 'Cant not delete tasks'})
	  			})
  	        })
  	        .catch(function() {
  	        	var args = travel_args;
  	        	args.UserId = uid;
  	        // If travel was not set, create new instance
	  	  	  models.Travel.create(args)
	  	  	    .then(function(travel) {
	  			  return createEachSchedule(travel, schedule_args)
	  			})
	  			.then(function(results){
	  			  return callback(null, 'success')
	  			})
  	  	        .catch(function(err){
  	  	          return callback(err);
  	  	        })
  	        })

  	    })
		.catch(function(){
		  return callback({error: 'Cant find user'});
		})
  }

}