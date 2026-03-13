import { describe, it, expect, beforeEach } from 'vitest';
import { Track } from '../../src/entities/Track.js';
import { TRACKS } from '../../src/data/tracks.js';

describe('Track', () => {
  let track;
  const config = TRACKS[0];

  beforeEach(() => {
    track = new Track(config);
  });

  it('初始化後屬性正確', () => {
    expect(track.id).toBe('track_01');
    expect(track.totalLaps).toBe(3);
    expect(track.startPosition).toEqual(config.startPosition);
    expect(track.startRotation).toBe(config.startRotation);
    expect(track.checkpoints).toBe(config.checkpoints);
    expect(track.config).toBe(config);
  });

  it('isWithinBounds() 賽道內座標返回 true', () => {
    expect(track.isWithinBounds({ x: 0, y: 0, z: 0 })).toBe(true);
  });

  it('isWithinBounds() 賽道外座標返回 false', () => {
    expect(track.isWithinBounds({ x: 9999, y: 0, z: 9999 })).toBe(false);
  });

  it('isWithinBounds() 邊界上的點返回 false（使用 polygon）', () => {
    expect(track.isWithinBounds({ x: -100, y: 0, z: 0 })).toBe(false);
  });

  it('checkCheckpoint() 按順序觸發第一個 checkpoint', () => {
    const progress = { lastCheckpoint: -1 };
    const cp = config.checkpoints[0];
    const result = track.checkCheckpoint(cp.position, progress);
    expect(result.triggered).toBe(true);
    expect(result.checkpointId).toBe(0);
  });

  it('checkCheckpoint() 跳過 checkpoint 不觸發', () => {
    const progress = { lastCheckpoint: -1 };
    const cp = config.checkpoints[2];
    const result = track.checkCheckpoint(cp.position, progress);
    expect(result.triggered).toBe(false);
  });

  it('checkCheckpoint() 位置不在 checkpoint 附近不觸發', () => {
    const progress = { lastCheckpoint: -1 };
    const result = track.checkCheckpoint({ x: 9999, y: 0, z: 9999 }, progress);
    expect(result.triggered).toBe(false);
  });

  it('checkCheckpoint() 完成 finishLine 時標記 isFinishLine', () => {
    // 通過所有非起終點 checkpoint 後，回到起終點線應觸發完圈
    const progress = { lastCheckpoint: config.checkpoints.length - 1 };
    const finishLine = config.checkpoints[0];
    const result = track.checkCheckpoint(finishLine.position, progress);
    expect(result.triggered).toBe(true);
    expect(result.isFinishLine).toBe(true);
  });

  it('getNearestResetPosition() 返回帶有 position 和 rotation 的物件', () => {
    const result = track.getNearestResetPosition({ x: 5, y: 0, z: 5 });
    expect(result).toHaveProperty('position');
    expect(result).toHaveProperty('rotation');
  });

  it('getNearestResetPosition() 返回最近的 checkpoint 位置', () => {
    const pos = config.checkpoints[0].position;
    const result = track.getNearestResetPosition({ x: pos.x + 1, y: 0, z: pos.z + 1 });
    expect(result.position).toBeDefined();
  });
});
