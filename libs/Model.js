((window) => {

	'use strict';


	/**
	 * @class Model
	 */
	class Model extends GSO.EventEmitter {

		constructor(data) {
			super();

			this.data = data;
		}

	}


	window.GSO = window.GSO || {};
	GSO.Model = Model;

})(window);
