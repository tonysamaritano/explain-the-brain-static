<script lang="ts">
	import type { PostSummary } from '$lib/utils/posts';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Image from './Image.svelte';

	let { post, featured = false }: { post: PostSummary; featured?: boolean } = $props();

	const featuredTextColor = $derived(post.color ? 'text-white' : 'text-text');
</script>

{#if featured}
	<a
		href={`/blog/${post.slug}`}
		class="card-link group block h-full w-full overflow-hidden rounded-3xl shadow-lg shadow-shadow transition-all duration-200 hover:opacity-90 hover:shadow-xl"
		style="background-color: {post.color ?? 'var(--surface)'}"
	>
		<div class="grid h-full grid-cols-1 lg:grid-cols-2">
			{#if post.image}
				<div class="aspect-square overflow-hidden">
					<Image
						src={post.image}
						alt={post.title}
						class="h-full w-full"
					/>
				</div>
			{/if}
			<div class="flex flex-col items-start justify-between p-8 lg:min-h-0 xl:p-16">
				<h2 class="text-2xl font-semibold lg:text-4xl xl:text-6xl {featuredTextColor}">{post.title}</h2>
				<div class="flex w-full justify-end">
					<ArrowRight class="size-6 lg:size-12 {featuredTextColor}" />
				</div>
			</div>
		</div>
	</a>
{:else}
	<a
		href={`/blog/${post.slug}`}
		class="card-link group block overflow-hidden rounded-2xl transition-all duration-200 hover:bg-surface hover:opacity-80 hover:shadow-lg"
	>
		{#if post.image}
			<div class="aspect-[3/2] overflow-hidden">
				<Image
					src={post.image}
					alt={post.title}
					class="h-full w-full"
				/>
			</div>
		{/if}
		<div class="my-3 flex items-center justify-between gap-2 px-4">
			<h2 class="text-lg font-semibold text-text">{post.title}</h2>
			<ArrowRight size={18} class="shrink-0 text-text" />
		</div>
	</a>
{/if}
