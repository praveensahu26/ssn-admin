import { useState } from 'react';

interface FundraisingTeamItemProps {
  image?: string;
  name: string;
  amountRaised: string;
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

export function FundraisingTeamItem({ image, name, amountRaised }: FundraisingTeamItemProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const showImage = image && !imgError;

  return (
    <article className="flex items-center gap-3">
      {showImage ? (
        <img
          src={image}
          alt={name}
          className="h-8 w-8 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] font-poppins text-base-custom font-medium text-text-secondary">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-md-custom font-semibold leading-5 text-text-primary">{name}</p>
        <p className="truncate text-sm-custom font-medium leading-4 text-text-secondary">{amountRaised}</p>
      </div>
    </article>
  );
}

export default FundraisingTeamItem;
