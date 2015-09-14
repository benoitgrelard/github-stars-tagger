((window) => {

	'use strict';


	/**
	 * @class TagLineView
	 */
	class TagLineView extends GSO.View {

		constructor(model, repoId) {
			super();

			this.model = model;
			this.repoId = repoId;
		}

		static getRootClass() {
			return 'GsoTagLine';
		}

		createRootElement() {
			const rootElem = document.createElement('p');
			rootElem.classList.add(TagLineView.getRootClass(), 'repo-list-meta');

			return rootElem;
		}

		render() {
			if (this.rendered) {
				this.removeEvents();
			}

			const tags = this.model.getDeserializedTagsForRepo(this.repoId);
			const noTagsModifierClass = 'GsoTagLine--noTags';

			this.getElement().classList.toggle(noTagsModifierClass, !tags);
			this.getElement().innerHTML = `
				<span class="octicon octicon-tag GsoTagLine-icon"></span>
				<span class="GsoTagLine-tags" title="Click to ${ tags ? 'edit' : 'add' } tags">
					${ tags || 'no tags (click to add)' }
				</span>
				<input class="GsoTagLine-tagsInput" type="text" value="${ tags }" placeholder="Enter comma-separated tags..." spellcheck="false" autocomplete="off" />
			`;

			this.refs.tags = this.getElement('.GsoTagLine-tags');
			this.refs.tagsInput = this.getElement('.GsoTagLine-tagsInput');

			this.addEvents();
			this.rendered = true;
		}

		addEvents() {
			this.handlers = {
				modelChange: (changeData, target, eventName) => this.onModelChanged(changeData, target, eventName),
				tagsClick: event => this.onTagsClicked(event),
				tagsInputKeydown: event => this.onTagsInputKeydowned(event),
				tagsInputBlur: event => this.onTagsInputBlurred(event)
			};

			this.model.on('change:' + this.repoId, this.handlers.modelChange);
			this.refs.tags.addEventListener('click', this.handlers.tagsClick);
			this.refs.tagsInput.addEventListener('keydown', this.handlers.tagsInputKeydown);
			this.refs.tagsInput.addEventListener('blur', this.handlers.tagsInputBlur);
		}

		removeEvents() {
			this.model.off('change:' + this.repoId, this.handlers.modelChange);
			this.refs.tags.removeEventListener('click', this.handlers.tagsClick);
			this.refs.tagsInput.removeEventListener('keydown', this.handlers.tagsInputKeydown);
			this.refs.tagsInput.removeEventListener('blur', this.handlers.tagsInputBlur);

			this.handlers = {};
		}

		onModelChanged() {
			this.render();
		}

		onTagsClicked() {
			this.enterEditMode();
		}

		onTagsInputKeydowned(event) {
			const ENTER = 13;
			const ESCAPE = 27;

			if (event.keyCode === ESCAPE) {
				this.exitEditMode();
			} else if (event.keyCode === ENTER) {
				const newTags = event.currentTarget.value;
				this.exitEditMode(newTags);
			}
		}

		onTagsInputBlurred() {
			this.exitEditMode();
		}

		enterEditMode() {
			this.getElement().classList.add('-is-editing');

			// help entering next tag
			if (this.refs.tagsInput.value !== '') { this.refs.tagsInput.value += ', '; }

			// focus at the end of input
			this.refs.tagsInput.focus();
			const length = this.refs.tagsInput.value.length;
			this.refs.tagsInput.setSelectionRange(length, length);
		}

		exitEditMode(newTags) {
			if (typeof newTags === 'undefined') {
				this.render();
			} else {
				this.model.setTagsForRepo(this.repoId, newTags);
			}

			this.getElement().classList.remove('-is-editing');
		}

	}


	window.GSO = window.GSO || {};
	GSO.TagLineView = TagLineView;

})(window);
