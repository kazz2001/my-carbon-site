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

const cdYearPath = path.join(__dirname, 'src', 'pages', 'cd', `${year}.mdx`);
const reviewPath = path.join(__dirname, 'src', 'pages', 'review', `${reviewName}.mdx`);
const reviewAPath = path.join(__dirname, 'src', 'pages', 'review', `${reviewName}A.mdx`);

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
let content = fs.readFileSync(cdYearPath, 'utf8');

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

// Step 1: Add the new import at the top
const newLines = [];
let firstReviewImportFound = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're at the first Review import
  if (!firstReviewImportFound && line.match(/^import Review\d+\s+from/)) {
    firstReviewImportFound = true;
    // Insert the new review import at the top
    newLines.push(`import Review${newReviewNumber}  from "../review/${reviewName}.mdx";`);
  }
  
  // Add the current line
  newLines.push(line);
}

// Step 2: Shift all Review numbers in Rows by 1
const shiftedLines = [];
let inRow = false;

for (let i = 0; i < newLines.length; i++) {
  const line = newLines[i];
  
  if (line.match(/<Row>/)) {
    inRow = true;
    shiftedLines.push(line);
    continue;
  }
  
  if (line.match(/<\/Row>/)) {
    inRow = false;
    shiftedLines.push(line);
    continue;
  }
  
  if (inRow && line.match(/<Review\d+/)) {
    // Shift the Review number by 1
    const shiftedLine = line.replace(/<Review(\d+)(\s*\/?>)/g, (match, num, rest) => {
      const oldNum = parseInt(num);
      const newNum = oldNum + 1;
      return `<Review${newNum}${rest}`;
    });
    shiftedLines.push(shiftedLine);
  } else {
    shiftedLines.push(line);
  }
}

// Step 3: Add the new review to the first Row
const finalLines = [];
let firstRowFound = false;
let firstRowStartIndex = -1;

for (let i = 0; i < shiftedLines.length; i++) {
  const line = shiftedLines[i];
  
  // Find the first Row after PageDescription
  if (!firstRowFound && line.match(/<Row>/) && i > 0) {
    // Check if we're past the PageDescription
    let pastDescription = false;
    for (let j = 0; j < i; j++) {
      if (shiftedLines[j].includes('</PageDescription>')) {
        pastDescription = true;
        break;
      }
    }
    
    if (pastDescription) {
      firstRowFound = true;
      firstRowStartIndex = i;
      finalLines.push(line);
      
      // Add the new review as the first column in this row
      finalLines.push('  <Column colMd={2} colLg={3} noGutterMdLeft>');
      finalLines.push(`    <Review${newReviewNumber}/>`);
      finalLines.push('  </Column>');
      continue;
    }
  }
  
  finalLines.push(line);
}

// Step 4: Add a new Row at the end for Review1
finalLines.push('');
finalLines.push('<Row>');
finalLines.push('  <Column colMd={2} colLg={3} noGutterMdLeft>');
finalLines.push('    <Review1 />');
finalLines.push('  </Column>');
finalLines.push('</Row>');

// Write the updated content back to the file
const newContent = finalLines.join('\n');
fs.writeFileSync(cdYearPath, newContent, 'utf8');

console.log(`✓ Successfully added ${reviewName} to cd/${year}.mdx`);
console.log(`  - Added import for Review${newReviewNumber}`);
console.log(`  - Shifted all existing reviews down by 1`);
console.log(`  - Added Review${newReviewNumber} to the first Row`);
console.log(`  - Added new Row at the end for Review1`);
console.log(`  - Total reviews: ${newReviewNumber}`);

// Made with Bob
