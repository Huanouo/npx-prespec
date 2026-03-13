# Timer 模組介面契約

**模組路徑**：`src/utils/Timer.js`

---

## 建構子

```javascript
new Timer()
```

初始狀態：已停止，`elapsedMs = 0`。

---

## 公開屬性

| 屬性 | 型別 | 唯讀 | 說明 |
|------|------|------|------|
| `elapsedMs` | `number` | ✅ | 累積時間（毫秒） |
| `isRunning` | `boolean` | ✅ | 計時器是否運行中 |

---

## 公開方法

### `start(): void`

開始計時。`isRunning` 設為 `true`。

### `stop(): void`

停止計時。`isRunning` 設為 `false`。

### `reset(): void`

重置 `elapsedMs` 為 `0`。不改變 `isRunning` 狀態。

### `tick(deltaMs: number): void`

每幀呼叫。若 `isRunning = true`，則 `elapsedMs += deltaMs`。

### `format(): string`

格式化輸出計時結果。

- 格式：`mm:ss.SSS`（分：秒.毫秒）
- 範例：`01:23.456`

---

## 行為規格（TDD 測試基礎）

```javascript
const timer = new Timer();
expect(timer.elapsedMs).toBe(0);
expect(timer.isRunning).toBe(false);

timer.start();
timer.tick(1000);
expect(timer.elapsedMs).toBe(1000);

timer.stop();
timer.tick(1000);
expect(timer.elapsedMs).toBe(1000); // 停止後不累加

timer.reset();
expect(timer.elapsedMs).toBe(0);

// 格式化
timer.start();
timer.tick(83456);
expect(timer.format()).toBe('01:23.456');
```
