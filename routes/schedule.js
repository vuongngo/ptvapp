var models = require('../models');
var query = require('../lib/query');

// Check if string is null, unidentified or blank
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = {
  create: function(req, res, next) {
  	var params = req.body;
  	if (isBlank(params.userId) || isBlank(params.mode) || isBlank(params.line) || isBlank(params.stop) || isBlank(params.directionid) || isBlank(params.limit) || isBlank(params.timeslot) || isBlank(params.time) || isBlank(params.day)) {
  	  return res.status(404).json({error: 'Missing params'})
  	};
  	var uid = params.userId;
  	var travel_args = {mode: params.mode, line: params.line, stop: params.stop, directionid: params.directionid, limit: params.limit, timeslot: params.timeslot};

	var schedule_args = {time: params.time, day: params.day};
	query.createSchedule(uid, travel_args, schedule_args, function(err, obj){
	  console.log(err);
	  if (err){ 
	  	return res.status(404).json(err);
	  } else {
	  	return res.status(200).json({success: 'Created schedule'});
	  }
	})
  }
}