# 實作計畫：第三人稱賽車遊戲

**分支**：`001-third-person-racing-game` | **日期**：2026-03-13 | **規格**：[spec.md](./spec.md)
**輸入**：功能規格來自 `/specs/001-third-person-racing-game/spec.md`

## 摘要

建立一款可在瀏覽器執行並部署至 GitHub Pages 的第三人稱 3D 賽車遊戲。玩家可選擇賽車與賽道後進行計時賽，鏡頭以第三人稱跟隨賽車。核心技術棧採用 Three.js（3D 渲染）、Cannon-es（物理引擎）、Vite（打包工具）、Vitest（TDD 測試），以最小可執行靜態前端方案實作全部 P1～P4 使用者故事。

## 技術背景

**語言／版本**：JavaScript ES2022 + HTML5 + CSS3  
**主要依賴**：Three.js v0.162（3D 渲染）、Cannon-es v0.20（物理引擎）、Vite v5（打包與開發伺服器）  
**儲存方案**：瀏覽器 localStorage（個人最佳成績持久化）  
**測試框架**：Vitest v1（單元與整合測試，TDD 工作流）  
**目標平台**：主流桌面瀏覽器（Chrome、Firefox、Edge、Safari），GitHub Pages 靜態部署  
**專案類型**：前端靜態網站（single-page application，純客戶端）  
**效能目標**：60 fps 穩定渲染；輸入延遲 < 100ms；賽局載入 < 30 秒  
**限制條件**：純靜態部署（無後端）；localStorage 不可用時（隱私模式）顯示提示訊息；音效在瀏覽器自動播放政策阻擋時仍可正常遊玩  
**規模範圍**：3 輛可選賽車、2 條可選賽道、單人單機、無多人連線

## 憲章檢核

*關卡：Phase 0 研究前必須通過。Phase 1 設計後再次檢核。*

**Phase 0 前初始檢核**：✅ 全部通過  
**Phase 1 後設計再檢核**：✅ 全部通過（契約、資料模型、快速入門均符合憲章）

| 憲章要求 | 狀態 | 說明 |
|----------|------|------|
| 語言一致性：計畫與衍生文件使用繁體中文 | ✅ 通過 | research.md、data-model.md、contracts/、quickstart.md 均以繁體中文撰寫 |
| 精簡設計：最小可執行實作優先 | ✅ 通過 | 採純前端靜態方案（Three.js + Cannon-es + Vite），無後端，無過度抽象 |
| Git 可追溯：進出階段前可執行 `git status` | ✅ 通過 | 每次提交前已確認倉庫狀態可讀 |
| TDD 預設：採用 Red → Green → Refactor | ✅ 通過 | 選用 Vitest；contracts/ 已定義各模組行為規格作為測試先行依據 |
| 規格保護：implement 不刪除／覆蓋既有文件 | ✅ 通過 | spec.md 未受影響；tasks.md 尚未建立，implement 階段需依規格保護規則執行 |
| 網站預設：可部署 GitHub Pages 的靜態前端 | ✅ 通過 | 以 Vite 打包，base 設定對應 GitHub Pages 子路徑，输出純靜態 `dist/` |

## 專案結構

### 規格文件（本功能）

```text
specs/001-third-person-racing-game/
├── plan.md              # 本文件（/speckit.plan 輸出）
├── research.md          # Phase 0 輸出（/speckit.plan）
├── data-model.md        # Phase 1 輸出（/speckit.plan）
├── quickstart.md        # Phase 1 輸出（/speckit.plan）
├── contracts/           # Phase 1 輸出（/speckit.plan）
└── tasks.md             # Phase 2 輸出（/speckit.tasks 指令，非本指令產生）
```

### 原始碼（倉庫根目錄）

```text
src/
├── index.html               # 應用程式入口 HTML
├── main.js                  # 應用程式啟動點
├── styles/
│   └── main.css             # 全域樣式
├── game/
│   ├── Game.js              # 主遊戲迴圈與協調器
│   ├── GameState.js         # 遊戲狀態管理（選單/倒數/賽中/完賽）
│   └── GameConfig.js        # 全域常數設定
├── entities/
│   ├── Car.js               # 賽車實體（位置、速度、屬性）
│   └── Track.js             # 賽道實體（邊界、檢查點、起跑點）
├── physics/
│   ├── PhysicsEngine.js     # Cannon-es 物理引擎包裝層
│   └── Collision.js         # 碰撞偵測與邊界重置
├── graphics/
│   ├── Renderer.js          # Three.js 渲染器設置
│   ├── CameraController.js  # 第三人稱相機跟隨邏輯
│   └── SceneSetup.js        # 場景燈光與背景初始化
├── input/
│   └── InputManager.js      # 鍵盤輸入管理（方向鍵 / WASD）
├── ui/
│   ├── HUD.js               # 遊戲內 HUD（速度計、圈數、計時器）
│   ├── MenuScreen.js        # 主選單（開始遊戲、查看紀錄、離開）
│   ├── SelectionScreen.js   # 賽車與賽道選擇畫面
│   ├── ResultsScreen.js     # 完賽成績畫面
│   └── PauseScreen.js       # 暫停選單
├── storage/
│   └── RecordManager.js     # localStorage 最佳成績讀寫
├── utils/
│   ├── Timer.js             # 計時器工具
│   └── AudioManager.js      # 音效播放（選配，符合自動播放政策）
└── data/
    ├── cars.js              # 3 輛賽車設定資料
    └── tracks.js            # 2 條賽道設定資料

tests/
├── unit/
│   ├── Car.test.js
│   ├── Track.test.js
│   ├── PhysicsEngine.test.js
│   ├── InputManager.test.js
│   ├── Timer.test.js
│   ├── RecordManager.test.js
│   └── GameState.test.js
└── integration/
    └── Game.test.js

public/
└── assets/
    ├── models/              # 3D 模型（.glb 格式）
    └── textures/            # 材質貼圖

vite.config.js               # Vite 打包設定（含 GitHub Pages base path）
vitest.config.js             # Vitest 測試設定
package.json
```

**結構決策**：採單一前端專案佈局（Option 1 變體），以 `src/` 為主體，依功能分層（遊戲邏輯、物理、渲染、輸入、UI、儲存、資料），無後端。`tests/` 與 `src/` 分離以維持清晰邊界。

## 複雜度追蹤

> **僅在憲章檢核有須說明的違規時填寫**

無需填寫。本次計畫所有決策均符合憲章要求，無例外情況。
