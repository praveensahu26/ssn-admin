import { useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import CampaignCard from '@/components/campaigns/CampaignCard';
import CampaignTabs from '@/components/campaigns/CampaignTabs';
import globalCampaigns from '@/dummyData/globalCampaignsData';
import { applyCampaignDisplayStatuses } from '@/utils/campaignStatus';

const campaignStats = [
  {
    title: 'Total Campaigns',
    value: '8.08M',
    change: '+5%',
    weeklyNew: '708 New this week',
    monthlyNew: '8080 New this month',
  },
  {
    title: 'Active Campaigns',
    value: '8.08M',
    change: '+5%',
    weeklyNew: '708 New this week',
    monthlyNew: '8080 New this month',
  },
  {
    title: 'Complete Campaigns',
    value: '8M',
    change: '+5%',
    weeklyNew: '708 New this week',
    monthlyNew: '8080 New this month',
  },
];

const PAGE_SIZE = 8;

type CampaignTab = 'overview' | 'active' | 'completed' | 'requested' | 'suspended';

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
  amountGoal: string;
  raisedAmount: string;
  categories: string[];
}

const campaignsData = globalCampaigns as GlobalCampaign[];

export function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<CampaignTab>('overview');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const campaignsWithStatuses = useMemo(
    () => applyCampaignDisplayStatuses(campaignsData),
    []
  );

  const filteredCampaigns = useMemo(() => {
    if (activeTab === 'overview') return campaignsWithStatuses;

    return campaignsWithStatuses.filter((campaign) => campaign.status === activeTab);
  }, [activeTab, campaignsWithStatuses]);

  const visibleCampaigns = filteredCampaigns.slice(0, visibleCount);
  const hasMoreCampaigns = visibleCount < filteredCampaigns.length;

  function handleTabChange(tab: CampaignTab) {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  }

  useEffect(() => {
    if (!hasMoreCampaigns) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + PAGE_SIZE, filteredCampaigns.length)
          );
        }
      },
      { rootMargin: '240px 0px' }
    );

    const loadMoreElement = loadMoreRef.current;

    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [filteredCampaigns.length, hasMoreCampaigns]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <CampaignTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {campaignStats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                weeklyNew={stat.weeklyNew}
                monthlyNew={stat.monthlyNew}
                chartIconPath="/icons/chart.svg"
              />
            ))}
          </div>
        )}

        <section>
          <h1 className="font-poppins text-md-custom font-medium text-text-secondary">
            All Campaigns
          </h1>

          {visibleCampaigns.length ? (
            <>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {visibleCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    detailsHref={`/campaigns/${campaign.id}`}
                  />
                ))}
              </div>

              {hasMoreCampaigns && (
                <div
                  ref={loadMoreRef}
                  className="flex h-12 items-center justify-center text-sm-custom font-medium text-text-secondary"
                >
                  Loading campaigns...
                </div>
              )}
            </>
          ) : (
            <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-[#DCE5EF] bg-white px-6 text-center text-md-custom font-medium text-text-secondary">
              No campaigns are available in this tab.
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default CampaignsPage;
