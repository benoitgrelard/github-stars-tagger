function forEach(array, callback, scope) {
	for (var i=0; i<array.length; i++) {
		callback.call(scope, array[i], i);
	}
}
