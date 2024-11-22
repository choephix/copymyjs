import { settings } from "@/settings";
import type { CollectionEntry } from "astro:content";

export function groupPosts(posts: CollectionEntry<"posts">[]) {
  // Group posts by category
  const groupedPosts = posts.reduce((acc, post) => {
    const category = post.data.category || "miscellaneous";
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

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
