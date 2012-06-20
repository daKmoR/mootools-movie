/*
---

name: Fx

description: Contains the basic animation logic to be extended by all other Fx Classes.

license: MIT-style license.

requires: [Core/Chain, Core/Events, Core/Options]

provides: Fx

...
*/

(function(){

var Fx = this.Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: nil,
		onCancel: nil,
		onComplete: nil,
		*/
		fps: 60,
		unit: false,
		duration: 500,
		frames: null,
		frameSkip: false,
		link: 'ignore',
		notMovie: true
	},
	
	_transitionToFrame: false,
	_moveToFrame: false,
	reverse: false,

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
	},

	getTransition: function(){
		return function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function(now){
		if (this.options.frameSkip){
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			this.time = now;
			this.frame = this.reverse === false ? this.frame + frames : this.frame - frames;
		} else {
			this.frame = this.reverse === false ? this.frame + 1 : this.frame - 1;
		}
		
		if (this.frame < this.frames && this.frame > 0){
			var delta = this.transition(this.frame / this.frames);
			this.set(this.compute(this.from, this.to, delta));
			if (this._transitionToFrame && this.frame == this._transitionToFrame){
				this.pause();
			}
		} else if (this.frame > this.frames){
			this.frame = this.frames;
			this.set(this.compute(this.from, this.to, 1));
			this.stop();
		} else if (this.frame <= -1){
			this.frame = -1;
			this.set(this.compute(this.from, this.to, 0));
			this.stop();
		}
	},
	
	goToFrame: function(frame) {
		if (frame === this.frame || frame > this.frames || frame < -1) return this;
		this.reverse = frame < this.frame;
		this.frame = frame;
		this.time = null;
		this.step(Date.now());
	},
	
	transitionToFrame: function(frame) {
		if (frame === this.frame || frame > this.frames || frame < -1) return this;
		this.reverse = frame < this.frame;
	
		this._transitionToFrame = frame;
		this.resume();
		return this;
	},
	
	moveToFrame: function(frame) {
		if (frame === this.frame || frame > this.frames || frame < -1) return this;
		this.reverse = frame < this.frame;
	
		this._transitionToFrame = frame;
		this._moveToFrame = true;
		while (this.frame !== frame) {
			this.step();
		}
		this._moveToFrame = false;
		return this;
	},

	set: function(now){
		return now;
	},

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.isRunning()) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.frame = (this.options.frameSkip) ? 0 : -1;
		this.time = null;
		this.transition = this.getTransition();
		var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
		this.duration = Fx.Durations[duration] || duration.toInt();
		this.frameInterval = 1000 / fps;
		this.frames = frames || Math.round(this.duration / this.frameInterval);
		this.fireEvent('start', this.subject);
		pushInstance.call(this, fps);
		this.paused = false;
		return this;
	},

	stop: function(){
		//console.log('stop [' + this.frame + ']');
		if (this.isRunning() || this.paused){
			this.time = null;
			pullInstance.call(this, this.options.fps);
			if (this.frames == this.frame || this.frame <= -1){
				this.fireEvent('complete', this.subject);
				if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
			} else {
				this.fireEvent('stop', this.subject);
			}
		}
		return this;
	},

	cancel: function(){
		if (this.isRunning()){
			this.time = null;
			pullInstance.call(this, this.options.fps);
			this.frame = this.frames;
			this.fireEvent('cancel', this.subject).clearChain();
		}
		return this;
	},

	pause: function(){
		if (this.isRunning()){
			this.time = null;
			pullInstance.call(this, this.options.fps);
		}
		this.paused = true;
		return this;
	},

	resume: function(){
		if ((this.frame < this.frames) && !this.isRunning()) pushInstance.call(this, this.options.fps);
		this.paused = false;
		return this;
	},

	isRunning: function(){
		var list = instances[this.options.fps];
		return list && list.contains(this);
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

// global timers

var instances = {}, timers = {};

var loop = function(){
	var now = Date.now();
	for (var i = this.length; i--;){
		var instance = this[i];
		if (instance) instance.step(now);
	}
};

var pushInstance = function(fps){
	var list = instances[fps] || (instances[fps] = []);
	list.push(this);
	if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), list);
};

var pullInstance = function(fps){
	var list = instances[fps];
	if (list){
		list.erase(this);
		if (!list.length && timers[fps]){
			delete instances[fps];
			timers[fps] = clearInterval(timers[fps]);
		}
	}
};

})();
