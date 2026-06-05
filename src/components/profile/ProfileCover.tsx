import { useEffect, useState } from 'react';

interface ProfileCoverProps {
  coverImage?: string;
  name: string;
  onBack: () => void;
}

export function ProfileCover({ coverImage, onBack }: ProfileCoverProps) {
  const [coverImageError, setCoverImageError] = useState(false);
  const showCoverImage = Boolean(coverImage) && !coverImageError;

  useEffect(() => {
    setCoverImageError(false);
  }, [coverImage]);

  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-t-lg bg-[#DCE5EF]">
      {showCoverImage && (
        <img
          src={coverImage}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setCoverImageError(true)}
        />
      )}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="absolute left-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-text-secondary shadow-card"
      >
        <img src="/icons/profile/back.svg" alt="back" className="h-5 w-5 object-contain" />
      </button>
    </div>
  );
}

export default ProfileCover;
