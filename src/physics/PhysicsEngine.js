import * as CANNON from 'cannon-es';
import { GRAVITY } from '../game/GameConfig.js';

export class PhysicsEngine {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity = new CANNON.Vec3(0, GRAVITY, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this._bodies = [];
  }

  addCarBody(car) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1));
    const body = new CANNON.Body({ mass: 1 });
    body.addShape(shape);
    body.position.x = car.position.x;
    body.position.y = car.position.y;
    body.position.z = car.position.z;
    this.world.addBody(body);
    this._bodies.push(body);
    return body;
  }

  addTrackBody(track) {
    const shape = new CANNON.Plane();
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    this.world.addBody(body);
    this._bodies.push(body);
    return body;
  }

  step(deltaTime) {
    this.world.step(deltaTime);
  }

  getBodyPosition(body) {
    return {
      x: body.position.x,
      y: body.position.y,
      z: body.position.z
    };
  }

  getBodyRotation(body) {
    const euler = { y: 0 };
    if (body.quaternion && typeof body.quaternion.toEuler === 'function') {
      body.quaternion.toEuler(euler);
    }
    return euler.y;
  }
}
