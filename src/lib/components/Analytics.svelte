<script module lang="ts">
	declare function gtag(...args: unknown[]): void;
</script>

<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	const id = env.PUBLIC_GA_MEASUREMENT_ID ?? '';

	let prevPath = $state('');

	$effect(() => {
		if (!browser || !id) return;
		const path = page.url.pathname;
		if (path !== prevPath) {
			prevPath = path;
			if (typeof gtag === 'function') {
				gtag('config', id, { page_path: path });
			}
		}
	});
</script>
