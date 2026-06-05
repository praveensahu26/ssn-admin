import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  title: string;
  message: string;
  actionLabel: string;
  time: string; // e.g. "2h" or "02, Sep"
  icon: 'alert' | 'user' | 'megaphone';
}

interface NotificationGroup {
  label: string; // "Today" | "This week" | etc.
  items: Notification[];
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const NOTIFICATIONS: NotificationGroup[] = [
  {
    label: 'Today',
    items: [
      {
        id: 1,
        title: 'Reported Content Alert',
        message: 'A post has been reported for inappropriate content. Review it now.',
        actionLabel: 'View Post',
        time: '2h',
        icon: 'alert',
      },
      {
        id: 2,
        title: 'New Reporter Registration',
        message: 'A new reporter has signed up and is awaiting verification.',
        actionLabel: 'View reporter',
        time: '2h',
        icon: 'user',
      },
      {
        id: 3,
        title: 'Fake News Flagged',
        message: 'A news article has been flagged for misinformation. Please verify.',
        actionLabel: 'View Post',
        time: '2h',
        icon: 'alert',
      },
    ],
  },
  {
    label: 'This week',
    items: [
      {
        id: 4,
        title: 'Campaign Approval Request',
        message: 'A new campaign is awaiting admin approval.',
        actionLabel: 'View Campaign',
        time: '02, Sep',
        icon: 'megaphone',
      },
    ],
  },
];

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

const iconMap: Record<Notification['icon'], React.FC> = {
  alert: AlertIcon,
  user: UserIcon,
  megaphone: MegaphoneIcon,
};

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  anchorRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
          {NOTIFICATIONS.map((group, gi) => (
            <div key={gi}>
              {/* Group label */}
              <div className="px-4 py-2 sm:px-5">
                <span className="text-xs-custom font-medium text-text-secondary font-poppins">
                  {group.label}
                </span>
              </div>

              {/* Items */}
              {group.items.map((notif, ni) => {
                const IconComp = iconMap[notif.icon];
                return (
                  <div key={notif.id}>
                    <div className="flex items-start gap-3 px-4 py-3 sm:px-5">
                      {/* Icon bubble */}
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#DCE5EF] bg-[#F4F7FC] sm:h-10 sm:w-10">
                        <IconComp />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-md-custom font-medium text-text-primary font-poppins leading-snug">
                            {notif.title}
                          </span>
                          <span className="text-xs-custom text-text-secondary font-poppins flex-shrink-0 mt-0.5">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-sm-custom text-text-secondary font-poppins leading-snug mt-0.5">
                          {notif.message}
                        </p>
                        <button className="text-sm-custom text-btn-primary font-medium font-poppins mt-1 underline">
                          {notif.actionLabel}
                        </button>
                      </div>
                    </div>

                    {/* Divider — not after last item in last group */}
                    {!(gi === NOTIFICATIONS.length - 1 && ni === group.items.length - 1) && (
                      <div className="mx-4 border-b border-[#DCE5EF] sm:mx-5" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="border-t border-[#DCE5EF] px-4 py-3 sm:px-5">
          <button className="flex items-center gap-1.5 text-md-custom font-medium text-text-primary font-poppins">
            Load more
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
