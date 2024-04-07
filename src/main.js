let Game = class {
	
	// =================================================

		constructor () {
			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");

			this.running = false;
			this.ticks = 0;

			this.assets = {
				sounds: {
					hitsound: new Audio("assets/hitsound.mp3")
				}
			};

			// this.assets.sounds.hitsound.play();

			this.input = new Input();
			this.layout = new Layout([], this);
			
			(() => {
				let game = this;

				let l_main = this.layout.addLayer(0, "main");
				l_main.add( new Merc(10, 0, 10, 0) );
				l_main.add( new Bullet(500, 0, 500, 10, 10, 180 + 45, 0) );

				let l_gui = this.layout.addLayer(10, "GUI");
				l_gui.add( new HealthBar(
					2,
					game.canvas.height - 50,
					10,
					50,
					l_main.objects[0],
					function (game) {
						return 2;
					},
					function (game) {
						return game.canvas.height - 52;
					}
				) );
			})();
		}
		
	// =================================================
	
		async start () {
			this.running = true;
			this.loop();
		}
		
		stop () {
			this.running = false;
		}
	
	// =================================================

		loop () {
			if (!this.running) return;
			
			this.update ();
			this.render (this.context);

			window.requestAnimationFrame (() => this.loop());
		}

		update () {
			this.ticks++;
			this.layout.update(this);
		}
		
		render (context) {
			context.fillStyle = "cornflowerblue";
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);

			this.layout.render(context);
		}
	
	// =================================================
};

let game;

window.onload = function () {
	game = new Game();
	game.start();

	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
}

window.onresize = function () {
	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
}