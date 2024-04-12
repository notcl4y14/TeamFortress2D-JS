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
			layer.forEach((x, y) => {
				layer.forEachInTile(x, y, (object, tile) => {
					object.collisions = [];

					for (let object2 of tile) {
						if (object == object2) continue;
						this.checkCollisions(object, object2);
					}
				});
			});
		}
	}

	render (context) {
		this.layers.forEach ((layer) => layer.render(context));
	}

	// =================================================

	checkCollisions(a, b) {
		if (a == b) return;
					
		let distance = utils_getDistance(a.x, a.y, b.x, b.y);
		if (distance > a.collider.collisionRadius) return;

		if (a.collider.intersects(b.collider)) {
			a.OnCollision(b, game);
			a.collisions.push(b);
		}
	}
}

let Layer = class {
	constructor (name, tileWidth = 16, tileHeight = 16, gridWidth = 64, gridHeight = 64, max = 1024) {
		this.name = name;
		this.grid = [];
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;
		this.max = max;

		this.generateGrid();
		
		this.layout = null;
	}
	
	// =================================================

	generateGrid () {
		for (let y = 0; y < this.tileHeight; y++) {
			this.grid[y] = [];

			for (let x = 0; x < this.tileWidth; x++) {
				this.grid[y][x] = [];
			}
		}
	}
	
	getTile (x, y) {
		return this.grid[y][x];
	}
	
	forEach (func) {
		for (let y = 0; y < this.tileHeight; y++)
		{
			for (let x = 0; x < this.tileWidth; x++)
			{
				func(x, y);
			}
		}
	}

	forEachInTile (x, y, func) {
		let tile = this.getTile(x, y);
		for (let object of tile) func(object, tile);
	}

	// =================================================

	add (obj) {
		let gridX = Math.floor(obj.x / this.tileWidth);
		let gridY = Math.floor(obj.y / this.tileHeight);

		let tile = this.getTile(gridX, gridY);
		if (!tile) {
			this.grid[gridY][gridX] = [];
			tile = this.grid[gridY][gridX];
		}
		tile.push(obj);

		tile[tile.length - 1].layer = this;
		return tile.length;
	}

	remove (obj) {
		this.objects.splice( this.objects.indexOf(obj), 1 );
	}

	// =================================================

	update (game) {
		for (let y = 0; y < this.grid.length; y++)
		{
			for (let x = 0; x < this.grid[y].length; x++)
			{
				let tile = this.getTile(x, y);
				for (let object of tile)
				{
					object.update();

					let gridX = Math.floor(object.x / this.tileWidth);
					let gridY = Math.floor(object.y / this.tileHeight);
					let outOfTile = gridX != x || gridY != y;

					if (outOfTile)
					{
						let tempObject = object;
						let index = tile.indexOf(object);
						tile.splice(index, 1);

						this.getTile(gridX, gridY).push( tempObject );
					}
				}
			}
		}
	}

	render (context) {
		this.forEach((x, y) => {
			this.forEachInTile(x, y, (object) => object.render(context));
		});
	}
}