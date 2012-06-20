/*
---
name: Behavior.Movie.Element
description: ...
provides: [Behavior.Movie.Element]
requires: [Behavior/Behavior, Behavior.Movie, Movie.Element]
script: Behavior.Movie.Element.js

...
*/

Behavior.addGlobalFilter('Movie.Element', {

	defaults: {
		target: '![data-behavior="Movie"]'
	},

	setup: function(element, api) {
		var target = element.getElement(api.getAs(String, 'target'));
		var Movie = target.getBehaviorResult('Movie');
		
		var options = element.getJSONData('movie-element-options');

		var MovieElement = Movie.addElement(element, options);
		return MovieElement;
	}
	
});