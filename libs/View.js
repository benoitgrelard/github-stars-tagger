/**
 * @class View
 */
function View() {
	// super
	EventEmitter.call(this);

	this.rootElement = this.createRootElement();
}

View.prototype = Object.create(EventEmitter.prototype);
View.prototype.constructor = View;



View.prototype.constructor = View;

View.prototype.createRootElement = function() {
	var rootElem = document.createElement('div');
	rootElem.classList.add(this.constructor.rootClass);
	return rootElem;
};

View.prototype.render = function() {
	// override this method
};

View.prototype.getElement = function(selector) {
	if (typeof selector === 'undefined') {
		return this.rootElement;
	} else {
		return this.rootElement.querySelector(selector);
	}
};

View.prototype.injectInto = function(parentElem) {
	parentElem.appendChild(this.getElement());
};

View.prototype.injectAfter = function(siblingElem) {
	utils.insertAfter(this.getElement(), siblingElem);
};
