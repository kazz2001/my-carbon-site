#!/usr/bin/env node

/**
 * JSONファイルからアルバムレビューページを自動生成するスクリプト
 * 
 * 使用方法:
 * node generate-review-from-json.js config.json
 * 
 * または実行権限を付与して:
 * chmod +x generate-review-from-json.js
 * ./generate-review-from-json.js config.json
 */

const fs = require('fs');
const path = require('path');

// コマンドライン引数からJSONファイルパスを取得
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('エラー: JSONファイルのパスを指定してください');
  console.log('使用方法: node generate-review-from-json.js <config.json>');
  console.log('例: node generate-review-from-json.js generate-review-config.json');
  process.exit(1);
}

const configPath = args[0];

// JSONファイルの読み込み
let config;
try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configContent);
} catch (error) {
  console.error(`エラー: JSONファイルの読み込みに失敗しました: ${error.message}`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('アルバムレビューページ自動生成スクリプト (JSON版)');
console.log('='.repeat(60));
console.log('');

// 設定ファイルの検証
function validateConfig(data) {
  const required = [
    'artistName', 'albumTitle', 'identifier',
    'reviewPara1', 'reviewPara2', 'reviewPara3', 'reviewPara4',
    'score1', 'score2', 'score3', 'score4'
  ];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`必須フィールド "${field}" が見つかりません`);
    }
  }
}

// カード版ファイル生成（番号なし版）
function generateCardVersion(data) {
  const {
    artistName,
    albumTitle,
    identifier
  } = data;
  
  const content = `<ArticleCard
  title="${artistName} / ${albumTitle}"
  href="/review/${identifier}L/"
  actionIcon="arrowRight"
>

![${artistName} / ${albumTitle}](../../images/cd/${identifier}L.jpg)

</ArticleCard>

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
`;
  
  const outputPath = path.join('src', 'pages', 'review', `${identifier}.mdx`);
  
  // ディレクトリが存在しない場合は作成
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${outputPath} を生成しました`);
}

// A版ファイル生成
function generateAVersion(identifier, para1, para2, para3, para4) {
  const content = `<p>
\t${para1}
\t<br/>${para2}
\t<br/>${para3}
\t<br/>${para4}
</p>

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
`;
  
  const outputPath = path.join('src', 'pages', 'review', `${identifier}A.mdx`);
  
  // ディレクトリが存在しない場合は作成
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${outputPath} を生成しました`);
}

// L版ファイル生成
function generateLVersion(data) {
  const {
    artistName,
    artistNameJa = '',
    albumTitle,
    albumTitleJa = '',
    identifier,
    reviewPara1,
    reviewPara2,
    reviewPara3,
    reviewPara4,
    score1,
    score2,
    score3,
    score4,
    producers = '',
    guests = '',
    amazonCom = 'https://amzn.to/XXXXXXX',
    amazonJp = 'https://amzn.to/XXXXXXX',
    appleMusic = 'https://apple.co/XXXXXXX',
    best50Year = '',
    best50Rank = '',
    relatedReviews = [],
    tracks = []
  } = data;
  
  // キーワード生成
  const keywords = [artistName, albumTitle, artistNameJa, albumTitleJa]
    .filter(k => k)
    .join(', ');
  
  // 関連レビューのインポート文生成
  let relatedImports = '';
  if (relatedReviews.length > 0) {
    relatedImports = '\n' + relatedReviews.map((review, index) =>
      `import Review${index + 1} from "../review/${review.identifier}.mdx";`
    ).join('\n');
  }
  
  // Best50リンク生成
  let best50Link = '';
  if (best50Year && best50Rank) {
    best50Link = `\n<p className="largeP">
  <Link to="/best50/${best50Year}/">${best50Year} Black Music Best No.${best50Rank}</Link>
</p>`;
  }
  
  // プロデューサー情報整形
  let producersFormatted = producers;
  if (producers && !producers.includes('<br/>')) {
    producersFormatted = producers.split('\n').filter(p => p.trim()).join('\n\t\t\t\t<br/>');
  }
  
  // トラックリスト生成
  let tracklistSection = '';
  if (tracks.length > 0) {
    // 各列の最大長を計算
    let maxNumLen = 3; // "No."の最小長
    let maxTitleLen = 5; // "Title"の最小長
    let maxComposersLen = 9; // "Composers"の最小長
    let maxPerformerLen = 9; // "Performer"の最小長
    let maxTimeLen = 4; // "Time"の最小長
    
    tracks.forEach(track => {
      const cleanTitle = track.title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const cleanComposers = track.composers.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const cleanPerformer = track.performer.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      
      maxNumLen = Math.max(maxNumLen, String(track.num).length);
      maxTitleLen = Math.max(maxTitleLen, cleanTitle.length);
      maxComposersLen = Math.max(maxComposersLen, cleanComposers.length);
      maxPerformerLen = Math.max(maxPerformerLen, cleanPerformer.length);
      maxTimeLen = Math.max(maxTimeLen, track.time.length);
    });
    
    const trackRows = tracks.map(track => {
      // 改行を削除してスペースに置き換え
      const cleanTitle = track.title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const cleanComposers = track.composers.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const cleanPerformer = track.performer.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      
      return `| ${String(track.num).padEnd(maxNumLen)} | ${cleanTitle.padEnd(maxTitleLen)} | ${cleanComposers.padEnd(maxComposersLen)} | ${cleanPerformer.padEnd(maxPerformerLen)} | ${track.time.padEnd(maxTimeLen)} |`;
    }).join('\n');
    
    // セパレーター行を動的に生成
    const separator = `| ${'-'.repeat(maxNumLen)} | ${'-'.repeat(maxTitleLen)} | ${'-'.repeat(maxComposersLen)} | ${'-'.repeat(maxPerformerLen)} | ${'-'.repeat(maxTimeLen)} |`;
    
    tracklistSection = `
<h3>Tracks</h3>

| ${'No.'.padEnd(maxNumLen)} | ${'Title'.padEnd(maxTitleLen)} | ${'Composers'.padEnd(maxComposersLen)} | ${'Performer'.padEnd(maxPerformerLen)} | ${'Time'.padEnd(maxTimeLen)} |
${separator}
${trackRows}
`;
  }
  
  // 関連レビューセクション生成
  let relatedSection = '';
  if (relatedReviews.length > 0) {
    const reviewColumns = relatedReviews.map((_, index) => 
      `  <Column colMd={3} colLg={3} noGutterMdLeft>
    <Review${index + 1} />
  </Column>`
    ).join('\n');
    
    relatedSection = `
<h3>Other Reviews</h3>

<Row>
${reviewColumns}
</Row>
`;
  }
  
  const content = `---
title: "${artistName} / ${albumTitle}"
description: "Album Review of ${artistName} / ${albumTitle}"
keywords: "${keywords}"
---

import { Slider, Button } from "@carbon/react";
import { ArrowUpRight } from "@carbon/icons-react";

import SliderJS1 from "../review/slider1";
import SliderJS2 from "../review/slider2";
import SliderJS3 from "../review/slider3";
import SliderJS4 from "../review/slider4";
import AdvJS2 from "../review/adv2";
import AdvJS3 from "../review/adv3";

import { Link } from "gatsby";${relatedImports}

<p className="largeP">Album Review</p>
<h1 className="h1--no--margin">{props.pageContext.frontmatter.title}</h1>${best50Link}

<Row  className="image-card-group">
\t<Column colMd={3} colLg={4} noGutterMdLeft="">
       <ImageCard>

![${artistName} / ${albumTitle}](../../images/cd/${identifier}L.jpg)

</ImageCard>
\t</Column>
\t<Column colMd={4} colLg={8} noGutterMdLeft="">
\t\t<p>
\t\t\t${reviewPara1}
\t\t\t<br/>${reviewPara2}
\t\t\t<br/>${reviewPara3}
\t\t\t<br/>${reviewPara4}
\t\t</p>
\t\t<div>
\t\t  <Button className="button-right-mergin"  href="${amazonCom}" renderIcon={ArrowUpRight} size='sm' kind='primary'>
  \t    amazon.com
  \t  </Button>
  \t  <Button className="button-right-mergin"  href="${amazonJp}" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
  \t    amazon.co.jp
  \t  </Button>
\t\t<Button className="button-right-mergin"  href="${appleMusic}" renderIcon={ArrowUpRight} size='sm' kind='tertiary'>
  \t    apple music
  \t  </Button>
\t\t<AdvJS2/>
\t\t</div>
\t</Column>
</Row>
<Row >
\t<Column colMd={4} colLg={4} noGutterMdLeft="">
\t\t<div>
\t\t  <h3>Score card</h3>
\t\t\t<SliderJS1 value="${score1}" />
\t\t  <SliderJS2 value="${score2}" />
\t\t\t<SliderJS3 value="${score3}" />
\t\t  <SliderJS4 value="${score4 * 2}" />
\t\t</div>
\t</Column>
\t<Column colMd={4} colLg={8} noGutterMdLeft="">
\t\t<div>
\t\t\t<h3>Producers</h3>
\t\t\t<p>
\t\t\t\t${producersFormatted}
\t\t\t</p>
\t\t\t<h3>Guests</h3>
\t\t\t<p>
\t\t\t\t${guests}
\t\t\t</p>
\t\t</div>
\t</Column>
</Row>
${tracklistSection}${relatedSection}
<AdvJS3 />
`;
  
  const outputPath = path.join('src', 'pages', 'review', `${identifier}L.mdx`);
  
  // ディレクトリが存在しない場合は作成
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${outputPath} を生成しました`);
}

// メイン処理
try {
  // 設定ファイルに "example" キーがある場合はそれを使用
  const data = config.example || config;
  
  console.log('設定内容:');
  console.log(`  アーティスト: ${data.artistName}`);
  console.log(`  アルバム: ${data.albumTitle}`);
  console.log(`  識別子: ${data.identifier}`);
  console.log('');
  
  // 設定の検証
  validateConfig(data);
  
  console.log('ファイルを生成中...');
  console.log('='.repeat(60));
  
  // ファイル生成
  generateAVersion(
    data.identifier,
    data.reviewPara1,
    data.reviewPara2,
    data.reviewPara3,
    data.reviewPara4
  );
  
  generateLVersion(data);
  
  generateCardVersion(data);
  
  console.log('\n✅ ファイル生成完了！');
  console.log(`\n生成されたファイル:`);
  console.log(`  - src/pages/review/${data.identifier}.mdx (カード版)`);
  console.log(`  - src/pages/review/${data.identifier}A.mdx`);
  console.log(`  - src/pages/review/${data.identifier}L.mdx`);
  console.log(`\n次のステップ:`);
  console.log(`  1. アルバムジャケット画像を src/images/cd/${data.identifier}L.jpg として配置`);
  console.log(`  2. 生成されたファイルを確認・編集`);
  console.log(`  3. トラックリストを完成させる（必要に応じて）`);
  
} catch (error) {
  console.error('\nエラーが発生しました:', error.message);
  process.exit(1);
}

// Made with Bob
