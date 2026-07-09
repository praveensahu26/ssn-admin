import { useState } from 'react';
import type { ReactNode } from 'react';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaPreviewProps {
  src: string;
  alt: string;
  viewCount: string;
  mediaType?: string;
  media?: MediaItem[];
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

export function MediaPreview({ src, alt, viewCount, mediaType, media, topRight }: MediaPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleMedia = media && media.length > 1;
  
  const mediaItems = media && media.length > 0 ? media : [{ url: src, type: mediaType || 'image' }];
  const currentMedia = mediaItems[currentIndex] || mediaItems[0];
  const isVideo = currentMedia?.type === 'video';

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg bg-[#E8EEF6]">
      {isVideo ? (
        <video key={currentMedia?.url} src={currentMedia?.url} controls className="h-full w-full object-cover" />
      ) : (
        <img key={currentMedia?.url} src={currentMedia?.url} alt={alt} className="h-full w-full object-cover" />
      )}
      
      <div className="absolute left-4 top-4">
        <ViewCountBadge viewCount={viewCount} />
      </div>
      {topRight && <div className="absolute right-4 top-4">{topRight}</div>}
      
      {hasMultipleMedia && (
        <>
          {/* Navigation arrows */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {/* Media counter */}
          <div className="absolute bottom-3 right-3 flex h-6 items-center gap-1 rounded-full bg-black/50 px-2 text-xs-custom font-medium text-white">
            <span>{currentIndex + 1}/{mediaItems.length}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default MediaPreview;
