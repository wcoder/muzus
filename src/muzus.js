(function (_w, _d) {
	'use strict';

	// consts

	var MUZUS_CLASS = '.muzus',
		TRACK_STOPED = 0,
		TRACK_PLAYING = 1,
		TRACK_PAUSED = 2;


	// fields

	var _this = {
		init: init
	};


	// methods

	function init () {
		var muzusDeclarations = findAllMuzusDeclarations();
		createMuzusPlayers(muzusDeclarations);
	}

	function findAllMuzusDeclarations () {
		var elements = _d.querySelectorAll(MUZUS_CLASS);
		return elements;
	}

	function createMuzusPlayers (declarations) {
		declarations.forEach(function (declaration) {
			new Player(declaration);
		});
	}

	// helpers

	function toFormatedString (value) {
		var min = parseInt((value / 60) % 60);
		var sec = parseInt(value % 60);
		return min + ':' + (sec < 10 ? '0' + sec : sec);
	}

	function createElement (tagName, className, parentElement) {
		var e = document.createElement(tagName);
		e.className = className;
		if (typeof parentElement !== 'undefined') {
			parentElement.appendChild(e);
		}
		return e;
	}

	function createRangeElement (className, parentElement) {
		var e = createElement('input', className, parentElement);
		e.type = 'range';
		e.max = 100;
		e.min = 0;
		e.step = 0.01;
		e.value = 0;
		return e;
	}

	// classes

	function Player (element) {

		var currentTrack = null;

		var player = createElement('audio');
		player.preload = 'metadata';
		player.type = 'audio/mpeg';
		player.volume = 1;
		player.onplaying = function () {
			currentTrack.setEndTime(player.duration);
		};
		player.ontimeupdate = function () {
			if (player.duration > 0) {
				currentTrack.setProgress((player.currentTime / player.duration) * 100);
				currentTrack.setCurrentTime(player.currentTime);
			}
		};
		player.onprogress = function () {
			if (player.duration > 0) {
				var value = (player.buffered.end(player.buffered.length - 1) / player.duration) * 100;
				currentTrack.setBuffer(value);
			}
		};
		player.onended = function () {
			currentTrack.stop();
		};
		player.onerror = function (e) {
			_w.console.error(e);
			player.stop();
			currentTrack = null;
		};


		var audioTracks = element.querySelectorAll('a');

		audioTracks.forEach(function (trackElement) {
			new Track(trackElement, playCurrentTrack);
		});

		function playCurrentTrack (track) {
			switch (track.getState()) {
				case TRACK_PLAYING:
					currentTrack.pause();
					player.pause();
				break;
				case TRACK_PAUSED:
					currentTrack.play();
					player.play();
				break;
				default:
					if (!!currentTrack) {
						currentTrack.stop();
					}
					currentTrack = track;
					player.src = currentTrack.src;

					currentTrack.play();
					player.play();
				break;
			}
		}
	}

	function Track (element, playHandler) {
		var currentState = TRACK_STOPED;
		var _this = {
			src: element.href,
			title: element.innerText,
			play: function () {
				currentState = TRACK_PLAYING;
				element.className = 'muzus-track muzus-track-active';
				playBtn.className = 'muzus-pause';
			},
			pause: function () {
				currentState = TRACK_PAUSED;
				element.className = 'muzus-track';
				playBtn.className = 'muzus-play';
			},
			stop: function () {
				currentState = TRACK_STOPED;
				element.className = 'muzus-track';
				playBtn.className = 'muzus-play';
			},
			setCurrentTime: function (time) {
				currentTimeLabel.innerText = toFormatedString(time);
			},
			setProgress: function (percent) {
				progressProcess.style.width = percent + '%';
				progressSpinner.value = percent;
			},
			setBuffer: function (percent) {
				progressBuffer.style.width = percent + '%';
				console.log(percent);
			},
			setEndTime: function (time) {
				endTimeLabel.innerText = toFormatedString(time);
			},
			getState: function () {
				return currentState;
			}
		};

		// reset default

		element.onclick = function () { return false; };
		element.innerText = '';
		element.className = 'muzus-track';

		// create controls

		var infoRow = createElement('div', 'muzus-info', element);
			var playBtn = createElement('span', 'muzus-play', infoRow);
			var titleLabel = createElement('span', 'muzus-title', infoRow);
			var timeBlock = createElement('span', 'muzus-time', infoRow);
				var currentTimeLabel = createElement('span', 'muzus-time-current', timeBlock);
				var endTimeLabel = createElement('span', 'muzus-time-end', timeBlock);
		var progressBlock = createElement('div', 'muzus-progress', element);
			var progressBuffer = createElement('div', 'muzus-progress-buffer', progressBlock);
			var progressProcess = createElement('div', 'muzus-progress-process', progressBlock);
			var progressSpinner = createRangeElement('muzus-progress-spinner', progressBlock);

		// setup controls

		titleLabel.innerText = _this.title;

		playBtn.onclick = function () {
			playHandler(_this);
		};



		console.log(element);


	}

	return _this;
}(window, document).init());