const fs = require('fs');
const path = require('path');

/**
 * Add a review to a best50 MDX file
 * Usage: node add-review-to-best50.js <filePathOrYear> <reviewId> <artistName> <albumTitle>
 * Example: node add-review-to-best50.js 2025 addisonrae1 "Addison Rae" "Addison"
 * Example: node add-review-to-best50.js src/pages/best50/2025.mdx addisonrae1 "Addison Rae" "Addison"
 *
 * Position is automatically extracted from the review file (e.g., addisonrae1L.mdx)
 */

/**
 * Extract metadata from review L file
 */
function extractMetadataFromReview(reviewId) {
  const reviewLPath = path.join(__dirname, 'src', 'pages', 'review', `${reviewId}L.mdx`);
  
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
    filePath = `src/pages/best50/${filePathOrYear}.mdx`;
  }
  
  const fullPath = path.join(__dirname, filePath);
  
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
  console.log(`✓ Added imports: Review${importNumber} and Review${importNumber}A`);
  console.log(`✓ Added Row section for No.${position}`);
  if (tableUpdated) {
    const alreadyLinked = lines.some(line => tableEntryLinkPattern.test(line));
    if (alreadyLinked) {
      console.log(`✓ Table entry already linked (no update needed)`);
    } else {
      console.log(`✓ Updated table entry with link to /review/${reviewId}L/`);
    }
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
