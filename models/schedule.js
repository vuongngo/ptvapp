'use strict';

module.exports = function(sequelize, DataTypes){ 
  var Schedule = sequelize.define('Schedule', {
	from: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 50000
	  }
	},
	line: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 50000
	  }
	},
	to: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 50000
	  }
	},
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
        Schedule.belongsTo(models.User);
        Schedule.belongsTo(models.Travel);
      }
    }    
  });

  return Schedule;
};