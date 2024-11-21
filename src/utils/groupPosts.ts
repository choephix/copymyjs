import { settings } from "@/settings";
import type { CollectionEntry } from "astro:content";

interface GroupPostsOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
}

export function groupPosts(
  posts: CollectionEntry<"posts">[],
  options: GroupPostsOptions = {}
) {
  const { includeDrafts = false, includeFuture = false } = options;
  const now = new Date();

  // Filter posts based on options
  const filteredPosts = posts
    .filter((post) => {
      // Handle drafts
      if (post.data.draft === true && !includeDrafts) {
        return false;
      }

      // Handle future posts
      const publishDate = new Date(post.data.publishDate);
      if (publishDate > now && !includeFuture) {
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
      return new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime();
    });

  // Group posts by category
  const groupedPosts = filteredPosts.reduce((acc, post) => {
    const category = post.data.category || "miscellaneous";
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, typeof filteredPosts>);

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
