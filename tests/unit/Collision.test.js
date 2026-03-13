import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Collision } from '../../src/physics/Collision.js';
import { Car } from '../../src/entities/Car.js';
import { Track } from '../../src/entities/Track.js';
import { CARS } from '../../src/data/cars.js';
import { TRACKS } from '../../src/data/tracks.js';

const OUTSIDE_POSITION = { x: 999, y: 0, z: 999 };
const INSIDE_POSITION = { x: 0, y: 0, z: 5 };

describe('Collision', () => {
  let car, track, collision, crashCalled;

  beforeEach(() => {
    const trackConfig = TRACKS[0];
    track = new Track(trackConfig);
    car = new Car(CARS[0], track.startPosition, track.startRotation);
    crashCalled = false;
    collision = new Collision(car, track, () => { crashCalled = true; });
  });

  it('checkBoundary 在賽道內返回 false', () => {
    car.position = { ...INSIDE_POSITION };
    const result = collision.checkBoundary();
    expect(result).toBe(false);
  });

  it('checkBoundary 在賽道外返回 true', () => {
    car.position = { ...OUTSIDE_POSITION };
    const result = collision.checkBoundary();
    expect(result).toBe(true);
  });

  it('checkBoundary 在界外觸發 car.startReset()', () => {
    car.position = { ...OUTSIDE_POSITION };
    collision.checkBoundary();
    expect(car.isReset).toBe(true);
  });

  it('checkBoundary 在界外觸發 onCrash 回呼', () => {
    car.position = { ...OUTSIDE_POSITION };
    collision.checkBoundary();
    expect(crashCalled).toBe(true);
  });

  it('checkBoundary 在界內不觸發 onCrash', () => {
    car.position = { ...INSIDE_POSITION };
    collision.checkBoundary();
    expect(crashCalled).toBe(false);
  });

  it('checkBoundary 已在 reset 狀態時不重複觸發 onCrash', () => {
    car.position = { ...OUTSIDE_POSITION };
    collision.checkBoundary(); // first call: triggers
    crashCalled = false;
    collision.checkBoundary(); // second call: already resetting
    expect(crashCalled).toBe(false);
  });
});
