((window) => {

	'use strict';


	const utils = {

		insertAfter(newNode, referenceNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		},

		unique(array) {
			const hash = {};
			const res = [];

			for (let i = 0; i < array.length; i++) {
				const item = array[i];

				if (!hash[item]) {
					hash[item] = true;
					res.push(item);
				}
			}

			return res;
		},

		message(command, data) {
			chrome.runtime.sendMessage({ command, data });
		},

		track(category, action, label, value) {
			utils.message('trackEvent', { category, action, label, value });
		}

	};


	window.GSM = window.GSM || {};
	GSM.utils = utils;

})(window);
