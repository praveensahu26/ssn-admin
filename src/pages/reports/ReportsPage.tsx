import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ExternalLink, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable, { type ColumnConfig, type ActionConfig } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import { adminNewsServices, type ReportedNewsPost, type NewsReportsResponse } from '@/services/adminNewsServices';
import {
  adminCampaignServices,
  type ReportedCampaign,
  type CampaignReportsResponse,
} from '@/services/adminCampaignServices';
import { getRelativeTime } from '@/utils/relativeTime';

type Tab = 'posts' | 'campaigns';

const DismissIcon: React.FC<{ className?: string }> = ({ className }) => <X className={className} />;
const ViewIcon: React.FC<{ className?: string }> = ({ className }) => <Eye className={className} />;
const OpenIcon: React.FC<{ className?: string }> = ({ className }) => <ExternalLink className={className} />;

interface BreakdownState {
  kind: Tab;
  id: string;
  title: string;
  data: NewsReportsResponse | CampaignReportsResponse | null;
  isLoading: boolean;
}

export function ReportsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<ReportedNewsPost[]>([]);
  const [campaigns, setCampaigns] = useState<ReportedCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownState | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminNewsServices.listReportedNews({ page: 1, limit: 100 });
      setPosts(response.data?.posts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reported posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminCampaignServices.listReportedCampaigns({ page: 1, limit: 100 });
      setCampaigns(response.data?.campaigns ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reported campaigns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'posts') loadPosts();
    else loadCampaigns();
  }, [tab, loadPosts, loadCampaigns]);

  const openBreakdown = async (kind: Tab, id: string, title: string) => {
    setBreakdown({ kind, id, title, data: null, isLoading: true });
    try {
      const data =
        kind === 'posts'
          ? (await adminNewsServices.getNewsReports(id)).data
          : (await adminCampaignServices.getCampaignReports(id)).data;
      setBreakdown((prev) => (prev && prev.id === id ? { ...prev, data: data ?? null, isLoading: false } : prev));
    } catch {
      setBreakdown((prev) => (prev && prev.id === id ? { ...prev, isLoading: false } : prev));
    }
  };

  const handleDismiss = async (kind: Tab, id: string) => {
    try {
      if (kind === 'posts') {
        await adminNewsServices.dismissNewsReports(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        await adminCampaignServices.dismissCampaignReports(id);
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      }
      setBreakdown((prev) => (prev && prev.id === id ? null : prev));
    } catch {
      // Leave the row in place — the admin can retry the dismiss action.
    }
  };

  const postColumns: ColumnConfig<ReportedNewsPost>[] = [
    {
      key: 'caption',
      header: 'Post',
      render: (row) => (
        <div className="flex max-w-[280px] items-center gap-3">
          {row.media?.[0]?.url && (
            <img src={row.media[0].url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          )}
          <span className="truncate text-md-custom font-medium text-text-primary">{row.caption || 'Untitled post'}</span>
        </div>
      ),
    },
    { key: 'author', header: 'Author', render: (row) => row.author?.name || 'Unknown' },
    {
      key: 'reportCount',
      header: 'Reports',
      render: (row) => (
        <span className="rounded-md bg-red-50 px-2 py-1 text-sm-custom font-semibold text-red-600">
          {row.reportCount}
        </span>
      ),
    },
    { key: 'lastReportedAt', header: 'Last Reported', render: (row) => getRelativeTime(row.lastReportedAt) },
  ];

  const campaignColumns: ColumnConfig<ReportedCampaign>[] = [
    {
      key: 'caption',
      header: 'Campaign',
      render: (row) => (
        <div className="flex max-w-[280px] items-center gap-3">
          {row.attachments?.[0]?.url && (
            <img src={row.attachments[0].url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          )}
          <span className="truncate text-md-custom font-medium text-text-primary">{row.caption || 'Untitled campaign'}</span>
        </div>
      ),
    },
    { key: 'organizer', header: 'Organizer', render: (row) => row.organizer?.name || 'Unknown' },
    {
      key: 'reportCount',
      header: 'Reports',
      render: (row) => (
        <span className="rounded-md bg-red-50 px-2 py-1 text-sm-custom font-semibold text-red-600">
          {row.reportCount}
        </span>
      ),
    },
    { key: 'lastReportedAt', header: 'Last Reported', render: (row) => getRelativeTime(row.lastReportedAt) },
  ];

  const postActions: ActionConfig<ReportedNewsPost>[] = [
    { icon: ViewIcon, onClick: (row) => openBreakdown('posts', row.id, row.caption || 'Post'), tooltip: 'View report reasons' },
    { icon: OpenIcon, onClick: (row) => navigate(`${ROUTES.newsFeed}/${row.id}`), tooltip: 'Open post' },
    { icon: DismissIcon, onClick: (row) => handleDismiss('posts', row.id), tooltip: 'Dismiss reports' },
  ];

  const campaignActions: ActionConfig<ReportedCampaign>[] = [
    { icon: ViewIcon, onClick: (row) => openBreakdown('campaigns', row.id, row.caption || 'Campaign'), tooltip: 'View report reasons' },
    { icon: OpenIcon, onClick: (row) => navigate(`${ROUTES.campaigns}/${row.id}`), tooltip: 'Open campaign' },
    { icon: DismissIcon, onClick: (row) => handleDismiss('campaigns', row.id), tooltip: 'Dismiss reports' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="font-poppins text-md-custom font-medium text-text-secondary">Reports</h1>

        {/* Tabs */}
        <div className="flex gap-3">
          {(['posts', 'campaigns'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-11 rounded-lg border px-6 text-md-custom font-medium transition-colors font-poppins ${
                tab === t ? 'border-btn-primary bg-btn-primary text-white' : 'border-[#DCE5EF] bg-white text-text-secondary'
              }`}
            >
              {t === 'posts' ? 'Reported Posts' : 'Reported Campaigns'}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 font-poppins">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-[#DCE5EF] bg-white">
            <Spinner size={30} />
          </div>
        ) : tab === 'posts' ? (
          <DataTable
            title="Reported Posts"
            data={posts}
            columns={postColumns}
            actions={postActions}
            searchKeys={['caption']}
            searchPlaceholder="Search reported posts"
          />
        ) : (
          <DataTable
            title="Reported Campaigns"
            data={campaigns}
            columns={campaignColumns}
            actions={campaignActions}
            searchKeys={['caption']}
            searchPlaceholder="Search reported campaigns"
          />
        )}
      </div>

      {/* Report reason breakdown drawer */}
      <div className={`fixed inset-0 z-50 ${breakdown ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!breakdown}>
        <button
          type="button"
          aria-label="Close reports drawer backdrop"
          className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${
            breakdown ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setBreakdown(null)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Report reasons"
          className={`absolute right-0 top-0 flex h-full w-full max-w-[390px] flex-col bg-white shadow-card transition-transform duration-300 ease-out ${
            breakdown ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <header className="flex h-[67px] shrink-0 items-center justify-between border-b border-[#DCE5EF] px-6">
            <h2 className="truncate text-base-custom font-medium leading-5 text-text-primary">{breakdown?.title}</h2>
            <button
              type="button"
              aria-label="Close reports drawer"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] text-text-primary"
              onClick={() => setBreakdown(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {breakdown?.isLoading && (
              <div className="flex h-32 items-center justify-center">
                <Spinner size={24} />
              </div>
            )}

            {breakdown && !breakdown.isLoading && breakdown.data && (
              <>
                <p className="mb-4 text-sm-custom font-medium text-text-secondary">
                  {breakdown.data.totalReports} total reports
                </p>
                <div className="flex flex-col gap-2">
                  {breakdown.data.reasons.map((reason) => (
                    <div
                      key={reason.reason}
                      className="flex items-center justify-between rounded-lg border border-[#DCE5EF] px-4 py-3"
                    >
                      <span className="text-md-custom font-medium text-text-primary">{reason.reason}</span>
                      <span className="text-md-custom font-semibold text-text-secondary">{reason.count}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-btn-primary py-3 text-md-custom font-medium text-white"
                  onClick={() => breakdown && handleDismiss(breakdown.kind, breakdown.id)}
                >
                  Dismiss All Reports
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}

export default ReportsPage;
