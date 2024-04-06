let Game = class {
	
	// =================================================

		constructor () {
			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");

			this.running = false;
			this.ticks = 0;

			this.layout = new Layout([], this);
			this.layout.addLayer(0, "main");
		}
		
	// =================================================
	
		start () {
			this.running = true;
			this.loop();
		}
		
		stop () {
			this.running = false;
		}
	
	// =================================================

		loop () {
			if (!this.running) return;
			
			this.update (this);
			this.render (this.context);

			window.requestAnimationFrame (() => this.loop());
		}

		update (game) {
			game.ticks++;
		}
		
		render (context) {
			context.fillStyle = "black";
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		}
	
	// =================================================
};

let game;

window.onload = function () {
	game = new Game();
	game.start();
}

window.onresize = function () {
	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
}