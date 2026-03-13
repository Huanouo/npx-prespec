import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameState } from '../../src/game/GameState.js';
import { Timer } from '../../src/utils/Timer.js';
import { Car } from '../../src/entities/Car.js';
import { Track } from '../../src/entities/Track.js';
import { RecordManager } from '../../src/storage/RecordManager.js';
import { CARS } from '../../src/data/cars.js';
import { TRACKS } from '../../src/data/tracks.js';

describe('Game Integration: countdown→racing transition', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('selectCar + selectTrack → correct state', () => {
    gameState.selectCar(CARS[0].id);
    expect(gameState.phase).toBe('trackSelection');
    gameState.selectTrack(TRACKS[0].id);
    expect(gameState.phase).toBe('countdown');
  });

  it('tickCountdown reduces countdownValue from 3 to 0, then transitions to racing', () => {
    gameState.selectCar(CARS[0].id);
    gameState.selectTrack(TRACKS[0].id);

    gameState.phase = 'countdown';
    gameState.countdownValue = 3;

    gameState.tickCountdown();
    expect(gameState.countdownValue).toBe(2);
    gameState.tickCountdown();
    expect(gameState.countdownValue).toBe(1);
    gameState.tickCountdown();
    expect(gameState.countdownValue).toBe(0);
    expect(gameState.phase).toBe('racing');
  });

  it('tickRace accumulates elapsed ms', () => {
    gameState.selectCar(CARS[0].id);
    gameState.selectTrack(TRACKS[0].id);
    gameState.phase = 'countdown';
    gameState.countdownValue = 1;
    gameState.tickCountdown();

    expect(gameState.phase).toBe('racing');
    gameState.tickRace(500);
    gameState.tickRace(500);
    expect(gameState.elapsedTimeMs).toBe(1000);
  });
});

describe('Game Integration: Timer with lap tracking', () => {
  let timer, lapTimer;

  beforeEach(() => {
    timer = new Timer();
    lapTimer = new Timer();
  });

  afterEach(() => {
    timer.stop();
    lapTimer.stop();
  });

  it('Timer start/tick/format works correctly', () => {
    timer.start();
    timer.tick(60000);
    expect(timer.format()).toBe('01:00.000');
  });

  it('Multiple lap timers accumulate independently', () => {
    timer.start();
    lapTimer.start();
    timer.tick(30000);
    lapTimer.tick(30000);
    const lapMs = lapTimer.elapsedMs;
    lapTimer.reset();
    lapTimer.start();
    timer.tick(25000);
    lapTimer.tick(25000);
    expect(Math.abs(lapMs - 30000)).toBeLessThan(10);
    expect(lapTimer.elapsedMs).toBeCloseTo(25000, -1);
  });
});

describe('Game Integration: completeLap triggers finishRace', () => {
  it('Car completeLap accumulates lapTimes', () => {
    const trackConfig = TRACKS[0];
    const track = new Track(trackConfig);
    const car = new Car(CARS[0], track.startPosition, track.startRotation);

    car.completeLap(30000);
    car.completeLap(28000);

    expect(car.lapCount).toBe(2);
    expect(car.lapTimes).toEqual([30000, 28000]);
  });

  it('RecordManager.save persists and returns isNewRecord=true for first record', () => {
    localStorage.clear();
    const isNew = RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 28000,
      totalRaceTimeMs: 88000
    });
    expect(isNew).toBe(true);
    const best = RecordManager.getBest('track_01', 'car_01');
    expect(best.bestLapTimeMs).toBe(28000);
  });

  it('RecordManager.save updates record if new time is better', () => {
    localStorage.clear();
    RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 28000, totalRaceTimeMs: 88000 });
    const isNew = RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 25000, totalRaceTimeMs: 78000 });
    expect(isNew).toBe(true);
    const best = RecordManager.getBest('track_01', 'car_01');
    expect(best.bestLapTimeMs).toBe(25000);
  });

  it('RecordManager.save does not update if new time is worse', () => {
    localStorage.clear();
    RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 25000, totalRaceTimeMs: 78000 });
    const isNew = RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 35000, totalRaceTimeMs: 105000 });
    expect(isNew).toBe(false);
    const best = RecordManager.getBest('track_01', 'car_01');
    expect(best.bestLapTimeMs).toBe(25000);
  });
});
