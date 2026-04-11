# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure

- **BOB/** - Review generation and management scripts (Node.js)
- **src/pages/review/** - Album review MDX files (3 variants: base.mdx, A.mdx, L.mdx)
- **src/pages/cd/** - Year-based review index pages (2016.mdx - 2025.mdx)
- **src/pages/best50/** - Annual best 50 rankings
- **src/pages/latest/** - Latest 10 reviews homepage

## Critical Non-Obvious Patterns

### Review File Naming Convention
- Reviews MUST have 3 files: `{identifier}.mdx`, `{identifier}A.mdx`, `{identifier}L.mdx`
- Base file: Card component for grid displays
- A file: Short review text (3-4 paragraphs, no frontmatter)
- L file: Full review page with frontmatter, imports, scorecard, tracklist

### BOB Scripts Workflow
1. Generate review: `node BOB/generate-review.js` or `node BOB/generate-review-from-json.js config.json`
2. Add to latest: `node BOB/add-review-to-latest.js {identifier}` (auto-detects newest if no arg)
3. Add to year: `node BOB/add-review-to-cd-year.js {identifier} {year}`
4. Add to best50: `node BOB/add-review-to-best50.js {identifier} {year}` (top 10 only)
5. Add to best50 table: `node BOB/add-review-to-best50-table-only.js {identifier} {year}` (rank 11+)

### Import Numbering System
- latest/index.mdx: Review1-Review10 with A variants (Review1A-Review10A)
- cd/{year}.mdx: Review1-ReviewN (no A variants, descending order)
- best50/{year}.mdx: Review1-Review10 with A variants (top 10 only)

### Score4 Special Handling
- JSON input uses 0-5 scale for `score4`
- Output automatically doubles to 0-10: `<SliderJS4 value="{score4 * 2}" />`

### Advertisement Components
- adv1.js, adv2.js, adv3.js are affiliate link components
- Must be imported in L files: `import AdvJS2 from "./adv2";`

### Path Prefix Configuration
- Site uses `/gtc` path prefix (gatsby-config.js: `pathPrefix: '/gtc'`)
- Build with prefix: `yarn build:prefix`
- Test with prefix: `yarn test:prefix`

### Deployment
- IBM Cloud Foundry: `cf push` (uses manifest.yml, Staticfile buildpack)
- FTP: `ftp.bat` (deploys public/ to Sakura server)
- Node version: v20.14.0 (.nvmrc)

### MDX Import Paths
- Review imports use relative paths: `import Review1 from "../review/{identifier}.mdx"`
- Image paths: `../../images/cd/{identifier}L.jpg`

### Maximum Review Limits
- latest/index.mdx: 10 reviews max (MAX_REVIEWS constant)
- index.mdx (homepage): 4 reviews max

### Related Reviews Pattern
- L files can import up to any related reviews as Review1_1, Review1_2, Review1_3
- Additional related reviews as Review2_1, Review2_2, Review3_1 for different categories

## General ristriction
- Do not install additional node-modules