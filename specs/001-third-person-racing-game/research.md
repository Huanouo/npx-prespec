# 研究報告：第三人稱賽車遊戲

**分支**: `001-third-person-racing-game`  
**日期**: 2026-03-13  
**用途**: 解決 plan.md 技術背景中的不明確項目

---

## 研究問題 1：3D 渲染函式庫選擇

**問題**: 瀏覽器端 3D 遊戲應使用哪個渲染函式庫？

**決策**: Three.js r161（透過 CDN importmap 載入）

**理由**:
- Three.js 是最成熟的瀏覽器 3D 函式庫，文件完整、社群龐大
- 支援 importmap，可零建置步驟直接從 CDN 載入，完全符合「靜態 GitHub Pages 部署」需求
- 提供 PerspectiveCamera、BoxGeometry、MeshStandardMaterial、DirectionalLight 等高階 API，可快速組建賽車場景
- r161 為 2024 Q1 穩定版，CDN 版本已在 jsDelivr / unpkg 提供

**已評估替代方案**:
- **Babylon.js**：功能更全面但體積較大（~2MB gzip），對 MVP 而言過重
- **PlayCanvas Engine**：需要線上編輯器或 npm 建置，不符合零建置目標
- **原生 WebGL**：開發速度過慢，MVP 不適用

---

## 研究問題 2：第三人稱相機實作方式

**問題**: 如何實現平滑跟隨賽車的第三人稱相機？

**決策**: 使用線性插值（LERP）在每幀更新相機位置與朝向

**理由**:
- LERP 公式 `pos += (target - pos) * lerpFactor` 可在 10-30 行內實現
- 相機偏移量固定於賽車本地座標系（後方 +6、上方 +3），乘以賽車旋轉矩陣得世界座標
- `lerpFactor = 0.1`（每幀移動 10%）可產生自然的跟隨延遲感
- Three.js `camera.position.lerp()` 與 `camera.lookAt()` 原生支援

**已評估替代方案**:
- **Spring-Damper 物理相機**：效果更佳但計算複雜，MVP 不需要
- **固定視角**：不符合「第三人稱」需求

---

## 研究問題 3：賽車物理模型

**問題**: MVP 賽車應使用何種物理模型？

**決策**: 簡化運動學模型（arcade physics），不使用物理引擎

**理由**:
- 賽車遊戲 MVP 的「賽車感」來自手感調教，不需要嚴格剛體物理
- 模型：速度 ← 加速度積分；轉向角速度 ∝ 當前速度；側滑以固定摩擦系數簡化
- 無需引入 Cannon.js 或 Ammo.js，減少依賴與複雜度
- 邊界碰撞以 AABB 或距離中心線判斷即可

**已評估替代方案**:
- **Cannon.js**：需建置工具，與零建置目標衝突
- **Rapier (WASM)**：WASM 載入增加首次載入時間

---

## 研究問題 4：賽道設計方式

**問題**: 如何在程序中生成可碰撞的賽道？

**決策**: 使用 Three.js `CatmullRomCurve3` 定義賽道中心線，擠出為帶狀網格，以中心線距離判斷出界

**理由**:
- `CatmullRomCurve3` + `TubeGeometry` 可在 < 50 行程式碼內產生平滑賽道
- 碰撞判斷：計算賽車至最近曲線點的距離，超過半寬即「出界」，推回中心線方向
- 賽道可定義為 8 ～ 12 個控制點的封閉迴圈，MVP 快速可見

**已評估替代方案**:
- **導入 3D 模型（.glb/.gltf）**：需要外部建模工具，MVP 階段排除
- **平面矩形賽道**：視覺效果差，不符合賽車遊戲期待

---

## 研究問題 5：GitHub Pages 部署策略

**問題**: 如何以最小步驟部署至 GitHub Pages？

**決策**: 使用 `docs/` 目錄作為 GitHub Pages 根目錄，直接推送至 main/feature 分支

**理由**:
- GitHub Pages 支援倉庫根目錄或 `docs/` 子目錄作為靜態根，毋須 CI/CD
- 所有遊戲檔案置於 `docs/`，`index.html` 為入口
- importmap 指向 jsDelivr CDN 的 Three.js，無需打包

**已評估替代方案**:
- **gh-pages 分支 + GitHub Actions**：需 CI 設定，超出 MVP 所需
- **Vite 建置 + dist/**：引入建置工具，違反零建置目標

---

## 研究問題 6：測試策略

**問題**: 哪些部分需要測試？如何測試？

**決策**: 僅對純邏輯層（`lap-tracker.js`、`car.js` 物理計算、`input.js`）撰寫 Vitest 單元測試；Three.js 渲染層以目視驗收

**理由**:
- Three.js 渲染無法在 Node.js 環境（jsdom）中完整執行，強制測試需要複雜 mock
- 計圈邏輯、物理積分、輸入映射為純函數，可完整單元測試
- Vitest 設定最簡（`npm init`、`vitest.config.js` 約 5 行），與零建置工具的 `docs/` 靜態資產並存

**TDD 採用計畫**:
1. 先寫 `lap-tracker.test.js`（Red：圈數應從 0 開始、過終點線加 1）
2. 實作 `LapTracker` 類別（Green）
3. 重構（Refactor：封裝最佳圈速邏輯）
4. 對 `car.js` 物理積分重複上述流程

---

## 結論摘要

| 決策點 | 選擇 | 關鍵理由 |
|--------|------|---------|
| 3D 渲染 | Three.js r161（CDN） | 零建置、成熟、適合 GitHub Pages |
| 相機 | LERP 跟隨 | 簡單、效果夠好 |
| 物理 | Arcade（自製） | 無需物理引擎依賴 |
| 賽道 | CatmullRomCurve3 擠出 | 程序生成、無外部模型 |
| 部署 | docs/ + GitHub Pages | 零 CI、最快可見 |
| 測試 | Vitest（邏輯層） | 可測部分完整覆蓋，Three.js 以目視驗收 |

所有 NEEDS CLARIFICATION 項目已解決。可進入 Phase 1 設計。
