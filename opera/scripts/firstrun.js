/* setup all of our fancy databases and shit. */

function firstrun() {
	if (widget.preferences.firstRun == "1") {
		localStorage["latestposts"] = ""
		localStorage["latestposts_highid"] = ""
		localStorage["latestposts_newcounter"] = ""
	}
}