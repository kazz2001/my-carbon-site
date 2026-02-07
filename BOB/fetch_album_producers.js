const https = require('https');
const fs = require('fs');

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

// HTMLから曲のタイトルとURLを抽出（簡易版）
function extractTracks(html) {
  const tracks = [];
  // より柔軟な正規表現でトラックリンクを抽出
  const trackRegex = /<a[^>]*href="(https:\/\/genius\.com\/Addison-rae-[^"]*-lyrics)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  let trackNumber = 1;
  
  while ((match = trackRegex.exec(html)) !== null) {
    const url = match[1];
    // HTMLタグを除去してタイトルを取得
    const titleWithTags = match[2];
    let title = titleWithTags.replace(/<[^>]*>/g, '').trim();
    // "Lyrics"という文字列を除去
    title = title.replace(/\s*Lyrics\s*$/i, '').trim();
    
    // 重複を避ける
    if (title && !tracks.find(t => t.url === url)) {
      tracks.push({ number: trackNumber++, title, url });
    }
  }
  
  return tracks;
}

// HTMLからプロデューサー情報を抽出
function extractProducers(html) {
  // Producersセクションを探す
  const producerMatch = html.match(/Producers?<\/span>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/i);
  
  if (!producerMatch) {
    return 'プロデューサー情報なし';
  }
  
  // リンクからプロデューサー名を抽出
  const producerSection = producerMatch[1];
  const nameRegex = /<a[^>]*>([^<]+)<\/a>/g;
  const producers = [];
  let match;
  
  while ((match = nameRegex.exec(producerSection)) !== null) {
    const name = match[1].trim();
    if (name && !producers.includes(name)) {
      producers.push(name);
    }
  }
  
  return producers.length > 0 ? producers.join(' & ') : 'プロデューサー情報なし';
}

async function fetchAlbumProducers(artistName, albumName) {
  const albumUrl = `https://genius.com/albums/${artistName}/${albumName}`;
  console.log(`アクセス中: ${albumUrl}\n`);
  
  // アルバムページを取得
  const albumHTML = await fetchHTML(albumUrl);
  const tracks = extractTracks(albumHTML);
  
  console.log(`${tracks.length}曲見つかりました\n`);
  
  // 各曲のプロデューサー情報を取得
  const results = [];
  for (const track of tracks) {
    console.log(`取得中: ${track.number}. ${track.title}`);
    
    try {
      const trackHTML = await fetchHTML(track.url);
      const producer = extractProducers(trackHTML);
      
      results.push({
        number: track.number,
        title: track.title,
        producer: producer
      });
      
      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  エラー: ${error.message}`);
      results.push({
        number: track.number,
        title: track.title,
        producer: 'エラー: 取得失敗'
      });
    }
  }
  
  return results;
}

async function main() {
  // コマンドライン引数を取得
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('使い方: node fetch_album_producers.js <アーティスト名> <アルバム名>');
    console.error('例: node fetch_album_producers.js Addison-rae Addison');
    process.exit(1);
  }
  
  const artistName = args[0];
  const albumName = args[1];
  
  console.log(`\n=== ${albumName} by ${artistName} のプロデューサー情報を取得中 ===\n`);
  
  try {
    const results = await fetchAlbumProducers(artistName, albumName);
    
    if (results.length === 0) {
      console.error('曲が見つかりませんでした。アーティスト名とアルバム名を確認してください。');
      process.exit(1);
    }
    
    // 結果をテキストファイルに出力
    let output = `アルバム「${albumName}」- ${artistName}\n`;
    output += `取得日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n`;
    output += `総曲数: ${results.length}曲\n`;
    output += '='.repeat(60) + '\n\n';
    
    results.forEach(track => {
      output += `${track.number}. ${track.title}\n`;
      output += `   Producer: ${track.producer}\n\n`;
    });
    
    // ファイル名を生成（アーティスト名とアルバム名から）
    const safeArtistName = artistName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeAlbumName = albumName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${safeArtistName}_${safeAlbumName}_producers.txt`;
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
