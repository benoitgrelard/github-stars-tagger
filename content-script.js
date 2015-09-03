
initTagLines();


function initTagLines() {
	// on page load
	addTagLines();

	// when sorting, filtering, paginating was used
	onAjaxPageRefreshed(addTagLines);


	function addTagLines() {
		var starredRepoElems = document.querySelectorAll('.repo-list-item');

		forEach(starredRepoElems, function(starredRepoElem) { addTagLine(starredRepoElem); });

		function addTagLine(starredRepoElem, index) {
			var tagLineExists = starredRepoElem.querySelector('.github-stars-organiser-tag-line');
			if (tagLineExists) { return; }

			var tagLineElem = document.createElement('p');
			tagLineElem.classList.add('repo-list-meta', 'github-stars-organiser-tag-line');
			tagLineElem.innerHTML = [
				'<span class="octicon octicon-tag"></span>',
				'<input type="text" />'
			].join('\n');
			starredRepoElem.appendChild(tagLineElem);
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
}
