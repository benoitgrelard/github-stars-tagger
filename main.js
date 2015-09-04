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
			var tagLineExists = starredRepoElem.querySelector('.gso-tag-line');
			if (tagLineExists) { return; }

			var repoId = starredRepoElem.querySelector('.repo-list-name a').getAttribute('href').substring(1);
			var view = new TagLineView(model, repoId);
			view.render();
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
		var ajaxContentElem = document.getElementById('js-pjax-container');
		var tagSidebarExists = ajaxContentElem.querySelector('.gso-tag-sidebar');
		if (tagSidebarExists) { return; }

		var lastSidebarSeparatorElem = ajaxContentElem.querySelector('.column.one-fourth hr:last-of-type');
		var view = new TagSidebarView(model);
		view.render();
		insertAfter(view.getElement(), lastSidebarSeparatorElem);
	}
}

function onAjaxPageRefreshed(callback) {
	var ajaxContentElem = document.getElementById('js-pjax-container');
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length === 0) { return; }
			callback();
		});
	});
	var config = { childList: true };
	observer.observe(ajaxContentElem, config);
}
