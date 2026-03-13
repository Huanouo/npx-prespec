import { COUNTDOWN_START } from './GameConfig.js';

/**
 * @typedef {'menu'|'carSelection'|'trackSelection'|'countdown'|'racing'|'paused'|'finished'} GamePhase
 */

export class GameState {
  phase = 'menu';
  selectedCarId = null;
  selectedTrackId = null;
  countdownValue = COUNTDOWN_START;
  elapsedTimeMs = 0;
  currentLapStartMs = 0;

  selectCar(carId) {
    this.selectedCarId = carId;
    this.phase = 'trackSelection';
  }

  selectTrack(trackId) {
    this.selectedTrackId = trackId;
    this.phase = 'countdown';
    this.countdownValue = COUNTDOWN_START;
  }

  tickCountdown() {
    if (this.phase !== 'countdown') return;
    this.countdownValue -= 1;
    if (this.countdownValue <= 0) {
      this.countdownValue = 0;
      this.phase = 'racing';
      this.elapsedTimeMs = 0;
      this.currentLapStartMs = 0;
    }
  }

  tickRace(deltaMs) {
    if (this.phase !== 'racing') return;
    this.elapsedTimeMs += deltaMs;
  }

  pause() {
    if (this.phase !== 'racing') return;
    this.phase = 'paused';
  }

  resume() {
    if (this.phase !== 'paused') return;
    this.phase = 'racing';
  }

  retry() {
    this.elapsedTimeMs = 0;
    this.currentLapStartMs = 0;
    this.countdownValue = COUNTDOWN_START;
    this.phase = 'countdown';
  }

  finishRace() {
    this.phase = 'finished';
  }

  returnToMenu() {
    this.phase = 'menu';
    this.selectedCarId = null;
    this.selectedTrackId = null;
    this.elapsedTimeMs = 0;
    this.currentLapStartMs = 0;
  }

  reset() {
    this.phase = 'menu';
    this.selectedCarId = null;
    this.selectedTrackId = null;
    this.countdownValue = COUNTDOWN_START;
    this.elapsedTimeMs = 0;
    this.currentLapStartMs = 0;
  }
}
