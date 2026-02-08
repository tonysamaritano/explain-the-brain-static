<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';

	let { data } = $props();
</script>

<section>
	<h1 class="mb-6 text-3xl font-bold text-text">Blog</h1>
	<PostList posts={data.posts} />
</section>
