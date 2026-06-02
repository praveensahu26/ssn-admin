import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CampaignInfo from '@/components/campaigns/CampaignInfo';
import WordsOfSupportPanel from '@/components/campaigns/WordsOfSupportPanel';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import globalCampaigns from '@/dummyData/globalCampaignsData';
import { applyCampaignDisplayStatuses } from '@/utils/campaignStatus';

interface GlobalCampaign {
  id: string;
  mediaUrl: string;
  mediaType?: string;
  viewCount: string;
  postTime: string;
  status: string;
  postedBy: {
    name: string;
    profilePic?: string;
  };
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
  wordsOfSupport: Array<{
    userProfilePic: string;
    userName: string;
    donatedAmount: string;
    words: string;
  }>;
}

const campaignsData = globalCampaigns as GlobalCampaign[];

export function CampaignDetailsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaigns = useMemo(() => applyCampaignDisplayStatuses(campaignsData), []);
  const campaign = campaigns.find((item) => item.id === campaignId);

  return (
    <MainLayout>
      {campaign ? (
        <DetailsLayout
          left={
            <>
              <DetailsHeader title={`Campaigns / ${campaign.postedBy.name}`} />
              <CampaignInfo
                campaign={campaign}
                author={{
                  name: campaign.postedBy.name,
                  profilePicture: campaign.postedBy.profilePic,
                }}
              />
            </>
          }
          right={<WordsOfSupportPanel messages={campaign.wordsOfSupport} />}
        />
      ) : (
        <div className="rounded-lg border border-[#DCE5EF] bg-white p-8 text-center text-lg font-semibold text-[#101828]">
          Campaign not found
        </div>
      )}
    </MainLayout>
  );
}

export default CampaignDetailsPage;
