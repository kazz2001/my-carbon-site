# add-review-to-best50-table-only.js

テーブルのみにレビューリンクを追加するスクリプト（Best 11位以降用）

## 概要

このスクリプトは、`src/pages/best50/[year].mdx`ファイルのテーブル部分にのみレビューリンクを追加します。importやRowセクションは追加しません。主にBest 11位以降のエントリーに使用します。

## 機能

1. レビューLファイル（例：`oliviadean1L.mdx`）から以下の情報を自動抽出：
   - 順位（Best No.X）
   - アーティスト名
   - アルバム名

2. テーブルエントリーをリンク形式に更新：
   ```markdown
   | 11  | Olivia Dean - The Art of Loving |
   ```
   ↓
   ```markdown
   | 11  | [Olivia Dean - The Art of Loving](/review/oliviadean1L/) |
   ```

3. Prettierで自動フォーマット

## 使用方法

### 基本的な使い方（2025年のファイルに追加）

```bash
node Bob/add-review-to-best50-table-only.js oliviadean1
```

### 年を指定する場合

```bash
node Bob/add-review-to-best50-table-only.js oliviadean1 2024
```

## パラメータ

- `reviewId` (必須): レビューID（例：`oliviadean1`）
- `year` (オプション): 年（デフォルト：`2025`）

## 前提条件

以下のファイルが存在する必要があります：

1. レビューLファイル：`src/pages/review/[reviewId]L.mdx`
   - 例：`src/pages/review/oliviadean1L.mdx`
   - frontmatterに`title: "Artist / Album"`形式のタイトルが必要
   - 本文に`Best No.X`形式の順位表記が必要

2. Best50ファイル：`src/pages/best50/[year].mdx`
   - 例：`src/pages/best50/2025.mdx`
   - テーブルに該当する順位のエントリーが存在する必要があります

## 実行例

```bash
$ node Bob/add-review-to-best50-table-only.js oliviadean1
✓ Extracted from oliviadean1L.mdx:
  - Position: 11
  - Artist: Olivia Dean
  - Album: The Art of Loving
✓ Updated table entry with link to /review/oliviadean1L/
✓ Successfully updated 2025.mdx
✓ Added link for Olivia Dean - The Art of Loving (oliviadean1) at position 11

⏳ Formatting file with Prettier...
✓ File formatted successfully
```

## エラーハンドリング

- レビューLファイルが見つからない場合：エラーメッセージを表示
- Best50ファイルが見つからない場合：エラーメッセージを表示
- テーブルエントリーが見つからない場合：エラーメッセージを表示
- すでにリンクが設定されている場合：スキップして成功メッセージを表示

## 注意事項

- このスクリプトは**テーブルのみ**を更新します
- importやRowセクションは追加されません
- Best 1-10位のエントリーには`add-review-to-best50.js`を使用してください
- レビューLファイルのtitleは`"Artist / Album"`形式である必要があります
- レビューLファイルに`Best No.X`の記載が必要です

## 関連スクリプト

- `add-review-to-best50.js`: Best 1-10位用（import、Row、テーブルすべてを追加）
- `add-review-to-cd-year.js`: CD年別ページへの追加
- `add-review-to-index.js`: インデックスページへの追加
- `add-review-to-latest.js`: 最新ページへの追加

## Made with Bob