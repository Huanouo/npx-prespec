# UI 契約：第三人稱賽車遊戲

**分支**: `001-third-person-racing-game`  
**日期**: 2026-03-13  
**類型**: Web App UI 契約（玩家互動介面規格）

---

## 1. 遊戲入口頁面

**URL**: `/` 或 `index.html`（GitHub Pages 靜態根目錄）

### 1.1 DOM 結構

```html
<body>
  <!-- Three.js WebGL 渲染目標 -->
  <canvas id="game-canvas"></canvas>

  <!-- HUD 覆蓋層（CSS position: fixed / absolute）-->
  <div id="hud">
    <div id="hud-speed">0 km/h</div>
    <div id="hud-lap">Lap 1</div>
    <div id="hud-time">0:00.000</div>
    <div id="hud-best">Best: --:--.---</div>
  </div>

  <!-- 遊戲狀態訊息覆蓋層 -->
  <div id="overlay">
    <!-- IDLE 狀態 -->
    <div id="msg-start" class="overlay-message">按任意方向鍵開始</div>
    <!-- COUNTDOWN 狀態 -->
    <div id="msg-countdown" class="overlay-message hidden">3</div>
    <!-- FINISHED 狀態 -->
    <div id="msg-result" class="overlay-message hidden">
      <h2>完賽！</h2>
      <p id="result-total"></p>
      <p id="result-best"></p>
      <button id="btn-restart">再玩一次</button>
    </div>
  </div>
</body>
```

### 1.2 HUD 顯示格式

| 元素 ID | 格式 | 範例 |
|---------|------|------|
| `#hud-speed` | `{N} km/h` | `108 km/h` |
| `#hud-lap` | `Lap {N} / {total}` | `Lap 2 / 3` |
| `#hud-time` | `{M}:{SS}.{mmm}` | `1:23.456` |
| `#hud-best` | `Best: {M}:{SS}.{mmm}` 或 `Best: --:--.---` | `Best: 1:20.123` |

### 1.3 遊戲狀態顯示規則

| 狀態 | 顯示元素 | 隱藏元素 |
|------|---------|---------|
| `IDLE` | `#msg-start` | `#msg-countdown`, `#msg-result` |
| `COUNTDOWN` | `#msg-countdown`（顯示 3/2/1/GO!）| `#msg-start`, `#msg-result` |
| `RACING` | HUD 更新中 | 全部 overlay 訊息 |
| `FINISHED` | `#msg-result`（含成績）| `#msg-start`, `#msg-countdown` |

---

## 2. 鍵盤控制契約

| 鍵位 | 動作 | 對應 `InputState` 欄位 |
|------|------|----------------------|
| `ArrowUp` 或 `w` / `W` | 油門 | `accelerate = true` |
| `ArrowDown` 或 `s` / `S` | 煞車／倒車 | `brake = true` |
| `ArrowLeft` 或 `a` / `A` | 左轉 | `left = true` |
| `ArrowRight` 或 `d` / `D` | 右轉 | `right = true` |

**行為規格**:
- `keydown` 設為 `true`，`keyup` 設為 `false`
- 多鍵同時按下時，各欄位獨立更新（不互斥）
- 遊戲狀態為 `IDLE` 或 `FINISHED` 時，按下任意方向鍵觸發對應狀態轉換（見 GameState 契約）

---

## 3. 模組公開介面契約（ES 模組）

### `car.js` 公開 API

```javascript
// 建構子
new Car(scene: THREE.Scene): Car

// 方法
car.update(delta: number, input: InputState): void
car.reset(): void

// 唯讀屬性
car.position: THREE.Vector3   // 賽車世界座標（唯讀複本）
car.velocity: number          // 當前車速 m/s
car.heading: number           // 偏航角 radians
```

### `lap-tracker.js` 公開 API

```javascript
// 建構子
new LapTracker(): LapTracker

// 方法
lapTracker.update(delta: number): void
lapTracker.onCrossStartLine(): void
lapTracker.getCurrentLapTime(): number
lapTracker.reset(): void

// 唯讀屬性
lapTracker.currentLap: number
lapTracker.bestLap: number | null
lapTracker.totalTime: number
```

### `track.js` 公開 API

```javascript
// 建構子
new Track(scene: THREE.Scene): Track

// 方法
track.getNearestT(pos: THREE.Vector3): number
track.constrainToTrack(car: Car): boolean
track.hasPassedStart(prevT: number, nextT: number): boolean
```

### `camera.js` 公開 API

```javascript
// 建構子
new ThirdPersonCamera(camera: THREE.PerspectiveCamera): ThirdPersonCamera

// 方法
thirdPersonCamera.update(car: Car): void
```

### `input.js` 公開 API

```javascript
// 建構子（自動附掛 window 事件監聽）
new InputHandler(): InputHandler

// 唯讀屬性
inputHandler.state: InputState   // 當前幀輸入快照
```

---

## 4. 成績顯示契約（FINISHED 狀態）

```html
<p id="result-total">總時間：{M}:{SS}.{mmm}</p>
<p id="result-best">最佳圈速：{M}:{SS}.{mmm}</p>
```

按下 `#btn-restart` 後：
1. `GameState` 轉換至 `IDLE`
2. `LapTracker.reset()` 呼叫
3. `Car.reset()` 呼叫
4. HUD 重設為初始值
