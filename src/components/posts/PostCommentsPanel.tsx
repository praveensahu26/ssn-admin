import RightPanel from '@/components/details/RightPanel';
import CommentItem from '@/components/posts/CommentItem';

interface PostComment {
  commentedUserUsername: string;
  userProfilePic: string;
  commentText: string;
  commentTime?: string;
  commentLikeCount?: string;
}

interface PostCommentsPanelProps {
  count: string;
  comments: PostComment[];
}

export function PostCommentsPanel({ count, comments }: PostCommentsPanelProps) {
  const repeatedComments = comments.length
    ? Array.from({ length: 4 }, () => comments).flat()
    : [];

  return (
    <RightPanel title="Comments" count={`${count} Comments`}>
      <div className="space-y-4">
        {repeatedComments.map((comment, index) => (
          <CommentItem
            key={`${comment.commentedUserUsername}-${index}`}
            image={comment.userProfilePic}
            username={comment.commentedUserUsername.replace('@', '')}
            text={comment.commentText}
            time={comment.commentTime}
            likeCount={comment.commentLikeCount}
          />
        ))}
        <button type="button" className="text-sm-custom font-medium leading-5 text-text-secondary">
          Load more Comments
        </button>
      </div>
    </RightPanel>
  );
}

export default PostCommentsPanel;
