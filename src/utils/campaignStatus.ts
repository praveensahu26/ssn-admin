const statusPattern = [
  'active',
  'active',
  'completed',
  'suspended',
  'active',
  'requested',
  'completed',
  'suspended',
];

export function applyCampaignDisplayStatus<T extends { status?: string }>(campaign: T, index: number) {
  return {
    ...campaign,
    status: statusPattern[index % statusPattern.length] ?? campaign.status ?? 'active',
  };
}

export function applyCampaignDisplayStatuses<T extends { status?: string }>(campaigns: T[]) {
  return campaigns.map((campaign, index) => applyCampaignDisplayStatus(campaign, index));
}
