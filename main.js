// TODO: purge unstarred repos (based of real github api)
var model = new Model({
	'metafizzy/flickity': ['js', 'carousel', 'gallery', 'touch', 'responsive', 'animation'],
	'michaelvillar/dynamics.js': ['js', 'animation'],
	'cyclejs/cycle-core': ['js']
});

initTagLines(model);
initTagSidebar(model);


function initTagLines(model) {
	// on page load
	addTagLines();

	// when sorting, filtering, paginating was used
	onAjaxPageRefreshed(addTagLines);


	function addTagLines() {
		var starredRepoElems = document.querySelectorAll('.repo-list-item');

		forEach(starredRepoElems, function(starredRepoElem) { addTagLine(starredRepoElem); });

		function addTagLine(starredRepoElem) {
			var repoId = starredRepoElem.querySelector('.repo-list-name a').getAttribute('href').substring(1);

			var view = new TagLineView(model, repoId);
			view.render();

			var oldTagLineElem = starredRepoElem.querySelector('.' + view.getRootClass());
			if (oldTagLineElem) { oldTagLineElem.remove(); }

			starredRepoElem.appendChild(view.getElement());
		}
	}
}

function initTagSidebar(model) {
	// on page load
	addSidebar();

	// when sorting, filtering, paginating was used
	onAjaxPageRefreshed(addSidebar);


	function addSidebar() {
		var view = new TagSidebarView(model);
		view.render();

		var ajaxContentElem = document.getElementById('js-pjax-container');
		var oldTagSidebarElem = ajaxContentElem.querySelector('.' + view.getRootClass());
		if (oldTagSidebarElem) { oldTagSidebarElem.remove(); }

		var lastSidebarSeparatorElem = ajaxContentElem.querySelector('.column.one-fourth hr:last-of-type');
		insertAfter(view.getElement(), lastSidebarSeparatorElem);
	}
}

function onAjaxPageRefreshed(callback) {
	var ajaxContentElem = document.getElementById('js-pjax-container');
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length > 0) { callback(); }
		});
	});
	var config = { childList: true };
	observer.observe(ajaxContentElem, config);
}
