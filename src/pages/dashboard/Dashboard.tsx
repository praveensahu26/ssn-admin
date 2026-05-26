import React, { useRef, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import CalendarModal from '@/components/ui/CalendarModal';

const Dashboard: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);

  const cardsData = [
    {
      title: 'Total Users',
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: 'Total Verified Reporters',
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: 'Total Watch Hours',
      value: '800',
      valueSuffix: 'hrs',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: 'Total News Reported',
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
    {
      title: 'Total Campaigns',
      value: '8.08M',
      change: '+5%',
      weeklyNew: '708 New this week',
      monthlyNew: '8080 New this month',
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-2">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-md-custom font-medium text-text-secondary font-poppins">
            Dashboard
          </h1>

          {/* Calendar Button */}
          <button
            ref={calendarBtnRef}
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="w-11 h-11 bg-btn-primary rounded-[10px] flex items-center justify-center"
            aria-label="Open date picker"
            aria-expanded={isCalendarOpen}
          >
            <img
              src="/icons/calendarIcon.svg"
              alt="Calendar"
              className="w-[22px] h-[22px] object-contain brightness-0 invert"
            />
          </button>
        </div>

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          anchorRef={calendarBtnRef}
        />

        {/* Row 1: 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cardsData.slice(0, 3).map((card, idx) => (
            <StatCard
              key={idx}
              title={card.title}
              value={card.value}
              valueSuffix={card.valueSuffix}
              change={card.change}
              weeklyNew={card.weeklyNew}
              monthlyNew={card.monthlyNew}
              chartIconPath="/icons/chart.svg"
            />
          ))}
        </div>

        {/* Row 2: 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsData.slice(3, 5).map((card, idx) => (
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;