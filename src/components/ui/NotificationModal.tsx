import { ChevronDown } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { notificationServices, type AppNotification, type NotificationType } from '@/services/notificationServices';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationIcon = 'alert' | 'user' | 'megaphone';

interface NotificationGroup {
  label: string;
  items: AppNotification[];
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

// ─── Type → copy/icon/route mapping ────────────────────────────────────────────

const NOTIFICATION_META: Partial<
  Record<NotificationType, { title: string; icon: NotificationIcon; actionLabel: string; buildMessage: (n: AppNotification) => string; getPath?: (n: AppNotification) => string | null }>
> = {
  admin_report_post: {
    title: 'Reported Content Alert',
    icon: 'alert',
    actionLabel: 'View Post',
    buildMessage: (n) => `A post has been reported${n.data.message ? ` for ${n.data.message}` : ''}. Review it now.`,
    getPath: (n) => (n.data.newsId ? `${ROUTES.newsFeed}/${n.data.newsId}` : null),
  },
  admin_report_campaign: {
    title: 'Reported Campaign Alert',
    icon: 'megaphone',
    actionLabel: 'View Campaign',
    buildMessage: (n) => `A campaign has been reported${n.data.message ? ` for ${n.data.message}` : ''}. Review it now.`,
    getPath: (n) => (n.data.campaignId ? `${ROUTES.campaigns}/${n.data.campaignId}` : null),
  },
  admin_report_profile: {
    title: 'Reported Profile Alert',
    icon: 'user',
    actionLabel: 'View Profile',
    buildMessage: (n) => `A profile has been reported${n.data.message ? ` for ${n.data.message}` : ''}. Review it now.`,
    getPath: () => `${ROUTES.reports}?tab=profiles`,
  },
  admin_reporter_signup: {
    title: 'New Reporter Registration',
    icon: 'user',
    actionLabel: 'View Reporters',
    buildMessage: () => 'A new reporter has signed up and is awaiting verification.',
    getPath: () => ROUTES.reporters,
  },
};

const DEFAULT_META = {
  title: 'Notification',
  icon: 'alert' as NotificationIcon,
  actionLabel: '',
  buildMessage: (n: AppNotification) => n.data.message || '',
  getPath: () => null,
};

const getMeta = (type: NotificationType) => NOTIFICATION_META[type] || DEFAULT_META;

// ─── Icon Components ──────────────────────────────────────────────────────────

const AlertIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A7A8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const UserIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A7A8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MegaphoneIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A7A8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);

const iconMap: Record<NotificationIcon, React.FC> = {
  alert: AlertIcon,
  user: UserIcon,
  megaphone: MegaphoneIcon,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h`;

  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};

const groupNotifications = (items: AppNotification[]): NotificationGroup[] => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

  const today: AppNotification[] = [];
  const thisWeek: AppNotification[] = [];
  const earlier: AppNotification[] = [];

  items.forEach((item) => {
    const createdAt = new Date(item.createdAt);
    if (createdAt >= startOfToday) {
      today.push(item);
    } else if (createdAt >= weekAgo) {
      thisWeek.push(item);
    } else {
      earlier.push(item);
    }
  });

  return [
    { label: 'Today', items: today },
    { label: 'This week', items: thisWeek },
    { label: 'Earlier', items: earlier },
  ].filter((group) => group.items.length > 0);
};

// ─── Component ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadPage = useCallback(async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const response = await notificationServices.list({ page: pageToLoad, limit: PAGE_LIMIT });
      const items = response.data?.notifications || [];
      setNotifications((prev) => (pageToLoad === 1 ? items : [...prev, ...items]));
      setPage(pageToLoad);
      setHasMore(response.meta ? pageToLoad < response.meta.totalPages : false);
    } catch {
      // Silently ignore — the bell just stays empty rather than breaking the layout.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPage(1);
    }
  }, [isOpen, loadPage]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current && !modalRef.current.contains(target) &&
        !(anchorRef?.current && anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const groups = groupNotifications(notifications);

  const handleAction = async (notification: AppNotification) => {
    const meta = getMeta(notification.type);
    if (!notification.read) {
      notificationServices.markAsRead(notification.id).catch(() => {});
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    }
    const path = meta.getPath?.(notification);
    if (path) {
      onClose();
      navigate(path);
    }
  };

  return (
    <>
      {/* Invisible backdrop */}
      <div className="fixed inset-0 z-40" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="fixed right-3 z-50 w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-xl border border-[#DCE5EF] bg-white shadow-card sm:right-6 sm:w-[380px] lg:right-[30px] lg:w-[457px]"
        style={{
          top: '78px',
        }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2 sm:px-5">
          <h2 className="text-[18px] font-medium text-text-primary font-poppins">
            Notifications
          </h2>
        </div>

        {/* Notification list */}
        <div className="no-scrollbar max-h-[420px] overflow-y-auto sm:max-h-[480px]">
          {groups.length === 0 && !isLoading && (
            <p className="px-4 py-6 text-center text-sm-custom text-text-secondary font-poppins sm:px-5">
              No notifications yet.
            </p>
          )}

          {groups.map((group, gi) => (
            <div key={group.label}>
              {/* Group label */}
              <div className="px-4 py-2 sm:px-5">
                <span className="text-xs-custom font-medium text-text-secondary font-poppins">
                  {group.label}
                </span>
              </div>

              {/* Items */}
              {group.items.map((notif, ni) => {
                const meta = getMeta(notif.type);
                const IconComp = iconMap[meta.icon];
                return (
                  <div key={notif.id}>
                    <div className={`flex items-start gap-3 px-4 py-3 sm:px-5 ${notif.read ? '' : 'bg-[#F4F7FC]/60'}`}>
                      {/* Icon bubble */}
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F4F7FC] sm:h-10 sm:w-10">
                        <IconComp />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-md-custom font-medium text-text-primary font-poppins leading-snug">
                            {meta.title}
                          </span>
                          <span className="text-xs-custom text-text-secondary font-poppins flex-shrink-0 mt-0.5">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm-custom text-text-secondary font-poppins leading-snug mt-0.5">
                          {meta.buildMessage(notif)}
                        </p>
                        {meta.actionLabel && (
                          <button
                            type="button"
                            className="text-sm-custom text-btn-primary font-medium font-poppins mt-1 underline"
                            onClick={() => handleAction(notif)}
                          >
                            {meta.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Divider — not after last item in last group */}
                    {!(gi === groups.length - 1 && ni === group.items.length - 1) && (
                      <div className="mx-4 border-b border-[#DCE5EF] sm:mx-5" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="border-t border-[#DCE5EF] px-4 py-3 sm:px-5">
            <button
              type="button"
              className="flex items-center gap-1.5 text-md-custom font-medium text-text-primary font-poppins disabled:opacity-50"
              onClick={() => loadPage(page + 1)}
              disabled={isLoading}
            >
              Load more
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationModal;
