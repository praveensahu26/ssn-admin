declare module '@/components/campaigns/CampaignCard' {
  import type { ComponentType } from 'react';

  interface CampaignAuthor {
    name: string;
    username?: string;
    profilePic?: string;
  }

  interface CampaignCardData {
    id: string;
    mediaUrl: string;
    viewCount: string;
    postTime: string;
    status: string;
    postedBy: CampaignAuthor;
    title: string;
    description?: string;
    location?: string;
    amountGoal: string;
    raisedAmount: string;
    donationCount?: string;
    categories: string[];
  }

  const CampaignCard: ComponentType<{
    campaign: CampaignCardData;
    detailsHref?: string;
  }>;
  export { CampaignCard };
  export default CampaignCard;
}

declare module '@/components/campaigns/CampaignTabs' {
  import type { ComponentType } from 'react';

  type CampaignTab = 'overview' | 'active' | 'completed' | 'requested' | 'suspended';

  const CampaignTabs: ComponentType<{
    activeTab: CampaignTab;
    onTabChange: (tab: CampaignTab) => void;
  }>;

  export { CampaignTabs };
  export default CampaignTabs;
}

declare module '@/components/campaigns/CampaignStatusBadge' {
  import type { ComponentType } from 'react';

  export const campaignStatusColors: Record<string, string>;

  const CampaignStatusBadge: ComponentType<{
    status?: string;
  }>;

  export { CampaignStatusBadge };
  export default CampaignStatusBadge;
}

declare module '@/dummyData/globalCampaignsData' {
  interface CampaignAuthor {
    name: string;
    username?: string;
    profilePic?: string;
  }

  interface GlobalCampaign {
    id: string;
    mediaUrl: string;
    viewCount: string;
    postTime: string;
    status: string;
    postedBy: CampaignAuthor;
    title: string;
    description: string;
    location: string;
    amountGoal: string;
    raisedAmount: string;
    donationCount: string;
    categories: string[];
    fundraisingTeam?: Array<{
      profilePic: string;
      name: string;
      amountRaised: string;
    }>;
    wordsOfSupport: Array<{
      userProfilePic: string;
      userName: string;
      donatedAmount: string;
      words: string;
    }>;
  }

  const campaigns: GlobalCampaign[];
  export { campaigns as globalCampaigns };
  export default campaigns;
}
