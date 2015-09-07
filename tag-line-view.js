function TagLineView(model, repoId) {
	this.model = model;
	this.repoId = repoId;
	this.rootClass = 'GsoTagLine';
	this.element = this.createElement();
}

var TagLineViewProto = TagLineView.prototype;

TagLineView.prototype = {

	createElement: function() {
		var tagLineElem = document.createElement('p');
		tagLineElem.classList.add('repo-list-meta', this.getRootClass());
		return tagLineElem;
	},

	render: function() {
		this.removeEvents();

		var tags = this.model.getDeserializedTagsForRepo(this.repoId);
		this.getElement().innerHTML = [
			'<span class="octicon octicon-tag"></span>',
			'<span class="GsoTagLine-tags">' + (tags || '...') + '</span>',
			'<input class="GsoTagLine-editableTags" type="text" value="' + tags + '" />'
		].join('\n');

		this.addEvents();
	},

	addEvents: function() {
		this.onModelChanged = this._onModelChanged.bind(this);
		this.model.on('change', this.onModelChanged);

		// refs to bound handlers
		this.onTagsClicked = this._onTagsClicked.bind(this);
		this.onEditableTagsKeydown = this._onEditableTagsKeydown.bind(this);

		var tagsElem = this.getElement().querySelector('.GsoTagLine-tags');
		tagsElem.addEventListener('click', this.onTagsClicked);

		var editableTagsElem = this.getElement().querySelector('.GsoTagLine-editableTags');
		editableTagsElem.addEventListener('keydown', this.onEditableTagsKeydown);
	},

	removeEvents: function() {
		this.model.off('change', this.onModelChanged);

		var tagsElem = this.getElement().querySelector('.GsoTagLine-tags');
		if (tagsElem) { tagsElem.removeEventListener('click', this.onTagsClicked); }

		var editableTagsElem = this.getElement().querySelector('.GsoTagLine-editableTags');
		if (editableTagsElem) { editableTagsElem.removeEventListener('keydown', this.onEditableTagsKeydown); }
	},

	_onModelChanged: function(event, data, target) {
		this.render();
	},

	_onTagsClicked: function(event) {
		this.getElement().classList.toggle('-isEditing');
		this.getElement().querySelector('.GsoTagLine-editableTags').focus();
	},

	_onEditableTagsKeydown: function(event) {
		if (event.keyCode === 13) {
			var newTags = event.currentTarget.value;
			this.model.setTagsForRepo(this.repoId, newTags);
			this.getElement().classList.toggle('-isEditing');
		}
	},

	getElement: function() {
		return this.element;
	},

	getRootClass: function() {
		return this.rootClass;
	}

};
