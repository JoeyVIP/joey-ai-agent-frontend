# 部署指南

## Render 部署步驟

### 方式一：透過 Render Dashboard（推薦）

1. 前往 [Render Dashboard](https://dashboard.render.com/)
2. 點擊 "New +" → "Web Service"
3. 連接 GitHub repository: `JoeyVIP/joey-ai-agent-frontend`
4. 配置如下：
   - **Name**: `joey-ai-frontend`
   - **Region**: Singapore (或其他)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. 環境變數：
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = `<後端 API URL>`（如果後端已部署）
6. 點擊 "Create Web Service"

### 方式二：使用 render.yaml 自動部署

已包含 `render.yaml` 配置檔，Render 會自動檢測並套用設定。

## 環境變數設定

在 Render Dashboard 的 Environment 頁籤設定：

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://joey-ai-backend.onrender.com
```

## 部署後驗證

1. 等待部署完成（約 5-10 分鐘）
2. 取得 Render URL（格式：`https://joey-ai-frontend.onrender.com`）
3. 開啟網址檢查：
   - 首頁載入正常
   - 儀表板頁面可訪問
   - 響應式設計正常（手機版）
4. 如需測試 API 整合，需先部署後端服務

## 常見問題

### Build 失敗

檢查 build logs：
- 確認 Node.js 版本（建議 18+）
- 確認所有依賴已正確安裝
- 檢查 TypeScript 編譯錯誤

### 部署成功但頁面無法載入

- 檢查 Start Command 是否為 `npm start`
- 檢查 PORT 環境變數（Render 自動設定）
- 查看 Runtime logs

### API 連線失敗

- 確認 `NEXT_PUBLIC_API_URL` 環境變數正確
- 確認後端服務已部署且可訪問
- 檢查 CORS 設定

## 手動部署命令

如需手動觸發部署：

```bash
# 透過 Render API（需要 API Key）
curl -X POST https://api.render.com/v1/services/srv-xxxxx/deploys \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"clearCache": "clear"}'
```

或在 Render Dashboard 點擊 "Manual Deploy" → "Deploy latest commit"

---

建立日期：2026-02-04
