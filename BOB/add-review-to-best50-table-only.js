const fs = require('fs');
const path = require('path');

/**
 * Add a review link to the best50 table only (for positions 11+)
 * Usage: node add-review-to-best50-table-only.js <reviewId> [year]
 * Example: node add-review-to-best50-table-only.js oliviadean1
 * Example: node add-review-to-best50-table-only.js oliviadean1 2025
 * 
 * This script:
 * 1. Reads the review L file (e.g., oliviadean1L.mdx) to extract position, artist, and album
 * 2. Updates ONLY the table entry with a link (does not add imports or Row sections)
 * 3. Defaults to 2025.mdx if no year is specified
 */

// Define paths
const reviewFolderPath = path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5', 'src', 'pages', 'review');
const best50FolderPath = path.join('C:', 'Users', 'user', 'Documents', 'gatsby_v5', 'src', 'pages', 'best50');

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

/**
 * Add review link to table only
 */
function addReviewToTableOnly(reviewId, year = '2025') {
  // Extract metadata from review L file
  const { position, artistName, albumTitle } = extractMetadataFromReview(reviewId);
  console.log(`✓ Extracted from ${reviewId}L.mdx:`);
  console.log(`  - Position: ${position}`);
  console.log(`  - Artist: ${artistName}`);
  console.log(`  - Album: ${albumTitle}`);
  
  // Construct file path
  const filePath = path.join(best50FolderPath, `${year}.mdx`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const lines = content.split('\n');
  
  // Escape special regex characters in artist name and album title
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedArtist = escapeRegex(artistName);
  const escapedAlbum = escapeRegex(albumTitle);
  
  // Find and update the table entry
  const tableEntryPattern = new RegExp(`^\\|\\s*${position}\\s*\\|\\s*${escapedArtist}\\s*-\\s*${escapedAlbum}\\s*\\|`);
  const tableEntryLinkPattern = new RegExp(`^\\|\\s*${position}\\s*\\|\\s*\\[${escapedArtist}\\s*-\\s*${escapedAlbum}\\]`);
  let tableUpdated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (tableEntryLinkPattern.test(lines[i])) {
      console.log(`✓ Table entry already has a link, skipping update`);
      tableUpdated = true;
      break;
    }
    if (tableEntryPattern.test(lines[i])) {
      // Calculate spacing for alignment (target ~90 chars before final |)
      const linkText = `[${artistName} - ${albumTitle}](/review/${reviewId}L/)`;
      const spacing = ' '.repeat(Math.max(1, 90 - linkText.length));
      lines[i] = `| ${position}  | ${linkText}${spacing}|`;
      tableUpdated = true;
      console.log(`✓ Updated table entry with link to /review/${reviewId}L/`);
      break;
    }
  }
  
  if (!tableUpdated) {
    throw new Error(`Could not find table entry for position ${position} with "${artistName} - ${albumTitle}"`);
  }
  
  // Write back to file
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✓ Successfully updated ${year}.mdx`);
  console.log(`✓ Added link for ${artistName} - ${albumTitle} (${reviewId}) at position ${position}`);
  
  // Format the file using Prettier
  console.log(`\n⏳ Formatting file with Prettier...`);
  try {
    const { execSync } = require('child_process');
    execSync(`npx prettier --write "${filePath}"`, {
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

if (args.length < 1) {
  console.error('Usage: node add-review-to-best50-table-only.js <reviewId> [year]');
  console.error('Example: node add-review-to-best50-table-only.js oliviadean1');
  console.error('Example: node add-review-to-best50-table-only.js oliviadean1 2025');
  console.error('');
  console.error('Note: This script only updates the table entry (does not add imports or Row sections)');
  console.error('      Position, artist name, and album title are automatically extracted from the review L file');
  console.error(`      Review folder: ${reviewFolderPath}`);
  console.error('      Default year: 2025');
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

const [reviewId, year] = args;

try {
  addReviewToTableOnly(reviewId, year);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

// Made with Bob