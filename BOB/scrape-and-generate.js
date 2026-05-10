#!/usr/bin/env node

/**
 * Webページからレビュー情報を抽出してJSONを生成し、
 * そのJSONからMDXファイルを自動生成する統合スクリプト
 * 
 * 使用方法:
 * node scrape-and-generate.js <URL> [output-filename.json]
 * 
 * 例:
 * node scrape-and-generate.js https://bm.planetky.com/durandbernerr1.html
 * node scrape-and-generate.js https://bm.planetky.com/durandbernerr1.html custom-config.json
 */

const { spawn } = require('child_process');
const path = require('path');

// コマンドライン引数の取得
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('エラー: URLを指定してください');
  console.log('使用方法: node scrape-and-generate.js <URL> [output-filename.json]');
  console.log('例: node scrape-and-generate.js https://bm.planetky.com/durandbernerr1.html');
  process.exit(1);
}

const url = args[0];
const outputFilename = args[1];

console.log('='.repeat(60));
console.log('レビュー自動生成統合スクリプト');
console.log('='.repeat(60));
console.log(`URL: ${url}`);
if (outputFilename) {
  console.log(`出力ファイル名: ${outputFilename}`);
}
console.log('');

// スクリプトのパス
const scriptDir = __dirname;
const projectRoot = path.join(scriptDir, '..');
const scrapeScript = path.join(scriptDir, 'scrape-review-to-json.js');
const generateScript = path.join(scriptDir, 'generate-review-from-json.js');

// ステップ1: scrape-review-to-json.js を実行
console.log('ステップ 1/2: レビュー情報を抽出中...');
console.log('='.repeat(60));

const scrapeArgs = outputFilename ? [scrapeScript, url, outputFilename] : [scrapeScript, url];
const scrapeProcess = spawn('node', scrapeArgs, {
  stdio: 'inherit',
  cwd: scriptDir
});

scrapeProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`\nエラー: scrape-review-to-json.js が終了コード ${code} で終了しました`);
    process.exit(code);
  }
  
  // URLから識別子を抽出してJSONファイルパスを決定
  const urlMatch = url.match(/\/([^\/]+)\.html?$/);
  const identifier = urlMatch ? urlMatch[1] : 'album1';
  const jsonFilename = outputFilename || `${identifier}-review-config.json`;
  const jsonPath = path.join(scriptDir, 'Bob_output', jsonFilename);
  
  console.log('');
  console.log('ステップ 2/2: MDXファイルを生成中...');
  console.log('='.repeat(60));
  
  // ステップ2: generate-review-from-json.js を実行（プロジェクトルートから実行）
  const generateProcess = spawn('node', [generateScript, jsonPath], {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
  generateProcess.on('close', (generateCode) => {
    if (generateCode !== 0) {
      console.error(`\nエラー: generate-review-from-json.js が終了コード ${generateCode} で終了しました`);
      process.exit(generateCode);
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ すべての処理が完了しました！');
    console.log('='.repeat(60));
    console.log('');
    console.log('生成されたファイル:');
    console.log(`  - ${jsonPath}`);
    console.log(`  - src/pages/review/${identifier}.mdx`);
    console.log(`  - src/pages/review/${identifier}A.mdx`);
    console.log(`  - src/pages/review/${identifier}L.mdx`);
    console.log('');
    console.log('次のステップ:');
    console.log(`  1. ${jsonPath} を開いて以下を手動で編集（必要に応じて）:`);
    console.log('     - artistNameJa (日本語アーティスト名)');
    console.log('     - albumTitleJa (日本語アルバム名)');
    console.log('     - albumNumber (アルバム番号)');
    console.log('     - amazonJp (Amazon.co.jpリンク)');
    console.log(`  2. アルバムジャケット画像を src/images/cd/${identifier}L.jpg として配置`);
    console.log(`  3. 生成されたMDXファイルを確認・編集`);
  });
  
  generateProcess.on('error', (err) => {
    console.error('\nエラー: generate-review-from-json.js の実行に失敗しました:', err.message);
    process.exit(1);
  });
});

scrapeProcess.on('error', (err) => {
  console.error('\nエラー: scrape-review-to-json.js の実行に失敗しました:', err.message);
  process.exit(1);
});

// Made with Bob