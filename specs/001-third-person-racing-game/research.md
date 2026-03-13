# 研究報告：第三人稱賽車遊戲

**功能分支**：`001-third-person-racing-game`  
**產出日期**：2026-03-13  
**對應計畫**：[plan.md](./plan.md)

---

## 研究問題與決策

### 1. 3D 圖形庫選擇

**決策**：採用 **Three.js v0.162**

**理由**：
- 社群最大、文件最完整，Stack Overflow 與 GitHub 資源豐富
- API 設計直觀，學習曲線平緩，適合快速建立 MVP
- 純前端靜態資源，無外部服務依賴，可直接部署至 GitHub Pages
- 支援 tree-shaking，最終包體積可控（核心約 350KB gzipped）
- 可搭配 Cannon-es 做物理，社群整合範例豐富
- 渲染管線透明，便於針對遊戲邏輯撰寫單元測試（mock 渲染層）

**考量替代方案**：
- **Babylon.js**：內建物理引擎與 GUI 系統，TypeScript 官方支援佳，但初始包較大（~3.5MB），社群相對較小，對本次規模屬過度工具
- **PlayCanvas / Needle Engine**：雲端編輯器依賴性強，部分功能需付費，GitHub Pages 靜態部署配置複雜，不符合精簡原則

---

### 2. 物理引擎選擇

**決策**：採用 **Cannon-es v0.20**（cannon.js 的現代維護分支）

**理由**：
- 輕量（~60KB gzipped），不影響初始載入效能
- 純 JavaScript 實作，不依賴 WebAssembly，部署與 debug 簡便
- 官方提供大量 Three.js 整合範例，整合成本低
- 足以實現車輛移動、碰撞偵測、邊界重置等本次需求
- TDD 友善：純 JS 類別易於單元測試，不需複雜 mock

**考量替代方案**：
- **Rapier（Rust → WASM）**：物理模擬精度更高、效能更好（2–3 倍），但 WASM 初始化複雜，包體積較大（~200KB gzipped），社群資源較少；本次僅需基本車輛物理，性價比不符
- **Ammo.js（Bullet → emscripten）**：包體積過大（~1.5MB gzipped），學習曲線陡峭，過度工程
- **自訂簡化物理**：無外部依賴，最易測試，但碰撞反應精度低，後期難擴展；Cannon-es 已足夠輕量，不值得自行維護物理層

---

### 3. 打包工具選擇

**決策**：採用 **Vite v5**

**理由**：
- 開發伺服器使用 ESBuild，冷啟動快（< 1 秒），HMR 即時生效
- `npm run build` 產出純靜態 `dist/`，可直接設定為 GitHub Pages 發佈目錄
- `base` 設定支援 GitHub Pages 子路徑（如 `/npx-prespec/`）
- 零額外設定即支援 Three.js、ES2022 模組、動態 import
- 官方提供 `vanilla` 模板，適合不使用框架的遊戲專案

**考量替代方案**：
- **Webpack 5**：生態最成熟，但設定複雜，開發建構速度較慢，對本次規模屬過度工具
- **Parcel**：零設定自動偵測，但社群支援逐漸減弱，外掛不足

---

### 4. 測試框架選擇

**決策**：採用 **Vitest v1**

**理由**：
- 專為 Vite 優化，共用同一設定檔，無須額外轉譯設定
- API 與 Jest 完全相容，學習成本低，遷移容易
- 原生支援 ES Module，不需 Babel，執行速度比 Jest 快 2–3 倍
- Watch 模式開箱即用，支援 TDD 即時回饋工作流
- 支援 `vi.mock()` 對 Three.js 渲染層進行 mock，使遊戲邏輯測試不依賴 DOM

**考量替代方案**：
- **Jest**：社群最大、文件最豐富，但需搭配 Babel 或額外 transform 設定才能處理 ES Module；Vite 專案搭配 Vitest 更一致
- **Playwright / Cypress（E2E）**：作為整合測試補充可行，但優先級在 TDD 單元測試建立後再考慮

---

### 5. 架構模式選擇

**決策**：採用**分層物件導向架構**（Game Loop + Entity 類別 + 簡單狀態機）

**理由**：
- 規模小（3 輛車、2 條賽道、單一玩家），完整 ECS 框架過度複雜
- 以 `Game` 類別持有遊戲迴圈（`requestAnimationFrame`），`GameState` 管理狀態機（`menu / countdown / racing / finished / paused`），`Car` 與 `Track` 各為獨立可測試類別
- 渲染層（`Renderer`、`CameraController`）與邏輯層（`Car`、`Physics`）分離，便於單元測試邏輯層而不啟動 WebGL 渲染
- 足夠簡單，可在 MVP 後逐步重構為 ECS

**考量替代方案**：
- **完整 ECS（Entity-Component-System）**：擴展性佳，但本次規模不需要，引入抽象層違反精簡原則
- **React/Vue 驅動**：UI 框架對遊戲 canvas 層無實質幫助，反而增加複雜度

---

### 6. GitHub Pages 部署策略

**決策**：使用 **GitHub Actions 自動部署**（`vite build` → `gh-pages` 分支）

**理由**：
- 每次推送 `main` 分支後自動執行測試 → 建構 → 部署，確保只有通過測試的版本上線
- 使用 `peaceiris/actions-gh-pages@v3` action，設定簡單
- `vite.config.js` 中設定 `base: '/npx-prespec/'` 對應 GitHub Pages 子路徑

**考量替代方案**：
- **手動上傳 `dist/`**：操作繁瑣，無法保證測試通過，不符合 CI 可追溯原則

---

### 7. 成績儲存策略

**決策**：使用 **localStorage**，key 格式為 `race_best_{trackId}_{carId}`

**理由**：
- 純靜態網站無後端，localStorage 是唯一可行的持久化方案
- 規格明確說明「清除瀏覽器資料後紀錄將消失」為預期行為，無需額外同步機制
- 讀寫封裝於 `RecordManager` 類別，便於 mock 與單元測試

**邊界情況處理**：
- localStorage 不可用（隱私模式、容量滿）時，捕捉例外並顯示提示訊息，遊戲正常運作（成績僅本局有效）

---

### 8. 音效策略

**決策**：選配功能，使用 **Web Audio API**，封裝於 `AudioManager`

**理由**：
- 規格明確指出「音效為選配功能，若瀏覽器自動播放政策阻擋時，遊戲仍可正常運作」
- 在首次用戶互動（按下開始遊戲）後才初始化 AudioContext，符合瀏覽器政策
- 若初始化失敗則靜默降級（silent degradation），不影響遊戲邏輯

---

## 解決所有待釐清項目

Phase 0 開始時無未解釐清項目。所有技術選項已依上述分析完成決策。

---

## 技術棧總覽

| 類別 | 選用方案 | 版本 |
|------|---------|------|
| 3D 圖形 | Three.js | v0.162 |
| 物理引擎 | Cannon-es | v0.20 |
| 打包工具 | Vite | v5 |
| 測試框架 | Vitest | v1 |
| 語言 | JavaScript ES2022 | — |
| 部署 | GitHub Pages + GitHub Actions | — |
| 成績儲存 | localStorage | — |
| 音效 | Web Audio API（選配） | — |
