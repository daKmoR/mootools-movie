/*
---
name: Behavior.Movie
description: Adds a Movie interface
provides: [Behavior.Movie]
requires: [Behavior/Behavior, Movie]
script: Behavior.Movie.js

...
*/

Behavior.addGlobalFilter('Movie', {

	defaults: {
		checkdurations: false
	},

	setup: function(element, api) {
		var options = {};
		options.checkDurations = api.getAs(Boolean, 'checkdurations');
		var movie = new Movie(options);
		
		return movie;
	}

});