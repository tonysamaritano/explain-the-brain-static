<script lang="ts">
	import { page } from '$app/state';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	const crumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);
		return segments.map((segment, i) => ({
			label: segment.replaceAll('-', ' '),
			href: '/' + segments.slice(0, i + 1).join('/')
		}));
	});
</script>

{#if crumbs.length > 0}
	<nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1 text-xs text-muted">
		<a href="/" class="hover:text-accent">home</a>
		{#each crumbs as crumb (crumb.href)}
			<ChevronRight size={12} />
			<a href={crumb.href} class="hover:text-accent">{crumb.label}</a>
		{/each}
	</nav>
{/if}
