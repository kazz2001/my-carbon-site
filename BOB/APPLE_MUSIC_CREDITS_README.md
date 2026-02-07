# Apple Music Credits URL取得スクリプト

Apple Musicのアルバムから各曲の"View Credits"画面のURLを取得するスクリプトです。

## スクリプトの種類

### 1. fetch_apple_music_credits.js
**用途**: "Let God Sort Em Out"アルバム専用の固定スクリプト

**使い方**:
```bash
node fetch_apple_music_credits.js "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US"
```

**特徴**:
- アルバム「Let God Sort Em Out」の12曲の情報が事前に設定済み
- 最初の曲のURLを指定するだけで全曲のクレジットURLを生成
- 入力不要で即座に実行可能

**出力ファイル**: `let_god_sort_em_out_credits_urls.txt`

---

### 2. fetch_apple_music_credits_generic.js
**用途**: 任意のApple Musicアルバムに対応する汎用スクリプト

**使い方**:
```bash
node fetch_apple_music_credits_generic.js "https://music.apple.com/jp/song/[曲名]/[曲ID]?l=en-US"
```

**特徴**:
- 任意のアルバムに対応
- 対話形式で各曲の情報を入力
- アルバム名とアーティスト名も入力可能

**入力例**:
```
1曲目のタイトル: The Birds Don't Sing
1曲目のURL slug: the-birds-dont-sing
2曲目のタイトル: Chains & Whips
2曲目のURL slug: chains-whips
...
（空行で終了）

アルバム名: Let God Sort Em Out
アーティスト名: Clipse, Pusha T, Malice
```

**出力ファイル**: `[アーティスト名]_[アルバム名]_credits_urls.txt`

---

## URL slugの見つけ方

Apple MusicのURL構造:
```
https://music.apple.com/jp/song/[URL-SLUG]/[曲ID]?l=en-US
```

例:
- 曲名: "The Birds Don't Sing"
- URL slug: `the-birds-dont-sing`
- 完全なURL: `https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US`

**URL slugの作成ルール**:
1. 曲名を小文字に変換
2. スペースをハイフン（-）に置換
3. 特殊文字を削除または置換
4. 括弧などは削除

例:
- "Chains & Whips" → `chains-whips`
- "M.A.R.T.Y" → `m-a-r-t-y`
- "Let God Sort Em Out (Consequences)" → `let-god-sort-em-out-consequences`

---

## 前提条件

- Node.jsがインストールされていること
- Apple Musicの曲IDは連番になっていることが前提
  - 例: 1曲目が1816313640なら、2曲目は1816313641、3曲目は1816313642...

---

## 出力ファイルの形式

```
アルバム「Let God Sort Em Out」- Clipse, Pusha T, Malice
取得日時: 2026/2/6 16:28:54
総曲数: 12曲
================================================================================

各曲のView Credits画面URL:

1. The Birds Don't Sing
   https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US

2. Chains & Whips
   https://music.apple.com/jp/song/chains-whips/1816313641?l=en-US

...
```

---

## トラブルシューティング

### URLが正しく生成されない場合
1. 最初の曲のURLが正しいか確認
2. URL slugが正しいか確認（Apple Musicのページで実際のURLを確認）
3. 曲IDが連番になっているか確認

### スクリプトが実行できない場合
```bash
# Node.jsのバージョン確認
node --version

# スクリプトに実行権限を付与（必要に応じて）
chmod +x fetch_apple_music_credits.js
```

---

## 作成日
2026年2月6日

## 作成者
IBM Bob