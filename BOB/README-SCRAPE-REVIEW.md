# Webページからアルバムレビュー情報を抽出するスクリプト

## 概要

[`scrape-review-to-json.js`](scrape-review-to-json.js) は、bm.planetky.com のアルバムレビューページから情報を自動抽出し、[`generate-review-from-json.js`](generate-review-from-json.js) で使用できるJSON設定ファイルを生成するスクリプトです。

## 使用方法

### 基本的な使い方

```bash
node BOb/scrape-review-to-json.js <URL>
```

例：
```bash
node Bob/scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

これにより、`Bob/bob_output/durandbernerr1-review-config.json` が自動生成されます。

**注意**: 出力ファイルは `Bob/bob_output` フォルダー内に保存されます。このフォルダーが存在しない場合は自動的に作成されます。

### 出力ファイル名を指定する場合

```bash
node scrape-review-to-json.js <URL> <出力ファイル名>
```

例：
```bash
node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html custom-config.json
```

この場合、`Bob/bob_output/custom-config.json` が生成されます。

### 実行権限を付与して使用（Unix系）

```bash
chmod +x scrape-review-to-json.js
./scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

## 抽出される情報

スクリプトは以下の情報を自動的に抽出します：

| フィールド | 説明 | 抽出元 |
|-----------|------|--------|
| `artistName` | アーティスト名（英語） | ページタイトル |
| `albumTitle` | アルバムタイトル（英語） | ページタイトル |
| `identifier` | ファイル識別子 | URLから自動生成 |
| `reviewPara1`〜`reviewPara4` | レビュー本文（4段落） | `#BeginEditable "Y"` 領域 |
| `score1` | 評価指標1（0-10） | `#BeginEditable "C"` の画像ファイル名 |
| `score2` | 評価指標2（0-10） | `#BeginEditable "D"` の画像ファイル名 |
| `score3` | 評価指標3（0-10） | `#BeginEditable "E"` の画像ファイル名 |
| `score4` | 総合評価（星の数） | `#BeginEditable "F"` の星画像カウント |
| `producers` | プロデューサー情報 | `#BeginEditable "I"` 領域 |
| `guests` | ゲストアーティスト | `#BeginEditable "J"` 領域 |
| `amazonCom` | Amazon.com リンク | ページ内のAmazonリンク |
| `appleMusic` | Apple Music リンク | ページ内のApple Musicリンク |
| `best50Year` | Best50の年 | Best50リンクから抽出 |
| `best50Rank` | Best50の順位 | Best50リンクから抽出 |
| `relatedReviews` | 関連レビュー（オブジェクト配列） | `#BeginEditable "L"` 領域 |
| `tracks` | トラックリスト | HTMLテーブルから抽出 |

### `relatedReviews` の構造

関連レビューは以下の形式のオブジェクト配列として自動抽出されます：

```json
"relatedReviews": [
  {
    "identifier": "ndegeocelllo5",
    "artistName": "Meshell Ndegeocello",
    "albumTitle": "The Omnichord Real Book"
  },
  {
    "identifier": "ndegeocelllo4",
    "artistName": "Meshell Ndegeocello",
    "albumTitle": "Ventriloquism"
  }
]
```

### `tracks` の構造

トラックリストは以下の形式のオブジェクト配列として自動抽出されます：

```json
"tracks": [
  {
    "num": 1,
    "title": "Track Title",
    "composers": "Composer Name",
    "performer": "Artist Name",
    "time": "03:30"
  }
]
```

## 手動編集が必要な項目

生成されたJSONファイルには、以下の項目を手動で編集する必要があります：

| フィールド | 説明 |
|-----------|------|
| `artistNameJa` | 日本語アーティスト名 |
| `albumTitleJa` | 日本語アルバム名 |
| `albumNumber` | アルバム番号（何枚目のアルバムか） |
| `amazonJp` | Amazon.co.jp のリンク |

## ワークフロー例

### 1. Webページから情報を抽出

```bash
node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

出力例：
```
============================================================
アルバムレビュー情報抽出スクリプト
============================================================
URL: https://bm.planetky.com/durandbernerr1.html

HTMLを取得中...
✓ HTML取得完了

情報を抽出中...
✓ 情報抽出完了

============================================================
✅ JSON設定ファイルを生成しました！
============================================================
出力ファイル: Bob/bob_output/durandbernerr1-review-config.json

抽出された情報:
  アーティスト: Durand Bernarr
  アルバム: BLOOM
  識別子: durandbernerr1
  トラック数: 15
  Best50: 2025年 28位
  関連レビュー数: 3
  関連レビュー:
    1. Artist A / Album A (artista1)
    2. Artist B / Album B (artistb2)
    3. Artist C / Album C (artistc1)

次のステップ:
  1. Bob/bob_output/durandbernerr1-review-config.json を開いて以下を手動で編集:
     - artistNameJa (日本語アーティスト名)
     - albumTitleJa (日本語アルバム名)
     - albumNumber (アルバム番号)
     - amazonJp (Amazon.co.jpリンク)
  2. node generate-review.js Bob/bob_output/durandbernerr1-review-config.json
  3. アルバムジャケット画像を src/images/cd/durandbernerr1L.jpg として配置
```

### 2. 生成されたJSONファイルを編集

`Bob/bob_output/durandbernerr1-review-config.json` を開いて、手動編集が必要な項目を入力：

```json
{
  "artistName": "Durand Bernarr",
  "artistNameJa": "デュランド・バーナー",
  "albumTitle": "BLOOM",
  "albumTitleJa": "ブルーム",
  "albumNumber": "1",
  "identifier": "durandbernerr1",
  "amazonCom": "https://amzn.to/XXXXXXX",
  "amazonJp": "https://amzn.to/XXXXXXX",
  "appleMusic": "https://music.apple.com/us/album/1234567890",
  "best50Year": "2025",
  "best50Rank": "28",
  "relatedReviews": [
    {
      "identifier": "artista1",
      "artistName": "Artist A",
      "albumTitle": "Album A"
    }
  ],
  "tracks": [...]
}
```

### 3. レビューページを生成

```bash
node generate-review-from-json.js Bob/bob_output/durandbernerr1-review-config.json
```

### 4. アルバムジャケット画像を配置

```bash
cp /path/to/album-cover.jpg src/images/cd/durandbernerr1L.jpg
```

## 注意事項

- スクリプトは bm.planetky.com の特定のHTMLフォーマット（`<!-- #BeginEditable -->` コメントタグ）に依存しています
- Webページの構造が変更された場合、スクリプトの修正が必要になる可能性があります
- HTMLエンティティ（`"`、`&` など）は自動的にデコードされます
- レビュー本文は句点（。）で文章を分割し、自動的に4つの段落に再構成されます。必要に応じて手動で調整してください
- `score4` は大きな星（1点）と小さな星（0.5点）の合計として計算されます

## トラブルシューティング

### エラー: "URLを指定してください"

URLを引数として渡していません。以下のように実行してください：

```bash
node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

### エラー: HTMLを取得できない

- インターネット接続を確認してください
- URLが正しいか確認してください（`http://` または `https://` から始まること）
- Webサイトがアクセス可能か確認してください

### 情報が正しく抽出されない

- Webページの構造が変更されている可能性があります
- 生成されたJSONファイルを手動で確認・修正してください

### トラックリストが空

- HTMLのトラックリスト部分のフォーマットが想定と異なる可能性があります
- 手動でトラック情報を追加してください

### 関連レビューが抽出されない

- `#BeginEditable "L"` 領域内のHTMLフォーマットが想定と異なる可能性があります
- 手動で `relatedReviews` 配列を編集してください

## 関連ファイル

- [`generate-review-from-json.js`](generate-review-from-json.js) - JSONからレビューページを生成するスクリプト
- [`README-GENERATE-REVIEW.md`](README-GENERATE-REVIEW.md) - レビュー生成スクリプトのドキュメント
- [`Bib_work/review-template-A.mdx`](../Bib_work/review-template-A.mdx) - A版テンプレート
- [`Bib_work/review-template-L.mdx`](../Bib_work/review-template-L.mdx) - L版テンプレート

## 技術詳細

### 使用している技術

- Node.js 標準ライブラリ（`https`、`http`、`fs`、`path`）
- 外部依存なし（`npm install` 不要）
- 正規表現によるHTMLパース
- JSONファイル生成

### 抽出ロジック

| 処理 | 説明 |
|------|------|
| HTMLコメントタグ | `<!-- #BeginEditable "X" -->` と `<!-- #EndEditable -->` で囲まれた部分を抽出 |
| スコア抽出 | `<img src="N.gif">` の数値Nをスコア値として取得 |
| 星評価抽出 | `biz3_b3.gif`（1点）と `biz3_b3h.gif`（0.5点）の出現数から計算 |
| HTMLエンティティデコード | `&`、`"`、`<`、`>`、`&#039;`、`&nbsp;` を変換 |
| 自動段落分割 | 句点（。）で文章を分割し、4等分して段落を構成 |
| トラックリスト抽出 | `<tr><td align="right">番号</td>...` パターンのHTMLテーブルを解析 |
| 関連レビュー抽出 | `#BeginEditable "L"` 内の `<a href>` リンクからidentifier・アーティスト名・アルバム名を抽出 |

## ライセンス

このスクリプトは既存のプロジェクトの一部として提供されています。

---

Made with Bob