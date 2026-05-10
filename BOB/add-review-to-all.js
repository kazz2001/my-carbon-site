#!/usr/bin/env node

/**
 * レビューをindex、latest、cd-yearに一括追加する統合スクリプト
 * 
 * 使用方法:
 * node add-review-to-all.js <review-name> <year>
 * 
 * 例:
 * node add-review-to-all.js addisonrae1 2025
 */

const { spawn } = require('child_process');
const path = require('path');

// コマンドライン引数の取得
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('エラー: レビュー名と年を指定してください');
  console.log('使用方法: node add-review-to-all.js <review-name> <year>');
  console.log('例: node add-review-to-all.js addisonrae1 2025');
  process.exit(1);
}

const reviewName = args[0];
const year = args[1];

// 年の形式を検証（4桁の数字）
if (!/^\d{4}$/.test(year)) {
  console.error(`エラー: 年は4桁の数字で指定してください（例: 2025）、入力値: ${year}`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('レビュー一括追加スクリプト');
console.log('='.repeat(60));
console.log(`レビュー名: ${reviewName}`);
console.log(`追加先の年: ${year}`);
console.log('');

// スクリプトのパス
const scriptDir = __dirname;
const projectRoot = path.join(scriptDir, '..');
const addToIndexScript = path.join(scriptDir, 'add-review-to-index.js');
const addToLatestScript = path.join(scriptDir, 'add-review-to-latest.js');
const addToCdYearScript = path.join(scriptDir, 'add-review-to-cd-year.js');

// スクリプトを順次実行する関数
function runScript(scriptPath, args, stepName) {
  return new Promise((resolve, reject) => {
    console.log(`${stepName}を実行中...`);
    console.log('='.repeat(60));
    
    const process = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${stepName}が終了コード ${code} で終了しました`));
      } else {
        console.log(`✓ ${stepName}完了\n`);
        resolve();
      }
    });
    
    process.on('error', (err) => {
      reject(new Error(`${stepName}の実行に失敗しました: ${err.message}`));
    });
  });
}

// メイン処理
async function main() {
  try {
    // ステップ1: add-review-to-index.js を実行
    await runScript(addToIndexScript, [reviewName], 'ステップ 1/3: index.mdxへの追加');
    
    // ステップ2: add-review-to-latest.js を実行
    await runScript(addToLatestScript, [reviewName], 'ステップ 2/3: latest/index.mdxへの追加');
    
    // ステップ3: add-review-to-cd-year.js を実行
    await runScript(addToCdYearScript, [reviewName, year], `ステップ 3/3: cd/${year}.mdxへの追加`);
    
    console.log('='.repeat(60));
    console.log('✅ すべての処理が完了しました！');
    console.log('='.repeat(60));
    console.log('');
    console.log('更新されたファイル:');
    console.log('  - src/pages/index.mdx');
    console.log('  - src/pages/latest/index.mdx');
    console.log(`  - src/pages/cd/${year}.mdx`);
    console.log('');
    console.log('次のステップ:');
    console.log('  1. 更新されたファイルを確認');
    console.log('  2. 必要に応じてBest50への追加を実行:');
    console.log(`     node BOB/add-review-to-best50.js ${reviewName} ${year}`);
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();

// Made with Bob