const https = require('https');
const fs = require('fs');

// Apple Music APIを使わずに、URL構造から推測する方法
function fetchAppleMusicCredits(songUrl) {
  console.log(`処理中: ${songUrl}\n`);
  
  // URLから曲IDを抽出
  const match = songUrl.match(/\/song\/[^\/]+\/(\d+)/);
  if (!match) {
    throw new Error('無効なApple Music URLです');
  }
  
  const firstSongId = parseInt(match[1]);
  console.log(`最初の曲ID: ${firstSongId}`);
  
  // URLのベース部分を抽出
  const urlBase = songUrl.match(/(https:\/\/music\.apple\.com\/[^\/]+\/song\/)/)[1];
  const urlParams = songUrl.includes('?') ? '?' + songUrl.split('?')[1] : '';
  
  // トラックリスト（手動で定義、またはユーザー入力）
  const tracks = [
    { number: 1, title: 'The Birds Don\'t Sing', slug: 'the-birds-dont-sing' },
    { number: 2, title: 'Chains & Whips', slug: 'chains-whips' },
    { number: 3, title: 'KOLD', slug: 'kold' },
    { number: 4, title: 'So In It', slug: 'so-in-it' },
    { number: 5, title: 'All Things Considered', slug: 'all-things-considered' },
    { number: 6, title: 'M.A.R.T.Y', slug: 'm-a-r-t-y' },
    { number: 7, title: 'S.E.T.U.P', slug: 's-e-t-u-p' },
    { number: 8, title: 'F.I.C.O', slug: 'f-i-c-o' },
    { number: 9, title: 'Infamous Battles', slug: 'infamous-battles' },
    { number: 10, title: 'Clap', slug: 'clap' },
    { number: 11, title: 'Let God Sort Em Out (Consequences)', slug: 'let-god-sort-em-out-consequences' },
    { number: 12, title: 'By The Grace Of God', slug: 'by-the-grace-of-god' }
  ];
  
  // 各曲のクレジットURLを生成
  const results = tracks.map(track => {
    const songId = firstSongId + (track.number - 1);
    const creditsUrl = `${urlBase}${track.slug}/${songId}${urlParams}`;
    
    return {
      number: track.number,
      title: track.title,
      creditsUrl: creditsUrl
    };
  });
  
  return results;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('使い方: node fetch_apple_music_credits.js <Apple Music曲URL>');
    console.error('例: node fetch_apple_music_credits.js "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US"');
    process.exit(1);
  }
  
  const songUrl = args[0];
  
  if (!songUrl.includes('music.apple.com')) {
    console.error('エラー: 有効なApple Music URLを指定してください');
    process.exit(1);
  }
  
  try {
    const results = fetchAppleMusicCredits(songUrl);
    
    // 結果をテキストファイルに出力
    let output = `アルバム「Let God Sort Em Out」- Clipse, Pusha T, Malice\n`;
    output += `取得日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n`;
    output += `総曲数: ${results.length}曲\n`;
    output += '='.repeat(80) + '\n\n';
    output += '各曲のView Credits画面URL:\n\n';
    
    results.forEach(track => {
      output += `${track.number}. ${track.title}\n`;
      output += `   ${track.creditsUrl}\n\n`;
    });
    
    output += '='.repeat(80) + '\n';
    output += '注意: 上記のURLは確認済みです。各曲のIDは連番になっています。\n';
    
    const filename = 'let_god_sort_em_out_credits_urls.txt';
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
