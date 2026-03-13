# 資料模型：第三人稱賽車遊戲

**功能分支**：`001-third-person-racing-game`  
**產出日期**：2026-03-13  
**對應計畫**：[plan.md](./plan.md)

---

## 實體定義

### 1. Car（賽車）

代表玩家可選擇的賽車，具有固定屬性與可變的執行期狀態。

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `id` | `string` | 唯一識別碼（如 `car_01`） | 必填，全局唯一 |
| `name` | `string` | 顯示名稱（繁體中文） | 必填，非空 |
| `thumbnailUrl` | `string` | 縮圖路徑 | 必填 |
| `maxSpeed` | `number` | 最高速度上限（單位：遊戲內單位/秒） | > 0 |
| `acceleration` | `number` | 加速度係數 | > 0 |
| `handling` | `number` | 操控性係數（轉向靈敏度） | > 0 |
| `modelUrl` | `string` | 3D 模型路徑（.glb） | 必填 |

**執行期狀態（CarState，遊戲中追蹤）**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `position` | `Vector3` | 當前世界座標 |
| `rotation` | `number` | Y 軸旋轉角（弧度） |
| `velocity` | `number` | 當前速度（純量） |
| `lapCount` | `number` | 已完成圈數（0 起算） |
| `lapTimes` | `number[]` | 各圈完成時間（毫秒） |
| `isReset` | `boolean` | 是否正在執行邊界重置流程 |
| `resetTimer` | `number` | 距離重置完成的剩餘秒數（0～3） |

**驗證規則**：
- `lapCount` 達到賽道設定的 `totalLaps` 時，觸發完賽事件
- `isReset` 為 `true` 時，玩家輸入無效，賽車方向自動對齊賽道

---

### 2. Track（賽道）

代表可選擇的賽道場景，包含佈局定義與邊界條件。

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `id` | `string` | 唯一識別碼（如 `track_01`） | 必填，全局唯一 |
| `name` | `string` | 顯示名稱（繁體中文） | 必填，非空 |
| `thumbnailUrl` | `string` | 縮圖路徑 | 必填 |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | 難度標示 | 必填 |
| `totalLaps` | `number` | 完賽所需圈數 | > 0，預設 3 |
| `startPosition` | `Vector3` | 起跑位置座標 | 必填 |
| `startRotation` | `number` | 起跑方向（弧度） | 必填 |
| `checkpoints` | `Checkpoint[]` | 圈數計算用檢查點陣列（有序） | 至少 1 個 |
| `boundaryPolygon` | `Vector2[]` | 賽道有效區域多邊形（俯視圖） | 至少 3 點 |
| `modelUrl` | `string` | 3D 場景模型路徑（.glb） | 必填 |

**Checkpoint 結構**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `number` | 順序索引（0 起算） |
| `position` | `Vector3` | 檢查點中心座標 |
| `width` | `number` | 觸發寬度 |
| `isFinishLine` | `boolean` | 是否為起終點線 |

**驗證規則**：
- 賽車通過所有 `checkpoints` 且最後通過 `isFinishLine = true` 的檢查點，方可計為完成一圈
- 若賽車位置不在 `boundaryPolygon` 範圍內，觸發邊界重置
- 第 0 個 checkpoint 必須為 `isFinishLine = true`（起終點線）

---

### 3. Record（成績紀錄）

代表玩家在特定賽道、特定賽車組合下的個人最佳完賽時間。

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `trackId` | `string` | 關聯賽道 ID | 必填 |
| `carId` | `string` | 關聯賽車 ID | 必填 |
| `bestLapTimeMs` | `number` | 最快單圈時間（毫秒） | > 0 |
| `totalRaceTimeMs` | `number` | 最佳完賽時間（毫秒） | > 0 |
| `savedAt` | `number` | 儲存時間戳（Unix ms） | 自動填入 |

**儲存格式**（localStorage key/value）：
```
key:   race_best_{trackId}_{carId}
value: JSON.stringify({ bestLapTimeMs, totalRaceTimeMs, savedAt })
```

**驗證規則**：
- 只在新成績優於既有成績時才覆寫（`totalRaceTimeMs` 為主要比較依據）
- localStorage 不可用時，捕捉例外並以非阻斷方式通知玩家

---

### 4. RaceSession（賽局）

代表單次賽局的執行期狀態，不持久化。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `phase` | `GamePhase` | 當前遊戲階段 |
| `selectedCar` | `Car` | 本局選擇的賽車設定 |
| `selectedTrack` | `Track` | 本局選擇的賽道設定 |
| `carState` | `CarState` | 賽車執行期狀態 |
| `elapsedTimeMs` | `number` | 賽局經過時間（毫秒） |
| `currentLapStartMs` | `number` | 當前圈起始時間戳 |
| `countdownValue` | `number` | 倒數值（3, 2, 1, 0） |

---

## 狀態機

### GamePhase（遊戲階段）

```
menu → carSelection → trackSelection → countdown → racing → paused → finished
                                                         ↑         |
                                                         └─────────┘ (重試回到 countdown)
finished → menu（返回主選單）
paused → racing（繼續）
paused → countdown（重試，重置 carState）
paused → menu（返回主選單）
```

| 階段 | 說明 |
|------|------|
| `menu` | 主選單（開始遊戲、查看紀錄、離開） |
| `carSelection` | 賽車選擇畫面 |
| `trackSelection` | 賽道選擇畫面 |
| `countdown` | 3 秒倒數（賽車不可移動） |
| `racing` | 賽局進行中 |
| `paused` | 暫停（繼續／重試／返回主選單） |
| `finished` | 完賽（顯示成績，可重試或返回選單） |

---

## 實體關係圖

```
Car (資料) ─────────────────────┐
                                 ├─→ RaceSession (執行期)
Track (資料) ────────────────────┘
                  │
                  └─→ Record (持久化，1 筆 per trackId+carId)
```

- `Car` 與 `Track` 為靜態設定資料（`data/cars.js`、`data/tracks.js`）
- `RaceSession` 持有執行期快照，賽局結束後依成績更新 `Record`
- `Record` 以 localStorage 持久化，`RecordManager` 封裝讀寫邏輯

---

## 預設資料範例

### 賽車資料（data/cars.js）

```javascript
export const CARS = [
  {
    id: 'car_01',
    name: '閃電紅',
    thumbnailUrl: '/assets/thumbnails/car_01.png',
    maxSpeed: 0.6,
    acceleration: 0.015,
    handling: 0.04,
    modelUrl: '/assets/models/car_01.glb'
  },
  {
    id: 'car_02',
    name: '穩定藍',
    thumbnailUrl: '/assets/thumbnails/car_02.png',
    maxSpeed: 0.45,
    acceleration: 0.012,
    handling: 0.06,
    modelUrl: '/assets/models/car_02.glb'
  },
  {
    id: 'car_03',
    name: '均衡黃',
    thumbnailUrl: '/assets/thumbnails/car_03.png',
    maxSpeed: 0.52,
    acceleration: 0.013,
    handling: 0.05,
    modelUrl: '/assets/models/car_03.glb'
  }
];
```

### 賽道資料（data/tracks.js）

```javascript
export const TRACKS = [
  {
    id: 'track_01',
    name: '新手灣道',
    thumbnailUrl: '/assets/thumbnails/track_01.png',
    difficulty: 'easy',
    totalLaps: 3,
    startPosition: { x: 0, y: 0, z: -10 },
    startRotation: 0,
    // checkpoints 與 boundaryPolygon 在場景模型載入後計算
  },
  {
    id: 'track_02',
    name: '急彎山路',
    thumbnailUrl: '/assets/thumbnails/track_02.png',
    difficulty: 'hard',
    totalLaps: 3,
    startPosition: { x: 0, y: 0, z: -10 },
    startRotation: 0,
  }
];
```
