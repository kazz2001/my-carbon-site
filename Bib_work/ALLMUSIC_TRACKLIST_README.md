# AllMusic Track List Scraper

AllMusicのアルバムページからトラックリスト情報を取得して、HTMLテーブルを生成するスクリプトです。

## 機能

- AllMusicのアルバムURLを入力として受け取る
- トラックリスト（曲番号、タイトル、作曲者、演奏者、演奏時間）を自動取得
- 参考ページ（https://bm.planetky.com/oliviadean1.htm）と同じ形式のHTMLテーブルを生成
- 見やすいスタイリング付きのHTMLファイルを出力

## 必要な環境

- Node.js (v14以上推奨)
- npm

## インストール

```bash
npm install puppeteer
```

## 使い方

### 基本的な使い方

```bash
node allmusic_to_tracklist.js <AllMusic URL>
```

### 例

```bash
node allmusic_to_tracklist.js https://www.allmusic.com/album/the-art-of-loving-mw0004542465
```

### 実行結果

スクリプトを実行すると、以下のような処理が行われます：

1. AllMusicのページにアクセス
2. アルバム情報（アーティスト名、アルバムタイトル）を取得
3. トラックリストを取得
4. HTMLファイルを生成（ファイル名: `アーティスト名_アルバム名.html`）

### 出力例

```
AllMusicページを取得中: https://www.allmusic.com/album/the-art-of-loving-mw0004542465
アルバム: Olivia Dean - The Art of Loving
12曲のトラックを取得しました

✓ HTMLファイルを生成しました: olivia_dean_the_art_of_loving.html
✓ 12曲のトラックリストを含みます
```

## 生成されるHTMLの構造

生成されるHTMLファイルには以下の情報が含まれます：

- **アルバムタイトル**: アーティスト名 / アルバム名
- **Tracksテーブル**: 
  - No. (曲番号)
  - Title (曲名)
  - Composer (作曲者)
  - Performer (演奏者)
  - Time (演奏時間)

## スクリプトの構造

### 主要な関数

#### `scrapeAllMusicTrackList(url)`
- AllMusicのURLからトラックリスト情報を取得
- Puppeteerを使用してページをスクレイピング
- 戻り値: `{ albumInfo, tracks }` オブジェクト

#### `generateHTML(data)`
- 取得したデータからHTMLを生成
- 参考ページと同じスタイルを適用
- 戻り値: HTML文字列

#### `main()`
- メイン処理
- コマンドライン引数の処理
- ファイルの保存

## エラーハンドリング

- URLが指定されていない場合: 使用方法を表示
- AllMusicのURLでない場合: エラーメッセージを表示
- トラックリストが見つからない場合: エラーメッセージを表示

## 注意事項

- AllMusicのページ構造が変更された場合、スクリプトの修正が必要になる可能性があります
- スクレイピングは適切な頻度で行ってください
- 生成されるHTMLファイルは、既存のファイルを上書きします

## ライセンス

このスクリプトは個人利用を目的としています。

## トラブルシューティング

### Puppeteerのインストールエラー

```bash
npm install puppeteer --unsafe-perm=true --allow-root
```

### タイムアウトエラー

ネットワークが遅い場合、スクリプト内の `timeout` 値を増やしてください：

```javascript
await page.goto(url, { 
    waitUntil: 'networkidle2',
    timeout: 60000  // 60秒に変更
});
```

## 今後の改善案

- [ ] プロデューサー情報の自動取得
- [ ] ゲストアーティスト情報の自動取得
- [ ] 複数のアルバムを一括処理
- [ ] JSON形式での出力オプション
- [ ] エラーリトライ機能