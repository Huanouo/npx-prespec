import * as THREE from 'three';
import { GameState } from './GameState.js';
import { Car } from '../entities/Car.js';
import { Track } from '../entities/Track.js';
import { Renderer } from '../graphics/Renderer.js';
import { CameraController } from '../graphics/CameraController.js';
import { InputManager } from '../input/InputManager.js';
import { RecordManager } from '../storage/RecordManager.js';
import { Timer } from '../utils/Timer.js';
import { HUD } from '../ui/HUD.js';
import { MenuScreen } from '../ui/MenuScreen.js';
import { SelectionScreen } from '../ui/SelectionScreen.js';
import { PauseScreen } from '../ui/PauseScreen.js';
import { ResultsScreen } from '../ui/ResultsScreen.js';
import { RecordsScreen } from '../ui/RecordsScreen.js';
import { Collision } from '../physics/Collision.js';
import { AudioManager } from '../utils/AudioManager.js';
import { CARS } from '../data/cars.js';
import { TRACKS } from '../data/tracks.js';
import { RESET_DELAY_SEC, PHYSICS_STEP } from './GameConfig.js';

const CAR_COLORS = { car_01: 0xff3300, car_02: 0x0066ff, car_03: 0xffcc00 };

export class Game {
  constructor(container) {
    this._container = container;
    this._gameState = new GameState();
    this._renderer = new Renderer(container);
    this._camera = new CameraController(this._renderer.camera);
    this._input = new InputManager();
    this._timer = new Timer();
    this._lapTimer = new Timer();
    this._hud = new HUD();

    this._car = null;
    this._track = null;
    this._carMesh = null;
    this._trackMesh = null;
    this._lapProgress = { lastCheckpoint: 0 };
    this._resetTimer = 0;
    this._collision = null;
    this._audio = new AudioManager();

    this._onVisibilityChange = () => {
      if (document.hidden && this._gameState.phase === 'racing') {
        this._pauseGame();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    this._setupScreens();
    this._showMenu();
  }

  _setupScreens() {
    this._menuScreen = new MenuScreen(
      () => this._startCarSelection(),
      () => this._showRecords()
    );

    this._carSelectScreen = new SelectionScreen(
      'screen-car-select',
      '選擇賽車',
      CARS,
      (carId) => this._selectCar(carId),
      () => this._showMenu()
    );

    this._trackSelectScreen = new SelectionScreen(
      'screen-track-select',
      '選擇賽道',
      TRACKS,
      (trackId) => this._selectTrack(trackId),
      () => this._startCarSelection()
    );

    this._pauseScreen = new PauseScreen(
      () => this._resume(),
      () => this._retry(),
      () => this._returnToMenu()
    );

    this._resultsScreen = new ResultsScreen(
      () => this._retry(),
      () => this._returnToMenu()
    );

    this._recordsScreen = new RecordsScreen(
      () => this._showMenu()
    );
  }

  _hideAllScreens() {
    this._menuScreen.hide();
    this._carSelectScreen.hide();
    this._trackSelectScreen.hide();
    this._pauseScreen.hide();
    this._resultsScreen.hide();
    this._recordsScreen.hide();
    this._hud.hide();
  }

  _showMenu() {
    this._hideAllScreens();
    this._menuScreen.show();
  }

  _startCarSelection() {
    this._hideAllScreens();
    this._carSelectScreen.show();
  }

  _showRecords() {
    this._hideAllScreens();
    this._recordsScreen.show(CARS, TRACKS);
  }

  _selectCar(carId) {
    this._gameState.selectCar(carId);
    this._hideAllScreens();
    this._trackSelectScreen.show();
  }

  _selectTrack(trackId) {
    this._gameState.selectTrack(trackId);
    this._hideAllScreens();
    this._startRace();
  }

  _startRace() {
    const carConfig = CARS.find(c => c.id === this._gameState.selectedCarId);
    const trackConfig = TRACKS.find(t => t.id === this._gameState.selectedTrackId);

    const trackEntity = new Track(trackConfig);
    const carEntity = new Car(carConfig, trackEntity.startPosition, trackEntity.startRotation);

    this._car = carEntity;
    this._track = trackEntity;
    this._lapProgress = { lastCheckpoint: 0 };
    this._resetTimer = 0;
    this._collision = new Collision(carEntity, trackEntity, () => {
      this._audio.playCrash();
    });

    // Clear and rebuild scene
    while (this._renderer.scene.children.length > 0) {
      this._renderer.scene.remove(this._renderer.scene.children[0]);
    }
    this._renderer._setupLights();
    this._renderer.addGroundPlane();

    this._trackMesh = this._renderer.createTrackMesh(trackEntity);
    this._renderer.scene.add(this._trackMesh);

    const carColor = CAR_COLORS[carConfig.id] || 0xff3300;
    this._carMesh = this._renderer.createCarMesh(carColor);
    this._renderer.scene.add(this._carMesh);
    this._syncCarMesh();
    this._camera.snapTo(this._carMesh);

    this._timer.reset();
    this._lapTimer.reset();

    this._hud.show();
    this._startCountdown();
  }

  _startCountdown() {
    this._gameState.phase = 'countdown';
    this._gameState.countdownValue = 3;
    this._hud.update({
      speed: 0,
      lap: 0,
      totalLaps: this._track.totalLaps,
      time: '00:00.000',
      lapTime: null,
      countdown: this._gameState.countdownValue,
      phase: 'countdown'
    });

    const tick = () => {
      this._gameState.tickCountdown();
      this._hud.update({
        speed: 0,
        lap: this._car.lapCount,
        totalLaps: this._track.totalLaps,
        time: '00:00.000',
        lapTime: null,
        countdown: this._gameState.countdownValue,
        phase: 'countdown'
      });

      if (this._gameState.phase === 'racing') {
        this._timer.start();
        this._lapTimer.start();
        this._animate();
      } else {
        setTimeout(tick, 1000);
      }
    };

    setTimeout(tick, 1000);
  }

  _animate(prevTime) {
    if (this._gameState.phase !== 'racing') return;

    this._rafId = requestAnimationFrame((time) => {
      const delta = prevTime ? Math.min((time - prevTime) / 1000, 0.1) : PHYSICS_STEP;
      this._update(delta);
      this._renderer.render();
      this._animate(time);
    });
  }

  _update(deltaTime) {
    if (this._gameState.phase !== 'racing') return;

    const input = this._input.getInput();

    // Handle pause input
    if (input.pause) {
      this._pauseGame();
      return;
    }

    // Car controls
    if (input.accelerate) this._car.accelerate(deltaTime);
    if (input.brake) this._car.brake(deltaTime);
    else this._car.applyFriction(deltaTime);

    if (input.steerLeft) this._car.steer(-1, deltaTime);
    if (input.steerRight) this._car.steer(1, deltaTime);

    // Reset handling
    if (this._car.isReset) {
      this._resetTimer += deltaTime;
      if (this._resetTimer >= RESET_DELAY_SEC) {
        const resetPos = this._track.getNearestResetPosition(this._car.position);
        this._car.resetToPosition(resetPos.position, resetPos.rotation);
        this._resetTimer = 0;
        this._syncCarMesh();
      }
      return;
    }

    this._car.updatePosition(deltaTime);

    // Boundary check via Collision
    this._collision.checkBoundary();

    // Checkpoint / lap tracking
    const cpResult = this._track.checkCheckpoint(this._car.position, this._lapProgress);
    if (cpResult.triggered && cpResult.isFinishLine) {
      this._audio.playLapComplete();
      this._car.completeLap(this._lapTimer.elapsedMs);
      this._lapTimer.reset();
      this._lapTimer.start();

      if (this._car.lapCount >= this._track.totalLaps) {
        this._finishRace();
        return;
      }
      this._lapProgress.lastCheckpoint = 0;
    }

    // Timers
    this._timer.tick(deltaTime * 1000);
    this._lapTimer.tick(deltaTime * 1000);
    this._gameState.tickRace(deltaTime * 1000);

    // Sync mesh
    this._syncCarMesh();
    this._camera.update(this._carMesh);

    // HUD
    this._hud.update({
      speed: this._car.velocity,
      lap: this._car.lapCount,
      totalLaps: this._track.totalLaps,
      time: this._timer.format(),
      lapTime: this._lapTimer.format(),
      countdown: 0,
      phase: 'racing'
    });
  }

  _syncCarMesh() {
    if (!this._carMesh || !this._car) return;
    this._carMesh.position.set(
      this._car.position.x,
      this._car.position.y,
      this._car.position.z
    );
    this._carMesh.rotation.y = this._car.rotation;
  }

  _pauseGame() {
    this._gameState.pause();
    this._timer.stop();
    this._lapTimer.stop();
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._pauseScreen.show();
  }

  _resume() {
    this._gameState.resume();
    this._timer.start();
    this._lapTimer.start();
    this._pauseScreen.hide();
    this._animate();
  }

  _retry() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._gameState.retry();
    this._resultsScreen.hide();
    this._pauseScreen.hide();
    this._startRace();
  }

  _returnToMenu() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._timer.stop();
    this._timer.reset();
    this._lapTimer.stop();
    this._lapTimer.reset();
    this._gameState.returnToMenu();
    this._showMenu();
  }

  _finishRace() {
    this._timer.stop();
    this._lapTimer.stop();
    this._gameState.finishRace();

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    const lapTimes = this._car.lapTimes;
    const bestLapTimeMs = Math.min(...lapTimes);
    const totalRaceTimeMs = lapTimes.reduce((a, b) => a + b, 0);

    const isNewRecord = RecordManager.save(
      this._gameState.selectedTrackId,
      this._gameState.selectedCarId,
      { bestLapTimeMs, totalRaceTimeMs }
    );

    this._hud.hide();
    this._resultsScreen.show({ totalRaceTimeMs, bestLapTimeMs, lapTimes, isNewRecord });
  }

  dispose() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    this._input.dispose();
    this._audio.dispose();
    this._renderer.dispose();
  }
}
