# AdvJS Import Checker Script

このスクリプトは、`src/pages/review`フォルダー内のMDXファイルで、必須のAdvJSインポートステートメントが欠けているファイルを検出します。

## 概要

指定された文字で始まり`L.mdx`で終わるファイルをチェックし、以下の4つの必須ステートメントが存在するかを確認します：

1. `import AdvJS2 from "../review/adv2";`
2. `import AdvJS3 from "../review/adv3";`
3. `<AdvJS2/>`
4. `<AdvJS3/>`

## 使い方

### 基本的な使い方

```bash
node Bob/check_missing_advjs_imports.js <先頭文字>
```

### 例

```bash
# 'b'で始まるファイルをチェック
node Bob/check_missing_advjs_imports.js b

# 'a'で始まるファイルをチェック
node Bob/check_missing_advjs_imports.js a

# 'd'で始まるファイルをチェック
node Bob/check_missing_advjs_imports.js d
```

## 対象ファイル

スクリプトは以下の条件に一致するファイルをチェックします：

- **先頭文字**: 指定された文字で始まる（大文字小文字を区別しない）
- **末尾**: `L.mdx`で終わる
- **場所**: `src/pages/review`フォルダーに存在する

### 例：`b`を指定した場合

✅ チェック対象:
- `babyface3L.mdx`
- `beyonce5L.mdx`
- `billieeilish2L.mdx`
- `bobmarley1L.mdx`

❌ チェック対象外:
- `beyonce6.mdx` (L.mdxで終わらない)
- `alicia6L.mdx` (bで始まらない)
- `beyonce5A.mdx` (L.mdxで終わらない)

## 出力

### 1. コンソール出力

スクリプトは以下の情報をコンソールに表示します：

```bash
$ node Bob/check_missing_advjs_imports.js b

Checking files starting with 'b' and ending with 'L.mdx'...

Found 29 files to check

Results:
========
Total files checked: 29
Files missing statements: 13
Files with statements: 16

Report saved to: C:\Users\user\Documents\gatsby_v5_0209\Bob\bob_output\missing_advjs_imports_b_files.txt

Files missing statements:
  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  3. bigkrit3L.mdx
  4. billieeilish2L.mdx
  5. billieeilish3L.mdx
  ...
```

### 2. ファイル出力

詳細なレポートが`Bob/bob_output/missing_advjs_imports_<文字>_files.txt`という名前で保存されます。

**ファイル名の例**:
- `b`を指定 → `Bob/bob_output/missing_advjs_imports_b_files.txt`
- `a`を指定 → `Bob/bob_output/missing_advjs_imports_a_files.txt`
- `d`を指定 → `Bob/bob_output/missing_advjs_imports_d_files.txt`

### レポートファイルの内容

```
Files in src/pages/review starting with 'b' and ending with 'L.mdx' that are MISSING the required import statements
====================================================================================================

Required statements that should be present:
1. import AdvJS2 from "../review/adv2";
2. import AdvJS3 from "../review/adv3";
3. <AdvJS2/>
4. <AdvJS3/>

Files MISSING these statements (13 files):
--------------------------------------------------

1. banksandsteelz1L.mdx
   Missing: AdvJS2 import, AdvJS3 import, <AdvJS2/> usage, <AdvJS3/> usage
2. bigboi3L.mdx
   Missing: AdvJS2 import, AdvJS3 import, <AdvJS2/> usage, <AdvJS3/> usage
...

Files that HAVE all required statements (16 files):
--------------------------------------------------

1. babyface3L.mdx
2. beyonce5L.mdx
...

Summary:
--------------------------------------------------
Total files checked: 29
Files missing statements: 13
Files with statements: 16
Missing rate: 44.8%

Generated: 2026-02-11
```

## チェック内容の詳細

### 1. AdvJS2インポート

以下のいずれかの形式を検出：
```javascript
import AdvJS2 from "../review/adv2";
import AdvJS2 from "./adv2";
```

### 2. AdvJS3インポート

以下のいずれかの形式を検出：
```javascript
import AdvJS3 from "../review/adv3";
import AdvJS3 from "./adv3";
```

### 3. AdvJS2コンポーネント使用

以下のいずれかの形式を検出：
```jsx
<AdvJS2/>
<AdvJS2 />
```

### 4. AdvJS3コンポーネント使用

以下のいずれかの形式を検出：
```jsx
<AdvJS3/>
<AdvJS3 />
```

## エラーハンドリング

### 引数が指定されていない場合

```bash
$ node Bob/check_missing_advjs_imports.js
Error: Please provide a starting letter as an argument
Usage: node Bob/check_missing_advjs_imports.js <starting_letter>
Example: node Bob/check_missing_advjs_imports.js b
```

### 無効な文字が指定された場合

```bash
$ node Bob/check_missing_advjs_imports.js 123
Error: Starting letter must be a single alphabetic character
```

```bash
$ node Bob/check_missing_advjs_imports.js ab
Error: Starting letter must be a single alphabetic character
```

### 該当するファイルがない場合

```bash
$ node Bob/check_missing_advjs_imports.js z
Checking files starting with 'z' and ending with 'L.mdx'...

No files found starting with 'z' and ending with 'L.mdx'
```

### ディレクトリが見つからない場合

```bash
Error: Directory not found: src/pages/review
```

→ プロジェクトのルートディレクトリから実行してください

## 完全なワークフロー

### ステップ1: チェック実行

```bash
node Bob/check_missing_advjs_imports.js b
```

### ステップ2: レポート確認

```bash
# Windows
type Bob\bob_output\missing_advjs_imports_b_files.txt

# Mac/Linux
cat Bob/bob_output/missing_advjs_imports_b_files.txt
```

### ステップ3: 修正（オプション）

```bash
# 自動修正スクリプトを使用
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt
```

### ステップ4: 再チェック

```bash
# 修正後の確認
node Bob/check_missing_advjs_imports.js b
```

## 使用例

### 例1: すべてのファイルが完璧な場合

```bash
$ node Bob/check_missing_advjs_imports.js a

Checking files starting with 'a' and ending with 'L.mdx'...

Found 22 files to check

Results:
========
Total files checked: 22
Files missing statements: 0
Files with statements: 22

Report saved to: Bob/bob_output/missing_advjs_imports_a_files.txt
```

### 例2: 一部のファイルに欠けている場合

```bash
$ node Bob/check_missing_advjs_imports.js d

Checking files starting with 'd' and ending with 'L.mdx'...

Found 28 files to check

Results:
========
Total files checked: 28
Files missing statements: 4
Files with statements: 24

Report saved to: Bob/bob_output/missing_advjs_imports_d_files.txt

Files missing statements:
  1. dangerangelo1L.mdx
  2. danielcaesar1L.mdx
  3. daveeastwood1L.mdx
  4. drake5L.mdx
```

### 例3: 複数の文字を順番にチェック

```bash
# a, b, c, d の順にチェック
node Bob/check_missing_advjs_imports.js a
node Bob/check_missing_advjs_imports.js b
node Bob/check_missing_advjs_imports.js c
node Bob/check_missing_advjs_imports.js d
```

## 注意事項

### 実行場所

- スクリプトはプロジェクトのルートディレクトリから実行する必要があります
- `src/pages/review`ディレクトリが存在することを確認してください

### Node.js

- Node.jsがインストールされている必要があります
- バージョン12以上を推奨

### 出力ディレクトリ

- `Bob/bob_output`フォルダーは自動的に作成されます
- 既存のレポートファイルは上書きされます

### 大文字小文字

- 指定する文字は大文字でも小文字でも同じ結果になります
- `b`と`B`は同じファイルをチェックします

### ファイル形式

- MDXファイルのみが対象です
- エンコーディングはUTF-8を想定しています

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
   ```bash
   pwd  # Mac/Linux
   cd   # Windows
   ```
2. `src/pages/review`フォルダーが存在するか確認
   ```bash
   dir src\pages\review  # Windows
   ls src/pages/review   # Mac/Linux
   ```

### レポートファイルが見つからない

**確認方法**:
```bash
# Windows
dir Bob\bob_output

# Mac/Linux
ls Bob/bob_output
```

**解決方法**: スクリプトを実行すると自動的に作成されます

### 権限エラー

```bash
Error: EACCES: permission denied
```

**解決方法**:
```bash
# Windows（管理者として実行）
# PowerShellを右クリック → 管理者として実行

# Mac/Linux
sudo node Bob/check_missing_advjs_imports.js b
```

## 統計情報の見方

### Missing Rate（欠落率）

```
Missing rate: 44.8%
```

- **意味**: チェックしたファイルのうち、ステートメントが欠けているファイルの割合
- **計算式**: (欠けているファイル数 / 総ファイル数) × 100
- **目標**: 0%（すべてのファイルが完璧）

### 例

```
Total files checked: 29
Files missing statements: 13
Files with statements: 16
Missing rate: 44.8%
```

- 29ファイル中13ファイルに欠落がある
- 13 ÷ 29 × 100 = 44.8%
- 16ファイルは完璧

## 関連スクリプト

### Bob/fix_advjs_from_report.js

このスクリプトが生成したレポートを使用して、自動的に修正を行います。

```bash
# 1. チェック
node Bob/check_missing_advjs_imports.js b

# 2. 修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

# 3. 再チェック
node Bob/check_missing_advjs_imports.js b
```

詳細は`Bob/README-FIX_ADVJS_FROM_REPORT.md`を参照してください。

## 技術的な詳細

### 使用している技術

- **Node.js**: JavaScript実行環境
- **fs (File System)**: ファイルの読み書き
- **path**: パス操作
- **正規表現**: パターンマッチング

### 処理フロー

```javascript
1. コマンドライン引数を取得
   ↓
2. 引数を検証（1文字のアルファベットか？）
   ↓
3. src/pages/reviewディレクトリを読み込む
   ↓
4. 指定された文字で始まり、L.mdxで終わるファイルをフィルタ
   ↓
5. 各ファイルの内容を読み込む
   ↓
6. 4つの必須ステートメントをチェック
   ↓
7. 結果を分類（欠けている/完璧）
   ↓
8. レポートを生成
   ↓
9. ファイルに保存
   ↓
10. コンソールに結果を表示
```

### パフォーマンス

- **処理速度**: 1ファイルあたり約0.01秒
- **メモリ使用量**: ファイルサイズに依存（通常は数KB）
- **並列処理**: なし（順次処理）

### チェックロジック

```javascript
// インポートチェック
const hasAdvJS2Import = 
    content.includes('import AdvJS2 from "../review/adv2"') || 
    content.includes('import AdvJS2 from "./adv2"');

// 使用チェック
const hasAdvJS2Usage = 
    content.includes('<AdvJS2/>') || 
    content.includes('<AdvJS2 />');

// 総合判定
const hasAllStatements = 
    hasAdvJS2Import && hasAdvJS3Import && 
    hasAdvJS2Usage && hasAdvJS3Usage;
```

## よくある質問（FAQ）

### Q1: 複数の文字を一度にチェックできますか？

A: いいえ、1回の実行で1文字のみチェックできます。複数の文字をチェックする場合は、スクリプトを複数回実行してください。

```bash
node Bob/check_missing_advjs_imports.js a
node Bob/check_missing_advjs_imports.js b
node Bob/check_missing_advjs_imports.js c
```

### Q2: レポートファイルは上書きされますか？

A: はい、同じ文字で再実行すると、前のレポートファイルは上書きされます。

### Q3: 大文字と小文字は区別されますか？

A: いいえ、`b`と`B`は同じ結果になります。

### Q4: L.mdx以外のファイルもチェックできますか？

A: いいえ、このスクリプトは`L.mdx`で終わるファイル専用です。他のファイルをチェックする場合は、スクリプトを修正する必要があります。

### Q5: 修正は自動でできますか？

A: はい、`Bob/fix_advjs_from_report.js`スクリプトを使用すると、レポートに基づいて自動修正できます。

## 更新履歴

- **2026-02-11**: 初版作成
  - 指定文字で始まるファイルのチェック機能
  - 4つの必須ステートメントの検証
  - 詳細なレポート生成
  - Bob/bob_outputディレクトリへの出力