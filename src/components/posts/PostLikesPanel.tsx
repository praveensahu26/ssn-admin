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
  const repeatedLikes = likes.length ? Array.from({ length: 4 }, () => likes).flat() : [];

  return (
    <RightPanel title="Likes" count={`${count} Likes`}>
      <div className="space-y-3">
        {repeatedLikes.map((like, index) => (
          <LikeUserItem
            key={`${like.username}-${index}`}
            image={like.userProfilePic}
            name={like.userName}
            username={like.username.replace('@', '')}
          />
        ))}
      </div>
    </RightPanel>
  );
}

export default PostLikesPanel;
