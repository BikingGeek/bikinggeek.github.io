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
5. Include product images from Amazon or Imgur: `https://i.imgur.com/xxxxxm.jpg` (medium size with `m` suffix) or `https://m.media-amazon.com/images/I/` URLs
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
### ?? CRITICAL: Avoiding post_url Errors
**NEVER invent post_url references.** Before adding any `post_url` tag:

1. **ALWAYS verify the post exists** by running:
   ```powershell
   Get-ChildItem "_posts" -Filter "*keyword*" | Select-Object Name
   ```
2. **Use the EXACT filename** including the correct date (e.g., `2023-08-22` not `2023-08-15`)
3. **If no matching post exists**, use an affiliate link instead:
   ```markdown
   # ? WRONG - post doesn't exist
   [Product Name]({%- post_url 2025-06-15-best-bourbons-2025 -%})
   
   # ? CORRECT - use affiliate link when post doesn't exist
   [Product Name]({{ site.constants.wsib }}Product Name)
   ```
4. **Never use future dates** for posts that don't exist yet
5. **Common mistakes to avoid:**
   - Wrong date: `2023-08-15-marvel-united...` vs actual `2023-08-22-marvel-united...`
   - Invented slugs: `best-bourbons-2025` when no bourbon posts exist
   - Missing "-complete" or other suffixes: `marvel-united-multiverse-review` vs `marvel-united-multiverse-complete-review`
- Use `{%-` syntax to strip whitespace

## Content Guidelines

### Post Structure
- **Hero image at top** - Must follow this format with affiliate link and alignment:
  ```markdown
  [![Product Name](https://i.imgur.com/image_idm.jpg){: .align-right}]({{ site.constants.wsib }}Product Name)
  ```
  - Image must be an existing product image from Amazon, manufacturer sites, or other stores
  - If no suitable image exists, you MUST find or use the fallback image: `/assets/images/general.jpg` AND add a `hero_image` field in the frontmatter with a descriptive prompt for AI image generation (e.g., `hero_image: "A dramatic top-down view of a board game setup on a wooden table, warm lighting, photorealistic"`)  
  - Use Imgur URLs for hosting: `https://i.imgur.com/xxxxxm.jpg` (medium size with `m` suffix)
  - **Note**: Uploading custom images to imgur requires user intervention (Copilot cannot upload images)
  - **CRITICAL**: Never invent imgur URLs - always verify the image exists by checking with `fetch_webpage` or using existing URLs from the blog
  - Always include `{: .align-right}` for proper text wrapping alongside content
  - Wrap in affiliate link using `{{ site.constants.wsib }}`
- **Intro must frame a decision** � NOT "here are some great products", but "if you need X, here's what to buy". The user arrived with a problem; solve it immediately

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
- If no specific image exists, generate a AI prompt for image generation and set it into the frontmatter in field `hero_image`, similar to this:
  ```
  Mountain biker riding on a forest trail, dynamic action shot, natural lighting, 
  green trees and nature background, cycling gear visible, sporty and adventurous mood, 
  vibrant colors, professional photography style, 16:9 aspect ratio, high quality
  ```
- Adapt the prompt based on content: MTB trails, road cycling, gear flat-lay, etc.
- Upload generated image to Imgur before using, manually done by user

- Intro paragraph establishing context and hook reader
- H2 sections for major topics (Design, Performance, Battery Life, etc.)
- H3 for specific features/aspects - **link each product to `{{ site.constants.wsib }}`**

- Intro paragraph establishing context
- H2 sections for major topics
- H3 for product names/specific items - **link each product to `{{ site.constants.wsib }}`**
- **Reference 3-5 related existing posts** throughout content using `{% post_url %}` tags
- Add visual `{% include amazon.html %}` tables for featured products with ASINs
- Conclusion with related posts links
- Related posts section (3-5 posts minimum) using `post_url` tags
- for specific products you can use link to amazon.com or amazon.es with `{{ site.constants.amazon_com }}` or `{{ site.constants.amazon_es }}` 

### Tone & Style
- **Professional and informative** with enthusiastic touch
- Avoid overly casual or humorous tone
- Focus on product details, comparisons, and value propositions
- **Budget-Focused**: Emphasizes value for amateur cyclists/users
- **Bilingual**: English primary, some Spanish posts (check `locale` in frontmatter)
- Product comparisons and "vs" reviews with winner declarations per section
### Monetization-First Content Strategy

**CRITICAL**: Every post must follow this user journey pattern:

```
User arrives with a specific question
    ? Reads content
    ? Makes a decision
    ? Clicks affiliate link
```

**Content Philosophy:**
- **DO NOT "recommend things"** � Instead, **SOLVE DECISIONS**
- User searches with a specific problem ? Post provides the answer ? User clicks to buy
- Every section must lead to an actionable decision with a clear affiliate link
- Avoid generic "top 10 lists" � Focus on "Which X should I buy for Y situation?"

**Post Types That Convert:**
| Post Type | Example Title | Why It Works |
|-----------|---------------|--------------|
| Decision resolver | "PS5 vs Xbox Series X: Which Console for You?" | User has a specific choice to make |
| Problem solver | "Best Gaming Headset Under �100 for FPS Games" | User has budget + use case |
| Comparison | "GTA IV Complete vs Red Dead Redemption GOTY" | User deciding between options |
| Buying guide | "Which Nintendo Switch Model to Buy in 2024?" | User ready to purchase |

**Post Structure for Conversion:**
1. **Title**: Frame as a decision/question the user needs answered
2. **Intro**: Acknowledge the user's specific problem (1-2 sentences max)
3. **Quick Answer**: Give the verdict immediately for users who want fast answers
4. **Detailed Analysis**: For users who want to understand why
5. **Decision Table**: Summary table at the end with affiliate links
6. **Single CTA**: One clear "buy now" action per section

**Avoid These Patterns:**
- ? "Here are 10 great games you should try"
- ? "I recommend checking out..."
- ? Generic product lists without decision context
- ? Long intros before getting to the point
- ? Multiple CTAs that confuse the user

**Use These Patterns:**
- ? "If you want X, buy [Product A](affiliate). If you need Y, get [Product B](affiliate)."
- ? "The verdict: [Product](affiliate) is the best choice for [specific use case]."
- ? Tables with clear winner indicators and affiliate links
- ? "Bottom line: Buy [this](affiliate) if... Buy [that](affiliate) if..."

### Content Quality & Rigor
- **Fact-check all data**: Never invent specifications, prices, or product details
- **Be rigorous**: Verify technical specs, release dates, and product features
- **Long-form content**: Posts must be substantially long (~500 lines minimum) with genuinely informative and useful content � not filler. Cover every relevant angle: specs, comparisons, use cases, pros/cons, alternatives, buying advice, and related context. A short post with superficial content does not meet quality standards.
- If uncertain about a detail, research it or omit it rather than guessing
- Use precise measurements, accurate model numbers, and verified information

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
title: "Your Title Here"
date: "YYYY-MM-DD"
last_modified_at: "YYYY-MM-DD"
tags: [tag1, tag2, tag3]
description: "SEO-optimized 150-160 char description in post language"
excerpt: "Social sharing excerpt"
hero_image: "Prompt for AI image generation if no real image is available"
---
```
- `last_modified_at` should always be set to the current date when creating or editing a post
- `hero_image` is a text prompt for AI image generation, only used when no real product image (imgur/Amazon) exists

### Top Posts Navigation
When a post is comprehensive, high-quality, and likely to drive traffic, add it to `_data/navigation.yml` under `top-posts`:
```yaml
top-posts:
  - title: "Top posts"
    children:
      - title: "Post Title"
        url: /YYYY/MM/slug.html
```
- URL format follows the permalink pattern: `/:year/:month/:title.html`
- Add posts after reviewing/improving them to ensure quality standards are met
- Keep the list curated � only high-traffic or evergreen content

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

### When reviewing existing published posts, follow this checklist:
1. **Frontmatter**: Ensure `last_modified_at` is set to current date, `description` exists, and `tags` are relevant
2. **Hero image**: Must exist with `{: .align-right}` and affiliate link wrapper. If using fallback image, add `hero_image` prompt in frontmatter
3. **Tone**: Must be professional, decision-focused � rewrite casual/enthusiastic intros (no "Welcome!", "Hey gamers!", etc.)
4. **Affiliate links**: ALL product mentions must link to `{{ site.constants.wsib }}` � add missing ones
5. **Internal links**: Add 3-5 `post_url` references to related existing posts (verify each exists first)
6. **Amazon product tables**: Add `{% include amazon.html %}` for major products with ASINs
7. **Encoding**: Fix any broken characters (e.g., `×` ? `�`, `é` ? `�`)
8. **Related posts section**: Must exist at end with 3-5 `post_url` links
9. **Decision table**: Add summary table with affiliate links at the end if missing
10. **Top posts**: If quality is high enough, add to `_data/navigation.yml` under `top-posts`