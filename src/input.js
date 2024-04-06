let Input = class {
	
	// =================================================

		constructor () {
			this.keys = {};
			this.mouse = {};

			window.onkeydown = (key) => {
				if (!this.keys[key.code]) {
					this.keys[key.code] = new Key(key.code, false);
				}

				this.keys[key.code].press();
			}

			window.onkeyup = (key) => {
				this.keys[key.code].unpress();
			}
		}
	
	// =================================================

		isKeyDown (key) {
			if (!this.keys[key]) return false;
			return this.keys[key].down;
		}

		isKeyUp (key) {
			if (!this.keys[key]) return true;
			return !this.keys[key].down;
		}

		isKeyPressed (key) {
			if (!this.keys[key]) return false;
			return this.keys[key].down && this.keys[key].held <= 1;
		}

	// =================================================

}

let Key = class {

	// =================================================

		constructor (code, down = false) {
			this.code = code;
			this.down = down;
			this.held = 0;
		}

	// =================================================

		async press () {
			this.down = true;
			this.press_count();
		}

		press_count () {
			if (!this.down) return;
			this.held++;
			window.requestAnimationFrame(() => this.press_count());
		}

		unpress () {
			this.down = false;
			this.held = 0;
		}

	// =================================================

}