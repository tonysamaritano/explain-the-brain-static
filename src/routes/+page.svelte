<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';

	let { data } = $props();
</script>

<section class="mb-8">
	<h1 class="text-3xl font-bold text-text">Minimal writing on how minds and systems work.</h1>
	<p class="text-muted">Short essays from explainthebrain.ai.</p>
</section>

<PostList posts={data.posts} emptyMessage="Posts are coming soon." />
