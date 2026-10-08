# wycchen.github.io

- 左側深藍個人檔案欄（手機版移到頂端）＋右側分頁：總覽／課程／公告／聯絡
- 著作、計畫、榮譽不放在分頁列，改由總覽的「精選成果」區塊進入，頁面標示「精選」
- 中／英／日三語、淺色／深色模式（預設淺色）、RWD
- 著作、計畫、榮譽、課程、公告都能依「近 3 年／近 5 年／全部／自訂期間」篩選；著作另可依類型篩選；課程的「自訂」可選到上／下學期（依每行第一欄的「上學期／下學期」或 Fall／Spring 判斷）
- 總覽最多顯示 5 則最新消息，其餘到「公告」頁看
- 圖示：[Font Awesome](https://fontawesome.com/) Free 7（放在 `assets/vendor/`，不依賴外部 CDN）

## 部署（不使用 Actions）

1. 把整個資料夾內容 push 到 repo 預設分支的根目錄
2. **Settings → Pages → Source：Deploy from a branch**，Branch 選 `master`（或 `main`）、`/ (root)`
3. **保留根目錄的 `.nojekyll`**，否則 GitHub 會把含 front matter 的 `.md` 轉成 HTML，網頁讀不到

## 網址

| 頁面 | 網址 |
| --- | --- |
| 總覽 | `index.html` 或 `#/` |
| 著作／計畫／榮譽／課程／聯絡 | `#/publications`、`#/projects`、`#/honors`、`#/teaching`、`#/contact` |
| 全部公告 | `#/news` |
| 單則公告 | `#/news/檔名（不含 .md）` |

舊網址 `news.html#xxx`、`#publications` 等會自動轉到新網址。加 `?lang=zh`、`?lang=en` 或 `?lang=ja` 可指定語言。

## 內容檔案

| 內容 | 檔案 |
| --- | --- |
| 姓名、職稱、信箱、研究室、CV、學術連結、研究標籤 | `content/site.md` |
| 頭像與隨機替換照片（`photo`、`photo_alt`，最多共 5 張） | `content/site.md`，照片放 `images/` |
| 關於 | `content/{en,zh,ja}/about.md` |
| 研究領域卡片 | `content/{en,zh,ja}/research.md` |
| 學歷／經歷 | `content/{en,zh,ja}/education.md`、`experience.md` |
| 著作 | `content/en/publications.md`（中文版沒有就自動用英文版） |
| 計畫 | `content/{en,zh,ja}/projects.md` |
| 榮譽 | `content/{en,zh,ja}/honors.md` |
| 歷年課程 | `content/{en,zh,ja}/teaching.md` |
| 聯絡頁說明文字 | `content/{en,zh,ja}/contact.md` |
| 公告 | `news/*.md` + `news/index.md` |
| CV | `files/`（檔名要和 `site.md` 的 `cv:` 一致；檔案不存在時按鈕會變灰） |

任何 `content/zh/xxx.md` 或 `content/ja/xxx.md` 不存在時，自動使用 `content/en/xxx.md`。

## 共通格式：年份分組 + 欄位

```markdown
## 2025            ← 單一年份
## 2020-2024       ← 期間
## 2024-           ← 至今
## Ongoing         ← 進行中（中文寫「## 進行中」），任何期間篩選都會顯示

- 第一欄 | 第二欄 | 第三欄
```

網頁會自動依年份由新到舊排序，期間篩選也依標題年份判斷。各檔案的欄位：

| 檔案 | 每一行的格式 |
| --- | --- |
| publications | `- [類型] 作者. 標題. *期刊或會議*, 卷期頁碼, 年. [PDF](連結)` |
| projects | `- 計畫名稱 \| 補助單位 \| 角色` |
| honors | `- 獎項名稱 \| 頒發單位` |
| teaching | `- 學期 \| 課程名稱 \| 修課對象 \| 開課學校` |
| experience | `- 職稱 \| 單位` |
| education | `- 學位 \| 學校與系所 \| 備註` |

著作類型代碼：`[J]` 期刊、`[C]` 研討會、`[W]` 工作坊、`[B]` 專書、`[P]` 專利、`[R]` 預印本、`[T]` 學位論文。作者寫成 `**Yu-Chi Chen**` 會加粗。

預設顯示期間在 `content/site.md` 的 `period_default`（`3`、`5` 或 `all`）。

## 測試資料

目前沒有資料的地方用「Test …／測試…」填了示範內容，上線前請替換或刪除：

- `content/en/publications.md`：Test Journal / Conference / Workshop / Patent（2021 年以前的 4 筆 ePrint 是真實資料）
- `content/{en,zh,ja}/projects.md`：Test Project 1–4／測試計畫 1–4
- `content/{en,zh,ja}/honors.md`：Test Honor 1–2／測試榮譽 1–2
- `content/{en,zh,ja}/teaching.md`：Test Course 1–6／測試課程 1–6（「進行中」的 5 門是原網頁的課程，學期為示範）

快速找出所有測試資料：

```bash
grep -rn -i "test\|測試" content news
```

## 從 DBLP 匯入完整著作

在自己電腦執行（只需 Python 3）：

```bash
python tools/dblp2md.py --out /tmp/publications.md   # 先輸出到暫存檔檢查
python tools/dblp2md.py                              # 直接覆蓋 content/en/publications.md
python tools/dblp2md.py --no-preprints               # 不含 arXiv / ePrint
```

## 發布公告

1. 複製 `news/_template.md`，改名為 `YYYY-MM-DD-簡短名稱.md`
2. 編輯：

   ```markdown
   ---
   date: 2026-11-02
   title: 論文獲 IEEE TIFS 接受
   pinned: false
   ---

   公告內容（Markdown）
   ```

3. 在 `news/index.md` 加一行 `- [檔名.md](檔名.md)`，commit & push

**公告圖片**（讀者點圖片會以彈窗放大）：

- 本機圖片：放到 `news/images/`，內文寫 `![說明](images/檔名.jpg)`
- 網路圖片：直接貼網址 `![說明](https://example.com/photo.jpg)`。有些網站禁止外部引用圖片（例如 Wikimedia），顯示不出來時請下載後改放 `news/images/`

公告只寫中文；切到英文或日文介面時，公告內容一樣顯示中文。`pinned: true` 會置頂。要下架，從 `news/index.md` 刪掉那行即可。

## 介面文字與配色

按鈕、分頁名稱等介面文字在 `assets/js/app.js` 開頭的 `I18N`。色票在 `assets/css/style.css` 開頭：`:root`（淺色）與 `html[data-theme="dark"]`（深色）。

## 本機預覽

網頁用 `fetch()` 讀 Markdown，直接雙擊 `index.html` 會載不到內容：

```bash
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

`crypto/`、`share/` 內的舊 PDF 原樣保留，避免外部連結失效。
