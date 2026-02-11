/**
 * Add missing AdvJS import statements to MDX files
 * 
 * Usage: node add_missing_advjs_statements.js <file1.mdx> <file2.mdx> ...
 * 
 * This script adds the required import statements to files that are missing them:
 * - import AdvJS2 from "../review/adv2";
 * - import AdvJS3 from "../review/adv3";
 * - <AdvJS2/> (after the last Button)
 * - <AdvJS3/> (at the end of the file)
 */

const fs = require('fs');
const path = require('path');

// Get file list from command line arguments
const files = process.argv.slice(2);

if (files.length === 0) {
    console.error('Error: Please provide at least one file to process');
    console.error('Usage: node add_missing_advjs_statements.js <file1.mdx> <file2.mdx> ...');
    process.exit(1);
}

const reviewDir = path.join(__dirname, 'src', 'pages', 'review');

let successCount = 0;
let errorCount = 0;
const errors = [];

files.forEach(filename => {
    const filePath = path.join(reviewDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filename}`);
        errorCount++;
        errors.push({ file: filename, error: 'File not found' });
        return;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Check if imports already exist
        const hasAdvJS2Import = content.includes('import AdvJS2 from "../review/adv2"') || 
                               content.includes('import AdvJS2 from "./adv2"');
        const hasAdvJS3Import = content.includes('import AdvJS3 from "../review/adv3"') || 
                               content.includes('import AdvJS3 from "./adv3"');
        
        // Add imports after SliderJS4 import if missing
        if (!hasAdvJS2Import || !hasAdvJS3Import) {
            const sliderJS4Pattern = /import SliderJS4 from ["']\.\.\/review\/slider4["'];?\n/;
            const sliderJS4AltPattern = /import SliderJS4 from ["']\.\/slider4["'];?\n/;
            
            let importsToAdd = '';
            if (!hasAdvJS2Import) {
                importsToAdd += 'import AdvJS2 from "../review/adv2";\n';
            }
            if (!hasAdvJS3Import) {
                importsToAdd += 'import AdvJS3 from "../review/adv3";\n';
            }
            
            if (sliderJS4Pattern.test(content)) {
                content = content.replace(sliderJS4Pattern, (match) => match + importsToAdd);
                modified = true;
            } else if (sliderJS4AltPattern.test(content)) {
                content = content.replace(sliderJS4AltPattern, (match) => match + importsToAdd);
                modified = true;
            } else {
                console.warn(`Warning: Could not find SliderJS4 import in ${filename}`);
            }
        }
        
        // Check if <AdvJS2/> and <AdvJS3/> usage exist
        const hasAdvJS2Usage = content.includes('<AdvJS2/>') || content.includes('<AdvJS2 />');
        const hasAdvJS3Usage = content.includes('<AdvJS3/>') || content.includes('<AdvJS3 />');
        
        // Add <AdvJS2/> after the last Button if missing
        if (!hasAdvJS2Usage) {
            // Find the last </Button> followed by optional whitespace and </div>
            const buttonPattern = /(<Button[^>]*>[\s\S]*?<\/Button>\s*)\n(\s*)<\/div>/g;
            let lastMatch = null;
            let match;
            
            while ((match = buttonPattern.exec(content)) !== null) {
                lastMatch = match;
            }
            
            if (lastMatch) {
                const replacement = lastMatch[1] + '\n' + lastMatch[2] + '<AdvJS2/>\n' + lastMatch[2] + '</div>';
                content = content.substring(0, lastMatch.index) + replacement + content.substring(lastMatch.index + lastMatch[0].length);
                modified = true;
            } else {
                console.warn(`Warning: Could not find Button pattern in ${filename}`);
            }
        }
        
        // Add <AdvJS3/> at the end if missing
        if (!hasAdvJS3Usage) {
            // Check if file ends with newline
            if (!content.endsWith('\n')) {
                content += '\n';
            }
            content += '\n<AdvJS3 />\n';
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${filename}`);
            successCount++;
        } else {
            console.log(`- Skipped: ${filename} (already has all statements)`);
        }
        
    } catch (error) {
        console.error(`Error processing ${filename}: ${error.message}`);
        errorCount++;
        errors.push({ file: filename, error: error.message });
    }
});

console.log('\n' + '='.repeat(50));
console.log('Summary:');
console.log(`Successfully updated: ${successCount} files`);
console.log(`Errors: ${errorCount} files`);

if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
    });
}

// Made with Bob
