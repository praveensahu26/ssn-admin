export const campaignStatusColors = {
  active: '#007AFF',
  completed: '#0B8500',
  suspended: '#AF0900',
  requested: '#6A7A8C',
  rejected: '#AF0900',
};

const statusLabels = {
  active: 'Active',
  completed: 'Completed',
  suspended: 'Suspended',
  requested: 'Requested',
  rejected: 'Rejected',
};

export function CampaignStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() ?? 'active';
  const color = campaignStatusColors[normalizedStatus] ?? campaignStatusColors.active;
  const label = statusLabels[normalizedStatus] ?? statusLabels.active;

  return (
    <span
      className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 text-sm-custom font-medium leading-none"
      style={{
        borderColor: color,
        color,
        backgroundColor: `${color}14`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export default CampaignStatusBadge;
