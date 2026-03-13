export class Collision {
  #car;
  #track;
  #onCrash;

  constructor(car, track, onCrash) {
    this.#car = car;
    this.#track = track;
    this.#onCrash = onCrash || (() => {});
  }

  checkBoundary() {
    if (this.#car.isReset) return false;

    const withinBounds = this.#track.isWithinBounds(this.#car.position);
    if (!withinBounds) {
      this.#car.startReset();
      this.#onCrash();
      return true;
    }
    return false;
  }
}
