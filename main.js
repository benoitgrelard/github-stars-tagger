
init();


function init() {
	'use strict';

	const tagsStore = new GSM.TagsStore();

	tagsStore.get()
		.then(createModel)
		.then(initViews)
		.then(initSync);


	function createModel(data) {
		return new GSM.Tags(data);
	}

	function initViews(tagsModel) {
		initTagLines(tagsModel);
		initTagSidebar(tagsModel);

		return tagsModel;


		function initTagLines(model) {
			const repoItemSelector = '.repo-list > li';

			// on page load
			addTagLines();

			// when sorting, filtering, paginating was used
			addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


			function onAjaxPageRefreshed(newPath) {
				removeTagLines();
				const shouldAddTagLines = isCurrentPathSupported(newPath);
				if (shouldAddTagLines) {
					addTagLines();
				}
			}

			function addTagLines() {
				const starredRepoElems = document.querySelectorAll(repoItemSelector);
				Array.from(starredRepoElems).forEach(starredRepoElem => addTagLine(starredRepoElem));

				function addTagLine(starredRepoElem) {
					const repoId = starredRepoElem.querySelector('h3 a').getAttribute('href').substring(1);
					const view = new GSM.TagLineView(model, repoId);
					view.render();
					view.injectInto(starredRepoElem);
				}
			}

			function removeTagLines() {
				const starredRepoElems = document.querySelectorAll(repoItemSelector);
				Array.from(starredRepoElems).forEach(starredRepoElem => removeTagLine(starredRepoElem));

				function removeTagLine(starredRepoElem) {
					const oldTagLineElem = starredRepoElem.querySelector('.' + GSM.TagLineView.getRootClass());
					if (oldTagLineElem) { oldTagLineElem.remove(); }
				}
			}
		}

		function initTagSidebar(model) {
			const ajaxContentElem = document.querySelector('.explore-pjax-container');

			// on page load
			addSidebar();

			// when sorting, filtering, paginating was used
			addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


			function onAjaxPageRefreshed(newPath) {
				removeSidebar();
				const shouldAddSidebar = isCurrentPathSupported(newPath);
				if (shouldAddSidebar) {
					addSidebar();
				}
			}

			function addSidebar() {
				const firstSidebarSeparatorElem = ajaxContentElem.querySelector('.col-md-3 hr:first-of-type');
				const view = new GSM.TagSidebarView(model);
				view.render();
				view.injectAfter(firstSidebarSeparatorElem);
			}

			function removeSidebar() {
				const oldTagSidebarElem = ajaxContentElem.querySelector('.' + GSM.TagSidebarView.getRootClass());
				if (oldTagSidebarElem) { oldTagSidebarElem.remove(); }
			}
		}

		function addAjaxPageRefreshEventListener(callback) {
			const ajaxContentElem = document.querySelector('.explore-pjax-container');

			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.addedNodes.length > 0) {
						callback(document.location.pathname);
					}
				});
			});

			const config = { childList: true };
			observer.observe(ajaxContentElem, config);
		}

		function isCurrentPathSupported(path) {
			return path === '/stars' || path === '/stars/' || Boolean(path.match(/\/stars\/?\?.+/));
		}
	}

	function initSync(tagsModel) {
		tagsModel.on('change', onModelChanged);


		function onModelChanged(changeData) {
			if (changeData.deleted) {
				tagsStore.remove(changeData.key);
			} else {
				tagsStore.set(changeData.key, changeData.value);
			}
		}
	}

}
