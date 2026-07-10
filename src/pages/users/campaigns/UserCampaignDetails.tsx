import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CampaignInfo from '@/components/campaigns/CampaignInfo';
import WordsOfSupportPanel from '@/components/campaigns/WordsOfSupportPanel';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import { accountServices } from '@/services/accountServices';
import { getRelativeTime } from '@/utils/relativeTime';

export function UserCampaignDetails() {
  const { id } = useParams<{ username: string; id: string }>();

  const [campaign, setCampaign] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [wordsOfSupport, setWordsOfSupport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);

        const [campaignRes, supportRes] = await Promise.all([
          accountServices.getCampaignDetails(id),
          accountServices.getCampaignSupport(id, { limit: 100 }),
        ]);

        const rawCampaign = campaignRes.data?.campaign;
        if (!rawCampaign) {
          throw new Error('Campaign not found');
        }

        setAuthor({
          name: rawCampaign.organizer?.name || 'Unknown Organizer',
          profilePicture: rawCampaign.organizer?.avatar || undefined,
        });

        setCampaign({
          id: rawCampaign.id,
          mediaUrl: rawCampaign.attachments?.[0]?.url || '',
          mediaType: rawCampaign.attachments?.[0]?.type || 'image',
          media: rawCampaign.attachments || [],
          viewCount: String(rawCampaign.viewsCount || 0),
          postTime: getRelativeTime(rawCampaign.createdAt),
          title: rawCampaign.caption || '',
          status: rawCampaign.status || 'active',
          description: rawCampaign.description || '',
          location: rawCampaign.location || 'Unknown',
          categories: rawCampaign.category?.name || 'General',
          amountGoal: String(rawCampaign.goalAmount || 0),
          raisedAmount: String(rawCampaign.raisedAmount || 0),
          donationCount: String(rawCampaign.donationsCount || 0),
        });

        setWordsOfSupport(
          (supportRes.data?.results || []).map((donation: any) => ({
            userProfilePic: donation.donor?.avatar || '',
            userName: donation.donor?.name || 'Anonymous',
            donatedAmount: `$${donation.amount || 0}`,
            words: donation.message || '',
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load campaign details');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center rounded-lg border border-[#DCE5EF] bg-white px-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
        </div>
      </MainLayout>
    );
  }

  if (error || !campaign || !author) {
    return (
      <MainLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-lg font-semibold text-red-700">
          {error || 'Campaign not found'}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailsLayout
        left={
          <>
            <DetailsHeader title={`Users / ${author.name} / Campaigns`} />
            <CampaignInfo campaign={campaign} author={author} />
          </>
        }
        right={<WordsOfSupportPanel messages={wordsOfSupport} />}
      />
    </MainLayout>
  );
}

export default UserCampaignDetails;
