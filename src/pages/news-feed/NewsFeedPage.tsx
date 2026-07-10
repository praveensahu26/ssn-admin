import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import NewsFeedCard from '@/components/news-feed/NewsFeedCard';
import { adminNewsServices, type AdminNewsPost } from '@/services/adminNewsServices';
import { apiClient } from '@/services/apiClient';
import { getRelativeTime } from '@/utils/relativeTime';

const PAGE_SIZE = 12;

interface CategoryItem {
  id: string;
  name: string;
}

export function NewsFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return searchParams.get('category') || 'Home';
  });

  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [posts, setPosts] = useState<AdminNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 1. Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiClient.get('/categories');
        const dbCategories = res.data?.data?.categories || [];
        setCategoriesList([
          { id: 'Home', name: 'Home' },
          ...dbCategories.map((c: any) => ({ id: c._id || c.id, name: c.name })),
        ]);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  // 2. Fetch posts callback
  const fetchPosts = useCallback(
    async (catId: string, nextPage: number, append: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const params: any = {
          page: nextPage,
          limit: PAGE_SIZE,
        };

        if (catId !== 'Home') {
          params.category = catId;
        }

        const res = await adminNewsServices.listNews(params);

        const incoming = res.data?.posts ?? [];
        setPosts((prev) => (append ? [...prev, ...incoming] : incoming));
        setTotalPages(res.meta?.totalPages ?? 1);
        setPage(nextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news posts');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 3. React to category change (from URL param)
  useEffect(() => {
    const category = searchParams.get('category') || 'Home';
    setActiveCategory(category);
    setPosts([]);
    fetchPosts(category, 1, false);
  }, [searchParams, fetchPosts]);

  // 4. Infinite scroll
  const hasMore = page < totalPages;

  useEffect(() => {
    if (!hasMore || isLoading) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          fetchPosts(activeCategory, page + 1, true);
        }
      },
      { rootMargin: '240px 0px' }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoading, activeCategory, page, fetchPosts]);

  function handleCategoryChange(catId: string) {
    setActiveCategory(catId);
    setSearchParams(catId === 'Home' ? {} : { category: catId });
  }

  async function handleDeletePost(id: string) {
    try {
      await adminNewsServices.deleteNews(id);
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  }

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1280px] min-w-0 overflow-hidden flex flex-col gap-6">
        
        {/* Categories Tabs Scroll Row */}
        <div className="no-scrollbar flex max-w-full gap-4 overflow-x-auto pb-2">
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                className={`h-12 shrink-0 rounded-lg border px-6 text-md-custom font-medium transition-colors font-poppins ${
                  isActive
                    ? 'border-btn-primary bg-btn-primary text-white'
                    : 'border-[#DCE5EF] bg-white text-text-secondary'
                }`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Posts Area */}
        <div className="min-w-0">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 font-poppins">
              {error}
            </div>
          )}

          {!error && posts.length > 0 && (
            <>
              <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {posts.map((post) => {
                  const authorName = post.author?.name || 'Unknown';
                  const authorImage = post.author?.avatar || undefined;
                  const media = post.media || [];
                  const mediaUrl = media[0]?.url ?? '';
                  const mediaType = media[0]?.type ?? 'image';

                  return (
                    <NewsFeedCard
                      key={post.id || post._id}
                      post={{
                        id: post.id || post._id,
                        mediaUrl,
                        mediaType,
                        media,
                        viewCount: String(post.viewsCount || 0),
                        postTime: getRelativeTime(post.createdAt),
                        title: post.caption,
                        likeCount: String(post.likesCount || 0),
                        commentCount: String(post.commentsCount || 0),
                        shareCount: String(post.sharesCount || 0),
                        authorName,
                        authorImage,
                        detailsPath: `/news-feed/${post.id || post._id}`,
                      }}
                      showViewBadge={true}
                      onDelete={handleDeletePost}
                    />
                  );
                })}
              </div>

              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex h-12 items-center justify-center mt-6"
                >
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-[#007AFF]" /> : ''}
                </div>
              )}
            </>
          )}

          {!error && !isLoading && posts.length === 0 && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[#DCE5EF] bg-white px-6 text-center text-md-custom font-medium text-text-secondary font-poppins">
              No news feed posts available.
            </div>
          )}

          {isLoading && posts.length === 0 && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-[#DCE5EF] bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default NewsFeedPage;
