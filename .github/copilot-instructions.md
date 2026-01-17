# Biking Geek - Copilot Instructions

## Project Overview
Biking Geek is a Jekyll-based blog focused on cycling and sports: bike computers, mountain bikes, cycling gear, protective equipment, and sports accessories. Published via GitHub Pages at `sports.geeknite.com` using the custom theme `FerranSalguero/geeknite-theme`.

**Important**: This is the cycling/sports content spin-off from GeekNite. Biking Geek focuses exclusively on cycling, mountain biking, and sports-related gear reviews and guides.

## Key Architecture Decisions

### Content Structure
- **Posts**: `_posts/YYYY-MM-DD-title.md` with YAML frontmatter (title, date, tags, description, excerpt)
- **Multilingual**: Content in both English and Spanish (Castellano)
- **Cross-linking**: Heavy use of Jekyll's `{% post_url %}` tag for internal references (2-3 minimum per post)
- **Affiliate Focus**: Product reviews with Amazon affiliate links via `site.constants.wsib` and regional Amazon tags

### Custom Theme & Configuration
- Remote theme: `FerranSalguero/geeknite-theme` (Minimal Mistakes fork)
- Configuration: `_config.yml` defines critical constants for Amazon affiliate tags (amazon_es, amazon_com, amazon_uk, amazon_de, amazon_fr, amazon_it)
- Timezone: `Europe/Madrid`
- Permalinks: `/:year/:month/:title:output_ext`
- All posts auto-configured with: TOC, sticky TOC, author profile, sidebar nav "top-posts"

### Amazon Affiliate Integration
**Critical**: All product mentions must link to `{{ site.constants.wsib }}` - MAXIMIZE affiliate linking throughout content. Posts should use standardized multi-region Amazon product tables via `_includes/amazon.html` component showing the same ASIN across 6 Amazon regions (US, UK, DE, ES, FR, IT) with corresponding affiliate tags from `_config.yml`.

**Product Linking Strategy:**
- Link EVERY cycling product mention (bike computers, bikes, gear, helmets, saddles, pedals) to `{{ site.constants.wsib }}`
- Use inline text links: `[Garmin Edge 530]({{ site.constants.wsib }}garmin edge 530)`
- Add product tables with images for major products: `{% include amazon.html asin="B09XX5FVHJ" imageUrl="https://i.imgur.com/image.jpg" %}`
- Images hosted on Imgur with medium size suffix `m`: `https://i.imgur.com/xxxxxm.jpg`
- Prioritize visual product tables over plain text links when possible

## Critical Workflows

### Local Development
- Drafts stored in `_drafts/` (for unpublished content)

### Post Creation Pattern
1. Create file: `_posts/YYYY-MM-DD-descriptive-slug.md`
2. Add comprehensive frontmatter:
   ```yaml
   ---
   title: "Product Name: Catchy Review Title"
   date: YYYY-MM-DD
   tags: [cycling, gear, brand, product-type]
   description: "SEO-optimized description 150-160 chars"
   excerpt: "Longer excerpt for social sharing"
   last_modified_at: 'YYYY-MM-DDTHH:MM:SS+02:00'  # Required when editing
   redirect_from:  # Optional for URL migrations
     - /old/path.html
   ---
   ```
3. **MAXIMIZE internal linking** - reference 3-5 related existing posts using `{% post_url YYYY-MM-DD-slug %}` (NO file extension) integrated in post content
4. **MAXIMIZE affiliate links** - link ALL product mentions to `{{ site.constants.wsib }}`
5. Include product images from Imgur: `https://i.imgur.com/xxxxxm.jpg` (medium size with `m` suffix)
6. Add `{% include amazon.html %}` product tables for major items with ASINs and images
7. **UPDATE `last_modified_at`** - Always update this field with current date/time when editing any post

### Internal Linking Convention
**Critical**: When linking between posts, use Jekyll's `post_url` tag:
```markdown
[link text]({%- post_url 2023-07-06-garmin-edge-540-review -%})
```
- No file extension
- Include full date prefix (YYYY-MM-DD)
- Hyphens only (no spaces)
- Use `{%-` syntax to strip whitespace for cleaner HTML output

## Content Guidelines

### Post Structure
- **Hero image at top** - Must follow this format with affiliate link and alignment:
  ```markdown
  [![Product Name](https://i.imgur.com/image_idm.jpg){: .align-right}]({{ site.constants.wsib }}Product Name)
  ```
  - Image must be an existing product image from Amazon, manufacturer sites, or Imgur
  - If no suitable image exists, you MUST find or create an appropriate product image first
  - Use Imgur URLs for hosting: `https://i.imgur.com/xxxxxm.jpg` (medium size with `m` suffix)
  - Always include `{: .align-right}` for proper text wrapping alongside content
  - Wrap in affiliate link using `{{ site.constants.wsib }}`

### Image Guidelines
**CRITICAL**: Never invent or guess image URLs. Always verify images exist before using them.

**For Product Reviews:**
1. **Primary source**: Use Amazon product images (copy URL from Amazon listing)
2. **Secondary source**: Manufacturer official images
3. **Hosting**: Upload to Imgur and use medium size with `m` suffix: `https://i.imgur.com/xxxxxm.jpg`
4. **Fallback**: If no product image available, use `/assets/images/general.jpg`

**When Editing Posts:**
- Verify all image URLs load correctly before saving
- Replace broken images with working alternatives or the default image
- Check Imgur URLs still resolve (old images may be deleted)

**For Non-Product Posts (guides, tips, comparisons):**
- If no specific image exists, generate one using this AI prompt template:
  ```
  Mountain biker riding on a forest trail, dynamic action shot, natural lighting, 
  green trees and nature background, cycling gear visible, sporty and adventurous mood, 
  vibrant colors, professional photography style, 16:9 aspect ratio, high quality
  ```
- Adapt the prompt based on content: MTB trails, road cycling, gear flat-lay, etc.
- Upload generated image to Imgur before using

- Intro paragraph establishing context and hook reader
- H2 sections for major topics (Design, Performance, Battery Life, etc.)
- H3 for specific features/aspects - **link each product to `{{ site.constants.wsib }}`**
- **Reference 3-5 related existing posts** throughout content using `{% post_url %}` tags
- Add visual `{% include amazon.html %}` tables for featured products with ASINs
- Conclusion with related posts links
- **Pro Tip** callout at end: `**Pro Tip:** Your advice here!`
- Related posts section (3-5 posts minimum) using `post_url` tags

### Tone & Style
- **Casual & Humorous**: Uses emojis 🚴‍♂️, exclamations, conversational style
- **Budget-Focused**: Emphasizes value for amateur cyclists/users
- **Bilingual**: English primary, some Spanish posts (check `locale` in frontmatter)
- Emoji use when appropriate (cycling: 🚴‍♂️🚵, MTB: 🏔️, gear: ⚙️, victory: 🏆)
- Product comparisons and "vs" reviews with winner declarations per section

### Content Quality & Rigor
- **Fact-check all data**: Never invent specifications, prices, or product details
- **Be rigorous**: Verify technical specs, battery life, weight, and product features
- **Long-form content**: Posts should aim for comprehensive coverage with detailed sections
- If uncertain about a detail, research it or omit it rather than guessing
- Use precise measurements, accurate model numbers, and verified information
- Include humorous "quirks" or "funny quirks" section for personality

## Common Tasks

### Updating Product Links
When a post becomes outdated, create a new post and update ALL references:
```powershell
# Find all references to old post in PowerShell
Select-String -Path "_posts\*.md" -Pattern "2023-07-04-prime-day-bike-gadgets"
```
Then replace with new `post_url` tag across affected files.

### Adding New Posts
Follow naming: `YYYY-MM-DD-descriptive-slug.md`
```yaml
---
title: "Your Catchy Title Here"
date: "YYYY-MM-DD"
tags: [cycling, gear, brand]
description: "SEO-optimized 150-160 char description in post language"
excerpt: "Social sharing excerpt"
---
```

## Domain-Specific Notes

### Bike Computers & GPS
- Garmin Edge series (500, 520, 530, 540, etc.)
- iGPSPORT models (iGS630, BSC300, BSC200S, etc.)
- Comparison reviews with feature-by-feature winners
- **Link every bike computer mention to `{{ site.constants.wsib }}`**

### Mountain Bikes & Components
- Full bike reviews (hardtail, full suspension)
- Frame geometry and suspension analysis
- Component reviews (forks, shocks, wheels, saddles)
- Brand coverage: Canyon, Mondraker, Santa Cruz, etc.
- **Every bike/component must have Amazon affiliate link when available**

### Cycling Gear & Protective Equipment
- Helmets (Bluegrass, Fox, etc.)
- Knee pads and protective gear (Fox Launch Pro, etc.)
- Clothing reviews (jerseys, shorts, socks)
- Shoes and pedals
- **Link all gear to Amazon or manufacturer affiliate**

### Sports Accessories
- Running watches and fitness trackers
- Saddles and bike fit equipment
- Nutrition and hydration gear
- Indoor trainers (CycleOps, Elite, etc.)

### Spanish Language Content
- Some posts in Spanish (check frontmatter for locale)
- Common Spanish cycling terms: bicicleta, ciclismo, ruedas, suspensión
- Watch for UTF-8 encoding issues with Spanish characters (ñ, á, é, í, ó, ú)

## Common Patterns

### Comparison Posts
Structure: Intro → Feature-by-feature → Winner per section → Final verdict → Affiliate links
```markdown
## Feature Name
**Product A**: Description
**Product B**: Description
**Winner**: 🏆 Product A - Reason!
```

### Review Posts
Structure: Intro → Key Features → Pros/Cons → Quirks/Humor → Comparisons → Conclusion → Pro Tip → Affiliate
Always include humorous "quirks" section for personality.

### Cross-Linking Strategy
Heavy internal linking to related reviews (3-5 per post minimum). Use Liquid `post_url` tags for future-proof links.

## Pitfalls to Avoid
1. **Never** use file extensions in `post_url` tags
2. **Always** check `_config.yml` constants before hardcoding affiliate links
3. **Remember** to update date in frontmatter when creating posts
4. When linking to posts, verify the exact filename (dates matter!)
5. Imgur image URLs should use the `m` suffix for medium size consistently: `https://i.imgur.com/xxxxxm.jpg`
6. **Never invent** product specifications - verify all technical data
7. **Encoding**: Watch for UTF-8 issues with Spanish characters (ñ, á, é) - fix immediately when found
8. **Length**: Aim for long and comprehensive posts (2000+ words) for SEO and depth
9. **SEO**: Optimize titles and descriptions and exclusive and original content for search engines
10. **Never** use `redirect_to` pointing to the same post - only use redirects for URL migrations from old paths

## Debugging

### Build Errors
- Check YAML frontmatter syntax (common issue: unescaped colons in titles)
- Verify `post_url` references exist (wrong date/slug breaks build)
- Windows paths: Use forward slashes in Jekyll configs

### Encoding Fixes
**Common Problem**: UTF-8 corruption showing as `â€™` ('), `â€"` (—), `Ã³` (ó), `Ã±` (ñ), etc.
- Files often contain mojibake from improper encoding conversions
- Always check and fix encoding when editing old posts
- Spanish characters (ñ, á, é, í, ó, ú) particularly affected

Search regex: `â€™|â€"|Ã³|Ã±|Ã|ðŸ‚ðŸš´â€â™‚ï¸`
Replace with proper UTF-8: ' — ó ñ á 🏂🚴‍♂️

### Theme Issues
Remote theme changes require cache clear. Delete `.jekyll-metadata` and `_site/` for fresh build.

## Key Files
- `_config.yml`: Site config, affiliate tags, theme settings, defaults
- `_data/navigation.yml`: Menus and sidebar content
- `_includes/amazon.html`: Multi-region affiliate link table
- `Gemfile`: GitHub Pages gem, minimal dependencies
- `sv.bat` / `m2jl.ps1`: Development shortcuts (serve, markdown-to-JSON conversion)

## External Dependencies
- Jekyll plugins: `github-pages` bundle (includes jekyll-feed, sitemap, redirect-from)
- No Node.js/npm build process
- Assets managed by remote theme

## Development Notes
- Timezone: `Europe/Madrid`
- Permalink: `/:year/:month/:title:output_ext`
- Markdown: Kramdown with GFM input
- Windows dev environment assumed (batch files, paths)
