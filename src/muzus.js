/**
 * New conception of audio player for web.
 *
 * @author Yauheni Pakala
 * @copyright 2017 MIT License
 * @version 0.1.0
 */
(function (_w, _d) {
	'use strict';

	// consts

	var MUZUS_SELECTOR = '.muzus',
		MUZUS_PLAY = 'muzus-play',
		MUZUS_PAUSE = 'muzus-pause',
		MUZUS_TRACK = 'muzus-track',
		MUZUS_PROGRESS = 'muzus-progress',
		MUZUS_PROGRESS_TIME_HINT = 'muzus-progress-time-hint',
		TRACK_STOPED = 0,
		TRACK_PLAYING = 1,
		TRACK_PAUSED = 2;

	// helpers

	function toFormatedString (value) {
		var min = parseInt((value / 60) % 60),
			sec = parseInt(value % 60);
		return min + ':' + (sec < 10 ? '0' + sec : sec);
	}

	function createElement (tagName, className, parentElement) {
		var e = _d.createElement(tagName);
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

	function createAudioElement () {
		var e = createElement('audio');
		e.preload = 'metadata';
		e.type = 'audio/mpeg';
		e.volume = 1;
		return e;
	}

	// classes

	function Player (element, _repeatTrackListEnabled) {

		// private

		var _currentTrack = null,
			_trackList = [],
			_player = createAudioElement();

		// setup player

		_player.onplaying = function () {
			_currentTrack.setEndTime(_player.duration);
		};
		_player.ontimeupdate = function () {
			if (_player.duration > 0) {
				_currentTrack.setProgress((_player.currentTime / _player.duration) * 100);
				_currentTrack.setCurrentTime(_player.currentTime);
			}
		};
		_player.onprogress = function () {
			if (_player.duration > 0) {
				var value = (_player.buffered.end(_player.buffered.length - 1) / _player.duration) * 100;
				_currentTrack.setBuffer(value);
			}
		};
		_player.onended = nextTrack;
		_player.onerror = function (e) {
			_w.console.error(e);
			stopPlayer();
			_currentTrack = null;
		};

		// TODO:
		var trackElements = element.querySelectorAll('a');
		for (var i = 0; i < trackElements.length; i++) {
			var trackElement = trackElements[i];
			var track = new Track(i, trackElement);
			track.setClickHandler(trackClickHandler);
			track.setChangeProgressHandler(trackProgressChangedHandler);

			_trackList.push(track);

			preloadTrack(track);
		}

		// private methods

		function trackClickHandler (track) {
			switch (track.getState()) {
				case TRACK_PLAYING:
					_currentTrack.pause();
					_player.pause();
				break;
				case TRACK_PAUSED:
					_currentTrack.play();
					_player.play();
				break;
				default:
					startPlayTrack(track);
				break;
			}
		}

		function trackProgressChangedHandler (value) {
			if (_player.duration) {
				_player.currentTime = (value * _player.duration) / 100;
			} else {
				value = 0;
			}
		}

		function nextTrack () {
			var currentTrackIndex = _currentTrack.id,
				nextTrackIndex = currentTrackIndex < _trackList.length - 1 ? currentTrackIndex + 1 : 0;

			if (_trackList.length == 1) {
				stopPlayer();
				return;
			}
			if (nextTrackIndex < currentTrackIndex && !_repeatTrackListEnabled) {
				stopPlayer();
				return;
			}

			startPlayTrack(_trackList[nextTrackIndex]);
		}

		function startPlayTrack (track) {
			if (!!_currentTrack) {
				_currentTrack.stop();
			}
			_currentTrack = track;
			_player.src = _currentTrack.src;

			_currentTrack.play();
			_player.play();
		}

		function stopPlayer () {
			_player.pause();
			_player.currentTime = 0;

			_currentTrack.stop();
		}

		function preloadTrack (track) {
			var preloader = createAudioElement();
			preloader.volume = 0;
			preloader.src = track.src;
			preloader.onplaying = function () {
				preloader.pause();
				track.setCurrentTime(0);
				track.setEndTime(preloader.duration);
				preloader = null;
			}
			_w.setTimeout(function () {
				preloader.play();
			}, 100);
		}
	}

	function Track (id, element) {

		var _title = element.innerText,
			_src = element.href;

		// replace element

		var newElement = createElement('div', MUZUS_TRACK);
		element.parentNode.replaceChild(newElement, element);

		// private

		var _currentState = TRACK_STOPED,
			_duration = 0,
			_infoRow = createElement('div', 'muzus-info', newElement),
			_playButtonWrapper = createElement('span', 'muzus-play-wrapper', _infoRow),
			_playButton = createElement('span', MUZUS_PLAY, _playButtonWrapper),
			_titleLabel = createElement('span', 'muzus-title', _infoRow),
			_timeBlock = createElement('span', 'muzus-time', _infoRow),
			_currentTimeLabel = createElement('span', 'muzus-time-current', _timeBlock),
			_endTimeLabel = createElement('span', 'muzus-time-end', _timeBlock),
			_progressBlock = createElement('div', MUZUS_PROGRESS + ' muzus-progress-hide', newElement),
			_progressBuffer = createElement('div', 'muzus-progress-buffer', _progressBlock),
			_progressProcess = createElement('div', 'muzus-progress-process', _progressBlock),
			_progressSpinner = createRangeElement('muzus-progress-spinner', _progressBlock),
			_progressTimeHint = createElement('div', MUZUS_PROGRESS_TIME_HINT, _progressBlock),
			_self = {};

		// public

		_self.id = id;
		_self.src = _src;
		_self.title = _title;
		_self.play = function () {
			_currentState = TRACK_PLAYING;
			newElement.className = MUZUS_TRACK + ' muzus-track-active';
			_playButton.className = MUZUS_PAUSE;
			_progressBlock.className = MUZUS_PROGRESS;
		};
		_self.pause = function () {
			_currentState = TRACK_PAUSED;
			newElement.className = MUZUS_TRACK;
			_playButton.className = MUZUS_PLAY;
		};
		_self.stop = function () {
			_currentState = TRACK_STOPED;
			newElement.className = MUZUS_TRACK;
			_playButton.className = MUZUS_PLAY;
			_progressBlock.className = MUZUS_PROGRESS + ' muzus-progress-hide';

			_self.setCurrentTime(0);
			_self.setProgress(0);
			_self.setBuffer(0);
			_self.hideProgressTimeHint();
		};
		_self.getState = function () {
			return _currentState;
		};
		_self.setCurrentTime = function (time) {
			_currentTimeLabel.innerText = toFormatedString(time);
		};
		_self.setEndTime = function (time) {
			_duration = time;
			_endTimeLabel.innerText = toFormatedString(time);
		};
		_self.setProgress = function (percent) {
			_progressProcess.style.width = percent + '%';
			_progressSpinner.value = percent;
		};
		_self.setBuffer = function (percent) {
			_progressBuffer.style.width = percent + '%';
		};
		_self.setProgressTimeHint = function (time) {
			_progressTimeHint.innerText = toFormatedString(time);
		};
		_self.showProgressTimeHint = function () {
			if (_currentState > 0 && _duration > 0) {
				_progressTimeHint.className = MUZUS_PROGRESS_TIME_HINT + ' muzus-progress-time-hint-show';
			}
		};
		_self.hideProgressTimeHint = function () {
			_progressTimeHint.className = MUZUS_PROGRESS_TIME_HINT;
		};
		_self.setProgressTimeHintPosition = function (offsetLeft) {
			_progressTimeHint.style.left = offsetLeft + 'px';
		};
		_self.setClickHandler = function (handler) {
			_playButton.addEventListener('click', function () {
				handler(_self);
			});
		};
		_self.setChangeProgressHandler = function(handler) {
			_progressSpinner.addEventListener('input', function (e) {
				if (_currentState > 0  && _duration > 0) {
					handler(e.target.value);
				}
			});
		};

		// setup controls

		_titleLabel.innerText = _title;

		_progressSpinner.addEventListener('mouseover', _self.showProgressTimeHint);
		_progressSpinner.addEventListener('mouseout', _self.hideProgressTimeHint);
		_progressSpinner.addEventListener('mousemove', function (e) {
			if (_currentState > 0  && _duration > 0) {
				_self.setProgressTimeHintPosition(e.offsetX);
				_self.setProgressTimeHint(_duration * e.offsetX / _progressSpinner.offsetWidth);
			}
		});

		return _self;
	}

	return window.Muzus = {
		init: function (_repeatTrackList) {
			var _muzusDeclarations = _d.querySelectorAll(MUZUS_SELECTOR),
				_repeatTrackList = _repeatTrackList || false;

			for (var i = 0; i < _muzusDeclarations.length; i++) {
				new Player(_muzusDeclarations[i], _repeatTrackList);
			}
		}
	};


}(window, document).init());
