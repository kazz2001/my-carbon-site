# Ask Mode Documentation Rules (Non-Obvious Only)

## Project Organization Context
- BOB/ contains Node.js scripts for review generation and management
- src/pages/review/ contains 3-file review sets (base, A, L variants)
- Each review requires exactly 3 files with specific naming: `{id}.mdx`, `{id}A.mdx`, `{id}L.mdx`

## Review File Purposes (Counterintuitive)
- Base file: NOT the main review - it's a card component for grid displays
- A file: Short review (3-4 paragraphs) - NO frontmatter despite being content
- L file: Full review page with frontmatter - this is the canonical review

## Import Numbering System (Non-Standard)
- latest/index.mdx uses Review1-Review10 AND Review1A-Review10A (paired imports)
- cd/{year}.mdx uses Review1-ReviewN WITHOUT A variants (descending order)
- best50/{year}.mdx uses Review1-Review10 WITH A variants (top 10 only)
- This is NOT a standard pattern - numbering resets per file

## BOB Scripts Directory Structure
- Scripts in BOB/ operate on src/pages/ directories
- Each script has a README-*.md file explaining its purpose
- Scripts must be run from project root: `node BOB/script-name.js`

## Score4 Special Case
- JSON config uses 0-5 scale for `score4` field
- Output automatically doubles to 0-10 in `<SliderJS4 value="{score4 * 2}" />`
- This is NOT documented in the MDX files themselves

## Path Prefix Configuration
- Site uses `/gtc` path prefix (gatsby-config.js)
- Build commands: `yarn build:prefix` and `yarn test:prefix`
- Regular `yarn build` does NOT include prefix

## Deployment Methods
- IBM Cloud Foundry: `cf push` (uses manifest.yml, Staticfile buildpack)
- FTP: `ftp.bat` deploys public/ to Sakura server
- Two separate deployment targets for same codebase

## Related Reviews Pattern
- L files import related reviews as Review1_1, Review1_2, Review1_3
- Additional categories use Review2_1, Review2_2, Review3_1
- This creates a nested numbering system within single files