'use strict';

module.exports = function(sequelize, DataTypes){ 
  var Schedule = sequelize.define('Schedule', {
	time: {
	  type: DataTypes.DATE,
	  validate: {
	  	isDate: true, 
	  }
	},
	day: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isIn: [['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']],
	  }
	}
  }, {
    timestamps: true,
	classMethods: {
      associate: function(models) {
        Schedule.belongsTo(models.Travel);
      }
    }    
  });

  return Schedule;
};