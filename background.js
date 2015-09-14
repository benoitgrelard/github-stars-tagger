(() => {

	'use strict';


	/* jshint ignore:start */

	// Standard Google Universal Analytics code
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	/* jshint ignore:end */


	// init analytics account
	ga('create', 'UA-5200461-4', 'auto');

	// Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
	ga('set', 'checkProtocolTask', function(){});
	ga('require', 'displayfeatures');

	// track page view
	ga('send', 'pageview', '/');


	// on message sent from content script...
	chrome.runtime.onMessage.addListener(message => {

		// ...track analytics events
		if (message.command === 'trackEvent') {
			var data = message.data;
			ga('send', 'event', data.category, data.action, data.label, data.value);
		}

	});

})();
