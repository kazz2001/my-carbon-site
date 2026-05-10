# 1と2を続けて実行する

```bash
node BOB/scrape-and-generate.js <URL> [output-filename.json]
```

# 1 bmより情報抽出

```bash
node BOb/scrape-review-to-json.js <URL>
```

# 2 MDX作成

```bash
node Bob/generate-review-from-json.js config.json
```

# 3 手動で修正

affiliate link,画像の配置, レビューコメント整形、Aファイル修正

# 4,5,7を続けて実行するスクリプト

```bash
node BOB/add-review-to-all.js addisonrae1 2025
```

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

# 7 年ごとのページに追加

```bash
node Bob/add-review-to-cd-year.js addisonrae1 2025
```

# 8 相互リンク追加

```bash
node BOB/add-review-to-related.js <review-name>
```

# 9 レビューファイルのレビュー

```bash
/review <review-file-name>
```
