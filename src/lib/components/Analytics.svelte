<script module lang="ts">
	declare function gtag(...args: unknown[]): void;
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	const id = env.PUBLIC_GA_MEASUREMENT_ID;

	let initialized = $state(false);
	let prevPath = $state('');

	$effect(() => {
		if (!browser || !id || initialized) return;

		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
		document.head.appendChild(script);

		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		window.gtag('config', id);

		initialized = true;
	});

	$effect(() => {
		const path = page.url.pathname;
		if (id && initialized && path !== prevPath) {
			prevPath = path;
			gtag('config', id, { page_path: path });
		}
	});
</script>
