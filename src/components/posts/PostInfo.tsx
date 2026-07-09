import CategoryTags from '@/components/details/CategoryTags';
import DescriptionSection from '@/components/details/DescriptionSection';
import LocationInfo from '@/components/details/LocationInfo';
import MediaPreview from '@/components/details/MediaPreview';
import MoreActionButton from '@/components/details/MoreActionButton';
import StatsActionBar from '@/components/details/StatsActionBar';
import UserMiniProfile from '@/components/details/UserMiniProfile';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface PostInfoProps {
  post: {
    mediaUrl: string;
    mediaType?: string;
    media?: MediaItem[];
    viewCount: string;
    postTime: string;
    title: string;
    likeCount: string;
    commentCount: string;
    shareCount: string;
    description: string;
    location: string;
    categories?: string[];
  };
  author: {
    name: string;
    profilePicture?: string;
  };
  onShowLikes: () => void;
  onShowComments: () => void;
  onDelete?: () => void;
}

export function PostInfo({ post, author, onShowLikes, onShowComments, onDelete }: PostInfoProps) {
  return (
    <div>
      <MediaPreview
        src={post.mediaUrl}
        alt={post.title}
        viewCount={post.viewCount}
        mediaType={post.mediaType}
        media={post.media}
      />

      <div className="mt-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm-custom font-medium text-text-secondary">
          <img src="/icons/profile/Hot.svg" alt="" className="h-5 w-5 object-contain" />
          <span className="font-medium text-text-primary">Trending</span>
          <div className="bg-[#8E8E93] w-1 h-1  rounded-full"></div>
          <span>{post.postTime} </span>
        </div>
        <MoreActionButton
          items={[
            {
              label: 'Delete Post',
              icon: '/icons/table/delete.svg',
              onClick: onDelete,
            },
          ]}
        />
      </div>

      <h1 className="mt-1 text-md-custom font-medium leading-6 text-text-primary">{post.title}</h1>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <UserMiniProfile
          image={author.profilePicture}
          name={author.name}
        />
        <StatsActionBar
          items={[
            { label: 'Likes', value: post.likeCount, icon: '/icons/profile/like.svg', onClick: onShowLikes },
            { label: 'Comments', value: post.commentCount, icon: '/icons/profile/comment.svg', onClick: onShowComments },
            { label: 'Shares', value: post.shareCount, icon: '/icons/profile/share.svg' },
          ]}
        />
      </div>

      <div className="mt-5 space-y-5">
        <DescriptionSection>{post.description}</DescriptionSection>
        <LocationInfo location={post.location} />
        <CategoryTags categories={post.categories} />
      </div>
    </div>
  );
}

export default PostInfo;
