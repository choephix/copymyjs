import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  const now = new Date();

  return allPosts
    .filter(post => {
      // Skip posts marked as drafts
      if ('draft' in post.data && post.data.draft === true) {
        return false;
      }

      // Skip posts with future publish dates
      const publishDate = new Date(post.data.publishDate);
      if (publishDate > now) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      return new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime();
    });
}
