const https = require('https');
const fs = require('fs');
const readline = require('readline');

// シンプルなHTTP GETリクエスト関数
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// URLから曲IDを抽出
function extractSongId(url) {
  const match = url.match(/\/song\/[^\/]+\/(\d+)/);
  if (!match) {
    throw new Error('無効なApple Music URLです');
  }
  return parseInt(match[1]);
}

// URLのベース部分を抽出
function extractUrlBase(url) {
  const baseMatch = url.match(/(https:\/\/music\.apple\.com\/[^\/]+\/song\/)/);
  const params = url.includes('?') ? '?' + url.split('?')[1] : '';
  return { base: baseMatch[1], params };
}

// 対話的に曲情報を入力
async function inputTracks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('\n各曲の情報を入力してください（空行で終了）\n');
  
  const tracks = [];
  let trackNumber = 1;

  while (true) {
    const title = await question(`${trackNumber}曲目のタイトル（空行で終了）: `);
    
    if (!title.trim()) {
      break;
    }

    const slug = await question(`${trackNumber}曲目のURL slug（例: the-birds-dont-sing）: `);
    
    tracks.push({
      number: trackNumber,
      title: title.trim(),
      slug: slug.trim()
    });

    trackNumber++;
  }

  rl.close();
  return tracks;
}

// クレジットURLを生成
function generateCreditsUrls(firstSongId, urlBase, urlParams, tracks) {
  return tracks.map(track => {
    const songId = firstSongId + (track.number - 1);
    const creditsUrl = `${urlBase}${track.slug}/${songId}${urlParams}`;
    
    return {
      number: track.number,
      title: track.title,
      creditsUrl: creditsUrl
    };
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('使い方: node fetch_apple_music_credits_generic.js <Apple Music曲URL>');
    console.error('例: node fetch_apple_music_credits_generic.js "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US"');
    process.exit(1);
  }
  
  const songUrl = args[0];
  
  if (!songUrl.includes('music.apple.com')) {
    console.error('エラー: 有効なApple Music URLを指定してください');
    process.exit(1);
  }
  
  try {
    console.log(`処理中: ${songUrl}\n`);
    
    const firstSongId = extractSongId(songUrl);
    console.log(`最初の曲ID: ${firstSongId}\n`);
    
    const { base, params } = extractUrlBase(songUrl);
    
    // 曲情報を入力
    const tracks = await inputTracks();
    
    if (tracks.length === 0) {
      console.error('曲が入力されませんでした。');
      process.exit(1);
    }
    
    // クレジットURLを生成
    const results = generateCreditsUrls(firstSongId, base, params, tracks);
    
    // アルバム名とアーティスト名を入力
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const albumName = await new Promise((resolve) => {
      rl.question('\nアルバム名: ', resolve);
    });
    
    const artistName = await new Promise((resolve) => {
      rl.question('アーティスト名: ', resolve);
    });
    
    rl.close();
    
    // 結果をテキストファイルに出力
    let output = `アルバム「${albumName}」- ${artistName}\n`;
    output += `取得日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n`;
    output += `総曲数: ${results.length}曲\n`;
    output += '='.repeat(80) + '\n\n';
    output += '各曲のView Credits画面URL:\n\n';
    
    results.forEach(track => {
      output += `${track.number}. ${track.title}\n`;
      output += `   ${track.creditsUrl}\n\n`;
    });
    
    output += '='.repeat(80) + '\n';
    output += '注意: 上記のURLは最初の曲IDから連番で生成されています。\n';
    
    // ファイル名を生成
    const safeArtistName = artistName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeAlbumName = albumName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${safeArtistName}_${safeAlbumName}_credits_urls.txt`;
    
    fs.writeFileSync(filename, output, 'utf8');
    
    console.log(`\n結果を ${filename} に保存しました\n`);
    console.log('--- 取得結果 ---');
    console.log(output);
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();

// Made with Bob
