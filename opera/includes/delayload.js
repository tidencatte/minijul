window.addEventListener("load", function(e) {
	// check which domain we're on. If it's jul.rustedlogic.net, well, tell it to delay reloading latestposts.php
	if (window.location.href.search("jul.rustedlogic.net") != -1) {
		opera.extension.postMessage({delayLoading: 60});
	}
}, false);