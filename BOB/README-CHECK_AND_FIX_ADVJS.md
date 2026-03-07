# AdvJS Import Check and Fix - Integrated Script

このスクリプトは、AdvJSインポートステートメントのチェックと修正を1つのコマンドで実行する統合スクリプトです。

## 概要

以下の3つのステップを自動的に実行します：

1. **チェック**: `check_missing_advjs_imports.js`を実行して欠けているファイルを検出
2. **修正**: `fix_advjs_from_report.js`を実行して自動修正
3. **検証**: 再度チェックして修正が成功したか確認

## 使い方

### 基本的な使い方

```bash
node Bob/check_and_fix_advjs.js <先頭文字>
```

### 例

```bash
# 'b'で始まるファイルをチェック＆修正
node Bob/check_and_fix_advjs.js b

# 'a'で始まるファイルをチェック＆修正
node Bob/check_and_fix_advjs.js a

# 'd'で始まるファイルをチェック＆修正
node Bob/check_and_fix_advjs.js d
```

## 実行フロー

### ステップ1: チェック

```
================================================================================
AdvJS Import Check and Fix - Integrated Script
================================================================================
Target: Files starting with 'b' and ending with 'L.mdx'
================================================================================

STEP 1: Checking for missing AdvJS import statements...
--------------------------------------------------------------------------------
Executing: node "Bob/check_missing_advjs_imports.js" b

Checking files starting with 'b' and ending with 'L.mdx'...

Found 29 files to check

Results:
========
Total files checked: 29
Files missing statements: 13
Files with statements: 16

Report saved to: Bob/bob_output/missing_advjs_imports_b_files.txt

Files missing statements:
  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  ...
```

### ステップ2: 修正

```
================================================================================

STEP 2: Fixing missing AdvJS import statements...
--------------------------------------------------------------------------------
Executing: node "Bob/fix_advjs_from_report.js" "Bob/bob_output/missing_advjs_imports_b_files.txt"

Reading report file: Bob/bob_output/missing_advjs_imports_b_files.txt

Found 13 files to fix:

  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  ...

✓ Fixed: banksandsteelz1L.mdx
✓ Fixed: bigboi3L.mdx
...

============================================================
Summary:
Successfully fixed: 13 files
Errors: 0 files

✓ All files have been successfully updated!
```

### ステップ3: 検証

```
================================================================================

STEP 3: Verifying the fixes...
--------------------------------------------------------------------------------
Executing: node "Bob/check_missing_advjs_imports.js" b

Checking files starting with 'b' and ending with 'L.mdx'...

Found 29 files to check

Results:
========
Total files checked: 29
Files missing statements: 0
Files with statements: 29

Report saved to: Bob/bob_output/missing_advjs_imports_b_files.txt

================================================================================
✓ Process completed successfully!
================================================================================

Summary:
  1. Checked files for missing AdvJS statements
  2. Fixed all missing statements
  3. Verified that all files now have the required statements

Report file: Bob/bob_output/missing_advjs_imports_b_files.txt
================================================================================
```

## 修正が不要な場合

すべてのファイルが既に完璧な場合：

```bash
$ node Bob/check_and_fix_advjs.js a

================================================================================
AdvJS Import Check and Fix - Integrated Script
================================================================================
Target: Files starting with 'a' and ending with 'L.mdx'
================================================================================

STEP 1: Checking for missing AdvJS import statements...
--------------------------------------------------------------------------------
Executing: node "Bob/check_missing_advjs_imports.js" a

Checking files starting with 'a' and ending with 'L.mdx'...

Found 22 files to check

Results:
========
Total files checked: 22
Files missing statements: 0
Files with statements: 22

Report saved to: Bob/bob_output/missing_advjs_imports_a_files.txt

================================================================================

✓ No files need to be fixed! All files already have the required statements.

================================================================================
Process completed successfully!
================================================================================
```

## 利点

### 従来の方法（3つのコマンド）

```bash
# ステップ1: チェック
node Bob/check_missing_advjs_imports.js b

# ステップ2: 修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

# ステップ3: 検証
node Bob/check_missing_advjs_imports.js b
```

### 統合スクリプト（1つのコマンド）

```bash
# すべてを一度に実行
node Bob/check_and_fix_advjs.js b
```

### メリット

1. **簡単**: 1つのコマンドで完了
2. **自動化**: レポートファイルのパスを手動で入力する必要なし
3. **安全**: 各ステップの成功を確認してから次へ進む
4. **検証**: 修正後に自動的に再チェック
5. **視覚的**: 進行状況が明確に表示される

## エラーハンドリング

### 引数が指定されていない場合

```bash
$ node Bob/check_and_fix_advjs.js
Error: Please provide a starting letter as an argument
Usage: node Bob/check_and_fix_advjs.js <starting_letter>
Example: node Bob/check_and_fix_advjs.js b
```

### 無効な文字が指定された場合

```bash
$ node Bob/check_and_fix_advjs.js 123
Error: Starting letter must be a single alphabetic character
```

### チェックスクリプトでエラーが発生した場合

```bash
STEP 1: Checking for missing AdvJS import statements...
--------------------------------------------------------------------------------
Error running check script:
Error: Directory not found: src/pages/review
```

スクリプトは即座に終了し、エラーメッセージを表示します。

### 修正スクリプトでエラーが発生した場合

```bash
STEP 2: Fixing missing AdvJS import statements...
--------------------------------------------------------------------------------
Error running fix script:
✗ Error processing somefile.mdx: Permission denied
```

エラーの詳細が表示され、スクリプトは終了します。

### レポートファイルが見つからない場合

```bash
Error: Report file not found: Bob/bob_output/missing_advjs_imports_b_files.txt
```

## 使用例

### 例1: 複数の文字を順番に処理

```bash
# a, b, c, d の順に処理
node Bob/check_and_fix_advjs.js a
node Bob/check_and_fix_advjs.js b
node Bob/check_and_fix_advjs.js c
node Bob/check_and_fix_advjs.js d
```

### 例2: バッチ処理（Windows）

```batch
@echo off
echo Processing all letters...
for %%L in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do (
    echo.
    echo Processing letter: %%L
    node Bob/check_and_fix_advjs.js %%L
    echo.
)
echo All done!
```

### 例3: バッチ処理（Mac/Linux）

```bash
#!/bin/bash
echo "Processing all letters..."
for letter in {a..z}; do
    echo ""
    echo "Processing letter: $letter"
    node Bob/check_and_fix_advjs.js $letter
    echo ""
done
echo "All done!"
```

## 技術的な詳細

### 使用している技術

- **Node.js**: JavaScript実行環境
- **child_process.execSync**: 子プロセスの同期実行
- **fs (File System)**: ファイルの読み書き
- **path**: パス操作

### 処理フロー

```javascript
1. コマンドライン引数を取得・検証
   ↓
2. レポートファイルのパスを生成
   ↓
3. check_missing_advjs_imports.js を実行
   ↓
4. レポートファイルの存在を確認
   ↓
5. レポート内容を読み込んで修正が必要か判定
   ↓
6. 修正が必要な場合:
   - fix_advjs_from_report.js を実行
   - 再度 check_missing_advjs_imports.js を実行（検証）
   ↓
7. 修正が不要な場合:
   - 成功メッセージを表示して終了
   ↓
8. サマリーを表示
```

### エラーハンドリング

各ステップで`try-catch`を使用してエラーをキャッチし、適切なエラーメッセージを表示します。

```javascript
try {
    const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
    });
    console.log(output);
} catch (error) {
    console.error('Error running script:');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
}
```

## 注意事項

### 実行場所

- プロジェクトのルートディレクトリから実行してください
- `src/pages/review`ディレクトリが存在することを確認してください

### バックアップ

- スクリプトは元のファイルを直接変更します
- 重要なファイルの場合は、事前にバックアップを取ることをお勧めします
- Gitを使用している場合は、変更をコミットする前に差分を確認してください

```bash
# Gitで変更を確認
git diff src/pages/review/

# 変更を元に戻す（必要な場合）
git checkout src/pages/review/
```

### 実行時間

- ファイル数によって実行時間が変わります
- 通常、30ファイル程度で数秒以内に完了します

### 出力ファイル

- レポートファイルは`Bob/bob_output/`に保存されます
- 同じ文字で再実行すると、レポートファイルは上書きされます

## トラブルシューティング

### Node.jsがインストールされていない

```bash
'node' is not recognized as an internal or external command
```

**解決方法**: Node.jsをインストールしてください
- https://nodejs.org/

### ディレクトリが見つからない

```bash
Error: Directory not found: src/pages/review
```

**解決方法**: 
1. 正しいディレクトリで実行しているか確認
2. `src/pages/review`フォルダーが存在するか確認

### 権限エラー

```bash
Error: EACCES: permission denied
```

**解決方法**:
```bash
# Windows（管理者として実行）
# PowerShellを右クリック → 管理者として実行

# Mac/Linux
sudo node Bob/check_and_fix_advjs.js b
```

### スクリプトが途中で止まる

**原因**: 子プロセスの実行でエラーが発生している可能性があります

**解決方法**:
1. 個別にスクリプトを実行して問題を特定
   ```bash
   node Bob/check_missing_advjs_imports.js b
   ```
2. エラーメッセージを確認
3. 問題を修正してから再実行

### 修正後も問題が残る

**確認事項**:
1. ステップ3の検証結果を確認
2. レポートファイルを確認
3. 個別のファイルを手動で確認

**解決方法**:
```bash
# 再度実行
node Bob/check_and_fix_advjs.js b

# または個別に実行
node Bob/check_missing_advjs_imports.js b
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt
```

## 比較: 個別実行 vs 統合実行

### 個別実行が適している場合

- レポートを詳しく確認したい
- 特定のファイルだけ修正したい
- 段階的に作業を進めたい
- デバッグが必要

### 統合実行が適している場合

- すべてのファイルを一度に処理したい
- 時間を節約したい
- 自動化したい
- 複数の文字を連続処理したい

## よくある質問（FAQ）

### Q1: 修正前に確認できますか？

A: はい、ステップ1の後にレポートファイルを確認できます。ただし、スクリプトは自動的に次のステップに進みます。確認したい場合は、個別にスクリプトを実行してください。

```bash
# 個別実行で確認
node Bob/check_missing_advjs_imports.js b
type Bob\bob_output\missing_advjs_imports_b_files.txt
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt
```

### Q2: 複数の文字を一度に処理できますか？

A: いいえ、1回の実行で1文字のみ処理できます。複数の文字を処理する場合は、バッチスクリプトを使用してください（使用例を参照）。

### Q3: 実行を途中で止められますか？

A: はい、`Ctrl+C`で中断できます。ただし、修正が途中の場合、一部のファイルだけが修正された状態になる可能性があります。

### Q4: エラーが発生した場合、どうなりますか？

A: スクリプトは即座に終了し、エラーメッセージを表示します。ファイルは変更されません（修正ステップに到達していない場合）。

### Q5: 既に完璧なファイルを再実行しても大丈夫ですか？

A: はい、問題ありません。スクリプトは「修正が不要」と判断し、ステップ2をスキップします。

## 関連スクリプト

### 個別スクリプト

- **Bob/check_missing_advjs_imports.js** - チェック専用
- **Bob/fix_advjs_from_report.js** - 修正専用
- **Bob/check_and_fix_advjs.js** - このスクリプト（統合版）

### README

- **Bob/README-CHECK_ADVJS_IMPORTS.md** - チェックスクリプトの詳細
- **Bob/README-FIX_ADVJS_FROM_REPORT.md** - 修正スクリプトの詳細
- **Bob/README-CHECK_AND_FIX_ADVJS.md** - このドキュメント

## パフォーマンス

### 実行時間の目安

- **10ファイル**: 約1-2秒
- **30ファイル**: 約3-5秒
- **50ファイル**: 約5-8秒

### メモリ使用量

- 通常: 50-100MB
- ファイルサイズに依存

### 最適化のヒント

1. **不要なファイルを除外**: 既に完璧なファイルが多い場合は、個別実行を検討
2. **バッチ処理**: 複数の文字を処理する場合は、バッチスクリプトを使用
3. **並列実行**: 異なる文字を同時に処理（ただし、ファイルシステムの負荷に注意）

## 更新履歴

- **2026-02-11**: 初版作成
  - チェック、修正、検証の3ステップ統合
  - 自動的なレポートファイルパス生成
  - エラーハンドリングとサマリー表示
  - 修正不要時の自動スキップ機能

## まとめ

このスクリプトは、AdvJSインポートステートメントのチェックと修正を1つのコマンドで実行できる便利なツールです。

**主な特徴**:
- ✅ 1コマンドで完結
- ✅ 自動的なパス生成
- ✅ 各ステップの検証
- ✅ 詳細なエラーメッセージ
- ✅ 視覚的な進行状況表示

**推奨される使い方**:
- 日常的な作業: このスクリプトを使用
- 詳細な確認が必要: 個別スクリプトを使用
- 大量処理: バッチスクリプトと組み合わせて使用