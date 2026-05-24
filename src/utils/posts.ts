import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { showAllPosts } from './env';

export type PostEntry = CollectionEntry<'posts'>;
export type PostStatus = '' | 'Draft' | 'Scheduled';

interface GetPostsOptions {
  includeHidden?: boolean;
  now?: Date;
}

export function isDraftPost(post: PostEntry): boolean {
  return post.data.draft === true;
}

export function isScheduledPost(
  post: PostEntry,
  now = new Date()
): boolean {
  return new Date(post.data.publishDate) > now;
}

export function getPostStatus(post: PostEntry, now = new Date()): PostStatus {
  if (isDraftPost(post)) {
    return 'Draft';
  }

  if (isScheduledPost(post, now)) {
    return 'Scheduled';
  }

  return '';
}

export function isVisiblePost(
  post: PostEntry,
  { includeHidden = showAllPosts, now = new Date() }: GetPostsOptions = {}
): boolean {
  return includeHidden || getPostStatus(post, now) === '';
}

export function sortPosts(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => {
    if (isDraftPost(a) !== isDraftPost(b)) {
      return isDraftPost(a) ? -1 : 1;
    }

    const aPublishTime = new Date(a.data.publishDate).getTime();
    const bPublishTime = new Date(b.data.publishDate).getTime();

    return bPublishTime - aPublishTime;
  });
}

export async function getPosts(options: GetPostsOptions = {}) {
  const allPosts = await getCollection('posts');

  return sortPosts(allPosts.filter(post => isVisiblePost(post, options)));
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  return getPosts();
}
