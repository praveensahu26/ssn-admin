import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import PostCommentsPanel from '@/components/posts/PostCommentsPanel';
import PostInfo from '@/components/posts/PostInfo';
import PostLikesPanel from '@/components/posts/PostLikesPanel';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dummyData is a plain JS module with no type declarations
import { dummyData } from '@/dummyData/dummyData';

interface PostDetails {
  id: string;
  mediaUrl: string;
  mediaType?: string;
  viewCount: string;
  postTime: string;
  title: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
  description: string;
  location: string;
  categories?: string[];
  comments: Array<{
    commentedUserUsername: string;
    userProfilePic: string;
    commentText: string;
    commentTime?: string;
    commentLikeCount?: string;
  }>;
  likes: Array<{
    userProfilePic: string;
    userName: string;
    username: string;
  }>;
}

interface FeedAuthor {
  name: string;
  profilePicture?: string;
  posts?: PostDetails[];
}

function findNewsPost(postId?: string) {
  if (!postId) return null;

  for (const author of dummyData as FeedAuthor[]) {
    const post = author.posts?.find((item) => item.id === postId);

    if (post) {
      return { author, post };
    }
  }

  return null;
}

export function NewsFeedPostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const [rightPanel, setRightPanel] = useState<'comments' | 'likes'>('comments');
  const newsPost = useMemo(() => findNewsPost(postId), [postId]);

  return (
    <MainLayout>
      {newsPost ? (
        <DetailsLayout
          left={
            <>
              <DetailsHeader title={`News Feed / ${newsPost.author.name}`} />
              <PostInfo
                post={newsPost.post}
                author={newsPost.author}
                onShowLikes={() => setRightPanel('likes')}
                onShowComments={() => setRightPanel('comments')}
              />
            </>
          }
          right={
            rightPanel === 'comments' ? (
              <PostCommentsPanel count={newsPost.post.commentCount} comments={newsPost.post.comments} />
            ) : (
              <PostLikesPanel count={newsPost.post.likeCount} likes={newsPost.post.likes} />
            )
          }
        />
      ) : (
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-lg font-semibold text-[#101828]">
          News post not found
        </div>
      )}
    </MainLayout>
  );
}

export default NewsFeedPostDetails;
