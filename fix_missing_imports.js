/**
 * Fix missing AdvJS imports in MDX files
 * Adds imports after SliderJS4 line
 */

const fs = require('fs');
const path = require('path');

const files = [
    'bigkrit3L.mdx',
    'blackmilk1L.mdx',
    'blackpantherL.mdx',
    'bloodorange2L.mdx',
    'bloodorange3L.mdx',
    'bloodorange4L.mdx',
    'bloodorange5L.mdx',
    'brandoncoleman1L.mdx',
    'brandy5L.mdx',
    'brysontiller1L.mdx',
    'bustarhymes6L.mdx'
];

const reviewDir = path.join(__dirname, 'src', 'pages', 'review');

files.forEach(filename => {
    const filePath = path.join(reviewDir, filename);
    
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filename}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        
        // Check if this line contains SliderJS4 import
        if (lines[i].includes('import SliderJS4 from')) {
            // Check if next lines already have AdvJS imports
            const nextFewLines = lines.slice(i + 1, i + 4).join('\n');
            if (!nextFewLines.includes('import AdvJS2') && !nextFewLines.includes('import AdvJS3')) {
                // Add the imports
                newLines.push('import AdvJS2 from "../review/adv2";');
                newLines.push('import AdvJS3 from "../review/adv3";');
            }
        }
    }
    
    const newContent = newLines.join('\n');
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✓ Fixed imports in: ${filename}`);
    } else {
        console.log(`- Already fixed: ${filename}`);
    }
});

console.log('\nDone!');

// Made with Bob
