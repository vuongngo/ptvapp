/*global define */
define([
	'underscore',
	'backbone',
	'../models/stop'
], function (_, Backbone, Stop) {
	'use strict';

    // Nearby stops collection get by lat and lng
    var StopsCollection = Backbone.Collection.extend({
      model: Stop,
      url: '/api/nearby'
    });


	return new StopsCollection();
});