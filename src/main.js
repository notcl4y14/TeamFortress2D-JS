let Game = class {
	
	// =================================================

		constructor () {
			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");

			this.running = false;
			this.ticks = 0;

			this.input = new Input();
			this.layout = new Layout([], this);
			
			(() => {
				let l_main = this.layout.addLayer(0, "main");
				l_main.add( new Merc(10, 0, 10, 0) );
				l_main.add( new Bullet(50, 0, 50, 0, 0) );
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
			context.fillStyle = "black";
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