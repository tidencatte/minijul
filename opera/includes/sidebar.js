// ==UserScript==
// @include http://*.rustedlogic.net/*
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(e) {
	var sidebar = document.createElement("div");
	sidebar.id  = "sidebar";
	
	sidebar.innerHTML = "<div id='titlebar'></div><div id='menustrip'></div><div id='content></div>";