import { useMemo, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NewsFeedCard, { type NewsFeedPost } from '@/components/news-feed/NewsFeedCard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dummyData is a plain JS module with no type declarations
import { dummyData } from '@/dummyData/dummyData';

interface DummyPost {
  id: string;
  mediaUrl: string;
  mediaType?: string;
  viewCount: string;
  postTime: string;
  title: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
  categories?: string[];
}

interface DummyAccount {
  name: string;
  profilePicture?: string;
  posts?: DummyPost[];
}

const categories = [
  'Home',
  'Business',
  'World',
  'States',
  'Sports',
  'Crime',
  'Technology',
  'Defence',
  'Judiciary',
  'International',
  'Education',
  'Health',
];

const sections = [
  { title: 'Recent', category: 'Home' },
  { title: 'Global News', category: 'World' },
  { title: 'Business News', category: 'Business' },
  { title: 'Technology News', category: 'Technology' },
  { title: 'State News', category: 'States' },
  { title: 'Sports News', category: 'Sports' },
];

function normalizeCategory(category: string) {
  const lower = category.toLowerCase();

  if (lower.includes('business')) return 'Business';
  if (lower.includes('tech') || lower.includes('startup')) return 'Technology';
  if (lower.includes('sport')) return 'Sports';
  if (lower.includes('crime') || lower.includes('justice')) return 'Crime';
  if (lower.includes('education')) return 'Education';
  if (lower.includes('health')) return 'Health';
  if (lower.includes('politics') || lower.includes('world') || lower.includes('climate')) return 'World';
  if (lower.includes('state') || lower.includes('local')) return 'States';

  return 'Home';
}

function buildFeedPosts(accounts: DummyAccount[]): NewsFeedPost[] {
  return accounts.flatMap((account) =>
    (account.posts ?? []).map((post) => {
      return {
        id: `${account.name}-${post.id}`,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        viewCount: post.viewCount,
        postTime: post.postTime,
        title: post.title,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        shareCount: post.shareCount,
        authorName: account.name,
        authorImage: account.profilePicture,
        category: normalizeCategory(post.categories?.[0] ?? 'Home'),
        detailsPath: `/news-feed/${post.id}`,
      };
    })
  );
}

export function NewsFeedPage() {
  const [activeCategory, setActiveCategory] = useState('Home');
  const posts = useMemo(() => buildFeedPosts(dummyData as DummyAccount[]), []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'Home') return posts;

    return posts.filter((post) => (post as NewsFeedPost & { category: string }).category === activeCategory);
  }, [activeCategory, posts]);

  const postsBySection = useMemo(
    () =>
      sections.map((section, index) => {
        const sectionPosts =
          section.category === 'Home'
            ? filteredPosts.slice(index * 4, index * 4 + 4)
            : posts
                .filter((post) => (post as NewsFeedPost & { category: string }).category === section.category)
                .slice(0, 4);

        return {
          ...section,
          posts: sectionPosts.length ? sectionPosts : filteredPosts.slice(index * 4, index * 4 + 4),
        };
      }),
    [filteredPosts, posts]
  );

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1280px] min-w-0 overflow-hidden">
        <div className="no-scrollbar flex max-w-full gap-4 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                className={`h-12 shrink-0 rounded-lg border px-6 text-md-custom font-medium transition-colors ${
                  isActive
                    ? 'border-btn-primary bg-btn-primary text-white'
                    : 'border-[#DCE5EF] bg-white text-text-secondary'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-6">
          {postsBySection.map((section, sectionIndex) => (
            <section key={`${section.title}-${activeCategory}`}>
              <h1 className="mb-3 text-md-custom font-medium leading-5 text-text-secondary">
                {activeCategory === 'Home' ? section.title : `${activeCategory} News`}
              </h1>
              <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
                {section.posts.map((post, postIndex) => (
                  <NewsFeedCard
                    key={`${section.title}-${post.id}-${postIndex}`}
                    post={post}
                    showViewBadge={sectionIndex > 0 && postIndex === 0}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default NewsFeedPage;
