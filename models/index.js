"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var Config    = require('../config/config.js');
var conf      = new Config();
var sequelize = new Sequelize(conf.db, conf.db_user, conf.db_password, {
  host: conf.db_host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;