
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
			const rootSelector = '.js-repo-filter';

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
				const starredRepoElems = document.querySelectorAll(rootSelector + ' > .d-block');
				Array.from(starredRepoElems).forEach(starredRepoElem => addTagLine(starredRepoElem));

				function addTagLine(starredRepoElem) {
					const repoId = starredRepoElem.querySelector('h3 a').getAttribute('href').substr(1); 
					const view = new GSM.TagLineView(model, repoId);
					view.render();
					view.injectInto(starredRepoElem);
				}
			}

			function removeTagLines() {
				const starredRepoElems = document.querySelectorAll(rootSelector);
				Array.from(starredRepoElems).forEach(starredRepoElem => removeTagLine(starredRepoElem));

				function removeTagLine(starredRepoElem) {
					const oldTagLineElem = starredRepoElem.querySelector('.' + GSM.TagLineView.getRootClass());
					if (oldTagLineElem) { oldTagLineElem.remove(); }
				}
			}
		}

		function initTagSidebar(model) {
			const ajaxContentElem = document.getElementById('js-pjax-container');

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
				const firstSidebarSeparatorElem = ajaxContentElem.querySelector('#js-pjax-container > div > div:first-child');
				const view = new GSM.TagSidebarView(model);
				view.render();
				view.injectInto(firstSidebarSeparatorElem);
			}

			function removeSidebar() {
				const oldTagSidebarElem = ajaxContentElem.querySelector('.' + GSM.TagSidebarView.getRootClass());
				if (oldTagSidebarElem) { oldTagSidebarElem.remove(); }
			}
		}

		function addAjaxPageRefreshEventListener(callback) {
			const ajaxContentElem = document.getElementById('js-pjax-container');

			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.addedNodes.length > 0) { 
						callback(document.location.search);
					}
				});
			});

			const config = { childList: true };
			observer.observe(ajaxContentElem, config);
		}

		function isCurrentPathSupported(path) {
			return path.indexOf('tab=stars') !== -1;
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
