/**
 * Check MDX files for missing AdvJS import statements
 * 
 * Usage: node check_missing_advjs_imports.js <starting_letter>
 * Example: node check_missing_advjs_imports.js b
 * 
 * This script checks all files in src/pages/review that:
 * - Start with the specified letter
 * - End with 'L.mdx'
 * 
 * It verifies if they contain the required import statements:
 * - import AdvJS2 from "../review/adv2";
 * - import AdvJS3 from "../review/adv3";
 * - <AdvJS2/>
 * - <AdvJS3/>
 */

const fs = require('fs');
const path = require('path');

// Get the starting letter from command line argument
const startingLetter = process.argv[2];

if (!startingLetter) {
    console.error('Error: Please provide a starting letter as an argument');
    console.error('Usage: node check_missing_advjs_imports.js <starting_letter>');
    console.error('Example: node check_missing_advjs_imports.js b');
    process.exit(1);
}

// Validate that it's a single letter
if (startingLetter.length !== 1 || !/[a-zA-Z]/.test(startingLetter)) {
    console.error('Error: Starting letter must be a single alphabetic character');
    process.exit(1);
}

const reviewDir = path.join(__dirname, '..', 'src', 'pages', 'review');
const outputDir = path.join(__dirname, 'bob_output');
const letter = startingLetter.toLowerCase();

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Checking files starting with '${letter}' and ending with 'L.mdx'...\n`);

// Check if directory exists
if (!fs.existsSync(reviewDir)) {
    console.error(`Error: Directory not found: ${reviewDir}`);
    process.exit(1);
}

// Read all files in the review directory
const files = fs.readdirSync(reviewDir);

// Filter files that start with the specified letter and end with L.mdx
const targetFiles = files.filter(file => {
    return file.startsWith(letter) && file.endsWith('L.mdx');
});

if (targetFiles.length === 0) {
    console.log(`No files found starting with '${letter}' and ending with 'L.mdx'`);
    process.exit(0);
}

console.log(`Found ${targetFiles.length} files to check\n`);

// Arrays to store results
const missingFiles = [];
const completeFiles = [];

// Check each file for required statements
targetFiles.forEach(filename => {
    const filePath = path.join(reviewDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for required imports and usage
    const hasAdvJS2Import = content.includes('import AdvJS2 from "../review/adv2"') || 
                           content.includes('import AdvJS2 from "./adv2"');
    const hasAdvJS3Import = content.includes('import AdvJS3 from "../review/adv3"') || 
                           content.includes('import AdvJS3 from "./adv3"');
    const hasAdvJS2Usage = content.includes('<AdvJS2/>') || content.includes('<AdvJS2 />');
    const hasAdvJS3Usage = content.includes('<AdvJS3/>') || content.includes('<AdvJS3 />');
    
    const hasAllStatements = hasAdvJS2Import && hasAdvJS3Import && 
                            hasAdvJS2Usage && hasAdvJS3Usage;
    
    if (hasAllStatements) {
        completeFiles.push(filename);
    } else {
        missingFiles.push({
            filename,
            missing: {
                advJS2Import: !hasAdvJS2Import,
                advJS3Import: !hasAdvJS3Import,
                advJS2Usage: !hasAdvJS2Usage,
                advJS3Usage: !hasAdvJS3Usage
            }
        });
    }
});

// Generate report
const timestamp = new Date().toISOString().split('T')[0];
const outputFilename = path.join(outputDir, `missing_advjs_imports_${letter}_files.txt`);

let report = `Files in src/pages/review starting with '${letter}' and ending with 'L.mdx' that are MISSING the required import statements\n`;
report += `${'='.repeat(100)}\n\n`;
report += `Required statements that should be present:\n`;
report += `1. import AdvJS2 from "../review/adv2";\n`;
report += `2. import AdvJS3 from "../review/adv3";\n`;
report += `3. <AdvJS2/>\n`;
report += `4. <AdvJS3/>\n\n`;

report += `Files MISSING these statements (${missingFiles.length} files):\n`;
report += `${'-'.repeat(50)}\n\n`;

if (missingFiles.length > 0) {
    missingFiles.forEach((file, index) => {
        report += `${index + 1}. ${file.filename}\n`;
        const missing = [];
        if (file.missing.advJS2Import) missing.push('AdvJS2 import');
        if (file.missing.advJS3Import) missing.push('AdvJS3 import');
        if (file.missing.advJS2Usage) missing.push('<AdvJS2/> usage');
        if (file.missing.advJS3Usage) missing.push('<AdvJS3/> usage');
        report += `   Missing: ${missing.join(', ')}\n`;
    });
} else {
    report += `None - All files have the required statements!\n`;
}

report += `\n\nFiles that HAVE all required statements (${completeFiles.length} files):\n`;
report += `${'-'.repeat(50)}\n\n`;

if (completeFiles.length > 0) {
    completeFiles.forEach((filename, index) => {
        report += `${index + 1}. ${filename}\n`;
    });
} else {
    report += `None\n`;
}

report += `\n\nSummary:\n`;
report += `${'-'.repeat(50)}\n`;
report += `Total files checked: ${targetFiles.length}\n`;
report += `Files missing statements: ${missingFiles.length}\n`;
report += `Files with statements: ${completeFiles.length}\n`;
report += `Missing rate: ${((missingFiles.length / targetFiles.length) * 100).toFixed(1)}%\n\n`;
report += `Generated: ${timestamp}\n`;

// Write report to file
fs.writeFileSync(outputFilename, report, 'utf8');

// Console output
console.log('Results:');
console.log('========');
console.log(`Total files checked: ${targetFiles.length}`);
console.log(`Files missing statements: ${missingFiles.length}`);
console.log(`Files with statements: ${completeFiles.length}`);
console.log(`\nReport saved to: ${outputFilename}`);

if (missingFiles.length > 0) {
    console.log('\nFiles missing statements:');
    missingFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.filename}`);
    });
}

// Made with Bob
