/**
 * Apple Music トラックリスト取得スクリプト
 * 
 * 使用方法:
 * node fetch_apple_music_tracklist.js <Apple Music URL>
 * 
 * 例:
 * node fetch_apple_music_tracklist.js "https://music.apple.com/jp/album/let-god-sort-em-out/1816313634?l=en-US"
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// コマンドライン引数からURLを取得
const url = process.argv[2];

if (!url) {
  console.error('エラー: Apple Music URLを指定してください');
  console.error('使用方法: node fetch_apple_music_tracklist.js <URL>');
  process.exit(1);
}

// URLの検証
if (!url.includes('music.apple.com')) {
  console.error('エラー: 有効なApple Music URLを指定してください');
  process.exit(1);
}

async function fetchAppleMusicTracklist(url) {
  console.log('ブラウザを起動中...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // ビューポートサイズを設定
    await page.setViewport({ width: 1920, height: 3840 });
    
    console.log(`ページにアクセス中: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // ページが完全に読み込まれるまで待機
    await page.waitForTimeout(3000);
    
    console.log('トラックリスト情報を抽出中...');
    
    // アルバム情報とトラックリストを取得
    const albumData = await page.evaluate(() => {
      const data = {
        title: '',
        artists: '',
        genre: '',
        year: '',
        tracks: []
      };
      
      // アルバムタイトルを取得
      const titleElement = document.querySelector('h1[data-testid="non-editable-product-title"]') || 
                          document.querySelector('h1.product-header__title');
      if (titleElement) {
        data.title = titleElement.textContent.trim();
      }
      
      // アーティスト情報を取得
      const artistElement = document.querySelector('a[data-testid="click-action"]') ||
                           document.querySelector('.product-header__identity a');
      if (artistElement) {
        data.artists = artistElement.textContent.trim();
      }
      
      // ジャンルと年を取得
      const metaElements = document.querySelectorAll('.product-header__metadata');
      metaElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.match(/\d{4}/)) {
          data.year = text.match(/\d{4}/)[0];
        }
        if (text.includes('HIP-HOP') || text.includes('R&B') || text.includes('POP')) {
          data.genre = text;
        }
      });
      
      // トラックリストを取得
      const trackElements = document.querySelectorAll('[data-testid="track-list"] [role="row"]');
      
      trackElements.forEach((track, index) => {
        const trackNumber = index + 1;
        
        // 曲名を取得
        const titleEl = track.querySelector('[data-testid="track-title"]') ||
                       track.querySelector('.songs-list-row__song-name');
        const title = titleEl ? titleEl.textContent.trim() : '';
        
        // アーティスト/パフォーマーを取得
        const artistEl = track.querySelector('[data-testid="track-artist"]') ||
                        track.querySelector('.songs-list-row__by-line');
        const artist = artistEl ? artistEl.textContent.trim() : '';
        
        // 時間を取得
        const durationEl = track.querySelector('[data-testid="duration"]') ||
                          track.querySelector('.songs-list-row__length');
        const duration = durationEl ? durationEl.textContent.trim() : '';
        
        if (title) {
          data.tracks.push({
            number: trackNumber,
            title: title,
            artist: artist,
            duration: duration
          });
        }
      });
      
      return data;
    });
    
    if (albumData.tracks.length === 0) {
      console.error('警告: トラック情報が取得できませんでした');
      console.log('ページのHTMLを確認してください');
    }
    
    console.log(`\n取得完了: ${albumData.tracks.length}曲`);
    
    return albumData;
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

function formatTracklist(albumData) {
  let output = '';
  
  output += `${albumData.title}\n`;
  if (albumData.artists) output += `${albumData.artists}\n`;
  if (albumData.genre) output += `${albumData.genre}`;
  if (albumData.year) output += ` - ${albumData.year}`;
  output += '\n\n';
  
  output += 'トラックリスト:\n\n';
  
  albumData.tracks.forEach(track => {
    output += `${track.number}. ${track.title}\n`;
    if (track.artist) {
      output += `   Performer: ${track.artist}\n`;
    }
    if (track.duration) {
      output += `   時間: ${track.duration}\n`;
    }
    output += '\n';
  });
  
  output += `総曲数: ${albumData.tracks.length}曲\n`;
  
  return output;
}

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  try {
    const albumData = await fetchAppleMusicTracklist(url);
    
    if (albumData.tracks.length === 0) {
      console.error('トラック情報が取得できませんでした');
      process.exit(1);
    }
    
    // テキストファイルに出力
    const formattedText = formatTracklist(albumData);
    const filename = sanitizeFilename(albumData.title || 'tracklist') + '-tracklist.txt';
    
    await fs.writeFile(filename, formattedText, 'utf8');
    
    console.log(`\n✓ ファイルに保存しました: ${filename}`);
    console.log('\n--- プレビュー ---');
    console.log(formattedText);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
  }
}

main();

// Made with Bob
