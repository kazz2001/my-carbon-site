# ブックレビューテンプレート使用ガイド

## 概要

`/src/pages/book`フォルダーには、R&B・Hip-Hopをテーマにした書籍のレビューが格納されています。
各書籍には2種類のMDXファイルが必要です：

- **A版（*A.mdx）**: ArticleCardコンポーネントを使用したカード表示用（一覧ページで使用）
- **L版（*L.mdx）**: 詳細なブックレビューページ（個別ページ）

## ファイル命名規則

ファイル名は書籍の識別子を使用します：

```
[book-identifier]A.mdx  # カード表示用
[book-identifier]L.mdx  # 詳細レビューページ用
```

例：
- `hiphopmbaA.mdx` / `hiphopmbaL.mdx`
- `southhiphopdiscguideA.mdx` / `southhiphopdiscguideL.mdx`

## A版テンプレート（カード表示用）

### 目的
- 一覧ページ（`bookreview1.mdx`）で使用
- 書籍の表紙画像とタイトルを表示
- クリックでL版（詳細ページ）へリンク

### テンプレート構造

```mdx
<ArticleCard
  title="書籍タイトル / 著者名"
  href="/book/[book-identifier]L/"
  actionIcon="arrowRight"
>

![書籍タイトル / 著者名](../../images/books/[image-filename].jpg) 

</ArticleCard>

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
```

### 記入項目

1. **title**: 書籍の完全なタイトルと著者名
   - 形式: `"書籍タイトル / 著 著者名"` または `"書籍タイトル / 監修 監修者名"`
   
2. **href**: 詳細ページへのパス
   - 形式: `"/book/[book-identifier]L/"`
   - 必ず末尾に`L`を付ける
   
3. **画像パス**: 書籍の表紙画像
   - 形式: `../../images/books/[image-filename].jpg`
   - 画像は`src/images/books/`に配置

### 実例

```mdx
<ArticleCard
  title="ヒップホップ経営学 お金儲けのことはラッパーに訊け / 著 Nels Abbey"
  href="/book/hiphopmbaL/"
  actionIcon="arrowRight"
>

![ヒップホップ経営学 お金儲けのことはラッパーに訊け / 著 Nels Abbey](../../images/books/hiphopmba.jpg) 

</ArticleCard>

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
```

## L版テンプレート（詳細レビューページ用）

### 目的
- 書籍の詳細情報とレビューを表示
- 書誌情報（著者、出版社、ページ数、価格など）
- レビュー本文

### テンプレート構造

```mdx
---
title: "書籍タイトル / 著者名"
description: "Book Review of 書籍タイトル / 著者名"
keywords: "書籍タイトル, 著者名, キーワード"
---

import { Button } from "@carbon/react";
import { ArrowUpRight } from "@carbon/icons-react";

<Row>
  <Column colMd={12} colLg={12} noGutterMdLeft="">
    <p className="largeP">Book Review</p>
    <h1 className="h1-no-bottom-margin">書籍タイトル</h1>
    <p className="largeP">サブタイトル（あれば）</p>
  </Column>
</Row>

<Row>
<Column colMd={3} colLg={4} noGutterMdLeft="">

![書籍タイトル / 著者名](../../images/books/[image-filename].jpg) 

</Column>
<Column colMd={4} colLg={8} noGutterMdLeft="">
  <div>
    <p>著 / 監修</p>
    <p className="largeP">著者名</p>
    <br/>
    <p>訳（翻訳書の場合）</p>
    <p className="largeP">翻訳者名</p>
    <br/>
    <p>出版社</p>
    <p className="largeP">出版社名</p>
    <br/>
    <p>ページ数 / サイズ</p>
    <p className="largeP">XXXページ / XX x XX x XX cm</p>
    <br/>
    <p>発売日</p>
    <p className="largeP">YYYY/MM/DD</p>
    <br/>
    <p>定価</p>
    <p className="largeP">XXXX円(税抜き)</p>
    <div>
    <Button href="https://amzn.to/XXXXXXX" renderIcon={ArrowUpRight} size='sm' kind='primary'>
      amazon.co.jp
    </Button>
    </div>
  </div>
</Column>
</Row>

<Row>
  <Column colMd={8} colLg={8} noGutterMdLeft="">
    <p class="p600J">- キャッチコピーやサブタイトル -</p>
    <p>
      レビュー本文をここに記述します。
      <br />
      改行は<br />タグを使用します。
      <br />
      複数の段落に分けて、書籍の内容、特徴、感想などを記述します。
    </p>
  </Column>
</Row>
```

### 記入項目

#### フロントマター（---で囲まれた部分）

1. **title**: 書籍の完全なタイトルと著者名
2. **description**: SEO用の説明文
3. **keywords**: 検索用キーワード（カンマ区切り）

#### ヘッダーセクション

- メインタイトル（`<h1>`）
- サブタイトル（`<p className="largeP">`）- オプション

#### 書誌情報セクション

1. **画像**: 書籍の表紙画像
2. **著者情報**: 
   - 著者/監修者名
   - 翻訳者名（翻訳書の場合）
3. **出版情報**:
   - 出版社名
   - ページ数とサイズ
   - 発売日（YYYY/MM/DD形式）
   - 定価（税抜き）
4. **購入リンク**: Amazon.co.jpへのアフィリエイトリンク

#### レビューセクション

- **キャッチコピー**: `<p class="p600J">`で強調表示
- **レビュー本文**: 
  - 段落は`<p>`タグで囲む
  - 改行は`<br />`タグを使用
  - 必要に応じて複数の段落に分割

### 実例

```mdx
---
title: "ヒップホップ経営学 お金儲けのことはラッパーに訊け / 著 Nels Abbey"
description: "Book Review of ヒップホップ経営学 お金儲けのことはラッパーに訊け / 著 Nels Abbey"
keywords: "ヒップホップ経営学 お金儲けのことはラッパーに訊け, Nels Abbey, ネルス・アビー"
---

import { Button } from "@carbon/react";
import { ArrowUpRight } from "@carbon/icons-react";

<Row>
  <Column colMd={12} colLg={12} noGutterMdLeft="">
    <p className="largeP">Book Review</p>
    <h1 className="h1-no-bottom-margin">ヒップホップ経営学 お金儲けのことはラッパーに訊け</h1>
  </Column>
</Row>

<Row>
<Column colMd={3} colLg={4} noGutterMdLeft="">

![ヒップホップ経営学 お金儲けのことはラッパーに訊け / 著 Nels Abbey](../../images/books/hiphopmba.jpg) 

</Column>
<Column colMd={4} colLg={8} noGutterMdLeft="">
  <div>
    <p>著</p>
    <p className="largeP">Nels Abbey</p>
    <br/>
    <p>訳</p>
    <p className="largeP">山形浩生</p>
    <br/>
    <p>出版社</p>
    <p className="largeP">DU Books</p>
    <br/>
    <p>ページ数 / サイズ</p>
    <p className="largeP">510ページ / 21 x 14.8 x 2 cm</p>
    <br/>
    <p>発売日</p>
    <p className="largeP">2025/8/5</p>
    <br/>
    <p>定価</p>
    <p className="largeP">2800円(税抜き)</p>
    <div>
    <Button href="https://amzn.to/4sxRBFz" renderIcon={ArrowUpRight} size='sm' kind='primary'>
      amazon.co.jp
    </Button>
    </div>
  </div>
</Column>
</Row>

<Row>
  <Column colMd={8} colLg={8} noGutterMdLeft="">
    <p class="p600J">- どん底から億万長者にのぼりつめたラッパーの仰天サクセスストーリーに学ぶメイクマネー虎の巻！ -</p>
    <p>
      経営学のビジネス本の構成をとりつつ、Hip-Hop界より事例をあつめて経営理論・経営戦略論を実証したような書籍。
      ただ堅苦しいところは全くなく、文体もHip-Hop的で、大分くだけた感じなので読みやすい。
      <br />
      章立ては、下記のようになっており、デビュー、成り上がり、人気・パワーの維持といったアーティストとしてのライフサイクルに沿ったものになっている。
      <br />  ・第一部 突破口をつかむ
      <br />  ・第二部 ブレイク
      <br />  ・第三部 上を目指す
      <br />  ・第四部 頂点にとどまる
      <br />  ・第五部 拡大
    </p>
  </Column>
</Row>
```

## 一覧ページへの追加方法

新しいブックレビューを追加したら、[`bookreview1.mdx`](src/pages/book/bookreview1.mdx:1)に追加する必要があります。

### 手順

1. **インポート文を追加**（ファイル上部）

```mdx
import ReviewYYYY_X from "./[book-identifier]A.mdx";
```

2. **該当年のセクションに追加**

```mdx
## YYYY
<p>画像クリックでレビューページヘ。</p>
<Row>
  <Column colMd={2} colLg={4} noGutterMdLeft>
    <ReviewYYYY_X />
  </Column>
  <!-- 他のレビュー -->
</Row>
```

3. **AnchorLinksを更新**（新しい年の場合）

```mdx
<AnchorLinks small>
  <AnchorLink>YYYY</AnchorLink>
  <!-- 他の年 -->
</AnchorLinks>
```

## 画像の準備

### 要件

- **形式**: JPG推奨
- **配置場所**: `src/images/books/`
- **命名**: 書籍識別子と同じ名前（例: `hiphopmba.jpg`）
- **サイズ**: 適切なサイズにリサイズ（推奨: 幅400-600px程度）

### 既存の画像例

- `hiphopmba.jpg`
- `southhiphopdiscguide.jpg`
- `alternativerandbguide.jpg`
- `kendricklamarkawade.jpg`

## チェックリスト

新しいブックレビューを追加する際のチェックリスト：

- [ ] 書籍の表紙画像を`src/images/books/`に配置
- [ ] A版ファイル（`[identifier]A.mdx`）を作成
  - [ ] タイトルと著者名を記入
  - [ ] hrefパスを正しく設定（末尾に`L`）
  - [ ] 画像パスを正しく設定
- [ ] L版ファイル（`[identifier]L.mdx`）を作成
  - [ ] フロントマター（title, description, keywords）を記入
  - [ ] 書誌情報を記入
  - [ ] レビュー本文を記入
  - [ ] Amazonリンクを設定
- [ ] `bookreview1.mdx`にインポート文を追加
- [ ] `bookreview1.mdx`の該当年セクションに追加
- [ ] 新しい年の場合、AnchorLinksを更新

## よくある注意点

1. **画像パスの相対パス**: A版とL版で同じ相対パス（`../../images/books/`）を使用
2. **hrefの末尾**: A版のhrefは必ず`/book/[identifier]L/`（Lを付ける）
3. **改行タグ**: レビュー本文内の改行は`<br />`を使用（`<br>`ではない）
4. **クラス名**: 
   - `className="largeP"` - 大きめのテキスト
   - `class="p600J"` - 強調表示用（キャッチコピー）
5. **Columnのサイズ**: 既存のパターンに従う
   - 画像: `colMd={3} colLg={4}`
   - 書誌情報: `colMd={4} colLg={8}`
   - レビュー本文: `colMd={8} colLg={8}`

## 関連ファイル

- 一覧ページ: [`src/pages/book/bookreview1.mdx`](src/pages/book/bookreview1.mdx:1)
- 画像フォルダ: `src/images/books/`
- 既存のレビュー例:
  - [`hiphopmbaA.mdx`](src/pages/book/hiphopmbaA.mdx:1) / [`hiphopmbaL.mdx`](src/pages/book/hiphopmbaL.mdx:1)
  - [`southhiphopdiscguideA.mdx`](src/pages/book/southhiphopdiscguideA.mdx:1) / [`southhiphopdiscguideL.mdx`](src/pages/book/southhiphopdiscguideL.mdx:1)
  - [`alternativerandbguideA.mdx`](src/pages/book/alternativerandbguideA.mdx:1) / [`alternativerandbguideL.mdx`](src/pages/book/alternativerandbguideL.mdx:1)

## 追加のカスタマイズ

### 関連レビューの追加（オプション）

L版ファイルの最後に、関連する他のブックレビューへのリンクを追加できます：

```mdx
<h3>Other Reviews</h3>

<Row>
  <Column colMd={3} colLg={3} noGutterMdLeft>
    <Review1 />
  </Column>
</Row>
```

この場合、ファイル上部に関連レビューのインポート文を追加：

```mdx
import Review1 from "../book/[related-book]A.mdx";
```

例: [`kendricklamarkawadeL.mdx`](src/pages/book/kendricklamarkawadeL.mdx:10-11)

---

このガイドに従って、一貫性のあるブックレビューページを作成してください。