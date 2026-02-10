<script module lang="ts">
	declare function gtag(...args: unknown[]): void;
</script>

<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';

	const id = env.PUBLIC_GA_MEASUREMENT_ID ?? '';

	const gtagSnippet = id
		? `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"><\/script>` +
			`<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
			`gtag('js',new Date());gtag('config','${id}');<\/script>`
		: '';

	let prevPath = $state('');

	$effect(() => {
		const path = page.url.pathname;
		if (id && path !== prevPath) {
			prevPath = path;
			if (typeof gtag === 'function') {
				gtag('config', id, { page_path: path });
			}
		}
	});
</script>

<svelte:head>
	{@html gtagSnippet}
</svelte:head>
