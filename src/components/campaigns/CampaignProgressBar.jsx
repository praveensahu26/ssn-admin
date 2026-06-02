import { campaignStatusColors } from './CampaignStatusBadge';

export function CampaignProgressBar({ percentage = 0, status }) {
  const normalizedStatus = status?.toLowerCase() ?? 'active';
  const color = campaignStatusColors[normalizedStatus] ?? campaignStatusColors.active;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAF4FF]">
      <div
        className="h-full rounded-full"
        style={{ width: `${clampedPercentage}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default CampaignProgressBar;
