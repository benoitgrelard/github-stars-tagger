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
		tagLineElem.classList.add('repo-list-meta', this.rootClass);
		return tagLineElem;
	},

	render: function() {
		this.removeEvents();

		var tags = this.model.getDeserializedTagsForRepo(this.repoId);
		this.getElement().innerHTML = [
			'<span class="octicon octicon-tag"></span>',
			'<span class="' + this.rootClass + '-tags">' + tags + '</span>',
			'<input class="' + this.rootClass + '-editableTags" type="text" value="' + tags + '" />'
		].join('\n');

		this.addEvents();
	},

	addEvents: function() {
		// refs to bound handlers
		this.onTagsClicked = this._onTagsClicked.bind(this);
		this.onEditableTagsKeydown = this._onEditableTagsKeydown.bind(this);

		var tagsElem = this.getElement().querySelector('.' + this.rootClass + '-tags');
		tagsElem.addEventListener('click', this.onTagsClicked);

		var editableTagsElem = this.getElement().querySelector('.' + this.rootClass + '-editableTags');
		editableTagsElem.addEventListener('keydown', this.onEditableTagsKeydown);
	},

	removeEvents: function() {
		var tagsElem = this.getElement().querySelector('.' + this.rootClass + '-tags');
		if (tagsElem) { tagsElem.removeEventListener('click', this.onTagsClicked); }

		var editableTagsElem = this.getElement().querySelector('.' + this.rootClass + '-editableTags');
		if (editableTagsElem) { editableTagsElem.removeEventListener('keydown', this.onEditableTagsKeydown); }
	},

	_onTagsClicked: function(event) {
		this.getElement().classList.toggle('-isEditing');
		this.getElement().querySelector('.' + this.rootClass + '-editableTags').focus();
	},

	_onEditableTagsKeydown: function(event) {
		if (event.keyCode === 13) {
			var newTags = event.currentTarget.value;
			this.model.setTagsForRepo(this.repoId, newTags);
			this.getElement().classList.toggle('-isEditing');
			this.render();
		}
	},

	getElement: function() {
		return this.element;
	},

	getRootClass: function() {
		return this.rootClass;
	}

};
