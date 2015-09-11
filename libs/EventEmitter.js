'use strict';

/**
 * @class EventEmitter
 */
class EventEmitter {

	constructor () {
		this._listeners = [];
	}

	on (eventName, callback) {
		this._listeners.push({
			name: eventName,
			callback: callback
		});
		return this;
	}

	off (eventName, callback) {
		this._listeners.forEach(function(listener, index) {
			if (listener.name === eventName && listener.callback === callback) {
				this._listeners.splice(index, 1);
			}
		}, this);
		return this;
	}

	emit (eventName, data) {
		this._listeners
			.filter(function(listener) { return listener.name === eventName; }, this)
			.forEach(function(listener) { listener.callback(data, this, eventName); }, this);
		return this;
	}

}

/* jshint unused: false */
