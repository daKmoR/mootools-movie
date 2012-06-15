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
	},

	setup: function(element, api) {
		var options = {};
		var movie = new Movie(element, options);
		
		return movie;
	}

});