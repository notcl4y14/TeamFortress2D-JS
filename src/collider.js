let Collider2D = class {

	// =================================================

		constructor (x, y, width, height, angle = 0, pivot = { x: 0, y: 0, z: 0 }) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.angle = angle;
			this.pivot = pivot;
		}
	
	// =================================================

		get collisionRadius () {
			return 4 + this.width;
		}
	
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
		}

	// =================================================

		render (context, color = "#ffffff") {
			context.strokeStyle = color;
			context.strokeRect(this.x, this.y, this.width, this.height);
		}
		
		renderCollisionRadius (context, color = "#ffffff") {
			context.strokeStyle = color;
			context.beginPath();
			context.arc(this.x, this.y, this.collisionRadius, 0, 2 * Math.PI);
			context.stroke();
			context.closePath();
		}

	// =================================================
}

let Collider3D = class extends Collider2D {
	
	// =================================================
	
		constructor (x, y, z, width, height, length, angleX = 0, angleY = 0, pivot = { x: 0, y: 0, z: 0 }) {
			super(x, y, width, height, 0, pivot);
			this.z = z;
			this.length = length;
			this.angleX = angleX;
			this.angleY = angleY;
		}
	
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
		}
		
	// =================================================

		render (context, color = "#ffffff") {
			let x = this.x - this.pivot.x;
			let y = this.y - this.pivot.y;
			let z = this.z - this.pivot.z;
			
			context.strokeStyle = color;
			context.strokeRect(x, z + y, this.width, this.height);

			context.strokeRect(x, z, this.width, this.length);
		}
		
		renderCollisionRadius (context, color = "#ffffff") {
			context.strokeStyle = color;
			context.beginPath();
			context.arc(this.x, this.z, this.collisionRadius, 0, 2 * Math.PI);
			context.stroke();
			context.closePath();
		}

	// =================================================
}