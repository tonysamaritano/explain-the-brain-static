<script lang="ts">
	import { onMount } from 'svelte';

	let theme: 'light' | 'dark' = 'light';

	function applyTheme(nextTheme: 'light' | 'dark') {
		theme = nextTheme;
		document.documentElement.dataset.theme = nextTheme;
		localStorage.setItem('theme', nextTheme);
	}

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved === 'light' || saved === 'dark') {
			applyTheme(saved);
			return;
		}

		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(prefersDark ? 'dark' : 'light');
	});
</script>

<header class="site-header">
	<nav class="nav">
		<a href="/" class="brand">Explain The Brain</a>
		<div class="links">
			<a href="/">Home</a>
			<a href="/about">About</a>
			<a href="/blog">Blog</a>
			<button type="button" on:click={() => applyTheme(theme === 'light' ? 'dark' : 'light')}
				>{theme === 'light' ? 'Dark' : 'Light'}</button
			>
		</div>
	</nav>
</header>
