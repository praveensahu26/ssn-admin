import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export interface ProfileCampaign {
  id: string;
  mediaUrl: string;
  viewCount: string;
  categories?: string | string[];
}

interface ProfileCampaignsGridProps {
  campaigns?: ProfileCampaign[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  getCampaignHref?: (campaign: ProfileCampaign) => string;
}

function getCampaignCategories(campaign: ProfileCampaign) {
  if (!campaign.categories) return [];

  return Array.isArray(campaign.categories) ? campaign.categories : [campaign.categories];
}

export function ProfileCampaignsGrid({
  campaigns = [],
  activeCategory,
  onCategoryChange,
  getCampaignHref,
}: ProfileCampaignsGridProps) {
  const categories = useMemo(
    () => Array.from(new Set(campaigns.flatMap(getCampaignCategories))),
    [campaigns]
  );
  const [internalActiveCategory, setInternalActiveCategory] = useState(categories[0] ?? 'All');
  const selectedCategory = activeCategory ?? internalActiveCategory;

  useEffect(() => {
    if (!categories.length) {
      setInternalActiveCategory('All');
      return;
    }

    if (!activeCategory && !categories.includes(internalActiveCategory)) {
      setInternalActiveCategory(categories[0] ?? 'All');
    }
  }, [activeCategory, categories, internalActiveCategory]);

  const visibleCampaigns = useMemo(() => {
    if (selectedCategory === 'All') return campaigns;

    return campaigns.filter((campaign) =>
      getCampaignCategories(campaign).includes(selectedCategory)
    );
  }, [campaigns, selectedCategory]);

  function handleCategoryChange(category: string) {
    setInternalActiveCategory(category);
    onCategoryChange?.(category);
  }

  if (!campaigns.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-base-custom font-medium leading-5 text-text-primary">Campaigns</h2>

      <div className="mt-4 flex w-full flex-wrap gap-1 rounded-lg border border-[#DCE5EF] bg-white p-1">
        {(categories.length ? categories : ['All']).map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`h-9 shrink-0 rounded-md px-4 text-sm-custom font-medium transition-colors ${
                isActive
                  ? 'bg-[#EAF4FF] text-btn-primary'
                  : 'bg-white text-text-secondary hover:bg-[#F8FAFC]'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visibleCampaigns.map((campaign) => {
          const campaignCategories = getCampaignCategories(campaign);
          const card = (
            <article className="relative aspect-[1.4/0.8] cursor-pointer overflow-hidden rounded-lg bg-[#F1F5F9]">
              <img
                src={campaign.mediaUrl}
                alt="Campaign media"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-2 top-2 flex h-6 items-center gap-1 rounded-full bg-black/35 px-2 text-xs-custom font-medium leading-none text-white">
                <img src="/icons/profile/view.svg" alt="views" className="h-4 w-4 brightness-0 invert" />
                <span>{campaign.viewCount}</span>
              </div>
              {campaignCategories[0] && (
                <div className="absolute right-2 top-2 max-w-[calc(100%-96px)] truncate rounded-full bg-black/35 px-3 py-1 text-xs-custom font-medium leading-4 text-white">
                  {campaignCategories[0]}
                </div>
              )}
            </article>
          );
          const href = getCampaignHref?.(campaign);

          return href ? (
            <Link key={campaign.id} to={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={campaign.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileCampaignsGrid;
