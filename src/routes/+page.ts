import { getAllPosts } from '$lib/utils/posts';

export function load() {
	return {
		posts: getAllPosts().slice(0, 5)
	};
}
