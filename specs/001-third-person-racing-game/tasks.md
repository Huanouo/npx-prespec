# Tasks: 第三人稱賽車遊戲

**Input**: Design documents from `/specs/001-third-person-racing-game/`
**Prerequisites**: plan.md ✅、spec.md ✅、research.md ✅、data-model.md ✅、contracts/ ✅、quickstart.md ✅

**Tests**: TDD 必須採用；每個 user story 的測試任務 MUST 先完成並確認失敗（Red），再進入實作（Green），最後重構（Refactor）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無未完成任務的相依性）
- **[Story]**: 任務所屬的使用者故事（US1、US2、US3、US4）
- 描述中包含精確檔案路徑

## Path Conventions

專案為單一前端專案，路徑慣例如下：
- 原始碼：`src/`（`game/`、`entities/`、`physics/`、`graphics/`、`input/`、`ui/`、`storage/`、`utils/`、`data/`、`styles/`）
- 測試：`tests/unit/`、`tests/integration/`
- 靜態資源：`public/assets/`
- 設定檔：倉庫根目錄（`vite.config.js`、`vitest.config.js`、`package.json`）

---

## Phase 1: Setup（專案初始化）

**Purpose**: 建立專案基礎結構與工具設定

- [ ] T001 以 Vite vanilla 模板初始化專案，安裝 three、cannon-es、vitest、@vitest/ui、jsdom 至 package.json，新增 dev/build/preview/test/test:watch/test:coverage 腳本
- [ ] T002 建立完整目錄結構：`src/{game,entities,physics,graphics,input,ui,storage,utils,data,styles}`、`tests/{unit,integration}`、`public/assets/{models,textures,thumbnails}`
- [ ] T003 [P] 設定 Vite GitHub Pages 部署路徑（base: '/npx-prespec/'）並加入 terser 最小化於 vite.config.js
- [ ] T004 [P] 設定 Vitest jsdom 測試環境（globals: true、coverage: v8）於 vitest.config.js

---

## Phase 2: Foundational（基礎先決條件）

**Purpose**: 所有使用者故事共用的靜態資料與全域常數，**Phase 2 完成前任何故事任務均不可開始**

**⚠️ CRITICAL**: 所有 User Story 均依賴本階段完成

- [ ] T005 [P] 建立 3 輛賽車靜態設定資料（閃電紅、穩定藍、均衡黃，含 id/name/thumbnailUrl/maxSpeed/acceleration/handling/modelUrl）於 src/data/cars.js
- [ ] T006 [P] 建立 2 條賽道靜態設定資料（新手灣道/easy、急彎山路/hard，含 id/name/thumbnailUrl/difficulty/totalLaps/startPosition/startRotation）於 src/data/tracks.js
- [ ] T007 [P] 建立全域常數（SPEED_SCALE、FRICTION_COEFF、RESET_DELAY_SEC、COUNTDOWN_START 等）於 src/game/GameConfig.js

**Checkpoint**: 基礎資料就緒，各 User Story 可平行開始

---

## Phase 3: User Story 1 - 單人計時賽（Priority: P1）🎯 MVP

**Goal**: 玩家可選擇賽車與賽道後以第三人稱視角進行計時賽，完成全部圈數後顯示成績並更新個人最佳紀錄。

**Independent Test**: 啟動遊戲 → 直接以預設賽車/賽道進入賽道 → 完成 3 圈 → 驗證計時器正確停止並顯示完賽時間與最快單圈時間，個人最佳紀錄寫入 localStorage。

### Tests for User Story 1（必做，TDD Red phase）⚠️

> **NOTE: 以下測試 MUST 先撰寫並確認失敗（測試找不到模組或斷言不通過），再進入實作**

- [ ] T008 [P] [US1] 依 Timer.contract.md 撰寫失敗單元測試（start/stop/reset/tick/format）於 tests/unit/Timer.test.js
- [ ] T009 [P] [US1] 依 Car.contract.md 撰寫失敗單元測試（accelerate/brake/steer/applyFriction/updatePosition/completeLap/resetToPosition/startReset）於 tests/unit/Car.test.js
- [ ] T010 [P] [US1] 依 Track.contract.md 撰寫失敗單元測試（isWithinBounds/checkCheckpoint/getNearestResetPosition）於 tests/unit/Track.test.js
- [ ] T011 [P] [US1] 依 GameState.contract.md 撰寫失敗單元測試（selectCar/selectTrack/tickCountdown/tickRace/pause/resume/retry/finishRace/returnToMenu/reset）於 tests/unit/GameState.test.js
- [ ] T012 [P] [US1] 依 RecordManager.contract.md 撰寫失敗單元測試（save/getBest/getAll/isAvailable，含 localStorage 不可用情境）於 tests/unit/RecordManager.test.js
- [ ] T013 [P] [US1] 依 InputManager.contract.md 撰寫失敗單元測試（方向鍵/WASD 輸入、Escape one-shot、dispose 事件清理）於 tests/unit/InputManager.test.js
- [ ] T014 [P] [US1] 撰寫 PhysicsEngine 失敗單元測試（world 初始化、addCar/addTrack、step、取得剛體位置與旋轉）於 tests/unit/PhysicsEngine.test.js

### Implementation for User Story 1

- [ ] T015 [P] [US1] 實作 Timer（start/stop/reset/tick/format，格式 mm:ss.SSS），使 T008 全部通過，於 src/utils/Timer.js
- [ ] T016 [P] [US1] 實作 Car 實體（accelerate/brake/steer/applyFriction/updatePosition/completeLap/resetToPosition/startReset），使 T009 全部通過，於 src/entities/Car.js
- [ ] T017 [P] [US1] 實作 Track 實體（isWithinBounds point-in-polygon、checkCheckpoint 有序偵測、getNearestResetPosition），使 T010 全部通過，於 src/entities/Track.js
- [ ] T018 [US1] 實作 GameState 狀態機（menu/carSelection/trackSelection/countdown/racing/paused/finished 轉換，所有公開方法），使 T011 全部通過，於 src/game/GameState.js
- [ ] T019 [P] [US1] 實作 RecordManager（save 比較覆寫、getBest、getAll、isAvailable，localStorage key 格式 race_best_{trackId}_{carId}），使 T012 全部通過，於 src/storage/RecordManager.js
- [ ] T020 [P] [US1] 實作 InputManager（keydown/keyup 監聽、getInput() 回傳 InputSnapshot、pause one-shot、dispose），使 T013 全部通過，於 src/input/InputManager.js
- [ ] T021 [US1] 實作 PhysicsEngine（Cannon-es World 包裝、addCarBody/addTrackBody、step(deltaTime)、同步 Three.js mesh 位置與旋轉），使 T014 全部通過，於 src/physics/PhysicsEngine.js
- [ ] T022 [US1] 實作 Renderer（Three.js WebGLRenderer 初始化、canvas 掛載至 DOM、resize 監聽、render(scene, camera)），於 src/graphics/Renderer.js
- [ ] T023 [US1] 實作 CameraController（第三人稱跟隨相機：固定後方偏移、平滑 lerp 追蹤、update(carPosition, carRotation)），於 src/graphics/CameraController.js
- [ ] T024 [US1] 實作 SceneSetup（Three.js Scene 建立、環境光與方向光、天空背景色、地板平面），於 src/graphics/SceneSetup.js
- [ ] T025 [US1] 實作 HUD（速度計數字、圈數顯示 X/N、即時計時器顯示，以 DOM overlay 實作），於 src/ui/HUD.js
- [ ] T026 [US1] 實作 Game 主迴圈（requestAnimationFrame 迴圈、整合 InputManager/PhysicsEngine/Car/Track/GameState/Timer/CameraController/Renderer/HUD，處理倒數→賽局→完賽流程，含 3 秒倒數鎖定輸入、完賽呼叫 RecordManager.save），於 src/game/Game.js
- [ ] T027 [US1] 建立應用程式入口 HTML（canvas 容器、HUD overlay、載入 main.js）於 src/index.html，並建立啟動點（實例化 Game 並啟動）於 src/main.js
- [ ] T028 [US1] 撰寫 Game 整合測試（mock Renderer/PhysicsEngine/Three.js，驗證 countdown→racing 轉換、tickRace 累計計時、completeLap 觸發 finishRace），於 tests/integration/Game.test.js

**Checkpoint**: User Story 1 完整可運作並可獨立測試。可執行 `npm test` 驗證，並以 `npm run dev` 啟動遊戲進行一場完整計時賽。

---

## Phase 4: User Story 2 - 賽車與賽道選擇（Priority: P2）

**Goal**: 玩家在開始遊戲前，可從多輛賽車與多條賽道中進行選擇，並看到各選項的名稱、縮圖與屬性評分。

**Independent Test**: 開啟遊戲 → 點選「開始遊戲」→ 驗證賽車清單顯示 3 輛賽車（名稱、縮圖、速度/操控評分）→ 選定賽車後驗證賽道清單顯示 2 條賽道（名稱、縮圖、難度）→ 確認後驗證正確進入對應賽道場景。

### Tests for User Story 2（必做，TDD Red phase）⚠️

- [ ] T029 [P] [US2] 撰寫 SelectionScreen 失敗單元測試（renderCarList 顯示正確數量與屬性、renderTrackList 顯示正確數量與難度、onCarSelected/onTrackSelected 回呼觸發、確認按鈕點擊後觸發 onConfirm 回呼並帶入已選 carId/trackId）於 tests/unit/SelectionScreen.test.js

### Implementation for User Story 2

- [ ] T030 [US2] 實作 SelectionScreen（賽車清單含縮圖/名稱/maxSpeed/handling 評分條、賽道清單含縮圖/名稱/難度標示、確認按鈕觸發 GameState.selectCar()/selectTrack()），使 T029 全部通過，於 src/ui/SelectionScreen.js
- [ ] T031 [US2] 在 Game.js 中整合 SelectionScreen 至狀態機（carSelection 與 trackSelection 階段顯示對應選擇畫面，確認後切換至 countdown），於 src/game/Game.js

**Checkpoint**: User Story 1 與 User Story 2 均可獨立運作。可從主流程完整走一遍「選車 → 選道 → 倒數 → 計時賽 → 完賽」。

---

## Phase 5: User Story 3 - 碰撞與賽道邊界處理（Priority: P3）

**Goal**: 賽車撞到邊界或衝出賽道時，給予視覺/音效回饋，並在 3 秒內自動重置賽車至最近起點，計時繼續累計。

**Independent Test**: 在賽局中故意駕車衝出賽道邊界 → 驗證播放碰撞音效、賽車速度歸零、3 秒後賽車自動重置至最近賽道起點且方向朝前 → 驗證計時器繼續累計，玩家可立即恢復操控。

### Tests for User Story 3（必做，TDD Red phase）⚠️

- [ ] T032 [P] [US3] 撰寫 Collision 失敗單元測試（checkBoundary 在界外返回 true、觸發 startReset 後 3 秒計時、resetCar 呼叫 Car.resetToPosition 並設定正確方向、碰撞時觸發 onCrash 回呼以便外部呼叫 AudioManager.playCrash）於 tests/unit/Collision.test.js

### Implementation for User Story 3

- [ ] T033 [US3] 實作 Collision（checkBoundary 呼叫 Track.isWithinBounds、觸發 Car.startReset()、倒計時 3 秒後呼叫 Car.resetToPosition(Track.getNearestResetPosition())），使 T032 全部通過，於 src/physics/Collision.js
- [ ] T034 [P] [US3] 實作 AudioManager（Web Audio API 初始化，首次用戶互動後啟動 AudioContext，playCrash/playLapComplete，失敗時靜默降級），於 src/utils/AudioManager.js
- [ ] T035 [US3] 在 Game.js 中整合 Collision 至主迴圈（每幀呼叫 checkBoundary、isReset 期間停用輸入、重置完成後恢復、撞擊時呼叫 AudioManager.playCrash），於 src/game/Game.js

**Checkpoint**: 碰撞與邊界重置完整可運作。故意衝出賽道後賽車可自動恢復，不需玩家手動重啟。

---

## Phase 6: User Story 4 - 主選單與遊戲暫停（Priority: P4）

**Goal**: 玩家可從主選單啟動遊戲、查看個人最佳紀錄，並在賽局中隨時暫停，選擇繼續、重試或返回主選單。完賽畫面顯示成績與最佳紀錄。

**Independent Test**: 開啟遊戲 → 驗證主選單顯示「開始遊戲」/「查看紀錄」/「離開」→ 賽局中按 Escape → 驗證遊戲凍結顯示暫停選單 → 測試繼續/重試/返回主選單三個選項均正確運作。

### Tests for User Story 4（必做，TDD Red phase）⚠️

- [ ] T036 [P] [US4] 撰寫 MenuScreen 失敗單元測試（顯示三個按鈕、onStartGame/onViewRecords/onQuit 回呼觸發、showRecords 正確顯示 RecordManager.getAll() 資料）於 tests/unit/MenuScreen.test.js
- [ ] T037 [P] [US4] 撰寫 PauseScreen 失敗單元測試（顯示繼續/重試/返回主選單、onResume/onRetry/onMenu 回呼觸發）於 tests/unit/PauseScreen.test.js

### Implementation for User Story 4

- [ ] T038 [P] [US4] 實作 MenuScreen（「開始遊戲」/「查看紀錄」/「離開」三個按鈕，查看紀錄呼叫 RecordManager.getAll() 列出所有最佳成績，localStorage 不可用時顯示提示），使 T036 全部通過，於 src/ui/MenuScreen.js
- [ ] T039 [P] [US4] 實作 PauseScreen（「繼續」/「重試」/「返回主選單」三個選項，對應 GameState.resume()/retry()/returnToMenu()），使 T037 全部通過，於 src/ui/PauseScreen.js
- [ ] T040 [US4] 實作 ResultsScreen（顯示完賽時間、最快單圈時間、個人最佳紀錄（若有更新顯示「新紀錄！」），提供「重試」與「返回主選單」按鈕），於 src/ui/ResultsScreen.js
- [ ] T041 [US4] 在 Game.js 中整合所有畫面至完整狀態機（menu → MenuScreen；paused → PauseScreen；finished → ResultsScreen；重試重載同一賽車/賽道計時器歸零），於 src/game/Game.js
- [ ] T042 [US4] 在 Game.js 中加入 visibilitychange 事件監聽，切換分頁或最小化視窗時自動呼叫 GameState.pause()，於 src/game/Game.js

**Checkpoint**: 完整遊戲體驗可運作。所有畫面（主選單、選擇、倒數、賽局、暫停、完賽）均正確切換，個人最佳紀錄正確持久化並顯示。

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: 跨故事的畫面優化、CI/CD 設定與最終驗收

- [ ] T043 [P] 建立全域樣式（全螢幕 canvas、HUD overlay 定位、選單畫面排版、暫停遮罩半透明、各畫面按鈕 hover 效果）於 src/styles/main.css
- [ ] T044 設定 GitHub Actions CI/CD 自動部署工作流程（push main 觸發：checkout → setup Node 18 → npm ci → npm test → npm run build → peaceiris/actions-gh-pages@v3 部署 dist/）於 .github/workflows/deploy.yml
- [ ] T045 依 quickstart.md 執行完整驗收情境：SC-001（30 秒完成選車進場）、SC-002（輸入延遲 < 100ms）、SC-005（完賽後 localStorage 正確更新、下次進入仍顯示），記錄結果並修正任何不符項目

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup（Phase 1）**：無相依，可立即開始
- **Foundational（Phase 2）**：依賴 Phase 1 完成，**封鎖所有 User Story**
- **User Story 1（Phase 3）**：依賴 Phase 2，為所有後續故事的基礎
- **User Story 2（Phase 4）**：依賴 Phase 2，可與 US1 平行（但 US1 完成後整合更順）
- **User Story 3（Phase 5）**：依賴 Phase 2 與 US1（需要 Car/Track/Game 迴圈）
- **User Story 4（Phase 6）**：依賴 Phase 2 與 US1（需要 GameState 完整狀態機）
- **Polish（Final Phase）**：依賴所有 User Story 完成

### User Story Dependencies

- **US1（P1）**：Phase 2 完成後可立即開始，為 MVP 核心
- **US2（P2）**：Phase 2 完成後可開始；與 US1 平行開發，完成後整合至 Game.js
- **US3（P3）**：US1 完成後才能開始（需要 Car.startReset()、Track.isWithinBounds()、Game 迴圈）
- **US4（P4）**：US1 完成後才能開始（需要 GameState 狀態機與完整 Game.js 骨架）

### Within Each User Story

1. 測試 MUST 先撰寫並確認失敗（Red）
2. 模組按以下順序實作：資料層 → 核心邏輯 → 物理/渲染 → UI → 整合
3. 每個模組實作完成後執行 `npm test` 確認對應測試通過（Green）
4. 完成後執行 `git status` 確認倉庫狀態

### Parallel Opportunities

- Phase 1 中 T003、T004 可平行執行
- Phase 2 中 T005、T006、T007 可同時平行執行
- US1 中 T008-T014（測試撰寫）可全部平行執行
- US1 中 T015-T017、T019-T020（獨立模組實作）可平行執行
- US2 的 T029 可與 US1 的 T008-T028 同時平行進行（不同檔案）；US1 完成後再執行 T030-T031 以確保 Game.js 整合順暢

---

## Parallel Example: User Story 1

```bash
# 測試撰寫階段（全部平行）
Task: T008 撰寫 Timer.test.js
Task: T009 撰寫 Car.test.js
Task: T010 撰寫 Track.test.js
Task: T011 撰寫 GameState.test.js
Task: T012 撰寫 RecordManager.test.js
Task: T013 撰寫 InputManager.test.js
Task: T014 撰寫 PhysicsEngine.test.js

# 獨立模組實作階段（可平行）
Task: T015 實作 Timer.js
Task: T016 實作 Car.js
Task: T017 實作 Track.js
Task: T019 實作 RecordManager.js
Task: T020 實作 InputManager.js
```

---

## Implementation Strategy

### MVP First（僅 User Story 1）

1. 完成 Phase 1：Setup
2. 完成 Phase 2：Foundational（**必須完成，封鎖所有故事**）
3. 完成 Phase 3：User Story 1（T008→T028）
4. **停下並驗證**：`npm test`、`npm run dev` 跑一場完整計時賽
5. 可部署並演示 MVP

### Incremental Delivery

1. Setup + Foundational → 基礎就緒
2. US1 → 可玩計時賽（MVP，可部署演示）
3. US2 → 加入選車/選道介面（增強體驗）
4. US3 → 加入碰撞回饋（提升遊戲手感）
5. US4 → 加入選單與暫停（完整遊戲框架）
6. 每個故事增加價值且不破壞前一個故事

### Parallel Team Strategy

有多位開發者時：

1. 團隊共同完成 Setup + Foundational
2. Foundational 完成後：
   - 開發者 A：User Story 1（核心遊戲迴圈）
   - 開發者 B：User Story 2（選擇介面）
   - 在 US1/US2 完成後：
   - 開發者 A：User Story 3（碰撞）
   - 開發者 B：User Story 4（選單/暫停）

---

## Notes

- [P] 標記 = 不同檔案、無未完成任務相依，可平行執行
- [Story] 標籤將任務對應至特定使用者故事以供追溯
- 每個使用者故事應可獨立完成並獨立測試
- 測試 MUST 在實作前撰寫並確認失敗（TDD Red phase）
- 每個任務或邏輯群組完成後 commit
- 在任何 Checkpoint 均可停下來獨立驗證該故事
- 避免：模糊任務、同一檔案衝突、破壞獨立性的跨故事相依
- implement 階段完成任務後 MUST 立即勾選對應核取方塊，不得延後補記
- 每個主要階段開始前與結束後 MUST 可執行 `git status` 並確認輸出狀態可讀
- implement 階段 MUST 禁止刪除或覆蓋既有規格文件（`spec.md`、`plan.md`、`tasks.md`）
