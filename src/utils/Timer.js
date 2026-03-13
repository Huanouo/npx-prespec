export class Timer {
  #elapsedMs = 0;
  #isRunning = false;

  get elapsedMs() {
    return this.#elapsedMs;
  }

  get isRunning() {
    return this.#isRunning;
  }

  start() {
    this.#isRunning = true;
  }

  stop() {
    this.#isRunning = false;
  }

  reset() {
    this.#elapsedMs = 0;
  }

  tick(deltaMs) {
    if (this.#isRunning) {
      this.#elapsedMs += deltaMs;
    }
  }

  format() {
    const totalMs = Math.floor(this.#elapsedMs);
    const ms = totalMs % 1000;
    const totalSec = Math.floor(totalMs / 1000);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }
}
