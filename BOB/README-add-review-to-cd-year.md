# Add Review to CD Year Page Script

このスクリプトは、新しいレビューを `src/pages/cd/YYYY.mdx`（年別レビューページ）に自動的に追加します。

## 使い方

```bash
node Bob/add-review-to-cd-year.js <review-name> <year>
```

### 例

```bash
node Bob/add-review-to-cd-year.js addisonrae1 2025
```

## 動作

このスクリプトは以下の処理を自動的に行います：

1. **レビューファイルの存在確認**
   - `src/pages/review/<review-name>.mdx`
   - `src/pages/review/<review-name>A.mdx`
   - 両方のファイルが存在しない場合はエラーを表示

2. **最高のレビュー番号を検出**
   - 既存のインポート文から最高の Review 番号を見つける
   - 新しいレビューは次の番号として追加される

3. **インポート文の追加**
   - 新しいレビューを最高番号+1として最初に追加
   - 例: 既存が Review28 まであれば、Review29 として追加

4. **すべての Review 番号をシフト**
   - 既存のすべての Row 内の Review 番号を1つずつ増やす
   - Review28 → Review29, Review27 → Review28, ..., Review1 → Review2

5. **新しいレビューを最初の Row に追加**
   - 最初の Row の先頭に新しいレビュー（最高番号）を追加
   - 各 Row は4つの Column を持つ

6. **最後に新しい Row を追加**
   - 最も古いレビュー (Review1) 用の新しい Row を最後に追加
   - この Row には Review1 のみが含まれる

7. **すべてのレビューを保持**
   - レビューは削除されず、すべて保持されます
   - 余分な Column は追加されません

## 年別ページの特徴

- **制限なし**: 年別ページではレビュー数に制限がありません
- **すべて保持**: 既存のレビューはすべて保持され、新しい Row が追加されます
- **降順表示**: 最新のレビューが最初に表示されます

## 他のスクリプトとの違い

- **add-review-to-latest.js**: latest/index.mdx（最大10件、古いものは削除）
- **add-review-to-index.js**: index.mdx（最大4件、古いものは削除）
- **add-review-to-cd-year.js**: cd/YYYY.mdx（制限なし、すべて保持）

## 前提条件

- Node.js がインストールされていること
- レビューファイル（`.mdx` と `A.mdx`）が `src/pages/review/` ディレクトリに存在すること
- 指定した年のファイル（例: `2025.mdx`）が `src/pages/cd/` ディレクトリに存在すること

## 注意事項

- スクリプトは `src/pages/cd/YYYY.mdx` を直接上書きします
- 実行前にバックアップを取ることをお勧めします
- レビュー名にはファイル拡張子（`.mdx`）を含めないでください
- 年は4桁の数字で指定してください（例: 2025）

## エラーメッセージ

- `Error: Please provide both review name and year` - レビュー名または年が指定されていません
- `Error: Year file not found` - 指定された年のファイルが見つかりません
- `Error: Review file not found` - 指定されたレビューファイルが見つかりません

## 成功時の出力

```
✓ Successfully added addisonrae1 to cd/2025.mdx
  - Added import for Review29
  - Shifted all existing reviews down by 1
  - Added Review29 to the first Row
  - Added new Row at the end for Review1
  - Total reviews: 29
```

## レイアウト

年別ページでは、各 Row に4つの Column（レビュー）が表示されます：

```
Row 1: Review29, Review28, Review27, Review26
Row 2: Review25, Review24, Review23, Review22
Row 3: Review21, Review20, Review19, Review18
...
Row N: Review1 (単独)
```

**重要な注意点:**
- 各 Row は正確に4つの Column を持ちます
- 新しいレビューは最初の Row の先頭に追加されます
- 既存のレビューは自動的に1つずつシフトされます
- 最後の Row には Review1 のみが単独で表示されます
- 余分な Column は追加されません