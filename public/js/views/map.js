/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'../collections/departurescollection',
	'../views/departurescollectionview',
	'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyAUXcuAsZ3foFSpn9VN00RZaZvD1M5N6GQ',
], function ($, _, Backbone, departuresCollection, DeparturesCollectionView) {
	'use strict';

        // Create map view for stops. Map is used with both StopsCollection and SearchStopsCollection
        var Map = Backbone.View.extend({
          el: $('#nearby-stops'),

          initialize: function(){
            var bus = '../images/bus.svg';
            var tram = '../images/tram.svg';
            var train = '../images/train.svg';
            // Force the height of the map to fit the window
            this.$el.height($(window).height() - $("#header").height());            
            
            // Create map central point
            var myLatlng = new google.maps.LatLng(this.collection[0].lat, this.collection[0].lon);
            var mapOptions = {
              zoom: 16,
              center: myLatlng
            }
            var map = new google.maps.Map(document.getElementById('nearby-stops'), mapOptions);

            // Create marks for stops
            var markers = _.map(this.collection, function(local){
              var myLatlng = new google.maps.LatLng(local.lat, local.lon);
              var marker;
              if (local.transport_type === "bus") {
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: local.location_name,
                    icon: bus
                });
                marker.mode = 2;                 
              } else if (local.transport_type === "tram") {
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: local.location_name,
                    icon: tram
                });
                marker.mode = 1;                                
              } else {
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: local.location_name,
                    icon: train
                });
                marker.mode = 0;
              };

              marker.stop_id = local.stop_id;
              return marker;                                
            });
            var self = this;
            _.each(markers, function(element){
              google.maps.event.addListener(element, 'click', self.openInfoWindow);                    
            })
          },

          openInfoWindow: function() {
            departuresCollection.fetch({data: $.param({mode: this.mode, stop: this.stop_id, limit: 2}), reset: true});
            var departuresCollectionView = new DeparturesCollectionView;
          }
        });

	return Map;
});