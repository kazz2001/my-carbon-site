# 1 bmより情報抽出
```bash
node BOb/scrape-review-to-json.js <URL>
```
# 2 MDX作成
```bash
node Bob/generate-review-from-json.js config.json
```
# 3 手動で修正
affiliate link,画像の配置,Aファイル
# 4 Index.htmに追加
```bash
node Bob/add-review-to-index.js <review-name>
```
# 5 Latestに追加
```bash
node Bob/add-review-to-latest.js <review-name>
```
# 6 best50に追加
```bash
node Bob/add-review-to-best50-table-only.js <review-name>
```
または
```bash
node Bob/add-review-to-best50.js 2025 <review-name>
```
#7 年ごとのページに追加
```bash
node Bob/add-review-to-cd-year.js addisonrae1 2025
```