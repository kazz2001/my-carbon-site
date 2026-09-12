# 1と2を続けて実行する

```bash
node BOB/scrape-and-generate.js		<p>
			Genesis Owusuの3年ぶりとなる3rdスタジオアルバム。過去作の内省的・寓話的な表現から一転し、2020年代の地球上で起きている生々しい現実に直結した作品です。世界にはびこるヘイトや強欲、偏見を「世界規模の災厄（The Worldwide Scourge）」と位置づけ、正面から対峙。
			<br/>暗澹たるディストピアの絶望から、人々の連帯と慎重な希望を見出すまでの感情の軌跡をリニアに描き出しています。
      ポストパンク、シンセパンク、ファンク、ネオソウル、インダストリアル、エレクトロニックを自在に越境するサウンドが特徴で。性急で荒々しいパンクから、ぬめり気のある重厚なスラッジ・ファンク、エレクトロニック・サウンドまで、緊張感とダンサブルな祝祭性がアルバム全体でせめぎ合っている。
      <br/>全編の主プロデュースとミックスは盟友Dann Humeが手掛け、ウェールズの改築教会に籠もり二人三脚で密室感のある鋭敏な音響を構築している。
			<br/>①で見せる息をつかせぬ荒々しいパンク・シャウトや攻撃的なラップから、⑥での艶やかで甘美な歌唱まで、表現のレンジが広い。リリックでは、ガザの悲劇、大統領選の狂騒、SNSに蔓延する陰謀論やインセル文化などを逃げずに直截な言葉で告発しています。
		</p> <URL> [output-filename.json]
```

# 1 bmより情報抽出

```bash
node BOb/scrape-review-to-json.js <URL>
```

# 2 MDX作成

```bash
node Bob/generate-review-from-json.js config.json
```

# 3 手動で修正

affiliate link,画像の配置, レビューコメント整形、Aファイル修正

# 4,5,7を続けて実行するスクリプト

```bash
node BOB/add-review-to-all.js addisonrae1 2025
```

# 4 Index.htmに追加

```bash
node Bob/add-review-to-index.js <review-name>
```

# 5 Latestに追加

```bash
node Bob/add-review-to-latest.js <review-name>
```

# 6 best50に追加

```bash
node Bob/add-review-to-best50-table-only.js <review-name>
```

または

```bash
node Bob/add-review-to-best50.js 2025 <review-name>
```

# 7 年ごとのページに追加

```bash
node Bob/add-review-to-cd-year.js addisonrae1 2025
```

# 8 相互リンク追加

```bash
node BOB/add-review-to-related.js <review-name>
```

# 9 レビューファイルのレビュー

```bash
/review <review-file-name>
```
