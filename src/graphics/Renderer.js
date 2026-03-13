import * as THREE from 'three';
import {
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_INTENSITY,
  SKY_COLOR,
  GROUND_COLOR
} from '../game/GameConfig.js';

export class Renderer {
  constructor(container) {
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SKY_COLOR);
    this.scene.fog = new THREE.Fog(SKY_COLOR, 50, 200);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);

    this._setupLights();

    container.appendChild(this._renderer.domElement);
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, AMBIENT_LIGHT_INTENSITY);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, DIRECTIONAL_LIGHT_INTENSITY);
    dir.position.set(10, 20, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    this.scene.add(dir);
  }

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this._renderer.render(this.scene, this.camera);
  }

  addGroundPlane() {
    const geo = new THREE.PlaneGeometry(500, 500);
    const mat = new THREE.MeshLambertMaterial({ color: GROUND_COLOR });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);
    return plane;
  }

  createCarMesh(color = 0xff3300) {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.5, 2.2);
    const bodyMat = new THREE.MeshLambertMaterial({ color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.position.y = 0.25;
    group.add(body);

    const cabinGeo = new THREE.BoxGeometry(0.9, 0.45, 1.2);
    const cabinMat = new THREE.MeshLambertMaterial({ color: 0xaaccff });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 0.65, -0.1);
    group.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 12);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const wheelPositions = [
      [0.65, 0, 0.7],
      [-0.65, 0, 0.7],
      [0.65, 0, -0.7],
      [-0.65, 0, -0.7]
    ];
    for (const [x, y, z] of wheelPositions) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      group.add(wheel);
    }

    return group;
  }

  createTrackMesh(track) {
    const group = new THREE.Group();

    // Ground surface for track area
    const boundary = track.config.boundaryPolygon;
    if (boundary && boundary.length >= 3) {
      const shape = new THREE.Shape();
      shape.moveTo(boundary[0].x, boundary[0].z);
      for (let i = 1; i < boundary.length; i++) {
        shape.lineTo(boundary[i].x, boundary[i].z);
      }
      shape.closePath();

      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshLambertMaterial({ color: 0x555555 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      group.add(mesh);
    }

    // Track boundary walls
    this._addBoundaryWalls(group, track.config.boundaryPolygon);

    // Checkpoint markers
    for (const cp of track.checkpoints) {
      const markerGeo = new THREE.BoxGeometry(cp.width, 3, 0.3);
      const color = cp.isFinishLine ? 0xffff00 : 0x00ff88;
      const markerMat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.7 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(cp.position.x, 1.5, cp.position.z);
      group.add(marker);
    }

    return group;
  }

  _addBoundaryWalls(group, polygon) {
    if (!polygon || polygon.length < 3) return;
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % n];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const wallGeo = new THREE.BoxGeometry(length, 1, 0.3);
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set((a.x + b.x) / 2, 0.5, (a.z + b.z) / 2);
      wall.rotation.y = Math.atan2(dx, dz);
      wall.receiveShadow = true;
      group.add(wall);
    }
  }

  dispose() {
    window.removeEventListener('resize', this._resize);
    this._renderer.dispose();
  }
}
