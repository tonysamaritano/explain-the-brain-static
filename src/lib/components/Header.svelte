<script lang="ts">
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	function getInitialTheme(): 'light' | 'dark' {
		if (!browser) return 'light';
		const saved = localStorage.getItem('theme');
		if (saved === 'light' || saved === 'dark') return saved;
		return 'light';
	}

	let theme: 'light' | 'dark' = $state(getInitialTheme());

	$effect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm p-4">
	<nav class="mx-auto flex max-w-4xl items-center justify-between gap-4">
		<a href={resolve('/')} class="font-bold text-text no-underline hover:no-underline">Explain The Brain</a>
		<div class="flex items-center gap-3">
			<a href={resolve('/')} class="text-accent hover:underline">Home</a>
			<a href={resolve('/about')} class="text-accent hover:underline">About</a>
			<button
				type="button"
				onclick={toggleTheme}
				class="cursor-pointer rounded-full border border-border bg-surface p-2 text-text"
				aria-label="Toggle theme"
			>
				{#if theme === 'light'}
					<Moon size={16} />
				{:else}
					<Sun size={16} />
				{/if}
			</button>
		</div>
	</nav>
</header>
