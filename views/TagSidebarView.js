/**
 * @class TagSidebarView
 */
function TagSidebarView(model) {
	// super
	View.call(this, 'GsoTagSidebar');

	this.model = model;
}

TagSidebarView.prototype = Object.create(View.prototype);
TagSidebarView.prototype.constructor = TagSidebarView;


TagSidebarView.prototype.render = function() {
	this.removeEvents();

	this.getElement().innerHTML = [
		'<h3>Filter by tags</h3>',
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
			}, this).join('\n'),
		'</ul>',
		'<hr />'
	].join('\n');

	this.addEvents();
};

TagSidebarView.prototype.addEvents = function() {
	// refs to bound handlers
	this.onModelChanged = this._onModelChanged.bind(this);

	this.model.on('change', this.onModelChanged);
};

TagSidebarView.prototype.removeEvents = function() {
	this.model.off('change', this.onModelChanged);
};

TagSidebarView.prototype._onModelChanged = function(event, data, target) {
	this.render();
};
