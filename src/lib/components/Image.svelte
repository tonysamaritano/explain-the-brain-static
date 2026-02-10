<script lang="ts">
	import { asset } from '$app/paths';
	import imageMap from '$lib/generated/image-map.json';

	let { src, alt, class: className = '' }: { src: string; alt: string; class?: string } = $props();

	const entry = $derived((imageMap as Record<string, { webp: string; placeholder: string }>)[src]);
	const resolvedSrc = $derived(asset(entry?.webp ?? src));
	const placeholder = $derived(entry?.placeholder);

	let loaded = $state(false);

	function onload() {
		loaded = true;
	}
</script>

<div class="image-wrapper {className}">
	{#if placeholder}
		<img
			src={placeholder}
			alt=""
			aria-hidden="true"
			class="placeholder"
			class:fade-out={loaded}
		/>
	{/if}
	<img
		src={resolvedSrc}
		{alt}
		class="full"
		class:visible={loaded}
		{onload}
	/>
</div>

<style>
	.image-wrapper {
		position: relative;
		overflow: hidden;
	}

	.placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(20px);
		transform: scale(1.1);
		transition: opacity 0.4s ease;
	}

	.placeholder.fade-out {
		opacity: 0;
	}

	.full {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.full.visible {
		opacity: 1;
	}
</style>
