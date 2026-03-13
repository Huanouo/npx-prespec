# Track 模組介面契約

**模組路徑**：`src/entities/Track.js`

---

## 建構子

```javascript
new Track(config: TrackConfig)
```

| 參數 | 型別 | 說明 |
|------|------|------|
| `config` | `TrackConfig` | 賽道靜態設定（來自 `data/tracks.js`） |

---

## 公開屬性

| 屬性 | 型別 | 唯讀 | 說明 |
|------|------|------|------|
| `id` | `string` | ✅ | 賽道 ID |
| `totalLaps` | `number` | ✅ | 完賽所需圈數 |
| `startPosition` | `Vector3` | ✅ | 起跑位置 |
| `startRotation` | `number` | ✅ | 起跑方向（弧度） |
| `checkpoints` | `Checkpoint[]` | ✅ | 有序檢查點陣列 |
| `config` | `TrackConfig` | ✅ | 完整靜態設定 |

---

## 公開方法

### `isWithinBounds(position: Vector3): boolean`

判斷給定座標是否在賽道有效邊界內。

- 依 `config.boundaryPolygon` 執行點在多邊形內測試（point-in-polygon）
- 返回 `true` 代表在界內，`false` 代表已出界

### `checkCheckpoint(carPosition: Vector3, carLapProgress: CheckpointProgress): CheckpointResult`

檢查賽車是否觸發下一個檢查點。

- `carLapProgress` 記錄該圈已通過的最後一個 checkpoint 索引
- 若觸發下一順序的 checkpoint，返回 `{ triggered: true, checkpointId, isFinishLine }`
- 若未觸發，返回 `{ triggered: false }`
- 防止跳過中間 checkpoint（必須依序通過）

### `getNearestResetPosition(position: Vector3): { position: Vector3, rotation: number }`

取得距離給定座標最近的賽道起點或重置點。

- 用於邊界重置後將賽車放回正確位置與方向

---

## 行為規格（TDD 測試基礎）

```javascript
// 賽道內座標應回傳 true
expect(track.isWithinBounds({ x: 0, y: 0, z: 0 })).toBe(true);

// 賽道外座標應回傳 false
expect(track.isWithinBounds({ x: 9999, y: 0, z: 9999 })).toBe(false);

// 按順序通過檢查點應觸發
const progress = { lastCheckpoint: -1 };
const result = track.checkCheckpoint(checkpointPosition, progress);
expect(result.triggered).toBe(true);
expect(result.checkpointId).toBe(0);

// 跳過檢查點不應觸發圈數完成
const progress = { lastCheckpoint: 0 }; // 跳過 checkpoint 1
const result = track.checkCheckpoint(finishLinePosition, progress);
// lastCheckpoint 不是 maxCheckpointId - 1，不觸發完圈
expect(result.isFinishLine).toBe(false); // or triggered false
```
