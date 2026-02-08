<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';
	import PostCard from '$lib/components/PostCard.svelte';

	let { posts, emptyMessage = 'No posts yet.' }: { posts: PostSummary[]; emptyMessage?: string } =
		$props();

	const featured = $derived(posts[0]);
	const rest = $derived(posts.slice(1));
</script>

{#if posts.length === 0}
	<p class="text-muted">{emptyMessage}</p>
{:else}
	<div class="grid gap-6">
		{#if featured}
			<PostCard post={featured} featured />
		{/if}

		{#if rest.length > 0}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{#each rest as post (post.slug)}
					<PostCard {post} />
				{/each}
			</div>
		{/if}
	</div>
{/if}
