<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="shell">
	<Header />
	<main class="content">{@render children?.()}</main>
	<Footer />
</div>
