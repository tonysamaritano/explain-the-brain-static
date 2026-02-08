<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';

	let { post }: { post: PostSummary } = $props();
</script>

<article class="post-card">
	<h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
	<p class="meta">{post.date}</p>
	<p>{post.description}</p>
</article>
