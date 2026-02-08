#!/usr/bin/env node

/**
 * Script to add a review to src/pages/latest/index.mdx
 * Usage: node add-review-to-latest.js <review-name>
 * Example: node add-review-to-latest.js addisonrae1
 */

const fs = require('fs');
const path = require('path');

// Maximum number of reviews to keep
const MAX_REVIEWS = 10;

// Get review name from command line argument
const reviewName = process.argv[2];

if (!reviewName) {
  console.error('Error: Please provide a review name');
  console.log('Usage: node add-review-to-latest.js <review-name>');
  console.log('Example: node add-review-to-latest.js addisonrae1');
  process.exit(1);
}

const latestIndexPath = path.join(__dirname, 'src', 'pages', 'latest', 'index.mdx');
const reviewPath = path.join(__dirname, 'src', 'pages', 'review', `${reviewName}.mdx`);
const reviewAPath = path.join(__dirname, 'src', 'pages', 'review', `${reviewName}A.mdx`);

// Check if review files exist
if (!fs.existsSync(reviewPath)) {
  console.error(`Error: Review file not found: ${reviewPath}`);
  process.exit(1);
}

if (!fs.existsSync(reviewAPath)) {
  console.error(`Error: Review A file not found: ${reviewAPath}`);
  process.exit(1);
}

// Read the current index file
let content = fs.readFileSync(latestIndexPath, 'utf8');

// Split content into lines
const lines = content.split('\n');

// Find the import section
let importEndIndex = -1;
let lastReviewNumber = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Find the last import Review line
  const match = line.match(/^import Review(\d+)\s+from/);
  if (match) {
    const num = parseInt(match[1]);
    if (num > lastReviewNumber) {
      lastReviewNumber = num;
    }
    importEndIndex = i;
  }
}

if (importEndIndex === -1) {
  console.error('Error: Could not find import section in index.mdx');
  process.exit(1);
}

// Shift all existing imports down by 1, skip Review11 and above
const newLines = [];
let inImportSection = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're in the import section
  if (line.match(/^import Review\d+/)) {
    inImportSection = true;
    
    // If this is the first Review import, insert the new review before it
    if (line.match(/^import Review1\s+from/)) {
      newLines.push(`import Review1    from "../review/${reviewName}.mdx";`);
      newLines.push(`import Review1A   from "../review/${reviewName}A.mdx";`);
    }
    
    // Shift the existing review number up by 1, but skip if it would become Review11 or higher
    const match = line.match(/^import Review(\d+)(A?)\s+from "(.+)";/);
    if (match) {
      const oldNum = parseInt(match[1]);
      const newNum = oldNum + 1;
      const suffix = match[2];
      const importPath = match[3];
      
      // Only add if the new number is 10 or less
      if (newNum <= MAX_REVIEWS) {
        // Preserve spacing
        const spaces = line.match(/Review\d+(A?)\s+/)[0].replace(/Review\d+A?/, '');
        newLines.push(`import Review${newNum}${suffix}${spaces}from "${importPath}";`);
      }
    }
  } else if (inImportSection && line.trim() === '') {
    // End of import section
    inImportSection = false;
    newLines.push(line);
  } else if (line.match(/<Row>/)) {
    // In the Row section, we need to shift Review numbers
    const nextLine = lines[i + 1];
    if (nextLine && nextLine.match(/<Review\d+/)) {
      // This is a Review Row, shift the numbers
      const reviewMatch = nextLine.match(/<Review(\d+)(\s*\/?>)/);
      if (reviewMatch) {
        const oldNum = parseInt(reviewMatch[1]);
        const newNum = oldNum + 1;
        
        // Skip this Row if it would become Review11 or higher
        if (newNum > MAX_REVIEWS) {
          // Skip the entire Row block
          while (i < lines.length - 1) {
            i++;
            if (lines[i].match(/<\/Row>/)) {
              break;
            }
          }
          continue;
        }
        
        // Add the row with shifted number
        newLines.push(line);
        i++;
        newLines.push(nextLine.replace(`<Review${oldNum}`, `<Review${newNum}`));
        
        // Process the rest of the Row
        while (i < lines.length - 1) {
          i++;
          const currentLine = lines[i];
          
          // Shift Review numbers in this line
          const shiftedLine = currentLine.replace(/<Review(\d+)(A?)(\s*\/?>)/g, (match, num, suffix, rest) => {
            return `<Review${parseInt(num) + 1}${suffix}${rest}`;
          });
          
          newLines.push(shiftedLine);
          
          // Check if this is the end of the Row
          if (currentLine.match(/<\/Row>/)) {
            break;
          }
        }
        continue;
      }
    }
    newLines.push(line);
  } else {
    newLines.push(line);
  }
}

// Now insert the new Review1 Row at the beginning of the Row section
const rowSectionStart = newLines.findIndex(line => line.match(/<Row>/));
if (rowSectionStart !== -1) {
  const newRow = [
    '<Row>',
    '  <Column colMd={2} colLg={3} noGutterMdLeft>',
    '    <Review1 />',
    '  </Column>',
    '  <Column colMd={5} colLg={8} noGutterMdLeft>',
    '    <Review1A />',
    '  </Column>',
    '</Row>'
  ];
  
  newLines.splice(rowSectionStart, 0, ...newRow);
}

// Write the updated content back to the file
const newContent = newLines.join('\n');
fs.writeFileSync(latestIndexPath, newContent, 'utf8');

console.log(`✓ Successfully added ${reviewName} to latest/index.mdx`);
console.log(`  - Added imports for Review1 and Review1A`);
console.log(`  - Shifted all existing reviews down by 1`);
console.log(`  - Added Row component for the new review`);
console.log(`  - Removed Review11 and Review11A (keeping max ${MAX_REVIEWS} reviews)`);

// Made with Bob
