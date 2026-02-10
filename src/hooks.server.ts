import type { Handle } from '@sveltejs/kit';

const GA_ID = process.env.PUBLIC_GA_MEASUREMENT_ID;

const gtagSnippet = GA_ID
	? `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`
	: '';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			if (!gtagSnippet) return html;
			return html.replace('</head>', `${gtagSnippet}\n</head>`);
		}
	});
};
