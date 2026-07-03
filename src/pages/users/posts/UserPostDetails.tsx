import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import PostCommentsPanel from '@/components/posts/PostCommentsPanel';
import PostInfo from '@/components/posts/PostInfo';
import PostLikesPanel from '@/components/posts/PostLikesPanel';
import { accountServices } from '@/services/accountServices';

export function UserPostDetails() {
  const { postId } = useParams<{ username: string; postId: string }>();
  const [rightPanel, setRightPanel] = useState<'comments' | 'likes'>('comments');

  const [post, setPost] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!postId) return;
      try {
        setIsLoading(true);
        setError(null);
        
        const [postRes, commentsRes, likesRes] = await Promise.all([
          accountServices.getPostDetails(postId),
          accountServices.getPostComments(postId, { limit: 100 }),
          accountServices.getPostLikes(postId, { limit: 100 }),
        ]);

        const rawPost = postRes.data?.news;
        if (!rawPost) {
          throw new Error('Post not found');
        }

        setAuthor({
          name: rawPost.author?.name || 'Unknown User',
          profilePicture: rawPost.author?.avatar || undefined,
        });

        setPost({
          id: rawPost.id,
          mediaUrl: rawPost.media?.[0]?.url || '',
          mediaType: rawPost.media?.[0]?.type || 'image',
          viewCount: String(rawPost.viewsCount || 0),
          postTime: new Date(rawPost.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          title: rawPost.caption || '',
          likeCount: String(rawPost.likesCount || 0),
          commentCount: String(rawPost.commentsCount || 0),
          shareCount: '0',
          description: rawPost.description || '',
          location: rawPost.location || 'Unknown',
          categories: rawPost.categories ? rawPost.categories.map((c: any) => c.name) : [],
        });

        setComments(
          (commentsRes.data?.results || []).map((c: any) => ({
            commentedUserUsername: c.author?.name || 'Anonymous',
            userProfilePic: c.author?.avatar || '',
            commentText: c.text || '',
            commentTime: new Date(c.createdAt).toLocaleDateString(),
            commentLikeCount: '0',
          }))
        );

        setLikes(
          (likesRes.data?.results || []).map((l: any) => ({
            userProfilePic: l.user?.avatar || '',
            userName: l.user?.name || 'Unknown',
            username: l.user?.username || `@${(l.user?.name || '').toLowerCase().replace(/\s+/g, '')}`,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load post details');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [postId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-lg font-medium text-text-secondary">
          Loading post details...
        </div>
      </MainLayout>
    );
  }

  if (error || !post || !author) {
    return (
      <MainLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-lg font-semibold text-red-700">
          {error || 'Post not found'}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailsLayout
        left={
          <>
            <DetailsHeader title={`Users / ${author.name} / Posts`} />
            <PostInfo
              post={post}
              author={author}
              onShowLikes={() => setRightPanel('likes')}
              onShowComments={() => setRightPanel('comments')}
            />
          </>
        }
        right={
          rightPanel === 'comments' ? (
            <PostCommentsPanel count={post.commentCount} comments={comments} />
          ) : (
            <PostLikesPanel count={post.likeCount} likes={likes} />
          )
        }
      />
    </MainLayout>
  );
}

export default UserPostDetails;
