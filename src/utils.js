let utils_clamp = function (val, min, max) {
	if (val < min) return min;
	if (val > max) return max;

	return val;
}

let utils_dot = function (value) {
	return value / Math.abs(value);
}

let utils_getDistance = function (x1, y1, x2, y2) {
	return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

let utils_ToRadians = function (deg) {
	return deg * Math.PI / 180;
}

let utils_ToDegrees = function (rad) {
	return rad * 180 / Math.PI;
}

// let utils_NoRef = function (value) {
// 	return JSON.parse(JSON.stringify(value));
// }