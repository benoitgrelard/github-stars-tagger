'use strict';

/**
 * @class TagLineView
 */
class TagLineView extends View {

	constructor (model, repoId) {
		super();

		this.model = model;
		this.repoId = repoId;
	}

	createRootElement () {
		var rootElem = document.createElement('p');
		rootElem.classList.add(TagLineView.rootClass, 'repo-list-meta');
		return rootElem;
	}

	render () {
		if (this.rendered) {
			this.removeEvents();
		}

		var tags = this.model.getDeserializedTagsForRepo(this.repoId);
		var noTagsModifierClass = 'GsoTagLine--noTags';
		this.getElement().classList.toggle(noTagsModifierClass, !tags);

		var output = `
			<span class="octicon octicon-tag GsoTagLine-icon"></span>
			<span class="GsoTagLine-tags" title="Click to ${ tags ? 'edit' : 'add' } tags">
				${ tags || 'no tags (click to add)' }
			</span>
			<input class="GsoTagLine-tagsInput" type="text" value="${ tags }" placeholder="Enter comma-separated tags..." spellcheck="false" autocomplete="off" />
		`;

		this.getElement().innerHTML = output;

		this.refs.tags = this.getElement('.GsoTagLine-tags');
		this.refs.tagsInput = this.getElement('.GsoTagLine-tagsInput');

		this.addEvents();
		this.rendered = true;
	}

	addEvents () {
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

	removeEvents () {
		this.model.off('change:' + this.repoId, this.handlers.modelChange);
		this.refs.tags.removeEventListener('click', this.handlers.tagsClick);
		this.refs.tagsInput.removeEventListener('keydown', this.handlers.tagsInputKeydown);
		this.refs.tagsInput.removeEventListener('blur', this.handlers.tagsInputBlur);

		this.handlers = {};
	}

	onModelChanged (changeData, target, eventName) {
		this.render();
	}

	onTagsClicked (event) {
		this.enterEditMode();
	}

	onTagsInputKeydowned (event) {
		var ENTER = 13;
		var ESCAPE = 27;

		if (event.keyCode === ESCAPE) {
			this.exitEditMode();
		} else if (event.keyCode === ENTER) {
			var newTags = event.currentTarget.value;
			this.exitEditMode(newTags);
		}
	}

	onTagsInputBlurred (event) {
		this.exitEditMode();
	}

	enterEditMode () {
		this.getElement().classList.add('-is-editing');

		// help entering next tag
		if (this.refs.tagsInput.value !== '') { this.refs.tagsInput.value += ', '; }

		// focus at the end of input
		this.refs.tagsInput.focus();
		var length = this.refs.tagsInput.value.length;
		this.refs.tagsInput.setSelectionRange(length, length);
	}

	exitEditMode (newTags) {
		if (typeof newTags === 'undefined') {
			this.render();
		} else {
			this.model.setTagsForRepo(this.repoId, newTags);
		}

		this.getElement().classList.remove('-is-editing');
	}

}

TagLineView.rootClass = 'GsoTagLine';
