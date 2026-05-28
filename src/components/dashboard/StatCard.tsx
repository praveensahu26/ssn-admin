import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  valueSuffix?: string;
  change: string;
  weeklyNew: string;
  monthlyNew: string;
  chartIconPath?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  valueSuffix,
  change,
  weeklyNew,
  monthlyNew,
  chartIconPath = '/icons/chart.svg',
  className = '',
}) => {
  return (
    <div className={`bg-white w-full h-[206px] border border-[#DCE5EF] rounded-xl p-4 shadow-card flex flex-col justify-between ${className}`}>
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-subheading font-medium text-text-primary font-poppins">{title}</h3>
        <span className="bg-[#CBF5E5] text-[#176448] font-semibold text-sm-custom px-2.5 py-1 rounded-xl flex items-center justify-center font-poppins">
          {change}
        </span>
      </div>

      {/* Main Content (Value & Chart) */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-baseline">
          <span className="text-[40px] font-semibold text-text-primary tracking-tight font-poppins">{value}</span>
          {valueSuffix && (
            <span className="text-md-custom font-medium text-text-secondary ml-1 font-poppins">{valueSuffix}</span>
          )}
        </div>
        <div className="w-[200px] h-[80px] flex items-center justify-end">
          <img src={chartIconPath} alt="Sparkline graph" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col">
        <div className="text-sm-custom font-medium text-text-primary font-poppins">
          {weeklyNew}
        </div>
        <div className="text-sm-custom font-medium text-text-secondary font-poppins">
          {monthlyNew}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
