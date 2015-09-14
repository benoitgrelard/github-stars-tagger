'use strict';

const utils = {

	forEach (array, callback, scope) {
		for (let i=0; i<array.length; i++) {
			callback.call(scope, array[i], i);
		}
	},

	insertAfter (newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	},

	unique (array) {
		const hash = {};
		const res = [];
		for (let i=0; i<array.length; i++) {
			const item = array[i];
			if (!hash[item]) {
				hash[item] = true;
				res.push(item);
			}
		}
		return res;
	}

};

/* jshint unused: false */
