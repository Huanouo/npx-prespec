import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PhysicsEngine } from '../../src/physics/PhysicsEngine.js';

vi.mock('cannon-es', () => {
  class Vec3 {
    constructor(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; }
    toEuler(result) { if (result) result.y = 0; return result || { y: 0 }; }
  }
  class Quaternion {
    constructor() { this.x = 0; this.y = 0; this.z = 0; this.w = 1; }
    toEuler(result) { if (result) result.y = 0; return result || { y: 0 }; }
  }
  class Body {
    constructor() {
      this.position = new Vec3();
      this.quaternion = new Quaternion();
      this.velocity = new Vec3();
      this.angularVelocity = new Vec3();
    }
    addShape() {}
  }
  class Box {}
  class Plane {}
  class NaiveBroadphase {}
  class World {
    constructor() {
      this.gravity = new Vec3();
      this.broadphase = null;
      this.bodies = [];
    }
    addBody(body) { this.bodies.push(body); }
    step() {}
  }
  return { Vec3, Quaternion, Body, Box, Plane, World, NaiveBroadphase };
});

describe('PhysicsEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new PhysicsEngine();
  });

  it('初始化建立 Cannon-es World', () => {
    expect(engine.world).toBeDefined();
  });

  it('addCarBody() 加入賽車剛體並返回 Body', () => {
    const car = { position: { x: 0, y: 0, z: 0 }, config: { maxSpeed: 0.6 } };
    const body = engine.addCarBody(car);
    expect(body).toBeDefined();
  });

  it('step() 不拋出例外', () => {
    expect(() => engine.step(1 / 60)).not.toThrow();
  });

  it('getBodyPosition() 返回剛體位置', () => {
    const car = { position: { x: 0, y: 0, z: 0 }, config: { maxSpeed: 0.6 } };
    const body = engine.addCarBody(car);
    const pos = engine.getBodyPosition(body);
    expect(pos).toHaveProperty('x');
    expect(pos).toHaveProperty('y');
    expect(pos).toHaveProperty('z');
  });

  it('getBodyRotation() 返回旋轉角', () => {
    const car = { position: { x: 0, y: 0, z: 0 }, config: { maxSpeed: 0.6 } };
    const body = engine.addCarBody(car);
    const rot = engine.getBodyRotation(body);
    expect(typeof rot).toBe('number');
  });
});
