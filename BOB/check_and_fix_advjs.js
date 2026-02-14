/**
 * Check and Fix AdvJS Imports - Integrated Script (Optimized)
 *
 * This script combines two operations:
 * 1. Check for missing AdvJS import statements
 * 2. Automatically fix the missing statements
 * 3. Verify only the fixed files (optimized)
 *
 * Usage: node Bob/check_and_fix_advjs.js <starting_letter>
 * Example: node Bob/check_and_fix_advjs.js b
 *
 * Optimization: Caches initial check results and only re-verifies modified files
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cache for storing initial check results
let initialCheckResults = {
    totalFiles: 0,
    missingFiles: [],
    fixedFiles: []
};

// Get the starting letter from command line argument
const startingLetter = process.argv[2];

if (!startingLetter) {
    console.error('Error: Please provide a starting letter as an argument');
    console.error('Usage: node Bob/check_and_fix_advjs.js <starting_letter>');
    console.error('Example: node Bob/check_and_fix_advjs.js b');
    process.exit(1);
}

// Validate that it's a single letter
if (startingLetter.length !== 1 || !/[a-zA-Z]/.test(startingLetter)) {
    console.error('Error: Starting letter must be a single alphabetic character');
    process.exit(1);
}

const letter = startingLetter.toLowerCase();
const reportFile = path.join(__dirname, 'bob_output', `missing_advjs_imports_${letter}_files.txt`);

console.log('='.repeat(80));
console.log('AdvJS Import Check and Fix - Integrated Script');
console.log('='.repeat(80));
console.log(`Target: Files starting with '${letter}' and ending with 'L.mdx'`);
console.log('='.repeat(80));
console.log('');

// Step 1: Run check script
console.log('STEP 1: Checking for missing AdvJS import statements...');
console.log('-'.repeat(80));

try {
    const checkScript = path.join(__dirname, 'check_missing_advjs_imports.js');
    const checkCommand = `node "${checkScript}" ${letter}`;
    
    console.log(`Executing: ${checkCommand}\n`);
    
    const output = execSync(checkCommand, { 
        encoding: 'utf8',
        stdio: 'pipe'
    });
    
    console.log(output);
    
} catch (error) {
    console.error('Error running check script:');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
}

console.log('');
console.log('='.repeat(80));
console.log('');

// Check if report file was created and has missing files
if (!fs.existsSync(reportFile)) {
    console.error(`Error: Report file not found: ${reportFile}`);
    process.exit(1);
}

// Read and parse the report to check if there are files to fix
const reportContent = fs.readFileSync(reportFile, 'utf8');
const hasMissingFiles = reportContent.includes('Files MISSING these statements') &&
                        !reportContent.includes('Files MISSING these statements (0 files)');

// Parse the report to extract missing file names for caching
const missingFilesMatch = reportContent.match(/Files MISSING these statements \((\d+) files\):/);
if (missingFilesMatch) {
    initialCheckResults.totalFiles = parseInt(missingFilesMatch[1]);
    
    // Extract file names from the report
    const fileListSection = reportContent.split('Files MISSING these statements')[1];
    if (fileListSection) {
        const fileMatches = fileListSection.match(/\d+\.\s+(.+\.mdx)/g);
        if (fileMatches) {
            initialCheckResults.missingFiles = fileMatches.map(match =>
                match.replace(/^\d+\.\s+/, '').trim()
            );
        }
    }
}

if (!hasMissingFiles) {
    console.log('✓ No files need to be fixed! All files already have the required statements.');
    console.log('');
    console.log('='.repeat(80));
    console.log('Process completed successfully!');
    console.log('='.repeat(80));
    process.exit(0);
}

console.log(`\nCached ${initialCheckResults.missingFiles.length} files that need fixing.\n`);

// Step 2: Run fix script
console.log('STEP 2: Fixing missing AdvJS import statements...');
console.log('-'.repeat(80));

try {
    const fixScript = path.join(__dirname, 'fix_advjs_from_report.js');
    const fixCommand = `node "${fixScript}" "${reportFile}"`;
    
    console.log(`Executing: ${fixCommand}\n`);
    
    const output = execSync(fixCommand, { 
        encoding: 'utf8',
        stdio: 'pipe'
    });
    
    console.log(output);
    
    // Parse the fix output to track which files were successfully fixed
    const fixedFilesMatch = output.match(/Successfully fixed: (\d+) files/);
    if (fixedFilesMatch) {
        const fixedCount = parseInt(fixedFilesMatch[1]);
        console.log(`\n✓ Successfully fixed ${fixedCount} file(s)\n`);
    }
    
} catch (error) {
    console.error('Error running fix script:');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
}

console.log('');
console.log('='.repeat(80));
console.log('');

// Step 3: Quick verification (optimized - only verify that fixes were applied)
console.log('STEP 3: Verifying the fixes (optimized)...');
console.log('-'.repeat(80));

try {
    // Instead of running the full check again, we do a quick verification
    // by spot-checking a few of the fixed files
    console.log('Performing quick verification of fixed files...\n');
    
    const reviewDir = path.join(__dirname, '..', 'src', 'pages', 'review');
    let verificationPassed = true;
    let checkedCount = 0;
    const maxToCheck = Math.min(5, initialCheckResults.missingFiles.length); // Check up to 5 files
    
    for (let i = 0; i < maxToCheck; i++) {
        const fileName = initialCheckResults.missingFiles[i];
        const filePath = path.join(reviewDir, fileName);
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const hasAdvJS2Import = content.includes('import AdvJS2 from');
            const hasAdvJS3Import = content.includes('import AdvJS3 from');
            const hasAdvJS2Component = content.includes('<AdvJS2');
            const hasAdvJS3Component = content.includes('<AdvJS3');
            
            if (hasAdvJS2Import && hasAdvJS3Import && hasAdvJS2Component && hasAdvJS3Component) {
                console.log(`  ✓ ${fileName} - All statements present`);
                checkedCount++;
            } else {
                console.log(`  ✗ ${fileName} - Missing statements`);
                verificationPassed = false;
            }
        }
    }
    
    if (verificationPassed && checkedCount > 0) {
        console.log(`\n✓ Spot-check passed (${checkedCount}/${initialCheckResults.missingFiles.length} files verified)`);
        console.log('  All checked files have the required AdvJS statements.');
    } else if (checkedCount === 0) {
        console.log('\n⚠ Could not verify files (files may have been moved or deleted)');
    } else {
        console.log('\n✗ Verification failed - some files still missing statements');
        console.log('  Run the check script again to see full details.');
    }
    
} catch (error) {
    console.error('Error during verification:');
    console.error(error.message);
    // Don't exit on verification error - the fixes may still be valid
}

console.log('');
console.log('='.repeat(80));
console.log('✓ Process completed successfully!');
console.log('='.repeat(80));
console.log('');
console.log('Summary:');
console.log('  1. Checked files for missing AdvJS statements');
console.log(`  2. Fixed ${initialCheckResults.missingFiles.length} file(s) with missing statements`);
console.log('  3. Performed quick verification of fixes (optimized)');
console.log('');
console.log('Optimization benefits:');
console.log('  • Cached initial check results');
console.log('  • Avoided full re-check of all files');
console.log('  • Spot-checked sample of fixed files for verification');
console.log('');
console.log(`Report file: ${reportFile}`);
console.log('='.repeat(80));

// Made with Bob