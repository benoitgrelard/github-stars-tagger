'use strict';

init();


function init() {

	// TODO: purge unstarred repos (based of real github api)
	var tagsStore = new TagsStore();
	tagsStore.get()
		.then(createModel)
		.then(initViews)
		.then(initSync);


	function createModel(data) {
		var tagsModel = new Tags(data);
		return tagsModel;
	}

	function initViews(tagsModel) {
		initTagLines(tagsModel);
		initTagSidebar(tagsModel);

		return tagsModel;


		function initTagLines(model) {
			// on page load
			addTagLines();

			// when sorting, filtering, paginating was used
			addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


			function onAjaxPageRefreshed(newPath) {
				removeTagLines();
				var shouldAddTagLines = isCurrentPathSupported(newPath);
				if (shouldAddTagLines) {
					addTagLines();
				}
			}

			function addTagLines() {
				var starredRepoElems = document.querySelectorAll('.repo-list-item');
				utils.forEach(starredRepoElems, addTagLine);

				function addTagLine(starredRepoElem) {
					var repoId = starredRepoElem.querySelector('.repo-list-name a').getAttribute('href').substring(1);
					var view = new TagLineView(model, repoId);
					view.render();
					view.injectInto(starredRepoElem);
				}
			}

			function removeTagLines() {
				var starredRepoElems = document.querySelectorAll('.repo-list-item');
				utils.forEach(starredRepoElems, removeTagLine);

				function removeTagLine(starredRepoElem) {
					var oldTagLineElem = starredRepoElem.querySelector('.' + TagLineView.rootClass);
					if (oldTagLineElem) { oldTagLineElem.remove(); }
				}
			}
		}

		function initTagSidebar(model) {
			var ajaxContentElem = document.getElementById('js-pjax-container');

			// on page load
			addSidebar();

			// when sorting, filtering, paginating was used
			addAjaxPageRefreshEventListener(onAjaxPageRefreshed);


			function onAjaxPageRefreshed(newPath) {
				removeSidebar();
				var shouldAddSidebar = isCurrentPathSupported(newPath);
				if (shouldAddSidebar) {
					addSidebar();
				}
			}

			function addSidebar() {
				var firstSidebarSeparatorElem = ajaxContentElem.querySelector('.column.one-fourth hr:first-of-type');
				var view = new TagSidebarView(model);
				view.render();
				view.injectAfter(firstSidebarSeparatorElem);
			}

			function removeSidebar() {
				var oldTagSidebarElem = ajaxContentElem.querySelector('.' + TagSidebarView.rootClass);
				if (oldTagSidebarElem) { oldTagSidebarElem.remove(); }
			}
		}

		function addAjaxPageRefreshEventListener(callback) {
			var ajaxContentElem = document.getElementById('js-pjax-container');
			var observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.addedNodes.length > 0) {
						callback(document.location.pathname);
					}
				});
			});
			var config = { childList: true };
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
