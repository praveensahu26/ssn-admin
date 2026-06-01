import { useState } from 'react';

interface CommentItemProps {
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

export function CommentItem({ image, username, text, time, likeCount }: CommentItemProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(username);
  const showImage = image && !imgError;

  return (
    <article className="flex gap-3">
      {showImage ? (
        <img
          src={image}
          alt={username}
          className="h-9 w-9 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-poppins text-sm-custom font-medium text-text-secondary">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-md-custom font-medium leading-4 text-text-secondary">{username}</p>
            <p className="mt-1 text-sm-custom font-medium leading-5 text-text-primary">{text}</p>
          </div>
          {time && <span className="shrink-0 text-sm-custom font-medium text-text-secondary">{time}</span>}
        </div>
        {likeCount && (
          <div className="mt-1 flex items-center justify-end gap-1 text-sm-custom font-medium text-text-secondary">
            <img src="/icons/profile/like.svg" alt="likes" className="h-4 w-4 object-contain" />
            <span>{likeCount}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default CommentItem;
