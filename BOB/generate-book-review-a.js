/**
 * Amazon URLから書籍情報を取得してMDXファイルを生成するスクリプト
 * 
 * 使用方法:
 * node BOB/generate-book-review.js <amazon_url> [output_filename]
 *
 * 例:
 * node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898"
 * node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898" "hiphopmeiban100"
 * 
 * 必要なパッケージ:
 * npm install node-fetch@2 cheerio
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// 書籍情報を格納するオブジェクト
class BookInfo {
  constructor() {
    this.title = '';
    this.author = '';
    this.publisher = '';
    this.pages = '';
    this.size = '';
    this.releaseDate = '';
    this.price = '';
    this.isbn = '';
    this.amazonUrl = '';
    this.imageFileName = '';
  }
}

/**
 * Amazon URLから書籍情報を取得
 */
async function fetchBookInfo(url) {
  try {
    console.log('Amazonページにアクセス中...');
    
    // User-Agentを設定してリクエスト
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const bookInfo = new BookInfo();
    bookInfo.amazonUrl = url;

    // タイトルを取得
    try {
      const title = $('#productTitle').text().trim() || 
                    $('h1[id*="title"]').text().trim() ||
                    $('span[id="productTitle"]').text().trim();
      if (title) {
        bookInfo.title = title;
        console.log('タイトル:', bookInfo.title);
      }
    } catch (e) {
      console.log('タイトル取得エラー:', e.message);
    }

    // 著者を取得
    try {
      const author = $('.author a').first().text().trim() ||
                     $('.contributorNameID').first().text().trim() ||
                     $('a[class*="author"]').first().text().trim();
      if (author) {
        bookInfo.author = author;
        console.log('著者:', bookInfo.author);
      }
    } catch (e) {
      console.log('著者取得エラー:', e.message);
    }

    // 詳細情報を取得
    try {
      const detailBullets = $('#detailBullets_feature_div li, .detail-bullet-list li');
      
      detailBullets.each((i, elem) => {
        const text = $(elem).text();
        
        // 出版社
        if (text.includes('出版社')) {
          const match = text.match(/出版社[:\s]*([^\n(]+)/);
          if (match) {
            bookInfo.publisher = match[1].trim();
          }
        }
        
        // ページ数
        if (text.includes('ページ数')) {
          const match = text.match(/(\d+)ページ/);
          if (match) {
            bookInfo.pages = match[1];
          }
        }
        
        // 発売日
        if (text.includes('発売日')) {
          const match = text.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
          if (match) {
            bookInfo.releaseDate = match[1];
          }
        }
        
        // ISBN
        if (text.includes('ISBN-13')) {
          const match = text.match(/ISBN-13[:\s]*(\d{3}-\d+)/);
          if (match) {
            bookInfo.isbn = match[1];
          }
        }
        
        // サイズ
        if (text.includes('梱包サイズ') || text.includes('寸法')) {
          const match = text.match(/([\d.]+\s*x\s*[\d.]+\s*x\s*[\d.]+\s*cm)/);
          if (match) {
            bookInfo.size = match[1].trim();
          }
        }
      });

      // 別の詳細情報セクションも確認
      const productDetails = $('#detailBulletsWrapper_feature_div .a-list-item, #productDetails_detailBullets_sections1 tr');
      productDetails.each((i, elem) => {
        const text = $(elem).text();
        
        if (text.includes('出版社') && !bookInfo.publisher) {
          const match = text.match(/出版社[:\s]*([^\n(]+)/);
          if (match) bookInfo.publisher = match[1].trim();
        }
        
        if (text.includes('ページ数') && !bookInfo.pages) {
          const match = text.match(/(\d+)ページ/);
          if (match) bookInfo.pages = match[1];
        }
        
        if (text.includes('発売日') && !bookInfo.releaseDate) {
          const match = text.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
          if (match) bookInfo.releaseDate = match[1];
        }
      });

      console.log('詳細情報取得完了');
    } catch (e) {
      console.log('詳細情報取得エラー:', e.message);
    }

    // 価格を取得
    try {
      const priceText = $('.a-price .a-offscreen').first().text().trim() ||
                        $('#price').text().trim() ||
                        $('.a-color-price').first().text().trim();
      
      if (priceText) {
        const priceMatch = priceText.match(/[¥￥]?([\d,]+)/);
        if (priceMatch) {
          bookInfo.price = priceMatch[1].replace(/,/g, '');
          console.log('価格:', bookInfo.price);
        }
      }
    } catch (e) {
      console.log('価格取得エラー:', e.message);
    }

    return bookInfo;

  } catch (error) {
    console.error('書籍情報の取得に失敗しました:', error.message);
    throw error;
  }
}

/**
 * ファイル名を生成（タイトルから）
 */
function generateFileName(title) {
  // 日本語タイトルをローマ字に変換（簡易版）
  const fileName = title
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w\s-]/g, '')
    .substring(0, 30);
  
  return fileName || 'book';
}

/**
 * L版MDXファイルを生成
 */
function generateLVersionMDX(bookInfo) {
  const fileName = bookInfo.imageFileName;
  
  return `---
title: "${bookInfo.title} / 著者 ${bookInfo.author}"
description: "${bookInfo.title} / 著者 ${bookInfo.author}"
keywords: "${bookInfo.title}, ${bookInfo.author}"
---

import { Button } from "@carbon/react";
import { ArrowUpRight } from "@carbon/icons-react";

<Row>
  <Column colMd={8} colLg={12} noGutterMdLeft="">
    <p className="largeP">Book Review</p>
    <h1 className="h1-no-bottom-margin">${bookInfo.title}</h1>
  </Column>
</Row>

<Row>
<Column colMd={3} colLg={4} noGutterMdLeft="">

![${bookInfo.title} / ${bookInfo.author}](../../images/books/${fileName}.jpg) 

</Column>
<Column colMd={5} colLg={8} noGutterMdLeft="">
  <div>
    <p>著者</p>
    <p className="largeP">
      ${bookInfo.author}
    </p>
    <br/>
    <p>出版社</p>
    <p className="largeP">
      ${bookInfo.publisher}
    </p>
    <br/>
    <p>ページ数 / サイズ</p>
    <p className="largeP">
      ${bookInfo.pages}ページ${bookInfo.size ? ' / ' + bookInfo.size : ''} 
    </p>
    <br/>
    <p>発売日</p>
    <p className="largeP">
      ${bookInfo.releaseDate}
    </p>
    <br/>
    <p>定価</p>
    <p className="largeP">
      ${bookInfo.price}円(税抜き)
    </p>
    <div>
    <Button href="${bookInfo.amazonUrl}" renderIcon={ArrowUpRight} size='sm' kind='primary'>
      amazon.co.jp
    </Button>
    </div>
  </div>
</Column>
</Row>

<Row>
  <Column colMd={8} colLg={12} noGutterMdLeft="">
    <p>
      <b> - [ここに書籍の説明文を追加してください] -</b>
      <br />
      <br />
      [ここにレビュー本文を追加してください]
      </p>
  </Column>
</Row>
`;
}

/**
 * A版MDXファイルを生成
 */
function generateAVersionMDX(bookInfo) {
  const fileName = bookInfo.imageFileName;
  
  return `<ArticleCard
  title="${bookInfo.title} / ${bookInfo.author}"
  href="/book/${fileName}L/"
  actionIcon="arrowRight"
>

![${bookInfo.title} / ${bookInfo.author}](../../images/books/${fileName}.jpg) 
</ArticleCard>

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
`;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('使用方法: node BOB/generate-book-review.js <amazon_url> [output_filename]');
    console.error('例: node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898"');
    console.error('例: node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898" "hiphopmeiban100"');
    process.exit(1);
  }

  const amazonUrl = args[0];
  const customFileName = args[1]; // オプションのファイル名パラメーター
  
  try {
    console.log('書籍情報を取得中...');
    const bookInfo = await fetchBookInfo(amazonUrl);
    
    // ファイル名を生成（カスタムファイル名が指定されていればそれを使用）
    bookInfo.imageFileName = customFileName || generateFileName(bookInfo.title);
    
    console.log('\n取得した書籍情報:');
    console.log('タイトル:', bookInfo.title);
    console.log('著者:', bookInfo.author);
    console.log('出版社:', bookInfo.publisher);
    console.log('ページ数:', bookInfo.pages);
    console.log('サイズ:', bookInfo.size);
    console.log('発売日:', bookInfo.releaseDate);
    console.log('価格:', bookInfo.price);
    console.log('ISBN:', bookInfo.isbn);
    console.log('ファイル名:', bookInfo.imageFileName);
    
    // MDXファイルを生成
    const lVersionContent = generateLVersionMDX(bookInfo);
    const aVersionContent = generateAVersionMDX(bookInfo);
    
    // BOB/Bob_outputに保存
    const outputDir = path.join(__dirname, 'Bob_output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const lVersionPath = path.join(outputDir, `${bookInfo.imageFileName}L.mdx`);
    const aVersionPath = path.join(outputDir, `${bookInfo.imageFileName}A.mdx`);
    
    await fs.writeFile(lVersionPath, lVersionContent, 'utf8');
    await fs.writeFile(aVersionPath, aVersionContent, 'utf8');
    
    console.log('\n✓ ファイルを生成しました:');
    console.log('  -', lVersionPath);
    console.log('  -', aVersionPath);
    
    // src/pages/bookにもコピー
    const pagesBookDir = path.join(__dirname, '..', 'src', 'pages', 'book');
    await fs.mkdir(pagesBookDir, { recursive: true });
    
    const pagesLVersionPath = path.join(pagesBookDir, `${bookInfo.imageFileName}L.mdx`);
    const pagesAVersionPath = path.join(pagesBookDir, `${bookInfo.imageFileName}A.mdx`);
    
    await fs.writeFile(pagesLVersionPath, lVersionContent, 'utf8');
    await fs.writeFile(pagesAVersionPath, aVersionContent, 'utf8');
    
    console.log('  -', pagesLVersionPath);
    console.log('  -', pagesAVersionPath);
    
    console.log('\n注意: 書籍の表紙画像を以下のパスに配置してください:');
    console.log(`  src/images/books/${bookInfo.imageFileName}.jpg`);
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { fetchBookInfo, generateLVersionMDX, generateAVersionMDX };

// Made with Bob
