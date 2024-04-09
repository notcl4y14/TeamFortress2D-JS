let Layout = class {

	// =================================================
	
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
			this.layers.forEach ((layer) => {
				// Collision check
				for (let object of layer.objects) {
					for (let object2 of layer.objects) {
						if (object == object2) continue;
						let distance = utils_getDistance(object.x, object.y, object2.x, object2.y);
						if (distance > object.collider.collisionRadius) continue;

						if (object.collider.intersects(object2.collider)) {
							object.OnCollision(object2, game);
						}
					}
				}

				layer.update(game)
			});
		}

		render (game) {
			this.layers.forEach ((layer) => layer.render(game));
		}

	// =================================================
	
}

let Layer = class {

	// =================================================

		constructor (name, max = 1024) {
			this.name = name;
			this.objects = [];
			this.max = max;
			
			this.layout = null;
		}
	
	// =================================================

		add (obj) {
			this.objects.push(obj);

			if (this.objects.length > this.max) {
				this.layout.game.stop();
				alert(`Object amount reached limit (${this.objects.length}/${this.max}) on layer "${this.name}"`);
				window.close();
				throw `Object amount reached limit (${this.objects.length}/${this.max}) on layer "${this.name}"`;
			}

			this.objects[this.objects.length - 1].layer = this;
		}

		remove (obj) {
			this.objects.splice( this.objects.indexOf(obj), 1 );
		}

	// =================================================

		update (game) {
			// this.objects.sort(function (a1, a2) {
			// 	if (!a1.z && !a2.z) return;
			// 	return a1.z - a2.z;
			// });

			this.objects.forEach ((obj) => obj.update(game));
		}

		render (game) {
			this.objects.forEach ((obj) => obj.render(game));
		}

	// =================================================

}