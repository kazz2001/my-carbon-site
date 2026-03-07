#!/usr/bin/env node

/**
 * Script to add a review to src/pages/cd/YYYY.mdx (Year review page)
 * Usage: node add-review-to-cd-year.js <review-name> <year>
 * Example: node add-review-to-cd-year.js addisonrae1 2025
 */

const fs = require('fs');
const path = require('path');

// Get review name and year from command line arguments
const reviewName = process.argv[2];
const year = process.argv[3];

if (!reviewName || !year) {
  console.error('Error: Please provide both review name and year');
  console.log('Usage: node add-review-to-cd-year.js <review-name> <year>');
  console.log('Example: node add-review-to-cd-year.js addisonrae1 2025');
  process.exit(1);
}

// Validate year format (4 digits)
if (!/^\d{4}$/.test(year)) {
  console.error(`Error: Year must be a 4-digit number (e.g., 2025), got: ${year}`);
  process.exit(1);
}

// Validate review name format (no special characters that could break file paths)
if (!/^[a-zA-Z0-9_-]+$/.test(reviewName)) {
  console.error(`Error: Review name can only contain letters, numbers, hyphens, and underscores, got: ${reviewName}`);
  process.exit(1);
}

// Fix path resolution - go up one directory from Bob/ to project root
const projectRoot = path.join(__dirname, '..');
const cdYearPath = path.join(projectRoot, 'src', 'pages', 'cd', `${year}.mdx`);
const reviewPath = path.join(projectRoot, 'src', 'pages', 'review', `${reviewName}.mdx`);
const reviewAPath = path.join(projectRoot, 'src', 'pages', 'review', `${reviewName}A.mdx`);

// Check if year file exists
if (!fs.existsSync(cdYearPath)) {
  console.error(`Error: Year file not found: ${cdYearPath}`);
  process.exit(1);
}

// Check if review files exist
if (!fs.existsSync(reviewPath)) {
  console.error(`Error: Review file not found: ${reviewPath}`);
  process.exit(1);
}

if (!fs.existsSync(reviewAPath)) {
  console.error(`Error: Review A file not found: ${reviewAPath}`);
  process.exit(1);
}

// Read the current year file
let content;
try {
  content = fs.readFileSync(cdYearPath, 'utf8');
} catch (error) {
  console.error(`Error: Failed to read year file: ${error.message}`);
  process.exit(1);
}

// Split content into lines
const lines = content.split('\n');

// Find the highest Review number
let highestReviewNumber = 0;
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^import Review(\d+)\s+from/);
  if (match) {
    const num = parseInt(match[1]);
    if (num > highestReviewNumber) {
      highestReviewNumber = num;
    }
  }
}

const newReviewNumber = highestReviewNumber + 1;

// Step 1: Add the new import at the top of Review imports
const newLines = [];
let firstReviewImportFound = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're at the first Review import
  if (!firstReviewImportFound && line.match(/^import Review\d+\s+from/)) {
    firstReviewImportFound = true;
    // Insert the new review import at the top with consistent formatting (2 spaces after ReviewN)
    newLines.push(`import Review${newReviewNumber}  from "../review/${reviewName}.mdx";`);
  }
  
  // Add the current line
  newLines.push(line);
}

// Verify that we found at least one Review import
if (!firstReviewImportFound) {
  console.error('Error: No existing Review imports found in the year file');
  console.error('The file may be corrupted or in an unexpected format');
  process.exit(1);
}

// Step 2 & 3: Collect all Column blocks from all Rows after PageDescription,
// prepend the new review Column, then redistribute into Rows of 4 columns each.
const COLUMNS_PER_ROW = 4;

// Find the index where PageDescription ends and content Rows begin
let pageDescEndIndex = -1;
for (let i = 0; i < newLines.length; i++) {
  if (newLines[i].includes('</PageDescription>')) {
    pageDescEndIndex = i;
    break;
  }
}

if (pageDescEndIndex === -1) {
  console.error('Error: Could not find </PageDescription> in the year file');
  process.exit(1);
}

// Collect all Column blocks from content Rows (after PageDescription)
// A Column block is the lines from <Column ...> to </Column>
const allColumnBlocks = [];
let firstContentRowIndex = -1;
let lastContentRowEndIndex = -1;

for (let i = pageDescEndIndex + 1; i < newLines.length; i++) {
  if (newLines[i].match(/<Row>/)) {
    if (firstContentRowIndex === -1) firstContentRowIndex = i;
    // Collect columns in this Row
    let j = i + 1;
    while (j < newLines.length && !newLines[j].match(/<\/Row>/)) {
      if (newLines[j].match(/<Column/)) {
        const colBlock = [newLines[j]];
        j++;
        while (j < newLines.length && !newLines[j].match(/<\/Column>/)) {
          colBlock.push(newLines[j]);
          j++;
        }
        colBlock.push(newLines[j]); // </Column>
        allColumnBlocks.push(colBlock);
      }
      j++;
    }
    lastContentRowEndIndex = j;
    i = j;
  }
}

if (firstContentRowIndex === -1) {
  console.error('Error: Could not find any content Rows after PageDescription');
  process.exit(1);
}

// Prepend the new review Column
const newColumn = [
  '  <Column colMd={2} colLg={3} noGutterMdLeft>',
  `    <Review${newReviewNumber} />`,
  '  </Column>'
];
allColumnBlocks.unshift(newColumn);

// Rebuild lines: everything before first content Row, then new Rows, then nothing after last Row end
const finalLines = newLines.slice(0, firstContentRowIndex);

// Redistribute columns into Rows of COLUMNS_PER_ROW
for (let i = 0; i < allColumnBlocks.length; i += COLUMNS_PER_ROW) {
  const rowCols = allColumnBlocks.slice(i, i + COLUMNS_PER_ROW);
  if (i > 0) finalLines.push('');
  finalLines.push('<Row>');
  for (const col of rowCols) {
    for (const l of col) finalLines.push(l);
  }
  finalLines.push('</Row>');
}

// Write the updated content back to the file
const newContent = finalLines.join('\n');
try {
  fs.writeFileSync(cdYearPath, newContent, 'utf8');
} catch (error) {
  console.error(`Error: Failed to write to year file: ${error.message}`);
  process.exit(1);
}

const totalRows = Math.ceil(allColumnBlocks.length / COLUMNS_PER_ROW);
const lastRowCols = allColumnBlocks.length % COLUMNS_PER_ROW || COLUMNS_PER_ROW;

console.log(`✓ Successfully added ${reviewName} to cd/${year}.mdx`);
console.log(`  - Added import for Review${newReviewNumber}`);
console.log(`  - Added Review${newReviewNumber} as first Column in the first Row`);
console.log(`  - Redistributed all ${allColumnBlocks.length} reviews into ${totalRows} Rows of ${COLUMNS_PER_ROW}`);
console.log(`  - Last Row has ${lastRowCols} column(s)`);
console.log(`  - Total reviews: ${newReviewNumber}`);

// Made with Bob
