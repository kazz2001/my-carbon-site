# Apple Music Credits Fetcher

Apple MusicのトラックURLから、Performing Artists、Composition & Lyrics、Producerの情報を取得するNode.jsスクリプトです。

## 機能

- Apple Musicの各トラックページから以下の情報を抽出:
  - **Performing Artists** - アーティスト名と役割（Vocals, Rap, Background Vocalsなど）
  - **Composition & Lyrics** - 作詞・作曲者の名前（カンマ区切り）
  - **Producer** - プロデューサーの名前（"and"で繋げて表示）
- 3つの形式で結果を出力:
  - JSON形式（構造化データ）
  - Markdown形式（読みやすいドキュメント）
  - テキスト形式（シンプルなリスト）

## 必要要件

- Node.js（v12以上推奨）
- インターネット接続

## 使い方

### 1. 入力JSONファイルの準備

以下の構造を持つJSONファイルを用意します：

```json
{
  "albumTitle": "Still Over It",
  "albumArtist": "Summer Walker",
  "albumUrl": "https://music.apple.com/jp/album/still-over-it/1590029262?l=en-US",
  "trackUrls": [
    {
      "trackNumber": 1,
      "title": "Bitter (Narration By Cardi B)",
      "url": "https://music.apple.com/jp/song/bitter-narration-by-cardi-b/1590029265?l=en-US"
    },
    {
      "trackNumber": 2,
      "title": "Ex For A Reason",
      "url": "https://music.apple.com/jp/song/ex-for-a-reason/1590029284?l=en-US"
    }
  ]
}
```

### 2. スクリプトの実行

```bash
node fetch_apple_music_credits.js <入力JSONファイル>
```

**実行例:**
```bash
node fetch_apple_music_credits.js apple-music-view-details-urls.json
```

### 3. 出力ファイル

入力ファイル名に基づいて、以下の3つのファイルが生成されます：

- `<入力ファイル名>-credits.json` - JSON形式の完全なデータ
- `<入力ファイル名>-credits.md` - Markdown形式のドキュメント
- `<入力ファイル名>-credits.txt` - テキスト形式のリスト

**例:**
入力: `apple-music-view-details-urls.json`
出力:
- `apple-music-view-details-urls-credits.json`
- `apple-music-view-details-urls-credits.md`
- `apple-music-view-details-urls-credits.txt`

## 出力例

### Markdown形式 (.md)

```markdown
## 2. Ex For A Reason

### Performing Artists
- **City Girls** - Background Vocals
- **JT** - Rap
- **Nija Charles** - Background Vocals
- **Sean Garrett** - Background Vocals
- **Summer Walker** - Vocals

### Composition & Lyrics
Summer Walker, Sean Garrett, Jatavia Johnson, Ty-Ron Douglas, Aubrey Robinson, Nija Charles

### Producer
Sean Garrett, Buddah Bless and Boobie

**URL:** https://music.apple.com/jp/song/ex-for-a-reason/1590029284?l=en-US
```

### テキスト形式 (.txt)

```
Track 2: Ex For A Reason
────────────────────────────────────────────────────────────
Performing Artists:
  • City Girls (Background Vocals)
  • JT (Rap)
  • Nija Charles (Background Vocals)
  • Sean Garrett (Background Vocals)
  • Summer Walker (Vocals)
Composition & Lyrics:
  Summer Walker, Sean Garrett, Jatavia Johnson, Ty-Ron Douglas, Aubrey Robinson, Nija Charles
Producer:
  Sean Garrett, Buddah Bless and Boobie
```

## エラーハンドリング

スクリプトは以下のエラーをチェックします：

- 入力ファイルが指定されていない
- 入力ファイルが存在しない
- JSONの構造が不正
- ネットワークエラー

エラーが発生した場合、該当トラックは "Error fetching" として記録され、処理は続行されます。

## 注意事項

- Apple Musicのサーバーに負荷をかけないよう、各リクエスト間に1秒の遅延を設けています
- 大量のトラックを処理する場合は時間がかかります（20トラックで約20秒）
- Apple Musicのページ構造が変更された場合、スクリプトが動作しなくなる可能性があります

## トラブルシューティング

### "File not found" エラー
- 入力ファイルのパスが正しいか確認してください
- カレントディレクトリにファイルがあるか確認してください

### "Invalid JSON structure" エラー
- JSONファイルの構造が正しいか確認してください
- `trackUrls` 配列が存在するか確認してください

### データが取得できない
- インターネット接続を確認してください
- Apple MusicのURLが正しいか確認してください
- Apple Musicのページ構造が変更されていないか確認してください

## ライセンス

このスクリプトは教育目的で作成されています。Apple Musicの利用規約を遵守してご使用ください。

## 更新履歴

- v1.0 (2026-02-08) - 初版リリース
  - Performing Artists、Composition & Lyrics、Producerの情報取得機能
  - JSON、Markdown、テキスト形式での出力
  - コマンドライン引数によるファイル指定