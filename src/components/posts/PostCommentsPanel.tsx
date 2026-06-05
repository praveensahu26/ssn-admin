import { ChevronDown } from 'lucide-react';
import RightPanel from '@/components/details/RightPanel';
import CommentItem, { type CommentReply } from '@/components/posts/CommentItem';

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
  const replySource = repeatedComments.length ? repeatedComments : comments;

  function getReplies(commentIndex: number): CommentReply[] {
    if (!replySource.length) return [];

    return Array.from({ length: 4 }, (_, replyIndex) => {
      const reply = replySource[(commentIndex + replyIndex + 1) % replySource.length];

      return {
        image: reply?.userProfilePic,
        username: (reply?.commentedUserUsername ?? '@maxjacobson').replace('@', ''),
        text: reply?.commentText ?? 'Now that is a skill very talented.',
        time: reply?.commentTime ?? '25m',
        likeCount: reply?.commentLikeCount ?? '8.19K',
      };
    });
  }

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
            replies={getReplies(index)}
            defaultExpanded={index === 0}
          />
        ))}
        <button type="button" className="flex items-center gap-1 text-sm-custom font-medium leading-5 text-[#667085]">
          Load more Comments
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </RightPanel>
  );
}

export default PostCommentsPanel;
