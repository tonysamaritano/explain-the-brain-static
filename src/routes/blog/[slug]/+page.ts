import { error } from '@sveltejs/kit';
import { getAllPosts, getPostBySlug } from '$lib/utils/posts';
import { site } from '$lib/seo/meta';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => {
	return getAllPosts().map((post) => ({ slug: post.slug }));
};

export const load: PageLoad = ({ params }) => {
	const post = getPostBySlug(params.slug);
	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post,
		meta: {
			title: post.title,
			description: post.description,
			image: `${site.url}${post.image ?? site.defaultOgImage}`,
			url: `${site.url}/blog/${post.slug}`
		}
	};
};
