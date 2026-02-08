<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import type { PostSummary } from '$lib/utils/posts';

	let { data }: { data: { posts: PostSummary[] } } = $props();
</script>

<section>
	<h1>Blog</h1>
	<PostList posts={data.posts} />
</section>
