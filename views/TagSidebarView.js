'use strict';

/**
 * @class TagSidebarView
 */
class TagSidebarView extends View {

	constructor (model) {
		super();

		this.model = model;
	}

	render () {
		if (this.rendered) {
			this.removeEvents();
		}

		var sortedTags = this.model.byTagSortedByUse();

		this.getElement().innerHTML = [
			'<h3>Filter by tags</h3>',
			'<ul class="filter-list small">',
				getTags(sortedTags),
			'</ul>',
			'<hr />'
		].join('\n');

		this.addEvents();
		this.rendered = true;


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
	}

	addEvents () {
		this.handlers.modelChange = this.onModelChanged.bind(this);
		this.model.on('change', this.handlers.modelChange);
	}

	removeEvents () {
		this.model.off('change', this.handlers.modelChange);
		this.handlers.modelChange = null;
	}

	onModelChanged (changeData, target, eventName) {
		this.render();
	}

}

TagSidebarView.rootClass = 'GsoTagSidebar';
