function Model(data) {
	this.data = data;
}

Model.prototype = {

	getTagsForRepo: function(repoId) {
		return this.data[repoId] || [];
	},

	setTagsForRepo: function(repoId, unserializedTags) {
		this.data[repoId] = unserializedTags.split(',').map(function(tag) {
			return tag.trim();
		});
	},

	getDeserializedTagsForRepo: function(repoId) {
		return this.getTagsForRepo(repoId).join(', ') || '...';
	},

	byTag: function() {
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
	},

	byTagSortedByUse: function() {
		var modelByTag = this.byTag();

		return Object.keys(modelByTag).map(function(tag) {
			return {
				name: tag,
				repos: modelByTag[tag]
			};
		}).sort(function(tagModel1, tagModel2) {
			return tagModel2.repos.length - tagModel1.repos.length;
		});
	}

};
