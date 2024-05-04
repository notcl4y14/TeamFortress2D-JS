let Layout = class {
	constructor (layers = [], game) {
		this.layers = layers;
		this.layers.forEach ((layer) => layer.parent = this);

		this.game = game;
	}

	// =================================================

	clear () {
		this.layers = [];
	}

	// =================================================
	
	addLayer (index, name) {
		if (this.layers[index]) {
			return null;
		}
		
		this.layers[index] = new Layer(name);
		this.layers[index].layout = this;
		return this.layers[index];
	}

	removeLayer (name) {
		let index = this.getLayerIndex(name);

		if (!index) {
			return false;
		}

		this.layers.splice(index, 1);
	}

	getLayer (name) {
		for (let index = 0; index < this.layers.length; index++) {
			let layer = this.layers[index];
			if (layer.name == name) {
				return layer;
			}
		}

		return null;
	}

	getLayerIndex (name) {
		for (let index = 0; index < this.layers.length; index++) {
			let layer = this.layers[index];
			if (layer.name == name) {
				return index;
			}
		}

		return null;
	}

	// =================================================

	update (game) {
		for (let layer of this.layers) {
			if (!layer) continue;
			
			layer.objects.forEach((object) => {
				object.collisions = [];

				layer.objects.forEach((object2) => {
					if (object != object2) {
						this.checkCollisions(object, object2);
					}
				});

				object.update(game);
			});
		}
	}

	render (context) {
		this.layers.forEach ((layer) => layer.render(context));
	}

	// =================================================

	checkCollisions(a, b) {
		if (a == b) return;
		
		if (a.collider.intersects(b.collider)) {
			a.OnCollision(b, game);
			a.collisions.push(b);
		}
	}
}

let Layer = class {
	constructor (name, max = 1024) {
		this.name = name;
		this.objects = [];
		this.max = max;
		
		this.layout = null;
	}
	// =================================================

	add (obj) {
		this.objects.push(obj);
		obj.layer = this;

		return this.objects.length;
	}

	remove (obj) {
		this.objects.splice( this.objects.indexOf(obj), 1 );
	}

	// =================================================

	update (game) {
		this.objects.forEach((obj) => obj.update());
	}

	render (context) {
		this.objects.forEach((obj) => obj.render(context));
	}
}