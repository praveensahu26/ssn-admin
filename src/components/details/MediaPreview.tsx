import type { ReactNode } from 'react';

interface MediaPreviewProps {
  src: string;
  alt: string;
  viewCount: string;
  mediaType?: string;
  topRight?: ReactNode;
}

export function ViewCountBadge({ viewCount }: { viewCount: string }) {
  return (
    <div className="flex h-7 items-center gap-1 rounded-full border border-[#505F70] bg-[#505F7094] px-3 text-sm-custom font-medium leading-none text-white">
      <img src="/icons/profile/view.svg" alt="views" className="h-5 w-5 brightness-0 invert" />
      <span>{viewCount}</span>
    </div>
  );
}

export function MediaPreview({ src, alt, viewCount, mediaType, topRight }: MediaPreviewProps) {
  const isVideo = mediaType === 'video';

  return (
    <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg bg-[#E8EEF6]">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="absolute left-4 top-4">
        <ViewCountBadge viewCount={viewCount} />
      </div>
      {topRight && <div className="absolute right-4 top-4">{topRight}</div>}
      {isVideo && (
        <div className="absolute inset-x-3 bottom-2 flex items-center gap-3 text-xs-custom font-medium text-white">
          <span>0:16</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/45">
            <div className="h-full w-1/3 rounded-full bg-btn-primary" />
          </div>
          <span>30:00</span>
        </div>
      )}
    </div>
  );
}

export default MediaPreview;
