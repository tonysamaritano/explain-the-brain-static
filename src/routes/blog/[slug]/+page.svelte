<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();
	let articleElement: HTMLElement | undefined;

	onMount(() => {
		if (!articleElement) return;

		for (const image of articleElement.querySelectorAll('img')) {
			const source = image.getAttribute('src');
			if (!source || !source.startsWith('/')) continue;
			image.setAttribute('src', new URL(source, window.location.origin).toString());
		}
	});
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

<article
	bind:this={articleElement}
	class="prose mx-auto max-w-4xl min-w-0 overflow-hidden px-4 text-text prose-headings:text-text prose-p:text-text prose-li:text-text prose-li:my-0 prose-ul:my-2 prose-ol:my-2 prose-strong:text-text prose-a:text-accent prose-code:rounded prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:text-text prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:text-muted prose-blockquote:not-italic [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:max-w-full prose-table:text-text prose-th:text-text prose-td:text-text prose-th:border-border prose-td:border-border [&_pre_code]:bg-transparent [&_pre_code]:p-0"
>
	<h1>{data.post.title}</h1>
	<p class="!text-sm !text-muted">{data.post.date}</p>
	{@html data.post.html}
</article>
