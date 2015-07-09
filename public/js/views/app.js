/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'../collections/stopscollection',
	'../collections/searchstopscollection',
	'../views/map',
	'text!templates/search.html',
], function ($, _, Backbone, stopsCollection, searchStopsCollection, Map, searchTemplate) {
	'use strict';

        // Main view 
        var AppView = Backbone.View.extend({
          el: $('#header'),

          events: {
            'click #current-location': 'switchSearchMethod',
            'click #search': 'searchStops'
          },

          searchTemplate: _.template(searchTemplate),

          initialize: function(){
            this.listenTo(stopsCollection, 'reset', this.appendStops);
            this.listenTo(searchStopsCollection, 'reset', this.appendSearchStops);
            this.render();
          },

          render: function(){
            $(this.el).append(this.searchTemplate);
          },


          searchStops: function(){
            var param = $("#location").val();
            searchStopsCollection.fetch({data: $.param({search: param}), reset: true});
          },

          // Switch to use geolocation and hide search form
          switchSearchMethod: function(){
            if ($('#current-location').is(':checked')) {
              $('#location').hide();
              $('#search').hide();
              this.getCurrentLocation();
            } else {
              $('#location').show();
              $('#search').show();
            }
          },

          // Use geolocation to get coordinations and fetch stops using StopsCollection
          getCurrentLocation: function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                  stopsCollection.fetch({data: $.param({lat: position.coords.latitude, lng: position.coords.longitude}), reset: true});
                });
            } else {
                console.log("Geolocation break");
            }

          },

          // This is trigger when StopsCollection is successfully fetch, create Map 
          appendStops: function(){
            // Process collection information to pass only neccessary information to map
            var arr = _.map(stopsCollection.toJSON(), function(local) {
              return _.pick(local.result, 'location_name', 'lat', 'lon', 'transport_type', 'stop_id')
            });

            var map = new Map({collection: arr});
          },

          appendSearchStops: function(){
            function checked(location) {
              if (location.location_name && location.lat && location.lon) {
                return true
              } else {
                return false
              }
            }
            // PTV doesn't pass consistent data, need to check before map into Map
            var collect = _.filter(searchStopsCollection.toJSON(), function(local) {
              return checked(local.result);

            });
            var arr = _.map(collect, function(local) {
                return _.pick(local.result, 'location_name', 'lat', 'lon', 'transport_type', 'stop_id')
            });
            var map = new Map({collection: arr});
          }
        });

    return AppView;
})