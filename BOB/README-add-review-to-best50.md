# add-review-to-best50.js

このスクリプトは、best50のMDXファイルにレビューエントリーを自動的に追加します。

## 機能

このスクリプトは以下の処理を自動化します：

1. **メタデータ自動抽出**: レビューLファイル（例: `addisonrae1L.mdx`）から以下を自動抽出
   - 順位（Position）
   - アーティスト名（Artist Name）
   - アルバムタイトル（Album Title）
2. **インポート文の追加**: レビューファイル（`.mdx` と `A.mdx`）のインポート文を追加
3. **Rowセクションの追加**: アルバムカバー画像とレビュー概要を表示するRowセクションを追加
4. **テーブルエントリーの更新**: テーブル内のエントリーにレビューページへのリンクを追加

## 使用方法

```bash
node add-review-to-best50.js <filePathOrYear> <reviewId>
```

### パラメータ

- `filePathOrYear`: 修正対象のMDXファイルパスまたは年号（例: `2025` または `src/pages/best50/2025.mdx`）
- `reviewId`: レビューファイルのID（例: `addisonrae1`）

**注意**: `position`、`artistName`、`albumTitle`パラメータは不要です。すべて`{reviewId}L.mdx`ファイルから自動的に抽出されます。

### 使用例

**年号のみで指定（推奨）:**
```bash
node Bob/add-review-to-best50.js 2025 addisonrae1
```

**フルパスで指定:**
```bash
node Bob/add-review-to-best50.js src/pages/best50/2025.mdx addisonrae1
```

**他の年のファイルにも対応:**
```bash
node add-review-to-best50.js 2024 reviewid1
```

### 処理の流れ

1. **メタデータ抽出**: `addisonrae1L.mdx`から以下を自動抽出
   - 順位: "Best No.8" → 8
   - タイトル: `title: "Addison Rae / Addison"` → Artist: "Addison Rae", Album: "Addison"
2. **インポート文を追加**:
   ```javascript
   import Review8  from "../review/addisonrae1.mdx";
   import Review8A from "../review/addisonrae1A.mdx";
   ```

3. **No.8のRowセクションを追加**:
   ```jsx
   <Row>
     <Column colMd={2} colLg={3} noGutterMdLeft>
       <h2 class="p600J">No.8</h2>
       <Review8 />
     </Column>
     <Column colMd={5} colLg={8} noGutterMdLeft>
       <h2>Addison Rae - Addison</h2>
       <Review8A />
     </Column>
   </Row>
   ```

4. **テーブルエントリーを更新**:
   ```markdown
   | 8   | [Addison Rae - Addison](/review/addisonrae1L/) |
   ```

## 前提条件

- レビューファイルが既に存在していること:
  - `src/pages/review/{reviewId}.mdx`
  - `src/pages/review/{reviewId}A.mdx`
  - `src/pages/review/{reviewId}L.mdx` ← **ここに以下の情報が必要**
    - frontmatterの`title`: `"Artist Name / Album Title"`形式
    - 本文中に順位情報: `"Best No.8"`のような記述
- 指定したbest50のMDXファイルが存在すること
- テーブル内に該当する順位のエントリーが既に存在していること（リンクなしの状態）

## 注意事項

- **年号指定**: 4桁の数字（例: `2025`）を指定すると、自動的に `src/pages/best50/2025.mdx` に変換されます
- **フルパス指定**: フルパスでも指定可能です（例: `src/pages/best50/2025.mdx`）
- **テーブル更新**: テーブルエントリーが既にリンク形式になっている場合は、更新をスキップします
- **特殊文字対応**: アーティスト名やアルバムタイトルにカンマ（,）などの特殊文字が含まれていても正しく処理されます
- スクリプトはファイルを直接上書きするため、実行前にバックアップを取ることをお勧めします
- BOM（Byte Order Mark）が含まれるファイルにも対応しています

## エラーハンドリング

スクリプトは以下の場合にエラーを表示します：

- 必要なパラメータが不足している場合
- 指定したファイルが存在しない場合
- ファイルの読み書きに失敗した場合
- 該当するテーブルエントリーが見つからない場合

## 出力例

**通常の実行:**
```
✓ Extracted from addisonrae1L.mdx:
  - Position: 8
  - Artist: Addison Rae
  - Album: Addison
✓ Successfully added Addison Rae - Addison (addisonrae1) at position 8
✓ File: src/pages/best50/2025.mdx
✓ Added imports: Review8 and Review8A
✓ Added Row section for No.8
✓ Updated table entry with link to /review/addisonrae1L/
```

**テーブルが既にリンク済みの場合:**
```
✓ Extracted from addisonrae1L.mdx:
  - Position: 8
  - Artist: Addison Rae
  - Album: Addison
✓ Successfully added Addison Rae - Addison (addisonrae1) at position 8
✓ File: src/pages/best50/2025.mdx
✓ Added imports: Review8 and Review8A
✓ Added Row section for No.8
✓ Table entry already linked (no update needed)
```

## 利点

- **完全自動化**: レビューLファイルから順位、アーティスト名、アルバムタイトルを自動抽出
- **超簡潔**: パラメータが2つだけ（年号とレビューID）
- **エラー防止**: 手動入力が不要なため、タイプミスや情報の不一致を完全に防止
- **安全性**: テーブルが既に更新されている場合はスキップするため、複数回実行しても安全
- **汎用性**: 任意の年のbest50ファイルに対応
- **再利用性**: 2024.mdx、2023.mdxなど、他の年のファイルにも同じスクリプトを使用可能
- **柔軟性**: ファイルパスをパラメーターで指定できるため、プロジェクト構造の変更にも対応しやすい