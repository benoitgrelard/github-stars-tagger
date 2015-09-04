var model = {
	'metafizzy/flickity': ['js', 'carousel', 'gallery', 'touch', 'responsive', 'animation'],
	'michaelvillar/dynamics.js': ['js', 'animation'],
	'cyclejs/cycle-core': ['js']
};

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

			var tagLineElem = document.createElement('p');
			tagLineElem.classList.add('repo-list-meta', 'gso-tag-line');
			tagLineElem.innerHTML = [
				'<span class="octicon octicon-tag"></span>',
				'<span>' + deserializeTags( getTagsForRepo(repoId) ) + '</span>'
			].join('\n');
			starredRepoElem.appendChild(tagLineElem);
		}

		function getTagsForRepo(repoId) {
			return model[repoId] || [];
		}

		function deserializeTags(tags) {
			return tags.join(', ') || '...';
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

		var tagSidebarElem = document.createElement('div');
		tagSidebarElem.classList.add('gso-tag-sidebar');

		tagSidebarElem.innerHTML = [
			'<h3>Tags</h3>',
			'<ul class="filter-list small">',
				getSortedPivotedModel(model).map(function(tagModel) {
					return [
						'<li>',
							'<span class="filter-item">',
								tagModel.name,
								'<span class="count">' + tagModel.repos.length + '</span>',
							'</span>',
						'</li>'
					].join('\n');
				}).join('\n'),
			'</ul>',
			'<hr />'
		].join('\n');

		insertAfter(tagSidebarElem, lastSidebarSeparatorElem);
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

function pivotModel(model) {
	var pivotedModel = {};

	for (var repoId in model) {
		model[repoId].forEach(pivot);
	}

	return pivotedModel;

	function pivot(tag) {
		if (!(tag in pivotedModel)) { pivotedModel[tag] = []; }
		pivotedModel[tag].push(repoId);
	}
}

function getSortedPivotedModel(model) {
	var pivotedModel = pivotModel(model);
	return Object.keys(pivotedModel).map(function(tag) {
		return {
			name: tag,
			repos: pivotedModel[tag]
		};
	}).sort(function(tagModel1, tagModel2) {
		return tagModel2.repos.length - tagModel1.repos.length;
	});
}
