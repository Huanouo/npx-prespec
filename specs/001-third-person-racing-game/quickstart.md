# 快速入門：第三人稱賽車遊戲

**功能分支**：`001-third-person-racing-game`  
**產出日期**：2026-03-13  
**對應計畫**：[plan.md](./plan.md)

---

## 前置需求

| 工具 | 版本需求 | 說明 |
|------|---------|------|
| Node.js | v18 以上 | JavaScript 執行環境 |
| npm | v9 以上 | 套件管理器 |
| Git | 任意版本 | 版本控制 |
| 現代瀏覽器 | Chrome 100+ / Firefox 100+ / Edge 100+ / Safari 15+ | 遊戲執行環境 |

---

## 初始化專案

```bash
# 1. 進入倉庫根目錄
cd /path/to/npx-prespec

# 2. 以 Vite vanilla 模板初始化（如尚未初始化）
npm create vite@latest . -- --template vanilla

# 3. 安裝執行期依賴
npm install three cannon-es

# 4. 安裝開發依賴
npm install -D vitest @vitest/ui jsdom

# 5. 確認安裝成功
npm list three cannon-es vitest
```

---

## 設定 Vite（GitHub Pages 部署）

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/npx-prespec/',   // 對應 GitHub Pages 子路徑（倉庫名稱）
  build: {
    outDir: 'dist',
    minify: 'terser'
  }
});
```

---

## 設定 Vitest（TDD 測試）

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // 模擬瀏覽器 DOM（localStorage、window 等）
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});
```

```json
// package.json scripts 新增
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 開發工作流程（TDD）

```bash
# 啟動測試 Watch 模式（開發時持續執行）
npm run test:watch

# 啟動開發伺服器（另開終端）
npm run dev
# → 開啟 http://localhost:5173/npx-prespec/
```

**TDD 工作循環**：

1. **Red**：依 `contracts/` 中的契約撰寫失敗測試
2. **Green**：撰寫最小實作使測試通過
3. **Refactor**：重構程式碼，確保測試仍通過

---

## 目錄建立

```bash
# 建立完整目錄結構
mkdir -p src/{game,entities,physics,graphics,input,ui,storage,utils,data,styles}
mkdir -p tests/{unit,integration}
mkdir -p public/assets/{models,textures,thumbnails}
```

---

## 部署至 GitHub Pages

### 手動部署

```bash
# 執行測試
npm test

# 建構靜態檔案
npm run build
# → 產出 dist/ 目錄

# 在 GitHub 倉庫設定中，將 GitHub Pages 來源設為 dist/ 目錄
# 或使用 gh-pages 工具部署
npm install -D gh-pages
# package.json 新增：
#   "deploy": "gh-pages -d dist"
npm run deploy
```

### 自動部署（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
name: 建構並部署至 GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 設定 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 安裝依賴
        run: npm ci

      - name: 執行測試
        run: npm test

      - name: 建構靜態檔案
        run: npm run build

      - name: 部署至 GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 執行測試

```bash
# 執行所有測試（單次）
npm test

# 執行測試並開啟視覺化介面
npm run test:ui

# 執行並產出覆蓋率報告
npm run test:coverage
```

**預期測試結構**：

```
tests/
├── unit/
│   ├── Car.test.js          ← 先寫，驗證賽車物理邏輯
│   ├── Track.test.js        ← 驗證邊界偵測與圈數計算
│   ├── GameState.test.js    ← 驗證狀態機轉換
│   ├── Timer.test.js        ← 驗證計時與格式化
│   ├── RecordManager.test.js ← 驗證 localStorage 讀寫
│   └── InputManager.test.js ← 驗證鍵盤輸入處理
└── integration/
    └── Game.test.js         ← 驗證遊戲迴圈整合
```

---

## 常見問題

**Q：遊戲在 GitHub Pages 上無法載入資源（404）？**  
A：確認 `vite.config.js` 的 `base` 設定為 `/npx-prespec/`（倉庫名稱），且所有資源路徑使用相對路徑或以 `base` 為前綴。

**Q：localStorage 在隱私模式無法儲存成績？**  
A：遊戲會偵測 localStorage 可用性並顯示提示訊息，成績僅在本局有效，不影響遊戲進行。

**Q：Three.js 在 Vitest 測試中出現渲染錯誤？**  
A：測試環境使用 jsdom，不支援 WebGL。在測試中 mock 渲染層（`vi.mock('./graphics/Renderer.js', () => ({ Renderer: class {} }))`），僅測試遊戲邏輯。

**Q：音效無法播放？**  
A：依瀏覽器自動播放政策，音效需在首次用戶互動後才能播放。遊戲在首次按下「開始遊戲」後初始化 AudioContext，若失敗則靜默降級，不影響遊戲體驗。
