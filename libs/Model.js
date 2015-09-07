/**
 * @class Model
 */
function Model(data) {
	// super
	EventEmitter.call(this);

	this.data = data;
}

Model.prototype = Object.create(EventEmitter.prototype);
Model.prototype.constructor = Model;
