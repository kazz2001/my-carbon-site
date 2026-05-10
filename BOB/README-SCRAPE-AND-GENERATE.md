# scrape-and-generate.js

Webページからアルバムレビュー情報を抽出してJSON設定ファイルを生成し、そのJSONから自動的にMDXファイルを生成する統合スクリプトです。

## 概要

このスクリプトは以下の2つのスクリプトを連続実行します：

1. `scrape-review-to-json.js` - Webページからレビュー情報を抽出してJSONファイルを生成
2. `generate-review-from-json.js` - JSONファイルからMDXファイル（.mdx、A.mdx、L.mdx）を生成

## 使用方法

### 基本的な使い方

```bash
node BOB/scrape-and-generate.js <URL>
```

### カスタムファイル名を指定する場合

```bash
node BOB/scrape-and-generate.js <URL> <output-filename.json>
```

## 実行例

### 例1: デフォルトのファイル名で実行

```bash
node BOB/scrape-and-generate.js https://bm.planetky.com/durandbernerr1.html
```

この場合、以下のファイルが生成されます：
- `BOB/Bob_output/durandbernerr1-review-config.json`
- `src/pages/review/durandbernerr1.mdx`
- `src/pages/review/durandbernerr1A.mdx`
- `src/pages/review/durandbernerr1L.mdx`

### 例2: カスタムファイル名で実行

```bash
node BOB/scrape-and-generate.js https://bm.planetky.com/durandbernerr1.html custom-config.json
```

この場合、以下のファイルが生成されます：
- `BOB/Bob_output/custom-config.json`
- `src/pages/review/durandbernerr1.mdx`
- `src/pages/review/durandbernerr1A.mdx`
- `src/pages/review/durandbernerr1L.mdx`

## 処理フロー

1. **ステップ 1/2**: `scrape-review-to-json.js` を実行
   - 指定されたURLからHTMLを取得
   - アルバム情報、レビュー本文、トラックリスト、関連レビューなどを抽出
   - `BOB/Bob_output/` ディレクトリにJSONファイルを生成

2. **ステップ 2/2**: `generate-review-from-json.js` を実行
   - 生成されたJSONファイルを読み込み
   - 3つのMDXファイル（カード版、A版、L版）を生成
   - `src/pages/review/` ディレクトリに出力

## 生成されるファイル

### JSONファイル
- `BOB/Bob_output/{identifier}-review-config.json`
  - レビュー情報を含む設定ファイル
  - 必要に応じて手動で編集可能

### MDXファイル
- `src/pages/review/{identifier}.mdx` - カード版（グリッド表示用）
- `src/pages/review/{identifier}A.mdx` - 短縮版（3-4段落）
- `src/pages/review/{identifier}L.mdx` - 完全版（フロントマター、スコアカード、トラックリスト付き）

## 次のステップ

スクリプト実行後、以下の作業が必要です：

1. **JSONファイルの編集**（必要に応じて）
   - `artistNameJa` - 日本語アーティスト名
   - `albumTitleJa` - 日本語アルバム名
   - `albumNumber` - アルバム番号
   - `amazonJp` - Amazon.co.jpリンク

2. **アルバムジャケット画像の配置**
   - `src/images/cd/{identifier}L.jpg` として画像を配置

3. **生成されたMDXファイルの確認・編集**
   - 必要に応じて内容を調整

## エラーハンドリング

- URLが指定されていない場合、エラーメッセージと使用方法が表示されます
- ステップ1が失敗した場合、ステップ2は実行されません
- 各ステップでエラーが発生した場合、適切なエラーメッセージが表示されます

## 関連スクリプト

- `scrape-review-to-json.js` - レビュー情報抽出（ステップ1）
- `generate-review-from-json.js` - MDXファイル生成（ステップ2）

## 注意事項

- このスクリプトは2つのスクリプトを順次実行するため、両方のスクリプトが正常に動作する必要があります
- 生成されたJSONファイルは自動的に次のステップの入力として使用されます
- 既存のファイルは上書きされるため、注意してください

## Made with Bob