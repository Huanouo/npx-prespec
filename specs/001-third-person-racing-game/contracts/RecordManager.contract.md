# RecordManager 模組介面契約

**模組路徑**：`src/storage/RecordManager.js`

---

## 介面說明

`RecordManager` 為靜態工具類別，封裝 localStorage 讀寫邏輯，對外提供成績的讀取、儲存與查詢功能。所有方法均為靜態方法，不需實例化。

---

## 靜態方法

### `RecordManager.save(trackId: string, carId: string, result: RaceResult): boolean`

儲存一場完賽成績。

| 參數 | 型別 | 說明 |
|------|------|------|
| `trackId` | `string` | 賽道 ID |
| `carId` | `string` | 賽車 ID |
| `result` | `RaceResult` | `{ bestLapTimeMs: number, totalRaceTimeMs: number }` |

**行為**：
- 只在 `result.totalRaceTimeMs` 優於既有成績時才覆寫
- 成功儲存返回 `true`（含新紀錄），未更新返回 `false`
- localStorage 不可用時，捕捉例外，回傳 `false`，**不可拋出未處理例外**

### `RecordManager.getBest(trackId: string, carId: string): RaceResult | null`

取得指定組合的最佳成績。

- 不存在時返回 `null`
- localStorage 不可用時返回 `null`

### `RecordManager.getAll(): Record<string, RaceResult>`

取得所有成績紀錄。

- key 格式為 `race_best_{trackId}_{carId}`
- 返回空物件表示無成績

### `RecordManager.isAvailable(): boolean`

檢查 localStorage 是否可用（隱私模式偵測）。

- 以 try/catch 實際執行 `localStorage.setItem` 測試
- 返回 `true` 代表可用

---

## 行為規格（TDD 測試基礎）

```javascript
// 儲存新成績
const saved = RecordManager.save('track_01', 'car_01', {
  bestLapTimeMs: 45000,
  totalRaceTimeMs: 140000
});
expect(saved).toBe(true);

// 取得已存成績
const record = RecordManager.getBest('track_01', 'car_01');
expect(record.bestLapTimeMs).toBe(45000);

// 較差成績不覆寫
const saved2 = RecordManager.save('track_01', 'car_01', {
  bestLapTimeMs: 50000,
  totalRaceTimeMs: 160000
});
expect(saved2).toBe(false);
expect(RecordManager.getBest('track_01', 'car_01').totalRaceTimeMs).toBe(140000);

// 更好成績覆寫
const saved3 = RecordManager.save('track_01', 'car_01', {
  bestLapTimeMs: 42000,
  totalRaceTimeMs: 130000
});
expect(saved3).toBe(true);

// localStorage 不可用時不拋出例外
// （使用 vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error() })）
expect(() => RecordManager.save('track_01', 'car_01', { bestLapTimeMs: 1, totalRaceTimeMs: 1 })).not.toThrow();
```
