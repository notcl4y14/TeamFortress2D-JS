let Game = class {
	constructor () {
		this.canvas = document.getElementById("canvas");
		this.context = this.canvas.getContext("2d");

		this.running = false;
		this.ticks = 0;

		this.assets = {
			sounds: {
				hitsound: new Audio("assets/hitsound.mp3"),
				scattergun_double_shoot: new Audio("assets/scatter_gun_double_shoot.wav"),
				scattergun_shoot: new Audio("assets/scatter_gun_shoot.wav"),
				scattergun_reload: new Audio("assets/scatter_gun_reload.wav")
			},
			images: {
				ammo_pack: utils_loadImage("assets/ammo_pack.png"),
				medkit: utils_loadImage("assets/medkit.png")
			}
		};
		
		this.soundBuffer = [];

		this.settings = {
			volume: 0.75
		}

		this.input = new Input();
		this.layout = new Layout([], this);
	};

	// =================================================

	load () {
		let game = this;

		let l_main = this.layout.addLayer(0, "main");
		l_main.add( new Merc( new Position3D(10, 0, 10), 0 ) );
		l_main.add( new Bullet (new Position3D(500, 0, 500), new Position2D(180 + 45, 0) ) );

		l_main.add( new HealthPack( new Position3D(500, 0, 200) ) );
		l_main.add( new AmmoPack( new Position3D(540, 0, 200) ) );

		let l_gui = this.layout.addLayer(10, "GUI");
		l_gui.add( new HealthBar(
			new Position2D(2, game.canvas.height - 50),
			new Dim2D(10, 50),
			l_main.objects[0],
			function (game) {
				return 2;
			},
			function (game) {
				return game.canvas.height - 52;
			}
		) );
		l_gui.add( new AmmoHUD(
			new Position2D(40, game.canvas.height - 50),
			new Dim2D(10, 50),
			l_main.objects[0].item,
			function (game) {
				return 18;
			},
			function (game) {
				return game.canvas.height - 52;
			}
		) );
	}
		
	// =================================================
	
	getImage (name) {
		return this.assets.images[name];
	}
		
	// =================================================

	playSound (name) {
		let sound = this.assets.sounds[name];
		let index = this.soundBuffer.push( sound.cloneNode() ) - 1;
		this.soundBuffer[index].volume = this.settings.volume;
		this.soundBuffer[index].play();
		
		// this.soundBuffer[index].onplayed = () => {
		// 	game.soundBuffer.splice(index, 1);
		// }

		this.checkSound( this.soundBuffer[index] );
	};

	async checkSound (sound) {
		if (sound.played) {
			let index = this.soundBuffer.indexOf(sound);
			this.soundBuffer.splice(index, 1);
			return;
		}

		window.requestAnimationFrame(() => this.checkSound(sound));
	};
		
	// =================================================
	
	async start () {
		this.running = true;
		this.loop();
	};
	
	stop () {
		this.running = false;
	};

	// =================================================

	loop () {
		if (!this.running) return;
		
		this.update ();
		this.render (this.context);

		window.requestAnimationFrame (() => this.loop());
	};

	update () {
		this.ticks++;
		this.layout.update(this);
	};
	
	render (context) {
		context.fillStyle = "cornflowerblue";
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		this.layout.render(context);

		let ammo = this.layout.getLayer("main").objects[0].item.ammo;
		let carried = this.layout.getLayer("main").objects[0].item.carried;

		context.fillStyle = "black";
		context.fillText(ammo + ":" + carried, 0, 10);

		context.fillText("Volume: " + this.settings.volume * 100 + "%", 350, 100);
		context.fillText("To change it: open console and type `game.settings.volume = 0.50`", 350, 110);
		context.fillText("This changes the volume to 50%, you can choose from 0 to 0.50 to 1", 350, 120);
	};
};

let game;

window.onload = function () {
	game = new Game();
	game.load();
	game.start();

	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
};

window.onresize = function () {
	if (!game) return;
	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
};