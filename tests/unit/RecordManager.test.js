import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RecordManager } from '../../src/storage/RecordManager.js';

describe('RecordManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('isAvailable() 在正常環境返回 true', () => {
    expect(RecordManager.isAvailable()).toBe(true);
  });

  it('save() 儲存新成績返回 true', () => {
    const saved = RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 45000,
      totalRaceTimeMs: 140000
    });
    expect(saved).toBe(true);
  });

  it('getBest() 取得已存成績', () => {
    RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 45000,
      totalRaceTimeMs: 140000
    });
    const record = RecordManager.getBest('track_01', 'car_01');
    expect(record.bestLapTimeMs).toBe(45000);
    expect(record.totalRaceTimeMs).toBe(140000);
  });

  it('getBest() 不存在時返回 null', () => {
    expect(RecordManager.getBest('track_99', 'car_99')).toBeNull();
  });

  it('save() 較差成績不覆寫，返回 false', () => {
    RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 45000,
      totalRaceTimeMs: 140000
    });
    const saved2 = RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 50000,
      totalRaceTimeMs: 160000
    });
    expect(saved2).toBe(false);
    expect(RecordManager.getBest('track_01', 'car_01').totalRaceTimeMs).toBe(140000);
  });

  it('save() 更好成績覆寫，返回 true', () => {
    RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 45000,
      totalRaceTimeMs: 140000
    });
    const saved3 = RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 42000,
      totalRaceTimeMs: 130000
    });
    expect(saved3).toBe(true);
    expect(RecordManager.getBest('track_01', 'car_01').totalRaceTimeMs).toBe(130000);
  });

  it('getAll() 返回所有成績', () => {
    RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 45000, totalRaceTimeMs: 140000 });
    RecordManager.save('track_02', 'car_02', { bestLapTimeMs: 55000, totalRaceTimeMs: 170000 });
    const all = RecordManager.getAll();
    expect(Object.keys(all).length).toBe(2);
    expect(all['race_best_track_01_car_01']).toBeDefined();
    expect(all['race_best_track_02_car_02']).toBeDefined();
  });

  it('getAll() 無成績時返回空物件', () => {
    expect(RecordManager.getAll()).toEqual({});
  });

  it('save() localStorage 不可用時不拋出例外，返回 false', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    expect(() => RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 1,
      totalRaceTimeMs: 1
    })).not.toThrow();
    expect(RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 1,
      totalRaceTimeMs: 1
    })).toBe(false);
  });

  it('getBest() localStorage 不可用時返回 null', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    expect(RecordManager.getBest('track_01', 'car_01')).toBeNull();
  });

  it('儲存的成績包含 savedAt 時間戳', () => {
    RecordManager.save('track_01', 'car_01', {
      bestLapTimeMs: 45000,
      totalRaceTimeMs: 140000
    });
    const record = RecordManager.getBest('track_01', 'car_01');
    expect(record.savedAt).toBeDefined();
    expect(typeof record.savedAt).toBe('number');
  });
});
