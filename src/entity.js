let Entity2D = class {
	
	// =================================================

		constructor (x, y, w, h, angle = 0) {
			this.collider = new Collider2D(x, y, w, h, angle, { x: w / 2, y: h, z: 0 });

			this.velocity = {
				x: 0,
				y: 0
			};

			this.acceleration = 0;
			this.friction = 0;
			this.speedMax = 0;

			this.layer = null;
		}

	// =================================================

		get x () { return this.collider.x; }
		get y () { return this.collider.y; }
		get width () { return this.collider.width; }
		get height () { return this.collider.height; }
		get angle () { return this.collider.angle; }

		set x (val) { this.collider.x = val; }
		set y (val) { this.collider.y = val; }
		set width (val) { this.collider.width = val; }
		set height (val) { this.collider.height = val; }
		set angle (val) { this.collider.angle = val; }

	// =================================================

		applyGravity (gravity) {
			this.velocity.x += gravity.x;
			this.velocity.y += gravity.y;
		}

		applyVelocity () {
			this.x += this.velocity.x;
			this.y += this.velocity.y;
		}

	// =================================================

		OnCollision (other) {}

	// =================================================

		update (game) {}

		render (context) {
			this.collider.render(context);
		}

	// =================================================

}

let Entity3D = class extends Entity2D {
	
	// =================================================

		constructor (x, y, z, w, h, l, angleX = 0, angleY = 0) {
			super();
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

			this.layer = null;
		}

	// =================================================

		get x () { return this.collider.x; }
		get y () { return this.collider.y; }
		get z () { return this.collider.z; }
		get width () { return this.collider.width; }
		get height () { return this.collider.height; }
		get length () { return this.collider.length; }
		get angleX () { return this.collider.angleX; }
		get angleY () { return this.collider.angleY; }

		set x (val) { this.collider.x = val; }
		set y (val) { this.collider.y = val; }
		set z (val) { this.collider.z = val; }
		set width (val) { this.collider.width = val; }
		set height (val) { this.collider.height = val; }
		set length (val) { this.collider.length = val; }
		set angleX (val) { this.collider.angleX = val; }
		set angleY (val) { this.collider.angleY = val; }

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

		OnCollision (other) {}

	// =================================================

		update (game) {}

		render (context) {
			this.collider.render(context);
		}

	// =================================================

}

let Merc = class extends Entity3D {
	
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

		OnCollision (other, game) {
			switch (other.constructor.name) {
				case "Bullet":
					this.health -= other.damage;
					this.velocity.x += Math.cos(utils_DegreeToRadian(other.angleX)) * other.damage;
					this.velocity.z += Math.sin(utils_DegreeToRadian(other.angleX)) * other.damage;
					this.layer.remove(other);    // In case if it doesn't get deleted, somehow
					game.assets.sounds.hitsound.play();
					break;
			}
		}

	// =================================================

		update (game) {
			let left = game.input.isKeyDown("KeyA");
			let right = game.input.isKeyDown("KeyD");
			let up = game.input.isKeyDown("KeyW");
			let down = game.input.isKeyDown("KeyS");
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

let Bullet = class extends Entity3D {
	
	// =================================================

		constructor (x, y, z, speed = 40, damage = 4, angleX = 0, angleY = 0) {
			super (x, y, z, 10, 10, 10, angleX, angleY);
			this.speed = speed;
			this.damage = damage;
		}

	// =================================================

		OnCollision (other) {
			this.layer.remove(this);
		}

	// =================================================

		update (game) {
			let dirX = Math.cos(utils_DegreeToRadian(this.angleX)) * this.speed;
			let dirZ = Math.sin(utils_DegreeToRadian(this.angleX)) * this.speed;

			this.x += dirX;
			this.z += dirZ;
		}

		render (context) {
			let dirX = Math.cos(utils_DegreeToRadian(this.angleX)) * this.speed;
			let dirZ = Math.sin(utils_DegreeToRadian(this.angleX)) * this.speed;

			context.strokeStyle = "yellow";
			context.lineWidth = 4;
			context.beginPath();
			context.moveTo(this.x - dirX, this.z - dirZ);
			context.lineTo(this.x + dirX, this.z + dirZ);
			context.stroke();
			context.closePath();
			context.lineWidth = 1;

			// this.collider.render(context);
		}

	// =================================================
}

let HealthBar = class extends Entity2D {

	// =================================================

		constructor (x, y, width, height, target = null, originX, originY) {
			super(x, y, width, height, 0);
			this.target = target;
			this.originX = originX;
			this.originY = originY;
		}

	// =================================================

		update (game) {
			if (this.originX) this.x = this.originX(game);
			if (this.originY) this.y = this.originY(game);
		}
		
		render (context) {
			context.fillStyle = "black";
			context.fillRect(this.x, this.y, this.width, this.height);
			
			context.strokeStyle = "white";
			context.strokeRect(this.x, this.y, this.width, this.height);

			context.fillStyle = "green";
			context.fillRect(
				this.x + 2,
				this.y + this.height - 2,
				this.width - 4,
				(this.target.health / this.target.healthMax * this.height - 4) * -1
			);

			context.fillStyle = "white";
			context.fillText(this.target.health, this.x, this.y);
		}

	// =================================================
	
}