interface CampaignProgressProps {
  raisedAmount: string;
  donationCount: string;
  amountGoal: string;
}

function parseAmount(value: string) {
  const amount = value.match(/[\d,]+/)?.[0]?.replace(/,/g, '');
  return amount ? Number(amount) : 0;
}

export function CampaignProgress({ raisedAmount, donationCount, amountGoal }: CampaignProgressProps) {
  const raised = parseAmount(raisedAmount);
  const goal = parseAmount(amountGoal);
  const percentage = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="h-2 overflow-hidden rounded-full bg-[#EAF2FB]">
        <div className="h-full rounded-full bg-btn-primary" style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm-custom font-medium leading-4 text-text-secondary">
        <div className="flex items-center gap-2">
          <span>{raisedAmount}</span>
          <span className="h-1 w-1 rounded-full bg-[#8E8E93]" />
          <span>{donationCount}</span>
        </div>
        <span>{amountGoal}</span>
      </div>
    </div>
  );
}

export default CampaignProgress;
