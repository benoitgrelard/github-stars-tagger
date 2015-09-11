/**
 * @class TagLineView
 */
function TagLineView(model, repoId) {
	// super
	View.call(this);

	this.model = model;
	this.repoId = repoId;
}

TagLineView.rootClass = 'GsoTagLine';

TagLineView.prototype = Object.create(View.prototype);
TagLineView.prototype.constructor = TagLineView;



TagLineView.prototype.createRootElement = function() {
	var rootElem = document.createElement('p');
	rootElem.classList.add('repo-list-meta', TagLineView.rootClass);
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
		'<input class="GsoTagLine-editableTags" type="text" value="' + tags + '" placeholder="Enter comma-separated tags..." spellcheck="false" autocomplete="off" />'
	].join('\n');

	this.addEvents();
};

TagLineView.prototype.addEvents = function() {
	// refs to bound handlers
	this.onModelChanged = this._onModelChanged.bind(this);
	this.onTagsClicked = this._onTagsClicked.bind(this);
	this.onEditableTagsKeydown = this._onEditableTagsKeydown.bind(this);
	this.onEditableTagsBlurred = this._onEditableTagsBlurred.bind(this);

	var repoChangeEventName = 'change:' + this.repoId;
	this.model.on(repoChangeEventName, this.onModelChanged);

	var tagsElem = this.getElement('.GsoTagLine-tags');
	tagsElem.addEventListener('click', this.onTagsClicked);

	var editableTagsElem = this.getElement('.GsoTagLine-editableTags');
	editableTagsElem.addEventListener('keydown', this.onEditableTagsKeydown);
	editableTagsElem.addEventListener('blur', this.onEditableTagsBlurred);
};

TagLineView.prototype.removeEvents = function() {
	var repoChangeEventName = 'change:' + this.repoId;
	this.model.off(repoChangeEventName, this.onModelChanged);

	var tagsElem = this.getElement('.GsoTagLine-tags');
	if (tagsElem) {
		tagsElem.removeEventListener('click', this.onTagsClicked);
	}

	var editableTagsElem = this.getElement('.GsoTagLine-editableTags');
	if (editableTagsElem) {
		editableTagsElem.removeEventListener('keydown', this.onEditableTagsKeydown);
		editableTagsElem.removeEventListener('blur', this.onEditableTagsBlurred);
	}
};

TagLineView.prototype._onModelChanged = function(changeData, target, eventName) {
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

TagLineView.prototype._onEditableTagsBlurred = function(event) {
	this.exitEditMode();
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
