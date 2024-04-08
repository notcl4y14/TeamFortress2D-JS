let Collider2D = class {
	constructor (position, dimensions, angle = 0, pivot = new Position2D(0, 0)) {
		this.position = position;
		this.dimensions = dimensions;
		this.angle = angle;
		this.pivot = pivot;
	};
	
	// =================================================

	get x () { return this.position.x; };
	get y () { return this.position.y; };
	get width () { return this.dimensions.width; };
	get height () { return this.dimensions.height; };

	set x (val) { this.position.x = val; };
	set y (val) { this.position.y = val; };
	set width (val) { this.dimensions.width = val; };
	set height (val) { this.dimensions.height = val; };

	get collisionRadius () {
		return 4 + this.width;
	};
	
	// =================================================

	intersects (other) {
		let x1 = this.x,
			y1 = this.y,
			w1 = this.width,
			h1 = this.height,
			x2 = other.x,
			y2 = other.y,
			w2 = other.w,
			h2 = other.h;
		
		return x1 < x2 + w2 &&
			x2 < x1 + w1 &&
			y1 < y2 + h2 &&
			y2 < y1 + h1;
	};

	// =================================================

	render (context, color = "#ffffff") {
		context.strokeStyle = color;
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
	
	renderCollisionRadius (context, color = "#ffffff") {
		context.strokeStyle = color;
		context.beginPath();
		context.arc(this.x, this.y, this.collisionRadius, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
	};
};

let Collider3D = class extends Collider2D {
	constructor (position, dimensions, angle = new Position2D(0, 0), pivot = new Position3D(0, 0, 0)) {
		super(position, dimensions, angle, pivot);
	};
	
	// =================================================

	get z () { return this.position.z; };
	get length () { return this.dimensions.length; };
	get angleX () { return this.angle.x; };
	get angleY () { return this.angle.y; };

	set z (val) { this.position.z = val; };
	set length (val) { this.dimensions.length = val; };
	set angleX (val) { this.angle.x = val; };
	set angleY (val) { this.angle.y = val; };
	
	// =================================================

	intersects (other) {
		let x1 = this.x - this.pivot.x,
			y1 = this.y - this.pivot.y,
			z1 = this.z - this.pivot.z,
			w1 = this.width,
			h1 = this.height,
			l1 = this.length,
			x2 = other.x - other.pivot.x,
			y2 = other.y - other.pivot.y,
			z2 = other.z - other.pivot.z,
			w2 = other.width,
			h2 = other.height,
			l2 = other.length;
		
		return x1 < x2 + w2 &&
			x2 < x1 + w1 &&
			y1 < y2 + h2 &&
			y2 < y1 + h1 &&
			z1 < z2 + l2 &&
			z2 < z1 + l1;
	};
		
	// =================================================

	render (context, color = "#ffffff") {
		let x = this.x - this.pivot.x;
		let y = this.y - this.pivot.y;
		let z = this.z - this.pivot.z;
		
		context.strokeStyle = color;
		context.strokeRect(x, z + y, this.width, this.height);

		context.strokeRect(x, z, this.width, this.length);
	};
	
	renderCollisionRadius (context, color = "#ffffff") {
		context.strokeStyle = color;
		context.beginPath();
		context.arc(this.x, this.z, this.collisionRadius, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
	};
};