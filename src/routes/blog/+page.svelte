<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';

	let { data } = $props();
</script>

<section>
	<h1 class="mx-auto mb-6 max-w-4xl px-4 text-3xl font-bold text-text hidden">Blog</h1>
	<PostList featured={data.featured} rest={data.rest} />
</section>
