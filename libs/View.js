'use strict';

/**
 * @class View
 */
class View extends EventEmitter {

	constructor() {
		super();

		this.refs = {
			root: this.createRootElement()
		};

		this.handlers = {};
	}

	static getRootClass() {
		// override this method
		return '';
	}

	createRootElement() {
		const rootElem = document.createElement('div');
		rootElem.classList.add(this.constructor.getRootClass());

		return rootElem;
	}

	render() {
		// override this method
	}

	getElement(selector) {
		if (typeof selector === 'undefined') {
			return this.refs.root;
		} else {
			return this.refs.root.querySelector(selector);
		}
	}

	injectInto(parentElem) {
		parentElem.appendChild(this.getElement());
	}

	injectAfter(siblingElem) {
		utils.insertAfter(this.getElement(), siblingElem);
	}
}

/* jshint unused: false */
