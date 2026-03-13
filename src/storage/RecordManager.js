const KEY_PREFIX = 'race_best_';

export class RecordManager {
  static isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static save(trackId, carId, result) {
    try {
      const key = `${KEY_PREFIX}${trackId}_${carId}`;
      const existing = RecordManager.getBest(trackId, carId);
      if (existing && existing.totalRaceTimeMs <= result.totalRaceTimeMs) {
        return false;
      }
      const record = {
        bestLapTimeMs: result.bestLapTimeMs,
        totalRaceTimeMs: result.totalRaceTimeMs,
        savedAt: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(record));
      return true;
    } catch {
      return false;
    }
  }

  static getBest(trackId, carId) {
    try {
      const key = `${KEY_PREFIX}${trackId}_${carId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static getAll() {
    try {
      const results = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KEY_PREFIX)) {
          try {
            results[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            // skip malformed entries
          }
        }
      }
      return results;
    } catch {
      return {};
    }
  }
}
