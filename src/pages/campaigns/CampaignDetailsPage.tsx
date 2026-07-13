import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CampaignInfo from '@/components/campaigns/CampaignInfo';
import WordsOfSupportPanel from '@/components/campaigns/WordsOfSupportPanel';
import DetailsHeader from '@/components/details/DetailsHeader';
import DetailsLayout from '@/components/details/DetailsLayout';
import MainLayout from '@/components/layout/MainLayout';
import { accountServices } from '@/services/accountServices';
import {
  adminCampaignServices,
  type AdminCampaign,
  type SuspensionReason,
} from '@/services/adminCampaignServices';
import { getRelativeTime } from '@/utils/relativeTime';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapCampaign(raw: AdminCampaign) {
  // The server uses 'pending' internally; the UI calls it 'requested'.
  const status = raw.status === 'pending' ? 'requested' : raw.status;

  return {
    id: raw.id || raw._id,
    mediaUrl: raw.attachments?.[0]?.url ?? '',
    mediaType: raw.attachments?.[0]?.type ?? 'image',
    media: raw.attachments || [],
    viewCount: String(raw.viewsCount ?? 0),
    postTime: getRelativeTime(raw.createdAt),
    title: raw.caption ?? '',
    status,
    description: raw.description ?? '',
    location: raw.location ?? 'Unknown',
    categories: raw.categories?.map((c) => c.name) ?? [],
    amountGoal: String(raw.goalAmount ?? 0),
    raisedAmount: String(raw.raisedAmount ?? 0),
    donationCount: String(raw.donationsCount ?? 0),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [campaign, setCampaign] = useState<ReturnType<typeof mapCampaign> | null>(null);
  const [author, setAuthor] = useState<{ name: string; profilePicture?: string } | null>(null);
  const [wordsOfSupport, setWordsOfSupport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-action submitting flags
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);

        const [campaignRes, supportRes] = await Promise.all([
          adminCampaignServices.getCampaign(id),
          accountServices.getCampaignSupport(id, { limit: 100 }),
        ]);

        const rawCampaign = campaignRes.data?.campaign;
        if (!rawCampaign) throw new Error('Campaign not found');

        setAuthor({
          name: rawCampaign.organizer?.name ?? 'Unknown Organizer',
          profilePicture: rawCampaign.organizer?.avatar ?? undefined,
        });

        setCampaign(mapCampaign(rawCampaign));

        setWordsOfSupport(
          (supportRes.data?.supporters ?? []).map((donation: any) => ({
            userProfilePic: donation.donor?.avatar ?? '',
            userName: donation.donor?.name ?? 'Anonymous',
            donatedAmount: `$${donation.amount ?? 0}`,
            words: donation.message ?? '',
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

  // ── Action handlers ────────────────────────────────────────────────────────

  const handleApprove = useCallback(async () => {
    if (!id) return;
    setIsApproving(true);
    try {
      const res = await adminCampaignServices.approveCampaign(id);
      const updated = res.data?.campaign;
      if (updated) setCampaign(mapCampaign(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve campaign');
    } finally {
      setIsApproving(false);
    }
  }, [id]);

  const handleReject = useCallback(async (rejectionReason: string) => {
    if (!id) return;
    setIsRejecting(true);
    try {
      const res = await adminCampaignServices.rejectCampaign(id, rejectionReason);
      const updated = res.data?.campaign;
      if (updated) setCampaign(mapCampaign(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject campaign');
    } finally {
      setIsRejecting(false);
    }
  }, [id]);

  const handleSuspend = useCallback(
    async (payload: { suspensionReasons: SuspensionReason[]; suspensionNote?: string }) => {
      if (!id) return;
      setIsSuspending(true);
      try {
        const res = await adminCampaignServices.suspendCampaign(id, payload);
        const updated = res.data?.campaign;
        if (updated) setCampaign(mapCampaign(updated));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to suspend campaign');
      } finally {
        setIsSuspending(false);
      }
    },
    [id]
  );

  const handleComplete = useCallback(async () => {
    if (!id) return;
    setIsCompleting(true);
    try {
      const res = await adminCampaignServices.completeCampaign(id);
      const updated = res.data?.campaign;
      if (updated) setCampaign(mapCampaign(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete campaign');
    } finally {
      setIsCompleting(false);
    }
  }, [id]);

  // ── Render ─────────────────────────────────────────────────────────────────

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
            <DetailsHeader title={`Campaigns / ${author.name}`} />
            <CampaignInfo
              campaign={campaign}
              author={author}
              onApprove={handleApprove}
              onReject={handleReject}
              onSuspend={handleSuspend}
              onComplete={handleComplete}
              isApproving={isApproving}
              isRejecting={isRejecting}
              isSuspending={isSuspending}
              isCompleting={isCompleting}
            />
          </>
        }
        right={<WordsOfSupportPanel messages={wordsOfSupport} />}
      />
    </MainLayout>
  );
}

export default CampaignDetailsPage;
