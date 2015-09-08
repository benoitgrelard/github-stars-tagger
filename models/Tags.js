/**
 * @class Tags
 */
function Tags(data) {
	// super
	Model.call(this, data);
}

Tags.prototype = Object.create(Model.prototype);
Tags.prototype.constructor = Tags;



Tags.prototype.getTagsForRepo = function(repoId) {
	return this.data[repoId] || [];
};

Tags.prototype.setTagsForRepo = function(repoId, unserializedTags) {
	var serializedTags = unserializedTags.split(',')
		.map(function(tag) { return tag.trim(); })
		.filter(function(tag) { return tag !== ''; });

	var hasNoTags = serializedTags.length === 0;
	var repoChangeEventName = 'change:' + repoId;
	var changeData = null;

	if (hasNoTags) {
		delete this.data[repoId];
		changeData = { key: repoId, deleted: true };
		this.emit('change', changeData);
		this.emit(repoChangeEventName, changeData);
	} else {
		var newTags = utils.unique(serializedTags);
		changeData = { key: repoId, value: newTags };
		this.data[repoId] = newTags;
		this.emit('change', changeData);
		this.emit(repoChangeEventName, changeData);
	}
};

Tags.prototype.getDeserializedTagsForRepo = function(repoId) {
	return this.getTagsForRepo(repoId).join(', ');
};

Tags.prototype.byTag = function() {
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

Tags.prototype.byTagSortedByUse = function() {
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

	function sortByMostUsedThenAlphanumerically(tagTags1, tagTags2) {
		var diff = tagTags2.repos.length - tagTags1.repos.length;
		if (diff === 0) { return tagTags2.name < tagTags1.name; }
		return diff;
	}
};
