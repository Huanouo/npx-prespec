# InputManager 模組介面契約

**模組路徑**：`src/input/InputManager.js`

---

## 建構子

```javascript
new InputManager()
```

監聽 `window` 的 `keydown` 與 `keyup` 事件，追蹤目前按下的按鍵狀態。

---

## 公開方法

### `getInput(): InputSnapshot`

取得當前幀的輸入快照。

**返回型別 `InputSnapshot`**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `accelerate` | `boolean` | 上 / W 鍵按下 |
| `brake` | `boolean` | 下 / S 鍵按下 |
| `steerLeft` | `boolean` | 左 / A 鍵按下 |
| `steerRight` | `boolean` | 右 / D 鍵按下 |
| `pause` | `boolean` | Escape 鍵按下（此幀新觸發） |

### `dispose(): void`

移除所有事件監聽器（頁面離開或場景切換時呼叫）。

---

## 行為規格（TDD 測試基礎）

```javascript
// 模擬 keydown 事件
const manager = new InputManager();
window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
expect(manager.getInput().accelerate).toBe(true);

// 模擬 keyup 事件
window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp' }));
expect(manager.getInput().accelerate).toBe(false);

// WASD 對應相同行為
window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
expect(manager.getInput().accelerate).toBe(true);

// pause 僅在此幀新觸發為 true
window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
expect(manager.getInput().pause).toBe(true);
// 下一次 getInput 呼叫，pause 應恢復 false（one-shot）
expect(manager.getInput().pause).toBe(false);
```
