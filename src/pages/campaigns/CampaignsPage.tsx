import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import CampaignCard from '@/components/campaigns/CampaignCard';
import CampaignTabs from '@/components/campaigns/CampaignTabs';
import {
  adminCampaignServices,
  type AdminCampaign,
  type CampaignStats,
  type CampaignTab,
} from '@/services/adminCampaignServices';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** The API uses 'requests' for pending campaigns; the UI uses 'requested'. */
function uiTabToApiTab(tab: UiCampaignTab): CampaignTab {
  if (tab === 'requested') return 'requests';
  if (tab === 'overview') return 'overview';
  return tab as CampaignTab;
}

function formatAmount(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

function mapApiCampaignToCard(campaign: AdminCampaign) {
  // The server uses 'pending' internally; map it to 'requested' for the UI.
  const status = campaign.status === 'pending' ? 'requested' : campaign.status;
  return {
    id: campaign._id,
    mediaUrl: campaign.attachments?.[0]?.url ?? '',
    mediaType: campaign.attachments?.[0]?.type ?? 'image',
    viewCount: String(campaign.viewsCount ?? 0),
    postTime: new Date(campaign.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status,
    postedBy: {
      name: campaign.organizer?.name ?? 'Unknown',
      profilePic: campaign.organizer?.avatar ?? undefined,
    },
    title: campaign.caption ?? '',
    amountGoal: String(campaign.goalAmount ?? 0),
    raisedAmount: String(campaign.raisedAmount ?? 0),
    categories: campaign.categories?.map((c) => c.name) ?? [],
  };
}

// ─── Types ───────────────────────────────────────────────────────────────────

type UiCampaignTab = 'overview' | 'active' | 'completed' | 'requested' | 'suspended';
const uiCampaignTabs: UiCampaignTab[] = ['overview', 'active', 'completed', 'requested', 'suspended'];

function isUiCampaignTab(value: string | null): value is UiCampaignTab {
  return Boolean(value && uiCampaignTabs.includes(value as UiCampaignTab));
}

// ─── Component ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export function CampaignsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<UiCampaignTab>(() => {
    const tab = searchParams.get('tab');
    return isUiCampaignTab(tab) ? tab : 'overview';
  });

  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ── Load stats (overview tab only) ─────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'overview') return;

    let cancelled = false;
    setIsLoadingStats(true);

    adminCampaignServices
      .getCampaignStats()
      .then((res) => {
        if (!cancelled) setStats(res.data?.stats ?? null);
      })
      .catch(() => {
        // Stats failure is non-fatal; keep showing whatever we had.
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStats(false);
      });

    return () => { cancelled = true; };
  }, [activeTab]);

  // ── Load campaigns ─────────────────────────────────────────────────────────
  const fetchCampaigns = useCallback(
    async (tab: UiCampaignTab, nextPage: number, append: boolean) => {
      setIsLoadingCampaigns(true);
      setError(null);

      try {
        const apiTab = uiTabToApiTab(tab);
        const res = await adminCampaignServices.listCampaigns({
          tab: apiTab,
          page: nextPage,
          limit: PAGE_SIZE,
        });

        const incoming = res.data?.campaigns ?? [];
        setCampaigns((prev) => (append ? [...prev, ...incoming] : incoming));
        setTotalPages(res.meta?.totalPages ?? 1);
        setPage(nextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaigns');
      } finally {
        setIsLoadingCampaigns(false);
      }
    },
    []
  );

  // Re-fetch when tab changes (from URL)
  useEffect(() => {
    const tab = searchParams.get('tab');
    const nextTab = isUiCampaignTab(tab) ? tab : 'overview';
    setActiveTab(nextTab);
    setCampaigns([]);
    fetchCampaigns(nextTab, 1, false);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    fetchCampaigns(activeTab, 1, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  const hasMore = page < totalPages;

  useEffect(() => {
    if (!hasMore || isLoadingCampaigns) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          fetchCampaigns(activeTab, page + 1, true);
        }
      },
      { rootMargin: '240px 0px' }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoadingCampaigns, activeTab, page, fetchCampaigns]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleTabChange(tab: UiCampaignTab) {
    setActiveTab(tab);
    setCampaigns([]);
    setSearchParams(tab === 'overview' ? {} : { tab });
  }

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const campaignStatCards = useMemo(() => {
    if (!stats) return [];

    const pctChange = (current: number, weekly: number): string => {
      if (current === 0) return '+0%';
      const pct = Math.round((weekly / current) * 100);
      return `+${pct}%`;
    };

    return [
      {
        title: 'Total Campaigns',
        value: formatCount(stats.totalCampaigns),
        change: pctChange(stats.totalCampaigns, stats.newThisWeek),
        weeklyNew: `${stats.newThisWeek.toLocaleString()} New this week`,
        monthlyNew: `${stats.newThisMonth.toLocaleString()} New this month`,
      },
      {
        title: 'Active Campaigns',
        value: formatCount(stats.activeCampaigns),
        change: pctChange(stats.activeCampaigns, stats.activeNewThisWeek),
        weeklyNew: `${stats.activeNewThisWeek.toLocaleString()} New this week`,
        monthlyNew: `${stats.activeNewThisMonth.toLocaleString()} New this month`,
      },
      {
        title: 'Complete Campaigns',
        value: formatCount(stats.completedCampaigns),
        change: pctChange(stats.completedCampaigns, stats.completedNewThisWeek),
        weeklyNew: `${stats.completedNewThisWeek.toLocaleString()} New this week`,
        monthlyNew: `${stats.completedNewThisMonth.toLocaleString()} New this month`,
      },
    ];
  }, [stats]);

  const mappedCampaigns = useMemo(() => campaigns.map(mapApiCampaignToCard), [campaigns]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <CampaignTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {isLoadingStats && !stats ? (
              <div className="col-span-3 text-center text-sm-custom text-text-secondary">
                Loading stats…
              </div>
            ) : (
              campaignStatCards.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  weeklyNew={stat.weeklyNew}
                  monthlyNew={stat.monthlyNew}
                  chartIconPath="/icons/chart.svg"
                />
              ))
            )}
          </div>
        )}

        <section>
          <h1 className="font-poppins text-md-custom font-medium text-text-secondary">
            All Campaigns
          </h1>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {!error && mappedCampaigns.length > 0 && (
            <>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {mappedCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    detailsHref={`/campaigns/${campaign.id}`}
                  />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex h-12 items-center justify-center text-sm-custom font-medium text-text-secondary"
                >
                  {isLoadingCampaigns ? 'Loading campaigns…' : ''}
                </div>
              )}
            </>
          )}

          {!error && !isLoadingCampaigns && mappedCampaigns.length === 0 && (
            <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-[#DCE5EF] bg-white px-6 text-center text-md-custom font-medium text-text-secondary">
              No campaigns are available in this tab.
            </div>
          )}

          {isLoadingCampaigns && mappedCampaigns.length === 0 && (
            <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-[#DCE5EF] bg-white text-sm-custom font-medium text-text-secondary">
              Loading campaigns…
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default CampaignsPage;
