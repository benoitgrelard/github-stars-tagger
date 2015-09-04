function TagSidebarView(model) {
	this.model = model;
	this.element = this.createElement();
}

var TagSidebarViewProto = TagSidebarView.prototype;

TagSidebarViewProto.createElement = function() {
	var tagSidebarElem = document.createElement('div');
	tagSidebarElem.classList.add('gso-tag-sidebar');
	return tagSidebarElem;
};

TagSidebarViewProto.render = function() {
	this.getElement().innerHTML = [
		'<h3>Tags</h3>',
		'<ul class="filter-list small">',
			this.model.byTagSortedByUse().map(function(tagModel) {
				return [
					'<li>',
						'<span class="filter-item">',
							tagModel.name,
							'<span class="count">' + tagModel.repos.length + '</span>',
						'</span>',
					'</li>'
				].join('\n');
			}).join('\n'),
		'</ul>',
		'<hr />'
	].join('\n');
};

TagSidebarViewProto.getElement = function() {
	return this.element;
};
