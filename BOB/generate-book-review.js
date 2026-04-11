/**
 * Amazon URLから書籍情報を取得してMDXファイルを生成するスクリプト
 * 
 * 使用方法:
 * node BOB/generate-book-review.js <amazon_url> [output_filename]
 *
 * 例:
 * node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898"
 * node BOB/generate-book-review.js "https://www.amazon.co.jp/dp/4781624898" "hiphopmeiban100"
 */

const puppeteer = require('puppeteer');
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
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Amazonページにアクセス中...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // ページが読み込まれるまで待機
    await page.waitForSelector('h1', { timeout: 10000 });

    const bookInfo = new BookInfo();
    bookInfo.amazonUrl = url;

    // タイトルを取得
    try {
      bookInfo.title = await page.$eval('#productTitle, h1[id*="title"]', el => el.textContent.trim());
      console.log('タイトル:', bookInfo.title);
    } catch (e) {
      console.log('タイトル取得エラー:', e.message);
    }

    // 著者を取得
    try {
      bookInfo.author = await page.$eval('.author a, .contributorNameID', el => el.textContent.trim());
      console.log('著者:', bookInfo.author);
    } catch (e) {
      console.log('著者取得エラー:', e.message);
    }

    // 「すべての詳細を表示」をクリック
    try {
      const detailsButton = await page.$('a[href*="#detailBullets"]');
      if (detailsButton) {
        await detailsButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (e) {
      console.log('詳細ボタンクリックエラー:', e.message);
    }

    // 詳細情報を取得
    try {
      const details = await page.evaluate(() => {
        const info = {};
        const rows = document.querySelectorAll('#detailBullets_feature_div li, .detail-bullet-list li');
        
        rows.forEach(row => {
          const text = row.textContent;
          if (text.includes('出版社')) {
            const match = text.match(/出版社[:\s]*([^\n]+)/);
            if (match) info.publisher = match[1].trim();
          }
          if (text.includes('ページ数')) {
            const match = text.match(/(\d+)ページ/);
            if (match) info.pages = match[1];
          }
          if (text.includes('発売日')) {
            const match = text.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
            if (match) info.releaseDate = match[1];
          }
          if (text.includes('ISBN-13')) {
            const match = text.match(/ISBN-13[:\s]*(\d{3}-\d+)/);
            if (match) info.isbn = match[1];
          }
          if (text.includes('梱包サイズ') || text.includes('寸法')) {
            const match = text.match(/([\d.]+\s*x\s*[\d.]+\s*x\s*[\d.]+\s*cm)/);
            if (match) info.size = match[1].trim();
          }
        });
        
        return info;
      });

      Object.assign(bookInfo, details);
      console.log('詳細情報:', details);
    } catch (e) {
      console.log('詳細情報取得エラー:', e.message);
    }

    // 価格を取得
    try {
      const priceText = await page.$eval('.a-price .a-offscreen, #price', el => el.textContent.trim());
      const priceMatch = priceText.match(/[¥￥]?([\d,]+)/);
      if (priceMatch) {
        bookInfo.price = priceMatch[1].replace(',', '');
      }
      console.log('価格:', bookInfo.price);
    } catch (e) {
      console.log('価格取得エラー:', e.message);
    }

    return bookInfo;

  } finally {
    await browser.close();
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
