var models = require('../models');
var query = require('../lib/query');
var _ = require('lodash');

// Check if string is null, unidentified or blank
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = {
  // Create reminder for user
  createOrUpdate: function(req, res, next) {
  	var params = req.body;
  	// Check params
  	if (isBlank(params.userId) || isBlank(params.mode) || isBlank(params.line) || isBlank(params.stop) || isBlank(params.directionid) || isBlank(params.limit) || isBlank(params.timeslot) || isBlank(params.time) || isBlank(params.day)) {
  	  return res.status(404).json({error: 'Missing params'})
  	};
  	var uid = params.userId;
  	var travel_args = {mode: params.mode, line: params.line, stop: params.stop, directionid: params.directionid, limit: params.limit, timeslot: params.timeslot};
	  var schedule_args = {time: params.time, day: params.day};
	
	  query.createOrUpdateSchedule(uid, travel_args, schedule_args, function(err, obj){
	    if (err){ 
	  	  return res.status(404).json(err);
	    } else {
	  	  return res.status(200).json({success: 'Created schedule'});
	    }
	  })
  },

  find: function(req, res, next) {
    models.User.findOne({where: {id: req.userId}, include: [ {model: models.Travel, include: [models.Schedule]}]})
      .then(function(user){
        // Map object to return only neccessary information
        var result = _.omit(user.dataValues, 'Travels');
        result.Travels = _.map(user.dataValues.Travels, function(travel){
          var sub = _.omit(travel.dataValues, 'Schedules');
            sub.Schedules = _.map(travel.dataValues.Schedules, function(schedule){
              return schedule.dataValues;
            });
          return sub;
        });
        // console.log(result.Travels[0].Schedules);
        return res.status(200).json(result);
      })
      .catch(function(){
        return res.status(400).json({error: 'No schedule set'})
      })
  }
}