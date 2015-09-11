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
		var output = `
			<h3>Filter by tags</h3>
			<ul class="filter-list small">
				${ this.renderTags(sortedTags) }
			</ul>
			<hr />
		`;

		this.getElement().innerHTML = output;

		this.addEvents();
		this.rendered = true;
	}

	renderTags (sortedTags) {
		if (sortedTags.length === 0) {
			return `<span class="filter-item GsoTagSidebar-noTagsMessage">No tags.</span>`;
		}
		return sortedTags.map(this.renderTag, this).join('');
	}

	renderTag (tagModel) {
		return `
			<li>
				<label class="GsoTagSidebar-label">
					<span class="filter-item">
						${ tagModel.name }
						<span class="count">${ tagModel.repos.length }</span>
					</span>
					<input class="GsoTagSidebar-checkbox" type="checkbox" />
					<ul class="GsoRepoList">
						${ this.renderTagRepos(tagModel) }
					</ul>
				</label>
			</li>
		`;
	}

	renderTagRepos (tagModel) {
		return tagModel.repos.map(this.renderTagRepo, this).join('');
	}

	renderTagRepo (repoId) {
		return `
			<li class="GsoRepoList-item">
				<a href="/${ repoId }">${ repoId }</a>
			</li>
		`;
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
