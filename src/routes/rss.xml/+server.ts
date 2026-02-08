import { getAllPosts } from '$lib/utils/posts';
import { site } from '$lib/seo/meta';

function xmlEscape(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const items = getAllPosts()
		.map((post) => {
			const link = `${site.url}/blog/${post.slug}`;
			return `\n    <item>\n      <title>${xmlEscape(post.title)}</title>\n      <link>${xmlEscape(link)}</link>\n      <description>${xmlEscape(post.description)}</description>\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n      <guid>${xmlEscape(link)}</guid>\n    </item>`;
		})
		.join('');

	const body = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n  <channel>\n    <title>${xmlEscape(site.name)}</title>\n    <link>${xmlEscape(site.url)}</link>\n    <description>${xmlEscape(site.description)}</description>${items}\n  </channel>\n</rss>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=UTF-8'
		}
	});
}
