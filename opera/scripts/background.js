// i have an irrational hatred of global variables.
var updatePostTimeout = 0;

function updateLatestPosts() {
	var req = new XMLHttpRequest();
	var today = new Date();
	req.open("GET", "http://jul.rustedlogic.net/latestposts.php?raw=1&time="+(Date.now()/1000)+"lastid="+widget.preferences.latestposts_highid, false);
	try {
		var data = JSON.parse(widget.preferences.latestposts);
	} catch(e) {
		var data = {"tzoff": "", "posts": []};
	}
	var newposts = 0;
	var maxid   = 0;
	req.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				// do all the fun processing shit here.
				
				var newData = JSON.parse(this.responseText);
				if (newData.posts.length) {
					if (data != []) {
						for (var i = 0; i < newData.posts.length; i++) {
							data.posts.unshift(newData.posts[i]);
						}
					} else {
						data = newData;
					}
					data.posts = data.posts.slice(0,50).pset("id");
					data.tzoff = newData.tzoff;
					data.lastcheck_localtime = newData.localtime;
					data = JSON.stringify(data);

					widget.preferences.latestposts = data;

					newposts = newData.posts.length;
					maxid = newData.posts.sort(function (a,b) { return Number(b.id) > Number(a.id); })[0].id;

					widget.preferences.latestposts_highid = maxid;
					newPosts(newposts);
				}
			}
		}
	}
	
	req.send();
	return newposts;
}

function fetchFavorites() {
	// update the favorites, YAHOO!!
	var n = new XMLHttpRequest();
	n.open("GET", "http://jul.rustedlogic.net/favorites.php", false);
	n.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
	n.onreadystatechange = function() {
		if (n.readyState == 4) {
			if (n.status == 200) {
				localStorage["favorites"] = this.responseText;
			}
		}
	}
	n.send();
}

function newPosts(newposts) {
	if (newposts > 0) {
		var Button = opera.contexts.toolbar.item(0);
		Button.badge.display = "block";
		Button.badge.textContent = ((Number(Button.badge.textContent) || 0)+ newposts);
	}
}

function setupAutoPostloader() {
	var Button = opera.contexts.toolbar.item(0);
	updatePostTimeout = setInterval(updateLatestPosts, 30000);
}

window.addEventListener("load", function(e) {
	if (widget.preferences.firstRun == "1") {
		// initialize the values for our local storage
		firstrun();
		widget.preferences.firstRun = "0";
	}
	
	var ToolbarUIItemProperties = {
		title: "MEOW",
		icon: "icons/superd.png",
		popup: {
			href: "popup.html",
			width: 360,
			height: 560
		},
		badge: {
			display: "none",
			textContent: "0",
			color: "white",
			backgroundColor: "rgba(200, 0, 0, 1)"
		},
		onclick: function(e) {
			if (widget.preferences.compact_mode == 0) {
				e.preventDefault();
				opera.extension.tabs.create({url: "/pages/latestposts.html", focused: true});
			}
		}
	};

	var Button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
	opera.contexts.toolbar.addItem(Button);

	opera.extension.onmessage = function(e) {
		/* where the ~magic~ begins */
		if (e.data.enableButton) {
			Button.disabled = !(e.data.enableButton);
		}
		
		if (e.data.clearButton) {
			Button.badge.display = "none";
			Button.badge.textContent = "";
		}

		/* passing objects in messages fucking rules */
		if (e.data.action) {
			var act = e.data.action;
			if (act.what == "goto") {
				var t = opera.extension.tabs.getFocused();
				opera.extension.tabs.create({url: act.where, focused: true});
			}
		}

		if (e.data.delayLoading) {
			clearInterval(updatePostTimeout.id);
			updatePostInterval = setInterval(function() { var newPosts = updateLatestPosts(); if (newPosts > 0) { Button.badge.display = "block"; Button.badge.textContent = newPosts.toString(); } }, (e.data.delayLoading*1000));
		}
		
		if (e.data.popup) {
			opera.extension.broadcastMessage(e.data);
		}
		// generic string messages

		if (typeof(e.data) === String) {
			switch (e.data) {
				case "nextupdate": e.source.postMessage(nextCheck);
			}
		}
	}

	updateLatestPosts();
	setupAutoPostloader();
	fetchFavorites();
}, false);

