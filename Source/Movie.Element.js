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
	
	fxs: {},
	startValues: {},
	savedStyle: '',

	initialize: function (element, movie, options) {
		this.setOptions(options);
		this.movie = movie;
		this.element = element;
		
		this.savedStyle = this.element.get('style');
		
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
				
				var startFrame = this.startFrame.toInt();
				var duration = fxOptions.duration ? fxOptions.duration : 500;
				var endFrame = startFrame + Math.round(duration / 1000 * 60);
				
				/* EVENT */
				this.movie.addEvent('f' + startFrame, function(frame, reverse) {
					if (reverse === false) {
						this.fxs[property] = this.fxs[property] ? this.fxs[property] : new Fx.Tween(this.element, fxOptions);
						this.fxs[property].startFrame = startFrame;
						this.fxs[property].setOptions(fxOptions);
						this.fxs[property].start(fxsOptions).chain(function() {
							console.log('delete', property);
							delete this.fxs[property];
						}.bind(this));
					}
				}.bind(this));
				
				this.movie.addEvent('f' + endFrame, function(frame, reverse) {
					console.log('endframe', reverse);
					if (reverse === true) {
						this.fxs[property] = this.fxs[property] ? this.fxs[property] : new Fx.Tween(this.element, fxOptions);
						this.fxs[property].setOptions(fxOptions);
						this.fxs[property].startFrame = startFrame;
						this.fxs[property].reverse = true;
						this.fxs[property].start(fxsOptions).chain(function() {
							console.log('delete', property);
							delete this.fxs[property];
						}.bind(this));
						this.fxs[property].frame = this.fxs[property].frames;
					}
				}.bind(this));
				
			}, this);
		}, this);
	},
	
	// start: function(frame) {
		// console.log('START', this.options[frame]);
		// Object.each(this.options[frame], function(allFxsOptions, property) {
			// //this.startValues[frame][property] = this.element.getStyle(property);
			// var fxOptions = { 'property': property };
			// var fxsOptions = Array.clone(Array.from(allFxsOptions));
			// fxsOptions.each(function(o) {
				// if (typeOf(o) == 'object') {
					// fxOptions = o;
					// fxsOptions.erase(o);
				// }
			// });
			// fxOptions.property = property;
			// //console.log('options', fxOptions);
			// this.fxs[property] = this.fxs[property] ? this.fxs[property] : new Fx.Tween(this.element, fxOptions);
			// this.fxs[property].setOptions(fxOptions);
			// this.fxs[property].start(fxsOptions);
			// // this.fxs[property].frame = 0;
			// // this.fxs[property].pause();
		// }, this);
	// },
	
	pause: function() {
		Object.each(this.fxs, function(fx) {
			fx.pause();
		});
	},
	
	resume: function() {
		Object.each(this.fxs, function(fx) {
			fx.resume();
		});
	},
	
	// transitionToFrame: function(frame) {
		// Object.each(this.fxs, function(fx) {
			// var to = (fx.startFrame - frame).limit(0, fx.frames);
			// console.log(to);
		// });
	// },
	
	setReverse: function(reverse) {
		var reverse = reverse === false ? false : true;
		Object.each(this.fxs, function(fx) {
			fx.reverse = reverse;
		});
	}
	
	// transitionToFrame: function(frameTo, frame) {
		// var frame = frame === -1 ? 0 : frame;
		// //console.log(frameTo, frame);
		
		// Object.each(this.options, function(values, startFrame) {
			// this.startFrame = startFrame;
			// Object.each(values, function(allFxsOptions, property) {
				// var fxOptions = {};
				// var fxsOptions = Array.clone(Array.from(allFxsOptions));
				// fxsOptions.each(function(o) {
					// if (typeOf(o) == 'object') {
						// fxOptions = o;
						// fxsOptions.erase(o);
					// }
				// });
				
				// var startFrame = this.startFrame.toInt();
				// var duration = fxOptions.duration ? fxOptions.duration : 500;
				// var endFrame = startFrame + Math.round(duration / 1000 * 60);
				
				// // from inside to inside
				// if ((frame >= startFrame && frame <= endFrame) && (frameTo >= startFrame && frameTo <= endFrame)) {
					// if (!this.fxs[property]) {
						// this.start(startFrame);
					// }
					// console.log('ii ' + frame + ' => ' + frameTo + ': ' + this.fxs[property].frame + ' [' + startFrame + '->' + endFrame  + ']');
					// this.fxs[property].transitionToFrame(frameTo - startFrame);
				// }
				
				// // from before to inside
				// if ((frame < startFrame) && (frameTo >= startFrame && frameTo <= endFrame)) {
					// if (!this.fxs[property]) {
						// this.start(startFrame);
					// }
					// console.log('bi ' + frame + ' => ' + frameTo + ': ' + this.fxs[property].frame + ' / ' + (frameTo - startFrame) + ' [' + startFrame + '->' + endFrame + ']');
					// // ii 74 => 89: 74 [0->90] 
					// // bi 89 => 104: 4 / 89 [100->160] 
					
					// if (frame - this.fxs[property].frame !== startFrame) {
						// console.log('needs Chaining');
						// this.fxs[property].transitionToFrame(this.fxs[property].frames).chain(function() { 
							// console.log('chainedto', frameTo - startFrame);
							// this.fxs[property].setOptions(fxOptions);
							// this.fxs[property].start(fxsOptions);
							// this.fxs[property].transitionToFrame(frameTo - startFrame);
						// }.bind(this));
						
						// // .chain(function() {
							// // console.log('chained');
							// // // this.fxs[property].setOptions(fxOptions);
							// // // this.fxs[property].start(fxsOptions);
							// // // this.fxs[property].transitionToFrame(frameTo - startFrame);
						// // });
					// } else {
						// this.fxs[property].transitionToFrame(frameTo - startFrame);
					// }
				// }
				
				// // from after to inside
				// if ((frame > endFrame) && (frameTo >= startFrame && frameTo <= endFrame)) {
					// if (!this.fxs[property]) {
						// this.start(startFrame);
					// }
					// console.log('ai ' + frame + ' => ' + frameTo + ': ' + this.fxs[property].frame + ' [' + startFrame + '->' + endFrame + ']');
					// // if (this.fxs[property].frame < this.fxs[property].frames) {
						// // // fx already switched
					// // } else {
						// this.fxs[property].setOptions(fxOptions);
						// this.fxs[property].start(fxsOptions);
						// this.fxs[property].goToFrame(this.fxs[property].frames);
					// // }
					// this.fxs[property].transitionToFrame(frameTo - startFrame);
				// }
				
				// // from inside to after with fx already started
				// if ((frame >= startFrame && frame <= endFrame) && (frameTo > endFrame) && this.fxs[property]) {
					// this.fxs[property].transitionToFrame(this.fxs[property].frames);
				// }
				
				// // from inside to before with fx already started
				// if ((frame >= startFrame && frame <= endFrame) && (frameTo < startFrame) && this.fxs[property]) {
					// this.fxs[property].transitionToFrame(0);
				// }
				
				// // if ( this.fxs[property] && (frame >= startFrame && frame <= endFrame)) {
					// // console.log('frames', (this.fxs[property].frame + startFrame) + ' => ' + frameTo + '[' + frame + ']');
					// // console.log('fx[' + property + ']', '[' + startFrame + ', ' + endFrame + ']');
					// // console.log('options', fxOptions);
				// // }
				
			// }, this);
		// }, this);
	// }
	
});

Movie.implement({

	addElement: function(element, options) {
		var movieElement = new Movie.Element(element, this, options);
		this.elements.push(movieElement);
		return movieElement;
	}

});