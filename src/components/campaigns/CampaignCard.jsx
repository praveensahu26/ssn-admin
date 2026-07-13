import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignProgressBar from './CampaignProgressBar';
import CampaignStatusBadge from './CampaignStatusBadge';
import SuspendCampaignDrawer from './SuspendCampaignDrawer';
import { adminCampaignServices } from '@/services/adminCampaignServices';

const iconPaths = {
  eye: '/icons/profile/view.svg',
  dots: '/icons/profile/dots.svg',
  message: '/icons/profile/message.svg',
  delete: '/icons/profile/delete.svg',
  approve: '/icons/profile/approve.svg',
};

function getInitials(name) {
  if (!name) return '??';

  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function compactTime(postTime) {
  const normalized = postTime?.toLowerCase() ?? '1w';

  if (normalized.includes('hour')) return normalized.replace('hours', 'h').replace('hour', 'h');
  if (normalized.includes('day')) return normalized.replace('days', 'd').replace('day', 'd');
  if (normalized.includes('week')) return normalized.replace('weeks', 'w').replace('week', 'w');
  if (normalized.includes('month')) return normalized.replace('months', 'mo').replace('month', 'mo');
  if (normalized.includes('year')) return normalized.replace('years', 'y').replace('year', 'y');

  return normalized;
}

function parseAmount(amount) {
  const value = String(amount ?? '').replace(/[^0-9.]/g, '');
  return Number(value) || 0;
}

function formatAmount(amount) {
  const value = parseAmount(amount);
  return `$${value.toLocaleString('en-US')}`;
}

function getTitlePreview(title) {
  const maxLength = 40;

  if (!title || title.length <= maxLength) {
    return { text: title, isTruncated: false };
  }

  return { text: `${title.slice(0, maxLength).trim()}...`, isTruncated: true };
}

function getProgress(campaign) {
  const status = campaign.status?.toLowerCase();
  const raised = parseAmount(campaign.raisedAmount);
  const goal = parseAmount(campaign.amountGoal);

  if (status === 'completed') return 100;
  if (status === 'requested') return 0;
  if (!goal) return 0;

  return (raised / goal) * 100;
}

function getLeftAmount(campaign) {
  const status = campaign.status?.toLowerCase();

  if (status === 'completed') return formatAmount(campaign.amountGoal);
  if (status === 'requested') return '$0';

  return formatAmount(campaign.raisedAmount);
}

function getMenuItems(status) {
  const baseItems = [
    { label: 'View Campaign', icon: iconPaths.eye, action: 'view' },
    { label: 'Message Organizer', icon: iconPaths.message },
  ];

  if (status === 'requested' || status === 'pending') {
    return [
      baseItems[0],
      { label: 'Approve Campaign', icon: iconPaths.approve },
      baseItems[1],
      { label: 'Suspend Campaign', icon: iconPaths.delete, action: 'suspend' },
    ];
  }

  if (status === 'active') {
    return [...baseItems, { label: 'Suspend Campaign', icon: iconPaths.delete, action: 'suspend' }];
  }

  // completed / suspended — no suspend option
  return [...baseItems];
}

export function CampaignCard({ campaign, detailsHref }) {
  const attachments = campaign.attachments || [];
  const hasMultipleAttachments = attachments.length > 1;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSuspendDrawerOpen, setIsSuspendDrawerOpen] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(campaign.status?.toLowerCase() ?? 'active');
  const [profileError, setProfileError] = useState(false);
  const menuRef = useRef(null);
  const titlePreview = getTitlePreview(campaign.title);
  const status = currentStatus;
  const category = campaign.categories?.[0] ?? 'Campaign';
  const menuItems = getMenuItems(status);

  async function handleSuspend(payload) {
    if (!campaign.id) return;
    setIsSuspending(true);
    try {
      await adminCampaignServices.suspendCampaign(campaign.id, payload);
      setCurrentStatus('suspended');
      setIsSuspendDrawerOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to suspend campaign');
    } finally {
      setIsSuspending(false);
    }
  }
  const openCampaignDetails = () => {
    if (detailsHref) {
      navigate(detailsHref);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <article
      role={detailsHref ? 'button' : undefined}
      tabIndex={detailsHref ? 0 : undefined}
      className="overflow-visible rounded-xl border border-[#DCE5EF] bg-white"
      onClick={openCampaignDetails}
      onKeyDown={(event) => {
        if (!detailsHref) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCampaignDetails();
        }
      }}
    >
      <div className="relative aspect-[1.44/1] overflow-hidden rounded-t-xl bg-[#E8EEF6]">
        {campaign.mediaType === 'video' ? (
          <video src={campaign.mediaUrl} className="h-full w-full object-cover" />
        ) : (
          <img src={campaign.mediaUrl} alt={campaign.title} className="h-full w-full object-cover" />
        )}

        <div className="absolute left-3 top-3 flex h-6 items-center gap-1 rounded-full border border-[#505F70] bg-[#505F7094] px-2 text-sm-custom font-medium leading-none text-white">
          <img src={iconPaths.eye} alt="" className="h-5 w-5 brightness-0 invert" />
          <span>{campaign.viewCount}</span>
        </div>

        {hasMultipleAttachments && (
          <div className="absolute bottom-3 right-3 flex h-6 items-center gap-1 rounded-full bg-black/50 px-2 text-xs-custom font-medium text-white">
            <span>{attachments.length}</span>
          </div>
        )}

        <div className="absolute right-3 top-3 max-w-[calc(100%-90px)] truncate rounded-full border border-[#505F70] bg-[#505F7094] px-3 py-1 text-sm-custom font-medium leading-4 text-white">
          {category}
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-2 w-2`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {campaign.postedBy?.profilePic && !profileError ? (
              <img
                src={campaign.postedBy.profilePic}
                alt={campaign.postedBy.name}
                className="h-6 w-6 shrink-0 rounded-full border border-[#DCE5EF] object-cover"
                onError={() => setProfileError(true)}
              />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F1F5F9] text-xs-custom font-medium text-text-secondary">
                {getInitials(campaign.postedBy?.name)}
              </div>
            )}
            <span className="truncate text-sm-custom font-medium leading-4 text-text-secondary">
              {campaign.postedBy?.name}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#8E8E93]" />
            <span className="shrink-0 text-sm-custom font-medium leading-4 text-text-secondary">
              {compactTime(campaign.postTime)}
            </span>
          </div>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Campaign actions"
              aria-expanded={isMenuOpen}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((previous) => !previous);
              }}
            >
              <img src={iconPaths.dots} alt="" className="h-7 w-7 object-contain" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-20 w-[220px] rounded-xl border border-[#DCE5EF] bg-white px-3 py-3 shadow-card">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex h-9 w-full items-center gap-1 rounded-lg px-2 text-left text-md-custom font-medium text-text-secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsMenuOpen(false);

                      if (item.action === 'view') {
                        openCampaignDetails();
                      } else if (item.action === 'suspend') {
                        setIsSuspendDrawerOpen(true);
                      }
                    }}
                  >
                    <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-3 min-h-[42px] text-md-custom font-medium leading-5 text-text-primary">
          {titlePreview.text}
          {titlePreview.isTruncated && (
            <button
              type="button"
              className="ml-1 align-baseline text-md-custom font-medium text-text-secondary underline hover:text-btn-primary"
              onClick={(event) => {
                event.stopPropagation();
                openCampaignDetails();
              }}
            >
              more
            </button>
          )}
        </h2>

        <div className="mt-3">
          <CampaignStatusBadge status={status} />
        </div>

        <div className="mt-3">
          <CampaignProgressBar percentage={getProgress(campaign)} status={status} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-md-custom font-medium leading-4">
          <span className="truncate text-text-secondary">{getLeftAmount(campaign)}</span>
          <span className="shrink-0 text-text-primary">{formatAmount(campaign.amountGoal)}</span>
        </div>
      </div>

      <div onClick={(event) => event.stopPropagation()}>
        <SuspendCampaignDrawer
          isOpen={isSuspendDrawerOpen}
          onClose={() => setIsSuspendDrawerOpen(false)}
          onSubmit={handleSuspend}
          isSubmitting={isSuspending}
        />
      </div>
    </article>
  );
}

export default CampaignCard;
