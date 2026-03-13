# Car 模組介面契約

**模組路徑**：`src/entities/Car.js`

---

## 建構子

```javascript
new Car(config: CarConfig, trackStartPosition: Vector3, trackStartRotation: number)
```

| 參數 | 型別 | 說明 |
|------|------|------|
| `config` | `CarConfig` | 賽車靜態設定（來自 `data/cars.js`） |
| `trackStartPosition` | `Vector3` | 賽道起跑位置 |
| `trackStartRotation` | `number` | 起跑方向（弧度） |

---

## 公開屬性

| 屬性 | 型別 | 唯讀 | 說明 |
|------|------|------|------|
| `id` | `string` | ✅ | 賽車 ID |
| `position` | `Vector3` | ❌ | 當前世界座標 |
| `rotation` | `number` | ❌ | Y 軸旋轉角（弧度） |
| `velocity` | `number` | ❌ | 當前速度（純量） |
| `lapCount` | `number` | ❌ | 已完成圈數 |
| `lapTimes` | `number[]` | ❌ | 各圈完成時間（毫秒） |
| `isReset` | `boolean` | ❌ | 是否正在重置流程中 |
| `config` | `CarConfig` | ✅ | 靜態設定（唯讀） |

---

## 公開方法

### `accelerate(deltaTime: number): void`

套用加速輸入。

- 以 `config.acceleration * deltaTime` 增加 `velocity`
- `velocity` 上限為 `config.maxSpeed`

### `brake(deltaTime: number): void`

套用煞車輸入。

- 以 `config.acceleration * 0.6 * deltaTime` 減少 `velocity`
- `velocity` 下限為 `0`（不倒退）

### `steer(direction: -1 | 0 | 1, deltaTime: number): void`

套用轉向輸入。

- `direction = 1` 向左轉，`direction = -1` 向右轉，`direction = 0` 不轉
- 旋轉量為 `config.handling * direction * deltaTime`
- 僅在 `velocity > 0` 時生效

### `applyFriction(deltaTime: number): void`

套用慣性摩擦力（每幀自動呼叫）。

- 無輸入時 `velocity` 每幀減少固定摩擦量
- `velocity` 不低於 `0`

### `updatePosition(deltaTime: number): void`

根據當前 `velocity` 與 `rotation` 更新 `position`。

```
position.x += sin(rotation) * velocity * deltaTime * speedScale
position.z += cos(rotation) * velocity * deltaTime * speedScale
```

### `completeLap(lapTimeMs: number): void`

記錄完成一圈。

- 將 `lapTimeMs` 推入 `lapTimes`
- `lapCount += 1`

### `resetToPosition(position: Vector3, rotation: number): void`

重置賽車至指定位置與方向。

- 設定 `position`、`rotation`
- 將 `velocity` 歸零
- 將 `isReset` 設為 `false`

### `startReset(): void`

觸發邊界重置流程。

- 將 `isReset` 設為 `true`
- 將 `velocity` 歸零
- 不可在 `isReset = true` 期間再次觸發

---

## 行為規格（TDD 測試基礎）

```javascript
// 加速後速度應增加
car.accelerate(0.016);
expect(car.velocity).toBeGreaterThan(0);

// 速度不應超過 maxSpeed
for (let i = 0; i < 1000; i++) car.accelerate(0.016);
expect(car.velocity).toBeLessThanOrEqual(car.config.maxSpeed);

// 煞車後速度應減少（不低於 0）
car.velocity = 0.2;
car.brake(0.016);
expect(car.velocity).toBeGreaterThanOrEqual(0);
expect(car.velocity).toBeLessThan(0.2);

// 靜止時轉向無效
car.velocity = 0;
const prevRotation = car.rotation;
car.steer(1, 0.016);
expect(car.rotation).toBe(prevRotation);

// 完成圈數累計正確
car.completeLap(45000);
expect(car.lapCount).toBe(1);
expect(car.lapTimes).toEqual([45000]);

// 重置後速度歸零、位置更新
car.velocity = 0.5;
car.resetToPosition({ x: 0, y: 0, z: -10 }, 0);
expect(car.velocity).toBe(0);
expect(car.isReset).toBe(false);
```
