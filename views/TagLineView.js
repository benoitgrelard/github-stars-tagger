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
	rootElem.classList.add(TagLineView.rootClass, 'repo-list-meta');
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
		'<input class="GsoTagLine-tagsInput" type="text" value="' + tags + '" placeholder="Enter comma-separated tags..." spellcheck="false" autocomplete="off" />'
	].join('\n');

	this.refs.tags = this.getElement('.GsoTagLine-tags');
	this.refs.tagsInput = this.getElement('.GsoTagLine-tagsInput');

	this.addEvents();
};

TagLineView.prototype.addEvents = function() {
	this.onModelChanged = this._onModelChanged.bind(this);
	this.model.on('change:' + this.repoId, this.onModelChanged);

	this.onTagsClicked = this._onTagsClicked.bind(this);
	this.refs.tags.addEventListener('click', this.onTagsClicked);

	this.onEditableTagsKeydown = this._onEditableTagsKeydown.bind(this);
	this.refs.tagsInput.addEventListener('keydown', this.onEditableTagsKeydown);

	this.onEditableTagsBlurred = this._onEditableTagsBlurred.bind(this);
	this.refs.tagsInput.addEventListener('blur', this.onEditableTagsBlurred);
};

TagLineView.prototype.removeEvents = function() {
	this.model.off('change:' + this.repoId, this.onModelChanged);

	if (this.refs.tags) {
		this.refs.tags.removeEventListener('click', this.onTagsClicked);
	}

	if (this.refs.tagsInput) {
		this.refs.tagsInput.removeEventListener('keydown', this.onEditableTagsKeydown);
		this.refs.tagsInput.removeEventListener('blur', this.onEditableTagsBlurred);
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
	this.getElement().classList.add('-is-editing');

	// help entering next tag
	if (this.refs.tagsInput.value !== '') { this.refs.tagsInput.value += ', '; }

	// focus at the end of input
	this.refs.tagsInput.focus();
	var length = this.refs.tagsInput.value.length;
	this.refs.tagsInput.setSelectionRange(length, length);
};

TagLineView.prototype.exitEditMode = function(newTags) {
	if (typeof newTags === 'undefined') {
		this.render();
	} else {
		this.model.setTagsForRepo(this.repoId, newTags);
	}

	this.getElement().classList.remove('-is-editing');
};
