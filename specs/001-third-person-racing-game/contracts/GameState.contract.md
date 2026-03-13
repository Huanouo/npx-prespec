# GameState 模組介面契約

**模組路徑**：`src/game/GameState.js`

---

## 建構子

```javascript
new GameState()
```

初始化後 `phase = 'menu'`，所有計時器與成績清空。

---

## 公開屬性

| 屬性 | 型別 | 唯讀 | 說明 |
|------|------|------|------|
| `phase` | `GamePhase` | ❌ | 當前遊戲階段 |
| `selectedCarId` | `string \| null` | ❌ | 已選擇的賽車 ID |
| `selectedTrackId` | `string \| null` | ❌ | 已選擇的賽道 ID |
| `countdownValue` | `number` | ❌ | 倒數值（3→0） |
| `elapsedTimeMs` | `number` | ❌ | 賽局累積時間（毫秒） |
| `currentLapStartMs` | `number` | ❌ | 當前圈起始時間 |

---

## 公開方法

### `selectCar(carId: string): void`

設定選擇的賽車並切換至賽道選擇階段。

- `phase` 設為 `'trackSelection'`

### `selectTrack(trackId: string): void`

設定選擇的賽道並切換至倒數階段。

- `phase` 設為 `'countdown'`
- `countdownValue` 設為 `3`

### `tickCountdown(): void`

每秒呼叫一次，倒數值遞減。

- `countdownValue -= 1`
- 當 `countdownValue === 0` 時，`phase` 切換為 `'racing'`，`elapsedTimeMs` 歸零，`currentLapStartMs = 0`

### `tickRace(deltaMs: number): void`

每幀呼叫，更新賽局計時。

- 僅在 `phase === 'racing'` 時有效
- `elapsedTimeMs += deltaMs`

### `pause(): void`

暫停賽局。

- 僅在 `phase === 'racing'` 時有效
- `phase` 設為 `'paused'`

### `resume(): void`

繼續賽局。

- 僅在 `phase === 'paused'` 時有效
- `phase` 設為 `'racing'`

### `retry(): void`

重試（重置賽局至倒數狀態）。

- 重置 `elapsedTimeMs`、`currentLapStartMs`、`countdownValue = 3`
- `phase` 設為 `'countdown'`

### `finishRace(): void`

標記完賽。

- `phase` 設為 `'finished'`

### `returnToMenu(): void`

返回主選單並清空選擇狀態。

- `phase` 設為 `'menu'`
- `selectedCarId`、`selectedTrackId` 設為 `null`
- 清空計時器

### `reset(): void`

完整重置至初始狀態（相當於 `new GameState()`）。

---

## 行為規格（TDD 測試基礎）

```javascript
// 初始狀態
const gs = new GameState();
expect(gs.phase).toBe('menu');

// 選車後進入賽道選擇
gs.selectCar('car_01');
expect(gs.phase).toBe('trackSelection');

// 選道後進入倒數
gs.selectTrack('track_01');
expect(gs.phase).toBe('countdown');
expect(gs.countdownValue).toBe(3);

// 倒數完畢進入賽局
gs.tickCountdown(); // 2
gs.tickCountdown(); // 1
gs.tickCountdown(); // 0 → racing
expect(gs.phase).toBe('racing');

// 暫停
gs.pause();
expect(gs.phase).toBe('paused');

// 繼續
gs.resume();
expect(gs.phase).toBe('racing');
```
