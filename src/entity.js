let Entity = class {
	
	// =================================================

		constructor (x, y, z, w, h, l, angleX = 0, angleY = 0) {
			this.collider = new Collider3D(x, y, z, w, h, l, angleX, angleY, { x: w / 2, y: h, z: 0 });

			this.velocity = {
				x: 0,
				y: 0,
				z: 0
			};

			this.acceleration = 0;
			this.friction = 0;
			this.speedMax = 0;

			this.health = 0;
			this.healthMax = 0;
		}

	// =================================================

		get x () { return this.collider.x; }
		get y () { return this.collider.y; }
		get z () { return this.collider.z; }
		get width () { return this.collider.width; }
		get height () { return this.collider.height; }
		get length () { return this.collider.length; }

		set x (val) { this.collider.x = val; }
		set y (val) { this.collider.y = val; }
		set z (val) { this.collider.z = val; }
		set width (val) { this.collider.width = val; }
		set height (val) { this.collider.height = val; }
		set length (val) { this.collider.length = val; }

	// =================================================

		applyGravity (gravity) {
			this.velocity.x += gravity.x;
			this.velocity.y += gravity.y;
			this.velocity.z += gravity.z;
		}

		applyVelocity () {
			this.x += this.velocity.x;
			this.y += this.velocity.y;
			this.z += this.velocity.z;
		}

	// =================================================

		update (game) {}

		render (context) {
			this.collider.render(context);
		}

	// =================================================

}

let Merc = class extends Entity {
	
	// =================================================

		constructor (x, y, z, mercID) {
			let merc = Merc.Class[mercID];

			super (x, y, z, merc.width, merc.height, merc.length);

			this.mercID = mercID;
			this.acceleration = merc.acceleration;
			this.friction = merc.friction;
			this.speedMax = merc.speedMax;
			this.jumpPower = merc.jumpPower;
			this.jumps = merc.jumps;

			this.health = merc.healthMax;
			this.healthMax = merc.healthMax;
			
			this.item = null;
			this.itemSlots = [];
		}
	
	// =================================================

		static Class = {
			0: {
				name: "Scout",
				width: 20,
				height: 40,
				length: 20,

				acceleration: 1,
				friction: 2,
				speedMax: 4,
				jumpPower: -5,
				jumps: 2,

				healthMax: 125,
			}
		};

	// =================================================

		update (game) {
			let left = game.input.isKeyDown("ArrowLeft");
			let right = game.input.isKeyDown("ArrowRight");
			let up = game.input.isKeyDown("ArrowUp");
			let down = game.input.isKeyDown("ArrowDown");
			let jump = game.input.isKeyPressed("Space");

			let dirX = (right - left);
			let dirZ = (down - up);

			// Acceleration
			this.velocity.x += dirX * this.acceleration;
			this.velocity.z += dirZ * this.acceleration;

			this.velocity.x = utils_clamp(this.velocity.x, this.speedMax * -1, this.speedMax);
			this.velocity.z = utils_clamp(this.velocity.z, this.speedMax * -1, this.speedMax);

			// Friction
			if (!left && !right && Math.floor(this.velocity.x) != 0) {
				this.velocity.x -= this.friction * utils_dot(this.velocity.x);
			}
			
			if (!up && !down && Math.floor(this.velocity.z) != 0) {
				this.velocity.z -= this.friction * utils_dot(this.velocity.z);
			}

			// Jump
			if (jump && this.jumps > 0) {
				this.velocity.y = this.jumpPower;
				this.jumps -= 1;
			}
			
			// Applying velocity
			this.applyVelocity();

			// Gravity
			this.applyGravity({x:0, y:0.25, z:0});

			if (this.y > 0) {
				this.velocity.y = 0;
				this.y = 0;
				this.jumps = Merc.Class[this.mercID].jumps;
			}
		}

		render (context) {
			this.collider.render(context);
			context.fillStyle = "white";
			context.fillText(this.health, this.x - this.width / 2, (this.z + this.y) - this.height);
		}

	// =================================================
}

let Bullet = class extends Entity {
	
	// =================================================

		constructor (x, y, z, angleX = 0, angleY = 0) {
			super (x, y, z, 10, 10, 10, angleX, angleY);
		}

	// =================================================

		update (game) {
			this.x += 1;

			if (this.collider.intersects(game.layout.layers[0].objects[0].collider)) {
				game.layout.layers[0].objects.splice(1, 1);
			}
		}

		render (context) {
			this.collider.render(context);
		}

	// =================================================
}