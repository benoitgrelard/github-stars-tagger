/**
 * @class TagLineView
 */
function TagLineView(model, repoId) {
	// super
	View.call(this, 'GsoTagLine');

	this.model = model;
	this.repoId = repoId;
}

TagLineView.prototype = Object.create(View.prototype);
TagLineView.prototype.constructor = TagLineView;



TagLineView.prototype.createRootElement = function() {
	var rootElem = document.createElement('p');
	rootElem.classList.add('repo-list-meta', this.getRootClass());
	return rootElem;
};

TagLineView.prototype.render = function() {
	this.removeEvents();

	var tags = this.model.getDeserializedTagsForRepo(this.repoId);
	var noTagsModifierClass = 'GsoTagLine--noTags';
	this.getElement().classList.toggle(noTagsModifierClass, !tags);

	this.getElement().innerHTML = [
		'<span class="octicon octicon-tag GsoTagLine-icon"></span>',
		'<span class="GsoTagLine-tags" title="Click to ' + (tags ? 'edit' : 'add') + ' tags">',
			(tags || 'no tags (click to add)'),
		'</span>',
		'<input class="GsoTagLine-editableTags" type="text" value="' + tags + '" placeholder="Enter comma-separated tags..." />'
	].join('\n');

	this.addEvents();
};

TagLineView.prototype.addEvents = function() {
	// refs to bound handlers
	this.onModelChanged = this._onModelChanged.bind(this);
	this.onTagsClicked = this._onTagsClicked.bind(this);
	this.onEditableTagsKeydown = this._onEditableTagsKeydown.bind(this);

	this.model.on('change', this.onModelChanged);

	var tagsElem = this.getElement('.GsoTagLine-tags');
	tagsElem.addEventListener('click', this.onTagsClicked);

	var editableTagsElem = this.getElement('.GsoTagLine-editableTags');
	editableTagsElem.addEventListener('keydown', this.onEditableTagsKeydown);
};

TagLineView.prototype.removeEvents = function() {
	this.model.off('change', this.onModelChanged);

	var tagsElem = this.getElement('.GsoTagLine-tags');
	if (tagsElem) {
		tagsElem.removeEventListener('click', this.onTagsClicked);
	}

	var editableTagsElem = this.getElement('.GsoTagLine-editableTags');
	if (editableTagsElem) {
		editableTagsElem.removeEventListener('keydown', this.onEditableTagsKeydown);
	}
};

TagLineView.prototype._onModelChanged = function(event, data, target) {
	this.render();
};

TagLineView.prototype._onTagsClicked = function(event) {
	this.enterEditMode();
};

TagLineView.prototype._onEditableTagsKeydown = function(event) {
	var ENTER = 13;
	var ESCAPE = 27;

	if (event.keyCode === ESCAPE) {
		this.exitEditMode();
	} else if (event.keyCode === ENTER) {
		var newTags = event.currentTarget.value;
		this.exitEditMode(newTags);
	}
};

TagLineView.prototype.enterEditMode = function() {
	var editableTagsElem = this.getElement('.GsoTagLine-editableTags');
	this.getElement().classList.add('-is-editing');

	// help entering next tag
	if (editableTagsElem.value !== '') { editableTagsElem.value += ', '; }

	// focus at the end of input
	editableTagsElem.focus();
	var length = editableTagsElem.value.length;
	editableTagsElem.setSelectionRange(length, length);
};

TagLineView.prototype.exitEditMode = function(newTags) {
	if (typeof newTags === 'undefined') {
		this.render();
	} else {
		this.model.setTagsForRepo(this.repoId, newTags);
	}

	this.getElement().classList.remove('-is-editing');
};
