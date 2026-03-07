# AdvJS Import Auto-Fix Script

このスクリプトは、`check_missing_advjs_imports.js`が生成したレポートファイルを読み込み、欠けているAdvJSインポートステートメントを自動的に追加します。

## 前提条件

このスクリプトを使用する前に、まず`check_missing_advjs_imports.js`を実行してレポートファイルを生成する必要があります。

```bash
# ステップ1: レポートを生成
node Bob/check_missing_advjs_imports.js b

# ステップ2: レポートから自動修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt
```

## 使い方

### 基本的な使い方

```bash
node Bob/fix_advjs_from_report.js <レポートファイルのパス>
```

### 例

```bash
# 'b'で始まるファイルのレポートから修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

# 'a'で始まるファイルのレポートから修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_a_files.txt

# 'd'で始まるファイルのレポートから修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_d_files.txt
```

## 追加されるステートメント

スクリプトは以下のステートメントを適切な位置に追加します：

### 1. インポートステートメント（SliderJS4の直後）

```javascript
import AdvJS2 from "../review/adv2";
import AdvJS3 from "../review/adv3";
```

**追加位置**: `import SliderJS4 from ...` の直後

### 2. AdvJS2コンポーネント（最後のButtonの後）

```jsx
<AdvJS2/>
```

**追加位置**: 最後の`</Button>`タグと`</div>`の間

### 3. AdvJS3コンポーネント（ファイルの最後）

```jsx
<AdvJS3 />
```

**追加位置**: ファイルの最後

## 動作の詳細

### ステップ1: インポートステートメントの追加

```javascript
// 元のコード
import SliderJS4 from "../review/slider4";

// 修正後
import SliderJS4 from "../review/slider4";
import AdvJS2 from "../review/adv2";
import AdvJS3 from "../review/adv3";
```

- `SliderJS4`のインポート行を探す
- その直後に`AdvJS2`と`AdvJS3`のインポートを追加
- 既に存在する場合はスキップ

### ステップ2: AdvJS2コンポーネントの追加

```jsx
// 元のコード
<Button href="...">Amazon</Button>
</div>

// 修正後
<Button href="...">Amazon</Button>
<AdvJS2/>
</div>
```

- 最後の`</Button>`タグを探す
- その後、`</div>`の前に`<AdvJS2/>`を追加
- 既に存在する場合はスキップ

### ステップ3: AdvJS3コンポーネントの追加

```jsx
// 元のコード
...最後の行

// 修正後
...最後の行

<AdvJS3 />
```

- ファイルの最後に`<AdvJS3 />`を追加
- 既に存在する場合はスキップ

## 出力

### コンソール出力

スクリプトは処理の進行状況をコンソールに表示します：

```bash
$ node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

Reading report file: Bob/bob_output/missing_advjs_imports_b_files.txt

Found 13 files to fix:

  1. banksandsteelz1L.mdx
  2. bigboi3L.mdx
  3. bigkrit3L.mdx
  ...

✓ Fixed: banksandsteelz1L.mdx
✓ Fixed: bigboi3L.mdx
✓ Fixed: bigkrit3L.mdx
...

============================================================
Summary:
Successfully fixed: 13 files
Errors: 0 files

✓ All files have been successfully updated!

You can verify the changes by running:
  node Bob/check_missing_advjs_imports.js b
```

### ファイルの変更

スクリプトは元のファイルを直接変更します。バックアップは作成されないため、必要に応じて事前にバックアップを取ってください。

## 検証

修正後、再度チェックスクリプトを実行して、すべてのステートメントが正しく追加されたことを確認できます：

```bash
# 修正前
node Bob/check_missing_advjs_imports.js b
# Files missing statements: 13

# 修正
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

# 修正後の確認
node Bob/check_missing_advjs_imports.js b
# Files missing statements: 0
```

## エラーハンドリング

### レポートファイルが指定されていない場合

```bash
$ node Bob/fix_advjs_from_report.js
Error: Please provide a report file as an argument
Usage: node Bob/fix_advjs_from_report.js <report_file.txt>
Example: node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt
```

### レポートファイルが見つからない場合

```bash
$ node Bob/fix_advjs_from_report.js nonexistent.txt
Error: Report file not found: nonexistent.txt
```

### MDXファイルが見つからない場合

```bash
✗ Error: File not found: somefile.mdx
```

### ファイルの読み書きエラー

```bash
✗ Error processing somefile.mdx: Permission denied
```

### すべてのファイルが既に修正済みの場合

```bash
No files need to be fixed! All files already have the required statements.
```

## 完全なワークフロー例

```bash
# 1. 'b'で始まるファイルをチェック
node Bob/check_missing_advjs_imports.js b

# 出力例:
# Files missing statements: 13
# Report saved to: Bob/bob_output/missing_advjs_imports_b_files.txt

# 2. レポートを確認（オプション）
type Bob\bob_output\missing_advjs_imports_b_files.txt  # Windows
cat Bob/bob_output/missing_advjs_imports_b_files.txt   # Mac/Linux

# 3. 自動修正を実行
node Bob/fix_advjs_from_report.js Bob/bob_output/missing_advjs_imports_b_files.txt

# 出力例:
# Successfully fixed: 13 files
# Errors: 0 files

# 4. 修正を確認
node Bob/check_missing_advjs_imports.js b

# 出力例:
# Files missing statements: 0
# Files with statements: 29
```

## 注意事項

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

### ファイル形式

- スクリプトはMDXファイル専用です
- ファイルのエンコーディングはUTF-8を想定しています
- 既存のフォーマットやインデントは可能な限り保持されます

### 重複チェック

- スクリプトは既存のステートメントをチェックします
- 既に存在する場合は追加をスキップします
- 同じファイルに対して複数回実行しても安全です

### 追加位置の条件

スクリプトが正しく動作するには、以下の条件が必要です：

1. **インポート**: `import SliderJS4 from ...` が存在すること
2. **AdvJS2**: `</Button>` タグが存在すること
3. **AdvJS3**: ファイルの最後に追加（条件なし）

これらの条件が満たされない場合、スクリプトは適切な位置を見つけられない可能性があります。

## トラブルシューティング

### 修正後もステートメントが欠けている

**原因と対処法**:

1. **レポートファイルが古い**
   ```bash
   # 最新のレポートを生成
   node Bob/check_missing_advjs_imports.js b
   ```

2. **ファイルのパスが間違っている**
   ```bash
   # 正しいパスを確認
   dir src\pages\review\*.mdx  # Windows
   ls src/pages/review/*.mdx   # Mac/Linux
   ```

3. **ファイルの権限がない**
   ```bash
   # 権限を確認
   icacls src\pages\review\*.mdx  # Windows
   ls -l src/pages/review/*.mdx   # Mac/Linux
   ```

### ファイルが壊れた場合

**復元方法**:

1. **Gitを使用している場合**
   ```bash
   # 特定のファイルを復元
   git checkout src/pages/review/filename.mdx
   
   # すべてのreviewファイルを復元
   git checkout src/pages/review/
   ```

2. **バックアップから復元**
   ```bash
   # バックアップをコピー
   copy backup\filename.mdx src\pages\review\  # Windows
   cp backup/filename.mdx src/pages/review/    # Mac/Linux
   ```

3. **手動で修正**
   - ファイルをテキストエディタで開く
   - 不要な行を削除
   - 必要な行を追加

### 特定のファイルだけ修正したい

レポートファイルを編集して、修正したいファイルだけを残してから実行してください。

```bash
# 1. レポートファイルをコピー
copy Bob\bob_output\missing_advjs_imports_b_files.txt custom_report.txt

# 2. テキストエディタで編集（修正したいファイルだけ残す）

# 3. カスタムレポートで実行
node Bob/fix_advjs_from_report.js custom_report.txt
```

### スクリプトが動作しない

**確認事項**:

1. **Node.jsがインストールされているか**
   ```bash
   node --version
   ```

2. **正しいディレクトリで実行しているか**
   ```bash
   # プロジェクトのルートディレクトリで実行
   pwd  # Mac/Linux
   cd   # Windows
   ```

3. **ファイルパスが正しいか**
   ```bash
   # レポートファイルの存在を確認
   dir Bob\bob_output\*.txt  # Windows
   ls Bob/bob_output/*.txt   # Mac/Linux
   ```

## 関連スクリプト

- **Bob/check_missing_advjs_imports.js** - チェック用スクリプト
- **Bob/fix_advjs_from_report.js** - このスクリプト（修正用）
- **Bob/README-CHECK_ADVJS_IMPORTS.md** - チェックスクリプトの詳細ドキュメント

## 技術的な詳細

### 使用している技術

- **Node.js**: JavaScript実行環境
- **fs (File System)**: ファイルの読み書き
- **path**: パス操作
- **正規表現**: パターンマッチング

### コードの構造

```javascript
// 1. レポートファイルを読み込む
const reportContent = fs.readFileSync(reportFile, 'utf8');

// 2. 欠けているファイルのリストを抽出
const missingFiles = extractMissingFiles(reportContent);

// 3. 各ファイルを処理
missingFiles.forEach(filename => {
    // 3.1. ファイルを読み込む
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 3.2. インポートを追加
    content = addImports(content);
    
    // 3.3. コンポーネントを追加
    content = addAdvJS2(content);
    content = addAdvJS3(content);
    
    // 3.4. ファイルに書き込む
    fs.writeFileSync(filePath, content, 'utf8');
});
```

### パフォーマンス

- **処理速度**: 1ファイルあたり約0.1秒
- **メモリ使用量**: ファイルサイズに依存（通常は数KB）
- **並列処理**: なし（順次処理）

## 更新履歴

- **2026-02-11**: 初版作成
  - レポートファイルからの自動修正機能
  - 3つのステートメントの追加ロジック
  - エラーハンドリングとサマリー表示