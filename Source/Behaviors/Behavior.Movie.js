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
	
		// $('blue').set('tween', { duration: 10000 }).tween('width', 700);
		// $('click2').addEvent('click', function(e) {
			// e.stop();
			// //$('blue').get('tween').goToFrame(150);
			// $('blue').get('tween').resume();
		// });
		
		var options = {};
		var movie = new Movie(element, options);
		
		return movie;
	}

});