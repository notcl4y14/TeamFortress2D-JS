let clamp = function (val, min, max) {
	if (val < min) return min;
	if (val > max) return max;

	return val;
}

let getDistance = function (x1, y1, x2, y2) {
	return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

let toRadians = function (deg) {
	return deg * Math.PI / 180;
}

let toDegrees = function (rad) {
	return rad * 180 / Math.PI;
}

let loadImage = function (src) {
	let img = new Image();
	img.src = src;
	// img.style.imageRendering = "pixelated";

	// if (!img.complete) {
	// 	throw `Image at ${src} is not found!`;
	// }
	
	return img;
}

let renderShadow = function (context, x, y, radius, opacity) {
	context.fillStyle = "rgba(0,0,0," + opacity + ")";
	context.strokeStyle = "rgba(0,0,0,0)";
	// context.beginPath();
	// context.arc(x, y, radius, 0, 2 * Math.PI);
	// context.fill();
	// context.closePath();
	context.circle(x, y, radius);
	context.fill();
}