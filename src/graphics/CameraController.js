import * as THREE from 'three';
import { CAMERA_OFFSET, CAMERA_LERP_FACTOR } from '../game/GameConfig.js';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this._targetPosition = new THREE.Vector3();
    this._targetLookAt = new THREE.Vector3();
  }

  update(carMesh) {
    if (!carMesh) return;

    const offset = new THREE.Vector3(
      CAMERA_OFFSET.x,
      CAMERA_OFFSET.y,
      CAMERA_OFFSET.z
    );
    offset.applyEuler(new THREE.Euler(0, carMesh.rotation.y, 0));

    this._targetPosition.copy(carMesh.position).add(offset);
    this._targetLookAt.copy(carMesh.position).add(new THREE.Vector3(0, 0.5, 0));

    this.camera.position.lerp(this._targetPosition, CAMERA_LERP_FACTOR);
    this.camera.lookAt(this._targetLookAt);
  }

  snapTo(carMesh) {
    if (!carMesh) return;
    const offset = new THREE.Vector3(
      CAMERA_OFFSET.x,
      CAMERA_OFFSET.y,
      CAMERA_OFFSET.z
    );
    offset.applyEuler(new THREE.Euler(0, carMesh.rotation.y, 0));
    this.camera.position.copy(carMesh.position).add(offset);
    this.camera.lookAt(carMesh.position);
  }
}
