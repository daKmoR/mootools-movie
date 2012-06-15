/*
---

name: Movie.Marker
description: Movie Marker for Movie
license: MIT-style license
authors:
  - Thomas Allmer
requires: [Movie]
provides: [Movie.Marker]

...
*/

Movie.Marker = new Class({

	Implements: [Options],

	options: {
		method: 'moveToFrame'
	},

	initialize: function (frame, movie, options) {
		this.setOptions(options);
		this.frame = frame;
		this.movie = movie;
		/* EVENT */
		this.movie.addEvent('f' + frame, function(frame, reverse) {
			if (this.options.method === 'setLocation') {
				this.setLocation();
			}
		}.bind(this));
	},
	
	moveToFrame: function() {
		this.movie.moveToFrame(this.frame);
	},
	
	setLocation: function() {
		document.location = this.options.location;
	}
	
});

Movie.implement({

	markers: [],

	addMarker: function(frame, options) {
		var movieMarker = new Movie.Marker(frame, this, options);
		this.markers.push(movieMarker);
		return movieMarker;
	},
	
	findNearestMarker: function(frame, mode) {
		if (this.markers.length === 0) return false;
		if (this.markers.length === 1) return this.markers[0];
		var frame = frame || this.frame;
		frame = frame === -1 ? 0 : frame;
		var mode = mode || 'next';
		
		var bestMarker = false;
		var bestDiff = 100000;
		
		this.markers.each(function(marker) {
			if (mode === 'next') {
				var diff = marker.frame - frame;
			}
			if (mode === 'previous') {
				var diff = frame - marker.frame;
			}
			
			if (bestDiff > diff && diff > 0) {
				bestDiff = diff;
				bestMarker = marker;
			}
			
		});
		return bestMarker;
	},
	
	findNextMarker: function(frame) {
		return this.findNearestMarker(frame, 'next');
	},
	
	findPreviousMarker: function(frame) {
		return this.findNearestMarker(frame, 'previous');
	},
	
	next: function(frame) {
		var nextMarker = this.findNextMarker(frame);
		if (nextMarker) {
			nextMarker[nextMarker.options.method]();
		}
	},
	
	previous: function(frame) {
		var previousMarker = this.findPreviousMarker(frame);
		if (previousMarker) {
			previousMarker[previousMarker.options.method]();
		}
	}

});