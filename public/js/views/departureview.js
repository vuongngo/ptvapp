/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
  'text!templates/departure.html',
], function ($, _, Backbone, DepartureTemplate) {
	'use strict';

  var DepartureView = Backbone.View.extend({
    tagName: 'li',
    departureTemplate: _.template(DepartureTemplate),
    intialize: function(){
      this.listenTo(this.model, 'change', this.render);
    },

    render: function(){
      console.log(this.model);
      this.$el.html(this.departureTemplate(this.model));
      return this;
    }
  });

	return DepartureView;
});