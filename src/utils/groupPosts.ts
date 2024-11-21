import type { CollectionEntry } from 'astro:content';

export function groupPosts(posts: CollectionEntry<'blog'>[]) {
  const now = new Date();

  // Filter out drafts and future posts
  const publishedPosts = posts.filter(post => {
    if ('draft' in post.data && post.data.draft === true) return false;
    const publishDate = new Date(post.data.publishDate);
    return publishDate <= now;
  }).sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

  // Group posts by category
  const groupedPosts = publishedPosts.reduce((acc, post) => {
    const category = post.data.category || 'miscellaneous';
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, typeof publishedPosts>);

  // Define category order
  const categoryOrder = ['helpers', 'classic'];
  const sortedCategories = [
    ...categoryOrder,
    ...Object.keys(groupedPosts).filter(cat => !categoryOrder.includes(cat))
  ];

  return {
    groupedPosts,
    sortedCategories
  };
} 
