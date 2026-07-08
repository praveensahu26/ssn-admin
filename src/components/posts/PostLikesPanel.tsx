import RightPanel from '@/components/details/RightPanel';
import LikeUserItem from '@/components/posts/LikeUserItem';

interface PostLike {
  userProfilePic: string;
  userName: string;
  username: string;
}

interface PostLikesPanelProps {
  count: string;
  likes: PostLike[];
}

export function PostLikesPanel({ count, likes }: PostLikesPanelProps) {
  return (
    <RightPanel title="Likes" count={`${count} Likes`}>
      <div className="space-y-3">
        {likes.map((like, index) => (
          <LikeUserItem
            key={`${like.username}-${index}`}
            image={like.userProfilePic}
            name={like.userName}
            username={like.username.replace('@', '')}
          />
        ))}
        {likes.length === 0 && (
          <div className="text-center text-gray-500 py-4">No likes yet</div>
        )}
      </div>
    </RightPanel>
  );
}

export default PostLikesPanel;
