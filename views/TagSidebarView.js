((window) => {

	'use strict';


	/**
	 * @class TagSidebarView
	 */
	class TagSidebarView extends GSM.View {

		constructor(model) {
			super();

			this.model = model;
		}

		static getRootClass() {
			return 'GsmTagSidebar';
		}

		render() {
			if (this.rendered) {
				this.removeEvents();
			}

			const sortedTags = this.model.byTagSortedByUse();
			const tagsCount = sortedTags.length;
			const tagsCountIndicator = tagsCount ? `<span class="count">${ tagsCount }</span>` : '';

			this.getElement().innerHTML = `
				<h3 class="h4 mb-2">
					Filter by tags
					${ tagsCountIndicator }
				</h3>
				<ul class="filter-list small GsmTagSidebar-tagList">
					${ this.renderTags(sortedTags) }
				</ul>
				<hr />
			`;

			this.addEvents();
			this.rendered = true;
		}

		renderTags(sortedTags) {
			if (sortedTags.length === 0) {
				return `<span class="filter-item GsmTagSidebar-noTagsMessage">No tags</span>`;
			}
			return sortedTags.map(tagModel => this.renderTag(tagModel)).join('');
		}

		renderTag(tagModel) {
			return `
				<li>
					<label class="GsmTagSidebar-label">
						<span class="filter-item">
							${ tagModel.name }
							<span class="count">${ tagModel.repos.length }</span>
						</span>
						<input class="GsmTagSidebar-checkbox" type="checkbox" />
						<ul class="GsmRepoList">
							${ this.renderTagRepos(tagModel) }
						</ul>
					</label>
				</li>
			`;
		}

		renderTagRepos(tagModel) {
			return tagModel.repos.map(tagModel => this.renderTagRepo(tagModel)).join('');
		}

		renderTagRepo(repoId) {
			return `
				<li class="GsmRepoList-item css-truncate">
					<a class="css-truncate-target" href="/${ repoId }">${ repoId }</a>
				</li>
			`;
		}

		addEvents() {
			this.handlers = {
				modelChange: (changeData, target, eventName) => this.onModelChanged(changeData, target, eventName),
				click: (event) => this.onClicked(event)
			};

			this.model.on('change', this.handlers.modelChange);
			this.getElement().addEventListener('click', this.handlers.click, false);
		}

		removeEvents() {
			this.model.off('change', this.handlers.modelChange);
			this.getElement().removeEventListener('click', this.handlers.click, false);

			this.handlers = {};
		}

		onModelChanged() {
			this.render();
		}

		onClicked(event) {
			if (event.target && event.target.classList.contains('filter-item')) {
				GSM.utils.track('TagSidebar', 'click', 'tag');
			}
		}

	}


	window.GSM = window.GSM || {};
	GSM.TagSidebarView = TagSidebarView;

})(window);
