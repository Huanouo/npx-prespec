# 資料模型：第三人稱賽車遊戲

**分支**: `001-third-person-racing-game`  
**日期**: 2026-03-13  
**依賴**: research.md 完成

---

## 實體一覽

```
Car ──── LapTracker
 │
 ├── InputState
 └── (Three.js Object3D)

Track ──── Waypoint[]
Camera (ThirdPersonCamera) ──> Car
HUD ──> Car + LapTracker
```

---

## Car（賽車）

**職責**: 管理賽車的物理狀態（位置、速度、旋轉）及 Three.js 3D 網格。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `position` | `THREE.Vector3` | 賽車世界座標 |
| `velocity` | `number` | 當前車速（公尺/秒，純量，有正負）|
| `heading` | `number` | 偏航角（radians，Y 軸旋轉）|
| `maxSpeed` | `number` | 最大車速（預設 30 m/s）|
| `acceleration` | `number` | 加速度（預設 15 m/s²）|
| `brakeForce` | `number` | 煞車力（預設 25 m/s²）|
| `friction` | `number` | 自然減速（預設 8 m/s²）|
| `turnSpeed` | `number` | 最大轉向角速度（預設 1.8 rad/s）|
| `mesh` | `THREE.Group` | 車輛 3D 網格群組 |

**方法**:
- `update(delta: number, input: InputState): void` — 每幀更新物理狀態
- `reset(): void` — 重置至起跑位置

**驗證規則**:
- `velocity` 限制於 `[-maxSpeed * 0.4, maxSpeed]`（倒車速度上限 40%）
- `heading` 正規化至 `[0, 2π)`

**狀態轉換**:
```
IDLE → COUNTDOWN → RACING → FINISHED
```

---

## Track（賽道）

**職責**: 定義賽道幾何、提供最近中心線點查詢、出界碰撞回應。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `curve` | `THREE.CatmullRomCurve3` | 賽道中心線 |
| `halfWidth` | `number` | 賽道半寬（預設 6 公尺）|
| `segmentCount` | `number` | 曲線取樣點數（預設 200）|
| `mesh` | `THREE.Mesh` | 賽道視覺網格 |
| `startLine` | `THREE.Vector3` | 起跑線世界座標 |

**方法**:
- `getNearestT(pos: THREE.Vector3): number` — 回傳最近曲線參數 t ∈ [0,1)
- `constrainToTrack(car: Car): boolean` — 若出界則推回，回傳 `true` 表示出界
- `hasPassedStart(prevT: number, nextT: number): boolean` — 判斷是否越過起跑線

---

## LapTracker（計圈追蹤器）

**職責**: 記錄圈數、計算單圈時間、管理最佳圈速。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `currentLap` | `number` | 當前圈數（從 0 開始，第 1 圈完成後變為 1）|
| `lapTimes` | `number[]` | 已完成各圈時間（秒）|
| `bestLap` | `number \| null` | 最佳單圈時間（null 表示尚無完圈）|
| `lapStartTime` | `number` | 當前圈開始時間戳（秒）|
| `totalTime` | `number` | 累計遊戲時間（秒）|

**方法**:
- `update(delta: number): void` — 累計時間
- `onCrossStartLine(): void` — 越過起跑線時呼叫，計算圈速並更新最佳
- `getCurrentLapTime(): number` — 回傳當前圈已用時間
- `reset(): void` — 重置所有計圈資料

**驗證規則**:
- `currentLap` 只能遞增，不可回退
- `lapTimes.length === currentLap`

---

## InputState（輸入狀態）

**職責**: 封裝鍵盤輸入快照（每幀傳入 Car.update）。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `accelerate` | `boolean` | ↑ 或 W 鍵按下 |
| `brake` | `boolean` | ↓ 或 S 鍵按下 |
| `left` | `boolean` | ← 或 A 鍵按下 |
| `right` | `boolean` | → 或 D 鍵按下 |

---

## ThirdPersonCamera（第三人稱相機）

**職責**: 每幀計算相機世界位置與朝向，平滑跟隨賽車。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `camera` | `THREE.PerspectiveCamera` | Three.js 相機物件 |
| `offset` | `THREE.Vector3` | 相機相對賽車的本地偏移（預設 `(0, 3, -6)`）|
| `lerpFactor` | `number` | 位置插值係數（預設 `0.1`）|
| `lookAtOffset` | `THREE.Vector3` | 注視點偏移（預設車頭前方 `(0, 1, 3)`）|

**方法**:
- `update(car: Car): void` — 每幀計算並更新 camera 位置

---

## HUD（平視顯示器）

**職責**: 以 HTML overlay 顯示即時遊戲資訊（不使用 Three.js 2D）。

| UI 元素 | 資料來源 | 說明 |
|---------|---------|------|
| 速度表 | `car.velocity` | 顯示「XXX km/h」|
| 圈數 | `lapTracker.currentLap` | 顯示「Lap N」|
| 當前圈計時 | `lapTracker.getCurrentLapTime()` | 顯示「0:00.000」|
| 最佳圈速 | `lapTracker.bestLap` | 顯示「Best: 0:00.000」或「--:--.---」|

---

## GameState（遊戲狀態機）

**職責**: 協調整體遊戲流程。

| 狀態 | 說明 |
|------|------|
| `IDLE` | 初始載入，等待玩家按鍵 |
| `COUNTDOWN` | 3-2-1-GO! 倒數（3 秒）|
| `RACING` | 遊戲進行中 |
| `FINISHED` | 完成目標圈數，顯示成績 |

**轉換觸發**:
- `IDLE → COUNTDOWN`: 玩家按下任意控制鍵
- `COUNTDOWN → RACING`: 倒數結束
- `RACING → FINISHED`: 完成設定圈數（預設 3 圈）
