# Handoff：漫畫收藏網站（Manga Collection Tracker）

## Overview
一個記錄與追蹤漫畫收藏的個人網站。使用者可以：
- 收藏喜歡的漫畫作品、存官方網站連結
- 追蹤閱讀進度（勾格與計數連動）
- 用六種狀態管理：尚未開始 / 進行中 / 暫停中 / 已棄坑 / 已追完 / 等連載
- 分成四個主分頁：**我的收藏**、**有興趣清單**、**實體書**、**分類**
- 實體書可標記 **台版 / 日版**（預設台版），進度以「集」計算
- 每部作品可自由增減多個標籤；標籤自動彙整成「分類」分頁

有桌機（側欄式）與手機（iPhone App）兩種版面，資料模型與互動邏輯完全一致。

## About the Design Files
本包內的 `.dc.html` 檔案是**用 HTML 製作的設計參考稿**——展示預期的外觀與互動行為的原型，**不是可直接搬用的正式程式碼**。它們使用一套自訂的 Design Component 執行環境（`support.js`），只為了在預覽中呈現。

你的任務是**在目標環境中重建這些設計**：若專案已有前端框架（React / Vue / Svelte 等），沿用其既有模式與元件庫；若尚無環境，建議用 **React + Vite + TypeScript**，狀態用 Zustand 或 React context，資料先以 `localStorage` 持久化（單人使用、無需後端）。之後要多人／雲端同步再接後端即可。

## Fidelity
**High-fidelity（hifi）**。顏色、字體、間距、圓角、互動都已定稿，請盡量像素級重建。（另有一份 `漫畫收藏線稿.dc.html` 為早期低擬真線稿，僅供理解演進，不需照做。）

## 資料模型（Data Model）
每部作品（comic）：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | number | 唯一識別 |
| `title` | string | 作品標題（必填） |
| `author` | string | 作者，空值顯示「未填作者」 |
| `link` | string | 官方網站連結；`'#'` 或空視為無連結 |
| `group` (`g`) | `'collection' \| 'interested' \| 'physical'` | 所屬分頁 |
| `status` (`s`) | `'reading' \| 'waiting' \| 'done' \| 'paused' \| 'dropped' \| 'none'` | 追蹤狀態 |
| `cur` | number | 目前進度（話數，實體書為集數） |
| `total` | number \| null | 總數；`null` = 連載中/未定 |
| `edition` (`ed`) | `'tw' \| 'jp'` | 僅實體書用，預設 `'tw'` |
| `cover` (`c`) | string (hex) | 封面底色（目前用色塊佔位，未來換真實封面圖） |
| `tags` | string[] | 標籤陣列（可多個） |
| `note` | string | 使用者筆記 |

### 狀態定義（STATUS）
| key | 中文標籤 | 顏色 hex |
|-----|---------|---------|
| `reading` | 進行中 | `#3a7bd5` |
| `waiting` | 等連載 | `#d9541f` |
| `done` | 已追完 | `#4a9d6b` |
| `paused` | 暫停中 | `#9a8f7d` |
| `dropped` | 已棄坑 | `#b23b3b` |
| `none` | 尚未開始 | `#b8ad9a` |

顯示順序固定為：`reading, waiting, done, paused, dropped, none`。

### 版本（EDITION）
`tw`=台版、`jp`=日版，預設 `tw`。

## Screens / Views

### 1. 桌機 — 主框架（`漫畫收藏網站.dc.html`）
- **佈局**：左側固定側欄（寬 82px）＋ 右側主區。整體背景 `#f4efe6`。
- **側欄**：頂部 logo 方塊（42×42，圓角 12，背景 `#d9541f`，白色「漫」字，Noto Serif TC 900）。其下 5 個直向項目（書櫃 / 有興趣 / 實體書 / 分類 / 新增），每項為圖示＋10.5px 標籤；作用中項背景 `#faf6ef`、文字 `#d9541f`、陰影。最底一個圓形使用者頭像。圖示用 Material Symbols Outlined。
- **Header**（高 74px，底邊框 `#e2d9c8`，半透明背景 + blur）：左側搜尋框（最大 540px，高 42，圓角 13，背景 `#fbf8f2`，1px 邊框 `#e2d9c8`，含 search 圖示與 placeholder「搜尋作品、作者或標籤…」）；右側「新增作品」橘色按鈕（背景 `#d9541f`，白字，圓角 13，含 add 圖示，陰影 `0 4px 12px rgba(217,84,31,.3)`）。
- **內容區標題列**：小標（Newsreader 斜體 14px，`#a89a86`，如 "My Library"）＋ 大標（Noto Serif TC 900，34px，如「我的收藏」）；右側計數文字「共 N 部作品」。
- **狀態篩選 chips**：一列可換行的膠囊按鈕，「全部」＋六種狀態，各帶顏色圓點與數量。作用中：背景 `#26221d`、文字 `#fbf6ec`；未選：背景 `#fbf8f2`、文字 `#6b6459`、1px 邊框。（分類磚牆檢視時隱藏此列。）
- **封面網格**：`grid-template-columns: repeat(auto-fill, minmax(158px,1fr))`，gap `26px 20px`。每張卡：
  - 封面容器 `aspect-ratio:3/4`，圓角 12，背景為 `linear-gradient(155deg, rgba(255,255,255,.14), rgba(0,0,0,.32)), <hex>`，陰影 `0 8px 22px rgba(38,34,29,.16)`。
  - 左上狀態徽章：膠囊，背景 `rgba(20,18,15,.42)` + blur，含顏色圓點與狀態文字，白字 11px。
  - 右上（僅實體書）版本徽章：背景 `rgba(217,84,31,.92)`，白字，「台版 / 日版」。
  - 封面底部：標題（Noto Serif TC 700，19px，`#fbf6ec`，文字陰影）＋作者（11.5px，半透明白）。
  - 封面下方：進度條（高 5，圓角 4，軌道 `#e4dccc`，填色為狀態色）＋進度文字（11.5px，`#8a8272`）。
  - 分類檢視時，卡片進度條上方多一個所屬書櫃小標籤（背景 `#efe8db`）。
  - hover：`translateY(-4px)`。
- **卡片點擊** → 開右側詳情抽屜（見 §3）。

### 2. 手機 — App（`漫畫收藏App.dc.html`）
- 置於 iPhone 外框內（`ios-frame.jsx`，寬約 402px）。實作時改為響應式或獨立行動版路由即可。
- **Header**：小標＋大標（Noto Serif TC 900，27px）；右側搜尋鍵（40×40 方鈕）與圓形頭像。點搜尋鍵展開一列搜尋輸入框（依標題／作者／標籤即時過濾）。
- **狀態 chips**：橫向可捲動（隱藏捲軸）。
- **網格**：`repeat(2,1fr)`，gap `22px 16px`；卡片規格同桌機（尺寸略縮）。
- **底部分頁列**：固定於底，半透明 + blur，5 項：書櫃 / 有興趣 / 實體書 / 新增（橘色圓角凸起鍵）/ 搜尋。作用中 `#d9541f`，未選 `#9a8f7d`。（分類已改由此列進入；若空間不足可將「搜尋」併入 header，讓「分類」進底列。）
- 詳情與新增皆為由下滑入的全螢幕 sheet（動畫 `sheetUp .34s cubic-bezier(.2,.8,.2,1)`）。

### 3. 詳情（Detail，抽屜 / sheet）
桌機為右側滑入抽屜（寬 `min(468px,92vw)`，背景 `#faf6ef`，陰影 `-16px 0 40px rgba(28,24,19,.28)`，動畫 `drawerIn .32s`；外層遮罩 `rgba(28,24,19,.5)` + blur，點遮罩關閉）。手機為全螢幕 sheet。內容：
- **關閉鈕**（桌機右上 ✕ 方鈕 / 手機左上「‹ 書櫃」膠囊）。
- **封面**（118×158，圓角 11）＋右側**就地編輯欄位**：
  - 標題：無框輸入框，Noto Serif TC 900 23px，focus 時底線變 `#d9541f`。
  - 作者：無框輸入框，13px，`#8a8272`。
  - 連結：含 link 圖示的輸入框（圓角 9），有值時右側顯示 open_in_new 外連圖示。
  - **全部即時儲存，不需按「編輯」鈕。**
- **版本**（僅實體書）：「台版 / 日版」兩顆膠囊，作用中背景 `#26221d`。
- **追蹤狀態**：六顆狀態膠囊（作用中填狀態色、白字；未選白底＋顏色圓點）。
- **進度模組**（白卡，圓角 15，1px 邊框 `#ece3d2`）：
  - 標題列：「閱讀進度 · 勾格與計數連動」＋右側進度文字。
  - `－` 鈕（38×38，圓角 11，白底邊框）／中央大數字（Newsreader 32px）與「/ 總數 話（或集）」／`＋` 鈕（38×38，橘色）／右側進度條。
  - **勾格**（僅當 `total != null && total > 0 && total <= 60`，手機 `<= 48`）：`repeat(10, 1fr)`（手機 8 欄）格子按鈕，已讀 = 橘底白字「✓N」，未讀 = 米底灰字「N」。
  - **連動規則**：按 ＋/－ 改 `cur`；點格子 N → 若該格已是目前最後一格則退回 N-1，否則設為 N（跳讀）。`cur` 由 0 變正 → 自動轉 `reading`；`total` 有值且 `cur>=total` → 自動 `done`；`done` 狀態下 `cur<total` → 退回 `reading`。設為 `done` 時（有 total）自動填滿 `cur=total`；設為 `none` 時 `cur=0`。
- **標籤**：每個標籤為可移除 chip（背景 `#efe8db`，右側 ✕）；末尾一個虛線輸入框，打字後按 Enter／逗號／頓號新增，重複自動略過。
- **筆記**：多行 textarea（圓角 13，1px 邊框，min-height 80，可垂直縮放）。

### 4. 新增 / 編輯表單（sheet / 抽屜）
由 header「新增作品」、側欄「新增」、底部「新增」鍵開啟。欄位：
- 封面顏色（10 色色卡選一，選中有 `#26221d` outline）— PALETTE 見下。
- 標題＊、作者、作品網站連結（輸入框，高 44，圓角 12，1px 邊框 `#e2d9c8`）。
- 收藏分類：我的收藏 / 有興趣清單 / 實體書（膠囊三選一）。
- 版本（僅選「實體書」時出現）：台版 / 日版，預設台版。
- 追蹤狀態：六選一膠囊。
- 目前進度、總話數（可留空＝連載中）：數字輸入，並排。
- 標籤：與詳情相同的 chip 輸入介面。
- 底部：取消（白底）＋「加入書櫃 / 儲存變更」（標題非空才啟用；啟用橘底，停用 `#e4dccc` 灰字）。
- 儲存新作品後自動切到對應分頁；編輯則就地更新。

### 5. 分類（Category）
- **磚牆檢視**（未選特定標籤）：把所有作品依標籤彙整，每個標籤一張磚（`repeat(auto-fill, minmax(200px,1fr))`，手機 `repeat(2,1fr)`），磚內含最多 3 張封面縮圖預覽＋「＃標籤」名稱＋「N 部」。依作品數由多到少排序。
- **標籤詳情檢視**（點磚後）：頂部顯示「‹ 所有分類」返回鈕與「＃標籤」大標，下方以同一套封面網格列出所有帶該標籤的作品（跨書櫃／有興趣／實體書），每張卡顯示所屬書櫃小標籤。
- ⚠️ **待辦（使用者已要求，尚未實作）**：分類本身要能「新增」。建議做法——維護一份使用者自訂分類清單（可獨立於作品標籤存在），提供「新增分類」入口；新分類即使暫無作品也顯示為空磚，之後可把作品標籤指向它。實作時將標籤與分類統一為同一組可管理的字串集合即可。

## Interactions & Behavior
- 分頁切換會重設狀態篩選為「全部」並關閉詳情。
- 搜尋（手機）：對 `title + author + tags` 做不分大小寫子字串比對。
- 進度連動邏輯見 §3。
- 動畫：抽屜 `drawerIn .32s cubic-bezier(.2,.8,.2,1)`；手機 sheet `sheetUp .34s` 同曲線；遮罩 `backIn .25s`；卡片進場 `fadeUp .35~.4s`；進度條寬度 `transition:width .3s`。
- hover：桌機卡片上浮、按鈕 brightness/位移。

## State Management
需要的狀態：`tab`、`filter`（狀態篩選）、`selectedId`（開啟中的詳情）、`categoryFilter`（分類分頁選中的標籤）、`searchOpen`/`searchText`（手機）、`adding`/`editingId`/`draft`（表單）、以及 `comics[]` 主資料。
- 建議 `comics` 與使用者自訂分類存 `localStorage`，載入時還原。
- 所有就地編輯（標題/作者/連結/筆記/標籤/狀態/進度/版本）即時寫回對應 comic。

## Design Tokens
**顏色**
- 頁面底：`#f4efe6`；側欄底：`#ece4d5`；卡片/欄位白：`#fff` / `#fbf8f2` / `#faf6ef`
- 主橘（強調/CTA）：`#d9541f`（hover 深 `#b23f13`）
- 主墨（深色按鈕/選中）：`#26221d`
- 次要文字：`#8a8272`、`#6b6459`、`#a89a86`、`#9a8f7d`
- 邊框：`#e2d9c8`、`#e6ddcd`、`#ece3d2`；虛線 `#d9cfba`
- 進度軌：`#e4dccc` / `#eee5d5`；標籤底：`#efe8db`；色卡選中 outline：`#26221d`
- 狀態色見 STATUS 表
- 封面色卡 PALETTE：`#2f5d5b`, `#b8752a`, `#4a5568`, `#6b4a63`, `#66632f`, `#3f5f7a`, `#a85433`, `#33574a`, `#2f3e5c`, `#5c4a52`

**字體**
- 內文/UI：`Noto Sans TC`（400/500/700）
- 標題/襯線：`Noto Serif TC`（600/700/900）
- 數字/裝飾斜體小標：`Newsreader`（400/500）
- 圖示：`Material Symbols Outlined`

**圓角**：按鈕/欄位 11–13；卡片/封面 12–15；膠囊 20–22；side logo 12。
**陰影**：卡片 `0 8px 22px rgba(38,34,29,.16)`；抽屜 `-16px 0 40px rgba(28,24,19,.28)`；橘按鈕 `0 4px 12px rgba(217,84,31,.3)`。

## Assets
- 目前**無真實圖片**：封面以漸層色塊佔位。正式版建議加「上傳封面圖」欄位，存 URL 或本地 blob。
- 圖示全部來自 Google Fonts 的 Material Symbols Outlined（用到：auto_stories, favorite, inventory_2, category, add, add_circle, search, settings, close, link, open_in_new, remove, chevron_left, edit）。
- 字體皆由 Google Fonts 載入。

## Files（本包內）
- `漫畫收藏網站.dc.html` — 桌機版設計稿（hifi，主要參考）
- `漫畫收藏App.dc.html` — 手機版設計稿（hifi）
- `漫畫收藏線稿.dc.html` — 早期低擬真線稿（僅供理解，不需照做）
- `ios-frame.jsx` — 手機稿用的 iPhone 外框（僅原型用，正式版不需要）

> 註：`.dc.html` 依賴 `support.js` 執行環境，無法直接當正式程式碼；請以「外觀＋行為＋本 README 規格」為準，在你的框架中重建。邏輯（狀態轉換、進度連動、分類彙整）可直接參考設計稿裡的 `class Component extends DCLogic { … }` 內對應方法。
