# Apple Music トラックリスト取得スクリプト

Apple Musicのアルバムページからトラックリスト情報を自動取得し、テキストファイルに出力するスクリプトです。

## 必要な環境

- Node.js (v14以上推奨)
- npm

## セットアップ

1. 必要なパッケージをインストール:

```bash
npm install puppeteer
```

## 使用方法

### 基本的な使い方

```bash
node fetch_apple_music_tracklist.js "<Apple Music URL>"
```

### 例

```bash
# アルバムページのURLを指定
node fetch_apple_music_tracklist.js "https://music.apple.com/jp/album/let-god-sort-em-out/1816313634?l=en-US"

# 単一の曲のURLでも可（自動的にアルバムページに移動）
node fetch_apple_music_tracklist.js "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US"
```

## 出力内容

スクリプトは以下の情報を含むテキストファイルを生成します：

- アルバムタイトル
- アーティスト名
- ジャンル・リリース年
- 各トラックの情報：
  - 曲番号
  - 曲名
  - パフォーマー（アーティスト）
  - 再生時間

### 出力ファイル名

アルバムタイトルから自動生成されます（例: `let-god-sort-em-out-tracklist.txt`）

### 出力例

```
Let God Sort Em Out
Clipse, Pusha T, Malice
HIP-HOP/RAP - 2025

トラックリスト:

1. The Birds Don't Sing
   Performer: Clipse, John Legend, Voices of Fire, Pusha T, Malice
   時間: 4:09

2. Kinda Like a Big Deal
   Performer: Clipse, Pharrell Williams, Pusha T, Malice
   時間: 4:03

...

総曲数: 12曲
```

## 注意事項

- Apple Musicのページ構造が変更された場合、スクリプトの修正が必要になる場合があります
- ネットワーク接続が必要です
- 初回実行時はPuppeteerがChromiumをダウンロードするため、時間がかかる場合があります
- ページの読み込みに時間がかかる場合があります（通常30秒以内）

## トラブルシューティング

### トラック情報が取得できない場合

1. URLが正しいか確認してください
2. Apple Musicのページが正常に表示されるか確認してください
3. ネットワーク接続を確認してください

### エラーが発生する場合

```bash
# Puppeteerを再インストール
npm uninstall puppeteer
npm install puppeteer
```

## 技術仕様

- **使用ライブラリ**: Puppeteer
- **ブラウザ**: Headless Chrome
- **ビューポートサイズ**: 1920x3840
- **タイムアウト**: 60秒

## ライセンス

このスクリプトは個人利用を目的としています。Apple Musicの利用規約を遵守してください。