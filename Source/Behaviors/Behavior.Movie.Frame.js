/*
---
name: Behavior.Movie.Frame
description: ...
provides: [Behavior.Movie.Frame]
requires: [Behavior/Behavior, Behavior.Movie, Movie.Frame]
script: Behavior.Movie.Frame.js

...
*/

Behavior.addGlobalFilter('Movie.Frame', {

	required: ['frame'],
	
	delay: 10,

	defaults: {
		target: '[data-behavior="Movie"], !div > [data-behavior="Movie"], !div > * > [data-behavior="Movie"], !body [data-behavior="Movie"]'
	},

	setup: function(element, api) {
		var target = element.getElement(api.getAs(String, 'target'));
		var movie = target.getBehaviorResult('Movie');
		
		movie.addEvent('frameChange', function(frame) {
			element.set('text', frame);
		});
		
		return movie;
	}
	
});