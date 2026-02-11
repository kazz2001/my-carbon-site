/**
 * Check and Fix AdvJS Imports - Integrated Script
 * 
 * This script combines two operations:
 * 1. Check for missing AdvJS import statements
 * 2. Automatically fix the missing statements
 * 
 * Usage: node Bob/check_and_fix_advjs.js <starting_letter>
 * Example: node Bob/check_and_fix_advjs.js b
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// Read the report to check if there are files to fix
const reportContent = fs.readFileSync(reportFile, 'utf8');
const hasMissingFiles = reportContent.includes('Files MISSING these statements') && 
                        !reportContent.includes('Files MISSING these statements (0 files)');

if (!hasMissingFiles) {
    console.log('✓ No files need to be fixed! All files already have the required statements.');
    console.log('');
    console.log('='.repeat(80));
    console.log('Process completed successfully!');
    console.log('='.repeat(80));
    process.exit(0);
}

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

// Step 3: Verify the fixes
console.log('STEP 3: Verifying the fixes...');
console.log('-'.repeat(80));

try {
    const checkScript = path.join(__dirname, 'check_missing_advjs_imports.js');
    const verifyCommand = `node "${checkScript}" ${letter}`;
    
    console.log(`Executing: ${verifyCommand}\n`);
    
    const output = execSync(verifyCommand, { 
        encoding: 'utf8',
        stdio: 'pipe'
    });
    
    console.log(output);
    
} catch (error) {
    console.error('Error running verification:');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
}

console.log('');
console.log('='.repeat(80));
console.log('✓ Process completed successfully!');
console.log('='.repeat(80));
console.log('');
console.log('Summary:');
console.log('  1. Checked files for missing AdvJS statements');
console.log('  2. Fixed all missing statements');
console.log('  3. Verified that all files now have the required statements');
console.log('');
console.log(`Report file: ${reportFile}`);
console.log('='.repeat(80));

// Made with Bob