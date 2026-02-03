# Joey AI Agent Frontend

Joey AI Agent 的 Web 前端介面，讓使用者透過網頁建立 AI 驅動的網站專案。

## 功能特色

- 🔐 **GitHub SSO 登入**：安全的 OAuth 認證
- 📊 **專案儀表板**：管理所有網站建立專案
- 🎨 **豐富配置選項**：自訂設計、SEO、追蹤碼
- 📁 **檔案上傳**：支援 Logo、視覺說明書等素材
- 🔄 **即時進度監控**：透過 SSE 追蹤 AI Agent 執行狀態
- 📱 **響應式設計**：完美支援桌面版和手機版

## 技術棧

- **框架**：Next.js 16 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS 4
- **狀態管理**：React Hooks
- **即時通訊**：Server-Sent Events (SSE)
- **部署**：Render Static Site

## 專案結構

```
joey-ai-frontend/
├── app/
│   ├── page.tsx                    # 首頁/登入
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # 全域樣式
│   ├── dashboard/
│   │   ├── page.tsx                # 儀表板
│   │   └── projects/
│   │       ├── new/page.tsx        # 新建專案
│   │       └── [id]/page.tsx       # 專案詳情與進度監控
├── components/                     # React 元件
├── lib/
│   └── api.ts                      # API client
├── types/
│   └── index.ts                    # TypeScript 類型定義
└── public/                         # 靜態資源
```

## 開發

### 先決條件

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 環境變數

複製 `.env.example` 為 `.env.local`：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置生產版本

```bash
npm run build
npm start
```

## API 整合

前端透過 `/lib/api.ts` 與後端 API 通訊：

- **Auth API**: `/api/auth/*`
- **Projects API**: `/api/projects/*`
- **Uploads API**: `/api/uploads/*`
- **SSE Stream**: `/api/projects/:id/stream`

## 部署

### Render Static Site

1. 連接 GitHub repository
2. 設定 Build Command: `npm run build`
3. 設定 Publish Directory: `.next/static`
4. 設定環境變數：`NEXT_PUBLIC_API_URL`

或使用 Render API：

```bash
curl -X POST 'https://api.render.com/v1/services' \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "static_site",
    "name": "joey-ai-frontend",
    "ownerId": "tea-d60dhri4d50c73ckulmg",
    "repo": "https://github.com/JoeyVIP/joey-ai-agent-frontend",
    "branch": "main",
    "autoDeploy": "yes",
    "serviceDetails": {
      "buildCommand": "npm run build",
      "publishPath": ".next/standalone"
    }
  }'
```

## 授權

ISC License

---

建立日期：2026-02-04
由 Claude Sonnet 4.5 輔助開發
