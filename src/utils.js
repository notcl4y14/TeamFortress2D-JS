let utils_clamp = function (val, min, max) {
	if (val < min) return min;
	if (val > max) return max;

	return val;
}

let utils_dot = function (value) {
	return value / Math.abs(value);
}