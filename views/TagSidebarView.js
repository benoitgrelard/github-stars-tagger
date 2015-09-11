/**
 * @class TagSidebarView
 */
function TagSidebarView(model) {
	// super
	View.call(this);

	this.model = model;
}

TagSidebarView.rootClass = 'GsoTagSidebar';

TagSidebarView.prototype = Object.create(View.prototype);
TagSidebarView.prototype.constructor = TagSidebarView;



TagSidebarView.prototype.render = function() {
	this.removeEvents();

	var sortedTags = this.model.byTagSortedByUse();

	this.getElement().innerHTML = [
		'<h3>Filter by tags</h3>',
		'<ul class="filter-list small">',
			getTags(sortedTags),
		'</ul>',
		'<hr />'
	].join('\n');

	this.addEvents();


	function getTags(sortedTags) {
		if (sortedTags.length === 0) { return '<span class="filter-item GsoTagSidebar-noTagsMessage">No tags.</span>\n'; }
		return sortedTags.map(getTag).join('\n');
	}

	function getTag(tagModel) {
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
	}
};

TagSidebarView.prototype.addEvents = function() {
	this.onModelChanged = this._onModelChanged.bind(this);
	this.model.on('change', this.onModelChanged);
};

TagSidebarView.prototype.removeEvents = function() {
	this.model.off('change', this.onModelChanged);
};

TagSidebarView.prototype._onModelChanged = function(changeData, target, eventName) {
	this.render();
};
