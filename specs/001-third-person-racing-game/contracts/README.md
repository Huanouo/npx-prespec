# 模組介面契約：第三人稱賽車遊戲

**功能分支**：`001-third-person-racing-game`  
**產出日期**：2026-03-13  
**對應計畫**：[plan.md](../plan.md)

本目錄記錄遊戲各核心模組對外暴露的公開介面（JavaScript class 公開方法與屬性），作為 TDD 撰寫測試時的合約依據。

---

## 文件索引

| 檔案 | 說明 |
|------|------|
| [Car.contract.md](./Car.contract.md) | 賽車實體公開介面 |
| [Track.contract.md](./Track.contract.md) | 賽道實體公開介面 |
| [GameState.contract.md](./GameState.contract.md) | 遊戲狀態管理公開介面 |
| [InputManager.contract.md](./InputManager.contract.md) | 輸入管理器公開介面 |
| [RecordManager.contract.md](./RecordManager.contract.md) | 成績紀錄管理公開介面 |
| [Timer.contract.md](./Timer.contract.md) | 計時器公開介面 |

---

## 契約約定

- 所有公開方法與屬性均須有對應的 Vitest 單元測試
- 實作前先依本契約撰寫失敗測試（Red），再實作（Green），最後重構（Refactor）
- 內部私有方法（以 `_` 前綴）不列入契約，不直接測試
- 若實作需要修改契約，須同步更新本文件並通知計畫更新
