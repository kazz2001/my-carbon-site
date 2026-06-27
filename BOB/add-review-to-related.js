const fs = require('fs');
const path = require('path');

/**
 * レビューファイルの相互リンクを追加するスクリプト
 * 指定されたレビューファイル(例: jid2)を、そのLファイルがimportしている
 * 他のレビューファイルのLファイルに追加する
 */

// コマンドライン引数から対象レビューファイル名を取得
const targetReview = process.argv[2];

if (!targetReview) {
  console.error('エラー: レビューファイル名を指定してください');
  console.error('使用方法: node add-review-to-related.js <review-name>');
  console.error('例: node add-review-to-related.js jid2');
  process.exit(1);
}

const reviewsDir = path.join(__dirname, '../src/pages/review');
const targetLFile = path.join(reviewsDir, `${targetReview}L.mdx`);

// 対象のLファイルが存在するか確認
if (!fs.existsSync(targetLFile)) {
  console.error(`エラー: ${targetReview}L.mdx が見つかりません`);
  process.exit(1);
}

console.log(`処理開始: ${targetReview}L.mdx を解析します...`);

// 対象のLファイルを読み込む
const targetLContent = fs.readFileSync(targetLFile, 'utf-8');

// import文から関連レビューファイルを抽出
const importRegex = /import\s+\w+\s+from\s+["']\.\.\/review\/([^"']+)\.mdx["'];?/g;
const relatedReviews = [];
let match;

while ((match = importRegex.exec(targetLContent)) !== null) {
  const reviewName = match[1];
  // Lのついていないファイル名のみを抽出
  if (!reviewName.endsWith('L')) {
    relatedReviews.push(reviewName);
  }
}

if (relatedReviews.length === 0) {
  console.log('関連レビューが見つかりませんでした');
  process.exit(0);
}

console.log(`見つかった関連レビュー: ${relatedReviews.join(', ')}`);

// 各関連レビューのLファイルを更新
relatedReviews.forEach(reviewName => {
  const relatedLFile = path.join(reviewsDir, `${reviewName}L.mdx`);
  
  if (!fs.existsSync(relatedLFile)) {
    console.warn(`警告: ${reviewName}L.mdx が見つかりません。スキップします。`);
    return;
  }

  console.log(`\n処理中: ${reviewName}L.mdx`);
  
  let content = fs.readFileSync(relatedLFile, 'utf-8');
  
  // 既に対象レビューがimportされているか確認
  const targetImportPattern = new RegExp(`import\\s+\\w+\\s+from\\s+["']\\.\\.\\/review\\/${targetReview}\\.mdx["'];?`);
  if (targetImportPattern.test(content)) {
    console.log(`  → 既に ${targetReview}.mdx がimportされています。スキップします。`);
    return;
  }

  // 1. import文を追加
  // 最後のreviewディレクトリからのimport文を見つける
  const lastReviewImportMatch = content.match(/import\s+(\w+)\s+from\s+["']\.\.\/review\/([^"']+)\.mdx["'];?/g);
  
  let nextReviewNumber = 1;
  let insertPosition = -1;
  
  if (lastReviewImportMatch) {
    // reviewディレクトリからのimportがある場合
    const lastImport = lastReviewImportMatch[lastReviewImportMatch.length - 1];
    insertPosition = content.lastIndexOf(lastImport) + lastImport.length;
    
    // 次のReview番号を決定
    const existingReviewNumbers = [];
    const reviewNumberRegex = /import\s+Review(\d+)\s+from/g;
    let numberMatch;
    while ((numberMatch = reviewNumberRegex.exec(content)) !== null) {
      existingReviewNumbers.push(parseInt(numberMatch[1]));
    }
    nextReviewNumber = existingReviewNumbers.length > 0 
      ? Math.max(...existingReviewNumbers) + 1 
      : 1;
  } else {
    // reviewディレクトリからのimportがない場合、全てのimport文の後に追加
    const allImportsMatch = content.match(/import\s+.*?from\s+["'].*?["'];?/g);
    if (allImportsMatch) {
      const lastImport = allImportsMatch[allImportsMatch.length - 1];
      insertPosition = content.lastIndexOf(lastImport) + lastImport.length;
    }
  }
  
  if (insertPosition === -1) {
    console.warn(`  警告: import文の挿入位置が見つかりませんでした`);
    return;
  }
  
  const newImport = `\nimport Review${nextReviewNumber} from "../review/${targetReview}.mdx";`;
  content = content.slice(0, insertPosition) + 
            newImport + 
            content.slice(insertPosition);
  
  console.log(`  ✓ import文を追加: Review${nextReviewNumber}`);
  
  // 2. Other Reviewsセクションに追加
  const otherReviewsRegex = /<h3>Other Reviews<\/h3>\s*\n+\s*<Row>([\s\S]*?)<\/Row>/;
  const otherReviewsMatch = content.match(otherReviewsRegex);
  
  if (otherReviewsMatch) {
    const rowContent = otherReviewsMatch[1];
    const newColumn = `\n\t<Column colMd={3} colLg={3} noGutterMdLeft>\n\t\t<Review${nextReviewNumber} />\n\t</Column>`;
    
    // </Row>の直前に新しいColumnを追加
    const updatedRow = rowContent + newColumn + '\n';
    content = content.replace(otherReviewsRegex, `<h3>Other Reviews</h3>\n\n<Row>${updatedRow}</Row>`);
    
    console.log(`  ✓ Other Reviewsセクションに追加`);
  } else {
    // Other Reviewsセクションが存在しない場合、新規作成
    console.log(`  → Other Reviewsセクションが見つかりません。新規作成します。`);
    
    // ファイルの最後に追加（最後の</Row>や</Column>の後）
    const newSection = `\n\n<h3>Other Reviews</h3>\n\n<Row>\n\t<Column colMd={3} colLg={3} noGutterMdLeft>\n\t\t<Review${nextReviewNumber} />\n\t</Column>\n</Row>\n`;
    
    // ファイルの末尾に追加
    content = content.trimEnd() + newSection;
    
    console.log(`  ✓ Other Reviewsセクションを新規作成しました`);
  }
  
  // ファイルを保存
  fs.writeFileSync(relatedLFile, content, 'utf-8');
  console.log(`  ✓ ${reviewName}L.mdx を更新しました`);
});

console.log('\n処理完了！');

// Made with Bob
