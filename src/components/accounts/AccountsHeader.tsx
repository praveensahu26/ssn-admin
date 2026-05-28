import React from 'react';

export type AccountTab =
  | 'overview'
  | 'all'
  | 'active'
  | 'inactive'
  | 'reported'
  | 'blocked'
  | 'suspended'
  | 'verification';

interface AccountsHeaderProps {
  role: 'user' | 'reporter';
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

export const AccountsHeader: React.FC<AccountsHeaderProps> = ({
  role,
  activeTab,
  onTabChange,
}) => {
  const isReporter = role === 'reporter';

  // Define the tabs dynamically
  const tabs: { id: AccountTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'all', label: isReporter ? 'All Reporters' : 'All Users' },
    { id: 'active', label: isReporter ? 'Active Reporters' : 'Active Users' },
    { id: 'inactive', label: isReporter ? 'In-active Reporters' : 'In-active Users' },
  ];

  // Add Verification Requests tab only for reporters
  if (isReporter) {
    tabs.push({ id: 'verification', label: 'Verification Requests' });
  }

  tabs.push(
    { id: 'reported', label: isReporter ? 'Reported Reporters' : 'Reported Users' },
    { id: 'blocked', label: isReporter ? 'Blocked Reporters' : 'Blocked Users' },
    { id: 'suspended', label: isReporter ? 'Suspended Reporters' : 'Suspended Users' }
  );

  return (
    <div className="flex flex-row flex-nowrap gap-2 mb-2 pb-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 px-3 py-3 rounded-lg font-medium text-md-custom font-poppins border ${isActive
              ? 'bg-btn-primary text-white border-btn-primary  transform scale-[1.02]'
              : 'bg-white text-text-secondary border-[#DCE5EF]'
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default AccountsHeader;
