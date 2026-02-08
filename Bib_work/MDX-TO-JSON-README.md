# 既存のMDXレビューファイルからJSON設定ファイルを生成するスクリプト

## 概要

`mdx-to-json.js` は、既存のMDXレビューファイル（L版）を読み込んで、`generate-review-from-json.js` で使用できるJSON設定ファイルを生成するスクリプトです。

既存のレビューをテンプレートとして再利用したり、バックアップ用のJSON設定を作成したりする際に便利です。

## 使用方法

### 基本的な使い方

```bash
node mdx-to-json.js <mdx-file-path>
```

例：
```bash
node mdx-to-json.js src/pages/review/beyonce5L.mdx
```

これにより、`beyonce5-review-config.json` が自動生成されます。

### 出力ファイル名を指定する場合

```bash
node mdx-to-json.js <mdx-file-path> <出力ファイル名>
```

例：
```bash
node mdx-to-json.js src/pages/review/beyonce5L.mdx beyonce5-config.json
```

### 実行権限を付与して使用

```bash
chmod +x mdx-to-json.js
./mdx-to-json.js src/pages/review/beyonce5L.mdx
```

## 抽出される情報

スクリプトは以下の情報を自動的に抽出します：

### フロントマターから
- **title** → artistName, albumTitle に分割
- **keywords** → artistNameJa, albumTitleJa を抽出

### 本文から
- **レビュー本文** (reviewPara1-4) - `<p>` タグ内のテキストを `<br/>` で分割
- **スコアカード** (score1-4) - `<SliderJS1-4>` コンポーネントの value 属性
- **プロデューサー情報** (producers) - `<h3>Producers</h3>` セクション
- **ゲスト情報** (guests) - `<h3>Guests</h3>` セクション
- **トラックリスト** (tracks) - Markdownテーブルから抽出
- **関連レビュー** (relatedReviews) - import文から抽出

### リンク情報
- **Amazon.comリンク** (amazonCom)
- **Amazon.co.jpリンク** (amazonJp)
- **Apple Musicリンク** (appleMusic)

### その他
- **Best50情報** (best50Year, best50Rank) - `<Link to="/best50/...">` から抽出
- **識別子** (identifier) - ファイル名から自動生成（末尾のLを除去）

## 手動編集が必要な項目

生成されたJSONファイルには、以下の項目を確認・編集する必要がある場合があります：

1. **albumNumber** - アルバム番号（デフォルトは "1"）
2. **reviewPara1-4** - レビュー本文の段落分割が適切か確認
3. **producers** - 改行が適切に保持されているか確認
4. **その他の抽出情報** - 正確性を確認

## ワークフロー例

### 1. 既存のMDXファイルからJSONを生成

```bash
node mdx-to-json.js src/pages/review/beyonce5L.mdx
```

出力例：
```
============================================================
MDXファイルからJSON設定ファイル生成スクリプト
============================================================
入力ファイル: src/pages/review/beyonce5L.mdx

MDXファイルを解析中...
✓ 解析完了

============================================================
✅ JSON設定ファイルを生成しました！
============================================================
出力ファイル: beyonce5-review-config.json

抽出された情報:
  アーティスト: Beyoncé (ビヨンセ)
  アルバム: Lemonede (レモネード)
  識別子: beyonce5
  トラック数: 12
  Best50: 2016年 1位
  関連レビュー: 2件
```

### 2. 生成されたJSONファイルを確認・編集

`beyonce5-review-config.json` を開いて内容を確認：

```json
{
  "artistName": "Beyoncé",
  "artistNameJa": "ビヨンセ",
  "albumTitle": "Lemonede",
  "albumTitleJa": "レモネード",
  "albumNumber": "6",  // ← 6作目なので修正
  "identifier": "beyonce5",
  ...
}
```

### 3. JSONから新しいレビューページを生成（必要に応じて）

```bash
node generate-review-from-json.js beyonce5-review-config.json
```

### 4. 元のファイルと比較

```bash
diff src/pages/review/beyonce5L.mdx src/pages/review/beyonce5L.mdx.new
```

## 使用例

### 既存レビューをテンプレートとして使用

1. 似たアーティストの既存レビューからJSONを生成
2. JSONファイルを編集して新しいアルバム情報に更新
3. `generate-review-from-json.js` で新しいレビューページを生成

```bash
# 1. 既存レビューからJSONを生成
node mdx-to-json.js src/pages/review/beyonce5L.mdx beyonce-template.json

# 2. JSONを編集（新しいアルバム情報に更新）
# エディタで beyonce-template.json を編集

# 3. 新しいレビューページを生成
node generate-review-from-json.js beyonce-template.json
```

### バックアップ用JSON設定の作成

既存のレビューファイルからJSON設定を抽出してバックアップ：

```bash
# 複数のレビューファイルからJSONを生成
for file in src/pages/review/*L.mdx; do
  node mdx-to-json.js "$file"
done
```

## 注意事項

### レビュー本文の段落分割

- MDXファイルで `<br/>` タグで区切られたテキストは、自動的に改行で分割されます
- 分割された段落が4つ未満の場合、空の段落が含まれる可能性があります
- 必要に応じて手動で段落を調整してください

### プロデューサー情報の改行

- `<br/>` タグは改行文字（`\n`）に変換されます
- JSONファイル内では改行として保存されますが、表示時に適切に処理されます

### トラックリストの抽出

- Markdownテーブル形式のトラックリストのみ対応
- テーブルのヘッダー行は無視されます
- 列の順序: No. | Title | Composers | Performer | Time

### 関連レビューの抽出

- `import Review1 from "../review/xxx.mdx";` 形式のimport文から抽出
- 変数名（Review1, Review2など）は無視され、ファイル名のみが抽出されます

## トラブルシューティング

### エラー: "ファイルが見つかりません"

- ファイルパスが正しいか確認してください
- 相対パスまたは絶対パスを使用してください

### 情報が正しく抽出されない

- MDXファイルの構造が想定と異なる可能性があります
- 生成されたJSONファイルを手動で確認・修正してください

### レビュー本文が1つの段落にまとまっている

- 元のMDXファイルで `<br/>` タグが使用されていない可能性があります
- JSONファイルを手動で編集して段落を分割してください

### トラックリストが空

- Markdownテーブルの形式が想定と異なる可能性があります
- 手動でトラック情報を追加してください

## 対応しているMDXファイル構造

このスクリプトは、`generate-review-from-json.js` で生成されたL版MDXファイルの構造に対応しています：

```mdx
---
title: "Artist / Album"
description: "Album Review of Artist / Album"
keywords: "Artist, Album, アーティスト, アルバム"
---

import ...

<p className="largeP">Album Review</p>
<h1>...</h1>
<p className="largeP">
  <Link to="/best50/2016/">2016 Black Music Best No.1</Link>
</p>

<Row>
  <Column>
    <ImageCard>...</ImageCard>
  </Column>
  <Column>
    <p>
      レビュー本文
      <br/>段落2
      <br/>段落3
    </p>
    <div>
      <Button href="...">amazon.com</Button>
      ...
    </div>
  </Column>
</Row>

<Row>
  <Column>
    <h3>Score card</h3>
    <SliderJS1 value="5" />
    ...
  </Column>
  <Column>
    <h3>Producers</h3>
    <p>...</p>
    <h3>Guests</h3>
    <p>...</p>
  </Column>
</Row>

<h3>Tracks</h3>
| No. | Title | Composers | Performer | Time |
| --- | ----- | --------- | --------- | ---- |
| 1   | ...   | ...       | ...       | ...  |

<h3>Other Reviews</h3>
<Row>...</Row>
```

## 関連ファイル

- `generate-review-from-json.js` - JSONからレビューページを生成するスクリプト
- `scrape-review-to-json.js` - WebページからJSON設定を生成するスクリプト
- `GENERATE-REVIEW-README.md` - レビュー生成スクリプトのドキュメント
- `SCRAPE-REVIEW-README.md` - Webスクレイピングスクリプトのドキュメント

## 技術詳細

### 使用している技術

- Node.js標準ライブラリ（fs, path）
- 正規表現によるMDXパース
- JSONファイル生成

### 抽出ロジック

1. **フロントマター抽出** - `---` で囲まれたYAML部分を解析
2. **正規表現マッチング** - 特定のパターンに基づいて情報を抽出
3. **コンポーネント属性抽出** - React/MDXコンポーネントの属性値を取得
4. **Markdownテーブルパース** - パイプ区切りのテーブルを解析

## ライセンス

このスクリプトは既存のプロジェクトの一部として提供されています。

---

Made with Bob