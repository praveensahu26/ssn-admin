const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'requested', label: 'Campaign Requests' },
  { id: 'suspended', label: 'Suspended' },
];

export function CampaignTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`h-[44px] rounded-lg border px-5 font-poppins text-md-custom font-medium transition-colors ${
              isActive
                ? 'border-btn-primary bg-btn-primary text-white'
                : 'border-[#DCE5EF] bg-white text-text-secondary'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default CampaignTabs;
