#!/usr/bin/env node

/**
 * Webページからアルバムレビュー情報を抽出してJSON設定ファイルを生成するスクリプト
 * 
 * 使用方法:
 * node scrape-review-to-json.js <URL> [output-filename.json]
 * 
 * 例:
 * node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html
 * node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html custom-config.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// コマンドライン引数の取得
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('エラー: URLを指定してください');
  console.log('使用方法: node scrape-review-to-json.js <URL> [output-filename.json]');
  console.log('例: node scrape-review-to-json.js https://bm.planetky.com/durandbernerr1.html');
  process.exit(1);
}

const url = args[0];
const outputFilename = args[1];

console.log('='.repeat(60));
console.log('アルバムレビュー情報抽出スクリプト');
console.log('='.repeat(60));
console.log(`URL: ${url}\n`);

// URLからHTMLを取得
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// HTMLから特定のパターンを抽出
function extractPattern(html, pattern, defaultValue = '') {
  const match = html.match(pattern);
  return match ? match[1].trim() : defaultValue;
}

// HTMLエンティティをデコード
function decodeHTML(html) {
  return html
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// スコア画像からスコア値を抽出
function extractScore(html, editRegion) {
  const pattern = new RegExp(`<!-- #BeginEditable "${editRegion}" -->.*?<img src="(\\d+)\\.gif"`, 's');
  const match = html.match(pattern);
  return match ? match[1] : '0';
}

// 評点（星の数）を抽出
// 大きな星 x1 + 小さな星 x0.5 で計算
function extractRating(html) {
  const pattern = /<!-- #BeginEditable "F" -->(.*?)<!-- #EndEditable -->/s;
  const match = html.match(pattern);
  if (!match) return '0';
  
  const bigStars = (match[1].match(/biz3_b3\.gif/gi) || []).length;
  const smallStars = (match[1].match(/biz3_b3h\.gif/gi) || []).length;
  const rating = bigStars + (smallStars * 0.5);
  return String(rating);
}

// トラックリストを抽出
function extractTracks(html) {
  const tracks = [];
  const trackPattern = /<tr>\s*<td align="right">(\d+)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gs;
  
  let match;
  while ((match = trackPattern.exec(html)) !== null) {
    tracks.push({
      num: parseInt(match[1]),
      title: decodeHTML(match[2].trim()),
      composers: decodeHTML(match[3].trim()),
      performer: decodeHTML(match[4].trim()),
      time: match[5].trim()
    });
  }
  
  return tracks;
}

// プロデューサー情報を抽出
function extractProducers(html) {
  const pattern = /<!-- #BeginEditable "I" -->(.*?)<!-- #EndEditable -->/s;
  const match = html.match(pattern);
  if (!match) return '';
  
  return decodeHTML(match[1].trim())
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// ゲスト情報を抽出
function extractGuests(html) {
  const pattern = /<!-- #BeginEditable "J" -->(.*?)<!-- #EndEditable -->/s;
  const match = html.match(pattern);
  if (!match) return '';
  
  return decodeHTML(match[1].trim())
    .replace(/<[^>]+>/g, '')
    .trim();
}

// レビュー本文を抽出
function extractReviewText(html) {
  const pattern = /<!-- #BeginEditable "Y" -->(.*?)<!-- #EndEditable -->/s;
  const match = html.match(pattern);
  if (!match) return '';
  
  const text = decodeHTML(match[1].trim())
    .replace(/<[^>]+>/g, '')
    .trim();
  
  // 文章を4つの段落に分割（句点で区切る）
  const sentences = text.split(/。/).filter(s => s.trim());
  
  // 文章を4つのパラグラフに分ける
  const totalSentences = sentences.length;
  const para1End = Math.ceil(totalSentences / 4);
  const para2End = Math.ceil(totalSentences / 2);
  const para3End = Math.ceil(totalSentences * 3 / 4);
  
  return {
    para1: sentences.slice(0, para1End).join('。') + '。',
    para2: sentences.slice(para1End, para2End).join('。') + '。',
    para3: sentences.slice(para2End, para3End).join('。') + '。',
    para4: sentences.slice(para3End).join('。') + '。'
  };
}

// Best50情報を抽出
function extractBest50(html) {
  const pattern = /<a href="best(\d{4})\.htm">(\d{4}) Black Music Best50 (\d+)位<\/a>/;
  const match = html.match(pattern);
  if (!match) return { year: '', rank: '' };
  
  return {
    year: match[2],
    rank: match[3]
  };
}

// 関連レビュー情報を抽出
function extractRelatedReviews(html) {
  const relatedReviews = [];
  
  // "Other Reviews"セクションを探す
  const otherReviewsPattern = /<!-- #BeginEditable "L" -->(.*?)<!-- #EndEditable -->/s;
  const otherReviewsMatch = html.match(otherReviewsPattern);
  
  if (!otherReviewsMatch) return relatedReviews;
  
  const otherReviewsSection = otherReviewsMatch[1];
  
  // 各レビューの<tr>要素を個別に抽出（より柔軟なパターン）
  const rowPattern = /<tr>\s*<td>\s*<a href="([^"]+)"[^>]*>\s*<img[^>]+alt="([^"]*)"[^>]*>\s*<\/a>\s*<\/td>\s*<td>\s*<a href="[^"]+">([^<]+)<\/a>\s*<\/td>\s*<\/tr>/gs;
  
  let match;
  while ((match = rowPattern.exec(otherReviewsSection)) !== null) {
    const url = match[1];
    const altText = match[2];
    let title = match[3].trim();
    
    // HTMLエンティティをデコード
    title = decodeHTML(title);
    
    // URLから識別子を抽出（.htmまたは.htmlを除去）
    const identifierMatch = url.match(/([^\/]+)\.html?$/);
    const identifier = identifierMatch ? identifierMatch[1] : '';
    
    // タイトルからアーティスト名とアルバム名を分離
    // "Meshell Ndegeocello / The Omnichord Real Book" のような形式
    const titleParts = title.split(' / ');
    const artistName = titleParts[0] ? titleParts[0].trim() : '';
    const albumTitle = titleParts[1] ? titleParts[1].trim() : '';
    
    // 空のエントリは追加しない
    if (identifier && artistName) {
      relatedReviews.push({
        identifier: identifier,
        artistName: artistName,
        albumTitle: albumTitle
      });
    }
  }
  
  return relatedReviews;
}

// アーティスト名とアルバム名を抽出
function extractTitleInfo(html) {
  const pattern = /CD Review\s*:\s*<!-- #BeginEditable "B" -->\s*(.*?) \/ (.*?)<!-- #EndEditable -->/;
  const match = html.match(pattern);
  if (!match) return { artist: '', album: '' };
  
  return {
    artist: decodeHTML(match[1].trim()),
    album: decodeHTML(match[2].trim())
  };
}

// identifierを生成（URLから）
function generateIdentifier(url) {
  const match = url.match(/\/([^\/]+)\.html?$/);
  if (!match) return 'album1';
  return match[1];
}

// Amazon.comリンクを抽出
function extractAmazonCom(html) {
  const pattern = /<a href="http:\/\/www\.amazon\.com\/exec\/obidos\/ASIN\/([^"\/]+)/;
  const match = html.match(pattern);
  return match ? `https://amzn.to/${match[1]}` : 'https://amzn.to/XXXXXXX';
}

// Apple Musicリンクを抽出
function extractAppleMusic(html) {
  const pattern = /https:\/\/(?:embed\.)?music\.apple\.com\/[^"]+\/album\/[^"\/]+\/(\d+)/;
  const match = html.match(pattern);
  return match ? `https://music.apple.com/us/album/${match[1]}` : 'https://apple.co/XXXXXXX';
}

// メイン処理
async function main() {
  try {
    console.log('HTMLを取得中...');
    const html = await fetchHTML(url);
    console.log('✓ HTML取得完了\n');
    
    console.log('情報を抽出中...');
    
    const titleInfo = extractTitleInfo(html);
    const identifier = generateIdentifier(url);
    const reviewText = extractReviewText(html);
    const best50 = extractBest50(html);
    const tracks = extractTracks(html);
    const producers = extractProducers(html);
    const guests = extractGuests(html);
    const relatedReviews = extractRelatedReviews(html);
    
    const config = {
      artistName: titleInfo.artist,
      artistNameJa: '',  // 手動で入力が必要
      albumTitle: titleInfo.album,
      albumTitleJa: '',  // 手動で入力が必要
      albumNumber: '1',  // 手動で入力が必要
      identifier: identifier,
      reviewPara1: reviewText.para1,
      reviewPara2: reviewText.para2,
      reviewPara3: reviewText.para3,
      reviewPara4: reviewText.para4,
      score1: extractScore(html, 'C'),
      score2: extractScore(html, 'D'),
      score3: extractScore(html, 'E'),
      score4: extractRating(html),
      producers: producers,
      guests: guests,
      amazonCom: extractAmazonCom(html),
      amazonJp: 'https://amzn.to/XXXXXXX',  // 手動で入力が必要
      appleMusic: extractAppleMusic(html),
      best50Year: best50.year,
      best50Rank: best50.rank,
      relatedReviews: relatedReviews,
      tracks: tracks
    };
    
    console.log('✓ 情報抽出完了\n');
    
    // 出力ディレクトリの作成（スクリプトと同じディレクトリ内のBob_output）
    const scriptDir = __dirname;
    const outputDir = path.join(scriptDir, 'Bob_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✓ 出力ディレクトリを作成しました: ${outputDir}\n`);
    }
    
    // 出力ファイル名の決定
    const filename = outputFilename || `${identifier}-review-config.json`;
    const outputFile = path.join(outputDir, filename);
    
    // JSONファイルに書き込み
    fs.writeFileSync(outputFile, JSON.stringify(config, null, 2), 'utf8');
    
    console.log('='.repeat(60));
    console.log('✅ JSON設定ファイルを生成しました！');
    console.log('='.repeat(60));
    console.log(`出力ファイル: ${outputFile}\n`);
    
    console.log('抽出された情報:');
    console.log(`  アーティスト: ${config.artistName}`);
    console.log(`  アルバム: ${config.albumTitle}`);
    console.log(`  識別子: ${config.identifier}`);
    console.log(`  トラック数: ${config.tracks.length}`);
    console.log(`  Best50: ${config.best50Year}年 ${config.best50Rank}位`);
    console.log(`  関連レビュー数: ${config.relatedReviews.length}`);
    if (config.relatedReviews.length > 0) {
      console.log('  関連レビュー:');
      config.relatedReviews.forEach((review, index) => {
        console.log(`    ${index + 1}. ${review.artistName} / ${review.albumTitle} (${review.identifier})`);
      });
    }
    console.log('');
    
    console.log('次のステップ:');
    console.log(`  1. ${outputFile} を開いて以下を手動で編集:`);
    console.log('     - artistNameJa (日本語アーティスト名)');
    console.log('     - albumTitleJa (日本語アルバム名)');
    console.log('     - albumNumber (アルバム番号)');
    console.log('     - amazonJp (Amazon.co.jpリンク)');
    console.log(`  2. node generate-review.js ${outputFile}`);
    console.log(`  3. アルバムジャケット画像を src/images/cd/${identifier}L.jpg として配置`);
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();

// Made with Bob