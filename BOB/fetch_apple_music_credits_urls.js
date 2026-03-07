const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Chromeの実行可能ファイルパスを検索
function findChromePath() {
  const possiblePaths = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
    '/usr/bin/google-chrome', // Linux
    '/usr/bin/chromium-browser' // Linux
  ];

  for (const chromePath of possiblePaths) {
    if (chromePath && fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  return undefined; // デフォルトのChromiumを使用
}

async function fetchAppleMusicCreditsUrls(inputUrl) {
  console.log(`アクセス中: ${inputUrl}\n`);
  
  const chromePath = findChromePath();
  if (chromePath) {
    console.log(`使用するブラウザ: ${chromePath}\n`);
  } else {
    console.log('警告: ChromeまたはEdgeが見つかりません。デフォルトのChromiumを使用します。');
    console.log('コンテキストメニューが表示されない場合は、CHROME_PATH環境変数を設定してください。\n');
  }
  
  const browser = await puppeteer.launch({
    headless: false, // ログインが必要な場合があるため、ブラウザを表示
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 3840 });
    
    let albumUrl;
    
    // URLがアルバムURLかどうかを判定
    if (inputUrl.includes('/album/')) {
      console.log('アルバムURLが指定されました');
      albumUrl = inputUrl;
    } else {
      // 曲URLの場合、アルバムページに移動
      console.log('曲URLからアルバムページに移動中...');
      await page.goto(inputUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForSelector('a[href*="/album/"]', { timeout: 10000 });
      
      // アルバムURLを取得
      albumUrl = await page.evaluate(() => {
        const albumLink = document.querySelector('a[href*="/album/"]');
        return albumLink ? albumLink.href : null;
      });
      
      if (!albumUrl) {
        throw new Error('アルバムURLが見つかりませんでした');
      }
      
      console.log(`アルバムURL: ${albumUrl}`);
    }
    
    // アルバムページに移動
    await page.goto(albumUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // ログインを促すメッセージ
    console.log('='.repeat(80));
    console.log('重要: Apple Musicにログインしてください');
    console.log('ブラウザが起動しています。Apple IDでログインしてから、');
    console.log('このターミナルでEnterキーを押して続行してください。');
    console.log('='.repeat(80));
    
    // ユーザーの入力を待つ
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    console.log('\n処理を続行します...\n');
    
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
      const trackList = [];
      
      // 複数のセレクタパターンを試す
      let trackElements = document.querySelectorAll('[data-testid="track-list"] [role="button"]');
      
      // 代替セレクタ1: トラック行を直接探す
      if (trackElements.length === 0) {
        trackElements = document.querySelectorAll('[data-testid="track-list-row"]');
      }
      
      // 代替セレクタ2: より汎用的なセレクタ
      if (trackElements.length === 0) {
        trackElements = document.querySelectorAll('div[role="row"][data-testid*="track"]');
      }
      
      // 代替セレクタ3: さらに汎用的
      if (trackElements.length === 0) {
        const trackListContainer = document.querySelector('[data-testid="track-list"]');
        if (trackListContainer) {
          trackElements = trackListContainer.querySelectorAll('[role="button"]');
        }
      }
      
      trackElements.forEach((element, index) => {
        // 複数のタイトルセレクタパターンを試す
        let titleElement = element.querySelector('[data-testid="track-title"]');
        
        if (!titleElement) {
          titleElement = element.querySelector('[data-testid*="title"]');
        }
        
        if (!titleElement) {
          // テキストコンテンツから直接取得
          const textContent = element.textContent.trim();
          if (textContent) {
            trackList.push({
              number: index + 1,
              title: textContent.split('\n')[0].trim()
            });
          }
        } else {
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
        // トラック要素を再取得（複数のセレクタパターンを試す）
        let trackElements = await page.$$('[data-testid="track-list"] [role="button"]');
        
        if (trackElements.length === 0) {
          trackElements = await page.$$('[data-testid="track-list-row"]');
        }
        
        if (trackElements.length === 0) {
          trackElements = await page.$$('div[role="row"][data-testid*="track"]');
        }
        
        if (trackElements.length === 0) {
          const trackListContainer = await page.$('[data-testid="track-list"]');
          if (trackListContainer) {
            trackElements = await trackListContainer.$$('[role="button"]');
          }
        }
        
        if (trackElements[i]) {
          // トラック要素全体の境界ボックスを取得
          const box = await trackElements[i].boundingBox();
          
          if (box) {
            // トラック要素の右端付近を右クリック
            const x = box.x + box.width - 50; // 右端から50px左
            const y = box.y + box.height / 2; // 垂直方向の中央
            
            await page.mouse.click(x, y, { button: 'right' });
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // デバッグ: メニュー項目を確認
            const menuInfo = await page.evaluate(() => {
              const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
              return {
                count: menuItems.length,
                texts: menuItems.map(item => item.textContent.trim())
              };
            });
            
            console.log(`  メニュー項目数: ${menuInfo.count}`);
            if (menuInfo.count > 0) {
              console.log(`  メニュー項目: ${menuInfo.texts.join(', ')}`);
            }
            
            // 「View Credits」メニュー項目を探してクリック
            const clicked = await page.evaluate(() => {
              const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
              const viewCreditsItem = menuItems.find(item =>
                item.textContent.includes('View Credits') ||
                item.textContent.includes('クレジットを表示') ||
                item.textContent.includes('クレジット')
              );
              
              if (viewCreditsItem) {
                viewCreditsItem.click();
                return true;
              }
              return false;
            });
            
            if (clicked) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              
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
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              console.log('  View Creditsボタンが見つかりませんでした');
              results.push({
                number: track.number,
                title: track.title,
                creditsUrl: 'View Creditsボタンが見つかりませんでした'
              });
            }
          } else {
            console.log('  トラック要素の位置が取得できませんでした');
            results.push({
              number: track.number,
              title: track.title,
              creditsUrl: 'トラック要素の位置が取得できませんでした'
            });
          }
        } else {
          console.log('  トラック要素が見つかりませんでした');
          results.push({
            number: track.number,
            title: track.title,
            creditsUrl: 'トラック要素が見つかりませんでした'
          });
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
    console.error('使い方: node fetch_apple_music_credits_urls.js <Apple Music URL>');
    console.error('例1 (曲URL): node fetch_apple_music_credits_urls.js https://music.apple.com/jp/song/the-birds-dont-sing/1816313640');
    console.error('例2 (アルバムURL): node fetch_apple_music_credits_urls.js https://music.apple.com/jp/album/the-art-of-loving/1817609404');
    process.exit(1);
  }
  
  const inputUrl = args[0];
  
  if (!inputUrl.includes('music.apple.com')) {
    console.error('エラー: 有効なApple Music URLを指定してください');
    process.exit(1);
  }
  
  try {
    const { results, albumInfo } = await fetchAppleMusicCreditsUrls(inputUrl);
    
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
