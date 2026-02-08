<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';

	let { post, featured = false }: { post: PostSummary; featured?: boolean } = $props();
</script>

<a
	href={`/blog/${post.slug}`}
	class="block overflow-hidden rounded-2xl border-2 border-transparent bg-surface shadow-md transition-colors duration-200 hover:border-accent"
>
	{#if post.image}
		<div class={featured ? 'aspect-[2/1]' : 'aspect-[3/2]'}>
			<img
				src={post.image}
				alt={post.title}
				class="h-full w-full object-cover"
			/>
		</div>
	{/if}
	<div class="p-5">
		<h2
			class={`font-semibold text-text ${featured ? 'text-6xl' : 'text-3xl'}`}
		>
			{post.title}
		</h2>
		<p class={`mt-2 text-muted ${featured ? 'text-base' : 'text-sm'}`}>{post.description}</p>
	</div>
</a>
