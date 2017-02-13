((window) => {

	'use strict';


	/**
	 * @class TagLineView
	 */
	class TagLineView extends GSM.View {

		constructor(model, repoId) {
			super();

			this.model = model;
			this.repoId = repoId;
		}

		static getRootClass() {
			return 'GsmTagLine';
		}

		createRootElement() {
			const rootElem = document.createElement('p');
			rootElem.classList.add(TagLineView.getRootClass(), 'f6', 'text-gray', 'mt-2');

			return rootElem;
		}

		render() {
			if (this.rendered) {
				this.removeEvents();
			}

			const tags = this.model.getDeserializedTagsForRepo(this.repoId);
			const noTagsModifierClass = 'GsmTagLine--noTags';

			this.getElement().classList.toggle(noTagsModifierClass, !tags);
			this.getElement().innerHTML = `
				<svg class="octicon octicon-tag GsmTagLine-icon" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
					<path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path>
				</svg>
				<span class="GsmTagLine-tags">${ tags }</span>
				<span class="GsmTagLine-separator"> — </span>
				<button class="GsmTagLine-editButton" type="button" title="Click to edit">Edit</button>
				<input class="GsmTagLine-tagsInput form-control input-sm" type="text" value="${ tags }" placeholder="Enter comma-separated tags" spellcheck="false" autocomplete="off" />
			`;

			this.refs.editButton = this.getElement('.GsmTagLine-editButton');
			this.refs.tagsInput = this.getElement('.GsmTagLine-tagsInput');

			this.addEvents();
			this.rendered = true;
		}

		addEvents() {
			this.handlers = {
				modelChange: (changeData, target, eventName) => this.onModelChanged(changeData, target, eventName),
				editButtonClick: event => this.onEditButtonClicked(event),
				tagsInputKeydown: event => this.onTagsInputKeydowned(event),
				tagsInputBlur: event => this.onTagsInputBlurred(event)
			};

			this.model.on('change:' + this.repoId, this.handlers.modelChange);
			this.refs.editButton.addEventListener('click', this.handlers.editButtonClick);
			this.refs.tagsInput.addEventListener('keydown', this.handlers.tagsInputKeydown);
			this.refs.tagsInput.addEventListener('blur', this.handlers.tagsInputBlur);
		}

		removeEvents() {
			this.model.off('change:' + this.repoId, this.handlers.modelChange);
			this.refs.editButton.removeEventListener('click', this.handlers.editButtonClick);
			this.refs.tagsInput.removeEventListener('keydown', this.handlers.tagsInputKeydown);
			this.refs.tagsInput.removeEventListener('blur', this.handlers.tagsInputBlur);

			this.handlers = {};
		}

		onModelChanged() {
			this.render();
		}

		onEditButtonClicked() {
			this.enterEditMode();
			GSM.utils.track('TagLine', 'edit');
		}

		onTagsInputKeydowned(event) {
			const ENTER = 13;
			const ESCAPE = 27;

			if (event.keyCode === ESCAPE) {
				this.exitEditMode();
				GSM.utils.track('TagLine', 'escape');
			} else if (event.keyCode === ENTER) {
				const newTags = event.currentTarget.value;
				this.exitEditMode(newTags);
				GSM.utils.track('TagLine', 'save');
			}
		}

		onTagsInputBlurred() {
			this.exitEditMode();
			GSM.utils.track('TagLine', 'blur');
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


	window.GSM = window.GSM || {};
	GSM.TagLineView = TagLineView;

})(window);
