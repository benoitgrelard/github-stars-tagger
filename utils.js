function forEach(array, callback, scope) {
	for (var i=0; i<array.length; i++) {
		callback.call(scope, array[i], i);
	}
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
