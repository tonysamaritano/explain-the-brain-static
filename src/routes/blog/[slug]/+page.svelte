<script lang="ts">
	import type { Post } from '$lib/utils/posts';

	let { data }: {
		data: {
			post: Post;
			meta: {
				title: string;
				description: string;
				image: string;
				url: string;
			};
		};
	} = $props();
</script>

<svelte:head>
	<title>{data.meta.title} | Explain The Brain</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={data.meta.url} />
	<meta property="og:image" content={data.meta.image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content={data.meta.image} />
</svelte:head>

<article class="prose">
	<h1>{data.post.title}</h1>
	<p class="meta">{data.post.date}</p>
	{@html data.post.html}
</article>
