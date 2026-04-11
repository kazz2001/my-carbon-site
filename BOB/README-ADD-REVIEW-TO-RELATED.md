# add-review-to-related.js

## 概要

レビューファイル間の相互リンクを自動的に追加するスクリプトです。

指定されたレビューファイル（例: `jid2`）の`L`ファイル（`jid2L.mdx`）がimportしている関連レビューファイルを解析し、それらのレビューファイルの`L`ファイルに対して、指定されたレビューへのリンクを追加します。

## 機能

1. **対象レビューファイルの解析**
   - 指定されたレビューの`L`ファイル（例: `jid2L.mdx`）を読み込む
   - import文から関連レビューファイル名を抽出（`L`のついていないファイル名のみ）

2. **関連レビューファイルの更新**
   - 各関連レビューの`L`ファイル（例: `jid1L.mdx`, `spillagevillage1L.mdx`）に対して:
     - 対象レビューのimport文を追加
     - "Other Reviews"セクションに対象レビューのカードを追加

3. **重複チェック**
   - 既にimportされている場合はスキップ

## 使用方法

### 基本的な使い方

```bash
node BOB/add-review-to-related.js <review-name>
```

### 例

```bash
node BOB/add-review-to-related.js jid2
```

この例では:
1. `src/pages/review/jid2L.mdx`を読み込む
2. import文から`jid1`と`spillagevillage1`を抽出
3. `jid1L.mdx`と`spillagevillage1L.mdx`に`jid2.mdx`のimportとOther Reviewsへの追加を行う

## 前提条件

- Node.jsがインストールされていること
- 対象のレビューファイル（`<review-name>L.mdx`）が`src/pages/review/`ディレクトリに存在すること
- 関連レビューファイルの`L`ファイルが存在すること

## ファイル構造

スクリプトは以下のファイル構造を前提としています:

```
src/pages/review/
├── jid1.mdx              # レビューカード（短縮版）
├── jid1L.mdx             # レビュー詳細ページ
├── jid2.mdx              # レビューカード（短縮版）
├── jid2L.mdx             # レビュー詳細ページ
├── spillagevillage1.mdx  # レビューカード（短縮版）
└── spillagevillage1L.mdx # レビュー詳細ページ
```

## 処理の流れ

### 1. 対象ファイルの解析

`jid2L.mdx`の内容:
```jsx
import Review1 from "../review/jid1.mdx";
import Review2 from "../review/spillagevillage1.mdx";
```

→ `jid1`と`spillagevillage1`を抽出

### 2. 関連ファイルへの追加

`jid1L.mdx`に以下を追加:

**import文:**
```jsx
import Review2 from "../review/jid2.mdx";
```

**Other Reviewsセクション:**
```jsx
<h3>Other Reviews</h3>

<Row>
  <Column colMd={3} colLg={3} noGutterMdLeft>
    <Review1 />
  </Column>
  <Column colMd={3} colLg={3} noGutterMdLeft>
    <Review2 />  <!-- 新規追加 -->
  </Column>
</Row>
```

## 出力例

```
処理開始: jid2L.mdx を解析します...
見つかった関連レビュー: jid1, spillagevillage1

処理中: jid1L.mdx
  ✓ import文を追加: Review2
  ✓ Other Reviewsセクションに追加
  ✓ jid1L.mdx を更新しました

処理中: spillagevillage1L.mdx
  ✓ import文を追加: Review2
  ✓ Other Reviewsセクションに追加
  ✓ spillagevillage1L.mdx を更新しました

処理完了！
```

## エラーハンドリング

### レビューファイル名が指定されていない場合

```bash
$ node BOB/add-review-to-related.js
エラー: レビューファイル名を指定してください
使用方法: node add-review-to-related.js <review-name>
例: node add-review-to-related.js jid2
```

### 対象ファイルが存在しない場合

```bash
$ node BOB/add-review-to-related.js nonexistent
エラー: nonexistentL.mdx が見つかりません
```

### 関連ファイルが存在しない場合

```
警告: somefileL.mdx が見つかりません。スキップします。
```

### 既にimportされている場合

```
処理中: jid1L.mdx
  → 既に jid2.mdx がimportされています。スキップします。
```

## 注意事項

1. **Lファイルのみを編集**
   - `L`のついていないファイル（例: `jid1.mdx`）は編集しません
   - これらはレビューカード用の短縮版ファイルです

2. **Review番号の自動採番**
   - 既存のReview番号を解析し、次の番号を自動的に割り当てます
   - 例: Review1, Review2が存在する場合、Review3として追加

3. **バックアップ推奨**
   - 実行前にファイルのバックアップを取ることを推奨します
   - Gitを使用している場合は、変更をコミットする前に確認してください

## トラブルシューティング

### Other Reviewsセクションが見つからない

ファイルに`<h3>Other Reviews</h3>`セクションが存在しない場合、警告が表示されます:

```
警告: Other Reviewsセクションが見つかりませんでした
```

この場合、手動でセクションを追加する必要があります。

### import文が見つからない

ファイルにレビューのimport文が存在しない場合、警告が表示されます:

```
警告: import文が見つかりませんでした
```

## 関連スクリプト

- `add-review-to-best50.js` - Best50リストへのレビュー追加
- `add-review-to-cd-year.js` - 年別CDリストへのレビュー追加
- `add-review-to-index.js` - インデックスページへのレビュー追加
- `add-review-to-latest.js` - 最新レビューリストへの追加

## ライセンス

このスクリプトはプロジェクトのライセンスに従います。