<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';
	import PostCard from '$lib/components/PostCard.svelte';

	let { posts, emptyMessage = 'No posts yet.' }: { posts: PostSummary[]; emptyMessage?: string } =
		$props();
</script>

{#if posts.length === 0}
	<p>{emptyMessage}</p>
{:else}
	<div class="post-list">
		{#each posts as post (post.slug)}
			<PostCard {post} />
		{/each}
	</div>
{/if}
