import React from 'react';
import StatCard from '@/components/dashboard/StatCard';

interface AccountsOverviewProps {
  role: 'user' | 'reporter';
}

export const AccountsOverview: React.FC<AccountsOverviewProps> = ({ role }) => {
  const isReporter = role === 'reporter';
  const labelSuffix = isReporter ? 'Reporters' : 'Users';

  const cardsData = [
    {
      title: `Total ${labelSuffix}`,
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: `Active ${labelSuffix}`,
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: `Blocked ${labelSuffix}`,
      value: '8M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardsData.map((card, idx) => (
        <StatCard
          key={idx}
          title={card.title}
          value={card.value}
          change={card.change}
          weeklyNew={card.weeklyNew}
          monthlyNew={card.monthlyNew}
          chartIconPath="/icons/chart.svg"
        />
      ))}
    </div>
  );
};

export default AccountsOverview;
