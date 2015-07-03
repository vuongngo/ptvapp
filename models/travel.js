'use strict';

module.exports = function(sequelize, DataTypes){ 
  var Travel = sequelize.define('Travel', {
	mode: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 4
	  }
	},
	line: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 50000
	  }
	},
	stop: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 50000
	  }
	},
	directionid: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 1 
	  }
	},
	limit: {
	  type: DataTypes.INTEGER,
	  validate: {
	  	isInt: true,
	  	max: 20
	  }
	},
	timeslot: {
	  type: DataTypes.DATE,
	  validate: {
	  	isDate: true
	  }
	}
  }, {
    timestamps: true,
	classMethods: {
      associate: function(models) {
        Travel.belongsTo(models.User);
        Travel.hasMany(models.Schedule)
      }
    }    
  });

  return Travel;
};