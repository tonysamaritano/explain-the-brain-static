<script lang="ts">
	import { browser } from '$app/environment';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	function getInitialTheme(): 'light' | 'dark' {
		if (!browser) return 'light';
		const saved = localStorage.getItem('theme');
		if (saved === 'light' || saved === 'dark') return saved;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

<header class="border-b border-border p-4">
	<nav class="mx-auto flex max-w-4xl items-center justify-between gap-4">
		<a href="/" class="font-bold text-text no-underline hover:no-underline">Explain The Brain</a>
		<div class="flex items-center gap-3">
			<a href="/" class="text-accent hover:underline">Home</a>
			<a href="/about" class="text-accent hover:underline">About</a>
			<a href="/blog" class="text-accent hover:underline">Blog</a>
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
