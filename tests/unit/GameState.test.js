import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/GameState.js';

describe('GameState', () => {
  let gs;

  beforeEach(() => {
    gs = new GameState();
  });

  it('初始狀態 phase = menu', () => {
    expect(gs.phase).toBe('menu');
    expect(gs.selectedCarId).toBeNull();
    expect(gs.selectedTrackId).toBeNull();
    expect(gs.countdownValue).toBe(3);
    expect(gs.elapsedTimeMs).toBe(0);
    expect(gs.currentLapStartMs).toBe(0);
  });

  it('selectCar() 設定 carId 並切換至 trackSelection', () => {
    gs.selectCar('car_01');
    expect(gs.selectedCarId).toBe('car_01');
    expect(gs.phase).toBe('trackSelection');
  });

  it('selectTrack() 設定 trackId 並切換至 countdown', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    expect(gs.selectedTrackId).toBe('track_01');
    expect(gs.phase).toBe('countdown');
    expect(gs.countdownValue).toBe(3);
  });

  it('tickCountdown() 倒數遞減', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown();
    expect(gs.countdownValue).toBe(2);
    gs.tickCountdown();
    expect(gs.countdownValue).toBe(1);
  });

  it('tickCountdown() 倒數完畢切換至 racing', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown();
    gs.tickCountdown();
    gs.tickCountdown();
    expect(gs.phase).toBe('racing');
    expect(gs.elapsedTimeMs).toBe(0);
    expect(gs.currentLapStartMs).toBe(0);
  });

  it('tickRace() 在 racing 狀態累加時間', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.tickRace(16);
    expect(gs.elapsedTimeMs).toBe(16);
    gs.tickRace(16);
    expect(gs.elapsedTimeMs).toBe(32);
  });

  it('tickRace() 非 racing 狀態無效', () => {
    gs.tickRace(16);
    expect(gs.elapsedTimeMs).toBe(0);
  });

  it('pause() 切換至 paused', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.pause();
    expect(gs.phase).toBe('paused');
  });

  it('pause() 在非 racing 狀態無效', () => {
    gs.pause();
    expect(gs.phase).toBe('menu');
  });

  it('resume() 切換回 racing', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.pause();
    gs.resume();
    expect(gs.phase).toBe('racing');
  });

  it('resume() 在非 paused 狀態無效', () => {
    gs.resume();
    expect(gs.phase).toBe('menu');
  });

  it('retry() 重置至 countdown 狀態', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.tickRace(10000);
    gs.retry();
    expect(gs.phase).toBe('countdown');
    expect(gs.elapsedTimeMs).toBe(0);
    expect(gs.currentLapStartMs).toBe(0);
    expect(gs.countdownValue).toBe(3);
  });

  it('finishRace() 切換至 finished', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.finishRace();
    expect(gs.phase).toBe('finished');
  });

  it('returnToMenu() 切換至 menu 並清空選擇', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.returnToMenu();
    expect(gs.phase).toBe('menu');
    expect(gs.selectedCarId).toBeNull();
    expect(gs.selectedTrackId).toBeNull();
    expect(gs.elapsedTimeMs).toBe(0);
    expect(gs.currentLapStartMs).toBe(0);
  });

  it('reset() 完整重置至初始狀態', () => {
    gs.selectCar('car_01');
    gs.selectTrack('track_01');
    gs.tickCountdown(); gs.tickCountdown(); gs.tickCountdown();
    gs.tickRace(5000);
    gs.reset();
    expect(gs.phase).toBe('menu');
    expect(gs.selectedCarId).toBeNull();
    expect(gs.selectedTrackId).toBeNull();
    expect(gs.elapsedTimeMs).toBe(0);
    expect(gs.countdownValue).toBe(3);
  });
});
