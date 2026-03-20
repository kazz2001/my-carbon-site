const fs = require('fs');
const path = require('path');
const glob = require('glob');

// src/pages/review下のj*L.mdxファイルを取得
const files = glob.sync('src/pages/review/j*L.mdx');

console.log(`Found ${files.length} files to format`);

files.forEach(filePath => {
	console.log(`Processing: ${filePath}`);
	
	// ファイルを読み込む
	let content = fs.readFileSync(filePath, 'utf8');
	
	// 行ごとに処理
	const lines = content.split('\n');
	const formattedLines = lines.map(line => {
		// 先頭のスペースをタブに変換
		const leadingSpaces = line.match(/^( +)/);
		if (leadingSpaces) {
			const spaceCount = leadingSpaces[1].length;
			const tabCount = Math.floor(spaceCount / 2);
			const remainder = spaceCount % 2;
			return '\t'.repeat(tabCount) + ' '.repeat(remainder) + line.substring(spaceCount);
		}
		return line;
	});
	
	// テーブル行の整形
	const finalLines = formattedLines.map(line => {
		// テーブル行の場合
		if (line.includes('|') && !line.trim().startsWith('import')) {
			// 複数スペースを1つに統一
			return line.replace(/\s{2,}/g, ' ').replace(/\s+\|/g, ' |').replace(/\|\s+/g, '| ');
		}
		return line;
	});
	
	// ファイルに書き込む
	fs.writeFileSync(filePath, finalLines.join('\n'), 'utf8');
});

console.log('Formatting complete!');

// Made with Bob
