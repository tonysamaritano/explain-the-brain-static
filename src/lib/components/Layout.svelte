<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen grid grid-rows-[auto_1fr_auto] bg-bg text-text font-sans tracking-tight">
	<Header />
	<main class="mx-auto w-full max-w-4xl px-4 py-8 pb-12">
		<Breadcrumbs />
		{@render children?.()}
	</main>
	<Footer />
</div>
