<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';
	import PostCard from '$lib/components/PostCard.svelte';

	let {
		featured = [],
		rest = [],
		emptyMessage = 'No posts yet.'
	}: { featured?: PostSummary[]; rest?: PostSummary[]; emptyMessage?: string } = $props();
</script>

{#if featured.length === 0 && rest.length === 0}
	<p class="px-4 text-muted">{emptyMessage}</p>
{:else}
	<div class="grid gap-8">
		{#if featured.length > 0}
			<h2 class="mx-auto w-full max-w-4xl px-4 text-2xl lg:text-4xl font-bold text-text">Featured Posts</h2>
			<div
				class="-my-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[8%] py-10 md:gap-6 md:px-[calc((100%-75%)/2)]"
				style="scrollbar-width: none;"
			>
				{#each featured as post (post.slug)}
					<div class="w-[90%] shrink-0 snap-center md:w-[75%]">
						<PostCard {post} featured />
					</div>
				{/each}
			</div>
		{/if}

		{#if rest.length > 0}
			<h2 class="mx-auto w-full max-w-4xl px-4 text-2xl lg:text-4xl font-bold text-text">Posts</h2>
			<div class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each rest as post (post.slug)}
					<PostCard {post} />
				{/each}
			</div>
		{/if}
	</div>
{/if}
