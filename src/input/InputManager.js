export class InputManager {
  #keys = new Set();
  #pauseTriggered = false;

  #onKeyDown;
  #onKeyUp;

  constructor() {
    this.#onKeyDown = (e) => {
      this.#keys.add(e.code);
      if (e.code === 'Escape') {
        this.#pauseTriggered = true;
      }
    };
    this.#onKeyUp = (e) => {
      this.#keys.delete(e.code);
    };

    window.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('keyup', this.#onKeyUp);
  }

  getInput() {
    const pause = this.#pauseTriggered;
    this.#pauseTriggered = false;

    return {
      accelerate: this.#keys.has('ArrowUp') || this.#keys.has('KeyW'),
      brake: this.#keys.has('ArrowDown') || this.#keys.has('KeyS'),
      steerLeft: this.#keys.has('ArrowLeft') || this.#keys.has('KeyA'),
      steerRight: this.#keys.has('ArrowRight') || this.#keys.has('KeyD'),
      pause
    };
  }

  dispose() {
    window.removeEventListener('keydown', this.#onKeyDown);
    window.removeEventListener('keyup', this.#onKeyUp);
    this.#keys.clear();
    this.#pauseTriggered = false;
  }
}
