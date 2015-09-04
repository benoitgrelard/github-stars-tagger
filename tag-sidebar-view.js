function TagSidebarView(model) {
	this.model = model;
	this.element = this.createElement();
}

var TagSidebarViewProto = TagSidebarView.prototype;

TagSidebarViewProto.createElement = function() {
	var tagSidebarElem = document.createElement('div');
	tagSidebarElem.classList.add('GsoTagSidebar');
	return tagSidebarElem;
};

TagSidebarViewProto.render = function() {
	this.getElement().innerHTML = [
		'<h3>Tags</h3>',
		'<ul class="filter-list small">',
			this.model.byTagSortedByUse().map(function(tagModel) {
				return [
					'<li>',
						'<label class="GsoTagSidebar-label">',
							'<span class="filter-item">',
								tagModel.name,
								'<span class="count">' + tagModel.repos.length + '</span>',
							'</span>',
							'<input class="GsoTagSidebar-checkbox" type="checkbox" />',
							'<ul class="GsoRepoList">',
								tagModel.repos.map(function(repoId) {
									return [
										'<li class="GsoRepoList-item">',
											'<a href="/' + repoId + '">' + repoId + '</a>',
										'</li>'
									].join('\n');
								}).join('\n'),
							'</ul>',
						'</label>',
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
