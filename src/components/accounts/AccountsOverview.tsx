import React, { useEffect, useMemo, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import {
  accountServices,
  type AccountStat,
  type AccountStats,
} from '@/services/accountServices';

interface AccountsOverviewProps {
  role: 'user' | 'reporter';
  refreshKey?: number;
}

const emptyStat: AccountStat = {
  total: 0,
  weeklyNew: 0,
  monthlyNew: 0,
  changePercent: 0,
};

const formatMetric = (value: number) => {
  if (value >= 1000000000) return `${Number((value / 1000000000).toFixed(2))}B`;
  if (value >= 1000000) return `${Number((value / 1000000).toFixed(2))}M`;
  if (value >= 1000) return `${Number((value / 1000).toFixed(2))}K`;
  return String(value);
};

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

const buildCard = (title: string, stat: AccountStat) => ({
  title,
  value: formatMetric(stat.total),
  change: formatChange(stat.changePercent),
  weeklyNew: `${formatMetric(stat.weeklyNew)} New this week`,
  monthlyNew: `${formatMetric(stat.monthlyNew)} New this month`,
});

export const AccountsOverview: React.FC<AccountsOverviewProps> = ({ role, refreshKey }) => {
  const isReporter = role === 'reporter';
  const labelSuffix = isReporter ? 'Reporters' : 'Users';
  const [stats, setStats] = useState<AccountStats>({
    total: emptyStat,
    active: emptyStat,
    blocked: emptyStat,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await accountServices.getStats(role);

        if (isMounted && response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : `Unable to load ${labelSuffix.toLowerCase()} stats`
          );
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
  }, [labelSuffix, role, refreshKey]);

  const cardsData = useMemo(
    () => [
      buildCard(`Total ${labelSuffix}`, stats.total),
      buildCard(`Active ${labelSuffix}`, stats.active),
      buildCard(`Blocked ${labelSuffix}`, stats.blocked),
    ],
    [labelSuffix, stats]
  );

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="font-poppins text-sm-custom rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cardsData.map(card => (
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
  );
};

export default AccountsOverview;
