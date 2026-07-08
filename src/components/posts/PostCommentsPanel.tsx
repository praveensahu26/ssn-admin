import RightPanel from '@/components/details/RightPanel';
import CommentItem from '@/components/posts/CommentItem';

interface PostComment {
  commentedUserUsername: string;
  userProfilePic: string;
  commentText: string;
  commentTime?: string;
  commentLikeCount?: string;
  replies?: Array<{
    image: string;
    username: string;
    text: string;
    time: string;
    likeCount: string;
  }>;
}

interface PostCommentsPanelProps {
  count: string;
  comments: PostComment[];
}

export function PostCommentsPanel({ count, comments }: PostCommentsPanelProps) {
  return (
    <RightPanel title="Comments" count={`${count} Comments`}>
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <CommentItem
            key={`${comment.commentedUserUsername}-${index}`}
            image={comment.userProfilePic}
            username={comment.commentedUserUsername.replace('@', '')}
            text={comment.commentText}
            time={comment.commentTime}
            likeCount={comment.commentLikeCount}
            replies={comment.replies || []}
            defaultExpanded={index === 0}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-500 py-4">No comments yet</div>
        )}
      </div>
    </RightPanel>
  );
}

export default PostCommentsPanel;
