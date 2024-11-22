import { showAllPosts } from './env';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  const now = new Date();

  return allPosts
    .filter(post => {
      if (showAllPosts) {
        return true; // Show all posts when --all flag is present
      }

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
      // First sort by draft status (drafts first)
      if (a.data.draft !== b.data.draft) {
        return a.data.draft ? -1 : 1;
      }
      // Then sort by publish date (newest first)
      const aPublishTime = new Date(a.data.publishDate).getTime();
      const bPublishTime = new Date(b.data.publishDate).getTime();
      return bPublishTime - aPublishTime;
    });
}
