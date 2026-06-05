import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryTags, { CategoryBadge } from '@/components/details/CategoryTags';
import DescriptionSection from '@/components/details/DescriptionSection';
import LocationInfo from '@/components/details/LocationInfo';
import MediaPreview from '@/components/details/MediaPreview';
import MoreActionButton from '@/components/details/MoreActionButton';
import UserMiniProfile from '@/components/details/UserMiniProfile';
import CampaignProgress from '@/components/campaigns/CampaignProgress';
import FundraisingTeam from '@/components/campaigns/FundraisingTeam';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';
import SuspendCampaignDrawer from '@/components/campaigns/SuspendCampaignDrawer';
import { ROUTES } from '@/config/routes';

const campaignActionIcons = {
  message: '/icons/profile/message.svg',
  suspend: '/icons/profile/delete.svg',
  approve: '/icons/profile/approve.svg',
};

interface CampaignInfoProps {
  campaign: {
    mediaUrl: string;
    mediaType?: string;
    viewCount: string;
    postTime: string;
    title: string;
    status?: string;
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

function getCampaignActions(status: string | undefined, onSuspend: () => void) {
  const normalizedStatus = status?.toLowerCase() ?? 'active';
  const messageAction = {
    label: 'Message Organizer',
    icon: campaignActionIcons.message,
  };
  const suspendAction = {
    label: 'Suspend Campaign',
    icon: campaignActionIcons.suspend,
    onClick: onSuspend,
  };

  if (normalizedStatus === 'active') {
    return [messageAction, suspendAction];
  }

  if (normalizedStatus === 'requested') {
    return [
      {
        label: 'Approve Campaign',
        icon: campaignActionIcons.approve,
      },
      messageAction,
      suspendAction,
    ];
  }

  return [messageAction];
}

export function CampaignInfo({ campaign, author }: CampaignInfoProps) {
  const [isSuspendDrawerOpen, setIsSuspendDrawerOpen] = useState(false);
  const location = useLocation();
  const mainCategory = getMainCategory(campaign.categories);
  const campaignStatus = campaign.status ?? 'active';
  const showStatusBadge = location.pathname.startsWith(ROUTES.campaigns);

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
        <MoreActionButton
          items={getCampaignActions(campaignStatus, () => setIsSuspendDrawerOpen(true))}
        />
      </div>

      <h1 className="mt-1 text-md-custom font-medium leading-6 text-text-primary">{campaign.title}</h1>

      {showStatusBadge && (
        <div className="mt-2">
          <CampaignStatusBadge status={campaignStatus} />
        </div>
      )}

      <div className="mt-3">
        <CampaignProgress
          raisedAmount={campaign.raisedAmount}
          donationCount={campaign.donationCount}
          amountGoal={campaign.amountGoal}
          status={campaignStatus}
        />
      </div>

      <div className="mt-3 space-y-5">
        <DescriptionSection>{campaign.description}</DescriptionSection>
        <LocationInfo location={campaign.location} />
        <CategoryTags categories={campaign.categories} />
        <FundraisingTeam members={campaign.fundraisingTeam} />
      </div>

      <SuspendCampaignDrawer
        isOpen={isSuspendDrawerOpen}
        onClose={() => setIsSuspendDrawerOpen(false)}
      />
    </div>
  );
}

export default CampaignInfo;
