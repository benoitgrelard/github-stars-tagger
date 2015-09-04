function Model(data) {
	this.data = data;
}

var ModelProto = Model.prototype;

ModelProto.getTagsForRepo = function(repoId) {
	return this.data[repoId] || [];
};

ModelProto.getDeserializedTagsForRepo = function(repoId) {
	return this.getTagsForRepo(repoId).join(', ') || '...';
};

ModelProto.byTag = function() {
	var pivotedData = {};

	for (var repoId in this.data) {
		var tags = this.getTagsForRepo(repoId);
		tags.forEach(pivot);
	}

	return pivotedData;

	function pivot(tag) {
		if (!(tag in pivotedData)) { pivotedData[tag] = []; }
		pivotedData[tag].push(repoId);
	}
};

ModelProto.byTagSortedByUse = function() {
	var modelByTag = this.byTag();

	return Object.keys(modelByTag).map(function(tag) {
		return {
			name: tag,
			repos: modelByTag[tag]
		};
	}).sort(function(tagModel1, tagModel2) {
		return tagModel2.repos.length - tagModel1.repos.length;
	});
};
