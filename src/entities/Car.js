import { SPEED_SCALE, FRICTION_COEFF } from '../game/GameConfig.js';

export class Car {
  #config;
  #position;
  #rotation;
  #velocity;
  #lapCount;
  #lapTimes;
  #isReset;

  constructor(config, trackStartPosition, trackStartRotation) {
    this.#config = config;
    this.#position = { x: trackStartPosition.x, y: trackStartPosition.y, z: trackStartPosition.z };
    this.#rotation = trackStartRotation;
    this.#velocity = 0;
    this.#lapCount = 0;
    this.#lapTimes = [];
    this.#isReset = false;
  }

  get id() { return this.#config.id; }
  get config() { return this.#config; }

  get position() { return this.#position; }
  set position(v) { this.#position = v; }

  get rotation() { return this.#rotation; }
  set rotation(v) { this.#rotation = v; }

  get velocity() { return this.#velocity; }
  set velocity(v) { this.#velocity = v; }

  get lapCount() { return this.#lapCount; }
  set lapCount(v) { this.#lapCount = v; }

  get lapTimes() { return this.#lapTimes; }
  set lapTimes(v) { this.#lapTimes = v; }

  get isReset() { return this.#isReset; }
  set isReset(v) { this.#isReset = v; }

  accelerate(deltaTime) {
    this.#velocity = Math.min(
      this.#config.maxSpeed,
      this.#velocity + this.#config.acceleration * deltaTime
    );
  }

  brake(deltaTime) {
    this.#velocity = Math.max(
      0,
      this.#velocity - this.#config.acceleration * 0.6 * deltaTime
    );
  }

  steer(direction, deltaTime) {
    if (this.#velocity > 0) {
      this.#rotation += this.#config.handling * direction * deltaTime;
    }
  }

  applyFriction(deltaTime) {
    this.#velocity = Math.max(0, this.#velocity - FRICTION_COEFF * deltaTime);
  }

  updatePosition(deltaTime) {
    this.#position.x += Math.sin(this.#rotation) * this.#velocity * deltaTime * SPEED_SCALE;
    this.#position.z += Math.cos(this.#rotation) * this.#velocity * deltaTime * SPEED_SCALE;
  }

  completeLap(lapTimeMs) {
    this.#lapTimes.push(lapTimeMs);
    this.#lapCount += 1;
  }

  resetToPosition(position, rotation) {
    this.#position = { x: position.x, y: position.y, z: position.z };
    this.#rotation = rotation;
    this.#velocity = 0;
    this.#isReset = false;
  }

  startReset() {
    if (this.#isReset) return;
    this.#isReset = true;
    this.#velocity = 0;
  }
}
