const fs = require('fs');
const path = require('path');

/**
 * Add a review to a best50 MDX file
 * Reads from C:\Users\user\Documents\gatsby_v5\src\pages\review folder
 * Usage: node add-review-to-best50.js <filePathOrYear> <reviewId>
 * Example: node add-review-to-best50.js 2025 addisonrae1
 * Example: node add-review-to-best50.js src/pages/best50/2025.mdx addisonrae1
 *
 * Position, artist name, and album title are automatically extracted from the review L file (e.g., addisonrae1L.mdx)
 */

// Define the review folder path
const reviewFolderPath = path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5', 'src', 'pages', 'review');

/**
 * Extract metadata from review L file
 */
function extractMetadataFromReview(reviewId) {
  const reviewLPath = path.join(reviewFolderPath, `${reviewId}L.mdx`);
  
  if (!fs.existsSync(reviewLPath)) {
    throw new Error(`Review L file not found: ${reviewLPath}`);
  }
  
  const content = fs.readFileSync(reviewLPath, 'utf8');
  
  // Extract position from "Best No.8" pattern
  const positionMatch = content.match(/Best No\.(\d+)/i);
  if (!positionMatch) {
    throw new Error(`Could not find position number in ${reviewLPath}. Expected format: "Best No.X"`);
  }
  const position = parseInt(positionMatch[1]);
  
  // Extract title from frontmatter: title: "Artist Name / Album Title"
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (!titleMatch) {
    throw new Error(`Could not find title in ${reviewLPath}. Expected format: title: "Artist / Album"`);
  }
  
  // Split by " / " to get artist and album
  const titleParts = titleMatch[1].split(' / ');
  if (titleParts.length !== 2) {
    throw new Error(`Title format incorrect in ${reviewLPath}. Expected format: "Artist / Album", got: "${titleMatch[1]}"`);
  }
  
  const artistName = titleParts[0].trim();
  const albumTitle = titleParts[1].trim();
  
  return { position, artistName, albumTitle };
}

function addReviewToBest50(filePathOrYear, reviewId) {
  // Extract metadata from review L file
  const { position, artistName, albumTitle } = extractMetadataFromReview(reviewId);
  console.log(`✓ Extracted from ${reviewId}L.mdx:`);
  console.log(`  - Position: ${position}`);
  console.log(`  - Artist: ${artistName}`);
  console.log(`  - Album: ${albumTitle}`);
  // If input is just a year (4 digits), convert to full path
  let filePath = filePathOrYear;
  if (/^\d{4}$/.test(filePathOrYear)) {
    filePath = path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5', 'src', 'pages', 'best50', `${filePathOrYear}.mdx`);
  } else {
    // If it's a relative path, make it absolute
    filePath = path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5', filePath);
  }
  
  const fullPath = filePath;
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  
  // Read the file
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const lines = content.split('\n');
  
  // Only add imports and Row sections for positions 1-10
  if (position <= 10) {
    // Find the last import statement line
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import Review')) {
        lastImportIndex = i;
      }
    }
    
    // Add import statements after the last import
    const importNumber = position;
    const newImports = [
      `import Review${importNumber}  from "../review/${reviewId}.mdx";`,
      `import Review${importNumber}A from "../review/${reviewId}A.mdx";`
    ];
    
    // Insert imports
    lines.splice(lastImportIndex + 1, 0, ...newImports);
    
    // Find the last Row section
    let lastRowEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '</Row>' && i < lines.length - 50) { // Not in the table area
        lastRowEndIndex = i;
      }
    }
    
    // Create new Row section
    const newRow = [
      '',
      '<Row>',
      '  <Column colMd={2} colLg={3} noGutterMdLeft>',
      `    <h2 class="p600J">No.${position}</h2>`,
      `    <Review${importNumber} />`,
      '  </Column>',
      '  <Column colMd={5} colLg={8} noGutterMdLeft>',
      `    <h2>${artistName} - ${albumTitle}</h2>`,
      `    <Review${importNumber}A />`,
      '  </Column>',
      '</Row>'
    ];
    
    // Insert Row section
    lines.splice(lastRowEndIndex + 1, 0, ...newRow);
  }
  
  // Escape special regex characters in artist name and album title
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedArtist = escapeRegex(artistName);
  const escapedAlbum = escapeRegex(albumTitle);
  
  // Find and update the table entry (only if not already a link)
  const tableEntryPattern = new RegExp(`^\\| ${position}\\s+\\| ${escapedArtist} - ${escapedAlbum}\\s*\\|`);
  const tableEntryLinkPattern = new RegExp(`^\\| ${position}\\s+\\| \\[${escapedArtist} - ${escapedAlbum}\\]`);
  let tableUpdated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (tableEntryLinkPattern.test(lines[i])) {
      console.log(`✓ Table entry already has a link, skipping update`);
      tableUpdated = true;
      break;
    }
    if (tableEntryPattern.test(lines[i])) {
      lines[i] = `| ${position}   | [${artistName} - ${albumTitle}](/review/${reviewId}L/)${' '.repeat(Math.max(0, 90 - artistName.length - albumTitle.length - reviewId.length))}|`;
      tableUpdated = true;
      break;
    }
  }
  
  // Write back to file
  const newContent = lines.join('\n');
  fs.writeFileSync(fullPath, newContent, 'utf8');
  
  console.log(`✓ Successfully added ${artistName} - ${albumTitle} (${reviewId}) at position ${position}`);
  console.log(`✓ File: ${filePath}`);
  
  if (position <= 10) {
    console.log(`✓ Added imports: Review${position} and Review${position}A`);
    console.log(`✓ Added Row section for No.${position}`);
  } else {
    console.log(`✓ Position ${position} is 11 or below - only table entry updated`);
  }
  
  if (tableUpdated) {
    const alreadyLinked = lines.some(line => tableEntryLinkPattern.test(line));
    if (alreadyLinked) {
      console.log(`✓ Table entry already linked (no update needed)`);
    } else {
      console.log(`✓ Updated table entry with link to /review/${reviewId}L/`);
    }
  }
  
  // Format the file using Prettier
  console.log(`\n⏳ Formatting file with Prettier...`);
  try {
    const { execSync } = require('child_process');
    execSync(`npx prettier --write "${fullPath}"`, {
      stdio: 'inherit',
      cwd: path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5')
    });
    console.log(`✓ File formatted successfully`);
  } catch (error) {
    console.log(`⚠ Warning: Could not format file with Prettier: ${error.message}`);
    console.log(`  The file was still updated successfully, but may need manual formatting.`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node add-review-to-best50.js <filePathOrYear> <reviewId>');
  console.error('Example (with year): node add-review-to-best50.js 2025 addisonrae1');
  console.error('Example (with path): node add-review-to-best50.js src/pages/best50/2025.mdx addisonrae1');
  console.error('');
  console.error('Note: Position, artist name, and album title are automatically extracted from the review L file (e.g., addisonrae1L.mdx)');
  console.error(`Review folder: ${reviewFolderPath}`);
  console.error('');
  console.error('Available reviews in the review folder:');
  
  // List available reviews from the review folder
  try {
    const files = fs.readdirSync(reviewFolderPath);
    const reviewLFiles = files.filter(f => f.endsWith('L.mdx')).sort();
    
    if (reviewLFiles.length > 0) {
      reviewLFiles.forEach(f => {
        const reviewId = f.replace('L.mdx', '');
        console.error(`  - ${reviewId}`);
      });
    } else {
      console.error('  (No review L files found)');
    }
  } catch (err) {
    console.error(`Error reading review folder: ${err.message}`);
  }
  
  process.exit(1);
}

const [filePathOrYear, reviewId] = args;

try {
  addReviewToBest50(filePathOrYear, reviewId);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

// Made with Bob
