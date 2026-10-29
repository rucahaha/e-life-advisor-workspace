# E-Life Advisor Workspace

「E-Life｜智慧生活顧問服務平台」的店員端與統一展示入口。這是學生競賽的**概念原型**，著重於顧客需求如何交接、店員如何準備商品方案、以及服務如何被記錄與延續。

> 非全國電子官方服務。所有顧客、店員、門市、商品、價格、庫存與服務紀錄都是虛構示範資料；不會連接全國電子內部系統。

## 內容

- `/#/`：統一展示入口，提供既有 Netlify 顧客端與店員端入口、建議體驗流程與誠實限制。
- `/#/advisor/dashboard`：依示範資料即時計算待確認、待準備與今日諮詢指標。
- `/#/advisor/appointments`：搜尋、篩選、詳情、確認、改期、開始準備、取消與操作歷程。
- `/#/advisor/customers?case=EL-001`：原始需求、AI 示範摘要、待確認清單與顧問準備內容。
- `/#/advisor/products?case=EL-001`：9 項示範商品的搜尋、篩選、最多 3 項比較與加入案件。
- `/#/advisor/records`：新增／編輯服務紀錄、AI 整理草稿與服務時間軸。
- 全站 AI 側邊欄：依頁面與案件產生可重複的規則式回應，明確標示「AI 示範回應」。

## 本機啟動與檢查

建議 Node.js 22 或更新版本。

```bash
pnpm install
pnpm run dev
```

開發站啟動後，從 `/#/` 進入。完整檢查：

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

## Mock mode 與資料限制

預設為 Mock mode：資料會儲存在目前店員端網域的 `localStorage`，重新整理後仍在；左側「重設示範資料」會恢復 8 筆案例、9 項商品及起始紀錄。它**不會**與 Netlify 顧客端分享資料，也不代表真正預約、即時庫存、官方保固或 AI 模型已啟用。

UI 提供 `LocalStorageRepository`、`RemoteRepository` 邊界與 `assistantService` 抽象。Connected mode 未設定受權限控管的後端時會保持 Mock mode，避免出現虛假的「已連線」狀態。

## 示範故事

以 `EL-001` 為主線：待確認預約 → 確認預約 → 開始準備 → 檢查資訊缺口 → 比較商品 → 加入準備清單 → 標記準備完成 → 新增服務紀錄。詳細腳本在 [docs/DEMO_SCENARIOS.md](docs/DEMO_SCENARIOS.md)。

## GitHub Pages

`.github/workflows/deploy.yml` 在推送 `main` 時依序執行 pnpm install、lint、typecheck、test、build 並部署 `dist`。Vite 會由 GitHub Actions 的 repository 資訊正確處理一般 Project Pages 與 `owner.github.io` 根站的 base path；前端以 HashRouter 避免重整子路徑的 404。使用 npm 的環境同樣可執行對應的 `npm run <script>`。

設定與驗證步驟請見 [docs/DEPLOY_GITHUB_PAGES.md](docs/DEPLOY_GITHUB_PAGES.md)。尚未將此工作區推送到有權限的 GitHub repository 前，不能視為已發布。

## 顧客端交接

顧客端保留在 [現有 Netlify 網站](https://fanciful-pegasus-e051a5.netlify.app/)，本專案沒有修改或重新部署它。未來要讓它與店員端真正同步，請依 [docs/CUSTOMER_NETLIFY_HANDOFF.md](docs/CUSTOMER_NETLIFY_HANDOFF.md) 增加受保護的 intake 與狀態查詢流程，並先完成隱私、授權、RLS、CORS、rate limit 與後端 AI 安全設計。

`supabase/` 放的是規劃用 schema／Edge Function skeleton，沒有可用的憑證、正式資料或內部系統整合。私密 AI key、Supabase service role 等資料絕不可放入 `.env`、Vite bundle 或 GitHub Pages。
