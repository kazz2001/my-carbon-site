# AdvJS Import Checker Script

このスクリプトは、`src/pages/review`フォルダー内のMDXファイルで、必須のAdvJSインポートステートメントが欠けているファイルを検出します。

## 必須ステートメント

以下の4つのステートメントが必要です：

1. `import AdvJS2 from "../review/adv2";`
2. `import AdvJS3 from "../review/adv3";`
3. `<AdvJS2/>`
4. `<AdvJS3/>`

## 使い方

### 基本的な使い方

```bash
node check_missing_advjs_imports.js <先頭文字>
```

### 例

```bash
# 'b'で始まるファイルをチェック
node check_missing_advjs_imports.js b

# 'a'で始まるファイルをチェック
node check_missing_advjs_imports.js a

# 'd'で始まるファイルをチェック
node check_missing_advjs_imports.js d
```

## 対象ファイル

スクリプトは以下の条件に一致するファイルをチェックします：
- 指定された文字で始まる
- `L.mdx`で終わる
- `src/pages/review`フォルダーに存在する

例：`b`を指定した場合
- `babyface3L.mdx` ✓
- `beyonce5L.mdx` ✓
- `beyonce6.mdx` ✗ (L.mdxで終わらない)
- `alicia6L.mdx` ✗ (bで始まらない)

## 出力

### コンソール出力

スクリプトは以下の情報をコンソールに表示します：
- チェックしたファイルの総数
- ステートメントが欠けているファイルの数
- ステートメントが揃っているファイルの数
- 欠けているファイルのリスト

### ファイル出力

詳細なレポートが`missing_advjs_imports_<文字>_files.txt`という名前で保存されます。

例：
- `b`を指定 → `missing_advjs_imports_b_files.txt`
- `a`を指定 → `missing_advjs_imports_a_files.txt`

レポートには以下が含まれます：
- 欠けているファイルのリスト（どのステートメントが欠けているかの詳細付き）
- すべてのステートメントが揃っているファイルのリスト
- 統計情報（総数、欠けている数、割合など）

## 実行例

```bash
$ node check_missing_advjs_imports.js b
Checking files starting with 'b' and ending with 'L.mdx'...

Found 29 files to check

Results:
========
Total files checked: 29
Files missing statements: 13
Files with statements: 16

Report saved to: missing_advjs_imports_b_files.txt

Files missing statements:
  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  3. bigkrit3L.mdx
  ...
```

## エラーハンドリング

### 引数が指定されていない場合

```bash
$ node check_missing_advjs_imports.js
Error: Please provide a starting letter as an argument
Usage: node check_missing_advjs_imports.js <starting_letter>
Example: node check_missing_advjs_imports.js b
```

### 無効な文字が指定された場合

```bash
$ node check_missing_advjs_imports.js 123
Error: Starting letter must be a single alphabetic character
```

### 該当するファイルがない場合

```bash
$ node check_missing_advjs_imports.js z
Checking files starting with 'z' and ending with 'L.mdx'...

No files found starting with 'z' and ending with 'L.mdx'
```

## 注意事項

- スクリプトは大文字小文字を区別しません（`B`も`b`も同じ結果になります）
- スクリプトはプロジェクトのルートディレクトリから実行する必要があります
- Node.jsがインストールされている必要があります

## トラブルシューティング

### ディレクトリが見つからない

```
Error: Directory not found: src/pages/review
```

→ プロジェクトのルートディレクトリから実行してください

### Node.jsがインストールされていない

```
'node' is not recognized as an internal or external command
```

→ Node.jsをインストールしてください：https://nodejs.org/