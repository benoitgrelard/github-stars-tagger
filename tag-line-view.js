function TagLineView(model, repoId) {
	this.model = model;
	this.repoId = repoId;
	this.element = this.createElement();
}

var TagLineViewProto = TagLineView.prototype;

TagLineViewProto.createElement = function() {
	var tagLineElem = document.createElement('p');
	tagLineElem.classList.add('repo-list-meta', 'gso-tag-line');
	return tagLineElem;
};

TagLineViewProto.render = function() {
	this.getElement().innerHTML = [
		'<span class="octicon octicon-tag"></span>',
		'<span>' + this.model.getDeserializedTagsForRepo(this.repoId) + '</span>'
	].join('\n');
};

TagLineViewProto.getElement = function() {
	return this.element;
};
