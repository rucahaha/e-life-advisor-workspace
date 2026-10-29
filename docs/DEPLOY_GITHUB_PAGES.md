# 部署至 GitHub Pages

本專案以 Vite 與 `HashRouter` 建置，所有店員端路徑都會是 `/#/advisor/...`，因此直接重新整理店員頁面不會要求 GitHub Pages 處理 SPA 的子路徑。

## 一次性設定

1. 將專案推送至 GitHub 的 `main` 分支。
2. 在 GitHub Repo **Settings → Pages** 把 Source 設為 **GitHub Actions**。
3. 將 `main` 推送或從 Actions 手動執行 `Deploy E-Life Advisor Workspace to GitHub Pages`。
4. Actions 成功後，從工作流程的 `github-pages` environment 或 Settings → Pages 複製部署網址。

## base path 規則

`vite.config.ts` 會在 GitHub Actions 中由 `GITHUB_REPOSITORY` 自動計算：

- 一般專案 `owner/e-life-advisor`：base 為 `/e-life-advisor/`。
- 根站 `owner/owner.github.io`：base 為 `/`。
- 本機開發：base 為 `/`。

如需覆蓋，可在建置環境設定 `VITE_BASE_PATH=/repository-name/`。不要將資產寫成 `/assets/...`；Vite 已處理正確的部署前綴。

## 驗證建議

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

開啟部署網址後，至少直接測試 `/#/advisor/appointments` 並重新整理。HashRouter 會保留路徑。此 repository 的 workflow 是可部署設定；若尚未推送或沒有 GitHub Pages 權限，不能宣稱網站已發布。
