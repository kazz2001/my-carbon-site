const fs = require('fs');
const path = require('path');

// Get all L*L.mdx files
const reviewDir = path.join(__dirname, '..', 'src', 'pages', 'review');
const files = fs.readdirSync(reviewDir)
	.filter(f => /^[Ll].*[Ll]\.mdx$/.test(f))
	.sort();

console.log(`Found ${files.length} files to format`);

const formattedFiles = [];

files.forEach(filename => {
	const filePath = path.join(reviewDir, filename);
	let content = fs.readFileSync(filePath, 'utf8');
	
	// Convert spaces to tabs (assuming 2 or 4 spaces per indent level)
	const lines = content.split('\n');
	const formattedLines = lines.map(line => {
		// Replace leading spaces with tabs
		const match = line.match(/^( +)/);
		if (match) {
			const spaces = match[1].length;
			const tabs = '\t'.repeat(Math.floor(spaces / 2)); // Assuming 2 spaces = 1 tab
			return tabs + line.substring(spaces);
		}
		return line;
	});
	
	content = formattedLines.join('\n');
	
	// Ensure file ends with newline
	if (!content.endsWith('\n')) {
		content += '\n';
	}
	
	// Write back
	fs.writeFileSync(filePath, content, 'utf8');
	formattedFiles.push(filename);
	console.log(`Formatted: ${filename}`);
});

// Write list to output file
const outputPath = path.join(__dirname, 'formatted_l_files.txt');
fs.writeFileSync(outputPath, formattedFiles.join('\n'), 'utf8');
console.log(`\nFormatted ${formattedFiles.length} files`);
console.log(`File list written to: ${outputPath}`);

// Made with Bob
