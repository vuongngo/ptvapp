var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var routes = require('./routes/index');
var passport = require('./lib/passport');
var params = require('./lib/params');

// Set environment variables
var Config = require('./config/config');
var conf = new Config();

// Set connection with MySQL database
var models = require('./models');
models.sequelize.sync().then(function() {
  console.log("Mysql connected");	
});

// Setting express middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(passport.initialize());
params(app);

// Get routes from routes/index.js
routes(app);

app.listen(conf.env_port, function(){
	console.log('Express listen on port ' + conf.env_port)
});

// Export app to use in test
module.exports = app;
