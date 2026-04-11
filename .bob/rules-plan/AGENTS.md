# Plan Mode Architecture Rules (Non-Obvious Only)

## Three-File Review Architecture
- Each review MUST exist as 3 separate files: base, A variant, L variant
- Base file: Card component (no frontmatter)
- A file: Short text (no frontmatter, despite being content)
- L file: Full page (with frontmatter, imports, scorecard)
- This separation is NOT optional - all 3 required for proper display

## Import Dependency Chain
- latest/index.mdx imports both base AND A variants (Review1 + Review1A)
- cd/{year}.mdx imports ONLY base variants (Review1-ReviewN)
- best50/{year}.mdx imports both for top 10, table-only for 11+
- Breaking this pattern causes display failures

## Review Numbering Reset Pattern
- Each index file (latest, cd, best50) has its own Review1-ReviewN sequence
- Numbers do NOT correspond across files
- Review1 in latest/index.mdx ≠ Review1 in cd/2025.mdx
- This is intentional but counterintuitive

## BOB Script Workflow Dependencies
- Scripts MUST be run in specific order for proper integration
- generate-review creates files but does NOT add to indexes
- add-review-to-latest, add-review-to-cd-year, add-review-to-best50 are separate steps
- Skipping steps leaves reviews orphaned (files exist but not linked)

## Score4 Scaling Architecture
- Input layer (JSON): 0-5 scale
- Output layer (MDX): 0-10 scale (automatic 2x multiplication)
- This transformation happens in generation scripts, not at runtime
- Changing score4 in MDX requires manual recalculation

## Path Prefix Deployment Strategy
- Development: No prefix (gatsby develop)
- IBM Cloud Foundry: Requires `/gtc` prefix (build:prefix)
- FTP deployment: Also requires `/gtc` prefix
- Using wrong build command breaks all internal links

## Maximum Review Constraints
- latest/index.mdx: Hard limit of 10 reviews (MAX_REVIEWS constant)
- index.mdx (homepage): Hard limit of 4 reviews
- Exceeding requires manual removal - no automatic rotation
- Scripts do not enforce these limits

## Related Reviews Nested Numbering
- Primary related: Review1_1, Review1_2, Review1_3
- Secondary categories: Review2_1, Review2_2, Review3_1
- Creates multi-level numbering within single L files
- This pattern is unique to L files, not used in index files