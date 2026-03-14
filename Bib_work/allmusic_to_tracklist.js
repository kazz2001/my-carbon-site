/**
 * AllMusic Track List Scraper
 * AllMusicのアルバムページからトラックリスト情報を取得してHTMLテーブルを生成
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

/**
 * AllMusicのURLからトラックリスト情報を取得
 * @param {string} url - AllMusicのアルバムURL
 * @returns {Object} アルバム情報とトラックリスト
 */
async function scrapeAllMusicTrackList(url) {
    console.log(`AllMusicページを取得中: ${url}`);
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        // ページを開く
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // アルバム情報を取得
        const albumInfo = await page.evaluate(() => {
            const titleElement = document.querySelector('.album-title, h1.title, h2.album-title');
            const artistElement = document.querySelector('.album-artist, .artist-name, h2.artist a');
            
            return {
                title: titleElement ? titleElement.textContent.trim() : 'Unknown Album',
                artist: artistElement ? artistElement.textContent.trim() : 'Unknown Artist'
            };
        });
        
        console.log(`アルバム: ${albumInfo.artist} - ${albumInfo.title}`);
        
        // Track Listingセクションをクリックして展開
        try {
            await page.waitForSelector('a[href*="#track-listing"], .track-listing, .tracks', { timeout: 5000 });
            const trackListingLink = await page.$('a[href*="#track-listing"]');
            if (trackListingLink) {
                await trackListingLink.click();
                await page.waitForTimeout(1000);
            }
        } catch (e) {
            console.log('Track Listingセクションは既に展開されています');
        }
        
        // トラックリストを取得
        const tracks = await page.evaluate(() => {
            const trackRows = document.querySelectorAll('.track, tr.track, .track-listing tbody tr, [class*="track-row"]');
            const trackList = [];
            
            trackRows.forEach((row, index) => {
                // トラック番号
                let trackNumber = row.querySelector('.track-number, .tracknum, td:first-child')?.textContent.trim();
                if (!trackNumber || trackNumber === '') {
                    trackNumber = (index + 1).toString();
                }
                
                // タイトル
                const titleElement = row.querySelector('.title a, .track-title, .title, td:nth-child(2) a, [class*="title"]');
                const title = titleElement ? titleElement.textContent.trim() : '';
                
                if (!title) return; // タイトルがない場合はスキップ
                
                // 作曲者（Composer）
                const composerElement = row.querySelector('.composer, [class*="composer"], td:nth-child(2)');
                let composer = '';
                if (composerElement) {
                    const composerText = composerElement.textContent || composerElement.innerText;
                    // タイトルの後の作曲者情報を抽出
                    const lines = composerText.split('\n').map(l => l.trim()).filter(l => l);
                    if (lines.length > 1) {
                        composer = lines.slice(1).join(' / ');
                    }
                }
                
                // 演奏者（Performer）
                const performerElement = row.querySelector('.performer, [class*="performer"], td:nth-child(3)');
                let performer = performerElement ? performerElement.textContent.trim() : '';
                
                // フィーチャリングアーティストを確認
                const featMatch = composer.match(/feat[.:]?\s*(.+?)(?=\s*$|\s*\/)/i);
                if (featMatch && performer) {
                    performer = `${performer} feat: ${featMatch[1].trim()}`;
                }
                
                // 演奏時間
                const timeElement = row.querySelector('.time, .length, .duration, td:last-child, [class*="time"]');
                const time = timeElement ? timeElement.textContent.trim() : '';
                
                trackList.push({
                    number: trackNumber,
                    title: title,
                    composer: composer,
                    performer: performer || albumInfo.artist,
                    time: time
                });
            });
            
            return trackList;
        });
        
        console.log(`${tracks.length}曲のトラックを取得しました`);
        
        return {
            albumInfo,
            tracks
        };
        
    } finally {
        await browser.close();
    }
}

/**
 * HTMLテーブルを生成
 * @param {Object} data - アルバム情報とトラックリスト
 * @returns {string} HTML文字列
 */
function generateHTML(data) {
    const { albumInfo, tracks } = data;
    
    const trackRows = tracks.map(track => `
            <tr>
                <td class="no-col">${track.number}</td>
                <td>${track.title}</td>
                <td>${track.composer}</td>
                <td>${track.performer}</td>
                <td class="time-col">${track.time}</td>
            </tr>`).join('');
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${albumInfo.artist} - ${albumInfo.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        h2 {
            color: #5f9ea0;
            border-bottom: 2px solid #5f9ea0;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th {
            background-color: #d3d3d3;
            color: #333;
            padding: 10px;
            text-align: left;
            border: 1px solid #ccc;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #ccc;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f0f0f0;
        }
        .no-col {
            width: 40px;
            text-align: center;
        }
        .time-col {
            width: 60px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>${albumInfo.artist} / ${albumInfo.title}</h1>
    
    <h2>Tracks</h2>
    <table>
        <thead>
            <tr>
                <th class="no-col">No.</th>
                <th>Title</th>
                <th>Composer</th>
                <th>Performer</th>
                <th class="time-col">Time</th>
            </tr>
        </thead>
        <tbody>${trackRows}
        </tbody>
    </table>

</body>
</html>`;
}

/**
 * メイン処理
 */
async function main() {
    // コマンドライン引数からURLを取得
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('使用方法: node allmusic_to_tracklist.js <AllMusic URL>');
        console.error('例: node allmusic_to_tracklist.js https://www.allmusic.com/album/the-art-of-loving-mw0004542465');
        process.exit(1);
    }
    
    const url = args[0];
    
    // URLの検証
    if (!url.includes('allmusic.com')) {
        console.error('エラー: AllMusicのURLを指定してください');
        process.exit(1);
    }
    
    try {
        // トラックリストを取得
        const data = await scrapeAllMusicTrackList(url);
        
        if (data.tracks.length === 0) {
            console.error('エラー: トラックリストが見つかりませんでした');
            process.exit(1);
        }
        
        // HTMLを生成
        const html = generateHTML(data);
        
        // ファイル名を生成（アーティスト名とアルバム名から）
        const filename = `${data.albumInfo.artist}_${data.albumInfo.title}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '') + '.html';
        
        // ファイルに保存
        await fs.writeFile(filename, html, 'utf-8');
        
        console.log(`\n✓ HTMLファイルを生成しました: ${filename}`);
        console.log(`✓ ${data.tracks.length}曲のトラックリストを含みます`);
        
    } catch (error) {
        console.error('エラーが発生しました:', error.message);
        process.exit(1);
    }
}

// スクリプトとして実行された場合
if (require.main === module) {
    main();
}

module.exports = { scrapeAllMusicTrackList, generateHTML };

// Made with Bob
