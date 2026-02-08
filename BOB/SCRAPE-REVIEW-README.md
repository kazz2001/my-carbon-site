# Webページからアルバムレビュー情報を抽出するスクリプト

## 概要

`scrape-review-to-json.js` は、bm.planetky.com のアルバムレビューページから情報を自動抽出し、`generate-review-from-json.js` で使用できるJSON設定ファイルを生成するスクリプトです。

## 使用方法

### 基本的な使い方

```bash
node scrape-review-to-json.js <URL>
```

例：
```bash
node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

これにより、`Bob/Bob_output/durandbernerr1-review-config.json` が自動生成されます。

**注意**: 出力ファイルは `Bob/Bob_output` フォルダー内に保存されます。このフォルダーが存在しない場合は自動的に作成されます。

### 出力ファイル名を指定する場合

```bash
node scrape-review-to-json.js <URL> <出力ファイル名>
```

例：
```bash
node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html custom-config.json
```

この場合、`Bob/Bob_output/custom-config.json` が生成されます。

### 実行権限を付与して使用

```bash
chmod +x scrape-review-to-json.js
./scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
```

## 抽出される情報

スクリプトは以下の情報を自動的に抽出します：

- **アーティスト名** (artistName)
- **アルバムタイトル** (albumTitle)
- **識別子** (identifier) - URLから自動生成
- **レビュー本文** (reviewPara1-4) - 4つの段落に自動分割
- **スコアカード** (score1-4) - 画像ファイル名から抽出
- **トラックリスト** (tracks) - 曲番号、タイトル、作曲者、演奏者、時間
- **プロデューサー情報** (producers)
- **ゲスト情報** (guests)
- **Amazon.comリンク** (amazonCom)
- **Apple Musicリンク** (appleMusic)
- **Best50情報** (best50Year, best50Rank)

## 手動編集が必要な項目

生成されたJSONファイルには、以下の項目を手動で編集する必要があります：

1. **artistNameJa** - 日本語アーティスト名
2. **albumTitleJa** - 日本語アルバム名
3. **albumNumber** - アルバム番号（何枚目のアルバムか）
4. **amazonJp** - Amazon.co.jpのリンク
5. **relatedReviews** - 関連レビューの配列（例: `["artist1", "artist2"]`）

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

✓ 出力ディレクトリを作成しました: Bob/Bob_output

============================================================
✅ JSON設定ファイルを生成しました！
============================================================
出力ファイル: Bob/Bob_output/durandbernerr1-review-config.json

抽出された情報:
  アーティスト: Durand Bernerr
  アルバム: BLOOM
  識別子: durandbernerr1
  トラック数: 15
  Best50: 2025年 28位
```

### 2. 生成されたJSONファイルを編集

`Bob/Bob_output/durandbernerr1-review-config.json` を開いて、手動編集が必要な項目を入力：

```json
{
  "artistName": "Durand Bernarr",
  "artistNameJa": "デュランド・バーナー",  // ← 追加
  "albumTitle": "BLOOM",
  "albumTitleJa": "ブルーム",  // ← 追加
  "albumNumber": "1",  // ← 確認・修正
  "identifier": "durandbernerr1",
  ...
  "amazonJp": "https://amzn.to/XXXXXXX",  // ← 更新
  "relatedReviews": ["artist1", "artist2"],  // ← 追加
  ...
}
```

### 3. レビューページを生成

```bash
node generate-review-from-json.js Bob/Bob_output/durandbernerr1-review-config.json
```

### 4. アルバムジャケット画像を配置

```bash
# 画像ファイルを適切な場所に配置
cp /path/to/album-cover.jpg src/images/cd/durandbernerr1L.jpg
```

## 注意事項

- スクリプトはbm.planetky.comの特定のHTMLフォーマットに依存しています
- Webページの構造が変更された場合、スクリプトの修正が必要になる可能性があります
- HTMLエンティティ（`"`, `&` など）は自動的にデコードされます
- レビュー本文は自動的に4つの段落に分割されますが、必要に応じて手動で調整してください

## トラブルシューティング

### エラー: "HTMLを取得できません"

- インターネット接続を確認してください
- URLが正しいか確認してください
- Webサイトがアクセス可能か確認してください

### 情報が正しく抽出されない

- Webページの構造が変更されている可能性があります
- 生成されたJSONファイルを手動で確認・修正してください

### トラックリストが空

- HTMLのトラックリスト部分のフォーマットが想定と異なる可能性があります
- 手動でトラック情報を追加してください

## 関連ファイル

- `generate-review-from-json.js` - JSONからレビューページを生成するスクリプト
- `GENERATE-REVIEW-README.md` - レビュー生成スクリプトのドキュメント
- `review-template-A.mdx` - A版テンプレート
- `review-template-L.mdx` - L版テンプレート

## 技術詳細

### 使用している技術

- Node.js標準ライブラリ（https, http, fs, path）
- 正規表現によるHTMLパース
- JSONファイル生成

### 抽出ロジック

1. **HTMLコメントタグ** - `<!-- #BeginEditable "X" -->` と `<!-- #EndEditable -->` で囲まれた部分を抽出
2. **正規表現マッチング** - 特定のパターンに基づいて情報を抽出
3. **HTMLエンティティデコード** - 特殊文字を適切に変換
4. **自動段落分割** - 句点（。）で文章を分割し、4つの段落に再構成

## ライセンス

このスクリプトは既存のプロジェクトの一部として提供されています。

---

Made with Bob