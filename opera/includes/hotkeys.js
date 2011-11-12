// ==UserScript==
// @include http://jul.rustedlogic.net/*
// ==/UserScript==
var _halpStuff = [
		["?", "This help screen"],
		["R", "Reply to thread / new thread"]
]


var defaultHotkeys = {
	// object for all the quick help stuff
	"R": {
		thread: function () {
			var p = parameterize(window.location);
			var id = p.id;
			var u = "http://jul.rustedlogic.net/newreply.php?id=" + id;
			opera.extension.postMessage({action:
				{what: "goto",
				where: u}});
		}
	},
	
	"QMARK": function() {
		opera.extension.postMessage({popup: {title: "HELP!!!", content: function() {
						var halpString = "";
						for (var i = 0; i < _halpStuff.length; i++) {
							var h = _halpStuff[i];
							halpString += (h[0] + " - " + h[1] + ((i == _halpStuff.length - 1) ? "" : "<br>"));
						}
						return halpString;
					}() } } );
		opera.extension.postMessage({popup: {state: 1}});
	}
};


var pageActions = {
	/* fixes for a few pages */
	"newreply": function() {
		var ta = document.evaluate("//TEXTAREA", document, null, 0, null);
		var t = ta.iterateNext();
		t.focus();
	}
}

var keyTable = {
	/* symbol table */
	63: "qmark"
};

function parameterize(u) {
	var qString = u.search.substring(1);
	var params = qString.split("&");
	var p = {};
	for (var i = 0; i < params.length; i++) {
		pair = params[i].split("=");
		p[pair[0]] = pair[1];
	}
	return p;
}

function ord(ch) {
	return keyTable[ch] != undefined ? keyTable[ch] : String.fromCharCode(ch);
}

function ch(name) {
	return name.charCodeAt(0);
}

function getPageName() {
	var path = window.location.pathname;
	return path.substring(1, path.search(".php"));
}

window.addEventListener("load", function(e) {
	var page = getPageName();
	if (pageActions[page] instanceof Function) {
		pageActions[page]();
	}

}, false);

document.addEventListener("keypress", function(e) {
	var key = (e.ctrlKey ? "ctrl" : "") + (ord(e.keyCode).toUpperCase());
	if (defaultHotkeys[key] != undefined && (e.target.nodeName != "TEXTAREA" & e.target.nodeName != "INPUT")) {
		e.preventDefault(); // stop opera's normal hotkeys from working. This is dangerous, but necessary to make hotkeys work since I'M LAZY
		var page = getPageName();
		if (defaultHotkeys[key] != undefined) {
			if (defaultHotkeys[key] instanceof Object && !(defaultHotkeys[key] instanceof Function)) {
				defaultHotkeys[key][page]();
			} else if (defaultHotkeys[key] instanceof Function) {
				defaultHotkeys[key]();
			}
		}
	}
}, false);
