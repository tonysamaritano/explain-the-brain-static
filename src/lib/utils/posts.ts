export type PostSummary = {
	title: string;
	date: string;
	description: string;
	slug: string;
	image?: string;
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
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/__([^_]+)__/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/_([^_]+)_/g, '<em>$1</em>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown: string): string {
	const lines = markdown.split(/\r?\n/);
	const html: string[] = [];
	let inList = false;

	for (const rawLine of lines) {
		const line = rawLine.trim();

		if (line === '') {
			if (inList) {
				html.push('</ul>');
				inList = false;
			}
			continue;
		}

		if (line.startsWith('### ')) {
			if (inList) {
				html.push('</ul>');
				inList = false;
			}
			html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
			continue;
		}

		if (line.startsWith('## ')) {
			if (inList) {
				html.push('</ul>');
				inList = false;
			}
			html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
			continue;
		}

		if (line.startsWith('# ')) {
			if (inList) {
				html.push('</ul>');
				inList = false;
			}
			html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
			continue;
		}

		if (line.startsWith('- ')) {
			if (!inList) {
				html.push('<ul>');
				inList = true;
			}
			html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
			continue;
		}

		if (inList) {
			html.push('</ul>');
			inList = false;
		}

		html.push(`<p>${inlineMarkdown(line)}</p>`);
	}

	if (inList) {
		html.push('</ul>');
	}

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
				image: post.image
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return posts;
}

export function getPostBySlug(slug: string): Post | null {
	for (const [path, raw] of Object.entries(getPostFiles())) {
		const fallbackSlug = path.split('/').pop()?.replace('.md', '') ?? 'untitled';
		const post = parseMarkdownFile(raw, fallbackSlug);
		if (post.slug === slug) return post;
	}

	return null;
}
