let Entity2D = class {
	constructor (position, dimensions, angle = 0, pivot = null) {
		let w = dimensions.width,
		    h = dimensions.height;

		pivot = pivot || new Point2D( w / 2, h );
		
		this.collider = new Collider2D(position, dimensions, angle, pivot);

		this.velocity = new Point2D(0, 0);

		this.acceleration = 0;
		this.friction = 0;
		this.speedMax = 0;

		this.sprite = null;

		this.collisions = [];
		this.layer = null;
	};

	// =================================================

	get position () { return this.collider.position; }
	get x () { return this.collider.x; };
	get y () { return this.collider.y; };
	get width () { return this.collider.width; };
	get height () { return this.collider.height; };
	get angle () { return this.collider.angle; };

	set position (val) { this.collider.position = val; }
	set x (val) { this.collider.x = val; };
	set y (val) { this.collider.y = val; };
	set width (val) { this.collider.width = val; };
	set height (val) { this.collider.height = val; };
	set angle (val) { this.collider.angle = val; };

	// =================================================

	isColliding (object, func = null) {
		if (typeof(object) == "string") {
			for (let obj of this.collisions) {
				if (obj.constructor.name == object) {
					if (func) func.call(this, obj);
					return obj;
				}
			}

			return null;
		} else if (typeof(object) == "object") {
			for (let obj of this.collisions) {
				if (object instanceof obj) {
					if (func) func.call(this, obj);
					return obj;
				}
			}

			return null;
		}
	}

	separate (other) {
		// https://www.sololearn.com/en/compiler-playground/WPmcR2CPfaIU
		// line: 2029

		let centerX = other.position.x + other.size.width / 2;
		let centerY = other.position.y + other.size.height / 2;

		let dx = this.position.x - centerX;
		let dy = this.position.y - centerY;

		// https://stackoverflow.com/a/22440044/22146374
		let x1 = Math.max(this.position.x, other.position.x);
		let y1 = Math.max(this.position.y, other.position.y);
		let x2 = Math.min(this.position.x + this.size.width, other.position.x + other.size.width);
		let y2 = Math.min(this.position.y + this.size.height, other.position.y + other.size.height);

		let interRect = {
			x: x1,
			y: y1,
			width: x2 - x1,
			height: y2 - y1
		};

		let vx = interRect.width * Math.sign(dx);
		let vy = interRect.height * Math.sign(dy);

		if (interRect.width < interRect.height) {
			this.position.x += vx;
			return new Point2D(1, 0);
		} else {
			this.position.y += vy;
			return new Point2D(0, 1);
		}
	};

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
	constructor (position, dimensions, angle, pivot = null) {
		super(position, dimensions, pivot);

		let w = dimensions.width,
		    h = dimensions.height,
			l = dimensions.length;

		pivot = pivot || new Point3D( w / 2, h / 2, l / 2 );
		
		this.collider = new Collider3D(position, dimensions, angle, pivot);

		this.velocity = new Point3D(0, 0, 0);

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

	separate (other) {
		// https://www.sololearn.com/en/compiler-playground/WPmcR2CPfaIU
		// line: 2029

		let centerX = other.x + other.width / 2;
		let centerY = other.y + other.height / 2;
		let centerZ = other.z + other.length / 2;

		let dx = this.x - centerX;
		let dy = this.y - centerY;
		let dz = this.z - centerZ;

		// https://stackoverflow.com/a/22440044/22146374
		let x1 = Math.max(this.x, other.x);
		let y1 = Math.max(this.y, other.y);
		let z1 = Math.max(this.z, other.z);
		let x2 = Math.min(this.x + this.width, other.x + other.width);
		let y2 = Math.min(this.y + this.height, other.y + other.height);
		let z2 = Math.min(this.z + this.length, other.z + other.length);

		let interRect = {
			x: x1,
			y: y1,
			width: x2 - x1,
			height: y2 - y1,
			length: z2 - z1
		};

		let vx = interRect.width * Math.sign(dx);
		let vy = interRect.height * Math.sign(dy);
		let vz = interRect.length * Math.sign(dz);

		// let x = 0;
		// let y = 0;
		// let z = 0;

		if (interRect.width < interRect.height && interRect.width < interRect.length) {
			this.position.x += vx;
			console.log(this, other, "Checked Width")
			return new Point3D(1, 0, 0);
		} else if (interRect.height < interRect.width && interRect.height < interRect.length) {
			this.position.y += vy;
			console.log(this, other, "Checked Height")
			return new Point3D(0, 1, 0);
		} else if (interRect.length < interRect.width && interRect.length < interRect.height) {
			this.position.z += vz;
			console.log(this, other, "Checked Length")
			return new Point3D(0, 0, 1);
		}

		return new Point3D(0, 0, 0);
	};

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

		super (position, new Dim3D(merc.width, merc.height, merc.length), new Point2D(0, 0), new Point3D(merc.width / 2, merc.height, merc.length / 2));

		this.mercID = mercID;
		this.acceleration = merc.acceleration;
		this.friction = merc.friction;
		this.speedMax = merc.speedMax;
		this.jumpPower = merc.jumpPower;
		this.jumps = merc.jumps;

		this.health = merc.healthMax;
		this.healthMax = merc.healthMax;
		
		this.itemIndex = 0;
		this.itemSlots = [new ScatterGun(this, 32, 6), new Bat()];
	};
	
	// =================================================

	get item () {
		return this.itemSlots[this.itemIndex];
	}

	set item (value) {
		this.itemSlots[this.itemIndex] = value;
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
				this.heal(other.damage * -1);
				this.velocity.x += Math.cos(toRadians(other.angleX)) * other.damage;
				this.velocity.z += Math.sin(toRadians(other.angleX)) * other.damage;
				other.destroy();    // In case if it doesn't get deleted, somehow
				game.playSound("hitsound");
				break;
			case "HealthPack":
				if (this.health >= this.healthMax) break;
				this.heal(other.health);
				this.layer.remove(other);
				break;
			case "AmmoPack":
				if (!this.item.ammo) break;
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

		let slot1 = game.input.isKeyPressed("Digit1");
		let slot2 = game.input.isKeyPressed("Digit2");
		let slot3 = game.input.isKeyPressed("Digit3");

		if (slot1) {
			this.itemIndex = 0;
		}
		else if (slot2) {
			this.itemIndex = 1;
		}
		else if (slot3) {
			this.itemIndex = 2;
		}
		
		this.itemIndex = clamp(this.itemIndex, 0, this.itemSlots.length - 1);

		if (this.item != null) {
			if (lm) {
				this.item.attack1(this);
			} else if (rm) {
				this.item.attack2(this);
			}
		}

		if (reload) {
			if (this.item.reload) {
				this.item.reload();
			}
		}

		let dirX = (right - left);
		let dirZ = (down - up);

		// Acceleration
		this.velocity.x += dirX * this.acceleration;
		this.velocity.z += dirZ * this.acceleration;

		this.velocity.x = clamp(this.velocity.x, this.speedMax * -1, this.speedMax);
		this.velocity.z = clamp(this.velocity.z, this.speedMax * -1, this.speedMax);

		// Friction
		if (!left && !right && Math.floor(this.velocity.x) != 0) {
			this.velocity.x -= this.friction * Math.sign(this.velocity.x);
		};
		
		if (!up && !down && Math.floor(this.velocity.z) != 0) {
			this.velocity.z -= this.friction * Math.sign(this.velocity.z);
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

		// this.isColliding("Block", (block) => {
		// 	let v = this.separate(block);
			
		// 	if (v.x) this.velocity.x = 0;
		// 	if (v.y) this.velocity.y = 0;
		// 	if (v.z) this.velocity.z = 0;
		// });

		if (this.position.y > 0) {
			this.position.y = 0;
			this.velocity.y = 0;
			this.jumps = Merc.Class[this.mercID].jumps;
		}
	};

	render (context) {
		this.collider.render(context);
		context.fillStyle = "white";
		context.fillText(this.health, this.x - this.width / 2, (this.z + this.y) - this.height);

		if (this.item != null) {
			let x = this.x + -this.collider.pivot.x;
			let y = this.y + -this.collider.pivot.y;
			let z = this.z + -this.collider.pivot.z;

			let position = new Point2D(x + this.width * 1.30, z + y + this.height);
			let angle = Math.atan2(game.input.mouseY - position.y, game.input.mouseX - position.x);
			let scaleX = Math.sign(toRadians(angle));
			let scaleY = 1;

			position.x += Math.cos(angle) * 15;
			position.y += Math.sin(angle) * 15;

			this.item.render(
				context,
				position,
				angle,
				scaleX,
				scaleY
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
		let dirX = Math.cos(toRadians(this.angleX)) * this.speed;
		let dirZ = Math.sin(toRadians(this.angleX)) * this.speed;

		this.x += dirX;
		this.z += dirZ;
	};

	render (context) {
		let dirX = Math.cos(toRadians(this.angleX)) * this.speed / 2;
		let dirZ = Math.sin(toRadians(this.angleX)) * this.speed / 2;

		context.lineWidth = 4;

		context.strokeStyle = "rgba(0,0,0,0.5)";
		context.strokeLine(
			this.x - dirX, this.z - dirZ,
			this.x + dirX, this.z + dirZ
		);

		context.strokeStyle = "yellow";
		context.strokeLine(
			this.x - dirX, (this.z - dirZ) + this.y,
			this.x + dirX, (this.z + dirZ) + this.y
		);
		
		context.lineWidth = 1;
	};
};

let Spawner = class extends Entity3D {
	constructor (position, object, timer) {
		super (position, new Dim3D(32, 10, 24), new Point2D(0, 0));
		this.object = object;

		// Instant spawn
		this.timer = timer;
		this.timerMax = timer;
	}

	// =================================================

	OnCollision (other) {};

	// =================================================

	update (game) {
		let object = this.object.constructor.name;
		let isColliding = this.isColliding(object);

		this.timer++

		if (isColliding) {
			this.timer = 0;
		}

		if (this.timer >= this.timerMax) {
			this.timer = 0;

			let index = this.layer.add( Object.create(this.object) );
			index -= 1;

			this.layer.objects[index].position = this.position;
		}
	};

	render (context, color = "#ffffff") {
		context.fillStyle = color;
		this.collider.render(context);

		let x = this.x - this.collider.pivot.x;
		let y = this.y - this.collider.pivot.y;
		let z = this.z - this.collider.pivot.z;

		context.fillText(this.timer + "/" + this.timerMax, x, z + y);
	}
};

let HealthPack = class extends Entity3D {
	constructor (position, health = 50) {
		super (position, new Dim3D(32, 10, 24), new Point2D(0, 0));
		this.health = health;
		this.sprite = game.getImage("medkit");
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
		let t = Math.sin(game.ticks / 20) * 4;

		renderShadow(context, this.x, this.z + 5, 12.5, 0.5);

		context.drawImage(this.sprite, x, z + y - t);
	};
};

let AmmoPack = class extends Entity3D {
	constructor (position, ammo = 50) {
		super (position, new Dim3D(32, 10, 24), new Point2D(0, 0));
		this.ammo = ammo;
		this.sprite = game.getImage("ammo_pack");
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
		let t = Math.sin(game.ticks / 20) * 4;

		renderShadow(context, this.x, this.z + 5, 12.5, 0.5);

		context.drawImage(this.sprite, x, z + y - t);
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
		let collect = clamp(ammo, 0, this.ammoSize);
		let left = ammo - collect;
		this.ammo += collect;
		this.ammo = clamp(this.ammo, 0, this.ammoSize);
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
			game.input.mouseY - (user.z + user.y),
			game.input.mouseX - user.x
		);

		let dirX = Math.cos(angle) * (user.width + this.length);
		let dirZ = Math.sin(angle) * (user.length + this.length);

		angle = toDegrees(angle);

		let x = user.x + dirX;
		let y = user.y - user.height / 2;
		let z = user.z + dirZ;

		game.playSound("scattergun_shoot");

		for (let i = -2; i <= 2; i++) {
			let _i = i * 10;
			this.spawn(
				new Bullet(
					new Point3D(x, y, z),
					new Point2D(angle + _i, 0),
					user
				)
			);
		}
	};
	
	reload (user = this.user) {
		game.playSound("scattergun_reload");
		if (this.ammo <= 0 || this.carried >= this.carrySize) return;
		this.ammo -= this.carrySize;
		let left = this.ammo < 0 ? Math.abs(this.ammo) : 6;
		this.carried += left;
		if (this.ammo < 0) this.ammo = 0;
	};

	// =================================================

	render (context, position, angle, scaleX, scaleY) {
		let img = game.getImage("scattergun");

		context.setOrigin(img.width / 2, img.height / 2);
		context.setRotation(angle);
		context.save();
		context.applyOrigin(position);
		// context.scale(scaleX, scaleY);
		// context.translate(context.canvas.width * -1, 0);
			context.drawImage(img, -img.width / 2, -img.width / 2);
		context.restore();
	};
};

let Bat = class extends Item {
	constructor (user) {
		super();
		this.user = user;
	};

	// =================================================

	attack1 (user) {
		// let attackCollider = {
		// 	x: user.x - user.width / 2,
		// 	y: user.y - user.height,
		// 	z: user.z - user.length / 2,
		// 	width: user.width / 2,
		// 	height: user.height,
		// 	length: user.length
		// };
	};
	attack2 (user) {};

	// =================================================

	update (game) {};
	render (context, position) {
		context.fillStyle = "white";
		context.fillText("Bat", position.x, position.y);
	};
};

let Block = class extends Entity3D {
	constructor (position, dimensions, angle = new Point2D(0, 0)) {
		super(position, dimensions, angle, new Point3D(0, 0, 0));
	};

	// =================================================
	
	OnCollision (other) {}

	// =================================================

	update (game) {}

	render (context) {
		// context.fillStyle = "#ffffff";
		this.collider.render(context);
	}
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