# 1 bmより情報抽出
node BOb/scrape-review-to-json.js <URL>
# 2 HTML作成
node Bob/generate-review-from-json.js config.json
# 3 手動で修正
# 4 Index.htmに追加
node Bob/add-review-to-index.js <review-name>