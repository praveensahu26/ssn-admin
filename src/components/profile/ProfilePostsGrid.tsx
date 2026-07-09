import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface ProfilePost {
  id: string;
  mediaUrl: string;
  media?: MediaItem[];
  viewCount: string;
  categories?: string[];
}

interface ProfilePostsGridProps {
  posts?: ProfilePost[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  getPostHref?: (post: ProfilePost) => string;
}

export function ProfilePostsGrid({
  posts = [],
  activeCategory,
  onCategoryChange,
  getPostHref,
}: ProfilePostsGridProps) {
  const [internalActiveCategory, setInternalActiveCategory] = useState('All');
  const selectedCategory = activeCategory ?? internalActiveCategory;

  const categories = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.categories ?? []))),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;

    return posts.filter((post) => post.categories?.includes(selectedCategory));
  }, [posts, selectedCategory]);

  function handleCategoryChange(category: string) {
    setInternalActiveCategory(category);
    onCategoryChange?.(category);
  }

  if (!posts.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-base-custom font-medium leading-5 text-text-primary">Posts</h2>

      <div className="mt-4 flex w-full flex-wrap gap-1 rounded-lg border border-[#DCE5EF] bg-white p-1">
        {['All', ...categories].map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`h-9 shrink-0 rounded-md px-4 text-sm-custom font-medium transition-colors ${
                isActive
                  ? 'bg-[#EAF4FF] text-btn-primary'
                  : 'bg-white text-text-secondary hover:bg-[#F8FAFC]'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visiblePosts.map((post) => {
          const mediaItems = post.media || [];
          const firstMedia = mediaItems[0];
          const isVideo = firstMedia?.type === 'video';
          
          const card = (
            <article className="relative aspect-[1.4/0.8] cursor-pointer overflow-hidden rounded-lg bg-[#F1F5F9]">
              {isVideo ? (
                <video
                  src={firstMedia?.url || post.mediaUrl}
                  muted
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={firstMedia?.url || post.mediaUrl}
                  alt="Post media"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2 flex h-6 items-center gap-1 rounded-full bg-black/35 px-2 text-xs-custom font-medium leading-none text-white border-[#505F70] cursor-pointer">
                <img src="/icons/profile/view.svg" alt="views" className="h-4 w-4 brightness-0 invert" />
                <span>{post.viewCount}</span>
              </div>
            </article>
          );
          const href = getPostHref?.(post);

          return href ? (
            <Link key={post.id} to={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={post.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfilePostsGrid;
