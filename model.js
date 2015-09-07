function Model(data) {
	this.data = data;
}

Model.prototype = new EventEmitter();

var proto = Model.prototype;

proto.getTagsForRepo = function(repoId) {
	return this.data[repoId] || [];
};

proto.setTagsForRepo = function(repoId, unserializedTags) {
	var serializedTags = unserializedTags.split(',')
		.map(function(tag) { return tag.trim(); })
		.filter(function(tag) { return tag !== ''; });

	if (serializedTags.length === 0) {
		delete this.data[repoId];
	} else {
		this.data[repoId] = unique(serializedTags);
	}

	this.emit('change');
};

proto.getDeserializedTagsForRepo = function(repoId) {
	return this.getTagsForRepo(repoId).join(', ');
};

proto.byTag = function() {
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

proto.byTagSortedByUse = function() {
	var modelByTag = this.byTag();
	return Object.keys(modelByTag)
		.map(createTagObject)
		.sort(sortByMostUsedThenAlphanumerically);


	function createTagObject(tag) {
		return {
			name: tag,
			repos: modelByTag[tag]
		};
	}

	function sortByMostUsedThenAlphanumerically(tagModel1, tagModel2) {
		var diff = tagModel2.repos.length - tagModel1.repos.length;
		if (diff === 0) { return tagModel2.name < tagModel1.name; }
		return diff;
	}
};
