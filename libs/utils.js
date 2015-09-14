'use strict';

var utils = {

	forEach (array, callback, scope) {
		for (var i=0; i<array.length; i++) {
			callback.call(scope, array[i], i);
		}
	},

	insertAfter (newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	},

	unique (array) {
		var hash = {};
		var res = [];
		for (var i=0; i<array.length; i++) {
			var item = array[i];
			if (!hash[item]) {
				hash[item] = true;
				res.push(item);
			}
		}
		return res;
	}

};

/* jshint unused: false */
