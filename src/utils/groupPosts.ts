import { settings } from "@/settings";
import type { CollectionEntry } from "astro:content";

export function groupPosts(posts: CollectionEntry<"blog">[]) {
  const now = new Date();

  // Filter out drafts and future posts
  const publishedPosts = posts
    .filter((post) => {
      if (post.data.draft === true) return false;

      const publishDate = new Date(post.data.publishDate);
      if (publishDate > now) return false;

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.data.publishDate).getTime() -
        new Date(a.data.publishDate).getTime()
    );

  // Group posts by category
  const groupedPosts = publishedPosts.reduce((acc, post) => {
    const category = post.data.category || "miscellaneous";
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, typeof publishedPosts>);

  // Define category order
  const sortedCategories = [
    ...settings.categoriesOrder,
    ...Object.keys(groupedPosts).filter(
      (cat) => !settings.categoriesOrder.includes(cat)
    ),
  ];

  return {
    groupedPosts,
    sortedCategories,
  };
}
