import React, { useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import CalendarModal from '@/components/ui/CalendarModal';
import { dashboardServices, type DashboardStat } from '@/services/dashboardServices';

type DateRange = {
  from?: string;
  to?: string;
  label: string;
};

const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const resolveDateRange = (range: { start: Date | null; end: Date | null; label: string }): DateRange => {
  const today = new Date();

  if (range.label === 'Last 7 days') {
    return { from: formatDateParam(getPastDate(6)), to: formatDateParam(today), label: range.label };
  }

  if (range.label === 'Last 14 days') {
    return { from: formatDateParam(getPastDate(13)), to: formatDateParam(today), label: range.label };
  }

  if (range.label === 'Last 30 days') {
    return { from: formatDateParam(getPastDate(29)), to: formatDateParam(today), label: range.label };
  }

  if (range.label === 'Last 3 months') {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return { from: formatDateParam(start), to: formatDateParam(today), label: range.label };
  }

  if (range.label === 'Last 12 months') {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    return { from: formatDateParam(start), to: formatDateParam(today), label: range.label };
  }

  if (range.start) {
    const end = range.end ?? range.start;
    return {
      from: formatDateParam(range.start),
      to: formatDateParam(end),
      label: range.end
        ? `${formatDateParam(range.start)} to ${formatDateParam(range.end)}`
        : formatDateParam(range.start),
    };
  }

  return { label: 'All time' };
};

const formatMetric = (value: number) => {
  if (value >= 1000000) return `${Number((value / 1000000).toFixed(2))}M`;
  if (value >= 1000) return `${Number((value / 1000).toFixed(2))}K`;
  return String(value);
};

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

const buildCard = (title: string, stat: DashboardStat, valueSuffix?: string) => ({
  title,
  value: formatMetric(stat.total),
  valueSuffix,
  change: formatChange(stat.changePercent),
  weeklyNew: `${formatMetric(stat.weeklyNew)} New this week`,
  monthlyNew: `${formatMetric(stat.monthlyNew)} New this month`,
});

const emptyStat: DashboardStat = {
  total: 0,
  weeklyNew: 0,
  monthlyNew: 0,
  changePercent: 0,
};

const Dashboard: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({ label: 'All time' });
  const [stats, setStats] = useState({
    totalUsers: emptyStat,
    totalVerifiedReporters: emptyStat,
    totalWatchHours: emptyStat,
    totalNewsReported: emptyStat,
    totalCampaigns: emptyStat,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await dashboardServices.getStats({
          from: selectedRange.from,
          to: selectedRange.to,
        });

        if (isMounted && response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard stats');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [selectedRange.from, selectedRange.to]);

  const cardsData = useMemo(
    () => [
      buildCard('Total Users', stats.totalUsers),
      buildCard('Total Verified Reporters', stats.totalVerifiedReporters),
      buildCard('Total Watch Hours', stats.totalWatchHours, 'hrs'),
      buildCard('Total News Reported', stats.totalNewsReported),
      buildCard('Total Campaigns', stats.totalCampaigns),
    ],
    [stats]
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-poppins text-md-custom font-medium text-text-secondary">
              Dashboard
            </h1>
            <p className="mt-1 font-poppins text-sm-custom font-medium text-text-secondary">
              {selectedRange.label}
            </p>
          </div>

          <button
            ref={calendarBtnRef}
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-btn-primary"
            aria-label="Open date picker"
            aria-expanded={isCalendarOpen}
          >
            <img
              src="/icons/calendarIcon.svg"
              alt="Calendar"
              className="h-[22px] w-[22px] object-contain brightness-0 invert"
            />
          </button>
        </div>

        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          onApply={(range) => setSelectedRange(resolveDateRange(range))}
          anchorRef={calendarBtnRef}
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-poppins text-sm-custom font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cardsData.slice(0, 3).map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={isLoading ? '...' : card.value}
              valueSuffix={card.valueSuffix}
              change={isLoading ? '0%' : card.change}
              weeklyNew={isLoading ? 'Loading...' : card.weeklyNew}
              monthlyNew={isLoading ? 'Loading...' : card.monthlyNew}
              chartIconPath="/icons/chart.svg"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cardsData.slice(3, 5).map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={isLoading ? '...' : card.value}
              change={isLoading ? '0%' : card.change}
              weeklyNew={isLoading ? 'Loading...' : card.weeklyNew}
              monthlyNew={isLoading ? 'Loading...' : card.monthlyNew}
              chartIconPath="/icons/chart.svg"
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
