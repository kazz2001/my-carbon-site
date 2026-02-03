# ブックレビューテンプレート使用ガイド

## 📚 概要

`/src/pages/book`フォルダーには、R&B・Hip-Hopをテーマにした書籍のレビューが格納されています。
新しい書籍レビューを追加する際は、このテンプレートを使用してください。

## 📁 必要なファイル

各書籍には**2種類のMDXファイル**が必要です：

| ファイル | 用途 | 説明 |
|---------|------|------|
| **A版** (`*A.mdx`) | カード表示用 | 一覧ページ（`bookreview1.mdx`）で使用 |
| **L版** (`*L.mdx`) | 詳細ページ用 | 個別のレビューページ |

## 🚀 クイックスタート

### ステップ1: ファイル名を決める

書籍の識別子を使用してファイル名を決定します：

```
例: "ヒップホップ経営学" → hiphopmba
```

作成するファイル：
- `hiphopmbaA.mdx` （カード表示用）
- `hiphopmbaL.mdx` （詳細ページ用）

### ステップ2: 画像を準備

1. 書籍の表紙画像を用意（JPG形式推奨）
2. `src/images/books/` フォルダーに配置
3. ファイル名: `hiphopmba.jpg`

### ステップ3: テンプレートをコピー

#### A版ファイル（`book-template-A.mdx`をコピー）

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

**記入項目：**
- `title`: 書籍タイトル / 著者名
- `href`: `/book/[識別子]L/` ※必ず末尾に`L`
- 画像パス: `../../images/books/[画像ファイル名].jpg`

#### L版ファイル（`book-template-L.mdx`をコピー）

フロントマター、書誌情報、レビュー本文を記入します。
詳細は`book-template-L.mdx`を参照してください。

### ステップ4: 一覧ページに追加

`src/pages/book/bookreview1.mdx`を編集：

1. **インポート文を追加**（ファイル上部）

```mdx
import Review2025_5 from "./hiphopmbaA.mdx";
```

2. **該当年のセクションに追加**

```mdx
## 2025
<p>画像クリックでレビューページヘ。</p>
<Row>
  <Column colMd={2} colLg={4} noGutterMdLeft>
    <Review2025_5 />
  </Column>
  <!-- 既存のレビュー -->
</Row>
```

## 📋 チェックリスト

新しいブックレビューを追加する際：

- [ ] 書籍の表紙画像を`src/images/books/`に配置
- [ ] A版ファイル（`[identifier]A.mdx`）を作成
  - [ ] タイトルと著者名を記入
  - [ ] hrefパスを正しく設定（末尾に`L`）
  - [ ] 画像パスを正しく設定
- [ ] L版ファイル（`[identifier]L.mdx`）を作成
  - [ ] フロントマター（title, description, keywords）を記入
  - [ ] 書誌情報を記入（著者、出版社、ページ数、価格など）
  - [ ] レビュー本文を記入
  - [ ] Amazonリンクを設定
- [ ] `bookreview1.mdx`にインポート文を追加
- [ ] `bookreview1.mdx`の該当年セクションに追加

## 📝 記入例

### A版の記入例

```mdx
<ArticleCard
  title="オルタナティブR&Bディスクガイド / 監修 川口真紀, つやちゃん"
  href="/book/alternativerandbguideL/"
  actionIcon="arrowRight"
>

![オルタナティブR&Bディスクガイド / 監修 川口真紀, つやちゃん](../../images/books/alternativerandbguide.jpg) 

</ArticleCard>
```

### L版の記入例（抜粋）

```mdx
---
title: "オルタナティブR&Bディスクガイド / 監修 川口真紀, つやちゃん"
description: "オルタナティブR&Bディスクガイド / 監修 川口真紀, つやちゃん"
keywords: "オルタナティブR&Bディスクガイド, 川口真紀, つやちゃん"
---

<Row>
  <Column colMd={8} colLg={12} noGutterMdLeft="">
    <p className="largeP">Book Review</p>
    <h1 className="h1-no-bottom-margin">オルタナティブR&Bディスクガイド</h1>
    <p className="largeP">フランク・オーシャン、ソランジュ、SZAから広がる新潮流</p>
  </Column>
</Row>
```

## ⚠️ よくある注意点

1. **画像パスの相対パス**: A版とL版で同じ相対パス（`../../images/books/`）を使用
2. **hrefの末尾**: A版のhrefは必ず`/book/[identifier]L/`（Lを付ける）
3. **改行タグ**: レビュー本文内の改行は`<br />`を使用（`<br>`ではない）
4. **クラス名**: 
   - `className="largeP"` - 大きめのテキスト
   - `class="p600J"` - 強調表示用（キャッチコピー）
5. **Columnのサイズ**: 既存のパターンに従う
   - 画像: `colMd={3} colLg={4}`
   - 書誌情報: `colMd={5} colLg={8}`
   - レビュー本文: `colMd={8} colLg={12}`

## 📂 ファイル構造

```
src/pages/book/
├── bookreview1.mdx          # 一覧ページ（ここに新規レビューを追加）
├── [identifier]A.mdx        # カード表示用
├── [identifier]L.mdx        # 詳細ページ用
└── ...

src/images/books/
├── [identifier].jpg         # 書籍の表紙画像
└── ...
```

## 🔗 参考ファイル

### 既存のレビュー例
- `hiphopmbaA.mdx` / `hiphopmbaL.mdx`
- `alternativerandbguideA.mdx` / `alternativerandbguideL.mdx`
- `contacthighA.mdx` / `contacthighL.mdx`

### テンプレートファイル
- `book-template-A.mdx` - A版テンプレート
- `book-template-L.mdx` - L版テンプレート

### 詳細ガイド
- `book-template-guide.md` - より詳細な説明

## 💡 Tips

### 著者表記のバリエーション

- 単著: `著 著者名`
- 監修: `監修 監修者名`
- 複数著者: `著 著者1, 著者2`
- 翻訳書: `著 原著者名` + 訳者情報を別途記載

### レビュー本文の構成例

1. **第1段落**: 書籍の概要、第一印象
2. **第2段落**: 内容の詳細、構成、特徴
3. **第3段落**: 具体的な内容紹介、取り上げられているアーティストなど
4. **最終段落**: 個人的な感想、総評、おすすめポイント

### キャッチコピーの活用

書籍の帯文や出版社の紹介文を`<p class="p600J">`で強調表示すると効果的です。

```mdx
<p class="p600J">- フランク・オーシャン、ソランジュ、SZAから広がる新潮流 -</p>
```

## 🆘 トラブルシューティング

### 画像が表示されない
- 画像ファイルが`src/images/books/`に配置されているか確認
- 画像パスが`../../images/books/[filename].jpg`になっているか確認
- ファイル名の大文字小文字が一致しているか確認

### リンクが機能しない
- A版のhrefが`/book/[identifier]L/`になっているか確認（末尾の`L`を忘れずに）
- L版のファイル名が`[identifier]L.mdx`になっているか確認

### 一覧ページに表示されない
- `bookreview1.mdx`にインポート文を追加したか確認
- 該当年のセクションに`<Column>`を追加したか確認
- インポート名とコンポーネント名が一致しているか確認

---

このガイドに従って、一貫性のあるブックレビューページを作成してください。
質問がある場合は、既存のレビューファイルを参考にしてください。