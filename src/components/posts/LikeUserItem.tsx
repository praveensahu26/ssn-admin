import { useState } from 'react';

interface LikeUserItemProps {
  image?: string;
  name: string;
  username: string;
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

export function LikeUserItem({ image, name, username }: LikeUserItemProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const showImage = image && !imgError;

  return (
    <article className="flex items-center gap-3">
      {showImage ? (
        <img
          src={image}
          alt={name}
          className="h-10 w-10 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-poppins text-base-custom font-medium text-text-secondary">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-md-custom font-medium leading-5 text-text-primary">{name}</p>
        <p className="truncate text-sm-custom font-medium leading-4 text-text-secondary">{username}</p>
      </div>
    </article>
  );
}

export default LikeUserItem;
