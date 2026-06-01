import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CampaignInfo from '@/components/campaigns/CampaignInfo';
import WordsOfSupportPanel from '@/components/campaigns/WordsOfSupportPanel';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import { slugifyProfileName } from '@/utils/profileRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dummyData is a plain JS module with no type declarations
import { reporters as initialReporters } from '@/dummyData/dummyData';

interface CampaignDetails {
  id: string;
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
  wordsOfSupport: Array<{
    userProfilePic: string;
    userName: string;
    donatedAmount: string;
    words: string;
  }>;
}

interface ReporterDetails {
  name: string;
  profilePicture?: string;
  campaigns?: CampaignDetails[];
}

export function ReporterCampaignDetails() {
  const { username, campaignId } = useParams<{ username: string; campaignId: string }>();

  const reporter = useMemo(
    () =>
      (initialReporters as ReporterDetails[]).find(
        (item) => slugifyProfileName(item.name) === username
      ),
    [username]
  );
  const campaign = reporter?.campaigns?.find((item) => item.id === campaignId);

  return (
    <MainLayout>
      {reporter && campaign ? (
        <DetailsLayout
          left={
            <>
              <DetailsHeader title={`Reporters / ${reporter.name} / Campaigns`} />
              <CampaignInfo campaign={campaign} author={reporter} />
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

export default ReporterCampaignDetails;
