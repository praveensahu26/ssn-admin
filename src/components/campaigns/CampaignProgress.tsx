import { campaignStatusColors } from '@/components/campaigns/CampaignStatusBadge';

interface CampaignProgressProps {
  raisedAmount: string;
  donationCount: string;
  amountGoal: string;
  status?: string;
}

function parseAmount(value: string) {
  const amount = String(value ?? '').replace(/[^0-9.]/g, '');
  return Number(amount) || 0;
}

function formatAmount(value: string) {
  const amount = parseAmount(value);
  return `$${amount.toLocaleString('en-US')}`;
}

function getProgressPercentage(status: string, raised: number, goal: number) {
  if (status === 'completed') return 100;
  if (status === 'requested') return 0;
  if (!goal) return 0;

  return Math.max(0, Math.min(100, (raised / goal) * 100));
}

function getRaisedDisplay(status: string, raisedAmount: string, amountGoal: string) {
  if (status === 'completed') return formatAmount(amountGoal);
  if (status === 'requested') return '$0';

  return formatAmount(raisedAmount);
}

export function CampaignProgress({ raisedAmount, donationCount, amountGoal, status }: CampaignProgressProps) {
  const normalizedStatus = status?.toLowerCase() ?? 'active';
  const color = campaignStatusColors[normalizedStatus] ?? campaignStatusColors.active;
  const raised = parseAmount(raisedAmount);
  const goal = parseAmount(amountGoal);
  const percentage = getProgressPercentage(normalizedStatus, raised, goal);
  const raisedDisplay = getRaisedDisplay(normalizedStatus, raisedAmount, amountGoal);
  const goalDisplay = formatAmount(amountGoal);

  return (
    <div className="space-y-2">
      <div className="h-2 overflow-hidden rounded-full bg-[#EAF2FB]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm-custom font-medium leading-4 text-text-secondary">
        <div className="flex items-center gap-2">
          <span>{raisedDisplay}</span>
          <span className="h-1 w-1 rounded-full bg-[#8E8E93]" />
          <span>{donationCount}</span>
        </div>
        <span className="text-text-primary">{goalDisplay}</span>
      </div>
    </div>
  );
}

export default CampaignProgress;
