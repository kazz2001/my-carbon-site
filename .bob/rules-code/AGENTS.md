# Code Mode Rules (Non-Obvious Only)

## Review File Structure Requirements
- ALWAYS create 3 files for each review: `{id}.mdx`, `{id}A.mdx`, `{id}L.mdx`
- Base file: No frontmatter, only card component
- A file: No frontmatter, 3-4 paragraph review text with `<br/>` tags
- L file: Full frontmatter, imports, scorecard with SliderJS components

## Import Path Conventions
- Review imports: `import Review1 from "../review/{identifier}.mdx"`
- Image paths in L files: `../../images/cd/{identifier}L.jpg`
- Advertisement imports: `import AdvJS2 from "./adv2";` (must be in L files)

## Score4 Transformation
- Input JSON uses 0-5 scale for `score4`
- MUST multiply by 2 in output: `<SliderJS4 value="{score4 * 2}" />`
- Example: JSON `"score4": "4"` → MDX `<SliderJS4 value="8" />`

## Review Numbering in Index Files
- latest/index.mdx: Review1-Review10 + Review1A-Review10A (paired)
- cd/{year}.mdx: Review1-ReviewN (descending order, no A variants)
- best50/{year}.mdx: Review1-Review10 + Review1A-Review10A (top 10 only)

## Related Reviews Import Pattern
- Primary related: Review1_1, Review1_2, Review1_3
- Secondary categories: Review2_1, Review2_2, Review3_1
- NEVER use Review1A_1 or similar - only base imports for related reviews

## BOB Script Execution Order
1. `node BOB/generate-review-from-json.js config.json` - Creates 3 MDX files
2. `node BOB/add-review-to-latest.js {id}` - Adds to latest (auto-detects if no id)
3. `node BOB/add-review-to-cd-year.js {id} {year}` - Adds to year page
4. `node BOB/add-review-to-best50.js {id} {year}` - Top 10 only (imports + rows)
5. `node BOB/add-review-to-best50-table-only.js {id} {year}` - Rank 11+ (table only)

## Maximum Review Limits
- latest/index.mdx: 10 reviews (MAX_REVIEWS constant)
- index.mdx (homepage): 4 reviews
- Exceeding limits requires manual removal of oldest reviews

## No Access to MCP and Browser Tools
- This mode cannot use MCP servers or browser automation
- Use Advanced mode if these tools are needed