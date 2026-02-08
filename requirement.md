# V1 Requirements: explainthebrain.ai Blog (Svelte)

## 1) Core Goal
Build a minimal Svelte blog where posts are written in Markdown and exported as static HTML.

## 2) Technical Requirements
1. Framework: SvelteKit.
2. Output: Static export (no server required) using `@sveltejs/adapter-static`.
3. Markdown: All posts stored as `.md` files and compiled to HTML at build/export time.
4. Routing:
   1. `/` main page
   2. `/about` about page
   3. `/blog/[slug]` post page
5. Styling: Must support both light mode and dark mode using CSS variables and `prefers-color-scheme` (manual toggle optional in V1).

## 3) Content Requirements
1. Blog posts live in Markdown files with frontmatter:
   1. `title` (string)
   2. `date` (ISO date)
   3. `description` (string)
   4. `slug` (string, optional if filename is used as slug)
   5. `image` (string, optional Open Graph image path)
2. Build must fail on invalid/missing required frontmatter.
3. Posts are sorted by date descending.

## 4) SEO + Discovery Requirements
1. Open Graph metadata required:
   1. Site-level defaults: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`.
   2. Per-post overrides from frontmatter (`title`, `description`, `image`).
2. Twitter card metadata required: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
3. RSS feed required at `/rss.xml` containing all published posts with title, link, description, and publish date.

## 5) Architecture Requirements
1. Keep components small and testable:
   1. `Layout`, `Header`, `Footer`, `PostList`, `PostCard`.
2. Keep post parsing/sorting in a single utility module (`posts.ts`) for easy unit testing.

## 6) Testing Requirements (V1 Minimal)
1. Unit tests for:
   1. Post parsing/frontmatter validation
   2. Date sorting
   3. Slug resolution
2. One component smoke test for `PostCard`.
3. One e2e smoke test:
   1. Home page loads
   2. About page loads
   3. A post page loads
   4. RSS endpoint responds at `/rss.xml`

## 7) Minimal Folder/File Structure

```text
/Users/tonysamaritano/repos/explainthebrain/blog/
  src/
    app.css
    lib/
      components/
        Layout.svelte
        Header.svelte
        Footer.svelte
        PostCard.svelte
        PostList.svelte
      seo/
        meta.ts
      content/
        posts/
          hello-world.md
      utils/
        posts.ts
        posts.test.ts
    routes/
      +layout.svelte
      +page.svelte
      about/
        +page.svelte
      rss.xml/
        +server.ts
      blog/
        +page.svelte
        [slug]/
          +page.ts
          +page.svelte
  tests/
    e2e/
      smoke.spec.ts
  static/
    favicon.svg
  svelte.config.js
  vite.config.ts
  package.json
  README.md
```

## 8) Acceptance Criteria
1. Running build/export generates static HTML for `/`, `/about`, and all `/blog/[slug]` pages.
2. New Markdown file in `src/lib/content/posts/` appears automatically as a blog post.
3. Light and dark themes render correctly and remain readable on mobile and desktop.
4. Every page has valid Open Graph metadata; every post has post-specific metadata.
5. `/rss.xml` is generated and lists all posts.
6. Tests pass in CI/local with one command.
