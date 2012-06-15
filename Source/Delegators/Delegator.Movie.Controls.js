/*
---
description: Movie Controls
provides: [Delegator.Movie.Controls]
requires: [Behavior/Delegator, Core/Element, Behavior.Movie]
script: Delegator.Movie.Controls.js
name: Delegator.Movie.Controls
...
*/

(function(){

	var triggers = {};
	['start', 'stop', 'pause', 'resume', 'next', 'previous'].each(function(action) {

		triggers['Movie.' + action] = {
			defaults: {
				targets: '!div > [data-behavior="Movie"], !div > * > [data-behavior="Movie"]'
			},
			handler: function(event, link, api) {
				event.stop();
				var targets = link.getElements(api.getAs(String, 'targets'));
				if (!targets) {
					api.fail('could not locate target movie to ' + action + ' it', link);
				}
				targets.each(function(target) {
					var movie = target.getBehaviorResult('Movie');
					movie[action]();
				});
			}
		};

	});
	Delegator.register('click', triggers);
	
	
	Delegator.register('mousewheel', 'Movie.MouseWheel', {

		defaults: {
			targets: '!div > [data-behavior="Movie"], !div > * > [data-behavior="Movie"]',
			step: 20
		},

		handler: function(event, link, api) {
			event.stop();
			var targets = link.getElements(api.getAs(String, 'targets'));
			targets.each(function(target) {
				var movie = target.getBehaviorResult('Movie');
				var step = api.getAs(Number, 'step');
				if (event.wheel > 0) {
					var goTo = (movie.frame - step < 0) ? 0 : movie.frame - step;
					movie.transitionToFrame(goTo);
				} else if (event.wheel < 0) {
					var goTo = (movie.frame + step > this.frames) ? movie.frames : movie.frame + step;
					movie.transitionToFrame(goTo);
				}
			});
		}

	});

})();