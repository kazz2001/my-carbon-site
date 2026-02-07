const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchAppleMusicCreditsUrls(songUrl) {
  console.log(`アクセス中: ${songUrl}\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 3840 });
    
    // 最初の曲のページにアクセス
    await page.goto(songUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // アルバムリンクを見つけてクリック
    console.log('アルバムページに移動中...');
    await page.waitForSelector('a[href*="/album/"]', { timeout: 10000 });
    
    // アルバムURLを取得
    const albumUrl = await page.evaluate(() => {
      const albumLink = document.querySelector('a[href*="/album/"]');
      return albumLink ? albumLink.href : null;
    });
    
    if (!albumUrl) {
      throw new Error('アルバムURLが見つかりませんでした');
    }
    
    console.log(`アルバムURL: ${albumUrl}`);
    
    // アルバムページに移動
    await page.goto(albumUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // アルバム情報を取得
    const albumInfo = await page.evaluate(() => {
      const titleElement = document.querySelector('h1');
      const artistElement = document.querySelector('a[data-testid="click-action"]');
      
      return {
        albumTitle: titleElement ? titleElement.textContent.trim() : 'Unknown Album',
        artistName: artistElement ? artistElement.textContent.trim() : 'Unknown Artist'
      };
    });
    
    console.log(`アルバム: ${albumInfo.albumTitle}`);
    console.log(`アーティスト: ${albumInfo.artistName}\n`);
    
    // トラックリストを取得
    console.log('トラックリストを取得中...');
    
    const tracks = await page.evaluate(() => {
      const trackElements = document.querySelectorAll('[data-testid="track-list"] [role="button"]');
      const trackList = [];
      
      trackElements.forEach((element, index) => {
        const titleElement = element.querySelector('[data-testid="track-title"]');
        if (titleElement) {
          trackList.push({
            number: index + 1,
            title: titleElement.textContent.trim()
          });
        }
      });
      
      return trackList;
    });
    
    console.log(`${tracks.length}曲見つかりました\n`);
    
    // 各曲のクレジットURLを取得
    const results = [];
    
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      console.log(`処理中: ${track.number}. ${track.title}`);
      
      try {
        // トラックの「...」メニューボタンをクリック
        const menuButtons = await page.$$('[data-testid="track-list"] [role="button"]');
        
        if (menuButtons[i]) {
          // トラック行の「...」ボタンを探す
          const moreButton = await menuButtons[i].$('button[aria-label*="More"]');
          
          if (moreButton) {
            await moreButton.click();
            await page.waitForTimeout(500);
            
            // 「View Credits」メニュー項目を探してクリック
            const clicked = await page.evaluate(() => {
              const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
              const viewCreditsItem = menuItems.find(item =>
                item.textContent.includes('View Credits') ||
                item.textContent.includes('クレジットを表示')
              );
              
              if (viewCreditsItem) {
                viewCreditsItem.click();
                return true;
              }
              return false;
            });
            
            if (clicked) {
              await page.waitForTimeout(2000);
              
              // 現在のURLを取得
              const creditsUrl = page.url();
              
              results.push({
                number: track.number,
                title: track.title,
                creditsUrl: creditsUrl
              });
              
              console.log(`  URL: ${creditsUrl}`);
              
              // アルバムページに戻る
              await page.goBack();
              await page.waitForTimeout(1000);
            } else {
              console.log('  View Creditsボタンが見つかりませんでした');
              results.push({
                number: track.number,
                title: track.title,
                creditsUrl: 'View Creditsボタンが見つかりませんでした'
              });
            }
          } else {
            console.log('  メニューボタンが見つかりませんでした');
            results.push({
              number: track.number,
              title: track.title,
              creditsUrl: 'メニューボタンが見つかりませんでした'
            });
          }
        }
      } catch (error) {
        console.error(`  エラー: ${error.message}`);
        results.push({
          number: track.number,
          title: track.title,
          creditsUrl: `エラー: ${error.message}`
        });
      }
    }
    
    return { results, albumInfo };
    
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('使い方: node fetch_apple_music_credits_urls.js <Apple Music曲URL>');
    console.error('例: node fetch_apple_music_credits_urls.js https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US');
    process.exit(1);
  }
  
  const songUrl = args[0];
  
  if (!songUrl.includes('music.apple.com')) {
    console.error('エラー: 有効なApple Music URLを指定してください');
    process.exit(1);
  }
  
  try {
    const { results, albumInfo } = await fetchAppleMusicCreditsUrls(songUrl);
    
    if (results.length === 0) {
      console.error('曲が見つかりませんでした。');
      process.exit(1);
    }
    
    // 結果をテキストファイルに出力
    let output = `アルバム「${albumInfo.albumTitle}」- ${albumInfo.artistName}\n`;
    output += `取得日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n`;
    output += `総曲数: ${results.length}曲\n`;
    output += '='.repeat(80) + '\n\n';
    
    results.forEach(track => {
      output += `${track.number}. ${track.title}\n`;
      output += `   Credits URL: ${track.creditsUrl}\n\n`;
    });
    
    // ファイル名を生成
    const safeArtistName = albumInfo.artistName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeAlbumName = albumInfo.albumTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${safeArtistName}_${safeAlbumName}_credits_urls.txt`;
    
    fs.writeFileSync(filename, output, 'utf8');
    
    console.log(`\n結果を ${filename} に保存しました\n`);
    console.log('--- 取得結果 ---');
    console.log(output);
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

// Made with Bob
