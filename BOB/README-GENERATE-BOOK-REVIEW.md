# 書籍レビュー生成スクリプト

Amazon URLから書籍情報を自動取得し、書籍レビュー用のMDXファイル（A版とL版）を生成するスクリプトです。

## 機能

- Amazon商品ページから書籍情報を自動取得
- 書籍レビュー用のMDXファイル（A版・L版）を自動生成
- BOB/Bob_outputとsrc/pages/bookの両方にファイルを出力

## 必要な環境

- Node.js (v14以上推奨)
- puppeteer パッケージ

## インストール

```bash
npm install puppeteer
```

## 使用方法

### 基本的な使い方

```bash
node BOB/generate-book-review.js "<Amazon URL>" [出力ファイル名]
```

**パラメーター:**
- `<Amazon URL>` (必須): Amazon商品ページのURL
- `[出力ファイル名]` (オプション): 生成されるファイルの名前（拡張子なし）
  - 指定しない場合は、書籍タイトルから自動生成されます

### 例

#### 1. ファイル名を自動生成（従来の方法）

```bash
node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898"
```

または

```bash
node BOB/generate-book-review.js "https://www.amazon.co.jp/%E3%83%92%E3%83%83%E3%83%97%E3%83%9B%E3%83%83%E3%83%97%E5%90%8D%E7%9B%A4100-%E5%B0%8F%E6%9E%97%E9%9B%85%E6%98%8E/dp/4781624898"
```

#### 2. カスタムファイル名を指定

```bash
node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898" "hiphopmeiban100"
```

この場合、以下のファイルが生成されます:
- `hiphopmeiban100L.mdx` (L版)
- `hiphopmeiban100A.mdx` (A版)

## 取得される情報

スクリプトは以下の情報をAmazonページから自動取得します:

- **タイトル**: 書籍のタイトル
- **著者**: 著者名
- **出版社**: 出版社名
- **ページ数**: ページ数
- **サイズ**: 書籍のサイズ（cm）
- **発売日**: 発売日（YYYY/MM/DD形式）
- **価格**: 価格（円）
- **ISBN**: ISBN-13コード
- **Amazon URL**: 商品ページのURL

## 生成されるファイル

### 1. L版（詳細版）

詳細な書籍情報とレビューを含む完全版のページです。

**ファイル名**: `{書籍名}L.mdx`

**出力先**:
- `BOB/Bob_output/{書籍名}L.mdx`
- `src/pages/book/{書籍名}L.mdx`

**内容**:
- 書籍タイトル
- 著者情報
- 出版社情報
- ページ数・サイズ
- 発売日
- 価格
- Amazon購入リンク
- レビュー本文（手動で追加が必要）

### 2. A版（カード版）

書籍をカード形式で表示し、L版へのリンクを提供します。

**ファイル名**: `{書籍名}A.mdx`

**出力先**:
- `BOB/Bob_output/{書籍名}A.mdx`
- `src/pages/book/{書籍名}A.mdx`

**内容**:
- ArticleCardコンポーネント
- 書籍画像
- L版へのリンク

## 実行後の手順

### 1. 書籍画像の配置

生成されたファイルは書籍の表紙画像を参照します。以下のパスに画像ファイルを配置してください:

```
src/images/books/{書籍名}.jpg
```

例:
```
src/images/books/hiphopmeiban100.jpg
```

### 2. レビュー本文の追加

生成されたL版ファイル（`{書籍名}L.mdx`）を開き、以下の部分を編集してください:

```mdx
<p>
  <b> - [ここに書籍の説明文を追加してください] -</b>
  <br />
  <br />
  [ここにレビュー本文を追加してください]
</p>
```

実際の書籍の説明文とレビューに置き換えてください。

### 3. ファイル名について

**自動生成の場合:**
- ファイル名は書籍タイトルから自動生成されます
- 日本語タイトルの場合、適切な英数字名に変換されます
- 自動生成されたファイル名が適切でない場合は、手動でリネームしてください

**カスタムファイル名を指定する場合:**
- スクリプト実行時に第2引数としてファイル名を指定できます
- 日本語タイトルの書籍の場合、カスタムファイル名の指定を推奨します
- 例: `node BOB/generate-book-review.js "URL" "hiphopmeiban100"`

## 出力例

### コンソール出力

```
Amazonページにアクセス中...
タイトル: ヒップホップ名盤100
著者: 小林雅明
詳細情報: { publisher: 'イースト・プレス', pages: '232', ... }
価格: 1980

取得した書籍情報:
タイトル: ヒップホップ名盤100
著者: 小林雅明
出版社: イースト・プレス
ページ数: 232
サイズ: 18.8 x 12.8 x 1.7 cm
発売日: 2025/11/26
価格: 1980
ISBN: 978-4781624891
ファイル名: hiphopmeiban100

✓ ファイルを生成しました:
  - BOB/Bob_output/hiphopmeiban100L.mdx
  - BOB/Bob_output/hiphopmeiban100A.mdx
  - src/pages/book/hiphopmeiban100L.mdx
  - src/pages/book/hiphopmeiban100A.mdx

注意: 書籍の表紙画像を以下のパスに配置してください:
  src/images/books/hiphopmeiban100.jpg
```

## トラブルシューティング

### エラー: "puppeteer not found"

puppeteerがインストールされていません。以下のコマンドでインストールしてください:

```bash
npm install puppeteer
```

### エラー: "タイトル取得エラー"

Amazonページの構造が変更された可能性があります。URLが正しいか確認してください。

### 情報が一部取得できない

Amazonページによっては、一部の情報が取得できない場合があります。
生成されたファイルを手動で編集して、不足している情報を追加してください。

### ファイル名が適切でない

自動生成されるファイル名が適切でない場合は、生成後に手動でリネームしてください。
その際、A版ファイル内のL版へのリンクも更新する必要があります。

## 注意事項

- このスクリプトはAmazon.co.jpのページ構造に依存しています
- Amazonのページ構造が変更された場合、正常に動作しない可能性があります
- 取得した情報は必ず確認し、必要に応じて手動で修正してください
- 書籍画像は別途用意する必要があります
- レビュー本文は手動で追加する必要があります

## 関連ファイル

- `BOB/generate-book-review.js` - メインスクリプト
- `BOB/Bob_output/` - 生成されたファイルの出力先（作業用）
- `src/pages/book/` - 実際のページファイルの配置先
- `src/images/books/` - 書籍画像の配置先

## 参考

既存の書籍レビューファイルの例:
- `src/pages/book/afrofuturismL.mdx` - L版の例
- `src/pages/book/indieraparchiveA.mdx` - A版の例