((window) => {

	'use strict';


	/**
	 * @class Model
	 */
	class Model extends GSM.EventEmitter {

		constructor(data) {
			super();

			this.data = data;
		}

	}


	window.GSM = window.GSM || {};
	GSM.Model = Model;

})(window);
