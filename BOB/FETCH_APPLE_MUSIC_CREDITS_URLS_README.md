# fetch_apple_music_credits_urls.js

Apple Musicのアルバムページから、すべてのトラックのクレジットURLを自動取得するスクリプトです。

## 概要

このスクリプトは、Apple Musicの曲URLまたはアルバムURLを入力として受け取り、アルバム内のすべてのトラックについて、クレジット情報ページのURLを自動的に収集します。

## 主な機能

- **アルバム情報の自動取得**: 曲URLからアルバムページに自動遷移
- **全トラックのクレジットURL収集**: アルバム内のすべての曲のクレジットページURLを取得
- **結果のファイル出力**: 取得したURLをテキストファイルに保存
- **エラーハンドリング**: 各トラックの処理でエラーが発生しても継続

## 必要な環境

- Node.js (v14以上推奨)
- npm パッケージ:
  - `puppeteer`

## インストール

```bash
npm install puppeteer
```

## 使い方

### 基本的な使用方法

```bash
node fetch_apple_music_credits_urls.js <Apple Music曲URL>
```

### 実行例

**曲URLから実行:**
```bash
node fetch_apple_music_credits_urls.js "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640"
```

**アルバムURLから実行:**
```bash
node fetch_apple_music_credits_urls.js "https://music.apple.com/jp/album/the-art-of-loving/1817609404"
```

## 処理の流れ

1. **曲ページにアクセス**: 指定されたApple Music曲URLにアクセス
2. **アルバムページへ遷移**: 曲ページからアルバムリンクを見つけて移動
3. **アルバム情報取得**: アルバムタイトルとアーティスト名を取得
4. **トラックリスト取得**: アルバム内のすべてのトラック情報を収集
5. **各トラックのクレジットURL取得**:
   - 各トラックの「...」メニューボタンをクリック
   - 「View Credits」メニュー項目を選択
   - クレジットページのURLを記録
   - アルバムページに戻る
6. **結果をファイルに保存**: 取得したURLをテキストファイルに出力

## 出力ファイル

### ファイル名形式

```
{アーティスト名}_{アルバム名}_credits_urls.txt
```

例: `nas_illmatic_credits_urls.txt`

### ファイル内容

```
アルバム「Illmatic」- Nas
取得日時: 2026/2/22 13:51:08
総曲数: 10曲
================================================================================

1. The Genesis
   Credits URL: https://music.apple.com/jp/album/illmatic/662324135?i=662324141&l=en-US

2. N.Y. State of Mind
   Credits URL: https://music.apple.com/jp/album/illmatic/662324135?i=662324147&l=en-US

...
```

## 技術的な詳細

### Puppeteer設定

- **ブラウザ**: Google ChromeまたはMicrosoft Edgeを自動検出して使用
  - **重要**: ChromiumではなくChromeまたはEdgeを使用します（コンテキストメニュー表示のため）
  - 以下の順序で検索します：
    1. 環境変数 `CHROME_PATH`
    2. `C:\Program Files\Google\Chrome\Application\chrome.exe`
    3. `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
    4. `C:\Program Files\Microsoft\Edge\Application\msedge.exe`
    5. macOS/Linuxの標準パス
  - 見つからない場合は、デフォルトのChromiumを使用（コンテキストメニューが表示されない可能性あり）
  
- **ヘッドレスモード**: デフォルトで無効（ブラウザが表示されます）
  - Apple Musicのクレジット機能にアクセスするには、ログインが必要です
  - ブラウザが起動したら、必ず手動でログインしてください
  
- **ビューポートサイズ**: 1920x3840（大きな画面で全要素を表示）

- **タイムアウト**: 60秒（ページ読み込み）

### セレクタ

- アルバムリンク: `a[href*="/album/"]`
- トラックリスト: `[data-testid="track-list"] [role="button"]`
- トラックタイトル: `[data-testid="track-title"]`
- メニューボタン: `button[aria-label*="More"]`
- View Creditsメニュー: `[role="menuitem"]` (テキストマッチング)

### エラーハンドリング

各トラックの処理で以下のエラーが発生した場合でも、処理を継続します:

- メニューボタンが見つからない
- View Creditsボタンが見つからない
- その他の予期しないエラー

エラーが発生したトラックには、エラーメッセージが記録されます。

## 注意事項

1. **ChromeまたはEdgeが必要**:
   - **重要**: このスクリプトはGoogle ChromeまたはMicrosoft Edgeを使用します
   - Chromiumではコンテキストメニューが表示されないため、ChromeまたはEdgeのインストールが必要です
   - ChromeまたはEdgeが標準的な場所にインストールされていない場合は、環境変数 `CHROME_PATH` を設定してください
   - 例: `set CHROME_PATH=C:\path\to\chrome.exe` (Windows)

2. **Apple Musicへのログインが必須**:
   - **重要**: Apple Musicのウェブ版でクレジット情報にアクセスするには、Apple IDでログインする必要があります
   - スクリプト実行時にブラウザが起動します
   - ブラウザが起動したら、**必ず手動でApple Musicにログインしてください**
   - ログインしないと、右クリックメニューが表示されず、クレジットURLを取得できません
   
3. **手動操作が必要な場合**:
   - 自動化がうまく動作しない場合は、ブラウザで以下の手順を手動で実行してください：
     1. アルバムページを開く
     2. 各トラックの右端にある「...」ボタンを右クリック
     3. 表示されるメニューから「View Credits」または「クレジットを表示」を選択
     4. 表示されたクレジットページのURLをコピー

4. **実行時間**: アルバムのトラック数に応じて処理時間が長くなります（1トラックあたり約3-5秒）

5. **ネットワーク接続**: 安定したインターネット接続が必要です

6. **Apple Musicの仕様変更**: Apple Musicのページ構造が変更された場合、スクリプトの修正が必要になる可能性があります

7. **言語対応**: 日本語と英語のUIに対応しています

8. **URL形式**: 曲URLとアルバムURLの両方に対応しています

9. **サブスクリプション**: Apple Music のサブスクリプションが必要な場合があります

## トラブルシューティング

### 「アルバムURLが見つかりませんでした」エラー

- 曲URLが正しいか確認してください
- ページの読み込みが完了するまで待機時間を増やしてください

### 「メニュー項目数: 0」または「View Creditsボタンが見つかりませんでした」

- **最も可能性が高い原因**: Apple Musicにログインしていません
  - ブラウザが起動したら、必ず手動でApple Musicにログインしてください
  - ログイン後、スクリプトを再実行してください
  
- 一部のトラックではクレジット情報が提供されていない場合があります

- Apple Musicのページ構造が変更された可能性があります

### 手動での代替方法

自動化がうまく動作しない場合は、以下の手順で手動でクレジットURLを取得できます：

1. ブラウザでApple Musicにログイン
2. アルバムページを開く
3. 各トラックの右端にある「...」を右クリック
4. 「View Credits」または「クレジットを表示」を選択
5. 表示されたページのURLをコピー

### タイムアウトエラー

- ネットワーク接続を確認してください
- `timeout`値を増やしてください（コード内の60000を90000などに変更）

## 関連スクリプト

- [`fetch_apple_music_credits.js`](fetch_apple_music_credits.js:1) - クレジットURLから実際のクレジット情報を取得
- [`fetch_album_producers.js`](fetch_album_producers.js:1) - アルバムのプロデューサー情報を取得

## ライセンス

このスクリプトは個人利用を目的としています。Apple Musicの利用規約を遵守してください。

---

Made with Bob