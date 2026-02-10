# Explain the Brain

A static blog exploring whether we can actually build a brain — runnable models, clear experiments, and public falsification. Built with SvelteKit, Tailwind CSS, and deployed to GitHub Pages.

## Tech Stack

- **SvelteKit** with `adapter-static` for static site generation
- **Tailwind CSS v4** for styling
- **Sharp** for build-time image optimization (PNG/JPEG to WebP with blur-up placeholders)
- **GitHub Actions** for CI/CD to GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Optimize images and create production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Svelte and TypeScript type checks |
| `npm run optimize-images` | Convert images to WebP and generate placeholders |

## Image Optimization

The build pipeline automatically converts PNG/JPEG images in `static/` to WebP and generates tiny base64 blur-up placeholders. This is handled by `scripts/optimize-images.ts` and runs automatically before every build.

Optimized image data is written to `src/lib/generated/image-map.json` (gitignored). The `<Image>` component reads this map to show a blurred placeholder while the full image loads.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

### GitHub Pages Setup

1. Go to your repo **Settings > Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow handles the rest

If you're using a **custom domain** (e.g. `explainthebrain.ai`), no extra config is needed — the site serves from the root.

If you're **not** using a custom domain and the site is at `username.github.io/repo-name/`, add a `BASE_PATH` repository variable set to `/repo-name` (see Environment Variables below).

### Google Analytics

Analytics is enabled by setting your GA measurement ID (e.g. `G-XXXXXXXXXX`). This value is **not** checked into source control.

**For production (GitHub Actions):**

1. Go to your repo **Settings > Secrets and variables > Actions > Variables**
2. Click **New repository variable**
3. Name: `PUBLIC_GA_MEASUREMENT_ID`, Value: your measurement ID
4. The deploy workflow picks this up automatically on the next push

**For local development:**

Create a `.env` file in the project root (this file is gitignored):

```
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If the variable is not set, analytics is completely disabled — no scripts are loaded.

### Environment Variables

| Variable | Where to set | Description |
|---|---|---|
| `PUBLIC_GA_MEASUREMENT_ID` | GitHub repo variable / `.env` | Google Analytics measurement ID. Not source controlled. |
| `BASE_PATH` | GitHub repo variable / `.env` | Only needed without a custom domain. Set to `/repo-name` for `username.github.io/repo-name/` deploys. Leave unset for custom domains. |

## Adding Content

Posts live in `src/lib/content/posts/` as Markdown files with YAML frontmatter:

```markdown
---
title: Your Post Title
date: 2026-01-15
description: A short description for cards and SEO
image: /your-image.png
color: #FA5C5C
---

Your post content here.
```

To feature a post on the homepage, add its slug to `src/lib/content/featured.json`.
