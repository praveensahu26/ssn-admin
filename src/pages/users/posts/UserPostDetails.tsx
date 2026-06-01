import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import PostCommentsPanel from '@/components/posts/PostCommentsPanel';
import PostInfo from '@/components/posts/PostInfo';
import PostLikesPanel from '@/components/posts/PostLikesPanel';
import { slugifyProfileName } from '@/utils/profileRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dummyData is a plain JS module with no type declarations
import { users as initialUsers } from '@/dummyData/dummyData';

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

interface UserDetails {
  name: string;
  profilePicture?: string;
  posts?: PostDetails[];
}

export function UserPostDetails() {
  const { username, postId } = useParams<{ username: string; postId: string }>();
  const [rightPanel, setRightPanel] = useState<'comments' | 'likes'>('comments');

  const user = useMemo(
    () =>
      (initialUsers as UserDetails[]).find(
        (item) => slugifyProfileName(item.name) === username
      ),
    [username]
  );
  const post = user?.posts?.find((item) => item.id === postId);

  return (
    <MainLayout>
      {user && post ? (
        <DetailsLayout
          left={
            <>
              <DetailsHeader title={`Users / ${user.name} / Posts`} />
              <PostInfo
                post={post}
                author={user}
                onShowLikes={() => setRightPanel('likes')}
                onShowComments={() => setRightPanel('comments')}
              />
            </>
          }
          right={
            rightPanel === 'comments' ? (
              <PostCommentsPanel count={post.commentCount} comments={post.comments} />
            ) : (
              <PostLikesPanel count={post.likeCount} likes={post.likes} />
            )
          }
        />
      ) : (
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-lg font-semibold text-[#101828]">
          Post not found
        </div>
      )}
    </MainLayout>
  );
}

export default UserPostDetails;
