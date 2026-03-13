# 實作計畫：第三人稱賽車遊戲

**分支**: `001-third-person-racing-game` | **日期**: 2026-03-13 | **規格**: [spec.md](./spec.md)
**輸入**: `/specs/001-third-person-racing-game/spec.md`

## 摘要

建立可部署於 GitHub Pages 的純前端 3D 第三人稱賽車遊戲。使用 Three.js 渲染 3D 場景，玩家從賽車後方視角駕駛、完成計圈，並追求最佳單圈時間。技術方案採最小可執行實作（無框架、無後端、無建置工具依賴），以單一 HTML 入口點搭配原生 ES 模組提供。

## 技術背景

**語言／版本**: HTML5 + JavaScript (ES2020)  
**主要依賴**: Three.js r161（CDN 載入，零建置步驟）  
**儲存**: N/A（無持久化；最佳圈速僅存於記憶體）  
**測試**: Vitest（單元測試邏輯層）  
**目標平台**: 現代桌面瀏覽器（Chrome 90+、Firefox 88+、Edge 90+）；GitHub Pages 靜態托管  
**專案類型**: web-app（靜態前端，可部署至 GitHub Pages）  
**效能目標**: 60 FPS（桌面 GPU）、首次載入 < 3 秒（含 CDN Three.js）  
**限制**: 純靜態，無後端；不含音效；不含行動裝置支援  
**規模**: 單人遊戲；MVP 階段 1 條賽道、1 輛賽車

## Constitution Check

*關卡：Phase 0 研究前必須通過。Phase 1 設計後重新確認。*

| 原則 | 狀態 | 說明 |
|------|------|------|
| 語言一致性 | ✅ 通過 | 本計畫及所有衍生文件均使用繁體中文 |
| 精簡設計 | ✅ 通過 | 採最小可執行方案：零建置工具、CDN 載入 Three.js、單一 HTML 入口 |
| Git 可追溯 | ✅ 通過 | 每個階段前後可執行 `git status` 確認狀態 |
| TDD 預設 | ✅ 通過 | 邏輯層（物理計算、圈數判斷）採 Red→Green→Refactor；3D 渲染層以瀏覽器截圖驗收 |
| 規格保護 | ✅ 通過 | implement 階段不覆寫 spec.md、plan.md、tasks.md |
| 網站預設 | ✅ 通過 | 輸出為 `docs/` 靜態資產，可直接部署至 GitHub Pages |

## 專案結構

### 文件（本功能）

```text
specs/001-third-person-racing-game/
├── plan.md              # 本檔案（/speckit.plan 輸出）
├── spec.md              # 功能規格
├── research.md          # Phase 0 輸出（/speckit.plan 指令）
├── data-model.md        # Phase 1 輸出（/speckit.plan 指令）
├── quickstart.md        # Phase 1 輸出（/speckit.plan 指令）
├── contracts/           # Phase 1 輸出（/speckit.plan 指令）
└── tasks.md             # Phase 2 輸出（/speckit.tasks 指令）
```

### 原始碼（倉庫根目錄）

```text
docs/                    # GitHub Pages 靜態輸出根目錄
├── index.html           # 遊戲入口（唯一 HTML 檔案）
├── src/
│   ├── main.js          # 遊戲主迴圈與初始化
│   ├── car.js           # 賽車物理與渲染實體
│   ├── track.js         # 賽道幾何與碰撞邊界
│   ├── camera.js        # 第三人稱相機控制器
│   ├── hud.js           # HUD 覆蓋層（速度、圈數、計時）
│   ├── lap-tracker.js   # 計圈邏輯與最佳圈速記錄
│   └── input.js         # 鍵盤輸入處理
└── assets/              # 材質與模型（MVP 使用程序式幾何）

tests/
├── unit/
│   ├── lap-tracker.test.js   # 計圈邏輯單元測試
│   ├── car.test.js           # 賽車物理計算單元測試
│   └── input.test.js         # 輸入映射單元測試
└── vitest.config.js
```

**結構決策**: 採 Option 2 變體（靜態 Web App）。`docs/` 為 GitHub Pages 輸出根目錄；`src/` 放遊戲邏輯 ES 模組；`tests/` 放 Vitest 單元測試（僅涵蓋純邏輯層，不涵蓋 Three.js 渲染）。

## 複雜度追蹤

> 無 Constitution Check 違規，毋須填寫。

## Phase 1 設計後 Constitution Check 重新確認

| 原則 | 狀態 | 設計後驗證說明 |
|------|------|--------------|
| 語言一致性 | ✅ 通過 | spec.md、research.md、data-model.md、contracts/ui-contract.md、quickstart.md 全部使用繁體中文 |
| 精簡設計 | ✅ 通過 | 無多餘抽象：7 個模組各司其職，無 Repository/Service/Factory 等未證實抽象 |
| Git 可追溯 | ✅ 通過 | `git status` 確認所有新增檔案均列於 untracked，可追溯 |
| TDD 預設 | ✅ 通過 | data-model.md 已標明驗證規則；tests/ 結構已定義；contracts 已指定可測 API |
| 規格保護 | ✅ 通過 | tasks.md 尚未建立，implement 階段建立後不得覆蓋 spec.md / plan.md |
| 網站預設 | ✅ 通過 | docs/ 結構已在 data-model.md 與 quickstart.md 中明確定義，符合 GitHub Pages 要求 |
