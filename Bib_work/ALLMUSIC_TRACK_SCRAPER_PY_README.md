# AllMusic Track Scraper (Python版)

AllMusicのアルバムページからトラックリストとComposer情報を取得し、HTMLテーブルを生成するPythonスクリプトです。

## 機能

- AllMusicのアルバムURLからトラック情報を自動取得
- 各トラックのComposer（作曲者）情報を個別に取得
- Performer（演奏者）情報の抽出
- 曲の長さを読みやすい形式（例: 2:34）に変換
- HTMLテーブル形式で整形されたトラックリストを出力

## 必要な環境

- Python 3.x
- 標準ライブラリのみ使用（追加のインストール不要）
  - `json`
  - `re`
  - `urllib.request`
  - `time`
  - `sys`
  - `os`

## 使用方法

### 基本的な使い方

```bash
python3 allmusic_track_scraper.py <AllMusic Album URL>
```

デフォルトでは `track_listing.html` というファイル名で出力されます。

### 出力ファイル名を指定する場合

```bash
python3 allmusic_track_scraper.py <AllMusic Album URL> <output_file.html>
```

### 使用例

```bash
# デフォルトのファイル名で出力
python3 allmusic_track_scraper.py https://www.allmusic.com/album/addison-mw0004526525

# カスタムファイル名で出力
python3 allmusic_track_scraper.py https://www.allmusic.com/album/addison-mw0004526525 my_album.html
```

## 出力形式

スクリプトは以下の情報を含むHTMLテーブルを生成します：

| 項目 | 説明 |
|------|------|
| No. | トラック番号 |
| Title | 曲名 |
| Composer | 作曲者（複数の場合は " / " で区切られる） |
| Performer | 演奏者 |
| Time | 曲の長さ（分:秒形式） |

### 出力HTMLの特徴

- レスポンシブなテーブルデザイン
- 見やすいスタイリング（ボーダー、パディング、ヘッダー背景色）
- UTF-8エンコーディング
- ブラウザで直接開いて確認可能

## 処理の流れ

1. **アルバムページの取得**: 指定されたAllMusic URLからHTMLを取得
2. **トラック情報の抽出**: JSON-LD形式のトラックデータを解析
3. **アルバム情報の取得**: タイトルとアーティスト名を抽出
4. **Composer情報の取得**: 各トラックページに個別にアクセスして作曲者情報を取得
5. **HTMLテーブルの生成**: 取得した情報を整形してHTMLファイルを作成

## 注意事項

### レート制限

- 各トラックのComposer情報を取得する際、1秒間隔でリクエストを送信します
- これはAllMusicサーバーへの負荷を軽減するための措置です
- トラック数が多いアルバムの場合、処理に時間がかかります

### エラーハンドリング

- ネットワークエラーやタイムアウトが発生した場合、該当トラックのComposerは "Unknown" として記録されます
- エラーメッセージは標準エラー出力（stderr）に出力されます

### User-Agent

- スクリプトは `Mozilla/5.0` のUser-Agentを使用してリクエストを送信します
- これはWebスクレイピングの一般的なベストプラクティスです

## 技術的な詳細

### 主要な関数

#### `convert_duration(duration)`
- PT00H02M34S形式の時間を2:34形式に変換

#### `get_composer(url)`
- 個別のトラックページからComposer情報を抽出
- 複数の作曲者がいる場合は " / " で結合

#### `fetch_album_page(album_url)`
- アルバムページのHTMLを取得

#### `extract_tracks(html)`
- HTMLからJSON-LD形式のトラック情報を抽出

#### `generate_html_table(track_data, album_title)`
- トラックデータからHTMLテーブルを生成

## トラブルシューティング

### "トラック情報が見つかりませんでした"

- URLが正しいか確認してください
- AllMusicのページ構造が変更された可能性があります

### タイムアウトエラー

- インターネット接続を確認してください
- AllMusicサーバーが一時的に利用できない可能性があります

### Composer情報が "Unknown" になる

- 該当トラックのページにComposer情報が存在しない可能性があります
- ネットワークエラーが発生した可能性があります

## JavaScript版との違い

同じディレクトリにある `allmusic_track_scraper.js` との主な違い：

- **言語**: Python 3.x（Node.jsではなく）
- **依存関係**: 標準ライブラリのみ（外部パッケージ不要）
- **実行環境**: Pythonインタープリタが必要

## ライセンス

このスクリプトは教育・個人利用目的で作成されています。AllMusicの利用規約を遵守してご使用ください。

## 作成者

Made with Bob

---

**注意**: Webスクレイピングを行う際は、対象サイトの利用規約とrobots.txtを確認し、適切な頻度でアクセスするようにしてください。