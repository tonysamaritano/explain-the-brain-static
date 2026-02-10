<script lang="ts">
	import { page } from '$app/state';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	const nonPageSegments = new Set(['blog']);

	const crumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);
		return segments
			.filter((segment) => !nonPageSegments.has(segment))
			.map((segment, i, arr) => ({
				label: segment.replaceAll('-', ' '),
				href: '/' + segments.slice(0, segments.indexOf(arr[i]) + 1).join('/')
			}));
	});
</script>

{#if crumbs.length > 0}
	<nav aria-label="Breadcrumb" class="mx-auto mb-4 flex max-w-4xl items-center gap-1 px-4 text-xs text-muted">
		<a href="/" class="hover:text-accent">home</a>
		{#each crumbs as crumb (crumb.href)}
			<ChevronRight size={12} />
			<a href={crumb.href} class="hover:text-accent">{crumb.label}</a>
		{/each}
	</nav>
{/if}
