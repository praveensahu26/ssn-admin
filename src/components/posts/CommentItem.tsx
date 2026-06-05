import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CommentItemProps {
  image?: string;
  username: string;
  text: string;
  time?: string;
  likeCount?: string;
  replies?: CommentReply[];
  defaultExpanded?: boolean;
}

export interface CommentReply {
  image?: string;
  username: string;
  text: string;
  time?: string;
  likeCount?: string;
}

function getInitials(name: string): string {
  if (!name) return '??';

  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';

    return (first + second).toUpperCase() || '??';
  }

  const mainPart = parts[0] ?? '';
  return mainPart.slice(0, 2).toUpperCase() || '??';
}

function Avatar({ image, username, size = 'md' }: { image?: string; username: string; size?: 'sm' | 'md' }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(username);
  const showImage = image && !imgError;
  const sizeClass = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

  return showImage ? (
    <img
      src={image}
      alt={username}
      className={`${sizeClass} shrink-0 rounded-full border border-[#F1F5F9] object-cover`}
      onError={() => setImgError(true)}
    />
  ) : (
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-poppins text-sm-custom font-medium text-text-secondary`}>
      {initials}
    </div>
  );
}

function CommentBody({
  username,
  text,
  time,
  likeCount,
}: Pick<CommentItemProps, 'username' | 'text' | 'time' | 'likeCount'>) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm-custom font-medium leading-4 text-[#667085]">{username}</p>
          <p className="mt-1 text-md-custom font-normal leading-5 text-text-primary">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-sm-custom font-medium text-[#667085]">
          {time && <span>{time}</span>}
          {likeCount && (
            <span className="flex items-center gap-1">
              <img src="/icons/profile/like.svg" alt="likes" className="h-4 w-4 object-contain opacity-80" />
              {likeCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentItem({
  image,
  username,
  text,
  time,
  likeCount,
  replies = [],
  defaultExpanded = false,
}: CommentItemProps) {
  const [repliesOpen, setRepliesOpen] = useState(defaultExpanded);
  const hasReplies = replies.length > 0;

  return (
    <article>
      <div className="flex gap-3">
        <Avatar image={image} username={username} />
        <CommentBody username={username} text={text} time={time} likeCount={likeCount} />
      </div>

      {hasReplies && (
        <div className="ml-12 mt-2">
          {repliesOpen && (
            <div className="space-y-3">
              {replies.map((reply, index) => (
                <div key={`${reply.username}-${index}`} className="flex gap-3">
                  <Avatar image={reply.image} username={reply.username} size="sm" />
                  <CommentBody
                    username={reply.username}
                    text={reply.text}
                    time={reply.time}
                    likeCount={reply.likeCount}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="mt-2 flex items-center gap-2 text-sm-custom font-medium leading-5 text-[#667085]"
            onClick={() => setRepliesOpen((isOpen) => !isOpen)}
          >
            {repliesOpen && <span className="h-px w-10 bg-[#A6B5C6]" />}
            <span>{repliesOpen ? 'Hide replies' : 'View replies'} ({replies.length})</span>
            {!repliesOpen && <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      )}
    </article>
  );
}

export default CommentItem;
