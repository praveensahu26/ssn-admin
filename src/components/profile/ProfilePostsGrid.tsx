import { useMemo, useState } from 'react';

export interface ProfilePost {
  id: string;
  mediaUrl: string;
  viewCount: string;
  categories?: string[];
}

interface ProfilePostsGridProps {
  posts?: ProfilePost[];
}

export function ProfilePostsGrid({ posts = [] }: ProfilePostsGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.categories ?? []))),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (activeCategory === 'All') return posts;

    return posts.filter((post) => post.categories?.includes(activeCategory));
  }, [activeCategory, posts]);

  if (!posts.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-base-custom font-medium leading-5 text-text-primary">Posts</h2>

      <div className="mt-4 flex w-full flex-wrap gap-1 rounded-lg border border-[#DCE5EF] bg-white p-1">
        {['All', ...categories].map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`h-9 shrink-0 rounded-md px-4 text-sm-custom font-medium transition-colors ${
                isActive
                  ? 'bg-[#EAF4FF] text-btn-primary'
                  : 'bg-white text-text-secondary hover:bg-[#F8FAFC]'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visiblePosts.map((post) => (
          <article
            key={post.id}
            className="relative aspect-[1.4/0.8] cursor-pointer overflow-hidden rounded-lg bg-[#F1F5F9]"
          >
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 flex h-6 items-center gap-1 rounded-full bg-black/35 px-2 text-xs-custom font-medium leading-none text-white border-[#505F70] cursor-pointer">
              <img src="/icons/profile/view.svg" alt="views" className="h-4 w-4 brightness-0 invert" />
              <span>{post.viewCount}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProfilePostsGrid;
