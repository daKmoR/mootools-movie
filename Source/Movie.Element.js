/*
---

name: Movie.Element
description: Movie Element for Movie
license: MIT-style license
authors:
  - Thomas Allmer
requires: [Movie]
provides: [Movie.Element]

...
*/

Movie.Element = new Class({

	Implements: [Options, Chain, Events],

	options: {
	},
	
	fxs: [],

	initialize: function (element, movie, options) {
		this.setOptions(options);
		this.movie = movie;
		this.element = element;
		
		if (this.movie.options.checkDurations === true) {
			this.checkDurations();
		}
		
		Object.each(this.options, function(values, startFrame) {
			this.startFrame = startFrame;
			
			Object.each(values, function(allFxsOptions, property) {
				var fxOptions = { 'property': property };
				var fxsOptions = Array.clone(Array.from(allFxsOptions));
				fxsOptions.each(function(o) {
					if (typeOf(o) == 'object') {
						fxOptions = o;
						fxsOptions.erase(o);
					}
				});
				fxOptions.property = property;
				fxOptions.frameSkip = false;
				
				var startFrame = this.startFrame.toInt();
				var duration = fxOptions.duration ? fxOptions.duration : 500;
				var endFrame = startFrame + Math.round(duration / 1000 * 60);
				
				/* EVENT */
				this.movie.addEvent('f' + startFrame, function(frame, reverse) {
					if (reverse === false) {
						//console.log('STARTstart ' + fxOptions.property + ': ' + this.element.get('src'));
						var fx = new Fx.Tween(this.element, fxOptions);
						this.fxs.push(fx);
						fx.startFrame = startFrame;
						fx.setOptions(fxOptions);
						fx.start(fxsOptions).chain(function() {
							//console.log('delete ' + fx.property + ': ' + fx.element.get('src'));
							this.fxs.erase(fx);
						}.bind(this));
					}
					
					if (this.movie._moveToFrame === true && reverse === true) {
						this.fxs.each(function(fx) {
							if (fx.startFrame === startFrame && fx.property === property) {
								//console.log('MOVEstartFrame ' + fx.property + ': ' + fx.element.get('src'));
								fx.goToFrame(-1);
							}
						});
					}
				}.bind(this));
				
				this.movie.addEvent('f' + endFrame, function(frame, reverse) {
					if (reverse === true) {
						//console.log('STARTend ' + fxOptions.property + ': ' + this.element.get('src'));
						var fx = new Fx.Tween(this.element, fxOptions);
						this.fxs.push(fx);
						fx.startFrame = startFrame;
						fx.reverse = true;
						fx.setOptions(fxOptions);
						fx.start(fxsOptions).chain(function() {
							//console.log('delete ' + fx.property + ': ' + fx.element.get('src'));
							this.fxs.erase(fx);
						}.bind(this));
						fx.frame = fx.frames;
					}
					
					if (this.movie._moveToFrame === true && reverse === false) {
						this.fxs.each(function(fx) {
							if (fx.startFrame === startFrame && fx.property === property) {
								//console.log('MOVEendFrame ' + fx.property + ': ' + fx.element.get('src'));
								fx.goToFrame(fx.frames);
							}
						});
					}
				}.bind(this));
				
			}, this);
		}, this);
	},
	
	checkDurations: function() {
		Object.each(this.options, function(values, startFrame) {
			this.startFrame = startFrame.toInt();
			if (this.endFrame && this.startFrame < this.endFrame) {
				console.error('Movie Error: at Frame "' + this.startFrame + '" the Property "' + this.property + '" starts although a previous animation on this element is not finished!', this.element);
			}
			Object.each(values, function(fxsOptions, property) {
				var fxOptions = {};
				fxsOptions.each(function(o) {
					if (typeOf(o) == 'object') {
						fxOptions = o;
					}
				});
				this.property = property;
				var duration = fxOptions.duration ? fxOptions.duration : 500;
				this.endFrame = this.startFrame + Math.round(duration / 1000 * 60);
			}, this);
		}, this);
	},
	
	pause: function() {
		this.fxs.invoke('pause');
	},
	
	resume: function() {
		this.fxs.invoke('resume');
	},
	
	setReverse: function(reverse) {
		var reverse = reverse === false ? false : true;
		this.fxs.each(function(fx) {
			fx.reverse = reverse;
		});
	},
	
	moveToFrame: function(frame, relative) {
		var relative = relative === true ? true : false;
		this.fxs.each(function(fx) {
			fx.goToFrame(frame - fx.startFrame);
		});
	}
	
});

Movie.implement({

	addElement: function(element, options) {
		var movieElement = new Movie.Element(element, this, options);
		this.elements.push(movieElement);
		return movieElement;
	}

});