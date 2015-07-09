/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		bootstrap: {
			deps: ['jquery']
		}
	},
	paths: {
		jquery: './lib/jquery',
		underscore: './lib/underscore-min',
		backbone: './lib/backbone-min',
		text: './lib/text',
		// googlemaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAUXcuAsZ3foFSpn9VN00RZaZvD1M5N6GQ',
		bootstrap: './lib/bootstrap.min',
		async: './lib/async'
	}
});

require([
	'backbone',
	'views/app',
	'bootstrap'
], function (Backbone, AppView, bootstrap) {
	// Initialize the application view
	new AppView();
});