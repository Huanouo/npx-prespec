<!--
Sync Impact Report
- Version change: 模板占位版本 -> 1.0.0
- Modified principles:
	- 模板原則 1 -> I. 文件語言與精簡可執行
	- 模板原則 2 -> II. Git 可操作與可追溯
	- 模板原則 3 -> III. 測試先行（TDD，非可選）
	- 模板原則 4 -> IV. 任務完成即時勾選
	- 模板原則 5 -> V. 規格檔保護與安全套版
- Added sections:
	- 專案預設與技術邊界
	- 實作流程與品質關卡
- Removed sections:
	- 無
- Templates requiring updates:
	- ✅ `.specify/templates/plan-template.md`
	- ✅ `.specify/templates/spec-template.md`
	- ✅ `.specify/templates/tasks-template.md`
	- ⚠ pending（目錄不存在，無需更新） `.specify/templates/commands/*.md`
	- ✅ `README.md`（已檢查，無需調整）
- Follow-up TODOs:
	- 無
-->

# npx-prespec 專案憲章

## Core Principles

### I. 文件語言與精簡可執行
所有新建或更新的規格、計畫、任務與流程文件 MUST 使用繁體中文；回覆與協作文字
MUST 使用繁體中文。設計決策 MUST 以「可執行的最小方案」為優先，禁止為未證實需求
預先增加抽象層或額外模組。理由：降低溝通與維護成本，避免過度設計造成交付延遲。

### II. Git 可操作與可追溯
每個主要階段（specify、plan、tasks、implement）開始前與結束後 MUST 可執行 `git status`
並確認倉庫狀態可讀。任何變更 MUST 以可追溯方式提交，禁止未經授權的破壞性 Git 指令。
理由：確保流程可恢復、可審查，降低協作風險。

### III. 測試先行（TDD，非可選）
實作預設 MUST 採用 TDD（Red -> Green -> Refactor）：先寫測試、先看到失敗，再撰寫實作。
若需偏離 TDD，MUST 在對應文件明確記錄原因與替代驗證方式，且需經使用者明確同意。
理由：以可驗證行為驅動實作，降低回歸風險。

### IV. 任務完成即時勾選
`implement` 階段執行 `tasks.md` 時，任務狀態 MUST 與實際進度同步更新；完成任務 MUST
立即勾選，不得批次補記。勾選前 MUST 確認對應測試或驗證證據已存在。理由：維持進度真實性
與交付可視性。

### V. 規格檔保護與安全套版
`implement` 階段 MUST 防止既有規格文件（如 `spec.md`、`plan.md`、`tasks.md`）遭刪除或覆蓋。
套用模板時僅可補齊缺漏內容，不可直接覆寫既有規格；任何大幅修改前 MUST 先檢視差異。
理由：保護需求脈絡與決策歷史，避免實作與規格脫鉤。

## 專案預設與技術邊界

若需求被判定為網站專案，預設 MUST 採可部署於 GitHub Pages 的前端靜態網站方案。
除非使用者明確要求，否則不得預設引入後端服務或伺服器端執行環境。

## 實作流程與品質關卡

在產出或更新 `plan.md` 時，Constitution Check MUST 明確檢查：繁中要求、TDD 採用、Git 狀態檢查、
任務勾選規則、規格檔保護與網站預設策略。`tasks.md` MUST 含可驗證的測試與實作任務，並標示
執行順序與相依關係。

## Governance

本憲章優先於其他工作慣例。修訂流程：提出修訂內容與影響範圍、同步檢查模板一致性、更新版本與日期。
版本規則採語意化版本：MAJOR 表示不相容治理變更，MINOR 表示新增或實質擴充原則，PATCH 表示
文字澄清與不改變語義之修正。每次 PR 審查 MUST 進行憲章符合性檢核，未通過者不得視為完成。

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
