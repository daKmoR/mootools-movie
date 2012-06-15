/*
---
name: Behavior.Movie.Marker
description: ...
provides: [Behavior.Movie.Marker]
requires: [Behavior/Behavior, Behavior.Movie, Movie.Marker]
script: Behavior.Movie.Marker.js

...
*/

Behavior.addGlobalFilter('Movie.Marker', {

	required: ['frame'],

	defaults: {
		target: '![data-behavior="Movie"]',
	},

	setup: function(element, api) {
		var target = element.getElement(api.getAs(String, 'target'));
		var Movie = target.getBehaviorResult('Movie');
		
		var options = {};
		if (api.getAs(String, 'method')) {
			options.method = api.getAs(String, 'method');
		}
		if (api.getAs(String, 'location')) {
			options.location = api.getAs(String, 'location');
		}

		var MovieMarker = Movie.addMarker(api.getAs(Number, 'frame'), options);
		return MovieMarker;
	}
	
});