/*global define */
define([
	'underscore',
	'backbone',
	'../models/departure'
], function (_, Backbone, Departure) {
	'use strict';

    var DeparturesCollection = Backbone.Collection.extend({
      model: Departure,
      url: '/api/departures'
    });


	return new DeparturesCollection();
});