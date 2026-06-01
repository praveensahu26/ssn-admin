import CategoryTags, { CategoryBadge } from '@/components/details/CategoryTags';
import DescriptionSection from '@/components/details/DescriptionSection';
import LocationInfo from '@/components/details/LocationInfo';
import MediaPreview from '@/components/details/MediaPreview';
import MoreActionButton from '@/components/details/MoreActionButton';
import UserMiniProfile from '@/components/details/UserMiniProfile';
import CampaignProgress from '@/components/campaigns/CampaignProgress';
import FundraisingTeam from '@/components/campaigns/FundraisingTeam';

interface CampaignInfoProps {
  campaign: {
    mediaUrl: string;
    mediaType?: string;
    viewCount: string;
    postTime: string;
    title: string;
    description: string;
    location: string;
    categories?: string | string[];
    amountGoal: string;
    raisedAmount: string;
    donationCount: string;
    fundraisingTeam?: Array<{
      profilePic: string;
      name: string;
      amountRaised: string;
    }>;
  };
  author: {
    name: string;
    profilePicture?: string;
  };
}

function getMainCategory(categories?: string | string[]) {
  if (!categories) return undefined;

  return Array.isArray(categories) ? categories[0] : categories;
}

function formatPostTime(postTime: string) {
  return postTime.toLowerCase().includes('ago') ? postTime : `${postTime} ago`;
}

export function CampaignInfo({ campaign, author }: CampaignInfoProps) {
  const mainCategory = getMainCategory(campaign.categories);

  return (
    <div>
      <MediaPreview
        src={campaign.mediaUrl}
        alt={campaign.title}
        viewCount={campaign.viewCount}
        mediaType={campaign.mediaType}
        topRight={mainCategory ? <CategoryBadge category={mainCategory} /> : undefined}
      />

      <div className="mt-4 flex items-start justify-between gap-4">
        <UserMiniProfile
          image={author.profilePicture}
          name={author.name}
          meta={formatPostTime(campaign.postTime)}
        />
        <MoreActionButton label="Delete Campaign" />
      </div>

      <h1 className="mt-1 text-md-custom font-medium leading-6 text-text-primary">{campaign.title}</h1>

      <div className="mt-3">
        <CampaignProgress
          raisedAmount={campaign.raisedAmount}
          donationCount={campaign.donationCount}
          amountGoal={campaign.amountGoal}
        />
      </div>

      <div className="mt-3 space-y-5">
        <DescriptionSection>{campaign.description}</DescriptionSection>
        <LocationInfo location={campaign.location} />
        <CategoryTags categories={campaign.categories} />
        <FundraisingTeam members={campaign.fundraisingTeam} />
      </div>
    </div>
  );
}

export default CampaignInfo;
