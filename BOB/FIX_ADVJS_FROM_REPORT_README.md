# Fix AdvJS Statements from Report

このスクリプトは、`check_missing_advjs_imports.js`で生成されたレポートファイルを読み込み、不足しているファイルに自動的に必須ステートメントを追加します。

## 使い方

### 基本的な使い方

```bash
node fix_advjs_from_report.js <レポートファイル>
```

### 例

```bash
# 'b'で始まるファイルのレポートから修正
node fix_advjs_from_report.js missing_advjs_imports_b_files.txt

# 'a'で始まるファイルのレポートから修正
node fix_advjs_from_report.js missing_advjs_imports_a_files.txt
```

## ワークフロー

### ステップ1: 不足しているファイルをチェック

```bash
node check_missing_advjs_imports.js b
```

これにより`missing_advjs_imports_b_files.txt`が生成されます。

### ステップ2: レポートファイルを使って修正

```bash
node fix_advjs_from_report.js missing_advjs_imports_b_files.txt
```

### ステップ3: 修正を確認

```bash
node check_missing_advjs_imports.js b
```

すべてのファイルが修正されていることを確認します。

## スクリプトが行うこと

1. **レポートファイルを読み込み**
   - "Files MISSING these statements"セクションからファイルリストを抽出

2. **各ファイルに対して以下を実行**
   - `import AdvJS2 from "../review/adv2";` を追加（SliderJS4の後）
   - `import AdvJS3 from "../review/adv3";` を追加（SliderJS4の後）
   - `<AdvJS2/>` を追加（最後のButtonの後）
   - `<AdvJS3 />` を追加（ファイルの最後）

3. **結果を表示**
   - 成功したファイル数
   - エラーが発生したファイル（あれば）

## 出力例

```bash
$ node fix_advjs_from_report.js missing_advjs_imports_b_files.txt
Reading report file: missing_advjs_imports_b_files.txt

Found 13 files to fix:

  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  3. bigkrit3L.mdx
  4. blackmilk1L.mdx
  5. blackpantherL.mdx
  6. bloodorange2L.mdx
  7. bloodorange3L.mdx
  8. bloodorange4L.mdx
  9. bloodorange5L.mdx
  10. brandoncoleman1L.mdx
  11. brandy5L.mdx
  12. brysontiller1L.mdx
  13. bustarhymes6L.mdx

✓ Fixed: banksandsteelz1L.mdx
✓ Fixed: bigboi3L.mdx
✓ Fixed: bigkrit3L.mdx
✓ Fixed: blackmilk1L.mdx
✓ Fixed: blackpantherL.mdx
✓ Fixed: bloodorange2L.mdx
✓ Fixed: bloodorange3L.mdx
✓ Fixed: bloodorange4L.mdx
✓ Fixed: bloodorange5L.mdx
✓ Fixed: brandoncoleman1L.mdx
✓ Fixed: brandy5L.mdx
✓ Fixed: brysontiller1L.mdx
✓ Fixed: bustarhymes6L.mdx

============================================================
Summary:
Successfully fixed: 13 files
Errors: 0 files

✓ All files have been successfully updated!

You can verify the changes by running:
  node check_missing_advjs_imports.js b
```

## エラーハンドリング

### レポートファイルが指定されていない

```bash
$ node fix_advjs_from_report.js
Error: Please provide a report file as an argument
Usage: node fix_advjs_from_report.js <report_file.txt>
Example: node fix_advjs_from_report.js missing_advjs_imports_b_files.txt
```

### レポートファイルが見つからない

```bash
$ node fix_advjs_from_report.js nonexistent.txt
Error: Report file not found: nonexistent.txt
```

### 修正が必要なファイルがない

```bash
$ node fix_advjs_from_report.js missing_advjs_imports_b_files.txt
Reading report file: missing_advjs_imports_b_files.txt

No files need to be fixed! All files already have the required statements.
```

## 完全なワークフロー例

```bash
# 1. 'a'で始まるファイルをチェック
node check_missing_advjs_imports.js a

# 出力: missing_advjs_imports_a_files.txt
# 結果: 22ファイル中3ファイルが不足

# 2. レポートから自動修正
node fix_advjs_from_report.js missing_advjs_imports_a_files.txt

# 出力: 3ファイルを修正

# 3. 再度チェックして確認
node check_missing_advjs_imports.js a

# 結果: 22ファイル中0ファイルが不足（すべて修正済み）
```

## 注意事項

- スクリプトはプロジェクトのルートディレクトリから実行する必要があります
- 修正前にバックアップを取ることをお勧めします
- スクリプトは既存のコードを上書きするため、慎重に使用してください
- 修正後は必ず`check_missing_advjs_imports.js`で確認してください

## トラブルシューティング

### ファイルが見つからない

```
✗ Error: File not found: filename.mdx
```

→ ファイルが`src/pages/review`ディレクトリに存在することを確認してください

### 修正が適用されない

→ ファイルの構造が想定と異なる可能性があります。手動で確認してください

## 関連スクリプト

- **check_missing_advjs_imports.js** - 不足しているファイルをチェック
- **fix_advjs_from_report.js** - レポートから自動修正（このスクリプト）
- **CHECK_ADVJS_IMPORTS_README.md** - チェックスクリプトの詳細ドキュメント