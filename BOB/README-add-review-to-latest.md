# Add Review to Latest Script

このスクリプトは、新しいレビューを `src/pages/latest/index.mdx` に自動的に追加します。

## 使い方

```bash
node add-review-to-latest.js <review-name>
```

### 例

```bash
node add-review-to-latest.js addisonrae1
```

## 動作

このスクリプトは以下の処理を自動的に行います：

1. **レビューファイルの存在確認**
   - `src/pages/review/<review-name>.mdx`
   - `src/pages/review/<review-name>A.mdx`
   - 両方のファイルが存在しない場合はエラーを表示

2. **インポート文の追加**
   - 新しいレビューを `Review1` と `Review1A` として追加
   - 既存のすべてのレビューを1つずつ下にシフト（Review1 → Review2, Review2 → Review3, など）

3. **Row コンポーネントの追加**
   - 新しいレビュー用の Row を最初に追加
   - 既存のすべての Row 内の Review 番号を1つずつ増やす

4. **古いレビューの削除**
   - Review11 と Review11A を自動的に削除（最大10件のレビューを保持）

## 前提条件

- Node.js がインストールされていること
- レビューファイル（`.mdx` と `A.mdx`）が `src/pages/review/` ディレクトリに存在すること

## 注意事項

- スクリプトは `src/pages/latest/index.mdx` を直接上書きします
- 実行前にバックアップを取ることをお勧めします
- レビュー名にはファイル拡張子（`.mdx`）を含めないでください

## エラーメッセージ

- `Error: Please provide a review name` - レビュー名が指定されていません
- `Error: Review file not found` - 指定されたレビューファイルが見つかりません
- `Error: Could not find import section` - index.mdx の構造が想定と異なります

## 成功時の出力

```
✓ Successfully added addisonrae1 to latest/index.mdx
  - Added imports for Review1 and Review1A
  - Shifted all existing reviews down by 1
  - Removed Review11 and Review11A (keeping max 10 reviews)
```

## 設定

スクリプト内の `MAX_REVIEWS` 定数を変更することで、保持するレビューの最大数を調整できます（デフォルト: 10）。
  - Added Row component for the new review