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
			
			this.soundBuffer = [];

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

		playSound (name) {
			let sound = this.assets.sounds[name];
			let index = this.soundBuffer.push( sound.cloneNode() ) - 1;
			this.soundBuffer[index].play();
			
			// this.soundBuffer[index].onplayed = () => {
			// 	game.soundBuffer.splice(index, 1);
			// }

			this.checkSound( this.soundBuffer[index] );
		}

		async checkSound (sound) {
			if (sound.played) {
				let index = this.soundBuffer.indexOf(sound);
				this.soundBuffer.splice(index, 1);
				return;
			}

			window.requestAnimationFrame(() => this.checkSound(sound));
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

			if (this.input.isMouseDown(0)) {
				let l_main = this.layout.getLayer("main");

				let mouseX = this.input.mouseX;
				let mouseY = this.input.mouseY;

				let x = mouseX;
				let y = 0;
				let z = mouseY;

				let speed = 10;
				let damage = 10;

				let angle = Math.atan2(
					l_main.objects[0].z - mouseY,
					l_main.objects[0].x - mouseX
				);

				angle = utils_ToDegrees(angle);
				
				let entity = new Bullet(x, y, z, speed, damage, angle, 0);

				l_main.add( entity );
			}

			this.layout.update(this);
		}
		
		render (context) {
			context.fillStyle = "cornflowerblue";
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);

			this.layout.render(context);

			context.fillStyle = "black";
			context.fillText("Left mouse button to spawn bullets", 500, 100);
			context.fillText("Be careful, this might be loud", 500, 110);
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