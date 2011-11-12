String.prototype.pluralize = function(val) {
	if (val == 1) {
		return val + " " + this;
	} else if (val == 0 || val >= 2) {
		return val + " " + this + "s";
	}
}

Array.prototype.pset = function(p) {
	// create a set such that each element in the array is an object with properties
	var uniq = [];
	var a = [];
	var t = Object(this);
	for (var i = 0; i < t.length; i++) {
		var prop = t[i][p];
		if (uniq.indexOf(prop) == -1) {
			uniq.push(t[i][p]);
			a.push(t[i]);
		} else {
			continue;
		}
	}
	
	return a;
}