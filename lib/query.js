var models = require('../models');
var async = require('async');

module.exports = {
  createSchedule: function(uid, travel_args, schedule_args, callback) {
  	  models.User.findOne({where: {id: uid}})
  	    .then(function(user) {
  	      user.getTravels({where: travel_args})
  	        .then(function(travel){
  			  async.map(schedule_args.day
  			    ,function(day, callback){
	  	          travel.getSchedules({where: {time: schedule_args.time, day: day}})
	  	            .then(function(schedule){
	  	              callback(null, 'success');
	  	            })
	  	            .catch(function(err){
	  	              models.Schedule.create({where: {time: schedule_args.time, day: day}})
	  	                .then(function(schedule){
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
	  	            })
  			    }
  			    ,function(err, results){
  			      if (err) return callback(err);
  			      return callback(null, results);
  			    })          
  	        })
  	        .catch(function(err) {
	  	  	  models.Travel.create({where: travel_args})
	  	  	    .then(function(travel) {
	  	  	      user.setTravels(travel)
	  	  	        .then(function() {
					  async.map(schedule_args.day
					  	,function(day, callback){
						  models.Schedule.create({where: {time: schedule_args.time, day: day}})
						    .then(function(schedule){
							  travel.setSchedules(schedule)
							    .then(function() {
							   	  return callback(null, 'success');
							  	})
							  	.catch(function(err) {
							  	  return callback(err);
							  	})
							})
							.catch(function(err){
							  return callback(err);
							})  	  	  		
					  	}
					  	,function(err, results){
		  			      if (err) return callback(err);
		  			      return callback(null, results);
					  	})
	  	  	        })
	  	  	        .catch(function(err){
	  	  	          return callback(err);
	  	  	        })
	  	  	    })  	        	
  	        })

  	    })
		.catch(function(){
		  return callback({error: 'Cant find user'});
		})
  }

}