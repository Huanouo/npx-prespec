export class Track {
  #config;

  constructor(config) {
    this.#config = config;
  }

  get id() { return this.#config.id; }
  get totalLaps() { return this.#config.totalLaps; }
  get startPosition() { return this.#config.startPosition; }
  get startRotation() { return this.#config.startRotation; }
  get checkpoints() { return this.#config.checkpoints; }
  get config() { return this.#config; }

  /**
   * Point-in-polygon test using ray casting algorithm.
   * @param {Object} position - { x, y, z }
   * @returns {boolean}
   */
  isWithinBounds(position) {
    const polygon = this.#config.boundaryPolygon;
    if (!polygon || polygon.length < 3) return false;

    const px = position.x;
    const pz = position.z;
    let inside = false;
    const n = polygon.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = polygon[i].x, zi = polygon[i].z;
      const xj = polygon[j].x, zj = polygon[j].z;

      const intersect =
        zi > pz !== zj > pz &&
        px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }

  /**
   * Check if car is at the next checkpoint in sequence.
   * @param {Object} carPosition - { x, y, z }
   * @param {Object} carLapProgress - { lastCheckpoint: number }
   * @returns {{ triggered: boolean, checkpointId?: number, isFinishLine?: boolean }}
   */
  checkCheckpoint(carPosition, carLapProgress) {
    const checkpoints = this.#config.checkpoints;
    const numCheckpoints = checkpoints.length;
    const lastIdx = carLapProgress.lastCheckpoint;

    let nextIdx;
    if (lastIdx === -1) {
      // Before any checkpoint crossed: first checkpoint (finish/start line)
      nextIdx = 0;
    } else if (lastIdx === numCheckpoints - 1) {
      // All regular checkpoints passed: wrap to finish line (index 0)
      nextIdx = 0;
    } else {
      nextIdx = lastIdx + 1;
    }

    const nextCp = checkpoints[nextIdx];

    // If targeting the finish line (wrapping), ensure we came from the last checkpoint
    if (nextCp.isFinishLine && lastIdx !== -1 && lastIdx !== numCheckpoints - 1) {
      return { triggered: false };
    }

    const dist = Math.sqrt(
      Math.pow(carPosition.x - nextCp.position.x, 2) +
      Math.pow(carPosition.z - nextCp.position.z, 2)
    );

    if (dist <= nextCp.width) {
      carLapProgress.lastCheckpoint = nextIdx;
      return { triggered: true, checkpointId: nextCp.id, isFinishLine: nextCp.isFinishLine };
    }

    return { triggered: false };
  }

  /**
   * Returns the nearest checkpoint position for car reset.
   * @param {Object} position - { x, y, z }
   * @returns {{ position: Object, rotation: number }}
   */
  getNearestResetPosition(position) {
    const checkpoints = this.#config.checkpoints;
    let nearest = null;
    let minDist = Infinity;

    for (const cp of checkpoints) {
      const dist = Math.sqrt(
        Math.pow(position.x - cp.position.x, 2) +
        Math.pow(position.z - cp.position.z, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = cp;
      }
    }

    return {
      position: nearest ? nearest.position : this.#config.startPosition,
      rotation: this.#config.startRotation
    };
  }
}
