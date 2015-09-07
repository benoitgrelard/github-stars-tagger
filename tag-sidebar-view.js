function TagSidebarView(model) {
	this.model = model;
	this.rootClass = 'GsoTagSidebar';
	this.element = this.createElement();
}

TagSidebarView.prototype = {

	createElement: function() {
		var tagSidebarElem = document.createElement('div');
		tagSidebarElem.classList.add(this.getRootClass());
		return tagSidebarElem;
	},

	render: function() {
		this.removeEvents();

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
				}, this).join('\n'),
			'</ul>',
			'<hr />'
		].join('\n');

		this.addEvents();
	},

	addEvents: function() {
		this.onModelChanged = this._onModelChanged.bind(this);
		this.model.on('change', this.onModelChanged);
	},

	removeEvents: function() {
		this.model.off('change', this.onModelChanged);
	},

	_onModelChanged: function(event, data, target) {
		this.render();
	},

	getElement: function() {
		return this.element;
	},

	getRootClass: function() {
		return this.rootClass;
	}

};
