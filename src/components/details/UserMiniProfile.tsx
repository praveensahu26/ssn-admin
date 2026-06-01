import { useState } from 'react';

interface UserMiniProfileProps {
  image?: string;
  name: string;
  meta?: string;
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

export function UserMiniProfile({ image, name, meta }: UserMiniProfileProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const showImage = image && !imgError;

  return (
    <div className="flex min-w-0 items-center gap-2">
      {showImage ? (
        <img
          src={image}
          alt={name}
          className="h-8 w-8 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-poppins text-sm-custom font-medium text-text-secondary">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="truncate text-md-customfont-medium leading-5 text-text-primary">{name}</p>
          {meta && (
            <>
              <div className="bg-[#8E8E93] w-1 h-1  rounded-full"></div>
              <p className="text-sm-custom font-medium leading-4 text-text-secondary">{meta}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserMiniProfile;
