# アルバムレビュー自動生成スクリプト使用ガイド

## 📚 概要

このスクリプトを使用すると、パラメーターを入力するだけでアルバムレビューページ（A版・L版）を自動生成できます。

## 🚀 2つの使用方法

### 方法1: 対話型スクリプト（推奨初心者向け）

質問に答えていくだけでファイルを生成します。

```bash
node generate-review.js
```

#### 入力項目

1. **基本情報**
   - アーティスト名（英語）
   - アーティスト名（日本語）
   - アルバムタイトル（英語）
   - アルバムタイトル（日本語）
   - 何作目のアルバムか
   - ファイル識別子（例: andersonpaak2）

2. **レビュー本文**（4段落）
   - 第1段落: 基本情報
   - 第2段落: サウンドの特徴
   - 第3段落: 制作陣・ゲスト
   - 第4段落: 感想・評価

3. **スコアカード**（0-10）
   - 評価指標1
   - 評価指標2
   - 評価指標3
   - 総合評価

4. **制作情報**
   - プロデューサー（改行区切り）
   - ゲストアーティスト（カンマ区切り）

5. **リンク情報**
   - Amazon.com URL
   - Amazon.co.jp URL
   - Apple Music URL

6. **オプション情報**
   - Best50選出情報（年・順位）
   - 関連レビュー（ファイル名）
   - トラックリスト

### 方法2: JSONファイルから生成（推奨上級者向け）

JSONファイルに情報を記述して一括生成します。

```bash
node generate-review-from-json.js config.json
```

#### JSONファイルの例

`my-album-config.json`:

```json
{
  "artistName": "Anderson.Paak",
  "artistNameJa": "アンダーソン・パーク",
  "albumTitle": "Malibu",
  "albumTitleJa": "マリブ",
  "albumNumber": "2",
  "identifier": "andersonpaak2",
  "reviewPara1": "Anderson.Paakの2作目。前作の高評価とGuest活動を通した注目度の向上を経て、1年強と短インターバルでのリリースである。",
  "reviewPara2": "そんなこともあって、著名な外部ProducerやGuestを迎えて、よりゴージャスな作品になっている。",
  "reviewPara3": "全体的な雰囲気として、Hip-Hopテイストは残るものの、個々の曲はバンドサウンド指向のR&Bが多めになっている。",
  "reviewPara4": "また、ノリの良いPopで聴きやすい曲も多く、万人受けも期待できる。",
  "score1": "4",
  "score2": "1",
  "score3": "1",
  "score4": "9",
  "producers": "Anderson.Paak(1,5,7)\nDJ Khalil(2,12)\nMadlib(3)",
  "guests": "BJ The Chicago Kid, ScHoolboy Q, Rhapsody",
  "amazonCom": "https://amzn.to/3q7Qon9",
  "amazonJp": "https://amzn.to/3bo1116",
  "appleMusic": "https://apple.co/39eCxVr",
  "best50Year": "2016",
  "best50Rank": "6",
  "relatedReviews": ["andersonpaak4", "andersonpaak3"],
  "tracks": [
    {
      "num": 1,
      "title": "The Bird",
      "composers": "Anderson Paak",
      "performer": "Anderson Paak",
      "time": "03:37"
    },
    {
      "num": 2,
      "title": "Heart Don't Stand a Chance",
      "composers": "Anderson Paak",
      "performer": "Anderson Paak",
      "time": "05:12"
    }
  ]
}
```

## 📋 JSONファイルのフィールド

### 必須フィールド

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `artistName` | string | アーティスト名（英語） | "Anderson.Paak" |
| `albumTitle` | string | アルバムタイトル（英語） | "Malibu" |
| `identifier` | string | ファイル識別子 | "andersonpaak2" |
| `reviewPara1` | string | レビュー第1段落 | "Anderson.Paakの2作目..." |
| `reviewPara2` | string | レビュー第2段落 | "そんなこともあって..." |
| `reviewPara3` | string | レビュー第3段落 | "全体的な雰囲気として..." |
| `reviewPara4` | string | レビュー第4段落 | "また、ノリの良い..." |
| `score1` | string | 評価指標1（0-10） | "4" |
| `score2` | string | 評価指標2（0-10） | "1" |
| `score3` | string | 評価指標3（0-10） | "1" |
| `score4` | string | 総合評価（0-10） | "9" |

### オプションフィールド

| フィールド | 型 | 説明 | デフォルト値 |
|-----------|-----|------|------------|
| `artistNameJa` | string | アーティスト名（日本語） | "" |
| `albumTitleJa` | string | アルバムタイトル（日本語） | "" |
| `albumNumber` | string | 何作目か | "" |
| `producers` | string | プロデューサー情報（改行区切り） | "" |
| `guests` | string | ゲストアーティスト（カンマ区切り） | "" |
| `amazonCom` | string | Amazon.com URL | "https://amzn.to/XXXXXXX" |
| `amazonJp` | string | Amazon.co.jp URL | "https://amzn.to/XXXXXXX" |
| `appleMusic` | string | Apple Music URL | "https://apple.co/XXXXXXX" |
| `best50Year` | string | Best50の年 | "" |
| `best50Rank` | string | Best50の順位 | "" |
| `relatedReviews` | array | 関連レビューのファイル名 | [] |
| `tracks` | array | トラックリスト | [] |

### トラックオブジェクトの構造

```json
{
  "num": 1,
  "title": "Track Title",
  "composers": "Composer 1, Composer 2",
  "performer": "Artist Name",
  "time": "03:30"
}
```

## 🎯 使用例

### 例1: 最小限の情報で生成

```json
{
  "artistName": "Ariana Grande",
  "albumTitle": "Eternal Sunshine",
  "identifier": "arianagrande7",
  "reviewPara1": "Ariana Grandeの7作目。",
  "reviewPara2": "サウンドは北欧っぽい。",
  "reviewPara3": "Max Martinが制作。",
  "reviewPara4": "大人な作品。",
  "score1": "5",
  "score2": "1",
  "score3": "1",
  "score4": "9"
}
```

### 例2: 完全な情報で生成

`generate-review-config.json`を参照してください。

## 📂 生成されるファイル

スクリプトを実行すると、以下のファイルが生成されます：

```
src/pages/review/
├── [identifier]A.mdx    # 簡易レビュー
└── [identifier]L.mdx    # 詳細レビューページ
```

## ⚙️ セットアップ

### 前提条件

- Node.js がインストールされていること

### 実行権限の付与（オプション）

Unix系システム（macOS, Linux）の場合：

```bash
chmod +x generate-review.js
chmod +x generate-review-from-json.js
```

これにより、以下のように実行できます：

```bash
./generate-review.js
./generate-review-from-json.js config.json
```

## 📝 ワークフロー

### 対話型スクリプトを使用する場合

1. スクリプトを実行
   ```bash
   node generate-review.js
   ```

2. 質問に答えていく

3. ファイルが生成される

4. アルバムジャケット画像を配置
   ```
   src/images/cd/[identifier]L.jpg
   ```

5. 生成されたファイルを確認・編集

### JSONファイルを使用する場合

1. JSONファイルを作成
   ```bash
   cp generate-review-config.json my-album.json
   ```

2. JSONファイルを編集

3. スクリプトを実行
   ```bash
   node generate-review-from-json.js my-album.json
   ```

4. アルバムジャケット画像を配置
   ```
   src/images/cd/[identifier]L.jpg
   ```

5. 生成されたファイルを確認・編集

## 💡 Tips

### プロデューサー情報の記述方法

改行区切りで記述し、曲番号を括弧内に記載：

```
Anderson.Paak(1,5,7)
DJ Khalil(2,12)
Madlib(3)
9th Wonder and Matthew Merisola(4)
```

### ゲスト情報の記述方法

カンマ区切りで記述：

```
BJ The Chicago Kid, ScHoolboy Q, Rhapsody, The Game
```

### トラックリストの効率的な作成

1. 最初は空の配列で生成
2. 生成されたファイルを開く
3. トラックリストセクションを手動で編集

または、スプレッドシートでトラックリストを作成し、JSONに変換するツールを使用。

### 複数のアルバムを一括生成

JSONファイルを複数用意し、シェルスクリプトで一括実行：

```bash
#!/bin/bash
for config in configs/*.json; do
  node generate-review-from-json.js "$config"
done
```

## ⚠️ 注意点

1. **ファイルの上書き**: 同じidentifierのファイルが存在する場合、上書きされます
2. **ディレクトリの自動作成**: `src/pages/review/`が存在しない場合、自動的に作成されます
3. **画像ファイル**: スクリプトは画像ファイルを生成しません。手動で配置してください
4. **エスケープ**: JSON内で特殊文字（`"`など）を使用する場合は、エスケープが必要です

## 🔧 カスタマイズ

### スクリプトの編集

スクリプトファイル（`generate-review.js`または`generate-review-from-json.js`）を編集することで、以下をカスタマイズできます：

- テンプレートの構造
- デフォルト値
- 出力先ディレクトリ
- ファイル命名規則

### テンプレートの変更

生成されるファイルの構造を変更したい場合は、`generateAVersion()`および`generateLVersion()`関数内のテンプレート文字列を編集してください。

## 🆘 トラブルシューティング

### エラー: JSONファイルの読み込みに失敗

- ファイルパスが正しいか確認
- JSON形式が正しいか確認（カンマの位置、括弧の対応など）
- JSONバリデーターでチェック: https://jsonlint.com/

### エラー: 必須フィールドが見つかりません

- 必須フィールドがすべて含まれているか確認
- フィールド名のスペルミスがないか確認

### ファイルが生成されない

- `src/pages/review/`ディレクトリへの書き込み権限があるか確認
- ディスク容量が十分にあるか確認

### 生成されたファイルの表示が崩れる

- MDX構文が正しいか確認
- 特殊文字が適切にエスケープされているか確認
- 既存のレビューファイルと比較

## 📚 関連ファイル

- `review-template-A.mdx` - A版テンプレート
- `review-template-L.mdx` - L版テンプレート
- `REVIEW-TEMPLATE-README.md` - 手動作成ガイド
- `generate-review-config.json` - サンプル設定ファイル

---

このスクリプトを使用して、効率的にアルバムレビューページを作成してください！