/*
---

name: Movie
description: Movie Class, to combine various animations (frame based) [CSS:Movie/Source/Css/Movie.css]
license: MIT-style license.
requires: [Core/Fx.Tween, Core/Fx.Transitions]
provides: [Movie]

...
*/

var Movie = new Class({

	Extends: Fx,

	options: {
		duration: 100000,
		frameSkip: false,
		notMovie: false
	},
	
	elements: [],

	initialize: function(options) {
		this.parent(options);
		(function() { this.start(); this.pause(); }).delay(50, this);
	},
	
	step: function(now) {
		this.parent(now);
		this.fireEvent('f' + this.frame, [this.frame, this.reverse]);
		this.fireEvent('frameChange', [this.frame, this.reverse]);
	},

	start: function() {
		this.parent(0, this.options.duration);
	},
	
	pause: function() {
		this.elements.invoke('pause');
		this.parent();
	},
	
	stop: function() {
		this.pause();
		this.frame = -1;
	},
	
	resume: function() {
		this.elements.invoke('resume');
		this.parent();
	},
	
	transitionToFrame: function(frame) {
		if (frame === this.frame || frame > this.frames || frame < 0 || (this.frame == -1 && frame == 0)) return this;
		//console.log('frame', this.frame + ' -> ' + frame);
		this.parent(frame);
		this.elements.invoke('setReverse', this.reverse);
		this.elements.invoke('resume');
	},
	
	moveToFrame: function(frame) {
		if (frame === this.frame || frame > this.frames || frame < 0 || (this.frame == -1 && frame == 0)) return this;
		this.parent(frame);
		this.elements.invoke('moveToFrame', frame, true);
	}

});