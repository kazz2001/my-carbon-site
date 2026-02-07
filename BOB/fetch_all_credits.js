const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = [
  { num: 1, title: "The Birds Don't Sing", url: "https://music.apple.com/jp/song/the-birds-dont-sing/1816313640?l=en-US" },
  { num: 2, title: "Chains & Whips", url: "https://music.apple.com/jp/song/chains-whips/1816313641?l=en-US" },
  { num: 3, title: "KOLD", url: "https://music.apple.com/jp/song/kold/1816313642?l=en-US" },
  { num: 4, title: "So In It", url: "https://music.apple.com/jp/song/so-in-it/1816313643?l=en-US" },
  { num: 5, title: "All Things Considered", url: "https://music.apple.com/jp/song/all-things-considered/1816313644?l=en-US" },
  { num: 6, title: "M.A.R.T.Y", url: "https://music.apple.com/jp/song/m-a-r-t-y/1816313645?l=en-US" },
  { num: 7, title: "S.E.T.U.P", url: "https://music.apple.com/jp/song/s-e-t-u-p/1816313646?l=en-US" },
  { num: 8, title: "F.I.C.O", url: "https://music.apple.com/jp/song/f-i-c-o/1816313647?l=en-US" },
  { num: 9, title: "Infamous Battles", url: "https://music.apple.com/jp/song/infamous-battles/1816313648?l=en-US" },
  { num: 10, title: "Clap", url: "https://music.apple.com/jp/song/clap/1816313649?l=en-US" },
  { num: 11, title: "Let God Sort Em Out (Consequences)", url: "https://music.apple.com/jp/song/let-god-sort-em-out-consequences/1816313650?l=en-US" },
  { num: 12, title: "By The Grace Of God", url: "https://music.apple.com/jp/song/by-the-grace-of-god/1816313651?l=en-US" }
];

async function extractCredits(page) {
  await page.waitForSelector('[class*="composition"]', { timeout: 10000 });
  
  const credits = await page.evaluate(() => {
    const composers = [];
    const producers = [];
    
    // Extract composers
    const compositionSection = document.querySelector('[class*="composition"]');
    if (compositionSection) {
      const composerElements = compositionSection.querySelectorAll('[class*="artist-name"]');
      composerElements.forEach(el => {
        const name = el.textContent.trim();
        if (name && !composers.includes(name)) {
          composers.push(name);
        }
      });
    }
    
    // Extract producers
    const productionSection = document.querySelector('[class*="production"]');
    if (productionSection) {
      const producerElements = productionSection.querySelectorAll('[class*="artist-name"]');
      producerElements.forEach(el => {
        const parent = el.closest('[class*="credit-item"]');
        if (parent) {
          const role = parent.textContent.toLowerCase();
          if (role.includes('producer') && !role.includes('assistant') && !role.includes('associate')) {
            const name = el.textContent.trim();
            if (name && !producers.includes(name)) {
              producers.push(name);
            }
          }
        }
      });
    }
    
    return { composers, producers };
  });
  
  return credits;
}

async function main() {
  console.log('ブラウザを起動中...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 3840 });
  
  const results = [];
  
  for (const track of urls) {
    console.log(`\n${track.num}. ${track.title} を処理中...`);
    console.log(`URL: ${track.url}`);
    
    try {
      await page.goto(track.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credits = await extractCredits(page);
      
      results.push({
        number: track.num,
        title: track.title,
        composers: credits.composers,
        producers: credits.producers
      });
      
      console.log(`Composers: ${credits.composers.join(', ')}`);
      console.log(`Producers: ${credits.producers.join(', ')}`);
      
    } catch (error) {
      console.error(`エラー: ${error.message}`);
      results.push({
        number: track.num,
        title: track.title,
        composers: [],
        producers: [],
        error: error.message
      });
    }
  }
  
  await browser.close();
  
  // 結果をJSONファイルに保存
  fs.writeFileSync('credits_data.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n\n結果を credits_data.json に保存しました');
  
  // テキスト形式でも保存
  let output = 'Let God Sort Em Out - Credits Information\n';
  output += '='.repeat(80) + '\n\n';
  
  results.forEach(track => {
    output += `${track.number}. ${track.title}\n`;
    output += `   Composer: ${track.composers.join(', ') || 'N/A'}\n`;
    output += `   Producer: ${track.producers.join(', ') || 'N/A'}\n`;
    if (track.error) {
      output += `   Error: ${track.error}\n`;
    }
    output += '\n';
  });
  
  fs.writeFileSync('credits_data.txt', output, 'utf8');
  console.log('結果を credits_data.txt にも保存しました\n');
}

main().catch(console.error);

// Made with Bob
