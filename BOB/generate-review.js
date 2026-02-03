#!/usr/bin/env node

/**
 * アルバムレビューページ自動生成スクリプト
 * 
 * 使用方法:
 * node generate-review.js
 * 
 * または実行権限を付与して:
 * chmod +x generate-review.js
 * ./generate-review.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// プロンプト関数
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// メイン処理
async function main() {
  console.log('='.repeat(60));
  console.log('アルバムレビューページ自動生成スクリプト');
  console.log('='.repeat(60));
  console.log('');

  try {
    // 基本情報の入力
    const artistName = await question('アーティスト名 (英語): ');
    const artistNameJa = await question('アーティスト名 (日本語): ');
    const albumTitle = await question('アルバムタイトル (英語): ');
    const albumTitleJa = await question('アルバムタイトル (日本語): ');
    const albumNumber = await question('何作目のアルバムか (数字): ');
    const identifier = await question('ファイル識別子 (例: andersonpaak2): ');
    
    // レビュー情報
    console.log('\n--- レビュー本文 ---');
    const reviewPara1 = await question('第1段落 (基本情報): ');
    const reviewPara2 = await question('第2段落 (サウンドの特徴): ');
    const reviewPara3 = await question('第3段落 (制作陣・ゲスト): ');
    const reviewPara4 = await question('第4段落 (感想・評価): ');
    
    // スコア情報
    console.log('\n--- スコアカード (0-10) ---');
    const score1 = await question('評価指標1: ');
    const score2 = await question('評価指標2: ');
    const score3 = await question('評価指標3: ');
    const score4 = await question('総合評価: ');
    
    // 制作情報
    console.log('\n--- 制作情報 ---');
    const producers = await question('プロデューサー (改行区切りで入力、終了は空Enter):\n');
    const guests = await question('ゲストアーティスト (カンマ区切り): ');
    
    // リンク情報
    console.log('\n--- リンク情報 ---');
    const amazonCom = await question('Amazon.com URL: ');
    const amazonJp = await question('Amazon.co.jp URL: ');
    const appleMusic = await question('Apple Music URL: ');
    
    // Best50情報
    const inBest50 = await question('Best50に選出されていますか？ (y/n): ');
    let best50Year = '';
    let best50Rank = '';
    if (inBest50.toLowerCase() === 'y') {
      best50Year = await question('Best50の年: ');
      best50Rank = await question('Best50の順位: ');
    }
    
    // 関連レビュー
    const hasRelated = await question('関連レビューを追加しますか？ (y/n): ');
    let relatedReviews = [];
    if (hasRelated.toLowerCase() === 'y') {
      console.log('関連レビューのファイル名を入力 (空Enterで終了):');
      let i = 1;
      while (true) {
        const related = await question(`関連レビュー${i}: `);
        if (!related) break;
        relatedReviews.push(related);
        i++;
      }
    }
    
    // トラックリスト
    const hasTracklist = await question('トラックリストを追加しますか？ (y/n): ');
    let tracks = [];
    if (hasTracklist.toLowerCase() === 'y') {
      console.log('トラック情報を入力 (空Enterで終了):');
      let trackNum = 1;
      while (true) {
        const trackTitle = await question(`Track ${trackNum} タイトル: `);
        if (!trackTitle) break;
        const composers = await question(`  作曲者 (カンマ区切り): `);
        const performer = await question(`  演奏者: `);
        const time = await question(`  時間 (MM:SS): `);
        tracks.push({ num: trackNum, title: trackTitle, composers, performer, time });
        trackNum++;
      }
    }
    
    rl.close();
    
    // ファイル生成
    console.log('\n' + '='.repeat(60));
    console.log('ファイルを生成中...');
    console.log('='.repeat(60));
    
    generateAVersion(identifier, reviewPara1, reviewPara2, reviewPara3, reviewPara4);
    generateLVersion({
      artistName,
      artistNameJa,
      albumTitle,
      albumTitleJa,
      identifier,
      reviewPara1,
      reviewPara2,
      reviewPara3,
      reviewPara4,
      score1,
      score2,
      score3,
      score4,
      producers,
      guests,
      amazonCom,
      amazonJp,
      appleMusic,
      best50Year,
      best50Rank,
      relatedReviews,
      tracks
    });
    
    console.log('\n✅ ファイル生成完了！');
    console.log(`\n生成されたファイル:`);
    console.log(`  - src/pages/review/${identifier}A.mdx`);
    console.log(`  - src/pages/review/${identifier}L.mdx`);
    console.log(`\n次のステップ:`);
    console.log(`  1. アルバムジャケット画像を src/images/cd/${identifier}L.jpg として配置`);
    console.log(`  2. 生成されたファイルを確認・編集`);
    console.log(`  3. トラックリストを完成させる（必要に応じて）`);
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
    rl.close();
  }
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
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${outputPath} を生成しました`);
}

// L版ファイル生成
function generateLVersion(data) {
  const {
    artistName,
    artistNameJa,
    albumTitle,
    albumTitleJa,
    identifier,
    reviewPara1,
    reviewPara2,
    reviewPara3,
    reviewPara4,
    score1,
    score2,
    score3,
    score4,
    producers,
    guests,
    amazonCom,
    amazonJp,
    appleMusic,
    best50Year,
    best50Rank,
    relatedReviews,
    tracks
  } = data;
  
  // 関連レビューのインポート文生成
  let relatedImports = '';
  if (relatedReviews.length > 0) {
    relatedImports = '\n' + relatedReviews.map((review, index) => 
      `import Review${index + 1} from "../review/${review}.mdx";`
    ).join('\n');
  }
  
  // Best50リンク生成
  let best50Link = '';
  if (best50Year && best50Rank) {
    best50Link = `\n<p className="largeP">
  <Link to="/best50/${best50Year}/">${best50Year} Black Music Best No.${best50Rank}</Link>
</p>`;
  }
  
  // トラックリスト生成
  let tracklistSection = '';
  if (tracks.length > 0) {
    const trackRows = tracks.map(track => 
      `| ${track.num}   | ${track.title.padEnd(23)} | ${track.composers.padEnd(64)} | ${track.performer.padEnd(9)} | ${track.time} |`
    ).join('\n');
    
    tracklistSection = `
<h3>Tracks</h3>

| No. | Title                   | Composers                                                        | Performer | Time  |
| --- | ----------------------- | ---------------------------------------------------------------- | --------- | ----- |
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
keywords: "${artistName}, ${albumTitle}, ${artistNameJa}, ${albumTitleJa}"
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
\t\t  <SliderJS4 value="${score4}" />
\t\t</div>
\t</Column>
\t<Column colMd={4} colLg={8} noGutterMdLeft="">
\t\t<div>
\t\t\t<h3>Producers</h3>
\t\t\t<p>
\t\t\t\t${producers.split('\n').filter(p => p.trim()).join('\n\t\t\t\t<br/>')}
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
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${outputPath} を生成しました`);
}

// スクリプト実行
main();

// Made with Bob
