/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
  '../collections/departurescollection',
  '../views/departureview'
], function ($, _, Backbone, departuresCollection, DepartureView) {
	'use strict';
    var DeparturesCollectionView = Backbone.View.extend({
      el: $('#departures'), 

      initialize: function(){
        this.$list = $('#departures'); 
        $('html, body').animate({
          scrollTop: $('#departures').offset().top
        }, 1000);
        this.$list.append('</br><h3>Departures time</h3>');
        this.listenTo(departuresCollection, 'reset', this.renderDepartures);
      },

      renderDepartures: function(){
        var departs = departuresCollection.toJSON();
        var self = this;
        _.each(departs, function(depart){
          var view = new DepartureView({model: depart});
          self.$list.append(view.render().el);
        })
      }
    });

	return DeparturesCollectionView;
});