import { describe, it, expect, beforeEach } from 'vitest';
import { Timer } from '../../src/utils/Timer.js';

describe('Timer', () => {
  let timer;

  beforeEach(() => {
    timer = new Timer();
  });

  it('初始狀態：elapsedMs = 0，isRunning = false', () => {
    expect(timer.elapsedMs).toBe(0);
    expect(timer.isRunning).toBe(false);
  });

  it('start() 後 isRunning 為 true', () => {
    timer.start();
    expect(timer.isRunning).toBe(true);
  });

  it('stop() 後 isRunning 為 false', () => {
    timer.start();
    timer.stop();
    expect(timer.isRunning).toBe(false);
  });

  it('tick() 在 isRunning = true 時累加 elapsedMs', () => {
    timer.start();
    timer.tick(1000);
    expect(timer.elapsedMs).toBe(1000);
    timer.tick(500);
    expect(timer.elapsedMs).toBe(1500);
  });

  it('tick() 在 isRunning = false 時不累加', () => {
    timer.tick(1000);
    expect(timer.elapsedMs).toBe(0);
  });

  it('stop() 後 tick() 不繼續累加', () => {
    timer.start();
    timer.tick(1000);
    timer.stop();
    timer.tick(1000);
    expect(timer.elapsedMs).toBe(1000);
  });

  it('reset() 將 elapsedMs 歸零，不影響 isRunning', () => {
    timer.start();
    timer.tick(1000);
    timer.reset();
    expect(timer.elapsedMs).toBe(0);
    expect(timer.isRunning).toBe(true);
  });

  it('reset() 在停止狀態下 isRunning 仍為 false', () => {
    timer.tick(1000);
    timer.reset();
    expect(timer.elapsedMs).toBe(0);
    expect(timer.isRunning).toBe(false);
  });

  it('format() 輸出格式 mm:ss.SSS', () => {
    timer.start();
    timer.tick(83456);
    expect(timer.format()).toBe('01:23.456');
  });

  it('format() 在 0ms 時輸出 00:00.000', () => {
    expect(timer.format()).toBe('00:00.000');
  });

  it('format() 超過一分鐘正確格式化', () => {
    timer.start();
    timer.tick(65000);
    expect(timer.format()).toBe('01:05.000');
  });
});
