
var utils = {

	forEach: function (array, callback, scope) {
		for (var i=0; i<array.length; i++) {
			callback.call(scope, array[i], i);
		}
	},

	insertAfter: function (newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	},

	unique: function (array) {
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
