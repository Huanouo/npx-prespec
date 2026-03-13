# 快速上手指南：第三人稱賽車遊戲

**分支**: `001-third-person-racing-game`  
**日期**: 2026-03-13

---

## 前置需求

| 工具 | 版本 | 說明 |
|------|------|------|
| Node.js | 18 LTS 以上 | 僅用於執行 Vitest 測試 |
| npm | 9 以上 | 隨 Node.js 附帶 |
| 現代瀏覽器 | Chrome 90+ / Firefox 88+ / Edge 90+ | 遊戲執行環境 |

> ⚠️ 遊戲本體**無需建置工具**。`node_modules` 僅供 Vitest 單元測試使用，不影響 `docs/` 靜態資產。

---

## 1. 取得原始碼

```bash
git clone https://github.com/Huanouo/npx-prespec.git
cd npx-prespec
git checkout 001-third-person-racing-game
```

---

## 2. 安裝測試依賴（選用）

```bash
npm install
```

---

## 3. 執行單元測試（TDD 驗證）

```bash
npm test
# 或
npx vitest
```

預期輸出：
```
✓ tests/unit/lap-tracker.test.js
✓ tests/unit/car.test.js
✓ tests/unit/input.test.js

Test Files  3 passed (3)
Tests       XX passed (XX)
```

---

## 4. 本地執行遊戲

由於使用 ES 模組，需透過 HTTP 伺服器（不可直接開啟 `file://`）。

### 方法 A：使用 Node.js 靜態伺服器（推薦）

```bash
npx serve docs
# 然後開啟 http://localhost:3000
```

### 方法 B：使用 Python（若已安裝）

```bash
cd docs
python3 -m http.server 8080
# 然後開啟 http://localhost:8080
```

### 方法 C：VS Code Live Server 擴充

1. 安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. 右鍵點擊 `docs/index.html` → **Open with Live Server**

---

## 5. 操作說明

| 鍵位 | 動作 |
|------|------|
| `↑` 或 `W` | 油門（加速）|
| `↓` 或 `S` | 煞車／倒車 |
| `←` 或 `A` | 左轉 |
| `→` 或 `D` | 右轉 |

**遊戲流程**：
1. 頁面載入後看到賽車場景，螢幕中央顯示「按任意方向鍵開始」
2. 按下方向鍵觸發 3-2-1-GO! 倒數
3. 倒數結束後開始計時，完成 3 圈後顯示成績
4. 按「再玩一次」重置遊戲

---

## 6. 部署至 GitHub Pages

### 方法 A：Repository Settings（最簡單）

1. 推送程式碼至 `main` 分支
2. 進入 GitHub → Settings → Pages
3. Source：選擇 `main` 分支、`/docs` 目錄
4. 儲存後稍等 1-2 分鐘
5. 存取 `https://{username}.github.io/{repo}/`

### 方法 B：手動驗證

```bash
# 確認 docs/ 目錄存在且包含 index.html
ls docs/
# 應看到：index.html  src/  assets/（若有）
```

---

## 7. 專案結構

```
npx-prespec/
├── docs/                  # GitHub Pages 靜態根目錄（遊戲本體）
│   ├── index.html         # 遊戲入口
│   └── src/
│       ├── main.js        # 主迴圈
│       ├── car.js         # 賽車物理
│       ├── track.js       # 賽道幾何
│       ├── camera.js      # 第三人稱相機
│       ├── hud.js         # HUD 更新
│       ├── lap-tracker.js # 計圈邏輯
│       └── input.js       # 鍵盤輸入
├── tests/
│   ├── unit/
│   │   ├── lap-tracker.test.js
│   │   ├── car.test.js
│   │   └── input.test.js
│   └── vitest.config.js
├── package.json           # 僅含 vitest devDependency
├── specs/                 # speckit 規格文件
└── .specify/              # speckit 工具設定
```

---

## 8. 開發工作流程（TDD）

```bash
# 1. 開啟監視模式（測試自動重跑）
npx vitest --watch

# 2. 修改邏輯模組（docs/src/lap-tracker.js 等）
# 3. 看到測試由 Red 轉 Green
# 4. 重構
# 5. 在瀏覽器中目視驗證渲染效果
```
