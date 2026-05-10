# add-review-to-all.js

レビューをindex、latest、cd-yearの3つのページに一括追加する統合スクリプトです。

## 概要

このスクリプトは以下の3つのスクリプトを連続実行します：

1. `add-review-to-index.js` - ホームページ（index.mdx）にレビューを追加
2. `add-review-to-latest.js` - 最新レビューページ（latest/index.mdx）にレビューを追加
3. `add-review-to-cd-year.js` - 年別レビューページ（cd/YYYY.mdx）にレビューを追加

## 使用方法

### 基本的な使い方

```bash
node BOB/add-review-to-all.js <review-name> <year>
```

### パラメータ

- `<review-name>` - レビューの識別子（例: addisonrae1, delasoul3）
- `<year>` - 追加先の年（4桁の数字、例: 2025）

## 実行例

### 例1: 2025年のレビューを追加

```bash
node BOB/add-review-to-all.js addisonrae1 2025
```

この場合、以下のファイルが更新されます：
- `src/pages/index.mdx` - ホームページに追加（最大4件）
- `src/pages/latest/index.mdx` - 最新レビューページに追加（最大10件）
- `src/pages/cd/2025.mdx` - 2025年のレビューページに追加

### 例2: 2024年のレビューを追加

```bash
node BOB/add-review-to-all.js delasoul3 2024
```

## 処理フロー

1. **ステップ 1/3**: `add-review-to-index.js` を実行
   - ホームページ（index.mdx）にレビューを追加
   - 最大4件のレビューを保持
   - 古いレビューは自動的に削除

2. **ステップ 2/3**: `add-review-to-latest.js` を実行
   - 最新レビューページ（latest/index.mdx）にレビューを追加
   - 最大10件のレビューを保持
   - 古いレビューは自動的に削除

3. **ステップ 3/3**: `add-review-to-cd-year.js` を実行
   - 指定された年のレビューページ（cd/YYYY.mdx）にレビューを追加
   - 降順（新しい順）で追加

## 更新されるファイル

- `src/pages/index.mdx` - ホームページ
- `src/pages/latest/index.mdx` - 最新レビューページ
- `src/pages/cd/{year}.mdx` - 年別レビューページ

## 前提条件

以下のファイルが存在している必要があります：

1. レビューファイル
   - `src/pages/review/{review-name}.mdx` - カード版
   - `src/pages/review/{review-name}A.mdx` - 短縮版

2. 年別ページ
   - `src/pages/cd/{year}.mdx` - 追加先の年のページ

## 次のステップ

スクリプト実行後、以下の作業を検討してください：

1. **更新されたファイルの確認**
   - 各ファイルが正しく更新されているか確認

2. **Best50への追加**（トップ10のレビューの場合）
   ```bash
   node BOB/add-review-to-best50.js <review-name> <year>
   ```

3. **Best50テーブルへの追加**（11位以降のレビューの場合）
   ```bash
   node BOB/add-review-to-best50-table-only.js <review-name> <year>
   ```

## エラーハンドリング

- レビュー名または年が指定されていない場合、エラーメッセージと使用方法が表示されます
- 年の形式が正しくない場合（4桁の数字でない場合）、エラーが表示されます
- いずれかのステップが失敗した場合、処理は中断され、エラーメッセージが表示されます
- 各ステップは順次実行されるため、前のステップが成功しないと次のステップは実行されません

## 関連スクリプト

### 個別実行スクリプト
- `add-review-to-index.js` - ホームページへの追加（ステップ1）
- `add-review-to-latest.js` - 最新レビューページへの追加（ステップ2）
- `add-review-to-cd-year.js` - 年別ページへの追加（ステップ3）

### 追加の関連スクリプト
- `add-review-to-best50.js` - Best50への追加（トップ10）
- `add-review-to-best50-table-only.js` - Best50テーブルへの追加（11位以降）
- `add-review-to-related.js` - 関連レビューの追加

## 注意事項

- このスクリプトは3つのスクリプトを順次実行するため、すべてのスクリプトが正常に動作する必要があります
- 既存のファイルは更新されるため、実行前にバックアップを取ることを推奨します
- レビューファイル（.mdxとA.mdx）が存在しない場合、エラーが発生します
- 指定された年のページ（cd/YYYY.mdx）が存在しない場合、エラーが発生します

## トラブルシューティング

### エラー: レビューファイルが見つからない
- `src/pages/review/{review-name}.mdx` と `{review-name}A.mdx` が存在することを確認してください
- レビュー名のスペルが正しいか確認してください

### エラー: 年別ページが見つからない
- `src/pages/cd/{year}.mdx` が存在することを確認してください
- 年の形式が4桁の数字であることを確認してください

### エラー: スクリプトの実行に失敗
- Node.jsがインストールされていることを確認してください
- プロジェクトルートから実行していることを確認してください

## Made with Bob