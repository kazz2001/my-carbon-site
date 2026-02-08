#!/usr/bin/env node

/**
 * 既存のMDXレビューファイルからJSON設定ファイルを生成するスクリプト
 * 
 * 使用方法:
 * node mdx-to-json.js <mdx-file-path> [output-filename.json]
 * 
 * 例:
 * node mdx-to-json.js src/pages/review/beyonce5L.mdx
 * node mdx-to-json.js src/pages/review/beyonce5L.mdx beyonce5-config.json
 */

const fs = require('fs');
const path = require('path');

// コマンドライン引数の取得
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('エラー: MDXファイルのパスを指定してください');
  console.log('使用方法: node mdx-to-json.js <mdx-file-path> [output-filename.json]');
  console.log('例: node mdx-to-json.js src/pages/review/beyonce5L.mdx');
  process.exit(1);
}

const mdxFilePath = args[0];
const outputFilename = args[1];

console.log('='.repeat(60));
console.log('MDXファイルからJSON設定ファイル生成スクリプト');
console.log('='.repeat(60));
console.log(`入力ファイル: ${mdxFilePath}\n`);

// ファイルの存在確認
if (!fs.existsSync(mdxFilePath)) {
  console.error(`エラー: ファイルが見つかりません: ${mdxFilePath}`);
  process.exit(1);
}

// MDXファイルを読み込む
let mdxContent;
try {
  mdxContent = fs.readFileSync(mdxFilePath, 'utf8');
} catch (error) {
  console.error(`エラー: ファイルの読み込みに失敗しました: ${error.message}`);
  process.exit(1);
}

// フロントマターを抽出
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*"(.*)"/);
    if (match) {
      frontmatter[match[1]] = match[2];
    }
  }
  
  return frontmatter;
}

// タイトルからアーティスト名とアルバム名を抽出
function extractArtistAndAlbum(title) {
  const match = title.match(/^(.+?)\s*\/\s*(.+)$/);
  if (!match) return { artist: '', album: title };
  
  return {
    artist: match[1].trim(),
    album: match[2].trim()
  };
}

// キーワードから日本語名を抽出
function extractJapaneseNames(keywords) {
  const parts = keywords.split(',').map(k => k.trim());
  // 英語名以外（日本語）を抽出
  const jaNames = parts.filter(k => /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(k));
  
  return {
    artistJa: jaNames[0] || '',
    albumJa: jaNames[1] || ''
  };
}

// レビュー本文を抽出（<p>タグ内）
function extractReviewText(content) {
  const reviewMatch = content.match(/<p>\s*([\s\S]*?)\s*<\/p>/);
  if (!reviewMatch) return { para1: '', para2: '', para3: '', para4: '' };
  
  const text = reviewMatch[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 改行で分割
  const paragraphs = text.split('\n').map(p => p.trim()).filter(p => p);
  
  return {
    para1: paragraphs[0] || '',
    para2: paragraphs[1] || '',
    para3: paragraphs[2] || '',
    para4: paragraphs[3] || ''
  };
}

// スコアを抽出
function extractScores(content) {
  const scores = {};
  
  for (let i = 1; i <= 4; i++) {
    const pattern = new RegExp(`<SliderJS${i}\\s+value="(\\d+)"\\s*\\/>`);
    const match = content.match(pattern);
    scores[`score${i}`] = match ? match[1] : '0';
  }
  
  return scores;
}

// プロデューサー情報を抽出
function extractProducers(content) {
  const producersMatch = content.match(/<h3>Producers<\/h3>\s*<p>\s*([\s\S]*?)\s*<\/p>/);
  if (!producersMatch) return '';
  
  return producersMatch[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

// ゲスト情報を抽出
function extractGuests(content) {
  const guestsMatch = content.match(/<h3>Guests<\/h3>\s*<p>\s*([\s\S]*?)\s*<\/p>/);
  if (!guestsMatch) return '';
  
  return guestsMatch[1]
    .replace(/<br\s*\/?>/gi, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Amazonリンクを抽出
function extractAmazonLinks(content) {
  const amazonComMatch = content.match(/href="(https:\/\/amzn\.to\/[^"]+)"[^>]*>[\s\S]*?amazon\.com/);
  const amazonJpMatch = content.match(/href="(https:\/\/amzn\.to\/[^"]+)"[^>]*>[\s\S]*?amazon\.co\.jp/);
  
  return {
    amazonCom: amazonComMatch ? amazonComMatch[1] : 'https://amzn.to/XXXXXXX',
    amazonJp: amazonJpMatch ? amazonJpMatch[1] : 'https://amzn.to/XXXXXXX'
  };
}

// Apple Musicリンクを抽出
function extractAppleMusic(content) {
  const appleMusicMatch = content.match(/href="(https:\/\/apple\.co\/[^"]+)"/);
  return appleMusicMatch ? appleMusicMatch[1] : 'https://apple.co/XXXXXXX';
}

// Best50情報を抽出
function extractBest50(content) {
  const best50Match = content.match(/<Link to="\/best50\/(\d{4})\/"\>(\d{4}) Black Music Best No\.(\d+)<\/Link>/);
  if (!best50Match) return { year: '', rank: '' };
  
  return {
    year: best50Match[2],
    rank: best50Match[3]
  };
}

// 関連レビューを抽出
function extractRelatedReviews(content) {
  const reviews = [];
  const importPattern = /import Review\d+ from "\.\.\/review\/(.+?)\.mdx";/g;
  
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    reviews.push(match[1]);
  }
  
  return reviews;
}

// トラックリストを抽出
function extractTracks(content) {
  const tracks = [];
  const trackPattern = /\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+:\d+)\s*\|/g;
  
  let match;
  while ((match = trackPattern.exec(content)) !== null) {
    tracks.push({
      num: parseInt(match[1]),
      title: match[2].trim(),
      composers: match[3].trim(),
      performer: match[4].trim(),
      time: match[5].trim()
    });
  }
  
  return tracks;
}

// identifierをファイル名から抽出
function extractIdentifier(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  // L.mdx または A.mdx の場合、最後の文字を削除
  return basename.replace(/[LA]$/, '');
}

// メイン処理
try {
  console.log('MDXファイルを解析中...');
  
  const frontmatter = extractFrontmatter(mdxContent);
  const titleInfo = extractArtistAndAlbum(frontmatter.title || '');
  const jaNames = extractJapaneseNames(frontmatter.keywords || '');
  const reviewText = extractReviewText(mdxContent);
  const scores = extractScores(mdxContent);
  const producers = extractProducers(mdxContent);
  const guests = extractGuests(mdxContent);
  const amazonLinks = extractAmazonLinks(mdxContent);
  const appleMusic = extractAppleMusic(mdxContent);
  const best50 = extractBest50(mdxContent);
  const relatedReviews = extractRelatedReviews(mdxContent);
  const tracks = extractTracks(mdxContent);
  const identifier = extractIdentifier(mdxFilePath);
  
  const config = {
    artistName: titleInfo.artist,
    artistNameJa: jaNames.artistJa,
    albumTitle: titleInfo.album,
    albumTitleJa: jaNames.albumJa,
    albumNumber: '1',  // 手動で入力が必要
    identifier: identifier,
    reviewPara1: reviewText.para1,
    reviewPara2: reviewText.para2,
    reviewPara3: reviewText.para3,
    reviewPara4: reviewText.para4,
    score1: scores.score1,
    score2: scores.score2,
    score3: scores.score3,
    score4: scores.score4,
    producers: producers,
    guests: guests,
    amazonCom: amazonLinks.amazonCom,
    amazonJp: amazonLinks.amazonJp,
    appleMusic: appleMusic,
    best50Year: best50.year,
    best50Rank: best50.rank,
    relatedReviews: relatedReviews,
    tracks: tracks
  };
  
  console.log('✓ 解析完了\n');
  
  // 出力ファイル名の決定
  const outputFile = outputFilename || `${identifier}-review-config.json`;
  
  // JSONファイルに書き込み
  fs.writeFileSync(outputFile, JSON.stringify(config, null, 2), 'utf8');
  
  console.log('='.repeat(60));
  console.log('✅ JSON設定ファイルを生成しました！');
  console.log('='.repeat(60));
  console.log(`出力ファイル: ${outputFile}\n`);
  
  console.log('抽出された情報:');
  console.log(`  アーティスト: ${config.artistName} (${config.artistNameJa})`);
  console.log(`  アルバム: ${config.albumTitle} (${config.albumTitleJa})`);
  console.log(`  識別子: ${config.identifier}`);
  console.log(`  トラック数: ${config.tracks.length}`);
  console.log(`  Best50: ${config.best50Year}年 ${config.best50Rank}位`);
  console.log(`  関連レビュー: ${config.relatedReviews.length}件`);
  console.log('');
  
  console.log('次のステップ:');
  console.log(`  1. ${outputFile} を開いて以下を確認・編集:`);
  console.log('     - albumNumber (アルバム番号)');
  console.log('     - その他の情報が正しく抽出されているか確認');
  console.log(`  2. node generate-review-from-json.js ${outputFile}`);
  console.log(`  3. 生成されたファイルと元のファイルを比較して確認`);
  
} catch (error) {
  console.error('\nエラーが発生しました:', error.message);
  console.error(error.stack);
  process.exit(1);
}

// Made with Bob