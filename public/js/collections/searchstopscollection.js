/*global define */
define([
	'underscore',
	'backbone',
	'../models/stop'
], function (_, Backbone, Stop) {
	'use strict';

    // Search stops collection get by search query
    var SearchStopsCollection = Backbone.Collection.extend({
      model: Stop,
      url: '/api/search'
    });


	return new SearchStopsCollection();
});