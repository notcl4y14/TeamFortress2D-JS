let Entity2D = class {
	constructor (position, dimensions, angle = 0) {
		let w = dimensions.width,
		    h = dimensions.height;
		
		this.collider = new Collider2D(position, dimensions, angle, new Position2D( w / 2, h ));

		this.velocity = new Position2D(0, 0);

		this.acceleration = 0;
		this.friction = 0;
		this.speedMax = 0;

		this.sprite = null;

		this.layer = null;
	};

	// =================================================

	get x () { return this.collider.x; };
	get y () { return this.collider.y; };
	get width () { return this.collider.width; };
	get height () { return this.collider.height; };
	get angle () { return this.collider.angle; };

	set x (val) { this.collider.x = val; };
	set y (val) { this.collider.y = val; };
	set width (val) { this.collider.width = val; };
	set height (val) { this.collider.height = val; };
	set angle (val) { this.collider.angle = val; };

	// =================================================

	applyGravity (gravity) {
		this.velocity.x += gravity.x;
		this.velocity.y += gravity.y;
	};

	applyVelocity () {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	};

	// =================================================

	OnCollision (other) {};
	OnDestroy () {};
	
	destroy (noCall = false) {
		if (!noCall) this.OnDestroy();
		this.layer.remove(this);
	}

	// =================================================

	update (game) {};

	render (context) {
		if (!this.sprite) this.collider.render(context);
		else context.drawImage(this.sprite);
	};
};

let Entity3D = class extends Entity2D {
	constructor (position, dimensions, angle) {
		super(position, dimensions);

		let w = dimensions.width,
		    h = dimensions.height,
			l = dimensions.length;
		
		this.collider = new Collider3D(position, dimensions, angle, new Position3D( w / 2, h, l / 2 ));

		this.velocity = new Position3D(0, 0, 0);

		this.acceleration = 0;
		this.friction = 0;
		this.speedMax = 0;

		this.health = 0;
		this.healthMax = 0;

		this.layer = null;
	};

	// =================================================

	get x () { return this.collider.x; };
	get y () { return this.collider.y; };
	get z () { return this.collider.z; };
	get width () { return this.collider.width; };
	get height () { return this.collider.height; };
	get length () { return this.collider.length; };
	get angleX () { return this.collider.angleX; };
	get angleY () { return this.collider.angleY; };

	set x (val) { this.collider.x = val; };
	set y (val) { this.collider.y = val; };
	set z (val) { this.collider.z = val; };
	set width (val) { this.collider.width = val; };
	set height (val) { this.collider.height = val; };
	set length (val) { this.collider.length = val; };
	set angleX (val) { this.collider.angleX = val; };
	set angleY (val) { this.collider.angleY = val; };

	// =================================================

	applyGravity (gravity) {
		this.velocity.x += gravity.x;
		this.velocity.y += gravity.y;
		this.velocity.z += gravity.z;
	};

	applyVelocity () {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.z += this.velocity.z;
	};

	// =================================================

	OnCollision (other) {};

	// =================================================

	update (game) {};

	render (context) {
		this.collider.render(context);
	};
};

let Merc = class extends Entity3D {
	constructor (position, mercID) {
		let merc = Merc.Class[mercID];

		super (position, new Dim3D(merc.width, merc.height, merc.length));

		this.mercID = mercID;
		this.acceleration = merc.acceleration;
		this.friction = merc.friction;
		this.speedMax = merc.speedMax;
		this.jumpPower = merc.jumpPower;
		this.jumps = merc.jumps;

		this.health = merc.healthMax;
		this.healthMax = merc.healthMax;
		
		this.item = new ScatterGun(this, 32, 6);
		this.itemSlots = [];
	};
	
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
				this.heal(other.damage * -1);
				this.velocity.x += Math.cos(utils_ToRadians(other.angleX)) * other.damage;
				this.velocity.z += Math.sin(utils_ToRadians(other.angleX)) * other.damage;
				other.destroy();    // In case if it doesn't get deleted, somehow
				game.playSound("hitsound");
				break;
			case "HealthPack":
				if (this.health >= this.healthMax) break;
				this.heal(other.health);
				this.layer.remove(other);
				break;
			case "AmmoPack":
				if (this.item.ammo >= this.item.ammoSize) break;
				this.item.collect(other.ammo);
				this.layer.remove(other);
				break;
		};
	};

	// =================================================

	heal (hp) {
		this.health += hp;

		// Replace with overheal
		if (this.health > this.healthMax) {
			this.health = this.healthMax;
		} else if (this.health < 0) {
			this.health = 0;
		}
	};

	// =================================================

	update (game) {
		let left = game.input.isKeyDown("KeyA");
		let right = game.input.isKeyDown("KeyD");
		let up = game.input.isKeyDown("KeyW");
		let down = game.input.isKeyDown("KeyS");
		let jump = game.input.isKeyPressed("Space");
		let reload = game.input.isKeyPressed("KeyR");
		let lm = game.input.isMouseClicked(0);
		let rm = game.input.isMouseClicked(1);

		if (this.item != null) {
			if (lm) {
				this.item.attack1(this);
			} else if (rm) {
				this.item.attack2(this);
			}
		}

		if (reload) {
			this.item.reload();
		}

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
		};
		
		if (!up && !down && Math.floor(this.velocity.z) != 0) {
			this.velocity.z -= this.friction * utils_dot(this.velocity.z);
		};

		// Jump
		if (jump && this.jumps > 0) {
			this.velocity.y = this.jumpPower;
			this.jumps -= 1;
		};
		
		// Applying velocity
		this.applyVelocity();

		// Gravity
		this.applyGravity({x:0, y:0.25, z:0});

		if (this.y > 0) {
			this.velocity.y = 0;
			this.y = 0;
			this.jumps = Merc.Class[this.mercID].jumps;
		};
	};

	render (context) {
		this.collider.render(context);
		context.fillStyle = "white";
		context.fillText(this.health, this.x - this.width / 2, (this.z + this.y) - this.height);

		if (this.item != null) {
			this.item.render(
				context,
				{
					x: this.x + this.width / 2,
					y: (this.z + this.y) - this.height
				}
			);
		};
	};
};

let Bullet = class extends Entity3D {
	constructor (position, angle, sender = null) {
		super (position, new Dim3D(10, 10, 10), angle);
		this.speed = 20;
		this.damage = 4;
		this.sender = sender;
	};

	// =================================================

	OnCollision (other) {
		if (other.constructor.name == "Bullet") return;
		this.destroy();
	};

	// =================================================

	update (game) {
		let dirX = Math.cos(utils_ToRadians(this.angleX)) * this.speed;
		let dirZ = Math.sin(utils_ToRadians(this.angleX)) * this.speed;

		this.x += dirX;
		this.z += dirZ;
	};

	render (context) {
		let dirX = Math.cos(utils_ToRadians(this.angleX)) * this.speed / 2;
		let dirZ = Math.sin(utils_ToRadians(this.angleX)) * this.speed / 2;

		context.strokeStyle = "yellow";
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo(this.x - dirX, this.z - dirZ);
		context.lineTo(this.x + dirX, this.z + dirZ);
		context.stroke();
		context.closePath();
		context.lineWidth = 1;
	};
};

let HealthPack = class extends Entity3D {
	constructor (position, health = 50) {
		super (position, new Dim3D(10, 10, 10), new Position2D(0, 0));
		this.health = health;
	};

	// =================================================

	OnCollision (other) {};

	// =================================================

	update (game) {};

	render (context) {
		this.collider.render(context);
	};
};

let AmmoPack = class extends Entity3D {
	constructor (position, ammo = 50) {
		super (position, new Dim3D(10, 10, 10), new Position2D(0, 0));
		this.ammo = ammo;
		this.sprite = utils_loadImage("assets/ammo_pack.png");
	};

	// =================================================

	OnCollision (other) {};

	// =================================================

	update (game) {};

	render (context) {
		if (!this.sprite.complete) return;

		let x = this.x - this.collider.pivot.x;
		let y = this.y - this.collider.pivot.y;
		let z = this.z - this.collider.pivot.z;

		context.drawImage(this.sprite, x, z + y);
	};
};

let Item = class {
	constructor (user) {
		this.user = user;
	};

	// =================================================

	attack1 (user) {};
	attack2 (user) {};

	// =================================================

	update (game) {};
	render (context) {};
};

let Gun = class extends Item {
	constructor (user, ammoSize, carrySize, ammo = 0, carried = 0) {
		super(user);
		this.ammoSize = ammoSize;
		this.carrySize = carrySize;
		this.ammo = ammo;
		this.carried = carried;

		this.length = 0;
	};

	// =================================================

	spawn (object) {
		this.user.layer.add(object);
	};

	// =================================================
	
	reload (user = this.user) {
		if (this.ammo <= 0 || this.carried >= this.carrySize) return;
		this.ammo -= this.carrySize;
		let left = this.ammo < 0 ? Math.abs(this.ammo) : 6;
		this.carried += left;
		if (this.ammo < 0) this.ammo = 0;
	};

	collect (ammo) {
		let collect = utils_clamp(ammo, 0, this.ammoSize);
		let left = ammo - collect;
		this.ammo += collect;
		this.ammo = utils_clamp(this.ammo, 0, this.ammoSize);
		return left;
	};
};

let ScatterGun = class extends Gun {
	constructor (user, ammo = 0, carried = 0) {
		super(user, 32, 6, ammo, carried);

		this.length = 20;
	};

	// =================================================

	attack1 (user = this.user) {
		if (this.carried <= 0) {
			this.reload();
			return;
		};

		this.carried -= 1;

		let angle = Math.atan2(
			game.input.mouseY - user.z,
			game.input.mouseX - user.x
		);

		let dirX = Math.cos(angle) * (user.width + this.length);
		let dirZ = Math.sin(angle) * (user.length + this.length);

		angle = utils_ToDegrees(angle);

		let x = user.x + dirX;
		let y = user.y;
		let z = user.z + dirZ;

		for (let i = -1; i <= 1; i++) {
			let _i = i * 45;
			this.spawn(
				new Bullet(
					new Position3D(x, y, z),
					new Position2D(angle + _i, 0),
					user
				)
			);
		}
	};

	// =================================================

	render (context, position) {
		context.fillStyle = "white";
		context.fillText("ScatterGun", position.x, position.y);
	};
};

let HealthBar = class extends Entity2D {
	constructor (position, dimensions, target = null, originX, originY) {
		super(position, dimensions, 0);
		this.target = target;
		this.originX = originX;
		this.originY = originY;
	};

	// =================================================

	update (game) {
		if (this.originX) this.x = this.originX(game);
		if (this.originY) this.y = this.originY(game);
	};
	
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
	};
};

let AmmoHUD = class extends Entity2D {
	constructor (position, dimensions, target = null, originX, originY) {
		super(position, dimensions, 0);
		this.target = target;
		this.originX = originX;
		this.originY = originY;
	};

	// =================================================

	update (game) {
		if (this.originX) this.x = this.originX(game);
		if (this.originY) this.y = this.originY(game);
	};
	
	render (context) {
		context.fillStyle = "black";
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.strokeStyle = "white";
		context.strokeRect(this.x, this.y, this.width, this.height);

		context.fillStyle = "yellow";
		context.fillRect(
			this.x + 2,
			this.y + this.height - 2,
			this.width - 4,
			// ((this.target.ammo + this.target.carried) / (this.target.ammoSize + this.target.carrySize) * this.height - 4) * -1
			(this.target.ammo / this.target.ammoSize * this.height - 4) * -1
		);

		// Segments separated by lines
		// Should be fixed
		// let interval = this.height / (this.target.ammoSize + this.target.carrySize);

		// context.fillStyle = "black";
		// for (let i = 0; i < interval; i++) {
		// 	context.fillRect(
		// 		this.x + 2,
		// 		this.y + i * interval,
		// 		this.width - 4,
		// 		1
		// 	);
		// }

		context.fillStyle = "white";
		context.fillText(this.target.ammo + ":" + this.target.carried, this.x, this.y);
	};
};