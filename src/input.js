let Input = class {
	
	// =================================================

		constructor () {
			this.keys = {};
			this.mouse = {};
			
			this.mouseX = 0;
			this.mosueY = 0;

			window.onkeydown = (key) => {
				if (!this.keys[key.code]) {
					this.keys[key.code] = new Key(key.code, false);
				}

				this.keys[key.code].press();
			}

			window.onkeyup = (key) => {
				this.keys[key.code].unpress();
			}

			window.onmousedown = (mouse) => {
				this.mouse[mouse.button] = true;
			}

			window.onmouseup = (mouse) => {
				this.mouse[mouse.button] = false;
			}

			window.onmousemove = (mouse) => {
				this.mouseX = mouse.x;
				this.mouseY = mouse.y;
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

		isMouseDown (button) {
			return this.mouse[button] === true;
		}

		isMouseUp (button) {
			return this.mouse[button] == false;
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