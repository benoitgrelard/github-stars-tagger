'use strict';

/**
 * @class Tags
 */
class Tags extends Model {

	constructor (data) {
		super(data);
	}

	getTagsForRepo (repoId) {
		return this.data[repoId] || [];
	}

	setTagsForRepo (repoId, unserializedTags) {
		const serializedTags = unserializedTags.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag !== '');

		const hasNoTags = serializedTags.length === 0;
		const repoChangeEventName = 'change:' + repoId;

		if (hasNoTags) {
			delete this.data[repoId];
			const changeData = { key: repoId, deleted: true };
			this.emit('change', changeData);
			this.emit(repoChangeEventName, changeData);
		} else {
			const newTags = utils.unique(serializedTags);
			const changeData = { key: repoId, value: newTags };
			this.data[repoId] = newTags;
			this.emit('change', changeData);
			this.emit(repoChangeEventName, changeData);
		}
	}

	getDeserializedTagsForRepo (repoId) {
		return this.getTagsForRepo(repoId).join(', ');
	}

	byTag () {
		const pivotedData = {};
		for (const repoId in this.data) {
			const tags = this.getTagsForRepo(repoId);
			tags.forEach(tag => pivot(tag, repoId));
		}
		return pivotedData;


		function pivot(tag, repoId) {
			if (!(tag in pivotedData)) { pivotedData[tag] = []; }
			pivotedData[tag].push(repoId);
		}
	}

	byTagSortedByUse () {
		const modelByTag = this.byTag();
		return Object.keys(modelByTag)
			.map(tag => createTagObject(tag))
			.sort(byMostUsed);


		function createTagObject(tag) {
			return {
				name: tag,
				repos: modelByTag[tag]
			};
		}

		function byMostUsed(tagObject1, tagObject2) {
			const diff = tagObject2.repos.length - tagObject1.repos.length;
			// default to alphanumerical sort
			if (diff === 0) { return tagObject2.name < tagObject1.name; }
			return diff;
		}
	}

}

/* jshint unused: false */
