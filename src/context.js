let Context = class {
	constructor (canvas) {
		this.innerContext = canvas.getContext("2d");
		this.origin = { x: 0, y: 0 };
		this.rotation = 0;
	}

	// ////////////////

	get canvas () {
		return this.innerContext.canvas;
	}

	get fillStyle () {
		return this.innerContext.fillStyle;
	}

	get strokeStyle () {
		return this.innerContext.strokeStyle;
	}

	get lineWidth () {
		return this.innerContext.lineWidth;
	}

	get font () {
		return this.innerContext.font;
	}

	set fillStyle (value) {
		this.innerContext.fillStyle = value;
	}

	set strokeStyle (value) {
		this.innerContext.strokeStyle = value;
	}

	set lineWidth (value) {
		this.innerContext.lineWidth = value;
	}

	set font (value) {
		this.innerContext.font = value;
	}

	// ////////////////
	
	applyOrigin (pos) {
		// this.save();
		let origin = this.origin;
		origin.x = pos.x + -this.origin.x;
		origin.y = pos.y + -this.origin.y;
		// this.innerContext.strokeRect(origin.x - 10, origin.y - 10, 20, 20);
		// this.innerContext.strokeRect(origin.x, origin.y, 1, 1);
		this.translate(origin.x, origin.y);
		this.rotate(this.rotation);
	}

	translate (x, y) {
		this.innerContext.translate(x, y);
	}

	rotate (rot) {
		this.innerContext.rotate(rot);
	}

	scale (x, y) {
		this.innerContext.scale(x, y);
	}

	save () {
		this.innerContext.save();
	}

	restore () {
		this.innerContext.restore();
	}

	beginPath () {
		this.innerContext.beginPath();
	}

	closePath () {
		this.innerContext.closePath();
	}

	// ////////////////

	setOrigin (x, y) {
		this.origin.x = x;
		this.origin.y = y;
	}

	setRotation (angle) {
		this.rotation = angle;
	}

	// ////////////////

	drawImage (img, x, y, dw, dh) {
		if (dw != null) {
			dh = dh || dw;
			this.innerContext.drawImage(img, x, y, dw, dh);
		}

		this.innerContext.drawImage(img, x, y);
	}

	rectangle (x, y, width, height) {
		this.innerContext.rect(x, y, width, height);
	}

	arc (x, y, radius, begin = 0, end = Math.PI * 2) {
		this.innerContext.arc(x, y, radius, begin, end);
	}

	circle (x, y, radius, begin = 0, end = Math.PI * 2) {
		this.innerContext.beginPath();
		this.innerContext.arc(x, y, radius, begin, end);
		this.innerContext.closePath();
	}

	line (x1, y1, x2, y2) {
		this.innerContext.beginPath();
		this.innerContext.moveTo(x1, y1);
		this.innerContext.lineTo(x2, y2);
		this.innerContext.closePath();
	}

	// ////////////////

	fillRect (x, y, width, height) {
		this.innerContext.beginPath();
		this.rectangle(x, y, width, height);
		this.fill();
		this.innerContext.closePath();
	}

	strokeRect (x, y, width, height) {
		this.innerContext.beginPath();
		this.rectangle(x, y, width, height);
		this.stroke();
		this.innerContext.closePath();
	}

	strokeLine (x1, y1, x2, y2) {
		this.innerContext.beginPath();
		this.line(x1, y1, x2, y2);
		this.stroke();
		this.innerContext.closePath();
	}

	fillText (text, x, y, maxWidth = undefined) {
		this.innerContext.fillText(text, x, y, maxWidth);
	}

	// ////////////////
	
	fill () {
		this.innerContext.fill();
	}

	stroke () {
		this.innerContext.stroke();
	}

	clear () {
		this.innerContext.clear();
	}
}