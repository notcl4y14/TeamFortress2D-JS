let Game = class {
	constructor () {
		this.canvas = document.getElementById("canvas");
		this.context = new Context(this.canvas);

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
				ammo_pack: loadImage("assets/ammo_pack.png"),
				medkit: loadImage("assets/medkit.png"),
				scattergun: loadImage("assets/scattergun.png")
			}
		};
		
		this.soundBuffer = [];

		this.settings = {
			volume: 0.40,
			fps_limit: 120
		}

		this.input = new Input();
		this.layout = new Layout([], this);
	};

	// =================================================

	load () {
		let game = this;

		let l_main = this.layout.addLayer(0, "main");
		l_main.add( new Merc( new Point3D(70, -100, 70), 0 ) );
		l_main.add( new Bullet (new Point3D(500, 0, 500), new Point2D(180 + 45, 0) ) );

		// Looks like 1 second is 60 ticks, although this might depend on performance
		// P.S. I used stopwatch to get that :P
		// P.P.S I decided to grab medkit (3600 ticks which should be 1 minute) the moment 7:58 AM started
		// Result: it did 1 minute, but with some more ticks. So it's 1 minute and a few seconds or milliseconds
		// Unless it's performance-dependant
		let second = 60;
		let minute = second * 60;

		l_main.add( new Spawner( new Point3D(500, 0, 200), new HealthPack( new Point3D(500, 0, 200) ), second * 20 ) );
		l_main.add( new Spawner( new Point3D(540, 0, 200), new AmmoPack( new Point3D(540, 0, 200) ), second * 20 ) );

		let l_gui = this.layout.addLayer(10, "GUI");
		l_gui.add( new HealthBar(
			new Point2D(2, game.canvas.height - 50),
			new Dim2D(10, 50),
			l_main.objects[0],
			(game) => 2,
			(game) => game.canvas.height - 52,
		) );
		l_gui.add( new AmmoHUD(
			new Point2D(40, game.canvas.height - 50),
			new Dim2D(10, 50),
			l_main.objects[0].item,
			(game) => 18,
			(game) => game.canvas.height - 52,
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

		// window.requestAnimationFrame (setInterval(() => this.loop(), this.fps_limit));
		window.requestAnimationFrame (() => this.loop());
	};

	update () {
		this.ticks++;
		this.layout.update(this);
	};
	
	render (context) {
		context.fillStyle = "rgb(0,50,100)";
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		this.layout.render(context);

		context.fillStyle = "white";
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