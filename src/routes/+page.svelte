<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';

	let { data } = $props();
</script>

<PostList featured={data.featured} rest={data.rest} emptyMessage="Posts are coming soon." />
