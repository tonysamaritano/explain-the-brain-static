import hljs from 'highlight.js';

export type PostSummary = {
	title: string;
	date: string;
	description: string;
	slug: string;
	image?: string;
	color?: string;
};

export type Post = PostSummary & {
	html: string;
};

type Frontmatter = Record<string, string>;

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function inlineMarkdown(text: string): string {
	return escapeHtml(text)
		.replace(
			/!\[([^\]]*)\]\(([^)]+)\)/g,
			'<img src="$2" alt="$1" class="w-full rounded-xl shadow-xl" loading="lazy" decoding="async" />'
		)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/__([^_]+)__/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/_([^_]+)_/g, '<em>$1</em>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function parseTable(lines: string[]): string {
	const rows = lines.map((line) =>
		line
			.replace(/^\|/, '')
			.replace(/\|$/, '')
			.split('|')
			.map((cell) => cell.trim())
	);

	const headerCells = rows[0];
	const bodyRows = rows.slice(2); // skip header + separator

	const thead = `<thead><tr>${headerCells.map((c) => `<th>${inlineMarkdown(c)}</th>`).join('')}</tr></thead>`;
	const tbody = bodyRows
		.map((row) => `<tr>${row.map((c) => `<td>${inlineMarkdown(c)}</td>`).join('')}</tr>`)
		.join('\n');

	return `<div class="table-wrapper"><table>${thead}<tbody>${tbody}</tbody></table></div>`;
}

function markdownToHtml(markdown: string): string {
	const lines = markdown.split(/\r?\n/);
	const html: string[] = [];
	let inList = false;
	let blockquoteLines: string[] = [];
	let codeBlock: { lang: string; lines: string[] } | null = null;
	let tableLines: string[] = [];

	function closeList() {
		if (inList) {
			html.push('</ul>');
			inList = false;
		}
	}

	function closeBlockquote() {
		if (blockquoteLines.length > 0) {
			html.push(`<blockquote><p>${blockquoteLines.join('<br>')}</p></blockquote>`);
			blockquoteLines = [];
		}
	}

	function closeTable() {
		if (tableLines.length > 0) {
			html.push(parseTable(tableLines));
			tableLines = [];
		}
	}

	for (const rawLine of lines) {
		// Handle fenced code blocks
		if (codeBlock !== null) {
			if (rawLine.trim() === '```') {
				const code = codeBlock.lines.join('\n');
				let highlighted: string;
				if (codeBlock.lang && hljs.getLanguage(codeBlock.lang)) {
					highlighted = hljs.highlight(code, { language: codeBlock.lang }).value;
				} else {
					highlighted = hljs.highlightAuto(code).value;
				}
				html.push(`<pre><code class="hljs${codeBlock.lang ? ` language-${codeBlock.lang}` : ''}">${highlighted}</code></pre>`);
				codeBlock = null;
			} else {
				codeBlock.lines.push(rawLine);
			}
			continue;
		}

		if (rawLine.trim().startsWith('```')) {
			closeList();
			closeBlockquote();
			closeTable();
			const lang = rawLine.trim().slice(3).trim();
			codeBlock = { lang, lines: [] };
			continue;
		}

		const line = rawLine.trim();

		// Handle table rows
		if (line.startsWith('|') && line.endsWith('|')) {
			closeList();
			closeBlockquote();
			tableLines.push(line);
			continue;
		} else {
			closeTable();
		}

		if (line === '') {
			closeList();
			closeBlockquote();
			continue;
		}

		if (line.startsWith('> ') || line === '>') {
			closeList();
			const content = line.slice(2).trim();
			if (content) {
				blockquoteLines.push(inlineMarkdown(content));
			}
			continue;
		}

		if (line.startsWith('### ')) {
			closeList();
			closeBlockquote();
			html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
			continue;
		}

		if (line.startsWith('## ')) {
			closeList();
			closeBlockquote();
			html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
			continue;
		}

		if (line.startsWith('# ')) {
			closeList();
			closeBlockquote();
			html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
			continue;
		}

		if (line.startsWith('- ')) {
			closeBlockquote();
			if (!inList) {
				html.push('<ul>');
				inList = true;
			}
			html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
			continue;
		}

		closeList();
		closeBlockquote();

		html.push(`<p>${inlineMarkdown(line)}</p>`);
	}

	closeList();
	closeBlockquote();
	closeTable();

	return html.join('\n');
}

function parseFrontmatter(frontmatterBlock: string): Frontmatter {
	const output: Frontmatter = {};

	for (const line of frontmatterBlock.split(/\r?\n/)) {
		if (!line.includes(':')) continue;
		const separatorIndex = line.indexOf(':');
		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim();
		if (!key) continue;
		output[key] = value;
	}

	return output;
}

function parseMarkdownFile(raw: string, fallbackSlug: string): Post {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) {
		throw new Error(`Post \"${fallbackSlug}\" is missing frontmatter.`);
	}

	const frontmatter = parseFrontmatter(match[1]);
	const body = match[2].trim();

	const title = frontmatter.title;
	const date = frontmatter.date;
	const description = frontmatter.description;
	const slug = frontmatter.slug ?? fallbackSlug;
	const image = frontmatter.image;
	const color = frontmatter.color;

	if (!title || !date || !description) {
		throw new Error(`Post \"${fallbackSlug}\" is missing required frontmatter fields.`);
	}

	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Post \"${fallbackSlug}\" has invalid date \"${date}\". Use YYYY-MM-DD.`);
	}

	return {
		title,
		date,
		description,
		slug,
		image,
		color,
		html: markdownToHtml(body)
	};
}

function getPostFiles(): Record<string, string> {
	return import.meta.glob('/src/lib/content/posts/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
}

import featuredSlugs from '$lib/content/featured.json';

export function getFeaturedSlugs(): string[] {
	return featuredSlugs;
}

export function getAllPosts(): PostSummary[] {
	const posts = Object.entries(getPostFiles())
		.map(([path, raw]) => {
			const fallbackSlug = path.split('/').pop()?.replace('.md', '') ?? 'untitled';
			const post = parseMarkdownFile(raw, fallbackSlug);
			return {
				title: post.title,
				date: post.date,
				description: post.description,
				slug: post.slug,
				image: post.image,
				color: post.color
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return posts;
}

export function getPostsByLayout(): { featured: PostSummary[]; rest: PostSummary[] } {
	const all = getAllPosts();
	const slugOrder = getFeaturedSlugs();
	const slugSet = new Set(slugOrder);

	const postsBySlug = new Map(all.map((p) => [p.slug, p]));

	const featured = slugOrder
		.map((slug) => postsBySlug.get(slug))
		.filter((p): p is PostSummary => p !== undefined);

	const rest = all.filter((p) => !slugSet.has(p.slug));

	return { featured, rest };
}

export function getPostBySlug(slug: string): Post | null {
	for (const [path, raw] of Object.entries(getPostFiles())) {
		const fallbackSlug = path.split('/').pop()?.replace('.md', '') ?? 'untitled';
		const post = parseMarkdownFile(raw, fallbackSlug);
		if (post.slug === slug) return post;
	}

	return null;
}
