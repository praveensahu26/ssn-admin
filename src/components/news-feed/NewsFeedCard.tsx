import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export interface NewsFeedPost {
  id: string;
  mediaUrl: string;
  mediaType?: string;
  viewCount: string;
  postTime: string;
  title: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
  authorName: string;
  authorImage?: string;
  category?: string;
  detailsPath: string;
  isFlagged?: boolean;
  reportCount?: number;
}

interface NewsFeedCardProps {
  post: NewsFeedPost;
  showViewBadge?: boolean;
  onDelete?: (id: string) => void;
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

function formatTime(postTime: string) {
  return postTime.toLowerCase().includes('ago') ? postTime : `${postTime} ago`;
}

function getTitlePreview(title: string) {
  const maxLength = 62;

  if (title.length <= maxLength) {
    return { text: title, isTruncated: false };
  }

  return {
    text: `${title.slice(0, maxLength).trim()}...`,
    isTruncated: true,
  };
}

function ThreeDotMenu({ onDelete }: { onDelete?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="More actions"
        className="flex h-7 w-7 items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
      >
        <img src="/icons/table/dots.svg" alt="" className="h-6 w-6 object-contain" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-20 w-[180px] rounded-xl border border-[#DCE5EF] bg-white p-2 shadow-card">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-md-custom font-medium text-text-secondary"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete?.();
            }}
          >
            <img src="/icons/table/delete.svg" alt="" className="h-8 w-8 object-contain" />
            <span>Delete Post</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function NewsFeedCard({ post, showViewBadge = false, onDelete }: NewsFeedCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const showAuthorImage = post.authorImage && !imgError;
  const titlePreview = getTitlePreview(post.title);
  const openPostDetails = () => navigate(post.detailsPath);

  return (
    <article
      role="button"
      tabIndex={0}
      className="overflow-hidden rounded-xl border border-[#DCE5EF] bg-white cursor-pointer hover:shadow-sm transition-shadow"
      onClick={openPostDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPostDetails();
        }
      }}
    >
      <div className="relative aspect-[1.45/1] overflow-hidden bg-[#E8EEF6]">
        <img src={post.mediaUrl} alt={post.title} className="h-full w-full object-cover" />

        {/* Badges container */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
          {showViewBadge && (
            <div className="flex h-6 items-center gap-1 rounded-full bg-[#334155]/70 px-2 text-xs-custom font-medium leading-none text-white">
              <img src="/icons/profile/view.svg" alt="views" className="h-4 w-4 brightness-0 invert" />
              <span>{post.viewCount}</span>
            </div>
          )}
          {post.isFlagged && (
            <div className="flex h-6 items-center gap-1 rounded-full bg-red-600/90 px-2.5 text-xs-custom font-semibold leading-none text-white border border-red-500">
              Flagged
            </div>
          )}
          {post.reportCount !== undefined && post.reportCount > 0 && (
            <div className="flex h-6 items-center gap-1 rounded-full bg-orange-600/90 px-2.5 text-xs-custom font-semibold leading-none text-white border border-orange-500">
              Reported ({post.reportCount})
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm-custom font-medium leading-4 text-text-secondary">
            <img src="/icons/profile/Hot.svg" alt="" className="h-5 w-5 object-contain" />
            <span className="truncate">Trending</span>
            <div className="bg-[#8E8E93] w-1 h-1  rounded-full"></div>
            <span className="truncate">{formatTime(post.postTime)}</span>
          </div>
          <ThreeDotMenu onDelete={onDelete ? () => onDelete(post.id) : undefined} />
        </div>

        <h2 className="mt-3 min-h-[45px] text-md-custom font-medium leading-5 text-text-primary">
          {titlePreview.text}
          {titlePreview.isTruncated && (
            <button
              type="button"
              className="ml-1 align-baseline text-md-custom font-medium text-text-secondary underline-offset-2 underline hover:text-btn-primary"
              onClick={(event) => {
                event.stopPropagation();
                openPostDetails();
              }}
            >
              more
            </button>
          )}
        </h2>

        <div className="mt-4 flex flex-col items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {showAuthorImage ? (
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="h-7 w-7 shrink-0 rounded-full border border-[#F1F5F9] object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] text-sm-custom font-medium text-text-secondary">
                {getInitials(post.authorName)}
              </div>
            )}
            <span className="truncate text-sm-custom font-medium leading-4 text-text-secondary">{post.authorName}</span>
          </div>

          <div className="flex shrink-0 ml-1 items-center gap-2 text-sm-custom font-medium leading-4 text-text-secondary">
            <span className="flex items-center gap-1">
              <img src="/icons/profile/like.svg" alt="likes" className="h-4 w-4 object-contain" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <img src="/icons/profile/comment.svg" alt="comments" className="h-4 w-4 object-contain" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <img src="/icons/profile/share.svg" alt="shares" className="h-4 w-4 object-contain" />
              {post.shareCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsFeedCard;
