<script lang="ts">
	import '../app.css';
	import Layout from '$lib/components/Layout.svelte';
	import { site } from '$lib/seo/meta';

	let { children } = $props();
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={site.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:image" content={`${site.url}${site.defaultOgImage}`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={site.name} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content={`${site.url}${site.defaultOgImage}`} />
</svelte:head>

<Layout>
	{@render children()}
</Layout>
