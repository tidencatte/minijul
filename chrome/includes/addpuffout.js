// ==UserScript==
// @include http://jul.rustedlogic.net/*
// ==/UserScript==
var Popup = function (dlg) {
	this.puffout = dlg;
	this.container = this.puffout.childNodes[0];
	this.titlebar = this.container.childNodes[0];
	this.content = this.container.childNodes[2];
	this.rule = this.container.childNodes[1];
	
	this.setTitle = function(title) {
		if (title == null) {
			this.titlebar.style.display = "none";
			this.rule.style.display = "none";
		} else {
			this.titlebar.style.display = "block";
			this.titlebar.innerHTML = title;
		}
	};

	this.fullPageOverlay = function(content) {
		if (content.title == undefined) { // no title specified
			this.setTitle(null);
		} else {
			this.setTitle(content.title);
		}
		this.show();
	}
	
	this.recomputeContent = function() {
		this.container.style.posTop = (window.innerHeight / 2) - (this.container.clientHeight / 2)
		this.container.style.posLeft = (window.innerWidth / 2) - (this.container.clientWidth / 2)
		this.puffout.style.width = window.innerWidth;
		this.puffout.style.height = window.innerHeight;
	}
	
	this.show = function() {
		
		if (this.puffout.style.display == "none") {
			this.puffout.style.display = "block";
		}
		this.recomputeContent();
	}
	
	this.hide = function() {
		if (this.puffout.style.display == "block") {
			this.puffout.style.display = "none";
		}
	}
	
	this.setContent = function(content) {
		this.titlebar.innerHTML = content.title;
		this.rule.style.display = "block";
		this.content.innerHTML = content.content;
		this.recomputeContent();
	}
}
var popup = null;

opera.extension.addEventListener("message", function(e) {
	if (e.data.popup) {
		/* stuff here */
	}
}, false);

window.addEventListener("resize", function(e) {
	popup.recomputeContent();
}, false);

document.addEventListener("keypress", function(e) {
	popup.hide();
}, false);

document.addEventListener("click", function(e) {
	popup.hide();
}, false);

document.addEventListener("DOMContentLoaded", function(e) {
	// add our popup div(s) near the end of the document
	
	var puffout = document.createElement("div");       // background
	var puffoutInner0 = document.createElement("div"); // container
	var puffoutInner1 = document.createElement("div"); // "titlebar"
	var puffoutInner2 = document.createElement("div"); // content
	
	puffout.id = "puffout"; // of course
	
	puffoutInner0.id = "puffoutIn0";
	puffoutInner1.id = "puffoutIn1";
	puffoutInner2.id = "puffoutIn2";
	puffout.style.backgroundColor = "rgba(0,0,0,0.4)";
	puffout.style.width = window.innerWidth;
	puffout.style.height = window.innerHeight;
	puffout.style.position = "fixed";
	puffout.style.display = "none";
	puffout.style.posTop = 0;
	puffout.style.posLeft = 0;

	puffoutInner1.style.fontWeight = "bold";
	puffoutInner1.style.fontSize = 24;

	puffoutInner0.style.backgroundColor = "rgba(0,0,0,0.5)";
	puffoutInner0.style.position = "fixed";
	puffoutInner0.style.padding = 16;
	puffoutInner0.style.borderRadius = "8";
	puffoutInner0.style.boxShadow = "0 0 16px #000";
	
	
	puffoutInner0.appendChild(puffoutInner1);
	puffoutInner0.appendChild(document.createElement("hr"));
	puffoutInner0.appendChild(puffoutInner2);
	puffout.appendChild(puffoutInner0);

	document.body.appendChild(puffout);
	popup = new Popup(puffout);
}, false);
