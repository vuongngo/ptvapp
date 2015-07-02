var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var routes = require('./routes/index');
var passport = require('./lib/passport');

// Set environment variables
var Config = require('./config/config.js');
var conf = new Config();

// Set connection with MySQL database
var models = require('./models');
models.sequelize.sync().then(function() {
  console.log("Mysql connected");	
});

// Setting express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(passport.initialize());

// Get routes from routes/index.js
routes(app);

app.listen(3000, function(){
	console.log('Express listen on port 3000')
});

// Export app to use in test
module.exports = app;
