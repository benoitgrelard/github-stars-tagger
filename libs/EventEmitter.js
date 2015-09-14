'use strict';

/**
 * @class EventEmitter
 */
class EventEmitter {

	constructor() {
		this._listeners = [];
	}

	on(eventName, callback) {
		this._listeners.push({
			name: eventName,
			callback: callback
		});

		return this;
	}

	off(eventName, callback) {
		this._listeners.forEach((listener, index) => {
			if (listener.name === eventName && listener.callback === callback) {
				this._listeners.splice(index, 1);
			}
		});

		return this;
	}

	emit(eventName, data) {
		this._listeners
			.filter(listener => listener.name === eventName)
			.forEach(listener => listener.callback(data, this, eventName));

		return this;
	}

}

/* jshint unused: false */
